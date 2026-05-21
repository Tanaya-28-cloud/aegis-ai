import Head from "next/head"
import axios from "axios"
import { useState, useRef } from "react"
import ResultCard from "@/components/ResultCard"
import LoadingSkeleton from "@/components/LoadingSkeleton"
import SandboxPreview from "@/components/SandboxPreview"

const TIMEOUT_MS = 15000

export default function UrlChecker() {
    const [url, setUrl] = useState("")
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState("")
    const [timedOut, setTimedOut] = useState(false)
    const cancelRef = useRef(null)

    function handleChange(e) {
        setUrl(e.target.value)
        setError("")
        // Clear stale result when user edits the URL
        if (result) setResult(null)
        if (timedOut) setTimedOut(false)
    }

    function handleClear() {
        setUrl("")
        setResult(null)
        setError("")
        setTimedOut(false)
        if (cancelRef.current) cancelRef.current()
    }

    async function handleSubmit() {
        const trimmed = url.trim()
        if (!trimmed) {
            setError("Please enter a URL to check.")
            return
        }
        try {
            new URL(trimmed)
        } catch {
            setError("Please enter a valid URL including https:// or http://")
            return
        }

        setError("")
        setTimedOut(false)
        setLoading(true)
        setResult(null)

        // Front-end timeout signal
        const controller = new AbortController()
        cancelRef.current = () => controller.abort()
        const timer = setTimeout(() => {
            controller.abort()
            setTimedOut(true)
            setLoading(false)
        }, TIMEOUT_MS)

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/check-url`,
                { url: trimmed },
                { signal: controller.signal }
            )
            clearTimeout(timer)
            setResult(response.data)
        } catch (err) {
            clearTimeout(timer)
            if (err.name === "CanceledError" || err.code === "ERR_CANCELED") return // timeout handled above
            setError("Could not connect to server. Make sure the backend is running.")
        } finally {
            clearTimeout(timer)
            setLoading(false)
        }
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") handleSubmit()
    }

    return (
        <>
            <Head>
                <title>URL Safety Check — Aegis AI</title>
                <meta name="description" content="Check if any URL is safe before you visit it. 3-layer detection: Rule Engine, AI Model, and Google Safe Browsing." />
            </Head>

            <main style={{ minHeight: "100vh", background: "var(--cs-bg)" }} className="cyber-grid">
                <div className="scan-line" />
                <div style={{ height: 64 }} />

                <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px" }}>

                    {/* ── Page header ── */}
                    <div style={{ marginBottom: 40 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                            <div style={{ height: 1, flex: 1, background: "var(--cs-border)" }} />
                            <p className="section-marker">// URL_SAFETY_CHECK</p>
                            <div style={{ height: 1, flex: 1, background: "var(--cs-border)" }} />
                        </div>
                        <h1 style={{
                            fontFamily: "'Newsreader', Georgia, serif",
                            fontStyle: "italic",
                            fontSize: "clamp(32px, 5vw, 52px)",
                            fontWeight: 400,
                            color: "var(--cs-text)",
                            lineHeight: 1.1,
                            marginBottom: 12,
                        }}>
                            URL Safety Check
                        </h1>
                        <p style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 14,
                            color: "var(--cs-text-muted)",
                            lineHeight: 1.6,
                        }}>
                            Check if a website is safe before you visit it. 3-layer detection including
                            Google Safe Browsing.
                        </p>
                    </div>

                    {/* ── Form card ── */}
                    <div className="cyber-card animate-fade-up" style={{ padding: "32px" }}>

                        <label htmlFor="url-input" style={{
                            display: "block",
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: 10,
                            fontWeight: 600,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: "var(--cs-text-dim)",
                            marginBottom: 10,
                        }}>
                            // TARGET_URL
                        </label>

                        {/* URL input row */}
                        <div style={{ display: "flex", gap: 8, marginBottom: 20, alignItems: "center" }}>
                            <input
                                id="url-input"
                                type="url"
                                value={url}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                placeholder="https://example.com"
                                className={`cyber-input${error ? " error" : ""}`}
                                style={{ flex: 1 }}
                                aria-label="Enter URL to check"
                                aria-describedby={error ? "url-error" : undefined}
                            />
                            {/* Clear button — only visible when there's content */}
                            {url && (
                                <button
                                    onClick={handleClear}
                                    title="Clear"
                                    style={{
                                        background: "none",
                                        border: "1px solid var(--cs-border)",
                                        color: "var(--cs-text-dim)",
                                        cursor: "pointer",
                                        padding: "8px 12px",
                                        fontFamily: "'Space Grotesk', sans-serif",
                                        fontSize: 11,
                                        letterSpacing: "0.08em",
                                        flexShrink: 0,
                                        transition: "border-color 0.2s, color 0.2s",
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--cs-accent)"; e.currentTarget.style.color = "var(--cs-primary)" }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--cs-border)"; e.currentTarget.style.color = "var(--cs-text-dim)" }}
                                >
                                    ✕ CLEAR
                                </button>
                            )}
                        </div>

                        {/* Validation Error */}
                        {error && (
                            <div id="url-error" style={{
                                marginBottom: 20,
                                padding: "10px 16px",
                                border: "1px solid var(--cs-danger)",
                                background: "var(--cs-danger-dim)",
                            }}>
                                <span style={{
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontSize: 11,
                                    letterSpacing: "0.08em",
                                    color: "var(--cs-danger)",
                                }}>⚠ {error}</span>
                            </div>
                        )}

                        {/* Timeout warning */}
                        {timedOut && (
                            <div style={{
                                marginBottom: 20,
                                padding: "10px 16px",
                                border: "1px solid #f59e0b",
                                background: "rgba(245,158,11,0.08)",
                            }}>
                                <span style={{
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontSize: 11,
                                    letterSpacing: "0.08em",
                                    color: "#f59e0b",
                                }}>
                                    ⚠ SCAN_TIMEOUT — Server took too long to respond. Try again or check a different URL.
                                </span>
                            </div>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="btn-primary"
                            style={{ width: "100%" }}
                        >
                            {loading ? "// SCANNING..." : "Check URL"}
                        </button>
                    </div>

                    {/* ── Layer info strip ── */}
                    <div className="layer-strip" style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        borderTop: "1px solid var(--cs-border)",
                        marginTop: 16,
                    }}>
                        {[
                            { num: "01", label: "Rule Engine" },
                            { num: "02", label: "AI Model" },
                            { num: "03", label: "Safe Browsing" },
                        ].map(({ num, label }, i) => (
                            <div key={num} style={{
                                padding: "12px 16px",
                                borderRight: i < 2 ? "1px solid var(--cs-border)" : "none",
                                borderBottom: "1px solid var(--cs-border)",
                            }}>
                                <div style={{
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontSize: 9,
                                    fontWeight: 600,
                                    letterSpacing: "0.14em",
                                    color: "var(--cs-accent)",
                                    marginBottom: 4,
                                }}>// L{num}</div>
                                <div style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: 12,
                                    color: "var(--cs-text-muted)",
                                }}>{label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Results */}
                    {loading && <LoadingSkeleton />}
                    {result && !loading && <ResultCard result={result} type="url" />}

                    {/* Sandbox preview when safe */}
                    {result && !loading && result.safe_to_preview && (
                        <SandboxPreview url={url.trim()} />
                    )}
                </div>
            </main>
        </>
    )
}
