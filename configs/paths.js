const fs = require("fs");
const path = require("path");

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(path.join(__dirname, ".."));
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  appPath: appDirectory,
  appDist: resolveApp("dist"),
  appSrc: resolveApp("src"),
  appJson: resolveApp("src/plugin.json"),
  appTsConfig: resolveApp("tsconfig.json"),
  appEntry: resolveApp("src/module"),
};