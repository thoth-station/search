import * as React from "react";

export const StateContext = React.createContext(undefined);
export const DispatchContext = React.createContext(undefined);

function reducer(state, action) {
    switch (action.type) {
        default:
            throw new Error("State dispatch error")
    }
}

export const initState = {};


export default function Global({children}) {
    // for state control
    const [state, dispatch] = React.useReducer(reducer, initState);
    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                {children}
            </DispatchContext.Provider>
        </StateContext.Provider>
    );
}
