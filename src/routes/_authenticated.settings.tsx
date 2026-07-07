import { createFileRoute } from "@tanstack/react-router";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
  head: () => ({
    meta: [
      { title: "Settings — Toolverse" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function SettingsPage() {
  const { theme, toggle } = useTheme();
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      <p className="mt-2 text-sm text-muted-foreground">Manage your account preferences.</p>

      <div className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-medium">Appearance</h2>
            <p className="text-sm text-muted-foreground">
              Currently using {theme} mode.
            </p>
          </div>
          <Button variant="outline" onClick={toggle}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span className="ml-2">Toggle theme</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
