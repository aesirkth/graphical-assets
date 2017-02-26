
const grayscaleColor = "#383838";
const primaryColor = "#37109F";
const whiteColor = "#ffffff";
const blackColor = "#000000";
const transparentColor = "transparent";

let colors = [
  {
    prefix: "dark",
    background: primaryColor,
    foreground: whiteColor
  },
  {
    prefix: "dark_transparent",
    background: transparentColor,
    foreground: whiteColor
  },
  {
    prefix: "light",
    background: whiteColor,
    foreground: primaryColor
  },
  {
    prefix: "light_transparent",
    background: transparentColor,
    foreground: primaryColor
  },
  {
    prefix: "grayscale_light",
    background: whiteColor,
    foreground: grayscaleColor
  },
  {
    prefix: "grayscale_light_transparent",
    background: transparentColor,
    foreground: grayscaleColor
  },
  {
    prefix: "grayscale_dark",
    background: grayscaleColor,
    foreground: whiteColor
  },
  {
    prefix: "grayscale_dark_transparent",
    background: transparentColor,
    foreground: whiteColor
  },
  {
    prefix: "black",
    background: whiteColor,
    foreground: blackColor
  },
  {
    prefix: "black_transparent",
    background: transparentColor,
    foreground: blackColor
  }
];

const fileVariants = [
  {
    class: "",
    title: "Standard logos",
    path: "/standard",
    margin: 20
  },
  {
    class: "square",
    title: "Avatar logos",
    path: "/square",
    margin: 0
  }
];

const widths = [
  125,
  250,
  500,
  1000,
  2000,
  4000
];

module.exports = {
  colors: colors,
  fileVariants: fileVariants,
  widths: widths
};