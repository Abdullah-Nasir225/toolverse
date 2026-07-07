import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ClearButton({ onClear }: { onClear: () => void }) {
  return (
    <Button variant="outline" size="sm" onClick={onClear}>
      <Trash2 className="h-4 w-4" /> Clear
    </Button>
  );
}
