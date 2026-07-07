import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  value: string;
  filename?: string;
  mime?: string;
}

export function DownloadButton({ value, filename = "toolverse.txt", mime = "text/plain" }: Props) {
  function onDownload() {
    const blob = new Blob([value], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
  return (
    <Button variant="outline" size="sm" onClick={onDownload}>
      <Download className="h-4 w-4" /> Download
    </Button>
  );
}
