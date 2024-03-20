#!/bin/bash

# Check if a plugin name was provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <pluginName>"
    exit 1
fi

PLUGIN_NAME=$1

# Define the base directory for the plugin
BASE_DIR="./plugins/$PLUGIN_NAME"

# Create the directory structure
mkdir -p $BASE_DIR/src $BASE_DIR/dist $BASE_DIR/tests $BASE_DIR/docs

# Optionally create base files like README.md, .gitignore, package.json
echo "Creating base files for $PLUGIN_NAME..."

cat <<EOF > $BASE_DIR/README.md
# $PLUGIN_NAME

Description for $PLUGIN_NAME.
EOF

cat <<EOF > $BASE_DIR/.gitignore
node_modules/
dist/
EOF

cat <<EOF > $BASE_DIR/package.json
{
  "name": "$PLUGIN_NAME",
  "version": "1.0.0",
  "description": "",
  "main": "src/index.js",
  "scripts": {
    "test": "echo 'Error: no test specified' && exit 1"
  },
  "author": "",
  "license": "ISC"
}
EOF

echo "$PLUGIN_NAME structure has been created."
