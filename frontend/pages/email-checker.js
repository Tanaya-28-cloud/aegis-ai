import { useState } from "react"

export default function EmailChecker() {
    // These four variables are your page's memory
    const [sender, setSender] = useState("")
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)

    // This runs when the user clicks "Analyse Email"
    async function handleSubmit() {
        // Don't submit if fields are empty
        if (!sender || !content) return

        setLoading(true)   // show the loading spinner
        setResult(null)    // clear any previous result

        // MOCK DATA — we replace this with a real API call in Phase 6
        // This simulates a 1.5 second delay like a real network request
        await new Promise(resolve => setTimeout(resolve, 1500))

        const mockResult = {
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
        }

        setResult(mockResult)  // store the result so it appears on screen
        setLoading(false)      // hide the loading spinner
    }

    return (
        <main className="min-h-screen bg-gray-950 text-white p-8">
            <h1 className="text-3xl font-bold text-teal-400 mb-2">Email Checker</h1>
            <p className="text-gray-400 mb-8">Detect phishing and fake emails instantly</p>

            <div className="max-w-2xl bg-gray-900 rounded-xl p-6 border border-gray-800">

                {/* Sender field — onChange updates the sender variable */}
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

                {/* Content field — onChange updates the content variable */}
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

                {/* Button — disabled while loading */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-teal-500 hover:bg-teal-400 disabled:bg-teal-800 disabled:cursor-not-allowed text-gray-950 font-semibold py-2 rounded-lg transition"
                >
                    {loading ? "Analysing..." : "Analyse Email"}
                </button>
            </div>

            {/* Result card — only shows when result is not null */}
            {result && (
                <div className={`max-w-2xl mt-6 rounded-xl p-6 border ${result.verdict === "FAKE"
                        ? "bg-red-950 border-red-800"
                        : "bg-green-950 border-green-800"
                    }`}>

                    {/* Verdict + confidence */}
                    <div className="flex items-center justify-between mb-4">
                        <span className={`text-2xl font-bold ${result.verdict === "FAKE" ? "text-red-400" : "text-green-400"
                            }`}>
                            {result.verdict === "FAKE" ? "⚠ Phishing Detected" : "✓ Email is Safe"}
                        </span>
                        <span className="text-sm text-gray-400">
                            {Math.round(result.confidence * 100)}% confidence
                        </span>
                    </div>

                    {/* Reasons */}
                    <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-300 mb-2">Reasons detected:</p>
                        <ul className="space-y-1">
                            {result.reasons.map((reason, i) => (
                                <li key={i} className="text-sm text-gray-400 flex gap-2">
                                    <span className="text-red-400 mt-0.5">•</span>
                                    {reason}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Precautions */}
                    <div>
                        <p className="text-sm font-semibold text-gray-300 mb-2">What to do:</p>
                        <ul className="space-y-1">
                            {result.precautions.map((p, i) => (
                                <li key={i} className="text-sm text-gray-400 flex gap-2">
                                    <span className="text-teal-400 mt-0.5">→</span>
                                    {p}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </main>
    )
}