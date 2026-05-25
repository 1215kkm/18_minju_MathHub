const menuButtons = document.querySelectorAll(".menu-button");

menuButtons.forEach((button) => {
  const header = button.closest(".site-header");
  const menu = header?.querySelector(".mobile-menu");
  const close = menu?.querySelector(".mobile-close");
  const countryToggle = menu?.querySelector(".mobile-country-toggle");

  const setOpen = (open) => {
    menu?.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    button.setAttribute("aria-expanded", String(open));
    menu?.setAttribute("aria-hidden", String(!open));
  };

  button.addEventListener("click", () => setOpen(true));
  close?.addEventListener("click", () => setOpen(false));
  menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setOpen(false)));

  countryToggle?.addEventListener("click", () => {
    const expanded = countryToggle.getAttribute("aria-expanded") === "true";
    countryToggle.setAttribute("aria-expanded", String(!expanded));
    menu?.classList.toggle("country-open", !expanded);
  });
});
