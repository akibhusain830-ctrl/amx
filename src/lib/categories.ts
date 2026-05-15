export type CategoryConfig = {
  label: string;
  slug: string;
  dbValue: string;
};

export const CATEGORY_CONFIG: CategoryConfig[] = [
  { label: "Cafe", slug: "cafe", dbValue: "Cafe" },
  { label: "Gaming", slug: "gaming", dbValue: "Gaming" },
  { label: "Wings", slug: "wings", dbValue: "Wings" },
  { label: "Cars", slug: "cars", dbValue: "Cars" },
  { label: "Aesthetic", slug: "aesthetic", dbValue: "Aesthetic" },
  { label: "Love", slug: "love", dbValue: "Love" },
  { label: "Pop Culture", slug: "pop-culture", dbValue: "Pop Culture" },
  { label: "Under 4000", slug: "under-4000", dbValue: "Under 4000" },
];

export const CATEGORY_BY_SLUG = new Map(
  CATEGORY_CONFIG.map((c) => [c.slug, c])
);

export const CATEGORY_BY_DB_VALUE = new Map(
  CATEGORY_CONFIG.map((c) => [c.dbValue.toLowerCase(), c])
);

export function mapSlugToDbCategory(slug: string): string {
  return CATEGORY_BY_SLUG.get(slug.toLowerCase())?.dbValue ?? slug;
}

export function mapDbCategoryToLabel(dbValue: string): string {
  return CATEGORY_BY_DB_VALUE.get(dbValue.toLowerCase())?.label ?? dbValue;
}

