### 📡 API

**getFile** :: downloads a file text from any url

_url_ - the url to download from

### 🪝 Hooks

**useInterval** :: runs a function at an interval amount of time

_callback_ - the function to run

_delay_ - how often the function runs (seconds)

Example

```jsx static
import { useInterval } from "./useInterval";

function coolFunc() {
    // do something
}

useInterval(coolFunc, 10);
```
