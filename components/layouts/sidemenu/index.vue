<script setup>
import Menu from "~/navigation/index.js";
import RSItem from "~/components/layouts/sidemenu/Item.vue";

// const menuItem = Menu;

const props = defineProps({
  menuItem: {
    type: Array,
    default: () => Menu,
    required: false,
  },
});

onMounted(() => {
  try {
    const el = document.querySelector(".active-menu").closest(".menu-content");
    const elParent = el.parentElement.parentElement;

    if (elParent) {
      elParent.classList.remove("hide");
      elParent.querySelector("a").classList.add("nav-open");
    }
    if (el) el.classList.remove("hide");
  } catch (e) {
    // console.log(e);
    return;
  }
});
</script>

<template>
  <div class="vertical-menu">
    <div class="py-2 px-4 bg-[rgb(var(--header))]">
      <nuxt-link to="/">
        <div class="flex flex-auto justify-center items-center">
          <img
            class="h-12 block"
            src="https://www.zakatselangor.com.my/wp-content/uploads/2018/10/lzs-logo.png"
            alt="LZS Logo"
          />
        </div>
      </nuxt-link>
    </div>
    <NuxtScrollbar
      class="flex flex-col justify-between my-6"
      style="max-height: 82dvh"
    >
      <RSItem :items="menuItem"></RSItem>
    </NuxtScrollbar>
  </div>
</template>
