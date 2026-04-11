import type { GradeRange } from '@/services/guidebooks/guidebook-detail-search';
import { KURTYKI_GRADES, type KurtykaGrade } from '@/services/guidebooks/types';
import { useState } from 'react';

interface UseGroupedFiltersStateResult {
  styleValue: string;
  setStyleFilter: (value: string) => void;
  gradeRange: GradeRange;
  setGradeRange: (range: GradeRange) => void;
  isGradeRangeDefault: boolean;
}

const DEFAULT_MIN: KurtykaGrade = KURTYKI_GRADES[0];
const DEFAULT_MAX: KurtykaGrade = KURTYKI_GRADES[KURTYKI_GRADES.length - 1];

export function useGroupedFiltersState(): UseGroupedFiltersStateResult {
  const [styleValue, setStyleValue] = useState<string>('all');
  const [gradeRange, setGradeRangeState] = useState<GradeRange>({
    min: DEFAULT_MIN,
    max: DEFAULT_MAX,
  });

  const isGradeRangeDefault =
    gradeRange.min === DEFAULT_MIN && gradeRange.max === DEFAULT_MAX;

  return {
    styleValue,
    setStyleFilter: setStyleValue,
    gradeRange,
    setGradeRange: setGradeRangeState,
    isGradeRangeDefault,
  };
}
