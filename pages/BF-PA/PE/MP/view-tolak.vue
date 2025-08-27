<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Maklumat Aktiviti Mesyuarat/Program (Ditolak)
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
                  <span class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                    Ditolak
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

                           <!-- Maklumat Sokongan Eksekutif -->
          <div class="mb-6">
                   <h3 class="text-lg font-semibold mb-4">Maklumat Sokongan Eksekutif</h3>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">Disokong Oleh</p>
                         <p class="font-medium">{{ activity.eksekutifSupport.reviewedBy }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Tarikh Sokongan</p>
                         <p class="font-medium">{{ activity.eksekutifSupport.reviewedAt }}</p>
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
                         <p class="font-medium">{{ activity.eksekutifSupport.comments }}</p>
                </div>
              </div>
            </div>
          </div>

                 <!-- Maklumat Penolakan Ketua Jabatan -->
          <div class="mb-6">
                   <h3 class="text-lg font-semibold mb-4">Maklumat Penolakan Ketua Jabatan</h3>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">Ditolak Oleh</p>
                         <p class="font-medium">{{ activity.ketuaJabatan.rejectedBy }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Tarikh Penolakan</p>
                         <p class="font-medium">{{ activity.ketuaJabatan.rejectedAt }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Status</p>
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800"
                  >
                    Ditolak
                  </span>
                </div>
                <div class="md:col-span-2">
                  <p class="text-sm text-gray-500">Sebab Penolakan</p>
                         <p class="font-medium">{{ activity.ketuaJabatan.rejectionReason }}</p>
                </div>
                <div class="md:col-span-2">
                  <p class="text-sm text-gray-500">Catatan Penolakan</p>
                         <p class="font-medium">{{ activity.ketuaJabatan.comments }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Review History -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Sejarah Semakan
            </h3>
            
            <div class="space-y-4">
              <!-- Eksekutif Review -->
              <div class="flex items-start justify-between p-4">
                <div class="flex items-start">
                  <Icon name="ph:thumbs-up" class="w-5 h-5 mr-3 text-gray-500 mt-1" />
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="font-semibold text-gray-900">Eksekutif</h4>
                      <rs-badge variant="success">Selesai</rs-badge>
                    </div>
                    <p class="text-sm text-gray-700 mb-2">Sokongan eksekutif</p>
                    <div class="text-xs text-gray-600 space-y-1">
                      <p><strong>Disemak oleh:</strong> {{ activity.eksekutifSupport.reviewedBy }} (Eksekutif)</p>
                      <p><strong>Tarikh:</strong> {{ activity.eksekutifSupport.reviewedAt }}</p>
                      <p><strong>Catatan:</strong> {{ activity.eksekutifSupport.comments }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Ketua Jabatan Review (Rejected) -->
              <div class="flex items-start justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div class="flex items-start">
                  <Icon name="ph:x-circle" class="w-5 h-5 mr-3 text-red-500 mt-1" />
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="font-semibold text-red-700">Ketua Jabatan</h4>
                      <rs-badge variant="danger">Ditolak</rs-badge>
                    </div>
                    <p class="text-sm text-red-700 mb-2">Pengesahan ketua jabatan</p>
                    <div class="text-xs text-red-600 space-y-1">
                      <p><strong>Disemak oleh:</strong> {{ activity.ketuaJabatan.rejectedBy }} (Ketua Jabatan)</p>
                      <p><strong>Tarikh:</strong> {{ activity.ketuaJabatan.rejectedAt }}</p>
                      <p><strong>Catatan:</strong> {{ activity.ketuaJabatan.comments }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Ketua Divisyen Review (Not Reached) -->
              <div class="flex items-start justify-between p-4">
                <div class="flex items-start">
                  <Icon name="ph:circle" class="w-5 h-5 mr-3 text-gray-500 mt-1" />
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="font-semibold text-gray-900">Ketua Divisyen</h4>
                      <rs-badge variant="secondary">Belum Dimulakan</rs-badge>
                    </div>
                    <p class="text-sm text-gray-700 mb-2">Pengesahan ketua divisyen</p>
                    <div class="text-xs text-gray-600 space-y-1">
                      <p><strong>Disemak oleh:</strong> -</p>
                      <p><strong>Tarikh:</strong> -</p>
                      <p><strong>Catatan:</strong> Belum dicapai</p>
                    </div>
                  </div>
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
  title: "Maklumat Aktiviti Mesyuarat/Program (Ditolak)",
  description: "Maklumat aktiviti mesyuarat dan program yang telah ditolak",
});

const route = useRoute();

const breadcrumb = ref([
  {
    name: "Mesyuarat/Program",
    type: "link",
    path: "/BF-PA/PE/MP",
  },
  {
    name: "Maklumat Aktiviti (Ditolak)",
    type: "current",
    path: "/BF-PA/PE/MP/view-tolak",
  },
]);

// Get activity ID from query parameter
const activityId = computed(() => route.query.id || 'MP2024-012');

// Mock activity data
const activity = ref({
  id: 'MP2024-012',
  name: 'Mesyuarat Perancangan Q2',
      date: '05-04-2024',
  location: 'Bilik Mesyuarat',
  type: 'Mesyuarat',
  status: 'Ditolak',
  eksekutifSupport: {
    reviewedBy: "Sarah binti Hamid",
            reviewedAt: "18-05-2024, 11:20",
    isSupported: true,
    comments: "Berdasarkan semakan dokumen dan maklumat yang dikemukakan, aktiviti ini disokong untuk diluluskan. Aktiviti memenuhi semua kriteria yang ditetapkan.",
  },
  ketuaJabatan: {
    rejectedBy: "Ahmad bin Ismail",
            rejectedAt: "22-05-2024, 16:15",
    isRejected: true,
    rejectionReason: "Dokumen sokongan tidak lengkap dan tidak memenuhi kriteria kelayakan yang ditetapkan.",
    comments: "Aktiviti mesyuarat/program telah disemak dengan teliti. Dokumen sokongan yang dikemukakan tidak lengkap dan tidak memenuhi kriteria kelayakan yang ditetapkan. Amaun elaun yang dipohon melebihi had yang dibenarkan. Aktiviti ini ditolak.",
  },
});

// Mock Penolong Amil data
const penolongAmil = ref([
  {
    id: 'PA025',
    name: 'Kamariah binti Omar',
    role: 'Pengerusi',
    allowance: '45.00',
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