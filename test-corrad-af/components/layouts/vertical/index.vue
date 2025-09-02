<script setup>
import { useLayoutStore } from "~/stores/layout";

import RSHeader from "~/components/layouts/Header.vue";
import RSSideMenu from "~~/components/layouts/sidemenu/index.vue";
// import RSConfigMenu from "~~/components/layouts/configmenu/index.vue";
// import RSFooter from "~/components/layouts/Footer.vue";
import { useWindowSize } from "vue-window-size";

const { width } = useWindowSize();
const layoutStore = useLayoutStore();
const mobileWidth = layoutStore.mobileWidth;

// watch for window size changes
watch(
  () => [width.value],
  ([width]) => {
    if (width <= mobileWidth) {
      document.querySelector(".v-layout").classList.add("menu-hide");
      document.getElementsByClassName("menu-overlay")[0].classList.add("hide");
    } else document.querySelector(".v-layout").classList.remove("menu-hide");
  }
);

function toggleMenu(event) {
  document.querySelector(".v-layout").classList.toggle("menu-hide");
  document.getElementsByClassName("menu-overlay")[0].classList.toggle("hide");
}
</script>

<template>
  <RSHeader @toggleMenu="toggleMenu" />
  <RSSideMenu />
  <div class="content-page duration-300">
    <slot />
  </div>
  <!-- <RSConfigMenu /> -->
  <div @click="toggleMenu" class="menu-overlay"></div>

  <!-- <RSFooter /> -->
</template>
