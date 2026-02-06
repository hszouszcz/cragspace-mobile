import { loadTopoSvgPaths } from '../loadSvgPaths';

const mockDownloadAsync = jest.fn();
const mockFromModule = jest.fn();

jest.mock('expo-asset', () => ({
  Asset: {
    fromModule: (...args: unknown[]) => mockFromModule(...args),
  },
}));

describe('loadTopoSvgPaths', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('parses paths and returns viewBox when present', async () => {
    mockFromModule.mockReturnValue({
      localUri: 'file:///mock.svg',
      downloadAsync: mockDownloadAsync.mockResolvedValue(undefined),
    });

    global.fetch = jest.fn().mockResolvedValue({
      text: jest
        .fn()
        .mockResolvedValue(
          '<svg viewBox="0 0 2200 1466"><g><path id="p1" d="M0 0" style="fill:#ff0000"/></g></svg>',
        ),
    }) as unknown as typeof fetch;

    const result = await loadTopoSvgPaths(123);

    expect(result.viewBox).toBe('0 0 2200 1466');
    expect(result.paths).toHaveLength(1);
    expect(result.paths[0]).toMatchObject({
      id: 'p1',
      d: 'M0 0',
      color: '#ff0000',
    });
  });

  it('returns empty paths array when svg has no paths', async () => {
    mockFromModule.mockReturnValue({
      localUri: 'file:///mock.svg',
      downloadAsync: mockDownloadAsync.mockResolvedValue(undefined),
    });

    global.fetch = jest.fn().mockResolvedValue({
      text: jest.fn().mockResolvedValue('<svg viewBox="0 0 10 10"></svg>'),
    }) as unknown as typeof fetch;

    const result = await loadTopoSvgPaths(123);

    expect(result.paths).toEqual([]);
    expect(result.viewBox).toBe('0 0 10 10');
  });

  it('throws when asset has no localUri', async () => {
    mockFromModule.mockReturnValue({
      localUri: null,
      downloadAsync: mockDownloadAsync.mockResolvedValue(undefined),
    });

    await expect(loadTopoSvgPaths(123)).rejects.toThrow(
      'SVG asset has no local URI after download.',
    );
  });

  it('defaults to green when no fill color is present', async () => {
    mockFromModule.mockReturnValue({
      localUri: 'file:///mock.svg',
      downloadAsync: mockDownloadAsync.mockResolvedValue(undefined),
    });

    global.fetch = jest.fn().mockResolvedValue({
      text: jest
        .fn()
        .mockResolvedValue('<svg><g><path id="p2" d="M1 1"/></g></svg>'),
    }) as unknown as typeof fetch;

    const result = await loadTopoSvgPaths(123);

    expect(result.paths[0].color).toBe('#00ff00');
  });
});
