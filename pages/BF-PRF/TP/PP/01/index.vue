<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Carian Profil Recipient</h2>
        </div>
      </template>

      <template #body>
        <!-- Form Section -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-4">Maklumat Carian</h3>
          <FormKit type="form" :actions="false" @submit="handleSubmit">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormKit
                type="select"
                name="jenisRecipient"
                label="Jenis Recipient"
                validation="required"
                :options="jenisRecipientOptions"
                placeholder="Pilih jenis recipient"
                v-model="formData.jenisRecipient"
                :validation-messages="{ required: 'Jenis Recipient adalah wajib' }"
              />
              <FormKit
                type="select"
                name="jenisPengenalan"
                label="Jenis Pengenalan"
                validation="required"
                :options="jenisPengenalanOptions"
                placeholder="Pilih jenis pengenalan"
                v-model="formData.jenisPengenalan"
                :validation-messages="{ required: 'Jenis Pengenalan adalah wajib' }"
                :disabled="!formData.jenisRecipient"
              />
              <FormKit
                type="text"
                name="noPengenalan"
                label="No Pengenalan / Kod Vendor / ID Syarikat"
                validation="required"
                v-model="formData.noPengenalan"
                :placeholder="getPlaceholder()"
                :validation-messages="{ required: 'No Pengenalan adalah wajib' }"
                :disabled="!formData.jenisPengenalan"
              />
            </div>

            <div class="mt-6 flex justify-end gap-4">
              <rs-button variant="primary-outline" @click="resetForm">Reset</rs-button>
              <rs-button variant="primary" :disabled="processing" @click="validateAndSearch">
                <span v-if="processing">
                  <Icon name="eos-icons:loading" class="animate-spin mr-1" size="1rem" />
                  Mencari...
                </span>
                <span v-else>Cari</span>
              </rs-button>
            </div>
          </FormKit>
        </div>

        <!-- Search Results Section -->
        <div v-if="searchCompleted" class="mt-6">
          <!-- Results Found -->
          <div v-if="searchResults.length > 0">
            <h3 class="text-lg font-medium mb-4">Hasil Carian</h3>
            
            <!-- Results for Individu -->
            <rs-table
              v-if="formData.jenisRecipient === 'individu'"
              :data="searchResults"
              :columns="individuColumns"
              :pageSize="10"
              :showNoColumn="true"
              :options="{ variant: 'default', hover: true, striped: true }"
            >
              <template v-slot:tindakan="{ text }">
                <div class="flex space-x-2">
                  <rs-button
                    variant="primary"
                    size="sm"
                    @click="navigateToUpdate(text.id)"
                  >
                    Kemaskini Profil
                  </rs-button>
                </div>
              </template>
            </rs-table>

            <!-- Results for Syarikat -->
            <rs-table
              v-if="formData.jenisRecipient === 'syarikat'"
              :data="searchResults"
              :columns="syarikatColumns"
              :pageSize="10"
              :showNoColumn="true"
              :options="{ variant: 'default', hover: true, striped: true }"
            >
              <template v-slot:tindakan="{ text }">
                <div class="flex space-x-2">
                  <rs-button
                    variant="primary"
                    size="sm"
                    @click="navigateToUpdate(text.id)"
                  >
                    Kemaskini Profil
                  </rs-button>
                </div>
              </template>
            </rs-table>
          </div>

          <!-- No Results Found -->
          <div v-else>
            <rs-card variant="warning" class="mb-4">
              <template #body>
                <div class="flex items-center">
                  <div class="mr-4">
                    <Icon
                      name="mdi:alert-circle"
                      size="2rem"
                      class="text-amber-600"
                    />
                  </div>
                  <div>
                    <h3 class="text-lg font-medium">
                      Rekod Tidak Dijumpai
                    </h3>
                    <p class="text-sm mt-1">
                      Rekod tidak dijumpai dalam Sistem NAS. Teruskan ke Pendaftaran Baru.
                    </p>
                  </div>
                </div>
              </template>
              <template #footer>
                <div class="flex justify-end">
                  <rs-button variant="primary" @click="navigateToRegistration">
                    Pendaftaran Baru
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
import { useRouter } from "vue-router";

definePageMeta({ title: "Carian Profil Recipient" });

const router = useRouter();
const processing = ref(false);
const searchCompleted = ref(false);
const searchResults = ref([]);

const breadcrumb = ref([
  { name: "Profil Recipient", type: "link", path: "/BF-PRF/TP/PP/01" },
  { name: "Carian Profil", type: "current", path: "/BF-PRF/TP/PP/01" },
]);

const jenisRecipientOptions = [
  { label: "Individu", value: "individu" },
  { label: "Syarikat", value: "syarikat" },
];

