import { useState } from "react"
import ResultCard from "@/components/ResultCard"
import LoadingSkeleton from "@/components/LoadingSkeleton"

export default function EmailChecker() {
    const [sender, setSender] = useState("")
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState("")

    async function handleSubmit() {
        if (!sender && !content) {
            setError("Please enter both the sender email and email content.")
            return
        }
        if (!sender) {
            setError("Please enter the sender email address.")
            return
        }
        if (!content) {
            setError("Please paste the email content.")
            return
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(sender)) {
            setError("Please enter a valid email address format.")
            return
        }

        setError("")
        setLoading(true)
        setResult(null)

        // MOCK DATA — replaced with real API call in Phase 6
        await new Promise(resolve => setTimeout(resolve, 1500))

        setResult({
            verdict: "FAKE",
            confidence: 0.94,
            reasons: [
                "Domain misspelling detected (paypa1.com vs paypal.com)",
                "High urgency language pattern found",
                "Sender domain registered 4 days ago"
            ],
            precautions: [
                "Do not click any links in this email",
                "Report to your email provider as phishing",
                "Verify directly with the organisation via their official website"
            ]
        })
        setLoading(false)
    }

    return (
        <main className="min-h-screen bg-gray-950 text-white p-8">
            <h1 className="text-3xl font-bold text-teal-400 mb-2">Email Checker</h1>
            <p className="text-gray-400 mb-8">Detect phishing and fake emails instantly</p>

            <div className="max-w-2xl bg-gray-900 rounded-xl p-6 border border-gray-800">

                <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-1">
                        Sender Email Address
                    </label>
                    <input
                        type="email"
                        value={sender}
                        onChange={(e) => { setSender(e.target.value); setError("") }}
                        placeholder="e.g. support@paypa1.com"
                        className={`w-full bg-gray-800 text-white border rounded-lg px-4 py-2 focus:outline-none focus:border-teal-500 ${error && !sender ? "border-red-500" : "border-gray-700"
                            }`}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-1">
                        Email Content
                    </label>
                    <textarea
                        rows={6}
                        value={content}
                        onChange={(e) => { setContent(e.target.value); setError("") }}
                        placeholder="Paste the email body here..."
                        className={`w-full bg-gray-800 text-white border rounded-lg px-4 py-2 focus:outline-none focus:border-teal-500 ${error && !content ? "border-red-500" : "border-gray-700"
                            }`}
                    />
                </div>

                {error && (
                    <p className="text-red-400 text-sm mb-4">⚠ {error}</p>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-teal-500 hover:bg-teal-400 disabled:bg-teal-800 disabled:cursor-not-allowed text-gray-950 font-semibold py-2 rounded-lg transition"
                >
                    {loading ? "Analysing..." : "Analyse Email"}
                </button>
            </div>

            {loading && <LoadingSkeleton />}
            {result && !loading && <ResultCard result={result} type="email" />}
        </main>
    )
}