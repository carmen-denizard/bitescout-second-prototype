export type NeedId = string;
export const NEED_GROUPS: { title: string; items: { id: NeedId; label: string; short: string }[] }[] = [
  { title: "Allergens", items: [
    { id: "gluten-free", label: "Gluten-free", short: "GF" },
    { id: "nut-free", label: "Nut-free", short: "NF" },
    { id: "dairy-free", label: "Dairy-free", short: "DF" },
    { id: "fish-free", label: "Fish-free", short: "Fish-free" },
    { id: "shellfish-free", label: "Shellfish-free", short: "SF" },
  ]},
  { title: "Intolerances", items: [
    { id: "int-lactose", label: "Lactose / Dairy", short: "Lactose" },
    { id: "int-gluten", label: "Gluten", short: "Gluten-int" },
    { id: "fodmap", label: "FODMAP", short: "Low-FODMAP" },
    { id: "histamine", label: "Histamine and Amine", short: "Histamine" },
    { id: "fructose", label: "Fructose", short: "Fructose" },
    { id: "salicylate", label: "Salicylate", short: "Salicylate" },
    { id: "caffeine", label: "Caffeine", short: "Caffeine" },
    { id: "sulfite", label: "Sulfite", short: "Sulfite" },
    { id: "additives", label: "Food Additives / Chemicals", short: "Additive-free" },
  ]},
  { title: "Lifestyle", items: [
    { id: "vegan", label: "Vegan", short: "Vegan" },
    { id: "veg-lacto", label: "Vegetarian (Lacto)", short: "Lacto-Veg" },
    { id: "veg-ovo", label: "Vegetarian (Ovo)", short: "Ovo-Veg" },
    { id: "veg-lacto-ovo", label: "Vegetarian (Lacto-Ovo)", short: "Veg" },
    { id: "pescatarian", label: "Pescatarian", short: "Pesc" },
    { id: "mediterranean", label: "Mediterranean", short: "Med" },
    { id: "flexitarian", label: "Flexitarian", short: "Flex" },
  ]},
  { title: "Religious / Medical", items: [
    { id: "halal", label: "Halal", short: "Halal" },
    { id: "kosher", label: "Kosher", short: "Kosher" },
    { id: "low-sodium", label: "Low-Sodium", short: "Low-Na" },
    { id: "low-fat", label: "Low-Fat", short: "Low-Fat" },
    { id: "low-fiber", label: "Low-Fiber", short: "Low-Fiber" },
    { id: "diabetic", label: "Diabetic", short: "Diabetic" },
    { id: "renal", label: "Renal", short: "Renal" },
  ]},
];
export const ALL_NEEDS = NEED_GROUPS.flatMap((g) => g.items);
export const needById = (id: NeedId) => ALL_NEEDS.find((n) => n.id === id);

export const PLACE_TYPES = ["Dine-in", "Take-out", "Grocery", "Delivery", "Food Pantry", "Fast Food"] as const;
export type PlaceType = (typeof PLACE_TYPES)[number];

export type Place = {
  id: string; name: string; kind: string; types: PlaceType[]; address: string; distance: number;
  phone: string; accommodates: NeedId[]; x: number; y: number;
};

export const PLACES: Place[] = [
  { id: "p1", name: "Sample Green Table", kind: "Restaurant", types: ["Dine-in", "Take-out"], address: "101 Sample Ave", distance: 0.4, phone: "(555) 010-0101", accommodates: ["gluten-free", "vegan", "dairy-free", "nut-free", "veg-lacto-ovo", "low-sodium", "fodmap"], x: 28, y: 32 },
  { id: "p2", name: "Example Bakery Co.", kind: "Bakery", types: ["Take-out", "Delivery"], address: "202 Placeholder St", distance: 0.9, phone: "(555) 010-0202", accommodates: ["gluten-free", "nut-free", "veg-lacto", "veg-ovo", "veg-lacto-ovo", "kosher"], x: 62, y: 22 },
  { id: "p3", name: "Demo Fresh Market", kind: "Grocery Store", types: ["Grocery", "Delivery"], address: "303 Mock Blvd", distance: 1.3, phone: "(555) 010-0303", accommodates: ["gluten-free", "dairy-free", "vegan", "halal", "kosher", "diabetic", "renal", "low-fat", "additives", "int-lactose"], x: 74, y: 58 },
  { id: "p4", name: "Community Pantry (Sample)", kind: "Food Pantry", types: ["Food Pantry"], address: "404 Example Rd", distance: 1.8, phone: "(555) 010-0404", accommodates: ["halal", "low-sodium", "diabetic", "gluten-free", "veg-lacto-ovo"], x: 40, y: 70 },
  { id: "p5", name: "Test Kitchen Buffet", kind: "Buffet", types: ["Dine-in"], address: "505 Sample Ln", distance: 2.2, phone: "(555) 010-0505", accommodates: ["mediterranean", "pescatarian", "halal", "flexitarian", "shellfish-free"], x: 18, y: 55 },
  { id: "p6", name: "Placeholder Quick Bites", kind: "Fast Food", types: ["Fast Food", "Take-out", "Delivery"], address: "606 Mock Ct", distance: 0.7, phone: "(555) 010-0606", accommodates: ["gluten-free", "vegan", "fish-free", "shellfish-free", "caffeine"], x: 50, y: 44 },
  { id: "p7", name: "Sample Harbor Grill", kind: "Restaurant", types: ["Dine-in"], address: "707 Example Pier", distance: 2.9, phone: "(555) 010-0707", accommodates: ["pescatarian", "mediterranean", "gluten-free", "dairy-free", "low-fat"], x: 84, y: 30 },
  { id: "p8", name: "Demo Calm Café", kind: "Café", types: ["Dine-in", "Take-out"], address: "808 Placeholder Way", distance: 1.1, phone: "(555) 010-0808", accommodates: ["histamine", "salicylate", "fructose", "sulfite", "fodmap", "low-fiber", "int-gluten", "caffeine"], x: 58, y: 78 },
];

export type Report = { id: string; placeId: string; mode: "risk" | "rating"; stars: number; details: string; date: string };
export const SEED_REPORTS: Report[] = [
  { id: "r1", placeId: "p1", mode: "rating", stars: 5, details: "Sample: dedicated gluten-free prep area.", date: "Sample" },
  { id: "r2", placeId: "p2", mode: "rating", stars: 4, details: "Sample: clear allergen labels.", date: "Sample" },
  { id: "r3", placeId: "p6", mode: "risk", stars: 2, details: "Sample: shared fryer noted.", date: "Sample" },
  { id: "r4", placeId: "p3", mode: "rating", stars: 5, details: "Sample: wide free-from aisle.", date: "Sample" },
  { id: "r5", placeId: "p7", mode: "rating", stars: 4, details: "Sample: staff checked with kitchen.", date: "Sample" },
];
