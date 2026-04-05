export default function UrlChecker() {
    return (
        <main className="min-h-screen bg-gray-950 text-white p-8">
            <h1 className="text-3xl font-bold text-teal-400 mb-2">URL Checker</h1>
            <p className="text-gray-400 mb-8">Check if a website is safe before you visit it</p>

            <div className="max-w-2xl bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="mb-6">
                    <label className="block text-sm text-gray-400 mb-1">Enter URL</label>
                    <input
                        type="url"
                        placeholder="e.g. https://paypa1-login.com"
                        className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-teal-500"
                    />
                </div>

                <button className="w-full bg-teal-500 hover:bg-teal-400 text-gray-950 font-semibold py-2 rounded-lg transition">
                    Check URL
                </button>
            </div>
        </main>
    )
}