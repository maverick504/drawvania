module.exports = {
  important: true,
  theme: {
    screens: {
      lg: '1024px',
      xl: '1112px'
    },
    fontFamily: {
      display: ['Gilroy', 'sans-serif'],
      body: ['Graphik', 'sans-serif'],
    },
    colors: {
      // Color palette: https://flatuicolors.com/palette/tr
      white: '#fff',
      black: '#000',
      gray: {
        '100': '#f5f5f5',
        '200': '#eeeeee',
        '300': '#e0e0e0',
        '400': '#bdbdbd',
        '500': '#9e9e9e',
        '600': '#757575',
        '700': '#616161',
        '800': '#424242',
        '900': '#212121'
      },
      primary: {
        'lighter': '#8d79e7', // 30% lighter
        'default': '#7158e2'
      },
      green: {
        'lighter': '#6fffa4', // 30% lighter
        'default': '#32ff7e'
      },
      orange: {
        'lighter': '#ffc679', // 30% lighter
        'default': '#ffaf40',
      },
      red: {
        'lighter': '#ff8282', // 30% lighter
        'default': '#ff4d4d',
      },
      danger: {
        'default': '#ff3838',
        '100': '#ffe3e3', // 90% lighter
        '500': '#ff7474', // 50% lighter
        '700': '#ff3d3d', // 30% lighter
      },
      gold: {
        'default': '#ff9f1a'
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
