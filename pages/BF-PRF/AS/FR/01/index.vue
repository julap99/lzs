<template>
  <div class="min-h-screen bg-gray-50">
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Header Section -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Carian Profil</h1>
            <p class="mt-2 text-gray-600">Cari dan kelola profil asnaf dalam sistem</p>
          </div>
          <div class="flex items-center space-x-3">
            <Icon name="mdi:account-search" size="2rem" class="text-blue-600" />
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Main Search Card -->
      <rs-card class="shadow-lg border-0">
        <template #header>
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-3">
              <Icon name="mdi:card-search" size="1.5rem" class="text-blue-600" />
              <h2 class="text-xl font-semibold text-gray-900">Carian Profil</h2>
            </div>
            <div class="text-sm text-gray-500">
              <Icon name="mdi:information" size="1rem" class="inline mr-1" />
              Isi mana-mana maklumat untuk carian yang fleksibel
            </div>
          </div>
        </template>

        <template #body>
          <!-- Form Section -->
          <div class="mb-8">
            <FormKit type="form" :actions="false" @submit="handleSubmit">
              <!-- Enhanced Search Fields -->
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <!-- Name Field -->
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center">
                      <Icon name="mdi:account" size="1.2rem" class="text-blue-600 mr-2" />
                      <label class="text-sm font-medium text-gray-700">Nama</label>
                    </div>
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
                    @input="validateField('searchName')"
                  />
                  <p class="mt-1 text-xs text-gray-500">Cari dengan nama pertama, nama bapa, atau nama penuh. Contoh: "nur . ahmad" untuk carian tepat</p>
                </div>

                <!-- Kariah Field -->
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center">
                      <Icon name="mdi:mosque" size="1.2rem" class="text-blue-600 mr-2" />
                      <label class="text-sm font-medium text-gray-700">Kariah</label>
                    </div>
                    <div v-if="validationErrors.searchKariah" class="text-xs text-red-500">
                      {{ validationErrors.searchKariah }}
                    </div>
                  </div>
                  <FormKit
                    type="select"
                    name="searchKariah"
                    :options="kariahOptions"
                    placeholder="Pilih kariah"
                    v-model="formData.searchKariah"
                    input-class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    @change="validateField('searchKariah')"
                  />
                  <p class="mt-1 text-xs text-gray-500">Pilih kariah untuk carian yang tepat</p>
                </div>

                <!-- Bank Account Field -->
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center">
                      <Icon name="mdi:bank" size="1.2rem" class="text-blue-600 mr-2" />
                      <label class="text-sm font-medium text-gray-700">Nombor Akaun Bank</label>
                    </div>
                    <div v-if="validationErrors.searchBankAccount" class="text-xs text-red-500">
                      {{ validationErrors.searchBankAccount }}
                    </div>
                  </div>
                  <FormKit
                    type="text"
                    name="searchBankAccount"
                    v-model="formData.searchBankAccount"
                    placeholder="Masukkan nombor akaun bank"
                    input-class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    @input="validateField('searchBankAccount')"
                  />
                  <p class="mt-1 text-xs text-gray-500">Cari dengan nombor akaun bank yang tepat</p>
                </div>
              </div>

              <!-- ID Type and ID Number Fields -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center">
                      <Icon name="mdi:card-account-details" size="1.2rem" class="text-blue-600 mr-2" />
                      <label class="text-sm font-medium text-gray-700">Jenis Pengenalan ID</label>
                    </div>
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

                <div v-if="formData.idType">
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center">
                      <Icon name="mdi:numeric" size="1.2rem" class="text-blue-600 mr-2" />
                      <label class="text-sm font-medium text-gray-700">Pengenalan ID</label>
                    </div>
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
                    @input="validateField('idNumber')"
                  />
                </div>
              </div>



              <!-- Action Buttons -->
              <div class="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
                <rs-button 
                  variant="primary-outline" 
                  @click="resetForm"
                  class="w-full sm:w-auto"
                >
                  <Icon name="mdi:refresh" size="1rem" class="mr-2" />
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
          <div v-if="errorMessage" class="mt-6">
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
                    <div v-if="searchCompleted" class="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p class="text-xs text-red-600">
                        <Icon name="mdi:information" size="1rem" class="inline mr-1" />
                        Semua maklumat mesti tepat untuk mencari profil dalam sistem
                      </p>
                    </div>
                  </div>
                </div>
              </template>
            </rs-card>
          </div>

          <!-- Search Results Section -->
          <div v-if="searchResults.length > 0" class="mt-8">
            <rs-card variant="info" class="mb-6 shadow-md">
              <template #header>
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <Icon name="mdi:account-group" size="1.5rem" class="text-blue-600" />
                    <h3 class="text-lg font-medium text-gray-900">Senarai Profil Ditemui</h3>
                  </div>
                  <div class="flex items-center space-x-4">
                    <span class="text-sm text-gray-500">{{ searchResults.length }} profil ditemui</span>
                    <rs-button 
                      variant="primary-outline" 
                      size="sm"
                      @click="exportResults"
                      class="text-xs"
                    >
                      <Icon name="mdi:download" size="1rem" class="mr-1" />
                      Export
                    </rs-button>
                  </div>
                </div>
              </template>
              <template #body>
                <div class="space-y-3">
                  <div 
                    v-for="profile in searchResults" 
                    :key="profile.id" 
                    @click="selectProfile(profile)" 
                    class="cursor-pointer hover:bg-blue-50 p-4 border border-gray-200 rounded-lg transition-all duration-200 hover:shadow-md hover:border-blue-300"
                    tabindex="0"
                    @keydown.enter="selectProfile(profile)"
                    @keydown.space="selectProfile(profile)"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex-1">
                        <div class="font-semibold text-gray-900 text-lg">{{ profile.name }}</div>
                        <div class="text-sm text-gray-600 mt-1">
                          <span class="inline-flex items-center">
                            <Icon name="mdi:map-marker" size="1rem" class="mr-1" />
                            {{ profile.kariah }}
                          </span>
                          <span class="mx-2">•</span>
                          <span class="inline-flex items-center">
                            <Icon name="mdi:bank" size="1rem" class="mr-1" />
                            {{ profile.bankAccount }}
                          </span>
                        </div>
                        <div class="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                          <span class="inline-flex items-center">
                            <Icon name="mdi:calendar" size="1rem" class="mr-1" />
                            Daftar: {{ profile.registrationDate || 'N/A' }}
                          </span>
                          <span class="inline-flex items-center">
                            <Icon name="mdi:phone" size="1rem" class="mr-1" />
                            {{ profile.phone || 'N/A' }}
                          </span>
                        </div>
                      </div>
                      <div class="ml-4 flex items-center space-x-2">
                        <span :class="getKategoriAsnafVariant(profile.kategoriAsnaf)" class="text-sm font-medium">
                          {{ profile.kategoriAsnaf }}
                        </span>
                        <Icon name="mdi:chevron-right" size="1.5rem" class="text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </rs-card>
          </div>

          <!-- Selected Profile Section -->
          <div v-if="selectedProfile" class="mt-8">
            <rs-card variant="success" class="mb-6 shadow-lg">
              <template #header>
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <Icon name="mdi:check-circle" size="1.5rem" class="text-green-600" />
                    <h3 class="text-lg font-medium text-gray-900">Profil Ditemui</h3>
                  </div>
                  <div class="flex items-center space-x-2">
                    <rs-button 
                      variant="primary-outline" 
                      size="sm"
                      @click="printProfile"
                    >
                      <Icon name="mdi:printer" size="1rem" class="mr-1" />
                      Print
                    </rs-button>
                    <rs-button 
                      variant="primary-outline" 
                      size="sm"
                      @click="viewProfileHistory"
                    >
                      <Icon name="mdi:history" size="1rem" class="mr-1" />
                      History
                    </rs-button>
                  </div>
                </div>
              </template>
              <template #body>
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <!-- Basic Info -->
                  <div class="space-y-4">
                    <h4 class="font-medium text-gray-900 mb-3">Maklumat Asas</h4>
                    <div class="space-y-3">
                      <div class="flex items-center space-x-3">
                        <Icon name="mdi:card-account-details" size="1.2rem" class="text-blue-600" />
                        <div>
                          <p class="text-sm text-gray-500">Jenis Pengenalan ID</p>
                          <p class="font-medium">{{ getSelectedIdTypeLabel() }}</p>
                        </div>
                      </div>
                      <div class="flex items-center space-x-3">
                        <Icon name="mdi:numeric" size="1.2rem" class="text-blue-600" />
                        <div>
                          <p class="text-sm text-gray-500">Pengenalan ID</p>
                          <p class="font-medium">{{ selectedProfile.id }}</p>
                        </div>
                      </div>
                      <div class="flex items-center space-x-3">
                        <Icon name="mdi:account" size="1.2rem" class="text-blue-600" />
                        <div>
                          <p class="text-sm text-gray-500">Nama</p>
                          <p class="font-medium">{{ selectedProfile.name }}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Contact & Location -->
                  <div class="space-y-4">
                    <h4 class="font-medium text-gray-900 mb-3">Maklumat Perhubungan</h4>
                    <div class="space-y-3">
                      <div class="flex items-center space-x-3">
                        <Icon name="mdi:map-marker" size="1.2rem" class="text-blue-600" />
                        <div>
                          <p class="text-sm text-gray-500">Kariah</p>
                          <p class="font-medium">{{ selectedProfile.kariah }}</p>
                        </div>
                      </div>
                      <div class="flex items-center space-x-3">
                        <Icon name="mdi:phone" size="1.2rem" class="text-blue-600" />
                        <div>
                          <p class="text-sm text-gray-500">Telefon</p>
                          <p class="font-medium">{{ selectedProfile.phone || 'N/A' }}</p>
                        </div>
                      </div>
                      <div class="flex items-center space-x-3">
                        <Icon name="mdi:email" size="1.2rem" class="text-blue-600" />
                        <div>
                          <p class="text-sm text-gray-500">Emel</p>
                          <p class="font-medium">{{ selectedProfile.email || 'N/A' }}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Financial & Status -->
                  <div class="space-y-4">
                    <h4 class="font-medium text-gray-900 mb-3">Maklumat Kewangan</h4>
                    <div class="space-y-3">
                      <div class="flex items-center space-x-3">
                        <Icon name="mdi:bank" size="1.2rem" class="text-blue-600" />
                        <div>
                          <p class="text-sm text-gray-500">Akaun Bank</p>
                          <p class="font-medium">{{ selectedProfile.bankAccount }}</p>
                        </div>
                      </div>
                      <div class="flex items-center space-x-3">
                        <Icon name="mdi:badge-account" size="1.2rem" class="text-blue-600" />
                        <div>
                          <p class="text-sm text-gray-500">Kategori Asnaf</p>
                          <p class="font-medium">
                            <span :class="getKategoriAsnafVariant(selectedProfile.kategoriAsnaf)">
                              {{ selectedProfile.kategoriAsnaf }}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div class="flex items-center space-x-3">
                        <Icon name="mdi:calendar" size="1.2rem" class="text-blue-600" />
                        <div>
                          <p class="text-sm text-gray-500">Tarikh Pendaftaran</p>
                          <p class="font-medium">{{ selectedProfile.registrationDate || 'N/A' }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <template #footer>
                <div class="flex justify-end space-x-3">
                  <rs-button variant="primary-outline" @click="viewFullProfile" class="px-6">
                    <Icon name="mdi:eye" size="1rem" class="mr-2" />
                    Lihat Profil Lengkap
                  </rs-button>
                  <rs-button variant="primary" @click="updateProfile" class="px-6">
                    <Icon name="mdi:pencil" size="1rem" class="mr-2" />
                    Kemaskini Profil
                  </rs-button>
                </div>
              </template>
            </rs-card>
          </div>

          <!-- No Results Section -->
          <div v-if="searchCompleted && searchResults.length === 0 && !selectedProfile" class="mt-8">
            <rs-card variant="warning" class="mb-6 shadow-md">
              <template #header>
                <div class="flex items-center space-x-3">
                  <Icon name="mdi:alert-circle" size="1.5rem" class="text-amber-600" />
                  <h3 class="text-lg font-medium text-gray-900">Profil Tidak Ditemui</h3>
                </div>
              </template>
              <template #body>
                <div class="text-center py-8">
                  <Icon name="mdi:account-search" size="4rem" class="text-gray-300 mx-auto mb-4" />
                  <h4 class="text-lg font-medium text-gray-900 mb-2">Tiada profil ditemui</h4>
                  <p class="text-gray-600 mb-4">
                    Tiada profil ditemui dengan maklumat yang dimasukkan. 
                    <span v-if="formData.idNumber && formData.idNumber !== ''" class="font-medium text-amber-700">
                      Pengenalan ID "{{ formData.idNumber }}" mungkin salah atau tidak wujud dalam sistem.
                    </span>
                  </p>
                  <div class="space-y-3 text-sm text-gray-500">
                    <p>• Semak semula maklumat yang dimasukkan</p>
                    <p>• Pastikan format ID adalah betul</p>
                    <p>• Cuba dengan maklumat yang berbeza</p>
                  </div>
                </div>
              </template>
              <template #footer>
                <div class="flex justify-center space-x-4">
                  <rs-button variant="primary-outline" @click="resetForm" class="px-6">
                    <Icon name="mdi:refresh" size="1rem" class="mr-2" />
                    Cuba Lagi
                  </rs-button>
                  <rs-button variant="primary" @click="redirectToApplication" class="px-8">
                    <Icon name="mdi:file-document-plus" size="1rem" class="mr-2" />
                    Isi Borang Permohonan
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
const validationErrors = ref({
  searchName: '',
  searchKariah: '',
  searchBankAccount: '',
  idType: '',
  idNumber: ''
});


const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/AS/FR/01",
  },
  {
    name: "Asnaf",
    type: "link",
    path: "/BF-PRF/AS/FR/01",
  },
  {
    name: "Pendaftaran Lengkap",
    type: "current",
    path: "/BF-PRF/AS/FR/01",
  },
]);

