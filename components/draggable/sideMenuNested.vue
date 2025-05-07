<script setup>
import DraggableSideMenuNested from "~/components/draggable/sideMenuNested.vue";
const props = defineProps({
  menus: {
    required: true,
    type: Array,
  },
  count: {
    required: false,
    default: 0,
    type: Number,
  },
  parentMenu: {
    required: false,
    default: [],
    type: Array,
  },
});

const emits = defineEmits(["changeSideMenu"]);

const showModal = ref(false);
const type = ref(null);
const formMenu = ref({
  index: null,
  name: null,
  title: null,
  path: null,
  icon: null,
});

const formHeader = ref({
  index: null,
  header: null,
  description: null,
});

const viewPermissionType = ref([
  {
    label: "All",
    value: "all",
  },
  {
    label: "User",
    value: "user",
  },
  {
    label: "Role",
    value: "role",
  },
]);
const viewPermissionTypeRadio = ref("");
const roleList = ref([]);
const userList = ref([]);

const selectListValue = ref([]);

const checkAll = ref(false);

//  watch viewPermissionTypeRadio
watch(
  viewPermissionTypeRadio,
  async (val) => {
    if (val == "") viewPermissionTypeRadio.value = "all";
    else if (val == "user") await getUserList();
    else if (val == "role") await getRoleList();

    // Check if selectListValue doesnt match with user or role list then reset selectListValue
    if (val == "user") {
      selectListValue.value = selectListValue.value.filter((item) => {
        return userList.value.some((user) => user.value == item.value);
      });
    } else if (val == "role") {
      selectListValue.value = selectListValue.value.filter((item) => {
        return roleList.value.some((role) => role.value == item.value);
      });
    }

    checkAll.value = false;
  },
  { immediate: true }
);

// watch checkAll
watch(
  checkAll,
  (val) => {
    if (val) {
      if (viewPermissionTypeRadio.value == "user") {
        selectListValue.value = userList.value.map((user) => {
          return {
            label: user.label,
            value: user.value,
          };
        });
      } else if (viewPermissionTypeRadio.value == "role") {
        selectListValue.value = roleList.value.map((role) => {
          return {
            label: role.label,
            value: role.value,
          };
        });
      }
    } else {
      selectListValue.value = [];
    }
  },
  { immediate: true }
);

const getUserList = async () => {
  const { data } = await useFetch("/api/devtool/menu/user-list");
  if (data.value?.statusCode === 200) {
    userList.value = data.value.data.map((user) => {
      return {
        label: user.userUsername,
        value: user.userUsername,
      };
    });
  }
};

const getRoleList = async () => {
  const { data } = await useFetch("/api/devtool/menu/role-list");

  if (data.value?.statusCode === 200) {
    roleList.value = data.value.data.map((role) => {
      return {
        label: role.roleName,
        value: role.roleName,
      };
    });
  }
};

const clone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Modal functions
const openModal = () => {
  showModal.value = true;
};

const assignDataMenu = (menu) => {
  formMenu.value = {
    index: menu.index,
    name: menu.name,
    title: menu.title,
    path: menu.path,
    icon: menu.icon,
  };

  if (menu.meta?.auth?.user) {
    viewPermissionTypeRadio.value = "user";
    selectListValue.value = menu.meta.auth.user.map((user) => {
      return {
        label: user,
        value: user,
      };
    });
  } else if (menu.meta?.auth?.role) {
    viewPermissionTypeRadio.value = "role";
    selectListValue.value = menu.meta.auth.role.map((role) => {
      return {
        label: role,
        value: role,
      };
    });
  } else {
    viewPermissionTypeRadio.value = "all";
  }
};

const assignDataHeader = (header) => {
  formHeader.value = {
    index: props.menus.indexOf(header),
    header: header.header,
    description: header.description,
  };

  if (header.meta?.auth?.user) {
    viewPermissionTypeRadio.value = "user";
    selectListValue.value = header.meta.auth.user.map((user) => {
      return {
        label: user,
        value: user,
      };
    });
  } else if (header.meta?.auth?.role) {
    viewPermissionTypeRadio.value = "role";
    selectListValue.value = header.meta.auth.role.map((role) => {
      return {
        label: role,
        value: role,
      };
    });
  } else {
    viewPermissionTypeRadio.value = "all";
  }
};

const clickOK = () => {
  showModal.value = false;
};

