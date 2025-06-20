/** @type {import('tailwindcss').Config} */
export default {
    "content": [
      "./src/**/*.{js,jsx,ts,tsx}"
    ],
    "theme": {
      "extend": {
        "colors": {
          "lavender": "#eee0fe",
          "gray": {
            "100": "#222",
            "200": "#1d1b20",
            "300": "rgba(255, 255, 255, 0.8)"
          },
          "darkslategray": "#454545",
          "dimgray": "#555",
          "white": "#fff",
          "gainsboro": "#d9d9d9",
          "darkgray": "#b3b3b3",
          "blueviolet": "#6d4ae7"
        },
        "fontFamily": {
          "roboto": "Roboto",
          "inter": "Inter",
          "poppins": "Poppins"
        }
      }
    },
    "corePlugins": {
      "preflight": false
    }
  }