<template>
  <div class="min-h-screen bg-gray-50">
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Header Section -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center">
          <Icon name="mdi:account-search" size="2rem" class="text-blue-600" />
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Carian Profil</h1>
          </div>
        </div>
      </div>
    </div>

    <div class="py-8">
      <!-- Main Search Card -->
      <rs-card class="shadow-lg border-0">
        <template #header>
          <div class="flex items-center">
            <h2 class="text-xl font-semibold text-gray-900">Carian Profil</h2>
          </div>
        </template>

      <template #body>
        <!-- Form Section -->
        <div class="mb-8">
          <FormKit type="form" :actions="false" @submit="handleSubmit">
            <!-- Personal Information Section -->
            <div class="mb-8">
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Jenis Pengenalan ID Field -->
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <label class="text-sm font-medium text-gray-700">Jenis Pengenalan ID</label>
                    <div v-if="validationErrors.idType" class="text-xs text-red-500">
                      {{ validationErrors.idType }}
                    </div>
                  </div>
                  <FormKit
                    type="select"
                    name="idType"
                    :options="idTypeOptions" 
                    placeholder="Pilih jenis ID"
                    v-model="formData.idType"
                    input-class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    @change="validateField('idType')"
                  />
                </div>

                <!-- Pengenalan ID Field (conditional) -->
                <div v-if="formData.idType">
                  <div class="flex items-center justify-between mb-2">
                    <label class="text-sm font-medium text-gray-700">Pengenalan ID</label>
                    <div v-if="validationErrors.idNumber" class="text-xs text-red-500">
                      {{ validationErrors.idNumber }}
                    </div>
                  </div>
                  <FormKit
                    type="text"
                    name="idNumber"
                    v-model="formData.idNumber"
                    :placeholder="getPlaceholder()"
                    input-class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    @input="debouncedValidateField('idNumber')"
                  />
                </div>

                <!-- Name Field -->
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <label class="text-sm font-medium text-gray-700">Nama</label>
                    <div v-if="validationErrors.searchName" class="text-xs text-red-500">
                      {{ validationErrors.searchName }}
                    </div>
                  </div>
                  <FormKit
                    type="text"
                    name="searchName"
                    v-model="formData.searchName"
                    placeholder="Masukkan nama (sebarang bahagian nama)"
                    input-class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    @input="debouncedValidateField('searchName')"
                  />
                </div>
              </div>
            </div>

            <!-- Location Information Section -->
            <div class="mb-8">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Daerah Field -->
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <label class="text-sm font-medium text-gray-700">Daerah</label>
                    <div v-if="validationErrors.searchDaerah" class="text-xs text-red-500">
                      {{ validationErrors.searchDaerah }}
                    </div>
                  </div>
                  <FormKit
                    type="select"
                    name="searchDaerah"
                    :options="daerahOptions"
                    placeholder="Pilih daerah"
                    v-model="formData.searchDaerah"
                    input-class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    @change="handleDaerahChange"
                  />
                </div>

                <!-- Kariah Field -->
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <label class="text-sm font-medium text-gray-700">Kariah</label>
                    <div v-if="validationErrors.searchKariah" class="text-xs text-red-500">
                      {{ validationErrors.searchKariah }}
                    </div>
                  </div>
                  <FormKit
                    type="select"
                    name="searchKariah"
                    :options="filteredKariahOptions"
                    placeholder="Pilih kariah"
                    v-model="formData.searchKariah"
                    input-class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    :disabled="!formData.searchDaerah"
                    @change="validateField('searchKariah')"
                  />
                </div>
              </div>
            </div>

            <!-- Contact Information Section -->
            <div class="mb-8">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Phone Field -->
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <label class="text-sm font-medium text-gray-700">No Telefon</label>
                    <div v-if="validationErrors.searchPhone" class="text-xs text-red-500">
                      {{ validationErrors.searchPhone }}
                    </div>
                  </div>
                  <FormKit
                    type="text"
                    name="searchPhone"
                    v-model="formData.searchPhone"
                    placeholder="Contoh: 0123456789"
                    input-class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    @input="debouncedValidateField('searchPhone')"
                  />
                </div>

                <!-- Address Field -->
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <label class="text-sm font-medium text-gray-700">Alamat</label>
                    <div v-if="validationErrors.searchAddress" class="text-xs text-red-500">
                      {{ validationErrors.searchAddress }}
                    </div>
                  </div>
                  <FormKit
                    type="text"
                    name="searchAddress"
                    v-model="formData.searchAddress"
                    placeholder="Masukkan alamat (sebahagian atau penuh)"
                    input-class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    @input="debouncedValidateField('searchAddress')"
                  />
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
              <rs-button 
                variant="primary-outline" 
                @click="resetForm"
                class="w-full sm:w-auto"
              >
                Reset
              </rs-button>

              <rs-button
                variant="primary"
                @click="validateAndSearch"
                :disabled="processing || !isFormValid"
                class="w-full sm:w-auto"
              >
                <span v-if="processing" class="flex items-center">
                  <Icon name="eos-icons:loading" class="mr-2" size="1rem" />
                  Mencari...
                </span>
                <span v-else class="flex items-center">
                  <Icon name="mdi:magnify" size="1rem" class="mr-2" />
                  Cari
                </span>
              </rs-button>
            </div>
          </FormKit>
        </div>

        <!-- Error Message Display -->
        <div v-if="errorMessage && searchCompleted" class="mt-6">
          <rs-card variant="danger" class="mb-4 shadow-md">
            <template #body>
              <div class="flex items-start">
                <div class="mr-4 mt-1">
                  <Icon name="mdi:alert-circle" size="2rem" class="text-red-600" />
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-medium text-red-600 mb-2">
                    {{ searchCompleted ? 'Maklumat Tidak Ditemui' : 'Ralat Pengesahan' }}
                  </h3>
                  <p class="text-sm text-red-700">{{ errorMessage }}</p>
                </div>
              </div>
            </template>
          </rs-card>
        </div>

        <!-- Loading State -->
        <div v-if="processing" class="mt-8">
          <rs-card variant="info" class="mb-6 shadow-md">
            <template #body>
              <div class="flex items-center justify-center py-12">
                <div class="text-center">
                  <Icon name="eos-icons:loading" class="animate-spin text-4xl text-blue-600 mb-4" />
                  <h3 class="text-lg font-medium text-gray-900 mb-2">Mencari Profil...</h3>
                  <p class="text-sm text-gray-500">Sila tunggu sebentar</p>
                </div>
              </div>
            </template>
          </rs-card>
        </div>

        <!-- Search Result Section -->
        <div v-if="searchCompleted" class="mt-6">
          <rs-card
            :variant="profileStatus === 'found' ? 'success' : profileStatus === 'not_found' ? 'warning' : 'info'"
            class="mb-4"
          >
            <template #body>
              <div class="flex items-center">
                <div class="mr-4">
                  <Icon
                    :name="
                      profileStatus === 'found' ? 'mdi:check-circle' : profileStatus === 'not_found' ? 'mdi:alert-circle' : 'mdi:information'
                    "
                    size="2rem"
                    :class="profileStatus === 'found' ? 'text-green-600' : profileStatus === 'not_found' ? 'text-amber-600' : 'text-blue-600'"
                  />
                </div>
                <div>
                  <h3 class="text-lg font-medium">
                    {{
                      profileStatus === 'found' ? "Profil Ditemui" : profileStatus === 'not_found' ? "Profil Tidak Ditemui" : "Lengkapkan Profil"
                    }}
                  </h3>
                  <p class="text-sm mt-1">
                    {{
                      profileStatus === 'found'
                        ? "Profil bagi ID yang dimasukkan telah dijumpai dalam sistem."
                        : profileStatus === 'not_found'
                        ? "Tiada profil ditemui bagi ID yang dimasukkan."
                        : "Profil tidak lengkap. Silakan lengkapkan profil."
                    }}
                  </p>
                </div>
              </div>
            </template>
            <template #footer>
              <div class="flex justify-end">
                <rs-button
                  variant="primary"
                  @click="navigateNext"
                >
                  {{ profileStatus === 'found' ? "Kemaskini Profil" : profileStatus === 'not_found' ? "Pendaftaran Baru" : "Lengkapkan Profil" }}
                </rs-button>
              </div>
            </template>
          </rs-card>
        </div>
      </template>
    </rs-card>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";

