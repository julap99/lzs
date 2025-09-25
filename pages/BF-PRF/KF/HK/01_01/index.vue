<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Had Kifayah Utama</h2>
          <div class="flex items-center gap-2">
            <rs-button variant="primary" @click="navigateTo('01_01/tambah')">
              <Icon name="material-symbols:add" class="mr-1" /> Tambah Baharu
            </rs-button>
            <rs-button v-if="false" variant="secondary" @click="navigateTo('/BF-PRF/KF/HK/01_01/tambah_kategori')">
              <Icon name="mdi:folder-plus" class="mr-1" /> Tambah Kategori
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>
        <!-- Debug info - remove in production -->
        <div class="mb-4 p-2 bg-gray-100 rounded">
          <p>Jumlah Konfigurasi: {{ kifayahLimits.length }}</p>
          <p>Kelulusan Menunggu: {{ pendingApprovalCount }}</p>
        </div>

        <!-- Updated Table Section with 8 columns -->
        <rs-table
          class="mt-4"
          :key="tableKey"
          :data="kifayahLimits"
          :field="['namaHadKifayah','keterangan','tarikhMula','statusData','tindakan']"
          :pageSize="10"
          :showNoColumn="true"
          :options="{
            variant: 'default',
            hover: true,
          }"
        >
          <template v-slot:namaHadKifayah="data">{{ data.value.namaHadKifayah }}</template>
          <template v-slot:keterangan="data">{{ data.value.keterangan || 'N/A' }}</template>
          <template v-slot:tarikhMula="data">{{ formatDate(data.value.tarikhMula) }}</template>
          <template v-slot:statusData="data">
            <rs-badge :variant="getStatusVariant(data.value.statusData)">
              {{ data.value.statusData || 'No StatusData' }}
            </rs-badge>
          </template>
          <template v-slot:tindakan="data">
            <rs-button
              variant="primary"
              size="sm"
              class="!px-2 !py-1"
              @click="navigateTo(`/BF-PRF/KF/HK/01_02?id=${data.value.idHadKifayah}`)"
              >Kemaskini
              <Icon name="mdi:chevron-right" class="ml-1" size="1rem" />
            </rs-button>
            <rs-button
              variant="secondary"
              size="sm"
              class="!px-2 !py-1 ml-2"
              @click="navigateTo({ path: '/BF-PRF/KF/HK/01_02/01_02_lihat', query: { id: data.value.idHadKifayah } })"
              >Lihat
              <Icon name="mdi:chevron-right" class="ml-1" size="1rem" />
            </rs-button>
          </template>
        </rs-table>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onActivated, nextTick } from "vue";

definePageMeta({
  title: "Konfigurasi Had Kifayah",
});

const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/KF/HK/admin",
  },
  {
    name: "Konfigurasi Had Kifayah",
    type: "current",
    path: "/BF-PRF/KF/HK/admin",
  },
]);

// Table data and reactivity control
const tableKey = ref(0);
const kifayahLimits = ref([]);

// Default data (fallback if no data in localStorage)
const defaultData = [
  // Section A: Kadar Had Kifayah Utama
  {
    idHadKifayah: "HK001",
    namaHadKifayah: "Ketua Keluarga",
    keterangan: "Had kifayah untuk ketua keluarga",
    kategori: "Utama",
    jenisIsiRumah: "Ketua Keluarga",
    kadarBerbayar: 1215.00,
    kadarPercuma: 780.00,
    tarikhMula: "2025-01-01",
    status: "Aktif",
    statusData: "Draf",
    tindakan: 1,
  },
];

// Function to validate and sanitize data item
const validateDataItem = (item) => {
  return {
    ...item,
    // Ensure numeric values are valid
    kadarBerbayar: isNaN(parseFloat(item.kadarBerbayar)) ? 0 : parseFloat(item.kadarBerbayar),
    kadarPercuma: isNaN(parseFloat(item.kadarPercuma)) ? 0 : parseFloat(item.kadarPercuma),
    // Ensure date is valid
    tarikhMula: item.tarikhMula && !isNaN(new Date(item.tarikhMula).getTime()) ? item.tarikhMula : "2025-01-01",
    // Ensure status is valid
    status: item.status || "Aktif",
    // Ensure statusData is valid, fallback to status if not available
    statusData: item.statusData || item.status || "Aktif"
  };
};

// Function to load data from localStorage
const loadData = () => {
  try {
    const savedData = localStorage.getItem('kifayahLimits');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      // Validate and sanitize parsed data
      const validatedData = parsedData.map(validateDataItem);
      
      // Merge with default data, giving priority to saved data
      const mergedData = [...defaultData];
      validatedData.forEach(savedItem => {
        // Check if item already exists in default data
        const existingIndex = mergedData.findIndex(item => item.idHadKifayah === savedItem.idHadKifayah);
        if (existingIndex >= 0) {
          // Replace existing item
          mergedData[existingIndex] = validateDataItem(savedItem);
        } else {
          // Add new item
          mergedData.push(validateDataItem(savedItem));
        }
      });
      kifayahLimits.value = mergedData;
    } else {
      kifayahLimits.value = defaultData;
    }
    
    // Ensure all items have statusData field
    kifayahLimits.value = kifayahLimits.value.map(item => {
      const updatedItem = {
        ...item,
        statusData: item.statusData || item.status || "Aktif"
      };
      console.log('Item statusData:', updatedItem.statusData, 'Item status:', updatedItem.status);
      return updatedItem;
    });
  } catch (error) {
    console.error('Error loading data:', error);
    kifayahLimits.value = defaultData;
  }
};

// Computed property to count pending approval items
const pendingApprovalCount = computed(() => {
  return kifayahLimits.value.filter(
    (item) => item.status === "Menunggu Kelulusan"
  ).length;
});

// Make sure the table refreshes when component mounts
onMounted(() => {
  loadData();
  refreshTable();
});

// Also refresh when the page becomes visible (when returning from form)
onActivated(() => {
  loadData();
  refreshTable();
});

const refreshTable = () => {
  nextTick(() => {
    tableKey.value++; // Force table to re-render
    console.log("Table refreshed, records:", kifayahLimits.value.length);
    console.log("Pending approval:", pendingApprovalCount.value);
    console.log("Sample data:", kifayahLimits.value[0]);
  });
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  
  // Handle different date formats and validate
  let date;
  if (typeof dateString === 'string') {
    // Check if it's a valid date string
    date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Tarikh Tidak Sah";
    }
  } else if (dateString instanceof Date) {
    date = dateString;
    if (isNaN(date.getTime())) {
      return "Tarikh Tidak Sah";
    }
  } else {
    return "Tarikh Tidak Sah";
  }
  
  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("ms-MY", options);
};

const formatCurrency = (value) => {
  if (value === undefined || value === null || value === "") return "0.00";
  
  // Convert to number and validate
  const numValue = parseFloat(value);
  if (isNaN(numValue)) {
    return "0.00";
  }
  
  // Ensure it's a valid number and format to 2 decimal places
  return numValue.toFixed(2);
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
    case "Draf":
      return "secondary";
    default:
      return "default";
  }
};
</script>
