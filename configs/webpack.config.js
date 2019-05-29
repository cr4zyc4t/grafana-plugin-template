const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
// const TerserPlugin = require("terser-webpack-plugin");

const paths = require("./paths");

const isEnvDevelopment = process.env.NODE_ENV === "development";
const isEnvProduction = process.env.NODE_ENV === "production";

module.exports = {
  mode: isEnvProduction ? "production" : "development",
  // Stop compilation early in production
  bail: isEnvProduction,
  context: paths.appSrc,
  entry: paths.appEntry,
  output: {
    filename: "module.js",
    path: paths.appDist,
    libraryTarget: "amd",
  },
  externals: [
    // remove the line below if you don't want to use buildin versions
    "jquery", "lodash", "moment", "@grafana/ui", "react", "react-dom",
    function (context, request, callback) {
      const prefix = "grafana/";
      if (request.indexOf(prefix) === 0) {
        return callback(null, request.substr(prefix.length));
      }
      callback();
    },
  ],
  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: isEnvProduction ? "production" : "development",
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new CopyWebpackPlugin([
      { from: paths.appJson, to: "." },
    ]),
    new ForkTsCheckerWebpackPlugin({
      async: isEnvDevelopment,
      useTypescriptIncrementalApi: true,
      checkSyntacticErrors: true,
      // resolveModuleNameModule: process.versions.pnp
      //   ? `${__dirname}/pnpTs.js`
      //   : undefined,
      // resolveTypeReferenceDirectiveModule: process.versions.pnp
      //   ? `${__dirname}/pnpTs.js`
      //   : undefined,
      tsconfig: paths.appTsConfig,
      reportFiles: [
        "**",
        "!**/__tests__/**",
        "!**/?(*.)(spec|test).*",
        // "!**/src/setupProxy.*",
        // "!**/src/setupTests.*",
      ],
      watch: paths.appSrc,
      silent: false,
      // // The formatter is invoked directly in WebpackDevServerUtils during development
      // formatter: typescriptFormatter,
    }),
  ],
  // optimization: {
  //   minimize: isEnvProduction,
  //   minimizer: [
  //     // This is only used in production mode
  //     new TerserPlugin({
  //       terserOptions: {
  //         parse: {
  //           // we want terser to parse ecma 8 code. However, we don't want it
  //           // to apply any minfication steps that turns valid ecma 5 code
  //           // into invalid ecma 5 code. This is why the 'compress' and 'output'
  //           // sections only apply transformations that are ecma 5 safe
  //           // https://github.com/facebook/create-react-app/pull/4234
  //           ecma: 8,
  //         },
  //         compress: {
  //           ecma: 5,
  //           warnings: false,
  //           // Disabled because of an issue with Uglify breaking seemingly valid code:
  //           // https://github.com/facebook/create-react-app/issues/2376
  //           // Pending further investigation:
  //           // https://github.com/mishoo/UglifyJS2/issues/2011
  //           comparisons: false,
  //           // Disabled because of an issue with Terser breaking valid code:
  //           // https://github.com/facebook/create-react-app/issues/5250
  //           // Pending futher investigation:
  //           // https://github.com/terser-js/terser/issues/120
  //           inline: 2,
  //         },
  //         mangle: {
  //           safari10: true,
  //         },
  //         output: {
  //           ecma: 5,
  //           comments: false,
  //           // Turned on because emoji and regex is not minified properly using default
  //           // https://github.com/facebook/create-react-app/issues/2488
  //           ascii_only: true,
  //         },
  //       },
  //       // Use multi-process parallel running to improve the build speed
  //       // Default number of concurrent runs: os.cpus().length - 1
  //       // Disabled on WSL (Windows Subsystem for Linux) due to an issue with Terser
  //       // https://github.com/webpack-contrib/terser-webpack-plugin/issues/21
  //       parallel: !isWsl,
  //       // Enable file caching
  //       cache: true,
  //       sourceMap: shouldUseSourceMap,
  //     }),
  //     // This is only used in production mode
  //     new OptimizeCSSAssetsPlugin({
  //       cssProcessorOptions: {
  //         parser: safePostCssParser,
  //         map: shouldUseSourceMap
  //           ? {
  //             // `inline: false` forces the sourcemap to be output into a
  //             // separate file
  //             inline: false,
  //             // `annotation: true` appends the sourceMappingURL to the end of
  //             // the css file, helping the browser find the sourcemap
  //             annotation: true,
  //           }
  //           : false,
  //       },
  //     }),
  //   ],
  // },
  resolve: {
    // alias: {
    //   "src": resolve("src"),
    // },
    extensions: [".tsx", ".ts", ".jsx", ".js", ".mjs"],
  },
  module: {
    strictExportPresence: true,
    rules: [
      // Disable require.ensure as it's not a standard language feature.
      { parser: { requireEnsure: false } },

      // First, run the linter.
      // It's important to do this before Babel processes the JS.
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        enforce: "pre",
        use: [
          {
            options: {
              // formatter: require.resolve('react-dev-utils/eslintFormatter'),
              eslintPath: require.resolve("eslint"),
            },
            loader: require.resolve("eslint-loader"),
          },
        ],
        include: paths.appSrc,
      },
      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            include: paths.appSrc,
            loader: require.resolve("babel-loader"),
            options: {
              presets: [
                ["react-app", {
                  flow: false,
                  typescript: true,
                }],
              ],

              customize: require.resolve(
                "babel-preset-react-app/webpack-overrides"
              ),

              plugins: [
                [
                  require.resolve("babel-plugin-named-asset-import"),
                  {
                    loaderMap: {
                      svg: {
                        ReactComponent: "@svgr/webpack?-svgo,+ref![path]",
                      },
                    },
                  },
                ],
              ],
              // This is a feature of `babel-loader` for webpack (not Babel itself).
              // It enables caching results in ./node_modules/.cache/babel-loader/
              // directory for faster rebuilds.
              cacheDirectory: true,
              cacheCompression: isEnvProduction,
              compact: isEnvProduction,
            },
          },
          // "file" loader makes sure those assets get served by WebpackDevServer.
          // When you `import` an asset, you get its (virtual) filename.
          // In production, they would get copied to the `build` folder.
          // This loader doesn't use a "test" so it will catch all modules
          // that fall through the other loaders.
          {
            loader: require.resolve("file-loader"),
            // Exclude `js` files to keep "css" loader working as it injects
            // its runtime that would otherwise be processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              name: "static/media/[name].[hash:8].[ext]",
            },
          },
          // ** STOP ** Are you adding a new loader?
          // Make sure to add the new loader(s) before the "file" loader.
        ],
      },
    ],
  },
};
