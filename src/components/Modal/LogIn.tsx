import { logIn } from '../../api/sessions.api';
import AuthForm from './AuthForm';

const LogIn = () => {
  return <AuthForm displayName="Log In" mutationFn={logIn} />;
};

export default LogIn;
