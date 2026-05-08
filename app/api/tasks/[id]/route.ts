import { NextRequest, NextResponse } from 'next/server';
import { getTaskById } from '@/lib/data';
import { validateAuth, authResponse } from '@/lib/api-auth';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const authResult = await validateAuth(request);
  if (!authResult.allowed && authResult.status) {
    return authResponse(authResult.error!, authResult.status);
  }

  try {
    const { id } = await context.params;
    const task = await getTaskById(id);

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch task', details: String(error) },
      { status: 500 }
    );
  }
}