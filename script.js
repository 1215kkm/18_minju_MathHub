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

const slider = document.querySelector("[data-slider]");
const track = document.querySelector("[data-slider-track]");
const prev = document.querySelector("[data-slider-prev]");
const next = document.querySelector("[data-slider-next]");
const dots = document.querySelector("[data-slider-dots]");

if (slider && track && dots) {
  const cards = Array.from(track.children);
  let index = 0;
  let timer = 0;

  const visibleCards = () => {
    if (window.innerWidth < 760) return 1;
    if (window.innerWidth < 1080) return 3;
    return 4;
  };

  const maxIndex = () => Math.max(0, cards.length - visibleCards());

  const renderDots = () => {
    dots.innerHTML = "";
    for (let i = 0; i <= maxIndex(); i += 1) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `${i + 1}번째 후기 보기`);
      dot.addEventListener("click", () => {
        index = i;
        updateSlider();
        restartAutoSlide();
      });
      dots.appendChild(dot);
    }
  };

  const updateSlider = () => {
    index = Math.min(index, maxIndex());
    const card = cards[0];
    const gap = Number.parseFloat(getComputedStyle(track).gap) || 0;
    const move = index * (card.getBoundingClientRect().width + gap);
    track.style.transform = `translateX(${-move}px)`;
    Array.from(dots.children).forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === index);
    });
  };

  const moveBy = (amount) => {
    index = index + amount;
    if (index > maxIndex()) index = 0;
    if (index < 0) index = maxIndex();
    updateSlider();
  };

  const restartAutoSlide = () => {
    window.clearInterval(timer);
    timer = window.setInterval(() => moveBy(1), 3600);
  };

  prev?.addEventListener("click", () => {
    moveBy(-1);
    restartAutoSlide();
  });

  next?.addEventListener("click", () => {
    moveBy(1);
    restartAutoSlide();
  });

  slider.addEventListener("mouseenter", () => window.clearInterval(timer));
  slider.addEventListener("mouseleave", restartAutoSlide);
  window.addEventListener("resize", () => {
    renderDots();
    updateSlider();
  });

  renderDots();
  updateSlider();
  restartAutoSlide();
}
