import type { Config } from 'tailwindcss';

export default <Partial<Config>>{
  content: ['./components/**/*.{js,vue,ts}', './layouts/**/*.vue', './pages/**/*.vue', './plugins/**/*.{js,ts}', './nuxt.config.{js,ts}', './app.vue'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1920px',
      },
    },
    extend: {
      colors: {
        primary: {
          light: '#AE7DDD',
          DEFAULT: process.env.PRIMARY_COLOR || '#7F54B2',
          dark: '#754fa3',
        },
      },
      aspectRatio: {
        '9/8': '1 / 1.125',
      },
      maxWidth: {
        site: '1920px',
      },
      screens: {
        '2xl': '1920px',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
