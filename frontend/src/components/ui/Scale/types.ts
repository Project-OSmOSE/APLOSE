export type ScaleService = {
  ratio: number;
  minValue: number;
  maxValue: number;

  valueToPosition(value: number): number;
  valuesToPositionRange(min: number, max: number): number;

  positionToValue(position: number): number;
  positionsToRange(min: number, max: number): number;

  isRangeContinuouslyOnScale(min: number, max: number): boolean;
  getSteps(): Array<Step>;
}

export type Step = {
  position: number;
  size: 'small' | 'regular' | 'big';
  value: number;
  additionalValue?: number;
  correspondingRatio?: number;
}