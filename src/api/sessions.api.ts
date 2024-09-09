import { axiosInstance as axios } from '../config/api.config';

export const logOut = async () => {
  await axios.delete('sessions');
};
