
import { useEffect, useMemo, useState } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';

import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

import useProducts, { useProduct } from '../hooks/useProducts';
import usePricing from '../hooks/usePricing';

import orderService from '../services/orderService';
import paymentService from '../services/paymentService';
import designService from '../services/designService';
import proofService from '../services/proofService';

import MainLayout from '../components/layout/MainLayout';
import CustomerLayout from '../components/layout/CustomerLayout';
import AdminLayout from '../components/layout/AdminLayout';

import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

import Home from '../pages/public/Home';
import Cart from '../pages/public/Cart';
import Products from '../pages/public/Products';
import ProductDetails from '../pages/public/ProductDetails';
import Gallery from '../pages/public/Gallery';
import About from '../pages/public/About';
import Contact from '../pages/public/Contact';
import NotFound from '../pages/public/NotFound';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

import Checkout from '../pages/customer/Checkout';
import OrderSuccess from '../pages/customer/OrderSuccess';
import CustomerDashboard from '../pages/customer/CustomerDashboard';
import Profile from '../pages/customer/Profile';
import MyOrders from '../pages/customer/MyOrders';
import MyDesigns from '../pages/customer/MyDesigns';
import MyProofs from '../pages/customer/MyProofs';
import OrderDetails from '../pages/customer/OrderDetails';
import DesignEditor from '../pages/customer/DesignEditor';

// Admin pages
import ManageProducts from '../pages/admin/ManageProducts';
import ManageCategories from '../pages/admin/ManageCategories';
import ManageOrders from '../pages/admin/ManageOrders';
import ProofManagement from '../pages/admin/ProofManagement';
import ProductionQueue from '../pages/admin/ProductionQueue';
import ProductionDetails from '../pages/admin/ProductionDetails';
import Reports from '../pages/admin/Reports';
import Settings from '../pages/admin/Settings';

// --------------------------------------------------
// Constants
// --------------------------------------------------

const categoryMap = {
  'labels-stickers': 'labels_stickers',
  'race-numbers': 'race_numbers',
  'mtb-boards': 'mtb_boards',
  stamps: 'stamps',
  trophies: 'trophies',
  'laser-cut': 'laser_cut',
};

// --------------------------------------------------
// Razorpay script loader
// --------------------------------------------------

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true), {
        once: true,
      });

      existingScript.addEventListener('error', () => resolve(false), {
        once: true,
      });

      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

// --------------------------------------------------
// Normalizers
// --------------------------------------------------
const normalizeOrder = (order) => {
  const rawItems = Array.isArray(order.order_items)
    ? order.order_items
    : Array.isArray(order.items)
      ? order.items
      : [];

  const items = rawItems.map((item) => {
    const product = item.product || item.products || {};
    const quantity = Number(item.quantity) || 1;

    const unitPrice =
      Number(
        item.unit_price ??
        item.unitPrice ??
        item.price ??
        product.price
      ) || 0;

    const lineTotal =
      Number(
        item.line_total ??
        item.lineTotal ??
        item.total
      ) || unitPrice * quantity;

    const images = product.images || item.images || [];
    const firstImage = Array.isArray(images) ? images[0] : '';

    const imageUrl =
      item.image_url ||
      item.imageUrl ||
      item.image ||
      product.image_url ||
      product.imageUrl ||
      product.thumbnail_url ||
      product.image ||
      (typeof firstImage === 'string'
        ? firstImage
        : firstImage?.url) ||
      '';

    return {
      ...item,
      id: item.id || item._id,
      productId:
        item.product_id ||
        item.productId ||
        product.id ||
        product._id ||
        null,
      productName:
        item.product_name ||
        item.productName ||
        product.name ||
        product.title ||
        'Print product',
      productSlug:
        item.product_slug ||
        item.productSlug ||
        product.slug ||
        '',
      quantity,
      unitPrice,
      lineTotal,
      total: lineTotal,
      imageUrl,
      configuration: item.configuration || {},
    };
  });

  return {
    ...order,
    id: order.id || order._id,
    orderNumber: order.order_number || order.orderNumber || '',
    createdAt: order.created_at || order.createdAt || null,
    totalAmount:
      Number(
        order.total_amount ??
        order.totalAmount ??
        order.total
      ) || 0,
    subtotal: Number(order.subtotal) || 0,
    discount:
      Number(order.discount_amount ?? order.discount) || 0,
    taxAmount:
      Number(order.tax_amount ?? order.taxAmount) || 0,
    currency: order.currency || 'INR',
    shippingAddress:
      order.shipping_address || order.shippingAddress || null,
    billingAddress:
      order.billing_address || order.billingAddress || null,
    items,
    status: order.status || order.order_status || 'pending',
  };
};

