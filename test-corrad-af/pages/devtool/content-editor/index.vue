<script setup>
definePageMeta({
  title: "Content Editor",
  middleware: ["auth"],
  requiresAuth: true,
});

const { $swal, $router } = useNuxtApp();
const router = useRouter();

const getPages = router.getRoutes();

const pages = getPages.filter((page) => {
  // Filter out pages in the devtool path
  if (page.path.includes("/devtool")) {
    return false;
  }

  // Use page.name if page.meta.title doesn't exist
  const pageTitle = page.meta?.title || page.name;

  return pageTitle && pageTitle !== "Home" && page.name;
});

const searchText = ref("");
const showModal = ref(false);
const modalData = ref({
  name: "",
  path: "",
});

const searchPages = () => {
  return pages.filter((page) => {
    const pageTitle = page.meta?.title || page.name;
    return pageTitle.toLowerCase().includes(searchText.value.toLowerCase());
  });
};

const capitalizeSentence = (sentence) => {
  return sentence
    .split(" ")
    .map((word) => {
      return word[0].toUpperCase() + word.slice(1);
    })
    .join(" ");
};

const templateOptions = ref([{ label: "Select Template", value: "" }]);
const selectTemplate = ref("");

const { data: templates } = await useFetch(
  "/api/devtool/content/template/list",
  {
    method: "GET",
  }
);

templateOptions.value.push(
  ...templates?.value.data.map((template) => {
    return {
      label: `${template.title} - ${template.id}`,
      value: template.id,
    };
  })
);

const importTemplate = (pageName) => {
  showModal.value = true;
  modalData.value.name = pageName;
  modalData.value.path = router.getRoutes().find((page) => {
    return page.name === pageName;
  }).path;
};

const confirmModal = async () => {
  $swal
    .fire({
      title: "Are you sure you want to import this template?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    })
    .then(async (result) => {
      if (result.isConfirmed) {
        const { data: res } = await useFetch(
          "/api/devtool/content/template/import",
          {
            initialCache: false,
            method: "GET",
            query: {
              path: modalData.value.path + "/index",
              templateId: selectTemplate.value,
            },
          }
        );

        if (res.value.statusCode == 200) {
          $swal.fire({
            title: "Success",
            text: res.value.message,
            icon: "success",
            confirmButtonText: "Ok",
            timer: 1000,
          });

          setTimeout(() => {
            $router.go();
          }, 1000);
        }
      }
    })
    .finally(() => {
      showModal.value = false;
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
          This page is used to edit the content of a page. You can edit the
          content of the page by choosing the page to edit from the card list
          below.
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
            v-for="page in searchPages()"
            :key="page.path"
            class="page shadow-md shadow-black/5 p-5 ring-1 ring-slate-700/10 rounded-lg"
          >
            <div class="pb-4">
              <h4 class="font-semibold">
                {{ capitalizeSentence(page.meta?.title || page.name) }}
              </h4>
              <nuxt-link :to="page.path">
                <div
                  class="flex items-center text-primary hover:text-primary/70"
                >
                  <Icon
                    class="mr-2"
                    name="ic:outline-link"
                    style="font-size: 1.2rem"
                  ></Icon>
                  <p class="text-sm">{{ page.path }}</p>
                </div>
              </nuxt-link>
            </div>
            <div
              class="button-list flex justify-between border-t pt-4 border-gray-300"
            >
              <div class="flex gap-x-2">
                <!-- <nuxt-link
                  :to="`/devtool/content-editor/canvas?page=${page.name}`"
                >
                  <rs-button variant="primary" class="!py-2 !px-3">
                    <Icon name="ph:paint-brush-broad"></Icon>
                  </rs-button>
                </nuxt-link> -->
                <nuxt-link
                  :to="`/devtool/content-editor/code?page=${page.name}`"
                >
                  <rs-button variant="primary" class="!py-2 !px-3">
                    <Icon
                      name="material-symbols:code-blocks-outline-rounded"
                    ></Icon>
                  </rs-button>
                </nuxt-link>
              </div>
              <rs-button
                variant="primary-text"
                class="!py-2 !px-3"
                @click="importTemplate(page.name)"
              >
                <Icon name="mdi:import"></Icon>
              </rs-button>
            </div>
          </div>
        </div>
      </div>
    </rs-card>

    <rs-modal :title="`Import (${modalData.name})`" v-model="showModal">
      <FormKit
        v-model="selectTemplate"
        type="select"
        label="Content Template"
        :options="templateOptions"
        validation="required"
        validation-visibility="dirty"
        help="Please choose carefully the template that you want to import. This action cannot be undone."
      />
      <template #footer>
        <rs-button @click="showModal = false" variant="primary-text">
          Cancel
        </rs-button>
        <rs-button @click="confirmModal" :disabled="!selectTemplate"
          >Confirm</rs-button
        >
      </template>
    </rs-modal>
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
