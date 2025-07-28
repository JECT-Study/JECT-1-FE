export const Categories = ["FESTIVAL", "EXHIBITION", "PERFORMANCE", "EVENT"];

export type CategoryKey = (typeof Categories)[number]; // "FESTIVAL" | "EXHIBITION" ...

export const CategoriesObject: Record<CategoryKey, string> = {
  FESTIVAL: "축제",
  EXHIBITION: "전시",
  PERFORMANCE: "공연",
  EVENT: "행사",
};