const idTypeOptions = [
  { label: "MyKad", value: "myKad" },
  { label: "Foreign ID", value: "foreignID" },
];

// Kariah options for dropdown
const kariahOptions = [
  { label: "Kariah Masjid Al-Hidayah", value: "Kariah Masjid Al-Hidayah" },
  { label: "Kariah Masjid Al-Ikhlas", value: "Kariah Masjid Al-Ikhlas" },
  { label: "Kariah Masjid Al-Muttaqin", value: "Kariah Masjid Al-Muttaqin" },
  { label: "Kariah Masjid Al-Rahman", value: "Kariah Masjid Al-Rahman" },
  { label: "Kariah Masjid Al-Salam", value: "Kariah Masjid Al-Salam" },
  { label: "Kariah Masjid Al-Taqwa", value: "Kariah Masjid Al-Taqwa" },
  { label: "Kariah Masjid An-Nur", value: "Kariah Masjid An-Nur" },
  { label: "Kariah Masjid Ar-Rahman", value: "Kariah Masjid Ar-Rahman" },
  { label: "Kariah Masjid As-Salam", value: "Kariah Masjid As-Salam" },
  { label: "Kariah Masjid At-Taqwa", value: "Kariah Masjid At-Taqwa" },
  { label: "Masjid Negeri", value: "Masjid Negeri" },
  { label: "Masjid Sultan Salahuddin Abdul Aziz Shah", value: "Masjid Sultan Salahuddin Abdul Aziz Shah" },
  { label: "Masjid Al-Azim Pandan Indah", value: "Masjid Al-Azim Pandan Indah" },
  { label: "Masjid Al-Amin Bangi", value: "Masjid Al-Amin Bangi" },
  { label: "Masjid Wilayah Persekutuan", value: "Masjid Wilayah Persekutuan" },
  { label: "Masjid Al-Khairiyah", value: "Masjid Al-Khairiyah" },
  { label: "Taman Seri Gombak", value: "Taman Seri Gombak" },
  { label: "Masjid Damansara Perdana", value: "Masjid Damansara Perdana" },
  { label: "Masjid Bandar Utama", value: "Masjid Bandar Utama" },
  { label: "Batang Kali", value: "Batang Kali" }
];

