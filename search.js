(function () {
  const resultsEl = document.querySelector("[data-search-results]");
  const summaryEl = document.querySelector("[data-search-summary]");
  const form = document.querySelector("[data-search-page-form]");
  const input = form?.querySelector("input");
  if (!resultsEl) return;

  const CATEGORY_ORDER = ["개념 완성", "기출 문제", "문제집 & 해설", "국가별 과정"];

  const RESOURCES = [
    // 개념 완성
    { title: "수와 연산", category: "개념 완성", href: "./concept-detail.html", desc: "유리수·소수 연산의 기초 개념을 기출과 연결해 정리합니다.", tags: ["중학수학", "연산", "유리수"] },
    { title: "문자와 식", category: "개념 완성", href: "./concept-detail.html", desc: "문자를 이용한 식의 표현과 일차식 계산의 핵심 개념.", tags: ["중학수학", "일차식"] },
    { title: "일차방정식", category: "개념 완성", href: "./concept-detail.html", desc: "방정식의 풀이 원리와 활용 문제 접근법.", tags: ["중학수학", "방정식"] },
    { title: "함수와 그래프", category: "개념 완성", href: "./concept-detail.html", desc: "함수의 정의, 그래프 해석, 변환을 단계별로 학습.", tags: ["고등수학", "함수"] },
    { title: "미적분 기초", category: "개념 완성", href: "./concept-detail.html", desc: "극한·미분·적분의 직관적 이해와 계산 연습.", tags: ["고등수학", "미적분", "심화"] },

    // 기출 문제
    { title: "수능 수학 기출", category: "기출 문제", href: "./past-exams.html", desc: "최신 수능 수학 영역 기출문제와 전문항 해설.", tags: ["수능", "고3"] },
    { title: "전국연합 학력평가", category: "기출 문제", href: "./past-exams.html", desc: "3·6·9월 학력평가 기출과 등급컷·오답률 분석.", tags: ["학력평가", "모의고사"] },
    { title: "사관학교 기출", category: "기출 문제", href: "./past-exams.html", desc: "사관학교 수학 기출문제와 풀이 자료.", tags: ["사관학교", "기출"] },
    { title: "기출 상세 분석", category: "기출 문제", href: "./exam-detail.html", desc: "문항별 정답률·오답률과 단원 연계 분석 리포트.", tags: ["분석", "등급컷"] },

    // 문제집 & 해설
    { title: "쎈(SSEN) 수학", category: "문제집 & 해설", href: "./workbooks.html", desc: "유형별 문제집과 단계별 해설을 PDF로 제공합니다.", tags: ["문제집", "유형"] },
    { title: "RPM 문제집", category: "문제집 & 해설", href: "./workbooks.html", desc: "개념 적용 문제 중심의 RPM 시리즈 해설집.", tags: ["문제집", "개념"] },
    { title: "EBS 수능특강", category: "문제집 & 해설", href: "./workbooks.html", desc: "EBS 연계 교재의 문제와 해설 자료.", tags: ["EBS", "수능", "연계"] },
    { title: "문제집 상세 보기", category: "문제집 & 해설", href: "./workbook-detail.html", desc: "교재 구성, 난이도, 해설 미리보기를 확인합니다.", tags: ["해설", "미리보기"] },

    // 국가별 과정
    { title: "SAT Math", category: "국가별 과정", href: "./global.html", desc: "40+ 공식 SAT 기출과 연습 시험 아카이브.", tags: ["USA", "SAT", "미국"] },
    { title: "AP Calculus AB/BC", category: "국가별 과정", href: "./global.html", desc: "AP 미적분 FRQ와 채점 가이드라인 모음.", tags: ["USA", "AP", "미적분"] },
    { title: "AMC / AIME 경시", category: "국가별 과정", href: "./global.html", desc: "MAA 수학 경시대회 AMC 8/10/12, AIME 자료.", tags: ["USA", "AMC", "경시대회"] },
    { title: "A-Level Maths", category: "국가별 과정", href: "./global-uk.html", desc: "영국 A-Level 및 Further Maths 기출과 교재.", tags: ["UK", "영국", "A-Level"] },
    { title: "MAT / TMUA", category: "국가별 과정", href: "./global-uk.html", desc: "옥스퍼드 MAT, TMUA 등 대학 입시 수학 시험.", tags: ["UK", "영국", "입시"] },
    { title: "CEMC Competitions", category: "국가별 과정", href: "./global-canada.html", desc: "캐나다 워털루 CEMC 경시대회 기출 자료.", tags: ["Canada", "캐나다", "경시대회"] },
    { title: "Ontario Curriculum", category: "국가별 과정", href: "./global-canada.html", desc: "온타리오 교육과정 기반 온라인 교재.", tags: ["Canada", "캐나다", "교과"] },
    { title: "IB Math AA / AI", category: "국가별 과정", href: "./global-ib.html", desc: "IB Mathematics AA·AI SL/HL 기출과 교재.", tags: ["IB", "국제", "AA", "AI"] }
  ];

  const normalize = (value) => (value || "").toLowerCase().replace(/\s+/g, "");
  const escapeHtml = (value) =>
    value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const getQuery = () => new URLSearchParams(window.location.search).get("q") || "";

  const matches = (item, q) => {
    if (!q) return true;
    const haystack = normalize(item.title + " " + item.category + " " + item.desc + " " + item.tags.join(" "));
    return haystack.includes(q);
  };

  const render = (rawQuery) => {
    const q = normalize(rawQuery);
    const found = RESOURCES.filter((item) => matches(item, q));

    if (rawQuery) {
      summaryEl.innerHTML = `<b>"${escapeHtml(rawQuery)}"</b> 검색 결과 ${found.length}건`;
    } else {
      summaryEl.textContent = `전체 자료 ${found.length}건`;
    }

    if (!found.length) {
      resultsEl.innerHTML =
        '<div class="search-empty">' +
        '<div class="empty-icon">🔍</div>' +
        "<strong>검색 결과가 없습니다</strong>" +
        "<p>다른 키워드로 검색하거나, 상단 메뉴에서 카테고리를 둘러보세요.<br>찾으시는 자료가 없다면 준비중일 수 있습니다.</p>" +
        "</div>";
      return;
    }

    const groups = CATEGORY_ORDER.map((category) => ({
      category,
      items: found.filter((item) => item.category === category)
    })).filter((group) => group.items.length);

    resultsEl.innerHTML = groups
      .map((group) => {
        const cards = group.items
          .map(
            (item) =>
              `<a class="search-result-card" href="${item.href}">` +
              `<span class="result-badge">${escapeHtml(item.category)}</span>` +
              `<h3>${escapeHtml(item.title)}</h3>` +
              `<p>${escapeHtml(item.desc)}</p>` +
              `<div class="result-tags">${item.tags.map((t) => `<span>${escapeHtml(t)}</span>`).join("")}</div>` +
              "</a>"
          )
          .join("");

        return (
          '<section class="search-group">' +
          '<div class="search-group-head">' +
          `<h2>${escapeHtml(group.category)}</h2>` +
          `<span>${group.items.length}</span>` +
          "</div>" +
          `<div class="search-result-list">${cards}</div>` +
          "</section>"
        );
      })
      .join("");
  };

  const initialQuery = getQuery();
  if (input) input.value = initialQuery;
  render(initialQuery);

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input?.value.trim() || "";
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set("q", value);
    } else {
      url.searchParams.delete("q");
    }
    window.history.replaceState({}, "", url);
    render(value);
  });
})();
