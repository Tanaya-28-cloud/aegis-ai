const crypto = require('crypto');

// ─── URL CHECKS ─────────────────────────────────────────────────────────────

// Known legitimate brands for typosquatting detection
const KNOWN_BRANDS = [
  'google', 'gmail', 'youtube', 'facebook', 'instagram', 'twitter',
  'paypal', 'amazon', 'apple', 'microsoft', 'netflix', 'linkedin',
  'dropbox', 'github', 'whatsapp', 'telegram', 'outlook', 'yahoo',
  'ebay', 'walmart', 'chase', 'wellsfargo', 'bankofamerica', 'citibank'
];

// Suspicious URL keywords often used in phishing paths
const SUSPICIOUS_URL_KEYWORDS = [
  'login', 'verify', 'secure', 'account', 'update', 'confirm',
  'banking', 'suspended', 'urgent', 'validate', 'password', 'signin',
  'webscr', 'cmd=', 'authenticate', 'credential'
];

// Urgency/phishing keywords for email body analysis
const URGENCY_WORDS = [
  'immediately', 'urgent', 'suspended', 'verify now', 'account locked',
  'click here', 'limited time', 'act now', 'expires today', 'final notice',
  'security alert', 'unauthorized access', 'confirm your identity',
  'unusual activity', 'your account will be closed'
];

// Shannon entropy — measures randomness in a string
// High entropy = lots of random characters = suspicious (e.g. base64 encoded payloads)
const calculateEntropy = (str) => {
  const freq = {};
  for (const char of str) {
    freq[char] = (freq[char] || 0) + 1;
  }
  return Object.values(freq).reduce((entropy, count) => {
    const p = count / str.length;
    return entropy - p * Math.log2(p);
  }, 0);
};

// Levenshtein distance — measures how similar two strings are
// Used to detect near-matches like "paypa1" vs "paypal"
const levenshtein = (a, b) => {
  const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] = b[i - 1] === a[j - 1]
        ? matrix[i - 1][j - 1]
        : Math.min(matrix[i - 1][j - 1], matrix[i - 1][j], matrix[i][j - 1]) + 1;
    }
  }
  return matrix[b.length][a.length];
};

const checkURL = (url) => {
  const reasons = [];
  let riskScore = 0;

  let parsedURL;
  try {
    parsedURL = new URL(url);
  } catch {
    return { verdict: 'UNSAFE', confidence: 0.99, reasons: ['Invalid or malformed URL'], riskScore: 1 };
  }

  const hostname = parsedURL.hostname.toLowerCase();
  const fullUrl = url.toLowerCase();

  // Check 1: No SSL (HTTP instead of HTTPS)
  if (parsedURL.protocol === 'http:') {
    reasons.push('No SSL certificate — connection is unencrypted (HTTP)');
    riskScore += 0.25;
  }

  // Check 2: IP address used instead of domain name
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) {
    reasons.push('IP address used instead of domain name — common in phishing');
    riskScore += 0.4;
  }

  // Check 3: High URL entropy (random-looking URL)
  const entropy = calculateEntropy(url);
  if (entropy > 4.5) {
    reasons.push(`High URL entropy (${entropy.toFixed(2)}) — URL contains unusual character patterns`);
    riskScore += 0.2;
  }

  // Check 4: Suspicious keywords in URL path or hostname
  const matchedKeywords = SUSPICIOUS_URL_KEYWORDS.filter(k => fullUrl.includes(k));
  if (matchedKeywords.length > 0) {
    reasons.push(`Suspicious keywords detected in URL: ${matchedKeywords.join(', ')}`);
    riskScore += 0.15 * Math.min(matchedKeywords.length, 3);
  }

  // Check 5: Too many subdomains (e.g. login.verify.secure.paypal.com)
  const parts = hostname.split('.');
  if (parts.length > 4) {
    reasons.push(`Excessive subdomains (${parts.length - 2}) — common phishing technique`);
    riskScore += 0.3;
  }

  // Check 6: Typosquatting detection
  const domainWithoutTLD = parts.slice(0, -1).join('.');
  for (const brand of KNOWN_BRANDS) {
    const distance = levenshtein(domainWithoutTLD, brand);
    if (distance > 0 && distance <= 2 && domainWithoutTLD !== brand) {
      reasons.push(`Domain closely mimics "${brand}" — possible typosquatting (${domainWithoutTLD})`);
      riskScore += 0.5;
      break;
    }
  }

  // Check 7: Very long URL (often used to obscure destination)
  if (url.length > 200) {
    reasons.push(`Unusually long URL (${url.length} characters)`);
    riskScore += 0.1;
  }

  // Check 8: URL contains @ symbol (tricks users — everything before @ is ignored)
  if (url.includes('@')) {
    reasons.push('URL contains @ symbol — this is used to disguise the real destination');
    riskScore += 0.45;
  }

  const confidence = Math.min(riskScore, 1.0);
  const verdict = confidence >= 0.5 ? 'UNSAFE' : 'SAFE';

  return { verdict, confidence: parseFloat(confidence.toFixed(2)), reasons, riskScore };
};

