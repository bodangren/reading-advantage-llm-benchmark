import { NextRequest, NextResponse } from 'next/server';
import { getAllRuns } from '@/lib/runs';
import { filterRuns, type QueryFilters } from '@/lib/export';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filters: QueryFilters = {};
    if (searchParams.has('model')) filters.model = searchParams.get('model')!;
    if (searchParams.has('task')) filters.task = searchParams.get('task')!;
    if (searchParams.has('startDate')) filters.startDate = searchParams.get('startDate')!;
    if (searchParams.has('endDate')) filters.endDate = searchParams.get('endDate')!;
    if (searchParams.has('minScore')) filters.minScore = parseFloat(searchParams.get('minScore')!);
    if (searchParams.has('maxScore')) filters.maxScore = parseFloat(searchParams.get('maxScore')!);

    const runs = await getAllRuns();
    const filtered = filterRuns(runs, filters);

    return NextResponse.json({
      count: filtered.length,
      runs: filtered,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch runs', details: String(error) },
      { status: 500 }
    );
  }
}