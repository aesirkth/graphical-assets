const fs = require("mz/fs");
const fsExtra = require("fs-extra");
const mkdirp = require("mkdirp");
const Handlebars = require("handlebars");

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

const files = [
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
]

const widths = [
  125,
  250,
  500,
  1000
];

mkdirp.sync("./build");
mkdirp.sync("./build/static");

console.log("Building webpage...");
fs.readFile("./src/www/index.template.html")
.then(file => {
  let template = Handlebars.compile(file.toString("utf-8"));

  let types = [];
  for(let file of files) {
    let typeVariants = [];

    for(let { prefix, background, foreground } of colors) {
      if(prefix.indexOf("_transparent") >= 0) continue; //skip transparent variants
      
      let variant = {
        background: background,
        foreground: foreground,
        svgPaths: {
          opaque: `${file.path}/aesir_${prefix}.svg`,
          transparent: `${file.path}/aesir_${prefix}_transparent.svg`
        }, //with opaque background
        opaquePaths: [], //with opaque background
        transparentPaths: [] //with transparent background
      }
      for(let width of widths) {
        variant.opaquePaths.push({
          title: `${width}px`,
          path: `${file.path}/${width}px/aesir_${prefix}_${width}px.png`
        });
        variant.transparentPaths.push({
          title: `${width}px`,
          path: `${file.path}/${width}px/aesir_${prefix}_transparent_${width}px.png`
        });
      }
      typeVariants.push(variant);
    }

    types.push({
      class: file.class,
      title: file.title,
      margin: file.margin,
      variants: typeVariants
    });
  }
  let result = template({
    widths: widths,
    types: types
  });

  return fs.writeFile("./build/index.html", result)
    .then(() => {
      console.log("Copying static files...");
      return new Promise((resolve, reject) => {
        fsExtra.copy("./src/www/static/", "./build/static", (err) => {
          if(err) return reject(err);
          resolve();
        });
      }).then(() => {
        console.log("Done.");
      })
    })
})
.catch(err => {
  console.error(err);
});