import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {colors: {
      primary: {
        DEFAULT: "#1E3A8A", // Example primary color
        10: "#EBF4FF", // Light shade
        20: "#C3DAFE", // Slightly darker shade
      },
    },},
  },
  plugins: [
    daisyui
  ],
  daisyui: {
    themes: ["light", "dark"], // Enable light and dark themes
  },
  darkMode: "class", // Ensures you can toggle dark mode via the `dark` class
};
