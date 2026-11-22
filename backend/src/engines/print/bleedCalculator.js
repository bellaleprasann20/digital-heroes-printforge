
const MM_PER_INCH = 25.4;

const toPositiveNumber = (value, name, allowZero = false) => {
  const number = Number(value);

  if (
    !Number.isFinite(number) ||
    (allowZero ? number < 0 : number <= 0)
  ) {
    throw new Error(`${name} must be ${allowZero ? 'zero or positive' : 'positive'}.`);
  }

  return number;
};

export const mmToPixels = (mm, dpi = 300) => {
  const dimension = toPositiveNumber(mm, 'Millimetres');
  const resolution = toPositiveNumber(dpi, 'DPI');

  return Math.ceil((dimension / MM_PER_INCH) * resolution);
};

export const mmToPoints = (mm) => {
  const dimension = toPositiveNumber(mm, 'Millimetres');
  return (dimension / MM_PER_INCH) * 72;
};

export const calculateBleed = ({
  width,
  height,
  bleed = 3,
  dpi = 300
}) => {
  const trimWidth = toPositiveNumber(width, 'Width');
  const trimHeight = toPositiveNumber(height, 'Height');
  const bleedSize = toPositiveNumber(bleed, 'Bleed', true);
  const resolution = toPositiveNumber(dpi, 'DPI');

  const totalWidth = trimWidth + bleedSize * 2;
  const totalHeight = trimHeight + bleedSize * 2;

  return {
    unit: 'mm',
    dpi: resolution,
    bleed: bleedSize,
    trim: {
      width: trimWidth,
      height: trimHeight
    },
    document: {
      width: totalWidth,
      height: totalHeight
    },
    pixels: {
      width: mmToPixels(totalWidth, resolution),
      height: mmToPixels(totalHeight, resolution)
    },
    points: {
      width: mmToPoints(totalWidth),
      height: mmToPoints(totalHeight)
    },
    trimOffset: {
      x: mmToPoints(bleedSize),
      y: mmToPoints(bleedSize)
    }
  };
};

export default calculateBleed;
