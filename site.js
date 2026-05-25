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

const getRowLabel = (chip) => chip.closest(".filter-row")?.querySelector(".filter-label")?.textContent.trim() || "";

const isMultiSelectRow = (chip) => {
  const label = getRowLabel(chip);
  const filter = chip.closest(".exam-filter");
  return label === "시행월" || (filter?.classList.contains("workbook-filter") && label === "출판사");
};

const updateWorkbookTags = (filter) => {
  const tagBox = filter.querySelector(".selected-tags");
  if (!tagBox) return;

  const selected = [];
  const checkedRadio = filter.querySelector(".radio-options input:checked");
  if (checkedRadio) {
    selected.push(checkedRadio.parentElement.textContent.trim());
  }

  filter.querySelectorAll(".filter-chip.active").forEach((chip) => {
    const text = chip.textContent.trim();
    if (text !== "전체") {
      selected.push(text);
    }
  });

  tagBox.innerHTML = selected.map((text) => `<span>${text} ×</span>`).join("");
};

const updateExamHeading = (filter) => {
  const examPage = filter.closest(".exam-content");
  const heading = examPage?.querySelector(".exam-results > h2");
  if (!heading) return;

  const year = filter.querySelector(".year-options .filter-chip.active")?.textContent.trim() || "2026";
  const grade = filter.querySelector(".radio-options input:checked")?.parentElement.textContent.trim() || "고 3";
  heading.textContent = `${year} ${grade}`;
};

const setChipActive = (chip) => {
  const row = chip.closest(".filter-row");
  const label = getRowLabel(chip);
  const filter = chip.closest(".exam-filter");
  const isMulti = isMultiSelectRow(chip);
  const isAll = chip.textContent.trim() === "전체";

  if (isMulti) {
    if (isAll) {
      row.querySelectorAll(".filter-chip").forEach((item) => item.classList.remove("active"));
      chip.classList.add("active");
    } else {
      row.querySelector(".filter-chip")?.textContent.trim() === "전체" && row.querySelector(".filter-chip")?.classList.remove("active");
      chip.classList.toggle("active");
      const hasActive = row.querySelector(".filter-chip.active");
      if (!hasActive) {
        row.querySelector(".filter-chip")?.classList.add("active");
      }
    }
  } else {
    row.querySelectorAll(".filter-chip").forEach((item) => item.classList.remove("active"));
    chip.classList.add("active");
  }

  if (label === "자료년도") updateExamHeading(filter);
  updateWorkbookTags(filter);
};

document.querySelectorAll(".exam-filter").forEach((filter) => {
  const initialState = filter.innerHTML;
  const actions = filter.nextElementSibling;

  filter.addEventListener("click", (event) => {
    const chip = event.target.closest(".filter-chip");
    if (chip) {
      setChipActive(chip);
    }
  });

  filter.addEventListener("change", () => {
    updateWorkbookTags(filter);
    updateExamHeading(filter);
  });

  filter.addEventListener("submit", (event) => {
    event.preventDefault();
    filter.classList.add("searched");
  });

  actions?.querySelector("button:first-child")?.addEventListener("click", () => {
    filter.innerHTML = initialState;
    filter.classList.remove("is-collapsed", "searched");
    filter.style.display = "";
    updateWorkbookTags(filter);
    updateExamHeading(filter);
  });

  actions?.querySelector("button:last-child")?.addEventListener("click", (event) => {
    filter.classList.toggle("is-collapsed");
    const collapsed = filter.classList.contains("is-collapsed");
    event.currentTarget.textContent = collapsed ? "검색 옵션 펼치기 ⓘ" : "검색 옵션 접기 ⓘ";
  });

  updateWorkbookTags(filter);
  updateExamHeading(filter);
});

document.querySelectorAll(".book-meta button").forEach((button) => {
  if (button.parentElement?.querySelector("button") === button) {
    button.classList.add("active");
  }

  button.addEventListener("click", () => {
    button.closest(".book-meta")?.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
  });
});
