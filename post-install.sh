#!/usr/bin/env bash

echo "Creating project without FaceDetector"
if [ -e node_modules/react-native-camera/ios/FaceDetector ] ; then
  rm -rf node_modules/react-native-camera/ios/FaceDetector
fi
cp node_modules/react-native-camera/postinstall_project/projectWithoutFaceDetection.pbxproj node_modules/react-native-camera/ios/RNCamera.xcodeproj/project.pbxproj

echo "Removing __fixtures__ from font libraries"
if [ -e ./node_modules/react-native/local-cli/core/__fixtures__/files/package.json ]; then
	rm ./node_modules/react-native/local-cli/core/__fixtures__/files/package.json
fi

echo "Running jetify"
npx jetify
