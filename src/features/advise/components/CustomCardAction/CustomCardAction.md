```jsx
const [value, setValue] = React.useState("new");

const handleChange = (event, newValue) => {
    // prevents selecting no buttons
    if (newValue) {
        setValue(newValue);
    }
};

<CustomCardAction onChange={handleChange} value={value} />;
```
