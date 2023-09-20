const { resolve } = require("path");
const { main } = require("../src/index");

main({
  entry: resolve(__dirname, "./sample/index.js"),
  output: resolve(__dirname, "./dist.js"),
});
