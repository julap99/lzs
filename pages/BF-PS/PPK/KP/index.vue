<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Konfigurasi Peranan</h2>
          <rs-button
            variant="primary"
            @click="navigateTo(`/BF-PS/PPK/KP/peranan-baru`)"
          >
            <Icon name="material-symbols:add" class="mr-1" /> Tambah Baharu
          </rs-button>
        </div>
      </template>

      <template #body>
        <!-- Updated Table Section -->
        <rs-table
          class="mt-4"
          :key="tableKey"
          :data="roles"
          :pageSize="10"
          :showNoColumn="true"
          :options="{
            variant: 'default',
            hover: true,
          }"
        >
          <template v-slot:status="data">
            <rs-badge :variant="getStatusVariant(data.text)">
              {{ data.text }}
            </rs-badge>
          </template>

          <template v-slot:tindakan="data">
            <div class="flex space-x-2">
              <rs-button
                variant="primary"
                size="sm"
                class="!px-2 !py-1"
                @click="editItem(data.text)"
              >
                Kemaskini
              </rs-button>
              <rs-button
                variant="danger"
                size="sm"
                class="!px-2 !py-1"
                @click="confirmDelete(data.text)"
              >
                <Icon name="material-symbols:delete-rounded" size="15"></Icon>
              </rs-button>
            </div>
          </template>
        </rs-table>
      </template>
    </rs-card>

    <!-- Delete Confirmation Modal -->
    <rs-modal
      v-model="showDeleteModal"
      title="Sahkan Padam"
      size="md"
      position="center"
    >
      <template #body>
        <p>Adakah anda pasti ingin memadam peranan ini?</p>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button variant="primary-outline" @click="showDeleteModal = false">
            Batal
          </rs-button>
          <rs-button variant="danger" @click="deleteRole">
            Sahkan Padam
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

definePageMeta({
  title: "Konfigurasi Peranan",
});

const breadcrumb = ref([
  {
    name: "Pentadbiran Sistem",
    type: "link",
    path: "/BF-PS/PPK/KP",
  },
  {
    name: "Konfigurasi Peranan",
    type: "current",
    path: "/BF-PS/PPK/KP",
  },
]);

// Table data and reactivity control
const tableKey = ref(0);
const roles = ref([
  {
    peranan: "EKP",
    deskripsi: "Eksekutif Perkhidmatan Pelanggan",
    status: "Aktif",
    tindakan: 1,
  },
  {
    peranan: "EOAD",
    deskripsi: "Eksekutif Operasi & Admin",
    status: "Aktif",
    tindakan: 2,
  },
  {
    peranan: "KOAD",
    deskripsi: "Ketua Operasi & Admin",
    status: "Aktif",
    tindakan: 3,
  },
]);

// Modal control
const showDeleteModal = ref(false);
const roleToDelete = ref(null);

// Make sure the table refreshes when component mounts
// onMounted(() => {
//   refreshTable();
// });

// Methods
const editItem = (roleId) => {
  navigateTo(`/BF-PS/PPK/KP/${roleId}`);
};

const confirmDelete = (roleId) => {
  roleToDelete.value = roleId;
  showDeleteModal.value = true;
};

const deleteRole = () => {
  const index = roles.value.findIndex(
    (role) => role.tindakan === roleToDelete.value
  );

  console.log("Index: ", index);

  if (index !== -1) {
    roles.value.splice(index, 1);
    refreshTable();
  }
  showDeleteModal.value = false;
  roleToDelete.value = null;

  alert("Peranan berjaya dipadamkan");
};

const refreshTable = () => {
  nextTick(() => {
    tableKey.value++; // Force table to re-render
  });
};

// Helper function to determine badge variant based on status
const getStatusVariant = (status) => {
  switch (status) {
    case "Aktif":
      return "success";
    case "Tidak Aktif":
      return "danger";
    default:
      return "default";
  }
};
</script>
