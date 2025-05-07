<script setup>
import iconJson from "@/assets/json/iconamoon.json";

definePageMeta({
  title: "Set Ikons",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    {
      name: "Set Ikons",
      type: "current",
    },
  ],
});

const copyToClipboard = (text) => {
  let tagHtml = '<Icon name="' + text + '" />';
  navigator.clipboard.writeText(tagHtml).then(() => {
    showTooltip(text, "Kod disalin!");
  });
};

const searchQuery = ref("");
const displayedIcons = ref([]);
const containerRef = ref(null);
const tooltips = reactive({});
const batchSize = 50;
let currentIndex = 0;

const filteredIcons = computed(() => {
  if (!searchQuery.value) return iconJson;
  return iconJson.filter((icon) =>
    icon.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const loadMoreIcons = () => {
  const newIcons = filteredIcons.value.slice(
    currentIndex,
    currentIndex + batchSize
  );
  displayedIcons.value.push(...newIcons);
  currentIndex += batchSize;
};

const resetIconDisplay = () => {
  displayedIcons.value = [];
  currentIndex = 0;
  loadMoreIcons();
};

const showTooltip = (iconName, message) => {
  tooltips[iconName] = message;
  setTimeout(() => {
    tooltips[iconName] = null;
  }, 2000);
};

watch(searchQuery, () => {
  resetIconDisplay();
  nextTick(() => {
    if (containerRef.value) {
      containerRef.value.scrollTop = 0;
    }
  });
});

onMounted(() => {
  resetIconDisplay();
});

const handleScroll = () => {
  if (!containerRef.value) return;

  const { scrollTop, scrollHeight, clientHeight } = containerRef.value;
  if (scrollHeight - scrollTop <= clientHeight + 1) {
    loadMoreIcons();
  }
};
</script>

<template>
  <div>
    <LayoutsBreadcrumb />

    <rs-card>
      <template #header>
        Set Ikon Icomoon (Jumlah: {{ filteredIcons.length }})
      </template>
      <template #body>
        <FormKit
          type="text"
          v-model="searchQuery"
          placeholder="Search icons..."
          class="mb-4"
        />

        <div
          ref="containerRef"
          class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 max-h-[70vh] overflow-y-auto"
          @scroll="handleScroll"
        >
          <div
            v-for="icon in displayedIcons"
            :key="icon.name"
            class="flex items-center relative"
          >
            <Icon :name="icon.name" class="!w-10 !h-10 mr-4"></Icon>
            <div class="flex flex-col">
              <div class="text-sm">{{ icon.name }}</div>
              <div class="relative">
                <rs-button
                  @click="copyToClipboard(icon.name)"
                  class="!text-xs !py-1 !px-2 !mt-1 relative"
                >
                  <Icon name="ph:copy" class="!w-4 !h-4 mr-1"></Icon>
                  Salin Kod
                </rs-button>
                <transition name="fade">
                  <span
                    v-if="tooltips[icon.name]"
                    class="absolute top-4 left-0 mt-4 bg-black text-white text-xs rounded py-1 px-2 z-10"
                  >
                    {{ tooltips[icon.name] }}
                  </span>
                </transition>
              </div>
            </div>
          </div>
        </div>
        <div v-if="displayedIcons.length === 0" class="text-center mt-4">
          No icons found matching your search.
        </div>
      </template>
    </rs-card>
  </div>
</template>
