const baseWebpackConfig = require("./webpack.config.base");

module.exports = {
  ...baseWebpackConfig,
  mode: "development",
  watch: true,
  devtool: "source-map",
};;