const formData = ref({
  searchName: "",
  searchKariah: "",
  searchBankAccount: "",
  idType: "",
  idNumber: "",
});

// Enhanced mock database with proper kariah structure for presentation
const mockDatabase = [
  { 
    id: '123456789', 
    name: 'Ali bin Abu', 
    kariah: 'Kariah Masjid Al-Hidayah', 
    bankAccount: '001122334455', 
    kategoriAsnaf: 'Fakir',
    phone: '012-3456789',
    email: 'ali.abu@email.com',
    registrationDate: '15/01/2023'
  },
  { 
    id: '987654321', 
    name: 'Fatimah binti Ahmad', 
    kariah: 'Kariah Masjid Al-Ikhlas', 
    bankAccount: '005566778899', 
    kategoriAsnaf: 'Miskin',
    phone: '019-8765432',
    email: 'fatimah.ahmad@email.com',
    registrationDate: '22/03/2023'
  },
  { 
    id: '555666777', 
    name: 'Ahmad bin Hassan', 
    kariah: 'Kariah Masjid Al-Muttaqin', 
    bankAccount: '009988776655', 
    kategoriAsnaf: 'Fakir',
    phone: '011-2345678',
    email: 'ahmad.hassan@email.com',
    registrationDate: '08/07/2023'
  },
  { 
    id: '111222333', 
    name: 'Siti binti Omar', 
    kariah: 'Kariah Masjid Al-Rahman', 
    bankAccount: '004433221100', 
    kategoriAsnaf: 'Mualaf',
    phone: '016-7890123',
    email: 'siti.omar@email.com',
    registrationDate: '12/11/2023'
  },
  { 
    id: '888999000', 
    name: 'Mohammad bin Ismail', 
    kariah: 'Kariah Masjid Al-Salam', 
    bankAccount: '007788990011', 
    kategoriAsnaf: 'Fakir',
    phone: '013-4567890',
    email: 'mohammad.ismail@email.com',
    registrationDate: '05/02/2023'
  },
  { 
    id: '444555666', 
    name: 'Aminah binti Zulkifli', 
    kariah: 'Kariah Masjid Al-Taqwa', 
    bankAccount: '002233445566', 
    kategoriAsnaf: 'Miskin',
    phone: '014-5678901',
    email: 'aminah.zulkifli@email.com',
    registrationDate: '18/04/2023'
  },
  { 
    id: '777888999', 
    name: 'Hassan bin Abdullah', 
    kariah: 'Kariah Masjid An-Nur', 
    bankAccount: '006677889900', 
    kategoriAsnaf: 'Fakir',
    phone: '015-6789012',
    email: 'hassan.abdullah@email.com',
    registrationDate: '30/05/2023'
  },
  { 
    id: '222333444', 
    name: 'Noraini binti Kamal', 
    kariah: 'Kariah Masjid Ar-Rahman', 
    bankAccount: '008899001122', 
    kategoriAsnaf: 'Mualaf',
    phone: '017-7890123',
    email: 'noraini.kamal@email.com',
    registrationDate: '14/06/2023'
  },
  { 
    id: '666777888', 
    name: 'Ismail bin Rahman', 
    kariah: 'Kariah Masjid As-Salam', 
    bankAccount: '003344556677', 
    kategoriAsnaf: 'Miskin',
    phone: '018-8901234',
    email: 'ismail.rahman@email.com',
    registrationDate: '25/08/2023'
  },
  { 
    id: '333444555', 
    name: 'Zainab binti Yusof', 
    kariah: 'Kariah Masjid At-Taqwa', 
    bankAccount: '004455667788', 
    kategoriAsnaf: 'Fakir',
    phone: '019-9012345',
    email: 'zainab.yusof@email.com',
    registrationDate: '09/09/2023'
  },
  { 
    id: '999000111', 
    name: 'Abdul Rahman bin Ali', 
    kariah: 'Masjid Negeri', 
    bankAccount: '001122334455', 
    kategoriAsnaf: 'Miskin',
    phone: '010-0123456',
    email: 'abdul.rahman@email.com',
    registrationDate: '20/10/2023'
  },
  { 
    id: '555666777', 
    name: 'Mariam binti Khalid', 
    kariah: 'Masjid Sultan Salahuddin Abdul Aziz Shah', 
    bankAccount: '005566778899', 
    kategoriAsnaf: 'Mualaf',
    phone: '011-1234567',
    email: 'mariam.khalid@email.com',
    registrationDate: '03/12/2023'
  },
  { 
    id: '111222333', 
    name: 'Khalid bin Omar', 
    kariah: 'Masjid Al-Azim Pandan Indah', 
    bankAccount: '009988776655', 
    kategoriAsnaf: 'Fakir',
    phone: '012-2345678',
    email: 'khalid.omar@email.com',
    registrationDate: '17/01/2024'
  },
  { 
    id: '777888999', 
    name: 'Salma binti Ibrahim', 
    kariah: 'Masjid Al-Amin Bangi', 
    bankAccount: '004433221100', 
    kategoriAsnaf: 'Miskin',
    phone: '013-3456789',
    email: 'salma.ibrahim@email.com',
    registrationDate: '28/02/2024'
  },
  { 
    id: '444555666', 
    name: 'Ibrahim bin Ahmad', 
    kariah: 'Masjid Wilayah Persekutuan', 
    bankAccount: '007788990011', 
    kategoriAsnaf: 'Fakir',
    phone: '014-4567890',
    email: 'ibrahim.ahmad@email.com',
    registrationDate: '10/03/2024'
  },
  { 
    id: '222333444', 
    name: 'Nurul Ain binti Zainal', 
    kariah: 'Masjid Al-Khairiyah', 
    bankAccount: '002233445566', 
    kategoriAsnaf: 'Mualaf',
    phone: '015-5678901',
    email: 'nurul.ain@email.com',
    registrationDate: '22/03/2024'
  },
  { 
    id: '888999000', 
    name: 'Zainal bin Mohamed', 
    kariah: 'Taman Seri Gombak', 
    bankAccount: '006677889900', 
    kategoriAsnaf: 'Miskin',
    phone: '016-6789012',
    email: 'zainal.mohamed@email.com',
    registrationDate: '05/04/2024'
  },
  { 
    id: '666777888', 
    name: 'Rohana binti Sulaiman', 
    kariah: 'Masjid Damansara Perdana', 
    bankAccount: '008899001122', 
    kategoriAsnaf: 'Fakir',
    phone: '017-7890123',
    email: 'rohana.sulaiman@email.com',
    registrationDate: '18/04/2024'
  },
  { 
    id: '333444555', 
    name: 'Sulaiman bin Hashim', 
    kariah: 'Masjid Bandar Utama', 
    bankAccount: '003344556677', 
    kategoriAsnaf: 'Miskin',
    phone: '018-8901234',
    email: 'sulaiman.hashim@email.com',
    registrationDate: '30/04/2024'
  },
  { 
    id: '999000111', 
    name: 'Haslina binti Aziz', 
    kariah: 'Batang Kali', 
    bankAccount: '004455667788', 
    kategoriAsnaf: 'Mualaf',
    phone: '019-9012345',
    email: 'haslina.aziz@email.com',
    registrationDate: '12/05/2024'
  },
  { 
    id: '777888999', 
    name: 'Nur Elezza Ainna Ahmad', 
    kariah: 'Kariah Masjid Al-Hidayah', 
    bankAccount: '112233445566', 
    kategoriAsnaf: 'Fakir',
    phone: '010-1234567',
    email: 'nur.elezza@email.com',
    registrationDate: '15/06/2024'
  },
  { 
    id: '888999000', 
    name: 'Nur Elezza Binti Mohammad Ahmad', 
    kariah: 'Kariah Masjid Al-Ikhlas', 
    bankAccount: '223344556677', 
    kategoriAsnaf: 'Miskin',
    phone: '011-2345678',
    email: 'nur.elezza.mohammad@email.com',
    registrationDate: '20/06/2024'
  },
  { 
    id: '666777888', 
    name: 'Mohammad Harun Bin Ali Hassan', 
    kariah: 'Kariah Masjid Al-Muttaqin', 
    bankAccount: '334455667788', 
    kategoriAsnaf: 'Fakir',
    phone: '012-3456789',
    email: 'mohammad.harun@email.com',
    registrationDate: '25/06/2024'
  },
  { 
    id: '555666777', 
    name: 'Aminah Binti Omar Bin Khalid', 
    kariah: 'Kariah Masjid Al-Rahman', 
    bankAccount: '445566778899', 
    kategoriAsnaf: 'Mualaf',
    phone: '013-4567890',
    email: 'aminah.omar@email.com',
    registrationDate: '30/06/2024'
  }
];

