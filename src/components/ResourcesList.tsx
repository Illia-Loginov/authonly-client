import { useQuery } from '@tanstack/react-query';
import { fetchResources } from '../api/resources.api';
import { fetchCurrentUser } from '../api/users.api';
import Resource from './Resource';

const ResourcesList = () => {
  const user = useQuery({
    queryKey: ['users'],
    queryFn: fetchCurrentUser
  });

  const resources = useQuery({
    queryKey: ['resources', { sort: { created_at: 'desc' } }],
    queryFn: fetchResources
  });

  if (resources.isPending) {
    return (
      <section>
        <h2 className="text-2xl">Loading...</h2>
      </section>
    );
  }

  if (resources.error || user.error) {
    return (
      <section>
        <h2 className="text-2xl">TODO: handle unexpected errors</h2>
      </section>
    );
  }

  return (
    <section>
      <h1 className="text-3xl">Resources</h1>
      {resources.data.map((resource) => (
        <Resource
          key={resource.id}
          id={resource.id}
          value={resource.value}
          owner={resource.owner_username}
          isOwner={!user.isPending && user.data?.id === resource.owner_id}
          created_at={resource.created_at}
        />
      ))}
    </section>
  );
};

export default ResourcesList;
