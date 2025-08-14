<script setup>
definePageMeta({
  title: "Template Editor",
  middleware: ["auth"],
  requiresAuth: true,
});

const searchText = ref("");

const { data: templateList } = await useFetch(
  "/api/devtool/content/template/list",
  {
    method: "GET",
  }
);

// Search function that can search the template by title and tags if tags is available after data is fetched
const searchTemplate = () => {
  return templateList?.value.data.filter((template) => {
    return template.title
      .toLowerCase()
      .includes(searchText.value.toLowerCase());
  });
};
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <div class="flex">
          <Icon class="mr-2 flex justify-center" name="ic:outline-info"></Icon
          >Info
        </div>
      </template>
      <template #body>
        <p class="mb-4">
          This webpage serves as a platform for template management, enabling
          users to select and utilize templates for rendering pages according to
          their chosen design.
        </p>
      </template>
    </rs-card>

    <rs-card>
      <div class="p-4">
        <!-- Search Button -->
        <FormKit
          v-model="searchText"
          placeholder="Search Title..."
          type="search"
        />

        <div
          class="page-wrapper grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          v-auto-animate
        >
          <!-- <div
            class="page border-2 border-gray-400 border-dashed rounded-lg"
            style="min-height: 250px"
          >
            Add New Page
          </div> -->
          <div
            v-for="val in searchTemplate()"
            class="page shadow-md shadow-black/5 ring-1 ring-slate-700/10 rounded-lg"
            style="min-height: 250px"
          >
            <div class="thumbnail-wrapper relative">
              <div class="button-list absolute bottom-3 right-3 flex z-10">
                <nuxt-link :to="val.img" target="_blank">
                  <rs-button class="!py-2 !px-3 rounded-r-none">
                    <Icon name="material-symbols:fullscreen-rounded"></Icon>
                  </rs-button>
                </nuxt-link>
                <nuxt-link
                  :to="`/devtool/content-editor/template/view/${val.id}`"
                >
                  <rs-button class="!py-2 !px-3 rounded-l-none">
                    <Icon name="material-symbols:preview"></Icon>
                  </rs-button>
                </nuxt-link>
              </div>

              <img
                class="thumbnail rounded-tl-lg rounded-tr-lg bg-[#F3F4F6]"
                style="height: 250px; width: 100%; object-fit: contain"
                :src="val.img"
                alt=""
              />
              <div
                class="overlay-img opacity-10 bg-black text-black before:content-['Hello_World'] absolute top-0 left-0 w-full h-full rounded-tl-lg rounded-tr-lg"
              ></div>
            </div>
            <div class="p-4">
              <h4 class="font-semibold">{{ val.title }} ({{ val.id }})</h4>
              <div class="flex items-center mb-4">
                <p class="text-sm">{{ val.description }}</p>
              </div>
              <div
                class="tag h-10 flex justify-start items-center overflow-x-auto gap-x-2"
              >
                <rs-badge v-for="val2 in val.tag">
                  {{ val2 }}
                </rs-badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </rs-card>
  </div>
</template>

<style lang="scss" scoped>
.thumbnail::before {
  content: "";
  display: block;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.8);
}
</style>
