// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          750: '#374151',
          850: '#1f2937',
        }
      },
      borderRadius: {
        'xl': '12px',
      }
    },
  },
  plugins: [],
}
