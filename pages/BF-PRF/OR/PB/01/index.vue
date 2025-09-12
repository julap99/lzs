<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Carian Organisasi HQ</h2>
        </div>
      </template>

      <template #body>
        <!-- Form Carian -->
        <div class="mb-6">
          <FormKit type="form" :actions="false" @submit="handleSubmit">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormKit
                type="text"
                name="namaOrganisasi"
                label="Nama Organisasi HQ"
                v-model="formData.namaOrganisasi"
              />
              <FormKit
                type="text"
                name="kodOrganisasi"
                label="No SSM / ROS / ID Organisasi NAS"
                v-model="formData.kodOrganisasi"
              />
            </div>

            <div class="mt-6 flex justify-end gap-4">
              <rs-button variant="primary-outline" @click="resetForm">Reset</rs-button>
              <rs-button
                variant="primary"
                class="ml-auto"
                @click="validateAndSearch"
                :disabled="processing"
              >
                <span v-if="processing">
                  <Icon name="eos-icons:loading" class="ml-1" size="1rem" />
                </span>
                <span v-else>Cari</span>
              </rs-button>
            </div>
          </FormKit>
        </div>

        <!-- Keputusan Carian -->
        <div v-if="searchCompleted" class="mt-6">
          <rs-card :variant="indukFound ? 'success' : 'danger'" class="mb-4">
            <template #body>
              <div class="flex items-start gap-4">
                <Icon
                  :name="indukFound ? 'mdi:check-circle' : 'mdi:alert-circle'"
                  size="2rem"
                  :class="indukFound ? 'text-green-600' : 'text-red-600'"
                />
                <div class="flex-1">
                  <h3 class="text-lg font-medium">
                    {{
                      indukFound
                        ? 'Organisasi HQ Ditemui'
                        : 'Organisasi HQ Tidak Ditemui'
                    }}
                  </h3>
                  <p class="text-sm mt-1">
                    {{
                      indukFound
                        ? 'Sila teruskan pendaftaran cawangan.'
                        : 'Sila daftar dahulu sebagai Organisasi HQ.'
                    }}
                  </p>
                  
                  <!-- HQ Information Display -->
                  <div v-if="indukFound && hqInfo" class="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 class="font-medium text-gray-900 mb-3">Maklumat Organisasi HQ</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <label class="block text-gray-600 font-medium">Nama Organisasi HQ</label>
                        <p class="text-gray-900">{{ hqInfo.namaOrganisasi }}</p>
                      </div>
                      <div>
                        <label class="block text-gray-600 font-medium">SSM / ROS / ID Organisasi NAS</label>
                        <p class="text-gray-900">{{ hqInfo.kodOrganisasi }}</p>
                      </div>
                      <div>
                        <label class="block text-gray-600 font-medium">Zon / Negeri / Status</label>
                        <p class="text-gray-900">{{ hqInfo.zonNegeriStatus }}</p>
                      </div>
                      <div>
                        <label class="block text-gray-600 font-medium">Status Profil</label>
                        <rs-badge :variant="getStatusVariant(hqInfo.statusProfil)" size="sm">
                          {{ hqInfo.statusProfil }}
                        </rs-badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template #footer>
              <div class="flex justify-end">
                <rs-button
                  variant="primary"
                  @click="navigateNext"
                >
                  {{
                    indukFound
                      ? 'Teruskan Pendaftaran Cawangan'
                      : 'Daftar Organisasi HQ'
                  }}
                </rs-button>
              </div>
            </template>
          </rs-card>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

definePageMeta({
  title: 'Carian Induk',
});

const router = useRouter();
const processing = ref(false);
const searchCompleted = ref(false);
const indukFound = ref(false);
const selectedIndukId = ref(null);
const hqInfo = ref(null);

const breadcrumb = ref([
  {
    name: 'Pengurusan Profil Cawangan',
    type: 'link',
    path: '/BF-PRF/OR/PB/01',
  },
  {
    name: 'Carian HQ',
    type: 'current',
    path: '/BF-PRF/OR/PB/01',
  },
]);

const formData = ref({
  namaOrganisasi: '',
  kodOrganisasi: '',
});

const resetForm = () => {
  formData.value.namaOrganisasi = '';
  formData.value.kodOrganisasi = '';
  searchCompleted.value = false;
  selectedIndukId.value = null;
  hqInfo.value = null;
};

const getStatusVariant = (status) => {
  const variants = {
    'Diluluskan': 'success',
    'Menunggu Pengesahan': 'warning',
    'Ditolak': 'danger',
    'Dalam Semakan': 'info'
  };
  return variants[status] || 'default';
};

const validateAndSearch = () => {
  if (
    !formData.value.namaOrganisasi &&
    !formData.value.kodOrganisasi
  ) {
    alert('Sila isi sekurang-kurangnya satu medan carian.');
    return;
  }
  performSearch();
};

const performSearch = async () => {
  processing.value = true;
  searchCompleted.value = false;

  setTimeout(() => {
    // Simulasi hasil carian berjaya (boleh ganti dgn API betul)
    indukFound.value = Math.random() >= 0.5; // 50% chance of finding HQ
    if (indukFound.value) {
      selectedIndukId.value = 'HQ-20250613-001'; // contoh ID HQ
      // Mock HQ information data
      hqInfo.value = {
        namaOrganisasi: formData.value.namaOrganisasi || 'Masjid Sultan Salahuddin Abdul Aziz Shah',
        kodOrganisasi: formData.value.kodOrganisasi || 'PPM-2021-001',
        zonNegeriStatus: 'Zon A / Selangor / Aktif',
        statusProfil: 'Diluluskan'
      };
    } else {
      hqInfo.value = null;
    }
    processing.value = false;
    searchCompleted.value = true;
  }, 1000);
};

const navigateNext = () => {
  if (indukFound.value) {
    router.push({
      path: '/BF-PRF/OR/PB/02', // Halaman Pendaftaran Cawangan Baharu
      query: { 
        indukId: selectedIndukId.value,
        hqData: JSON.stringify(hqInfo.value)
      },
    });
  } else {
    router.push('/BF-PRF/OR/PP/02'); // Halaman Daftar Organisasi HQ
  }
};

const handleSubmit = () => {
  validateAndSearch();
};
</script>
