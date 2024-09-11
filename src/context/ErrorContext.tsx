import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  useContext,
  useReducer
} from 'react';

type ErrorContextAction = {
  type: 'throw';
  error: Error;
};

interface ErrorContextValue {
  error: null | Error;
  dispatch: Dispatch<ErrorContextAction>;
}

const ErrorContext = createContext<ErrorContextValue | null>(null);

const errorReducer = (
  _: null | Error,
  action: ErrorContextAction
): null | Error => {
  return action.error;
};

export const ErrorProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [error, dispatch] = useReducer(errorReducer, null);

  const contextValue: ErrorContextValue = {
    error,
    dispatch
  };

  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useErrorContext = () => {
  const context = useContext(ErrorContext);

  if (context === null) {
    throw new Error('useErrorContext must be used within a ErrorProvider');
  }

  return context;
};
