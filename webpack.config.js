const path = require("path");
const fs = require("fs");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const isDirectory = (source) => fs.lstatSync(source).isDirectory();
const isNotUnderscored = (source) => !path.basename(source).startsWith("_");

const generateEntryPoints = (srcDir) => {
  const entry = {};

  const exploreDirectory = (dir, isRoot = true) => {
    // Get all items in the current directory
    fs.readdirSync(dir).forEach((item) => {
      const fullPath = "./" + path.join(dir, item);
      if (isDirectory(fullPath) && isRoot) {
        if (isNotUnderscored(fullPath)) {
          // If it's a valid directory and we are at the root, list its JS files but do not explore further
          fs.readdirSync(fullPath).forEach((subItem) => {
            const subFullPath = "./" + path.join(fullPath, subItem);
            if (path.extname(subItem) === ".js") {
              // If it's a JavaScript file, add it to the entry object
              const dirname = path.basename(fullPath); // Use directory name
              if (!entry[dirname]) {
                entry[dirname] = subFullPath;
              }
            }
          });
        }
      } else if (path.extname(item) === ".js" && isRoot) {
        // If it's a JavaScript file at the root, add it to the entry object
        const basename = path.basename(item, ".js");
        entry[basename] = fullPath;
      }
    });
  };

  exploreDirectory(srcDir);
  return entry;
};

module.exports = {
  mode: "production",
  entry: generateEntryPoints("./src/plugins"),
  output: {
    filename: "[name].bundle.js",
    clean: true,
    path: path.resolve(__dirname, "dist"),
    assetModuleFilename: "[name][ext]",
  },
  devtool: "source-map",
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
    new HtmlWebpackPlugin({
      title: "Breather App",
      filename: "index.html",
      template: "src/index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "assets/css/[name].css",
    }),
  ],
  optimization: {
    minimizer: [new CssMinimizerPlugin()],
  },
};
