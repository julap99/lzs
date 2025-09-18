<template>
    <div>
      <LayoutsBreadcrumb :items="breadcrumb" />

      <rs-card class="mt-4">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Maklumat Kelulusan Data (RUU)</h2>
            <div class="flex items-center gap-2">
              <rs-button variant="secondary" @click="navigateTo('/BF-PRF/KF/RUU/01_04/kemaskini')">
                <Icon name="mdi:pencil" class="mr-1" /> Kemaskini
              </rs-button>
            </div>
          </div>
        </template>

        <template #body>
          <div class="mb-4 grid grid-cols-12 items-center gap-3">
            <label class="col-span-3 text-sm font-medium">Kategori Maklumat</label>
            <div class="col-span-9 border rounded px-3 py-2 text-sm bg-white">{{ selectedKategori }}</div>
          </div>

          <rs-table
            class="mt-2"
            :key="tableKey"
            :data="filteredData"
            :field="['namaRuuField','namaNasField','kaedahKemaskini','status','statusData','tarikhMula','tarikhTamat']"
            :columns="[
              { key: 'namaRuuField', label: 'Nama RUU field' },
              { key: 'namaNasField', label: 'Nama Field dalam NAS' },
              { key: 'kaedahKemaskini', label: 'Kaedah Kemaskini' },
              { key: 'status', label: 'Status' },
              { key: 'statusData', label: 'Status data' },
              { key: 'tarikhMula', label: 'Tarikh Mula' },
              { key: 'tarikhTamat', label: 'Tarikh Tamat' }
            ]"
            :pageSize="10"
            :showNoColumn="true"
            :options="{ variant: 'default', hover: true }"
          >
            <template v-slot:namaRuuField="data">{{ data.value.namaRuuField }}</template>
            <template v-slot:namaNasField="data">{{ data.value.namaNasField }}</template>
            <template v-slot:kaedahKemaskini="data">{{ data.value.kaedahKemaskini || 'Manual' }}</template>
            <template v-slot:status="data">
              <rs-badge :variant="getStatusVariant(data.value.status || 'Tidak Aktif')">
                {{ data.value.status || 'Tidak Aktif' }}
              </rs-badge>
            </template>
            <template v-slot:statusData="data">
              <rs-badge :variant="getStatusVariant(data.value.statusData)">
                {{ data.value.statusData }}
              </rs-badge>
            </template>
            <template v-slot:tarikhMula="data">{{ formatDate(data.value.tarikhMula) }}</template>
            <template v-slot:tarikhTamat="data">{{ data.value.tarikhTamat ? formatDate(data.value.tarikhTamat) : '' }}</template>
          </rs-table>

          <div class="mt-6 flex items-center justify-between">
            <rs-button variant="secondary" @click="navigateTo('/BF-PRF/KF/RUU/01_01')">
              Kembali
            </rs-button>

            <div class="flex items-center gap-2 ml-auto">
              <rs-button variant="primary" @click="navigateTo('/BF-PRF/KF/RUU/01_01/tambah_kategori')">
                <Icon name="material-symbols:add" class="mr-1" /> Tambah
              </rs-button>
              <rs-button variant="primary">Simpan</rs-button>
              <rs-button variant="success">Hantar</rs-button>
            </div>
          </div>
        </template>
      </rs-card>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onActivated, nextTick } from "vue";
  
  definePageMeta({
    title: "Konfigurasi Kelulusan Data (RUU)",
  });
  
  const breadcrumb = ref([
    {
      name: "Profiling",
      type: "link",
      path: "/BF-PRF/KF/RUU/admin",
    },
    {
      name: "Konfigurasi Kelulusan Data (RUU)",
      type: "current",
      path: "/BF-PRF/KF/RUU/admin",
    },
  ]);
  
  // Table data and reactivity control
  const tableKey = ref(0);
  const kelulusanDataRuu = ref([]);
  const selectedKategori = ref("Peribadi");
  const kategoriOptions = [
    "Peribadi",
    "Alamat",
    "Pendidikan",
    "Pengislaman",
    "Perbankan",
    "Kesihatan",
    "Kemahiran",
    "Alamat",
    "Kediaman/Tempat Tinggal",
    "Pinjaman Harta",
    "Pemilikan Aset",
    "Pekerjaan",
    "Pendapatan dan Perbelanjaan Seisi Rumah",
    "Peribadi Tanggungan",
    "Pengislaman Tanggungan",
    "Perbankan Tanggungan",
    "Pendidikan Tanggungan",
    "Kesihatan Tanggungan",
    "Kemahiran Tanggungan",
    "Pekerjaan Tanggungan",
  ];
  
  const filteredData = computed(() => {
    if (!selectedKategori.value) return kelulusanDataRuu.value;
    return kelulusanDataRuu.value.filter((item) => {
      // Prefer explicit kategori if present; fallback to legacy field
      const kategori = item.kategori || item.namaNasField || "";
      return kategori === selectedKategori.value;
    });
  });
  
  // Default data (fallback if no data in localStorage)
  const defaultData = [
    {
      namaRuuField: "Identification Type",
      namaNasField: "Jenis ID",
      kategori: "Peribadi",
      kaedahKemaskini: "Update asnaf with approval/verify",
      tarikhMula: "2030-01-01",
      statusData: "Draf",
    },
    {
      namaRuuField: "Passport No",
      namaNasField: "Pengenalan ID",
      kategori: "Peribadi",
      kaedahKemaskini: "Asnaf Review",
      tarikhMula: "2026-01-01",
      statusData: "Draf",
    },
    {
      namaRuuField: "MyKad",
      namaNasField: "Pengenalan ID",
      kategori: "Peribadi",
      kaedahKemaskini: "Asnaf Review",
      tarikhMula: "2026-01-01",
      statusData: "Draf",
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
      status: item.status || "Aktif"
    };
  };
  
  // Function to load data from localStorage
  const loadData = () => {
    try {
      const savedData = localStorage.getItem('kelulusanDataRuu');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Validate and sanitize parsed data
        const validatedData = parsedData.map(validateDataItem);
        
        // Merge with default data, giving priority to saved data
        const mergedData = [...defaultData];
        validatedData.forEach(savedItem => {
          // Check if item already exists in default data
          const existingIndex = mergedData.findIndex(item => item.idRuu === savedItem.idRuu);
          if (existingIndex >= 0) {
            // Replace existing item
            mergedData[existingIndex] = validateDataItem(savedItem);
          } else {
            // Add new item
            mergedData.push(validateDataItem(savedItem));
          }
        });
        kelulusanDataRuu.value = mergedData;
      } else {
        kelulusanDataRuu.value = defaultData;
      }
    } catch (error) {
      console.error('Error loading data:', error);
      kelulusanDataRuu.value = defaultData;
    }
  };
  
  // Computed property to count pending approval items
  const pendingApprovalCount = computed(() => {
    return kelulusanDataRuu.value.filter(
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
      console.log("Table refreshed, records:", kelulusanDataRuu.value.length);
      console.log("Pending approval:", pendingApprovalCount.value);
      console.log("Sample data:", kelulusanDataRuu.value[0]);
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
        return "info";
      default:
        return "default";
    }
  };
  </script>
  