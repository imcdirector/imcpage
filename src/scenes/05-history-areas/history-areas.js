const DETAIL_INTERVAL = 20;

export function setupHistoryAreasScene({ stage }) {
  if (!stage) {
    return;
  }

  const scene = stage.closest(".chapter-scene");
  const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const items = Array.from(stage.querySelectorAll(".trajectory-item"));
  const entries = items.map((item) => item.querySelector(".trajectory-entry"));

  let detailTimers = [];
  let activeItem = null;

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
  }

  function resetStage() {
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

      const detailBlock = item.querySelector(".trajectory-entry__detail");

      if (detailBlock) {
        detailBlock.style.removeProperty("left");
        detailBlock.style.removeProperty("width");
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

  function positionDetail(item) {
    const detailBlock = item.querySelector(".trajectory-entry__detail");
    const labelBlock = item.querySelector(".trajectory-entry__label");
    const entry = item.querySelector(".trajectory-entry");
    const sequence = item.closest(".trajectory-sequence");

    if (!detailBlock || !labelBlock || !entry || !sequence) {
      return;
    }

    if (window.matchMedia("(max-width: 640px)").matches) {
      detailBlock.style.removeProperty("left");
      detailBlock.style.removeProperty("width");
      return;
    }

    const scale = parseFloat(getComputedStyle(sequence).getPropertyValue("--trajectory-scale")) || 1;
    const labelWidth = labelBlock.getBoundingClientRect().width / scale;
    const detailLeft = Math.round(labelBlock.offsetLeft + labelWidth + 18);
    detailBlock.style.left = `${detailLeft}px`;
    detailBlock.style.width = `calc(100% - ${detailLeft + 16}px)`;
  }

  function positionAllDetails() {
    items.forEach((item) => {
      positionDetail(item);
    });
  }

  function centerSequence() {
    const sequence = stage.querySelector(".trajectory-sequence");

    if (!sequence) {
      return;
    }

    sequence.style.setProperty("--trajectory-center-adjust", "0px");

    const nodes = [
      stage.querySelector(".trajectory-sequence__spine"),
      stage.querySelector(".trajectory-sequence__head"),
      ...stage.querySelectorAll(".trajectory-entry__dot"),
      ...stage.querySelectorAll(".trajectory-entry__label"),
    ].filter(Boolean);

    if (!nodes.length) {
      return;
    }

    let left = Infinity;
    let right = -Infinity;

    nodes.forEach((node) => {
      const rect = node.getBoundingClientRect();
      left = Math.min(left, rect.left);
      right = Math.max(right, rect.right);
    });

    const detailTemplate = stage.querySelector(".trajectory-entry__detail");

    if (detailTemplate && !window.matchMedia("(max-width: 640px)").matches) {
      let measure = sequence.querySelector(".trajectory-sequence__measure");

      if (!measure) {
        measure = document.createElement("span");
        measure.className = "trajectory-sequence__measure";
        measure.setAttribute("aria-hidden", "true");
        sequence.appendChild(measure);
      }

      const detailStyle = window.getComputedStyle(detailTemplate);
      measure.style.position = "absolute";
      measure.style.visibility = "hidden";
      measure.style.pointerEvents = "none";
      measure.style.whiteSpace = "nowrap";
      measure.style.top = "0";
      measure.style.fontFamily = detailStyle.fontFamily;
      measure.style.fontSize = detailStyle.fontSize;
      measure.style.fontWeight = detailStyle.fontWeight;
      measure.style.lineHeight = detailStyle.lineHeight;
      measure.style.letterSpacing = detailStyle.letterSpacing;

      items.forEach((item) => {
        const detailBlock = item.querySelector(".trajectory-entry__detail");

        if (!detailBlock) {
          return;
        }

        measure.textContent = item.dataset.detail || "";
        measure.style.left = detailBlock.style.left || `${detailBlock.offsetLeft}px`;

        const rect = measure.getBoundingClientRect();
        left = Math.min(left, rect.left);
        right = Math.max(right, rect.right);
      });

      measure.textContent = "";
    }

    const currentCenter = (left + right) / 2;
    const viewportCenter = window.innerWidth / 2;
    const delta = viewportCenter - currentCenter - 18;

    sequence.style.setProperty("--trajectory-center-adjust", `${Math.round(delta * 100) / 100}px`);
  }

  function showStaticStage() {
    stage.dataset.state = "ready";
    stage.classList.add("is-ready");

    items.forEach((item) => {
      item.classList.add("is-risen");
      const labelTarget = item.querySelector(".trajectory-entry__label-text");

      if (labelTarget) {
        labelTarget.textContent = item.dataset.label || "";
      }

      item.classList.add("is-risen");
    });

    positionAllDetails();
  }

  function showSceneImmediately() {
    resetStage();
    showStaticStage();
    centerSequence();
  }

  function openDetail(item) {
    if (!stage.classList.contains("is-ready")) {
      return;
    }

    if (activeItem === item) {
      return;
    }

    clearAllDetails();
    activeItem = item;
    item.classList.add("is-detail-open");
    item.querySelector(".trajectory-entry")?.setAttribute("aria-expanded", "true");

    const detailTarget = item.querySelector(".trajectory-entry__detail-text");

    if (!detailTarget) {
      return;
    }

    positionDetail(item);

    typeText(detailTarget, item.dataset.detail || "", {
      interval: DETAIL_INTERVAL,
    });
  }

  function closeDetail(item) {
    if (activeItem !== item) {
      return;
    }

    clearAllDetails();
  }

  function isHoveringItem(item) {
    const dot = item.querySelector(".trajectory-entry__dot");
    const label = item.querySelector(".trajectory-entry__label");
    return Boolean(dot?.matches(":hover") || label?.matches(":hover"));
  }

  function scheduleCloseDetail(item) {
    addTimer(detailTimers, () => {
      if (!isHoveringItem(item)) {
        closeDetail(item);
      }
    }, 80);
  }

  entries.forEach((entry, index) => {
    const item = items[index];
    const dot = item.querySelector(".trajectory-entry__dot");
    const label = item.querySelector(".trajectory-entry__label");

    [dot, label].forEach((target) => {
      if (!target) {
        return;
      }

      target.addEventListener("pointerenter", () => {
        if (!supportsHover) {
          return;
        }

        openDetail(item);
      });

      target.addEventListener("pointerleave", () => {
        if (!supportsHover) {
          return;
        }

        scheduleCloseDetail(item);
      });
    });
  });

  if (scene) {
    const observer = new MutationObserver(() => {
      if (scene.getAttribute("aria-hidden") === "false") {
        showSceneImmediately();
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
    showSceneImmediately();
  } else {
    resetStage();
  }

  window.addEventListener(
    "resize",
    () => {
      positionAllDetails();
      centerSequence();
    },
    { passive: true },
  );
}
