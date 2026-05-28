# url_features.py
# Extracts numerical features from a URL for the ML classifier

import re
import math
from urllib.parse import urlparse

SUSPICIOUS_KEYWORDS = [
    "login", "signin", "verify", "secure", "account", "update",
    "confirm", "password", "credential", "wallet", "suspended",
    "banking", "recover", "unlock", "validate", "authenticate",
    "billing", "urgent", "alert", "support", "helpdesk"
]

SUSPICIOUS_TLDS = [
    ".tk", ".ml", ".ga", ".cf", ".gq", ".xyz", ".top",
    ".click", ".link", ".work", ".party", ".loan", ".download"
]


def get_feature_names():
    return [
        "url_length",
        "has_https",
        "has_ip",
        "has_at_symbol",
        "has_double_slash",
        "num_dots",
        "num_hyphens",
        "num_subdomains",
        "suspicious_keyword_count",
        "url_entropy",
        "digits_in_hostname",
        "path_length",
        "num_params",
        "has_suspicious_tld",
        "num_special_chars"
    ]


def calculate_entropy(text):
    """Calculate Shannon entropy of a string."""
    if not text:
        return 0
    freq = {}
    for c in text:
        freq[c] = freq.get(c, 0) + 1
    entropy = 0
    for count in freq.values():
        prob = count / len(text)
        entropy -= prob * math.log2(prob)
    return round(entropy, 4)


def features_to_vector(url):
    """Extract all features from a URL and return as a list."""
    try:
        parsed = urlparse(url)
        hostname = parsed.hostname or ""
        path = parsed.path or ""
        query = parsed.query or ""
    except Exception:
        # Return all zeros for unparseable URLs
        return [0] * len(get_feature_names())

    # 1. URL total length
    url_length = len(url)

    # 2. Has HTTPS
    has_https = 1 if parsed.scheme == "https" else 0

    # 3. Has IP address as hostname
    ip_pattern = r"^(\d{1,3}\.){3}\d{1,3}$"
    has_ip = 1 if re.match(ip_pattern, hostname) else 0

    # 4. Has @ symbol
    has_at_symbol = 1 if "@" in url else 0

    # 5. Has double slash in path (redirect trick)
    has_double_slash = 1 if "//" in path else 0

    # 6. Number of dots in full URL
    num_dots = url.count(".")

    # 7. Number of hyphens in hostname
    num_hyphens = hostname.count("-")

    # 8. Number of subdomains
    parts = hostname.split(".")
    num_subdomains = max(0, len(parts) - 2)

    # 9. Suspicious keyword count
    url_lower = url.lower()
    suspicious_keyword_count = sum(
        1 for kw in SUSPICIOUS_KEYWORDS if kw in url_lower
    )

    # 10. URL entropy
    url_entropy = calculate_entropy(url)

    # 11. Digits in hostname
    digits_in_hostname = sum(c.isdigit() for c in hostname)

    # 12. Path length
    path_length = len(path)

    # 13. Number of query parameters
    num_params = len(query.split("&")) if query else 0

    # 14. Has suspicious TLD
    has_suspicious_tld = 0
    for tld in SUSPICIOUS_TLDS:
        if hostname.endswith(tld):
            has_suspicious_tld = 1
            break

    # 15. Number of special characters
    special_chars = re.findall(r"[^a-zA-Z0-9\-._~:/?#\[\]@!$&'()*+,;=%]", url)
    num_special_chars = len(special_chars)

    return [
        url_length,
        has_https,
        has_ip,
        has_at_symbol,
        has_double_slash,
        num_dots,
        num_hyphens,
        num_subdomains,
        suspicious_keyword_count,
        url_entropy,
        digits_in_hostname,
        path_length,
        num_params,
        has_suspicious_tld,
        num_special_chars
    ]