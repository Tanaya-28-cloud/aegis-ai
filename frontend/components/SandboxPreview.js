import { useState, useEffect, useRef } from "react"
import axios from "axios"

export default function SandboxPreview({ url }) {
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState("")
  const [loaded, setLoaded]     = useState(false)
  const [blobUrl, setBlobUrl]   = useState(null)

  // ── Keep a ref to the current blob URL so we can always revoke it ──────────
  const blobUrlRef = useRef(null)

  // Revoke blob URL on unmount to prevent memory leak
  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current)
        blobUrlRef.current = null
      }
    }
  }, [])

  // Reset preview when the parent url prop changes
  useEffect(() => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
      blobUrlRef.current = null
      setBlobUrl(null)
    }
    setLoaded(false)
    setError("")
  }, [url])

  async function loadPreview() {
    setLoading(true)
    setError("")
    setLoaded(false)

    // Revoke previous blob URL before creating a new one
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
      blobUrlRef.current = null
      setBlobUrl(null)
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/sandbox-preview`,
        { url }
      )

      const html = response.data.html

      // Create blob with explicit UTF-8 charset so emoji/unicode always renders correctly
      const blob = new Blob([html], { type: "text/html;charset=utf-8" })
      const newBlobUrl = URL.createObjectURL(blob)

      blobUrlRef.current = newBlobUrl
      setBlobUrl(newBlobUrl)
      setLoaded(true)
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Could not load preview for this URL"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="cyber-card animate-fade-up" style={{ marginTop: 16, maxWidth: 680 }}>

      {/* ── Browser chrome header ── */}
      <div style={{
        padding: "10px 16px",
        borderBottom: "1px solid var(--cs-border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "var(--cs-surface-high)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="pulse-dot" />
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 10,
            letterSpacing: "0.1em",
            color: "var(--cs-primary)",
          }}>
            // AEGIS_SANDBOX_PREVIEW
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="status-badge">Scripts disabled</span>
          {/* Reload button when preview is already loaded */}
          {loaded && (
            <button
              onClick={loadPreview}
              title="Reload preview"
              style={{
                background: "none",
                border: "1px solid var(--cs-border)",
                cursor: "pointer",
                color: "var(--cs-text-dim)",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 10,
                letterSpacing: "0.08em",
                padding: "4px 8px",
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--cs-accent)"; e.currentTarget.style.color = "var(--cs-primary)" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--cs-border)"; e.currentTarget.style.color = "var(--cs-text-dim)" }}
            >
              ↺ RELOAD
            </button>
          )}
        </div>
      </div>

      {/* ── URL bar ── */}
      <div style={{
        padding: "8px 16px",
        borderBottom: "1px solid var(--cs-border)",
        display: "flex", alignItems: "center", gap: 8,
        background: "var(--cs-bg)",
      }}>
        <span style={{ color: "var(--cs-accent)", fontSize: 11 }}>🔒</span>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 11,
          color: "var(--cs-text-dim)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          letterSpacing: "0.04em",
        }}>
          {url}
        </span>
      </div>

      {/* ── Preview area ── */}
      <div style={{ minHeight: 256, background: "var(--cs-surface-low)", position: "relative" }}>

        {/* Not loaded yet */}
        {!loaded && !loading && !error && (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", height: 256, gap: 16, padding: 24,
          }}>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              color: "var(--cs-text-muted)",
              textAlign: "center",
              lineHeight: 1.6,
              maxWidth: 380,
            }}>
              This renders the website without executing any scripts, forms, or
              links. Completely isolated from your system.
            </p>
            <button onClick={loadPreview} className="btn-primary" style={{ padding: "10px 24px" }}>
              Load Safe Preview
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", height: 256, gap: 12,
          }}>
            <div style={{
              width: 28, height: 28,
              border: "2px solid var(--cs-border)",
              borderTopColor: "var(--cs-accent)",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }} />
            <span className="section-marker">// FETCHING_PAGE</span>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", minHeight: 256, gap: 12, padding: 24,
          }}>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 12,
              color: "var(--cs-danger)",
              letterSpacing: "0.08em",
              textAlign: "center",
              lineHeight: 1.6,
            }}>
              ⚠ {error}
            </span>
            <button onClick={loadPreview} style={{
              background: "none", border: "1px solid var(--cs-border)",
              cursor: "pointer", padding: "8px 16px",
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 11,
              color: "var(--cs-text-dim)", letterSpacing: "0.08em",
              transition: "border-color 0.2s",
            }}>
              TRY_AGAIN
            </button>
          </div>
        )}

        {/* ── Loaded iframe ── */}
        {/* blob: URLs from the same page are treated as same-origin by the sandbox,
            so we allow-same-origin so the injected HTML can load its own resources.
            Everything else (scripts, forms, popups, top-navigation) remains blocked. */}
        {loaded && blobUrl && (
          <iframe
            key={blobUrl}            /* force remount on new blob URL */
            src={blobUrl}
            style={{ width: "100%", height: 420, border: "none", display: "block" }}
            sandbox="allow-same-origin"
            title="Sandboxed website preview"
          />
        )}
      </div>

      {/* ── Safety notice ── */}
      <div style={{
        padding: "8px 16px",
        borderTop: "1px solid var(--cs-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        flexWrap: "wrap",
      }}>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 10,
          letterSpacing: "0.06em",
          color: "var(--cs-text-dim)",
        }}>
          // ALL_SCRIPTS_FORMS_AND_LINKS_DISABLED — YOUR_SYSTEM_IS_NOT_AT_RISK
        </span>
        {loaded && (
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 10,
            letterSpacing: "0.06em",
            color: "var(--cs-accent)",
          }}>
            ● LIVE
          </span>
        )}
      </div>
    </div>
  )
}