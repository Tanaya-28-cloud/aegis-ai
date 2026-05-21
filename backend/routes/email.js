// email.js — /api/check-email endpoint

const express = require("express")
const router = express.Router()
const axios = require("axios")

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:5000"

// ─── Expanded rule-based fallback ────────────────────────────────────────────
const PHISHING_PHRASES = [
    "urgent", "verify", "suspended", "click here", "confirm your",
    "limited time", "act now", "your account", "login immediately",
    "unusual activity", "security alert", "update your information",
    "account has been", "verify your identity", "will be closed",
    "dear customer", "dear user", "congratulations you", "you have won",
    "free gift", "claim now", "prize", "winner", "selected", "lottery",
    "wire transfer", "western union", "bank account", "credit card",
    "ssn", "social security", "tax refund", "irs", "unpaid invoice"
]

const SUSPICIOUS_SENDER_PATTERNS = [
    /no-?reply@(?!.*\.(com|org|net|gov|edu)$)/i, // noreply from random domain
    /@.*-.*-.*\./,                               // e.g. paypal-secure-login.com
    /\d{4,}@/,                                  // lots of numbers in address
    /@\d+\./,                                   // @123.xyz
]

function runEmailRules(sender, content) {
    const reasons = []
    let score = 0
    const lowerContent = content.toLowerCase()
    const lowerSender = sender.toLowerCase()

    // Check for phishing phrases in content
    const triggered = PHISHING_PHRASES.filter(w => lowerContent.includes(w))
    for (const phrase of triggered) {
        reasons.push(`Suspicious phrase detected: "${phrase}"`)
        score += 10
    }

    // Check sender patterns
    for (const pattern of SUSPICIOUS_SENDER_PATTERNS) {
        if (pattern.test(lowerSender)) {
            reasons.push(`Suspicious sender address pattern: ${sender}`)
            score += 25
            break
        }
    }

    // Check for urgency + link combo
    const hasUrgency = ["urgent", "immediately", "act now", "asap", "right away"].some(w => lowerContent.includes(w))
    const hasLink = lowerContent.includes("http") || lowerContent.includes("www.")
    if (hasUrgency && hasLink) {
        reasons.push("Email combines urgency language with a link — common phishing tactic")
        score += 20
    }

    // Excessive ALL CAPS
    const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length
    if (content.length > 100 && capsRatio > 0.4) {
        reasons.push("Email uses excessive capitalisation — common in spam/phishing")
        score += 10
    }

    // Mismatched brand in sender vs content (e.g. sender has paypal but content says amazon)
    const brands = ["paypal", "amazon", "google", "microsoft", "apple", "netflix", "bank", "chase"]
    const senderBrand = brands.find(b => lowerSender.includes(b))
    const contentBrands = brands.filter(b => lowerContent.includes(b))
    if (senderBrand && contentBrands.length > 0 && !contentBrands.includes(senderBrand)) {
        reasons.push(`Brand mismatch: sender claims to be "${senderBrand}" but email mentions ${contentBrands.join(", ")}`)
        score += 30
    }

    if (score >= 40) {
        return {
            verdict: "FAKE",
            confidence: Math.min(0.60 + score / 200, 0.96),
            reasons,
            precautions: [
                "Do not click any links in this email",
                "Verify with the sender through an official channel",
                "Report as phishing to your email provider",
                "Do not provide personal or financial information"
            ],
            checked_by: "rule-engine-fallback"
        }
    }

    if (score >= 15) {
        return {
            verdict: "SUSPICIOUS",
            confidence: parseFloat((0.40 + score / 200).toFixed(2)),
            reasons,
            precautions: [
                "Treat this email with caution",
                "Verify the sender before clicking any links"
            ],
            checked_by: "rule-engine-fallback"
        }
    }

    return {
        verdict: "SAFE",
        confidence: 0.65,
        reasons: [],
        precautions: [],
        note: "No strong indicators of phishing found (rule-based check only)",
        checked_by: "rule-engine-fallback"
    }
}

// ─── Route ────────────────────────────────────────────────────────────────────
router.post("/", async (req, res) => {
    const { sender, content } = req.body

    if (!sender || !content) {
        return res.status(400).json({
            error: "Both sender and content fields are required"
        })
    }

    try {
        // Attempt to call the Flask ML service
        const mlResponse = await axios.post(
            `${ML_SERVICE_URL}/predict/email`,
            { sender, content },
            { timeout: 8000 }
        )

        return res.json({
            ...mlResponse.data,
            checked_by: "ml-model"
        })

    } catch (err) {
        // ML service unavailable — use built-in rule engine
        if (err.code === "ECONNREFUSED" || err.code === "ECONNABORTED" || err.code === "ETIMEDOUT") {
            console.warn("ML service unavailable — using rule-based fallback for email check")
        } else {
            console.error("ML service error:", err.message)
        }

        const fallbackResult = runEmailRules(sender, content)
        return res.json(fallbackResult)
    }
})

module.exports = router