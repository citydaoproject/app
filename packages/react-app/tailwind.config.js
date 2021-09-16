module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontSize: {
      sm: "12px",
      base: "14px",
      lg: "16px",
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
