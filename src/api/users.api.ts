import { axiosInstance } from '../config/api.config';

export const fetchCurrentUser = async ({
  queryKey
}: {
  queryKey: ['whoami'];
}) => {
  return await axiosInstance.get<{
    user: {
      id: string;
      username: string;
    };
  }>('users', {
    validateStatus: (status) => {
      return (status >= 200 && status < 300) || status === 401;
    }
  });
};
