<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Maklumat Aktiviti Mesyuarat/Program (Diluluskan)
          </h2>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <!-- Maklumat Aktiviti -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">Maklumat Aktiviti</h3>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">ID Aktiviti</p>
                  <p class="font-medium text-blue-600">{{ activityId }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Nama Aktiviti</p>
                  <p class="font-medium">{{ activity.name }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Tarikh</p>
                  <p class="font-medium">{{ activity.date }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Lokasi</p>
                  <p class="font-medium">{{ activity.location }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Jenis</p>
                  <p class="font-medium">{{ activity.type }}</p>
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

          <!-- Senarai Penolong Amil -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">Senarai Penolong Amil Yang Terlibat</h3>
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
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Peranan
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Elaun
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="(pa, index) in penolongAmil" :key="pa.id">
                      <td class="px-6 py-4 whitespace-nowrap">
                        {{ index + 1 }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        {{ pa.name }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        {{ pa.role }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        RM {{ pa.allowance }}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot class="bg-white">
                    <tr>
                      <td colspan="3" class="px-6 py-4 text-right font-medium">
                        Jumlah Keseluruhan Elaun:
                      </td>
                      <td class="px-6 py-4 font-medium text-blue-600">
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
                  <p class="font-medium">{{ activity.jppaSupport.reviewedBy }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Tarikh Sokongan</p>
                  <p class="font-medium">{{ activity.jppaSupport.reviewedAt }}</p>
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
                  <p class="font-medium">{{ activity.jppaSupport.comments }}</p>
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
                  <p class="font-medium">{{ activity.ketuaJPPA.approvedBy }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Tarikh Kelulusan</p>
                  <p class="font-medium">{{ activity.ketuaJPPA.approvedAt }}</p>
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
                  <p class="font-medium">{{ activity.ketuaJPPA.comments }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-4 mt-6">
            <rs-button
              variant="primary-outline"
              @click="navigateTo('/BF-PA/PE/MP')"
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
  title: "Maklumat Aktiviti Mesyuarat/Program (Diluluskan)",
  description: "Maklumat aktiviti mesyuarat dan program yang telah diluluskan",
});

const route = useRoute();

const breadcrumb = ref([
  {
    name: "Mesyuarat/Program",
    type: "link",
    path: "/BF-PA/PE/MP",
  },
  {
    name: "Maklumat Aktiviti (Diluluskan)",
    type: "current",
    path: "/BF-PA/PE/MP/view-lulus",
  },
]);

// Get activity ID from query parameter
const activityId = computed(() => route.query.id || 'MP/2024/002');

// Mock activity data
const activity = ref({
  id: 'MP/2024/002',
  name: 'Program Tazkirah Bulanan',
  date: '2024-03-16',
  location: 'Masjid Al-Hidayah',
  type: 'Program',
  status: 'Diluluskan',
  jppaSupport: {
    reviewedBy: "Sarah binti Hamid",
    reviewedAt: "15/05/2024, 10:45",
    isSupported: true,
    comments: "Berdasarkan semakan dokumen dan maklumat yang dikemukakan, aktiviti ini disokong untuk diluluskan. Aktiviti memenuhi semua kriteria yang ditetapkan.",
  },
  ketuaJPPA: {
    approvedBy: "Ahmad bin Ismail",
    approvedAt: "20/05/2024, 14:30",
    isApproved: true,
    comments: "Aktiviti mesyuarat/program telah disemak dengan teliti dan memenuhi semua kriteria kelayakan. Dokumen sokongan lengkap dan sah. Amaun elaun adalah munasabah dan dalam had yang dibenarkan. Aktiviti ini diluluskan.",
  },
});

// Mock Penolong Amil data
const penolongAmil = ref([
  {
    id: 'PA001',
    name: 'Ahmad bin Abdullah',
    role: 'Pengerusi',
    allowance: '50.00',
  },
  {
    id: 'PA002',
    name: 'Siti Aminah binti Hassan',
    role: 'Setiausaha',
    allowance: '40.00',
  },
  {
    id: 'PA003',
    name: 'Mohd Razak bin Ibrahim',
    role: 'Ahli Jawatankuasa',
    allowance: '30.00',
  },
  {
    id: 'PA004',
    name: 'Nurul Aisyah binti Omar',
    role: 'Ahli Jawatankuasa',
    allowance: '30.00',
  },
  {
    id: 'PA005',
    name: 'Ali bin Hassan',
    role: 'Ahli Jawatankuasa',
    allowance: '30.00',
  }
]);

// Computed properties
const totalAllowance = computed(() => {
  return penolongAmil.value
    .reduce((sum, pa) => sum + parseFloat(pa.allowance.replace(/,/g, '')), 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
});
</script>

<style scoped>
/* Add any additional styles here */
</style> 