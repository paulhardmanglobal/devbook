'use client';

import { UserCard } from '@/app/components/UserCard';
import { FormFields } from '@/app/components/FormFields';
import { useDeleteAllUsers, useFetchUsers, useDeleteUser, useHandleSubmit } from '@/hooks';
export default function Home() {
  const { users, loading: fetchLoading, error: fetchError, fetchUsers } = useFetchUsers();
  const {
    deleteAllUsers,
    loading: deleteAllLoading,
    error: deleteAllError,
  } = useDeleteAllUsers(fetchUsers);
  const { handleSubmit, loading: submitLoading, error: submitError } = useHandleSubmit(fetchUsers);
  const {
    deleteUser,
    loading: deleteUserLoading,
    error: deleteUserError,
  } = useDeleteUser(fetchUsers);

  const loading = fetchLoading || deleteAllLoading || submitLoading || deleteUserLoading;
  const error = fetchError || deleteAllError || submitError || deleteUserError;

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
      <button
        onClick={deleteAllUsers}
        className="mt-32 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        disabled={loading}
      >
        Delete All Users
      </button>
    </div>
  );
}
