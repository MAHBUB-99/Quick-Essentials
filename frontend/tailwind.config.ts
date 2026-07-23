import type { Config } from 'tailwindcss';

/**
 * Design tokens extracted verbatim from the source-of-truth HTML templates
 * (identical inline `tailwind.config` across every /templates/*.html file).
 * Do not change these values — they define the FarmFresh visual identity.
 */
const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
    },
  },
  plugins: [],
};

export default config;
