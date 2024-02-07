/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontSize: {
      xxs: '0.5rem',
      xs: '0.75rem',
      sm: '0.85rem',
      md: '0.92rem',
      lg: '1rem',
      xl: '1.25rem',
      '2xl': '1.563rem',
      '3xl': '1.953rem',
      '4xl': '2.441rem',
      '5xl': '3.052rem',
      },
    container: {
      center : true,
      screens : {
        lg : '1140px',
        xl : '1140px',
        '2xl' : '1140px',
      }
    },
    extend: {
      backgroundImage: {
        'my-footer': "linear-gradient(rgba(45, 45, 45, 0.7), rgba(45, 45, 45, 0.5)),url('/images/footer.webp')",
        'my-home' : "url('/images/home.webp')"
      },
      fontFamily: {
        poppins : ['Poppins', 'sans-serif'],
      },
      colors: {
        "my-siyah" : "#2D2D2D",
        "my-mavi" : "#0099E5",
        "my-beyaz" : "#FFFFFF",
        "my-ebbeyaz" : "#EBEBEB",
        "my-kırmızı" : "#FF0000",
        "my-edbeyaz" : "#EDEFF1",
        "my-açıkgri" : "#737373",
        "my-4b4b4bgri" : "#4B4B4B",
        "my-sidebeyaz" : "#EDEFF1",
        "my-navgri" : "#AFAFAF",
        "my-141414" : "#141414",
        "my-ortamavi" : "#354C58",
      },
      spacing: {
        100 : '26rem',
        128 : '32rem',
        140 : '40rem',
        180 : '44rem',
        192 : '48rem',
        200 : '56rem',
        216 : '64rem',
        256 : '70rem',
      }
    },
  },
  plugins: [require("daisyui")],
}
