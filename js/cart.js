const cartList = document.querySelector("#cart-list");
const cartEmpty = document.querySelector("#cart-empty");
const cartTotal = document.querySelector("#cart-total");
const cartItemCount = document.querySelector("#cart-item-count");
const cartClearBtn = document.querySelector("#cart-clear-btn");
const cartCheckoutBtn = document.querySelector("#cart-checkout-btn");

if (window.CartStore && cartList) {
  const { loadCart, formatPrice, getCartCount, getCartTotal, updateQty, removeItem, clearCart } = window.CartStore;

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
      render();
    });
  }

  if (cartCheckoutBtn) {
    cartCheckoutBtn.addEventListener("click", () => {
      cartCheckoutBtn.textContent = "Checkout Coming Soon";
    });
  }

  window.addEventListener("cart:updated", () => {
    render();
  });

  render();
}
