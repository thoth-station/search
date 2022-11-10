import * as React from "react";

export interface GlobalState {
  loading: {
    [key: string]: {
      text?: string;
      percent?: number;
      key: string;
      isLoading: boolean;
      isError: boolean;
    };
  };
}

interface GlobalAction {
  type: string;
  payload: unknown;
}

interface IActionMap {
  setLoading: (key: string, isLoading?: boolean, isError?: boolean, percent?: number, text?: string) => void;
}

function reducer(state: GlobalState, action: GlobalAction) {
  switch (action.type) {
    case "loading": {
      const payload = action.payload as {
        key: string;
        isLoading: boolean;
        isError: boolean;
        percent?: number;
        text?: string;
      };
      return {
        ...state,
        loading: {
          ...state.loading,
          [payload.key]: { ...payload },
        },
      };
    }

    default:
      return state;
  }
}

export const StateContext = React.createContext<GlobalState>({
  loading: {},
});

export const DispatchContext = React.createContext<IActionMap>({
  setLoading: () => undefined,
});

interface IGlobal {
  children?: JSX.Element;
  defaultState?: GlobalState;
}

export default function Global({ children, defaultState }: IGlobal) {
  // for state control
  const [state, dispatch] = React.useReducer(
    reducer,
    defaultState ?? {
      loading: {},
    },
  );

  const actionMap: IActionMap = {
    setLoading: (key: string, isLoading?: boolean, isError?: boolean, percent?: number, text?: string) => {
      dispatch({ type: "loading", payload: { key, isLoading, isError, percent, text } });
    },
  };

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={actionMap}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
}
