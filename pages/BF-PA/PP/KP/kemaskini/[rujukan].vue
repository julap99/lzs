<!-- 
  RTMF SCREEN: PA-PP-KP-01_01 (Submission Form)
  PURPOSE: Kemaskini Maklumat Perkhidmatan Penolong Amil - Submission form
  DESCRIPTION: Form for submitting service information updates for Penolong Amil
  ROUTE: /BF-PA/PP/KP/kemaskini/[rujukan]
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Enhanced Header Section -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center">
            <Icon name="ph:gear" class="w-6 h-6 mr-3 text-primary" />
            {{ isNewRequest ? 'Permintaan Baharu' : 'Kemaskini Maklumat Perkhidmatan' }}
          </h1>
          <p class="text-gray-600 mt-1">
            {{ isNewRequest ? 'Buat permintaan kemaskini maklumat perkhidmatan penolong amil' : 'Kemaskini maklumat perkhidmatan penolong amil' }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <rs-badge variant="info" class="flex items-center">
            <Icon name="ph:clock" class="w-3 h-3 mr-1" />
            {{ isNewRequest ? 'Permintaan Baharu' : 'Kemaskini Sedia Ada' }}
          </rs-badge>
        </div>
      </div>
    </div>

    <!-- Enhanced Form -->
    <div class="space-y-6">
      <!-- Request Information Card -->
      <rs-card>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              <Icon name="ph:info" class="w-5 h-5 mr-2" />
              {{ isNewRequest ? 'Permintaan Baharu' : 'Maklumat Permintaan Kemaskini' }}
            </h3>
            <div class="flex items-center gap-2">
              <rs-badge v-if="!isNewRequest" variant="success" class="flex items-center">
                <Icon name="ph:check-circle" class="w-3 h-3 mr-1" />
                Rujukan: {{ route.params.rujukan }}
              </rs-badge>
            </div>
          </div>
        </template>
        <template #body>
          <div class="space-y-6">
            <!-- Penolong Amil Selection (for new requests) -->
            <div v-if="isNewRequest">
              <h4 class="text-md font-semibold text-gray-900 mb-4 flex items-center">
                <Icon name="ph:user" class="w-4 h-4 mr-2" />
                Pilih Penolong Amil
              </h4>
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Penolong Amil *</label>
                  
                  <!-- Searchable Select Component -->
                  <div class="relative">
                    <div class="relative">
                      <input
                        type="text"
                        v-model="searchQuery"
                        @focus="showDropdown = true"
                        @input="filterPenolongAmil"
                        placeholder="Cari penolong amil dengan nama atau no. KP..."
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                        :class="{ 'border-red-500': showError }"
                      />
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                        <Icon name="ph:magnifying-glass" class="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    
                    <!-- Selected Item Display -->
                    <div v-if="selectedPenolongAmil" class="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <div class="flex items-center justify-between">
                        <div>
                          <div class="font-medium text-blue-900">{{ selectedPenolongAmil.nama }}</div>
                          <div class="text-sm text-blue-700">{{ selectedPenolongAmil.noKP }} - {{ selectedPenolongAmil.kategori }}</div>
                        </div>
                        <button 
                          @click="clearSelection"
                          class="text-blue-600 hover:text-blue-800"
                        >
                          <Icon name="ph:x" class="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <!-- Dropdown Results -->
                    <div 
                      v-if="showDropdown && filteredPenolongAmil.length > 0"
                      class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
                    >
                      <div 
                        v-for="(item, index) in filteredPenolongAmil"
                        :key="item.id"
                        @click="selectPenolongAmil(item)"
                        @mouseenter="hoveredIndex = index"
                        class="px-3 py-2 cursor-pointer hover:bg-gray-100"
                        :class="{ 'bg-gray-100': hoveredIndex === index }"
                      >
                        <div class="font-medium text-gray-900">{{ item.nama }}</div>
                        <div class="text-sm text-gray-600">{{ item.noKP }} - {{ item.kategori }}</div>
                        <div class="text-xs text-gray-500">{{ item.institusi }}</div>
                      </div>
                    </div>
                    
                    <!-- No Results Message -->
                    <div 
                      v-if="showDropdown && searchQuery && filteredPenolongAmil.length === 0"
                      class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg"
                    >
                      <div class="px-3 py-4 text-center text-gray-500">
                        <Icon name="ph:user-minus" class="w-6 h-6 mx-auto mb-2 text-gray-400" />
                        <p>Tidak dijumpai penolong amil dengan kriteria tersebut</p>
                        <p class="text-sm">Cuba cari dengan nama atau no. KP yang berbeza</p>
                      </div>
                    </div>
                    
                    <!-- Error Message -->
                    <div v-if="showError" class="mt-1 text-sm text-red-600">
                      Sila pilih penolong amil untuk meneruskan
                    </div>
                  </div>
                  
                  <!-- Quick Stats -->
                  <div class="mt-2 text-xs text-gray-500">
                    <span v-if="searchQuery">Dijumpai {{ filteredPenolongAmil.length }} daripada {{ penolongAmilList.length }} penolong amil</span>
                    <span v-else>Jumlah {{ penolongAmilList.length }} penolong amil tersedia</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Maklumat Calon (Read-only) -->
            <div>
              <h4 class="text-md font-semibold text-gray-900 mb-4 flex items-center">
                <Icon name="ph:user" class="w-4 h-4 mr-2" />
                Maklumat Calon
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Jenis Pengenalan</label>
                  <FormKit
                    type="text"
                    v-model="penolongAmil.jenisPengenalan"
                    readonly
                    outer-class="mb-0"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">No. Kad Pengenalan</label>
                  <FormKit
                    type="text"
                    v-model="penolongAmil.noKP"
                    readonly
                    outer-class="mb-0"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nama Penuh</label>
                  <FormKit
                    type="text"
                    v-model="penolongAmil.nama"
                    readonly
                    outer-class="mb-0"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Emel</label>
                  <FormKit
                    type="email"
                    v-model="penolongAmil.emel"
                    readonly
                    outer-class="mb-0"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  <FormKit
                    type="text"
                    v-model="penolongAmil.telefon"
                    readonly
                    outer-class="mb-0"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                  <FormKit
                    type="textarea"
                    v-model="penolongAmil.alamat"
                    readonly
                    outer-class="mb-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Service Information Card -->
      <rs-card>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <Icon name="ph:briefcase" class="w-5 h-5 mr-2" />
            Maklumat Perkhidmatan
          </h3>
        </template>
        <template #body>
          <div class="space-y-6">
            <!-- Current vs New Information Comparison -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Current Information -->
              <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h4 class="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <Icon name="ph:info" class="w-4 h-4 mr-2" />
                  Maklumat Semasa
                </h4>
                <div class="space-y-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Kategori Semasa</label>
                    <div class="p-3 bg-white border border-gray-200 rounded-md">
                      <span class="text-gray-900">{{ penolongAmil.currentKategori }}</span>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Institusi Semasa</label>
                    <div class="p-3 bg-white border border-gray-200 rounded-md">
                      <span class="text-gray-900">{{ penolongAmil.currentInstitusi }}</span>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Mula Perkhidmatan Semasa</label>
                    <div class="p-3 bg-white border border-gray-200 rounded-md">
                      <span class="text-gray-900">{{ penolongAmil.currentTarikhMula }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- New Information -->
              <div class="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <h4 class="text-md font-semibold text-blue-900 mb-4 flex items-center">
                  <Icon name="ph:arrow-right" class="w-4 h-4 mr-2" />
                  Maklumat Baharu
                </h4>
                <div class="space-y-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Kategori Baharu *</label>
                    <FormKit
                      type="select"
                      v-model="updateForm.newKategori"
                      :options="kategoriOptions"
                      validation="required"
                      outer-class="mb-0"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Institusi Baharu *</label>
                    <FormKit
                      type="select"
                      v-model="updateForm.newInstitusi"
                      :options="institusiOptions"
                      validation="required"
                      outer-class="mb-0"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Mula Perkhidmatan Baharu *</label>
                    <FormKit
                      type="date"
                      v-model="updateForm.newTarikhMula"
                      validation="required"
                      outer-class="mb-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Additional Information Card -->
      <rs-card>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <Icon name="ph:note" class="w-5 h-5 mr-2" />
            Maklumat Tambahan
          </h3>
        </template>
        <template #body>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Sebab Permintaan Kemaskini *</label>
              <FormKit
                type="textarea"
                v-model="updateForm.reason"
                placeholder="Nyatakan sebab permintaan kemaskini maklumat perkhidmatan..."
                validation="required"
                rows="4"
                outer-class="mb-0"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Dokumen Sokongan</label>
              <FormKit
                type="file"
                v-model="updateForm.supportingDocuments"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                outer-class="mb-0"
              />
              <div class="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div class="flex items-start">
                  <Icon name="ph:info" class="w-4 h-4 text-blue-600 mr-2 mt-0.5" />
                  <div class="text-sm text-blue-800">
                    <p class="font-medium">Format yang diterima:</p>
                    <p>PDF, DOC, DOCX, JPG, JPEG, PNG (Maksimum 5MB)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Officer Information Card -->
      <rs-card>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <Icon name="ph:user-gear" class="w-5 h-5 mr-2" />
            Maklumat Pegawai
          </h3>
        </template>
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Dihantar Oleh</label>
              <FormKit
                type="text"
                v-model="currentUser.name"
                readonly
                outer-class="mb-0"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Permintaan</label>
              <FormKit
                type="text"
                v-model="currentDate"
                readonly
                outer-class="mb-0"
              />
            </div>
          </div>
        </template>
      </rs-card>
    </div>

    <!-- Enhanced Submit Buttons -->
    <div class="flex justify-end gap-4 mt-8">
      <rs-button
        type="button"
        variant="secondary-outline"
        @click="handleBack"
        :disabled="isSubmitting"
        class="flex items-center"
      >
        <Icon name="ph:arrow-left" class="w-4 h-4 mr-2" />
        Batal
      </rs-button>
      <rs-button
        type="button"
        variant="primary"
        :disabled="isSubmitting || !isFormValid"
        @click="showConfirmationModal = true"
        class="flex items-center"
      >
        <Icon name="ph:check" class="w-4 h-4 mr-2" />
        {{ isSubmitting ? 'Menghantar...' : 'Hantar Permintaan' }}
      </rs-button>
    </div>

    <!-- Enhanced Confirmation Modal -->
    <rs-modal v-model="showConfirmationModal" size="lg">
      <template #header>
        <div class="flex items-center">
          <Icon name="ph:warning-circle" class="w-6 h-6 text-warning mr-3" />
          <h3 class="text-lg font-semibold text-gray-900">Sahkan Permintaan</h3>
        </div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-start">
              <Icon name="ph:info" class="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <h4 class="font-medium text-blue-900 mb-2">Maklumat Permintaan</h4>
                <div class="space-y-2 text-sm text-blue-800">
                  <p><strong>Penolong Amil:</strong> {{ penolongAmil.nama }}</p>
                  <p><strong>Kategori Baharu:</strong> {{ updateForm.newKategori }}</p>
                  <p><strong>Institusi Baharu:</strong> {{ updateForm.newInstitusi }}</p>
                  <p><strong>Tarikh Mula Baharu:</strong> {{ updateForm.newTarikhMula }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div class="flex items-start">
              <Icon name="ph:warning" class="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
              <div>
                <h4 class="font-medium text-yellow-900 mb-2">Peringatan</h4>
                <p class="text-sm text-yellow-800">
                  Permintaan ini akan dihantar untuk semakan dan kelulusan mengikut aliran kerja yang ditetapkan. 
                  Anda tidak akan dapat mengemaskini permintaan ini selepas dihantar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button
            variant="secondary-outline"
            @click="showConfirmationModal = false"
            :disabled="isSubmitting"
          >
            Batal
          </rs-button>
          <rs-button
            variant="primary"
            @click="handleSubmit"
            :disabled="isSubmitting"
            class="flex items-center"
          >
            <Icon v-if="isSubmitting" name="ph:spinner" class="w-4 h-4 mr-2 animate-spin" />
            <Icon v-else name="ph:check" class="w-4 h-4 mr-2" />
            {{ isSubmitting ? 'Menghantar...' : 'Ya, Hantar Permintaan' }}
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Enhanced Success Notification -->
    <div v-if="showSuccessNotification" class="fixed top-4 right-4 z-50">
      <rs-card class="shadow-lg border-l-4 border-success">
        <template #body>
          <div class="flex items-center">
            <Icon name="ph:check-circle" class="w-5 h-5 text-success mr-3" />
            <div>
              <div class="font-medium text-gray-900">Permintaan Berjaya Dihantar</div>
              <div class="text-sm text-gray-600">Permintaan kemaskini maklumat perkhidmatan telah dihantar untuk semakan.</div>
            </div>
            <button @click="hideSuccessNotification" class="ml-4 text-gray-400 hover:text-gray-600">
              <Icon name="ph:x" class="w-4 h-4" />
            </button>
          </div>
        </template>
      </rs-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";

const route = useRoute();
const isNewRequest = computed(() => route.params.rujukan === 'new');

// Enhanced breadcrumb
const breadcrumb = ref([
  {
    name: "BF-PA",
    type: "link",
    path: "/BF-PA",
  },
  {
    name: "PP",
    type: "link",
    path: "/BF-PA/PP",
  },
  {
    name: "Kemaskini Maklumat Perkhidmatan",
    type: "link",
    path: "/BF-PA/PP/KP",
  },
  {
    name: isNewRequest.value ? "Permintaan Baharu" : "Kemaskini Maklumat",
    type: "current",
    path: `/BF-PA/PP/KP/kemaskini/${route.params.rujukan}`,
  },
]);

// Searchable Select State
const searchQuery = ref("");
const showDropdown = ref(false);
const hoveredIndex = ref(-1);
const showError = ref(false);
const selectedPenolongAmil = ref(null);

// Enhanced form data
const updateForm = ref({
  newKategori: "",
  newInstitusi: "",
  newTarikhMula: "",
  reason: "",
  supportingDocuments: null,
});

// Enhanced modal and notification states
const showConfirmationModal = ref(false);
const showSuccessNotification = ref(false);
const isSubmitting = ref(false);

// Enhanced current user and date
const currentUser = ref({
  name: "Ahmad bin Abdullah",
  role: "PYB Institusi",
  id: "USR001",
});

const currentDate = ref(new Date().toLocaleDateString('ms-MY'));

// Enhanced options
const kategoriOptions = [
  { label: "Sila pilih kategori", value: "" },
  { label: "Penolong Amil Fitrah", value: "Penolong Amil Fitrah" },
  { label: "Penolong Amil Padi", value: "Penolong Amil Padi" },
  { label: "Penolong Amil Kariah", value: "Penolong Amil Kariah" },
  { label: "Penolong Amil Komuniti", value: "Penolong Amil Komuniti" },
];

const institusiOptions = [
  { label: "Sila pilih institusi", value: "" },
  { label: "Masjid Al-Hidayah", value: "Masjid Al-Hidayah" },
  { label: "Surau Al-Amin", value: "Surau Al-Amin" },
  { label: "Kompleks Islam", value: "Kompleks Islam" },
  { label: "Masjid Negeri Selangor", value: "Masjid Negeri Selangor" },
];

// Large dataset of Penolong Amil (simulating 500+ records)
const penolongAmilList = ref([
  { id: "PA001", nama: "Ahmad bin Abdullah", noKP: "901231012345", kategori: "Penolong Amil Fitrah", institusi: "Masjid Al-Hidayah" },
  { id: "PA002", nama: "Mohd Ali bin Hassan", noKP: "850315045678", kategori: "Penolong Amil Padi", institusi: "Surau Al-Amin" },
  { id: "PA003", nama: "Fatimah binti Omar", noKP: "920512078901", kategori: "Penolong Amil Kariah", institusi: "Kompleks Islam" },
  { id: "PA004", nama: "Siti Aminah binti Ismail", noKP: "880723123456", kategori: "Penolong Amil Komuniti", institusi: "Masjid Negeri Selangor" },
  { id: "PA005", nama: "Zainal bin Ibrahim", noKP: "870415234567", kategori: "Penolong Amil Fitrah", institusi: "Masjid Al-Hidayah" },
  { id: "PA006", nama: "Nurul Huda binti Ahmad", noKP: "930625345678", kategori: "Penolong Amil Padi", institusi: "Surau Al-Amin" },
  { id: "PA007", nama: "Mohd Razak bin Ismail", noKP: "890812456789", kategori: "Penolong Amil Kariah", institusi: "Kompleks Islam" },
  { id: "PA008", nama: "Siti Mariam binti Hassan", noKP: "910324567890", kategori: "Penolong Amil Komuniti", institusi: "Masjid Negeri Selangor" },
  { id: "PA009", nama: "Abdul Rahman bin Omar", noKP: "860715678901", kategori: "Penolong Amil Fitrah", institusi: "Masjid Al-Hidayah" },
  { id: "PA010", nama: "Aishah binti Abdullah", noKP: "940926789012", kategori: "Penolong Amil Padi", institusi: "Surau Al-Amin" },
  // Add more mock data to simulate large dataset
  ...Array.from({ length: 490 }, (_, i) => ({
    id: `PA${String(i + 11).padStart(3, '0')}`,
    nama: `Penolong Amil ${i + 11}`,
    noKP: `${String(800000 + i).padStart(12, '0')}`,
    kategori: ["Penolong Amil Fitrah", "Penolong Amil Padi", "Penolong Amil Kariah", "Penolong Amil Komuniti"][i % 4],
    institusi: ["Masjid Al-Hidayah", "Surau Al-Amin", "Kompleks Islam", "Masjid Negeri Selangor"][i % 4]
  }))
]);

// Enhanced mock data
const penolongAmil = ref({
  jenisPengenalan: "MyKAD",
  noKP: "901231012345",
  nama: "Ahmad bin Abdullah",
  emel: "ahmad.abdullah@email.com",
  telefon: "012-3456789",
  alamat: "No. 123, Jalan Utama, Taman Seri, 43000 Kajang, Selangor",
  currentKategori: "Penolong Amil Fitrah",
  currentInstitusi: "Masjid Al-Hidayah",
      currentTarikhMula: "15-01-2023",
});

// Computed properties
const filteredPenolongAmil = computed(() => {
  if (!searchQuery.value) {
    return penolongAmilList.value.slice(0, 10); // Show first 10 when no search
  }
  
  const query = searchQuery.value.toLowerCase();
  return penolongAmilList.value.filter(item => 
    item.nama.toLowerCase().includes(query) ||
    item.noKP.includes(query) ||
    item.kategori.toLowerCase().includes(query) ||
    item.institusi.toLowerCase().includes(query)
  );
});

const isFormValid = computed(() => {
  if (isNewRequest.value) {
    return (
      selectedPenolongAmil.value &&
      updateForm.value.newKategori &&
      updateForm.value.newInstitusi &&
      updateForm.value.newTarikhMula &&
      updateForm.value.reason
    );
  }
  return (
    updateForm.value.newKategori &&
    updateForm.value.newInstitusi &&
    updateForm.value.newTarikhMula &&
    updateForm.value.reason
  );
});

// Methods
const filterPenolongAmil = () => {
  showDropdown.value = true;
  hoveredIndex.value = -1;
  showError.value = false;
};

const selectPenolongAmil = (item) => {
  selectedPenolongAmil.value = item;
  searchQuery.value = "";
  showDropdown.value = false;
  showError.value = false;
  
  // Update penolongAmil data with selected item
  penolongAmil.value = {
    jenisPengenalan: "MyKAD",
    noKP: item.noKP,
    nama: item.nama,
    emel: `${item.nama.toLowerCase().replace(/\s+/g, '.')}@email.com`,
    telefon: "012-3456789",
    alamat: "No. 123, Jalan Utama, Taman Seri, 43000 Kajang, Selangor",
    currentKategori: item.kategori,
    currentInstitusi: item.institusi,
    currentTarikhMula: "15-01-2023",
  };
};

const clearSelection = () => {
  selectedPenolongAmil.value = null;
  searchQuery.value = "";
  showError.value = false;
};

const handleBack = () => {
  navigateTo('/BF-PA/PP/KP');
};

const handleSubmit = async () => {
  if (isNewRequest.value && !selectedPenolongAmil.value) {
    showError.value = true;
    return;
  }
  
  isSubmitting.value = true;
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    showConfirmationModal.value = false;
    showSuccessNotification.value = true;
    
    // Navigate back to listing page after a delay
    setTimeout(() => {
      navigateTo('/BF-PA/PP/KP');
    }, 3000);
    
  } catch (error) {
    console.error('Error submitting request:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const hideSuccessNotification = () => {
  showSuccessNotification.value = false;
};

// Click outside to close dropdown
const handleClickOutside = (event) => {
  const target = event.target;
  if (!target.closest('.relative')) {
    showDropdown.value = false;
  }
};

// Enhanced lifecycle
onMounted(() => {
  if (isNewRequest.value) {
    console.log("Loading new request form with searchable select");
    // Add click outside listener
    document.addEventListener('click', handleClickOutside);
  } else {
    console.log("Loading Penolong Amil data for:", route.params.rujukan);
    // In real implementation, fetch data based on rujukan
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* Enhanced styling */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Custom scrollbar for dropdown */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style> 