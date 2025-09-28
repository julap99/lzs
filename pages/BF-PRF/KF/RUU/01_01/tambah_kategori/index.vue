<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Kategori Maklumat</h2>
          <rs-button variant="secondary" @click="navigateTo('/BF-PRF/KF/RUU/01_01')">
            <Icon name="material-symbols:arrow-back" class="mr-1" /> Kembali
          </rs-button>
        </div>
      </template>

      <template #body>
        <div class="max-w-3xl mx-auto">
          <FormKit
            type="form"
            :actions="false"
            v-model="formData"
          >
            <!-- Form Fields -->
            <div class="mb-8">
              <div class="grid grid-cols-1 gap-6">

                <!-- Kod -->
                <div class="flex items-center gap-3">
                  <label class="text-sm font-medium w-40">Kod :</label>
                  <FormKit
                    type="text"
                    name="kod"
                    v-model="formData.kod"
                    placeholder="Contoh: 1"
                    validation="required|matches:/^[a-zA-Z0-9]+$/"
                    :validation-messages="{
                      matches: 'Hanya huruf dan nombor dibenarkan untuk Kod'
                    }"
                    :classes="{
                      input: 'border border-gray-300 rounded px-3 py-2 text-sm flex-1 max-w-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    }"
                  />
                </div>

                <!-- Kategori Maklumat -->
                <div class="flex items-center gap-3">
                  <label class="text-sm font-medium w-40">Kategori Maklumat :</label>
                  <FormKit
                    type="text"
                    name="namaKategori"
                    v-model="formData.namaKategori"
                    placeholder="Contoh: Peribadi"
                    validation="required"
                    :classes="{
                      input: 'border border-gray-300 rounded px-3 py-2 text-sm flex-1 max-w-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    }"
                  />
                </div>

                <!-- Status (radio buttons) Aktif / Tidak Aktif -->
                <div class="flex items-center gap-3">
                  <label class="text-sm font-medium w-40">Status :</label>
                  <FormKit
                    type="radio"
                    name="status"
                    v-model="formData.status"
                    :options="[
                      { label: 'Aktif', value: 'Aktif' },
                      { label: 'Tidak Aktif', value: 'Tidak Aktif' }
                    ]"
                    validation="required"
                    :classes="{
                      wrapper: 'flex items-center gap-6',
                      fieldset: 'flex items-center gap-6',
                      option: 'flex items-center gap-2 text-sm cursor-pointer'
                    }"
                  />
                </div>

                <!-- Status Data -->
                <div class="flex items-center gap-3">
                  <label class="text-sm font-medium w-40">Status data :</label>
                  <FormKit
                    type="text"
                    name="statusData"
                    v-model="formData.statusData"
                    placeholder="Contoh: Draf"
                    validation="required"
                    :classes="{
                      input: 'border border-gray-300 rounded px-3 py-2 text-sm flex-1 max-w-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    }"
                  />
                </div>

                <!-- Tarikh Mula -->
                <div class="flex items-center gap-3">
                  <label class="text-sm font-medium w-40">Tarikh Mula :</label>
                  <FormKit
                    type="date"
                    name="tarikhMula"
                    v-model="formData.tarikhMula"
                    validation="required"
                    :classes="{
                      input: 'border border-gray-300 rounded px-3 py-2 text-sm flex-1 max-w-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    }"
                  />
                </div>

                <!-- Tarikh Tamat -->
                <div class="flex items-center gap-3">
                  <label class="text-sm font-medium w-40">Tarikh Tamat :</label>
                  <FormKit
                    type="date"
                    name="tarikhTamat"
                    v-model="formData.tarikhTamat"
                    :classes="{
                      input: 'border border-gray-300 rounded px-3 py-2 text-sm flex-1 max-w-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    }"
                  />
                </div>

              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-center space-x-4 pt-6 border-t">
              <rs-button
                type="button"
                variant="secondary"
                @click="navigateTo('/BF-PRF/KF/RUU/01_01')"
              >
                Kembali
              </rs-button>
              <rs-button
                type="button"
                variant="primary"
                @click="handleTambahKategori"
                :disabled="isSubmitting"
              >
                <Icon v-if="isSubmitting" name="mdi:loading" class="animate-spin mr-2" />
                <Icon v-else name="mdi:plus" class="mr-2" />
                {{ isSubmitting ? 'Menyimpan...' : 'Tambah Kategori Maklumat' }}
              </rs-button>
              <rs-button
                type="button"
                variant="primary"
                @click="handleTambahMaklumatKelulusan"
                :disabled="isSubmitting"
              >
                <Icon v-if="isSubmitting" name="mdi:loading" class="animate-spin mr-2" />
                <Icon v-else name="mdi:plus" class="mr-2" />
                {{ isSubmitting ? 'Menyimpan...' : 'Tambah Maklumat Kelulusan' }}
              </rs-button>
              <rs-button
                type="button"
                variant="primary"
                @click="handleSimpan"
                :disabled="isSubmitting"
              >
                <Icon v-if="isSubmitting" name="mdi:loading" class="animate-spin mr-2" />
                <Icon v-else name="material-symbols:save" class="mr-2" />
                {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
              </rs-button>
            </div>
          </FormKit>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";

definePageMeta({
  title: "Kategori Maklumat",
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
    path: "/BF-PRF/KF/RUU/01_01",
  },
  {
    name: "Kategori Maklumat",
    type: "current",
    path: "/BF-PRF/KF/RUU/01_01/tambah_kategori",
  },
]);

