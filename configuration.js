
const grayscaleColor = "#383838";
const primaryColor = "#37109F";
const whiteColor = "#ffffff";
const blackColor = "#000000";
const transparentColor = "transparent";

let colors = [
  {
    prefix: "dark",
    description: "Use when a lot of color is needed.",
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
    description: "Use when the background needs to be white (or near white).",
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
    description: "Use only in special cases where a grayscale logo is necessary.",
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
    description: "Use only in special cases where a grayscale logo is necessary.",
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
    description: "Use this one only when you absolutely need a black logo, it is not to be used in any other situation.",
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
    source: "./src/aesir.svg",
    class: "",
    title: "Standard logos",
    path: "/standard",
    margin: 20
  },
  {
    source: "./src/aesir_square.svg",
    class: "square",
    title: "Avatar logos",
    path: "/square",
    margin: 0
  },
  {
    source: "./src/aesir_rocket.svg",
    class: "rocket",
    title: "Rocket logos",
    path: "/rocket",
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