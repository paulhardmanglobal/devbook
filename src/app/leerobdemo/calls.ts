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
  const res = await fetch('/api/todos', {
    method: 'POST',
    body: JSON.stringify({ text }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const response = await res.json();
  // console.log(response);

  return res.json();
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
