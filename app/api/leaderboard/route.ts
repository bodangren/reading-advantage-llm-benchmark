import { NextResponse } from 'next/server';
import { getAllRuns } from '@/lib/runs';
import { runsToLeaderboardFormat } from '@/lib/export';

export async function GET() {
  try {
    const runs = await getAllRuns();
    const leaderboard = runsToLeaderboardFormat(runs);

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