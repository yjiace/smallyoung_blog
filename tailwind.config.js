/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './.vitepress/**/*.{vue,ts,js,md}',
    './docs/**/*.md',
    './*.md',
  ],
  safelist: [
    // 动态拼接的颜色 class（DocCard / DocDetailPage 中通过 JS 生成）
    { pattern: /^bg-(blue|red|yellow|green|purple|pink|indigo|teal|orange|cyan)-(100|900)$/ },
    { pattern: /^text-(blue|red|yellow|green|purple|pink|indigo|teal|orange|cyan)-(800|200)$/ },
    { pattern: /^dark:bg-(blue|red|yellow|green|purple|pink|indigo|teal|orange|cyan)-(100|900)$/ },
    { pattern: /^dark:text-(blue|red|yellow|green|purple|pink|indigo|teal|orange|cyan)-(800|200)$/ },
    // ProductsPage 的进场动画工具类
    'animate-in',
    'slide-in-from-left',
    'slide-in-from-bottom-8',
    'zoom-in-95',
    'duration-700',
    'delay-200',
    'fill-mode-forwards',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#137fec',
        'background-light': '#f6f7f8',
        'background-dark': '#101922',
        'text-light': '#0d141b',
        'text-dark': '#e0e0e0',
        'card-light': '#ffffff',
        'card-dark': '#1a2530',
        'border-light': '#e7edf3',
        'border-dark': '#2c3a47',
      },
      fontFamily: {
        'display': ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'DEFAULT': '0.25rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        'full': '9999px',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
