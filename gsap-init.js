gsap.registerPlugin(ScrollTrigger);

gsap.defaults({ ease: "power3.out", duration: 0.8 });

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReduced) {

  /* ── Header ── */
  const header = document.querySelector(".site-header");
  if (header) {
    gsap.from(header, {
      y: -30,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out"
    });
  }

  /* ── Main hero (index.html) ── */
  const heroContent = document.querySelector(".hero-content");
  if (heroContent) {
    const tl = gsap.timeline({ delay: 0.15 });
    tl.from(".hero-content h1", { y: 50, opacity: 0, duration: 0.9 })
      .from(".hero-content p", { y: 30, opacity: 0, duration: 0.6 }, "-=0.5")
      .from(".search-box", { y: 25, opacity: 0, scale: 0.97, duration: 0.6 }, "-=0.35")
      .from(".search-feedback", { opacity: 0, duration: 0.3 }, "-=0.2")
      .from(".exam-logo", { y: 20, opacity: 0, scale: 0.9, stagger: 0.07, duration: 0.5 }, "-=0.3");

    gsap.from(".hero-illustration", {
      y: 40,
      opacity: 0,
      duration: 1.2,
      delay: 0.3,
      stagger: 0.15,
      ease: "power2.out"
    });

    gsap.from(".hero-shape", {
      scale: 0,
      opacity: 0,
      duration: 1,
      delay: 0.5,
      stagger: 0.08,
      ease: "back.out(1.7)"
    });
  }

  /* ── Sub-page heroes (concept, exam, workbook, global) ── */
  const subHero = document.querySelector(".concept-hero, .exam-hero, .workbook-hero, .global-hero");
  if (subHero) {
    const tl = gsap.timeline();
    tl.from(subHero, { opacity: 0, duration: 0.5 })
      .from(subHero.querySelector("h1"), { y: 40, opacity: 0, duration: 0.7 }, "-=0.2")
      .from(subHero.querySelector("p"), { y: 25, opacity: 0, duration: 0.5 }, "-=0.35");
  }

  /* ── Section headings ── */
  gsap.utils.toArray(".section-heading").forEach(function(heading) {
    gsap.from(heading.children, {
      scrollTrigger: {
        trigger: heading,
        start: "top 85%",
        toggleActions: "play none none none"
      },
      y: 40,
      opacity: 0,
      stagger: 0.12,
      duration: 0.7
    });
  });

  /* ── Curriculum cards ── */
  gsap.utils.toArray(".curriculum-card").forEach(function(card, i) {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 88%",
        toggleActions: "play none none none"
      },
      y: 60,
      opacity: 0,
      duration: 0.7,
      delay: i * 0.1
    });
  });

  /* ── Feature rows (alternate slide direction) ── */
  gsap.utils.toArray(".feature-row").forEach(function(row, i) {
    var copy = row.querySelector(".feature-copy");
    var img = row.querySelector("img");
    var fromLeft = i % 2 === 0;

    if (copy) {
      gsap.from(copy, {
        scrollTrigger: {
          trigger: row,
          start: "top 82%",
          toggleActions: "play none none none"
        },
        x: fromLeft ? -60 : 60,
        opacity: 0,
        duration: 0.8
      });
    }

    if (img) {
      gsap.from(img, {
        scrollTrigger: {
          trigger: row,
          start: "top 82%",
          toggleActions: "play none none none"
        },
        x: fromLeft ? 60 : -60,
        opacity: 0,
        duration: 0.8,
        delay: 0.15
      });
    }
  });

  /* ── Feature symbols (parallax float) ── */
  gsap.utils.toArray(".feature-symbol").forEach(function(sym) {
    gsap.to(sym, {
      scrollTrigger: {
        trigger: ".features-section",
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5
      },
      y: -80,
      rotation: 15,
      ease: "none"
    });
  });

  /* Review cards: motion handled by the CSS marquee, not GSAP
     (GSAP inline transforms would break the seamless loop + hover lift) */

  /* ── Practice cards (global page) ── */
  gsap.utils.toArray(".practice-card").forEach(function(card, i) {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
        toggleActions: "play none none none"
      },
      y: 45,
      opacity: 0,
      scale: 0.95,
      duration: 0.6,
      delay: i * 0.08
    });
  });

  /* ── Chapter cards (global page) ── */
  gsap.utils.toArray(".chapter-card").forEach(function(card, i) {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
        toggleActions: "play none none none"
      },
      y: 35,
      opacity: 0,
      duration: 0.5,
      delay: i * 0.07
    });
  });

  /* ── Guide cards (global page) ── */
  gsap.utils.toArray(".guide-card").forEach(function(card, i) {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 88%",
        toggleActions: "play none none none"
      },
      y: 50,
      opacity: 0,
      duration: 0.7,
      delay: i * 0.12
    });
  });

  /* ── Testbook tabs ── */
  gsap.utils.toArray(".testbook-tabs button").forEach(function(btn, i) {
    gsap.from(btn, {
      scrollTrigger: {
        trigger: ".testbook-section",
        start: "top 85%",
        toggleActions: "play none none none"
      },
      x: -30,
      opacity: 0,
      duration: 0.5,
      delay: i * 0.06
    });
  });

  /* ── Section h2 (practice/testbook/guide sections on global page) ── */
  gsap.utils.toArray(".practice-section h2, .testbook-section h2, .guide-section h2").forEach(function(h2) {
    gsap.from(h2, {
      scrollTrigger: {
        trigger: h2,
        start: "top 88%",
        toggleActions: "play none none none"
      },
      y: 30,
      opacity: 0,
      duration: 0.6
    });
  });

  /* ── Lesson cards (concept page) ── */
  gsap.utils.toArray(".lesson-card").forEach(function(card, i) {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
        toggleActions: "play none none none"
      },
      x: -40,
      opacity: 0,
      duration: 0.5,
      delay: i * 0.06
    });
  });

  /* ── Sidebar stage pills ── */
  gsap.utils.toArray(".stage-pill").forEach(function(pill, i) {
    gsap.from(pill, {
      scrollTrigger: {
        trigger: pill,
        start: "top 92%",
        toggleActions: "play none none none"
      },
      x: -25,
      opacity: 0,
      duration: 0.4,
      delay: i * 0.05
    });
  });

  /* ── Filter section (exam/workbook pages) ── */
  var examFilter = document.querySelector(".exam-filter, .workbook-filter");
  if (examFilter) {
    gsap.from(examFilter, {
      scrollTrigger: {
        trigger: examFilter,
        start: "top 85%",
        toggleActions: "play none none none"
      },
      y: 40,
      opacity: 0,
      duration: 0.7
    });
  }

  /* ── Content headings on sub-pages ── */
  gsap.utils.toArray(".workbook-content > h2, .exam-content > h2").forEach(function(h2) {
    gsap.from(h2, {
      scrollTrigger: {
        trigger: h2,
        start: "top 88%",
        toggleActions: "play none none none"
      },
      y: 30,
      opacity: 0,
      duration: 0.6
    });
  });

  /* ── Book items (workbook page) ── */
  gsap.utils.toArray(".book-item").forEach(function(item, i) {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: "top 92%",
        toggleActions: "play none none none"
      },
      y: 30,
      opacity: 0,
      duration: 0.5,
      delay: i * 0.05
    });
  });

  /* ── Exam result groups ── */
  gsap.utils.toArray(".exam-result-group").forEach(function(group, i) {
    gsap.from(group, {
      scrollTrigger: {
        trigger: group,
        start: "top 92%",
        toggleActions: "play none none none"
      },
      y: 30,
      opacity: 0,
      duration: 0.5,
      delay: i * 0.06
    });
  });

  /* ── Detail pages ── */
  var detailTitle = document.querySelector(".detail-title-row");
  if (detailTitle) {
    gsap.from(detailTitle, { y: 35, opacity: 0, duration: 0.7, delay: 0.1 });
  }

  gsap.utils.toArray(".detail-summary-grid article").forEach(function(card, i) {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
        toggleActions: "play none none none"
      },
      y: 30,
      opacity: 0,
      scale: 0.96,
      duration: 0.5,
      delay: i * 0.08
    });
  });

  gsap.utils.toArray(".detail-panel-card").forEach(function(card) {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 88%",
        toggleActions: "play none none none"
      },
      y: 40,
      opacity: 0,
      duration: 0.6
    });
  });

  /* ── Download cards ── */
  gsap.utils.toArray(".download-card").forEach(function(card, i) {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
        toggleActions: "play none none none"
      },
      y: 25,
      opacity: 0,
      duration: 0.5,
      delay: i * 0.08
    });
  });

  /* ── Guide detail hero ── */
  var guideHero = document.querySelector(".guide-detail-hero, .book-detail-hero");
  if (guideHero) {
    gsap.from(guideHero, { y: 30, opacity: 0, duration: 0.7, delay: 0.1 });
  }

  /* ── Chapter list (detail pages) ── */
  gsap.utils.toArray(".chapter-list a").forEach(function(link, i) {
    gsap.from(link, {
      scrollTrigger: {
        trigger: link,
        start: "top 92%",
        toggleActions: "play none none none"
      },
      y: 20,
      opacity: 0,
      duration: 0.4,
      delay: i * 0.05
    });
  });

  /* ── Footer ── */
  var footer = document.querySelector(".site-footer");
  if (footer) {
    gsap.from(".footer-inner", {
      scrollTrigger: {
        trigger: footer,
        start: "top 92%",
        toggleActions: "play none none none"
      },
      y: 30,
      opacity: 0,
      duration: 0.6
    });
  }
}
