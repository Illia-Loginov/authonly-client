import { signUp } from '../../api/users.api';
import AuthForm from './AuthForm';

const SignUp = () => {
  return <AuthForm displayName="Sign Up" mutationFn={signUp} />;
};

export default SignUp;
