/** @type {import('tailwindcss').Config} */

export default {
  darkMode: ["class"],

  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",

        card: {
          DEFAULT: "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))",
        },

        popover: {
          DEFAULT: "oklch(var(--popover))",
          foreground: "oklch(var(--popover-foreground))",
        },

        primary: {
          DEFAULT: "oklch(var(--primary))",
          foreground: "oklch(var(--primary-foreground))",
          soft: "oklch(var(--primary-soft))",
          "soft-foreground": "oklch(var(--primary-soft-foreground))",
        },

        secondary: {
          DEFAULT: "oklch(var(--secondary))",
          foreground: "oklch(var(--secondary-foreground))",
        },

        muted: {
          DEFAULT: "oklch(var(--muted))",
          foreground: "oklch(var(--muted-foreground))",
        },

        accent: {
          DEFAULT: "oklch(var(--accent))",
          foreground: "oklch(var(--accent-foreground))",
        },

        destructive: {
          DEFAULT: "oklch(var(--destructive))",
          foreground: "oklch(var(--destructive-foreground))",
        },

        success: {
          DEFAULT: "oklch(var(--success))",
          foreground: "oklch(var(--success-foreground))",
        },

        warning: {
          DEFAULT: "oklch(var(--warning))",
          foreground: "oklch(var(--warning-foreground))",
        },

        border: "oklch(var(--border))",
        input: "oklch(var(--input))",
        ring: "oklch(var(--ring))",

        task: "oklch(var(--task))",
        bill: "oklch(var(--bill))",
        maintenance: "oklch(var(--maintenance))",

        sidebar: {
          DEFAULT: "oklch(var(--sidebar))",
          foreground: "oklch(var(--sidebar-foreground))",

          primary: "oklch(var(--sidebar-primary))",
          "primary-foreground": "oklch(var(--sidebar-primary-foreground))",

          accent: "oklch(var(--sidebar-accent))",
          "accent-foreground": "oklch(var(--sidebar-accent-foreground))",

          border: "oklch(var(--sidebar-border))",
          ring: "oklch(var(--sidebar-ring))",
        },
      },

      borderRadius: {
        sm: "calc(var(--radius) - 6px)",
        md: "calc(var(--radius) - 3px)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 5px)",
        "2xl": "calc(var(--radius) + 10px)",
        "3xl": "calc(var(--radius) + 16px)",
        "4xl": "calc(var(--radius) + 24px)",
      },

      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "Inter", "ui-sans-serif", "sans-serif"],
      },

      boxShadow: {
        soft: "0 1px 2px oklch(0.45 0.06 250 / 0.05), 0 6px 20px -10px oklch(0.45 0.08 250 / 0.18)",

        lift: "0 2px 6px oklch(0.45 0.06 250 / 0.07), 0 18px 40px -18px oklch(0.45 0.09 250 / 0.28)",
      },

      keyframes: {
        "morada-pop": {
          "0%": {
            transform: "scale(0.85)",
            opacity: "0.5",
          },
          "60%": {
            transform: "scale(1.08)",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },

        "morada-rise": {
          from: {
            opacity: "0",
            transform: "translateY(10px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },

        "morada-shuffle": {
          "0%": {
            transform: "translateX(0) rotate(0deg)",
          },
          "30%": {
            transform: "translateX(-8px) rotate(-1.5deg)",
          },
          "70%": {
            transform: "translateX(8px) rotate(1.5deg)",
          },
          "100%": {
            transform: "translateX(0) rotate(0deg)",
          },
        },
      },

      animation: {
        "morada-pop": "morada-pop 260ms cubic-bezier(0.2, 0.9, 0.3, 1.2)",

        "morada-rise": "morada-rise 320ms cubic-bezier(0.2, 0.8, 0.3, 1) both",

        "morada-shuffle": "morada-shuffle 420ms ease-in-out",
      },
    },
  },

  plugins: [],
};