const formData = ref({ 
  jenisRecipient: "", 
  jenisPengenalan: "", 
  noPengenalan: "" 
});

// Computed options for Jenis Pengenalan based on Jenis Recipient
const jenisPengenalanOptions = computed(() => {
  if (formData.value.jenisRecipient === "individu") {
    return [
      { label: "ID Pengenalan", value: "mykad" },
      { label: "Passport No", value: "passport_no" },
    ];
  } else if (formData.value.jenisRecipient === "syarikat") {
    return [
      { label: "ID Syarikat", value: "id_syarikat" },
    ];
  }
  return [];
});

// Table columns for Individu results
const individuColumns = [
  { key: 'namaPenuh', label: 'Nama Penuh', sortable: true },
  { key: 'jenisPengenalan', label: 'Jenis Pengenalan', sortable: true },
  { key: 'idPengenalan', label: 'ID Pengenalan', sortable: true },
  { key: 'tindakan', label: 'Tindakan', sortable: false },
];

// Table columns for Syarikat results
const syarikatColumns = [
  { key: 'namaSyarikat', label: 'Nama Syarikat', sortable: true },
  { key: 'jenisPengenalan', label: 'Jenis Pengenalan', sortable: true },
  { key: 'idSyarikat', label: 'ID Syarikat', sortable: true },
  { key: 'tindakan', label: 'Tindakan', sortable: false },
];

// Mock data for search results
const mockIndividuData = [
  {
    id: 'IND001',
    namaPenuh: 'Ahmad Bin Abdullah',
    jenisPengenalan: 'ID Pengenalan',
    idPengenalan: '880101-12-3456',
    tindakan: { id: 'IND001' }
  }
];

const mockSyarikatData = [
  {
    id: 'SYR001',
    namaSyarikat: 'Pusat Dialisis Al-Falah Sdn Bhd',
    jenisPengenalan: 'ID Syarikat',
    idSyarikat: 'SY123456-X',
    tindakan: { id: 'SYR001' }
  }
];

const getPlaceholder = () => {
  if (!formData.value.jenisPengenalan) return "Sila pilih jenis pengenalan dahulu";
  
  switch (formData.value.jenisPengenalan) {
    case "mykad": return "Contoh: 880101123456";
    case "passport_no": return "Contoh: A12345678";
    case "id_syarikat": return "Contoh: SY123456-X";
    default: return "Sila pilih jenis pengenalan dahulu";
  }
};

const resetForm = () => {
  formData.value.jenisRecipient = "";
  formData.value.jenisPengenalan = "";
  formData.value.noPengenalan = "";
  searchCompleted.value = false;
  searchResults.value = [];
};

const validateAndSearch = () => {
  if (!formData.value.jenisRecipient || !formData.value.jenisPengenalan || !formData.value.noPengenalan) return;
  performSearch();
};

const performSearch = () => {
  processing.value = true;
  searchCompleted.value = false;

  setTimeout(() => {
    processing.value = false;
    
    // Simulate search results - randomly return results or no results
    const hasResults = Math.random() >= 0.5; // 50% chance of finding results
    
    if (hasResults) {
      if (formData.value.jenisRecipient === 'individu') {
        searchResults.value = mockIndividuData.filter(item => 
          item.idPengenalan.includes(formData.value.noPengenalan.replace(/[-\s]/g, ''))
        );
        // If no exact match, show all mock data for demo
        if (searchResults.value.length === 0) {
          searchResults.value = mockIndividuData;
        }
      } else {
        searchResults.value = mockSyarikatData.filter(item => 
          item.idSyarikat.toLowerCase().includes(formData.value.noPengenalan.toLowerCase())
        );
        // If no exact match, show all mock data for demo
        if (searchResults.value.length === 0) {
          searchResults.value = mockSyarikatData;
        }
      }
    } else {
      searchResults.value = [];
    }
    
    searchCompleted.value = true;
  }, 1000);
};

const navigateToUpdate = (id) => {
  // Consistent behavior for all users: proceed to edit page
  router.push(`/BF-PRF/TP/PP/kemaskini/${id}`);
};

const navigateToRegistration = () => {
  router.push("/BF-PRF/TP/PP/02");
};

// Watch for changes in jenisRecipient to reset dependent fields
watch(
  () => formData.value.jenisRecipient,
  () => { 
    formData.value.jenisPengenalan = "";
    formData.value.noPengenalan = "";
    searchCompleted.value = false;
    searchResults.value = [];
  }
);

// Watch for changes in jenisPengenalan to reset ID field
watch(
  () => formData.value.jenisPengenalan,
  () => { 
    formData.value.noPengenalan = "";
    searchCompleted.value = false;
    searchResults.value = [];
  }
);
</script>

<style scoped></style>
