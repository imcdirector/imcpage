const LAUNCH_DURATION = 3000;
const STACK_STAGGER = 520;
const STACK_STEP_DURATION = 760;
const SHIFT_DELAY = 500;
const SHIFT_DURATION = 1120;
const LABEL_INTERVAL = 28;
const LABEL_GAP = 150;
const DETAIL_INTERVAL = 15;

export function setupHistoryAreasScene({ stage }) {
  if (!stage) {
    return;
  }

  const scene = stage.closest(".chapter-scene");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const items = Array.from(stage.querySelectorAll(".trajectory-item"));
  const entries = items.map((item) => item.querySelector(".trajectory-entry"));
  const labelRevealOrder = [...items].reverse();

  let sequenceTimers = [];
  let detailTimers = [];
  let activeItem = null;
  let pinnedItem = null;

  function addTimer(collection, callback, delay) {
    const timer = window.setTimeout(callback, delay);
    collection.push(timer);
    return timer;
  }

  function clearTimerCollection(collection) {
    collection.forEach((timer) => window.clearTimeout(timer));
    collection.length = 0;
  }

  function clearAllDetails() {
    clearTimerCollection(detailTimers);

    items.forEach((item) => {
      item.classList.remove("is-detail-open");
      item.querySelector(".trajectory-entry")?.setAttribute("aria-expanded", "false");

      const detailTarget = item.querySelector(".trajectory-entry__detail-text");

      if (detailTarget) {
        detailTarget.textContent = "";
      }
    });

    activeItem = null;
    pinnedItem = null;
  }

  function resetStage() {
    clearTimerCollection(sequenceTimers);
    clearAllDetails();
    stage.classList.remove("is-ready");
    stage.dataset.state = "idle";

    items.forEach((item) => {
      item.classList.remove("is-risen");

      const labelTarget = item.querySelector(".trajectory-entry__label-text");
      const detailTarget = item.querySelector(".trajectory-entry__detail-text");

      if (labelTarget) {
        labelTarget.textContent = "";
      }

      if (detailTarget) {
        detailTarget.textContent = "";
      }
    });
  }

  function typeText(target, text, { interval, onComplete } = {}) {
    const characters = Array.from(text || "");
    target.textContent = "";

    if (!characters.length) {
      onComplete?.();
      return;
    }

    let index = 0;

    const typeNext = () => {
      target.textContent += characters[index];
      index += 1;

      if (index >= characters.length) {
        onComplete?.();
        return;
      }

      addTimer(detailTimers, typeNext, interval);
    };

    typeNext();
  }

  function typeSequenceText(target, text, { interval, onComplete } = {}) {
    const characters = Array.from(text || "");
    target.textContent = "";

    if (!characters.length) {
      onComplete?.();
      return;
    }

    let index = 0;

    const typeNext = () => {
      target.textContent += characters[index];
      index += 1;

      if (index >= characters.length) {
        onComplete?.();
        return;
      }

      addTimer(sequenceTimers, typeNext, interval);
    };

    typeNext();
  }

  function showReadyImmediately() {
    stage.dataset.state = "ready";
    stage.classList.add("is-ready");

    items.forEach((item) => {
      item.classList.add("is-risen");
      const labelTarget = item.querySelector(".trajectory-entry__label-text");

      if (labelTarget) {
        labelTarget.textContent = item.dataset.label || "";
      }
    });
  }

  function revealLabels(index = 0) {
    const item = labelRevealOrder[index];

    if (!item) {
      addTimer(sequenceTimers, () => {
        stage.dataset.state = "shifted";
      }, SHIFT_DELAY);

      addTimer(sequenceTimers, () => {
        stage.dataset.state = "ready";
        stage.classList.add("is-ready");
      }, SHIFT_DELAY + SHIFT_DURATION);

      return;
    }

    const labelTarget = item.querySelector(".trajectory-entry__label-text");

    typeSequenceText(labelTarget, item.dataset.label || "", {
      interval: LABEL_INTERVAL,
      onComplete: () => {
        addTimer(sequenceTimers, () => {
          revealLabels(index + 1);
        }, LABEL_GAP);
      },
    });
  }

  function runSequence() {
    resetStage();

    if (prefersReducedMotion.matches) {
      showReadyImmediately();
      return;
    }

    stage.dataset.state = "launch";

    addTimer(sequenceTimers, () => {
      stage.dataset.state = "stack";

      labelRevealOrder.forEach((item, index) => {
        addTimer(sequenceTimers, () => {
          item.classList.add("is-risen");
        }, index * STACK_STAGGER);
      });
    }, LAUNCH_DURATION);

    const stackCompleteAt =
      LAUNCH_DURATION + STACK_STAGGER * (labelRevealOrder.length - 1) + STACK_STEP_DURATION;

    addTimer(sequenceTimers, () => {
      stage.dataset.state = "anchor";
    }, stackCompleteAt + SHIFT_DELAY);

    addTimer(sequenceTimers, () => {
      stage.dataset.state = "typing";
      revealLabels();
    }, stackCompleteAt + SHIFT_DELAY + SHIFT_DURATION + SHIFT_DELAY);
  }

  function openDetail(item, { pinned = false } = {}) {
    if (!stage.classList.contains("is-ready")) {
      return;
    }

    if (activeItem === item && pinnedItem === item) {
      return;
    }

    clearAllDetails();
    activeItem = item;
    pinnedItem = pinned ? item : null;
    item.classList.add("is-detail-open");
    item.querySelector(".trajectory-entry")?.setAttribute("aria-expanded", "true");

    const detailTarget = item.querySelector(".trajectory-entry__detail-text");

    if (!detailTarget) {
      return;
    }

    typeText(detailTarget, item.dataset.detail || "", {
      interval: DETAIL_INTERVAL,
    });
  }

  function closeDetail(item) {
    if (pinnedItem === item) {
      return;
    }

    if (activeItem !== item) {
      return;
    }

    clearAllDetails();
  }

  entries.forEach((entry, index) => {
    const item = items[index];

    entry.addEventListener("pointerenter", () => {
      if (!supportsHover) {
        return;
      }

      openDetail(item);
    });

    entry.addEventListener("pointerleave", () => {
      if (!supportsHover) {
        return;
      }

      closeDetail(item);
    });

    entry.addEventListener("focus", () => {
      openDetail(item);
    });

    entry.addEventListener("blur", () => {
      addTimer(detailTimers, () => {
        if (!item.contains(document.activeElement)) {
          closeDetail(item);
        }
      }, 0);
    });

    entry.addEventListener("click", () => {
      if (pinnedItem === item) {
        clearAllDetails();
        return;
      }

      openDetail(item, { pinned: true });
    });
  });

  if (scene) {
    const observer = new MutationObserver(() => {
      if (scene.getAttribute("aria-hidden") === "false") {
        runSequence();
      } else {
        resetStage();
      }
    });

    observer.observe(scene, {
      attributes: true,
      attributeFilter: ["aria-hidden"],
    });
  }

  if (scene?.getAttribute("aria-hidden") === "false") {
    runSequence();
  } else {
    resetStage();
  }
}
