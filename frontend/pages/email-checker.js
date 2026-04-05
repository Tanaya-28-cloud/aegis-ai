export default function EmailChecker() {
    return (
        <main className="min-h-screen bg-gray-950 text-white p-8">
            <h1 className="text-3xl font-bold text-teal-400 mb-2">Email Checker</h1>
            <p className="text-gray-400 mb-8">Detect phishing and fake emails instantly</p>

            <div className="max-w-2xl bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-1">Sender Email Address</label>
                    <input
                        type="email"
                        placeholder="e.g. support@paypa1.com"
                        className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-teal-500"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm text-gray-400 mb-1">Email Content</label>
                    <textarea
                        rows={6}
                        placeholder="Paste the email body here..."
                        className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-teal-500"
                    />
                </div>

                <button className="w-full bg-teal-500 hover:bg-teal-400 text-gray-950 font-semibold py-2 rounded-lg transition">
                    Analyse Email
                </button>
            </div>
        </main>
    )
}