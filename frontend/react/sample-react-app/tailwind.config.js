/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ["summer-sky"]: "#3ab1e6",
        ["link-water"]: "#c2c9d1",
        ["navy-blue"]: "#004af2",
        ["dodger-blue"]: "#007bff",
        ["persian-red"]: "#d32f2f",
        ["jacksons-purple"]: "#322f82",
        ["smoke-white"]: "#FEFEFE",
        ["white-smoke"]: "#f2f2f2",
        ["matter-horn"]: "#575757",
        ["curious-blue"]: "#418BCA",
        ["very-light-gray"]: "#418BCA",
        persimmon: "#f25700",
        denim: "#0f70b8",
        primary: "#FF5800",
        danger: "#eb5757",
        warning: "#f2994a",
        success: "#3E444C",
        light: "#f7f9f7",
        gold: "#dfbd69",
        silver: "#bbc2cc",
        bronze: "#a97142",
        orange: "#FC4F02",
        ["company-primary"]: "#FF5800",
        ["company-secondary"]: "#3E444C",
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
      boxShadow: {
        sidebar: "rgba(0, 0, 0, 0.10) 0px 4px 14px 0px;",
        group: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        package: "0px 4px 10px 4px rgba(0, 0, 0, 0.25)",
        packageHeader: "inset 0px 4px 20px 1px rgba(255, 255, 255, 0.38)",
        packageCardHeaderRect:
          "0px 4px 4px rgb(0 0 0 / 25%),inset 0px 4px 100px 1px rgb(255 255 255 / 38%)",
      },
    },
  },
  plugins: [],
};
