const shopRoot = document.querySelector("#shop-products");
const tabButtons = document.querySelectorAll(".shop-tab");
const artTypeButtons = document.querySelectorAll(".art-type");
const accessoryTypeButtons = document.querySelectorAll(".accessory-type");
const artPrintTypeButtons = document.querySelectorAll(".art-print-type");
const commissionTypeButtons = document.querySelectorAll(".commission-type");
const artTypeControls = document.querySelector("#art-type-controls");
const accessoryTypeControls = document.querySelector("#accessory-type-controls");
const artPrintTypeControls = document.querySelector("#art-print-type-controls");
const commissionTypeControls = document.querySelector("#commission-type-controls");
const emptyState = document.querySelector("#shop-empty");
const productImageButtons = document.querySelectorAll(".product-image-btn");
const productCtaButtons = document.querySelectorAll(".product-cta");
const lightbox = document.querySelector("#image-lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");
const lightboxTitle = document.querySelector("#lightbox-title");
const lightboxPrev = document.querySelector("[data-lightbox-prev]");
const lightboxNext = document.querySelector("[data-lightbox-next]");
const miniPrintCartBtn = document.querySelector("#mini-print-cart-btn");

if (shopRoot && tabButtons.length > 0) {
  let activeTab = "art";
  let activeArtType = "all";
  let activeAccessoryType = "all";
  let activeArtPrintType = "all";
  let activeCommissionType = "all";
  let showTypeControls = true;

  const applyFilters = () => {
    const cards = shopRoot.querySelectorAll(".product-card");
    let visibleCount = 0;

    cards.forEach((card) => {
      const category = (card.dataset.category || "").toLowerCase();
      const artType = (card.dataset.artType || "").toLowerCase();
      const accessoryType = (card.dataset.accessoryType || "").toLowerCase();
      const artPrintType = (card.dataset.artPrintType || "").toLowerCase();
      const commissionType = (card.dataset.commissionType || "").toLowerCase();
      const tabMatch = category === activeTab;
      const artTypeMatch = activeTab !== "art" || activeArtType === "all" || artType === activeArtType;
      const accessoryTypeMatch =
        activeTab !== "accessories" || activeAccessoryType === "all" || accessoryType === activeAccessoryType;
      const artPrintTypeMatch =
        activeTab !== "art-prints" ||
        artPrintType === "all" ||
        activeArtPrintType === "all" ||
        artPrintType === activeArtPrintType;
      const commissionTypeMatch =
        activeTab !== "custom-commissions" || activeCommissionType === "all" || commissionType === activeCommissionType;
      const visible = tabMatch && artTypeMatch && accessoryTypeMatch && artPrintTypeMatch && commissionTypeMatch;

      card.classList.toggle("is-hidden", !visible);
      card.hidden = !visible;
      if (visible) {
        visibleCount += 1;
      }
    });

    if (emptyState) {
      emptyState.hidden = visibleCount > 0;
    }

    if (artTypeControls) {
      artTypeControls.hidden = !showTypeControls || activeTab !== "art";
    }
    if (accessoryTypeControls) {
      accessoryTypeControls.hidden = !showTypeControls || activeTab !== "accessories";
    }
    if (artPrintTypeControls) {
      artPrintTypeControls.hidden = !showTypeControls || activeTab !== "art-prints";
    }
    if (commissionTypeControls) {
      commissionTypeControls.hidden = !showTypeControls || activeTab !== "custom-commissions";
    }
  };

  const setActiveTab = (tab) => {
    activeTab = (tab || "art").toLowerCase();
    tabButtons.forEach((button) => {
      const selected = (button.dataset.tab || "").toLowerCase() === activeTab;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-selected", String(selected));
    });
    applyFilters();
  };

  const setActiveArtType = (artType) => {
    activeArtType = (artType || "all").toLowerCase();
    artTypeButtons.forEach((button) => {
      button.classList.toggle("is-active", (button.dataset.artType || "").toLowerCase() === activeArtType);
    });
    applyFilters();
  };

  const setActiveAccessoryType = (accessoryType) => {
    activeAccessoryType = (accessoryType || "all").toLowerCase();
    accessoryTypeButtons.forEach((button) => {
      button.classList.toggle(
        "is-active",
        (button.dataset.accessoryType || "").toLowerCase() === activeAccessoryType
      );
    });
    applyFilters();
  };

  const setActiveArtPrintType = (artPrintType) => {
    activeArtPrintType = (artPrintType || "all").toLowerCase();
    artPrintTypeButtons.forEach((button) => {
      button.classList.toggle(
        "is-active",
        (button.dataset.artPrintType || "").toLowerCase() === activeArtPrintType
      );
    });
    applyFilters();
  };

  const setActiveCommissionType = (commissionType) => {
    activeCommissionType = (commissionType || "all").toLowerCase();
    commissionTypeButtons.forEach((button) => {
      button.classList.toggle(
        "is-active",
        (button.dataset.commissionType || "").toLowerCase() === activeCommissionType
      );
    });
    applyFilters();
  };

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      showTypeControls = true;
      setActiveTab(button.dataset.tab || "art");
    });
  });

  artTypeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setActiveArtType(button.dataset.artType || "all");
    });
  });

  accessoryTypeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setActiveAccessoryType(button.dataset.accessoryType || "all");
    });
  });

  artPrintTypeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setActiveArtPrintType(button.dataset.artPrintType || "all");
    });
  });

  commissionTypeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setActiveCommissionType(button.dataset.commissionType || "all");
    });
  });

  setActiveTab(activeTab);
  setActiveArtType(activeArtType);
  setActiveAccessoryType(activeAccessoryType);
  setActiveArtPrintType(activeArtPrintType);
  setActiveCommissionType(activeCommissionType);

  const setImageOrientation = (img, wrapper) => {
    if (!img || !wrapper) {
      return;
    }
    const width = img.naturalWidth || 0;
    const height = img.naturalHeight || 1;
    const ratio = width / height;
    let orientation = "square";

    if (ratio > 1.12) {
      orientation = "landscape";
    } else if (ratio < 0.88) {
      orientation = "portrait";
    }
    wrapper.dataset.orientation = orientation;
  };

  const normalizeId = (value) =>
    String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const flashButton = (button, text) => {
    if (!button) {
      return;
    }
    const original = button.textContent;
    button.textContent = text;
    button.disabled = true;
    setTimeout(() => {
      button.textContent = original;
      button.disabled = false;
    }, 900);
  };

  const buildItemFromCard = (card, overrides = {}) => {
    if (!card || !window.CartStore) {
      return null;
    }

    const title = card.querySelector("h2");
    const meta = card.querySelector(".product-meta");
    const priceNode = card.querySelector(".price");
    const image = card.querySelector(".product-image");
    const categoryMeta = meta ? meta.textContent.trim() : card.dataset.category || "Shop";
    const categoryLabel = categoryMeta.split("·")[0].trim();
    const name = overrides.name || (title ? title.textContent.trim() : "Item");
    const priceText = overrides.priceText || (priceNode ? priceNode.textContent : "$0.00");
    const price = window.CartStore.parsePriceValue(priceText);
    const imageSrc = overrides.image || (image ? image.currentSrc || image.getAttribute("src") || "" : "");
    const idPrefix = overrides.idPrefix || card.dataset.category || "item";
    const id = `${normalizeId(idPrefix)}-${normalizeId(name)}`;

    return {
      id,
      name,
      category: overrides.category || categoryLabel,
      price,
      image: imageSrc,
      qty: 1
    };
  };

  let miniPrintGalleryItems = [];
  let miniPrintIndex = 0;
  let miniPrintGalleryOpen = false;

  const setMiniPrintUI = (enabled) => {
    if (lightboxTitle) {
      lightboxTitle.hidden = !enabled;
    }
    if (lightboxPrev) {
      lightboxPrev.hidden = !enabled;
    }
    if (lightboxNext) {
      lightboxNext.hidden = !enabled;
    }
    if (miniPrintCartBtn) {
      miniPrintCartBtn.hidden = !enabled;
    }
  };

  const collectMiniPrintGalleryItems = () => {
    const artCards = shopRoot.querySelectorAll('.product-card[data-category="art"]');
    return Array.from(artCards)
      .map((card) => {
        const cardTitle = card.querySelector("h2");
        const image = card.querySelector(".product-image");
        if (!cardTitle || !image) {
          return null;
        }
        const name = cardTitle.textContent.trim();
        const src = image.currentSrc || image.getAttribute("src") || "";
        return {
          name,
          src,
          alt: `${name} mini art print preview`
        };
      })
      .filter((item) => item && item.src);
  };

  const renderMiniPrintGalleryItem = () => {
    const item = miniPrintGalleryItems[miniPrintIndex];
    if (!item || !lightboxImage) {
      return;
    }

    lightboxImage.src = item.src;
    lightboxImage.alt = item.alt;

    if (lightboxCaption) {
      lightboxCaption.textContent = `${item.name} - Mini Art Print`;
    }
    if (lightboxTitle) {
      lightboxTitle.textContent = item.name;
    }
    if (miniPrintCartBtn) {
      miniPrintCartBtn.textContent = `Add ${item.name} Mini Print to Cart`;
    }

    const singleItem = miniPrintGalleryItems.length <= 1;
    if (lightboxPrev) {
      lightboxPrev.disabled = singleItem;
    }
    if (lightboxNext) {
      lightboxNext.disabled = singleItem;
    }
  };

  const openRegularLightbox = (img, titleText = "") => {
    if (!lightbox || !lightboxImage) {
      return;
    }
    miniPrintGalleryOpen = false;
    setMiniPrintUI(false);
    lightboxImage.src = img.currentSrc || img.src;
    lightboxImage.alt = img.alt || "Product image preview";

    if (lightboxCaption) {
      lightboxCaption.textContent = titleText || img.alt || "";
    }
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  };

  const openMiniPrintGalleryLightbox = () => {
    if (!lightbox || !lightboxImage) {
      return;
    }
    miniPrintGalleryItems = collectMiniPrintGalleryItems();
    if (miniPrintGalleryItems.length === 0) {
      return;
    }
    miniPrintGalleryOpen = true;
    miniPrintIndex = 0;
    setMiniPrintUI(true);
    renderMiniPrintGalleryItem();
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  };

  const stepMiniPrintGallery = (direction) => {
    if (!miniPrintGalleryOpen || miniPrintGalleryItems.length < 2) {
      return;
    }
    const max = miniPrintGalleryItems.length;
    miniPrintIndex = (miniPrintIndex + direction + max) % max;
    renderMiniPrintGalleryItem();
  };

  const closeLightbox = () => {
    if (!lightbox || !lightboxImage) {
      return;
    }
    lightbox.hidden = true;
    lightboxImage.src = "";
    if (lightboxCaption) {
      lightboxCaption.textContent = "";
    }
    miniPrintGalleryOpen = false;
    setMiniPrintUI(false);
    document.body.style.overflow = "";
  };

  productCtaButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".product-card");
      if (card && card.dataset.miniPrintGallery === "art") {
        openMiniPrintGalleryLightbox();
        return;
      }

      if (!window.CartStore) {
        return;
      }

      const item = buildItemFromCard(card);
      if (!item) {
        return;
      }
      window.CartStore.addItem(item);
      flashButton(button, "Added");
    });
  });

  if (miniPrintCartBtn) {
    miniPrintCartBtn.addEventListener("click", () => {
      if (!window.CartStore || !miniPrintGalleryOpen) {
        return;
      }
      const miniPrintCard = shopRoot.querySelector('[data-mini-print-gallery="art"]');
      const activeMini = miniPrintGalleryItems[miniPrintIndex];
      if (!miniPrintCard || !activeMini) {
        return;
      }

      const item = buildItemFromCard(miniPrintCard, {
        name: `${activeMini.name} Mini Print`,
        category: "Art Prints",
        image: activeMini.src,
        idPrefix: "mini-print"
      });

      if (!item) {
        return;
      }
      window.CartStore.addItem(item);
      flashButton(miniPrintCartBtn, "Added");
    });
  }

  productImageButtons.forEach((button) => {
    const img = button.querySelector("img");
    if (!img) {
      return;
    }

    if (img.complete && img.naturalWidth > 0) {
      setImageOrientation(img, button);
    } else {
      img.addEventListener("load", () => setImageOrientation(img, button), { once: true });
    }

    button.addEventListener("click", () => {
      const card = button.closest(".product-card");
      const title = card && card.querySelector("h2") ? card.querySelector("h2").textContent.trim() : "";
      if (card && card.dataset.miniPrintGallery === "art") {
        openMiniPrintGalleryLightbox();
        return;
      }
      openRegularLightbox(img, title);
    });
  });

  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", () => stepMiniPrintGallery(-1));
  }

  if (lightboxNext) {
    lightboxNext.addEventListener("click", () => stepMiniPrintGallery(1));
  }

  if (lightbox) {
    lightbox.addEventListener("click", (event) => {
      const target = event.target;
      if (target instanceof Element && target.hasAttribute("data-lightbox-close")) {
        closeLightbox();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (miniPrintGalleryOpen && event.key === "ArrowLeft") {
      stepMiniPrintGallery(-1);
      return;
    }
    if (miniPrintGalleryOpen && event.key === "ArrowRight") {
      stepMiniPrintGallery(1);
      return;
    }
    if (event.key === "Escape" && lightbox && !lightbox.hidden) {
      closeLightbox();
    }
  });
}
