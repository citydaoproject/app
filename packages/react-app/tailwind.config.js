module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontSize: {
      sm: "12px",
      base: "14px",
      lg: "16px",
      xl: "20px",
      xxl: "28px",
    },
    extend: {
      colors: {
        "green-0": "rgba(153, 248, 181, 0.5)",
        "green-1": "#00FFA8",
        "green-2": "#038B5C",
      },
      lineHeight: {
        2: "10px",
      },
      padding: {
        "50px": "50px",
      },
      maxWidth: {
        "750px": "750px",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
