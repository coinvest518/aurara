/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A0B2E',
          50: '#442B6F',
          100: '#3D2664',
          200: '#362259',
          300: '#2F1D4E',
          400: '#281943',
          500: '#1A0B2E',
          600: '#150924',
          700: '#0F071A',
          800: '#0A040F',
          900: '#040205'
        },
        accent: {
          DEFAULT: '#2DD4BF',
          teal: '#2DD4BF',
          yellow: '#FFB84C',
          blue: '#60A5FA'
        }
      },
      fontFamily: {
        sans: ['Inter var', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Cabinet Grotesk', 'Inter var', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
      },
      keyframes: {
        'gradient-y': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center center'
          }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        }
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  },
  plugins: [],
};
