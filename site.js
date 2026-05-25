const menuButtons = document.querySelectorAll(".menu-button");
const normalizeText = (value) => value.toLowerCase().replace(/\s+/g, "");

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

const getSearchValue = (scope) => scope.querySelector('input[type="search"]')?.value.trim() || "";

const getOrCreateEmptyState = (container, message) => {
  let empty = container.querySelector(".empty-state");
  if (!empty) {
    empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = message;
    container.appendChild(empty);
  }
  return empty;
};

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

const applyExamResults = (filter) => {
  const page = filter.closest(".exam-content");
  const results = page?.querySelector(".exam-results");
  if (!results) return;

  const query = normalizeText(getSearchValue(filter));
  const activeMonths = Array.from(filter.querySelectorAll(".month-options .filter-chip.active")).map((chip) => normalizeText(chip.textContent));
  const visibleMonths = activeMonths.length ? activeMonths : [];
  let visibleCount = 0;

  results.querySelectorAll(".exam-result-group").forEach((group) => {
    const text = normalizeText(group.textContent);
    const monthMatch = !visibleMonths.length || visibleMonths.some((month) => text.includes(month));
    const queryMatch = !query || text.includes(query);
    const visible = monthMatch && queryMatch;
    group.hidden = !visible;
    visibleCount += visible ? 1 : 0;
  });

  const empty = getOrCreateEmptyState(results, "검색 조건에 맞는 기출 자료가 없습니다.");
  empty.hidden = visibleCount > 0;
};

const applyWorkbookResults = (filter) => {
  const page = filter.closest(".workbook-content");
  const list = page?.querySelector(".book-list");
  if (!list) return;

  const query = normalizeText(getSearchValue(filter));
  const activePublishers = Array.from(filter.querySelectorAll(".publisher-options .filter-chip.active"))
    .map((chip) => chip.textContent.trim())
    .filter((text) => text !== "전체")
    .map(normalizeText);
  const activeLevel = normalizeText(filter.querySelector(".filter-row:nth-child(2) .filter-chip.active")?.textContent || "");
  let visibleCount = 0;

  list.querySelectorAll(".book-item").forEach((item) => {
    const text = normalizeText(item.textContent);
    const publisherMatch = query || !activePublishers.length || activePublishers.some((publisher) => text.includes(publisher));
    const queryMatch = !query || text.includes(query);
    const levelMatch = !activeLevel || text.includes(activeLevel) || activeLevel === "초급" || activeLevel === "중급";
    const visible = publisherMatch && queryMatch && levelMatch;
    item.hidden = !visible;
    item.classList.remove("is-extra-hidden");
    visibleCount += visible ? 1 : 0;
  });

  const moreButton = page.querySelector(".more-books");
  if (moreButton) {
    moreButton.dataset.expanded = "true";
    moreButton.textContent = "접기";
  }

  const metaCount = page.querySelector(".book-meta strong");
  if (metaCount) metaCount.textContent = `${visibleCount}개`;

  const empty = getOrCreateEmptyState(list, "검색 조건에 맞는 문제집이 없습니다.");
  empty.hidden = visibleCount > 0;
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
  applyExamResults(filter);
  applyWorkbookResults(filter);
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
    applyExamResults(filter);
    applyWorkbookResults(filter);
  });

  filter.addEventListener("submit", (event) => {
    event.preventDefault();
    filter.classList.add("searched");
    applyExamResults(filter);
    applyWorkbookResults(filter);
  });

  filter.addEventListener("input", (event) => {
    if (event.target.matches('input[type="search"]')) {
      applyExamResults(filter);
      applyWorkbookResults(filter);
    }
  });

  filter.querySelector('input[type="search"]')?.addEventListener("input", () => {
    applyExamResults(filter);
    applyWorkbookResults(filter);
  });

  actions?.querySelector("button:first-child")?.addEventListener("click", () => {
    filter.innerHTML = initialState;
    filter.classList.remove("is-collapsed", "searched");
    filter.style.display = "";
    updateWorkbookTags(filter);
    updateExamHeading(filter);
    applyExamResults(filter);
    applyWorkbookResults(filter);
  });

  actions?.querySelector("button:last-child")?.addEventListener("click", (event) => {
    filter.classList.toggle("is-collapsed");
    const collapsed = filter.classList.contains("is-collapsed");
    event.currentTarget.textContent = collapsed ? "검색 옵션 펼치기 ⓘ" : "검색 옵션 접기 ⓘ";
  });

  updateWorkbookTags(filter);
  updateExamHeading(filter);
  applyExamResults(filter);
  applyWorkbookResults(filter);
});

