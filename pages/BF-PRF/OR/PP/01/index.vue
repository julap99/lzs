<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Carian Profil Organisasi</h2>
        </div>
      </template>

      <template #body>
        <!-- Form Section -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-4">Carian Profil Organisasi</h3>
          <FormKit type="form" :actions="false" @submit="handleSubmit">
            <div class="space-y-6">
              <!-- Row 1: Jenis Organisasi & Nama Organisasi -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Jenis Organisasi (ID FR 3.1.1) -->
                <FormKit
                  type="select"
                  name="organizationType"
                  label="Jenis Organisasi"
                  :options="organizationTypeOptions"
                  placeholder="Pilih jenis organisasi"
                  v-model="formData.organizationType"
                />

                <!-- Nama Organisasi (ID FR 3.1.1) -->
                <FormKit
                  type="text"
                  name="organizationName"
                  label="Nama Organisasi"
                  v-model="formData.organizationName"
                  placeholder="Masukkan nama organisasi"
                />
              </div>

              <!-- Row 2: Daerah (two-column layout) -->
              <div v-if="shouldShowDaerah" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormKit
                  type="select"
                  name="daerah"
                  label="Daerah"
                  validation="required"
                  :options="daerahOptions"
                  placeholder="Pilih daerah"
                  v-model="formData.daerah"
                  :validation-messages="{ required: 'Daerah adalah wajib' }"
                  :disabled="!formData.organizationType"
                />
                <!-- Empty div to maintain grid structure -->
                <div></div>
              </div>

              <!-- Row 3: Jenis ID & Nombor Pendaftaran Organisasi -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Jenis ID (ID FR 3.1.2) -->
                <FormKit
                  type="select"
                  name="idType"
                  label="Jenis ID"
                  :options="idTypeOptions"
                  placeholder="Pilih jenis ID (pilihan)"
                  v-model="formData.idType"
                />

                <!-- Nombor Pendaftaran Organisasi (ID FR 3.1.3) -->
                <FormKit
                  type="text"
                  name="idNumber"
                  label="Nombor Pendaftaran Organisasi (SSM/ROS/ID Organisasi)"
                  v-model="formData.idNumber"
                  :placeholder="getPlaceholder()"
                />
              </div>
            </div>

            

            <!-- Search Method Info -->
            <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div class="flex items-start">
                <Icon name="mdi:information" class="text-blue-600 mr-2 mt-0.5" size="1.2rem" />
                <div class="text-sm text-blue-800">
                  <p class="font-medium mb-1">Cara Carian:</p>
                  <ul class="list-disc list-inside space-y-1">
                    <li>Gunakan <strong>Jenis Organisasi</strong> dan <strong>Nama Organisasi</strong> untuk carian mengikut organisasi</li>
                    <li>Gunakan <strong>Jenis ID</strong> dan <strong>Nombor Pendaftaran</strong> untuk carian mengikut ID</li>
                    <li>Atau gunakan <strong>kedua-dua kaedah</strong> untuk carian yang lebih tepat</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="mt-6 flex justify-end gap-4">
              <div>
                <rs-button variant="primary-outline" @click="resetForm">
                  Set Semula
                </rs-button>
              </div>

              <div>
                <rs-button
                  variant="primary"
                  class="ml-auto"
                  @click="validateAndSearch"
                  :disabled="processing || !canSearch"
                >
                  <span v-if="processing">
                    <Icon name="eos-icons:loading" class="ml-1" size="1rem" />
                  </span>
                  <span v-else>Cari</span>
                </rs-button>
              </div>
            </div>
          </FormKit>
        </div>

        <!-- Search Result Section (ID FR 3.2) -->
        <div v-if="searchCompleted" class="mt-6">
          <!-- Profile Found - Show Details -->
          <div v-if="profileExists" class="mb-6">
            <rs-card variant="success" class="mb-4">
              <template #body>
                <div class="flex items-center mb-4">
                  <Icon name="mdi:check-circle" size="2rem" class="text-green-600 mr-4" />
                  <div>
                    <h3 class="text-lg font-medium">Profil Ditemui</h3>
                    <p class="text-sm mt-1">Profil bagi carian yang dimasukkan telah dijumpai dalam sistem NAS.</p>
                  </div>
                </div>
              </template>
            </rs-card>

            <!-- Enhanced Search Results Table -->
            <rs-card>
              <template #header>
                <h4 class="text-lg font-medium">Hasil Carian</h4>
              </template>
              <template #body>
                <rs-table
                  :data="searchResults"
                  :columns="searchResultColumns"
                  :showNoColumn="true"
                  :pageSize="10"
                  :options="{ variant: 'default', hover: true, striped: true }"
                  :options-advanced="{ sortable: true, filterable: false }"
                  advanced
                >
                  <template v-slot:status="{ text }">
                    <rs-badge :variant="getStatusVariant(text)">
                      {{ text }}
                    </rs-badge>
                  </template>
                  <template v-slot:tindakan="{ text }">
                    <div class="flex space-x-3">
                      <button
                        @click="navigateToUpdate(text.id)"
                        title="Kemaskini"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:outline-edit" size="20" class="text-warning" />
                      </button>
                    </div>
                  </template>
                </rs-table>
              </template>
            </rs-card>
          </div>

          <!-- Profile Not Found -->
          <div v-else>
            <rs-card variant="warning">
              <template #body>
                <div class="flex items-center mb-4">
                  <Icon name="mdi:alert-circle" size="2rem" class="text-amber-600 mr-4" />
                  <div>
                    <h3 class="text-lg font-medium">Rekod Tidak Dijumpai</h3>
                    <p class="text-sm mt-1">Rekod tidak dijumpai dalam Sistem NAS. Teruskan ke Pendaftaran Baru.</p>
                  </div>
                </div>
              </template>
              <template #footer>
                <div class="flex justify-end">
                  <rs-button variant="primary" @click="navigateNext">
                    Daftar Organisasi Baharu
                  </rs-button>
                </div>
              </template>
            </rs-card>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

