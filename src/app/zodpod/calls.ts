interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export const getTodosCall = async () => {
  const items = await fetch('/api/todos');
  return items.json();
};

export const addTodoCall = async (text: string) => {
  const items = await fetch('/api/todos', {
    method: 'POST',
    body: JSON.stringify({ todo: { text } }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const response = await items.json();
  return response;
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
