"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LeaderboardEntry } from "@/lib/schemas";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, ChevronsUpDown, Bot, Settings } from "lucide-react";

interface LeaderboardTableProps {
  data: LeaderboardEntry[];
}

type SortKey = keyof LeaderboardEntry;

type SortDirection = "asc" | "desc" | null;

interface SortIconProps {
  columnKey: SortKey;
  sortKey: SortKey;
  direction: SortDirection;
}

function SortIcon({ columnKey, sortKey, direction }: SortIconProps) {
  const Icon = sortKey !== columnKey || !direction ? ChevronsUpDown : direction === "asc" ? ChevronUp : ChevronDown;
  return <Icon className="ml-2 h-4 w-4" />;
}

export function LeaderboardTable({ data }: LeaderboardTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "asc" | "desc" | null;
  }>({
    key: "score",
    direction: "desc",
  });

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.direction) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue === undefined) return 1;
    if (bValue === undefined) return -1;

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (key: SortKey) => {
    let direction: "asc" | "desc" | null = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = null;
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Rank</TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleSort("model")}
            >
              <div className={cn(
                "flex items-center",
                sortConfig.key === "model" && sortConfig.direction && "text-primary font-semibold"
              )}>
                Model
                <SortIcon columnKey="model" sortKey={sortConfig.key} direction={sortConfig.direction} />
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleSort("provider")}
            >
              <div className={cn(
                "flex items-center",
                sortConfig.key === "provider" && sortConfig.direction && "text-primary font-semibold"
              )}>
                Provider
                <SortIcon columnKey="provider" sortKey={sortConfig.key} direction={sortConfig.direction} />
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleSort("harness")}
            >
              <div className={cn(
                "flex items-center",
                sortConfig.key === "harness" && sortConfig.direction && "text-primary font-semibold"
              )}>
                Harness
                <SortIcon columnKey="harness" sortKey={sortConfig.key} direction={sortConfig.direction} />
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50 transition-colors text-right"
              onClick={() => handleSort("score")}
            >
              <div className={cn(
                "flex items-center justify-end",
                sortConfig.key === "score" && sortConfig.direction && "text-primary font-semibold"
              )}>
                Score
                <SortIcon columnKey="score" sortKey={sortConfig.key} direction={sortConfig.direction} />
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50 transition-colors text-right"
              onClick={() => handleSort("date")}
            >
              <div className={cn(
                "flex items-center justify-end",
                sortConfig.key === "date" && sortConfig.direction && "text-primary font-semibold"
              )}>
                Date
                <SortIcon columnKey="date" sortKey={sortConfig.key} direction={sortConfig.direction} />
              </div>
            </TableHead>
            <TableHead className="text-right">Dataset</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((entry, index) => (
            <TableRow key={`${entry.model}-${entry.harness}-${index}`}>
              <TableCell className="font-medium">
                {index + 1}
              </TableCell>
              <TableCell className="font-semibold">{entry.model}</TableCell>
              <TableCell>{entry.provider || "-"}</TableCell>
              <TableCell>
                <Badge variant="outline">{entry.harness || "-"}</Badge>
              </TableCell>
              <TableCell>
                {entry.track ? (
                  <Badge variant={entry.track === 'native' ? 'default' : 'secondary'} className="gap-1">
                    {entry.track === 'native' ? <Bot className="h-3 w-3" /> : <Settings className="h-3 w-3" />}
                    {entry.track === 'native' ? 'Native' : 'Fixed'}
                  </Badge>
                ) : '-'}
              </TableCell>
              <TableCell className="text-right font-mono">
                {entry.score <= 1 ? (entry.score * 100).toFixed(1) : entry.score.toFixed(1)}%
              </TableCell>
              <TableCell className="text-right text-muted-foreground text-sm">
                {entry.date || "-"}
              </TableCell>
              <TableCell className="text-right text-muted-foreground text-sm">
                {entry.dataset_version || "-"}
              </TableCell>
            </TableRow>
          ))}
          {sortedData.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
