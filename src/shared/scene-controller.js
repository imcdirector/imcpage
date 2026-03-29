const BLACKOUT_FADE_IN = 120;
const BLACKOUT_HOLD = 200;

export function createSceneController({ heroScene, chapterNav, chapterScenes, blackout }) {
  function hideAllChapterScenes() {
    chapterScenes.forEach((scene) => {
      scene.setAttribute("aria-hidden", "true");
    });
  }

  function setHeroVisible() {
    heroScene.setAttribute("aria-hidden", "false");
    chapterNav.setAttribute("aria-hidden", "true");
    hideAllChapterScenes();
    document.body.classList.remove("scene-chapter-open", "is-blackout");
  }

  function setChapterVisible(sceneId) {
    const targetScene = document.getElementById(sceneId);

    if (!targetScene) {
      return false;
    }

    heroScene.setAttribute("aria-hidden", "true");
    hideAllChapterScenes();
    targetScene.setAttribute("aria-hidden", "false");
    targetScene.scrollTop = 0;
    chapterNav.setAttribute("aria-hidden", "false");
    document.body.classList.add("scene-chapter-open");
    return true;
  }

  function openHeroScene() {
    const alreadyOpen =
      !document.body.classList.contains("scene-chapter-open") &&
      heroScene.getAttribute("aria-hidden") === "false";

    if (alreadyOpen) {
      return;
    }

    document.body.classList.add("is-blackout");

    window.setTimeout(() => {
      setHeroVisible();
    }, BLACKOUT_FADE_IN);

    window.setTimeout(() => {
      document.body.classList.remove("is-blackout");
    }, BLACKOUT_FADE_IN + BLACKOUT_HOLD);
  }

  function openChapterScene(sceneId) {
    const targetScene = document.getElementById(sceneId);

    if (!targetScene) {
      return;
    }

    const alreadyOpen =
      document.body.classList.contains("scene-chapter-open") &&
      targetScene.getAttribute("aria-hidden") === "false";

    if (alreadyOpen) {
      return;
    }

    document.body.classList.add("is-blackout");

    window.setTimeout(() => {
      setChapterVisible(sceneId);
    }, BLACKOUT_FADE_IN);

    window.setTimeout(() => {
      document.body.classList.remove("is-blackout");
    }, BLACKOUT_FADE_IN + BLACKOUT_HOLD);
  }

  function initialize() {
    blackout.setAttribute("data-blackout-fade-in", String(BLACKOUT_FADE_IN));
    setHeroVisible();
  }

  return {
    hideAllChapterScenes,
    initialize,
    openHeroScene,
    openChapterScene,
  };
}
