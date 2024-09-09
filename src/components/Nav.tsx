import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchCurrentUser } from '../api/users.api';
import { useModalContext } from './Modal/ModalContext';
import { MouseEvent } from 'react';
import SignUp from './Modal/SignUp';
import { logOut } from '../api/sessions.api';
import LogIn from './Modal/LogIn';

const Nav = () => {
  const { dispatch } = useModalContext();

  const queryClient = useQueryClient();

  const logOutMutation = useMutation({
    mutationFn: logOut,
    onError: (error) => {
      console.log('TODO: handle unexpected errors', error);
      throw error;
    },
    onSuccess: () => {
      queryClient.setQueryData(['whoami'], null);
    }
  });

  const handleSignUp = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    dispatch({ type: 'open', component: <SignUp /> });
  };

  const handleLogIn = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    dispatch({ type: 'open', component: <LogIn /> });
  };

  const handleLogOut = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    logOutMutation.mutate();
  };

  const handleNewResource = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    dispatch({
      type: 'open',
      component: <></> // TODO: pass NewResource component
    });
  };

  const user = useQuery({
    queryKey: ['whoami'],
    queryFn: fetchCurrentUser
  });

  if (user.isPending) {
    return (
      <nav>
        <h2>Loading...</h2>
      </nav>
    );
  }

  if (user.error) {
    return (
      <nav>
        <h2>TODO: handle unexpected errors</h2>
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

  return (
    <nav>
      <h2 title={id}>{username}</h2>
      <button onClick={handleLogOut}>Log Out</button>
      <button onClick={handleNewResource}>New Resource</button>
    </nav>
  );
};

export default Nav;
