<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Konfigurasi Status Household / Individu
          </h2>
          <rs-button variant="primary" @click="navigateTo(`admin/tambah`)">
            <Icon name="material-symbols:add" class="mr-1" size="15" /> Tambah
            Baharu
          </rs-button>
        </div>
      </template>

      <template #body>
        <!-- Status Table -->
        <rs-table
          class="mt-4"
          :key="tableKey"
          :data="filteredStatusData"
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

          <template v-slot:statusAsnaf="data">
            {{ data.text }}
          </template>

          <template v-slot:kategori="data">
            <rs-badge variant="info">{{ data.text }}</rs-badge>
          </template>

          <template v-slot:statusAktif="data">
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
                @click="updateStatus(data.text)"
              >
                Kemaskini
              </rs-button>
              <rs-button
                variant="danger"
                size="sm"
                class="!px-2 !py-1"
                @click="deleteStatus(data.text)"
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
import { ref, computed, nextTick } from "vue";
import { useToast } from "vue-toastification";

definePageMeta({
  title: "Konfigurasi Status Household / Individu",
});

const toast = useToast();

const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/KF/SHI/admin",
  },
  {
    name: "Konfigurasi Status Household / Individu",
    type: "current",
    path: "/BF-PRF/KF/SHI/admin",
  },
]);

// Table data and reactivity control
const tableKey = ref(0);
const statusData = ref([
  {
    statusAsnaf: "Fakir",
    kategori: "Household",
    statusAktif: "Aktif",
    tindakan: 1,
  },
  {
    statusAsnaf: "Miskin",
    kategori: "Household",
    statusAktif: "Aktif",
    tindakan: 2,
  },
  {
    statusAsnaf: "Mualaf",
    kategori: "Individu",
    statusAktif: "Aktif",
    tindakan: 3,
  },
  {
    id: 4,
    statusAsnaf: "Fi-sabilillah",
    kategori: "Individu",
    statusAktif: "Tidak Aktif",
  },
  {
    id: 5,
    statusAsnaf: "Gharimin",
    kategori: "Household",
    statusAktif: "Tidak Aktif",
  },
  {
    id: 6,
    statusAsnaf: "Ibnu Sabil",
    kategori: "Individu",
    statusAktif: "Aktif",
  },
]);

// Filter options
const categoryOptions = ref([
  { label: "Semua", value: "all" },
  { label: "Household", value: "Household" },
  { label: "Individu", value: "Individu" },
]);

const statusOptions = ref([
  { label: "Semua", value: "all" },
  { label: "Aktif", value: "Aktif" },
  { label: "Tidak Aktif", value: "Tidak Aktif" },
]);

const selectedCategory = ref("all");
const selectedStatus = ref("all");

// Computed properties
const filteredStatusData = computed(() => {
  let filtered = [...statusData.value];

  if (selectedCategory.value !== "all") {
    filtered = filtered.filter(
      (item) => item.kategori === selectedCategory.value
    );
  }

  if (selectedStatus.value !== "all") {
    filtered = filtered.filter(
      (item) => item.statusAktif === selectedStatus.value
    );
  }

  return filtered;
});

const activeStatusCount = computed(() => {
  return statusData.value.filter((item) => item.statusAktif === "Aktif").length;
});

const inactiveStatusCount = computed(() => {
  return statusData.value.filter((item) => item.statusAktif === "Tidak Aktif")
    .length;
});

// Methods

const updateStatus = (id) => {
  navigateTo(`SHI/${id}`);
};

const deleteStatus = (id) => {
  if (confirm("Adakah anda pasti ingin menghapus status ini?")) {
    const index = statusData.value.findIndex((item) => item.id === id);
    if (index !== -1) {
      statusData.value.splice(index, 1);
      refreshTable();
    }

    toast.success("Status telah dipadam.");
  }
};

const refreshTable = () => {
  nextTick(() => {
    tableKey.value++; // Force table to re-render
    console.log("Table refreshed, records:", statusData.value.length);
    console.log("Active status count:", activeStatusCount.value);
    console.log("Inactive status count:", inactiveStatusCount.value);
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
