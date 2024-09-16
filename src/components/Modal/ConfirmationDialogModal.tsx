import { MutationOptions, useMutation } from '@tanstack/react-query';
import { MouseEvent } from 'react';
import Button from '../Shared/Button';

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
    <div className="flex flex-col p-4 gap-4 w-80">
      <h2 className="text-lg">{message}</h2>
      <Button onClick={handleClick}>{buttonText}</Button>
    </div>
  );
};

export default ConfirmationDialogModal;
