import { useState } from 'react';

export const useDeleteUser = (fetchUsers: () => Promise<void>) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteUser = async (id: number) => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      const response = await fetch('/api/users/delete', {
        method: 'POST',
        body: JSON.stringify({ id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }
      await fetchUsers(); // Refresh the user list
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { deleteUser, loading, error };
};
