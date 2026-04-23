"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TestResult } from "@/lib/schemas";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, AlertCircle, CheckCircle, MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestResultsTableProps {
  testResults: TestResult[];
}

interface TestSuite {
  name: string;
  results: TestResult[];
  passCount: number;
  failCount: number;
  skipCount: number;
}

function groupBySuite(testResults: TestResult[]): TestSuite[] {
  const groups = new Map<string, TestResult[]>();

  for (const result of testResults) {
    const existing = groups.get(result.suite) || [];
    existing.push(result);
    groups.set(result.suite, existing);
  }

  return Array.from(groups.entries()).map(([name, results]) => ({
    name,
    results,
    passCount: results.filter((r) => r.status === "pass").length,
    failCount: results.filter((r) => r.status === "fail").length,
    skipCount: results.filter((r) => r.status === "skip").length,
  }));
}

function StatusIcon({ status }: { status: TestResult["status"] }) {
  switch (status) {
    case "pass":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "fail":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case "skip":
      return <MinusCircle className="h-4 w-4 text-muted-foreground" />;
  }
}

interface SuiteRowProps {
  suite: TestSuite;
}

function SuiteRow({ suite }: SuiteRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <TableRow
        className="cursor-pointer hover:bg-muted/50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <TableCell>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </TableCell>
        <TableCell className="font-medium">{suite.name}</TableCell>
        <TableCell>
          <div className="flex gap-2">
            {suite.passCount > 0 && (
              <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/30">
                {suite.passCount} pass
              </Badge>
            )}
            {suite.failCount > 0 && (
              <Badge variant="outline" className="bg-red-500/10 text-red-700 border-red-500/30">
                {suite.failCount} fail
              </Badge>
            )}
            {suite.skipCount > 0 && (
              <Badge variant="outline" className="bg-muted text-muted-foreground">
                {suite.skipCount} skip
              </Badge>
            )}
          </div>
        </TableCell>
        <TableCell className="text-right text-muted-foreground">
          {suite.results.length} tests
        </TableCell>
      </TableRow>
      {isExpanded && (
        <TableRow>
          <TableCell colSpan={4} className="p-0 bg-muted/30">
            <div className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8"></TableHead>
                    <TableHead>Test Name</TableHead>
                    <TableHead className="w-24">Status</TableHead>
                    <TableHead className="w-32 text-right">Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suite.results.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell></TableCell>
                      <TableCell className={cn(result.status === "fail" && "text-red-700 dark:text-red-400")}>
                        {result.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <StatusIcon status={result.status} />
                          <span className="capitalize">{result.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground font-mono text-sm">
                        {result.duration_ms ? `${result.duration_ms}ms` : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {suite.results.some((r) => r.error_message) && (
                <div className="mt-4 space-y-2">
                  {suite.results
                    .filter((r) => r.error_message)
                    .map((result, index) => (
                      <div
                        key={index}
                        className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                      >
                        <p className="font-medium text-sm text-red-700 dark:text-red-400 mb-1">
                          {result.name}
                        </p>
                        <pre className="text-xs font-mono text-red-600 dark:text-red-400 whitespace-pre-wrap">
                          {result.error_message}
                        </pre>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export function TestResultsTable({ testResults }: TestResultsTableProps) {
  if (!testResults || testResults.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No test results available for this run.</p>
        </CardContent>
      </Card>
    );
  }

  const suites = groupBySuite(testResults);
  const totalPass = testResults.filter((r) => r.status === "pass").length;
  const totalFail = testResults.filter((r) => r.status === "fail").length;
  const totalSkip = testResults.filter((r) => r.status === "skip").length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4 text-sm">
          <span className="text-green-600 dark:text-green-400">
            {totalPass} passed
          </span>
          {totalFail > 0 && (
            <span className="text-red-600 dark:text-red-400">
              {totalFail} failed
            </span>
          )}
          {totalSkip > 0 && (
            <span className="text-muted-foreground">
              {totalSkip} skipped
            </span>
          )}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8"></TableHead>
              <TableHead>Suite</TableHead>
              <TableHead>Results</TableHead>
              <TableHead className="text-right">Tests</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suites.map((suite) => (
              <SuiteRow key={suite.name} suite={suite} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}