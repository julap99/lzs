export function useVoiceReader() {
  const isReading = ref(false);
  const announceElement = ref(null);
  let speechSynthesis;
  let speechUtterance;

  onMounted(() => {
    speechSynthesis = window.speechSynthesis;
    speechUtterance = new SpeechSynthesisUtterance();

    window.addEventListener("keydown", handleKeydown);
  });

  onUnmounted(() => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
    }
    window.removeEventListener("keydown", handleKeydown);
  });

  const toggleReading = () => {
    if (!speechSynthesis) return;

    if (isReading.value) {
      speechSynthesis.pause();
      isReading.value = false;
      announce("Reading paused");
    } else {
      const textToRead = document.body.innerText;
      speechUtterance.text = textToRead;
      speechSynthesis.speak(speechUtterance);
      isReading.value = true;
      announce("Reading started");
    }
  };

  const handleKeydown = (event) => {
    if (event.ctrlKey && event.key === "r") {
      event.preventDefault();
      toggleReading();
    }
  };

  const announce = (message) => {
    if (announceElement.value) {
      announceElement.value.textContent = message;
    }
  };

  return {
    isReading,
    toggleReading,
    announceElement,
  };
}
