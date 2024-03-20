const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = (env) => {
  // Use the env variable to set the plugin name
  const pluginName = env.pluginName || "DefaultPlugin";

  // Dynamic entry and output based on the pluginName
  const entryPath = pluginName
    ? `/src/plugins/${pluginName}/index.js`
    : "/src/index.js";
    const outputPath = env.outputPath || path.resolve(__dirname, '../dist');
    return {
    mode: "production",
    entry: entryPath,
    stats: "errors-only",
    output: {
      filename: "[name].bundle.js",
      clean: true,
      path: outputPath,
      assetModuleFilename: "[name][ext]",
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource",
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
        {
          test: /\.(png|jpg|jpeg|svg|gif)$/i,
          type: "asset/resource",
        },
      ],
    },
    plugins: [
      // new HtmlWebpackPlugin({
      //   title: "Breather App",
      //   filename: "index.html",
      //   template: "src/index.html",
      // }),
      new MiniCssExtractPlugin({
        filename: "assets/css/[name].css",
      }),
      new CompressionPlugin({
        algorithm: "gzip",
        test: /\.js(\?.*)?$/i, // Compress .js files
      }),
    ],
    optimization: {
      minimizer: [new CssMinimizerPlugin()],
    },
  };
};
