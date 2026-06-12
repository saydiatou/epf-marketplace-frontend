/** @type {import('tailwindcss').Config} */
export default {
  // Le `**/*` force Tailwind à descendre dans TOUS les sous-dossiers sans exception
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)',
      },
      borderRadius: {
        xl2: '1rem',
      },
    },
  },
  plugins: [],
}