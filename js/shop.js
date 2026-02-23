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
const lightbox = document.querySelector("#image-lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");

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
        activeTab !== "art-prints" || activeArtPrintType === "all" || artPrintType === activeArtPrintType;
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

  const openLightbox = (img) => {
    if (!lightbox || !lightboxImage) {
      return;
    }

    lightboxImage.src = img.currentSrc || img.src;
    lightboxImage.alt = img.alt || "Product image preview";

    if (lightboxCaption) {
      lightboxCaption.textContent = img.alt || "";
    }

    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    if (!lightbox || !lightboxImage) {
      return;
    }
    lightbox.hidden = true;
    lightboxImage.src = "";
    document.body.style.overflow = "";
  };

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

    button.addEventListener("click", () => openLightbox(img));
  });

  if (lightbox) {
    lightbox.addEventListener("click", (event) => {
      const target = event.target;
      if (target instanceof Element && target.hasAttribute("data-lightbox-close")) {
        closeLightbox();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox && !lightbox.hidden) {
      closeLightbox();
    }
  });
}
