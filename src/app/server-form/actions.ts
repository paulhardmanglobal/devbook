import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Define return type for better type safety
type ActionReturn = {
  success: boolean;
  message: string;
  errors?: string;
  inputs?: {
    todo: string;
  };
};

export async function addToDo(prevState: any, formData: FormData): Promise<ActionReturn> {
  'use server';

  const todoValue = formData.get('todo') as string;

  // Validate input
  const schema = z.object({
    todo: z.string().nonempty().min(8, 'Todo must be at least 8 characters long'),
  });

  const validatedData = schema.safeParse({ todo: todoValue });

  // Handle validation errors
  if (!validatedData.success) {
    return {
      success: false,
      message: `Failed to add todo: ${validatedData.error.errors.join(', ')}`,
      errors: validatedData.error.errors[0].message,
      inputs: { todo: todoValue },
    };
  }

  try {
    // Make API request
    const res = await fetch('http://localhost:3000/api/todos', {
      method: 'POST',
      body: JSON.stringify({ todo: { text: validatedData.data.todo } }),
      headers: { 'Content-Type': 'application/json' },
    });

    // Handle API error responses
    if (!res.ok) {
      let errorMessage = 'Failed to add todo';

      try {
        const errorData = await res.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If JSON parsing fails, use default error message
      }

      return {
        success: false,
        message: errorMessage,
        errors: 'server error',
        inputs: { todo: todoValue },
      };
    }

    // Success path
    const data = await res.json();
    revalidatePath('/server-form');

    return {
      success: true,
      message: `Todo added successfully: ${validatedData.data.todo}`,
    };
  } catch (error) {
    // Handle network errors
    console.error('Network error:', error);

    return {
      success: false,
      message: 'Failed to add todo due to network error',
      errors: 'network error',
      inputs: { todo: todoValue },
    };
  }
}
