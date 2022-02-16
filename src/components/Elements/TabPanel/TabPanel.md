```jsx
import React from "react";
import { Tab, Tabs } from "@mui/material";

// for tab control
const [value, setValue] = React.useState(1);

// handle tab change
const handleChange = (event, newValue) => {
    setValue(newValue);
};

<div>
    <Tabs value={value} onChange={handleChange}>
        <Tab label="Tab 1" value={1} />
        <Tab label="Tab 2" value={2} />
    </Tabs>
    <TabPanel value={value} index={1}>
        <p>This is Tab 1 content</p>
    </TabPanel>
    <TabPanel value={value} index={2}>
        <p>This is Tab 2 content</p>
    </TabPanel>
</div>;
```
