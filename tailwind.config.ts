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
  daisyui: {
    themes: [
      "dark",
      {
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          ".transparentBg": {
            "--tw-bg-opacity": ".3",
            "backdrop-filter": "blur(6px)",
            // "background-color":
            //   "var(--fallback-b1,oklch(var(--b1)/var(--tw-bg-opacity)))",
          },
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
export default config;
