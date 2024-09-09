import { axiosInstance as axios } from '../config/api.config';
import { User } from '../types/User';

export const logOut = async () => {
  await axios.delete('sessions');
};

export const logIn = async (payload: Pick<User, 'username' | 'password'>) => {
  const response = await axios.post<{
    user: Pick<User, 'id' | 'username' | 'created_at'>;
  }>('sessions', payload);

  return response.data.user;
};
