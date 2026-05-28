const searchForm = document.querySelector("[data-search-form]");
const searchFeedback = document.querySelector("[data-search-feedback]");
const examButtons = document.querySelectorAll(".exam-logo");

const goToSearch = (query) => {
  window.location.href = `./search.html?q=${encodeURIComponent(query)}`;
};

searchForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = searchForm.querySelector("input");
  const query = input.value.trim() || input.placeholder.replace("# ", "");
  goToSearch(query);
});

examButtons.forEach((button) => {
  button.addEventListener("click", () => {
    examButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    const label = button.textContent.replace(/\s+/g, " ").trim();
    const input = searchForm?.querySelector("input");
    if (input) input.value = label;
    if (searchFeedback) {
      searchFeedback.innerHTML = `${label} · <a href="./search.html?q=${encodeURIComponent(label)}">검색 결과 보기</a>`;
    }
  });
});

document.querySelectorAll(".curriculum-card").forEach((card) => {
  card.addEventListener("click", () => {
    card.classList.add("is-selected");
    window.setTimeout(() => card.classList.remove("is-selected"), 420);
  });
});

const reviewTrack = document.querySelector("[data-review-track]");

if (reviewTrack) {
  const originalCards = Array.from(reviewTrack.children);
  for (let i = 0; i < 2; i++) {
    originalCards.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      reviewTrack.appendChild(clone);
    });
  }
}
