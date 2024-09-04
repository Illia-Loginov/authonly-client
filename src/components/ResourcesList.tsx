import Resource from './Resource';

const ResourcesList = () => {
  const resources = [
    {
      id: '1',
      value: 'Lorem Ipsum',
      owner_id: '2',
      owner_username: 'Jane_Doe',
      created_at: new Date()
    }
  ];

  return (
    <section>
      <h1>Resources</h1>
      {resources.map((resource) => (
        <Resource
          key={resource.id}
          id={resource.id}
          value={resource.value}
          owner_id={resource.owner_id}
          owner_username={resource.owner_username}
          created_at={resource.created_at}
        />
      ))}
    </section>
  );
};

export default ResourcesList;
