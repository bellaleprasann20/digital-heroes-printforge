
import fontkit from 'fontkit';

const fontCache = new Map();

const loadFont = (fontPath) => {
  if (!fontPath) {
    throw new Error('A font file path is required for accurate text fitting.');
  }

  if (!fontCache.has(fontPath)) {
    fontCache.set(fontPath, fontkit.openSync(fontPath));
  }

  return fontCache.get(fontPath);
};

const measureText = (font, text, fontSize, tracking = 0) => {
  const layout = font.layout(text);
  const unitsPerEm = font.unitsPerEm;

  const glyphWidth = layout.positions.reduce(
    (total, position) => total + position.xAdvance,
    0
  );

  const trackingWidth = Math.max(0, text.length - 1) * tracking;

  return (glyphWidth / unitsPerEm) * fontSize + trackingWidth;
};

export const fitText = ({
  text,
  fontPath,
  maxWidth,
  maxFontSize = 48,
  minFontSize = 8,
  tracking = 0,
  shrinkToFit = true
}) => {
  const content = String(text ?? '');

  if (!content.trim()) {
    throw new Error('Text content cannot be empty.');
  }

  const width = Number(maxWidth);
  const maximum = Number(maxFontSize);
  const minimum = Number(minFontSize);
  const letterSpacing = Number(tracking);

  if (
    !Number.isFinite(width) ||
    width <= 0 ||
    !Number.isFinite(maximum) ||
    !Number.isFinite(minimum) ||
    minimum <= 0 ||
    maximum < minimum ||
    !Number.isFinite(letterSpacing) ||
    letterSpacing < 0
  ) {
    throw new Error('Invalid text-fitting dimensions or font settings.');
  }

  const font = loadFont(fontPath);

  const maxWidthAtMaximum = measureText(
    font,
    content,
    maximum,
    letterSpacing
  );

  if (maxWidthAtMaximum <= width) {
    return {
      text: content,
      fontSize: maximum,
      measuredWidth: maxWidthAtMaximum,
      fitted: true,
      reduced: false
    };
  }

  if (!shrinkToFit) {
    return {
      text: content,
      fontSize: maximum,
      measuredWidth: maxWidthAtMaximum,
      fitted: false,
      reduced: false
    };
  }

  const minWidth = measureText(
    font,
    content,
    minimum,
    letterSpacing
  );

  if (minWidth > width) {
    return {
      text: content,
      fontSize: minimum,
      measuredWidth: minWidth,
      fitted: false,
      reduced: true,
      reason: 'Text cannot fit within the available width at minimum font size.'
    };
  }

  let low = minimum;
  let high = maximum;
  let best = minimum;

  for (let iteration = 0; iteration < 30; iteration += 1) {
    const candidate = (low + high) / 2;

    const candidateWidth = measureText(
      font,
      content,
      candidate,
      letterSpacing
    );

    if (candidateWidth <= width) {
      best = candidate;
      low = candidate;
    } else {
      high = candidate;
    }
  }

  const finalWidth = measureText(
    font,
    content,
    best,
    letterSpacing
  );

  return {
    text: content,
    fontSize: best,
    measuredWidth: finalWidth,
    fitted: finalWidth <= width,
    reduced: true
  };
};

export default fitText;
