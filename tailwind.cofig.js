// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1E40AF", // azul por defecto
          light: "#3B82F6",
          dark: "#1E3A8A",
        },
      },
      borderRadius: {
        'xl': '1rem',       // redefinir xl
        '4xl': '2rem',      // agregar nuevo
      },
      spacing: {
        '128': '32rem',     // nuevo tamaño
      },
    },
  },
  plugins: [],
};
