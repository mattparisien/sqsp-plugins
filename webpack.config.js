const path = require("path");
const generateEntryPoints = require("./scripts/generateWebpackEntries");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopywebpackPlugin = require("copy-webpack-plugin");

require("dotenv").config(); // Load variables from .env file into process.env
const { EnvironmentPlugin } = require("webpack");

module.exports = {
  mode: "production",
  context: __dirname,
  entry: generateEntryPoints(),
  output: {
    filename: "[name]/bundle.js",
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
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
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
      scriptLoading: "blocking",
      inject: true,
      templateParameters: (compilation, assets, assetTags, options) => {
        assetTags.bodyTags.forEach((script) => {
          const imageUrls = [
            "https://images.pexels.com/photos/19845821/pexels-photo-19845821/free-photo-of-sheep-on-a-hillside-at-sunset.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            "https://images.pexels.com/photos/17554347/pexels-photo-17554347/free-photo-of-taxis-in-front-of-palace-in-istanbul.jpeg",
            "https://images.pexels.com/photos/20612683/pexels-photo-20612683/free-photo-of-a-large-group-of-yellow-tulips-in-a-field.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            "https://images.pexels.com/photos/20240203/pexels-photo-20240203/free-photo-of-man-standing-with-arm-raised-near-curtain.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          ];
          script.attributes["data-image-urls"] = imageUrls;
          // script.attributes["data-radius"] = "20";
          // script.attributes["data-speed"] = "0.1";
          // script.attributes["data-blah"] = "ok";
          // script.attributes["data-hello"] = "ok";
          // script.attributes["data-strength"] = "500";
        });
        return {
          compilation,
          webpackConfig: compilation.options,
          htmlWebpackPlugin: {
            tags: assetTags,
            files: assets,
            options,
          },
        };
      },
    }),
    new MiniCssExtractPlugin({
      filename: "[name]/assets/styles/main.css",
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
