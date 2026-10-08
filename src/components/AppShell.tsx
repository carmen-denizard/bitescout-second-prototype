import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useBitescout } from "@/lib/bitescout-store";
import { needById } from "@/lib/bitescout-data";

const NAV = [
  { to: "/", label: "Dietary Profile", n: "01" },
  { to: "/map", label: "Map Explorer", n: "02" },
  { to: "/report", label: "Community Report", n: "03" },
  { to: "/places", label: "Places Directory", n: "04" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { profile } = useBitescout();
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="border-b border-border bg-sidebar lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex flex-col gap-6 p-5 lg:h-full">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary font-display text-lg font-bold text-primary-foreground">B</span>
            <span className="font-display text-xl font-bold tracking-tight">Bitescout</span>
          </Link>
          <nav className="flex gap-1 overflow-x-auto lg:flex-col">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} activeOptions={{ exact: true }}
                className="nav-link" activeProps={{ "data-active": "true" } as never}>
                <span className="text-xs font-semibold opacity-60">{n.n}</span>{n.label}
              </Link>
            ))}
          </nav>
          <div className="hidden rounded-2xl border border-border bg-card p-4 lg:block">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active profile</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {profile.length ? profile.map((id) => <span key={id} className="tag">{needById(id)?.short}</span>)
                : <span className="text-sm text-muted-foreground">No needs selected</span>}
            </div>
          </div>
          <p className="mt-auto hidden text-xs text-muted-foreground lg:block">Designed by Carmen Denizard</p>
        </div>
      </aside>
      <main className="min-w-0 px-5 py-8 sm:px-8 lg:px-12">{children}</main>
    </div>
  );
}

export function PageHeader({ eyebrow, title, desc }: { eyebrow: string; title: string; desc: string }) {
  return (
    <header className="mb-8 max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary-strong">{eyebrow}</p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-3 text-muted-foreground">{desc}</p>
    </header>
  );
}

export function Stars({ value, size = "text-base" }: { value: number; size?: string }) {
  return <span className={`${size} text-star`} aria-label={`${value.toFixed(1)} of 5 stars`}>
    {[1,2,3,4,5].map((i) => <span key={i} className={i <= Math.round(value) ? "" : "opacity-25"}>★</span>)}
  </span>;
}
