<script setup>
definePageMeta({
  title: "Role List",
  middleware: ["auth"],
  requiresAuth: true,
});

const { $swal, $router } = useNuxtApp();

const roleList = ref([]);
const roleUserList = ref([]);

const showModal = ref(false);
const showModalForm = ref({
  id: "",
  name: "",
  description: "",
  users: [],
  status: "",
});
const modalType = ref("edit");

const showModalUser = ref(false);
const showModalUserForm = ref({
  username: "",
  fullname: "",
  email: "",
  phone: "",
  password: "",
  role: "",
  status: "",
});

const showModalDelete = ref(false);
const showModalDeleteForm = ref({
  id: "",
  name: "",
});

const statusDropdown = ref([
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
]);

const roleListbyUser = ref([]);

const checkAllUser = ref(false);

// Call API
// onMounted(async () => {
//   await getUserList();
//   await getRoleList();
// });

getRoleList();
getUserList();

async function getRoleList() {
  const { data } = await useFetch("/api/devtool/role/list", {
    initialCache: false,
  });

  // Rename the key
  if (data.value?.statusCode === 200) {
    roleList.value = data.value.data.map((role) => ({
      id: role.roleID,
      name: role.roleName,
      description: role.roleDescription,
      users: role.users.map((u) => {
        return {
          label: u.user.userUsername,
          value: u.user.userUsername,
        };
      }),
      status: role.roleStatus,
      createdDate: role.roleCreatedDate,
      action: null,
    }));

    groupRoleByUser();
  }
}

async function getUserList() {
  const { data } = await useFetch("/api/devtool/user/list", {
    initialCache: false,
  });

  if (data.value.statusCode === 200) {
    roleUserList.value = data.value.data.map((user) => ({
      label: user.userUsername,
      value: user.userUsername,
    }));
  }
}

function usersWithCommans(users) {
  // Limit the number of users to 4 and add "..." if there are more than 4 users
  const userList = users.map((u) => u.label);
  return userList.length > 4
    ? userList.slice(0, 4).join(", ") + "..."
    : userList.join(", ");
}

// Watch checkAllUser value
watch(
  checkAllUser,
  async (value) => {
    if (value) {
      showModalForm.value.users = roleUserList.value;
    } else {
      if (showModalForm.value.users.length === roleUserList.value.length) {
        showModalForm.value.users = [];
      }
    }
  },
  { immediate: true }
);

// Watch showModalForm.users value
watch(
  showModalForm,
  async (value) => {
    if (value.users.length === roleUserList.value.length) {
      checkAllUser.value = true;
    } else {
      checkAllUser.value = false;
    }
  },
  { deep: true }
);

// Open Modal Add or Edit User
const openModal = async (value, type) => {
  modalType.value = type;

  if (type == "edit") {
    showModalForm.value = {
      id: value.id,
      name: value.name,
      description: value.description,
      users: value.users,
      status: value.status,
    };
  } else {
    showModalForm.value = {
      id: "",
      name: "",
      description: "",
      users: "",
      status: "",
    };
  }

  showModalUser.value = false;
  showModal.value = true;
};

// Open Modal Add Role
const openModalUser = async () => {
  showModalUserForm.value = {
    username: "",
    fullname: "",
    email: "",
    phone: "",
    password: "",
    role: "",
    status: "",
  };

  showModal.value = false;
  showModalUser.value = true;
};

// Close Modal Role
const closeModalUser = () => {
  showModalUser.value = false;
  showModal.value = true;
};

// Open Modal Delete User
const openModalDelete = async (value) => {
  showModalDeleteForm.value.id = value.id;
  showModalDeleteForm.value.name = value.name;

  showModalDelete.value = true;
};

const saveUser = async () => {
  const { data } = await useFetch("/api/devtool/user/add", {
    initialCache: false,
    method: "POST",
    body: JSON.stringify({
      ...showModalUserForm.value,
      module: "role",
    }),
  });

  if (data.value.statusCode === 200) {
    $swal.fire({
      icon: "success",
      title: "Success",
      text: "User has been added successfully",
    });

    await getUserList();
    showModalUser.value = false;
    showModal.value = true;
  } else {
    $swal.fire({
      icon: "error",
      title: "Error",
      text: data.value.message,
    });
  }
};

const saveRole = async () => {
  if (modalType.value == "edit") {
    const { data } = await useFetch("/api/devtool/role/edit", {
      initialCache: false,
      method: "POST",
      body: JSON.stringify(showModalForm.value),
    });

    if (data.value.statusCode === 200) {
      $swal.fire({
        position: "center",
        icon: "success",
        title: "Success",
        text: "Role has been updated successfully",
        timer: 1000,
        showConfirmButton: false,
      });

      await getRoleList();
      showModal.value = false;
    } else {
      $swal.fire({
        icon: "error",
        title: "Error",
        text: data.value.message,
      });
    }
  } else {
    const { data } = await useFetch("/api/devtool/role/add", {
      initialCache: false,
      method: "POST",
      body: JSON.stringify({ ...showModalForm.value, module: "role" }),
    });

    if (data.value.statusCode === 200) {
      $swal.fire({
        position: "center",
        icon: "success",
        title: "Success",
        text: "Role has been added",
        timer: 1000,
        showConfirmButton: false,
      });

      await getRoleList();
      showModal.value = false;
    } else {
      $swal.fire({
        icon: "error",
        title: "Error",
        text: data.value.message,
      });
    }
  }
};

