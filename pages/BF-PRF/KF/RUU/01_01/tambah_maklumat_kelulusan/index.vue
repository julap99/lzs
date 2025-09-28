<template>
    <div>
      <LayoutsBreadcrumb :items="breadcrumb" />

      <rs-card class="mt-4">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Maklumat Kelulusan Data (RUU)</h2>
          </div>
        </template>

        <template #body>
          <div class="mb-4 grid grid-cols-12 items-center gap-3">
            <label class="col-span-3 text-sm font-medium">Kategori Maklumat</label>
            <div class="col-span-9 flex items-center gap-3">
              <select v-model="selectedKategori" class="border rounded px-2 py-1 text-sm w-full">
                <option v-for="opt in kategoriOptions" :key="opt.kod" :value="opt.value">{{ opt.value }}</option>
              </select>
              <rs-button variant="secondary" class="whitespace-nowrap" @click="navigateTo('/BF-PRF/KF/RUU/01_01/tambah_kategori')">
                <Icon name="mdi:pencil" class="mr-1" /> Tambah Kategori
              </rs-button>
            </div>
          </div>

          <rs-table
            class="mt-2"
            :key="tableKey"
            :data="filteredData"
            :field="['namaRuuField','namaNasField','kaedahKemaskini','status','statusData','tarikhMula','tarikhTamat','orderIndex']"
            :columns="[
              { key: 'namaRuuField', label: 'Nama RUU field' },
              { key: 'namaNasField', label: 'Nama Field dalam NAS' },
              { key: 'kaedahKemaskini', label: 'Kaedah Kemaskini' },
              { key: 'status', label: 'Status' },
              { key: 'statusData', label: 'Status data' },
              { key: 'tarikhMula', label: 'Tarikh Mula' },
              { key: 'tarikhTamat', label: 'Tarikh Tamat' },
              { key: 'orderIndex', label: '' }
            ]"
            :sort="{ column: 'orderIndex', direction: 'asc' }"
            :pageSize="10"
            :showNoColumn="true"
            :options="{ variant: 'default', hover: true }"
          >
            <template v-slot:namaRuuField="data">
              <input v-model="data.value.namaRuuField" type="text" class="border rounded px-2 py-1 text-sm w-full" :disabled="!data.value.isNew" />
            </template>
            <template v-slot:namaNasField="data">
              <input v-model="data.value.namaNasField" type="text" class="border rounded px-2 py-1 text-sm w-full" :disabled="!data.value.isNew" />
            </template>
            <template v-slot:kaedahKemaskini="data">
              <select 
                v-model="data.value.kaedahKemaskini" 
                class="border rounded px-2 py-1 text-sm w-full" 
                :disabled="!data.value.isNew || !data.value.namaRuuField"
                :required="data.value.isNew"
              >
                <option value="">Pilih Kaedah Kemaskini</option>
                <option 
                  v-for="option in kaedahKemaskiniOptions" 
                  :key="option.id" 
                  :value="option.namaKaedah"
                >
                  {{ option.namaKaedah }}
                </option>
              </select>
            </template>
            <template v-slot:status="data">
              <select 
                v-model="data.value.status" 
                class="border rounded px-2 py-1 text-sm w-full" 
                :disabled="!data.value.isNew || !data.value.kaedahKemaskini"
                :required="data.value.isNew"
              >
                <option value="">Pilih Status</option>
                <option value="Aktif">Aktif</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
              </select>
            </template>
            <template v-slot:statusData="data">
              <input v-model="data.value.statusData" type="text" class="border rounded px-2 py-1 text-sm w-full" :disabled="!data.value.isNew" />
            </template>
            <template v-slot:tarikhMula="data">
              <input v-model="data.value.tarikhMula" type="date" class="border rounded px-2 py-1 text-sm w-full" :disabled="!data.value.isNew" />
            </template>
            <template v-slot:tarikhTamat="data">
              <input v-model="data.value.tarikhTamat" type="date" class="border rounded px-2 py-1 text-sm w-full" :disabled="!data.value.isNew" />
            </template>
            <template #header-orderIndex>
              <span class="hidden"></span>
            </template>
            <template v-slot:orderIndex>
              <span class="hidden"></span>
            </template>
          </rs-table>

          <div class="mt-6 flex items-center justify-between">
            <rs-button variant="secondary" @click="navigateTo('/BF-PRF/KF/RUU/01_01')">
              Kembali
            </rs-button>

            <div class="flex items-center gap-2 ml-auto">
              <rs-button variant="primary" @click="addRow">
                <Icon name="material-symbols:add" class="mr-1" /> Tambah
              </rs-button>
              <rs-button variant="primary" @click="saveData">Simpan</rs-button>
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
  
  // Get query parameters
  const route = useRoute();
  
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
  
  // Function to get kategori name by kod
  const getKategoriByKod = (kod) => {
    // First check hardcoded mapping
    const mapping = {
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
      "19": "Pekerjaan Tanggungan"
    };
    
    // If found in hardcoded mapping, return it
    if (mapping[kod]) {
      return mapping[kod];
    }
    
    // If not found, check saved categories from localStorage
    try {
      const savedCategories = localStorage.getItem('kategoriMaklumat');
      if (savedCategories) {
        const parsedCategories = JSON.parse(savedCategories);
        const foundCategory = parsedCategories.find(cat => cat.kod === kod);
        if (foundCategory) {
          return foundCategory.namaKategori;
        }
      }
    } catch (error) {
      console.error('Error loading saved categories:', error);
    }
    
    return `Kategori ${kod}`; // Fallback to show the kod if not found
  };

  // Table data and reactivity control
  const tableKey = ref(0);
  const kelulusanDataRuu = ref([]);
  const selectedKategori = ref("Peribadi"); // Will be updated in onMounted
  const kategoriOptions = ref([
    { value: "Peribadi", kod: "1" },
    { value: "Alamat", kod: "2" },
    { value: "Pendidikan", kod: "3" },
    { value: "Pengislaman", kod: "4" },
    { value: "Perbankan", kod: "5" },
    { value: "Kesihatan", kod: "6" },
    { value: "Kemahiran", kod: "7" },
    { value: "Kediaman/Tempat Tinggal", kod: "8" },
    { value: "Pinjaman Harta", kod: "9" },
    { value: "Pemilikan Aset", kod: "10" },
    { value: "Pekerjaan", kod: "11" },
    { value: "Pendapatan dan Perbelanjaan Seisi Rumah", kod: "12" },
    { value: "Peribadi Tanggungan", kod: "13" },
    { value: "Pengislaman Tanggungan", kod: "14" },
    { value: "Perbankan Tanggungan", kod: "15" },
    { value: "Pendidikan Tanggungan", kod: "16" },
    { value: "Kesihatan Tanggungan", kod: "17" },
    { value: "Kemahiran Tanggungan", kod: "18" },
    { value: "Pekerjaan Tanggungan", kod: "19" },
    { value: "Kategori Baru", kod: "20" },
    { value: "Kategori Baru 21", kod: "21" },
    { value: "Kategori Baru 22", kod: "22" },
  ]);

  // Function to load saved categories from localStorage
  const loadSavedCategories = () => {
    try {
      const savedCategories = localStorage.getItem('kategoriMaklumat');
      if (savedCategories) {
        const parsedCategories = JSON.parse(savedCategories);
        const savedCategoryNames = parsedCategories.map(cat => cat.namaKategori).filter(Boolean);
        
        // Merge with existing options, avoiding duplicates
        const existingOptions = [...kategoriOptions.value];
        savedCategoryNames.forEach(categoryName => {
          const exists = existingOptions.some(opt => opt.value === categoryName);
          if (!exists) {
            // Find the kod for this category
            const categoryData = parsedCategories.find(cat => cat.namaKategori === categoryName);
            if (categoryData) {
              existingOptions.push({ value: categoryName, kod: categoryData.kod });
            }
          }
        });
        kategoriOptions.value = existingOptions;
      }
    } catch (error) {
      console.error('Error loading saved categories:', error);
    }
  };

  // Kaedah Kemaskini options from konfigurasi_kaedah_kemaskini
  const kaedahKemaskiniOptions = ref([
    { id: 'KK001', namaKaedah: 'Asnaf Review' },
    { id: 'KK002', namaKaedah: 'Update asnaf with approval/verify' },
    { id: 'KK003', namaKaedah: 'Update Asnaf without Approval/verify' },
  ]);
  
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
      // Ensure status is valid and set isActive flag
      status: item.status || "Aktif",
      isActive: item.isActive !== undefined ? item.isActive : (item.status === 'Aktif')
    };
  };
  
  // Function to load data from localStorage
  const loadData = () => {
    try {
      const savedData = localStorage.getItem('kelulusanDataRuu');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Validate and sanitize parsed data with order index
        const validatedData = parsedData.map((item, idx) => ({
          ...validateDataItem(item),
          orderIndex: typeof item.orderIndex === 'number' ? item.orderIndex : (idx + 1),
        }));
        
        // Sort by order index and set data
        kelulusanDataRuu.value = validatedData.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
      } else {
        kelulusanDataRuu.value = defaultData.map((d, idx) => ({ ...d, orderIndex: idx + 1 }));
      }
    } catch (error) {
      console.error('Error loading data:', error);
      kelulusanDataRuu.value = defaultData.map((d, idx) => ({ ...d, orderIndex: idx + 1 }));
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
    loadSavedCategories(); // Load saved categories from localStorage
    
    // Set selectedKategori after loading saved categories
    const kod = route.query.kod;
    if (kod) {
      const kategoriName = getKategoriByKod(kod);
      selectedKategori.value = kategoriName;
    }
    
    loadData();
    refreshTable();
  });
  
  // Also refresh when the page becomes visible (when returning from form)
  onActivated(() => {
    // Only refresh if data might have changed
    if (kelulusanDataRuu.value.length === 0) {
      loadData();
      refreshTable();
    }
  });
  
  const refreshTable = () => {
    nextTick(() => {
      tableKey.value++; // Force table to re-render
    });
  };

  const addRow = () => {
    const newItem = {
      idRuu: `new_${Date.now()}`,
      namaRuuField: "",
      namaNasField: "",
      kaedahKemaskini: "",
      status: "Aktif", // Default to Aktif for new items
      statusData: "Draf", // Default status data
      tarikhMula: "", // No default date
      tarikhTamat: "",
      kategori: selectedKategori.value,
      isNew: true,
      orderIndex: kelulusanDataRuu.value.length > 0 ? Math.max(...kelulusanDataRuu.value.map(i => i.orderIndex || 0)) + 1 : 1,
    };
    kelulusanDataRuu.value = [...kelulusanDataRuu.value, newItem];
    refreshTable();
  };

  const saveData = () => {
    // Validate that all new rows have required fields
    const newRows = kelulusanDataRuu.value.filter(item => item.isNew);
    
    if (newRows.length === 0) {
      alert('Tiada data baru untuk disimpan');
      return;
    }

    // Comprehensive validation for all required fields
    for (const row of newRows) {
      if (!row.namaRuuField || row.namaRuuField.trim() === '') {
        alert('Nama RUU Field diperlukan untuk semua baris baru');
        return;
      }
      if (!row.namaNasField || row.namaNasField.trim() === '') {
        alert('Nama Field dalam NAS diperlukan untuk semua baris baru');
        return;
      }
      if (!row.kaedahKemaskini || row.kaedahKemaskini.trim() === '') {
        alert('Kaedah Kemaskini diperlukan untuk semua baris baru');
        return;
      }
      if (!row.status || row.status.trim() === '') {
        alert('Status diperlukan untuk semua baris baru');
        return;
      }
      if (!row.statusData || row.statusData.trim() === '') {
        alert('Status Data diperlukan untuk semua baris baru');
        return;
      }
      if (!row.tarikhMula || row.tarikhMula.trim() === '') {
        alert('Tarikh Mula diperlukan untuk semua baris baru');
        return;
      }
    }

    // Check for existing field combinations
    const existingData = JSON.parse(localStorage.getItem('kelulusanDataRuu') || '[]');
    for (const row of newRows) {
      const duplicateField = existingData.find(existing => 
        existing.namaRuuField === row.namaRuuField && 
        existing.namaNasField === row.namaNasField &&
        existing.kategori === row.kategori
      );
      
      if (duplicateField) {
        alert(`Kombinasi field "${row.namaRuuField}" dan "${row.namaNasField}" sudah wujud dalam konfigurasi sedia ada`);
        return;
      }
    }

    // Auto-generate ID and set status to "Menunggu Semakan"
    const finalized = kelulusanDataRuu.value.map((item, idx) => {
      if (item.isNew) {
        return {
          ...item,
          idRuu: `RUU_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Auto-generate ID
          status: item.status, // Keep original status (Aktif/Tidak Aktif)
          statusData: 'Menunggu Semakan', // Set statusData to Menunggu Semakan
          isNew: false,
          isActive: item.status === 'Aktif', // Set isActive flag based on original status
          kategori: selectedKategori.value, // Ensure kategori is set to current selection
          orderIndex: typeof item.orderIndex === 'number' ? item.orderIndex : (idx + 1),
        };
      }
      return item;
    });
    
    kelulusanDataRuu.value = finalized;
    
    try {
      localStorage.setItem('kelulusanDataRuu', JSON.stringify(finalized));
      alert(`Data berjaya disimpan! ${newRows.length} rekod telah disimpan dengan status "Menunggu Semakan"`);
      
      // Force table refresh to display saved data
      refreshTable();
      
      // Additional refresh to ensure data is visible
      nextTick(() => {
        tableKey.value++;
      });
    } catch (e) {
      console.error('Error saving data:', e);
      alert('Ralat semasa menyimpan data');
    }
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
  