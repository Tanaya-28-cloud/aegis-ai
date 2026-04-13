export default function ResultCard({ result, type }) {
    const isUnsafe = result.verdict === "FAKE" || result.verdict === "UNSAFE"

    const verdictLabel = result.verdict === "FAKE"
        ? "⚠ Phishing Detected"
        : result.verdict === "UNSAFE"
            ? "⚠ Unsafe URL"
            : "✓ Safe"

    const confidencePct = Math.round(result.confidence * 100)

    return (
        <div className={`max-w-2xl mt-6 rounded-xl p-6 border ${isUnsafe ? "bg-red-950 border-red-800" : "bg-green-950 border-green-800"
            }`}>

            {/* Verdict */}
            <div className="flex items-center justify-between mb-4">
                <span className={`text-2xl font-bold ${isUnsafe ? "text-red-400" : "text-green-400"
                    }`}>
                    {verdictLabel}
                </span>
                <span className="text-sm text-gray-400">
                    {confidencePct}% confidence
                </span>
            </div>

            {/* Confidence meter */}
            <div className="mb-6">
                <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full transition-all duration-700 ${isUnsafe ? "bg-red-500" : "bg-green-500"
                            }`}
                        style={{ width: `${confidencePct}%` }}
                    />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    Model confidence score
                </p>
            </div>

            {/* Reasons */}
            <div className="mb-4">
                <p className="text-sm font-semibold text-gray-300 mb-2">
                    Reasons detected:
                </p>
                <ul className="space-y-1">
                    {result.reasons.map((reason, i) => (
                        <li key={i} className="text-sm text-gray-400 flex gap-2">
                            <span className={`mt-0.5 ${isUnsafe ? "text-red-400" : "text-green-400"}`}>
                                •
                            </span>
                            {reason}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Precautions — email only */}
            {type === "email" && result.precautions && (
                <div>
                    <p className="text-sm font-semibold text-gray-300 mb-2">
                        What to do:
                    </p>
                    <ul className="space-y-1">
                        {result.precautions.map((p, i) => (
                            <li key={i} className="text-sm text-gray-400 flex gap-2">
                                <span className="text-teal-400 mt-0.5">→</span>
                                {p}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Sandbox notice — URL only */}
            {type === "url" && (
                <div className={`mt-4 p-3 rounded-lg text-sm ${result.safe_to_preview
                        ? "bg-green-900 text-green-300"
                        : "bg-gray-800 text-gray-400"
                    }`}>
                    {result.safe_to_preview
                        ? "→ Sandboxed preview available below"
                        : "→ Preview disabled — this URL is unsafe to render"}
                </div>
            )}
        </div>
    )
}