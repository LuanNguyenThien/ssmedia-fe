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
                "background-blur":"#F2F4F7",
                title: "#3080ED",
                subtitle: "black",
                text: "black",
            }

        },
    },
    plugins: [],
};
