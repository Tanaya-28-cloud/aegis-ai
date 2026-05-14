// safeBrowsing.js
// Layer 3 — Google Safe Browsing API
// Only called when Layers 1 and 2 are both uncertain.
// Free: 10,000 requests/day. Checks against Google's live threat database.

const axios = require("axios")

async function checkWithSafeBrowsing(url) {
    const API_KEY = process.env.GOOGLE_SAFE_BROWSING_KEY

    if (!API_KEY) {
        console.warn("Layer 3 skipped — GOOGLE_SAFE_BROWSING_KEY not set")
        return null
    }

    try {
        const response = await axios.post(
            `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`,
            {
                client: {
                    clientId: "aegis-ai",
                    clientVersion: "1.0.0"
                },
                threatInfo: {
                    threatTypes: [
                        "MALWARE",
                        "SOCIAL_ENGINEERING",       // phishing falls here
                        "UNWANTED_SOFTWARE",
                        "POTENTIALLY_HARMFUL_APPLICATION"
                    ],
                    platformTypes: ["ANY_PLATFORM"],
                    threatEntryTypes: ["URL"],
                    threatEntries: [{ url }]
                }
            },
            { timeout: 5000 }
        )

        const matches = response.data.matches || []

        if (matches.length > 0) {
            const threatType = matches[0].threatType
                .replace(/_/g, " ")
                .toLowerCase()

            console.log(`Layer 3: Google flagged ${url} as ${threatType}`)

            return {
                verdict: "UNSAFE",
                confidence: 0.99,
                reasons: [
                    `Google Safe Browsing database flagged this URL as: ${threatType}`,
                    "This site appears in Google's real-time threat list"
                ],
                safe_to_preview: false,
                layer: "google-safe-browsing"
            }
        }

        // Not in Google's database — considered safe
        console.log(`Layer 3: Google cleared ${url}`)
        return {
            verdict: "SAFE",
            confidence: 0.92,
            reasons: [],
            safe_to_preview: true,
            layer: "google-safe-browsing"
        }

    } catch (err) {
        if (err.response?.status === 400) {
            console.error("Layer 3: Invalid API key or request format")
        } else if (err.response?.status === 429) {
            console.warn("Layer 3: Daily quota reached for Google Safe Browsing")
        } else {
            console.error("Layer 3 error:", err.message)
        }
        return null // fail open
    }
}

module.exports = { checkWithSafeBrowsing }