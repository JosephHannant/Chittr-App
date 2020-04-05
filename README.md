# Chittr-App
 Chittr app assignment for Mobile Applications Development term 2, the specification is to create a front end app to interact with an API.

 ## Requirements
 You will require node.js (https://nodejs.org/en/) installed and android studio with a working AVD running API 28 on android 9.0.
 You will also require the server code v0.0.6.

 ## Installation
 Create a working folder and navigate to it in node.js and run the command 'npx react-native init Assignment2'.
 Upon completion of the install copy the files from this repository to where you have installed react native.
 From here run the following commands to gain all of the dependencies required for this App:
 '''
 npm install @react-native-community/async-storage @react-native-community/masked-view @react-navigation/native @react-navigation/stack react react-native react-native-camera react-native-elements react-native-geolocation-service react-native-gesture-handler react-native-reanimated react-native-safe-area-context react-native-screens react-native-vector-icons react-navigation react-navigation-stack react-navigation-tabs
 '''
 For camera you will have to link it using:
 '''
 react-native link react-native-camera
 '''
 For the server navigate to where it is downloaded and run 'npm install' to set it up and upon completion 'npm test' to ensure it works.

 ## Running the app
 1. Open android studio and run the vritual device and let it finish building.
 2. Open node.js command prompt and navigate to where the server is and run 'npm start'
 3. Open a new node.js command prompt and navigate to where the app is installed and run 'npx react-native run-android'
 
 From here the app is ready to be used.

 ## Details
 2020, Joseph Hannant
