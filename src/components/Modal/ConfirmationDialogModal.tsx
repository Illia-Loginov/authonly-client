import { MutationOptions, useMutation } from '@tanstack/react-query';
import { MouseEvent } from 'react';

interface ConfirmationDialogModalProps {
  message: string;
  buttonText?: string;
  mutationOptions: MutationOptions;
}

const ConfirmationDialogModal = ({
  message,
  buttonText = 'Yes',
  mutationOptions
}: ConfirmationDialogModalProps) => {
  const mutation = useMutation(mutationOptions);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    mutation.mutate();
  };

  return (
    <div className="flex flex-col items-center">
      <h2>{message}</h2>
      <button onClick={handleClick}>{buttonText}</button>
    </div>
  );
};

export default ConfirmationDialogModal;
