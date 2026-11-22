
const roundMoney = (value) =>
  Math.round((value + Number.EPSILON) * 100) / 100;

const toPositiveNumber = (value, fieldName) => {
  const number = Number(value);

  if (!Number.isFinite(number) || number <= 0) {
    throw new Error(`${fieldName} must be a positive number.`);
  }

  return number;
};

export const calculatePrice = ({
  product,
  width,
  height,
  quantity,
  material,
  currency = 'INR'
}) => {
  if (!product || product.is_active === false) {
    throw new Error('A valid active product is required.');
  }

  const qty = Math.floor(toPositiveNumber(quantity, 'Quantity'));

  const minimumQuantity = Number(product.min_quantity || 1);
  const maximumQuantity = Number(product.max_quantity || 100000);

  if (qty < minimumQuantity || qty > maximumQuantity) {
    throw new Error(
      `Quantity must be between ${minimumQuantity} and ${maximumQuantity}.`
    );
  }

  const basePrice = Number(product.base_price);

  if (!Number.isFinite(basePrice) || basePrice < 0) {
    throw new Error('Product base price is not configured correctly.');
  }

  let areaMultiplier = 1;
  let dimensions = null;

  if (width !== undefined || height !== undefined) {
    const w = toPositiveNumber(width, 'Width');
    const h = toPositiveNumber(height, 'Height');

    const minWidth = Number(product.min_width || 0);
    const maxWidth = Number(product.max_width || Infinity);
    const minHeight = Number(product.min_height || 0);
    const maxHeight = Number(product.max_height || Infinity);

    if (
      w < minWidth ||
      w > maxWidth ||
      h < minHeight ||
      h > maxHeight
    ) {
      throw new Error('Selected dimensions are outside the product limits.');
    }

    const areaUnit = product.area_unit || 'cm';

    if (areaUnit === 'mm') {
      areaMultiplier = (w * h) / 1000000;
    } else if (areaUnit === 'cm') {
      areaMultiplier = (w * h) / 100;
    } else if (areaUnit === 'm') {
      areaMultiplier = w * h;
    } else {
      throw new Error('Unsupported product area unit.');
    }

    dimensions = { width: w, height: h, unit: areaUnit };
  }

  const materials = Array.isArray(product.materials)
    ? product.materials
    : [];

  let selectedMaterial = null;
  let materialMultiplier = 1;

  if (material) {
    selectedMaterial = materials.find(
      (item) => item.name === material || item.id === material
    );

    if (!selectedMaterial) {
      throw new Error('Selected material is not available.');
    }

    materialMultiplier = Number(
      selectedMaterial.priceMultiplier ?? 1
    );

    if (
      !Number.isFinite(materialMultiplier) ||
      materialMultiplier < 0
    ) {
      throw new Error('Invalid material pricing configuration.');
    }
  }

  const unitPrice = basePrice * areaMultiplier * materialMultiplier;
  const subtotal = unitPrice * qty;

  const discounts = Array.isArray(product.volume_discounts)
    ? product.volume_discounts
    : [];

  const applicableDiscount = discounts
    .filter((item) => qty >= Number(item.minQuantity))
    .sort(
      (a, b) =>
        Number(b.minQuantity) - Number(a.minQuantity)
    )[0];

  const discountRate = Math.min(
    100,
    Math.max(0, Number(applicableDiscount?.discountPercent || 0))
  );

  const discount = subtotal * discountRate / 100;
  const taxableAmount = subtotal - discount;

  const taxRate = Number(product.tax_rate ?? 18);

  if (!Number.isFinite(taxRate) || taxRate < 0 || taxRate > 100) {
    throw new Error('Invalid tax configuration.');
  }

  const tax = taxableAmount * taxRate / 100;
  const total = taxableAmount + tax;

  return {
    currency,
    productId: product.id,
    productName: product.name,
    quantity: qty,
    material: selectedMaterial?.name || null,
    dimensions,
    unitPrice: roundMoney(unitPrice),
    subtotal: roundMoney(subtotal),
    discountRate,
    discount: roundMoney(discount),
    taxableAmount: roundMoney(taxableAmount),
    taxRate,
    tax: roundMoney(tax),
    total: roundMoney(total)
  };
};

export default calculatePrice;
