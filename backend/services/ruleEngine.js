// ruleEngine.js
// Layer 1 — Instant rule-based URL safety checks
// No API key needed. Runs in milliseconds.

const { URL } = require("url")

// ── Data ──────────────────────────────────────────────────────────────────

const BRAND_NAMES = [
  "paypal", "amazon", "google", "microsoft", "apple", "netflix",
  "facebook", "instagram", "twitter", "linkedin", "dropbox",
  "whatsapp", "youtube", "gmail", "outlook", "yahoo", "ebay",
  "bankofamerica", "chase", "wellsfargo", "citibank", "hdfc",
  "icici", "sbi", "steam", "roblox", "coinbase", "binance"
]

const SUSPICIOUS_PATH_KEYWORDS = [
  "login", "signin", "verify", "secure", "account", "update",
  "confirm", "password", "credential", "wallet", "suspended",
  "banking", "recover", "unlock", "validate", "authenticate"
]

const HIGH_RISK_TLDS = [
  ".tk", ".ml", ".ga", ".cf", ".gq", ".xyz", ".top",
  ".click", ".link", ".work", ".party", ".loan", ".download"
]

// Leet speak character substitutions phishers use
// e.g. paypa1.com instead of paypal.com
const LEET_MAP = {
  "0": "o", "1": "l", "3": "e",
  "4": "a", "5": "s", "6": "g", "@": "a"
}

// ── Individual check functions ────────────────────────────────────────────

function checkSSL(parsedUrl) {
  if (parsedUrl.protocol !== "https:") {
    return {
      triggered: true,
      reason: "No SSL certificate — connection is not encrypted (uses HTTP)",
      score: 25
    }
  }
  return { triggered: false, score: 0 }
}

function checkTyposquatting(hostname) {
  const issues = []

  for (const brand of BRAND_NAMES) {
    // Skip if hostname IS the brand (e.g. paypal.com is fine)
    if (hostname === brand + ".com" || hostname === "www." + brand + ".com") {
      continue
    }

    // Check for leet-speak substitution: paypa1.com → paypal.com
    let normalised = hostname
    for (const [num, letter] of Object.entries(LEET_MAP)) {
      normalised = normalised.split(num).join(letter)
    }
    if (normalised.includes(brand) && hostname !== normalised) {
      issues.push({
        reason: `Domain impersonates "${brand}" using character substitution (e.g. paypa1 → paypal)`,
        score: 50
      })
      continue
    }

    // Check for brand in subdomain: paypal.evil-site.com
    const parts = hostname.split(".")
    const subdomain = parts.slice(0, -2).join(".")
    if (subdomain.includes(brand)) {
      issues.push({
        reason: `Brand name "${brand}" used in subdomain to appear legitimate`,
        score: 45
      })
      continue
    }

    // Check for brand + extra word in domain: paypal-secure.com
    const domainWithoutTld = parts.slice(-2, -1)[0] || ""
    if (
      domainWithoutTld.includes(brand) &&
      domainWithoutTld !== brand
    ) {
      issues.push({
        reason: `Domain contains brand name "${brand}" with extra words — possible spoofing`,
        score: 35
      })
    }
  }

  return issues
}

function checkSuspiciousPatterns(url, hostname, pathname) {
  const issues = []

  // Raw IP address as hostname
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/
  if (ipRegex.test(hostname)) {
    issues.push({
      reason: "URL uses a raw IP address instead of a domain name",
      score: 40
    })
  }

  // Excessive subdomains: login.verify.secure.evil.com
  const subdomainCount = hostname.split(".").length - 2
  if (subdomainCount > 3) {
    issues.push({
      reason: `Suspicious subdomain depth (${subdomainCount} levels) — common in phishing URLs`,
      score: 20
    })
  }

  // Very long URL — obfuscation tactic
  if (url.length > 150) {
    issues.push({
      reason: `Unusually long URL (${url.length} characters) — may be hiding true destination`,
      score: 15
    })
  }

  // Suspicious words in path
  for (const keyword of SUSPICIOUS_PATH_KEYWORDS) {
    if (pathname.toLowerCase().includes(keyword)) {
      issues.push({
        reason: `Suspicious keyword "${keyword}" found in URL path`,
        score: 15
      })
      break // one path keyword warning is enough
    }
  }

  // High-risk TLD
  for (const tld of HIGH_RISK_TLDS) {
    if (hostname.endsWith(tld)) {
      issues.push({
        reason: `Domain uses high-risk TLD "${tld}" frequently abused for phishing`,
        score: 25
      })
      break
    }
  }

  // URL inside URL (redirect attack)
  const httpCount = (url.match(/https?:\/\//g) || []).length
  if (httpCount > 1) {
    issues.push({
      reason: "URL contains an embedded redirect to another URL",
      score: 40
    })
  }

  // Excessive percent-encoding (obfuscation)
  const encodedCount = (url.match(/%[0-9a-fA-F]{2}/g) || []).length
  if (encodedCount > 5) {
    issues.push({
      reason: `Heavy URL encoding detected (${encodedCount} encoded characters) — possible obfuscation`,
      score: 20
    })
  }

  // @ symbol in URL (tricks browser into ignoring everything before @)
  if (url.includes("@")) {
    issues.push({
      reason: 'URL contains "@" symbol — can be used to disguise true destination',
      score: 35
    })
  }

  return issues
}

// ── Main export ───────────────────────────────────────────────────────────

function runRuleChecks(url) {
  let totalScore = 0
  const allReasons = []

  // Try to parse the URL
  let parsed
  try {
    parsed = new URL(url)
  } catch {
    return {
      verdict: "UNSAFE",
      confidence: 0.95,
      reasons: ["Invalid or malformed URL — cannot be parsed"],
      safe_to_preview: false,
      layer: "rule-engine",
      rule_triggered: true
    }
  }

  const hostname = parsed.hostname.toLowerCase()
  const pathname = parsed.pathname.toLowerCase()

  // Run all checks
  const sslCheck = checkSSL(parsed)
  if (sslCheck.triggered) {
    allReasons.push(sslCheck.reason)
    totalScore += sslCheck.score
  }

  const typoIssues = checkTyposquatting(hostname)
  for (const issue of typoIssues) {
    allReasons.push(issue.reason)
    totalScore += issue.score
  }

  const patternIssues = checkSuspiciousPatterns(url, hostname, pathname)
  for (const issue of patternIssues) {
    allReasons.push(issue.reason)
    totalScore += issue.score
  }

  // Score → verdict
  // Score 0–29   = low risk  → pass to Layer 2
  // Score 30–49  = medium    → pass to Layer 2 with reasons
  // Score 50+    = high risk → return UNSAFE immediately

  if (totalScore >= 50) {
    const confidence = Math.min(0.60 + totalScore / 200, 0.98)
    return {
      verdict: "UNSAFE",
      confidence: parseFloat(confidence.toFixed(2)),
      reasons: allReasons,
      safe_to_preview: false,
      layer: "rule-engine",
      rule_triggered: true
    }
  }

  // Pass to next layer with any partial reasons found
  return {
    verdict: "UNCERTAIN",
    confidence: parseFloat((totalScore / 100).toFixed(2)),
    reasons: allReasons, // carry forward to merge with AI reasons
    safe_to_preview: false,
    layer: "rule-engine",
    rule_triggered: false
  }
}

module.exports = { runRuleChecks }