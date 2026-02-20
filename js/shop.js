const shopRoot = document.querySelector("#shop-products");
const tabButtons = document.querySelectorAll(".shop-tab");
const artTypeButtons = document.querySelectorAll(".art-type");
const accessoryTypeButtons = document.querySelectorAll(".accessory-type");
const artTypeControls = document.querySelector("#art-type-controls");
const accessoryTypeControls = document.querySelector("#accessory-type-controls");
const emptyState = document.querySelector("#shop-empty");

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
}
