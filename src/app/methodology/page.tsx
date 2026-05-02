export default async function MethodologyPage() {
  return (
    <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="flex flex-col space-y-4 mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Methodology</h1>
          <p className="text-xl text-muted-foreground">
            Understanding how we evaluate LLM performance on real-world software engineering tasks.
          </p>
        </div>

        <div className="space-y-12">
          <section className="prose dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold mb-4">Benchmark Philosophy</h2>
            <div className="text-muted-foreground space-y-4">
              <p>
                Brownfield LLM Benchmark (BLB) evaluates large language models and agent systems 
                on their ability to perform real-world feature integration tasks in an existing 
                production codebase.
              </p>
              <p>
                We measure <strong>brownfield engineering capability</strong>—integration, correctness, 
                and safety—rather than synthetic coding performance on isolated problems.
              </p>
            </div>
          </section>

          <section className="prose dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold mb-4">Harness Standardization</h2>
            <div className="text-muted-foreground space-y-4">
              <p>
                BLB evaluates models under a <strong>fixed agent runtime</strong> (OpenCode pinned version). 
                The harness is part of the benchmark definition; results are model-in-harness.
              </p>
              <div className="bg-muted/50 rounded-lg p-6 my-6">
                <h3 className="font-semibold mb-3">Fixed Parameters</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>System prompt configuration</li>
                  <li>Tool access specifications</li>
                  <li>Max steps/turns limits</li>
                  <li>Time limits per task</li>
                  <li>Repository snapshots</li>
                  <li>Task prompt templates</li>
                  <li>Scoring logic</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="prose dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold mb-4">Evaluation Tracks</h2>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="border rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-2">Track A: Fixed Harness</h3>
                <p className="text-muted-foreground text-sm">
                  All models use identical OpenCode configuration. This ensures apples-to-apples
                  comparison of model capability.
                </p>
                <ul className="mt-3 text-xs text-muted-foreground space-y-1">
                  <li>Standardized system prompt</li>
                  <li>Fixed tool access (filesystem, bash)</li>
                  <li>Same max tokens and temperature</li>
                </ul>
              </div>
              <div className="border rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-2">Track B: Native Agent</h3>
                <p className="text-muted-foreground text-sm">
                  Models use their own best agent/harness. Evaluates how models perform with
                  native tool use and agent frameworks.
                </p>
                <ul className="mt-3 text-xs text-muted-foreground space-y-1">
                  <li>Custom system prompt per model</li>
                  <li>Extended tool access (websearch, git, etc.)</li>
                  <li>Configurable via <code className="bg-muted px-1 rounded">--track native</code></li>
                </ul>
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-6 my-6">
              <h4 className="font-semibold mb-3">Running Track B Evaluations</h4>
              <pre className="text-sm bg-background rounded p-4 overflow-x-auto">
                npm run pipeline configs/track-b-native.json --track native
              </pre>
              <p className="text-xs text-muted-foreground mt-3">
                See <code className="bg-muted px-1 rounded">configs/track-b-native-example.json</code> for
                a complete configuration example with agent_type, system_prompt, and tool_access settings.
              </p>
            </div>
          </section>

          <section className="prose dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold mb-4">Scoring Engine</h2>
            <div className="text-muted-foreground space-y-4">
              <p>
                Each task is scored on a 100-point scale across five dimensions:
              </p>
              <div className="bg-muted/50 rounded-lg p-6 my-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left font-semibold pb-3">Dimension</th>
                      <th className="text-right font-semibold pb-3">Points</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    <tr className="border-b border-muted">
                      <td className="py-3">Functional Correctness</td>
                      <td className="text-right py-3 font-mono">40</td>
                    </tr>
                    <tr className="border-b border-muted">
                      <td className="py-3">Integration Quality</td>
                      <td className="text-right py-3 font-mono">25</td>
                    </tr>
                    <tr className="border-b border-muted">
                      <td className="py-3">Regression Safety</td>
                      <td className="text-right py-3 font-mono">20</td>
                    </tr>
                    <tr className="border-b border-muted">
                      <td className="py-3">Minimality</td>
                      <td className="text-right py-3 font-mono">10</td>
                    </tr>
                    <tr>
                      <td className="py-3">Process Quality</td>
                      <td className="text-right py-3 font-mono">5</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="prose dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold mb-4">Task Design</h2>
            <div className="text-muted-foreground space-y-4">
              <p>
                <strong>Complexity:</strong> Medium (Feature Integration)—Adding standard features, 
                integrating modules, and extending existing functionality.
              </p>
              <p>
                <strong>Initial Domain:</strong> Web Applications—Adding pages, components, and 
                API routes to an existing web app.
              </p>
              <p>
                <strong>Task Nature:</strong> Multi-step, cross-cutting tasks using real production 
                repository snapshots to ensure authentic evaluation conditions.
              </p>
            </div>
          </section>

          <section className="prose dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold mb-4">Dataset Versioning</h2>
            <div className="text-muted-foreground space-y-4">
              <p>
                Each benchmark run is linked to a <strong>dataset version</strong> (date-stamped 
                in <code className="text-sm bg-muted px-1.5 py-0.5 rounded">YYYY-MM-DD</code> format). 
                This ensures reproducibility — you can compare runs that used the exact same task set.
              </p>
              <p>
                The leaderboard and run detail pages display the dataset version context so you always 
                know which dataset was used for a given result. Runs without a dataset version are 
                legacy entries from before versioning was introduced.
              </p>
              <p>
                For the full operator workflow on introducing new dataset versions, see{' '}
                <code className="text-sm bg-muted px-1.5 py-0.5 rounded">docs/dataset-versioning.md</code>.
              </p>
            </div>
          </section>
        </div>
    </main>
  );
}
