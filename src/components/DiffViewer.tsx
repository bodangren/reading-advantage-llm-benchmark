"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, FileDiff } from "lucide-react";

interface DiffViewerProps {
  diff: string;
}

interface ParsedFile {
  oldPath: string;
  newPath: string;
  hunks: ParsedHunk[];
}

interface ParsedHunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  lines: string[];
}

function parseDiff(diffText: string): ParsedFile[] {
  const files: ParsedFile[] = [];
  const lines = diffText.split("\n");
  let currentFile: ParsedFile | null = null;
  let currentHunk: ParsedHunk | null = null;

  for (const line of lines) {
    if (line.startsWith("--- ")) {
      if (currentFile) {
        if (currentHunk) {
          currentFile.hunks.push(currentHunk);
          currentHunk = null;
        }
        files.push(currentFile);
      }
      const path = line.slice(4).replace(/^a\//, "").replace(/^b\//, "");
      currentFile = { oldPath: path, newPath: path, hunks: [] };
    } else if (line.startsWith("+++ ")) {
      if (currentFile) {
        currentFile.newPath = line.slice(4).replace(/^a\//, "").replace(/^b\//, "");
      }
    } else if (line.startsWith("@@")) {
      if (currentHunk && currentFile) {
        currentFile.hunks.push(currentHunk);
      }
      const match = line.match(/@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@/);
      if (match) {
        currentHunk = {
          oldStart: parseInt(match[1], 10),
          oldLines: parseInt(match[2] || "1", 10),
          newStart: parseInt(match[3], 10),
          newLines: parseInt(match[4] || "1", 10),
          lines: [],
        };
      }
    } else if (currentHunk) {
      currentHunk.lines.push(line);
    } else if (currentFile && (line.startsWith("+") || line.startsWith("-") || line.startsWith(" "))) {
      if (!currentHunk) {
        currentHunk = { oldStart: 0, oldLines: 0, newStart: 0, newLines: 0, lines: [] };
        currentFile.hunks.push(currentHunk);
      }
      currentHunk.lines.push(line);
    }
  }

  if (currentFile) {
    if (currentHunk) {
      currentFile.hunks.push(currentHunk);
    }
    files.push(currentFile);
  }

  return files;
}

interface FileSectionProps {
  file: ParsedFile;
}

function FileSection({ file }: FileSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const totalLines = file.hunks.reduce((sum, h) => sum + h.lines.length, 0);
  const isLong = totalLines > 200;

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-2 p-3 bg-muted/50 hover:bg-muted transition-colors text-left"
      >
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 flex-shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 flex-shrink-0" />
        )}
        <FileDiff className="h-4 w-4 flex-shrink-0" />
        <span className="font-mono text-sm">
          {file.newPath}
        </span>
        <span className="text-muted-foreground text-sm ml-auto">
          {file.hunks.length} hunk{file.hunks.length !== 1 ? "s" : ""}, {totalLines} lines
        </span>
      </button>

      {isExpanded && (
        <div className="p-4 bg-background">
          {isLong ? (
            <DiffContentWithTruncation hunks={file.hunks} />
          ) : (
            <DiffContent hunks={file.hunks} />
          )}
        </div>
      )}
    </div>
  );
}

function DiffContent({ hunks }: { hunks: ParsedHunk[] }) {
  return (
    <pre className="font-mono text-xs leading-relaxed overflow-x-auto">
      {hunks.map((hunk, hunkIndex) => (
        <div key={hunkIndex} className="mb-4">
          <div className="text-muted-foreground bg-muted/30 px-2 py-1 rounded mb-2">
            @@ -{hunk.oldStart},{hunk.oldLines} +{hunk.newStart},{hunk.newLines} @@
          </div>
          {hunk.lines.map((line, lineIndex) => (
            <div
              key={lineIndex}
              className={`px-2 py-0.5 ${
                line.startsWith("+")
                  ? "bg-green-500/20 text-green-700 dark:text-green-400"
                  : line.startsWith("-")
                  ? "bg-red-500/20 text-red-700 dark:text-red-400"
                  : ""
              }`}
            >
              {line}
            </div>
          ))}
        </div>
      ))}
    </pre>
  );
}

function DiffContentWithTruncation({ hunks }: { hunks: ParsedHunk[] }) {
  const [showAll, setShowAll] = useState(false);
  const MAX_VISIBLE_LINES = 200;

  let lineCount = 0;
  const visibleLines: Array<{ hunkIndex: number; line: string; lineIndex: number }> = [];
  const allLines: Array<{ hunkIndex: number; line: string; lineIndex: number }> = [];

  for (let hunkIndex = 0; hunkIndex < hunks.length; hunkIndex++) {
    const hunk = hunks[hunkIndex];
    for (let lineIndex = 0; lineIndex < hunk.lines.length; lineIndex++) {
      const line = hunk.lines[lineIndex];
      allLines.push({ hunkIndex, line, lineIndex });
      if (!showAll && lineCount < MAX_VISIBLE_LINES) {
        visibleLines.push({ hunkIndex, line, lineIndex });
        lineCount++;
      }
    }
  }

  const displayLines = showAll ? allLines : visibleLines;
  const hiddenCount = allLines.length - visibleLines.length;

  return (
    <div>
      <pre className="font-mono text-xs leading-relaxed overflow-x-auto">
        {displayLines.map(({ hunkIndex, line, lineIndex }, idx) => {
          const showHunkHeader =
            idx === 0 ||
            displayLines[idx - 1].hunkIndex !== hunkIndex;

          return (
            <div key={`${hunkIndex}-${lineIndex}`}>
              {showHunkHeader && idx > 0 && <div className="h-4" />}
              <div
                className={`px-2 py-0.5 ${
                  line.startsWith("+")
                    ? "bg-green-500/20 text-green-700 dark:text-green-400"
                    : line.startsWith("-")
                    ? "bg-red-500/20 text-red-700 dark:text-red-400"
                    : ""
                }`}
              >
                {line}
              </div>
            </div>
          );
        })}
      </pre>
      {hiddenCount > 0 && !showAll && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAll(true)}
          className="mt-4 w-full"
        >
          Show {hiddenCount} more lines
        </Button>
      )}
    </div>
  );
}

export function DiffViewer({ diff }: DiffViewerProps) {
  if (!diff || diff.trim() === "") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Diff Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No diff available for this run.</p>
        </CardContent>
      </Card>
    );
  }

  const files = parseDiff(diff);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Diff Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {files.length === 0 ? (
          <p className="text-muted-foreground">No changes detected in this run.</p>
        ) : (
          <div className="space-y-4">
            {files.map((file, index) => (
              <FileSection key={index} file={file} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}