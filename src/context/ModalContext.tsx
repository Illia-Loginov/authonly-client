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
import NewResource from '../components/Modal/NewResource';
import EditResource from '../components/Modal/EditResource';
import ConfirmationDialogModal from '../components/Modal/ConfirmationDialogModal';

type ModalTypes =
  | typeof SignUp
  | typeof LogIn
  | typeof NewResource
  | typeof EditResource
  | typeof ConfirmationDialogModal;
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

const modalReducer = (_: null | ModalComponent, action: ModalAction) => {
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
