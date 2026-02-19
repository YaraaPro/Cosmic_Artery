const brandToggle = document.querySelector(".brand-toggle");
const siteNav = document.querySelector(".site-nav");
const siteHeader = document.querySelector(".site-header");

if (brandToggle && siteNav) {
  const setOpen = (open) => {
    brandToggle.setAttribute("aria-expanded", String(open));
    siteNav.classList.toggle("is-open", open);
  };

  setOpen(false);

  brandToggle.addEventListener("click", () => {
    const isOpen = brandToggle.getAttribute("aria-expanded") === "true";
    setOpen(!isOpen);
  });

  document.addEventListener("click", (event) => {
    if (siteHeader && !siteHeader.contains(event.target)) {
      setOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setOpen(false);
    }
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });
}
