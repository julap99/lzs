<script setup>
import Menu from "~/navigation/index.js";

definePageMeta({
  title: "Menu Editor",
  middleware: ["auth"],
  requiresAuth: true,
});
const nuxtApp = useNuxtApp();

const sideMenuList = ref(Menu);

const router = useRouter();
const getRoutes = router.getRoutes();
const getNavigation = Menu ? ref(Menu) : ref([]);

const allMenus = reactive([]);

const showCode = ref(false);
let i = 1;

const searchInput = ref("");

const showModal = ref(false);
const showModalEl = ref(null);
const dropdownMenu = ref([]);
const dropdownMenuValue = ref(null);

const showModalEdit = ref(false);
const showModalEditPath = ref(null);
const showModalEditForm = ref({
  title: "",
  name: "",
  path: "",
  guardType: "",
});
// const showModalEditEl = ref(null);

const showModalAdd = ref(false);
const showModalAddForm = ref({
  title: "",
  name: "",
  path: "",
});

const systemPages = [
  "/devtool",
  "/dashboard",
  "/login",
  "/logout",
  "/register",
  "/reset-password",
  "/forgot-password",
];

const kebabtoTitle = (str) => {
  if (!str) return str;
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Sort the routes into menus
getRoutes.sort((a, b) => {
  return a.path.localeCompare(b.path);
});

//----------------------------------------------------------------------------
//-------------------------FIRST CHILD TAB ITEM (END)-------------------------
//----------------------------------------------------------------------------

// Loop through the routes and add them to the menus
getRoutes.map((menu) => {
  let visibleMenu = false;

  // Check if the menu is visible
  for (let i = 0; i < getNavigation.value.length; i++) {
    if (getNavigation.value[i].child) {
      for (let j = 0; j < getNavigation.value[i].child.length; j++) {
        if (getNavigation.value[i].child[j].path === menu.path)
          visibleMenu = true;
        else if (getNavigation.value[i].child[j].child) {
          for (
            let k = 0;
            k < getNavigation.value[i].child[j].child.length;
            k++
          ) {
            if (getNavigation.value[i].child[j].child[k].path === menu.path)
              visibleMenu = true;
          }
        }
      }
    }
  }

  if (menu.name)
    allMenus.push({
      id: i++,
      title:
        menu.meta && menu.meta.title
          ? menu.meta.title
          : kebabtoTitle(menu.name),
      parentMenu: menu.path.split("/")[1],
      name: menu.name,
      path: menu.path,
      visible: visibleMenu,
      action: "",
    });
});

const openModalEdit = (menu) => {
  showModalEditForm.value.title = menu.title;
  showModalEditForm.value.name = menu.name;

  // If there is a slash in the beggining of the path, remove it
  if (menu.path.charAt(0) === "/") {
    showModalEditForm.value.path = menu.path.slice(1);
  } else {
    showModalEditForm.value.path = menu.path;
  }

  showModalEditPath.value = menu.path;

  showModalEdit.value = true;
};

const saveEditMenu = async () => {
  // Clean the name and title ensure not spacing at the beginning or end
  showModalEditForm.value.title = showModalEditForm.value.title.trim();
  showModalEditForm.value.name = showModalEditForm.value.name.trim();

  const res = await useFetch("/api/devtool/menu/edit", {
    method: "POST",
    initialCache: false,
    body: JSON.stringify({
      filePath: showModalEditPath.value,
      formData: {
        title: showModalEditForm.value.title || "",
        name: showModalEditForm.value.name || "",
        path: "/" + showModalEditForm.value.path || "",
      },
      // formData: showModalEditForm.value,
    }),
  });

  const data = res.data.value;

  if (data.statusCode === 200) {
    showModalEdit.value = false;

    nuxtApp.$swal.fire({
      title: "Success",
      text: data.message,
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });

    window.location.reload();
  }
};

const openModalAdd = () => {
  showModalAddForm.value.title = "";
  showModalAddForm.value.name = "";
  showModalAddForm.value.path = "";

  showModalAdd.value = true;
};

const saveAddMenu = async () => {
  // Clean the name and title ensure not spacing at the beginning or end
  showModalAddForm.value.title = showModalAddForm.value.title.trim();
  showModalAddForm.value.name = showModalAddForm.value.name.trim();

  const res = await useFetch("/api/devtool/menu/add", {
    method: "POST",
    initialCache: false,
    body: JSON.stringify({
      formData: {
        title: showModalAddForm.value.title || "",
        name: showModalAddForm.value.name || "",
        path: "/" + showModalAddForm.value.path || "",
      },
      // formData: showModalAddForm.value
    }),
  });

  const data = res.data.value;

  if (data.statusCode === 200) {
    showModalAdd.value = false;

    nuxtApp.$swal.fire({
      title: "Success",
      text: data.message,
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });

    window.location.reload();
  } else {
    nuxtApp.$swal.fire({
      title: "Error",
      text: data.message,
      icon: "error",
      timer: 2000,
      showConfirmButton: false,
    });
  }
};

const deleteMenu = async (menu) => {
  nuxtApp.$swal
    .fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    })
    .then(async (result) => {
      if (result.isConfirmed) {
        const res = await useFetch("/api/devtool/menu/delete", {
          method: "POST",
          initialCache: false,
          body: JSON.stringify({
            filePath: menu.path,
          }),
        });

        const data = res.data.value;

        if (data.statusCode === 200) {
          nuxtApp.$swal.fire({
            title: "Deleted!",
            text: data.message,
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });

          window.location.reload();
        }
      }
    });
};

