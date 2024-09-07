import { useQuery } from '@tanstack/react-query';
import { fetchCurrentUser } from '../api/users.api';
import { useModalContext } from './Modal/ModalContext';
import { MouseEvent } from 'react';

const Nav = () => {
  const { dispatch } = useModalContext();

  const handleSignUp = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    dispatch({ type: 'open', component: <></> }); // TODO: pass Sing Up component
  };

  const handleLogIn = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    dispatch({
      type: 'open',
      component: <></> // TODO: pass Log In component
    });
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
      <button>Log Out</button>
      <button onClick={handleNewResource}>New Resource</button>
    </nav>
  );
};

export default Nav;
