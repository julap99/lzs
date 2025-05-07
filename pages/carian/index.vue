<script setup>
definePageMeta({
  title: "Carian",
  breadcrumb: [
    {
      name: "Carian",
      type: "current",
    },
  ],
});

const categories = ref([
  "Semua Kategori",
  "Kategori 1",
  "Kategori 2",
  "Kategori 3",
]);
const selectedCategory = ref("Semua Kategori");

const criteria = ref([
  { label: "Kriteria 1", options: ["Pilihan 1", "Pilihan 2", "Pilihan 3"] },
  { label: "Kriteria 2", options: ["Pilihan A", "Pilihan B", "Pilihan C"] },
  { label: "Kriteria 3", options: ["Pilihan X", "Pilihan Y", "Pilihan Z"] },
  { label: "Kriteria 4", options: ["Pilihan 1", "Pilihan 2", "Pilihan 3"] },
  {
    label: "Kriteria 5",
    options: ["Pilihan A", "Pilihan B", "Pilihan C"],
  },
]);

const searchQuery = ref("");

const performSearch = () => {
  // Implement search logic here
  console.log("Performing search with:", searchQuery.value);
};
</script>
<template>
  <div>
    <LayoutsBreadcrumb />

    <rs-card>
      <template #header> Carian laman </template>
      <template #body>
        <FormKit type="form" @submit="performSearch" submit-label="Search">
          <div class="flex items-center space-x-2 mb-4">
            <FormKit
              v-model="searchQuery"
              type="text"
              name="search"
              placeholder="Carian..."
              :classes="{
                outer: 'flex-grow',
                input: 'w-full',
              }"
            >
              <template #prefixIcon>
                <Icon
                  name="ph:magnifying-glass"
                  class="!w-5 !h-5 ml-3 text-gray-500"
                ></Icon>
              </template>
            </FormKit>
            <FormKit
              type="select"
              v-model="selectedCategory"
              :options="categories"
              placeholder="Semua Kategori"
              :classes="{
                outer: 'w-48',
              }"
            />
          </div>

          <div class="text-lg font-medium text-gray-700 mb-4">
           Carian Terperinci
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <FormKit
              v-for="(item, index) in criteria.slice(0, 2)"
              :key="index"
              type="select"
              :name="item.label.toLowerCase().replace(' ', '_')"
              :label="item.label"
              :options="item.options"
              placeholder="Pilih pilihan"
            >
              <template #label>
                <label
                  class="formkit-label text-gray-700 dark:text-gray-200 block mb-2 font-semibold text-sm formkit-invalid:text-red-500"
                >
                  {{ item.label }}
                </label>
              </template>
            </FormKit>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <FormKit
              v-for="(item, index) in criteria.slice(2)"
              :key="index"
              type="select"
              :name="item.label.toLowerCase().replace(' ', '_')"
              :label="item.label"
              :options="item.options"
              placeholder="Pilih pilihan"
            >
              <template #label>
                <label
                  class="formkit-label text-gray-700 dark:text-gray-200 block mb-2 font-semibold text-sm formkit-invalid:text-red-500"
                >
                  {{ item.label }}
                </label>
              </template>
            </FormKit>
          </div>
        </FormKit>
      </template>
    </rs-card>
  </div>
</template>
