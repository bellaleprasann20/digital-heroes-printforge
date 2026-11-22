
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'printforge_cart';

function readCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getItemKey(item) {
  if (item.cartItemId) {
    return String(item.cartItemId);
  }

  const productId =
    item.productId ||
    item.id ||
    item._id ||
    item.product?.id ||
    item.product?._id;

  const configuration = JSON.stringify(item.configuration || {});

  return `${productId || 'product'}-${configuration}`;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Unable to save cart:', error);
    }
  }, [items]);

  // Add product to cart
  const addItem = useCallback((item) => {
    if (!item || typeof item !== 'object') {
      throw new Error('A valid product is required.');
    }

    const product = item.product || item;

    const productId =
      item.productId ||
      item.id ||
      item._id ||
      product.id ||
      product._id;

    if (!productId) {
      console.error('Cannot add product without an ID:', item);
      throw new Error('Product ID is missing.');
    }

    const configuration = item.configuration || {};

    const quantity = Math.max(
      1,
      Math.floor(
        Number(item.quantity ?? configuration.quantity) || 1
      )
    );

    const quote = item.quote?.quote || item.quote || {};

    const unitPrice = Number(
      item.unitPrice ??
      quote.unitPrice ??
      product.unitPrice ??
      product.basePrice ??
      product.base_price ??
      item.startingPrice ??
      item.basePrice ??
      item.base_price ??
      item.price ??
      0
    );

    const image =
      item.image ||
      item.imageUrl ||
      item.image_url ||
      product.image ||
      product.imageUrl ||
      product.image_url ||
      item.thumbnail ||
      '';

    const name =
      item.name ||
      item.title ||
      product.name ||
      product.title ||
      'Product';

    const cartItemId = getItemKey({
      ...item,
      productId,
    });

    const normalizedItem = {
      ...item,
      productId: String(productId),
      product,
      configuration,
      quote,
      cartItemId,
      quantity,
      unitPrice: Number.isFinite(unitPrice) ? unitPrice : 0,
      image,
      imageUrl: image,
      name,
    };

    setItems((current) => {
      const existing = current.find(
        (entry) => entry.cartItemId === cartItemId
      );

      if (existing) {
        return current.map((entry) =>
          entry.cartItemId === cartItemId
            ? {
                ...entry,
                quantity:
                  (Number(entry.quantity) || 0) + quantity,
              }
            : entry
        );
      }

      return [...current, normalizedItem];
    });
  }, []);

  // Remove product
  const removeItem = useCallback((cartItemId) => {
    setItems((current) =>
      current.filter(
        (item) => item.cartItemId !== cartItemId
      )
    );
  }, []);

  // Update quantity
  const updateQuantity = useCallback((cartItemId, quantity) => {
    const nextQuantity = Math.floor(Number(quantity));

    if (!Number.isFinite(nextQuantity) || nextQuantity < 1) {
      setItems((current) =>
        current.filter(
          (item) => item.cartItemId !== cartItemId
        )
      );
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: nextQuantity }
          : item
      )
    );
  }, []);

  // Clear cart
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Total quantity
  const itemCount = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + (Number(item.quantity) || 0),
        0
      ),
    [items]
  );

  // Estimated subtotal
  const estimatedSubtotal = useMemo(
    () =>
      items.reduce((total, item) => {
        const unitPrice = Number(item.unitPrice) || 0;

        return (
          total +
          unitPrice * (Number(item.quantity) || 0)
        );
      }, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      estimatedSubtotal,
      isEmpty: items.length === 0,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [
      items,
      itemCount,
      estimatedSubtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      'useCart must be used inside a CartProvider.'
    );
  }

  return context;
}
