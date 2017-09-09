const fs = require("mz/fs");
const fsExtra = require("fs-extra");
const mkdirp = require("mkdirp");
const Handlebars = require("handlebars");
const { colors, fileVariants, widths } = require("./configuration");

mkdirp.sync("./build");
mkdirp.sync("./build/static");

console.log("Building webpage...");
fs.readFile("./src/www/index.template.html")
.then(file => {
  let template = Handlebars.compile(file.toString("utf-8"));

  let types = [];
  for(let file of fileVariants) {
    let typeVariants = [];

    const useWidths = file.widths || widths;

    for(let { prefix, description, background, foreground } of colors) {
      if(prefix.indexOf("_transparent") >= 0) continue; //skip transparent variants
      
      let variant = {
        background: background,
        foreground: foreground,
        description: description,
        svgPaths: {
          opaque: `${file.path}/aesir_${file.key}_${prefix}.svg`,
          transparent: `${file.path}/aesir_${file.key}_${prefix}_transparent.svg`
        }, //with opaque background
        opaquePaths: [], //with opaque background
        transparentPaths: [] //with transparent background
      }

      for(let width of useWidths) {
        variant.opaquePaths.push({
          title: `${width}px`,
          path: `${file.path}/${width}px/aesir_${file.key}_${prefix}_${width}px.png`
        });
        variant.transparentPaths.push({
          title: `${width}px`,
          path: `${file.path}/${width}px/aesir_${file.key}_${prefix}_transparent_${width}px.png`
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