const normalizeDesign = (design) => ({
  ...design,
  id: design.id || design._id,
  name: design.name || 'Untitled design',
  productId: design.product_id || design.productId || null,
  productName:
    design.product_name ||
    design.productName ||
    design.product?.name ||
    'Print design',
  previewUrl:
    design.preview_url ||
    design.previewUrl ||
    design.thumbnail_url ||
    design.image_url ||
    '',
  createdAt: design.created_at || design.createdAt,
  updatedAt: design.updated_at || design.updatedAt,
  designData: design.design_data || design.designData || {},
});

const normalizeProof = (proof) => ({
  ...proof,
  id: proof.id || proof._id,

  orderId:
    proof.order_id ||
    proof.orderId ||
    proof.orders?.id ||
    proof.order?.id ||
    proof.order?._id,

  orderNumber:
    proof.order_number ||
    proof.orderNumber ||
    proof.orders?.order_number ||
    '',

  productName:
    proof.product_name ||
    proof.productName ||
    proof.orders?.product_name ||
    'Artwork proof',

  previewUrl:
    proof.preview_url ||
    proof.previewUrl ||
    proof.preview_path ||
    proof.file_url ||
    proof.fileUrl ||
    '',

  fileUrl:
    proof.file_url ||
    proof.fileUrl ||
    proof.file_path ||
    '',

  fileType: proof.file_type || proof.fileType || '',
  createdAt: proof.created_at || proof.createdAt,
  updatedAt: proof.updated_at || proof.updatedAt,

  revisionNote:
    proof.revision_note || proof.revisionNote || '',

  version: proof.version || 1,
  status: proof.status || 'pending',
});

// --------------------------------------------------
// Placeholder
// --------------------------------------------------

function PagePlaceholder({ title, message }) {
  return (
    <div className="container mx-auto min-h-[55vh] px-4 py-16">
      <div className="mx-auto max-w-2xl rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
          PrintForge
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-[var(--color-heading)]">
          {title}
        </h1>

        <p className="mt-3 text-sm text-[var(--color-muted)]">
          {message || 'This feature is not connected yet.'}
        </p>
      </div>
    </div>
  );
}

// --------------------------------------------------
// Public routes
// --------------------------------------------------

function HomeRoute() {
  const { products, loading, error, refetch } = useProducts({
    featured: true,
    limit: 8,
  });

  const { addItem } = useCart();

  return (
    <Home
      products={products}
      loading={loading}
      error={error}
      onRetry={refetch}
      onAddToCart={addItem}
      galleryItems={[]}
    />
  );
}

function ProductsRoute() {
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get('category');

  const selectedCategory = categorySlug
    ? categoryMap[categorySlug] || null
    : null;

  const { products, loading, error, refetch } = useProducts({
    category: selectedCategory,
    limit: 500,
  });

  const { addItem } = useCart();

  return (
    <Products
      products={products}
      loading={loading}
      error={error}
      onRetry={refetch}
      onAddToCart={addItem}
    />
  );
}

function GalleryRoute() {
  const { products, loading, error, refetch } = useProducts({
    limit: 500,
  });

  return (
    <Gallery
      items={products}
      loading={loading}
      error={error}
      onRetry={refetch}
    />
  );
}

function ProductDetailsRoute() {
  const { slug } = useParams();
  const { product, loading, error, refetch } = useProduct(slug);

  const {
    calculatePrice,
    loading: pricingLoading,
    error: pricingError,
  } = usePricing();

  const { addItem } = useCart();

  const handleAddToCart = (item) => {
    addItem({
      ...item,
      productId: product?.id || product?._id,
      product,
    });
  };

  return (
    <ProductDetails
      product={product}
      loading={loading}
      error={error || pricingError}
      onRetry={refetch}
      onCalculatePrice={calculatePrice}
      onAddToCart={handleAddToCart}
      pricingLoading={pricingLoading}
    />
  );
}

// --------------------------------------------------
// Authentication
// --------------------------------------------------

