import Nav from './Nav';
import ResourcesList from './ResourcesList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <main>
        <Nav />
        <ResourcesList />
      </main>
    </QueryClientProvider>
  );
};

export default App;
