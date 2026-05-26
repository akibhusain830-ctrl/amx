export type CityConfig = {
  name: string;
  slug: string;
  region: string;
};

export const CITIES: CityConfig[] = [
  { name: "Mumbai", slug: "mumbai", region: "Maharashtra" },
  { name: "Delhi", slug: "delhi", region: "NCR" },
  { name: "Bangalore", slug: "bangalore", region: "Karnataka" },
  { name: "Hyderabad", slug: "hyderabad", region: "Telangana" },
  { name: "Chennai", slug: "chennai", region: "Tamil Nadu" },
  { name: "Pune", slug: "pune", region: "Maharashtra" },
  { name: "Ahmedabad", slug: "ahmedabad", region: "Gujarat" },
  { name: "Kolkata", slug: "kolkata", region: "West Bengal" },
  { name: "Gurgaon", slug: "gurgaon", region: "Haryana" },
  { name: "Noida", slug: "noida", region: "Uttar Pradesh" },
  { name: "Jaipur", slug: "jaipur", region: "Rajasthan" },
  { name: "Chandigarh", slug: "chandigarh", region: "Punjab" },
];

export const CITY_BY_SLUG = new Map(
  CITIES.map((c) => [c.slug, c])
);
