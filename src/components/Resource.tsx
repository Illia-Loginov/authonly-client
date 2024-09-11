import { MouseEvent } from 'react';
import { useModalContext } from '../context/ModalContext';
import EditResource from './Modal/EditResource';

interface ResourceProps {
  id: string;
  value: string;
  owner_id: string;
  owner_username: string;
  isOwner: boolean;
  created_at: Date;
}

const Resource = ({
  id,
  value,
  owner_id,
  owner_username,
  isOwner,
  created_at
}: ResourceProps) => {
  const { dispatch: modalDispatch } = useModalContext();

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

    resourceOperations = (
      <>
        <button onClick={handleEditResource}>Edit</button>
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

export default Resource;
