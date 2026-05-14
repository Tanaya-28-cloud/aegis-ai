import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">

      {/* Hero section */}
      <section className="flex flex-col items-center justify-center text-center px-8 py-24">
        <div className="inline-block bg-teal-900 text-teal-300 text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-widest">
          AI-Powered Cybersecurity
        </div>

        <h1 className="text-5xl font-bold mb-4 leading-tight">
          Stay safe from
          <span className="text-teal-400"> phishing attacks</span>
        </h1>

        <p className="text-gray-400 text-lg max-w-xl mb-10">
          Aegis AI detects fake emails, unsafe URLs, and protects your browsing
          in real time — powered by fine-tuned AI models, not just rules.
        </p>

        <div className="flex gap-4">
          <Link
            href="/email-checker"
            className="bg-teal-500 hover:bg-teal-400 text-gray-950 font-semibold px-6 py-3 rounded-lg transition"
          >
            Check an Email
          </Link>
          <Link
            href="/url-checker"
            className="border border-gray-700 hover:border-teal-500 text-gray-300 hover:text-white px-6 py-3 rounded-lg transition"
          >
            Check a URL
          </Link>
        </div>
      </section>

      {/* Feature cards */}
      <section className="px-8 pb-24 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10 text-gray-200">
          Three layers of protection
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-3xl mb-4">✉</div>
            <h3 className="text-lg font-semibold text-teal-400 mb-2">
              Email Detection
            </h3>
            <p className="text-gray-400 text-sm">
              Paste any suspicious email. Our fine-tuned DistilBERT model
              detects phishing patterns, urgency tactics, and domain spoofing.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-3xl mb-4">🔗</div>
            <h3 className="text-lg font-semibold text-teal-400 mb-2">
              URL Safety Check
            </h3>
            <p className="text-gray-400 text-sm">
              Enter any URL and get an instant safety verdict. Aegis checks SSL,
              domain age, typosquatting, and blacklists in real time.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-3xl mb-4">🛡</div>
            <h3 className="text-lg font-semibold text-teal-400 mb-2">
              Browser Extension
            </h3>
            <p className="text-gray-400 text-sm">
              Install the Aegis AI extension and get automatic protection.
              Unsafe sites are blocked before they load.
            </p>
          </div>

        </div>
      </section>

      {/* How it works section */}
      <section className="bg-gray-900 border-t border-gray-800 px-8 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-200">How it works</h2>
          <p className="text-gray-400 mb-12">
            Three layers of intelligence work together on every scan
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">

            <div className="bg-gray-800 rounded-xl p-5 flex-1">
              <p className="text-teal-400 font-bold text-sm mb-1">Layer 1</p>
              <p className="text-white font-semibold mb-1">Rule Engine</p>
              <p className="text-gray-400 text-xs">
                Instant checks — SSL, domain age, keyword patterns
              </p>
            </div>

            <div className="text-gray-600 text-2xl hidden md:block">→</div>

            <div className="bg-gray-800 rounded-xl p-5 flex-1">
              <p className="text-purple-400 font-bold text-sm mb-1">Layer 2</p>
              <p className="text-white font-semibold mb-1">AI Model</p>
              <p className="text-gray-400 text-xs">
                Fine-tuned DistilBERT — self-hosted, no API cost
              </p>
            </div>

            <div className="text-gray-600 text-2xl hidden md:block">→</div>

            <div className="bg-gray-800 rounded-xl p-5 flex-1">
              <p className="text-amber-400 font-bold text-sm mb-1">Layer 3</p>
              <p className="text-white font-semibold mb-1">Fallback API</p>
              <p className="text-gray-400 text-xs">
                Google Safe Browsing — only for edge cases
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Extension download section */}
      <section className="px-8 py-20 max-w-5xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-200">
          Browse with protection turned on
        </h2>
        <p className="text-gray-400 mb-8 max-w-lg mx-auto">
          The Aegis AI extension scans every page you visit automatically.
          Unsafe sites are blocked before they load.
        </p>

        <div className="inline-flex flex-col items-center gap-3">
          <a
            href="/aegis-ai-extension.zip"
            className="bg-teal-500 hover:bg-teal-400 text-gray-950 font-semibold px-8 py-3 rounded-lg transition flex items-center gap-2"
          >
            🛡 Download Chrome Extension
          </a>
          <p className="text-xs text-gray-600">
            Chrome · Manifest V3 · Open source
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-teal-400 font-semibold text-sm mb-1">Auto-scan</p>
            <p className="text-gray-400 text-xs">
              Every URL is checked against Aegis AI the moment you navigate to it
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-teal-400 font-semibold text-sm mb-1">Instant block</p>
            <p className="text-gray-400 text-xs">
              Phishing sites are intercepted before the page loads — not after
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-teal-400 font-semibold text-sm mb-1">Fail-safe</p>
            <p className="text-gray-400 text-xs">
              If the server is unreachable, you browse normally — never blocked
            </p>
          </div>
        </div>
      </section>

    </main >
  )
}