// Computed property for form validation
const isFormValid = computed(() => {
  // Allow search if at least one field is filled
  const hasSearchName = formData.value.searchName.trim() !== '';
  const hasSearchKariah = formData.value.searchKariah !== '';
  const hasSearchBankAccount = formData.value.searchBankAccount.trim() !== '';
  const hasIdType = formData.value.idType !== '';
  const hasIdNumber = formData.value.idNumber.trim() !== '';
  
  // At least one field must be filled
  const hasAtLeastOneField = hasSearchName || hasSearchKariah || hasSearchBankAccount || hasIdType || hasIdNumber;
  
  // Only check for critical validation errors (not empty field errors for flexible search)
  const hasCriticalErrors = validationErrors.value.searchName || 
                           validationErrors.value.searchBankAccount || 
                           validationErrors.value.idNumber;
  
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

const getSelectedIdTypeLabel = () => {
  const option = idTypeOptions.find(opt => opt.value === formData.value.idType);
  return option ? option.label : formData.value.idType;
};

const getKategoriAsnafVariant = (kategori) => {
  const variants = {
    'Fakir': 'text-red-600',
    'Miskin': 'text-orange-600', 
    'Mualaf': 'text-blue-600',
  };
  return variants[kategori] || 'text-gray-600';
};

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
      
    case 'searchKariah':
      validationErrors.value.searchKariah = '';
      break;
      
    case 'searchBankAccount':
      if (value.trim() === '') {
        validationErrors.value.searchBankAccount = '';
      } else if (!/^\d+$/.test(value.replace(/\s/g, ''))) {
        validationErrors.value.searchBankAccount = 'Nombor akaun bank mesti mengandungi digit sahaja';
      } else if (value.length < 8 || value.length > 20) {
        validationErrors.value.searchBankAccount = 'Nombor akaun bank mesti 8-20 digit';
      } else {
        validationErrors.value.searchBankAccount = '';
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
      } else if (formData.value.idType === 'myKad' && !/^\d{12}$/.test(value.replace(/\s/g, ''))) {
        validationErrors.value.idNumber = 'Format MyKad tidak sah (12 digit)';
      } else if (formData.value.idType === 'foreignID' && value.trim().length < 3) {
        validationErrors.value.idNumber = 'Foreign ID mesti sekurang-kurangnya 3 aksara';
      } else {
        validationErrors.value.idNumber = '';
      }
      break;
  }
};

