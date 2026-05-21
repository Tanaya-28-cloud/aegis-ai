import Link from "next/link"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"

export default function Navbar() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const isActive = (path) => router.pathname === path

  // ── Scroll listener: solidify navbar background on scroll ──
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // ── Responsive: detect mobile viewport ──
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [router.pathname])

  const navLinks = [
    { href: "/email-checker", label: "// EMAIL_SCAN" },
    { href: "/url-checker",   label: "// URL_SCAN"   },
  ]

  const navBg = scrolled
    ? "rgba(13, 14, 15, 0.97)"
    : "rgba(18, 20, 20, 0.85)"

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      background: navBg,
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderBottom: `1px solid ${scrolled ? "var(--cs-border-bright)" : "var(--cs-border)"}`,
      transition: "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
      boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.4)" : "none",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        padding: isMobile ? "0 20px" : "0 40px",
        height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>

        {/* ── Logo ── */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", flexShrink: 0 }}>
          {/* Hexagon icon */}
          <div style={{ position: "relative", width: 34, height: 34, flexShrink: 0 }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "var(--cs-accent)",
              opacity: 0.15,
              clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
            }} />
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid var(--cs-accent)",
              clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
              color: "var(--cs-primary)",
              fontSize: 13,
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
            }}>⬡</div>
          </div>

          <span className="animate-flicker" style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: "0.18em",
            color: "var(--cs-primary)",
            textShadow: "0 0 16px var(--cs-accent-glow)",
          }}>
            AEGIS<span style={{ color: "var(--cs-text-muted)" }}>_AI</span>
          </span>
        </Link>

        {/* ── Desktop nav (hidden on mobile) ── */}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: isActive(href) ? "var(--cs-primary)" : "var(--cs-text-dim)",
                textDecoration: "none",
                position: "relative",
                paddingBottom: 4,
                transition: "color 0.2s",
              }}>
                {isActive(href) && (
                  <span style={{
                    position: "absolute", left: -12, top: "50%", transform: "translateY(-50%)",
                    width: 5, height: 5, borderRadius: "50%",
                    background: "var(--cs-accent)",
                    boxShadow: "0 0 8px var(--cs-accent-glow)",
                  }} />
                )}
                {label}
                {/* underline indicator */}
                <span style={{
                  position: "absolute", bottom: 0, left: 0,
                  height: 1,
                  background: "var(--cs-accent)",
                  width: isActive(href) ? "100%" : "0",
                  transition: "width 0.25s cubic-bezier(0.16,1,0.3,1)",
                }} />
              </Link>
            ))}

            {/* Extension CTA */}
            <a href="/aegis-ai-extension.zip" download className="btn-secondary" style={{ padding: "8px 18px" }}>
              + Extension
            </a>
          </div>
        )}

        {/* ── Mobile hamburger (only on mobile) ── */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: 8, display: "flex", flexDirection: "column",
              gap: 5, flexShrink: 0,
            }}
          >
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 22, height: 1.5,
                background: "var(--cs-primary)",
                transition: "all 0.25s",
                transform: menuOpen
                  ? i === 0 ? "rotate(45deg) translate(4px, 4px)"
                    : i === 1 ? "scaleX(0)"
                    : "rotate(-45deg) translate(4px, -4px)"
                  : "none",
              }} />
            ))}
          </button>
        )}
      </div>

      {/* ── Mobile dropdown menu ── */}
      {isMobile && menuOpen && (
        <div style={{
          borderTop: "1px solid var(--cs-border)",
          padding: "16px 20px 24px",
          display: "flex", flexDirection: "column", gap: 16,
          background: "rgba(13, 14, 15, 0.98)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        }}>
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)} style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 12,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: isActive(href) ? "var(--cs-primary)" : "var(--cs-text-dim)",
              textDecoration: "none",
              padding: "10px 0",
              borderBottom: "1px solid var(--cs-border)",
            }}>
              {label}
            </Link>
          ))}
          <a href="/aegis-ai-extension.zip" download onClick={() => setMenuOpen(false)} style={{
            color: "var(--cs-accent)", textDecoration: "none",
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 12,
            letterSpacing: "0.1em", textTransform: "uppercase",
            paddingTop: 4,
          }}>
            + Download Extension
          </a>
        </div>
      )}
    </nav>
  )
}
