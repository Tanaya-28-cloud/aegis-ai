import { useState } from "react"
import axios from "axios"

export default function SandboxPreview({ url }) {
    const [html, setHtml] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [loaded, setLoaded] = useState(false)

    async function loadPreview() {
        setLoading(true)
        setError("")

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/sandbox-preview`,
                { url }
            )
            setHtml(response.data.html)
            setLoaded(true)
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Could not load preview for this URL"
            )
        } finally {
            setLoading(false)
        }
    }

    // Convert HTML string to a safe blob URL for the iframe
    function getIframeSrc() {
        const blob = new Blob([html], { type: "text/html" })
        return URL.createObjectURL(blob)
    }

    return (
        <div className="max-w-2xl mt-4">

            {/* Header bar */}
            <div className="flex items-center justify-between bg-gray-800
                      border border-gray-700 rounded-t-xl px-4 py-3">
                <div className="flex items-center gap-2">
                    <span className="text-teal-400 text-sm">🛡</span>
                    <span className="text-sm text-gray-300 font-medium">
                        Aegis Sandbox Preview
                    </span>
                </div>
                <span className="text-xs text-gray-500 bg-gray-900
                         px-2 py-1 rounded-full">
                    Scripts disabled
                </span>
            </div>

            {/* URL bar */}
            <div className="bg-gray-900 border-x border-gray-700 px-4 py-2
                      flex items-center gap-2">
                <span className="text-gray-600 text-xs">🔒</span>
                <span className="text-xs text-gray-400 font-mono truncate">
                    {url}
                </span>
            </div>

            {/* Preview area */}
            <div className="border border-gray-700 rounded-b-xl overflow-hidden
                      bg-gray-900 min-h-64">

                {/* Not loaded yet */}
                {!loaded && !loading && (
                    <div className="flex flex-col items-center justify-center
                          h-64 gap-4">
                        <p className="text-gray-400 text-sm text-center px-4">
                            This will render the website without executing any scripts,
                            forms, or links — completely safe to view.
                        </p>
                        <button
                            onClick={loadPreview}
                            className="bg-teal-500 hover:bg-teal-400 text-gray-950
                         font-semibold px-6 py-2 rounded-lg text-sm transition"
                        >
                            Load Safe Preview
                        </button>
                    </div>
                )}

                {/* Loading state */}
                {loading && (
                    <div className="flex flex-col items-center justify-center h-64 gap-3">
                        <div className="w-8 h-8 border-2 border-teal-500
                            border-t-transparent rounded-full animate-spin" />
                        <p className="text-gray-400 text-sm">
                            Fetching and sanitising page...
                        </p>
                    </div>
                )}

                {/* Error state */}
                {error && (
                    <div className="flex flex-col items-center justify-center h-64 gap-2">
                        <p className="text-red-400 text-sm">⚠ {error}</p>
                        <button
                            onClick={loadPreview}
                            className="text-xs text-gray-500 hover:text-gray-300 underline"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* Loaded — render in sandbox iframe */}
                {loaded && html && (
                    <iframe
                        src={getIframeSrc()}
                        className="w-full h-96 border-0"
                        sandbox=""
                        // sandbox="" with no values = maximum restriction
                        // No scripts, no forms, no popups, no top navigation
                        title="Sandboxed website preview"
                    />
                )}
            </div>

            {/* Safety notice */}
            <p className="text-xs text-gray-600 mt-2 text-center">
                All JavaScript, forms and links have been disabled in this preview.
                Your system is not at risk.
            </p>
        </div>
    )
}