/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx,scss}"],
    theme: {
        extend: {
            colors: {
                primary: "#3080ED",
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
