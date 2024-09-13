import { AxiosError } from 'axios';

const Error = ({ error }: { error: Error }) => {
  const code = error instanceof AxiosError && error.response?.status;

  return (
    <main className="h-screen w-full flex flex-col justify-center items-center">
      <h1 className="text-3xl">Error{code ? ` ${code}` : ''}</h1>
      <p>{error.message}</p>
    </main>
  );
};

export default Error;
