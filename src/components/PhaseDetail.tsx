import React from 'react';
import { useQuery } from 'react-query';
import ensureValidQueryData from '../utils/dataFetching';

const PhaseDetail = () => {
  const queryKey = 'phase-detail';
  const queryFn = async () => {
    // Fetch phase detail data
    const response = await fetch('/api/phase-detail');
    return response.json();
  };

  const data = ensureValidQueryData(queryKey, queryFn);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1>Phase Detail</h1>
      <ul>
        {data.tasks.map((task) => (
          <li key={task.id}>{task.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default PhaseDetail;