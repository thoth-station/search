```jsx
import InfoCard from "./InfoCard";

<InfoCard
    cardMeta={{
        title: "Foo",
        subTitle: "Bar",
    }}
    cardAction={
        <button onClick={() => window.alert("Action clicked!")}>Click!</button>
    }
    cardBody={
        <div>
            <p>body content</p>
        </div>
    }
/>;
```
