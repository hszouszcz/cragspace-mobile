export interface HeroGuidebook {
  id: string;
  title: string;
  location: string;
  routeCount: string;
  color: string;
  image?: string;
  badge?: string;
  publisher?: string;
  year?: number;
}

export interface ListGuidebook {
  id: string;
  title: string;
  subtitle: string;
  color: string;
}

export type ScreenItem =
  | { type: 'section-header'; id: string; title: string }
  | { type: 'hero-card'; id: string; guidebook: HeroGuidebook }
  | { type: 'info-cards-row'; id: string }
  | { type: 'list-card'; id: string; guidebook: ListGuidebook }
  | { type: 'spacer'; id: string };
