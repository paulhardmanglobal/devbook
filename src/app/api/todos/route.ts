import { NextRequest, NextResponse } from 'next/server';

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};
let todos: Todo[] = [
  { id: 1, text: 'Learn about Next API routes', completed: false },
  { id: 2, text: 'Learn about React Forms', completed: false },
  { id: 3, text: 'Master use Optimistic', completed: false },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
// GET endpoint
export async function GET() {
  await delay(2000);
  return NextResponse.json({ todos });
}

// POST endpoint
export async function POST(request: NextRequest) {
  try {
    await delay(2000); // 2-second delay

    if (Math.random() < 0.33) {
      throw new Error('Random server error occurred');
    }
    const body = await request.json();
    const { text } = body.todo; // Extract text from the todo object

    todos = [...todos, { text, completed: false, id: Math.random() }];
    return NextResponse.json({
      todos,
    });
  } catch (error: unknown) {
    console.error('Error adding user in the API route:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

// PATCH endpoint to toggle the completed state of a todo
export async function PATCH(request: NextRequest) {
  try {
    await delay(2000); // 2-second delay
    if (Math.random() < 0.3) {
      throw new Error('Random server error occurred');
    }
    const body = await request.json();
    const { id } = body;
    todos = todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo));

    return NextResponse.json({
      todos,
    });
  } catch (error: unknown) {
    console.error('Error updating todo in the API route:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
