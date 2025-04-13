/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx,scss}"],
    theme: {
        extend: {
            colors: {
                primary: "#3080ED",
                "primary-black": "#262632",
                "primary-white": "#FFFFFF",
                secondary: "#FFFFFF",
                background: "#FFFFFF",
                "background-blur": "#F2F4F7",
                title: "#3080ED",
                subtitle: "black",
                text: "black",
            },
            keyframes: {
                "skeleton-animation": {
                    "0%, 100%": { opacity: 1, transform: "scale(1)" },
                    "50%": { opacity: 0.5, transform: "scale(1.01)" },
                },
            },
            animation: {
                "skeleton-animation": "skeleton-animation 1.5s ease-in-out infinite",
            },
        },
    },
    plugins: [],
};
