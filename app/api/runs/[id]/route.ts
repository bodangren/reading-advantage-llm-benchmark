import { NextRequest, NextResponse } from 'next/server';
import { getRunById } from '@/lib/runs';
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
    const run = await getRunById(id);

    if (!run) {
      return NextResponse.json(
        { error: 'Run not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(run);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch run', details: String(error) },
      { status: 500 }
    );
  }
}