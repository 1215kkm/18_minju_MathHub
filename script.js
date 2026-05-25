const searchForm = document.querySelector("[data-search-form]");
const searchFeedback = document.querySelector("[data-search-feedback]");
const examButtons = document.querySelectorAll(".exam-logo");

searchForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = searchForm.querySelector("input");
  const query = input.value.trim() || input.placeholder.replace("# ", "");
  searchFeedback.textContent = `"${query}" 자료를 찾는 중입니다.`;
  searchForm.classList.add("is-submitted");
  window.setTimeout(() => searchForm.classList.remove("is-submitted"), 320);
});

examButtons.forEach((button) => {
  button.addEventListener("click", () => {
    examButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    const label = button.textContent.replace(/\s+/g, " ").trim();
    searchFeedback.textContent = `${label} 자료가 선택되었습니다.`;
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
  originalCards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    reviewTrack.appendChild(clone);
  });
}
