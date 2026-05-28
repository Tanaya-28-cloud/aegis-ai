import Head from "next/head"
import axios from "axios"
import { useState, useRef } from "react"
import ResultCard from "@/components/ResultCard"
import LoadingSkeleton from "@/components/LoadingSkeleton"

const TIMEOUT_MS = 15000
const MAX_CONTENT_LEN = 5000

export default function EmailChecker() {
    const [sender, setSender] = useState("")
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState("")
    const [timedOut, setTimedOut] = useState(false)
    const cancelRef = useRef(null)

    function handleSenderChange(e) {
        setSender(e.target.value)
        setError("")
        if (result) setResult(null)
    }

    function handleContentChange(e) {
        // Enforce max length silently
        const val = e.target.value.slice(0, MAX_CONTENT_LEN)
        setContent(val)
        setError("")
        if (result) setResult(null)
    }

    function handleClear() {
        setSender("")
        setContent("")
        setResult(null)
        setError("")
        setTimedOut(false)
        if (cancelRef.current) cancelRef.current()
    }

    async function handleSubmit() {
        if (!sender && !content) {
            setError("Please enter both the sender email and email content.")
            return
        }
        if (!sender) {
            setError("Please enter the sender email address.")
            return
        }
        if (!content.trim()) {
            setError("Please paste the email content.")
            return
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(sender)) {
            setError("Please enter a valid email address format.")
            return
        }

        setError("")
        setTimedOut(false)
        setLoading(true)
        setResult(null)

        const controller = new AbortController()
        cancelRef.current = () => controller.abort()
        const timer = setTimeout(() => {
            controller.abort()
            setTimedOut(true)
            setLoading(false)
        }, TIMEOUT_MS)

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/check-email`,
                { sender, content },
                { signal: controller.signal }
            )
            clearTimeout(timer)
            setResult(response.data)
        } catch (err) {
            clearTimeout(timer)
            if (err.name === "CanceledError" || err.code === "ERR_CANCELED") return
            setError("Could not connect to server. Make sure the backend is running.")
        } finally {
            clearTimeout(timer)
            setLoading(false)
        }
    }

    const charsLeft = MAX_CONTENT_LEN - content.length
    const charPct = content.length / MAX_CONTENT_LEN
    const charColor = charPct > 0.9 ? "var(--cs-danger)" : charPct > 0.75 ? "#f59e0b" : "var(--cs-text-dim)"

    return (
        <>
            <Head>
                <title>Phishing Email Detection — Aegis AI</title>
                <meta name="description" content="Detect phishing and fake emails using Aegis AI's 3-layer detection engine. Paste any suspicious email and get an instant verdict." />
            </Head>

            <main style={{ minHeight: "100vh", background: "var(--cs-bg)" }} className="cyber-grid">
                <div className="scan-line" />
                <div style={{ height: 64 }} />

                <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px" }}>

                    {/* ── Page header ── */}
                    <div style={{ marginBottom: 40 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                            <div style={{ height: 1, flex: 1, background: "var(--cs-border)" }} />
                            <p className="section-marker">// EMAIL_ANALYSIS</p>
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
                            Phishing Detection
                        </h1>
                        <p style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 14,
                            color: "var(--cs-text-muted)",
                            lineHeight: 1.6,
                        }}>
                            Detect phishing and fake emails using our 3-layer AI detection engine.
                        </p>
                    </div>

                    {/* ── Form card ── */}
                    <div className="cyber-card animate-fade-up" style={{ padding: "32px" }}>

                        {/* Sender field */}
                        <div style={{ marginBottom: 28 }}>
                            <label htmlFor="sender-input" style={{
                                display: "block",
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontSize: 10,
                                fontWeight: 600,
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                color: "var(--cs-text-dim)",
                                marginBottom: 10,
                            }}>
                                // SENDER_ADDRESS
                            </label>
                            <input
                                id="sender-input"
                                type="email"
                                value={sender}
                                onChange={handleSenderChange}
                                placeholder="e.g. support@paypa1.com"
                                className={`cyber-input${error && !sender ? " error" : ""}`}
                                aria-label="Sender email address"
                                aria-describedby={error ? "email-error" : undefined}
                            />
                        </div>

                        {/* Content field */}
                        <div style={{ marginBottom: 28 }}>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "baseline",
                                marginBottom: 10,
                            }}>
                                <label htmlFor="content-input" style={{
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontSize: 10,
                                    fontWeight: 600,
                                    letterSpacing: "0.12em",
                                    textTransform: "uppercase",
                                    color: "var(--cs-text-dim)",
                                }}>
                                    // EMAIL_CONTENT
                                </label>
                                {/* Character counter */}
                                <span style={{
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontSize: 10,
                                    letterSpacing: "0.06em",
                                    color: charColor,
                                    transition: "color 0.2s",
                                }}>
                                    {content.length > 0 ? `${content.length} / ${MAX_CONTENT_LEN.toLocaleString()}` : `0 / ${MAX_CONTENT_LEN.toLocaleString()}`}
                                </span>
                            </div>
                            <textarea
                                id="content-input"
                                rows={8}
                                value={content}
                                onChange={handleContentChange}
                                placeholder="Paste the email body here..."
                                className={`cyber-textarea${error && !content.trim() ? " error" : ""}`}
                                aria-label="Email content to analyse"
                            />
                            {/* Character progress bar */}
                            {content.length > 0 && (
                                <div style={{ marginTop: 6, height: 1, background: "var(--cs-surface-highest)", overflow: "hidden" }}>
                                    <div style={{
                                        height: "100%",
                                        width: `${Math.min(charPct * 100, 100)}%`,
                                        background: charColor,
                                        transition: "width 0.1s, background 0.2s",
                                    }} />
                                </div>
                            )}
                        </div>

                        {/* Error */}
                        {error && (
                            <div id="email-error" style={{
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
                                    ⚠ SCAN_TIMEOUT — Server took too long to respond. Try again.
                                </span>
                            </div>
                        )}

                        {/* Action buttons */}
                        <div style={{ display: "flex", gap: 12 }}>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="btn-primary"
                                style={{ flex: 1 }}
                            >
                                {loading ? "// ANALYSING..." : "Analyse Email"}
                            </button>
                            {(sender || content) && (
                                <button
                                    onClick={handleClear}
                                    style={{
                                        background: "none",
                                        border: "1px solid var(--cs-border)",
                                        color: "var(--cs-text-dim)",
                                        cursor: "pointer",
                                        padding: "14px 20px",
                                        fontFamily: "'Space Grotesk', sans-serif",
                                        fontSize: 11,
                                        letterSpacing: "0.08em",
                                        flexShrink: 0,
                                        transition: "border-color 0.2s, color 0.2s",
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--cs-border-bright)"; e.currentTarget.style.color = "var(--cs-text)" }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--cs-border)"; e.currentTarget.style.color = "var(--cs-text-dim)" }}
                                >
                                    ✕ CLEAR
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Results */}
                    {loading && <LoadingSkeleton />}
                    {result && !loading && <ResultCard result={result} type="email" />}
                </div>
            </main>
        </>
    )
}
