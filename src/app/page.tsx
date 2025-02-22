'use client';
import { useState, useEffect } from 'react';
import { type User } from '@/app/components/UserCard';

import { UserCard } from '@/app/components/UserCard';
import { FormFields } from '@/app/components/FormFields';
import { useDeleteAllUsers, useDeleteUser } from '@/hooks';
export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset error state
    // Access the form element
    const form = e.currentTarget;
    // Get form values using FormData API
    const formData = new FormData(form);
    const formValues = {
      name: formData.get('name') as string,
      age: formData.get('age') ? parseInt(formData.get('age') as string, 10) : null,
      email: formData.get('email') as string,
    };

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
      await fetchUsers(); // Refresh the user list
      form.reset();
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // const {
  //   deleteAllUsers,
  //   loading: deleteAllLoading,
  //   error: deleteAllError,
  // } = useDeleteAllUsers(fetchUsers);

  const {
    deleteUser,
    loading: deleteUserLoading,
    error: deleteUserError,
  } = useDeleteUser(fetchUsers);

  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16 ">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">User Information</h2>
        <form onSubmit={handleSubmit}>
          <FormFields loading={loading} />
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      {loading ? (
        <p className="m-12 text-3xl font-bold">Loading...</p>
      ) : (
        <div className="flex flex-wrap gap-4 mt-12">
          {users.map((user, index) => (
            <UserCard
              key={index}
              age={user.age}
              email={user.email}
              name={user.name}
              id={user.id}
              handleDelete={() => deleteUser(user.id)}
            />
          ))}
        </div>
      )}
      {/* <button
        onClick={deleteAllUsers}
        className="mt-32 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        disabled={loading}
      >
        Delete All Users
      </button> */}
    </div>
  );
}
