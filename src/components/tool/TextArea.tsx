import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, Props>(function TextArea(
  { label, hint, className, ...props },
  ref,
) {
  return (
    <div className="flex h-full flex-col">
      {label && (
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium">{label}</label>
          {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
        </div>
      )}
      <textarea
        ref={ref}
        spellCheck={false}
        className={cn(
          "min-h-[280px] w-full flex-1 resize-none rounded-xl border border-border bg-muted/20 p-4 font-mono text-sm leading-relaxed outline-none transition focus:border-primary focus:bg-background focus:ring-2 focus:ring-ring/30",
          className,
        )}
        {...props}
      />
    </div>
  );
});
