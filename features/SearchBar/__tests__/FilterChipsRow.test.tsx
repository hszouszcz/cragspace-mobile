import { fireEvent, render } from '@testing-library/react-native';
import { FilterChipsRow } from '../FilterChipsRow';

const filters = [
  { id: 'all', label: 'All Disciplines', value: 'all' },
  { id: 'boulder', label: 'Bouldering', value: 'bouldering' },
];

describe('FilterChipsRow', () => {
  it('renders chips from metadata and toggles selected chip', () => {
    const onToggleFilter = jest.fn();
    const { getByLabelText } = render(
      <FilterChipsRow
        filters={filters}
        selectedValues={['all']}
        onToggleFilter={onToggleFilter}
      />,
    );

    const selectedChip = getByLabelText('All Disciplines');
    const unselectedChip = getByLabelText('Bouldering');

    expect(selectedChip.props.accessibilityState.selected).toBe(true);
    expect(unselectedChip.props.accessibilityState.selected).toBe(false);

    fireEvent.press(unselectedChip);
    expect(onToggleFilter).toHaveBeenCalledWith('bouldering');
  });
});
