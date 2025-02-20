import { useState } from 'react';

export const useDeleteAllUsers = (fetchUsers: () => Promise<void>) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteAllUsers = async () => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      const response = await fetch('/api/users/delete');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete users');
      }
      fetchUsers(); // Refresh the user list
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { deleteAllUsers, loading, error };
};
