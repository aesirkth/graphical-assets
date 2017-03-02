const path = require("path");
const Runner = require("./runner");
const { colors, widths, fileVariants } = require("./configuration");


let promise = Promise.resolve();
for(let fileVariant of fileVariants) {
  promise = promise.then(() => {
    return Runner.buildFile(
      fileVariant.source,
      path.join("./build", fileVariant.path),
      colors,
      widths
    );
  })
}

return promise
.catch(err => {
  console.error(err);
});