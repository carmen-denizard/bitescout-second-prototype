import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Stars } from "@/components/AppShell";
import { needById } from "@/lib/bitescout-data";
import { PLACES, useBitescout } from "@/lib/bitescout-store";

export const Route = createFileRoute("/places")({
  head: () => ({ meta: [
    { title: "Places Directory — Bitescout" },
    { name: "description", content: "Browse verified spots with dietary tags and community safety ratings." },
    { property: "og:title", content: "Places Directory — Bitescout" },
    { property: "og:description", content: "Verified diet-friendly spots with community safety ratings." },
  ]}),
  component: PlacesPage,
});

function PlacesPage() {
  const { profile, types, matchScore, stats } = useBitescout();
  const list = PLACES.filter((p) => !types.length || p.types.some((t) => types.includes(t)))
    .map((p) => ({ p, s: matchScore(p), st: stats(p.id) }))
    .sort((a, b) => b.s - a.s || (b.st.avg ?? 0) - (a.st.avg ?? 0));
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader eyebrow="Step 4 · Directory" title="Places directory"
        desc={profile.length ? `Sorted by how well each place fits your ${profile.length} selected needs.` : "Set up your dietary profile to personalise this list."} />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {list.map(({ p, s, st }) => {
          const full = profile.length > 0 && s === 1;
          return (
            <article key={p.id} className={`card-hover flex flex-col rounded-2xl border bg-card p-5 ${profile.length && s === 0 ? "border-border opacity-60" : "border-border"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary-strong">{p.kind}</p>
                  <h2 className="mt-1 font-display text-xl font-bold">{p.name}</h2>
                  <p className="text-sm text-muted-foreground">{p.address} · {p.distance} mi</p>
                </div>
                <span className="shrink-0 rounded-full bg-success-soft px-2 py-0.5 text-xs font-bold text-success">✓ Verified</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.accommodates.map((n) => (
                  <span key={n} className={profile.includes(n) ? "tag ring-2 ring-success" : "tag bg-muted text-muted-foreground"}>[{needById(n)?.short}]</span>
                ))}
              </div>
              <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-4 mt-5">
                <div>
                  {st.avg ? <><Stars value={st.avg} size="text-sm" /><p className="text-xs text-muted-foreground">{st.avg.toFixed(1)} · {st.count} reports</p></> : <p className="text-xs text-muted-foreground">No community reports</p>}
                </div>
                <div className="flex flex-col items-end gap-1">
                  {st.risks > 0 && <span className="rounded-full bg-destructive-soft px-2 py-0.5 text-xs font-bold text-destructive">⚠ {st.risks} risk flag{st.risks > 1 ? "s" : ""}</span>}
                  {profile.length > 0 && <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${full ? "bg-success-soft text-success" : "bg-primary-soft text-primary-strong"}`}>{Math.round(s * 100)}% match</span>}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