const formData = reactive({
  kod: "",
  namaKategori: "",
  status: "",
  statusData: "",
  tarikhMula: "",
  tarikhTamat: "",
});

const isSubmitting = ref(false);

// Validation function
const validateForm = () => {
  if (!formData.kod) {
    alert('Kod diperlukan');
    return false;
  }
  if (!/^[a-zA-Z0-9]+$/.test(formData.kod)) {
    alert('Hanya huruf dan nombor dibenarkan untuk Kod');
    return false;
  }
  if (!formData.namaKategori || formData.namaKategori.trim() === '') {
    alert('Kategori Maklumat diperlukan');
    return false;
  }
  if (!formData.status) {
    alert('Status diperlukan');
    return false;
  }
  if (!formData.statusData) {
    alert('Status data diperlukan');
    return false;
  }
  if (!formData.tarikhMula) {
    alert('Tarikh mula diperlukan');
    return false;
  }
  return true;
};


// Handle Tambah Kategori Maklumat
const handleTambahKategori = async () => {
  if (!validateForm()) return;
  
  isSubmitting.value = true;
  try {
    // Save form data to localStorage
    localStorage.setItem('kategoriMaklumatForm', JSON.stringify(formData));
    
    const existing = loadExistingCategories();
    const isAktif = formData.status === 'Aktif';

    const record = {
      kod: formData.kod,
      namaKategori: formData.namaKategori,
      status: formData.status,
      statusAktif: isAktif,
      statusData: formData.statusData,
      tarikhMula: formData.tarikhMula,
      tarikhTamat: formData.tarikhTamat,
    };
    existing.push(record);
    localStorage.setItem('kategoriMaklumat', JSON.stringify(existing));
    alert('Kategori Maklumat berjaya disimpan!');
    
    // Keep the form data visible so user can see what was saved
    // The form will show the saved data instead of clearing it
  } catch (e) {
    console.error('Error saving category:', e);
  } finally {
    isSubmitting.value = false;
  }
};

