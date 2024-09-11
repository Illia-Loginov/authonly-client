import { AxiosError } from 'axios';
import { PickRequired } from '../types/customUtilityTypes';

export const isUnauthenticated = (
  error: unknown
): error is PickRequired<AxiosError<{ message: string }>, 'response'> => {
  return (
    error instanceof AxiosError &&
    error.response?.status === 401 &&
    typeof error.response.data?.message === 'string'
  );
};

export const isForbidden = (
  error: unknown
): error is PickRequired<AxiosError<{ message: string }>, 'response'> => {
  return (
    error instanceof AxiosError &&
    error.response?.status === 403 &&
    typeof error.response.data?.message === 'string'
  );
};

export const isBadRequest = <TPayload extends Record<string, any>>(
  error: unknown
): error is PickRequired<
  AxiosError<{
    message: string;
    issues?: {
      [key in keyof TPayload]?: string[];
    };
  }>,
  'response'
> => {
  return (
    error instanceof AxiosError &&
    error.response?.status === 400 &&
    typeof error.response.data?.message === 'string'
  );
};
