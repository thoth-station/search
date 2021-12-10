```jsx
import React from "react";
import { Search } from "@material-ui/icons";

const [search, setSearch] = React.useState("");
const [errorText, setErrorText] = React.useState("");

const handleChange = event => {
    setSearch(event.target.value);
    setErrorText("");
};

const handleSearch = () => {
    if (parseInt(search)) {
        window.alert("You searched a number!");
    } else {
        setErrorText("The text must be a number.");
    }
};

<SearchBar
    label={errorText ? errorText : "Search a number"}
    error={errorText !== ""}
    helpertext={"enter a number"}
    righticon={<Search />}
    onChange={handleChange}
    onEnter={handleSearch}
/>;
```
