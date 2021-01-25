# SDK demo using Expo

Use [Expo](https://docs.expo.io/) to quickly get a demo of Senseye SDK components running on an Android or iOS environment.

## Setup

Within this directory, use [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) to install dependencies required for example, including developer dependencies. Note, the dependencies in `package.json` are not required outside of running examples in this directory.

You can also run `yarn bootstrap` from the root directory to install the required dependencies.

npm:
```sh
npm install
```

yarn:
```sh
yarn install
```

## Running the demo

Run the application via Expo and follow on-screen directions:

From this directory:
```sh
expo start
```
From the root directory:
```sh
yarn example expo
```

Modify `/example/src/App.tsx` to render other experiment tasks such as Calibration, Nystagmus, PLR, and so on.
