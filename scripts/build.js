const webpack = require("webpack");
const config = require("../configs/webpack.config");
const fs = require("fs-extra");

const paths = require("../configs/paths");
const utils = require("../configs/utils");

// Set NODE_ENV before anything else
process.env.NODE_ENV = "production";
process.env.BABEL_ENV = "production";

fs.emptyDirSync(paths.appDist);
const compiler = webpack(config);
compiler.run(utils.webpackOutputFormatter);