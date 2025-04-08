import { keyframes } from "node_modules/@emotion/react/dist/emotion-react.cjs";

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
                fadeInTop: {
                    "0%": {
                        opacity: "0",
                        transform: "translateY(-20px)",
                    },
                    "100%": {
                        opacity: "1",
                        transform: "translateY(0)",
                    },
                },
            },
            animation: {
                fadeInTop: "fadeInTop 0.4s ease-out",
            },
        },
    },
    plugins: [],
};
