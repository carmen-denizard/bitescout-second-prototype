import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { NEED_GROUPS, needById } from "@/lib/bitescout-data";
import { useBitescout } from "@/lib/bitescout-store";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Dietary Profile — Bitescout" },
    { name: "description", content: "Select your exact allergens, intolerances, lifestyle and medical dietary needs." },
    { property: "og:title", content: "Dietary Profile — Bitescout" },
    { property: "og:description", content: "Build your dietary profile to find safe food spots." },
  ]}),
  component: ProfilePage,
});

function ProfilePage() {
  const { profile, toggleNeed, clearProfile } = useBitescout();
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader eyebrow="Step 1 · Onboarding" title="Your dietary profile"
        desc="Check every need that applies. Your map and directory update instantly to match." />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="grid gap-5 md:grid-cols-2">
          {NEED_GROUPS.map((g) => (
            <fieldset key={g.title} className="rounded-2xl border border-border bg-card p-5">
              <legend className="sr-only">{g.title}</legend>
              <h2 className="font-display text-lg font-bold">{g.title}</h2>
              <div className="mt-3 grid gap-1">
                {g.items.map((n) => {
                  const on = profile.includes(n.id);
                  return (
                    <label key={n.id} className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-primary-soft ${on ? "bg-success-soft" : ""}`}>
                      <input type="checkbox" checked={on} onChange={() => toggleNeed(n.id)} className="h-4 w-4 accent-[var(--color-success)]" />
                      <span className="text-sm font-medium">{n.label}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>
        <aside className="h-fit rounded-2xl border border-border bg-card p-5 xl:sticky xl:top-8">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Active profile</h2>
            <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs font-bold text-primary-strong">{profile.length}</span>
          </div>
          <div className="mt-3 flex min-h-12 flex-wrap gap-1.5">
            {profile.length ? profile.map((id) => (
              <button key={id} onClick={() => toggleNeed(id)} className="tag cursor-pointer hover:opacity-80" aria-label={`Remove ${needById(id)?.label}`}>
                {needById(id)?.label} ×
              </button>
            )) : <p className="text-sm text-muted-foreground">Nothing selected yet.</p>}
          </div>
          <div className="mt-5 flex flex-col gap-2">
            <Link to="/map" className="btn btn-primary">Explore the map →</Link>
            <button onClick={clearProfile} className="btn btn-ghost" disabled={!profile.length}>Clear all</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
