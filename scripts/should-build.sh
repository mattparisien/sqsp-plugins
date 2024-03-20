#!/bin/bash

# Navigate to the plugins directory
cd plugins || exit

# Flag to indicate if a build is needed
NEED_BUILD=0

# Loop through each plugin directory
for PLUGIN_DIR in */ ; do
    # Check if there are changes in the src directory of the plugin
    if git diff --quiet HEAD^ HEAD -- "${PLUGIN_DIR}src/"; then
        # No changes in this plugin's src directory
        echo "No changes in ${PLUGIN_DIR}src/"
    else
        # Changes detected, set the flag to trigger a build
        echo "Changes detected in ${PLUGIN_DIR}src/"
        NEED_BUILD=1
        break # Exit the loop as we only need one change to trigger a build
    fi
done

# Exit with 0 (proceed with build) if changes are detected, else 1 (skip build)
if [ $NEED_BUILD -eq 1 ]; then
    exit 0
else
    echo "No changes detected in any plugin's src/ directory, skipping build"
    exit 1
fi
