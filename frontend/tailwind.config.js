/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#fff",
        gray: {
          100: "#757575",
          200: "#202124",
          300: "#1d1b20",
        },
        black: "#000",
        lavender: "#eee0fe",
        mediumslateblue: "#704ee7",
        darkslategray: "#454545",
        gainsboro: "rgba(217, 217, 217, 0.6)",
        whitesmoke: {
          100: "#f7f7f7",
          200: "#f5f5f5",
          300: "#edeef0",
        },
        green: "#008000",
        blueviolet: "#5f39e4",
        dimgray: "#544d4f",
      },
      fontFamily: {
        roboto: "Roboto",
        poppins: "Poppins",
      },
    },
  },
  plugins: [],
}; 