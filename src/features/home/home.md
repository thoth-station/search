The home feature scopes for the landing page off the app. The core functionalities include searching for a
package and searching/building a Thoth Advise report. 

### 📄 Pages
There is only one page but it can be split into two tabs: **package search** and **advise report search**.

The **package search** tab consists of a single search bar which invokes the `usePackageMetadata` hook.

The **advise report search** tab has two options in itself: searching for an already built advise report or building
an advise report. Searching redirects to the advise feature and building invokes the `usePostAdvise` hook
to start the Thoth Advise process server side.

### 📡 API
**usePostAdivse** :: starts up an advise report build.

_pipfile_ - (string) the raw pipfile contents

_pipfileLock_ - (string) the raw pipfile.lock contents

_runtime_environment_ - (object) an object with runtime environment settings
```js static
{
    operating_system: {
        name: "",
        version: ""
    },
    platform: "",
    python_version: "",
    base_image: "",
    cuda_version: "",
    cudnn_version: "",
    mkl_version: "",
    name: "",
    openblas_version: "",
    openmpi_version: "",
}
```