//----------------------------------------------------------------------------
//-------------------------FIRST CHILD TAB ITEM (END)-------------------------
//----------------------------------------------------------------------------

//-----------------------------------------------------------------------
//-------------------------SECOND CHILD TAB ITEM-------------------------
//-----------------------------------------------------------------------

const checkExistSideMenuList = (path) => {
  let exist = false;
  sideMenuList.value.map((menu) => {
    // Search child path
    if (menu.child) {
      menu.child.map((child) => {
        if (child.path == path) {
          exist = true;
        }

        if (child.child) {
          child.child.map((child2) => {
            if (child2.path == path) {
              exist = true;
            }
          });
        }
      });
    }
  });
  return exist;
};

const menuList = computed(() => {
  // If the search input is empty, return all menus
  if (searchInput.value === "") {
    return allMenus;
  } else {
    // If the search input is not empty, filter the menus
    return allMenus.filter((menu) => {
      return menu.name.toLowerCase().includes(searchInput.value.toLowerCase());
    });
  }
});

// Clone draggable item
const clone = (obj) => {
  return JSON.parse(
    JSON.stringify({
      title: obj.title,
      path: obj.path,
      icon: obj.icon ? obj.icon : "",
      child: [],
    })
  );
};

// Add Header
const addNewHeader = () => {
  // Push index = 1
  sideMenuList.value.splice(1, 0, {
    header: "New Header",
    description: "New Description",
    child: [],
  });
};

// changeSideMenuList
const changeSideMenuList = (menus) => {
  sideMenuList.value = menus;
};

