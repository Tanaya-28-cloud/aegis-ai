// urlAIService.js
// Layer 2 — HuggingFace BERT model fine-tuned on phishing URLs

const { HfInference } = require("@huggingface/inference")

const MODEL_ID = "ealvaradob/bert-finetuned-phishing"

// Well-known legitimate domains that the model sometimes
// misclassifies — we skip AI check for these
const TRUSTED_DOMAINS = [
    "google.com", "youtube.com", "facebook.com", "amazon.com",
    "wikipedia.org", "twitter.com", "instagram.com", "linkedin.com",
    "microsoft.com", "apple.com", "github.com", "stackoverflow.com",
    "reddit.com", "netflix.com", "yahoo.com", "bing.com",
    "outlook.com", "office.com", "live.com", "dropbox.com",
    "whatsapp.com", "zoom.us", "slack.com", "notion.so",
    "vercel.app", "railway.app", "heroku.com", "netlify.app",
    // Add these:
    "openai.com", "anthropic.com", "huggingface.co", "kaggle.com",
    "pytorch.org", "tensorflow.org", "arxiv.org", "medium.com",
    "dev.to", "npmjs.com", "pypi.org", "docker.com",
    "cloudflare.com", "aws.amazon.com", "azure.microsoft.com",
    "cloud.google.com", "digitalocean.com", "stripe.com",
    "shopify.com", "wordpress.com", "figma.com", "canva.com",
    "trello.com", "jira.atlassian.com", "confluence.atlassian.com",
    "hdfc.com", "hdfcbank.com", "icicibank.com", "sbi.co.in",
    "axisbank.com", "kotak.com", "paytm.com", "phonepe.com"
]
let hf = null

function getClient() {
    if (!hf) {
        if (!process.env.HUGGINGFACE_API_KEY) return null
        hf = new HfInference(process.env.HUGGINGFACE_API_KEY)
    }
    return hf
}

function isTrustedDomain(url) {
    try {
        const { hostname } = new URL(url)
        const clean = hostname.replace(/^www\./, "").toLowerCase()
        return TRUSTED_DOMAINS.some(
            trusted => clean === trusted || clean.endsWith("." + trusted)
        )
    } catch {
        return false
    }
}

async function checkUrlWithAI(url) {
    const client = getClient()

    if (!client) {
        console.warn("Layer 2 skipped — HUGGINGFACE_API_KEY not set")
        return null
    }

    // Skip AI check for well-known trusted domains
    // The model is overly aggressive on these
    if (isTrustedDomain(url)) {
        console.log(`Layer 2: ${url} is a trusted domain — marking SAFE without AI call`)
        return {
            verdict: "SAFE",
            confidence: 0.99,
            reasons: [],
            safe_to_preview: true,
            layer: "trusted-domain-whitelist"
        }
    }

    try {
        const result = await client.textClassification({
            model: MODEL_ID,
            inputs: url
        })

        const top = result[0]
        const isPhishing = top.label.toLowerCase() === "phishing"
        const confidence = parseFloat(top.score.toFixed(4))

        console.log(`Layer 2 result for ${url}: ${top.label} (${confidence})`)

        // Only trust the model when it's highly confident (>= 0.95)
        // Below this threshold we pass to Layer 3 instead of blocking
        if (isPhishing && confidence < 0.95) {
            console.log(`Layer 2: Low confidence phishing (${confidence}) — escalating to Layer 3`)
            return {
                verdict: "UNCERTAIN",
                confidence,
                reasons: [`AI model flagged URL with moderate confidence (${Math.round(confidence * 100)}%)`],
                safe_to_preview: false,
                layer: "huggingface-bert"
            }
        }

        return {
            verdict: isPhishing ? "UNSAFE" : "SAFE",
            confidence,
            reasons: isPhishing
                ? [
                    `AI model detected phishing pattern with ${Math.round(confidence * 100)}% confidence`,
                    "URL structure matches known phishing templates in training data"
                ]
                : [],
            safe_to_preview: !isPhishing,
            layer: "huggingface-bert"
        }

    } catch (err) {
        if (err.message?.includes("loading")) {
            console.warn("Layer 2: Model loading — skipping")
        } else if (err.message?.includes("rate limit")) {
            console.warn("Layer 2: Rate limit hit — skipping")
        } else {
            console.error("Layer 2 error:", err.message)
        }
        return null
    }
}

module.exports = { checkUrlWithAI }