definePageMeta({
  title: "Carian Profil",
});

const processing = ref(false);
const searchCompleted = ref(false);
const searchResults = ref([]);
const selectedProfile = ref(null);
const errorMessage = ref('');
const profileStatus = ref(""); // "found", "not_found", "incomplete"

const validationErrors = ref({
  searchName: '',
  searchDaerah: '',
  searchKariah: '',
  searchPhone: '',
  searchAddress: '',
  idType: '',
  idNumber: ''
});

const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/AS/QS/01",
  },
  {
    name: "Asnaf",
    type: "link",
    path: "/BF-PRF/AS/QS/01",
  },
  {
    name: "Carian Pendaftaran Pantas Perseorangan",
    type: "current",
    path: "/BF-PRF/AS/QS/01",
  },
]);

const idTypeOptions = [
  { label: "MyKad", value: "myKad" },
  { label: "Foreign ID", value: "foreignID" },
];

// Daerah options for Selangor
const daerahOptions = [
  { label: "Gombak", value: "gombak" },
  { label: "Hulu Langat", value: "hulu_langat" },
  { label: "Hulu Selangor", value: "hulu_selangor" },
  { label: "Klang", value: "klang" },
  { label: "Kuala Langat", value: "kuala_langat" },
  { label: "Kuala Selangor", value: "kuala_selangor" },
  { label: "Petaling", value: "petaling" },
  { label: "Sabak Bernam", value: "sabak_bernam" },
  { label: "Sepang", value: "sepang" },
];

