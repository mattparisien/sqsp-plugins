/**
 * @summary This file builds selected or all subfolders in the src/plugins directory to the target dist/plugins directory
 * @example npm run build-plugins MagneticButton
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
require("dotenv").config();

const rootDir = path.join(__dirname, "../");
const pluginsDir = path.join(rootDir, "src/plugins");
const distDir = path.join(rootDir, "dist", "plugins");
// Grab command-line arguments starting from the third element
const specificPlugins = process.argv.slice(2);

const buildPlugin = (pluginName) => {
  const pluginPath = path.join(pluginsDir, pluginName);
  const pluginDistPath = path.join(distDir, pluginName); // Target dist path for the plugin
  console.log(`Building plugin: ${pluginName}`);

  try {
    // Execute the build script for the plugin
    execSync(
      `npm run build -- --env pluginName=${pluginName} --env outputPath=${pluginDistPath}`,
      { cwd: pluginPath, stdio: "inherit" }
    );
    console.log(`Successfully built plugin: ${pluginName}`);
  } catch (error) {
    console.error(`Error building plugin ${pluginName}: ${error}`);
    process.exit(1);
  }
};

if (specificPlugins.length > 0) {
  // Build only the specified plugins if their directories exist
  specificPlugins.forEach((plugin) => {
    if (fs.existsSync(path.join(pluginsDir, plugin))) {
      buildPlugin(plugin);
    } else {
      console.error(`Plugin "${plugin}" does not exist.`);
    }
  });
} else {
  // If no plugin names are provided through the command line, build all plugins excluding those that start with '_'
  fs.readdirSync(pluginsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith('_'))
    .forEach((dirent) => {
      buildPlugin(dirent.name);
    });
}
