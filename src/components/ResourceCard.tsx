import { MouseEvent } from 'react';
import { useModalContext } from '../context/ModalContext';
import EditResource from './Modal/EditResource';
import { deleteCachedResource, deleteResource } from '../api/resources.api';
import { useErrorContext } from '../context/ErrorContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Resource } from '../types/Resource';
import { isForbidden, isUnauthenticated } from '../utils/apiErrors';
import LogIn from './Modal/LogIn';

interface ResourceCardProps {
  id: string;
  value: string;
  owner_id: string;
  owner_username: string;
  isOwner: boolean;
  created_at: Date;
}

const ResourceCard = ({
  id,
  value,
  owner_id,
  owner_username,
  isOwner,
  created_at
}: ResourceCardProps) => {
  const { dispatch: modalDispatch } = useModalContext();
  const { dispatch: errorDispatch } = useErrorContext();

  const queryClient = useQueryClient();

  let resourceOperations = <></>;

  if (isOwner) {
    const handleEditResource = (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      modalDispatch({
        type: 'open',
        component: (
          <EditResource
            id={id}
            defaultValue={{ value }}
            userData={{ owner_id, owner_username }}
          />
        )
      });
    };

    const mutation = useMutation({
      mutationFn: deleteResource,
      onError: (error) => {
        if (isUnauthenticated(error) || isForbidden(error)) {
          queryClient.setQueryData(['users'], null);
          modalDispatch({ type: 'open', component: <LogIn /> });
        } else {
          errorDispatch({ type: 'throw', error });
        }
      },
      onSuccess: (deletedResource) => {
        queryClient.setQueryData(...deleteCachedResource(deletedResource.id));
      }
    });

    const handleDeleteResource = (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      mutation.mutate(id);
    };

    resourceOperations = (
      <>
        <button onClick={handleEditResource}>Edit</button>
        <button onClick={handleDeleteResource}>Delete</button>
      </>
    );
  }

  return (
    <div title={id}>
      <p>{value}</p>
      <sub>{owner_username + (isOwner ? ' (you)' : '')}</sub>
      <sub>{created_at.toString()}</sub>
      {resourceOperations}
    </div>
  );
};

export default ResourceCard;
