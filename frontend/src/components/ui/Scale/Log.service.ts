import { ScaleService, Step } from './types';

export type LogScale = {
  minValue: number;
  maxValue: number;
  ratio?: number;
}

export class LogScaleService implements ScaleService {

  private MIN_STEPS_RANGE_PX = 30;

  get minValue(): number {
    return this.scale.minValue;
  }

  get maxValue(): number {
    return this.scale.maxValue;
  }

  get ratio(): number {
    return this.scale.ratio ?? 1;
  }

  get logMin(): number {
    return Math.log10(Math.max(this.scale.minValue, 1));
  }

  get logMax(): number {
    return Math.log10(this.scale.maxValue);
  }

  get logRange(): number {
    return this.logMax - this.logMin;
  }

  public get height(): number {
    return this.pixelSize;
  }

  constructor(private pixelSize: number,
              public scale: LogScale,
              private options: {
                pixelOffset: number;
                revert: boolean;
              } = {
                pixelOffset: 0,
                revert: false,
              }) {
    if (scale.minValue <= 0) {
      this.scale = { ...scale, minValue: 1 }; // Log scale needs positive values
    }
    if (scale.minValue > scale.maxValue) {
      throw `Incorrect scale range: min=${scale.minValue} and max=${scale.maxValue}`;
    }
  }

  valueToPosition(value: number): number {
    if (value <= 0) value = this.scale.minValue;
    const logValue = Math.log10(value);
    let position = this.options.pixelOffset +
      ((logValue - this.logMin) / this.logRange) * this.pixelSize;
    if (this.options.revert) position = this.pixelSize - position;
    if (position > this.pixelSize) position = this.pixelSize;
    if (position < 0) position = 0;
    return position;
  }

  valuesToPositionRange(min: number, max: number): number {
    return Math.abs(this.valueToPosition(max) - this.valueToPosition(min));
  }

  positionToValue(position: number): number {
    if (position < 0) position = 0;
    if (this.options.revert) position = this.pixelSize - position;
    const logValue = this.logMin +
      ((position - this.options.pixelOffset) / this.pixelSize) * this.logRange;
    return Math.pow(10, logValue);
  }

  positionsToRange(min: number, max: number): number {
    return Math.abs(this.positionToValue(max) - this.positionToValue(min));
  }

  getSteps(): Array<Step> {
    const array = new Array<Step>();

    // Generate steps at powers of 10 and intermediate values
    const minPower = Math.floor(Math.log10(Math.max(this.scale.minValue, 1)));
    const maxPower = Math.ceil(Math.log10(this.scale.maxValue));

    for (let power = minPower; power <= maxPower; power++) {
      const baseValue = Math.pow(10, power);

      // Add main power of 10
      if (baseValue >= this.scale.minValue && baseValue <= this.scale.maxValue) {
        const position = this.options.pixelOffset + Math.floor(this.valueToPosition(baseValue));
        array.push({ position, value: baseValue, size: 'regular' });
      }

      // Add intermediate values (2, 5) if there's enough space
      const intermediates = [2, 5];
      for (const mult of intermediates) {
        const value = baseValue * mult;
        if (value >= this.scale.minValue && value <= this.scale.maxValue) {
          const position = this.options.pixelOffset + Math.floor(this.valueToPosition(value));

          // Check if there's enough space from previous step
          const prevStep = array[array.length - 1];
          if (!prevStep || Math.abs(position - prevStep.position) >= this.MIN_STEPS_RANGE_PX) {
            array.push({ position, value, size: 'small' });
          }
        }
      }
    }

    // Ensure min and max are included
    if (!array.some(s => s.value === this.scale.minValue)) {
      array.unshift({
        position: this.options.pixelOffset + Math.floor(this.valueToPosition(this.scale.minValue)),
        value: this.scale.minValue,
        size: 'regular',
      });
    }
    if (!array.some(s => s.value === this.scale.maxValue)) {
      array.push({
        position: this.options.pixelOffset + Math.floor(this.valueToPosition(this.scale.maxValue)),
        value: this.scale.maxValue,
        size: 'regular',
      });
    }

    return array;
  }

  isRangeContinuouslyOnScale(min: number, max: number): boolean {
    return min >= this.scale.minValue && max >= this.scale.minValue
      && min <= this.scale.maxValue && max <= this.scale.maxValue;
  }
}
