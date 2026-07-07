import { createFileRoute, Outlet, notFound } from "@tanstack/react-router";
import { getCategory } from "@/lib/tools-data";

export const Route = createFileRoute("/tools/$category")({
  loader: ({ params }) => {
    if (!getCategory(params.category)) throw notFound();
  },
  component: () => <Outlet />,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-20 text-center">
      <h1 className="text-2xl font-semibold">Category not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        The category you're looking for doesn't exist.
      </p>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-3xl px-6 py-20 text-center">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
});