// Handle Tambah Maklumat Kelulusan
const handleTambahMaklumatKelulusan = async () => {
  console.log('=== HANDLE TAMBAH MAKLUMAT KELULUSAN CALLED ===');
  console.log('Current formData:', JSON.stringify(formData, null, 2));
  console.log('formData.kod value:', formData.kod);
  console.log('formData.kod type:', typeof formData.kod);
  console.log('formData.kod length:', formData.kod ? formData.kod.length : 'undefined');
  
  isSubmitting.value = true;
  try {
    const kategoriKod = String(formData.kod || '').trim();
    console.log('Raw formData.kod:', formData.kod);
    console.log('After String() conversion:', String(formData.kod || ''));
    console.log('After trim():', kategoriKod);
    console.log('Final kategoriKod:', kategoriKod);
    console.log('kategoriKod type:', typeof kategoriKod);
    console.log('kategoriKod length:', kategoriKod.length);
    
    if (!kategoriKod) {
      alert('Sila isi Kod kategori dahulu.');
      return;
    }
    
    const navigationUrl = {
      path: '/BF-PRF/KF/RUU/01_01/tambah_maklumat_kelulusan',
      query: { kod: kategoriKod }
    };
    console.log('Navigation URL object:', navigationUrl);
    console.log('Query string will be:', `?kod=${kategoriKod}`);
    
    // Pass selected kategori kod (and name) via query params
    await navigateTo(navigationUrl);
    console.log('Navigation completed successfully');
  } catch (e) {
    console.error('Error navigating:', e);
  } finally {
    isSubmitting.value = false;
  }
  console.log('===============================================');
};

// Handle Simpan
const handleSimpan = async () => {
  if (!validateForm()) return;
  
  isSubmitting.value = true;
  try {
    // Save form data to localStorage
    localStorage.setItem('kategoriMaklumatForm', JSON.stringify(formData));
    
    const existing = loadExistingCategories();
    const isAktif = formData.status === 'Aktif';

    const record = {
      kod: formData.kod,
      namaKategori: formData.namaKategori,
      status: formData.status,
      statusAktif: isAktif,
      statusData: formData.statusData,
      tarikhMula: formData.tarikhMula,
      tarikhTamat: formData.tarikhTamat,
    };
    existing.push(record);
    localStorage.setItem('kategoriMaklumat', JSON.stringify(existing));
    alert('Data berjaya disimpan!');
    await navigateTo('/BF-PRF/KF/RUU/01_01');
  } catch (e) {
    console.error('Error saving data:', e);
  } finally {
    isSubmitting.value = false;
  }
};

const loadExistingCategories = () => {
  try {
    const saved = localStorage.getItem('kategoriMaklumat');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error loading categories:', e);
  }
  return [];
};

// Watch for changes in formData.kod
watch(() => formData.kod, (newValue, oldValue) => {
  console.log('FormData.kod changed from:', oldValue, 'to:', newValue);
  console.log('Type of new value:', typeof newValue);
}, { immediate: true });

// Function to clear saved form data
const clearSavedFormData = () => {
  localStorage.removeItem('kategoriMaklumatForm');
  console.log('Cleared saved form data from localStorage');
};

onMounted(() => {
  console.log('=== TAMBAH KATEGORI PAGE MOUNTED ===');
  console.log('Initial formData:', formData);
  console.log('Initial formData.kod:', formData.kod);
  
  // Check if there's saved data in localStorage
  const savedData = localStorage.getItem('kategoriMaklumatForm');
  console.log('Saved form data exists:', !!savedData);
  
  if (savedData) {
    try {
      const parsedData = JSON.parse(savedData);
      console.log('Loading saved form data:', parsedData);
      console.log('Saved data kod:', parsedData.kod);
      Object.assign(formData, parsedData);
      console.log('FormData after loading saved data:', formData);
      console.log('FormData.kod after loading:', formData.kod);
    } catch (e) {
      console.error('Error loading saved form data:', e);
    }
  } else {
    console.log('No saved form data found');
  }
  console.log('=====================================');
});
</script>

<style scoped>
:deep(.formkit-outer) {
  margin-bottom: 0 !important;
}
:deep(.formkit-label) {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

:deep(.formkit-help) {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

:deep(.formkit-messages) {
  margin-top: 0.25rem;
}

:deep(.formkit-message) {
  font-size: 0.875rem;
  color: #dc2626;
}

:deep(.formkit-input) {
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.75rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

:deep(.formkit-input:focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  outline: none;
}

:deep(.formkit-input[aria-invalid="true"]) {
  border-color: #dc2626;
}

:deep(.formkit-input[aria-invalid="true"]:focus) {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}


</style>