// ─── EMAIL CHECKS ────────────────────────────────────────────────────────────

const checkEmail = (sender, content) => {
  const reasons = [];
  let riskScore = 0;

  const senderLower = (sender || '').toLowerCase();
  const contentLower = (content || '').toLowerCase();

  // Extract domain from sender email address
  const emailMatch = senderLower.match(/@([a-z0-9.-]+)/);
  const senderDomain = emailMatch ? emailMatch[1] : null;

  // Check 1: Suspicious sender domain TLDs (.xyz, .top, .info, .tk, etc.)
  const suspiciousTLDs = ['.xyz', '.top', '.info', '.tk', '.ml', '.ga', '.cf', '.pw', '.zip'];
  if (senderDomain && suspiciousTLDs.some(tld => senderDomain.endsWith(tld))) {
    reasons.push(`Suspicious sender domain TLD (${senderDomain})`);
    riskScore += 0.3;
  }

  // Check 2: Sender domain typosquatting
  if (senderDomain) {
    const domainBase = senderDomain.split('.')[0];
    for (const brand of KNOWN_BRANDS) {
      const distance = levenshtein(domainBase, brand);
      if (distance > 0 && distance <= 2 && domainBase !== brand) {
        reasons.push(`Sender domain mimics "${brand}" (${senderDomain}) — possible spoofing`);
        riskScore += 0.45;
        break;
      }
    }
  }

  // Check 3: Urgency language in email body
  const matchedUrgency = URGENCY_WORDS.filter(w => contentLower.includes(w));
  if (matchedUrgency.length >= 2) {
    reasons.push(`High urgency language detected: "${matchedUrgency.slice(0, 2).join('", "')}"`);
    riskScore += 0.2 * Math.min(matchedUrgency.length, 3);
  }

  // Check 4: Suspicious URLs embedded in email body
  const urlRegex = /https?:\/\/[^\s"'<>]+/gi;
  const embeddedURLs = content.match(urlRegex) || [];
  const suspiciousLinks = embeddedURLs.filter(link => {
    const result = checkURL(link);
    return result.verdict === 'UNSAFE';
  });
  if (suspiciousLinks.length > 0) {
    reasons.push(`Email contains ${suspiciousLinks.length} suspicious link(s)`);
    riskScore += 0.4;
  }

  // Check 5: Generic greeting (phishing emails rarely use your real name)
  const genericGreetings = ['dear customer', 'dear user', 'dear account holder', 'dear valued member'];
  if (genericGreetings.some(g => contentLower.includes(g))) {
    reasons.push('Generic greeting used — legitimate organisations usually address you by name');
    riskScore += 0.15;
  }

  // Check 6: Requests for sensitive info
  const sensitiveRequests = ['social security', 'ssn', 'credit card', 'pin number', 'password', 'bank account'];
  const matchedSensitive = sensitiveRequests.filter(s => contentLower.includes(s));
  if (matchedSensitive.length > 0) {
    reasons.push('Email requests sensitive personal information — a major red flag');
    riskScore += 0.35;
  }

  const confidence = Math.min(riskScore, 1.0);
  const verdict = confidence >= 0.5 ? 'FAKE' : 'SAFE';

  return { verdict, confidence: parseFloat(confidence.toFixed(2)), reasons, riskScore };
};

module.exports = { checkURL, checkEmail, calculateEntropy };