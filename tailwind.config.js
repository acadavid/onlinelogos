/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/views/**/*.html.erb',
    './app/helpers/**/*.rb',
    './app/assets/stylesheets/**/*.css',
    './app/javascript/**/*.js',
    './app/javascript/**/*.vue'
  ],
  theme: {
    extend: {
      colors: {
        'red': {
          500: '#ef4444',
          600: '#dc2626',
        },
        'blue': {
          500: '#3b82f6',
          600: '#2563eb',
        },
        'gray': {
          200: '#e5e7eb',
          400: '#9ca3af',
          500: '#6b7280',
        },
      },
    },
  },
  plugins: [],
}
