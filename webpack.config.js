const path = require("path");

module.exports = {
  entry: [
    "./js/util.js",
    "./js/debounce.js",
    "./js/popUps.js",
    "./js/loadData.js",
    "./js/data.js",
    "./js/pin.js",
    "./js/card.js",
    "./js/form.js",
    "./js/map.js",
    "./js/main.js",
  ],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname),
    iife: true
  },
  devtool: false
}
