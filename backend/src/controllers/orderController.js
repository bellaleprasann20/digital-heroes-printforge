
import supabase from '../config/supabase.js';

// --------------------------------------------------
// Helpers
// --------------------------------------------------

const roundMoney = (value) => Number(Number(value).toFixed(2));

const getObject = (value) =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? value
    : null;

const getMaterialOption = (materials, selectedMaterial) => {
  if (!selectedMaterial) return null;

  return (Array.isArray(materials) ? materials : []).find((material) => {
    if (typeof material === 'string') {
      return material === selectedMaterial;
    }

    return (
      material.name === selectedMaterial ||
      material.value === selectedMaterial ||
      material.label === selectedMaterial
    );
  });
};

const normalizeDimensionUnit = (unit) => {
  const normalized = String(unit || 'mm').toLowerCase();

  if (normalized === 'inch' || normalized === 'inches') {
    return 'in';
  }

  return normalized;
};

// --------------------------------------------------
// GET MY ORDERS
// --------------------------------------------------

export const getMyOrders = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('customer_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.json({
      success: true,
      orders: data || [],
    });
  } catch (error) {
    console.error('Get my orders error:', error);

    return res.status(500).json({
      success: false,
      message: error.message || 'Unable to retrieve orders.',
    });
  }
};

// --------------------------------------------------
// GET ALL ORDERS (ADMIN)
// --------------------------------------------------

export const getAllOrders = async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
      .range(0, 999);

    if (error) throw error;

    const customerIds = [
      ...new Set((orders || []).map((order) => order.customer_id).filter(Boolean))
    ];

    let customerMap = {};

    if (customerIds.length) {
      const { data: customers, error: customerError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', customerIds);

      if (customerError) throw customerError;

      customerMap = Object.fromEntries(
        (customers || []).map((customer) => [customer.id, customer])
      );
    }

    const formattedOrders = (orders || []).map((order) => {
      const customer = customerMap[order.customer_id] || {};

      return {
        ...order,
        orderNumber: order.order_number,
        customerName: customer.full_name || 'Customer',
        customerEmail: customer.email || '',
        customer: {
          name: customer.full_name || 'Customer',
          email: customer.email || ''
        },
        email: customer.email || '',
        paymentStatus: order.payment_status,
        totalAmount: order.total_amount,
        createdAt: order.created_at,
        items: order.order_items || []
      };
    });

    return res.json({
      success: true,
      orders: formattedOrders
    });
  } catch (error) {
    console.error('Get all orders error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve all orders.'
    });
  }
};
// --------------------------------------------------
// GET ORDER BY ID
// --------------------------------------------------

export const getOrderById = async (req, res) => {
  try {
    let query = supabase
      .from('orders')
      .select('*, order_items(*), proofs(*)')
      .eq('id', req.params.id);

    // Customers can only access their own orders.
    // Admins can access all orders.
    if (req.user.app_metadata?.role !== 'admin') {
      query = query.eq('customer_id', req.user.id);
    }

    const { data, error } = await query.single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    return res.json({
      success: true,
      order: data,
    });
  } catch (error) {
    console.error('Get order error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve order.',
    });
  }
};

// --------------------------------------------------
// CREATE ORDER
// --------------------------------------------------

