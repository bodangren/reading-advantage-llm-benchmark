import { NextRequest, NextResponse } from 'next/server'
import { getSchedules, saveSchedule, deleteSchedule } from '@/lib/scheduler'
import { ScheduleConfigSchema } from '@/lib/schemas'

function generateId(): string {
  return `sched-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export async function GET() {
  try {
    const schedules = await getSchedules()
    return NextResponse.json(schedules)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch schedules' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = ScheduleConfigSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 })
    }

    const schedule = {
      ...parsed.data,
      id: parsed.data.id || generateId(),
      createdAt: parsed.data.createdAt || new Date().toISOString(),
    }

    await saveSchedule(schedule)
    return NextResponse.json(schedule, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create schedule' }, { status: 500 })
  }
}