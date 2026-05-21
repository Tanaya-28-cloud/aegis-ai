// sandbox.js — /api/sandbox-preview
// Fetches a webpage, strips all dangerous elements,
// and returns clean HTML safe to render in an iframe

const express = require("express")
const router = express.Router()
const axios = require("axios")
const cheerio = require("cheerio")

// Tags that execute code or load external resources
const DANGEROUS_TAGS = [
    "script",
    "iframe",
    "object",
    "embed",
    "applet",
    "meta[http-equiv]"
]

// Attributes that can execute JavaScript or cause navigation
const DANGEROUS_ATTRS = [
    "onclick", "onload", "onerror", "onmouseover", "onfocus",
    "onblur", "onchange", "onsubmit", "onkeydown", "onkeyup",
    "onkeypress", "formaction", "data-href", "xlink:href"
]

function sanitiseHTML(html, baseUrl) {
    const $ = cheerio.load(html, { decodeEntities: false })

    // ── Bug fix: ensure UTF-8 charset is declared so emoji/unicode
    //   in our injected banner always renders correctly regardless
    //   of the original page's charset declaration ─────────────────
    // Remove any existing charset meta to avoid conflicts
    $("meta[charset]").remove()
    $("meta[http-equiv='Content-Type']").remove()
    $("meta[http-equiv='content-type']").remove()

    // Inject our own charset declaration at the top of <head>
    if ($("head").length) {
        $("head").prepend('<meta charset="utf-8">')
    } else {
        // No <head> — create one
        if ($("html").length) {
            $("html").prepend("<head><meta charset=\"utf-8\"></head>")
        } else {
            $.root().prepend("<head><meta charset=\"utf-8\"></head>")
        }
    }

    // Remove all dangerous tags completely
    DANGEROUS_TAGS.forEach(tag => $(tag).remove())

    // Remove all <link rel="stylesheet"> — prevents external CSS loading
    $("link").each(function () {
        const rel = $(this).attr("rel") || ""
        if (rel.includes("stylesheet")) $(this).remove()
    })

    // Replace all forms with a safe placeholder
    $("form").each(function () {
        $(this).replaceWith(
            `<div style="border:1px dashed #444;padding:10px;
       color:#888;font-size:12px;border-radius:4px;margin:8px 0">
       [Form removed for your safety]
       </div>`
        )
    })

    // Process all elements
    $("*").each(function () {
        const el = $(this)

        // Remove dangerous event attributes
        DANGEROUS_ATTRS.forEach(attr => el.removeAttr(attr))

        // Convert all links to non-clickable
        if (this.name === "a") {
            el.removeAttr("href")
            el.attr("title", "Links are disabled in sandbox preview")
            el.css({
                cursor: "default",
                "text-decoration": "underline",
                color: "#2dd4bf"
            })
        }

        // Fix relative image URLs to absolute
        if (this.name === "img") {
            const src = el.attr("src")
            if (src && !src.startsWith("http") && !src.startsWith("data:")) {
                try {
                    el.attr("src", new URL(src, baseUrl).href)
                } catch {
                    el.removeAttr("src")
                }
            }
            // Remove srcset — can load external resources
            el.removeAttr("srcset")
        }

        // Fix relative CSS background images
        if (this.name === "style") {
            const css = el.html() || ""
            el.html(css.replace(/url\(['"']?(?!http|data)([^'"')]+)['"']?\)/g, (match, p1) => {
                try {
                    return `url('${new URL(p1, baseUrl).href}')`
                } catch {
                    return "url('')"
                }
            }))
        }
    })

    // ── Inject Aegis safety banner
    // Use HTML entity for the shield emoji to avoid charset issues
    $("body").prepend(`
    <div style="
      position: sticky;
      top: 0;
      z-index: 99999;
      background: #0d1117;
      color: #2dd4bf;
      padding: 8px 16px;
      font-size: 12px;
      font-family: monospace;
      border-bottom: 2px solid #2dd4bf;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.5);
    ">
      &#x1F6E1; <strong>Aegis Sandbox</strong>
      <span style="color:#6b7280">&mdash;</span>
      <span style="color:#9ca3af">
        Scripts, forms and links have been disabled for your safety
      </span>
    </div>
  `)

    return $.html()
}

router.post("/", async (req, res) => {
    const { url } = req.body

    if (!url) {
        return res.status(400).json({ error: "url is required" })
    }

    // Basic URL validation
    let parsedUrl
    try {
        parsedUrl = new URL(url)
    } catch {
        return res.status(400).json({ error: "Invalid URL format" })
    }

    // Only allow http and https — block file://, data:, javascript:, etc.
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        return res.status(400).json({ error: "Only http and https URLs are supported" })
    }

    try {
        const response = await axios.get(url, {
            timeout: 8000,
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; AegisAI-Sandbox/1.0)",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
            },
            maxContentLength: 2 * 1024 * 1024, // 2MB max
            responseType: "text"
        })

        const contentType = response.headers["content-type"] || ""

        if (!contentType.includes("text/html")) {
            return res.status(400).json({
                error: "This URL does not return an HTML page and cannot be previewed"
            })
        }

        const sanitised = sanitiseHTML(response.data, url)

        // Return with explicit UTF-8 header so the JSON transport is clean
        return res.json({
            html: sanitised,
            original_url: url,
            content_type: contentType
        })

    } catch (err) {
        if (err.code === "ECONNABORTED") {
            return res.status(504).json({
                error: "Page took too long to load — try a different URL"
            })
        }
        if (err.response?.status === 403) {
            return res.status(403).json({
                error: "This website blocks external access and cannot be previewed"
            })
        }
        if (err.response?.status === 404) {
            return res.status(404).json({
                error: "Page not found — the URL returned a 404 error"
            })
        }
        return res.status(502).json({
            error: "Could not fetch this page — the site may block sandbox requests"
        })
    }
})

module.exports = router