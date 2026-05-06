import { getSchedules } from "@/lib/scheduler"
import { SchedulesClient } from "@/components/SchedulesClient"

export default async function SchedulesPage() {
  const schedules = await getSchedules()

  return (
    <div className="container mx-auto py-12">
      <div className="flex flex-col space-y-4 mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Automated Benchmark Scheduling</h1>
        <p className="text-xl text-muted-foreground">
          Schedule recurring benchmark runs to continuously monitor model performance over time.
        </p>
      </div>

      <SchedulesClient initialSchedules={schedules} />
    </div>
  )
}