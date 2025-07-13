export type categoryUnion =
  | "all"
  | "festival"
  | "concert"
  | "exhibition"
  | "event";

export const filterData: Record<categoryUnion, string> = {
  all: "전체",
  concert: "공연",
  exhibition: "전시",
  festival: "축제",
  event: "행사",
} as const;
