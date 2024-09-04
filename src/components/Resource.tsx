interface ResourceProps {
  id: string;
  value: string;
  owner_id: string;
  owner_username: string;
  created_at: Date;
}

const Resource = ({
  id,
  value,
  owner_id,
  owner_username,
  created_at
}: ResourceProps) => {
  return (
    <div title={id}>
      <p>{value}</p>
      <sub title={owner_id}>{owner_username}</sub>
      <sub>{created_at.toString()}</sub>
    </div>
  );
};

export default Resource;
