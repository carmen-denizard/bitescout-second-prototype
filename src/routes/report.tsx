import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Stars } from "@/components/AppShell";
import { PLACES, useBitescout } from "@/lib/bitescout-store";

export const Route = createFileRoute("/report")({
  head: () => ({ meta: [
    { title: "Community Report — Bitescout" },
    { name: "description", content: "Flag dietary risks or rate how well a place accommodates dietary needs." },
    { property: "og:title", content: "Community Report — Bitescout" },
    { property: "og:description", content: "Share cross-contamination risks and dietary friendliness ratings." },
  ]}),
  component: ReportPage,
});

function ReportPage() {
  const { addReport, reports } = useBitescout();
  const [q, setQ] = useState("");
  const [placeId, setPlaceId] = useState<string | null>(null);
  const [mode, setMode] = useState<"risk" | "rating">("rating");
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [details, setDetails] = useState("");
  const [done, setDone] = useState(false);
  const matches = q && !placeId ? PLACES.filter((p) => p.name.toLowerCase().includes(q.toLowerCase())) : [];
  const valid = placeId && stars > 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault(); if (!valid) return;
    addReport({ placeId: placeId!, mode, stars, details });
    setDone(true); setQ(""); setPlaceId(null); setStars(0); setDetails("");
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader eyebrow="Step 3 · Contribute" title="Dietary risk & community report" desc="Your report updates ratings on the map and directory right away." />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <form onSubmit={submit} className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6">
          <div className="relative">
            <label htmlFor="place" className="text-sm font-bold">Place name</label>
            <input id="place" className="field mt-2" placeholder="Start typing a place…" value={q} autoComplete="off"
              onChange={(e) => { setQ(e.target.value); setPlaceId(null); setDone(false); }} />
            {matches.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                {matches.map((p) => <li key={p.id}><button type="button" onClick={() => { setPlaceId(p.id); setQ(p.name); }} className="w-full px-4 py-2 text-left text-sm hover:bg-primary-soft">{p.name} <span className="text-muted-foreground">· {p.address}</span></button></li>)}
              </ul>
            )}
          </div>
          <div>
            <span className="text-sm font-bold">Report type</span>
            <div role="radiogroup" className="mt-2 grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
              {([["risk", "⚠ Dietary Risk Flag"], ["rating", "★ General Rating"]] as const).map(([v, l]) => (
                <button key={v} type="button" role="radio" aria-checked={mode === v} onClick={() => setMode(v)}
                  className={`rounded-lg px-3 py-2 text-sm font-bold transition-all ${mode === v ? (v === "risk" ? "bg-destructive text-destructive-foreground shadow" : "bg-card shadow") : "text-muted-foreground hover:text-foreground"}`}>{l}</button>
              ))}
            </div>
          </div>
          <div>
            <span className="text-sm font-bold">Customer & Dietary Friendliness</span>
            <div className="mt-2 flex gap-1" onMouseLeave={() => setHover(0)}>
              {[1,2,3,4,5].map((i) => (
                <button key={i} type="button" aria-label={`${i} stars`} onMouseEnter={() => setHover(i)} onClick={() => setStars(i)}
                  className={`text-3xl text-star transition-transform hover:scale-125 ${i <= (hover || stars) ? "" : "opacity-25"}`}>★</button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="details" className="text-sm font-bold">{mode === "risk" ? "Describe the risk" : "Details"}</label>
            <textarea id="details" rows={5} className="field mt-2 resize-y" value={details} onChange={(e) => setDetails(e.target.value)}
              placeholder="Cross-contamination risks, shared equipment, lack of accommodation, helpful staff…" />
          </div>
          <button className="btn btn-primary self-start" disabled={!valid}>Submit report</button>
          {done && <p role="status" className="rounded-xl bg-success-soft p-3 text-sm font-semibold text-success">Report submitted. <Link to="/places" className="underline">See it in the directory →</Link></p>}
        </form>
        <aside className="flex flex-col gap-3">
          <h2 className="font-display text-lg font-bold">Recent reports</h2>
          {reports.slice(0, 6).map((r) => (
            <div key={r.id} className={`rounded-xl border p-3 ${r.mode === "risk" ? "border-destructive/40 bg-destructive-soft" : "border-border bg-card"}`}>
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-bold">{PLACES.find((p) => p.id === r.placeId)?.name}</p>
                <Stars value={r.stars} size="text-xs" />
              </div>
              {r.details && <p className="mt-1 text-xs text-muted-foreground">{r.details}</p>}
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
