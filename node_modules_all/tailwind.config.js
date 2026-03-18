import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#0b1220",
          800: "#131c2e"
        }
      }
    }
  },
  plugins: [forms, typography]
};
