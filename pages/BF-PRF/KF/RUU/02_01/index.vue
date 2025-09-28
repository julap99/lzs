<template>
    <div>
      <LayoutsBreadcrumb :items="breadcrumb" />
  
      <rs-card class="mt-4">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Senarai Maklumat Kelulusan Data (RUU)</h2>
            <div class="flex items-center gap-2">
              <rs-button variant="secondary" @click="navigateTo(`/BF-PRF/KF/RUU/02_01/lihat?kod=${getKodForKategori(selectedKategori)}`)">
                <Icon name="mdi:eye" class="mr-1" /> Lihat
              </rs-button>
              <rs-button variant="primary" @click="navigateTo(`/BF-PRF/KF/RUU/02_01/kelulusan?kod=${getKodForKategori(selectedKategori)}`)">
                <Icon name="mdi:check-circle" class="mr-1" /> Kelulusan
              </rs-button>
            </div>
          </div>
        </template>
  
        <template #body>
          <div class="mb-4 flex items-center gap-3">
            <label class="text-sm font-medium">Kategori Maklumat</label>
            <select v-model="selectedKategori" class="border rounded px-2 py-1 text-sm">
              <option v-for="opt in kategoriOptions" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </div>
          <!-- Updated Table Section with requested columns -->
          <rs-table
            class="mt-4"
            :key="tableKey"
            :data="filteredData"
            :field="['namaRuuField','namaNasField','kaedahKemaskini','tarikhMula','statusData']"
            :columns="[
              { key: 'namaRuuField', label: 'Nama RUU Field' },
              { key: 'namaNasField', label: 'Nama NAS Field' }
            ]"
            :pageSize="10"
            :showNoColumn="true"
            :options="{
              variant: 'default',
              hover: true,
            }"
          >
            <template v-slot:namaRuuField="data">{{ data.value.namaRuuField }}</template>
            <template v-slot:namaNasField="data">{{ data.value.namaNasField || data.value.kategori || '-' }}</template>
            <template v-slot:kaedahKemaskini="data">{{ data.value.kaedahKemaskini || 'Manual' }}</template>
            <template v-slot:tarikhMula="data">{{ formatDate(data.value.tarikhMula) }}</template>
            <template v-slot:statusData="data">
              <rs-badge :variant="getStatusVariant(data.value.statusData || data.value.status)">
                {{ data.value.statusData || data.value.status }}
              </rs-badge>
            </template>
          </rs-table>
        </template>
      </rs-card>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onActivated, nextTick } from "vue";
  import { useRoute } from 'vue-router'

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
  
  // Default data (fallback only for kod=1/Peribadi)
  const defaultData = [
    {
      namaRuuField: "Identification Type",
      namaNasField: "Jenis ID",
      kategori: "Peribadi",
      kaedahKemaskini: "Update asnaf with approval/verify",
      tarikhMula: "2026-01-01",
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
  
  // url params
  const route = useRoute();

  // Map kod -> kategori helper
  const getKategoriFromKod = (kod) => {
    const map = {
      "1": "Peribadi",
      "2": "Alamat",
      "3": "Pendidikan",
      "4": "Pengislaman",
      "5": "Perbankan",
      "6": "Kesihatan",
      "7": "Kemahiran",
      "8": "Kediaman/Tempat Tinggal",
      "9": "Pinjaman Harta",
      "10": "Pemilikan Aset",
      "11": "Pekerjaan",
      "12": "Pendapatan dan Perbelanjaan Seisi Rumah",
      "13": "Peribadi Tanggungan",
      "14": "Pengislaman Tanggungan",
      "15": "Perbankan Tanggungan",
      "16": "Pendidikan Tanggungan",
      "17": "Kesihatan Tanggungan",
      "18": "Kemahiran Tanggungan",
      "19": "Pekerjaan Tanggungan",
    };
    return map[kod] || "Peribadi";
  };
  
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
  
  // Function to load data from localStorage (default only for kod=1)
  const loadData = () => {
    try {
      const savedData = localStorage.getItem('kelulusanDataRuu');
      const currentKod = route.query.kod ? String(route.query.kod) : '1';

      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Validate and sanitize parsed data
        const validatedData = parsedData.map(validateDataItem);

        // Base array: include defaults only when kod === '1'
        const mergedData = currentKod === '1' ? [...defaultData] : [];

        validatedData.forEach(savedItem => {
          // Replace/append saved items
          const existingIndex = mergedData.findIndex(item => item.idRuu === savedItem.idRuu);
          if (existingIndex >= 0) {
            mergedData[existingIndex] = validateDataItem(savedItem);
          } else {
            mergedData.push(validateDataItem(savedItem));
          }
        });

        kelulusanDataRuu.value = mergedData;
      } else {
        // No saved data: show defaults only for kod === '1'
        kelulusanDataRuu.value = ( (route.query.kod ? String(route.query.kod) : '1') === '1') ? defaultData : [];
      }
    } catch (error) {
      console.error('Error loading data:', error);
      kelulusanDataRuu.value = ( (route.query.kod ? String(route.query.kod) : '1') === '1') ? defaultData : [];
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
    // Set selected kategori based on url kod (default Peribadi)
    const currentKod = route.query.kod ? String(route.query.kod) : '1';
    selectedKategori.value = getKategoriFromKod(currentKod);

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

  // Helper function to get kod for a given kategori
  const getKodForKategori = (kategori) => {
    const kategoriMapping = {
      "Peribadi": "1",
      "Alamat": "2",
      "Pendidikan": "3",
      "Pengislaman": "4",
      "Perbankan": "5",
      "Kesihatan": "6",
      "Kemahiran": "7",
      "Kediaman/Tempat Tinggal": "8",
      "Pinjaman Harta": "9",
      "Pemilikan Aset": "10",
      "Pekerjaan": "11",
      "Pendapatan dan Perbelanjaan Seisi Rumah": "12",
      "Peribadi Tanggungan": "13",
      "Pengislaman Tanggungan": "14",
      "Perbankan Tanggungan": "15",
      "Pendidikan Tanggungan": "16",
      "Kesihatan Tanggungan": "17",
      "Kemahiran Tanggungan": "18",
      "Pekerjaan Tanggungan": "19"
    };
    return kategoriMapping[kategori] || "1"; // Default to "1" if not found
  };
  </script>
  