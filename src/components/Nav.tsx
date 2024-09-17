import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteUser, fetchCurrentUser } from '../api/users.api';
import { useModalContext } from '../context/ModalContext';
import { MouseEvent, ReactNode } from 'react';
import SignUp from './Modal/SignUp';
import { logOut } from '../api/sessions.api';
import LogIn from './Modal/LogIn';
import { useErrorContext } from '../context/ErrorContext';
import NewResource from './Modal/NewResource';
import ConfirmationDialogModal from './Modal/ConfirmationDialogModal';
import { deleteCachedResourcesByUser } from '../api/resources.api';
import { useResourceSortContext } from '../context/ResourceSortContext';
import Button from './Shared/Button';

const NavContainer = ({ children }: { children: ReactNode }) => {
  return (
    <nav className="p-4 border-b-4 border-green-900 flex flex-row gap-6 items-center">
      {children}
    </nav>
  );
};

const Nav = () => {
  const { dispatch: modalDispatch } = useModalContext();
  const { dispatch: errorDispatch } = useErrorContext();
  const { sort } = useResourceSortContext();

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
      <NavContainer>
        <h2>Loading user data...</h2>
      </NavContainer>
    );
  }

  if (!user.data) {
    return (
      <NavContainer>
        <Button onClick={handleSignUp}>Sign Up</Button>
        <Button onClick={handleLogIn}>Log In</Button>
      </NavContainer>
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
          message={`Are you sure you want to delete the current user (${username})?`}
          mutationOptions={{
            mutationFn: () => deleteUser(id),
            onSuccess: () => {
              queryClient.setQueryData(['users'], null);
              queryClient.setQueryData(
                ...deleteCachedResourcesByUser(id, sort)
              );
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
    <NavContainer>
      <h2 className="font-bold text-xl">{username}</h2>
      <Button onClick={handleLogOut}>Log Out</Button>
      <Button onClick={handleNewResource}>New Resource</Button>
      <Button className="ml-auto" onClick={handleDeleteUser}>
        Delete User
      </Button>
    </NavContainer>
  );
};

export default Nav;
