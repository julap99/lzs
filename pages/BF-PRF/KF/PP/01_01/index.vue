<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Maklumat Proses Profiling</h2>
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
          :field="['kodProses','namaProses','keterangan','tarikhMula','statusData','tindakan']"
          :pageSize="10"
          :showNoColumn="false"
          :options="{
            variant: 'default',
            hover: true,
          }"
        >
          <template v-slot:kodProses="data">
            <div v-if="data.value.kodProsesList && data.value.kodProsesList.length > 0" class="space-y-1">
              <div v-for="(kod, index) in data.value.kodProsesList" :key="index" class="text-sm">
                <span class="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-1 mb-1">
                  {{ kod.value || kod }}
                </span>
              </div>
            </div>
            <span v-else>{{ data.value.kodProses || data.value.idHadKifayah }}</span>
          </template>
          <template v-slot:namaProses="data">{{ data.value.namaProses || data.value.namaHadKifayah }}</template>
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
              @click="navigateTo(`/BF-PRF/KF/PP/01_02?id=${data.value.idPP || data.value.kodProses || data.value.idHadKifayah}`)"
              >Kemaskini
              <Icon name="mdi:chevron-right" class="ml-1" size="1rem" />
            </rs-button>
            <rs-button
              variant="secondary"
              size="sm"
              class="!px-2 !py-1 ml-2"
              @click="navigateTo({ path: '/BF-PRF/KF/PP/01_01/lihat', query: { id: data.value.idPP || data.value.kodProses || data.value.idHadKifayah } })"
              >Lihat
              <Icon name="mdi:chevron-right" class="ml-1" size="1rem" />
            </rs-button>
            <rs-button
              variant="danger"
              size="sm"
              class="!px-2 !py-1 ml-2"
              @click="deleteRecord(data.value.idPP || data.value.kodProses || data.value.idHadKifayah)"
              >Buang
              <Icon name="mdi:delete" class="ml-1" size="1rem" />
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
    name: "Konfigurasi Proses Profiling",
    type: "current",
    path: "/BF-PRF/KF/PP/01_01",
  },
]);

// Table data and reactivity control
const tableKey = ref(0);
const kifayahLimits = ref([]);

// Default data (empty array - no hardcoded data)
const defaultData = [];

// Function to validate and sanitize data item
const validateDataItem = (item) => {
  return {
    ...item,
    // Ensure standardized id exists
    idPP: item.idPP || item.kodProses || item.idHadKifayah,
    // Ensure new fields are present
    kodProses: item.kodProses || item.idHadKifayah || "PP001",
    namaProses: item.namaProses || item.namaHadKifayah || "Proses Profiling",
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
    const savedData = localStorage.getItem('prosesProfiling');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      // Validate and sanitize parsed data
      const validatedData = parsedData.map(validateDataItem);
      kifayahLimits.value = validatedData;
    } else {
      kifayahLimits.value = [];
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
    kifayahLimits.value = [];
  }
};

// Computed property to count pending approval items
const pendingApprovalCount = computed(() => {
  return kifayahLimits.value.filter(
    (item) => item.status === "Menunggu Kelulusan"
  ).length;
});

// Function to delete a record
const deleteRecord = (idPP) => {
  if (!idPP) {
    console.error('No ID provided for deletion');
    return;
  }

  // Show confirmation dialog
  if (confirm('Adakah anda pasti mahu memadamkan rekod ini?')) {
    try {
      // Load current data from localStorage
      const savedData = localStorage.getItem('prosesProfiling');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        // Filter out the record with matching idPP
        const filteredData = parsedData.filter(item => 
          (item.idPP || item.kodProses || item.idHadKifayah) !== idPP
        );
        
        // Save updated data back to localStorage
        localStorage.setItem('prosesProfiling', JSON.stringify(filteredData));
        
        // Update the local data
        kifayahLimits.value = filteredData.map(validateDataItem);
        
        // Refresh the table
        refreshTable();
        
        // Show success message
        const { $toast } = useNuxtApp();
        if ($toast) {
          $toast.success('Rekod berjaya dipadamkan');
        } else {
          alert('Rekod berjaya dipadamkan');
        }
        
        console.log('Record deleted successfully:', idPP);
      } else {
        console.log('No data found in localStorage');
      }
    } catch (error) {
      console.error('Error deleting record:', error);
      alert('Ralat semasa memadamkan rekod');
    }
  }
};

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
