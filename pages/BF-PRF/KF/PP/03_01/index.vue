<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Maklumat Proses Komponen Profiling</h2>
          <div class="flex items-center gap-2">
            <rs-button variant="primary" @click="navigateTo('03_02')">
              <Icon name="material-symbols:add" class="mr-1" /> Tambah Baharu
            </rs-button>
            <!-- <rs-button v-if="false" variant="secondary" @click="navigateTo('/BF-PRF/KF/HK/01_01/tambah_kategori')">
              <Icon name="mdi:folder-plus" class="mr-1" /> Tambah Kategori
            </rs-button> -->
          </div>
        </div>
      </template>

      <template #body>
        <!-- Debug info - remove in production -->
        <div class="mb-4 p-2 bg-gray-100 rounded">
          <p>Jumlah Konfigurasi: {{ kifayahLimits.length }}</p>
          <p>Kelulusan Menunggu: {{ pendingApprovalCount }}</p>
        </div>

        <!-- Table Section: 6 columns (+ actions). Id Komponen Profiling is hidden per requirements -->
        <rs-table
          class="mt-4"
          :key="tableKey"
          :data="kifayahLimits"
          :field="['namaPendaftaran', 'kodProses', 'idMenu', 'tarikhMula', 'statusData', 'actions']"
          :pageSize="10"
          :showNoColumn="false"
          :showFilter="true"
          :showSearch="true"
          :options="{
            variant: 'default',
            hover: true,
            borded: true,
            striped: true,
          }"
          advanced
        >
          <!-- 3.6.2 Nama Pendaftaran (Dropdown, Query only) -> read-only text in listing -->
          <template v-slot:namaPendaftaran="data">
            <span>{{ data.value.namaPendaftaran || 'Pendaftaran Lengkap' }}</span>
          </template>

          <!-- 3.6.3 Kod Proses (Text, Query only) -->
          <template v-slot:kodProses="data">
            <span>{{ data.value.kodProses || '-' }}</span>
          </template>

          <!-- 3.6.4 ID Menu (Text, Query only) -->
          <template v-slot:idMenu="data">
            <span>{{ data.value.idMenu ?? 1 }}</span>
          </template>

          <!-- 3.6.5 Tarikh Mula (Date, Query only) -->
          <template v-slot:tarikhMula="data">
            <span>{{ formatDate(data.value.tarikhMula) }}</span>
          </template>

          <!-- 3.6.6 Status Data (Text, Query only) -->
          <template v-slot:statusData="data">
            <rs-badge :variant="getStatusVariant(data.value.statusData)">
              {{ data.value.statusData || 'Draf' }}
            </rs-badge>
          </template>

          <!-- Actions (not part of 3.6.x, kept for UX) -->
          <template v-slot:actions="data">
            <div class="flex flex-col items-center space-y-2">
              <rs-button
                variant="primary"
                size="sm"
                class="!px-2 !py-1"
                @click="navigateTo(`/BF-PRF/KF/PP/03_03?id=${data.value.idKomponenProfiling}`)"
              >
                <Icon name="mdi:pen" size="1.5rem" />
              </rs-button>

              <rs-button
                variant="secondary"
                size="sm"
                class="!px-2 !py-1"
                @click="navigateTo({ path: '/BF-PRF/KF/PP/03_04', query: { id: data.value.idKomponenProfiling } })"
              >
                <Icon name="mdi:eye" size="1.5rem" />
              </rs-button>

              <!-- Delete Button -->
              <rs-button
                variant="danger"
                size="sm"
                class="!px-2 !py-1"
                @click="deleteItem(data.value.idKomponenProfiling)"
              >
                <Icon name="mdi:delete" size="1.5rem" />
              </rs-button>
            </div>
          </template>
        </rs-table>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onActivated, nextTick } from "vue";

definePageMeta({
  title: "Konfigurasi Komponen Profiling",
});

const breadcrumb = ref([
  { name: "Profiling", type: "link", path: "/BF-PRF/KF/HK/01_01" },
  { name: "Konfigurasi Komponen Profiling", type: "current", path: "/BF-PRF/KF/PP/03_01" },
]);

// Table data and reactivity control
const tableKey = ref(0);
const kifayahLimits = ref([]);

// Default data (empty array - no hardcoded data)
const defaultData = [];

// Validate & normalize each item
const validateDataItem = (item) => {
  return {
    ...item,
    // 3.6.1 Hidden: keep in data only (not a table column)
    idKomponenProfiling: item.idKomponenProfiling || item.kodProses || item.idHadKifayah,
    // 3.6.2
    namaPendaftaran: item.namaPendaftaran || "Pendaftaran Lengkap",
    // 3.6.3
    kodProses: item.kodProses || "PP001",
    // 3.6.4
    idMenu: item.idMenu ?? 1,
    // 3.6.5
    tarikhMula: item.tarikhMula || "2025-01-01",
    // 3.6.6
    statusData: item.statusData || "Draf",
  };
};

// Load from localStorage
const loadData = () => {
  try {
    const savedData = localStorage.getItem("prosesKomponen");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      kifayahLimits.value = parsed.map(validateDataItem);
    } else {
      kifayahLimits.value = defaultData;
    }
  } catch (e) {
    console.error("Error loading data:", e);
    kifayahLimits.value = defaultData;
  }
};

// Persist to localStorage
const updateLocalStorage = () => {
  try {
    localStorage.setItem("prosesKomponen", JSON.stringify(kifayahLimits.value));
  } catch (e) {
    console.error("Error saving data to localStorage:", e);
  }
};

// Use statusData for pending approvals
const pendingApprovalCount = computed(() =>
  kifayahLimits.value.filter((item) => item.statusData === "Menunggu Kelulusan").length
);

onMounted(() => {
  loadData();
  refreshTable();
});

onActivated(() => {
  loadData();
  refreshTable();
});

const refreshTable = () => {
  nextTick(() => (tableKey.value++));
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  let date;
  if (typeof dateString === "string") {
    date = new Date(dateString);
    if (isNaN(date.getTime())) return "Tarikh Tidak Sah";
  } else if (dateString instanceof Date) {
    date = dateString;
    if (isNaN(date.getTime())) return "Tarikh Tidak Sah";
  } else {
    return "Tarikh Tidak Sah";
  }
  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("ms-MY", options);
};

const getStatusVariant = (status) => {
  switch (status) {
    case "Aktif":
      return "success";
    case "Tidak Aktif":
      return "danger";
    case "Menunggu Kelulusan":
      return "warning";
    case "Draf":
      return "secondary";
    default:
      return "default";
  }
};

// Delete by idKomponenProfiling (hidden key)
const deleteItem = (id) => {
  if (confirm("Adakah anda pasti ingin menghapuskan item ini?")) {
    const index = kifayahLimits.value.findIndex((x) => x.idKomponenProfiling === id);
    if (index !== -1) {
      kifayahLimits.value.splice(index, 1);
      updateLocalStorage();
      refreshTable();
      alert("Item berjaya dihapuskan.");
    }
  }
};
</script>
