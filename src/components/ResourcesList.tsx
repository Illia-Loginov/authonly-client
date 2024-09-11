import { useQuery } from '@tanstack/react-query';
import { fetchResources } from '../api/resources.api';
import { fetchCurrentUser } from '../api/users.api';
import ResourceCard from './ResourceCard';
import { useErrorContext } from '../context/ErrorContext';

const ResourcesList = () => {
  const { dispatch: errorDispatch } = useErrorContext();

  const user = useQuery({
    queryKey: ['users'],
    queryFn: fetchCurrentUser,
    throwOnError: (error, _) => {
      errorDispatch({ type: 'throw', error });

      return false;
    }
  });

  const resources = useQuery({
    queryKey: ['resources', { sort: { created_at: 'desc' } }],
    queryFn: fetchResources,
    throwOnError: (error, _) => {
      errorDispatch({ type: 'throw', error });

      return false;
    }
  });

  if (resources.isPending) {
    return (
      <section>
        <h2 className="text-2xl">Loading resources...</h2>
      </section>
    );
  }

  return (
    <section>
      <h1 className="text-3xl">Resources</h1>
      {(resources.data || []).map((resource) => (
        <ResourceCard
          key={resource.id}
          id={resource.id}
          value={resource.value}
          owner_id={resource.owner_id}
          owner_username={resource.owner_username}
          isOwner={!user.isPending && user.data?.id === resource.owner_id}
          created_at={resource.created_at}
        />
      ))}
    </section>
  );
};

export default ResourcesList;
