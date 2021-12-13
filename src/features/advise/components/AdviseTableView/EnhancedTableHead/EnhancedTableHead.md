```jsx
import { useState } from "react";

const [order, setOrder] = useState("asc");
const [orderBy, setOrderBy] = React.useState("name");

const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
};

<EnhancedTableHead
    orderBy={orderBy}
    order={order}
    onRequestSort={handleRequestSort}
/>;
```
