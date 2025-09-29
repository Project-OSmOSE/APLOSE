import { LinearScaleNode } from "@/features/_utils_/gql/types.generated.ts";
import { AbstractScale, Step } from "./type";

type LineaScale = Pick<LinearScaleNode, 'maxValue'> & Partial<Pick<LinearScaleNode, 'minValue'>>

export class LinearScaleService implements AbstractScale {

  private MIN_SMALL_STEPS_RANGE_PX = 14;
  private MIN_BIG_STEPS_RANGE_PX = 30;

  get min(): number {
    return this.scale.minValue ?? 0
  }

  get range(): number {
    return this.scale.maxValue - this.min;
  }

  public get height(): number {
    return this.pixelHeight;
  }

  constructor(private pixelHeight: number,
              public scale: LineaScale) {
    if (scale.minValue && scale.minValue > scale.maxValue) throw `Incorrect scale range: min=${ scale.minValue } and max=${ scale.maxValue }`;
  }

  valueToPosition(value: number): number {
    return this.crossProduct(value - this.min, this.range, this.pixelHeight);
  }

  valuesToPositionRange(min: number, max: number): number {
    return Math.abs(this.valueToPosition(max) - this.valueToPosition(min));
  }

  positionToValue(position: number): number {
    return this.min + this.crossProduct(position, this.pixelHeight, this.range);
  }

  positionsToRange(min: number, max: number): number {
    return Math.abs(this.positionToValue(max) - this.positionToValue(min));
  }

  getSteps(): Array<Step> {
    const bigStepsRange = this.getMinBigStepsRange();
    const smallStepsRange = this.getMinSmallStepsRange(bigStepsRange);

    const array = new Array<Step>();

    const innerSteps = Math.max(1, this.getNumber(1, smallStepsRange.toString().length))
    for (let value = Math.floor(this.min / innerSteps) * innerSteps;
         value <= Math.round(this.scale.maxValue / innerSteps) * innerSteps; value += innerSteps) {
      if (value < this.min || value > this.scale.maxValue) continue;
      const position: number = Math.floor(this.valueToPosition(value));
      if (value % bigStepsRange === 0)
        array.push({ position, value, importance: 'big' })
      else if (smallStepsRange > 0 && value % smallStepsRange === 0)
        array.push({ position, value, importance: 'small' })
    }
    if (!array.filter(s => s.importance === 'big').some(s => s.value === this.min)) {
      array.push({
        position: Math.floor(this.valueToPosition(this.min)),
        value: this.min,
        importance: 'big'
      })
    }
    if (!array.filter(s => s.importance === 'big').some(s => s.value === this.scale.maxValue)) {
      array.push({
        position: Math.floor(this.valueToPosition(this.scale.maxValue)),
        value: this.scale.maxValue,
        importance: 'big'
      })
    }
    return array
  }

  isRangeContinuouslyOnScale(min: number, max: number): boolean {
    return min >= this.min && max >= this.min
      && min <= this.scale.maxValue && max <= this.scale.maxValue
  }

  private getMinBigStepsRange(): number {
    const maxFrequencyStr = Math.ceil(this.range).toString();
    let bigStepsRange = this.getNumber(1, maxFrequencyStr.length - 2);
    while (bigStepsRange * this.pixelHeight / this.range < this.MIN_BIG_STEPS_RANGE_PX) {
      switch (+bigStepsRange.toString()[0]) {
        case 1:
          bigStepsRange *= 2
          break;
        case 2:
          bigStepsRange *= 5
          break;
      }
    }
    return bigStepsRange
  }

  private getMinSmallStepsRange(bigStep: number): number {
    let range: number;
    switch (+bigStep.toString()[0]) {
      case 1:
        range = this.getNumber(2, bigStep.toString().length - 1);
        break;
      case 2:
        range = this.getNumber(5, bigStep.toString().length - 1);
        break;
      default:
        return 0;
    }
    while (range * this.pixelHeight / this.range < this.MIN_SMALL_STEPS_RANGE_PX) {
      switch (+range.toString()[0]) {
        case 2:
          range *= 2.5
          break;
        case 5:
          range *= 4
          break;
      }
    }
    return range;
  }

  private crossProduct(value: number, range: number, maxOtherScale: number): number {
    if (value < 0) return 0;
    if (value > range) return maxOtherScale;
    return value * maxOtherScale / range;
  }

  private getNumber(first: number, length: number) {
    return Math.max(0, +Array.from(new Array(length)).map((_, key) => key === 0 ? first : 0).join(''))
  }

}