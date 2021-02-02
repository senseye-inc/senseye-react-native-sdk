# SDK Example Apps

Three example apps have been provided - a cross-platform example app (built using [Expo](https://expo.io/)), and React Native apps for Android and iOS.

## Setup

Within this directory, use [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) to install dependencies required for the example apps, including developer dependencies. Note that the dependencies in `package.json` are *not* required outside of running examples in this directory.

You can also run `yarn bootstrap` from the root directory to install the required dependencies.

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

Modify `/example/src/App.tsx` to render other experiment tasks such as Calibration, Nystagmus, PLR, and so on.
