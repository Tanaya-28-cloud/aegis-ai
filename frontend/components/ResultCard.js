export default function ResultCard({ result, type }) {
    // type is either "email" or "url"
    const isUnsafe = result.verdict === "FAKE" || result.verdict === "UNSAFE"
    const verdictLabel = result.verdict === "FAKE"
        ? "⚠ Phishing Detected"
        : result.verdict === "UNSAFE"
            ? "⚠ Unsafe URL"
            : "✓ Safe"

    return (
        <div className={`max-w-2xl mt-6 rounded-xl p-6 border ${isUnsafe
                ? "bg-red-950 border-red-800"
                : "bg-green-950 border-green-800"
            }`}>

            {/* Verdict + confidence */}
            <div className="flex items-center justify-between mb-4">
                <span className={`text-2xl font-bold ${isUnsafe ? "text-red-400" : "text-green-400"
                    }`}>
                    {verdictLabel}
                </span>
                <span className="text-sm text-gray-400">
                    {Math.round(result.confidence * 100)}% confidence
                </span>
            </div>

            {/* Reasons */}
            <div className="mb-4">
                <p className="text-sm font-semibold text-gray-300 mb-2">
                    Reasons detected:
                </p>
                <ul className="space-y-1">
                    {result.reasons.map((reason, i) => (
                        <li key={i} className="text-sm text-gray-400 flex gap-2">
                            <span className="text-red-400 mt-0.5">•</span>
                            {reason}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Precautions — only for email */}
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

            {/* Sandbox notice — only for URL */}
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