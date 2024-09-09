import { axiosInstance as axios } from '../config/api.config';
import { User } from '../types/User';
import { isUnauthenticated } from '../utils/apiErrors';

export const fetchCurrentUser = async ({
  queryKey
}: {
  queryKey: ['whoami'];
}) => {
  try {
    const response = await axios.get<{
      user: Pick<User, 'id' | 'username'>;
    }>('users');

    return response.data.user;
  } catch (error) {
    if (isUnauthenticated(error)) {
      return null;
    }

    throw error;
  }
};

export const signUp = async (payload: Pick<User, 'username' | 'password'>) => {
  const response = await axios.post<{
    user: Pick<User, 'id' | 'username' | 'created_at'>;
  }>('users', payload);

  return response.data.user;
};
