import { axiosInstance } from '../config/api.config';
import { isUnauthenticated } from '../utils/apiErrors';

export const fetchCurrentUser = async ({
  queryKey
}: {
  queryKey: ['whoami'];
}) => {
  try {
    const response = await axiosInstance.get<{
      user: {
        id: string;
        username: string;
      };
    }>('users');

    return response.data.user;
  } catch (error) {
    if (isUnauthenticated(error)) {
      return null;
    }

    throw error;
  }
};