document.querySelectorAll(".book-meta button").forEach((button) => {
  if (button.parentElement?.querySelector("button") === button) {
    button.classList.add("active");
  }

  button.addEventListener("click", () => {
    button.closest(".book-meta")?.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    const list = button.closest(".workbook-content")?.querySelector(".book-list");
    if (!list) return;
    const items = Array.from(list.querySelectorAll(".book-item"));
    const mode = button.textContent.trim();
    items.sort((a, b) => {
      const aText = a.textContent;
      const bText = b.textContent;
      if (mode === "최신순") return (bText.match(/20\d{2}/)?.[0] || "").localeCompare(aText.match(/20\d{2}/)?.[0] || "");
      if (mode === "인기순") return bText.length - aText.length;
      return normalizeText(aText).localeCompare(normalizeText(bText), "ko");
    });
    items.forEach((item) => list.appendChild(item));
  });
});

document.querySelectorAll(".unit-search input").forEach((input) => {
  const list = input.closest(".concept-content")?.querySelector(".lesson-list");
  if (!list) return;

  input.addEventListener("input", () => {
    const query = normalizeText(input.value);
    let visibleCount = 0;
    list.querySelectorAll(".lesson-card").forEach((card) => {
      const visible = !query || normalizeText(card.textContent).includes(query);
      card.hidden = !visible;
      visibleCount += visible ? 1 : 0;
    });
    const empty = getOrCreateEmptyState(list, "검색 조건에 맞는 개념이 없습니다.");
    empty.hidden = visibleCount > 0;
  });
});

document.querySelectorAll(".concept-sidebar").forEach((sidebar) => {
  sidebar.querySelectorAll(".stage-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      sidebar.querySelectorAll(".stage-pill").forEach((item) => item.classList.remove("active"));
      pill.classList.add("active");
    });
  });

  sidebar.querySelectorAll(".side-group > button").forEach((button) => {
    button.addEventListener("click", () => {
      const group = button.parentElement;
      const willOpen = !group.classList.contains("open");
      group.classList.toggle("open", willOpen);
      group.classList.toggle("collapsed", !willOpen);
      const arrow = button.querySelector("span");
      if (arrow) arrow.textContent = willOpen ? "⌄" : "›";

      if (willOpen && !group.querySelector("ul, ol")) {
        const list = document.createElement(sidebar.classList.contains("detail-sidebar") ? "ol" : "ul");
        ["대표 개념", "핵심 유형", "기출 연결"].forEach((text) => {
          const item = document.createElement("li");
          const link = document.createElement("a");
          link.href = sidebar.classList.contains("detail-sidebar") ? "#top" : "./concept-detail.html";
          link.textContent = text;
          item.appendChild(link);
          list.appendChild(item);
        });
        group.appendChild(list);
      }
    });
  });
});

