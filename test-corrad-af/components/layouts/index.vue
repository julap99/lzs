<script setup>
import { useThemeStore } from "~/stores/theme";

// Import Layout Components
import RSVertical from "~/components/layouts/vertical/index.vue";
import RSHorizontal from "~/components/layouts/horizontal/index.vue";

const themeStore = useThemeStore();
const layoutType = themeStore.layoutType;
</script>

<template>
  <div class="layout-wrapper">
    <div v-if="layoutType === 'vertical'" class="v-layout h-100">
      <RSVertical>
        <slot />
      </RSVertical>
    </div>
    <div v-if="layoutType === 'horizontal'" class="h-layout h-100">
      <RSHorizontal>
        <slot />
      </RSHorizontal>
    </div>
  </div>
</template>
