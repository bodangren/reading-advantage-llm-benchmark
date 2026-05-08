import { NextRequest, NextResponse } from 'next/server';
import { getAllRuns } from '@/lib/runs';
import { filterRuns, type QueryFilters } from '@/lib/export';
import { validateAuth, authResponse } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  const authResult = await validateAuth(request);
  if (!authResult.allowed && authResult.status) {
    return authResponse(authResult.error!, authResult.status);
  }

  try {
    const { searchParams } = new URL(request.url);

    const filters: QueryFilters = {};
    if (searchParams.has('model')) filters.model = searchParams.get('model')!;
    if (searchParams.has('task')) filters.task = searchParams.get('task')!;
    if (searchParams.has('startDate')) filters.startDate = searchParams.get('startDate')!;
    if (searchParams.has('endDate')) filters.endDate = searchParams.get('endDate')!;
    if (searchParams.has('minScore')) filters.minScore = parseFloat(searchParams.get('minScore')!);
    if (searchParams.has('maxScore')) filters.maxScore = parseFloat(searchParams.get('maxScore')!);

    const limit = searchParams.has('limit') ? parseInt(searchParams.get('limit')!, 10) : 100;
    const offset = searchParams.has('offset') ? parseInt(searchParams.get('offset')!, 10) : 0;

    const runs = await getAllRuns();
    const filtered = filterRuns(runs, filters);
    const total = filtered.length;
    const paginated = filtered.slice(offset, offset + limit);

    return NextResponse.json({
      count: paginated.length,
      total,
      limit,
      offset,
      runs: paginated,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch runs', details: String(error) },
      { status: 500 }
    );
  }
}