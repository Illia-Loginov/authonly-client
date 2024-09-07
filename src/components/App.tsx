import Modal from './Modal/Modal';
import { ModalProvider } from './Modal/ModalContext';
import Nav from './Nav';
import ResourcesList from './ResourcesList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const App = () => {
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
