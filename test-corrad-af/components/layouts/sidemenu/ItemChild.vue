<script setup>
import { useLayoutStore } from "~/stores/layout";
import { useWindowSize } from "vue-window-size";
import RSChildItem from "~/components/layouts/sidemenu/ItemChild.vue";
import { useUserStore } from "~/stores/user";

const layoutStore = useLayoutStore();
const mobileWidth = layoutStore.mobileWidth;
const { width } = useWindowSize();

const user = useUserStore();
const route = useRoute();
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  indent: {
    type: Number,
    default: 0.5,
  },
});
const emit = defineEmits(["openMenu"]);

const indent = ref(props.indent);

const menuItem = props.items ? props.items : [];

const username = user.username;
const roles = user.roles;

// validate userExist on meta.auth.user
function userExist(item) {
  if (item.meta?.auth?.user) {
    if (item.meta?.auth?.user.includes(username)) {
      return true;
    } else {
      return false;
    }
  }
  return true;
}

// validate roleExist on meta.auth.role
function roleExist(item) {
  if (item.meta?.auth?.role) {
    if (item.meta?.auth?.role.some((r) => roles.includes(r))) {
      return true;
    } else {
      return false;
    }
  }
  return true;
}

// Toggle Open/Close menu
function openMenu(event) {
  emit("openMenu", event);
}

// Active menu
function activeMenu(routePath) {
  return route.path == routePath
    ? `bg-[rgb(var(--color-primary))] font-normal text-white active-menu`
    : `font-light text-white/90 md:transition-all md:duration-200 hover:md:ml-2`;
}

function toggleMenu() {
  document.querySelector(".v-layout").classList.toggle("menu-hide");
  document.getElementsByClassName("menu-overlay")[0].classList.toggle("hide");
}

function navigationPage(path, external) {
  if (width.value <= mobileWidth) toggleMenu();
  navigateTo(path, {
    external: external,
  });
}

const indentStyle = computed(() => {
  return { "background-color": `rgba(var(--sidebar-menu), ${indent.value})` };
});
</script>

<template>
  <ul
    class="menu-content hide transition-all duration-300"
    :style="indentStyle"
  >
    <li
      v-for="(item, index) in menuItem"
      :key="index"
      @click.stop="
        item.child !== undefined || (item.child && item.child.length !== 0)
          ? openMenu($event)
          : ''
      "
    >
      <div
        v-if="
          !item.meta || !item.meta?.auth || (userExist(item) && roleExist(item))
        "
        class="navigation-item-wrapper"
      >
        <NuxtLink
          v-if="
            item.child === undefined || (item.child && item.child.length === 0)
          "
          class="flex items-center px-6 py-3 cursor-pointer"
          @click="navigationPage(item.path, item.external)"
          :class="activeMenu(item.path)"
        >
          <Icon v-if="item.icon" :name="item.icon" size="18"></Icon>
          <span class="mx-4 font-normal">{{ item.title }}</span>
          <Icon
            v-if="item.child && item.child.length > 0"
            class="ml-auto side-menu-arrow"
            name="material-symbols:chevron-right-rounded"
            size="18"
          ></Icon>
        </NuxtLink>
        <a
          v-else
          class="flex items-center px-6 py-3 rounded-lg cursor-pointer"
          :class="activeMenu(item.path)"
        >
          <span class="mx-3 font-normal">{{ item.title }}</span>
          <Icon
            v-if="item.child && item.child.length > 0"
            class="ml-auto side-menu-arrow"
            name="material-symbols:chevron-right-rounded"
            size="18"
          ></Icon>
        </a>
        <RSChildItem
          v-if="item.child"
          :items="item.child"
          :indent="indent + 0.1"
          @openMenu="openMenu"
          @activeMenu="activeMenu"
        ></RSChildItem>
      </div>
    </li>
  </ul>
</template>
