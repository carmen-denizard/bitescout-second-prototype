import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { PLACES, SEED_REPORTS, type NeedId, type Place, type PlaceType, type Report } from "./bitescout-data";

type Ctx = {
  profile: NeedId[]; toggleNeed: (id: NeedId) => void; clearProfile: () => void;
  types: PlaceType[]; toggleType: (t: PlaceType) => void;
  reports: Report[]; addReport: (r: Omit<Report, "id" | "date">) => void;
  stats: (placeId: string) => { avg: number | null; count: number; risks: number };
  matchScore: (p: Place) => number;
};
const C = createContext<Ctx | null>(null);

export function BitescoutProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<NeedId[]>([]);
  const [types, setTypes] = useState<PlaceType[]>([]);
  const [reports, setReports] = useState<Report[]>(SEED_REPORTS);
  const value = useMemo<Ctx>(() => ({
    profile, types, reports,
    toggleNeed: (id) => setProfile((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id])),
    clearProfile: () => setProfile([]),
    toggleType: (t) => setTypes((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t])),
    addReport: (r) => setReports((p) => [{ ...r, id: crypto.randomUUID(), date: new Date().toLocaleDateString() }, ...p]),
    stats: (placeId) => {
      const rs = reports.filter((r) => r.placeId === placeId);
      return { count: rs.length, risks: rs.filter((r) => r.mode === "risk").length,
        avg: rs.length ? rs.reduce((s, r) => s + r.stars, 0) / rs.length : null };
    },
    matchScore: (p) => (profile.length ? profile.filter((n) => p.accommodates.includes(n)).length / profile.length : 1),
  }), [profile, types, reports]);
  return <C.Provider value={value}>{children}</C.Provider>;
}
export const useBitescout = () => { const c = useContext(C); if (!c) throw new Error("no provider"); return c; };
export { PLACES };
