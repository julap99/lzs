<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Kelulusan</h2>
          <rs-button variant="secondary" @click="navigateTo('/BF-PRF/KF/RUU/02_01')">
            <Icon name="material-symbols:arrow-back" class="mr-1" /> Kembali
          </rs-button>
        </div>
      </template>

      <template #body>
        <div class="space-y-6">
          <!-- Kategori Maklumat Section -->
          <div class="flex items-center gap-3">
            <label class="text-sm font-medium w-40">Kategori Maklumat</label>
            <input 
              v-model="formData.kategoriMaklumat" 
              type="text" 
              class="border border-gray-300 rounded px-3 py-2 text-sm flex-1 max-w-xs bg-gray-50"
              readonly
            />
          </div>

          <!-- Data Table Section -->
          <div class="mt-6">
            <rs-table
              :data="tableData"
              :field="['namaRuuField', 'namaNasField', 'kaedahKemaskini', 'statusKelulusan']"
              :columns="[
                { key: 'namaRuuField', label: 'Nama RUU field' },
                { key: 'namaNasField', label: 'Nama Field dalam NAS' },
                { key: 'kaedahKemaskini', label: 'Kaedah Kemaskini' },
                { key: 'statusKelulusan', label: 'Status Kelulusan Data (RUU)' }
              ]"
              :pageSize="10"
              :showNoColumn="true"
              :options="{
                variant: 'default',
                hover: true,
              }"
            >
              <template v-slot:statusKelulusan="data">
                <select 
                  v-model="data.value.statusKelulusan"
                  class="border border-gray-300 rounded px-2 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-w-24"
                >
                  <option value="">Pilih Status</option>
                  <option value="Lulus">Lulus</option>
                  <option value="Tolak">Tolak</option>
                </select>
              </template>
            </rs-table>
          </div>

          <!-- Status Kategori Maklumat Section -->
          <div class="flex items-center gap-3">
            <label class="text-sm font-medium w-40">Status Kategori Maklumat</label>
            <div class="flex items-center gap-4">
              <label class="flex items-center gap-1 text-sm cursor-pointer">
                <input 
                  type="radio" 
                  name="statusKategori"
                  value="Lulus"
                  v-model="formData.statusKategori"
                  class="text-blue-600 focus:ring-blue-500"
                />
                Lulus
              </label>
              <label class="flex items-center gap-1 text-sm cursor-pointer">
                <input 
                  type="radio" 
                  name="statusKategori"
                  value="Tolak"
                  v-model="formData.statusKategori"
                  class="text-blue-600 focus:ring-blue-500"
                />
                Tolak
              </label>
            </div>
          </div>

          <!-- Catatan Section -->
          <div class="flex items-start gap-3">
            <label class="text-sm font-medium w-40 mt-2">Catatan</label>
            <textarea 
              v-model="formData.catatan" 
              class="border border-gray-300 rounded px-3 py-2 text-sm flex-1 h-24 resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Masukkan catatan..."
            ></textarea>
          </div>

          <!-- Nama Pelulus Section -->
          <div class="flex items-center gap-3">
            <label class="text-sm font-medium w-40">Nama Pelulus</label>
            <input 
              v-model="formData.namaPelulus" 
              type="text" 
              class="border border-gray-300 rounded px-3 py-2 text-sm flex-1 max-w-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Masukkan nama pelulus"
            />
          </div>

          <!-- Tarikh Lulus Section -->
          <div class="flex items-center gap-3">
            <label class="text-sm font-medium w-40">Tarikh Lulus</label>
            <input 
              v-model="formData.tarikhLulus" 
              type="date" 
              class="border border-gray-300 rounded px-3 py-2 text-sm flex-1 max-w-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-3 pt-4">
          <rs-button 
            variant="secondary" 
            @click="handleSimpan"
            class="px-6 py-2"
          >
            Simpan
          </rs-button>
          <rs-button 
            variant="primary" 
            @click="handleHantar"
            class="px-6 py-2"
          >
            Hantar
          </rs-button>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

definePageMeta({
  title: "Kelulusan Data (RUU)",
});

const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/KF/RUU/admin",
  },
  {
    name: "Konfigurasi Kelulusan Data (RUU)",
    type: "link",
    path: "/BF-PRF/KF/RUU/02_01",
  },
  {
    name: "Kelulusan",
    type: "current",
    path: "/BF-PRF/KF/RUU/02_01/kelulusan",
  },
]);

// Form data
const formData = ref({
  kategoriMaklumat: "Peribadi",
  statusKategori: "",
  catatan: "",
  namaPelulus: "",
  tarikhLulus: ""
});

// Table data
const tableData = ref([
  {
    namaRuuField: "Identification Type",
    namaNasField: "Jenis ID",
    kaedahKemaskini: "Update asnaf with approval/verify",
    statusKelulusan: ""
  },
  {
    namaRuuField: "Passport No",
    namaNasField: "Pengenalan ID",
    kaedahKemaskini: "Asnaf Review",
    statusKelulusan: ""
  },
  {
    namaRuuField: "MyKad",
    namaNasField: "Pengenalan ID",
    kaedahKemaskini: "Asnaf Review",
    statusKelulusan: ""
  }
]);

// Get URL parameters
const route = useRoute();

onMounted(() => {
  // Set kategori from URL parameter if available
  if (route.query.kod) {
    formData.value.kategoriMaklumat = route.query.kod === '1' ? 'Peribadi' : decodeURIComponent(route.query.kod);
  }
  
  // Set current date as default
  formData.value.tarikhLulus = new Date().toISOString().split('T')[0];
});

// Handle Save action
const handleSimpan = () => {
  console.log('Simpan clicked', formData.value);
  // Add save logic here
  // For now, just show a success message
  alert('Data berjaya disimpan');
};

// Handle Submit action
const handleHantar = () => {
  // Validate form
  if (!formData.value.statusKategori) {
    alert('Sila pilih status kategori maklumat');
    return;
  }
  
  if (!formData.value.namaPelulus) {
    alert('Sila masukkan nama pelulus');
    return;
  }
  
  if (!formData.value.tarikhLulus) {
    alert('Sila masukkan tarikh lulus');
    return;
  }
  
  // Check if all table items have status
  const hasEmptyStatus = tableData.value.some(item => !item.statusKelulusan);
  if (hasEmptyStatus) {
    alert('Sila pilih status kelulusan untuk semua item dalam jadual');
    return;
  }
  
  console.log('Hantar clicked', { formData: formData.value, tableData: tableData.value });
  // Add submit logic here
  // For now, just show a success message
  alert('Data berjaya dihantar');
};
</script>

