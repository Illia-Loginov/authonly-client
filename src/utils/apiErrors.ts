import { AxiosError } from 'axios';

export const isUnauthenticated = (error: unknown) => {
  return error instanceof AxiosError && error.response?.status === 401;
};
