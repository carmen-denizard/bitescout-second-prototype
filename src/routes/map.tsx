import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader, Stars } from "@/components/AppShell";
import { PLACE_TYPES, needById } from "@/lib/bitescout-data";
import { PLACES, useBitescout } from "@/lib/bitescout-store";

export const Route = createFileRoute("/map")({
  head: () => ({ meta: [
    { title: "Map Explorer — Bitescout" },
    { name: "description", content: "Filter nearby food spots by type and your dietary profile." },
    { property: "og:title", content: "Map Explorer — Bitescout" },
    { property: "og:description", content: "An interactive map of diet-friendly places." },
  ]}),
  component: MapPage,
});

function MapPage() {
  const { profile, types, toggleType, matchScore, stats } = useBitescout();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<string | null>(null);
  const list = useMemo(() => PLACES
    .filter((p) => !types.length || p.types.some((t) => types.includes(t)))
    .filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.kind.toLowerCase().includes(q.toLowerCase()))
    .map((p) => ({ p, s: matchScore(p) }))
    .filter(({ s }) => !profile.length || s > 0)
    .sort((a, b) => b.s - a.s || a.p.distance - b.p.distance), [types, q, profile, matchScore]);

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader eyebrow="Step 2 · Explore" title="Map explorer" desc="All places, addresses and phone numbers are sample data." />
      <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        <section className="flex flex-col gap-4">
          <input className="field" placeholder="Search places…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search places" />
          <div className="flex flex-wrap gap-2">
            {PLACE_TYPES.map((t) => <button key={t} className="chip" aria-pressed={types.includes(t)} onClick={() => toggleType(t)}>{t}</button>)}
          </div>
          <p className="text-sm text-muted-foreground">{list.length} places · {profile.length ? `matched to ${profile.length} needs` : "no profile filters"}</p>
          <ul className="flex max-h-[640px] flex-col gap-3 overflow-y-auto pr-1">
            {list.map(({ p, s }) => {
              const st = stats(p.id);
              return (
                <li key={p.id}>
                  <button onClick={() => setSel(p.id)} className={`card-hover w-full rounded-2xl border bg-card p-4 text-left ${sel === p.id ? "border-primary" : "border-border"}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="truncate font-display font-bold">{p.name}</h3>
                        <p className="text-sm text-muted-foreground">{p.kind} · {p.address} · {p.distance} mi</p>
                      </div>
                      {profile.length > 0 && <span className="shrink-0 rounded-full bg-primary-soft px-2 py-0.5 text-xs font-bold text-primary-strong">{Math.round(s * 100)}%</span>}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {p.accommodates.filter((n) => !profile.length || profile.includes(n)).slice(0, 5).map((n) => <span key={n} className="tag">{needById(n)?.short}</span>)}
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      {st.avg ? <Stars value={st.avg} size="text-sm" /> : <span className="text-xs text-muted-foreground">No reports</span>}
                      <span className="flex gap-2">
                        <a href={`tel:${p.phone}`} onClick={(e) => e.stopPropagation()} className="btn btn-ghost px-3 py-1 text-xs">Call</a>
                        <span className="btn btn-ghost px-3 py-1 text-xs">Directions</span>
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
            {!list.length && <li className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No matches. Try fewer filters.</li>}
          </ul>
        </section>
        <section className="relative min-h-[520px] overflow-hidden rounded-3xl border border-border bg-map lg:min-h-[760px]" aria-label="Map">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            <rect x="8" y="62" width="22" height="20" rx="2" className="fill-map-park" />
            <rect x="66" y="8" width="18" height="10" rx="2" className="fill-map-park" />
            <path d="M88 0 C80 30 96 60 86 100 L100 100 L100 0 Z" className="fill-map-water" />
            {[15, 38, 52, 68, 85].map((y) => <line key={y} x1="0" x2="100" y1={y} y2={y} className="stroke-map-road" strokeWidth="1.6" />)}
            {[12, 34, 46, 66, 79].map((x) => <line key={x} y1="0" y2="100" x1={x} x2={x} className="stroke-map-road" strokeWidth="1.6" />)}
            <line x1="0" y1="95" x2="100" y2="5" className="stroke-map-road" strokeWidth="2.6" />
          </svg>
          <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-card bg-secondary shadow-lg" title="You (sample)" />
          {list.map(({ p }) => (
            <button key={p.id} onClick={() => setSel(p.id)} style={{ left: `${p.x}%`, top: `${p.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-full rounded-full px-3 py-1.5 text-xs font-bold shadow-md transition-transform hover:scale-110 ${sel === p.id ? "z-10 scale-110 bg-foreground text-background" : "bg-primary text-primary-foreground"}`}>
              {p.name.split(" ").slice(0, 2).join(" ")}
            </button>
          ))}
          {sel && (() => { const p = PLACES.find((x) => x.id === sel)!; return (
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-border bg-card p-4 shadow-xl sm:right-auto sm:w-80">
              <div className="flex justify-between gap-2"><h3 className="font-display font-bold">{p.name}</h3><button onClick={() => setSel(null)} aria-label="Close" className="text-muted-foreground hover:text-foreground">×</button></div>
              <p className="text-sm text-muted-foreground">{p.address} · {p.phone}</p>
              <div className="mt-2 flex flex-wrap gap-1">{p.accommodates.map((n) => <span key={n} className="tag">{needById(n)?.short}</span>)}</div>
            </div>); })()}
        </section>
      </div>
    </div>
  );
}
