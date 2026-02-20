const brandToggle = document.querySelector(".brand-toggle");
const siteNav = document.querySelector(".site-nav");
const siteHeader = document.querySelector(".site-header");
const mobileQuery = window.matchMedia("(max-width: 640px)");

if (brandToggle && siteNav) {
  const setOpen = (open) => {
    brandToggle.setAttribute("aria-expanded", String(open));
    siteNav.classList.toggle("is-open", open);
  };

  const syncMode = () => {
    if (mobileQuery.matches) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  syncMode();

  if (typeof mobileQuery.addEventListener === "function") {
    mobileQuery.addEventListener("change", syncMode);
  } else {
    mobileQuery.addListener(syncMode);
  }

  brandToggle.addEventListener("click", () => {
    if (!mobileQuery.matches) {
      return;
    }
    const isOpen = brandToggle.getAttribute("aria-expanded") === "true";
    setOpen(!isOpen);
  });

  document.addEventListener("click", (event) => {
    if (!mobileQuery.matches) {
      return;
    }
    if (siteHeader && !siteHeader.contains(event.target)) {
      setOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!mobileQuery.matches) {
      return;
    }
    if (event.key === "Escape") {
      setOpen(false);
    }
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (mobileQuery.matches) {
        setOpen(false);
      }
    });
  });
}
