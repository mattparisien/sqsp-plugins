const path = require("path");
const glob = require("glob");

const generateEntryPoints = () => {
  const entries = {};
  const ext = "-initializer";
  const files = glob.sync(
    path.join(__dirname, "../src/plugin-initializers/*.ts")
  );

  files.forEach((file) => {
    const basename = path.basename(file, path.extname(file))?.split(ext)[0];
    entries[basename] = file;
  });

  return entries;
};

module.exports = generateEntryPoints;
