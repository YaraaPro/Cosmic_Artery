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
const lightboxContent = document.querySelector(".lightbox-content");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");
const lightboxTitle = document.querySelector("#lightbox-title");
const lightboxPrev = document.querySelector("[data-lightbox-prev]");
const lightboxNext = document.querySelector("[data-lightbox-next]");
const miniPrintCartBtn = document.querySelector("#mini-print-cart-btn");

if (shopRoot && tabButtons.length > 0) {
  const HIDDEN_ITEMS_STORAGE_KEY = "expressionism_artery_hidden_items_v1";
  const isManageMode = new URLSearchParams(window.location.search).get("manage") === "1";
  const allCards = Array.from(shopRoot.querySelectorAll(".product-card"));
  let activeTab = "art";
  let activeArtType = "all";
  let activeAccessoryType = "all";
  let activeArtPrintType = "all";
  let activeCommissionType = "all";
  let showTypeControls = true;

  const normalizeId = (value) =>
    String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const loadHiddenItemKeys = () => {
    try {
      const raw = localStorage.getItem(HIDDEN_ITEMS_STORAGE_KEY);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map((item) => String(item || "")) : [];
    } catch (_error) {
      return [];
    }
  };

  const hiddenItemKeys = new Set(loadHiddenItemKeys());

  const saveHiddenItemKeys = () => {
    try {
      localStorage.setItem(HIDDEN_ITEMS_STORAGE_KEY, JSON.stringify(Array.from(hiddenItemKeys)));
    } catch (_error) {
      // Ignore storage errors.
    }
  };

  const getCardVisibilityKey = (card) => String(card?.dataset.visibilityKey || "");
  const isCardStoreHidden = (card) => hiddenItemKeys.has(getCardVisibilityKey(card));
  const isCardHiddenForCustomer = (card) => !isManageMode && isCardStoreHidden(card);

  const updateCardVisibilityUI = (card) => {
    const hidden = isCardStoreHidden(card);
    card.classList.toggle("is-store-hidden", hidden);

    const visibilityBtn = card.querySelector(".visibility-toggle");
    if (!visibilityBtn) {
      return;
    }
    visibilityBtn.textContent = hidden ? "Unhide Item" : "Hide Item";
    visibilityBtn.setAttribute("aria-pressed", String(hidden));
  };

  const toggleCardVisibility = (card) => {
    const key = getCardVisibilityKey(card);
    if (!key) {
      return;
    }
    if (hiddenItemKeys.has(key)) {
      hiddenItemKeys.delete(key);
    } else {
      hiddenItemKeys.add(key);
    }
    saveHiddenItemKeys();
    updateCardVisibilityUI(card);
    applyFilters();
  };

  allCards.forEach((card, index) => {
    const title = card.querySelector("h2");
    const key = `${normalizeId(card.dataset.category || "item")}-${normalizeId(
      title ? title.textContent.trim() : `item-${index + 1}`
    )}-${index + 1}`;
    card.dataset.visibilityKey = key;

    if (isManageMode) {
      const toggleBtn = document.createElement("button");
      toggleBtn.type = "button";
      toggleBtn.className = "visibility-toggle";
      toggleBtn.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleCardVisibility(card);
      });
      card.appendChild(toggleBtn);
    }
    updateCardVisibilityUI(card);
  });

  if (isManageMode) {
    const shopHero = document.querySelector(".shop-main .hero");
    if (shopHero) {
      const note = document.createElement("p");
      note.className = "manage-note";
      note.textContent = "Manage mode is on. Hidden items are visible only to you.";
      shopHero.appendChild(note);
    }
  }

  const applyFilters = () => {
    let visibleCount = 0;

    allCards.forEach((card) => {
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
      const visibleByFilters = tabMatch && artTypeMatch && accessoryTypeMatch && artPrintTypeMatch && commissionTypeMatch;
      const visible = visibleByFilters && (isManageMode || !isCardStoreHidden(card));

      card.classList.toggle("is-hidden", !visible);
      card.hidden = !visible;
      updateCardVisibilityUI(card);
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
    const categoryLabel = categoryMeta.split(/\s*[\u00B7\u2022]\s*/)[0].trim();
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

  let galleryItems = [];
  let galleryIndex = 0;
  let galleryMode = "";

  const setGalleryUI = (mode) => {
    const hasSequenceGallery = mode === "mini" || mode === "commission";

    if (lightboxContent) {
      lightboxContent.classList.toggle("mini-gallery-mode", mode === "mini");
    }
    if (lightboxTitle) {
      lightboxTitle.hidden = !hasSequenceGallery;
    }
    if (lightboxPrev) {
      lightboxPrev.hidden = !hasSequenceGallery;
    }
    if (lightboxNext) {
      lightboxNext.hidden = !hasSequenceGallery;
    }
    if (miniPrintCartBtn) {
      miniPrintCartBtn.hidden = mode !== "mini";
    }
  };

  const collectMiniPrintGalleryItems = () => {
    const artCards = shopRoot.querySelectorAll('.product-card[data-category="art"]');
    return Array.from(artCards)
      .filter((card) => !isCardHiddenForCustomer(card))
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

  const collectCommissionGalleryItems = (card) => {
    if (!card) {
      return [];
    }

    const cardTitle = card.querySelector("h2");
    const baseName = cardTitle ? cardTitle.textContent.trim() : "Commission";
    const galleryImages = card.querySelectorAll(".commission-gallery-image");

    if (galleryImages.length > 0) {
      return Array.from(galleryImages)
        .map((image, index) => {
          const src = image.currentSrc || image.getAttribute("src") || "";
          const label = image.alt && image.alt.trim() ? image.alt.trim() : `${baseName} Example ${index + 1}`;
          return {
            name: label,
            src,
            alt: label
          };
        })
        .filter((item) => item.src);
    }

    const fallbackImage = card.querySelector(".product-image");
    if (!fallbackImage) {
      return [];
    }
    const fallbackSrc = fallbackImage.currentSrc || fallbackImage.getAttribute("src") || "";
    if (!fallbackSrc) {
      return [];
    }
    return [
      {
        name: `${baseName} Example 1`,
        src: fallbackSrc,
        alt: `${baseName} commission example`
      }
    ];
  };

  const renderGalleryItem = () => {
    const item = galleryItems[galleryIndex];
    if (!item || !lightboxImage) {
      return;
    }

    lightboxImage.src = item.src;
    lightboxImage.alt = item.alt;

    if (lightboxCaption) {
      if (galleryMode === "mini") {
        lightboxCaption.textContent = `${item.name} - Mini Art Print`;
      } else if (galleryMode === "commission") {
        lightboxCaption.textContent = `${item.name} - Commission Example`;
      }
    }
    if (lightboxTitle) {
      lightboxTitle.textContent = item.name;
    }
    if (miniPrintCartBtn && galleryMode === "mini") {
      miniPrintCartBtn.textContent = `Add ${item.name} Mini Print to Cart`;
    }

    const singleItem = galleryItems.length <= 1;
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
    galleryMode = "";
    setGalleryUI(galleryMode);
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
    galleryItems = collectMiniPrintGalleryItems();
    if (galleryItems.length === 0) {
      return;
    }
    galleryMode = "mini";
    galleryIndex = 0;
    setGalleryUI(galleryMode);
    renderGalleryItem();
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  };

  const openCommissionGalleryLightbox = (card) => {
    if (!lightbox || !lightboxImage) {
      return;
    }
    galleryItems = collectCommissionGalleryItems(card);
    if (galleryItems.length === 0) {
      return;
    }
    galleryMode = "commission";
    galleryIndex = 0;
    setGalleryUI(galleryMode);
    renderGalleryItem();
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  };

  const stepGallery = (direction) => {
    if (!galleryMode || galleryItems.length < 2) {
      return;
    }
    const max = galleryItems.length;
    galleryIndex = (galleryIndex + direction + max) % max;
    renderGalleryItem();
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
    galleryMode = "";
    setGalleryUI(galleryMode);
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
      if (!window.CartStore || galleryMode !== "mini") {
        return;
      }
      const miniPrintCard = shopRoot.querySelector('[data-mini-print-gallery="art"]');
      const activeMini = galleryItems[galleryIndex];
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
      if (card && (card.dataset.category || "").toLowerCase() === "custom-commissions") {
        openCommissionGalleryLightbox(card);
        return;
      }
      openRegularLightbox(img, title);
    });
  });

  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", () => stepGallery(-1));
  }

  if (lightboxNext) {
    lightboxNext.addEventListener("click", () => stepGallery(1));
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
    if (galleryMode && event.key === "ArrowLeft") {
      stepGallery(-1);
      return;
    }
    if (galleryMode && event.key === "ArrowRight") {
      stepGallery(1);
      return;
    }
    if (event.key === "Escape" && lightbox && !lightbox.hidden) {
      closeLightbox();
    }
  });
}
