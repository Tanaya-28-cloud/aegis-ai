// url.js — /api/check-url
// Orchestrates all 3 layers in sequence

const express = require("express")
const router = express.Router()
const { runRuleChecks } = require("../services/ruleEngine")
const { checkUrlWithAI } = require("../services/urlAIService")
const { checkWithSafeBrowsing } = require("../services/safeBrowsing")

router.post("/", async (req, res) => {
    const { url } = req.body

    if (!url || typeof url !== "string") {
        return res.status(400).json({ error: "url field is required" })
    }

    console.log("\n── New URL scan ─────────────────────────────")
    console.log("URL:", url)

    try {

        // ════════════════════════════════════════════════
        // LAYER 1 — Rule Engine (always runs, instant)
        // ════════════════════════════════════════════════
        console.log("Running Layer 1: Rule Engine...")
        const ruleResult = runRuleChecks(url)
        console.log("Layer 1 verdict:", ruleResult.verdict, "| Confidence:", ruleResult.confidence)

        // Layer 1 is confident — return immediately, no API calls needed
        if (ruleResult.rule_triggered && ruleResult.confidence >= 0.6) {
            console.log("Layer 1 decisive — returning result")
            return res.json({
                verdict: ruleResult.verdict,
                confidence: ruleResult.confidence,
                reasons: ruleResult.reasons,
                safe_to_preview: ruleResult.safe_to_preview,
                checked_by: "rule-engine"
            })
        }

        // ════════════════════════════════════════════════
        // LAYER 2 — HuggingFace BERT (runs if Layer 1 uncertain)
        // ════════════════════════════════════════════════
        console.log("Layer 1 uncertain — escalating to Layer 2: HuggingFace BERT...")
        const aiResult = await checkUrlWithAI(url)

        if (aiResult && aiResult.confidence >= 0.85) {
            console.log("Layer 2 decisive — returning result")
            // Merge any partial reasons from Layer 1
            return res.json({
                verdict: aiResult.verdict,
                confidence: aiResult.confidence,
                reasons: [
                    ...(ruleResult.reasons || []),
                    ...(aiResult.reasons || [])
                ],
                safe_to_preview: aiResult.safe_to_preview,
                checked_by: "ai-model"
            })
        }

        // ════════════════════════════════════════════════
        // LAYER 3 — Google Safe Browsing (edge cases only)
        // ════════════════════════════════════════════════
        console.log("Layer 2 uncertain — escalating to Layer 3: Google Safe Browsing...")
        const googleResult = await checkWithSafeBrowsing(url)

        if (googleResult) {
            console.log("Layer 3 result:", googleResult.verdict)
            return res.json({
                verdict: googleResult.verdict,
                confidence: googleResult.confidence,
                reasons: [
                    ...(ruleResult.reasons || []),
                    ...(aiResult?.reasons || []),
                    ...(googleResult.reasons || [])
                ],
                safe_to_preview: googleResult.safe_to_preview,
                checked_by: "google-safe-browsing"
            })
        }

        // ════════════════════════════════════════════════
        // FALLBACK — all layers unavailable, default to safe
        // ════════════════════════════════════════════════
        console.log("All layers exhausted — defaulting to safe")
        return res.json({
            verdict: "SAFE",
            confidence: 0.70,
            reasons: ruleResult.reasons || [],
            safe_to_preview: true,
            checked_by: "fallback"
        })

    } catch (err) {
        console.error("check-url fatal error:", err)
        res.status(500).json({ error: "Internal server error" })
    }
})

module.exports = router