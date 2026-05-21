import Head from "next/head"
import Link from "next/link"
import { useEffect, useState } from "react"

const TYPING_TEXTS = [
  "phishing attacks.",
  "fake emails.",
  "malicious URLs.",
  "cyber threats.",
]

function TypingEffect() {
  const [textIndex, setTextIndex] = useState(0)
  const [displayed, setDisplayed] = useState("")
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const target = TYPING_TEXTS[textIndex]
    let timeout
    if (!deleting && displayed.length < target.length) {
      timeout = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 80)
    } else if (!deleting && displayed.length === target.length) {
      timeout = setTimeout(() => setDeleting(true), 2000)
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40)
    } else if (deleting && displayed.length === 0) {
      setDeleting(false)
      setTextIndex(i => (i + 1) % TYPING_TEXTS.length)
    }
    return () => clearTimeout(timeout)
  }, [displayed, deleting, textIndex])

  return (
    <span style={{ color: "var(--cs-primary)", textShadow: "0 0 24px var(--cs-accent-glow)" }}>
      {displayed}
      <span style={{ animation: "pulseDot 1s infinite" }}>▋</span>
    </span>
  )
}

function StatCard({ value, label }) {
  return (
    <div className="cyber-card" style={{ padding: "20px 16px", textAlign: "center" }}>
      <div style={{
        fontFamily: "'Newsreader', Georgia, serif",
        fontStyle: "italic",
        fontSize: 28,
        fontWeight: 400,
        color: "var(--cs-primary)",
        textShadow: "0 0 20px var(--cs-accent-glow)",
        marginBottom: 6,
      }}>{value}</div>
      <div style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 10,
        fontWeight: 500,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "var(--cs-text-dim)",
      }}>{label}</div>
    </div>
  )
}

function FeatureCard({ label, title, desc, delay }) {
  return (
    <div className="cyber-card animate-fade-up" style={{ padding: "28px 24px", animationDelay: delay }}>
      <p className="section-marker" style={{ marginBottom: 12 }}>{label}</p>
      <h3 style={{
        fontFamily: "'Newsreader', Georgia, serif",
        fontSize: 22,
        fontWeight: 400,
        color: "var(--cs-text)",
        marginBottom: 12,
        lineHeight: 1.2,
      }}>{title}</h3>
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 13,
        color: "var(--cs-text-muted)",
        lineHeight: 1.7,
      }}>{desc}</p>
    </div>
  )
}

