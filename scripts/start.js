const webpack = require("webpack");
const config = require("../configs/webpack.config");

const utils = require("../configs/utils");

// Set NODE_ENV before anything else
process.env.NODE_ENV = "development";
process.env.BABEL_ENV = "development";

const compiler = webpack(config);
const watchOptions = {
  ignored: /node_modules/,
};
compiler.watch(watchOptions, utils.webpackOutputFormatter);