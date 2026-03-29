const SOUND_INTENT_KEY = "choi-youngryeol-sound-intent";

export function setupAudio({ audio, soundToggle, defaultVolume = 0.3 }) {
  const lockedVolume = Math.max(0, Math.min(1, defaultVolume));
  let isPlaying = false;
  let wantsSound = true;
  let isSyncingVolume = false;
  let hasUserActivatedSound = false;

  try {
    wantsSound = localStorage.getItem(SOUND_INTENT_KEY) !== "off";
  } catch (error) {
    wantsSound = true;
  }

  function persistSoundIntent() {
    try {
      localStorage.setItem(SOUND_INTENT_KEY, wantsSound ? "on" : "off");
    } catch (error) {
      // Ignore storage failures.
    }
  }

  function updateSoundUI() {
    soundToggle.classList.toggle("is-on", isPlaying);
    soundToggle.setAttribute("aria-pressed", String(isPlaying));
    soundToggle.setAttribute("aria-label", isPlaying ? "소리 켜짐" : "소리 꺼짐");
  }

  function applyLockedVolume({ forceUnmute = false } = {}) {
    if (isSyncingVolume) {
      return;
    }

    isSyncingVolume = true;
    audio.volume = lockedVolume;

    if (forceUnmute) {
      audio.muted = false;
    }

    isSyncingVolume = false;
  }

  async function playAudio() {
    applyLockedVolume({ forceUnmute: true });

    try {
      await audio.play();
      isPlaying = !audio.paused;
    } catch (error) {
      isPlaying = false;
    }

    updateSoundUI();
    return isPlaying;
  }

  function stopAudio() {
    audio.pause();
    isPlaying = false;
    updateSoundUI();
  }

  async function requestSoundStart() {
    wantsSound = true;
    hasUserActivatedSound = true;
    persistSoundIntent();
    return playAudio();
  }

  function stopEventPropagation(event) {
    event.stopPropagation();
  }

  function initialize() {
    persistSoundIntent();
    applyLockedVolume();
    updateSoundUI();

    if (wantsSound) {
      void playAudio();
    }
  }

  audio.addEventListener("play", () => {
    isPlaying = true;
    updateSoundUI();
  });

  audio.addEventListener("pause", () => {
    isPlaying = false;
    updateSoundUI();
  });

  audio.addEventListener("loadedmetadata", () => {
    applyLockedVolume();
  });

  audio.addEventListener("volumechange", () => {
    if (!wantsSound || isSyncingVolume) {
      return;
    }

    if (audio.muted || Math.abs(audio.volume - lockedVolume) > 0.001) {
      applyLockedVolume({ forceUnmute: true });
    }
  });

  soundToggle.addEventListener("click", async (event) => {
    event.stopPropagation();

    if (isPlaying) {
      wantsSound = false;
      persistSoundIntent();
      stopAudio();
      return;
    }

    await requestSoundStart();
  });

  soundToggle.addEventListener("pointerdown", stopEventPropagation);
  soundToggle.addEventListener("touchstart", stopEventPropagation, { passive: true });

  window.addEventListener("pageshow", async () => {
    if (wantsSound && hasUserActivatedSound && !isPlaying) {
      await playAudio();
    }
  });

  document.addEventListener("visibilitychange", async () => {
    if (!document.hidden && wantsSound && hasUserActivatedSound && !isPlaying) {
      await playAudio();
    }
  });

  return {
    initialize,
    requestSoundStart,
    stopEventPropagation,
  };
}