const deleteRole = async () => {
  const { data } = await useFetch("/api/devtool/role/delete", {
    initialCache: false,
    method: "POST",
    body: JSON.stringify({ id: showModalDeleteForm.value.id }),
  });

  if (data.value.statusCode === 200) {
    $swal.fire({
      position: "center",
      icon: "success",
      title: "Success",
      text: "Role has been deleted",
      timer: 1000,
      showConfirmButton: false,
    });

    await getRoleList();
    showModalDelete.value = false;
  } else {
    $swal.fire({
      position: "center",
      icon: "error",
      title: "Error",
      text: data.value.message,
    });
  }
};

function groupRoleByUser() {
  roleListbyUser.value = roleList.value.reduce((acc, role) => {
    const users = role.users.map((user) => user.userUsername);

    if (acc[users]) {
      acc[users].push(role);
    } else {
      acc[users] = [role];
    }

    return acc;
  }, {});
}
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
          This page is only accessible by admin users. You can manage users
          here. You can also add new users. You can also change user roles.
        </p>
      </template>
    </rs-card>

    <rs-card>
      <div class="pt-2">
        <rs-tab fill>
          <rs-tab-item title="All Role">
            <div class="flex justify-end items-center mb-4">
              <rs-button @click="openModal(null, 'add')">
                <Icon name="material-symbols:add" class="mr-1"></Icon>
                Add Role
              </rs-button>
            </div>
            <rs-table
              v-if="roleList && roleList.length > 0"
              :data="roleList"
              :options="{
                variant: 'default',
                striped: true,
                borderless: true,
              }"
              advanced
            >
              <template v-slot:users="data">
                {{ usersWithCommans(data.text) }}
              </template>
              <template v-slot:action="data">
                <div
                  class="flex justify-center items-center"
                  v-if="data.value.role?.value != '1'"
                >
                  <Icon
                    name="material-symbols:edit-outline-rounded"
                    class="text-primary hover:text-primary/90 cursor-pointer mr-1"
                    size="22"
                    @click="openModal(data.value, 'edit')"
                  ></Icon>
                  <Icon
                    name="material-symbols:close-rounded"
                    class="text-primary hover:text-primary/90 cursor-pointer"
                    size="22"
                    @click="openModalDelete(data.value)"
                  ></Icon>
                </div>
                <div class="flex justify-center items-center" v-else>-</div>
              </template>
            </rs-table>
          </rs-tab-item>
        </rs-tab>
        <!-- <rs-tab-item title="Role Tree">
            <div v-for="(value, index) in roleListbyUser">
              {{ value }}
            </div>
          </rs-tab-item> -->
      </div>
    </rs-card>

    <rs-modal
      :title="modalType == 'edit' ? 'Edit Role' : 'Add Role'"
      ok-title="Save"
      :ok-callback="saveRole"
      v-model="showModal"
      :overlay-close="false"
    >
      <FormKit
        type="text"
        v-model="showModalForm.name"
        label="Name"
        validation="required"
        validation-visibility="live"
      />
      <FormKit
        type="textarea"
        v-model="showModalForm.description"
        label="Description"
      />
      <div class="flex justify-between items-center mb-2">
        <label
          class="formkit-label font-semibold text-gray-700 dark:text-gray-200 blockfont-semibold text-sm formkit-invalid:text-red-500 dark:formkit-invalid:text-danger"
          for="input_4"
        >
          Users
        </label>
        <rs-button size="sm" @click="openModalUser"> Add User </rs-button>
      </div>
      <v-select
        class="formkit-vselect"
        :options="roleUserList"
        v-model="showModalForm.users"
        multiple
      ></v-select>
      <FormKit
        type="checkbox"
        v-model="checkAllUser"
        label="All Users"
        input-class="icon-check"
      />
      <FormKit
        type="select"
        :options="statusDropdown"
        v-model="showModalForm.status"
        name="status"
        label="Status"
      />
    </rs-modal>

    <!-- Modal Role -->
    <rs-modal
      title="Add User"
      ok-title="Save"
      cancel-title="Back"
      :cancel-callback="closeModalUser"
      :ok-callback="saveUser"
      v-model="showModalUser"
      :overlay-close="false"
    >
      <FormKit
        type="text"
        v-model="showModalUserForm.username"
        name="username"
        label="Username"
      />
      <FormKit
        type="text"
        v-model="showModalUserForm.fullname"
        name="fullname"
        label="Fullname"
      />
      <FormKit
        type="text"
        v-model="showModalUserForm.email"
        name="email"
        label="Email"
        validation="email"
        validation-visibility="dirty"
      />
      <FormKit
        type="mask"
        v-model="showModalUserForm.phone"
        name="phone"
        label="Phone"
        mask="###########"
      />

      <FormKit
        type="select"
        :options="statusDropdown"
        v-model="showModalUserForm.status"
        name="status"
        label="Status"
      />
    </rs-modal>

    <!-- Modal Delete Confirmation -->
    <rs-modal
      title="Delete Confirmation"
      ok-title="Yes"
      cancel-title="No"
      :ok-callback="deleteRole"
      v-model="showModalDelete"
      :overlay-close="false"
    >
      <p>
        Are you sure want to delete this role ({{ showModalDeleteForm.name }})?
      </p>
    </rs-modal>
  </div>
</template>
