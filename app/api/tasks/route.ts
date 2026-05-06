import { NextRequest, NextResponse } from 'next/server';
import { getTasks } from '@/lib/data';
import { validateAuth, authResponse } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  const authResult = validateAuth(request);
  if (!authResult.allowed && authResult.status) {
    return authResponse(authResult.error!, authResult.status);
  }

  try {
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get('difficulty');

    const tasks = await getTasks();

    let filtered = tasks;
    if (difficulty && ['easy', 'medium', 'hard'].includes(difficulty)) {
      filtered = tasks.filter(t => t.difficulty === difficulty);
    }

    return NextResponse.json({
      count: filtered.length,
      tasks: filtered,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tasks', details: String(error) },
      { status: 500 }
    );
  }
}