import { FormEvent, useState } from 'react';
import { User } from '../../types/User';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isBadRequest, isUnauthenticated } from '../../utils/apiErrors';
import { useModalContext } from '../../context/ModalContext';
import { toCapitalized } from '../../utils/stringFormatting';
import { useErrorContext } from '../../context/ErrorContext';
import Button from '../Shared/Button';
import InputSection from '../Shared/InputSection';

interface AuthFormProps {
  displayName: string;
  mutationFn: (
    payload: Pick<User, 'username' | 'password'>
  ) => Promise<Pick<User, 'username' | 'id' | 'created_at'>>;
}

const AuthForm = ({ displayName, mutationFn }: AuthFormProps) => {
  const [formData, setFormData] = useState<Pick<User, 'username' | 'password'>>(
    {
      username: '',
      password: ''
    }
  );

  const [issueMessages, setIssueMessages] = useState<{
    username?: string;
    password?: string;
    globalIssue?: string;
  }>({});

  const { dispatch: modalDispatch } = useModalContext();
  const { dispatch: errorDispatch } = useErrorContext();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn,
    onError: (error) => {
      setFormData({
        username: '',
        password: ''
      });

      if (isUnauthenticated(error)) {
        setIssueMessages({
          globalIssue: error.response.data.message
        });
      } else if (isBadRequest(error)) {
        if (error.response.data.message === 'Invalid input') {
          setIssueMessages({
            username: error.response.data.issues?.username?.join('; '),
            password: error.response.data.issues?.password?.join('; ')
          });
        } else {
          setIssueMessages({
            globalIssue: toCapitalized(error.response.data.message)
          });
        }
      } else {
        errorDispatch({ type: 'throw', error });
      }
    },
    onSuccess: (user) => {
      queryClient.setQueryData(['users'], user);

      modalDispatch({ type: 'close' });
    }
  });

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIssueMessages({});

    mutation.mutate(formData);
  };

  return (
    <>
      <h2 className="text-xl p-4 bg-green-700 text-green-200">{displayName}</h2>
      <form onSubmit={handleFormSubmit} className="flex flex-col p-4 gap-4">
        {issueMessages.globalIssue && (
          <p className="text-green-600 text-sm">{issueMessages.globalIssue}</p>
        )}

        <InputSection
          label="Username"
          type="text"
          name="username"
          id="username"
          value={formData.username}
          issue={issueMessages.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          {...(mutation.isPending && { disabled: true })}
        />

        <InputSection
          label="Password"
          type="password"
          name="password"
          id="password"
          value={formData.password}
          issue={issueMessages.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          {...(mutation.isPending && { disabled: true })}
        />

        <Button {...(mutation.isPending && { disabled: true })}>
          {displayName}
        </Button>
      </form>
    </>
  );
};

export default AuthForm;
