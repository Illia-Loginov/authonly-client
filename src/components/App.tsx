import Modal from './Modal/Modal';
import { ModalProvider } from '../context/ModalContext';
import Nav from './Nav';
import ResourcesList from './ResourcesList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useErrorContext } from '../context/ErrorContext';
import Error from './Error';

const queryClient = new QueryClient();

const App = () => {
  const { error } = useErrorContext();

  if (error) {
    return <Error error={error} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <Modal />
        <main className="p-4">
          <Nav />
          <ResourcesList />
        </main>
      </ModalProvider>
    </QueryClientProvider>
  );
};

export default App;
