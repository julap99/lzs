<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Konfigurasi Multidimensi</h2>
          <rs-button variant="primary" @click="navigateTo(`admin/tambah`)">
            <Icon name="material-symbols:add" class="mr-1" /> Tambah Baharu
          </rs-button>
        </div>
      </template>

      <template #body>
        <!-- Debug info - remove in production -->
        <div class="mb-4 p-2 bg-gray-100 rounded">
          <p>Jumlah Dimensi: {{ dimensions.length }}</p>
          <p>Status Aktif: {{ activeDimensionsCount }}</p>
        </div>

        <!-- Updated Table Section -->
        <rs-table
          class="mt-4"
          :key="tableKey"
          :data="dimensions"
          :pageSize="10"
          :showNoColumn="true"
          :options="{
            variant: 'default',
            hover: true,
          }"
        >
          <template v-slot:no="data">
            {{ data.index + 1 }}
          </template>

          <template v-slot:dimensi="data">
            {{ data.text }}
          </template>

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
                @click="configureDimension(data.text)"
              >
                Konfigurasi
              </rs-button>
              <rs-button
                variant="danger"
                size="sm"
                class="!px-2 !py-1"
                @click="deleteDimension(data.text)"
              >
                Hapus
              </rs-button>
            </div>
          </template>
        </rs-table>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";

definePageMeta({
  title: "Konfigurasi Multidimensi",
});

const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/MD/admin",
  },
  {
    name: "Konfigurasi Multidimensi",
    type: "current",
    path: "/BF-PRF/MD/admin",
  },
]);

// Table data and reactivity control
const tableKey = ref(0);
const dimensions = ref([
  {
    dimensi: "Umur",
    status: "Aktif",
    tindakan: 1,
  },
  {
    dimensi: "Pendidikan",
    status: "Aktif",
    tindakan: 2,
  },
  {
    dimensi: "Kesihatan",
    status: "Tidak Aktif",
    tindakan: 3,
  },
  {
    dimensi: "Pendapatan",
    status: "Aktif",
    tindakan: 4,
  },
  {
    dimensi: "Pekerjaan",
    status: "Menunggu Kelulusan",
    tindakan: 5,
  },
]);

// Computed property to count active dimensions
const activeDimensionsCount = computed(() => {
  return dimensions.value.filter((item) => item.status === "Aktif").length;
});

// Methods
const configureDimension = (id) => {
  navigateTo(`admin/${id}`);
};

const deleteDimension = (id) => {
  if (confirm("Adakah anda pasti ingin menghapus dimensi ini?")) {
    const index = dimensions.value.findIndex((item) => item.id === id);
    if (index !== -1) {
      dimensions.value.splice(index, 1);
      refreshTable();
    }
  }
};

const refreshTable = () => {
  nextTick(() => {
    tableKey.value++; // Force table to re-render
    console.log("Table refreshed, records:", dimensions.value.length);
    console.log("Active dimensions:", activeDimensionsCount.value);
  });
};

// Helper function to determine badge variant based on status
const getStatusVariant = (status) => {
  switch (status) {
    case "Aktif":
      return "success";
    case "Tidak Aktif":
      return "danger";
    case "Menunggu Kelulusan":
      return "warning";
    default:
      return "default";
  }
};
</script>
