# Senseye SDK

The Senseye SDK provides direct integration into the Senseye API on both iOS and Android for React Native apps. The JavaScript API is simple and cross-platform. Ready to get started? Follow the instructions below.

## What’s in this repo
```
.  
+-- android/ # Project scaffolding for Android development
+-- ios/ # Project scaffolding for iOS development
+-- docs/ # See Documentation section of this README  
+-- examples/ # Contains usage examples for React components
+-- src/
|   +-- api/ # source code for communicating with the Senseye API
|   +-- components/ # source code for serving Senseye components
+-- package.json #  Includes application dependencies, build utilities, and pre-commit hook directives. See [contributing guide](CONTRIBUTING.md) for more information on these directives.
+-- .circleci/ # (Ignore. Reserved for future development)
```

## Included Tasks

1. Calibration
1. Nystagmus
1. PLR - Pupillary Light Response

## Requirements

Apps using React Native Navigation may target iOS 12+ and Android 10+. You may use Windows, macOS or Linux as your development operating system.

For development, you'll need an IDE plugin that can detect `babel-plugin-module-resolver`.
#### Atom
You can install `autocomplete-modules` and enable "Babel Plugin Module Resolver" in its settings.
#### VS Code
You can `yarn add --dev babel-plugin-module-resolver`, then quit VS Code entirely and relaunch.

## Installation

npm:
```sh
npm install @senseyeinc/react-native-senseye-sdk`
```

yarn:
```sh
yarn add @senseyeinc/react-native-senseye-sdk
```

## Usage

You can then import task components into your React application. For example:
```javascript
import { Experiments } from '@senseyeinc/react-native-senseye-sdk'

<Experiments.Calibration/>
```

If you prefer to build the SDK locally, clone this repo and run `yarn install` to get started.

## Documentation

Run `yarn docs` or open docs/index.html in a browser to view the documentation.

## Changelog

View changes and release history (https://github.com/senseye-inc/senseye-react-native-sdk/releases/)

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

BSD 3-Clause
