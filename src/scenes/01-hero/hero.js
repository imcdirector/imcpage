const TITLE_TEXT =
  "\uC1A1\uACF3, \uD310 \uADF8\uB9AC\uACE0 \uCD5C\uC601\uB82C";
const TYPE_START_DELAY = 320;
const CARET_ONLY_DELAY = 240;
const TYPE_INTERVAL = 112;

export function setupHeroScene({
  heroTitle,
  heroTitleKorean,
  requestSoundStart,
  stopEventPropagation,
  enterDefaultChapter,
}) {
  let typewriterStarted = false;

  function startTypewriter() {
    if (typewriterStarted) {
      return;
    }

    typewriterStarted = true;
    heroTitleKorean.textContent = "";

    const characters = Array.from(TITLE_TEXT);

    window.setTimeout(() => {
      let index = 0;

      const typeNext = () => {
        heroTitleKorean.textContent += characters[index];
        index += 1;

        if (index < characters.length) {
          window.setTimeout(typeNext, TYPE_INTERVAL);
          return;
        }

        heroTitle.classList.add("is-ready");
      };

      typeNext();
    }, CARET_ONLY_DELAY);
  }

  heroTitle.addEventListener("click", async (event) => {
    event.stopPropagation();
    await requestSoundStart();
    enterDefaultChapter();
  });

  heroTitle.addEventListener("pointerdown", stopEventPropagation);
  heroTitle.addEventListener("touchstart", stopEventPropagation, { passive: true });

  return {
    startTypewriter,
    typeStartDelay: TYPE_START_DELAY,
  };
}
