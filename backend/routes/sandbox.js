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
    const $ = cheerio.load(html)

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
            el.html(css.replace(/url\(['"]?(?!http|data)([^'")]+)['"]?\)/g, (match, p1) => {
                try {
                    return `url('${new URL(p1, baseUrl).href}')`
                } catch {
                    return "url('')"
                }
            }))
        }
    })

    // Add Aegis safety banner at the top
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
    ">
      🛡 <strong>Aegis Sandbox</strong>
      <span style="color:#6b7280">—</span>
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
    try {
        new URL(url)
    } catch {
        return res.status(400).json({ error: "Invalid URL format" })
    }

    try {
        const response = await axios.get(url, {
            timeout: 8000,
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; AegisAI-Sandbox/1.0)"
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

        return res.json({
            html: sanitised,
            original_url: url
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
        return res.status(502).json({
            error: "Could not fetch this page — the site may block sandbox requests"
        })
    }
})

module.exports = router