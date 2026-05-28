/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,jsx}",
        "./components/**/*.{js,jsx}",
    ],
    theme: {
        extend: {
            colors: {
                cyber: {
                    black: "#020b0b",
                    dark: "#030f0f",
                    card: "#041414",
                    border: "#0d3b3b",
                    dim: "#0a2a2a",
                    green: "#00ff9d",
                    teal: "#00c9a7",
                    aqua: "#00e5ff",
                    peacock: "#008b8b",
                    glow: "#00ff9d33",
                    muted: "#4a9e8a",
                }
            },
            fontFamily: {
                mono: ["'Share Tech Mono'", "monospace"],
                display: ["'Orbitron'", "monospace"],
                body: ["'Exo 2'", "sans-serif"],
            },
            animation: {
                "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
                "scan": "scan 3s linear infinite",
                "flicker": "flicker 4s linear infinite",
                "grid-move": "gridMove 20s linear infinite",
                "glow-pulse": "glowPulse 2s ease-in-out infinite",
                "float": "float 6s ease-in-out infinite",
                "typewriter": "typewriter 3s steps(40) forwards",
            },
            keyframes: {
                scan: {
                    "0%": { transform: "translateY(-100%)" },
                    "100%": { transform: "translateY(100vh)" },
                },
                flicker: {
                    "0%, 95%, 100%": { opacity: 1 },
                    "96%": { opacity: 0.4 },
                    "97%": { opacity: 1 },
                    "98%": { opacity: 0.2 },
                },
                glowPulse: {
                    "0%, 100%": { boxShadow: "0 0 20px #00ff9d33" },
                    "50%": { boxShadow: "0 0 40px #00ff9d66, 0 0 80px #00ff9d22" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-10px)" },
                },
                gridMove: {
                    "0%": { backgroundPosition: "0 0" },
                    "100%": { backgroundPosition: "40px 40px" },
                },
                typewriter: {
                    "0%": { width: "0" },
                    "100%": { width: "100%" },
                }
            },
            backdropBlur: {
                xs: "2px",
            }
        },
    },
    plugins: [],
}