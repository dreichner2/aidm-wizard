import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  important: true,
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        error: "var(--error)",
        'error-background': "var(--error-background)",
        link: "var(--link)",
        'link-hover': "var(--link-hover)",
        'url-valid': "var(--url-valid)",
        'url-invalid': "var(--url-invalid)",
      },
    },
  },
  plugins: [],
} satisfies Config;
