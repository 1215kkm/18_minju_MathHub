const lessonLinks = Array.from(document.querySelectorAll(".detail-panel ol a"));
const lessonSections = lessonLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const setActiveLesson = (id) => {
  lessonLinks.forEach((link) => {
    link.parentElement.classList.toggle("active", link.getAttribute("href") === `#${id}`);
  });
};

const updateActiveLesson = () => {
  const anchorLine = window.scrollY + window.innerHeight * 0.36;
  let current = lessonSections[0];

  lessonSections.forEach((section) => {
    if (section.offsetTop <= anchorLine) {
      current = section;
    }
  });

  if (current) {
    setActiveLesson(current.id);
  }
};

lessonLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const id = link.getAttribute("href").slice(1);
    setActiveLesson(id);
  });
});

window.addEventListener("scroll", updateActiveLesson, { passive: true });
window.addEventListener("resize", updateActiveLesson);
window.addEventListener("load", updateActiveLesson);
updateActiveLesson();
setTimeout(updateActiveLesson, 0);