// Kariah options organized by daerah
const kariahByDaerah = {
  gombak: [
    { label: "Kariah Masjid Al-Hidayah", value: "Kariah Masjid Al-Hidayah" },
    { label: "Kariah Masjid Al-Ikhlas", value: "Kariah Masjid Al-Ikhlas" },
    { label: "Taman Seri Gombak", value: "Taman Seri Gombak" },
    { label: "Masjid Bandar Utama", value: "Masjid Bandar Utama" },
  ],
  hulu_langat: [
    { label: "Masjid Al-Amin Bangi", value: "Masjid Al-Amin Bangi" },
    { label: "Kariah Masjid Al-Muttaqin", value: "Kariah Masjid Al-Muttaqin" },
    { label: "Kariah Masjid Al-Rahman", value: "Kariah Masjid Al-Rahman" },
  ],
  hulu_selangor: [
    { label: "Batang Kali", value: "Batang Kali" },
    { label: "Kariah Masjid Al-Salam", value: "Kariah Masjid Al-Salam" },
  ],
  klang: [
    { label: "Kariah Masjid Al-Taqwa", value: "Kariah Masjid Al-Taqwa" },
    { label: "Kariah Masjid An-Nur", value: "Kariah Masjid An-Nur" },
    { label: "Masjid Al-Khairiyah", value: "Masjid Al-Khairiyah" },
  ],
  kuala_langat: [
    { label: "Kariah Masjid Ar-Rahman", value: "Kariah Masjid Ar-Rahman" },
    { label: "Kariah Masjid As-Salam", value: "Kariah Masjid As-Salam" },
  ],
  kuala_selangor: [
    { label: "Kariah Masjid At-Taqwa", value: "Kariah Masjid At-Taqwa" },
  ],
  petaling: [
    { label: "Masjid Negeri", value: "Masjid Negeri" },
    { label: "Masjid Sultan Salahuddin Abdul Aziz Shah", value: "Masjid Sultan Salahuddin Abdul Aziz Shah" },
    { label: "Masjid Al-Azim Pandan Indah", value: "Masjid Al-Azim Pandan Indah" },
    { label: "Masjid Wilayah Persekutuan", value: "Masjid Wilayah Persekutuan" },
    { label: "Masjid Damansara Perdana", value: "Masjid Damansara Perdana" },
  ],
  sabak_bernam: [
    { label: "Kariah Masjid Al-Hidayah", value: "Kariah Masjid Al-Hidayah" },
  ],
  sepang: [
    { label: "Kariah Masjid Al-Ikhlas", value: "Kariah Masjid Al-Ikhlas" },
  ],
};

