/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
    theme: {
        extend: {
            colors: {
                black: "#000000",
                white: "#FFFFFF",
                red: "#E60033",
                lightRed: "#EF454A",
                lightGreen: "#05D48C",
                chartRed: "#B40000",
                chartGreen: "#4CAF50",
                backBlack: "#131313",
                subBlack: "#262626",
                lightBlack: "#393939",
                darkGray: "#4C4C4C",
                textWhite: "#EAEAF2",
                textGray: "#9FA3C2",
                orbsPink: "#F266AB",
                orbsMagenta: "#D75CC7",
                orbsPurple: "#A55AEF",
                orbsIndigo: "#7B61FF",
                orbsBlue: "#45A9FF",
                freeColor00: "#FFDF96",
            },
        },
    },
    plugins: [],
};
