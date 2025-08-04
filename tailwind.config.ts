import type { Config } from 'tailwindcss'

export default {
    content: [
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            transitionDuration: {
                "50": "50ms"
            }
        },
    },
    plugins: [],
} satisfies Config