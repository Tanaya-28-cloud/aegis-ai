export default function ResultCard({ result, type }) {
  const isUnsafe     = result.verdict === "FAKE" || result.verdict === "UNSAFE"
  const isSuspicious = result.verdict === "SUSPICIOUS"
  const isSafe       = !isUnsafe && !isSuspicious

  // ── Verdict label ──────────────────────────────────────────────────────────
  const verdictLabel =
    result.verdict === "FAKE"       ? "PHISHING_DETECTED"
    : result.verdict === "UNSAFE"   ? "UNSAFE_URL"
    : result.verdict === "SUSPICIOUS" ? "SUSPICIOUS"
    : "SAFE"

  // ── Colour set per verdict ─────────────────────────────────────────────────
  const color = isUnsafe
    ? "var(--cs-danger)"
    : isSuspicious
      ? "#f59e0b"        // amber
      : "var(--cs-primary)"

  const glow = isUnsafe
    ? "0 0 24px rgba(255,77,77,0.35)"
    : isSuspicious
      ? "0 0 24px rgba(245,158,11,0.35)"
      : "0 0 24px rgba(78,222,163,0.35)"

  const barColor = isUnsafe
    ? "var(--cs-danger)"
    : isSuspicious
      ? "#f59e0b"
      : "var(--cs-accent)"

  const barGlow = isUnsafe
    ? "0 0 8px rgba(255,77,77,0.4)"
    : isSuspicious
      ? "0 0 8px rgba(245,158,11,0.4)"
      : "0 0 8px var(--cs-accent-glow)"

  const confidencePct = Math.round(result.confidence * 100)

  const layerMap = {
    "rule-engine":             "// LAYER_01: RULE_ENGINE",
    "ai-model":                "// LAYER_02: AI_MODEL",
    "google-safe-browsing":    "// LAYER_03: SAFE_BROWSING",
    "fallback":                "// FALLBACK_MODE",
    "rule-engine-fallback":    "// RULE_ENGINE (ML offline)",
    "trusted-domain-whitelist":"// TRUSTED_DOMAIN",
    "huggingface-bert":        "// LAYER_02: HUGGINGFACE_BERT",
  }
  const checkedByLabel = result.checked_by
    ? layerMap[result.checked_by] || `// ${result.checked_by.toUpperCase()}`
    : null

  return (
    <div className="cyber-card animate-fade-up" style={{ marginTop: 24, maxWidth: 680 }}>

      {/* ── Verdict header ── */}
      <div style={{
        padding: "20px 24px",
        borderBottom: "1px solid var(--cs-border)",
        display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16,
      }}>
        <div>
          <p className="section-marker" style={{ marginBottom: 6 }}>
            // SCAN_RESULT
          </p>
          <h2 style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontStyle: "italic",
            fontSize: 32,
            fontWeight: 400,
            lineHeight: 1.1,
            color,
            textShadow: glow,
          }}>
            {verdictLabel}
          </h2>
        </div>

        {/* Confidence badge */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0
        }}>
          <span className="section-marker">// CONFIDENCE</span>
          <span style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontStyle: "italic",
            fontSize: 28,
            color,
          }}>
            {confidencePct}%
          </span>
        </div>
      </div>

      {/* ── Confidence bar ── */}
      <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--cs-border)" }}>
        <div style={{
          width: "100%",
          height: 2,
          background: "var(--cs-surface-highest)",
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            width: `${confidencePct}%`,
            background: barColor,
            transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)",
            boxShadow: barGlow,
          }} />
        </div>
        <p style={{
          marginTop: 6,
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 10,
          letterSpacing: "0.08em",
          color: "var(--cs-text-dim)",
        }}>
          MODEL CONFIDENCE SCORE
        </p>
      </div>

      {/* ── Reasons ── */}
      {result.reasons && result.reasons.length > 0 && (
        <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--cs-border)" }}>
          <p className="section-marker" style={{ marginBottom: 12 }}>
            // SIGNALS_DETECTED
          </p>
          <ul style={{ listStyle: "none" }}>
            {result.reasons.map((reason, i) => (
              <li key={i} className="cyber-row" style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{
                  color,
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 11,
                  marginTop: 1,
                  flexShrink: 0,
                }}>→</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "var(--cs-text-muted)", lineHeight: 1.5 }}>
                  {reason}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Precautions (email only) ── */}
      {type === "email" && result.precautions && result.precautions.length > 0 && (
        <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--cs-border)" }}>
          <p className="section-marker" style={{ marginBottom: 12 }}>
            // RECOMMENDED_ACTIONS
          </p>
          <ul style={{ listStyle: "none" }}>
            {result.precautions.map((p, i) => (
              <li key={i} className="cyber-row" style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ color: "var(--cs-primary)", fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, marginTop: 1, flexShrink: 0 }}>
                  //
                </span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "var(--cs-text-muted)", lineHeight: 1.5 }}>
                  {p}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── URL sandbox note ── */}
      {type === "url" && (
        <div style={{
          padding: "12px 24px",
          borderBottom: result.checked_by ? "1px solid var(--cs-border)" : "none",
          background: result.safe_to_preview ? "var(--cs-safe-dim)" : "var(--cs-surface-low)",
        }}>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 11,
            letterSpacing: "0.08em",
            color: result.safe_to_preview ? "var(--cs-primary)" : "var(--cs-text-dim)",
          }}>
            {result.safe_to_preview
              ? "→ SANDBOXED_PREVIEW_AVAILABLE_BELOW"
              : "→ PREVIEW_DISABLED — URL flagged as unsafe to render"}
          </span>
        </div>
      )}

      {/* ── Detection layer badge ── */}
      {checkedByLabel && (
        <div style={{ padding: "10px 24px", display: "flex", justifyContent: "flex-end" }}>
          <span className="status-badge" style={{ color: "var(--cs-text-dim)" }}>
            {checkedByLabel}
          </span>
        </div>
      )}

      {/* ── Note (e.g. ML offline) ── */}
      {result.note && (
        <div style={{
          padding: "10px 24px",
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 10,
          letterSpacing: "0.08em",
          color: "var(--cs-text-dim)",
          borderTop: "1px solid var(--cs-border)",
        }}>
          ⚠ {result.note.toUpperCase()}
        </div>
      )}
    </div>
  )
}