definePageMeta({
  title: "Carian Profil Organisasi",
});

const processing = ref(false);
const searchCompleted = ref(false);
const profileExists = ref(false);

const breadcrumb = ref([
  {
    name: "Pendaftaran Organisasi",
    type: "link",
    path: "/BF-PRF/OR/PP/01",
  },
  {
    name: "Carian Profil Organisasi",
    type: "current",
    path: "/BF-PRF/OR/PP/01",
  },
]);

// Organization Type Options (ID FR 3.1.1)
const organizationTypeOptions = [
  { label: "Agensi", value: "agensi" },
  { label: "Masjid", value: "masjid" },
  { label: "Surau", value: "surau" },
  { label: "Institusi", value: "institusi" },
  { label: "Badan Berkanun", value: "badan_berkanun" },
  { label: "NGO", value: "ngo" },
  { label: "Dalaman LZS - Baitul", value: "dalaman_lzs" },
];

// ID Type Options (ID FR 3.1.2)
const idTypeOptions = [
  { label: "ID Organisasi", value: "id_organisasi" },
  { label: "No Pendaftaran Organisasi (SSM/ROS)", value: "no_pendaftaran" },
];

// Daerah Options (Selangor only)
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

const formData = ref({
  organizationType: "",
  organizationName: "",
  idType: "",
  idNumber: "",
  daerah: "",
});

// Enhanced search results with table data
const searchResults = ref([]);

// Search result table columns
const searchResultColumns = [
  { key: 'namaOrganisasi', label: 'Nama Organisasi', sortable: true },
  { key: 'noPendaftaran', label: 'No. Pendaftaran Organisasi', sortable: true },
  { key: 'jenisOrganisasi', label: 'Jenis Organisasi', sortable: true },
  { key: 'kariah', label: 'Kariah', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'tindakan', label: 'Tindakan', sortable: false },
];

// Mock search result data
const searchResult = ref({
  idType: "",
  organizationName: "",
  organizationType: "",
  registrationStatus: "",
  location: "",
});

// Computed property to determine if daerah field should be shown
const shouldShowDaerah = computed(() => {
  const selectedType = formData.value.organizationType;
  return selectedType === 'masjid' || selectedType === 'surau' || selectedType === 'institusi';
});

