interface ResourceProps {
  id: string;
  value: string;
  owner: string;
  isOwner: boolean;
  created_at: Date;
}

const Resource = ({ id, value, owner, isOwner, created_at }: ResourceProps) => {
  return (
    <div title={id}>
      <p>{value}</p>
      <sub>{owner + (isOwner ? ' (you)' : '')}</sub>
      <sub>{created_at.toString()}</sub>
    </div>
  );
};

export default Resource;
