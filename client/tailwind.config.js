/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        yellow: {
          200: "#fff06c",
        },
        sky: {
          700: "#40659a",
        },
        whitesmoke: "#f0f0f0",
        dimgray: {
          100: "#686868",
          200: "#575757",
        },
        "background-1": "#161616",
        black: "#161616",
        gainsboro: {
          100: "#d9d9d9",
          200: "rgba(217, 217, 217, 0.3)",
        },
        white: "#fff",
        gray: {
          100: "#f4f4f4",
        },
        secondary: "#fff06c",
        "white-text": "#f4f4f4",
        primary: "#40659a",
      },
      fontFamily: {
        urbanist: "Urbanist",
        roboto: "Roboto",
      },
      borderRadius: {
        "8xs": "5px",
        "65xl": "84px",
        mini: "15px",
      },
      fontSize: {
        xl: "20px",
        "2xl": "22px",
        "5xl": "24px",
        "6xl": "50px",
        "16xl": "35px",
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
};
