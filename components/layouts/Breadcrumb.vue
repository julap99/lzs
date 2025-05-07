<script setup>
const route = useRoute();

// Define props for dynamic breadcrumb items
const props = defineProps({
  items: {
    type: Array,
    default: () => [],
    validator: (value) => {
      return value.every(
        (item) => typeof item === "object" && "name" in item && "path" in item
      );
    },
  },
  useRouteFallback: {
    type: Boolean,
    default: true,
  },
});

// Get breadcrumb from props or page meta
const breadcrumb = computed(() => {
  // If items prop is provided and not empty, use it
  if (props.items.length > 0) {
    return props.items;
  }

  console.log("props.items: ", props.items);

  // Fallback to route-based breadcrumb if useRouteFallback is true
  if (props.useRouteFallback) {
    let breadcrumb = null;
    const matched = route.matched;

    if (matched[matched.length - 1].meta?.breadcrumb) {
      breadcrumb = matched[matched.length - 1].meta.breadcrumb;
    } else {
      breadcrumb = matched.map((item) => {
        return {
          name: item.meta.title,
          path: item.path,
        };
      });
    }

    // Handle special types (current and parent)
    if (breadcrumb) {
      breadcrumb.forEach((item) => {
        if (item.type === "current") {
          item.path = route.path;
        } else if (item.type === "parent") {
          item.path = route.path.split("/").slice(0, -item.parentNo).join("/");
        }
      });
    }
    return breadcrumb;
  }

  return null;
});

console.log("breadcrumb: ", breadcrumb.value);

// Get title from page meta
const title = computed(() => {
  const matched = route.matched;
  const title = matched[matched.length - 1].meta.title;
  return title;
});

async function navigateMenu(path) {
  try {
    await navigateTo(path);
  } catch (e) {
    return;
  }
}
</script>

<template>
  <div v-if="breadcrumb" class="mb-6">
    <nav aria-label="Breadcrumb" class="mb-4">
      <ol class="flex items-center text-sm">
        <li class="flex items-center">
          <NuxtLink to="/" class="text-gray-500 hover:text-gray-700">
            <Icon name="mdi:home" size="16" />
          </NuxtLink>
        </li>
        <li v-for="(item, index) in breadcrumb" :key="index" class="flex items-center">
          <Icon
            name="mdi:chevron-right"
            size="16"
            class="mx-2 text-gray-400"
            aria-hidden="true"
          />
          <template v-if="item.type === 'current'">
            <span class="text-primary font-medium" :aria-current="'page'">
              {{ item.name }}
            </span>
          </template>
          <template v-else>
            <a
              @click="navigateMenu(item.path)"
              class="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              {{ item.name }}
            </a>
          </template>
        </li>
      </ol>
    </nav>

    <!-- <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-800">{{ title }}</h1>
      <slot name="right"></slot>
    </div> -->
  </div>
</template>
