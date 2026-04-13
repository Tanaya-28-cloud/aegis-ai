import Link from "next/link"
import { useRouter } from "next/router"

export default function Navbar() {
    const router = useRouter()

    // This highlights the active page link
    const isActive = (path) => router.pathname === path

    return (
        <nav className="bg-gray-900 border-b border-gray-800 px-8 py-4 flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="text-teal-400 font-bold text-xl">
                Aegis AI
            </Link>

            {/* Navigation links */}
            <div className="flex gap-6">
                <Link
                    href="/email-checker"
                    className={`text-sm transition ${isActive("/email-checker")
                        ? "text-teal-400 font-semibold"
                        : "text-gray-400 hover:text-white"
                        }`}
                >
                    Email Checker
                </Link>

                <Link
                    href="/url-checker"
                    className={`text-sm transition ${isActive("/url-checker")
                        ? "text-teal-400 font-semibold"
                        : "text-gray-400 hover:text-white"
                        }`}
                >
                    URL Checker
                </Link>
            </div>
        </nav>
    )
}