<template>
  <div>
    <!-- Breadcrumb for navigation -->
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <h2 class="text-xl font-semibold">Semakan Data Permohonan</h2>
      </template>
      <template #body>
        <div v-for="(applicant, idx) in formData.applicants" :key="idx" class="mb-8 p-4 border border-gray-200 rounded-lg">
          <h3 class="text-lg font-medium mb-4">Pemohon #{{ idx + 1 }}</h3>
          <!-- Editable FormKit form for each applicant -->
          <FormKit
            type="form"
            :actions="false"
            v-model="formData.applicants[idx]"
            @submit="() => handleSubmit(idx)"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="text"
                name="newIC"
                label="No Kad Pengenalan (baru) / Foreign ID"
                validation="required"
                v-model="applicant.newIC"
                :validation-messages="{ required: 'No Kad Pengenalan adalah wajib' }"
              />
              <FormKit
                type="text"
                name="name"
                label="Nama"
                validation="required"
                v-model="applicant.name"
                :validation-messages="{ required: 'Nama adalah wajib' }"
              />
              <FormKit
                type="text"
                name="policeNo"
                label="No Polis/No Tentera/No Sijil Lahir"
                v-model="applicant.policeNo"
              />
              <FormKit
                type="text"
                name="passportNo"
                label="No Pasport"
                v-model="applicant.passportNo"
              />
              <FormKit
                type="date"
                name="passportStartDate"
                label="Tarikh Mula Pasport"
                v-model="applicant.passportStartDate"
              />
              <FormKit
                type="date"
                name="passportEndDate"
                label="Tarikh Tamat Pasport"
                v-model="applicant.passportEndDate"
              />
              <FormKit
                type="text"
                name="phone"
                label="No Telefon"
                validation="required"
                v-model="applicant.phone"
                :validation-messages="{ required: 'No Telefon adalah wajib' }"
              />
              <FormKit
                type="textarea"
                name="address"
                label="Alamat"
                validation="required"
                v-model="applicant.address"
                :validation-messages="{ required: 'Alamat adalah wajib' }"
              />
              <FormKit
                type="select"
                name="familyCategory"
                label="Kategori Keluarga Asnaf"
                validation="required"
                :options="[
                  { label: 'Fakir', value: 'fakir' },
                  { label: 'Miskin', value: 'miskin' },
                  { label: 'Amil', value: 'amil' },
                  { label: 'Muallaf', value: 'muallaf' },
                  { label: 'Riqab', value: 'riqab' },
                  { label: 'Gharimin', value: 'gharimin' },
                  { label: 'Fisabilillah', value: 'fisabilillah' },
                  { label: 'Ibnus Sabil', value: 'ibnus-sabil' }
                ]"
                placeholder="Pilih kategori keluarga asnaf"
                v-model="applicant.familyCategory"
                :validation-messages="{ required: 'Kategori Keluarga Asnaf adalah wajib' }"
              />
            </div>
            <!-- Dokumen Berkaitan Section -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-4">Dokumen Berkaitan</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="(doc, index) in documents"
              :key="index"
              class="p-4 border rounded-lg flex items-center justify-between"
            >
              <div>
                <p class="font-medium">{{ doc.name }}</p>
                <p class="text-sm text-gray-500">{{ doc.type }}</p>
              </div>
              <rs-button
                variant="primary-outline"
                size="sm"
                @click="downloadDocument(doc)"
              >
                <Icon name="mdi:download" class="mr-1" />
                Muat Turun
              </rs-button>
            </div>
          </div>
        </div>
            <div class="mt-4 flex justify-end">
              <rs-button @click="handleSubmit" type="submit" variant="primary">Simpan</rs-button>
            </div>
          </FormKit>
        </div>

        
      </template>
    </rs-card>
  </div>
</template>

<script setup>
// Fake data structure based on QB/01
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const formData = reactive({
  applicants: [
    {
      newIC: '880101-1212',
      name: 'Ahmad bin Abdullah',
      policeNo: 'P123456',
      passportNo: 'A1234567',
      passportStartDate: '2022-01-01',
      passportEndDate: '2027-01-01',
      phone: '012-3456789',
      address: 'No 1, Jalan Mawar, 43000 Kajang, Selangor',
      familyCategory: 'fakir',
    },
    // {
    //   newIC: '900202-2233',
    //   name: 'Siti binti Ali',
    //   policeNo: 'P654321',
    //   passportNo: 'B7654321',
    //   passportStartDate: '2021-05-10',
    //   passportEndDate: '2026-05-10',
    //   phone: '013-9876543',
    //   address: 'No 2, Jalan Melur, 43000 Kajang, Selangor',
    //   familyCategory: 'miskin',
    // },
  ],
});

// Fake documents array (follow /BF-DP/ST/03)
const documents = [
  {
    name: 'laporan polis',
    type: 'PDF',
    url: '#',
  },
//   {
//     name: 'Salinan Kad Pengenalan',
//     type: 'JPG',
//     url: '#',
//   },
//   {
//     name: 'Slip Gaji',
//     type: 'PDF',
//     url: '#',
//   },
];

// Breadcrumb for navigation
const breadcrumb = [
  { name: 'BF-PRF', type: 'link', path: '/BF-PRF' },
  { name: 'AS', type: 'link', path: '/BF-PRF/AS' },
  { name: 'QB', type: 'link', path: '/BF-PRF/AS/QB' },
  { name: 'Semakan Data', type: 'current', path: '/BF-PRF/AS/QB/03' },
];

const router = useRouter();

// Handle form submit for each applicant
function handleSubmit(idx) {
  // For demo, just log the applicant data
  // In production, you would send this to an API or store
  // eslint-disable-next-line no-console
//   console.log('Submitted applicant', idx + 1, formData.applicants[idx]);
  // Redirect to /BF-PRF/AS/QB/02
  router.push('/BF-PRF/AS/QB/02');
}

// Handle document download (demo)
function downloadDocument(doc) {
  // For demo, just log the document info
  // In production, you would trigger a real download
  // eslint-disable-next-line no-console
  console.log('Download document:', doc);
}
</script>
