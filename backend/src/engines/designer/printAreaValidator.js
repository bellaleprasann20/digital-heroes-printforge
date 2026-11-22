
const DEFAULT_TOLERANCE_MM = 0.1;

const toNumber = (value, field) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    throw new Error(`${field} must be a valid number.`);
  }

  return number;
};

const validateRectangle = (rectangle, fieldName) => {
  if (!rectangle || typeof rectangle !== 'object') {
    throw new Error(`${fieldName} is required.`);
  }

  const x = toNumber(rectangle.x, `${fieldName}.x`);
  const y = toNumber(rectangle.y, `${fieldName}.y`);
  const width = toNumber(rectangle.width, `${fieldName}.width`);
  const height = toNumber(rectangle.height, `${fieldName}.height`);

  if (width <= 0 || height <= 0) {
    throw new Error(`${fieldName} must have positive dimensions.`);
  }

  if (x < 0 || y < 0) {
    throw new Error(`${fieldName} cannot start outside the canvas.`);
  }

  return { x, y, width, height };
};

const isInside = (inner, outer, tolerance = 0) => {
  return (
    inner.x >= outer.x - tolerance &&
    inner.y >= outer.y - tolerance &&
    inner.x + inner.width <= outer.x + outer.width + tolerance &&
    inner.y + inner.height <= outer.y + outer.height + tolerance
  );
};

const intersection = (a, b) => {
  const left = Math.max(a.x, b.x);
  const top = Math.max(a.y, b.y);
  const right = Math.min(
    a.x + a.width,
    b.x + b.width
  );
  const bottom = Math.min(
    a.y + a.height,
    b.y + b.height
  );

  return {
    x: left,
    y: top,
    width: Math.max(0, right - left),
    height: Math.max(0, bottom - top)
  };
};

export const validatePrintArea = ({
  canvas,
  printableArea,
  artworkBounds,
  bleed = 0,
  safeMargin = 0,
  tolerance = DEFAULT_TOLERANCE_MM
}) => {
  const canvasRect = validateRectangle(
    {
      x: 0,
      y: 0,
      width: canvas?.width,
      height: canvas?.height
    },
    'Canvas'
  );

  const printableRect = validateRectangle(
    printableArea,
    'Printable area'
  );

  const artworkRect = validateRectangle(
    artworkBounds,
    'Artwork bounds'
  );

  const bleedValue = toNumber(bleed, 'Bleed');
  const safeMarginValue = toNumber(safeMargin, 'Safe margin');
  const toleranceValue = toNumber(tolerance, 'Tolerance');

  if (
    bleedValue < 0 ||
    safeMarginValue < 0 ||
    toleranceValue < 0
  ) {
    throw new Error('Bleed, safe margin and tolerance cannot be negative.');
  }

  if (!isInside(printableRect, canvasRect)) {
    throw new Error('Printable area extends beyond the canvas.');
  }

  const bleedArea = {
    x: printableRect.x - bleedValue,
    y: printableRect.y - bleedValue,
    width: printableRect.width + bleedValue * 2,
    height: printableRect.height + bleedValue * 2
  };

  if (!isInside(bleedArea, canvasRect, toleranceValue)) {
    throw new Error('Required bleed area extends beyond the canvas.');
  }

  const safeArea = {
    x: printableRect.x + safeMarginValue,
    y: printableRect.y + safeMarginValue,
    width: printableRect.width - safeMarginValue * 2,
    height: printableRect.height - safeMarginValue * 2
  };

  if (safeArea.width <= 0 || safeArea.height <= 0) {
    throw new Error('Safe margin is too large for the printable area.');
  }

  const artworkInsideCanvas = isInside(
    artworkRect,
    canvasRect,
    toleranceValue
  );

  const artworkInsideBleed = isInside(
    artworkRect,
    bleedArea,
    toleranceValue
  );

  const artworkInsideSafeArea = isInside(
    artworkRect,
    safeArea,
    toleranceValue
  );

  const visibleArtwork = intersection(
    artworkRect,
    canvasRect
  );

  const warnings = [];

  if (!artworkInsideCanvas) {
    warnings.push('Artwork extends outside the canvas.');
  }

  if (!artworkInsideBleed) {
    warnings.push('Artwork extends beyond the permitted bleed area.');
  }

  if (!artworkInsideSafeArea) {
    warnings.push('Artwork extends into the safe-margin region.');
  }

  return {
    valid: artworkInsideCanvas && artworkInsideBleed,
    artworkInsideCanvas,
    artworkInsideBleed,
    artworkInsideSafeArea,
    canvas: canvasRect,
    printableArea: printableRect,
    bleedArea,
    safeArea,
    artworkBounds: artworkRect,
    visibleArtwork,
    warnings
  };
};

export default validatePrintArea;
