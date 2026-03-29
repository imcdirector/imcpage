const DETAIL_CARET_ONLY_DELAY = 140;
const DETAIL_TYPE_INTERVAL = 42;

export function setupChapterNav({
  menuItems,
  detailRow,
  detailText,
  openChapterScene,
  prefersTouchInteraction,
}) {
  let detailTimer = null;
  let currentSceneItem = null;

  function clearDetailTimer() {
    if (!detailTimer) {
      return;
    }

    window.clearTimeout(detailTimer);
    detailTimer = null;
  }

  function updateDetailOffset(item) {
    const nav = item.closest(".chapter-nav__nav");

    if (!nav || window.matchMedia("(max-width: 640px)").matches) {
      detailRow.style.setProperty("--menu-detail-offset", "0px");
      return;
    }

    const navRect = nav.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const offset = Math.max(0, itemRect.left - navRect.left);

    detailRow.style.setProperty("--menu-detail-offset", `${offset}px`);
  }

  function hideDetailRow() {
    clearDetailTimer();
    detailRow.classList.remove("is-visible");
    detailRow.setAttribute("aria-hidden", "true");
    detailText.textContent = "";
  }

  function showDetailRow() {
    detailRow.classList.add("is-visible");
    detailRow.setAttribute("aria-hidden", "false");
  }

  function clearDetailState() {
    menuItems.forEach((item) => {
      item.classList.remove("is-detail-open");
    });

    hideDetailRow();
  }

  function shouldIgnoreCurrentScene(item) {
    return item === currentSceneItem && document.body.classList.contains("scene-chapter-open");
  }

  function openMenuDetail(item) {
    if (shouldIgnoreCurrentScene(item)) {
      return;
    }

    clearDetailTimer();
    updateDetailOffset(item);

    menuItems.forEach((menuItem) => {
      menuItem.classList.toggle("is-detail-open", menuItem === item);
    });

    const fullText = item.dataset.detail || "";
    const characters = Array.from(fullText);

    detailText.textContent = "";
    showDetailRow();

    const startTyping = () => {
      let index = 0;

      if (!characters.length) {
        detailTimer = null;
        return;
      }

      const typeNext = () => {
        detailText.textContent += characters[index];
        index += 1;

        if (index >= characters.length) {
          detailTimer = null;
          return;
        }

        detailTimer = window.setTimeout(typeNext, DETAIL_TYPE_INTERVAL);
      };

      typeNext();
    };

    detailTimer = window.setTimeout(startTyping, DETAIL_CARET_ONLY_DELAY);
  }

  function closeMenuDetail(item) {
    clearDetailTimer();

    if (item) {
      item.classList.remove("is-detail-open");
    }

    const hasPinnedItem = menuItems.some((menuItem) => menuItem.classList.contains("is-active"));

    if (!hasPinnedItem) {
      hideDetailRow();
    }
  }

  function setActiveMenuItem(nextItem) {
    menuItems.forEach((item) => {
      const isActive = item === nextItem;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-expanded", String(isActive));
    });

    if (nextItem) {
      openMenuDetail(nextItem);
      return;
    }

    clearDetailState();
  }

  function setCurrentSceneItem(nextItem) {
    currentSceneItem = nextItem;

    menuItems.forEach((item) => {
      item.classList.toggle("is-current-scene", item === nextItem);
    });
  }

  function reset() {
    currentSceneItem = null;
    setActiveMenuItem(null);
    menuItems.forEach((item) => {
      item.classList.remove("is-current-scene");
    });
  }

  menuItems.forEach((item) => {
    item.setAttribute("aria-expanded", "false");

    item.addEventListener("pointerenter", () => {
      if (item.classList.contains("is-active") || shouldIgnoreCurrentScene(item)) {
        return;
      }

      openMenuDetail(item);
    });

    item.addEventListener("pointerleave", () => {
      if (item.classList.contains("is-active") || shouldIgnoreCurrentScene(item)) {
        return;
      }

      closeMenuDetail(item);
    });

    item.addEventListener("focus", () => {
      if (item.classList.contains("is-active") || shouldIgnoreCurrentScene(item)) {
        return;
      }

      openMenuDetail(item);
    });

    item.addEventListener("blur", () => {
      if (item.classList.contains("is-active") || shouldIgnoreCurrentScene(item)) {
        return;
      }

      closeMenuDetail(item);
    });

    item.addEventListener("click", (event) => {
      event.stopPropagation();

      const sceneTarget = item.dataset.sceneTarget;

      if (sceneTarget) {
        if (prefersTouchInteraction && !item.classList.contains("is-active")) {
          setActiveMenuItem(item);
          return;
        }

        openChapterScene(sceneTarget, item);
        return;
      }

      setCurrentSceneItem(null);
      const nextItem = item.classList.contains("is-active") ? null : item;
      setActiveMenuItem(nextItem);
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".menu-item")) {
      setActiveMenuItem(null);
    }
  });

  return {
    reset,
    setActiveMenuItem,
    setCurrentSceneItem,
  };
}
