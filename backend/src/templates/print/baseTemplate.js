
const DEFAULT_PRINT_SETTINGS = Object.freeze({
  unit: 'mm',
  dpi: 300,
  bleed: 3,
  safeMargin: 3,
  background: '#FFFFFF',
  outputFormats: ['pdf', 'png']
});

const DEFAULT_PLACEHOLDER = Object.freeze({
  fontSize: 36,
  minFontSize: 8,
  maxFontSize: 48,
  fontWeight: 'bold',
  color: '#202020',
  align: 'center',
  tracking: 0,
  shrinkToFit: true
});

const PRODUCT_TEMPLATES = Object.freeze({
  labels_stickers: {
    name: 'Labels & Stickers',
    width: 100,
    height: 100,
    bleed: 3,
    safeMargin: 2
  },

  race_numbers: {
    name: 'Race & Event Numbers',
    width: 210,
    height: 148,
    bleed: 3,
    safeMargin: 5
  },

  mtb_boards: {
    name: 'MTB Boards',
    width: 250,
    height: 180,
    bleed: 3,
    safeMargin: 5
  },

  stamps: {
    name: 'Stamps',
    width: 50,
    height: 30,
    bleed: 1,
    safeMargin: 2
  },

  trophies: {
    name: 'Trophies',
    width: 100,
    height: 150,
    bleed: 0,
    safeMargin: 3
  },

  laser_cut: {
    name: 'Laser-cut Work',
    width: 100,
    height: 100,
    bleed: 0,
    safeMargin: 2
  }
});

export const createPrintTemplate = ({
  productType,
  width,
  height,
  dpi,
  bleed,
  safeMargin,
  background,
  outputFormats,
  placeholders = []
}) => {
  const product = PRODUCT_TEMPLATES[productType];

  if (!product) {
    throw new Error(`Unsupported product type: ${productType}`);
  }

  const template = {
    productType,
    productName: product.name,
    width: Number(width ?? product.width),
    height: Number(height ?? product.height),
    ...DEFAULT_PRINT_SETTINGS,
    dpi: Number(dpi ?? DEFAULT_PRINT_SETTINGS.dpi),
    bleed: Number(bleed ?? product.bleed),
    safeMargin: Number(safeMargin ?? product.safeMargin),
    background: background ?? DEFAULT_PRINT_SETTINGS.background,
    outputFormats: outputFormats ?? DEFAULT_PRINT_SETTINGS.outputFormats,
    placeholders: placeholders.map((placeholder) => ({
      ...DEFAULT_PLACEHOLDER,
      ...placeholder
    }))
  };

  if (
    !Number.isFinite(template.width) ||
    !Number.isFinite(template.height) ||
    template.width <= 0 ||
    template.height <= 0
  ) {
    throw new Error('Print template dimensions must be positive numbers.');
  }

  if (
    !Number.isFinite(template.dpi) ||
    template.dpi < 72 ||
    template.dpi > 1200
  ) {
    throw new Error('Print resolution must be between 72 and 1200 DPI.');
  }

  if (
    !Number.isFinite(template.bleed) ||
    template.bleed < 0 ||
    !Number.isFinite(template.safeMargin) ||
    template.safeMargin < 0
  ) {
    throw new Error('Bleed and safe margin cannot be negative.');
  }

  const allowedFormats = ['pdf', 'png'];

  if (
    !Array.isArray(template.outputFormats) ||
    template.outputFormats.length === 0 ||
    template.outputFormats.some(
      (format) => !allowedFormats.includes(format)
    )
  ) {
    throw new Error('Output formats must contain PDF, PNG, or both.');
  }

  return template;
};

export const getDefaultPrintTemplate = (productType) => {
  const product = PRODUCT_TEMPLATES[productType];

  if (!product) {
    throw new Error(`Unsupported product type: ${productType}`);
  }

  return createPrintTemplate({ productType });
};

export {
  DEFAULT_PRINT_SETTINGS,
  DEFAULT_PLACEHOLDER,
  PRODUCT_TEMPLATES
};

export default createPrintTemplate;
