
import supabase from '../config/supabase.js';

const allowedTypes = new Set([
  'info',
  'success',
  'warning',
  'error'
]);

export const createNotification = async ({
  userId,
  title,
  message,
  type = 'info',
  metadata = {}
}) => {
  if (!userId || !title || !message) {
    throw new Error('User, title and message are required.');
  }

  if (!allowedTypes.has(type)) {
    throw new Error('Invalid notification type.');
  }

  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      title: String(title).slice(0, 150),
      message: String(message).slice(0, 2000),
      type,
      metadata,
      is_read: false
    })
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const getUserNotifications = async ({
  userId,
  limit = 20
}) => {
  if (!userId) {
    throw new Error('User ID is required.');
  }

  const pageSize = Math.min(100, Math.max(1, Number(limit) || 20));

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(pageSize);

  if (error) throw error;

  return data;
};

export const markNotificationRead = async ({
  notificationId,
  userId
}) => {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const notifyOrderStatus = async ({
  customerId,
  orderId,
  status
}) => {
  const messages = {
    confirmed: 'Your payment has been confirmed and your order is being processed.',
    artwork: 'Your artwork is being prepared.',
    proof: 'Your proof is ready for review.',
    production: 'Your order has entered production.',
    completed: 'Your order has been completed.',
    cancelled: 'Your order has been cancelled.'
  };

  const message = messages[status];

  if (!message) {
    throw new Error('Unsupported order notification status.');
  }

  return createNotification({
    userId: customerId,
    title: 'Order update',
    message,
    type: status === 'cancelled' ? 'warning' : 'info',
    metadata: {
      orderId,
      status
    }
  });
};

export default {
  createNotification,
  getUserNotifications,
  markNotificationRead,
  notifyOrderStatus
};
