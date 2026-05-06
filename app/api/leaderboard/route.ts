import { NextRequest, NextResponse } from 'next/server';
import { getAllRuns } from '@/lib/runs';
import { runsToLeaderboardFormat } from '@/lib/export';
import { validateAuth, authResponse } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  const authResult = validateAuth(request);
  if (!authResult.allowed && authResult.status) {
    return authResponse(authResult.error!, authResult.status);
  }

  try {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider');

    const runs = await getAllRuns();
    let leaderboard = runsToLeaderboardFormat(runs);

    if (provider) {
      const runsWithProvider = runs.filter(r => r.provider === provider);
      const providerModels = new Set(runsWithProvider.map(r => r.model));
      leaderboard = leaderboard.filter(entry => providerModels.has(entry.model));
    }

    leaderboard.sort((a, b) => b.meanScore - a.meanScore);

    return NextResponse.json({
      count: leaderboard.length,
      leaderboard,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard', details: String(error) },
      { status: 500 }
    );
  }
}