import type { Guidebook } from '../types';
import { normalizeText, scoreGuidebook, searchGuidebooks } from '../search';

// Inline test fixtures — isolated from display data
const juraPolnocna: Guidebook = {
  id: '566',
  title: 'Jura Północna',
  country: 'Poland',
  region: 'Jura',
  publisher: 'Wspinanie.pl',
  pricePln: '99.00',
  coverImageUrl: '',
  productUrl: null,
  climbingStyles: ['sport', 'trad'],
};

const ziemiaKlodzka: Guidebook = {
  id: '1101',
  title: 'Ziemia Kłodzka',
  country: 'Poland',
  region: 'Sudety',
  publisher: 'Wspinanie.pl',
  pricePln: '89.00',
  coverImageUrl: '',
  productUrl: null,
  climbingStyles: ['sport'],
};

const romsdal: Guidebook = {
  id: '1134',
  title: 'Crag Climbing in Romsdal',
  country: 'Norway',
  region: 'Romsdal',
  publisher: null,
  pricePln: '150.00',
  coverImageUrl: '',
  productUrl: null,
  climbingStyles: ['sport'],
};

const himalayan: Guidebook = {
  id: '1155',
  title: 'Himalayan Rocks',
  country: 'Nepal',
  region: 'Himalayas',
  publisher: null,
  pricePln: '180.00',
  coverImageUrl: '',
  productUrl: null,
  climbingStyles: ['alpine'],
};

const tatry: Guidebook = {
  id: '949',
  title: 'Tatry Polskie – Drogi Zimowe',
  country: 'Poland',
  region: 'Tatry',
  publisher: 'Biblioteka Taternika',
  pricePln: '159.00',
  coverImageUrl: '',
  productUrl: null,
  climbingStyles: ['alpine', 'ice'],
};

const chorwacja: Guidebook = {
  id: '393',
  title: 'Chorwacja',
  country: 'Croatia',
  region: 'Dalmatia',
  publisher: 'Wspinanie.pl',
  pricePln: '120.00',
  coverImageUrl: '',
  productUrl: null,
  climbingStyles: ['sport', 'trad'],
};

const ALL_FIXTURES = [
  juraPolnocna,
  ziemiaKlodzka,
  romsdal,
  himalayan,
  tatry,
  chorwacja,
];

// ---------------------------------------------------------------------------
// normalizeText
// ---------------------------------------------------------------------------

describe('normalizeText', () => {
  it('lowercases text', () => {
    expect(normalizeText('JURA')).toBe('jura');
  });

  it('returns empty string for empty input', () => {
    expect(normalizeText('')).toBe('');
  });

  it('strips NFD-decomposable diacritics', () => {
    expect(normalizeText('Północna')).toBe('polnocna');
  });

  it('substitutes ł/Ł which NFD cannot decompose', () => {
    expect(normalizeText('Kłodzka')).toBe('klodzka');
    expect(normalizeText('Łódź')).toBe('lodz');
  });

  it('substitutes ø/Ø', () => {
    expect(normalizeText('Romsdal ø')).toBe('romsdal o');
  });

  it('substitutes æ/Æ to ae', () => {
    expect(normalizeText('Ræ')).toBe('rae');
  });

  it('substitutes ß to ss', () => {
    expect(normalizeText('Straße')).toBe('strasse');
  });

  it('substitutes đ/Đ', () => {
    expect(normalizeText('Đakovo')).toBe('dakovo');
  });
});

// ---------------------------------------------------------------------------
// scoreGuidebook
// ---------------------------------------------------------------------------