function LoginRoute() {
  const { user, role, login } = useAuth();
  const location = useLocation();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (user) {
    return (
      <Navigate
        to={role === 'admin' ? '/admin/dashboard' : '/account/dashboard'}
        replace
      />
    );
  }

  const handleLogin = async ({ email, password }) => {
    setSubmitting(true);
    setError('');

    try {
      await login({ email, password });

      return {
        redirectTo:
          location.state?.from?.pathname || '/account/dashboard',
      };
    } catch (err) {
      setError(err.message || 'Unable to log in. Please try again.');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Login
      onLogin={handleLogin}
      loading={submitting}
      error={error}
    />
  );
}

function RegisterRoute() {
  const { user, role, register } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (user) {
    return (
      <Navigate
        to={role === 'admin' ? '/admin/dashboard' : '/account/dashboard'}
        replace
      />
    );
  }

  const handleRegister = async ({
    fullName,
    email,
    phone,
    password,
  }) => {
    setSubmitting(true);
    setError('');

    try {
      const data = await register({
        name: fullName,
        email,
        password,
        phone,
      });

      if (!data.session) {
        throw new Error(
          'Your account was created. Please check your email to verify your account before logging in.'
        );
      }

      return { redirectTo: '/account/dashboard' };
    } catch (err) {
      setError(err.message || 'Unable to create your account.');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Register
      onRegister={handleRegister}
      loading={submitting}
      error={error}
    />
  );
}

// --------------------------------------------------
// Checkout - existing Razorpay flow preserved
// --------------------------------------------------

function CheckoutRoute() {
  const { user } = useAuth();
  const { items: cart, clearCart } = useCart();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async ({
    billingAddress,
    shippingAddress,
    notes,
  }) => {
    if (!cart || cart.length === 0) {
      throw new Error('Your cart is empty.');
    }

    setSubmitting(true);
    setError('');

    try {
      const items = cart.map((item) => {
        const configuration = item.configuration || {};

        return {
          productId:
            item.productId ||
            item.product?.id ||
            item.product?._id,

          quantity:
            item.quantity ?? configuration.quantity ?? 1,

          configuration,
        };
      });

      const orderResult = await orderService.createOrder({
        items,
        billingAddress,
        shippingAddress,
        notes,
      });

      const order = orderResult?.order;
      const orderId = orderResult?.orderId || order?.id;

      if (!orderId) {
        throw new Error(
          orderResult?.message ||
            'The order was not created successfully.'
        );
      }

      const paymentResult =
        await paymentService.createPaymentOrder(orderId);

      const paymentOrder = paymentResult?.paymentOrder;
      const keyId = paymentResult?.keyId;

      if (!paymentOrder?.id || !keyId) {
        throw new Error(
          'Unable to initialize Razorpay payment. Please check the payment configuration.'
        );
      }

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded || !window.Razorpay) {
        throw new Error(
          'Unable to load Razorpay checkout. Please check your internet connection.'
        );
      }

      await new Promise((resolve, reject) => {
        let completed = false;

        const finish = (callback, value) => {
          if (completed) return;

          completed = true;
          callback(value);
        };

        const razorpay = new window.Razorpay({
          key: keyId,
          amount: paymentOrder.amount,
          currency: paymentOrder.currency || 'INR',
          name: 'Digital Heroes PrintForge',
          description: `Payment for order ${
            order.order_number || orderId
          }`,

          order_id: paymentOrder.id,

          prefill: {
            name:
              user?.user_metadata?.full_name ||
              user?.user_metadata?.name ||
              '',

            email: user?.email || '',

            contact: user?.user_metadata?.phone || '',
          },

          theme: {
            color: '#6D5DFB',
          },

          handler: async (response) => {
            try {
              const verification =
                await paymentService.verifyPayment({
                  ...response,
                  orderId,
                });

              if (verification?.success === false) {
                throw new Error(
                  verification.message ||
                    'Payment verification failed.'
                );
              }

              finish(resolve, verification);
            } catch (verificationError) {
              finish(reject, verificationError);
            }
          },

          modal: {
            ondismiss: () => {
              finish(
                reject,
                new Error(
                  'Payment was cancelled. Your order is still pending payment.'
                )
              );
            },
          },
        });

        razorpay.on('payment.failed', (response) => {
          finish(
            reject,
            new Error(
              response?.error?.description ||
                'Payment failed. Please try again.'
            )
          );
        });

        razorpay.open();
      });

      // Clear cart only after successful payment verification.
      clearCart();

      return {
        orderId,
        order,
      };
    } catch (err) {
      setError(err.message || 'Unable to complete checkout.');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Checkout
      cart={cart}
      user={user}
      quote={null}
      loading={false}
      submitting={submitting}
      error={error}
      onCheckout={handleCheckout}
    />
  );
}

// --------------------------------------------------
// Profile
// --------------------------------------------------

function ProfileRoute() {
  const { user, updateProfile } = useAuth();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const profileUser = useMemo(
    () => ({
      fullName:
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        '',

      email: user?.email || '',

      phone: user?.user_metadata?.phone || '',

      companyName:
        user?.user_metadata?.company_name || '',
    }),
    [user]
  );

  const handleUpdate = async ({
    fullName,
    phone,
    companyName,
  }) => {
    setSaving(true);
    setError('');

    try {
      await updateProfile({
        full_name: fullName,
        phone,
        company_name: companyName,
      });
    } catch (err) {
      setError(
        err?.message || 'Unable to update your profile.'
      );

      throw err;
    } finally {
      setSaving(false);
    }
  };

  return (
    <Profile
      user={profileUser}
      onUpdate={handleUpdate}
      saving={saving}
      error={error}
    />
  );
}

// --------------------------------------------------
// Orders
// --------------------------------------------------

function MyOrdersRoute() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    const loadOrders = async () => {
      setLoading(true);
      setError('');

      try {
        const result = await orderService.getMyOrders({
          page: 1,
          limit: 100,
        });

        if (!active) return;

        const rawOrders = Array.isArray(result?.orders)
          ? result.orders
          : [];

        setOrders(rawOrders.map(normalizeOrder));
      } catch (err) {
        if (active) {
          setError(
            err?.message || 'Unable to load your orders.'
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      active = false;
    };
  }, [reloadKey]);

  return (
    <MyOrders
      orders={orders}
      loading={loading}
      error={error}
      onRetry={() =>
        setReloadKey((current) => current + 1)
      }
    />
  );
}

function OrderDetailsRoute() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    const loadOrder = async () => {
      setLoading(true);
      setError('');

      try {
        const result = await orderService.getOrder(orderId);

        if (!active) return;

        if (!result?.order) {
          throw new Error(
            'Order details were not returned by the server.'
          );
        }

        setOrder(normalizeOrder(result.order));
      } catch (err) {
        if (active) {
          setError(
            err?.message || 'Unable to load order details.'
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadOrder();

    return () => {
      active = false;
    };
  }, [orderId, reloadKey]);

  const handleReorder = (selectedOrder) => {
    let added = 0;

    (selectedOrder.items || []).forEach((item) => {
      if (!item.productId) return;

      addItem({
        productId: item.productId,
        name: item.productName || 'Print product',
        quantity: item.quantity || 1,
        unitPrice: item.unitPrice || 0,
        image: item.imageUrl || '',
        configuration: item.configuration || {},
      });

      added += 1;
    });

    if (!added) {
      window.alert(
        'No reorderable product items were found in this order.'
      );

      return;
    }

    navigate('/cart');
  };

  return (
    <OrderDetails
      order={order}
      loading={loading}
      error={error}
      onRetry={() =>
        setReloadKey((current) => current + 1)
      }
      onReorder={handleReorder}
    />
  );
}

// --------------------------------------------------
// Saved Designs
// --------------------------------------------------

function MyDesignsRoute() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    const loadDesigns = async () => {
      setLoading(true);
      setError('');

      try {
        const result = await designService.getMyDesigns({
          page: 1,
          limit: 100,
        });

        if (!active) return;

        const rawDesigns = Array.isArray(result)
          ? result
          : Array.isArray(result?.designs)
            ? result.designs
            : [];

        setDesigns(rawDesigns.map(normalizeDesign));
      } catch (err) {
        if (active) {
          setError(
            err?.message || 'Unable to load your saved designs.'
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDesigns();

    return () => {
      active = false;
    };
  }, [reloadKey]);

  const handleDelete = async (design) => {
    const id = design.id || design._id;

    if (!id) {
      throw new Error('Design ID is missing.');
    }

    await designService.deleteDesign(id);

    setDesigns((current) =>
      current.filter(
        (item) => (item.id || item._id) !== id
      )
    );
  };

  return (
    <MyDesigns
      designs={designs}
      loading={loading}
      error={error}
      onDelete={handleDelete}
      onRetry={() =>
        setReloadKey((current) => current + 1)
      }
    />
  );
}

function DesignEditorRoute() {
  const { designId } = useParams();

  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadDesign = async () => {
      setLoading(true);
      setError('');

      try {
        const result = await designService.getDesign(designId);

        if (!active) return;

        if (!result?.design) {
          throw new Error('Saved design was not found.');
        }

        setDesign(normalizeDesign(result.design));
      } catch (err) {
        if (active) {
          setError(
            err?.message || 'Unable to load this design.'
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDesign();

    return () => {
      active = false;
    };
  }, [designId]);

  const handleSave = async (data) => {
    const productId =
      data.productId || design?.productId;

    if (!productId) {
      throw new Error(
        'This design has no associated product ID. It cannot be saved until a product is linked.'
      );
    }

    setSaving(true);
    setError('');

    try {
      const payload = {
        name: data.name || design?.name || 'Untitled design',

        product_id: productId,

        design_data: {
          canvas: data.canvas,
          dimensions: data.dimensions,
        },
      };

      const result = await designService.updateDesign(
        designId,
        payload
      );

      if (result?.design) {
        setDesign(normalizeDesign(result.design));
      } else {
        setDesign((current) => ({
          ...current,
          name: payload.name,
          designData: payload.design_data,
        }));
      }
    } catch (err) {
      setError(err?.message || 'Unable to save this design.');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return (
    <DesignEditor
      design={design}
      product={null}
      loading={loading}
      saving={saving}
      error={error}
      onSave={handleSave}
    />
  );
}

// --------------------------------------------------
// Proofs
// --------------------------------------------------

function MyProofsRoute() {
  const [proofs, setProofs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    const loadProofs = async () => {
      setLoading(true);
      setError('');

      try {
        const result = await proofService.getMyProofs({
          page: 1,
          limit: 100,
        });

        if (!active) return;

        const rawProofs = Array.isArray(result?.proofs)
          ? result.proofs
          : [];

        setProofs(rawProofs.map(normalizeProof));
      } catch (err) {
        if (active) {
          setError(
            err?.message || 'Unable to load your proofs.'
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProofs();

    return () => {
      active = false;
    };
  }, [reloadKey]);

  const reload = () => {
    setReloadKey((current) => current + 1);
  };

  const handleApprove = async (proof) => {
    const id = proof.id || proof._id;

    if (!id) {
      throw new Error('Proof ID is missing.');
    }

    await proofService.approveProof(id);
    reload();
  };

  const handleRequestChanges = async (payload) => {
    if (!payload?.proofId) {
      throw new Error('Proof ID is missing.');
    }

    if (!payload?.message?.trim()) {
      throw new Error('Please enter a revision message.');
    }

    await proofService.requestChanges(
      payload.proofId,
      {
        message: payload.message,
      }
    );

    reload();
  };

  return (
    <MyProofs
      proofs={proofs}
      loading={loading}
      error={error}
      onApprove={handleApprove}
      onRequestChanges={handleRequestChanges}
      onRetry={reload}
    />
  );
}

// --------------------------------------------------
// Reorder
// --------------------------------------------------

function ReorderRoute() {
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingId, setAddingId] = useState(null);

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(Number(value) || 0);

  useEffect(() => {
    let active = true;

    const loadOrders = async () => {
      setLoading(true);
      setError('');

      try {
        const result = await orderService.getMyOrders({
          page: 1,
          limit: 100,
        });

        if (!active) return;

        const rawOrders = Array.isArray(result?.orders)
          ? result.orders
          : [];

        setOrders(rawOrders.map(normalizeOrder));
      } catch (err) {
        if (active) {
          setError(
            err?.message || 'Unable to load previous orders.'
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadOrders();

    return () => {
      active = false;
    };
  }, []);

  const handleReorder = (order) => {
    setAddingId(order.id);
    setError('');

    try {
      let added = 0;

      (order.items || []).forEach((item) => {
        if (!item.productId) return;

        addItem({
          productId: item.productId,
          name: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          image: item.imageUrl,
          configuration: item.configuration || {},
        });

        added += 1;
      });

      if (!added) {
        throw new Error(
          'No reorderable product IDs were found in this order.'
        );
      }

      navigate('/cart');
    } catch (err) {
      setError(
        err?.message || 'Unable to reorder this order.'
      );
    } finally {
      setAddingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="h-24 animate-pulse rounded-2xl bg-[var(--color-border)]" />
        <div className="h-64 animate-pulse rounded-2xl bg-[var(--color-border)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#bd6540]">
          Order history
        </p>

        <h1 className="mt-2 text-3xl font-bold text-[var(--color-heading)]">
          Reorder
        </h1>

        <p className="mt-2 text-sm text-[var(--color-muted)]">
          View products from your previous orders and add them to your cart again.
        </p>
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center">
          <h2 className="font-bold text-[var(--color-heading)]">
            No previous orders
          </h2>

          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Your previous orders will appear here.
          </p>

          <button
            type="button"
            onClick={() => navigate('/products')}
            className="mt-5 rounded-xl bg-[#bd6540] px-5 py-3 text-sm font-bold text-white"
          >
            Browse products
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <article
              key={order.id}
              className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]"
            >
              {/* ORDER HEADER */}
              <div className="flex flex-col justify-between gap-4 border-b border-[var(--color-border)] p-5 sm:flex-row sm:items-center">
                <div className="min-w-0">
                  <h2 className="break-all text-lg font-bold text-[var(--color-heading)]">
                    {order.orderNumber || `Order ${order.id}`}
                  </h2>

                  <p className="mt-1 text-xs text-[var(--color-muted)]">
                    {order.items.length} item(s) · {order.status}
                  </p>

                  {order.createdAt && (
                    <p className="mt-1 text-xs text-[var(--color-muted)]">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/account/orders/${order.id}`)
                    }
                    className="rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-xs font-bold text-[var(--color-heading)]"
                  >
                    View order
                  </button>

                  <button
                    type="button"
                    disabled={addingId === order.id}
                    onClick={() => handleReorder(order)}
                    className="rounded-lg bg-[#bd6540] px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50"
                  >
                    {addingId === order.id ? 'Adding...' : 'Reorder'}
                  </button>
                </div>
              </div>

              {/* ORDER PRODUCTS */}
              <div className="space-y-4 p-5">
                {order.items.length === 0 ? (
                  <p className="text-sm text-[var(--color-muted)]">
                    Product details were not included with this order.
                  </p>
                ) : (
                  order.items.map((item, index) => (
                    <div
                      key={item.id || `${order.id}-${index}`}
                      className="flex flex-col gap-4 sm:flex-row sm:items-center"
                    >
                      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-background)]">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="h-full w-full object-cover"
                            onError={(event) => {
                              event.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <span className="text-xs text-[var(--color-muted)]">
                            No image
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-[var(--color-heading)]">
                          {item.productName}
                        </h3>

                        <p className="mt-1 text-sm text-[var(--color-muted)]">
                          Quantity: {item.quantity}
                        </p>

                        <p className="mt-1 text-xs text-[var(--color-muted)]">
                          Unit price: {formatCurrency(item.unitPrice)}
                        </p>
                      </div>

                      <p className="shrink-0 font-bold text-[var(--color-heading)]">
                        {formatCurrency(item.lineTotal)}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* ORDER TOTAL */}
              <div className="flex justify-between border-t border-[var(--color-border)] px-5 py-4">
                <span className="text-sm font-semibold text-[var(--color-muted)]">
                  Order total
                </span>

                <span className="font-bold text-[var(--color-heading)]">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function AddressesRoute() {
  const { user, updateProfile } = useAuth();

  const [addresses, setAddresses] = useState(
    user?.user_metadata?.saved_addresses || []
  );

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const emptyForm = {
    label: 'Home',
    fullName:
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      '',
    phone: user?.user_metadata?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const savedAddresses =
      user?.user_metadata?.saved_addresses || [];

    setAddresses(savedAddresses);
  }, [user]);

  const inputClass =
    'w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-sm text-[var(--color-heading)] outline-none transition focus:border-[#bd6540]';

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const persistAddresses = async (updatedAddresses) => {
    await updateProfile({
      saved_addresses: updatedAddresses,
    });

    setAddresses(updatedAddresses);
  };

  const handleEdit = (address) => {
    setEditingId(address.id);

    setForm({
      label: address.label || 'Home',
      fullName: address.fullName || '',
      phone: address.phone || '',
      addressLine1: address.addressLine1 || '',
      addressLine2: address.addressLine2 || '',
      city: address.city || '',
      state: address.state || '',
      pincode: address.pincode || '',
      country: address.country || 'India',
    });

    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (
      !form.fullName.trim() ||
      !form.phone.trim() ||
      !form.addressLine1.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.pincode.trim()
    ) {
      setError('Please complete all required address fields.');
      return;
    }

    if (!/^[0-9]{6}$/.test(form.pincode.trim())) {
      setError('Please enter a valid 6-digit PIN code.');
      return;
    }

    if (!/^[0-9+\-\s]{10,15}$/.test(form.phone.trim())) {
      setError('Please enter a valid phone number.');
      return;
    }

    setSaving(true);

    try {
      const existingAddress = addresses.find(
        (address) => address.id === editingId
      );

      const newAddress = {
        ...form,
        id: editingId || crypto.randomUUID(),
        isDefault:
          existingAddress?.isDefault ||
          addresses.length === 0,
      };

      let updatedAddresses;

      if (editingId) {
        updatedAddresses = addresses.map((address) =>
          address.id === editingId ? newAddress : address
        );
      } else {
        updatedAddresses = [...addresses, newAddress];
      }

      await persistAddresses(updatedAddresses);

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      setSuccess('Address saved successfully.');
    } catch (err) {
      setError(
        err?.message || 'Unable to save your address.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this address?'
    );

    if (!confirmed) return;

    setError('');
    setSuccess('');

    try {
      let updatedAddresses = addresses.filter(
        (address) => address.id !== id
      );

      if (
        updatedAddresses.length > 0 &&
        !updatedAddresses.some((address) => address.isDefault)
      ) {
        updatedAddresses = updatedAddresses.map(
          (address, index) => ({
            ...address,
            isDefault: index === 0,
          })
        );
      }

      await persistAddresses(updatedAddresses);
      setSuccess('Address deleted successfully.');
    } catch (err) {
      setError(
        err?.message || 'Unable to delete this address.'
      );
    }
  };

  const handleSetDefault = async (id) => {
    setError('');
    setSuccess('');

    try {
      const updatedAddresses = addresses.map((address) => ({
        ...address,
        isDefault: address.id === id,
      }));

      await persistAddresses(updatedAddresses);
      setSuccess('Default address updated.');
    } catch (err) {
      setError(
        err?.message || 'Unable to update the default address.'
      );
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#bd6540]">
            Account
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[var(--color-heading)]">
            My Addresses
          </h1>

          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Manage your saved delivery addresses.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={() => {
              setForm(emptyForm);
              setEditingId(null);
              setShowForm(true);
              setError('');
              setSuccess('');
            }}
            className="rounded-xl bg-[#bd6540] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#a95332]"
          >
            + Add New Address
          </button>
        )}
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-[var(--color-heading)]">
              {editingId ? 'Edit Address' : 'Add New Address'}
            </h2>

            <button
              type="button"
              onClick={handleCancel}
              className="text-sm font-semibold text-[var(--color-muted)] hover:text-red-600"
            >
              Cancel
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-[var(--color-heading)]">
                Address type *
              </span>

              <select
                name="label"
                value={form.label}
                onChange={updateField}
                className={inputClass}
              >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-[var(--color-heading)]">
                Full name *
              </span>

              <input
                name="fullName"
                value={form.fullName}
                onChange={updateField}
                placeholder="Recipient name"
                className={inputClass}
                required
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-[var(--color-heading)]">
                Phone number *
              </span>

              <input
                name="phone"
                value={form.phone}
                onChange={updateField}
                placeholder="10-digit phone number"
                className={inputClass}
                required
              />
            </label>

            <label className="space-y-2 sm:col-span-2">
              <span className="text-sm font-semibold text-[var(--color-heading)]">
                Address line 1 *
              </span>

              <input
                name="addressLine1"
                value={form.addressLine1}
                onChange={updateField}
                placeholder="House number, building, street"
                className={inputClass}
                required
              />
            </label>

            <label className="space-y-2 sm:col-span-2">
              <span className="text-sm font-semibold text-[var(--color-heading)]">
                Address line 2
              </span>

              <input
                name="addressLine2"
                value={form.addressLine2}
                onChange={updateField}
                placeholder="Area, landmark (optional)"
                className={inputClass}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-[var(--color-heading)]">
                City *
              </span>

              <input
                name="city"
                value={form.city}
                onChange={updateField}
                placeholder="City"
                className={inputClass}
                required
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-[var(--color-heading)]">
                State *
              </span>

              <input
                name="state"
                value={form.state}
                onChange={updateField}
                placeholder="State"
                className={inputClass}
                required
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-[var(--color-heading)]">
                PIN code *
              </span>

              <input
                name="pincode"
                value={form.pincode}
                onChange={updateField}
                placeholder="6-digit PIN code"
                maxLength={6}
                className={inputClass}
                required
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-[var(--color-heading)]">
                Country *
              </span>

              <input
                name="country"
                value={form.country}
                onChange={updateField}
                className={inputClass}
                required
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#bd6540] px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
            >
              {saving
                ? 'Saving...'
                : editingId
                  ? 'Update Address'
                  : 'Save Address'}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="rounded-xl border border-[var(--color-border)] px-6 py-3 text-sm font-bold text-[var(--color-heading)]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {!showForm && addresses.length === 0 && (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center">
          <h2 className="font-bold text-[var(--color-heading)]">
            No saved addresses
          </h2>

          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Add an address to make your next checkout easier.
          </p>

          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="mt-5 rounded-xl bg-[#bd6540] px-5 py-3 text-sm font-bold text-white"
          >
            Add Your First Address
          </button>
        </div>
      )}

      {!showForm && addresses.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2">
          {addresses.map((address) => (
            <article
              key={address.id}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-bold text-[var(--color-heading)]">
                  {address.label || 'Address'}
                </h2>

                {address.isDefault && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    Default
                  </span>
                )}
              </div>

              <div className="mt-4 space-y-1 text-sm text-[var(--color-muted)]">
                <p className="font-bold text-[var(--color-heading)]">
                  {address.fullName}
                </p>

                <p>{address.phone}</p>
                <p>{address.addressLine1}</p>

                {address.addressLine2 && (
                  <p>{address.addressLine2}</p>
                )}

                <p>
                  {address.city}, {address.state} - {address.pincode}
                </p>

                <p>{address.country}</p>
              </div>

              <div className="mt-5 flex flex-wrap gap-2 border-t border-[var(--color-border)] pt-4">
                <button
                  type="button"
                  onClick={() => handleEdit(address)}
                  className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-xs font-bold text-[var(--color-heading)]"
                >
                  Edit
                </button>

                {!address.isDefault && (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(address.id)}
                    className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-xs font-bold text-[var(--color-heading)]"
                  >
                    Set as default
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleDelete(address.id)}
                  className="rounded-lg border border-red-200 px-4 py-2 text-xs font-bold text-red-600"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
// --------------------------------------------------
// Admin
// --------------------------------------------------

function AdminDashboardRoute() {
  return <PagePlaceholder title="Admin Dashboard" />;
}

function ManageUsersRoute() {
  return <PagePlaceholder title="Manage Customers" />;
}

// --------------------------------------------------
// Application Routes
// --------------------------------------------------

export default function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC AND AUTHENTICATION ROUTES */}

      <Route element={<MainLayout />}>
        <Route index element={<HomeRoute />} />

        <Route path="products" element={<ProductsRoute />} />
        <Route
          path="products/:slug"
          element={<ProductDetailsRoute />}
        />

        <Route path="gallery" element={<GalleryRoute />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="cart" element={<Cart />} />

        <Route path="login" element={<LoginRoute />} />
        <Route path="register" element={<RegisterRoute />} />

        <Route
          path="forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="reset-password"
          element={<ResetPassword />}
        />
      </Route>

      {/* CUSTOMER AREA */}

      <Route element={<ProtectedRoute />}>
        <Route path="account" element={<CustomerLayout />}>
          <Route
            index
            element={<Navigate to="dashboard" replace />}
          />

          <Route
            path="dashboard"
            element={<CustomerDashboard />}
          />

          <Route path="profile" element={<ProfileRoute />} />

          <Route path="orders" element={<MyOrdersRoute />} />

          <Route
            path="orders/:orderId"
            element={<OrderDetailsRoute />}
          />

          <Route path="designs" element={<MyDesignsRoute />} />

          <Route
            path="designs/:designId/edit"
            element={<DesignEditorRoute />}
          />

          <Route
            path="designs/:designId"
            element={<DesignEditorRoute />}
          />

          <Route path="proofs" element={<MyProofsRoute />} />

          <Route path="checkout" element={<CheckoutRoute />} />

          <Route
            path="order-success/:orderId"
            element={<OrderSuccess />}
          />

          <Route path="reorder" element={<ReorderRoute />} />

          <Route
            path="addresses"
            element={
              <PagePlaceholder
                title="My Addresses"
                message="Address management needs a customer-address API endpoint. Your currently inspected backend services do not expose one, so this page is not yet connected to persistent address storage."
              />
            }
          />
        </Route>
      </Route>

      {/* ADMIN AREA */}

      <Route element={<AdminRoute />}>
        <Route path="admin" element={<AdminLayout />}>
          <Route
            index
            element={<Navigate to="dashboard" replace />}
          />

          <Route
            path="dashboard"
            element={<AdminDashboardRoute />}
          />

          <Route path="analytics" element={<Reports />} />
          <Route path="reports" element={<Reports />} />

          <Route path="orders" element={<ManageOrders />} />
          <Route path="proofs" element={<ProofManagement />} />

          <Route
            path="production"
            element={<ProductionQueue />}
          />

          <Route
            path="production/:jobId"
            element={<ProductionDetails />}
          />

          <Route
            path="archive"
            element={<PagePlaceholder title="Production Archive" />}
          />

          <Route path="products" element={<ManageProducts />} />

          <Route
            path="products/new"
            element={<PagePlaceholder title="Create Product" />}
          />

          <Route
            path="products/:productId/edit"
            element={<PagePlaceholder title="Edit Product" />}
          />

          <Route
            path="categories"
            element={<ManageCategories />}
          />

          <Route
            path="templates"
            element={<PagePlaceholder title="Manage Templates" />}
          />

          <Route
            path="customers"
            element={<ManageUsersRoute />}
          />

          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      {/* 404 */}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
