import { useQuery } from '@tanstack/react-query';
import { fetchCurrentUser } from '../api/users.api';

const Nav = () => {
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
        <button>Sign Up</button>
        <button>Log In</button>
      </nav>
    );
  }

  const { id, username } = user.data;

  return (
    <nav>
      <h2 title={id}>{username}</h2>
      <button>Log Out</button>
      <button>New Resource</button>
    </nav>
  );
};

export default Nav;
