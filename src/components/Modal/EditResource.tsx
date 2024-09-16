import { editCachedResource, editResource } from '../../api/resources.api';
import { Resource } from '../../types/Resource';
import ResourceForm from './ResourceForm';

interface EditResourceProps {
  userData: Pick<Resource, 'owner_id' | 'owner_username'>;
  defaultValue: Pick<Resource, 'value'>;
  id: Resource['id'];
}

const EditResource = ({ userData, defaultValue, id }: EditResourceProps) => {
  return (
    <ResourceForm
      heading="Edit Resource"
      buttonLabel="Edit"
      mutationFn={(payload: Pick<Resource, 'value'>) =>
        editResource(payload, id)
      }
      defaultValue={defaultValue}
      userData={userData}
      queryUpdate={editCachedResource}
    />
  );
};

export default EditResource;
