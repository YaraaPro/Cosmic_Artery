const CART_STORAGE_KEY = "expressionism_artery_cart_v1";

const parsePriceValue = (priceText = "") => {
  const match = String(priceText).match(/([0-9]+(?:\.[0-9]{1,2})?)/);
  return match ? Number.parseFloat(match[1]) : 0;
};

const formatPrice = (value) => `$${Number(value || 0).toFixed(2)}`;

const loadCart = () => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
};

const saveCart = (items) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("cart:updated", { detail: { items } }));
};

const getCartCount = () => {
  const cart = loadCart();
  return cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);
};

const getCartTotal = () => {
  const cart = loadCart();
  return cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0), 0);
};

const addItem = (item) => {
  const cart = loadCart();
  const id = String(item.id || "");
  const existing = cart.find((entry) => entry.id === id);

  if (existing) {
    existing.qty += Number(item.qty || 1);
  } else {
    cart.push({
      id,
      name: String(item.name || "Item"),
      category: String(item.category || "Shop"),
      price: Number(item.price || 0),
      image: String(item.image || ""),
      qty: Number(item.qty || 1)
    });
  }

  saveCart(cart);
};

const updateQty = (id, qty) => {
  const cart = loadCart();
  const entry = cart.find((item) => item.id === id);
  if (!entry) {
    return;
  }

  const safeQty = Math.max(0, Number(qty || 0));
  if (safeQty === 0) {
    const filtered = cart.filter((item) => item.id !== id);
    saveCart(filtered);
    return;
  }

  entry.qty = safeQty;
  saveCart(cart);
};

const removeItem = (id) => {
  const cart = loadCart().filter((item) => item.id !== id);
  saveCart(cart);
};

const clearCart = () => {
  saveCart([]);
};

window.CartStore = {
  parsePriceValue,
  formatPrice,
  loadCart,
  saveCart,
  getCartCount,
  getCartTotal,
  addItem,
  updateQty,
  removeItem,
  clearCart
};