export const createOrder = async (req, res) => {
  try {
    const {
      items,
      billing_details,
      shipping_details,
      billingAddress,
      shippingAddress,
      notes,
    } = req.body;

    const customerId = req.user?.id;

    if (!customerId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication is required.',
      });
    }

    // Validate cart
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty.',
      });
    }

    // Validate addresses
    const billing = getObject(billing_details || billingAddress);

    const shipping = getObject(
      shipping_details || shippingAddress || billing
    );

    if (!billing || !shipping) {
      return res.status(400).json({
        success: false,
        message: 'Valid billing and shipping addresses are required.',
      });
    }

    const orderItems = [];

    let subtotal = 0;
    let discountAmount = 0;
    let taxAmount = 0;
    let totalAmount = 0;
    let taxableAmount = 0;

    // Recalculate every item using database product data.
    for (const item of items) {
      const configuration = getObject(item?.configuration) || {};

      const productId =
        item?.productId ||
        item?.product_id ||
        item?.product?.id ||
        item?.product?._id ||
        item?.id;

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: 'An order item is missing its product ID.',
        });
      }

      const quantity = Number(
        item?.quantity ?? configuration.quantity ?? 1
      );

      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have a valid positive quantity.',
        });
      }

      // Fetch the active product from Supabase.
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .eq('is_active', true)
        .single();

      if (productError || !product) {
        return res.status(404).json({
          success: false,
          message: `Product not found or unavailable: ${productId}`,
        });
      }

      // Dimensions
      const width =
        configuration.width !== undefined &&
        configuration.width !== ''
          ? Number(configuration.width)
          : null;

      const height =
        configuration.height !== undefined &&
        configuration.height !== ''
          ? Number(configuration.height)
          : null;

      if (
        (width !== null && (!Number.isFinite(width) || width <= 0)) ||
        (height !== null && (!Number.isFinite(height) || height <= 0))
      ) {
        return res.status(400).json({
          success: false,
          message: `Invalid dimensions for ${product.name}.`,
        });
      }

      // Product dimension limits
      if (
        width !== null &&
        (
          (product.min_width != null &&
            width < Number(product.min_width)) ||
          (product.max_width != null &&
            width > Number(product.max_width))
        )
      ) {
        return res.status(400).json({
          success: false,
          message: `Width is outside the allowed range for ${product.name}.`,
        });
      }

      if (
        height !== null &&
        (
          (product.min_height != null &&
            height < Number(product.min_height)) ||
          (product.max_height != null &&
            height > Number(product.max_height))
        )
      ) {
        return res.status(400).json({
          success: false,
          message: `Height is outside the allowed range for ${product.name}.`,
        });
      }

      // Material validation
      const selectedMaterial = configuration.material || null;

      const materialOption = getMaterialOption(
        product.materials,
        selectedMaterial
      );

      if (selectedMaterial && !materialOption) {
        return res.status(400).json({
          success: false,
          message: `Selected material is unavailable for ${product.name}.`,
        });
      }

      // Base price validation
      const basePrice = Number(product.base_price);

      if (!Number.isFinite(basePrice) || basePrice < 0) {
        throw new Error(`Invalid base price for ${product.name}.`);
      }

      // Material multiplier
      const materialMultiplier = Number(
        materialOption?.priceMultiplier ??
        materialOption?.price_multiplier ??
        1
      );

      if (
        !Number.isFinite(materialMultiplier) ||
        materialMultiplier < 0
      ) {
        throw new Error(`Invalid material pricing for ${product.name}.`);
      }

      // Keep the same formula used by the current pricing controller.
      const areaMultiplier =
        width !== null && height !== null
          ? (width * height) / 10000
          : 1;

      const rawUnitPrice =
        basePrice * areaMultiplier * materialMultiplier;

      const unitPrice = roundMoney(rawUnitPrice);

      const itemSubtotal = roundMoney(
        rawUnitPrice * quantity
      );

      // Volume discount
      const discounts = Array.isArray(product.volume_discounts)
        ? product.volume_discounts
        : [];

      const applicableDiscount = discounts
        .filter(
          (discount) =>
            quantity >= Number(discount.minQuantity)
        )
        .sort(
          (a, b) =>
            Number(b.minQuantity) - Number(a.minQuantity)
        )[0];

      const discountRate = Math.min(
        100,
        Math.max(
          0,
          Number(applicableDiscount?.discountPercent || 0)
        )
      );

      const itemDiscount = roundMoney(
        itemSubtotal * discountRate / 100
      );

      const itemTaxableAmount = roundMoney(
        itemSubtotal - itemDiscount
      );

      // Tax
      const taxRate = Number(product.tax_rate ?? 18);

      if (
        !Number.isFinite(taxRate) ||
        taxRate < 0 ||
        taxRate > 100
      ) {
        throw new Error(
          `Invalid tax configuration for ${product.name}.`
        );
      }

      const itemTax = roundMoney(
        itemTaxableAmount * taxRate / 100
      );

      const lineTotal = roundMoney(
        itemTaxableAmount + itemTax
      );

      // Dimension unit
      const dimensionUnit = normalizeDimensionUnit(
        configuration.unit || product.dimension_unit || 'mm'
      );

      if (!['mm', 'cm', 'in'].includes(dimensionUnit)) {
        return res.status(400).json({
          success: false,
          message: `Invalid dimension unit for ${product.name}.`,
        });
      }

      // Accumulate order totals
      subtotal += itemSubtotal;
      discountAmount += itemDiscount;
      taxAmount += itemTax;
      taxableAmount += itemTaxableAmount;
      totalAmount += lineTotal;

      // Prepare database order item
      orderItems.push({
        product_id: product.id,
        product_name: product.name,
        product_slug: product.slug || null,
        quantity,
        width,
        height,
        dimension_unit: dimensionUnit,
        material: selectedMaterial,
        orientation: configuration.orientation || null,
        configuration,
        unit_price: unitPrice,
        discount_amount: itemDiscount,
        tax_amount: itemTax,
        line_total: lineTotal,
      });
    }

    // Final rounding
    subtotal = roundMoney(subtotal);
    discountAmount = roundMoney(discountAmount);
    taxAmount = roundMoney(taxAmount);
    totalAmount = roundMoney(totalAmount);
    taxableAmount = roundMoney(taxableAmount);

    // Store the weighted effective tax rate.
    const effectiveTaxRate =
      taxableAmount > 0
        ? roundMoney((taxAmount / taxableAmount) * 100)
        : 18;

    const orderPayload = {
      customer_id: customerId,
      subtotal,
      discount_amount: discountAmount,
      tax_rate: effectiveTaxRate,
      tax_amount: taxAmount,
      shipping_amount: 0,
      total_amount: totalAmount,
      currency: 'INR',
      billing_address: billing,
      shipping_address: shipping,
      customer_notes: notes?.trim() || null,
    };

    // Atomic transaction:
    // Creates the order and all order items together.
    const { data: order, error: orderError } = await supabase.rpc(
      'create_order_with_items',
      {
        p_order: orderPayload,
        p_items: orderItems,
      }
    );

    if (orderError) {
      console.error('Order creation RPC failed:', orderError);

      return res.status(500).json({
        success: false,
        message: 'Unable to create your order. Please try again.',
      });
    }

    if (!order?.id) {
      throw new Error('Order was created without a valid order ID.');
    }

    return res.status(201).json({
      success: true,
      message: 'Order created successfully.',
      order,
      orderId: order.id,
    });
  } catch (error) {
    console.error('Create order error:', error);

    return res.status(500).json({
      success: false,
      message: error.message || 'Unable to create order.',
    });
  }
};

