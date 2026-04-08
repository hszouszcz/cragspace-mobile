import type { Guidebook } from './types';

const NON_NFD_MAP: Record<string, string> = {
  ł: 'l',
  Ł: 'L',
  ø: 'o',
  Ø: 'O',
  æ: 'ae',
  Æ: 'AE',
  ß: 'ss',
  đ: 'd',
  Đ: 'D',
  ı: 'i',
};

const NON_NFD_REGEX = new RegExp(`[${Object.keys(NON_NFD_MAP).join('')}]`, 'g');

export function normalizeText(text: string): string {
  return text
    .replace(NON_NFD_REGEX, (char) => NON_NFD_MAP[char] ?? char)
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

export function scoreGuidebook(
  guidebook: Guidebook,
  normalizedQuery: string,
): number {
  if (!normalizedQuery) return 0;

  const title = normalizeText(guidebook.title);
  const region = normalizeText(guidebook.region);
  const country = normalizeText(guidebook.country);
  const publisher = guidebook.publisher
    ? normalizeText(guidebook.publisher)
    : '';

  if (title === normalizedQuery) return 100;
  if (title.startsWith(normalizedQuery)) return 80;
  if (title.includes(normalizedQuery)) return 60;
  if (region.includes(normalizedQuery)) return 40;
  if (country.includes(normalizedQuery)) return 30;
  if (publisher && publisher.includes(normalizedQuery)) return 20;

  return 0;
}

export function searchGuidebooks(
  guidebooks: Guidebook[],
  query: string,
  selectedStyles: string[],
): Guidebook[] {
  const isStyleFilterActive =
    selectedStyles.length > 0 && !selectedStyles.every((v) => v === 'all');

  let results = guidebooks;

  if (isStyleFilterActive) {
    const styleSet = new Set(selectedStyles);
    results = results.filter((g) =>
      g.climbingStyles.some((style) => styleSet.has(style)),
    );
  }

  const trimmedQuery = query.trim();
  if (!trimmedQuery) return results;

  const normalizedQuery = normalizeText(trimmedQuery);

  return results
    .map((g) => ({ guidebook: g, score: scoreGuidebook(g, normalizedQuery) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.guidebook.title.localeCompare(b.guidebook.title);
    })
    .map(({ guidebook }) => guidebook);
}
