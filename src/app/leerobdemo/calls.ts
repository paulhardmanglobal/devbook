interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export const getTodosCall = async () => {
  const items = await fetch('/api/todos');
  return items.json();
};

export const addTodoCall = async (todo: Todo) => {
  await fetch('/api/todos', {
    method: 'POST',
    body: JSON.stringify({ todo }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return todo;
};

export const toggleTodoCall = async (id: number) => {
  const items = await fetch('/api/todos', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });

  return items.json();
};
