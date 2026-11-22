
import supabase from '../config/supabase.js';

export const getProfile = async (req, res) => {
  try {
    const { data, error } = await supabase.auth.admin.getUserById(
      req.user.id
    );

    if (error) throw error;

    return res.json({
      success: true,
      user: data.user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, phone } = req.body;

    const { data, error } = await supabase.auth.admin.updateUserById(
      req.user.id,
      {
        user_metadata: {
          ...req.user.user_metadata,
          ...(fullName !== undefined && { full_name: fullName }),
          ...(phone !== undefined && { phone })
        }
      }
    );

    if (error) throw error;

    return res.json({
      success: true,
      user: data.user
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const { data, error } = await supabase.auth.admin.listUsers({
      page: Number(req.query.page) || 1,
      perPage: Math.min(100, Number(req.query.limit) || 20)
    });

    if (error) throw error;

    const customers = data.users.filter(
      (user) => user.app_metadata?.role !== 'admin'
    );

    return res.json({
      success: true,
      customers,
      total: data.total
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateCustomerRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role.'
      });
    }

    if (req.params.userId === req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You cannot change your own role.'
      });
    }

    const { data, error } = await supabase.auth.admin.updateUserById(
      req.params.userId,
      {
        app_metadata: { role }
      }
    );

    if (error) throw error;

    return res.json({
      success: true,
      user: data.user
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
