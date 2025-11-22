/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {

                backBlack:"#131313",
                subBlack:"#262626",
                lightBlack:"#393939",
                darkGray:"#4C4C4C",

                textWhite:"#EAEAF2",
                textGray:"#9FA3C2",

                orbsPink:"#F266AB",
                orbsMagenta:"#D75CC7",
                orbsPurple:"#A55AEF",
                orbsIndigo:"#7B61FF",
                orbsBlue:"#45A9FF",

            },
        },
    },
    plugins: [],
};