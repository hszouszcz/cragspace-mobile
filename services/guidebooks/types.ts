export const CLIMBING_STYLE = {
  sport: 'sport',
  trad: 'trad',
  bouldering: 'bouldering',
  alpine: 'alpine',
  ice: 'ice',
  mixed: 'mixed',
  viaFerrata: 'via-ferrata',
} as const;

export type ClimbingStyle =
  (typeof CLIMBING_STYLE)[keyof typeof CLIMBING_STYLE];

export interface Guidebook {
  id: string;
  title: string;
  country: string;
  region: string;
  publisher: string | null;
  pricePln: string;
  coverImageUrl: string;
  productUrl: string | null;
  climbingStyles: ClimbingStyle[];
}
