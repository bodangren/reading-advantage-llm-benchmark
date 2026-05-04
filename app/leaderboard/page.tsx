import { getLeaderboard } from "@/lib/data";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default async function LeaderboardPage() {
  const allEntries = await getLeaderboard();

  const trackAEntries = allEntries.filter((e) => e.harness === "track-a");
  const trackBEntries = allEntries.filter((e) => e.harness === "track-b");

  return (
    <div className="container mx-auto py-12">
      <div className="flex flex-col space-y-4 mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Leaderboard</h1>
        <p className="text-xl text-muted-foreground">
          Compare LLM performance across benchmark tracks. Track A uses a fixed harness; Track B uses native agentic evaluation.
        </p>
      </div>

      <Tabs defaultValue="track-a" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="track-a">Track A (Fixed Harness)</TabsTrigger>
          <TabsTrigger value="track-b">Track B (Native Agent)</TabsTrigger>
        </TabsList>
        <TabsContent value="track-a">
          <LeaderboardTable data={trackAEntries} />
        </TabsContent>
        <TabsContent value="track-b">
          <LeaderboardTable data={trackBEntries} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
