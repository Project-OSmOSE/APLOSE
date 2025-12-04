import { ScaleService, Step } from "./types";
import { LinearScale, LinearScaleService } from "./Linear.service";


export class MultiScaleService implements ScaleService {

  get minValue(): number {
    return Math.min(...this.innerScales.map(s => s.minValue));
  }

  get maxValue(): number {
    return Math.max(...this.innerScales.map(s => s.maxValue));
  }

  get ratio(): number {
    return Math.max(...this.innerScales.map(s => s.ratio));
  }

  private innerScales: Array<LinearScaleService> = [];

  constructor(private pixelSize: number,
              innerScales: LinearScale[],
              private options: {
                disableValueFloats: boolean;
                revert: boolean;
              } = {
                disableValueFloats: false,
                revert: false
              }) {
    let previousRatio = 0
    const data = [ ...innerScales ].sort((a, b) => a.ratio - b.ratio)
    for (const scale of data) {
      // Go through scale with ascending ratio (since ratio correspond to the scale max frequency position)
      if (innerScales.some((otherScale: LinearScale) => otherScale.minValue < scale.minValue && otherScale.maxValue > scale.minValue))
        throw new Error('Given scales are conflicting!')
      if (innerScales.some((otherScale: LinearScale) => otherScale.minValue < scale.maxValue && otherScale.maxValue > scale.maxValue))
        throw new Error('Given scales are conflicting!')
      if (scale.ratio === 0)
        throw new Error('Cannot have a ratio of 0!')

      this.innerScales.push(
        new LinearScaleService(
          pixelSize * (scale.ratio - previousRatio),
          scale,
          {
            ...options,
            pixelOffset: pixelSize * previousRatio,
            revert: false
          }
        )
      )
      previousRatio = scale.ratio;
    }
  }

  valueToPosition(value: number): number {
    const scale = this.getScaleForValue(value)!;
    let position = scale.valueToPosition(value) + this.getPreviousScalesHeight(scale.scale);
    if (this.options.revert) position = this.pixelSize - position;
    return position
  }

  valuesToPositionRange(min: number, max: number): number {
    return Math.abs(this.valueToPosition(min) - this.valueToPosition(max))
  }

  positionToValue(position: number): number {
    if (position < 0) position = 0;
    if (this.options.revert) position = this.pixelSize - position;
    const scale = this.getScaleForPosition(position);
    return scale.positionToValue(position - this.getPreviousScalesHeight(scale.scale));
  }

  positionsToRange(min: number, max: number): number {
    return Math.abs(this.positionToValue(min) - this.positionToValue(max))
  }

  getSteps(): Array<Step> {
    const array = new Array<Step>()
    for (const scale of this.innerScales.sort(s => s.scale.ratio)) {
      const scaleSteps = scale.getSteps();

      for (const step of scaleSteps) {
        if (array.find(s => s.value === step.value)) continue;
        if (this.innerScales.some(s => s.scale.minValue === step.value || s.scale.maxValue === step.value))
          step.size = 'big'
        if (step.value === scale.scale.maxValue
          && this.innerScales.some(s => s.scale.minValue === scale.scale.maxValue)) {
          array.push({
            ...step,
            additionalValue: step.value,
            correspondingRatio: scale.scale.ratio
          })
          continue;
        }
        if (step.value === scale.scale.minValue
          && this.innerScales.some(s => s.scale.maxValue === scale.scale.minValue))
          continue;
        const existingPosition = array.find(s => s.position === step.position && s.correspondingRatio === step.correspondingRatio);
        if (existingPosition) {
          existingPosition.additionalValue = step.value;
        } else {
          array.push({
            ...step,
            correspondingRatio: scale.scale.ratio
          })
        }
      }
    }
    return array;
  }

  isRangeContinuouslyOnScale(min: number, max: number): boolean {
    const minScale = this.getScaleForValue(Math.min(min, max))?.scale;
    const maxScale = this.getScaleForValue(Math.max(min, max))?.scale;
    if (!minScale || !maxScale) return false; // Values are out of given scales

    // Check if range is over a void in the scale
    if (minScale.ratio === maxScale?.ratio) return true; // On same linear scale
    const scalesBetween = this.innerScales
      .map(s => s.scale)
      .filter(s => s.ratio >= minScale.ratio && s.ratio <= maxScale.ratio)
      .sort((a, b) => a.ratio - b.ratio);
    let previousMax = minScale.maxValue;
    for (const scale of scalesBetween) {
      if (scale.maxValue === previousMax) continue;
      if (scale.minValue !== previousMax) return false;
      previousMax = scale.maxValue;
    }
    return true;
  }

  private getScaleForValue(value: number, force: boolean = true): LinearScaleService | undefined {
    // Scale including value
    let correspondingScale = this.innerScales.find(s => s.scale.minValue <= value && s.scale.maxValue >= value);

    if (!correspondingScale && force) {
      // Search out of the scale
      const absoluteMin = Math.min(...this.innerScales.map(s => s.scale.minValue))
      const absoluteMax = Math.max(...this.innerScales.map(s => s.scale.maxValue))
      if (value < absoluteMin) {
        correspondingScale = this.innerScales.find(s => s.scale.minValue === absoluteMin);
      } else if (value > absoluteMax)
        correspondingScale = this.innerScales.find(s => s.scale.maxValue === absoluteMax);
      else {
        // Value between 2 scales
        const directUp = Math.min(...this.innerScales.filter(s => s.scale.minValue > value).map(s => s.scale.minValue))
        correspondingScale = this.innerScales.find(s => s.scale.minValue === directUp);
      }
    }

    return correspondingScale;
  }

  private getScaleForPosition(position: number): LinearScaleService {
    const ratio = position / this.pixelSize;
    const minUpperRatio = Math.min(...this.innerScales.filter(s => s.ratio >= ratio).map(s => s.ratio))
    return this.innerScales.find(s => s.ratio === minUpperRatio)!;
  }

  private getPreviousScalesHeight(scale: LinearScale): number {
    return this.innerScales.filter(s => s.scale.ratio < scale.ratio)
      .reduce((total, s) => s.height + total, 0)
  }
}