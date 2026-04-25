// popup.js — Aegis AI Extension Popup UI

const DASHBOARD_URL = "https://aegis-ai.vercel.app" // update after deploy
const API_BASE = "https://aegis-ai-backend.railway.app" // update after deploy

// DOM refs
const statusDot = document.getElementById("statusDot")
const currentUrlEl = document.getElementById("currentUrl")
const verdictCard = document.getElementById("verdictCard")
const verdictContent = document.getElementById("verdictContent")
const actionsBar = document.getElementById("actionsBar")

// ── Render helpers ──────────────────────────────────────────────────────────

function renderScanning(url) {
    statusDot.className = "status-dot scanning"
    currentUrlEl.textContent = url

    verdictCard.className = "verdict-card scanning"
    verdictContent.innerHTML = `
    <div class="spinner"></div>
    <div class="verdict-label scanning" style="text-align:center">
      Scanning page...
    </div>
    <div class="confidence" style="text-align:center">
      Checking against Aegis AI
    </div>
  `
    actionsBar.innerHTML = ""
}

function renderSafe(url, result) {
    statusDot.className = "status-dot"
    currentUrlEl.textContent = url

    const pct = Math.round((result.confidence || 0.9) * 100)
    verdictCard.className = "verdict-card safe"
    verdictContent.innerHTML = `
    <div class="verdict-label safe">✓ This page is Safe</div>
    <div class="confidence">${pct}% confidence</div>
    <div class="bar-track">
      <div class="bar-fill safe" style="width: ${pct}%"></div>
    </div>
    ${result.reasons && result.reasons.length > 0 ? `
      <ul class="reasons">
        ${result.reasons.map(r =>
        `<li class="safe-item">${r}</li>`
    ).join("")}
      </ul>
    ` : `<p style="font-size:11px;color:#6b7280">No threats detected.</p>`}
  `

    actionsBar.innerHTML = `
    <button class="btn btn-secondary" id="manualCheck">
      Re-scan this page
    </button>
    <button class="btn btn-secondary" id="openDash">
      Open full dashboard
    </button>
  `

    document.getElementById("manualCheck")?.addEventListener("click", () => {
        triggerScan(url)
    })
    document.getElementById("openDash")?.addEventListener("click", openDashboard)
}

function renderUnsafe(url, result) {
    statusDot.className = "status-dot unsafe"
    currentUrlEl.textContent = url

    const pct = Math.round((result.confidence || 0.95) * 100)
    verdictCard.className = "verdict-card unsafe"
    verdictContent.innerHTML = `
    <div class="verdict-label unsafe">⚠ Unsafe Page Detected</div>
    <div class="confidence">${pct}% confidence</div>
    <div class="bar-track">
      <div class="bar-fill unsafe" style="width: ${pct}%"></div>
    </div>
    ${result.reasons && result.reasons.length > 0 ? `
      <ul class="reasons">
        ${result.reasons.map(r => `<li>${r}</li>`).join("")}
      </ul>
    ` : ""}
  `

    actionsBar.innerHTML = `
    <button class="btn btn-danger" id="goBack">
      ← Go back to safety
    </button>
    <button class="btn btn-secondary" id="proceedAnyway">
      Proceed anyway (risky)
    </button>
    <button class="btn btn-secondary" id="openDash">
      View full report
    </button>
  `

    document.getElementById("goBack")?.addEventListener("click", () => {
        chrome.tabs.goBack()
        window.close()
    })

    document.getElementById("proceedAnyway")?.addEventListener("click", () => {
        // Send message to background to allow this URL once
        chrome.runtime.sendMessage({
            type: "ALLOW_ONCE",
            url: url
        })
        window.close()
    })

    document.getElementById("openDash")?.addEventListener("click", openDashboard)
}

function renderIdle(url) {
    statusDot.className = "status-dot"
    currentUrlEl.textContent = url || "No page active"

    verdictCard.className = "verdict-card idle"
    verdictContent.innerHTML = `
    <div class="verdict-label idle">— Not scanned yet</div>
    <div class="confidence" style="margin-top:4px">
      Click below to scan this page
    </div>
  `

    actionsBar.innerHTML = `
    <button class="btn btn-primary" id="scanNow">
      🛡 Scan this page now
    </button>
    <button class="btn btn-secondary" id="openDash">
      Open dashboard
    </button>
  `

    document.getElementById("scanNow")?.addEventListener("click", () => {
        if (url) triggerScan(url)
    })
    document.getElementById("openDash")?.addEventListener("click", openDashboard)
}

function renderError(url, message) {
    statusDot.className = "status-dot"
    currentUrlEl.textContent = url || "—"

    verdictCard.className = "verdict-card idle"
    verdictContent.innerHTML = `
    <div class="verdict-label idle">Could not scan</div>
    <div class="confidence" style="margin-top:4px;color:#ef4444">
      ${message || "Server unreachable"}
    </div>
  `

    actionsBar.innerHTML = `
    <button class="btn btn-secondary" id="retry">Retry scan</button>
  `
    document.getElementById("retry")?.addEventListener("click", () => {
        if (url) triggerScan(url)
    })
}

// ── Core logic ───────────────────────────────────────────────────────────────

async function triggerScan(url) {
    renderScanning(url)

    try {
        const response = await fetch(`${API_BASE}/api/check-url`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url })
        })

        if (!response.ok) throw new Error(`Server error: ${response.status}`)

        const result = await response.json()

        if (result.verdict === "SAFE") {
            renderSafe(url, result)
        } else {
            renderUnsafe(url, result)
        }

    } catch (err) {
        console.error("Aegis scan error:", err)
        // Fail safe — show idle, don't block the user
        renderError(url, "Could not reach Aegis AI server")
    }
}

function openDashboard() {
    chrome.tabs.create({ url: DASHBOARD_URL })
    window.close()
}

// ── Init — get current tab URL and check cache ────────────────────────────

document.getElementById("openDashboard")?.addEventListener("click", openDashboard)

chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const tab = tabs[0]
    const url = tab?.url

    // Skip browser-internal pages
    if (!url || url.startsWith("chrome://") || url.startsWith("about:")) {
        renderIdle(null)
        return
    }

    // Ask background script if it has a cached result for this URL
    chrome.runtime.sendMessage(
        { type: "GET_CACHED_RESULT", url },
        (response) => {
            if (chrome.runtime.lastError) {
                // Background not available — show idle
                renderIdle(url)
                return
            }

            if (response?.result) {
                // Use cached verdict from background scan
                if (response.result.verdict === "SAFE") {
                    renderSafe(url, response.result)
                } else {
                    renderUnsafe(url, response.result)
                }
            } else {
                // No cached result — show idle with scan button
                renderIdle(url)
            }
        }
    )
})