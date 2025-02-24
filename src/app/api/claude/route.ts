// app/api/todos/route.ts
import { NextResponse } from 'next/server';

// Simulating a database with an in-memory array
let todos = [
  { id: '1', text: 'Learn React Server Components', completed: false },
  { id: '2', text: 'Explore useActionState', completed: true },
];

// GET /api/todos - Get all todos
export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return NextResponse.json(todos);
}

// POST /api/todos - Create a new todo
export async function POST(request: Request) {
  const data = await request.json();

  // Validate input
  if (!data.text || typeof data.text !== 'string' || data.text.trim() === '') {
    return NextResponse.json({ error: 'Todo text is required' }, { status: 400 });
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Create new todo
  const newTodo = {
    id: `${Date.now()}`, // Generate a unique ID
    text: data.text.trim(),
    completed: false,
  };

  // Add to "database"
  todos = [...todos, newTodo];

  return NextResponse.json(newTodo);
}
