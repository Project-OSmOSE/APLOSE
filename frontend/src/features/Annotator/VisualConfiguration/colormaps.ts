import { Colormap, COLORMAPS } from '@/features/Colormap';

type ColorStep = {
  index: number;
  rgb: number[];
}

export function createColormap(spec: {
  colormap?: Colormap | ColorStep[];
  nshades?: number;
  alpha?: number;
}): number[][] {
  /*
   * Default Options
   */
  let fromrgba: number[],
    torgba: number[],
    nsteps: number,
    cmap: ColorStep[],
    colormap: Colormap | ColorStep[] | undefined,
    alpha: number | number[],
    i;

  if (!spec) spec = {};

  const nshades = (spec.nshades || 72) - 1;

  colormap = spec.colormap;
  if (!colormap) colormap = 'Greys';

  if (typeof colormap === 'string') {
    if (!COLORMAPS[colormap]) {
      throw Error(colormap + ' not a supported colorscale');
    }

    cmap = COLORMAPS[colormap];

  } else if (Array.isArray(colormap)) {
    cmap = colormap.slice();

  } else {
    throw Error('unsupported colormap option' + colormap);
  }

  if (cmap.length > nshades + 1) {
    throw new Error(
      colormap + ' map requires nshades to be at least size ' + cmap.length,
    );
  }

  if (!Array.isArray(spec.alpha)) {

    if (typeof spec.alpha === 'number') {
      alpha = [ spec.alpha, spec.alpha ];

    } else {
      alpha = [ 1, 1 ];
    }

  } else if (spec.alpha.length !== 2) {
    alpha = [ 1, 1 ];

  } else {
    alpha = spec.alpha.slice();
  }

  // map index points from 0..1 to 0...n-1
  const indicies = cmap.map(function (c) {
    return Math.round(c.index * nshades);
  });

  // Add alpha channel to the map
  alpha[0] = Math.min(Math.max(alpha[0], 0), 1);
  alpha[1] = Math.min(Math.max(alpha[1], 0), 1);

  const steps = cmap.map(function (_, i) {
    const index = cmap[i].index

    const rgba = cmap[i].rgb.slice();

    // if user supplies their own map use it
    if (rgba.length === 4 && rgba[3] >= 0 && rgba[3] <= 1) {
      return rgba
    }
    rgba[3] = (alpha as number[])[0] + ((alpha as number[])[1] - (alpha as number[])[0]) * index;

    return rgba
  });

  /*
   * map increasing linear values between indicies to
   * linear steps in colorvalues
   */
  const colors: number[][] = [];
  for (i = 0; i < indicies.length - 1; ++i) {
    nsteps = indicies[i + 1] - indicies[i];
    fromrgba = steps[i];
    torgba = steps[i + 1];

    for (let j = 0; j < nsteps; j++) {
      const amt = j / nsteps;
      colors.push([
        Math.round(linearInterpolation(fromrgba[0], torgba[0], amt)),
        Math.round(linearInterpolation(fromrgba[1], torgba[1], amt)),
        Math.round(linearInterpolation(fromrgba[2], torgba[2], amt)),
        linearInterpolation(fromrgba[3], torgba[3], amt),
      ])
    }
  }

  //add 1 step as last value
  colors.push(cmap[cmap.length - 1].rgb.concat(alpha[1]))

  return colors;
}

function linearInterpolation(v0: number, v1: number, t: number): number {
  return v0 * (1 - t) + v1 * t;
}
