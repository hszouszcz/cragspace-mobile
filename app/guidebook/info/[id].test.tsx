import { render, screen } from '@testing-library/react-native';
import React from 'react';

// ── Subject under test ────────────────────────────────────────────────────────

import GuidebookInfoScreen from './[id]';

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockBack = jest.fn();
let mockId: string = 'gb-1';

jest.mock('expo-router', () => {
  const { View } = require('react-native');
  const ReactLocal = require('react');
  return {
    useLocalSearchParams: () => ({ id: mockId }),
    useRouter: () => ({ back: mockBack }),
    Stack: {
      Screen: ({ options }: { options: { title?: string } }) =>
        ReactLocal.createElement(View, {
          testID: 'stack-screen',
          accessibilityLabel: options?.title,
        }),
    },
  };
});

const mockGuidebookDetails: Record<string, unknown> = {
  'gb-1': {
    metadata: {
      author: 'Jan Kowalski',
      edition: '3rd edition',
      year: 2022,
      isbn: '978-83-123456-7-8',
      sections: [
        { id: 'sec-1', title: 'Introduction', content: 'Some intro text.' },
        { id: 'sec-2', title: 'History', content: 'Some history text.' },
        { id: 'sec-3', title: 'Access', content: 'Some access text.' },
      ],
    },
  },
  'gb-no-isbn': {
    metadata: {
      author: 'Anna Nowak',
      edition: '1st edition',
      year: 2019,
      isbn: null,
      sections: [
        { id: 'sec-a', title: 'Overview', content: 'Overview content.' },
        { id: 'sec-b', title: 'Ethics', content: 'Ethics content.' },
      ],
    },
  },
};

jest.mock('@/services/guidebooks/guidebook-detail-data', () => ({
  get GUIDEBOOK_DETAILS() {
    return mockGuidebookDetails;
  },
}));

jest.mock('@/features/GuidebookDetail/components/MetadataSection', () => {
  const { View } = require('react-native');
  const ReactLocal = require('react');
  return {
    MetadataSection: ({ title }: { title: string }) =>
      ReactLocal.createElement(View, {
        testID: 'metadata-section',
        accessibilityLabel: title,
      }),
  };
});

jest.mock('@/components/ui/separator/separator', () => {
  const { View } = require('react-native');
  const ReactLocal = require('react');
  return {
    Separator: () => ReactLocal.createElement(View, { testID: 'separator' }),
  };
});

jest.mock('@/components/ui/use-theme-colors', () => ({
  useThemeColors: () => ({
    backgroundPrimary: '#ffffff',
    textSecondary: '#666666',
    textTertiary: '#999999',
  }),
}));

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  const ReactLocal = require('react');
  return {
    SafeAreaView: ({ children }: { children: React.ReactNode }) =>
      ReactLocal.createElement(View, null, children),
  };
});

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  mockId = 'gb-1';
});

describe('GuidebookInfoScreen', () => {
  describe('guard behavior', () => {
    it('calls router.back() and renders nothing when id does not exist', () => {
      mockId = 'non-existent-id';
      const { toJSON } = render(<GuidebookInfoScreen />);

      expect(mockBack).toHaveBeenCalledTimes(1);
      expect(toJSON()).toBeNull();
    });

    it('does not call router.back() when id is valid', () => {
      mockId = 'gb-1';
      render(<GuidebookInfoScreen />);

      expect(mockBack).not.toHaveBeenCalled();
    });
  });

  describe('Stack.Screen title', () => {
    it('sets the title to "About This Guidebook"', () => {
      render(<GuidebookInfoScreen />);

      const stackScreen = screen.getByTestId('stack-screen');
      expect(stackScreen.props.accessibilityLabel).toBe('About This Guidebook');
    });
  });

  describe('happy path rendering', () => {
    it('renders author, edition, and year string', () => {
      render(<GuidebookInfoScreen />);

      expect(
        screen.getByText('Jan Kowalski · 3rd edition · 2022'),
      ).toBeTruthy();
    });

    it('renders ISBN when present', () => {
      render(<GuidebookInfoScreen />);

      expect(screen.getByText('ISBN 978-83-123456-7-8')).toBeTruthy();
    });

    it('does not render ISBN when absent', () => {
      mockId = 'gb-no-isbn';
      render(<GuidebookInfoScreen />);

      expect(screen.queryByText(/^ISBN/)).toBeNull();
    });
  });

  describe('sections rendering', () => {
    it('renders a MetadataSection for each section', () => {
      render(<GuidebookInfoScreen />);

      const sections = screen.getAllByTestId('metadata-section');
      expect(sections).toHaveLength(3);
    });

    it('renders each section with its title', () => {
      render(<GuidebookInfoScreen />);

      expect(screen.getByLabelText('Introduction')).toBeTruthy();
      expect(screen.getByLabelText('History')).toBeTruthy();
      expect(screen.getByLabelText('Access')).toBeTruthy();
    });

    it('renders a separator between sections but not after the last one', () => {
      render(<GuidebookInfoScreen />);

      // 3 sections → 2 inter-section dividers + 1 unconditional section-break = 3 total
      const separators = screen.getAllByTestId('separator');
      const sectionCount = 3;
      const expectedDividers = sectionCount - 1;
      const sectionBreak = 1;
      expect(separators).toHaveLength(sectionBreak + expectedDividers);
    });

    it('renders one fewer inter-section separator than sections for a two-section guidebook', () => {
      mockId = 'gb-no-isbn';
      render(<GuidebookInfoScreen />);

      // 2 sections → 1 inter-section divider + 1 section-break = 2 total
      const separators = screen.getAllByTestId('separator');
      expect(separators).toHaveLength(2);
    });
  });
});