const formData = ref({
  searchName: "",
  searchDaerah: "",
  searchKariah: "",
  searchPhone: "",
  searchAddress: "",
  idType: "",
  idNumber: "",
});

// Enhanced mock database with proper kariah structure for presentation
const mockDatabase = [
  { 
    id: '123456789', 
    idType: 'myKad',
    name: 'Ali bin Abu', 
    daerah: 'gombak',
    kariah: 'Kariah Masjid Al-Hidayah', 
    bankAccount: '001122334455', 
    kategoriAsnaf: 'Fakir',
    phone: '012-3456789',
    email: 'ali.abu@email.com',
    registrationDate: '15/01/2023'
  },
  { 
    id: '987654321', 
    idType: 'myKad',
    name: 'Fatimah binti Ahmad', 
    daerah: 'gombak',
    kariah: 'Kariah Masjid Al-Ikhlas', 
    bankAccount: '005566778899', 
    kategoriAsnaf: 'Miskin',
    phone: '019-8765432',
    email: 'fatimah.ahmad@email.com',
    registrationDate: '22/03/2023'
  },
  { 
    id: '555666777', 
    idType: 'myKad',
    name: 'Ahmad bin Hassan', 
    daerah: 'hulu_langat',
    kariah: 'Kariah Masjid Al-Muttaqin', 
    bankAccount: '009988776655', 
    kategoriAsnaf: 'Fakir',
    phone: '011-2345678',
    email: 'ahmad.hassan@email.com',
    registrationDate: '08/07/2023'
  },
  { 
    id: '111222333', 
    idType: 'myKad',
    name: 'Siti binti Omar', 
    daerah: 'hulu_langat',
    kariah: 'Kariah Masjid Al-Rahman', 
    bankAccount: '004433221100', 
    kategoriAsnaf: 'Mualaf',
    phone: '016-7890123',
    email: 'siti.omar@email.com',
    registrationDate: '12/11/2023'
  },
  { 
    id: '888999000', 
    idType: 'myKad',
    name: 'Mohammad bin Ismail', 
    daerah: 'hulu_selangor',
    kariah: 'Kariah Masjid Al-Salam', 
    bankAccount: '007788990011', 
    kategoriAsnaf: 'Fakir',
    phone: '013-4567890',
    email: 'mohammad.ismail@email.com',
    registrationDate: '05/02/2023'
  },
];

// Computed property for form validation
const isFormValid = computed(() => {
  // Allow search if at least one field is filled
  const hasSearchName = formData.value.searchName.trim() !== '';
  const hasSearchDaerah = formData.value.searchDaerah !== '';
  const hasSearchKariah = formData.value.searchKariah !== '';
  const hasSearchPhone = formData.value.searchPhone.trim() !== '';
  const hasSearchAddress = formData.value.searchAddress.trim() !== '';
  const hasIdType = formData.value.idType !== '';
  const hasIdNumber = formData.value.idNumber.trim() !== '';
  
  // At least one field must be filled
  const hasAtLeastOneField = hasSearchName || hasSearchDaerah || hasSearchKariah || hasSearchPhone || hasSearchAddress || hasIdType || hasIdNumber;
  
  // Check for critical validation errors (only if they are non-empty strings)
  const hasCriticalErrors = (validationErrors.value.searchName && validationErrors.value.searchName.trim() !== '') || 
                           (validationErrors.value.searchPhone && validationErrors.value.searchPhone.trim() !== '') || 
                           (validationErrors.value.searchAddress && validationErrors.value.searchAddress.trim() !== '') || 
                           (validationErrors.value.idNumber && validationErrors.value.idNumber.trim() !== '');
  
  return hasAtLeastOneField && !hasCriticalErrors;
});

