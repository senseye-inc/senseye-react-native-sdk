# Senseye SDK

The Senseye SDK provides direct integration into the Senseye API on both iOS and Android for React Native apps. The JavaScript API is simple and cross-platform. Ready to get started? Follow the instructions for either local installation or stand-alone package installation.

## What’s in this repo

```
.
+-- docs/           # See Documentation section of this README
+-- example/        # Contains an example app that demos usage of the SDK
+-- src/
|   +-- api/        # Modules for interfacing with the Senseye API
|   +-- components/ # Modules for serving Senseye frontend components
+-- package.json    # Defines package dependencies, build utilities, and pre-commit hook directives. See contributing guide for more information on these directives
```

## Included Tasks

- Calibration
- PLR (Pupillary Light Response)
- Smooth Pursuit

## Requirements

Minimum `iOS 12.0` or `Android API Level 24`. You may use Windows, macOS or Linux as your development operating system.

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

- [Atom](https://atom.io/): You can install `autocomplete-modules` and enable "Babel Plugin Module Resolver" in its settings.

## Usage

1. Execute Tasks and record Session data by utilizing TaskRunner.
    ```javascript
    import { TaskRunner, Tasks, Models } from '@senseyeinc/react-native-senseye-sdk';

    export default function App() {
      return (
        <TaskRunner onEnd={myCallback(session: Models.Session)}>
          <Tasks.Calibration />
          <Tasks.Plr />
        </TaskRunner>
      );
    }
    ```

2. Instantiate a SenseyeApiClient.
    ```javascript
    import { SenseyeApiClient, Constants } from '@senseyeinc/react-native-senseye-sdk';

    const apiClient = new SenseyeApiClient(Constants.API_HOST, Constants.API_BASE_PATH, 'my_api_key');
    ```

3. Upload Session data.
    ```javascript
    const res = await session.uploadAll(apiClient)

    let videoUrls: string[] = [];
    res[0].forEach((v) => {
      videoUrls.push(v.s3_url);
    });
    console.log('uploaded videos: ' + videoUrls);
    console.log('uploaded json: ' + res[1].s3_url);
    ```

4. Execute prediction on uploaded videos and poll for results.
    ```javascript
    const jobId = (await apiClient.startPrediction(videoUrls)).id;

    setInterval(() => {
      apiClient
        .getPrediction(jobId)
        .then((job) => {
          if (
            job.status === Constants.JobStatus.COMPLETED ||
            job.status === Constants.JobStatus.FAILED
          ) {
            clearInterval(resultPollId);
            if (job.result !== undefined) {
              console.log('result: ' + JSON.stringify(job.result));
            }
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }, 3000);
    ```

## Example App

An example React Native app is provided in the [example/](/example/) directory. You can run `yarn bootstrap` to install its dependencies.

Instructions on how to run the app can be found in the [example README](/example/README.md).

## Documentation

Run `yarn docs` to start a local server on port 9090 and automatically open a browser to the documentation, or simply open docs/index.html in a browser to view the same contents without running the server.

## Changelog

View changes and release history (https://github.com/senseye-inc/senseye-react-native-sdk/releases/)

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

BSD 3-Clause
