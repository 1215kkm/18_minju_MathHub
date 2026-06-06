/**
 * 개념 상세 라우팅 (?topic=slug)
 * - 토픽별 제목/breadcrumb/사이드바 단원 목록을 렌더한다.
 * - 데이터는 사이트에 이미 존재하는 정보(concepts.html 구조, 제목)만 사용.
 * - "numbers"(수와 연산)는 HTML에 풍부한 본문이 그대로 있으므로 그대로 보존하고,
 *   상세 본문이 아직 없는 토픽은 "준비 중" 안내로 정직하게 처리한다.
 */
(function () {
  /* ── 개인화 저장소 (site.js와 동일 네임스페이스, 독립 구현) ──
     concept-detail은 topic마다 식별자가 달라 여기서 직접 다룬다.
     localStorage 접근 실패(프라이빗 모드 등) 시 try/catch로 무동작. */
  const STORE = {
    bookmarks: "mathhub:bookmarks",
    recent: "mathhub:recent",
    progress: "mathhub:progress",
  };
  const readStore = (key, fallback) => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
      return fallback;
    }
  };
  const writeStore = (key, value) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (_) {
      /* 무동작 */
    }
  };

  // 스테이지/단원 트리 — concepts.html의 구조 그대로
  const STAGE_LABEL = "중학교 1학년";

  // 같은 스테이지(중1)에 속한 단원들. 사이드바 다른 단원 토글에 사용.
  const UNIT_ORDER = ["numbers", "letters-expressions", "linear-equations", "coordinates-graphs"];

  const TOPICS = {
    numbers: {
      title: "수와 연산",
      desc: "정수와 유리수의 개념을 이해하고, 사칙연산을 완벽히 익혀보세요.",
      // numbers는 HTML 원본 본문을 그대로 쓴다. lessons는 사이드바 렌더용.
      lessons: [
        { id: "lesson-1", label: "1. 소수와 합성수" },
        { id: "lesson-2", label: "2. 소인수분해" },
        { id: "lesson-3", label: "3. 최대공약수와<br />최소공배수" },
        { id: "lesson-4", label: "4. 정수와 유리수" },
        { id: "lesson-5", label: "5. 절댓값과 대소관계" },
        { id: "lesson-6", label: "6. 정수와 유리수의<br />사칙연산" }
      ],
      hasBody: true
    },
    "letters-expressions": {
      title: "문자와 식",
      desc: "문자를 이용한 식의 표현과 일차식 계산의 핵심 개념을 익혀보세요.",
      lessons: [
        { label: "1. 문자의 사용과 식" },
        { label: "2. 일차식의 계산" },
        { label: "3. 식의 값" }
      ],
      hasBody: false
    },
    "linear-equations": {
      title: "일차방정식",
      desc: "방정식의 풀이 원리와 활용 문제 접근법을 단계별로 학습합니다.",
      lessons: [
        { label: "1. 방정식과 항등식" },
        { label: "2. 일차방정식의 풀이" },
        { label: "3. 일차방정식의 활용" }
      ],
      hasBody: false
    },
    "coordinates-graphs": {
      title: "좌표와 그래프",
      desc: "순서쌍과 좌표평면, 그래프 해석의 기초를 다집니다.",
      lessons: [
        { label: "1. 순서쌍과 좌표" },
        { label: "2. 그래프와 그 해석" },
        { label: "3. 정비례와 반비례" }
      ],
      hasBody: false
    }
  };

  // 고등 토픽 — search.js의 개념 완성 항목과 일관성 유지
  TOPICS["functions-graphs"] = {
    title: "함수와 그래프",
    desc: "함수의 정의, 그래프 해석, 변환을 단계별로 학습합니다.",
    stageLabel: "고등수학",
    lessons: [{ label: "1. 함수의 정의" }, { label: "2. 그래프 해석" }, { label: "3. 함수의 변환" }],
    hasBody: false
  };
  TOPICS["calculus-basics"] = {
    title: "미적분 기초",
    desc: "극한·미분·적분의 직관적 이해와 계산 연습을 시작합니다.",
    stageLabel: "고등수학",
    lessons: [{ label: "1. 극한" }, { label: "2. 미분" }, { label: "3. 적분" }],
    hasBody: false
  };

  const FALLBACK = "numbers";

  const getTopicKey = () => {
    const key = new URLSearchParams(window.location.search).get("topic");
    return key && TOPICS[key] ? key : FALLBACK;
  };

  const topicKey = getTopicKey();
  const topic = TOPICS[topicKey];
  const stageLabel = topic.stageLabel || STAGE_LABEL;

  // --- 문서 제목/메타 ---
  document.title = `${topic.title} | MathHub`;

  // --- 스테이지 칩 ---
  const stagePill = document.querySelector("[data-stage-label]");
  if (stagePill) stagePill.textContent = stageLabel;

  // --- breadcrumb ---
  const breadcrumb = document.querySelector("[data-breadcrumb]");
  if (breadcrumb) {
    const strong = breadcrumb.querySelector("strong");
    if (strong) strong.textContent = topic.title;
    const stageCrumb = breadcrumb.querySelectorAll("a")[1];
    if (stageCrumb) stageCrumb.textContent = stageLabel;
  }

  // --- 제목/설명 ---
  const titleEl = document.querySelector("[data-lesson-title]");
  const descEl = document.querySelector("[data-lesson-desc]");
  if (titleEl) titleEl.textContent = topic.title;
  if (descEl) descEl.textContent = topic.desc;

  // --- 사이드바 단원 트리 렌더 ---
  // 열린 단원 = 현재 토픽. 다른 단원은 접힌 상태로 표시(클릭 시 해당 토픽으로 이동).
  const panel = document.querySelector("[data-detail-panel]");
  if (panel) {
    // 현재 스테이지에 속한 단원 목록 (고등이면 고등 토픽만)
    const siblings = UNIT_ORDER.includes(topicKey)
      ? UNIT_ORDER
      : Object.keys(TOPICS).filter((k) => (TOPICS[k].stageLabel || STAGE_LABEL) === stageLabel);

    // 현재 topic의 완료 lesson 인덱스 목록 로드.
    const progressAll = readStore(STORE.progress, {});
    const doneSet = new Set(Array.isArray(progressAll[topicKey]) ? progressAll[topicKey] : []);

    // 진도 체크 토글 버튼 마크업. label은 lsn.label(HTML 포함 가능)이 아닌
    // 인덱스 기반 안전 문자열로 구성해 XSS·중첩 마크업을 피한다.
    const progressBtn = (i, done) =>
      `<button type="button" class="lesson-check${done ? " is-done" : ""}" ` +
      `data-lesson-index="${i}" aria-pressed="${done}" ` +
      `aria-label="${i + 1}번 개념 ${done ? "완료 취소" : "완료 표시"}">` +
      `<span class="lesson-check-mark" aria-hidden="true">✓</span></button>`;

    const openLessons = topic.lessons
      .map((lsn, i) => {
        // numbers처럼 본문 앵커가 있으면 #id 링크, 아니면 비활성 텍스트
        const isFirst = i === 0;
        const done = doneSet.has(i);
        const doneClass = done ? " lesson-completed" : "";
        const body = lsn.id
          ? `<a href="#${lsn.id}">${lsn.label}</a>`
          : `<span class="lesson-pending">${lsn.label}</span>`;
        return (
          `<li class="${isFirst && lsn.id ? "active" : ""}${doneClass}">` +
          body +
          progressBtn(i, done) +
          "</li>"
        );
      })
      .join("");

    const groups = siblings
      .map((key) => {
        const t = TOPICS[key];
        if (!t) return "";
        if (key === topicKey) {
          return (
            '<div class="side-group open">' +
            `<button type="button">${t.title} <span>⌄</span></button>` +
            `<ol>${openLessons}</ol>` +
            "</div>"
          );
        }
        return (
          '<div class="side-group collapsed">' +
          `<button type="button" data-topic-link="${key}">${t.title} <span>›</span></button>` +
          "</div>"
        );
      })
      .join("");

    panel.innerHTML = groups;

    // 접힌 다른 단원 클릭 → 해당 토픽으로 이동
    panel.querySelectorAll("[data-topic-link]").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.location.href = `./concept-detail.html?topic=${btn.getAttribute("data-topic-link")}`;
      });
    });

    // 진도 체크 토글 — 현재 topic 기준으로 완료 lesson 인덱스 저장/해제.
    panel.querySelectorAll(".lesson-check").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-lesson-index"));
        const all = readStore(STORE.progress, {});
        const arr = Array.isArray(all[topicKey]) ? all[topicKey] : [];
        const has = arr.includes(idx);
        const next = has ? arr.filter((n) => n !== idx) : [...arr, idx].sort((a, b) => a - b);
        all[topicKey] = next;
        writeStore(STORE.progress, all);

        const done = !has;
        btn.setAttribute("aria-pressed", String(done));
        btn.setAttribute("aria-label", `${idx + 1}번 개념 ${done ? "완료 취소" : "완료 표시"}`);
        btn.classList.toggle("is-done", done);
        btn.closest("li")?.classList.toggle("lesson-completed", done);
      });
    });
  }

  // --- 본문: 상세 콘텐츠가 없는 토픽은 "준비 중" 안내로 교체 ---
  if (!topic.hasBody) {
    const body = document.querySelector("[data-lesson-body]");
    if (body) {
      const lessonItems = topic.lessons.map((l) => `<li>${l.label}</li>`).join("");
      body.innerHTML =
        '<section class="concept-article-section concept-pending">' +
        `<h3>${topic.title}</h3>` +
        '<p class="lead">이 개념의 상세 학습 콘텐츠는 준비 중입니다.</p>' +
        "<p>아래 단원 구성을 먼저 살펴보고, 관련 자료로 학습을 이어가 보세요.</p>" +
        `<ul class="definition-list">${lessonItems}</ul>` +
        '<div class="pending-actions">' +
        '<a class="detail-primary" href="./concepts.html">← 개념 목록으로</a>' +
        '<a class="detail-secondary" href="./past-exams.html">관련 기출 보기</a>' +
        "</div>" +
        "</section>";
    }
  }

  // --- 스크롤 추적 사이드바 active (기존 기능 유지) ---
  // 사이드바를 동적으로 렌더한 뒤에 링크/섹션을 수집해야 한다.
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
    if (!lessonSections.length) return;
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

  if (lessonSections.length) {
    window.addEventListener("scroll", updateActiveLesson, { passive: true });
    window.addEventListener("resize", updateActiveLesson);
    window.addEventListener("load", updateActiveLesson);
    updateActiveLesson();
    setTimeout(updateActiveLesson, 0);
  }

  // --- 북마크(찜) — topic별 식별자(?topic=) 기준 ---
  // url은 현재 topic을 포함한 안정적 식별자(해시 제외)로 고정한다.
  const conceptUrl = `./concept-detail.html?topic=${topicKey}`;
  const bookmarkBtn = document.querySelector("[data-bookmark-concept]");
  if (bookmarkBtn) {
    const isSaved = () => readStore(STORE.bookmarks, []).some((b) => b && b.url === conceptUrl);
    const syncBookmark = () => {
      const saved = isSaved();
      bookmarkBtn.setAttribute("aria-pressed", String(saved));
      bookmarkBtn.classList.toggle("is-saved", saved);
      bookmarkBtn.setAttribute("aria-label", saved ? "북마크 해제" : "북마크 추가");
      const icon = bookmarkBtn.querySelector(".bookmark-icon");
      if (icon) icon.textContent = saved ? "♥" : "♡";
      const text = bookmarkBtn.querySelector(".bookmark-text");
      if (text) text.textContent = saved ? "북마크됨" : "북마크";
    };
    bookmarkBtn.addEventListener("click", () => {
      const list = readStore(STORE.bookmarks, []);
      const next = isSaved()
        ? list.filter((b) => b && b.url !== conceptUrl)
        : [...list, { type: "concept", title: topic.title, url: conceptUrl }];
      writeStore(STORE.bookmarks, next);
      syncBookmark();
    });
    syncBookmark();
  }

  // --- 최근 본 자료 기록 (현재 topic 제목 기준) ---
  (() => {
    const list = readStore(STORE.recent, []).filter((r) => r && r.url !== conceptUrl);
    list.unshift({ type: "concept", title: topic.title, url: conceptUrl });
    writeStore(STORE.recent, list.slice(0, 8));
  })();

  // --- KaTeX 수식 렌더 ---
  // 본문(numbers)을 DOM에 반영하고 사이드바를 다 그린 "이후"에 호출해야 한다.
  // KaTeX는 같은 페이지에서 defer로 먼저 로드되므로 보통 이 시점에 전역이 준비돼 있지만,
  // 로드가 느리거나 실패해도 페이지가 깨지지 않도록 가드한다(throwOnError:false + 폴백).
  const renderMath = () => {
    if (typeof window.renderMathInElement !== "function") return false;
    window.renderMathInElement(document.body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "\\(", right: "\\)", display: false }
      ],
      throwOnError: false
    });
    return true;
  };

  if (!renderMath()) {
    // KaTeX 스크립트가 아직 평가되지 않았으면 load 시점에 한 번 더 시도.
    window.addEventListener("load", renderMath, { once: true });
  }
})();
