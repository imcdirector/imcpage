import { setupAudio } from "./shared/audio.js";
import { setupChapterNav } from "./shared/chapter-nav.js?v=20260330-navfix-1";
import { createSceneController } from "./shared/scene-controller.js?v=20260330-navfix-1";
import { setupHeroScene } from "./scenes/01-hero/hero.js?v=20260330-navfix-1";
import { setupHistoryAreasScene } from "./scenes/05-history-areas/history-areas.js?v=20260330-history-areas-1";

export function bootstrapApp() {
  const audio = document.getElementById("site-audio");
  const soundToggle = document.getElementById("sound-toggle");
  const homeToggle = document.getElementById("home-toggle");
  const heroScene = document.getElementById("hero-scene");
  const heroTitle = document.getElementById("hero-title");
  const heroTitleKorean = document.getElementById("hero-title-korean");
  const chapterNav = document.getElementById("chapter-nav");
  const chapterNavRow = chapterNav?.querySelector(".chapter-nav__nav") ?? null;
  const blackout = document.getElementById("transition-blackout");
  const menuItems = Array.from(document.querySelectorAll(".menu-item"));
  const menuDetailRow = document.getElementById("menu-detail-row");
  const menuDetailText = document.getElementById("menu-detail-text");
  const chapterScenes = Array.from(document.querySelectorAll(".chapter-scene"));
  const defaultSceneId = "scene-about";
  const defaultSceneItem =
    menuItems.find((item) => item.dataset.sceneTarget === defaultSceneId) ?? null;

  const sceneController = createSceneController({
    heroScene,
    chapterNav,
    chapterScenes,
    blackout,
  });

  const audioController = setupAudio({
    audio,
    soundToggle,
    defaultVolume: 0.3,
  });

  const chapterNavController = setupChapterNav({
    menuItems,
    detailRow: menuDetailRow,
    detailText: menuDetailText,
    openChapterScene: (sceneId, item) => {
      chapterNavController.setActiveMenuItem(null);
      chapterNavController.setCurrentSceneItem(item);
      sceneController.openChapterScene(sceneId);
    },
    prefersTouchInteraction: window.matchMedia("(hover: none)").matches,
  });

  const heroController = setupHeroScene({
    heroTitle,
    heroTitleKorean,
    requestSoundStart: audioController.requestSoundStart,
    stopEventPropagation: audioController.stopEventPropagation,
    enterDefaultChapter: () => {
      chapterNavController.setActiveMenuItem(null);
      chapterNavController.setCurrentSceneItem(defaultSceneItem);
      sceneController.openChapterScene(defaultSceneId);
    },
  });

  const syncChapterTitleAnchor = () => {
    const navTarget = chapterNavRow ?? chapterNav;

    if (!navTarget) {
      return;
    }

    const { bottom } = navTarget.getBoundingClientRect();
    document.documentElement.style.setProperty(
      "--chapter-nav-row-bottom",
      `${Math.max(0, Math.round(bottom * 100) / 100)}px`,
    );
  };

  const queueChapterTitleAnchorSync = () => {
    window.requestAnimationFrame(syncChapterTitleAnchor);
  };

  setupHistoryAreasScene({
    stage: document.querySelector(".history-stage"),
  });

  homeToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    chapterNavController.reset();
    sceneController.openHeroScene();
  });

  homeToggle.addEventListener("pointerdown", audioController.stopEventPropagation);
  homeToggle.addEventListener("touchstart", audioController.stopEventPropagation, { passive: true });

  window.addEventListener("DOMContentLoaded", () => {
    audioController.initialize();
    sceneController.initialize();
    syncChapterTitleAnchor();
    window.setTimeout(heroController.startTypewriter, heroController.typeStartDelay);
  });

  window.addEventListener("resize", queueChapterTitleAnchorSync, { passive: true });
  window.addEventListener("orientationchange", queueChapterTitleAnchorSync);

  if (typeof ResizeObserver === "function" && chapterNavRow) {
    const chapterNavObserver = new ResizeObserver(queueChapterTitleAnchorSync);
    chapterNavObserver.observe(chapterNavRow);
  }

  if (document.fonts?.ready) {
    document.fonts.ready.then(queueChapterTitleAnchorSync).catch(() => {});
  }
}
