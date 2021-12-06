Advise controls the vast majority of the Thoth Advisor functionality and visualization.
Data flows through multiple data manipulation and cleaning filters before it is used for visualization.
The only input that is needed is an advisor document id which is grabbed from the url route
`*/advise/adviser-211112223258-38af1a4746733b53`.

The data flows in the following way:

```js static
document_id // input
↓
document = useAdviseDocument(document_id) // get advise results from Thoth
↓
formatted_data1 = formatLockfile(document_id.lockfile1) // format pipfile.lock into readbale json
graph1 = useGraph(formatted_data1) // form dependency graph from pipfile.lock packages

formatted_data2 = formatLockfile(document_id.lockfile2) // repeat for another pipfile.lock
graph2 = useGraph(formatted_data2) // repeat
↓
mergedGraph = useMergeGraphs(graph1, graph2) // combine two graphs and mark the differences
↓
metrics = useMetrics(mergedGraph) // run analysis on differences 
```

Specifics on the hooks used to get and mutate data are described later in the documentation.

### 📄 Pages
The advise feature is split into two major pages: **summary** and **details**.

The **summary** page displays the metrics computed from the `useMetrics()` hook and visualizes the metrics
through card components. Each metric is computed in the hook and passed into its respective visualizer card.

The **details** page visualizes the output of  dthe `useMergeGraphs()` hook. This page is further split into two sections:
**selected package view** and **list view**. These two views are described in more detail in their respective components.

### 📡 API
The api in the scope of the advise feature includes getting an advise document and getting package dependencies.
The calls to Thoth User API are abstracted through `react-query` useQuery hook. More info on this usage later in the docs.

**getAdviseDocument()** :: An async function that returns a promise for `{base_url}/advise/python`.

_analysis_id_ - the advise document id

Examples
```jsx static
import {useAdviseDocument} from "./getAdviseDocument";

const doc = useAdviseDocument("adviser-211112223258-38af1a4746733b53");
```

**getPackageDependencies()** :: An async function that returns a promise for `{base_url}/python/package/dependencies`.

_name_ - the name of the package

_version_ - the version of the package

Examples
```jsx static
import {usePackageDependencies, usePackagesDependencies} from "./getPackageDependencies";

const package_deps = usePackageDependencies("kafka", "2.0")
const packages_deps = usePackagesDependencies([
    {
        name: "kafka",
        version: "2.0"
    },
    {
        name: "tensorflow",
        version: "1.0"
    }
])
```

### 🪝 Hooks
**useGraph()** :: creates a connected graph using a list of packages and their respective dependencies.

_data_ - a formatted list of packages (see `usePackagesDependencies` params)

_knownRoots_ - a key value object where the key is a known root

Example

```jsx static
import {useGraph} from "./useGraph";

const data = [
    {
        name: "kafka",
        version: "2.0"
    },
    {
        name: "tensorflow",
        version: "1.0"
    }
]

const knownRoots = {"kafka": null}

const graph  = useGraph(data, knownRoots)
```

**useMergeGraphs()** :: merges two graph objects into one, while also taking note of the differences.

_oldGraph_ - output of `useGraph`

_newGraph_ - output of `useGraph`

_adviseDocument_ - output of `useAdviseDocument`

Example

```jsx static
import {useGraph} from "./useGraph";
import {useAdviseDocument} from "./getAdviseDocument";
import {useMergeGraphs} from "./useMergeGraphs";

const adviseDocument = useAdviseDocument("id")
const oldGraph = useGraph(data_1, knownRoots_1)
const newGraph = useGraph(data_2, knownRoots_2)

const mergedGraph = useMergeGraphs(oldGraph, newGraph, adviseDocument)
```

**useMetrics** :: generates an object of analysis on a merged graph

_oldGraph_ - output of `useGraph`

_newGraph_ - output of `useGraph`

_adviseDocument_ - output of `useAdviseDocument`

_mergedGraph_ - output of `useMergedGraph`

Metrics produced are: dependency counts, licenses, and changes between graph. To add more metrics,
create a new metric hook inside useMetrics.js similar to how useDependencyMetric() is implemented.

Example

```jsx static
import {useGraph} from "./useGraph";
import {useAdviseDocument} from "./getAdviseDocument";
import {useMergeGraphs} from "./useMergeGraphs";
import {useMetrics} from "./useMetrics";

const adviseDocument = useAdviseDocument("id")
const oldGraph = useGraph(data_1, knownRoots_1)
const newGraph = useGraph(data_2, knownRoots_2)
const mergedGraph = useMergeGraphs(oldGraph, newGraph, adviseDocument)

const metrics = useMetrics(oldGraph, newGraph, mergedGraph, adviseDocument)
```

### ⚙️ Utils

**calcTime** :: Given either a date and time, calculated time since that date.

**discoverPackageChanges** :: iterates through a merged graph to find why a package was removed, added, or changed.

**formatLockfile** :: given the output of `useAdviseDocument`, it creates a formatted input for `useGraph`.