describe('scoreGuidebook', () => {
  it('returns 0 for empty query', () => {
    expect(scoreGuidebook(juraPolnocna, '')).toBe(0);
  });

  it('returns 100 for exact normalized title match', () => {
    expect(scoreGuidebook(juraPolnocna, 'jura polnocna')).toBe(100);
  });

  it('returns 80 when title starts with query', () => {
    expect(scoreGuidebook(juraPolnocna, 'jura')).toBe(80);
  });

  it('returns 60 when title contains query (not starts-with)', () => {
    expect(scoreGuidebook(juraPolnocna, 'polnocna')).toBe(60);
  });

  it('returns 40 when region contains query', () => {
    // "tatry" matches region only (not in title)
    const guide: Guidebook = {
      ...himalayan,
      title: 'Some Guide',
      region: 'Tatry',
    };
    expect(scoreGuidebook(guide, 'tatry')).toBe(40);
  });

  it('returns 30 when country contains query', () => {
    const guide: Guidebook = { ...himalayan, title: 'XYZ', region: 'XYZ' };
    expect(scoreGuidebook(guide, 'nepal')).toBe(30);
  });

  it('returns 20 when publisher contains query', () => {
    const guide: Guidebook = {
      ...himalayan,
      title: 'XYZ',
      region: 'XYZ',
      country: 'XYZ',
      publisher: 'Wspinanie.pl',
    };
    expect(scoreGuidebook(guide, 'wspinanie')).toBe(20);
  });

  it('returns 0 when nothing matches', () => {
    expect(scoreGuidebook(juraPolnocna, 'zzznomatch')).toBe(0);
  });

  it('does not throw when publisher is null', () => {
    expect(() => scoreGuidebook(romsdal, 'test')).not.toThrow();
  });

  it('title score is higher than region score for the same query', () => {
    const titleScore = scoreGuidebook(juraPolnocna, 'jura');
    const regionScore = scoreGuidebook(
      { ...juraPolnocna, title: 'XYZ Guide', region: 'Jura' },
      'jura',
    );
    expect(titleScore).toBeGreaterThan(regionScore);
  });
});

// ---------------------------------------------------------------------------
// searchGuidebooks
// ---------------------------------------------------------------------------

describe('searchGuidebooks', () => {
  it('returns all guidebooks when selectedStyles is empty', () => {
    expect(searchGuidebooks(ALL_FIXTURES, '', [])).toHaveLength(
      ALL_FIXTURES.length,
    );
  });

  it('returns all guidebooks when selectedStyles is ["all"]', () => {
    expect(searchGuidebooks(ALL_FIXTURES, '', ['all'])).toHaveLength(
      ALL_FIXTURES.length,
    );
  });

  it('returns all guidebooks when query is empty and no style filter', () => {
    const results = searchGuidebooks(ALL_FIXTURES, '', ['all']);
    expect(results).toEqual(ALL_FIXTURES);
  });

  it('filters by a single climbing style', () => {
    const results = searchGuidebooks(ALL_FIXTURES, '', ['alpine']);
    expect(results.every((g) => g.climbingStyles.includes('alpine'))).toBe(
      true,
    );
    expect(results).toHaveLength(2); // himalayan + tatry
  });

  it('filters by multiple styles (union semantics)', () => {
    const results = searchGuidebooks(ALL_FIXTURES, '', ['alpine', 'ice']);
    // himalayan (alpine), tatry (alpine + ice)
    expect(results).toHaveLength(2);
  });

  it('returns empty array when style filter matches nothing', () => {
    const results = searchGuidebooks(ALL_FIXTURES, '', ['bouldering']);
    expect(results).toHaveLength(0);
  });

  it('returns results sorted by score descending', () => {
    // "jura" matches juraPolnocna title (score 80) and nothing else in our fixtures
    const results = searchGuidebooks(ALL_FIXTURES, 'jura', []);
    expect(results[0].id).toBe('566');
  });

  it('sorts score ties alphabetically by title', () => {
    const a: Guidebook = {
      ...juraPolnocna,
      id: 'a1',
      title: 'Zebra Guide',
      region: 'Alps',
    };
    const b: Guidebook = {
      ...juraPolnocna,
      id: 'b1',
      title: 'Alps Guide',
      region: 'Alps',
    };
    // Both score 40 (region match)
    const results = searchGuidebooks([a, b], 'alps', []);
    expect(results[0].title).toBe('Alps Guide');
    expect(results[1].title).toBe('Zebra Guide');
  });

  it('finds results with diacritic-free query (Polish)', () => {
    const results = searchGuidebooks(ALL_FIXTURES, 'polnocna', []);
    expect(results.some((g) => g.id === '566')).toBe(true);
  });

  it('finds results with diacritic-free query for ł', () => {
    const results = searchGuidebooks(ALL_FIXTURES, 'klodzka', []);
    expect(results.some((g) => g.id === '1101')).toBe(true);
  });

  it('applies combined style + text filter', () => {
    // "poland" country match + sport style
    const results = searchGuidebooks(ALL_FIXTURES, 'poland', ['sport']);
    expect(results.every((g) => g.climbingStyles.includes('sport'))).toBe(true);
    expect(results.every((g) => g.country === 'Poland')).toBe(true);
  });

  it('returns empty array when text query matches nothing', () => {
    const results = searchGuidebooks(ALL_FIXTURES, 'zzznomatch', []);
    expect(results).toHaveLength(0);
  });
});