// --------------------------------------------------
// CANCEL ORDER
// --------------------------------------------------

export const cancelOrder = async (req, res) => {
  try {
    const reason =
      typeof req.body?.reason === 'string'
        ? req.body.reason.trim()
        : null;

    // Your database uses order/quote as order statuses.
    // Payment status is stored separately as pending/paid/etc.
    const { data, error } = await supabase
      .from('orders')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        cancellation_reason: reason || null,
      })
      .eq('id', req.params.id)
      .eq('customer_id', req.user.id)
      .in('status', ['order', 'quote'])
      .eq('payment_status', 'pending')
      .select()
      .single();

    if (error || !data) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled or was not found.',
      });
    }

    return res.json({
      success: true,
      message: 'Order cancelled successfully.',
      order: data,
    });
  } catch (error) {
    console.error('Cancel order error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to cancel order.',
    });
  }
};

// --------------------------------------------------
// REORDER
// --------------------------------------------------

export const reorder = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', req.params.id)
      .eq('customer_id', req.user.id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: 'Previous order not found.',
      });
    }

    return res.json({
      success: true,
      message:
        'Previous order retrieved. Review its configuration before placing a new order.',
      previousOrder: data,
    });
  } catch (error) {
    console.error('Reorder error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve previous order.',
    });
  }
};
