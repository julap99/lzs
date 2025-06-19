<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Maklumat Elaun Penolong Amil (Diluluskan)
          </h2>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <!-- Maklumat Pengiraan Elaun -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">Maklumat Pengiraan Elaun</h3>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">No. Batch</p>
                  <p class="font-medium text-blue-600">{{ batchId }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Lokasi Kariah</p>
                  <p class="font-medium">{{ application.kariahLocation }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Tarikh Tugasan Tamat</p>
                  <p class="font-medium">{{ application.assignmentEndDate }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Jenis Kategori</p>
                  <p class="font-medium">{{ getAssignmentTypeLabel(application.assignmentType) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Status</p>
                  <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Diluluskan
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Tables Section -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">Senarai Penolong Amil dan Aktiviti</h3>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-white">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        No.
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nama Penolong Amil
                      </th>
                      <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aktiviti
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <template v-for="(pa, index) in penolongAmil" :key="pa.id">
                      <tr>
                        <td class="px-6 py-4 whitespace-nowrap">
                          {{ index + 1 }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          {{ pa.name }}
                        </td>
                        <td class="px-6 py-4">
                          <ul class="list-disc list-inside">
                            <li v-for="activity in activities" :key="activity.id" class="flex justify-between items-center">
                              <span class="flex-1 text-center">{{ activity.name }}</span>
                              <span class="text-blue-600 ml-4">RM {{ activity.allowanceRate }}</span>
                            </li>
                          </ul>
                          <div class="text-right mt-2 font-medium text-blue-600">
                            Jumlah Elaun: RM {{ (activities.length * 500).toFixed(2) }}
                          </div>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                  <tfoot class="bg-white">
                    <tr>
                      <td colspan="2" class="px-6 py-4 text-right font-medium">
                        Jumlah Keseluruhan Elaun:
                      </td>
                      <td class="px-6 py-4 font-medium text-blue-600 text-right">
                        RM {{ totalAllowance }}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          <!-- Maklumat Sokongan JPPA -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">Maklumat Sokongan JPPA</h3>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">Disokong Oleh</p>
                  <p class="font-medium">{{ application.jppaSupport.reviewedBy }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Tarikh Sokongan</p>
                  <p class="font-medium">{{ application.jppaSupport.reviewedAt }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Status</p>
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800"
                  >
                    Disokong
                  </span>
                </div>
                <div class="md:col-span-2">
                  <p class="text-sm text-gray-500">Catatan</p>
                  <p class="font-medium">{{ application.jppaSupport.comments }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Maklumat Kelulusan Ketua JPPA -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">Maklumat Kelulusan Ketua JPPA</h3>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">Diluluskan Oleh</p>
                  <p class="font-medium">{{ application.ketuaJPPA.approvedBy }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Tarikh Kelulusan</p>
                  <p class="font-medium">{{ application.ketuaJPPA.approvedAt }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Status</p>
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800"
                  >
                    Diluluskan
                  </span>
                </div>
                <div class="md:col-span-2">
                  <p class="text-sm text-gray-500">Catatan Kelulusan</p>
                  <p class="font-medium">{{ application.ketuaJPPA.comments }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-4 mt-6">
            <rs-button
              variant="primary-outline"
              @click="navigateTo('/BF-PA/PE/AB')"
            >
              Kembali
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

definePageMeta({
  title: "Maklumat Elaun Penolong Amil (Diluluskan)",
  description: "Maklumat elaun penolong amil yang telah diluluskan",
});

const route = useRoute();

const breadcrumb = ref([
  {
    name: "Bancian/Asnaf",
    type: "link",
    path: "/BF-PA/PE/AB",
  },
  {
    name: "Maklumat Elaun (Diluluskan)",
    type: "current",
    path: "/BF-PA/PE/AB/view-lulus",
  },
]);

// Get batch ID from query parameter
const batchId = computed(() => route.query.id || 'BATCH/2024/003');

// Mock application data
const application = ref({
  referenceNo: "ASN-2024-001",
  asnafName: "Ahmad bin Abdullah",
  kariahName: "Masjid Wilayah Persekutuan",
  bantuanType: "KEWANGAN",
  applicationDate: "01/03/2024",
  status: "Diluluskan",
  paId: "PA-2024-001",
  paName: "Mohd Razak bin Ibrahim",
  kariahLocation: "Masjid Wilayah Persekutuan",
  assignmentEndDate: "31/12/2024",
  assignmentType: "KARIAH",
  allowanceRate: "1,500.00",
  calculatedAllowance: "1,500.00",
  isEligible: true,
  jppaSupport: {
    reviewedBy: "Sarah binti Hamid",
    reviewedAt: "15/05/2024, 10:45",
    isSupported: true,
    comments: "Berdasarkan semakan dokumen dan maklumat yang dikemukakan, permohonan ini disokong untuk diluluskan. Asnaf memenuhi semua kriteria yang ditetapkan.",
  },
  ketuaJPPA: {
    approvedBy: "Ahmad bin Ismail",
    approvedAt: "20/05/2024, 14:30",
    isApproved: true,
    comments: "Permohonan elaun penolong amil telah disemak dengan teliti dan memenuhi semua kriteria kelayakan. Dokumen sokongan lengkap dan sah. Amaun elaun adalah munasabah dan dalam had yang dibenarkan. Permohonan ini diluluskan.",
  },
});

// Mock Penolong Amil data
const penolongAmil = ref([
  {
    id: 'PA001',
    name: 'Ahmad bin Abdullah',
    totalAllowance: '1,500.00',
  },
  {
    id: 'PA002',
    name: 'Siti Aminah binti Hassan',
    totalAllowance: '1,000.00',
  },
  {
    id: 'PA003',
    name: 'Mohd Razak bin Ibrahim',
    totalAllowance: '1,000.00',
  },
  {
    id: 'PA004',
    name: 'Nurul Aisyah binti Omar',
    totalAllowance: '1,000.00',
  },
  {
    id: 'PA005',
    name: 'Ali bin Hassan',
    totalAllowance: '1,500.00',
  }
]);

// Mock activities data
const activities = ref([
  {
    id: 'ACT001',
    name: 'Kutipan Zakat Kariah',
    allowanceRate: '500.00',
  },
  {
    id: 'ACT002',
    name: 'Agihan Bantuan Asnaf',
    allowanceRate: '500.00',
  },
  {
    id: 'ACT003',
    name: 'Program Tazkirah',
    allowanceRate: '500.00',
  },
  {
    id: 'ACT004',
    name: 'Lawatan Asnaf',
    allowanceRate: '500.00',
  },
  {
    id: 'ACT005',
    name: 'Program Qiamullail',
    allowanceRate: '500.00',
  }
]);

// Helper functions
const getAssignmentTypeLabel = (value) => {
  const types = {
    FITRAH: "Fitrah",
    PADI: "Padi",
    KARIAH: "Kariah",
    KOMUNITI: "Komuniti",
  };
  return types[value] || value;
};

// Computed properties
const totalAllowance = computed(() => {
  return penolongAmil.value
    .reduce((sum, pa) => sum + parseFloat(pa.totalAllowance.replace(/,/g, '')), 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
});
</script>

<style scoped>
/* Add any additional styles here */
</style> 