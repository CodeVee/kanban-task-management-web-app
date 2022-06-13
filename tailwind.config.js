/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'white': '#ffffff',
      'purple': {
        light: '#a8a4ff',
        DEFAULT: '#635fc7',
      },
      'red': {
        light: '#ff9898',
        DEFAULT: '#ea5555',
      },
      'grey': {
        light: '#f4f7fd',
        medium: '#828fa3',
        dark: '#2b2c37',
        vdark: '#20212c',
      },
      'lines': {
        light: '#eaebfa',
        dark: '#3e3f4e',
      },
      'black': '#000112',
    },
    fontSize: {
      ms: '1.3rem',
      sm: '1.2rem',
      md: '1.5rem',
      lg: '1.8rem',
      xl: '2.4rem',
    },
    lineHeight: {
      ms: '2.3rem',
      sm: '1.5rem',
      md: '1.9rem',
      lg: '2.3rem',
      xl: '3rem',
    },
    letterSpacing: {
      sm: '.24rem',
    },
    extend: {
      spacing: {
        1.6: '1.6rem',
        3.2: '3.2rem',
      },
    },
  },
  plugins: [],
  darkMode: 'class'
}
