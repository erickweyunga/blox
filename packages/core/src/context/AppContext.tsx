import React, { createContext, useContext, useReducer, ReactNode } from "react";

export interface AppState {
  [key: string]: any;
}

type Action =
  | { type: "SET_STATE"; key: string; value: any }
  | { type: "RESET_STATE"; initalState: AppState };

// Create app context
const AppStateContext = createContext<AppState | undefined>(undefined);
const AppDispatchContext = createContext<React.Dispatch<Action> | undefined>(
  undefined
);

// App reducer function
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_STATE":
      return {
        ...state,
        [action.key]: action.value,
      };
    case "RESET_STATE":
      return {
        ...action.initalState,
      };
    default:
      return state;
  }
}

// App provider component
interface AppProviderProps {
  initialState?: AppState;
  children: ReactNode;
}

export function AppProvider({ initialState, children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState || {});

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

// Custom hooks to use state and dispatch

export function useAppState<T = any>(key: string): T | undefined {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error("useAppState must be used within a AppProvider");
  }
  return context[key] as T | undefined;
}

export function useAppDispatch() {
  const context = useContext(AppDispatchContext);
  if (context === undefined) {
    throw new Error("useAppDispatch must be used within a AppProvider");
  }
  return context;
}

// Helper hook to both get and set state for a specific key
export function useAppContext<T = any>(
  key: string,
  initialValue?: T
): [T | undefined, (value: T) => void] {
  const state = useAppState<T>(key);
  const dispatch = useAppDispatch();

  // Set initial value if not already set
  React.useEffect(() => {
    if (initialValue !== undefined && state === undefined) {
      dispatch({ type: "SET_STATE", key, value: initialValue });
    }
  }, [key, initialValue, dispatch, state]);

  const setState = React.useCallback(
    (value: T) => {
      dispatch({ type: "SET_STATE", key, value });
    },
    [dispatch, key]
  );

  return [state, setState];
}
