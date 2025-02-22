'use client';
import { useState, useEffect, useTransition, useOptimistic } from 'react';
import { type User } from '@/app/components/UserCard';

import { UserCard } from '@/app/components/UserCard';
import { FormFields } from '@/app/components/FormFields';

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [optimisticUsers, setOptimisticUsers] = useOptimistic(users);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const { users } = await response.json();
      setUsers(users);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewUser = async (formData: FormData) => {
    setError(null);
    const formValues = {
      name: formData.get('name') as string,
      age: formData.get('age') ? parseInt(formData.get('age') as string, 10) : 1,
      email: formData.get('email') as string,
    };

    setOptimisticUsers((users) => [...users, { ...formValues, id: Date.now() }]); // Generate a temporary id for optimistic update}]);

    setLoading(true);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(formValues),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add user');
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16 ">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">User Information</h2>
        <form action={handleAddNewUser}>
          <FormFields loading={loading} />
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      {loading ? (
        <p className="m-12 text-3xl font-bold">Loading...</p>
      ) : (
        <div className="flex flex-wrap gap-4 mt-12">
          {optimisticUsers.map((user, index) => (
            <UserCard key={index} age={user.age} email={user.email} name={user.name} id={user.id} />
          ))}
        </div>
      )}
    </div>
  );
}
