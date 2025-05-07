<script setup>
definePageMeta({
  title: "API Editor",
  middleware: ["auth"],
  requiresAuth: true,
});

const nuxtApp = useNuxtApp();

const searchText = ref("");

const showModalAdd = ref(false);
const showModalAddForm = ref({
  apiURL: "",
});

const showModalEdit = ref(false);
const showModalEditForm = ref({
  apiURL: "",
  oldApiURL: "",
});

const openModalAdd = () => {
  showModalAddForm.value = {
    apiURL: "",
    method: "all",
  };

  showModalAdd.value = true;
};

const openModalEdit = (url, method = "all") => {
  const apiURL = url.replace("/api/", "");

  showModalEditForm.value = {
    apiURL: apiURL,
    oldApiURL: apiURL,
    method: method,
  };

  showModalEdit.value = true;
};

const { data: apiList, refresh } = await useFetch("/api/devtool/api/list");

const searchApi = () => {
  if (!apiList.value || !apiList.value.data) return [];

  return apiList.value.data.filter((api) => {
    return (
      api.name.toLowerCase().includes(searchText.value.toLowerCase()) ||
      api.url.toLowerCase().includes(searchText.value.toLowerCase())
    );
  });
};

const kebabCasetoTitleCase = (str) => {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const redirectToApiCode = (api) => {
  window.location.href = `/devtool/api-editor/code?path=${api}`;
};

const saveAddAPI = async () => {
  const { data } = await useFetch("/api/devtool/api/save", {
    initialCache: false,
    method: "POST",
    body: {
      path: "/api/" + showModalAddForm.value.apiURL,
      type: "add",
    },
  });

  if (data.value.statusCode === 200) {
    nuxtApp.$swal.fire({
      title: "Success",
      text: "The code has been saved successfully.",
      icon: "success",
      confirmButtonText: "Ok",
      timer: 1000,
    });
    // Close modal and refresh list
    showModalAdd.value = false;
    refresh();
  }
};

const saveEditAPI = async () => {
  const { data } = await useFetch("/api/devtool/api/save", {
    initialCache: false,
    method: "POST",
    body: {
      path: "/api/" + showModalEditForm.value.apiURL,
      oldPath: "/api/" + showModalEditForm.value.oldApiURL,
      type: "edit",
    },
  });

  if (data.value.statusCode === 200) {
    nuxtApp.$swal.fire({
      title: "Success",
      text: "The code has been saved successfully.",
      icon: "success",
      confirmButtonText: "Ok",
      timer: 1000,
    });
    // Close modal and refresh list
    showModalEdit.value = false;
    refresh();
  }
};

const deleteAPI = async (apiURL) => {
  nuxtApp.$swal
    .fire({
      title: "Are you sure to delete this API?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    })
    .then(async (result) => {
      if (result.isConfirmed) {
        const { data } = await useFetch("/api/devtool/api/save", {
          initialCache: false,
          method: "POST",
          body: {
            path: apiURL,
            type: "delete",
          },
        });

        if (data.value.statusCode === 200) {
          nuxtApp.$swal.fire({
            title: "Success",
            text: "The code has been saved successfully.",
            icon: "success",
            confirmButtonText: "Ok",
            timer: 1000,
          });
          // Refresh list after deletion
          refresh();
        }
      }
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
          This page is used to edit the api for the server side. You can edit
          the api by choosing the api to edit from the card list below.
        </p>
      </template>
    </rs-card>

    <rs-card>
      <div class="p-4">
        <div class="flex justify-end items-center mb-4">
          <rs-button @click="openModalAdd">
            <Icon name="material-symbols:add" class="mr-1"></Icon>
            Add API
          </rs-button>
        </div>

        <!-- Search Button -->
        <FormKit
          v-model="searchText"
          placeholder="Search Title..."
          type="search"
          class="mb-4"
        />
        <div v-auto-animate>
          <div
            class="shadow-md shadow-black/5 ring-1 ring-slate-700/10 rounded-lg mb-4"
            v-for="api in searchApi()"
          >
            <div class="relative p-4 border-l-8 border-primary rounded-lg">
              <div class="flex justify-between items-center">
                <div class="block">
                  <span class="font-semibold text-lg">{{
                    kebabCasetoTitleCase(api.name)
                  }}</span>
                  <br />
                  <span class=""> {{ api.url }}</span>
                </div>
                <div class="flex gap-4">
                  <rs-button
                    variant="primary-outline"
                    @click="redirectToApiCode(api.url)"
                  >
                    <Icon
                      name="material-symbols:code-blocks-outline-rounded"
                      class="mr-2"
                    />
                    Code Editor
                  </rs-button>
                  <div class="flex gap-2">
                    <rs-button @click="openModalEdit(api.url)">
                      <Icon name="material-symbols:edit-outline-rounded" />
                    </rs-button>
                    <rs-button @click="deleteAPI(api.url)">
                      <Icon name="carbon:trash-can" />
                    </rs-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </rs-card>

    <rs-modal title="Add API" v-model="showModalAdd" :overlay-close="false">
      <template #body>
        <FormKit type="form" :actions="false" @submit="saveAddAPI">
          <FormKit
            type="text"
            label="URL"
            :validation="[['required'], ['matches', '/^[a-z0-9/-]+$/']]"
            :validation-messages="{
              required: 'URL is required',
              matches:
                'URL contains invalid characters. Only letters, numbers, dashes, and forward slashes are allowed.',
            }"
            v-model="showModalAddForm.apiURL"
          >
            <template #prefix>
              <div
                class="bg-slate-100 dark:bg-slate-700 h-full rounded-l-md p-3"
              >
                /api/
              </div>
            </template>
          </FormKit>

          <!-- <FormKit
            type="select"
            label="Request Method"
            :options="requestMethods"
            validation="required"
            placeholder="Select a method"
            v-model="showModalAddForm.method"
          /> -->

          <div class="flex justify-end gap-2">
            <rs-button variant="outline" @click="showModalAdd = false">
              Cancel
            </rs-button>
            <rs-button btnType="submit">
              <Icon
                name="material-symbols:save-outline"
                class="mr-2 !w-4 !h-4"
              />
              Save
            </rs-button>
          </div>
        </FormKit>
      </template>
      <template #footer></template>
    </rs-modal>

    <rs-modal title="Edit API" v-model="showModalEdit" :overlay-close="false">
      <template #body>
        <FormKit type="form" :actions="false" @submit="saveEditAPI">
          <FormKit
            type="text"
            label="URL"
            :validation="[['required'], ['matches', '/^[a-z0-9/-]+$/']]"
            :validation-messages="{
              required: 'URL is required',
              matches:
                'URL contains invalid characters. Only letters, numbers, dashes, and forward slashes are allowed.',
            }"
            v-model="showModalEditForm.apiURL"
          >
            <template #prefix>
              <div
                class="bg-slate-100 dark:bg-slate-700 h-full rounded-l-md p-3"
              >
                /api/
              </div>
            </template>
          </FormKit>

          <!-- <FormKit
            type="select"
            label="Request Method"
            :options="requestMethods"
            validation="required"
            placeholder="Select a method"
            v-model="showModalEditForm.method"
          /> -->

          <div class="flex justify-end gap-2">
            <rs-button variant="outline" @click="showModalEdit = false">
              Cancel
            </rs-button>
            <rs-button btnType="submit">
              <Icon
                name="material-symbols:save-outline"
                class="mr-2 !w-4 !h-4"
              />
              Save
            </rs-button>
          </div>
        </FormKit>
      </template>
      <template #footer></template>
    </rs-modal>
  </div>
</template>
