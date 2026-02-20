const shopRoot = document.querySelector("#shop-products");
const tabButtons = document.querySelectorAll(".shop-tab");
const artTypeButtons = document.querySelectorAll(".art-type");
const accessoryTypeButtons = document.querySelectorAll(".accessory-type");
const artTypeControls = document.querySelector("#art-type-controls");
const accessoryTypeControls = document.querySelector("#accessory-type-controls");
const emptyState = document.querySelector("#shop-empty");
const productImageButtons = document.querySelectorAll(".product-image-btn");
const lightbox = document.querySelector("#image-lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");

if (shopRoot && tabButtons.length > 0) {
  let activeTab = "art";
  let activeArtType = "all";
  let activeAccessoryType = "all";
  let showTypeControls = true;

  const applyFilters = () => {
    const cards = shopRoot.querySelectorAll(".product-card");
    let visibleCount = 0;

    cards.forEach((card) => {
      const category = card.dataset.category;
      const artType = card.dataset.artType || "";
      const accessoryType = card.dataset.accessoryType || "";
      const tabMatch = category === activeTab;
      const artTypeMatch = activeTab !== "art" || activeArtType === "all" || artType === activeArtType;
      const accessoryTypeMatch =
        activeTab !== "accessories" || activeAccessoryType === "all" || accessoryType === activeAccessoryType;
      const visible = tabMatch && artTypeMatch && accessoryTypeMatch;

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
  };

  const setActiveTab = (tab) => {
    activeTab = tab;
    tabButtons.forEach((button) => {
      const selected = button.dataset.tab === tab;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-selected", String(selected));
    });
    applyFilters();
  };

  const setActiveArtType = (artType) => {
    activeArtType = artType;
    artTypeButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.artType === artType);
    });
    applyFilters();
  };

  const setActiveAccessoryType = (accessoryType) => {
    activeAccessoryType = accessoryType;
    accessoryTypeButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.accessoryType === accessoryType);
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

  setActiveTab(activeTab);
  setActiveArtType(activeArtType);
  setActiveAccessoryType(activeAccessoryType);

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
