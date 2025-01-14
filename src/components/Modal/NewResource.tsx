import { addCachedResource, createResource } from '../../api/resources.api';
import { Resource } from '../../types/Resource';
import ResourceForm from './ResourceForm';

interface NewResourceProps {
  userData: Pick<Resource, 'owner_id' | 'owner_username'>;
}

const NewResource = ({ userData }: NewResourceProps) => {
  return (
    <ResourceForm
      heading="New Resource"
      buttonLabel="Create"
      mutationFn={createResource}
      defaultValue={{ value: '' }}
      userData={userData}
      queryUpdate={addCachedResource}
    />
  );
};

export default NewResource;
