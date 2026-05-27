const searchForm = document.querySelector("[data-search-form]");
const searchFeedback = document.querySelector("[data-search-feedback]");
const examButtons = document.querySelectorAll(".exam-logo");

const getSearchTarget = (query) => {
  const text = query.toLowerCase();
  if (/sat|ap|amc|psat|maa|usa|미국/.test(text)) return { href: "./global.html", label: "국가별 과정" };
  if (/기출|모의|수능|학력|exam|past/.test(text)) return { href: "./past-exams.html", label: "기출 문제" };
  if (/문제집|해설|쎈|rpm|ebs|book/.test(text)) return { href: "./workbooks.html", label: "문제집 & 해설" };
  if (/개념|소수|유리수|연산|concept/.test(text)) return { href: "./concepts.html", label: "개념 완성" };
  return { href: "./global.html", label: "통합 자료" };
};

searchForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = searchForm.querySelector("input");
  const query = input.value.trim() || input.placeholder.replace("# ", "");
  const target = getSearchTarget(query);
  searchFeedback.innerHTML = `"${query}" 결과 · <a href="${target.href}">${target.label}</a>`;
  searchForm.classList.add("is-submitted");
  window.setTimeout(() => searchForm.classList.remove("is-submitted"), 320);
});

examButtons.forEach((button) => {
  button.addEventListener("click", () => {
    examButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    const label = button.textContent.replace(/\s+/g, " ").trim();
    const input = searchForm?.querySelector("input");
    if (input) input.value = label;
    const target = getSearchTarget(label);
    searchFeedback.innerHTML = `${label} 선택됨 · <a href="${target.href}">자료 보기</a>`;
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
