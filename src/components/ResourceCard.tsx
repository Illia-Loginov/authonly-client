import { MouseEvent } from 'react';
import { useModalContext } from '../context/ModalContext';
import EditResource from './Modal/EditResource';
import { deleteCachedResource, deleteResource } from '../api/resources.api';
import { useErrorContext } from '../context/ErrorContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isForbidden, isUnauthenticated } from '../utils/apiErrors';
import LogIn from './Modal/LogIn';
import { useResourceSortContext } from '../context/ResourceSortContext';
import Button from './Shared/Button';
import { dateToLongString, dateToShortString } from '../utils/timeFormatting';

interface ResourceCardProps {
  id: string;
  value: string;
  owner_id: string;
  owner_username: string;
  isOwner: boolean;
  created_at: string;
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
  const { sort } = useResourceSortContext();

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
        queryClient.setQueryData(
          ...deleteCachedResource(deletedResource.id, sort)
        );
      }
    });

    const handleDeleteResource = (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      mutation.mutate(id);
    };

    resourceOperations = (
      <div className="flex flex-row p-4 gap-4">
        <Button className="flex-1" onClick={handleEditResource}>
          Edit
        </Button>
        <Button className="flex-1" onClick={handleDeleteResource}>
          Delete
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-green-100 h-48 flex flex-col">
      <div className="text-sm flex flex-row justify-between items-center p-4 gap-4 bg-green-700 text-green-200">
        <p {...(isOwner && { className: 'font-bold', title: 'You' })}>
          {owner_username}
        </p>
        <p title={dateToLongString(new Date(created_at))}>
          {dateToShortString(new Date(created_at))}
        </p>
      </div>
      <p className="flex-1 p-4 overflow-y-auto break-words">{value}</p>
      {resourceOperations}
    </div>
  );
};

export default ResourceCard;
