
import supabase from '../config/supabase.js';

export const calculateQuote = async (req, res) => {
  try {
    const {
      productId,
      width,
      height,
      quantity,
      material
    } = req.body;

    if (!productId || !Number.isFinite(Number(quantity)) || Number(quantity) < 1) {
      return res.status(400).json({
        success: false,
        message: 'Product and a valid quantity are required.'
      });
    }

    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .eq('is_active', true)
      .single();

    if (error || !product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    const w = Number(width);
    const h = Number(height);
    const qty = Math.floor(Number(quantity));

    if (
      (width !== undefined && (!Number.isFinite(w) || w <= 0)) ||
      (height !== undefined && (!Number.isFinite(h) || h <= 0))
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid dimensions.'
      });
    }

    const basePrice = Number(product.base_price);

    if (!Number.isFinite(basePrice) || basePrice < 0) {
      throw new Error('Product pricing configuration is invalid.');
    }

    const areaMultiplier = width && height ? (w * h) / 10000 : 1;

    const materialOption = (product.materials || []).find(
      (item) => item.name === material
    );

    if (material && !materialOption) {
      return res.status(400).json({
        success: false,
        message: 'Selected material is not available.'
      });
    }

    const materialMultiplier = Number(materialOption?.priceMultiplier ?? 1);

    if (!Number.isFinite(materialMultiplier) || materialMultiplier < 0) {
      throw new Error('Invalid material pricing configuration.');
    }

    const unitPrice = basePrice * areaMultiplier * materialMultiplier;

    const discounts = product.volume_discounts || [];

    const applicableDiscount = discounts
      .filter((item) => qty >= Number(item.minQuantity))
      .sort((a, b) => Number(b.minQuantity) - Number(a.minQuantity))[0];

    const discountRate = Math.min(
      100,
      Math.max(0, Number(applicableDiscount?.discountPercent || 0))
    );

    const subtotal = unitPrice * qty;
    const discount = subtotal * discountRate / 100;
    const taxableAmount = subtotal - discount;

    const vatRate = Number(product.tax_rate ?? 18);

    if (!Number.isFinite(vatRate) || vatRate < 0 || vatRate > 100) {
      throw new Error('Invalid product tax configuration.');
    }

    const tax = taxableAmount * vatRate / 100;
    const total = taxableAmount + tax;

    return res.json({
      success: true,
      quote: {
        currency: 'INR',
        quantity: qty,
        unitPrice: Number(unitPrice.toFixed(2)),
        subtotal: Number(subtotal.toFixed(2)),
        discount: Number(discount.toFixed(2)),
        discountRate,
        taxableAmount: Number(taxableAmount.toFixed(2)),
        tax: Number(tax.toFixed(2)),
        taxRate: vatRate,
        total: Number(total.toFixed(2)),
        material: material || null,
        dimensions: width && height ? { width: w, height: h } : null
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const validateQuote = async (req, res) => {
  try {
    const { quoteId } = req.body;

    if (!quoteId) {
      return res.status(400).json({
        success: false,
        message: 'Quote ID is required.'
      });
    }

    // Quote persistence and expiry validation will be added
    // when the pricing_quotes table is defined.
    return res.status(501).json({
      success: false,
      message: 'Persistent quote validation is not configured yet.'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
