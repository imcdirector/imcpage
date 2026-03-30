export function setupHistoryAreasScene({ stage }) {
  if (!stage) {
    return;
  }

  const steps = Array.from(stage.querySelectorAll(".career-step[data-area-focus]"));
  const cards = Array.from(stage.querySelectorAll(".area-card[data-area-key]"));

  if (!steps.length || !cards.length) {
    return;
  }

  const clearActiveState = () => {
    stage.classList.remove("is-linked");

    steps.forEach((step) => {
      step.classList.remove("is-active");
    });

    cards.forEach((card) => {
      card.classList.remove("is-active");
    });
  };

  const setActiveState = (step) => {
    const keys = new Set(
      (step.dataset.areaFocus || "")
        .split(/\s+/)
        .map((value) => value.trim())
        .filter(Boolean),
    );

    stage.classList.add("is-linked");

    steps.forEach((currentStep) => {
      currentStep.classList.toggle("is-active", currentStep === step);
    });

    cards.forEach((card) => {
      card.classList.toggle("is-active", keys.has(card.dataset.areaKey));
    });
  };

  steps.forEach((step) => {
    step.addEventListener("pointerenter", () => {
      setActiveState(step);
    });

    step.addEventListener("focus", () => {
      setActiveState(step);
    });

    step.addEventListener("pointerleave", clearActiveState);

    step.addEventListener("blur", clearActiveState);
  });
}
