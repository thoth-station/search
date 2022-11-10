# Atomic Design for React

These rules are based on a [guide by Ben Fox](https://benjaminwfox.com/blog/tech/atomic-design-for-developers) which is based on [Brad Frost's Atomic Web Design concept](https://bradfrost.com/blog/post/atomic-web-design/)

## Atoms

The basic building blocks of a webpage. They are application independent, meaning they are not tied to a specific type of data.

**Examples**

- `Label`: a `<p>` element styled with a specific font and color scheme.
- `Input`: a text box that has specific rules for its contents.
- `Button`: a stylized button to match the theme of the app.

**Rules**

- Should not compose other components/only uses native elements or framework-specific components similar to native elements
- Can have its own markup & styles
- Can maintain its own internal state
- Should not be tightly coupled to specific UI or Logic areas
- Should not access application (or higher level) state directly
- Should not have any non-ui/layout related side effects
- Should not implement any application-specific business logic

This project uses [Material UI](https://mui.com/) as a foundation for many _atom_ components.

## Molecules

Small combinations of atoms that preform a single function and are application independent.

**Example**

`<Label/>` + `<Input/>` + `<Button/>` = `<SearchBar/>`

**Rules**

- A component made up of one or more Atoms
- Can have its own markup & styles
- Can maintain its own internal state
- Should not be tightly coupled to specific UI or Logic areas
- Should not access application (or higher level) state directly
- Should not have any non-ui/layout related side effects
- Should not implement any application-specific business logic

## Organisms

Organisms are combinations of atoms and molecules to form more application specific functions. Organisms can be ties to a specific feature or be more general.

**Examples**

`<SearchBar/>` + `<PackageList/>` + `<Button/>` = `<PackageSearchArea/>`

Organisms can also implement _templates_ to better organize sections of a _page_.

**Examples**

```jsx
<PackageSearchArea />
```

↓

```jsx
<VerticalStack>
  <HorizontalStack>
    <SearchBar />
    <Button />
  </HorizontalStack>
  <PackageList />
</VerticalStack>
```

**Rules**

- A complex component made up of multiple atoms and/or molecules and/or other organisms
- Can have its own markup & styles
- Can fetch application-specific data
- Can implement application-specific business logic
- Can be connected to application (or higher level) state
- Can be tightly coupled with a specific area (UI and/or Logic) of the app
- Can be organized into sub-folders by logical categorization (feature, page, etc...)

## Templates

Templates are layouts that _pages_, _organisms_, and sometimes _molecules_ can use to keep spacing consistent across the app.

**Examples**
`<VerticalStack/>` = A _flex_ container that stacks components vertically with specific margins and spacing.

**Rules**

- Can have its own markup & styles.
- Can accept & pass props as required.
- Should not access application (or higher level) state
- Should not have any non-ui/layout related side effects
- Should not implement any application-specific business logic

## Pages

A _Page_ combines everything together. They implement templates and pass in specific organisms into respective sections of the template.

**Rules**

- A component that implements a particular template
- Can fetch application-specific data
- Can implement application-specific business logic
- Can be connected to application (or higher level) state
- Should not have its own markup & styles

## Routes

A route is a special type of component that links pages to routes. These components don't implement any data fetching; that is reserved for _pages_ and _organisms_

# How and where to fetch data

## How

In this app we follow the pattern of fetching data through the use of hooks. Data should not be fetched directly in a component to encourage reusable tooling.

**Example**

```jsx
import AppContext from "./AppContext"

const usePackage = () => {
    // for relaying errors specific to where this hook was used
    const [error, setError] = React.useState<string | undefined>()

    // using the React hook useContext to grab the global state for the selected package. This keeps all usePackage hooks in sync with each other.
    const {selectedPackage, setSelectedPackage} = React.useContext(AppContext)

    // A wrapper around setSelectedPackage that preforms a GET request to an API storing package data.
    const changePackage = (package: string) => {
        getPackage(package)
            .then(response => {
                // set the globally selected package
                setSelectedPackage(response.data)

                // reset the error back to undefined
                setError(undefined)
            })
            .catch(error => setError(error.data.message))
    }
    // we return the global selected package, the wrapper function, and the error string
    return {package: selectedPackage, changePackage, error}
}

const PackageList = () => {
    const {package, changePackage, error} = usePackage();

    // if error is not undefined,
    // then there is an error message to display
    if(error) {
        return (
            <h1>{error}</h1>
        )
    }
    // if no error and package is undefined,
    // then there is not a selected package
    if(!package) {
        return (
            <h1>No Package Selected</h1>
        )
    }

    // if the package exists
    return (
        <div>
            <SearchBar
                onSearch={changePackage}
                helperText="Search for a package"
            />
            <h1>{package.name}</h1>
            <p>version: {package.version}</p>
            <p>license: {package.license}</p>
        </div>
    )
}

```

the `<PackageList/>` component does not directly fetch the package data. Instead it calls the `usePackage` hook which handles the fetching and state management for the component. The hook in this case is storing the selected package globally so that other components can see what package is selected.

You should use hooks to abstract out the fetching of data, as well as other processes that should be shared across other components such as a notification system.

## Where

These hooks should only be used in _organisms_ and _pages_.
