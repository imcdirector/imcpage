import { setupAudio } from "./shared/audio.js";
import { setupChapterNav } from "./shared/chapter-nav.js?v=20260330-navfix-1";
import { createSceneController } from "./shared/scene-controller.js?v=20260330-navfix-1";
import { setupHeroScene } from "./scenes/01-hero/hero.js?v=20260330-navfix-1";

export function bootstrapApp() {
  const audio = document.getElementById("site-audio");
  const soundToggle = document.getElementById("sound-toggle");
  const homeToggle = document.getElementById("home-toggle");
  const heroScene = document.getElementById("hero-scene");
  const heroTitle = document.getElementById("hero-title");
  const heroTitleKorean = document.getElementById("hero-title-korean");
  const chapterNav = document.getElementById("chapter-nav");
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
    window.setTimeout(heroController.startTypewriter, heroController.typeStartDelay);
  });
}
