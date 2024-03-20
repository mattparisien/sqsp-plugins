const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
require("dotenv").config();

const rootDir         = path.join(__dirname, "../");
const pluginsDir      = path.join(rootDir, "plugins");
const distDir         = path.join(rootDir, "dist", "plugins");
const specificPlugins = process.env.BUILD_PLUGINS;

const buildPlugin = (pluginName) => {
  const pluginPath = path.join(pluginsDir, pluginName);
  const pluginDistPath = path.join(distDir, pluginName); // Target dist path for the plugin
  console.log(`Building plugin: ${pluginName}`);

  try {
    // Execute the build script for the plugin
    execSync(
      `npm install && npm run build -- --output-path ${pluginDistPath}`,
      { cwd: pluginPath, stdio: "inherit" }
    );
    console.log(`Successfully built plugin: ${pluginName}`);
  } catch (error) {
    console.error(`Error building plugin ${pluginName}: ${error}`);
    process.exit(1);
  }
};

if (specificPlugins) {
  // Build only the specific plugin if its directory exists
  specificPlugins.split(",").forEach((plugin) => {
    if (fs.existsSync(path.join(pluginsDir, plugin))) {
      buildPlugin(plugin);
    } else {
      console.error(`Plugin "${plugin}" does not exist.`);
    }
  });
} else {
  // Build all plugins if no specific plugin name is provided
  fs.readdirSync(pluginsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .forEach((dirent) => {
      buildPlugin(dirent.name);
    });
}