const chapterData = {
  "Geometry": [
    ["1", "Points, Lines, and Planes", "Segments, rays, angles, angle pairs, angle bisectors"],
    ["2", "Reasoning and Proof", "Inductive/deductive reasoning, two-column proofs"],
    ["3", "Parallel Lines", "Transversals, corresponding/alternate angles"],
    ["4-5", "Triangles & Congruence", "Triangle relationships, SSS/SAS/ASA/AAS congruence"],
    ["7-8", "Right Triangles & Trig", "Pythagorean theorem, special triangles, SOHCAHTOA"],
    ["10", "Circles", "Arcs, chords, inscribed angles, tangent lines"]
  ],
  "AP Statistics": [
    ["1", "Exploring One-Variable Data", "Distributions, center, spread, outliers"],
    ["2", "Two-Variable Data", "Scatterplots, correlation, regression"],
    ["3", "Collecting Data", "Sampling methods and experiment design"],
    ["4", "Probability", "Rules, conditional probability, independence"],
    ["5", "Sampling Distributions", "Means, proportions, variability"],
    ["6", "Inference", "Confidence intervals and significance tests"]
  ],
  "Pre-Algebra": [
    ["1", "Integers", "Positive and negative numbers on the number line"],
    ["2", "Fractions", "Equivalent fractions and operations"],
    ["3", "Ratios", "Rates, proportions, percent change"],
    ["4", "Expressions", "Variables, terms, and evaluation"],
    ["5", "Equations", "One-step and two-step equations"],
    ["6", "Graphs", "Coordinate plane and simple patterns"]
  ],
  "Algebra2": [
    ["1", "Functions", "Domain, range, transformations"],
    ["2", "Quadratics", "Factoring, vertex form, roots"],
    ["3", "Polynomials", "Operations and factor theorem"],
    ["4", "Rational Expressions", "Simplifying and solving rational equations"],
    ["5", "Exponential Models", "Growth, decay, logarithms"],
    ["6", "Sequences", "Arithmetic and geometric sequences"]
  ],
  "Precalculus": [
    ["1", "Trigonometric Functions", "Unit circle, graphs, identities"],
    ["2", "Advanced Functions", "Composition and inverse functions"],
    ["3", "Limits", "Graphical and numerical limits"],
    ["4", "Vectors", "Magnitude, direction, components"],
    ["5", "Matrices", "Operations and systems"],
    ["6", "Conics", "Parabolas, ellipses, hyperbolas"]
  ],
  "AP Calculus AB / BC": [
    ["1", "Limits and Continuity", "Limit laws and continuity"],
    ["2", "Derivatives", "Definition, rules, applications"],
    ["3", "Integrals", "Accumulation and antiderivatives"],
    ["4", "Differential Equations", "Slope fields and separable equations"],
    ["5", "Series", "Taylor series and convergence"],
    ["6", "FRQ Practice", "Scoring guidelines and released questions"]
  ]
};

document.querySelectorAll(".testbook-section").forEach((section) => {
  const tabs = section.querySelectorAll(".testbook-tabs button");
  const grid = section.querySelector(".chapter-grid");
  if (!grid) return;

  const renderChapters = (label) => {
    const chapters = chapterData[label] || chapterData.Geometry;
    grid.innerHTML = chapters.map((chapter, index) => `
      <article class="chapter-card${index === 0 ? " active" : ""}">
        <span>${chapter[0]}</span><small>more</small><h3>${chapter[1]}</h3><p>${chapter[2]}</p>
      </article>
    `).join("");
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((item) => {
        item.classList.remove("active");
        item.querySelector("span")?.remove();
      });
      tab.classList.add("active");
      if (!tab.querySelector("span")) {
        const arrow = document.createElement("span");
        arrow.textContent = "→";
        tab.appendChild(arrow);
      }
      renderChapters(tab.childNodes[0].textContent.trim());
    });
  });
});

document.querySelectorAll(".more-books").forEach((button) => {
  const list = button.closest(".workbook-content")?.querySelector(".book-list");
  if (!list) return;
  const items = Array.from(list.querySelectorAll(".book-item"));
  const collapse = () => {
    items.forEach((item, index) => item.classList.toggle("is-extra-hidden", index >= 6));
    button.dataset.expanded = "false";
    button.textContent = "더보기";
  };
  const expand = () => {
    items.forEach((item) => item.classList.remove("is-extra-hidden"));
    button.dataset.expanded = "true";
    button.textContent = "접기";
  };
  collapse();
  button.addEventListener("click", () => {
    button.dataset.expanded === "true" ? collapse() : expand();
  });
});

document.querySelectorAll(".download-card button, .book-buttons button, .book-detail-actions button").forEach((button) => {
  button.addEventListener("click", () => {
    const original = button.textContent;
    button.textContent = "준비 중";
    button.classList.add("is-clicked");
    window.setTimeout(() => {
      button.textContent = original;
      button.classList.remove("is-clicked");
    }, 900);
  });
});
