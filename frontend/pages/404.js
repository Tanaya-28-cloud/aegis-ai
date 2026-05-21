import Head from "next/head"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Custom404() {
  const [count, setCount] = useState(0)

  // Glitch counter animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => (c + 1) % 999)
    }, 80)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Head>
        <title>404 — Page Not Found | Aegis AI</title>
        <meta name="description" content="This page could not be found. Return to Aegis AI." />
      </Head>

      <main
        style={{ minHeight: "100vh", background: "var(--cs-bg)" }}
        className="cyber-grid"
      >
        <div className="scan-line" />
        <div style={{ height: 64 }} />

        <div style={{
          maxWidth: 640,
          margin: "0 auto",
          padding: "80px 24px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}>

          {/* ── Glitch badge ── */}
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 10,
            letterSpacing: "0.16em",
            color: "var(--cs-text-dim)",
            marginBottom: 8,
          }}>
            // ERROR_CODE
          </div>

          {/* ── Big glitchy 404 ── */}
          <div style={{ position: "relative", lineHeight: 1 }}>
            <div style={{
              fontFamily: "'Newsreader', Georgia, serif",
              fontStyle: "italic",
              fontSize: "clamp(80px, 20vw, 140px)",
              fontWeight: 400,
              color: "var(--cs-danger)",
              textShadow: "0 0 40px rgba(255,77,77,0.35), -2px 0 0 rgba(16,185,129,0.5)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}>
              404
            </div>
            {/* Glitch counter overlay */}
            <div style={{
              position: "absolute",
              top: 4, left: 4,
              fontFamily: "'Space Grotesk', monospace",
              fontSize: 11,
              letterSpacing: "0.12em",
              color: "var(--cs-accent)",
              opacity: 0.5,
            }}>
              0x{count.toString(16).toUpperCase().padStart(3, "0")}
            </div>
          </div>

          {/* ── Title ── */}
          <h1 style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: "clamp(22px, 4vw, 32px)",
            fontWeight: 400,
            color: "var(--cs-text)",
            marginTop: 8,
          }}>
            Page Not Found
          </h1>

          {/* ── Description ── */}
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            color: "var(--cs-text-muted)",
            lineHeight: 1.7,
            maxWidth: 380,
          }}>
            The page you are looking for does not exist or has been moved.
            No threats were detected — this is just a dead link.
          </p>

          {/* ── Status card ── */}
          <div className="cyber-card" style={{
            padding: "16px 24px",
            width: "100%",
            maxWidth: 360,
            textAlign: "left",
          }}>
            {[
              { label: "REQUEST", value: "PAGE_NOT_FOUND" },
              { label: "STATUS",  value: "404_ERROR" },
              { label: "THREAT",  value: "NONE_DETECTED" },
            ].map(({ label, value }) => (
              <div key={label} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 0",
                borderBottom: "1px solid var(--cs-border)",
              }}>
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 9,
                  letterSpacing: "0.12em",
                  color: "var(--cs-text-dim)",
                }}>
                  // {label}
                </span>
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  color: value === "NONE_DETECTED" ? "var(--cs-primary)" : "var(--cs-text-muted)",
                }}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* ── Actions ── */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/" className="btn-primary" style={{ padding: "12px 28px" }}>
              ← Return Home
            </Link>
            <Link href="/url-checker" className="btn-secondary" style={{ padding: "12px 24px" }}>
              Scan a URL
            </Link>
          </div>

        </div>
      </main>
    </>
  )
}
