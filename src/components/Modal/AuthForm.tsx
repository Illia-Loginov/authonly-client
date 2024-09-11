import { FormEvent, useState } from 'react';
import { User } from '../../types/User';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isBadRequest, isUnauthenticated } from '../../utils/apiErrors';
import { useModalContext } from './ModalContext';
import { toCapitalized } from '../../utils/stringDisplayFormatting';

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

  const { dispatch } = useModalContext();

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
        console.log('TODO: handle unexpected errors', error);
        throw error;
      }
    },
    onSuccess: (user) => {
      queryClient.setQueryData(['users'], user);

      dispatch({ type: 'close' });
    }
  });

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIssueMessages({});

    mutation.mutate(formData);
  };

  return (
    <>
      <h2 className="text-2xl mb-4">{displayName}</h2>
      <form onSubmit={handleFormSubmit} className="flex flex-col w-64">
        {issueMessages.globalIssue && (
          <p className="mb-4">{issueMessages.globalIssue}</p>
        )}

        <label htmlFor="username">Username</label>
        {issueMessages.username && <p>{issueMessages.username}</p>}
        <input
          className="mb-4"
          type="text"
          name="username"
          id="username"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          {...(mutation.isPending && { disabled: true })}
        />

        <label htmlFor="password">Password</label>
        {issueMessages.password && <p>{issueMessages.password}</p>}
        <input
          className="mb-4"
          type="password"
          name="password"
          id="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          {...(mutation.isPending && { disabled: true })}
        />

        <button type="submit" {...(mutation.isPending && { disabled: true })}>
          {displayName}
        </button>
      </form>
    </>
  );
};

export default AuthForm;