// Save the menu
const overwriteJsonFileLocal = async (menus) => {
  const res = await useFetch("/api/devtool/menu/overwrite-navigation", {
    method: "POST",
    initialCache: false,
    body: JSON.stringify({
      menuData: menus,
    }),
  });

  const data = res.data.value;

  if (data.statusCode === 200) {
    nuxtApp.$swal.fire({
      title: "Success",
      text: data.message,
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
  }
};

// open modal
const openModal = (menu) => {
  showModalEl.value = menu;

  // Get All Menu includes child and assign to dropdownMenu in one array
  let i = 0;
  dropdownMenu.value = [
    {
      label: "Choose Menu",
      value: null,
      attrs: {
        disabled: true,
      },
    },
  ];

  sideMenuList.value.map((menu) => {
    if (menu.header || menu.description) {
      dropdownMenu.value.push({
        label: `${menu.header} (Header)`,
        value: `header|${i}`,
      });
    } else if (menu.hasOwnProperty("header")) {
      dropdownMenu.value.push({
        label: `<No Header Name> (Header)`,
        value: `header|${i}`,
      });
    }

    if (menu.child) {
      menu.child.map((child) => {
        dropdownMenu.value.push({
          label: `${child.title} (Menu)`,
          value: `menu|${child.path}`,
        });
      });
    }

    i++;
  });

  showModal.value = true;
};

// Add new menu from list
const addMenuFromList = () => {
  if (dropdownMenuValue.value) {
    const menuType = dropdownMenuValue.value.split("|")[0];
    const menuValue = dropdownMenuValue.value.split("|")[1];

    if (menuType === "header") {
      // Add Header
      sideMenuList.value[menuValue].child.push(clone(showModalEl.value));
    } else if (menuType === "menu") {
      // Add Menu
      sideMenuList.value.map((menu) => {
        if (menu.child) {
          menu.child.map((child) => {
            if (child.path == menuValue) {
              child.child.push(clone(showModalEl.value));
            }
          });
        }
      });
    }

    showModal.value = false;
  }
};

//-----------------------------------------------------------------------------
//-------------------------SECOND CHILD TAB ITEM (END)-------------------------
//-----------------------------------------------------------------------------

// Add this watcher after the showModalEditForm ref declaration
watch(
  () => showModalEditForm.value,
  (newTitle) => {
    showModalEditForm.value.name = newTitle.toLowerCase().replace(/\s+/g, "-");
  }
);

watch(
  () => showModalAddForm.value.title,
  (newTitle) => {
    showModalAddForm.value.name = newTitle.toLowerCase().replace(/\s+/g, "-");
  }
);
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
          This page is used to edit the menu of the website. You can add, edit,
          and delete menu items. You can also change the order of the menu items
          by dragging and dropping them.
        </p>
      </template>
    </rs-card>

    <rs-card>
      <div class="pt-2">
        <rs-tab fill>
          <rs-tab-item title="All Menu">
            <div class="flex justify-end items-center mb-4">
              <rs-button @click="openModalAdd">
                <Icon name="material-symbols:add" class="mr-1"></Icon>
                Add Menu
              </rs-button>
            </div>
            <!-- Table All Menu -->
            <rs-table
              :data="allMenus"
              :options="{
                variant: 'default',
                striped: true,
                borderless: true,
              }"
              :options-advanced="{
                sortable: true,
                filterable: false,
                responsive: false,
              }"
              advanced
            >
              <template v-slot:name="data">
                <NuxtLink
                  class="text-blue-700 hover:underline"
                  :to="data.value.path"
                  target="_blank"
                  >{{ data.text }}</NuxtLink
                >
              </template>
              <template v-slot:visible="data">
                <div class="flex items-center">
                  <Icon
                    name="mdi:eye-outline"
                    class="text-primary"
                    size="22"
                    v-if="data.value.visible"
                  />
                  <Icon
                    name="mdi:eye-off-outline"
                    class="text-primary/20"
                    size="22"
                    v-else
                  />
                </div>
              </template>
              <template v-slot:action="data">
                <div class="flex items-center">
                  <template
                    v-if="
                      !systemPages.some((path) =>
                        data.value.path.startsWith(path)
                      ) && data.value.parentMenu != 'admin'
                    "
                  >
                    <Icon
                      name="material-symbols:edit-outline-rounded"
                      class="text-primary hover:text-primary/90 cursor-pointer mr-1"
                      size="22"
                      @click="openModalEdit(data.value)"
                    ></Icon>
                    <Icon
                      name="material-symbols:close-rounded"
                      class="text-primary hover:text-primary/90 cursor-pointer"
                      size="22"
                      @click="deleteMenu(data.value)"
                    ></Icon>
                  </template>
                  <div v-else class="text-gray-400">-</div>
                </div>
              </template>
            </rs-table>
          </rs-tab-item>
          <rs-tab-item title="Manage Side Menu">
            <div class="flex justify-end items-center mb-4">
              <rs-button
                class="mr-2"
                @click="showCode ? (showCode = false) : (showCode = true)"
              >
                <Icon name="ic:baseline-code" class="mr-2"></Icon>
                {{ showCode ? "Hide" : "Show" }} JSON Code
              </rs-button>
              <rs-button @click="overwriteJsonFileLocal(sideMenuList)">
                <Icon name="mdi:content-save-outline" class="mr-2"></Icon>
                Save Menu
              </rs-button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <FormKit
                  type="search"
                  placeholder="Search Menu..."
                  outer-class="mb-5"
                  v-model="searchInput"
                />
                <NuxtScrollbar
                  style="height: 735px"
                  class="px-5 pt-5 border border-[rgb(var(--border-color))] bg-[rgb(var(--bg-1))] rounded-md"
                >
                  <draggable
                    item-key="id"
                    v-model="menuList"
                    :group="{ name: 'menu', pull: 'clone', put: false }"
                    :clone="clone"
                    :sort="false"
                  >
                    <template #item="{ element }">
                      <rs-card
                        class="p-4 mb-4 border-2 border-[rgb(var(--border-color))] !shadow-none"
                      >
                        <div class="flex justify-between items-center">
                          <p>
                            {{ kebabtoTitle(element.name) }} (
                            <NuxtLink
                              class="text-primary hover:underline"
                              :to="element.path"
                              target="_blank"
                            >
                              {{ element.path }}
                            </NuxtLink>
                            )
                          </p>
                          <Icon
                            v-if="checkExistSideMenuList(element.path) == false"
                            name="ic:baseline-arrow-circle-right"
                            class="text-primary cursor-pointer transition-all duration-150 hover:scale-110"
                            @click="openModal(element)"
                          ></Icon>
                        </div>
                      </rs-card>
                    </template>
                  </draggable>
                </NuxtScrollbar>
              </div>
              <NuxtScrollbar v-if="!showCode" style="height: 825px">
                <rs-card
                  class="p-4 border border-[rgb(var(--border-color))] bg-[rgb(var(--bg-1))] rounded-md"
                >
                  <div class="flex justify-end items-center">
                    <rs-button
                      class="!p-2 mt-3 justify-center items-center"
                      @click="addNewHeader"
                    >
                      <Icon
                        class="mr-1"
                        name="material-symbols:docs-add-on"
                        size="18"
                      ></Icon>
                      Add Header
                    </rs-button>
                  </div>
                  <DraggableSideMenuNested
                    :menus="sideMenuList"
                    @changeSideMenu="changeSideMenuList"
                  />
                </rs-card>
              </NuxtScrollbar>
              <pre v-else v-html="JSON.stringify(sideMenuList, null, 2)"></pre>
            </div>
          </rs-tab-item>
        </rs-tab>
      </div>
    </rs-card>

    <rs-modal
      title="Select Menu"
      v-model="showModal"
      ok-title="Confirm"
      :ok-callback="addMenuFromList"
    >
      <FormKit
        label="Please Select Menu or Header"
        help="Select menu or header to add as their child menu"
        type="select"
        v-model="dropdownMenuValue"
        :options="dropdownMenu"
      ></FormKit>
    </rs-modal>

    <rs-modal title="Edit Menu" v-model="showModalEdit" :overlay-close="false">
      <template #body>
        <FormKit type="form" :actions="false" @submit="saveEditMenu">
          <FormKit
            type="text"
            label="Title"
            :validation="[['required'], ['matches', '/^[a-zA-Z0-9]+$/']]"
            :validation-messages="{
              required: 'Title is required',
              matches:
                'Title contains invalid characters. Only letters and numbers are allowed.',
            }"
            v-model="showModalEditForm.title"
          />

          <FormKit
            type="text"
            label="Path"
            help="If the last path name is '/', the name of the file will be from its name property. While if the last path name is not '/', the name of the file will be from its path property."
            :validation="[['required'], ['matches', '/^[a-z0-9/-]+$/']]"
            :validation-messages="{
              required: 'Path is required',
              matches:
                'Path contains invalid characters or spacing before or after. Only letters, numbers, dashes, and underscores are allowed.',
            }"
            v-model="showModalEditForm.path"
          >
            <template #prefix>
              <div
                class="bg-slate-100 dark:bg-slate-700 h-full rounded-l-md p-3"
              >
                /
              </div>
            </template>
          </FormKit>
          <div class="flex justify-end gap-2">
            <rs-button variant="outline" @click="showModalEdit = false">
              Cancel
            </rs-button>
            <rs-button btnType="submit">
              <Icon
                name="material-symbols:save-outline"
                class="mr-2 !w-4 !h-4"
              />
              Save Changes
            </rs-button>
          </div>
        </FormKit>
      </template>

      <template #footer> </template>
    </rs-modal>

    <rs-modal title="Add Menu" v-model="showModalAdd" :overlay-close="false">
      <template #body>
        <FormKit type="form" :actions="false" @submit="saveAddMenu">
          <FormKit
            type="text"
            label="Title"
            :validation="[['required'], ['matches', '/^[a-zA-Z0-9]+$/']]"
            :validation-messages="{
              required: 'Title is required',
              matches:
                'Title contains invalid characters. Only letters and numbers are allowed.',
            }"
            v-model="showModalAddForm.title"
          />

          <FormKit
            type="text"
            label="Path"
            help="If the last path name is '/', the name of the file will be from its name property. While if the last path name is not '/', the name of the file will be from its path property."
            :validation="[['required'], ['matches', '/^[a-z0-9/-]+$/']]"
            :validation-messages="{
              required: 'Path is required',
              matches:
                'Path contains invalid characters or spacing before or after. Only letters, numbers, dashes, and underscores are allowed.',
            }"
            v-model="showModalAddForm.path"
          >
            <template #prefix>
              <div
                class="bg-slate-100 dark:bg-slate-700 h-full rounded-l-md p-3"
              >
                /
              </div>
            </template>
          </FormKit>
          <div class="flex justify-end gap-2">
            <rs-button variant="outline" @click="showModalAdd = false">
              Cancel
            </rs-button>
            <rs-button btnType="submit">
              <Icon
                name="material-symbols:add-circle-outline-rounded"
                class="mr-2 !w-4 !h-4"
              />
              Add Menu
            </rs-button>
          </div>
        </FormKit>
      </template>

      <template #footer> </template>
    </rs-modal>
  </div>
</template>
