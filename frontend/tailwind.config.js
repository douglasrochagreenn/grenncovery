import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],
  safelist: ["dark"],
  prefix: "",

  content: [
    "./pages/**/*.{ts,tsx,vue}",
    "./components/**/*.{ts,tsx,vue}",
    "./app/**/*.{ts,tsx,vue}",
    "./src/**/*.{ts,tsx,vue}",
    "./src/**/**/*.{ts,tsx,vue}",
  ],
  theme: {
    screens: {
      "2xl": { max: "1920px" },
      // => @media (max-width: 1920px) { ... }

      xl: { max: "1440px" },
      // => @media (max-width: 1440px) { ... }

      lg: { max: "1080px" },
      // => @media (max-width: 1080px) { ... }

      "custom-footer": { max: "930px" },
      // => @media (max-width: 930px) { ... }

      md: { max: "767px" },
      // => @media (max-width: 767px) { ... }

      sm: { max: "425px" },
      // => @media (max-width: 425px) { ... }
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "2rem",
        sm: "2rem",
        md: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },
    extend: {
      colors: {
        border: "var(--border)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        icon: "var(--icon)",
        "icon-foreground": "var(--icon-foreground)",
        yellow: "var(--yellow)",
        label: "var(--label)",

        "text-primary": "var(--text-primary)",
        "text-primary-foreground": "var(--text-primary-foreground)",

        input: "var(--input)",
        "input-foreground": "var(--input-foreground)",

        "button-text": "var(--button-text)",
        "button-bg": "var(--button-bg)",

        "background-navbar": "var(--background-navbar)",
        "text-footer": "var(--text-footer)",

        green: "var(--green)",
        "white-solid": "var(--white-solid)",
        "dark-solid": "var(--dark-solid)",

        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
          light: "var(--destructive-light)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "collapsible-down": {
          from: { height: 0 },
          to: { height: "var(--radix-collapsible-content-height)" },
        },
        "collapsible-up": {
          from: { height: "var(--radix-collapsible-content-height)" },
          to: { height: 0 },
        },
        "infinite-scroll": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
        "pulse-dot": {
          from: { boxShadow: "0 0 0 0 rgba(242, 189, 0, 0.15)" },
          to: { boxShadow: "0 0 0 4px rgba(242, 189, 0, 0.25)" },
        },
        "spin-payment": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "pulse-payment": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "collapsible-down": "collapsible-down 0.2s ease-in-out",
        "collapsible-up": "collapsible-up 0.2s ease-in-out",
        "infinite-scroll": "infinite-scroll 25s linear infinite",
        "pulse-dot": "pulse-dot 1.5s infinite",
        spinPayment: "spin-payment 1.3s linear infinite",
        pulsePayment: "pulse-payment 1.3s ease-in-out infinite",
      },
      backgroundImage: {
        "custom-gradient": "linear-gradient(to bottom, #000000 0%, transparent 100%)",
      },
      screens: {},
    },
  },
  plugins: [animate],
};

export default config;
