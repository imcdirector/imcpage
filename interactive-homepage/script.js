const flowData = {
  discover: {
    label: "사실",
    title: "실제와 실재를 발견한다.",
    copy: "보이는 현상과 실제 원인을 분리해 문제의 표면이 아니라 실체를 붙잡는다.",
  },
  define: {
    label: "사리",
    title: "발견된 실체를 규정한다.",
    copy: "무엇을 해결할지, 무엇을 포기할지, 어떤 기준으로 판단할지를 명확히 한다.",
  },
  solve: {
    label: "책임",
    title: "규정된 실체를 해결한다.",
    copy: "전략을 선언에 멈추지 않고 사람, 자원, 일정, 실행 흐름으로 바꾼다.",
  },
  evolve: {
    label: "발전",
    title: "해결된 구조를 다음 기준으로 발전시킨다.",
    copy: "성과와 어긋남을 측정해 한 번의 해결을 다음 문제 해결 능력으로 축적한다.",
  },
};

const vectorData = {
  v: {
    kicker: "Verify Reality",
    title: "현실을 검증한다.",
    copy: "주장, 이해관계, 숫자, 정황을 분리해 문제의 실제 지형을 확인한다.",
  },
  e: {
    kicker: "Establish End-State",
    title: "이길 상태를 정의한다.",
    copy: "성공을 모호한 기대가 아니라 관찰 가능한 종료 상태로 바꾼다.",
  },
  c: {
    kicker: "Clarify Constraints",
    title: "제약을 드러낸다.",
    copy: "돈, 시간, 권한, 이해관계의 한계를 명확히 해 실행 가능한 선택지를 만든다.",
  },
  t: {
    kicker: "Choose Trade-offs",
    title: "선택과 포기를 분명히 한다.",
    copy: "좋은 답을 늘리는 대신 가능한 답을 좁혀 실제 의사결정을 만든다.",
  },
  o: {
    kicker: "Orchestrate Change",
    title: "움직이는 구조를 설계한다.",
    copy: "조직과 개인이 같은 방향으로 움직이도록 역할, 리듬, 책임을 맞춘다.",
  },
  r: {
    kicker: "Review & Renew",
    title: "측정하고 갱신한다.",
    copy: "실행 이후의 변화를 읽고 다음 판단 기준으로 환원한다.",
  },
};

const motionData = {
  map: "문제의 지형과 이해관계를 먼저 읽는다.",
  model: "결정 가능한 구조로 모델링한다.",
  mobilize: "사람과 자원을 한 방향으로 정렬한다.",
  measure: "성과와 어긋남을 계속 추적한다.",
};

const trajectoryData = {
  venture: {
    type: "전략 자문 & 창업",
    title: "불명확한 문제를 사업 구조로 세운다.",
    copy: "C-Level 전략 자문과 LCA 기반 순환경제 벤처 창립 경험을 통해, 문제를 정의하고 움직이는 구조로 바꿔왔다.",
  },
  battery: {
    type: "배터리 소재",
    title: "성장 전략과 생태계 구축을 연결한다.",
    copy: "중장기 전략 수립, 순환경제 생태계 구축, 고객사 문제 해결을 하나의 실행 흐름으로 다루었다.",
  },
  startup: {
    type: "스타트업",
    title: "처음 가는 길을 시장 언어로 바꾼다.",
    copy: "K-PPM CSAP 인증과 북미 GTM 기획처럼 낯선 시장을 이해 가능한 전략 단위로 쪼갰다.",
  },
  public: {
    type: "공공 영역",
    title: "복합 이해관계를 장기 구조로 정리한다.",
    copy: "특수목적 복합공간과 정책 과제를 다루며 공공성과 실행 가능성의 균형을 설계했다.",
  },
  olympics: {
    type: "국제행사",
    title: "현장의 변수를 운영 체계로 통제한다.",
    copy: "국제행사 기획과 운영 경험을 통해 빠르게 바뀌는 현장을 실행 가능한 프로세스로 정리했다.",
  },
};

function setActive(buttons, current) {
  buttons.forEach((button) => {
    const isActive = button === current;
    button.classList.toggle("is-active", isActive);
    if (button.getAttribute("role") === "tab") {
      button.setAttribute("aria-selected", String(isActive));
    }
  });
}

const flowTabs = Array.from(document.querySelectorAll(".flow-tab"));
const flowLabel = document.getElementById("flow-panel-label");
const flowTitle = document.getElementById("flow-panel-title");
const flowCopy = document.getElementById("flow-panel-copy");

flowTabs.forEach((button) => {
  button.addEventListener("click", () => {
    const next = flowData[button.dataset.flow];
    if (!next) return;
    setActive(flowTabs, button);
    flowLabel.textContent = next.label;
    flowTitle.textContent = next.title;
    flowCopy.textContent = next.copy;
  });
});

const vectorCards = Array.from(document.querySelectorAll(".vector-card"));
const vectorKicker = document.getElementById("vector-kicker");
const vectorTitle = document.getElementById("vector-title");
const vectorCopy = document.getElementById("vector-copy");

vectorCards.forEach((button) => {
  button.addEventListener("click", () => {
    const next = vectorData[button.dataset.vector];
    if (!next) return;
    setActive(vectorCards, button);
    vectorKicker.textContent = next.kicker;
    vectorTitle.textContent = next.title;
    vectorCopy.textContent = next.copy;
  });
});

const motionSteps = Array.from(document.querySelectorAll(".motion-step"));

motionSteps.forEach((button) => {
  button.addEventListener("click", () => {
    setActive(motionSteps, button);
    const message = motionData[button.dataset.motion];
    if (message) {
      vectorCopy.textContent = message;
    }
  });
});

const trajectoryButtons = Array.from(document.querySelectorAll(".trajectory-button"));
const trajectoryType = document.getElementById("trajectory-type");
const trajectoryTitle = document.getElementById("trajectory-title");
const trajectoryCopy = document.getElementById("trajectory-copy");

trajectoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const next = trajectoryData[button.dataset.trajectory];
    if (!next) return;
    setActive(trajectoryButtons, button);
    trajectoryType.textContent = next.type;
    trajectoryTitle.textContent = next.title;
    trajectoryCopy.textContent = next.copy;
  });
});

const navLinks = Array.from(document.querySelectorAll(".site-nav__link"));
const sections = Array.from(document.querySelectorAll("[data-section]"));

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
    });
  },
  { threshold: [0.32, 0.56, 0.72] },
);

sections.forEach((section) => observer.observe(section));

const progressBar = document.getElementById("site-progress-bar");

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
  progressBar.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
}

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress, { passive: true });
updateProgress();