const clickCancel = () => {
  showModal.value = false;
};

// Update the menus
const updateMenus = (menus) => {
  emits("changeSideMenu", menus);
};

// Save the menu
const saveEditChanges = () => {
  let newMenu = props.menus;

  if (type.value == "menu") {
    // Overwrite the props menus
    props.menus.map((menu) => {
      if (menu.path == formMenu.value.path) {
        menu.title = formMenu.value.title;
        menu.icon = formMenu.value.icon;
        menu.meta = {};

        // Add the meta auth based on viewPermissionTypeRadio
        if (viewPermissionTypeRadio.value == "user") {
          menu.meta.auth = {
            user: selectListValue.value.map((user) => {
              return user.value;
            }),
          };
        } else if (viewPermissionTypeRadio.value == "role") {
          menu.meta.auth = {
            role: selectListValue.value.map((role) => {
              return role.value;
            }),
          };
        }
      }
    });

    newMenu = props.parentMenu;
  } else if (type.value == "header") {
    // Overwrite the props menus
    newMenu = props.menus.map((header, index) => {
      if (index == formHeader.value.index) {
        header.header = formHeader.value.header;
        header.description = formHeader.value.description;
        header.meta = {};

        // Add the meta auth based on viewPermissionTypeRadio
        if (viewPermissionTypeRadio.value == "user") {
          header.meta.auth = {
            user: selectListValue.value.map((user) => {
              return user.value;
            }),
          };
        } else if (viewPermissionTypeRadio.value == "role") {
          header.meta.auth = {
            role: selectListValue.value.map((role) => {
              return role.value;
            }),
          };
        }
      }
      return header;
    });
  }

  // Update the menus
  updateMenus(newMenu);
  showModal.value = false;
};

const removeChild = (type, data) => {
  // console.log(data);
  // console.log(type);
  let newMenu = props.menus;
  if (type == "menu") {
    let parentMenu = props.parentMenu;

    // Overwrite the props menus
    newMenu = props.menus.filter((menu) => {
      return menu.path == data;
    });

    // Remove the newMenu from the parentMenu child
    parentMenu = parentMenu.filter((menu) => {
      // Level 1
      if (menu.child) {
        menu.child.forEach((el) => {
          // Level 2
          if (el.child) {
            el.child = el.child.filter((child) => {
              return child.path != data;
            });
          }

          if (el.path == data) {
            menu.child.splice(menu.child.indexOf(el), 1);
          }
        });
      }
      return menu;
    });

    newMenu = parentMenu;
  } else if (type == "header") {
    // Remove the object array from the props menus
    newMenu = props.menus.filter((header, index) => {
      return index != data;
    });
  }

  // Update the menus
  updateMenus(newMenu);
};
</script>

