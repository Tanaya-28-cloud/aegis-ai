// Aegis AI — Service Worker (background.js)
// Intercepts every navigation and checks URLs against the Aegis AI backend

// Switch to production URL when you deploy to Railway
const API_BASE = 'http://localhost:3001';

// Domains we never scan — browser internals and the extension itself
const SKIP_PREFIXES = [
  'chrome://', 'chrome-extension://', 'edge://', 'about:',
  'data:', 'file://', 'moz-extension://'
];

// Domains we skip to prevent extension from blocking itself or the API
const SKIP_HOSTNAMES = [
  'aegis-ai.vercel.app',      // Tanaya's frontend
  'aegis-ai-backend.up.railway.app' // this backend
];

const shouldSkip = (url) => {
  if (SKIP_PREFIXES.some(prefix => url.startsWith(prefix))) return true;
  try {
    const hostname = new URL(url).hostname;
    if (SKIP_HOSTNAMES.includes(hostname)) return true;
  } catch {
    return true; // malformed URL — skip
  }
  return false;
};

// Intercept every navigation event (main frame only)
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  // Only check top-level navigation (frameId 0 = main page, not iframes)
  if (details.frameId !== 0) return;

  const url = details.url;
  if (shouldSkip(url)) return;

  try {
    const response = await fetch(`${API_BASE}/api/check-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });

    if (!response.ok) return; // API error — fail open, don't block user

    const result = await response.json();

    if (result.verdict === 'UNSAFE') {
      // Store warning data in session storage for warning.html to read
      await chrome.storage.session.set({
        aegis_blocked_url: url,
        aegis_reasons: result.reasons || [],
        aegis_confidence: result.confidence || 0,
        aegis_scan_id: result.scan_id || null
      });

      // Redirect the current tab to our warning page
      chrome.tabs.update(details.tabId, {
        url: chrome.runtime.getURL('popup/warning.html')
      });
    }

  } catch (error) {
    // API is unreachable — fail open (never block the user due to our own errors)
    console.warn('[Aegis AI] Check failed, failing open:', error.message);
  }
});

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_STATUS') {
    // Popup is asking for current tab status
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (!tabs[0]) return sendResponse({ status: 'unknown' });

      const url = tabs[0].url;
      if (shouldSkip(url)) {
        return sendResponse({ status: 'skipped' });
      }

      try {
        const response = await fetch(`${API_BASE}/api/check-url`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url })
        });
        const result = await response.json();
        sendResponse({ status: result.verdict, confidence: result.confidence, reasons: result.reasons });
      } catch {
        sendResponse({ status: 'error' });
      }
    });
    return true; // keep message channel open for async response
  }
});