const getPlaceholder = () => {
  switch (formData.value.idType) {
    case "myKad":
      return "Contoh: 123456789012 (12 digit)";
    case "foreignID":
      return "Masukkan Foreign ID";
    default:
      return "Sila pilih jenis ID dahulu";
  }
};

// Handler for daerah changes
const handleDaerahChange = () => {
  // Clear kariah selection when daerah changes
  formData.value.searchKariah = "";
  validationErrors.value.searchKariah = '';
  validationErrors.value.searchDaerah = '';
};

const getSelectedIdTypeLabel = (idType) => {
  const option = idTypeOptions.find(opt => opt.value === idType);
  return option ? option.label : idType;
};

const getKategoriAsnafBadge = (kategori) => {
  const badges = {
    'Fakir': 'bg-red-100 text-red-800 border-red-200',
    'Miskin': 'bg-orange-100 text-orange-800 border-orange-200', 
    'Mualaf': 'bg-blue-100 text-blue-800 border-blue-200'
  };
  return badges[kategori] || 'bg-gray-100 text-gray-800 border-gray-200';
};

// Computed properties for search feedback
const hasSearchCriteria = computed(() => {
  return formData.value.searchName.trim() !== '' ||
         formData.value.searchDaerah !== '' ||
         formData.value.searchKariah !== '' ||
         formData.value.searchPhone.trim() !== '' ||
         formData.value.searchAddress.trim() !== '' ||
         formData.value.idNumber.trim() !== '';
});

// Computed property for filtered kariah options based on selected daerah
const filteredKariahOptions = computed(() => {
  if (!formData.value.searchDaerah) {
    return [];
  }
  return kariahByDaerah[formData.value.searchDaerah] || [];
});

// Real-time validation
const validateField = (fieldName) => {
  const value = formData.value[fieldName];
  
  switch (fieldName) {
    case 'searchName':
      if (value.trim() === '') {
        validationErrors.value.searchName = '';
      } else if (value.length > 100) {
        validationErrors.value.searchName = 'Nama terlalu panjang (maksimum 100 aksara)';
      } else {
        validationErrors.value.searchName = '';
      }
      break;
      
    case 'searchDaerah':
      validationErrors.value.searchDaerah = '';
      break;
      
    case 'searchKariah':
      validationErrors.value.searchKariah = '';
      break;
    
    case 'searchPhone':
      if (value.trim() === '') {
        validationErrors.value.searchPhone = '';
      } else if (!/^[0-9\-\s+()]+$/.test(value)) {
        validationErrors.value.searchPhone = 'Nombor telefon hanya boleh mengandungi digit dan - + ( )';
      } else if (value.replace(/[^0-9]/g, '').length < 7) {
        validationErrors.value.searchPhone = 'Nombor telefon terlalu pendek';
      } else {
        validationErrors.value.searchPhone = '';
      }
      break;

    case 'searchAddress':
      if (value.trim() === '') {
        validationErrors.value.searchAddress = '';
      } else if (value.length > 200) {
        validationErrors.value.searchAddress = 'Alamat terlalu panjang (maksimum 200 aksara)';
      } else {
        validationErrors.value.searchAddress = '';
      }
      break;
      
    case 'idType':
      // Clear ID number when ID type changes
      if (value === '') {
        formData.value.idNumber = '';
        validationErrors.value.idNumber = '';
      }
      validationErrors.value.idType = '';
      break;
      
    case 'idNumber':
      if (value.trim() === '') {
        validationErrors.value.idNumber = '';
      } else if (value.length > 20) {
        validationErrors.value.idNumber = 'Pengenalan ID terlalu panjang (maksimum 20 aksara)';
      } else if (formData.value.idType === 'myKad') {
        const cleanValue = value.replace(/\s/g, '');
        if (!/^\d{12}$/.test(cleanValue)) {
          validationErrors.value.idNumber = 'Format MyKad tidak sah (12 digit)';
        } else {
          validationErrors.value.idNumber = '';
        }
      } else if (formData.value.idType === 'foreignID' && value.trim().length < 3) {
        validationErrors.value.idNumber = 'Foreign ID mesti sekurang-kurangnya 3 aksara';
      } else {
        validationErrors.value.idNumber = '';
      }
      break;
  }
};