<template>
  <div>
    <draggable
      class="dragArea"
      tag="div"
      :list="menus"
      :group="{ name: 'menu', put: props.count == 0 ? false : true }"
      :clone="clone"
      item-key="id"
    >
      <template #item="{ element }">
        <rs-card
          class="p-4 !my-4 mx-0 mb-0 relative border-2 border-[rgb(var(--border-color))]"
          :class="{
            'py-6': count > 0,
          }"
        >
          <div class="flex justify-between items-center">
            <div class="text-left font-normal text-xs mb-2">
              <span class="uppercase text-primary dark:text-primary">{{
                count == 0 && element.header
                  ? element.header
                  : count === 0
                  ? "(No Header)"
                  : ""
              }}</span>
              <p class="text-gray-500 dark:text-gray-500">
                {{
                  count == 0 && element.description
                    ? element.description
                    : count === 0
                    ? "There will be no header shown"
                    : ""
                }}
              </p>
            </div>
            <div v-if="count == 0">
              <Icon
                name="material-symbols:edit-outline-rounded"
                class="text-primary hover:text-primary/90 cursor-pointer"
                size="20"
                @click="
                  type = 'header';
                  assignDataHeader(element);
                  openModal();
                "
              ></Icon>
              <Icon
                name="material-symbols:close-rounded"
                class="text-primary hover:text-primary/90 cursor-pointer"
                size="20"
                @click="removeChild('header', menus.indexOf(element))"
              ></Icon>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <p class="flex items-center gap-2">
              <Icon v-if="element.icon" :name="element.icon" size="22"></Icon>
              {{ element.title }}
            </p>
            <div v-if="count > 0">
              <Icon
                name="material-symbols:edit-outline-rounded"
                class="text-primary hover:text-primary/90 cursor-pointer"
                size="20"
                @click="
                  type = 'menu';
                  assignDataMenu(element);
                  openModal();
                "
              ></Icon>
              <Icon
                name="material-symbols:close-rounded"
                class="text-primary hover:text-primary/90 cursor-pointer"
                size="20"
                @click="removeChild('menu', element.path)"
              ></Icon>
            </div>
          </div>
          <div v-if="element?.meta?.auth" class="authuser-wrapper mt-3">
            <div class="flex">
              <div v-for="(val, index) in element.meta.auth.user">
                <rs-badge
                  v-if="index < 5"
                  variant="danger"
                  class="mr-1 text-sm"
                >
                  {{ val }}
                </rs-badge>
              </div>
            </div>

            <div class="flex">
              <div v-for="(val, index) in element.meta.auth.role">
                <rs-badge
                  v-if="index < 5"
                  variant="warning"
                  class="mr-1 text-sm"
                >
                  {{ val }}
                </rs-badge>
              </div>
            </div>
          </div>

          <DraggableSideMenuNested
            :menus="element?.child ? element.child : []"
            :count="count + 1"
            :parentMenu="
              props.parentMenu && props.parentMenu.length > 0
                ? props.parentMenu
                : props.menus
            "
            @changeSideMenu="updateMenus"
          />
        </rs-card>
      </template>
    </draggable>

    <rs-modal
      :title="type == 'header' ? 'Edit Header' : 'Edit Menu'"
      v-model="showModal"
      ok-title="Confirm"
      :ok-callback="saveEditChanges"
      :cancel-callback="clickCancel"
    >
      <div v-if="type == 'header'">
        <FormKit
          type="hidden"
          label="Index"
          v-model="formHeader.index"
        ></FormKit>
        <FormKit type="text" label="Name" v-model="formHeader.header"></FormKit>
        <FormKit
          type="text"
          label="Description"
          v-model="formHeader.description"
        ></FormKit>
      </div>
      <div v-else-if="type == 'menu'">
        <FormKit type="text" label="Title" v-model="formMenu.title"></FormKit>
        <FormKit
          type="text"
          label="Path"
          v-model="formMenu.path"
          readonly
        ></FormKit>
        <FormKit type="text" label="Icon" v-model="formMenu.icon"></FormKit>
        <div class="mb-4 text-sm">
          <p class="font-semibold mb-2">
            Preview Icon (<a
              href="https://icones.js.org/collection/all"
              class="text-primary hover:underline"
              target="_blank"
              >https://icones.js.org/collection/all</a
            >)
          </p>
          <Icon v-if="formMenu.icon" :name="formMenu.icon"></Icon>
        </div>
      </div>
      <hr class="mb-4" />
      <h4 class="text-semibold mb-4">Menu Permission</h4>
      <FormKit
        type="radio"
        label="View Type"
        v-model="viewPermissionTypeRadio"
        :classes="{
          fieldset: 'border-0 !p-0',
          legend: '!font-semibold !text-sm mb-0',
          options: '!flex !flex-row gap-4 mt-3',
        }"
        :options="viewPermissionType"
      />
      <div
        v-if="viewPermissionTypeRadio && viewPermissionTypeRadio != 'all'"
        class="form-wrapper"
      >
        <div class="flex justify-between items-center mb-2">
          <label
            class="formkit-label flex items-center gap-x-4 font-semibold text-gray-700 dark:text-gray-200 blockfont-semibold text-sm formkit-invalid:text-red-500 dark:formkit-invalid:text-danger"
            for="input_4"
          >
            {{ viewPermissionTypeRadio == "user" ? "User" : "Role" }}
          </label>
        </div>
        <v-select
          class="formkit-vselect"
          :options="
            viewPermissionTypeRadio == 'user'
              ? userList
              : viewPermissionTypeRadio == 'role'
              ? roleList
              : []
          "
          v-model="selectListValue"
          multiple
        ></v-select>
        <FormKit
          type="checkbox"
          v-model="checkAll"
          :label="
            viewPermissionTypeRadio == 'user'
              ? 'Check All User'
              : 'Check All Role'
          "
          input-class="icon-check"
        />
      </div>
    </rs-modal>
  </div>
</template>
