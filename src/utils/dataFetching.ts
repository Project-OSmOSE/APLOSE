import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';

const ensureValidQueryData = (queryKey: string, queryFn: () => any) => {
  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery(queryKey, queryFn);

  if (isLoading) return null;
  if (error) return null;

  // Check if data is valid (e.g., not expired)
  if (!isValidData(data)) {
    // Refetch data if it's invalid
    queryClient.invalidateQueries(queryKey);
    return null;
  }

  return data;
};

const isValidData = (data: any) => {
  // Implement logic to check if data is valid (e.g., not expired)
  // For example:
  return data && data.timestamp > Date.now() - 60 * 1000; // 1 minute
};

export default ensureValidQueryData;