<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Tambah Had Kifayah Baharu</h2>
          <rs-button variant="secondary" @click="navigateTo('/BF-PRF/KF/HK/01_01')">
            <Icon name="material-symbols:arrow-back" class="mr-1" /> Kembali
          </rs-button>
        </div>
      </template>

      <template #body>
        <div class="max-w-4xl mx-auto">
          <FormKit 
            type="form" 
            :actions="false" 
            @submit="handleSubmit"
            v-model="formData"
          >
            <!-- Basic Information Section -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Icon name="mdi:information" class="mr-2 text-blue-600" />
                Maklumat Asas
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- ID Had Kifayah -->
                <div>
                  <FormKit
                    type="text"
                    name="idHadKifayah"
                    label="ID Had Kifayah"
                    placeholder="Contoh: HK004"
                    validation="required|length:5"
                    :validation-messages="{
                      required: 'ID Had Kifayah diperlukan',
                      length: 'ID mesti 5 aksara'
                    }"
                    help="Masukkan ID unik untuk Had Kifayah (5 aksara)"
                  />
                </div>

                <!-- Nama Had Kifayah -->
                <div>
                  <FormKit
                    type="text"
                    name="namaHadKifayah"
                    label="Nama Had Kifayah"
                    placeholder="Contoh: Kanak-kanak"
                    validation="required"
                    :validation-messages="{
                      required: 'Nama Had Kifayah diperlukan'
                    }"
                    help="Masukkan nama lengkap Had Kifayah"
                  />
                </div>
              </div>
            </div>

            <!-- Financial Information Section -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Icon name="mdi:currency-usd" class="mr-2 text-green-600" />
                Pelarasan
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Kadar Berbayar -->
                <div>
                  <FormKit
                    type="money"
                    name="kadarBerbayar"
                    label="Kadar Berbayar (RM)"
                    placeholder="0.00"
                    validation="required|number|min:0"
                    :validation-messages="{
                      required: 'Kadar berbayar diperlukan',
                      number: 'Masukkan nilai angka yang sah',
                      min: 'Nilai mesti lebih besar atau sama dengan 0'
                    }"
                    help="Masukkan kadar berbayar dalam Ringgit Malaysia"
                  />
                </div>
              </div>
            </div>

            <!-- Date and Status Section -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Icon name="mdi:calendar" class="mr-2 text-purple-600" />
                Tarikh dan Status
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Tarikh Mula -->
                <div>
                  <FormKit
                    type="date"
                    name="tarikhMula"
                    label="Tarikh Mula"
                    validation="required"
                    :validation-messages="{
                      required: 'Tarikh mula diperlukan'
                    }"
                    help="Pilih tarikh mula berkuatkuasa"
                  />
                </div>

                <!-- Status -->
                <div>
                  <FormKit
                    type="select"
                    name="status"
                    label="Status"
                    :options="statusOptions"
                    placeholder="Pilih status"
                    validation="required"
                    :validation-messages="{
                      required: 'Status diperlukan'
                    }"
                    help="Pilih status Had Kifayah"
                  />
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end space-x-4 pt-6 border-t">
              <rs-button 
                type="button" 
                variant="secondary" 
                @click="navigateTo('/BF-PRF/KF/HK/01_01')"
              >
                Batal
              </rs-button>
              <rs-button 
                btnType="submit" 
                variant="primary"
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
import { ref, reactive, onMounted } from "vue";

definePageMeta({
  title: "Tambah Had Kifayah",
});

const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/KF/HK/admin",
  },
  {
    name: "Konfigurasi Had Kifayah",
    type: "link",
    path: "/BF-PRF/KF/HK/01_01",
  },
  {
    name: "Tambah Baharu",
    type: "current",
    path: "/BF-PRF/KF/HK/01_01/tambah",
  },
]);

// Form data
const formData = reactive({
  idHadKifayah: "",
  namaHadKifayah: "",
  kadarBerbayar: "",
  tarikhMula: "",
  status: "",
});

// Form state
const isSubmitting = ref(false);

// Options for select fields
// removed kategori and jenisIsiRumah options

const statusOptions = [
  { label: "Aktif", value: "Aktif" },
  { label: "Tidak Aktif", value: "Tidak Aktif" },
  { label: "Menunggu Kelulusan", value: "Menunggu Kelulusan" },
];

// Function to load existing data from localStorage
const loadExistingData = () => {
  try {
    const savedData = localStorage.getItem('kifayahLimits');
    if (savedData) {
      return JSON.parse(savedData);
    }
  } catch (error) {
    console.error('Error loading existing data:', error);
  }
  return [];
};

// Function to generate next ID
const generateNextId = () => {
  const existingData = loadExistingData();
  const existingIds = existingData.map(item => item.idHadKifayah);
  
  let counter = 1;
  let newId;
  do {
    newId = `HK${counter.toString().padStart(3, '0')}`;
    counter++;
  } while (existingIds.includes(newId));
  
  return newId;
};

// Handle form submission
const handleSubmit = async (formData) => {
  isSubmitting.value = true;
  
  try {
    // Load existing data
    const existingData = loadExistingData();
    
    // Prepare new data
    const newRecord = {
      idHadKifayah: formData.idHadKifayah,
      namaHadKifayah: formData.namaHadKifayah,
      kadarBerbayar: parseFloat(formData.kadarBerbayar),
      tarikhMula: formData.tarikhMula,
      status: formData.status,
      tindakan: existingData.length + 1,
    };
    
    // Add to existing data
    existingData.push(newRecord);
    
    // Save to localStorage
    localStorage.setItem('kifayahLimits', JSON.stringify(existingData));
    
    // Show success message
    console.log('Data saved successfully:', newRecord);
    
    // Show success alert
    alert('Data Had Kifayah berjaya disimpan!');
    
    // Navigate back to main page
    await navigateTo('/BF-PRF/KF/HK/01_01');
    
  } catch (error) {
    console.error('Error saving data:', error);
    // Show error message (you can use toast notification here)
  } finally {
    isSubmitting.value = false;
  }
};

// Auto-generate ID when component mounts
onMounted(() => {
  formData.idHadKifayah = generateNextId();
});
</script>

<style scoped>
/* Custom styles for the form */
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
