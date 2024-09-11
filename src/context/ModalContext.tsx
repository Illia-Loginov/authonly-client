import {
  ComponentProps,
  createContext,
  Dispatch,
  FC,
  ReactElement,
  ReactNode,
  useContext,
  useReducer
} from 'react';
import SignUp from '../components/Modal/SignUp';
import LogIn from '../components/Modal/LogIn';

type ModalTypes = typeof SignUp | typeof LogIn;
type ModalComponent = ReactElement<ComponentProps<ModalTypes>, ModalTypes>;

type ModalAction =
  | {
      type: 'close';
    }
  | {
      type: 'open';
      component: ModalComponent;
    };

interface ModalContextValue {
  modalContent: null | ModalComponent;
  dispatch: Dispatch<ModalAction>;
}

const ModalContext = createContext<ModalContextValue | null>(null);

const modalReducer = (content: null | ModalComponent, action: ModalAction) => {
  if (!!content === (action.type === 'open')) {
    throw new Error('Invalid reducer action');
  }

  if (action.type === 'close') {
    return null;
  }

  return action.component;
};

export const ModalProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [modalContent, dispatch] = useReducer(modalReducer, null);

  const contextValue: ModalContextValue = {
    modalContent,
    dispatch
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  const context = useContext(ModalContext);

  if (context === null) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }

  return context;
};
