export default function LoadingSkeleton() {
  return (
    <div className="cyber-card animate-fade-up" style={{ marginTop: 24, maxWidth: 680 }}>

      {/* Header row */}
      <div style={{
        padding: "20px 24px",
        borderBottom: "1px solid var(--cs-border)",
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
      }}>
        <div>
          <div style={{
            width: 80, height: 10,
            background: "var(--cs-surface-highest)",
            marginBottom: 12,
            animation: "shimmerSlide 1.5s infinite",
          }} />
          <div style={{
            width: 220, height: 30,
            background: "var(--cs-surface-high)",
            animation: "shimmerSlide 1.5s infinite 0.1s",
          }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
          <div style={{ width: 70, height: 10, background: "var(--cs-surface-highest)", animation: "shimmerSlide 1.5s infinite 0.05s" }} />
          <div style={{ width: 60, height: 28, background: "var(--cs-surface-high)", animation: "shimmerSlide 1.5s infinite 0.15s" }} />
        </div>
      </div>

      {/* Confidence bar */}
      <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--cs-border)" }}>
        <div style={{ width: "100%", height: 2, background: "var(--cs-surface-highest)" }}>
          <div style={{
            height: "100%", width: "60%",
            background: "linear-gradient(90deg, var(--cs-surface-high), var(--cs-surface-highest), var(--cs-surface-high))",
            backgroundSize: "200% 100%",
            animation: "shimmerSlide 1.5s infinite",
          }} />
        </div>
        <div style={{ marginTop: 6, width: 120, height: 8, background: "var(--cs-surface-high)", animation: "shimmerSlide 1.5s infinite" }} />
      </div>

      {/* Signals section */}
      <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--cs-border)" }}>
        <div style={{ width: 110, height: 10, background: "var(--cs-surface-highest)", marginBottom: 14, animation: "shimmerSlide 1.5s infinite" }} />
        {[100, 85, 70].map((w, i) => (
          <div key={i} className="cyber-row" style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ width: 8, height: 8, background: "var(--cs-surface-highest)", flexShrink: 0 }} />
            <div style={{
              height: 11, width: `${w}%`,
              background: "var(--cs-surface-high)",
              animation: `shimmerSlide 1.5s infinite ${i * 0.08}s`,
            }} />
          </div>
        ))}
      </div>

      {/* Status row */}
      <div style={{ padding: "12px 24px", display: "flex", alignItems: "center", gap: 8 }}>
        <div className="pulse-dot" style={{ background: "var(--cs-surface-highest)", boxShadow: "none" }} />
        <div style={{ width: 160, height: 10, background: "var(--cs-surface-high)", animation: "shimmerSlide 1.5s infinite" }} />
      </div>
    </div>
  )
}