// content.js — Aegis AI Content Script
// Runs on every page at document_start
// Adds a subtle Aegis protection indicator to the page

(function () {
    // Don't run on extension pages
    if (window.location.protocol === 'chrome-extension:') return

    // Listen for messages from background.js
    chrome.runtime.onMessage.addListener((message) => {
        if (message.type === 'SHOW_WARNING_BANNER') {
            showWarningBanner(message.reasons)
        }
    })

    function showWarningBanner(reasons) {
        // Don't add twice
        if (document.getElementById('aegis-warning-banner')) return

        const banner = document.createElement('div')
        banner.id = 'aegis-warning-banner'
        banner.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 2147483647;
      background: #1a0000;
      border-bottom: 2px solid #ef4444;
      color: #fca5a5;
      font-family: monospace;
      font-size: 13px;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      box-shadow: 0 2px 20px rgba(239,68,68,0.3);
    `

        const left = document.createElement('div')
        left.style.cssText = 'display:flex;align-items:center;gap:10px;'
        left.innerHTML = `
      <span style="font-size:18px">🛡</span>
      <div>
        <strong style="color:#ef4444">Aegis AI Warning</strong>
        <span style="color:#9ca3af;margin-left:8px">—</span>
        <span style="margin-left:8px">
          ${reasons && reasons[0] ? reasons[0] : 'Potential phishing site detected'}
        </span>
      </div>
    `

        const right = document.createElement('button')
        right.textContent = '✕ Dismiss'
        right.style.cssText = `
      background: transparent;
      border: 1px solid #ef4444;
      color: #fca5a5;
      padding: 4px 10px;
      border-radius: 4px;
      cursor: pointer;
      font-family: monospace;
      font-size: 11px;
      white-space: nowrap;
    `
        right.onclick = () => banner.remove()

        banner.appendChild(left)
        banner.appendChild(right)
        document.documentElement.prepend(banner)
    }
})()