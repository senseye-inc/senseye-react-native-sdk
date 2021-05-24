# SDK Example Apps

Two example apps have been provided - a cross-platform example app (built using [Expo](https://expo.io/)), and a React Native app for Android and iOS.

## Setup

Within this directory, use [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) to install dependencies required for the example apps, including developer dependencies. Note that the dependencies in `package.json` are _not_ required outside of running examples in this directory.

You can also run `yarn bootstrap` from the root directory to install the required dependencies.

### iOS Specific Setup

Install CocoaPods dependencies by running `npx pod-install` in this directory.

During early test deployment onto a device, you may need to go into Settings > Device Management to trust the developer app.

Allow the device to search for services on the same network so that the Metro bundler can actively load JavaScript code changes onto your device.

npm:

```sh
npm install
```

yarn:

```sh
yarn install
```

## Running the demos

#### Expo

Run the application via Expo and follow on-screen directions:

From this directory:

```sh
yarn expo
```

From the root directory:

```sh
yarn example expo
```

#### React Native

First, you will need to start Metro, the JavaScript bundler that ships with React Native:

```sh
yarn start
```

Let Metro Bundler run in its own terminal, then run the app:

Android:

```sh
yarn android
```

iOS

```sh
yarn ios
```

The "Full Demo" can be modified to run a custom series of tasks (Calibration, PLR, etc.) by making changes inside `/example/src/screens/FullDemoScreen.tsx`.
