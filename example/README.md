# SDK Example App

An example React Native app to showcase the components and features provided by the SDK.

## Setup

Building and running this app will require you to use React Native CLI, so if you haven't done so already, please follow this [link](https://reactnative.dev/docs/environment-setup) and go to the `React Native CLI Quickstart > Installing dependencies` section for instructions on how to install the appropriate tools and dependencies for your development environment.

Once done, navigate to this directory and use [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) to install package dependencies required to run this app.

npm:

```sh
npm install
```

yarn:

```sh
yarn install
```

For iOS, make sure to also install the CocoaPods dependencies:
```sh
npx pod-install
```

Note that the CocoaPods dependencies will **_not_** be included when installing dependencies via `yarn bootstrap`, which can be ran at the root directory of this repository.

## Build & Run

It is recommended to run this app on a mobile device. To do so, follow this [link](https://reactnative.dev/docs/running-on-device) for instructions according to your development environment.

Once the app is running on your device, changes to the codebase will be actively reflected onto the app. If necessary, you can reload the app by pressing `r` in the CLI window/tab that is running Metro.

The "Full Demo" can be modified by making changes inside `./src/screens/FullDemoScreen.tsx`.

### Android
If your device is already configured and connected via USB, you can simply follow these steps to deploy the app to your device:

1. Navigate to this directory and start Metro:
    ```
    yarn start
    ```
2. Navigate to this directory in a separate terminal and run the app:
    ```
    yarn android
    ```

### iOS
As you follow the linked instructions, once you have `./ios/SenseyeSdkExample.xcworkspace` opened in XCode and are in the "Signing & Capabilities" tab, make sure to update the "Team" selection to your Apple developer account or team. If you are unable to select `Senseye, Inc.`, then you will also need to provide your own unique "Bundle Identifier".

If this is the first time the app is being deployed onto a particular device, you may need to go into the device's `Settings > General > Device Management` to trust the developer app.

Allow the device to search for services on the same network so that the Metro bundler can actively load JavaScript code changes onto your device.
