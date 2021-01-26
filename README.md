# Senseye SDK

The Senseye SDK provides direct integration into the Senseye API on both iOS and Android for React Native apps. The JavaScript API is simple and cross-platform. Ready to get started? Follow the instructions for either local installation or stand-alone package installation.

## What’s in this repo
```
.  
+-- android/      # Android-specific source code
+-- ios/          # iOS-specific source code
+-- docs/         # See Documentation section of this README  
+-- example/      # Contains an example app that demo usage of the SDK
+-- src/
|   +-- api/        # Modules for interfacing with the Senseye API
|   +-- components/ # Modules for serving Senseye frontend components
+-- package.json  #  Includes application dependencies, build utilities, and pre-commit hook directives. See contributing guide for more information on these directives
+-- .circleci/    # (Ignore. Reserved for future development)
```

## Included Tasks

1. Calibration
1. Nystagmus
1. PLR (Pupillary Light Response)

## Requirements

Apps using React Native Navigation may target iOS 12+ and Android 10+. You may use Windows, macOS or Linux as your development operating system.

## Installation

Installation of the stand-alone SDK package can be done using [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/).

npm:
```sh
npm install @senseyeinc/react-native-senseye-sdk
```

yarn:
```sh
yarn add @senseyeinc/react-native-senseye-sdk
```

### Local

If you prefer to build the SDK locally, clone this repo and run `yarn install` then `yarn prepare` from the root directory to get started. Optional: running `yarn bootstrap` runs prior commands and additionally installs dependencies for running examples in [the demo section](/example/README.md).

For local development, one of the dependencies is `babel-plugin-module-resolver`, for which your IDE may require a plugin to detect the alias defined and used throughout the codebase. The alias defined in `babel.config.js` will resolve paths so that you can write `import { insert_SDK_components_here } from @senseyeinc/react-native-senseye-sdk` as if it were importing modules from the stand-alone package.

* [Atom](https://atom.io/): You can install `autocomplete-modules` and enable "Babel Plugin Module Resolver" in its settings.

## Usage

After you have the SDK built or installed, import task components into your React application. For example:
```javascript
import { Experiments } from '@senseyeinc/react-native-senseye-sdk'

export default function App() {
  return (
    <Experiments.Calibration />
  );
}
```
## Example App
A cross-platform example app (built using [Expo](https://expo.io/)) has been provided in the example/ directory. You can run `yarn bootstrap` to install its dependencies and then `yarn example expo` to start it.

More information is available in the [example README](/example/README.md).

## Documentation

Run `yarn docs` to start a local server on port 9090 and automatically open a browser to the documentation, or simply open docs/index.html in a browser to view the same contents without running the server.

## Changelog

View changes and release history (https://github.com/senseye-inc/senseye-react-native-sdk/releases/)

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

BSD 3-Clause
