module.exports = {
  content: ["/app.vue"],
  plugins: [require("@formkit/themes/tailwindcss")],
  darkMode: "class", // or 'class'
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--color-primary), <alpha-value>)",
        secondary: "rgb(var(--color-secondary), <alpha-value>)",
        success: "rgb(var(--color-success), <alpha-value>)",
        info: "rgb(var(--color-info), <alpha-value>)",
        warning: "rgb(var(--color-warning), <alpha-value>)",
        danger: "rgb(var(--color-danger), <alpha-value>)",
      },
    },
  },
};
