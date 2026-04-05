import { useState } from "react"
import ResultCard from "@/components/ResultCard"

export default function UrlChecker() {
    const [url, setUrl] = useState("")
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)

    async function handleSubmit() {
        if (!url) return
        setLoading(true)
        setResult(null)

        await new Promise(resolve => setTimeout(resolve, 1500))

        setResult({
            verdict: "UNSAFE",
            confidence: 0.97,
            reasons: [
                "Domain closely mimics paypal.com (typosquatting)",
                "No valid SSL certificate found",
                "Domain registered only 3 days ago",
                "URL path contains login-harvest pattern"
            ],
            safe_to_preview: false
        })
        setLoading(false)
    }

    return (
        <main className="min-h-screen bg-gray-950 text-white p-8">
            <h1 className="text-3xl font-bold text-teal-400 mb-2">URL Checker</h1>
            <p className="text-gray-400 mb-8">Check if a website is safe before you visit it</p>

            <div className="max-w-2xl bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="mb-6">
                    <label className="block text-sm text-gray-400 mb-1">Enter URL</label>
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="e.g. https://paypa1-login.com"
                        className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-teal-500"
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-teal-500 hover:bg-teal-400 disabled:bg-teal-800 disabled:cursor-not-allowed text-gray-950 font-semibold py-2 rounded-lg transition"
                >
                    {loading ? "Checking..." : "Check URL"}
                </button>
            </div>

            {result && <ResultCard result={result} type="url" />}
        </main>
    )
}