![CI/CD](https://github.com/gkrumbach07/thoth-search/workflows/CI/CD/badge.svg)

This is a React powered web app for displaying Python package metadata and insights using Thoth Advise.

## Website
You can check of the latest build here: [gkrumbach07.github.io/thoth-search](https://gkrumbach07.github.io/thoth-search)

## 🗄️ Project Structure

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
