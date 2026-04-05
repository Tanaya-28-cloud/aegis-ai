import { useState } from "react"
import ResultCard from "@/components/ResultCard"

export default function EmailChecker() {
    const [sender, setSender] = useState("")
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)

    async function handleSubmit() {
        if (!sender || !content) return
        setLoading(true)
        setResult(null)

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
                    <label className="block text-sm text-gray-400 mb-1">Sender Email Address</label>
                    <input
                        type="email"
                        value={sender}
                        onChange={(e) => setSender(e.target.value)}
                        placeholder="e.g. support@paypa1.com"
                        className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-teal-500"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm text-gray-400 mb-1">Email Content</label>
                    <textarea
                        rows={6}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Paste the email body here..."
                        className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-teal-500"
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-teal-500 hover:bg-teal-400 disabled:bg-teal-800 disabled:cursor-not-allowed text-gray-950 font-semibold py-2 rounded-lg transition"
                >
                    {loading ? "Analysing..." : "Analyse Email"}
                </button>
            </div>

            {result && <ResultCard result={result} type="email" />}
        </main>
    )
}