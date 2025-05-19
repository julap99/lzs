<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Kebenaran Kumpulan Pengguna</h2>
        </div>
      </template>

      <template #body>
        <!-- Search Input using FormKit -->
        <div class="mb-4">
          <FormKit
            type="text"
            v-model="searchQuery"
            placeholder="Cari peranan..."
            outer-class="mb-0"
          />
        </div>

        <!-- Updated Table Section -->
        <rs-table
          class="mt-4"
          :key="tableKey"
          :data="filteredRoles"
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
                @click="navigateTo(`/BF-PS/PPK/KKP/nas/${data.text}`)"
              >
                Lebih
                <Icon name="mdi:chevron-right" class="ml-1" size="1rem" />
              </rs-button>
            </div>
          </template>
        </rs-table>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

definePageMeta({
  title: "Konfigurasi Peranan",
});

const breadcrumb = ref([
  {
    name: "Pentadbiran",
    type: "link",
    path: "/BF-PS/PPK/KKP/nas",
  },
  {
    name: "Kebenaran Akses",
    type: "link",
    path: "/BF-PS/PPK/KKP/nas",
  },
  {
    name: "Kumpulan Pengguna",
    type: "current",
    path: "/BF-PS/PPK/KKP/nas",
  },
]);

// Search functionality
const searchQuery = ref("");
const searchIcon = ref("search");
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

// Computed property for filtered roles
const filteredRoles = computed(() => {
  if (!searchQuery.value) return roles.value;

  const query = searchQuery.value.toLowerCase();
  return roles.value.filter(
    (role) =>
      role.peranan.toLowerCase().includes(query) ||
      role.deskripsi.toLowerCase().includes(query) ||
      role.status.toLowerCase().includes(query)
  );
});

// Modal control
const showDeleteModal = ref(false);
const roleToDelete = ref(null);

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
