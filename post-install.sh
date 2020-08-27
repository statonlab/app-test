#!/usr/bin/env bash

echo "Removing __fixtures__ from font libraries"
if [ -e ./node_modules/react-native/local-cli/core/__fixtures__/files/package.json ]; then
	rm ./node_modules/react-native/local-cli/core/__fixtures__/files/package.json
fi
