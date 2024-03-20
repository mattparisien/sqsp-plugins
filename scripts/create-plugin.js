const { PLUGIN_TO_ATTRIBUTE_MAP } = require("./constants") ;
const fs = require("fs");
const path = require("path");

const writeFile = (path, content) => {
    fs.writeFile(path, content, (err) => {
      if (err) {
        console.error("Error writing file:", err);
        process.exit(1);
      }
      console.log(`File has been saved as ${path}`);
    });
  };

// Get the plugin name from the command-line arguments
const pluginName = process.argv[2];

if (!pluginName) {
  console.error("You must provide a plugin name as an argument.");
  process.exit(1);
}

// The html attribute which maps to the plugin
const attribute = PLUGIN_TO_ATTRIBUTE_MAP.get(pluginName);


if (!attribute) {
  console.error("You must provide an html attribute mapping.");
  process.exit(1);
}

// The class file
const pluginFileContent = `import Plugin from "../_lib/utils/Plugin";

class ${pluginName} extends Plugin {
    constructor(node) {
        super(node);
    }
}

export default ${pluginName};
`

// The index file
const indexFileContent = `import ${pluginName} from "./${pluginName}";
import "../_lib/styles/reset.css"
import "./assets/styles/main.css";

const init = () => {
  window.addEventListener("load", () => {
    const nodes = Array.from(document.querySelectorAll("${attribute}"));
    nodes.forEach((node) => {
      new ${pluginName}(node);
    });
  });
};

init();`;

// The css file
const cssFileContent = ``

const pluginDirPath = path.join(__dirname, `../src/plugins/${pluginName}`);
const assetsDirPath = path.join(__dirname, `../src/plugins/${pluginName}/assets/styles`);

// Ensure the directory exists
fs.mkdirSync(pluginDirPath, { recursive: true });
fs.mkdirSync(assetsDirPath, { recursive: true });

// Specify the path and filename of the new JS file within the newly created directory
const pluginOutputPath = path.join(pluginDirPath, `${pluginName}.js`);
const indexOutputPath  = path.join(pluginDirPath, 'index.js');
const cssOutputPath    = path.join(pluginDirPath, `/assets/styles/main.css`);

writeFile(pluginOutputPath, pluginFileContent);
writeFile(indexOutputPath, indexFileContent);
writeFile(cssOutputPath, cssFileContent);

