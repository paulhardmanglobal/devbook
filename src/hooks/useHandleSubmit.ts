import { useState } from 'react';

export const useHandleSubmit = (fetchUsers: () => Promise<void>) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

  return { handleSubmit, loading, error };
};
