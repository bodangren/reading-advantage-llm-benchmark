"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Artifact } from "@/lib/schemas";
import { FileText, Image, BarChart3, File, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ArtifactLinksProps {
  artifacts: Artifact[];
}

function ArtifactIcon({ type }: { type: Artifact["type"] }) {
  switch (type) {
    case "log":
      return <FileText className="h-5 w-5" />;
    case "screenshot":
      return <Image className="h-5 w-5" />;
    case "report":
      return <BarChart3 className="h-5 w-5" />;
    default:
      return <File className="h-5 w-5" />;
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function ArtifactLinks({ artifacts }: ArtifactLinksProps) {
  if (!artifacts || artifacts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Artifacts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No artifacts available for this run.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Artifacts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {artifacts.map((artifact, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="text-muted-foreground">
                  <ArtifactIcon type={artifact.type} />
                </div>
                <div>
                  <p className="font-medium">{artifact.name}</p>
                  <div className="flex gap-3 text-sm text-muted-foreground">
                    <span className="capitalize">{artifact.type}</span>
                    {artifact.size_bytes && (
                      <span>{formatBytes(artifact.size_bytes)}</span>
                    )}
                  </div>
                </div>
              </div>
              <a
                href={artifact.url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-sm hover:bg-muted rounded-md transition-colors"
              >
                <Download className="h-4 w-4" />
                Download
              </a>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}