import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        custom: "3px 3px 0 #7e7e7e",
      },
      transitionProperty: {
        scale: "scale",
      },
    },
  },
  plugins: [require("daisyui")],
};
export default config;
