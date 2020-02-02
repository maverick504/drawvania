const { colors } = require('tailwindcss/defaultTheme')

module.exports = {
  important: true,
  theme: {
    screens: {
      xl: '1112px'
    },
    fontFamily: {
      display: ['Gilroy', 'sans-serif'],
      body: ['Graphik', 'sans-serif'],
    },
    colors: {
      // Color palette: https://flatuicolors.com/palette/tr
      white: colors.white,
      black: colors.black,
      gray: colors.gray,
      primary: {
        'lighter': colors.indigo['300'],
        'default': colors.indigo['500'],
        'darker': colors.indigo['700'],
        '100': colors.indigo['100'],
        '200': colors.indigo['200'],
        '300': colors.indigo['300'],
        '400': colors.indigo['400'],
        '500': colors.indigo['500'],
        '600': colors.indigo['600'],
        '700': colors.indigo['700'],
        '800': colors.indigo['800'],
        '900': colors.indigo['900']
      },
      green: {
        'lighter': colors.green['300'],
        'default': colors.green['500'],
        'darker': colors.green['700'],
      },
      orange: {
        'lighter': colors.orange['300'],
        'default': colors.orange['500'],
        'darker': colors.orange['700'],
      },
      red: {
        'lighter': colors.red['300'],
        'default': colors.red['500'],
        'darker': colors.red['700'],
      },
      danger: {
        'default': colors.red['500'],
        '100': colors.red['100'],
        '200': colors.red['200'],
        '300': colors.red['300'],
        '400': colors.red['400'],
        '500': colors.red['500'],
        '600': colors.red['600'],
        '700': colors.red['700'],
        '800': colors.red['800'],
        '900': colors.red['900']
      },
      success: {
        'default': colors.green['500']
      },
      gold: {
        'default': colors.orange['500'],
      },
    },
    cursor: {
      pointer: 'pointer',
      help: 'help'
    },
    extend: {
      width: {
        '96': '24rem'
      },
      margin: {
        '-4': '-1rem',
        '-64': '-16rem'
      }
    }
  },
  variants: {
    opacity: ['responsive', 'hover']
  },
  plugins: [
    require('tailwindcss-accessibility')
  ]
}
