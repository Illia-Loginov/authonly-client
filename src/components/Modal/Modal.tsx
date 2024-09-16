import { MouseEvent } from 'react';
import { useModalContext } from '../../context/ModalContext';

const Modal = () => {
  const { modalContent, dispatch } = useModalContext();

  if (!modalContent) {
    return <></>;
  }

  const handleClose = (e: MouseEvent) => {
    e.preventDefault();

    dispatch({ type: 'close' });
  };

  return (
    <div
      onClick={handleClose}
      className="fixed h-screen w-full flex justify-center items-center bg-green-800 bg-opacity-40 z-10"
    >
      <section
        onClick={(e) => e.stopPropagation()}
        className="bg-green-100 max-w-xl shadow-lg"
      >
        {modalContent}
      </section>
    </div>
  );
};

export default Modal;
