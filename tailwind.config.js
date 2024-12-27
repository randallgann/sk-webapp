/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        nav: '#166E48',
        chat: '#D3D3D3', // Change this to your desired color
        message: '#F0F0F0',
      },
    },
  },
  plugins: [],
};
