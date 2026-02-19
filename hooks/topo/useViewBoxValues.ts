export type ViewBoxValues = {
  minX: number;
  minY: number;
  width: number;
  height: number;
};

export const useViewBoxValues = (
  viewBox: string | null,
): ViewBoxValues | null => {
  if (!viewBox) {
    return null;
  }
  const values = viewBox.split(' ').map((value) => Number.parseFloat(value));
  if (values.length !== 4 || values.some((value) => !Number.isFinite(value))) {
    return null;
  }
  const [minX, minY, width, height] = values;
  return { minX, minY, width, height };
};
