import { NextRequest, NextResponse } from 'next/server';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { usersTable } from '@/db/schema';

const db = drizzle(process.env.DB_FILE_NAME!);

export const getAllUsers = async () => await db.select().from(usersTable);
export const addUser = async (user: { name: string; age: number; email: string }) => {
  try {
    await db.insert(usersTable).values(user);
  } catch (error) {
    throw new Error('Failed to add user: ' + (error as Error).message);
  }
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
// GET endpoint
export async function GET() {
  // @mock slow network
  await delay(2000);
  const users = await getAllUsers();
  return NextResponse.json({ message: 'Hello World!', users });
}

// POST endpoint
export async function POST(request: NextRequest) {
  try {
    await delay(2000); // 2-second delay
    const body = await request.json();
    await addUser(body); // Ensure addUser is awaited

    return NextResponse.json({
      message: 'Hello World!',
      receivedData: body,
    });
  } catch (error: unknown) {
    console.error('Error adding user in the API route:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