const resetForm = () => {
  formData.value.searchName = "";
  formData.value.searchKariah = "";
  formData.value.searchBankAccount = "";
  formData.value.idType = "";
  formData.value.idNumber = "";
  searchResults.value = [];
  selectedProfile.value = null;
  searchCompleted.value = false;
  errorMessage.value = "";
  validationErrors.value = {
    searchName: '',
    searchKariah: '',
    searchBankAccount: '',
    idType: '',
    idNumber: ''
  };
};

const validateAndSearch = () => {
  errorMessage.value = ''; // Clear previous errors
  
  // Validate all fields
  validateField('searchName');
  validateField('searchKariah');
  validateField('searchBankAccount');
  validateField('idType');
  validateField('idNumber');
  
  // Check if at least one field is filled
  const hasSearchName = formData.value.searchName.trim() !== '';
  const hasSearchKariah = formData.value.searchKariah !== '';
  const hasSearchBankAccount = formData.value.searchBankAccount.trim() !== '';
  const hasIdNumber = formData.value.idNumber.trim() !== '';
  const hasIdType = formData.value.idType !== '';
  
  // At least one field must be filled
  if (!hasSearchName && !hasSearchKariah && !hasSearchBankAccount && !hasIdNumber && !hasIdType) {
    errorMessage.value = 'Sila isi sekurang-kurangnya satu maklumat untuk carian';
    return;
  }

  // Only check for critical validation errors (not empty field errors for flexible search)
  const criticalErrors = [];
  if (validationErrors.value.searchName) criticalErrors.push(validationErrors.value.searchName);
  if (validationErrors.value.searchBankAccount) criticalErrors.push(validationErrors.value.searchBankAccount);
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
    const searchKariah = formData.value.searchKariah;
    const searchBankAccount = sanitizeInput(formData.value.searchBankAccount);
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
          // Simple search: any part of the name
          const searchWords = searchName.toLowerCase().split(' ');
          const nameWords = profileName.split(' ');
          
          nameMatch = searchWords.some(searchWord => 
            nameWords.some(nameWord => nameWord.includes(searchWord.trim()))
          );
        }
        
        match = match && nameMatch;
      }
      
      // Check kariah (exact match)
      if (searchKariah) {
        const kariahMatch = profile.kariah === searchKariah;
        match = match && kariahMatch;
      }
      
      // Check bank account (exact match)
      if (searchBankAccount) {
        const bankMatch = profile.bankAccount === searchBankAccount;
        match = match && bankMatch;
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
      searchCompleted.value = true;
      processing.value = false;
      return;
    }

    // If no matches found
    errorMessage.value = 'Tiada profil ditemui dengan maklumat yang dimasukkan';
    searchResults.value = [];
    searchCompleted.value = true;
    processing.value = false;
  }, 1000);
};

const selectProfile = (profile) => {
  selectedProfile.value = profile;
  
  // Populate form fields with selected profile data
  formData.value.idNumber = profile.id;
  formData.value.searchName = profile.name;
  formData.value.searchKariah = profile.kariah;
  formData.value.searchBankAccount = profile.bankAccount;
  
  searchResults.value = []; // Clear search results after selection
};



// Enhanced functionality
const exportResults = () => {
  // Implementation for exporting results
  console.log('Exporting results...');
};

const printProfile = () => {
  // Implementation for printing profile
  console.log('Printing profile...');
};

const viewProfileHistory = () => {
  // Implementation for viewing profile history
  console.log('Viewing profile history...');
};

const viewFullProfile = () => {
  // Implementation for viewing full profile
  console.log('Viewing full profile...');
};

const updateProfile = () => {
  // Navigate to update profile page
  navigateTo("/BF-PRF/AS/UP/02");
};

const redirectToApplication = () => {
  // Navigate to new registration page
  navigateTo("/BF-PRF/AS/FR/02");
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