function LayerCard({ num, title, desc, delay }) {
  return (
    <div className="cyber-card" style={{ flex: 1, padding: "24px", animationDelay: delay }}>
      <div style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.15em",
        color: "var(--cs-accent)",
        marginBottom: 8,
      }}>// LAYER_{num}</div>
      <h4 style={{
        fontFamily: "'Newsreader', Georgia, serif",
        fontSize: 20,
        fontWeight: 400,
        color: "var(--cs-text)",
        marginBottom: 10,
      }}>{title}</h4>
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 13,
        color: "var(--cs-text-muted)",
        lineHeight: 1.7,
      }}>{desc}</p>
    </div>
  )
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Aegis AI — AI-Powered Phishing &amp; URL Protection</title>
        <meta name="description" content="Aegis AI detects phishing emails and malicious URLs using a 3-layer system: rule engine, fine-tuned DistilBERT, and Google Safe Browsing." />
      </Head>
      <main style={{ minHeight: "100vh", background: "var(--cs-bg)" }} className="cyber-grid">
      <div className="scan-line" />
      {/* Navbar spacer */}
      <div style={{ height: 64 }} />

      {/* ─────────────────────────── HERO ─────────────────────────────── */}
      <section style={{
        minHeight: "calc(100vh - 64px)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "0 24px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Radial glow */}
        <div style={{
          position: "absolute", inset: 0, display: "flex",
          alignItems: "center", justifyContent: "center", pointerEvents: "none",
        }}>
          <div style={{
            width: 700, height: 700, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 65%)",
          }} />
        </div>

        {/* // Section marker */}
        <p className="section-marker animate-fade-up" style={{ marginBottom: 20 }}>
          // 01_OVERVIEW
        </p>

        {/* Live badge */}
        <div className="animate-fade-up" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          border: "1px solid var(--cs-border)",
          padding: "6px 16px",
          marginBottom: 28,
          animationDelay: "0.05s",
        }}>
          <div className="pulse-dot" />
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 10, letterSpacing: "0.12em",
            color: "var(--cs-text-dim)", textTransform: "uppercase",
          }}>
            AI-Powered Threat Detection
          </span>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-up" style={{
          fontFamily: "'Newsreader', Georgia, serif",
          fontStyle: "italic",
          fontSize: "clamp(36px, 7vw, 72px)",
          fontWeight: 400,
          lineHeight: 1.05,
          color: "var(--cs-text)",
          maxWidth: 800,
          marginBottom: 20,
          animationDelay: "0.1s",
        }}>
          Defend against<br />
          <TypingEffect />
        </h1>

        <p className="animate-fade-up" style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 15,
          color: "var(--cs-text-muted)",
          maxWidth: 540,
          lineHeight: 1.7,
          marginBottom: 40,
          animationDelay: "0.15s",
        }}>
          Aegis AI uses a 3-layer detection system — rule engine, fine-tuned
          DistilBERT, and Google Safe Browsing — to protect you from phishing
          in real time.
        </p>

        {/* CTAs */}
        <div className="animate-fade-up" style={{
          display: "flex", gap: 16, flexWrap: "wrap",
          justifyContent: "center", marginBottom: 56,
          animationDelay: "0.2s",
        }}>
          <Link href="/email-checker" className="btn-primary animate-glow-pulse">
            ✉ Scan Email
          </Link>
          <Link href="/url-checker" className="btn-secondary">
            🔗 Scan URL
          </Link>
        </div>

        {/* Stats */}
        <div className="animate-fade-up" style={{
          display: "grid", gridTemplateColumns: "repeat(3,1fr)",
          gap: 16, width: "100%", maxWidth: 420,
          animationDelay: "0.25s",
        }}>
          <StatCard value="99.4%" label="Accuracy" />
          <StatCard value="3-Layer" label="Detection" />
          <StatCard value="< 2s" label="Response" />
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          animation: "float 2.5s ease-in-out infinite",
        }}>
          <span className="section-marker">SCROLL</span>
          <div style={{ width: 1, height: 32, background: "linear-gradient(to bottom, var(--cs-border), transparent)" }} />
        </div>
      </section>

      {/* ─────────────────────────── FEATURES ─────────────────────────── */}
      <section style={{ padding: "96px 40px", maxWidth: 1200, margin: "0 auto" }}>
        {/* Section header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <div style={{ flex: 1, height: 1, background: "var(--cs-border)" }} />
            <p className="section-marker">// 02_CAPABILITIES</p>
            <div style={{ flex: 1, height: 1, background: "var(--cs-border)" }} />
          </div>
          <h2 style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 400,
            color: "var(--cs-text)",
            textAlign: "center",
          }}>
            Three layers of protection
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          <FeatureCard
            label="// EMAIL_DETECTION"
            title="Email Phishing Analysis"
            desc="Paste any suspicious email. Our fine-tuned DistilBERT model trained on 80,000+ real phishing emails detects spoofing, urgency tactics and domain manipulation."
            delay="0ms"
          />
          <FeatureCard
            label="// URL_SAFETY_CHECK"
            title="URL Safety Verification"
            desc="Enter any URL and get an instant safety verdict. Aegis checks SSL certificates, domain age, typosquatting patterns and cross-references Google's threat database."
            delay="60ms"
          />
          <FeatureCard
            label="// BROWSER_EXTENSION"
            title="Automatic Protection"
            desc="Install the Aegis AI Chrome extension for automatic protection. Unsafe sites are intercepted and blocked before the page even loads."
            delay="120ms"
          />
        </div>
      </section>

      {/* ─────────────────────────── ARCHITECTURE ─────────────────────── */}
      <section style={{ padding: "0 40px 96px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <div style={{ flex: 1, height: 1, background: "var(--cs-border)" }} />
            <p className="section-marker">// 03_ARCHITECTURE</p>
            <div style={{ flex: 1, height: 1, background: "var(--cs-border)" }} />
          </div>
          <h2 style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 400, color: "var(--cs-text)", textAlign: "center",
          }}>How it works</h2>
        </div>

        <div className="arch-flow">
          <LayerCard num="01" title="Rule Engine"
            desc="Instant checks — SSL, domain age, typosquatting, keyword patterns. No API cost, zero latency." delay="0ms" />
          <div className="arch-arrow">→</div>
          <LayerCard num="02" title="AI Model"
            desc="Fine-tuned DistilBERT running self-hosted. 99.4% F1 score on 7 phishing datasets." delay="60ms" />
          <div className="arch-arrow">→</div>
          <LayerCard num="03" title="Safe Browsing"
            desc="Google Safe Browsing API as final fallback. Checks against millions of known threats." delay="120ms" />
        </div>
      </section>

      {/* ─────────────────────────── EXTENSION CTA ─────────────────────── */}
      <section style={{ padding: "0 40px 96px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 0 }}>
            <div style={{ flex: 1, height: 1, background: "var(--cs-border)" }} />
            <p className="section-marker">// 04_BROWSER_PROTECTION</p>
            <div style={{ flex: 1, height: 1, background: "var(--cs-border)" }} />
          </div>
        </div>

        <div className="cyber-card" style={{ padding: "48px 40px", textAlign: "center" }}>
          <h2 style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(26px, 3.5vw, 36px)",
            fontWeight: 400,
            color: "var(--cs-text)",
            marginBottom: 16,
          }}>Browse with protection on</h2>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            color: "var(--cs-text-muted)",
            maxWidth: 460,
            margin: "0 auto 32px",
            lineHeight: 1.7,
          }}>
            The Aegis AI extension scans every URL automatically. Phishing sites
            are blocked before they load.
          </p>

          <a href="/aegis-ai-extension.zip" download className="btn-primary" style={{ marginBottom: 40 }}>
            🛡 Download Extension
          </a>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16, textAlign: "left", marginTop: 8,
          }}>
            {[
              { t: "Auto-scan",    d: "Every URL checked the moment you navigate to it" },
              { t: "Instant block", d: "Threats intercepted before the page loads" },
              { t: "Fail-safe",    d: "If server unreachable, you browse normally" },
            ].map(({ t, d }) => (
              <div key={t} style={{
                border: "1px solid var(--cs-border)",
                padding: "16px",
                transition: "border-color 0.25s",
              }} className="cyber-card">
                <p style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 11, letterSpacing: "0.1em",
                  color: "var(--cs-primary)", marginBottom: 8, textTransform: "uppercase",
                }}>{`> ${t}`}</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "var(--cs-text-muted)", lineHeight: 1.6 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────── FOOTER ────────────────────────────── */}
      <footer style={{ borderTop: "1px solid var(--cs-border)", padding: "24px 40px" }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 12,
        }}>
          <span className="animate-flicker" style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700, fontSize: 13,
            letterSpacing: "0.18em",
            color: "var(--cs-primary)",
            textShadow: "0 0 14px var(--cs-accent-glow)",
          }}>
            AEGIS_AI
          </span>
          <span className="section-marker">// PROTECTING_THE_DIGITAL_FRONTIER</span>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 10, letterSpacing: "0.08em", color: "var(--cs-text-dim)",
          }}>
            v1.0.0 — 2026
          </span>
        </div>
      </footer>
    </main>
    </>
  )
}