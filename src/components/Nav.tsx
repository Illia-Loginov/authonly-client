import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteUser, fetchCurrentUser } from '../api/users.api';
import { useModalContext } from '../context/ModalContext';
import { MouseEvent } from 'react';
import SignUp from './Modal/SignUp';
import { logOut } from '../api/sessions.api';
import LogIn from './Modal/LogIn';
import { useErrorContext } from '../context/ErrorContext';
import NewResource from './Modal/NewResource';
import ConfirmationDialogModal from './Modal/ConfirmationDialogModal';
import { isForbidden, isUnauthenticated } from '../utils/apiErrors';
import { deleteCachedResourcesByUser } from '../api/resources.api';

const Nav = () => {
  const { dispatch: modalDispatch } = useModalContext();
  const { dispatch: errorDispatch } = useErrorContext();

  const queryClient = useQueryClient();

  const logOutMutation = useMutation({
    mutationFn: logOut,
    onError: (error) => {
      errorDispatch({ type: 'throw', error });
    },
    onSuccess: () => {
      queryClient.setQueryData(['users'], null);
    }
  });

  const handleSignUp = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    modalDispatch({ type: 'open', component: <SignUp /> });
  };

  const handleLogIn = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    modalDispatch({ type: 'open', component: <LogIn /> });
  };

  const handleLogOut = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    logOutMutation.mutate();
  };

  const user = useQuery({
    queryKey: ['users'],
    queryFn: fetchCurrentUser,
    throwOnError: (error, _) => {
      errorDispatch({ type: 'throw', error });

      return false;
    }
  });

  if (user.isPending) {
    return (
      <nav>
        <h2>Loading user data...</h2>
      </nav>
    );
  }

  if (!user.data) {
    return (
      <nav>
        <button onClick={handleSignUp}>Sign Up</button>
        <button onClick={handleLogIn}>Log In</button>
      </nav>
    );
  }

  const { id, username } = user.data;

  const handleNewResource = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    modalDispatch({
      type: 'open',
      component: (
        <NewResource userData={{ owner_id: id, owner_username: username }} />
      )
    });
  };

  const handleDeleteUser = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    modalDispatch({
      type: 'open',
      component: (
        <ConfirmationDialogModal
          message={`Are you sure you want to delete current user (${username})?`}
          mutationOptions={{
            mutationFn: () => deleteUser(id),
            onSuccess: () => {
              queryClient.setQueryData(['users'], null);
              queryClient.setQueryData(...deleteCachedResourcesByUser(id));
              modalDispatch({ type: 'close' });
            },
            onError: (error) => {
              errorDispatch({ type: 'throw', error });
            }
          }}
        />
      )
    });
  };

  return (
    <nav>
      <h2 title={id}>{username}</h2>
      <button onClick={handleLogOut}>Log Out</button>
      <button onClick={handleNewResource}>New Resource</button>
      <button onClick={handleDeleteUser}>Delete User</button>
    </nav>
  );
};

export default Nav;
