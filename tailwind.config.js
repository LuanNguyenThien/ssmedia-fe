/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx,scss}"],
    theme: {
        extend: {
            colors: {
                primary: "#3080ED",
                "primary-black": "#262632",
                secondary: "#FFFFFF",
                background: "#FFFFFF",
                "background-blur":"#F5F7FB",
                title: "#3080ED",
                subtitle: "black",
                text: "black",
            }

        },
    },
    plugins: [],
};
