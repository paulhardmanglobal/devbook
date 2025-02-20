import { NextRequest, NextResponse } from 'next/server';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { usersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
const db = drizzle(process.env.DB_FILE_NAME!);

export const wipeUsers = async () => await db.delete(usersTable);

// await db.delete(users).where(eq(users.name, 'Dan'));
export const deleteUser = async (id: number) =>
  await db.delete(usersTable).where(eq(usersTable.id, id));
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export async function GET() {
  // @mock slow network

  const users = await wipeUsers();
  return NextResponse.json({ message: 'dropped all users' });
}

// POST endpoint
export async function POST(request: NextRequest) {
  try {
    await delay(2000); // 2-second delay
    const { id } = await request.json();

    await deleteUser(id);

    return NextResponse.json({
      message: 'Hello World!',
      receivedData: 'deleted user with id ' + id,
    });
  } catch (error: unknown) {
    console.error('Error deleting user in the API route:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
