import { NextRequest, NextResponse } from 'next/server';
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}
let todos: Todo[] = [
  { id: 1, text: 'Learn React 19', completed: false },
  { id: 2, text: 'Master useOptimistic', completed: false },
  { id: 3, text: 'Build something cool', completed: false },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
// GET endpoint
export async function GET() {
  // @mock slow network
  await delay(2000);
  return NextResponse.json({ todos });
}

// POST endpoint
export async function POST(request: NextRequest) {
  try {
    await delay(2000); // 2-second delay
    const body = await request.json();
    todos = [...todos, body.todo];
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
