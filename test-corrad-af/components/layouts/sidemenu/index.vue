<script setup>
import Menu from "~/navigation/index.js";
import RSItem from "~/components/layouts/sidemenu/Item.vue";

// Use site settings composable
const { siteSettings } = useSiteSettings();

// Add computed to ensure logo reactivity
const logoToShow = computed(() => {
  // Always try to use the siteLogo from settings first
  if (siteSettings.value?.siteLogo && siteSettings.value.siteLogo.trim() !== '') {
    return siteSettings.value.siteLogo;
  }
  // Fallback to default logo if siteLogo is not set
  return '/img/logo/corradAF-logo.svg'; 
});

const siteNameToShow = computed(() => {
  return siteSettings.value.siteName || 'Jabatan Imigresen Malaysia';
});

// const menuItem = Menu;

const props = defineProps({
  menuItem: {
    type: Array,
    default: () => Menu,
    required: false,
  },
  sidebarToggle: {
    type: Boolean,
    default: false,
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
        <div class="flex flex-auto gap-3 justify-center items-center h-[48px]">
          <div
            class="app-logo text-center h-20 flex justify-center items-center gap-3 px-4"
          >
            <nuxt-link to="/" class="flex items-center justify-center">
              <img
                :src="logoToShow"
                class="logo h-8"
                alt="logo"
                @error="$event.target.src = '/img/logo/corradAF-logo.svg'"
              />
              <div
                v-if="siteSettings.value?.showSiteNameInHeader && siteSettings.value?.siteName"
                class="title-text app-title font-semibold text-xl ml-3"
                :style="{ fontSize: (siteSettings.value?.siteNameFontSize || 18) + 'px' }"
              >
                {{ siteNameToShow }}
              </div>
            </nuxt-link>
          </div>
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