// Computed property to determine if search button should be enabled
const canSearch = computed(() => {
  // Check if at least one search method is provided
  const hasOrganizationSearch = formData.value.organizationType && 
                               formData.value.organizationName && 
                               formData.value.organizationName.trim().length > 0;
  
  const hasIDSearch = formData.value.idType && 
                     formData.value.idNumber && 
                     formData.value.idNumber.trim().length > 0;
  
  // Daerah is required only for masjid, surau, and institusi
  const needsDaerah = shouldShowDaerah.value;
  const hasDaerah = !needsDaerah || (formData.value.daerah && formData.value.daerah.trim().length > 0);
  
  // User must provide at least one complete search method AND daerah (if required)
  return (hasOrganizationSearch || hasIDSearch) && hasDaerah;
});

const getPlaceholder = () => {
  switch (formData.value.idType) {
    case "id_organisasi":
      return "Masukkan ID Organisasi (pilihan)";
    case "no_pendaftaran":
      return "Masukkan No. Pendaftaran (SSM/ROS) (pilihan)";
    default:
      return "Sila pilih jenis ID dahulu (pilihan)";
  }
};

const resetForm = () => {
  formData.value.organizationType = "";
  formData.value.organizationName = "";
  formData.value.idType = "";
  formData.value.idNumber = "";
  formData.value.daerah = "";
  searchCompleted.value = false;
  profileExists.value = false;
};

const validateAndSearch = () => {
  if (!canSearch.value) {
    return;
  }

  performSearch();
};

const performSearch = async () => {
  processing.value = true;
  searchCompleted.value = false;

  // Simulate API call to search NAS database (ID FR 2.1)
  setTimeout(() => {
    processing.value = false;
    
    // Mock data for demonstration - simulate finding a profile
    profileExists.value = Math.random() >= 0.5; // 50% chance of finding profile
    
    if (profileExists.value) {
      // Enhanced search results with table data
      searchResults.value = [
        {
          id: 'ORG-202507-0001',
          namaOrganisasi: formData.value.organizationName || "Masjid Al-Hidayah",
          noPendaftaran: formData.value.idNumber || "PPM-2021-001",
          jenisOrganisasi: formData.value.organizationType || "Masjid",
          kariah: "Kariah Petaling Jaya",
          status: "Aktif",
          tindakan: { id: 'ORG-202507-0001' }
        },
        {
          id: 'ORG-202506-0002',
          namaOrganisasi: "Masjid Al-Amin",
          noPendaftaran: "PPM-2021-002",
          jenisOrganisasi: "Masjid",
          kariah: "Kariah Shah Alam",
          status: "Aktif",
          tindakan: { id: 'ORG-202506-0002' }
        }
      ];
      
      // Legacy search result data for backward compatibility
      searchResult.value = {
        idType: formData.value.idType ? 
          (formData.value.idType === "id_organisasi" ? "ID Organisasi" : "No Pendaftaran (SSM/ROS)") : 
          "ID Organisasi",
        organizationName: formData.value.organizationName || "Masjid Al-Hidayah",
        organizationType: formData.value.organizationType || "Masjid",
        registrationStatus: "Aktif",
        location: "Selangor / Petaling / Kariah Petaling Jaya",
      };
    }
    
    searchCompleted.value = true;
  }, 1500);
};

const navigateNext = () => {
  if (profileExists.value) {
    // Consistent behavior for all users: proceed to edit page
    navigateTo("/BF-PRF/OR/PP/kemaskini/ORG-240501");
  } else {
    // Navigate to new registration page with mode=new (ID FR 2.4)
    navigateTo("/BF-PRF/OR/PP/02");
  }
};

// Enhanced navigation for search results
const navigateToUpdate = (id) => {
  navigateTo(`/BF-PRF/OR/PP/kemaskini/${id}`);
};

// Status variant helper for search results
const getStatusVariant = (status) => {
  const variants = {
    'Aktif': 'success',
    'Tidak Aktif': 'danger',
    'Menunggu Pengesahan': 'warning',
    'Dalam Pembetulan': 'warning'
  };
  return variants[status] || 'default';
};

const handleSubmit = (data) => {
  console.log("Form submitted:", data);
  validateAndSearch();
};

// Watch for changes in ID type to clear the ID number field
watch(
  () => formData.value.idType,
  () => {
    formData.value.idNumber = "";
  }
);

// Watch for changes in organization type to clear organization name and daerah
watch(
  () => formData.value.organizationType,
  () => {
    formData.value.organizationName = "";
    // Clear daerah when switching to a type that doesn't need it
    if (!shouldShowDaerah.value) {
      formData.value.daerah = "";
    }
  }
);
</script>
