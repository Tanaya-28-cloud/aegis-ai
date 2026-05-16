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
      setTextIndex((i) => (i + 1) % TYPING_TEXTS.length)
    }

    return () => clearTimeout(timeout)
  }, [displayed, deleting, textIndex])

  return (
    <span className="text-cyber-green glow-text">
      {displayed}
      <span className="animate-pulse">▋</span>
    </span>
  )
}

function StatCard({ value, label }) {
  return (
    <div className="glass cyber-corner relative rounded-lg p-4 text-center">
      <div className="font-display text-2xl font-bold text-cyber-green glow-text">
        {value}
      </div>
      <div className="font-mono text-xs text-cyber-muted mt-1 uppercase tracking-widest">
        {label}
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, desc, color, delay }) {
  return (
    <div
      className="glass cyber-corner relative rounded-xl p-6 group
                 hover:border-cyber-green transition-all duration-500
                 hover:shadow-[0_0_30px_rgba(0,255,157,0.1)]"
      style={{ animationDelay: delay }}
    >
      <div className={`text-4xl mb-4 animate-float`}>{icon}</div>
      <h3 className={`font-display text-sm font-bold tracking-widest mb-3 ${color}`}>
        {title}
      </h3>
      <p className="font-body text-sm text-gray-400 leading-relaxed">{desc}</p>

      {/* Hover glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r
                      from-transparent via-cyber-green to-transparent
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen bg-cyber-black cyber-grid">

      {/* Scan line */}
      <div className="scan-line" />

      {/* Padding for fixed navbar */}
      <div className="pt-20" />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center
                          justify-center text-center px-6 overflow-hidden">

        {/* Radial glow behind hero */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full opacity-10
                          bg-radial-gradient"
            style={{
              background: "radial-gradient(circle, rgba(0,255,157,0.15) 0%, transparent 70%)"
            }}
          />
        </div>

        {/* Badge */}
        <div className="glass border border-cyber-border rounded-full
                        px-4 py-1.5 mb-8 inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyber-green
                           shadow-[0_0_8px_#00ff9d] animate-pulse" />
          <span className="font-mono text-xs text-cyber-muted tracking-widest uppercase">
            AI-Powered Threat Detection
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-black
                       leading-tight mb-6 max-w-4xl">
          <span className="text-white">Defend against</span>
          <br />
          <TypingEffect />
        </h1>

        <p className="font-body text-base md:text-lg text-gray-400 max-w-2xl
                      mb-10 leading-relaxed">
          Aegis AI uses a 3-layer detection system — rule engine, fine-tuned
          DistilBERT, and Google Safe Browsing — to protect you from phishing
          in real time.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link
            href="/email-checker"
            className="cyber-btn font-mono text-sm tracking-widest uppercase
                       bg-cyber-green text-cyber-black font-bold px-8 py-4
                       rounded-lg hover:shadow-[0_0_30px_rgba(0,255,157,0.4)]
                       transition-all duration-300 animate-glow-pulse"
          >
            ✉ Scan Email
          </Link>
          <Link
            href="/url-checker"
            className="cyber-btn font-mono text-sm tracking-widest uppercase
                       border border-cyber-teal text-cyber-teal px-8 py-4
                       rounded-lg hover:bg-cyber-teal hover:text-cyber-black
                       transition-all duration-300"
          >
            🔗 Scan URL
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 max-w-lg w-full">
          <StatCard value="99.4%" label="Accuracy" />
          <StatCard value="3-Layer" label="Detection" />
          <StatCard value="< 2s" label="Response" />
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2
                        flex flex-col items-center gap-2 animate-bounce">
          <span className="font-mono text-xs text-cyber-border tracking-widest">
            SCROLL
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-cyber-border to-transparent" />
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section className="px-6 py-24 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-mono text-xs text-cyber-peacock tracking-widest
                        uppercase mb-3">
            // capabilities
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
            Three layers of protection
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon="✉"
            title="Email Detection"
            desc="Paste any suspicious email. Our fine-tuned DistilBERT model trained on 80,000+ real phishing emails detects spoofing, urgency tactics and domain manipulation."
            color="text-cyber-green"
            delay="0ms"
          />
          <FeatureCard
            icon="🔗"
            title="URL Safety Check"
            desc="Enter any URL and get an instant safety verdict. Aegis checks SSL certificates, domain age, typosquatting patterns and cross-references Google's threat database."
            color="text-cyber-aqua"
            delay="100ms"
          />
          <FeatureCard
            icon="🛡"
            title="Browser Extension"
            desc="Install the Aegis AI Chrome extension for automatic protection. Unsafe sites are intercepted and blocked before the page even loads."
            color="text-cyber-teal"
            delay="200ms"
          />
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-mono text-xs text-cyber-peacock tracking-widest uppercase mb-3">
              // architecture
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
              How it works
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-stretch gap-4">
            {[
              {
                layer: "01",
                title: "Rule Engine",
                desc: "Instant checks — SSL, domain age, typosquatting, keyword patterns. No API cost.",
                color: "text-cyber-green",
                border: "border-cyber-green",
                glow: "shadow-[0_0_20px_rgba(0,255,157,0.1)]"
              },
              {
                layer: "02",
                title: "AI Model",
                desc: "Fine-tuned DistilBERT running self-hosted. 99.4% F1 score on 7 phishing datasets.",
                color: "text-cyber-aqua",
                border: "border-cyber-aqua",
                glow: "shadow-[0_0_20px_rgba(0,229,255,0.1)]"
              },
              {
                layer: "03",
                title: "Safe Browsing",
                desc: "Google Safe Browsing API as final fallback. Checks against millions of known threats.",
                color: "text-cyber-teal",
                border: "border-cyber-teal",
                glow: "shadow-[0_0_20px_rgba(0,201,167,0.1)]"
              }
            ].map((item, i) => (
              <div key={i} className="flex md:flex-col items-center flex-1">
                <div className={`glass ${item.border} ${item.glow} rounded-xl p-6 flex-1 w-full`}>
                  <div className={`font-display text-xs tracking-widest mb-2 ${item.color}`}>
                    LAYER {item.layer}
                  </div>
                  <div className="font-display text-base font-bold text-white mb-3">
                    {item.title}
                  </div>
                  <p className="font-body text-xs text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                {i < 2 && (
                  <div className="text-cyber-border font-mono text-xl
                                  mx-4 md:mx-0 md:my-4 md:rotate-90">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Extension CTA ─────────────────────────────────────────── */}
      <section className="px-6 py-24 max-w-4xl mx-auto">
        <div className="glass cyber-corner relative rounded-2xl p-8 md:p-12 text-center
                        border border-cyber-border hover:border-cyber-green
                        transition-all duration-500
                        hover:shadow-[0_0_60px_rgba(0,255,157,0.08)]">

          <div className="font-mono text-xs text-cyber-peacock tracking-widest
                          uppercase mb-4">
            // browser extension
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
            Browse with protection on
          </h2>
          <p className="font-body text-gray-400 mb-8 max-w-lg mx-auto">
            The Aegis AI extension scans every URL automatically.
            Phishing sites are blocked before they load.
          </p>

          <a
            href="/aegis-ai-extension.zip"
            download="aegis-ai-extension.zip"
            className="cyber-btn inline-flex items-center gap-3 font-mono text-sm
             tracking-widest uppercase bg-cyber-green text-cyber-black
             font-bold px-8 py-4 rounded-lg
             hover:shadow-[0_0_30px_rgba(0,255,157,0.5)]
             transition-all duration-300"
          >
            🛡 Download Extension
          </a>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10 text-left">
            {[
              { t: "Auto-scan", d: "Every URL checked the moment you navigate to it" },
              { t: "Instant block", d: "Threats intercepted before the page loads" },
              { t: "Fail-safe", d: "If server unreachable, you browse normally" },
            ].map(({ t, d }) => (
              <div key={t} className="border border-cyber-border rounded-lg p-4
                                     hover:border-cyber-green transition-colors duration-300">
                <p className="font-mono text-xs text-cyber-green mb-2 uppercase tracking-widest">
                  {`> ${t}`}
                </p>
                <p className="font-body text-xs text-gray-400">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cyber-border px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row
                        items-center justify-between gap-4">
          <span className="font-display text-sm text-cyber-green glow-text animate-flicker">
            AEGIS_AI
          </span>
          <span className="font-mono text-xs text-cyber-border tracking-widest">
            // PROTECTING THE DIGITAL FRONTIER
          </span>
          <span className="font-mono text-xs text-cyber-border">
            v1.0.0 — 2026
          </span>
        </div>
      </footer>

    </main >
  )
}