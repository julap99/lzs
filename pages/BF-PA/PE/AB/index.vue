<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Bancian/Asnaf Review/Bantuan
          </h2>
          <rs-button variant="primary-outline" @click="navigateTo('/BF-PA/PE/AB/01')">Tambah Baru</rs-button>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <!-- Key Metrics Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-blue-600">Jumlah Asnaf</p>
                  <h3 class="text-2xl font-bold text-blue-700">1,234</h3>
                </div>
                <Icon name="heroicons:users" class="text-blue-500" size="24" />
              </div>
            </div>
            <div class="bg-green-50 p-4 rounded-lg border border-green-100">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-green-600">Bantuan Diluluskan</p>
                  <h3 class="text-2xl font-bold text-green-700">856</h3>
                </div>
                <Icon name="heroicons:check-circle" class="text-green-500" size="24" />
              </div>
            </div>
            <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-yellow-600">Dalam Semakan</p>
                  <h3 class="text-2xl font-bold text-yellow-700">245</h3>
                </div>
                <Icon name="heroicons:clock" class="text-yellow-500" size="24" />
              </div>
            </div>
            <div class="bg-red-50 p-4 rounded-lg border border-red-100">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-red-600">Tidak Layak</p>
                  <h3 class="text-2xl font-bold text-red-700">133</h3>
                </div>
                <Icon name="heroicons:x-circle" class="text-red-500" size="24" />
              </div>
            </div>
          </div>

          <!-- Search and Filter Section -->
          <div class="mb-4 flex flex-wrap gap-4 items-center justify-between">
            <div class="flex gap-4">
              <FormKit
                type="text"
                name="search"
                placeholder="Cari nombor rujukan, nama asnaf..."
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
                  { label: 'Lulus', value: 'LULUS' },
                  { label: 'Tidak Lulus', value: 'TIDAK_LULUS' },
                ]"
                :classes="{
                  input: 'w-48',
                }"
              />
            </div>
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
                    Nama Asnaf
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kariah
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jenis Bantuan
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
                    {{ item.asnafName }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ item.kariahName }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ getBantuanTypeLabel(item.bantuanType) }}
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
                        @click="navigateTo(`/BF-PA/PE/AB/${getNextPage(item.status)}`)"
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
  title: "Bancian/Asnaf Review/Bantuan",
  description: "Senarai permohonan bantuan asnaf untuk semakan dan kelulusan",
});

const breadcrumb = ref([
  {
    name: "Bancian/Asnaf",
    type: "link",
    path: "/BF-PA/PE/AB",
  },
  {
    name: "Review/Bantuan",
    type: "current",
    path: "/BF-PA/PE/AB",
  },
]);

// Mock data for applications
const applications = ref([
  {
    referenceNo: "ASN-2024-001",
    asnafName: "Ahmad bin Abdullah",
    kariahName: "Masjid Wilayah Persekutuan",
    bantuanType: "KEWANGAN",
    applicationDate: "01/03/2024",
    status: "Belum Disemak",
  },
  {
    referenceNo: "ASN-2024-002",
    asnafName: "Siti binti Mohamed",
    kariahName: "Masjid Al-Khairiyah",
    bantuanType: "PENDIDIKAN",
    applicationDate: "02/03/2024",
    status: "Menunggu Sokongan JPPA",
  },
  {
    referenceNo: "ASN-2024-003",
    asnafName: "Mohd Razak bin Ibrahim",
    kariahName: "Masjid Bandar Utama",
    bantuanType: "PERUBATAN",
    applicationDate: "03/03/2024",
    status: "Menunggu Kelulusan Ketua JPPA",
  },
  {
    referenceNo: "ASN-2024-004",
    asnafName: "Nurul Huda binti Ali",
    kariahName: "Masjid Damansara Perdana",
    bantuanType: "KEWANGAN",
    applicationDate: "04/03/2024",
    status: "Lulus",
  },
  {
    referenceNo: "ASN-2024-005",
    asnafName: "Abdul Rahman bin Hassan",
    kariahName: "Masjid Kg Delek",
    bantuanType: "PENDIDIKAN",
    applicationDate: "05/03/2024",
    status: "Tidak Lulus",
  },
]);

// Helper functions
const getBantuanTypeLabel = (value) => {
  const types = {
    KEWANGAN: "Bantuan Kewangan",
    PENDIDIKAN: "Bantuan Pendidikan",
    PERUBATAN: "Bantuan Perubatan",
    KEMUDAHAN: "Bantuan Kemudahan",
  };
  return types[value] || value;
};

const getStatusClass = (status) => {
  const statusClasses = {
    "Belum Disemak": "bg-yellow-100 text-yellow-800",
    "Menunggu Sokongan JPPA": "bg-blue-100 text-blue-800",
    "Menunggu Kelulusan Ketua JPPA": "bg-purple-100 text-purple-800",
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
    Lulus: "Kemaskini",
    "Tidak Lulus": "Hantar Semula",
  };
  return actionTexts[status] || "Semakan & Kelulusan";
};

const getNextPage = (status) => {
  const statusPages = {
    "Belum Disemak": "01",
    "Menunggu Sokongan JPPA": "02",
    "Menunggu Kelulusan Ketua JPPA": "03",
    Lulus: "04",
    "Tidak Lulus": "01",
  };
  return statusPages[status] || "01";
};
</script>

<style scoped>
/* Add any additional styles here */
</style> 