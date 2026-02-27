const cartList = document.querySelector("#cart-list");
const cartEmpty = document.querySelector("#cart-empty");
const cartTotal = document.querySelector("#cart-total");
const cartItemCount = document.querySelector("#cart-item-count");
const cartClearBtn = document.querySelector("#cart-clear-btn");
const cartCheckoutBtn = document.querySelector("#cart-checkout-btn");
const cartNoteInput = document.querySelector("#cart-note");
const WHATSAPP_OWNER_NUMBER = "96176842023";
const CART_NOTE_STORAGE_KEY = "expressionism_artery_cart_note_v1";

const loadCartNote = () => {
  try {
    return localStorage.getItem(CART_NOTE_STORAGE_KEY) || "";
  } catch (_error) {
    return "";
  }
};

const saveCartNote = (value) => {
  try {
    localStorage.setItem(CART_NOTE_STORAGE_KEY, String(value || ""));
  } catch (_error) {
    // Ignore storage failures (private mode, quota, etc.)
  }
};

const clearCartNote = () => {
  try {
    localStorage.removeItem(CART_NOTE_STORAGE_KEY);
  } catch (_error) {
    // Ignore storage failures.
  }
};

if (window.CartStore && cartList) {
  const { loadCart, formatPrice, getCartCount, getCartTotal, updateQty, removeItem, clearCart } = window.CartStore;

  if (cartNoteInput) {
    cartNoteInput.value = loadCartNote();
    cartNoteInput.addEventListener("input", () => {
      saveCartNote(cartNoteInput.value);
    });
  }

  const render = () => {
    const items = loadCart();
    cartList.innerHTML = "";

    if (items.length === 0) {
      cartEmpty.hidden = false;
      cartList.hidden = true;
    } else {
      cartEmpty.hidden = true;
      cartList.hidden = false;

      items.forEach((item) => {
        const row = document.createElement("article");
        row.className = "cart-item";
        row.innerHTML = `
          <div class="cart-item-main">
            <h2>${item.name}</h2>
            <p class="cart-item-meta">${item.category}</p>
            <p class="cart-item-price">${formatPrice(item.price)} each</p>
          </div>
          <div class="cart-item-actions">
            <button type="button" class="cart-qty-btn" data-cart-action="decrease" data-cart-id="${item.id}">-</button>
            <span class="cart-qty">${item.qty}</span>
            <button type="button" class="cart-qty-btn" data-cart-action="increase" data-cart-id="${item.id}">+</button>
            <button type="button" class="cart-remove-btn" data-cart-action="remove" data-cart-id="${item.id}">Remove</button>
          </div>
        `;
        cartList.appendChild(row);
      });
    }

    if (cartItemCount) {
      cartItemCount.textContent = String(getCartCount());
    }
    if (cartTotal) {
      cartTotal.textContent = formatPrice(getCartTotal());
    }
  };

  cartList.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const action = target.dataset.cartAction;
    const id = target.dataset.cartId;
    if (!action || !id) {
      return;
    }

    const items = loadCart();
    const entry = items.find((item) => item.id === id);
    if (!entry && action !== "remove") {
      return;
    }

    if (action === "increase" && entry) {
      updateQty(id, Number(entry.qty) + 1);
    } else if (action === "decrease" && entry) {
      updateQty(id, Number(entry.qty) - 1);
    } else if (action === "remove") {
      removeItem(id);
    }

    render();
  });

  if (cartClearBtn) {
    cartClearBtn.addEventListener("click", () => {
      clearCart();
      clearCartNote();
      if (cartNoteInput) {
        cartNoteInput.value = "";
      }
      render();
    });
  }

  if (cartCheckoutBtn) {
    cartCheckoutBtn.addEventListener("click", () => {
      const items = loadCart();
      if (items.length === 0) {
        const originalText = cartCheckoutBtn.textContent;
        cartCheckoutBtn.textContent = "Cart is Empty";
        setTimeout(() => {
          cartCheckoutBtn.textContent = originalText;
        }, 900);
        return;
      }

      const lines = [
        "Hi! I would like to place an order from Cosmic Artery.",
        "",
        "Order details:"
      ];

      items.forEach((item) => {
        const qty = Number(item.qty || 0);
        const subtotal = Number(item.price || 0) * qty;
        lines.push(`- ${qty} x ${item.name} (${item.category}) - ${formatPrice(subtotal)}`);
      });

      lines.push("");
      lines.push(`Total: ${formatPrice(getCartTotal())}`);
      const orderNote = cartNoteInput ? cartNoteInput.value.trim() : "";
      if (orderNote) {
        lines.push("");
        lines.push(`Order notes: ${orderNote}`);
      }
      lines.push("Please confirm availability and next steps.");

      const encoded = encodeURIComponent(lines.join("\n"));
      const url = `https://wa.me/${WHATSAPP_OWNER_NUMBER}?text=${encoded}`;
      const popup = window.open(url, "_blank", "noopener,noreferrer");

      if (!popup) {
        window.location.href = url;
      }
    });
  }

  window.addEventListener("cart:updated", () => {
    render();
  });

  render();
}
