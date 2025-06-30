<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Carian Organisasi Induk</h2>
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
                label="Nama Organisasi Induk"
                v-model="formData.namaOrganisasi"
              />
              <FormKit
                type="text"
                name="kodOrganisasi"
                label="Kod / ROC / ROS"
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
                <div>
                  <h3 class="text-lg font-medium">
                    {{
                      indukFound
                        ? 'Organisasi Induk Ditemui'
                        : 'Organisasi Induk Tidak Ditemui'
                    }}
                  </h3>
                  <p class="text-sm mt-1">
                    {{
                      indukFound
                        ? 'Sila teruskan pendaftaran cawangan.'
                        : 'Sila daftar dahulu sebagai Organisasi Induk.'
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
                  {{
                    indukFound
                      ? 'Teruskan Pendaftaran Cawangan'
                      : 'Daftar Organisasi Induk'
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

const breadcrumb = ref([
  {
    name: 'Pengurusan Profil Cawangan',
    type: 'link',
    path: '/BF-PRF/OR/PB/01',
  },
  {
    name: 'Carian Induk',
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
    indukFound.value = Math.random() > 0.3;
    if (indukFound.value) {
      selectedIndukId.value = 'HQ-20250613-001'; // contoh ID HQ
    }
    processing.value = false;
    searchCompleted.value = true;
  }, 1000);
};

const navigateNext = () => {
  if (indukFound.value) {
    router.push({
      path: '/BF-PRF/OR/PB/02', // Halaman Pendaftaran Cawangan Baharu
      query: { indukId: selectedIndukId.value },
    });
  } else {
    router.push('/BF-PRF/OR/PB/03'); // Halaman Daftar Organisasi Induk
  }
};

const handleSubmit = () => {
  validateAndSearch();
};
</script>
