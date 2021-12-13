# Thoth Search 
![CI/CD](https://github.com/thoth-station/thoth-search/workflows/CI/CD/badge.svg)


This is a React powered web app for displaying Python package metadata and insights using Thoth Advise.
You can check of the latest build here: [thoth-station.ninja/search](https://thoth-station.ninja/search)

## See a bug?
Create an issue describing the bug and how to reproduce it. It helps if you include the advisor ID or package name and version with your issue.

## How to contribute
Fork the project and install the dependencies using `yarn`. Also take a look at github.com/alan2207/bulletproof-react as a guide on how to structure new components.
This project follows that file structure mostly. More info bellow and in the documentation `/docs`

### Project Structure

Most of the code lives in the `src` folder and looks like this:

```text
src
|
+-- assets            # assets folder can contain all the static files such as images, fonts, etc.
|
+-- components        # shared components used across the entire application
|
+-- config            # all the global configuration, env variables etc. get exported from here and used in the app
|
+-- features          # feature based modules
|
+-- hooks             # shared hooks used across the entire application
|
+-- lib               # re-exporting different libraries preconfigured for the application
|
+-- providers         # all of the application providers
|
+-- routes            # routes configuration
|
+-- stores            # global state stores
|
+-- test              # test utilities and mock server
|
+-- utils             # shared utility functions
```

### Adding a new metric card
A commom new feature is adding a new metric card to either the package dashboard or advise summary dashboard.
Advise metrics are contained in the `src/features/advise` (read up on what a feature is in the docs or [here](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)). The metrics themsleves are defined in the `src/features/advise/hooks/useMetrics.js` hook and its UI in `src/features/advise/components/{metric_name}Metric`. Follow the structure of one of the already created metrics. Metrics are finally placed in `routes/AdviseSummary` inside the feature.

This same process is the same for metrics for a package but now under the `package` feature.

## Documentation
We use [react-styleguidist](https://react-styleguidist.js.org/) for documentation building. Check out their docs to learn more.

To run docs locally: `styleguide:build`

To build docs: `yarn run styleguide`
