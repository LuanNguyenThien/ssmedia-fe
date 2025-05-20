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
                "skeleton-animation": {
                    "0%, 100%": { opacity: 1, transform: "scale(1)" },
                    "50%": { opacity: 0.5, transform: "scale(1.01)" },
                },
                "float-slow": {
                    "0%, 100%": {
                        transform: "translate(-50%, -50%) rotate(0deg)"
                    },
                    "50%": {
                        transform: "translate(-50%, -60%) rotate(5deg)"
                    }
                },
                "float-medium": {
                    "0%, 100%": {
                        transform: "translate(-50%, -50%) rotate(0deg)"
                    },
                    "50%": {
                        transform: "translate(-50%, -55%) rotate(-5deg)"
                    }
                },
                "float-fast": {
                    "0%, 100%": {
                        transform: "translate(-50%, -50%) rotate(0deg)"
                    },
                    "50%": {
                        transform: "translate(-50%, -52%) rotate(3deg)"
                    }
                },
                "bubble-float-1": {
                    "0%, 100%": {
                        transform: "translateY(0) scale(1)"
                    },
                    "50%": {
                        transform: "translateY(-20px) scale(1.05)"
                    }
                },
                "bubble-float-2": {
                    "0%, 100%": {
                        transform: "translateY(0) scale(1)"
                    },
                    "50%": {
                        transform: "translateY(-15px) scale(1.03)"
                    }
                },
                "bubble-float-3": {
                    "0%, 100%": {
                        transform: "translateY(0) scale(1)"
                    },
                    "50%": {
                        transform: "translateY(-25px) scale(1.07)"
                    }
                },
                "gradient-text": {
                    "0%": { backgroundPosition: "0% 50%" },
                    "50%": { backgroundPosition: "100% 50%" },
                    "100%": { backgroundPosition: "0% 50%" }
                }
            },
            animation: {
                fadeInTop: "fadeInTop 0.4s ease-out",
                "skeleton-animation": "skeleton-animation 1.5s ease-in-out infinite",
                "float-slow": "float-slow 7s ease-in-out infinite",
                "float-medium": "float-medium 5s ease-in-out infinite",
                "float-fast": "float-fast 3s ease-in-out infinite",
                "bubble-float-1": "bubble-float-1 8s ease-in-out infinite",
                "bubble-float-2": "bubble-float-2 6s ease-in-out infinite",
                "bubble-float-3": "bubble-float-3 10s ease-in-out infinite",
                "text": "gradient-text 3s ease infinite"
            },
            backgroundSize: {
                "200%": "200% 200%",
            },
        },
    },
    plugins: [],
};