// Debounced validation to prevent validation on every keystroke
let validationTimeout = null;
const debouncedValidateField = (fieldName) => {
  // Clear previous timeout
  if (validationTimeout) {
    clearTimeout(validationTimeout);
  }
  
  // Set new timeout for validation
  validationTimeout = setTimeout(() => {
    validateField(fieldName);
  }, 500); // Wait 500ms after user stops typing
};

const resetForm = () => {
  formData.value.searchName = "";
  formData.value.searchDaerah = "";
  formData.value.searchKariah = "";
  formData.value.searchPhone = "";
  formData.value.searchAddress = "";
  formData.value.idType = "";
  formData.value.idNumber = "";
  searchResults.value = [];
  selectedProfile.value = null;
  searchCompleted.value = false;
  errorMessage.value = "";
  profileStatus.value = "";
  validationErrors.value = {
    searchName: '',
    searchDaerah: '',
    searchKariah: '',
    searchPhone: '',
    searchAddress: '',
    idType: '',
    idNumber: ''
  };
};

const validateAndSearch = () => {
  errorMessage.value = ''; // Clear previous errors
  
  // Validate all fields
  validateField('searchName');
  validateField('searchDaerah');
  validateField('searchKariah');
  validateField('searchPhone');
  validateField('searchAddress');
  validateField('idType');
  validateField('idNumber');
  
  // Check if at least one field is filled
  const hasSearchName = formData.value.searchName.trim() !== '';
  const hasSearchDaerah = formData.value.searchDaerah !== '';
  const hasSearchKariah = formData.value.searchKariah !== '';
  const hasSearchPhone = formData.value.searchPhone.trim() !== '';
  const hasSearchAddress = formData.value.searchAddress.trim() !== '';
  const hasIdNumber = formData.value.idNumber.trim() !== '';
  const hasIdType = formData.value.idType !== '';
  
  // At least one field must be filled
  if (!hasSearchName && !hasSearchDaerah && !hasSearchKariah && !hasSearchPhone && !hasSearchAddress && !hasIdNumber && !hasIdType) {
    errorMessage.value = 'Sila isi sekurang-kurangnya satu maklumat untuk carian';
    return;
  }

  // Only check for critical validation errors (not empty field errors for flexible search)
  const criticalErrors = [];
  if (validationErrors.value.searchName) criticalErrors.push(validationErrors.value.searchName);
  if (validationErrors.value.searchPhone) criticalErrors.push(validationErrors.value.searchPhone);
  if (validationErrors.value.searchAddress) criticalErrors.push(validationErrors.value.searchAddress);
  if (validationErrors.value.idNumber) criticalErrors.push(validationErrors.value.idNumber);
  
  if (criticalErrors.length > 0) {
    errorMessage.value = 'Sila betulkan ralat dalam borang';
    return;
  }

  performFlexibleSearch();
};

