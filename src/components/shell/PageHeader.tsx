import type { ReactNode } from "react";

type PageHeaderProps = { crumb: string; title: string; actions?: ReactNode };

/** Each page owns its own header instead of a central pathname→title lookup
 * table — one less thing to keep in sync when routes are added or renamed. */
export function PageHeader({ crumb, title, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4 border-b-2 border-line pb-4">
      <div className="flex min-w-0 items-baseline gap-3.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{crumb}</span>
        <h1 className="truncate text-[20px] font-extrabold tracking-[-0.02em] text-ink">{title}</h1>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2.5">{actions}</div>}
    </div>
  );
}
