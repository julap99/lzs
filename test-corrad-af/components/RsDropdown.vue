<script setup>
import { directive as vClickAway } from "vue3-click-away";

const props = defineProps({
  title: {
    type: String,
    default: "Default",
  },
  variant: {
    type: String,
    default: "primary",
  },
  position: {
    type: String,
    default: "bottom",
  },
  textAlign: {
    type: String,
    default: "left",
  },
  size: {
    type: String,
    default: "md",
  },
  itemSize: {
    type: String,
    default: "10rem",
  },
});

const isOpen = ref(false);
const dropdownRef = ref(null);

let originalPosition = null; // Store the original position of the dropdown
let lastKnownPosition = null; // Store the last known position of the dropdown

const toggle = (event) => {
  isOpen.value = !isOpen.value;
};

const closeMenu = (event) => {
  isOpen.value = false;
};

// Add a watcher for isOpen to reposition the dropdown when it's open
watch(isOpen, (newValue) => {
  if (newValue) {
    positionDropdown();
  }
});

// Helper function to position the dropdown relative to the viewport
const positionDropdown = () => {
  const dropdownElement = dropdownRef.value;
  const dropdownSection = dropdownElement.querySelector(".dropdown-section");

  if (!dropdownElement || !dropdownSection) return;

  // Get the bounding rect of the dropdown and its section
  const dropdownRect = dropdownElement.getBoundingClientRect();
  const dropdownSectionRect = dropdownSection.getBoundingClientRect();

  // Get the viewport dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Check if the dropdown overflows the right or left side of the viewport
  const rightOverflow =
    dropdownRect.right + dropdownSectionRect.width - viewportWidth;
  const leftOverflow = dropdownRect.left - dropdownSectionRect.width;

  if (rightOverflow > 0) {
    dropdownSection.style.right = "0";
    dropdownSection.style.left = "unset";
  } else if (leftOverflow < 0) {
    dropdownSection.style.left = "0";
    dropdownSection.style.right = "unset";
  }

  // Check if the dropdown overflows the bottom or top of the viewport
  const bottomOverflow =
    dropdownRect.bottom + dropdownSectionRect.height - viewportHeight;
  const topOverflow = dropdownRect.top - dropdownSectionRect.height;

  if (bottomOverflow > 0) {
    dropdownSection.style.bottom = "100%";
    dropdownSection.style.top = "unset";
  } else if (topOverflow < 0) {
    dropdownSection.style.top = "100%";
    dropdownSection.style.bottom = "unset";
  }

  // Check if the position changed and update the lastKnownPosition
  const newPosition = dropdownSection.getBoundingClientRect();
  if (
    !lastKnownPosition ||
    JSON.stringify(lastKnownPosition) !== JSON.stringify(newPosition)
  ) {
    lastKnownPosition = newPosition;
  }

  // Check if the dropdown is out of the viewport and reset its position to original
  if (
    isOpen.value &&
    originalPosition &&
    isOutOfViewport(dropdownSection, originalPosition)
  ) {
    dropdownSection.style.top = originalPosition.top + "px";
    dropdownSection.style.left = originalPosition.left + "px";
    lastKnownPosition = originalPosition;
  }
};

// Check if the element is out of the viewport
const isOutOfViewport = (element, position) => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  return (
    position.left < 0 ||
    position.right > viewportWidth ||
    position.top < 0 ||
    position.bottom > viewportHeight
  );
};

// Watch for viewport size changes (e.g., window resize) to reposition the dropdown
const handleResize = () => {
  if (isOpen.value) {
    positionDropdown();
  }
};

// Watch for scrolling to reposition the dropdown
const handleScroll = () => {
  if (isOpen.value) {
    positionDropdown();
  }
};

onMounted(() => {
  // Add a listener for window resize to reposition the dropdown
  window.addEventListener("resize", handleResize);
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  // Remove the window resize listener when the component is unmounted
  window.removeEventListener("resize", handleResize);
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div class="dropdown" ref="dropdownRef" v-click-away="closeMenu">
    <button
      @click="toggle"
      class="button"
      :class="{
        'button-sm': size === 'sm',
        'button-md': size === 'md',
        'button-lg': size === 'lg',

        // Filled Button
        'button-primary': variant === 'primary',
        'button-secondary': variant === 'secondary',
        'button-info': variant === 'info',
        'button-success': variant === 'success',
        'button-warning': variant === 'warning',
        'button-danger': variant === 'danger',

        // Outline Button
        'outline-primary': variant === 'primary-outline',
        'outline-secondary': variant === 'secondary-outline',
        'outline-info': variant === 'info-outline',
        'outline-success': variant === 'success-outline',
        'outline-warning': variant === 'warning-outline',
        'outline-danger': variant === 'danger-outline',

        //Text Button
        'texts-primary': variant === 'primary-text',
        'texts-secondary': variant === 'secondary-text',
        'texts-info': variant === 'info-text',
        'texts-success': variant === 'success-text',
        'texts-warning': variant === 'warning-text',
        'texts-danger': variant === 'danger-text',
      }"
      type="button"
    >
      <slot v-if="$slots.title" name="title"></slot>
      <span v-else>{{ props.title }}</span>
      <Icon
        v-if="position === 'bottom'"
        name="ic:outline-keyboard-arrow-down"
      />
      <Icon
        v-else-if="position === 'top'"
        name="ic:outline-keyboard-arrow-up"
      />
      <Icon v-else-if="position === 'left'" name="ic:outline-chevron-left" />
      <Icon v-else-if="position === 'right'" name="ic:outline-chevron-right" />
    </button>
    <section
      class="dropdown-section"
      :class="{
        'list-bottom-sm': position == 'bottom' && size == 'sm',
        'list-bottom-md': position == 'bottom' && size == 'md',
        'list-bottom-lg': position == 'bottom' && size == 'lg',
        'list-top-sm': position == 'top' && size == 'sm',
        'list-top-md': position == 'top' && size == 'md',
        'list-top-lg': position == 'top' && size == 'lg',
        'list-left': position == 'left',
        'list-right': position == 'right',
        'list-align-right':
          (position == 'bottom' || position == 'top') && textAlign == 'right',
      }"
      :style="`min-width: ${itemSize}`"
      v-show="isOpen"
    >
      <slot></slot>
    </section>
  </div>
</template>