const performFlexibleSearch = async () => {
  processing.value = true;
  searchCompleted.value = false;
  searchResults.value = [];
  selectedProfile.value = null;

  // Simulate API call delay
  setTimeout(() => {
    // Sanitize inputs
    const sanitizeInput = (input) => {
      return input.replace(/[<>]/g, '').trim();
    };
    
    const searchName = sanitizeInput(formData.value.searchName).toLowerCase();
    const searchDaerah = formData.value.searchDaerah;
    const searchKariah = formData.value.searchKariah;
    const searchPhone = sanitizeInput(formData.value.searchPhone).toLowerCase();
    const searchAddress = sanitizeInput(formData.value.searchAddress).toLowerCase();
    const idNumber = sanitizeInput(formData.value.idNumber);
    const idType = formData.value.idType;
    
    // Find matches based on any combination of filled fields
    const matches = mockDatabase.filter(profile => {
      let match = true;
      
      // Check name with advanced flexible search (handles complex name patterns)
      if (searchName) {
        const profileName = profile.name.toLowerCase();
        const searchTerms = searchName.toLowerCase().split(/\s*\.\s*/); // Split by dots for pattern matching
        
        // Handle different search patterns
        let nameMatch = false;
        
        if (searchTerms.length === 2) {
          // Pattern: "first . last" or "middle . last" or "last . first"
          const [term1, term2] = searchTerms;
          
          // Check if both terms exist in the name (in any order)
          const nameWords = profileName.split(' ');
          const hasTerm1 = nameWords.some(word => word.includes(term1.trim()));
          const hasTerm2 = nameWords.some(word => word.includes(term2.trim()));
          
          nameMatch = hasTerm1 && hasTerm2;
        } else {
          // Simple search: ALL parts of the name must be found (AND logic)
          const searchWords = searchName.toLowerCase().split(' ').filter(word => word.trim() !== '');
          const nameWords = profileName.split(' ');
          
          // Check if ALL search words are found in the name (AND logic)
          nameMatch = searchWords.every(searchWord => 
            nameWords.some(nameWord => nameWord.includes(searchWord.trim()))
          );
        }
        
        match = match && nameMatch;
      }
      
      // Check daerah (exact match)
      if (searchDaerah) {
        const daerahMatch = profile.daerah === searchDaerah;
        match = match && daerahMatch;
      }
      
      // Check kariah (exact match)
      if (searchKariah) {
        const kariahMatch = profile.kariah === searchKariah;
        match = match && kariahMatch;
      }

      // Check phone (partial match)
      if (searchPhone) {
        const phoneNormalized = (profile.phone || '').toLowerCase();
        const phoneMatch = phoneNormalized.includes(searchPhone.replace(/\s/g, ''));
        match = match && phoneMatch;
      }

      // Check address (partial). Mock does not include address; fallback using name/kariah heuristics
      if (searchAddress) {
        const addressFields = [
          (profile.address || '').toLowerCase(),
          (profile.kariah || '').toLowerCase(),
          (profile.name || '').toLowerCase()
        ];
        const addressMatch = addressFields.some(f => f.includes(searchAddress));
        match = match && addressMatch;
      }
      
      // Check ID number (exact match)
      if (idNumber) {
        const idMatch = profile.id === idNumber;
        match = match && idMatch;
      }
      
      // Check ID type (if specified)
      if (idType) {
        // For now, we'll assume all profiles have MyKad type
        // In real implementation, you'd check the actual ID type
        match = match && true; // Placeholder for ID type check
      }
      
      return match;
    });

    if (matches.length > 0) {
      searchResults.value = matches;
      // Determine profile status based on search results
      // For now, we'll simulate the original logic with random status
      // In real implementation, this would be determined by the API response
      const random = Math.random();
      if (random < 0.33) {
        profileStatus.value = "found";
      } else if (random < 0.66) {
        profileStatus.value = "incomplete";
      } else {
        profileStatus.value = "not_found";
      }
      searchCompleted.value = true;
      processing.value = false;
      return;
    }

    // If no matches found
    profileStatus.value = "not_found";
    searchResults.value = [];
    searchCompleted.value = true;
    processing.value = false;
  }, 1000);
};

const updateProfile = (profile) => {
  // Navigate to update profile page with profile data
  navigateTo("/BF-PRF/AS/UP/02");
};

const completeProfile = (profile) => {
  // Navigate to complete profile page
  navigateTo("/BF-PRF/AS/QS/02");
};

const navigateNext = () => {
  if (profileStatus.value === "found") {
    // Navigate to update profile page
    navigateTo("/BF-PRF/AS/UP/02");
  } else if (profileStatus.value === "incomplete") {
    // Navigate to complete profile page
    navigateTo("/BF-PRF/AS/QS/02");
  } else {
    // Navigate to new registration page
    navigateTo("/BF-PRF/AS/QS/03");
  }
};

const redirectToApplication = () => {
  // Navigate to new registration page
  navigateTo("/BF-PRF/AS/QS/03");
};

const handleSubmit = (data) => {
  validateAndSearch();
};

// Watch for changes in ID type to clear the ID number field
watch(
  () => formData.value.idType,
  () => {
    formData.value.idNumber = "";
    validateField('idNumber');
  }
);
</script>
