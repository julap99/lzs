<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Senarai Permohonan Penolong Amil
          </h2>
          <rs-button
            variant="primary"
            @click="navigateTo('/BF-PA/PP/PD/01')"
          >
            <Icon name="material-symbols:add-circle" class="mr-2" />
            Tambah Baru
          </rs-button>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <!-- Search and Filter Section -->
          <div class="mb-4 flex flex-wrap gap-4">
            <FormKit
              type="text"
              name="search"
              placeholder="Cari nombor rujukan, nama calon..."
              :classes="{
                input: 'w-64',
              }"
            />
            <FormKit
              type="select"
              name="status"
              placeholder="Status"
              :options="[
                { label: 'Semua Status', value: '' },
                { label: 'Belum Disemak', value: 'BELUM_DISEMAK' },
                { label: 'Menunggu Sokongan JPPA', value: 'MENUNGGU_SOKONGAN' },
                { label: 'Menunggu Kelulusan Ketua JPPA', value: 'MENUNGGU_KELULUSAN_KETUA_JPPA' },
                { label: 'Menunggu Kelulusan Ketua Divisyen', value: 'MENUNGGU_KELULUSAN_KETUA_DIVISYEN' },
                { label: 'Lulus', value: 'LULUS' },
                { label: 'Tidak Lulus', value: 'TIDAK_LULUS' },
              ]"
              :classes="{
                input: 'w-48',
              }"
            />
          </div>

          <!-- Table Section -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No. Rujukan
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Calon
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Masjid
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarikh Mohon
                  </th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tindakan
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in applications" :key="item.referenceNo">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ item.referenceNo }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ item.candidateName }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ item.masjidName }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ getCategoryLabel(item.category) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ item.applicationDate }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full"
                      :class="getStatusClass(item.status)"
                    >
                      {{ item.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <div class="flex justify-center">
                      <rs-button
                        variant="primary"
                        size="sm"
                        @click="navigateTo(`/BF-PA/PP/PD/${getNextPage(item.status)}`)"
                      >
                        {{ getActionButtonText(item.status) }}
                      </rs-button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';

definePageMeta({
  title: "Senarai Permohonan Penolong Amil",
  description: "Senarai permohonan penolong amil untuk semakan dan kelulusan",
});

const breadcrumb = ref([
  {
    name: "Penolong Amil",
    type: "link",
    path: "/BF-PA/PP/PM/01",
  },
  {
    name: "Pendaftaran",
    type: "link",
    path: "/BF-PA/PP/PM/01",
  },
  {
    name: "Senarai Permohonan",
    type: "current",
    path: "/BF-PA/PP/PD",
  },
]);

// Mock data for applications
const applications = ref([
  {
    referenceNo: "PA-2024-001",
    candidateName: "Ahmad bin Abdullah",
    masjidName: "Masjid Wilayah Persekutuan",
    category: "FITRAH",
    applicationDate: "01/03/2024",
    status: "Belum Disemak",
  },
  {
    referenceNo: "PA-2024-002",
    candidateName: "Siti binti Mohamed",
    masjidName: "Masjid Al-Khairiyah",
    category: "KARIAH",
    applicationDate: "02/03/2024",
    status: "Menunggu Sokongan JPPA",
  },
  {
    referenceNo: "PA-2024-003",
    candidateName: "Mohd Razak bin Ibrahim",
    masjidName: "Masjid Bandar Utama",
    category: "KOMUNITI",
    applicationDate: "03/03/2024",
    status: "Menunggu Kelulusan Ketua JPPA",
  },
  {
    referenceNo: "PA-2024-004",
    candidateName: "Nurul Huda binti Ali",
    masjidName: "Masjid Damansara Perdana",
    category: "PADI",
    applicationDate: "04/03/2024",
    status: "Menunggu Kelulusan Ketua Divisyen",
  },
  {
    referenceNo: "PA-2024-005",
    candidateName: "Abdul Rahman bin Hassan",
    masjidName: "Masjid Kg Delek",
    category: "FITRAH",
    applicationDate: "05/03/2024",
    status: "Lulus",
  },
  {
    referenceNo: "PA-2024-006",
    candidateName: "Fatimah binti Ismail",
    masjidName: "Masjid Al-Hidayah",
    category: "KOMUNITI",
    applicationDate: "06/03/2024",
    status: "Tidak Lulus",
  },
]);

// Helper functions
const getCategoryLabel = (value) => {
  const categories = {
    FITRAH: "Fitrah",
    PADI: "Padi",
    KARIAH: "Kariah",
    KOMUNITI: "Komuniti",
  };
  return categories[value] || value;
};

const getStatusClass = (status) => {
  const statusClasses = {
    "Belum Disemak": "bg-yellow-100 text-yellow-800",
    "Menunggu Sokongan JPPA": "bg-blue-100 text-blue-800",
    "Menunggu Kelulusan Ketua JPPA": "bg-purple-100 text-purple-800",
    "Menunggu Kelulusan Ketua Divisyen": "bg-indigo-100 text-indigo-800",
    Lulus: "bg-green-100 text-green-800",
    "Tidak Lulus": "bg-red-100 text-red-800",
  };
  return statusClasses[status] || "bg-gray-100 text-gray-800";
};

const getActionButtonText = (status) => {
  const actionTexts = {
    "Belum Disemak": "Semakan & Tapisan",
    "Menunggu Sokongan JPPA": "Semakan & Sokongan",
    "Menunggu Kelulusan Ketua JPPA": "Semakan & Kelulusan",
    "Menunggu Kelulusan Ketua Divisyen": "Semakan & Kelulusan",
    Lulus: "Kemaskini",
    "Tidak Lulus": "Hantar Semula",
  };
  return actionTexts[status] || "Semakan & Kelulusan";
};

const getNextPage = (status) => {
  const statusPages = {
    "Belum Disemak": "02",
    "Menunggu Sokongan JPPA": "03",
    "Menunggu Kelulusan Ketua JPPA": "04",
    "Menunggu Kelulusan Ketua Divisyen": "05",
    Lulus: "06",
    "Tidak Lulus": "01",
  };
  return statusPages[status] || "01";
};
</script>

<style scoped>
/* Add any additional styles here */
</style>