const path = require("path");
const generateEntryPoints = require("./scripts/generate-webpack-entries");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const CopywebpackPlugin = require("copy-webpack-plugin");

require("dotenv").config(); // Load variables from .env file into process.env
const { EnvironmentPlugin } = require("webpack");

module.exports = {
  mode: "production",
  context: __dirname,
  entry: generateEntryPoints(),
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    port: 3000,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.([cm]?ts|tsx)$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.s?[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|gif|jpg|jpeg|svg|xml)$/,
        use: ["url-loader"],
      },
    ],
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js"],
    // Add support for TypeScripts fully qualified ESM imports.
    extensionAlias: {
      ".js": [".js", ".ts"],
      ".cjs": [".cjs", ".cts"],
      ".mjs": [".mjs", ".mts"],
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
    }),
    new CopywebpackPlugin({
      patterns: [
        {
          from: "src/assets/**/*",
          to: "assets/[name][ext]",
        },
      ],
    }),
    new EnvironmentPlugin(["BASE_URL"]), // List all environment variables you use here
  ],
};

// const path = require("path");
// const HtmlWebpackPlugin = require("html-webpack-plugin");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// const CompressionPlugin = require("compression-webpack-plugin");

// module.exports = (env) => {
//   // Use the env variable to set the plugin name
//   const pluginName = env.pluginName || "DefaultPlugin";

//   // Dynamic entry and output based on the pluginName
//   const entryPath = pluginName
//     ? `/src/plugins/${pluginName}/index.js`
//     : "/src/index.js";
//     const outputPath = env.outputPath || path.resolve(__dirname, '../dist');
//     return {
//     mode: "production",
//     entry: entryPath,
//     stats: "errors-only",
//     output: {
//       filename: "[name].bundle.js",
//       clean: true,
//       path: outputPath,
//       assetModuleFilename: "[name][ext]",
//     },
//     module: {
//       rules: [
//         {
//           test: /\.css$/i,
//           use: [MiniCssExtractPlugin.loader, "css-loader"],
//         },
//         {
//           test: /\.(woff|woff2|eot|ttf|otf)$/i,
//           type: "asset/resource",
//         },
//         {
//           test: /\.js$/,
//           exclude: /node_modules/,
//           use: {
//             loader: "babel-loader",
//             options: {
//               presets: ["@babel/preset-env"],
//             },
//           },
//         },
//         {
//           test: /\.(png|jpg|jpeg|svg|gif)$/i,
//           type: "asset/resource",
//         },
//       ],
//     },
//     plugins: [
//       // new HtmlWebpackPlugin({
//       //   title: "Breather App",
//       //   filename: "index.html",
//       //   template: "src/index.html",
//       // }),
//       new MiniCssExtractPlugin({
//         filename: "assets/css/[name].css",
//       }),
//       new CompressionPlugin({
//         algorithm: "gzip",
//         test: /\.js(\?.*)?$/i, // Compress .js files
//       }),
//     ],
//     optimization: {
//       minimizer: [new CssMinimizerPlugin()],
//     },
//   };
// };
