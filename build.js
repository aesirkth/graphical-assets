const Runner = require("./runner");

const { colors, widths } = require("./configuration");

Runner.buildFile(
  "./src/aesir.svg",
  "./build/standard",
  colors,
  widths
).then(() => {
  return Runner.buildFile(
    "./src/aesir_square.svg",
    "./build/square",
    colors,
    widths
  );
})
.catch(err => {
  console.error(err);
});