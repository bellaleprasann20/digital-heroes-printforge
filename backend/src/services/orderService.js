
import supabase from '../config/supabase.js';

export const createOrderFromQuote = async ({
  customerId,
  quoteId,
  billingDetails
}) => {
  if (!customerId || !quoteId || !billingDetails) {
    throw new Error('Customer, quote and billing details are required.');
  }

  const { data: quote, error: quoteError } = await supabase
    .from('pricing_quotes')
    .select('*')
    .eq('id', quoteId)
    .eq('customer_id', customerId)
    .single();

  if (quoteError || !quote) {
    throw new Error('Valid pricing quote not found.');
  }

  if (quote.status !== 'valid') {
    throw new Error('This pricing quote is no longer valid.');
  }

  if (
    quote.expires_at &&
    new Date(quote.expires_at).getTime() <= Date.now()
  ) {
    throw new Error('This pricing quote has expired.');
  }

  const quoteData = quote.quote_data;

  if (
    !quoteData ||
    !Number.isFinite(Number(quoteData.total)) ||
    Number(quoteData.total) <= 0
  ) {
    throw new Error('Invalid quote data.');
  }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_id: customerId,
      quote_id: quoteId,
      status: 'pending',
      payment_status: 'unpaid',
      currency: quoteData.currency || 'INR',
      subtotal: quoteData.subtotal,
      discount: quoteData.discount,
      tax_amount: quoteData.tax,
      total_amount: quoteData.total,
      billing_details: billingDetails
    })
    .select()
    .single();

  if (orderError) throw orderError;

  const item = {
    order_id: order.id,
    product_id: quoteData.productId,
    product_name: quoteData.productName,
    quantity: quoteData.quantity,
    unit_price: quoteData.unitPrice,
    total_price: quoteData.total,
    configuration: {
      material: quoteData.material,
      dimensions: quoteData.dimensions,
      discountRate: quoteData.discountRate
    }
  };

  const { error: itemError } = await supabase
    .from('order_items')
    .insert(item);

  if (itemError) {
    // Do not leave an order without its item.
    await supabase
      .from('orders')
      .delete()
      .eq('id', order.id)
      .eq('customer_id', customerId);

    throw itemError;
  }

  const { error: quoteUpdateError } = await supabase
    .from('pricing_quotes')
    .update({ status: 'used' })
    .eq('id', quoteId)
    .eq('customer_id', customerId)
    .eq('status', 'valid');

  if (quoteUpdateError) {
    throw quoteUpdateError;
  }

  return order;
};

export const getCustomerOrders = async (customerId) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data;
};

export const getOrderForCustomer = async (orderId, customerId) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', orderId)
    .eq('customer_id', customerId)
    .single();

  if (error) throw error;

  return data;
};

export default {
  createOrderFromQuote,
  getCustomerOrders,
  getOrderForCustomer
};
