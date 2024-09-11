import { editResource } from '../../api/resources.api';
import { Resource } from '../../types/Resource';
import ResourceForm from './ResourceForm';

interface EditResourceProps {
  userData: Pick<Resource, 'owner_id' | 'owner_username'>;
  defaultValue: Pick<Resource, 'value'>;
  id: Resource['id'];
}

const queryUpdate = (
  oldResources: Resource[] | undefined,
  newResource: Resource
) => {
  return oldResources?.map((resource) =>
    resource.id === newResource.id ? newResource : resource
  );
};

const EditResource = ({ userData, defaultValue, id }: EditResourceProps) => {
  return (
    <ResourceForm
      displayName="Edit Resource"
      mutationFn={(payload: Pick<Resource, 'value'>) =>
        editResource(payload, id)
      }
      defaultValue={defaultValue}
      userData={userData}
      queryUpdate={queryUpdate}
    />
  );
};

export default EditResource;
