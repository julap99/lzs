<!-- 
  RTMF SCREEN: PA-PE-AB2-07
  PURPOSE: Semakan Semula Elaun Yang Ditolak
  DESCRIPTION: Review and resubmission of rejected allowance applications
  ROUTE: /BF-PA/PE/AB2/07
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Semakan Semula Elaun Yang Ditolak
          </h2>
          <rs-badge
            v-if="application.status"
            :variant="getStatusVariant(application.status)"
          >
            {{ application.status }}
          </rs-badge>
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
                  <p class="text-sm text-gray-500">No. Rujukan</p>
                  <p class="font-medium">{{ application.referenceNo }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Nama Aktiviti</p>
                  <p class="font-medium">{{ application.activityName }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Jenis Aktiviti</p>
                  <p class="font-medium">{{ getActivityTypeLabel(application.activityType) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Tarikh Aktiviti</p>
                  <p class="font-medium">{{ application.activityDate }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Lokasi</p>
                  <p class="font-medium">{{ application.location }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Status</p>
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="getStatusClass(application.status)"
                  >
                    {{ application.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Maklumat Pengiraan Elaun -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">Maklumat Pengiraan Elaun</h3>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">Lokasi Kariah</p>
                  <p class="font-medium">{{ application.kariahLocation }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Tarikh Tugasan Tamat</p>
                  <p class="font-medium">{{ application.assignmentEndDate }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Jenis Tugasan</p>
                  <p class="font-medium">{{ getAssignmentTypeLabel(application.assignmentType) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Jumlah Penolong Amil</p>
                  <p class="font-medium">{{ application.totalPenolongAmil }} orang</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Tables Section -->
          <div class="mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Senarai Penolong Amil -->
              <div>
                <h3 class="text-lg font-semibold mb-4">Senarai Penolong Amil</h3>
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
                            Total Elaun
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
                          <td class="px-6 py-4 whitespace-nowrap font-medium text-blue-600">
                            RM {{ pa.totalAllowance }}
                          </td>
                        </tr>
                      </tbody>
                      <tfoot class="bg-white">
                        <tr>
                          <td colspan="2" class="px-6 py-4 text-right font-medium">
                            Jumlah Keseluruhan:
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

              <!-- Senarai Aktiviti -->
              <div>
                <h3 class="text-lg font-semibold mb-4">Senarai Aktiviti</h3>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-white">
                        <tr>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Aktiviti
                          </th>
                          <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Kadar Elaun
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="activity in activities" :key="activity.id">
                          <td class="px-6 py-4 whitespace-nowrap">
                            {{ activity.name }}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-center text-blue-600">
                            RM {{ activity.allowanceRate }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Rejection Details -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">Maklumat Penolakan</h3>
            <div class="bg-red-50 p-4 rounded-lg border border-red-200">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-red-600 font-medium">Ditolak Oleh:</p>
                  <p class="font-medium">{{ application.rejectedBy }}</p>
                </div>
                <div>
                  <p class="text-sm text-red-600 font-medium">Tarikh Penolakan:</p>
                  <p class="font-medium">{{ application.rejectionDate }}</p>
                </div>
                <div class="md:col-span-2">
                  <p class="text-sm text-red-600 font-medium">Sebab Penolakan:</p>
                  <p class="font-medium mt-1">{{ application.rejectionReason }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Approval History -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">Sejarah Kelulusan</h3>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="space-y-3">
                <div class="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div class="flex items-center space-x-3">
                    <rs-badge variant="success" size="sm">JPPA</rs-badge>
                    <span class="text-sm font-medium">Sokongan JPPA</span>
                  </div>
                  <div class="text-right">
                    <p class="text-sm text-gray-600">{{ application.jppaApprovalDate }}</p>
                    <p class="text-xs text-gray-500">oleh {{ application.jppaApprover }}</p>
                  </div>
                </div>
                <div class="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div class="flex items-center space-x-3">
                    <rs-badge variant="warning" size="sm">Ketua Jabatan</rs-badge>
                    <span class="text-sm font-medium">Kelulusan Ketua Jabatan</span>
                  </div>
                  <div class="text-right">
                    <p class="text-sm text-gray-600">{{ application.ketuaJabatanApprovalDate }}</p>
                    <p class="text-xs text-gray-500">oleh {{ application.ketuaJabatanApprover }}</p>
                  </div>
                </div>
                <div class="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div class="flex items-center space-x-3">
                    <rs-badge variant="danger" size="sm">Ketua Divisyen</rs-badge>
                    <span class="text-sm font-medium text-red-700">Ditolak oleh Ketua Divisyen</span>
                  </div>
                  <div class="text-right">
                    <p class="text-sm text-red-600">{{ application.rejectionDate }}</p>
                    <p class="text-xs text-red-500">oleh {{ application.rejectedBy }}</p>
                  </div>
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
              <!-- JPPA Review -->
              <div class="flex items-start justify-between p-4">
                <div class="flex items-start">
                  <Icon name="ph:thumbs-up" class="w-5 h-5 mr-3 text-gray-500 mt-1" />
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="font-semibold text-gray-900">JPPA</h4>
                      <rs-badge variant="success">Selesai</rs-badge>
                    </div>
                    <p class="text-sm text-gray-700 mb-2">Sokongan eksekutif</p>
                    <div class="text-xs text-gray-600 space-y-1">
                      <p><strong>Disemak oleh:</strong> {{ application.jppaApprover }} (Eksekutif)</p>
                      <p><strong>Tarikh:</strong> {{ application.jppaApprovalDate }}</p>
                      <p><strong>Catatan:</strong> Permohonan telah disemak dan disokong untuk diteruskan</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Ketua Jabatan Review -->
              <div class="flex items-start justify-between p-4">
                <div class="flex items-start">
                  <Icon name="ph:check-circle" class="w-5 h-5 mr-3 text-gray-500 mt-1" />
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="font-semibold text-gray-900">Ketua Jabatan</h4>
                      <rs-badge variant="success">Selesai</rs-badge>
                    </div>
                    <p class="text-sm text-gray-700 mb-2">Pengesahan ketua jabatan</p>
                    <div class="text-xs text-gray-600 space-y-1">
                      <p><strong>Disemak oleh:</strong> {{ application.ketuaJabatanApprover }} (Ketua Jabatan)</p>
                      <p><strong>Tarikh:</strong> {{ application.ketuaJabatanApprovalDate }}</p>
                      <p><strong>Catatan:</strong> Permohonan telah disemak dan diluluskan untuk diteruskan ke peringkat seterusnya</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Ketua Divisyen Review (Rejected) -->
              <div class="flex items-start justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div class="flex items-start">
                  <Icon name="ph:x-circle" class="w-5 h-5 mr-3 text-red-500 mt-1" />
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="font-semibold text-red-700">Ketua Divisyen</h4>
                      <rs-badge variant="danger">Ditolak</rs-badge>
                    </div>
                    <p class="text-sm text-red-700 mb-2">Pengesahan ketua divisyen</p>
                    <div class="text-xs text-red-600 space-y-1">
                      <p><strong>Disemak oleh:</strong> {{ application.rejectedBy }} (Ketua Divisyen)</p>
                      <p><strong>Tarikh:</strong> {{ application.rejectionDate }}</p>
                      <p><strong>Catatan:</strong> {{ application.rejectionReason || 'Permohonan ditolak kerana tidak memenuhi kriteria yang ditetapkan' }}</p>
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
              @click="navigateTo('/BF-PA/PE/AB2')"
            >
              Kembali
            </rs-button>
            <rs-button
              variant="secondary"
              @click="handleResubmit"
            >
              Hantar Semula
            </rs-button>
            <rs-button
              variant="primary"
              @click="handleEdit"
            >
              Kemaskini & Hantar Semula
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'nuxt/app';
import { useToast } from 'vue-toastification';

definePageMeta({
  title: "Semakan Semula Elaun Yang Ditolak",
  description: "Review and resubmission of rejected allowance applications",
});

const route = useRoute();
const toast = useToast();

const breadcrumb = ref([
  {
    name: "Pengurusan Elaun",
    type: "link",
    path: "/BF-PA/PE",
  },
  {
    name: "Elaun Tugasan",
    type: "link",
    path: "/BF-PA/PE/AB2",
  },
  {
    name: "Semakan Semula",
    type: "current",
    path: "/BF-PA/PE/AB2/07",
  },
]);

// Mock application data
const application = ref({
  referenceNo: 'REF/2024/001',
  activityName: 'Program Khidmat Masyarakat',
  activityType: 'PROGRAM',
  activityDate: '2024-03-15',
  location: 'Masjid Al-Amin, Shah Alam',
  status: 'Ditolak',
  kariahLocation: 'Masjid Al-Amin',
  assignmentEndDate: '2024-03-20',
  assignmentType: 'KARIAH',
  totalPenolongAmil: 5,
  jppaApprovalDate: '2024-03-16',
  jppaApprover: 'Ahmad bin Abdullah',
  ketuaJabatanApprovalDate: '2024-03-17',
  ketuaJabatanApprover: 'Mohd Ali bin Hassan',
  rejectedBy: 'Datuk Dr. Ismail bin Ahmad',
  rejectionDate: '2024-03-18',
  rejectionReason: 'Dokumen sokongan tidak lengkap. Sila sediakan laporan aktiviti terperinci dan bukti kehadiran yang lengkap sebelum penghantaran semula.'
});

// Mock penolong amil data
const penolongAmil = ref([
  { id: 1, name: 'Ahmad bin Abdullah', totalAllowance: 500.00 },
  { id: 2, name: 'Mohd Ali bin Hassan', totalAllowance: 500.00 },
  { id: 3, name: 'Siti Fatimah binti Omar', totalAllowance: 500.00 },
  { id: 4, name: 'Abdul Rahman bin Ismail', totalAllowance: 500.00 },
  { id: 5, name: 'Nurul Ain binti Ahmad', totalAllowance: 500.00 }
]);

// Mock activities data
const activities = ref([
  { id: 1, name: 'Program Khidmat Masyarakat', allowanceRate: 100.00 }
]);

// Computed properties
const totalAllowance = computed(() => {
  return penolongAmil.value.reduce((total, pa) => total + pa.totalAllowance, 0);
});

// Helper functions
const getActivityTypeLabel = (type) => {
  const types = {
    'PROGRAM': 'Program',
    'MESYUARAT': 'Mesyuarat',
    'TUGASAN': 'Tugasan'
  };
  return types[type] || type;
};

const getAssignmentTypeLabel = (type) => {
  const types = {
    'KARIAH': 'Kariah',
    'FITRAH': 'Fitrah',
    'PADI': 'Padi',
    'WAKAF': 'Wakaf'
  };
  return types[type] || type;
};

const getStatusClass = (status) => {
  switch (status) {
    case 'Ditolak':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
};

const getStatusVariant = (status) => {
  switch (status) {
    case 'Ditolak':
      return 'danger'
    default:
      return 'secondary'
  }
};

// Action handlers
const handleResubmit = () => {
  toast.info('Fungsi hantar semula akan diimplementasikan');
  // Navigate back to the main list or edit screen
  navigateTo('/BF-PA/PE/AB2');
};

const handleEdit = () => {
  toast.info('Fungsi kemaskini akan diimplementasikan');
  // Navigate to edit screen
  navigateTo('/BF-PA/PE/AB2/01');
};

// Load data on mount
onMounted(() => {
  // Load application data based on route params if needed
  console.log('Loading rejection review screen');
});
</script>

<style scoped>
/* Add any additional styles here */
</style> 