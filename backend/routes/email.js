// email.js — /api/check-email endpoint

const express = require("express")
const router = express.Router()
const axios = require("axios")

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:5000"

router.post("/", async (req, res) => {
    const { sender, content } = req.body

    if (!sender || !content) {
        return res.status(400).json({
            error: "Both sender and content fields are required"
        })
    }

    try {
        // Call Tanaya's Flask ML service
        const mlResponse = await axios.post(
            `${ML_SERVICE_URL}/predict`,
            { sender, content },
            { timeout: 10000 }
        )

        return res.json(mlResponse.data)

    } catch (err) {
        console.error("ML service error:", err.message)

        // Fallback rule-based check if ML service is down
        const suspiciousWords = [
            "urgent", "verify", "suspended", "click here", "confirm your",
            "limited time", "act now", "your account", "login immediately",
            "unusual activity", "security alert"
        ]

        const lowerContent = content.toLowerCase()
        const triggered = suspiciousWords.filter(w => lowerContent.includes(w))

        if (triggered.length >= 2) {
            return res.json({
                verdict: "FAKE",
                confidence: 0.72,
                reasons: triggered.map(w => `Suspicious phrase detected: "${w}"`),
                precautions: [
                    "Do not click any links in this email",
                    "Verify with the sender via a different channel",
                    "Report as phishing to your email provider"
                ]
            })
        }

        return res.json({
            verdict: "SAFE",
            confidence: 0.65,
            reasons: [],
            precautions: [],
            note: "ML service unavailable — basic rule check only"
        })
    }
})

module.exports = router