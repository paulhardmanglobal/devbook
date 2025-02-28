'use server';

import { revalidatePath } from 'next/cache';

export async function addTodoAction(text: string) {
  try {
    const response = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ todo: { text } }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to add todo');
    }

    revalidatePath('/todos'); // Update UI
  } catch (error) {
    console.error('Error adding todo:', error);
  }
}
