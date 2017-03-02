const svg2png = require("svg2png");
const mkdirp = require("mkdirp");
const path = require("path");
const fs = require("mz/fs");

class Runner {
  static _mkdirp(directory) {
    return new Promise((resolve, reject) => {
      mkdirp(directory, (err) => {
        if(err) return reject(err);

        resolve();
      })
    });
  }

  static createDirectories(
    buildDirectory = "./build",
    widths = [ 100 ]) {
      return Promise.all([].concat(
        [ Runner._mkdirp(path.join(buildDirectory, "/")) ],
        widths.map(width => Runner._mkdirp(path.join(buildDirectory, "/", width+"px", "/")))
      ));
    }

  static readAndColorize(
    filename = "./src/file.svg", 
    title = "standard",
    configuration = [ { prefix: "", foreground: "#fff", background: "#000" } ]
  ) {
    return fs.readFile(filename)
    .then(file => {
      const stringified = file.toString();

      console.log("Colorizing source files");
      let colorizedFiles = [];
      for(let { prefix, foreground, background } of configuration) {
        console.log(`  new color: ${prefix} (F: ${foreground}, B: ${background})`);
        colorizedFiles.push({
          prefix: `aesir_${title}_${prefix}`,
          source: stringified.replace("#000099", "/*foreground*/").replace("#FFFFFF", "/*background*/").replace("/*foreground*/", foreground).replace("/*background*/", background)
        });
      }
      return colorizedFiles;
    });
  }

  static renderWidth(
    files = [ { prefix: "", source: "" } ],
    width = 100) {
      let promises = [];
      console.log(`Rendering files (${width}px)`);
      
      let completed = 0;
      for(let { prefix, source } of files) {
        promises.push(svg2png(source, { width: width })
          .then(result => {
            console.log(`  ${Math.round((++completed)*100 / files.length)}%`);
            return { title: `${prefix}_${width}px`, prefix: prefix, source: source, result: result }
          }));
      }
      return Promise.all(promises);
    }

  static saveWidth(
    buildDirectory = "./build", 
    files = [ { prefix: "", source: "", result: "" } ],
    width = 100) {
      let promises = [];
      console.log(`Saving PNGs (${width}px)`);
      let completed = 0;
      return Promise.all(
        files.map((file) => {
          let { title, prefix, source, result } = file;

          let filePath = path.join(buildDirectory, "/", width+"px", "/", title + ".png");
          return fs.writeFile(filePath, result)
            .then(() => {
              console.log(`  ${Math.round((++completed)*100 / files.length)}%`);
              return file;
            })
        })
      );
  }

  static saveSVGs(
    buildDirectory = "./build", 
    files = [ { title: "", prefix: "", source: "", result: "" } ]) {
      console.log("Saving SVGs");
      let completed = 0;
      return Promise.all(
        files.map((file) => {
          let { title, prefix, source, result } = file;

          let filePath = path.join(buildDirectory, "/", prefix + ".svg");
          return fs.writeFile(filePath, source)
            .then(() => {
              console.log(`  ${Math.round((++completed)*100 / files.length)}%`);
              return file;
            })
        })
      );
    }
  
  static buildFile(
    filename = "./src/file.svg", 
    title = "standard",
    buildDirectory = "./build", 
    configuration = [ { prefix: "", foreground: "#fff", background: "#000" } ], 
    widths = [ 100 ]) {
      return Runner.createDirectories(buildDirectory, widths)
      .then(() => {
        return Runner.readAndColorize(filename, title, configuration);
      })
      .then((files) => {
        return Runner.saveSVGs(buildDirectory, files);
      })
      .then((files) => {
        let promise = Promise.resolve();
        for(let width of widths) {
          promise = promise.then(() => {
            return Runner.renderWidth(files, width)
              .then((files) => {
                return Runner.saveWidth(buildDirectory, files, width);
              })
          });
        }
        return promise;
      });
    }
}

module.exports = Runner;