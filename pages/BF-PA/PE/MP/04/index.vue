<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Semakan dan Kelulusan (Ketua JPPA)
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
                  <p class="font-medium">{{ activity.id }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Nama Aktiviti</p>
                  <p class="font-medium">{{ activity.name }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Jenis Aktiviti</p>
                  <p class="font-medium">{{ activity.type }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Tarikh Aktiviti</p>
                  <p class="font-medium">{{ activity.date }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Lokasi</p>
                  <p class="font-medium">{{ activity.location }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Status</p>
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="getStatusClass(activity.status)"
                  >
                    {{ activity.status }}
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
                  <p class="text-sm text-gray-500">Kadar Elaun</p>
                  <p class="font-medium">RM {{ activity.allowanceRate }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Jumlah Penolong Amil</p>
                  <p class="font-medium">{{ penolongAmil.length }} orang</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Jumlah Keseluruhan</p>
                  <p class="font-medium text-blue-600">RM {{ totalAllowance }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Status Kehadiran</p>
                  <p class="font-medium">{{ attendanceStatus }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Senarai Kehadiran Penolong Amil -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">Senarai Kehadiran Penolong Amil</h3>
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
                        Status Kehadiran
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
                        <span
                          class="px-2 py-1 text-xs font-medium rounded-full"
                          :class="pa.statusKehadiran === 'Hadir' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                        >
                          {{ pa.statusKehadiran }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        RM {{ pa.allowance }}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot class="bg-white">
                    <tr>
                      <td colspan="3" class="px-6 py-4 text-right font-medium">
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
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="activity.jppaSupport.isSupported ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  >
                    {{ activity.jppaSupport.isSupported ? 'Disokong' : 'Tidak Disokong' }}
                  </span>
                </div>
                <div class="md:col-span-2">
                  <p class="text-sm text-gray-500">Catatan</p>
                  <p class="font-medium">{{ activity.jppaSupport.comments }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Penilaian Ketua JPPA -->
          <div class="mb-6">
            <FormKit
              type="form"
              id="reviewForm"
              @submit="handleSubmit"
              :actions="false"
            >
              <div class="mb-6">
                <h3 class="font-medium mb-3">Penilaian Ketua JPPA</h3>

                <div class="mt-4">
                  <FormKit
                    type="checkbox"
                    name="confirmationCheck"
                    label="Saya mengesahkan bahawa semua maklumat kehadiran dan elaun telah disemak dan keputusan saya adalah berdasarkan penilaian yang teliti dan meluluskan permohonan elaun ini"
                    validation="accepted"
                    :validation-messages="{
                      accepted: 'Sila buat pengesahan sebelum hantar',
                    }"
                  />
                </div>
              </div>
            </FormKit>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-4 mt-6">
            <rs-button
              variant="primary-outline"
              @click="goBack"
            >
              Kembali
            </rs-button>
            <rs-button
              variant="danger-outline"
              @click="handleReject"
            >
              Tolak
            </rs-button>
            <rs-button
              variant="primary"
              @click="handleApprove"
            >
              Lulus
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Success Modal for Approval -->
    <rs-modal
      v-model="showSuccessModal"
      title="Kelulusan Berjaya"
      size="md"
      position="center"
    >
      <template #body>
        <div class="text-center">
          <div class="flex justify-center mb-4">
            <Icon
              name="material-symbols:check-circle"
              class="text-green-500"
              size="48"
            />
          </div>
          <p class="mb-2">
            Permohonan elaun penolong amil berjaya diluluskan.
          </p>
          <p class="text-gray-600 mb-4">
            Status permohonan telah dikemaskini kepada "Diluluskan".
          </p>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-start space-x-3">
              <Icon name="ph:info" class="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 class="font-medium text-blue-900">
                  Payment Advice Akan Dijana
                </h4>
                <p class="text-sm text-blue-700 mt-1">
                  Sistem akan menjana Payment Advice untuk semua penolong amil yang hadir secara automatik.
                </p>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center">
          <rs-button variant="primary" @click="handleModalClose">
            Tutup
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Payment Advice Generation Alert Modal -->
    <rs-modal
      v-model="showPaymentAdviceModal"
      title="Payment Advice Telah Dijana"
      size="lg"
      position="center"
    >
      <template #body>
        <div class="text-center">
          <div class="flex justify-center mb-4">
            <Icon
              name="heroicons:banknotes"
              class="text-green-500"
              size="48"
            />
          </div>
          <p class="mb-4 text-lg font-medium">
            Payment Advice telah berjaya dijana untuk Aktiviti <span class="text-blue-600">{{ activity.id }}</span>
          </p>
          
          <div class="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 class="font-medium mb-3">Maklumat Payment Advice:</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <p class="text-sm text-gray-500">Jumlah Penolong Amil Hadir:</p>
                <p class="font-medium">{{ attendedCount }} orang</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Jumlah Keseluruhan:</p>
                <p class="font-medium">RM {{ totalAllowance }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Status Penghantaran:</p>
                <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                  Sudah Dihantar ke SAP
                </span>
              </div>
              <div>
                <p class="text-sm text-gray-500">Tarikh Penjanaan:</p>
                <p class="font-medium">{{ new Date().toLocaleDateString('ms-MY') }}</p>
              </div>
            </div>
          </div>
          
          <p class="text-sm text-gray-600">
            Notifikasi akan dihantar kepada semua penolong amil yang hadir.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center">
          <rs-button variant="primary" @click="handlePaymentAdviceModalClose">
            Tutup
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Loading Modal for Payment Advice Generation -->
    <rs-modal
      v-model="showLoadingModal"
      title="Menjana Payment Advice"
      size="md"
      position="center"
      :closable="false"
    >
      <template #body>
        <div class="text-center p-6">
          <div class="flex justify-center mb-4">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p class="text-gray-700 mb-2">
            Sistem sedang menjana Payment Advice...
          </p>
          <p class="text-sm text-gray-600">
            Sila tunggu sebentar
          </p>
        </div>
      </template>
    </rs-modal>

    <!-- Success Modal for Rejection -->
    <rs-modal
      v-model="showRejectSuccessModal"
      title="Permohonan Ditolak"
      size="md"
      position="center"
    >
      <template #body>
        <div class="text-center">
          <div class="flex justify-center mb-4">
            <Icon
              name="material-symbols:check-circle"
              class="text-red-500"
              size="48"
            />
          </div>
          <p class="mb-2">
            Permohonan elaun penolong amil telah ditolak.
          </p>
          <p class="text-gray-600">
            Status permohonan telah dikemaskini kepada "Ditolak".
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center">
          <rs-button variant="primary" @click="handleRejectModalClose">
            Kembali ke Senarai
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showConfirmModal"
      :title="isRejecting ? 'Pengesahan Tolak' : 'Pengesahan Lulus'"
      size="md"
      position="center"
    >
      <template #body>
        <div>
          <p class="mb-4">
            {{ isRejecting 
              ? 'Adakah anda pasti untuk menolak permohonan elaun penolong amil ini?'
              : 'Adakah anda pasti untuk meluluskan permohonan elaun penolong amil ini?'
            }}
          </p>
          <p class="text-gray-600 text-sm">
            {{ isRejecting 
              ? 'Selepas ditolak, permohonan ini akan dihantar semula kepada Eksekutif JPPA untuk semakan semula.'
              : 'Selepas diluluskan, sistem akan menjana Payment Advice secara automatik untuk semua penolong amil yang hadir.'
            }}
          </p>
          <div class="mt-4">
            <FormKit
              type="textarea"
              name="remarks"
              :label="isRejecting ? 'Sebab Penolakan (Pilihan)' : 'Ulasan / Justifikasi (Pilihan)'"
              :placeholder="isRejecting ? 'Masukkan sebab penolakan permohonan (jika ada)' : 'Masukkan ulasan dan justifikasi kelulusan (jika ada)'"
              rows="3"
              v-model="remarks"
            />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-3">
          <rs-button variant="outline" @click="showConfirmModal = false">
            Batal
          </rs-button>
          <rs-button 
            :variant="isRejecting ? 'danger' : 'primary'" 
            @click="confirmSubmission"
          >
            {{ isRejecting ? 'Tolak' : 'Lulus' }}
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

definePageMeta({
  title: "Semakan dan Kelulusan - Mesyuarat/Program",
  description: "Semakan dan kelulusan elaun penolong amil untuk mesyuarat/program",
});

const breadcrumb = ref([
  {
    name: "Pengurusan Elaun",
    type: "link",
    path: "/BF-PA/PE/MP",
  },
  {
    name: "Semakan dan Kelulusan",
    type: "current",
    path: "/BF-PA/PE/MP/04",
  },
]);

// Mock activity data
const activity = ref({
  id: 'MP001',
  name: 'Latihan Pengurusan Zakat',
  type: 'Latihan',
  date: '25/03/2024',
  location: 'Dewan Latihan',
  status: 'Menunggu Kelulusan Ketua JPPA',
  allowanceRate: '100.00',
  jppaSupport: {
    reviewedBy: "Sarah binti Hamid",
    reviewedAt: "15/05/2024, 10:45",
    isSupported: true,
    comments: "Berdasarkan semakan kehadiran dan maklumat yang dikemukakan, permohonan ini disokong untuk diluluskan. Semua penolong amil yang hadir layak menerima elaun.",
  },
});

// Mock Penolong Amil data
const penolongAmil = ref([
  {
    id: 'PA001',
    name: 'Ahmad bin Abdullah',
    statusKehadiran: 'Hadir',
    allowance: '100.00',
  },
  {
    id: 'PA002',
    name: 'Siti Aminah binti Hassan',
    statusKehadiran: 'Hadir',
    allowance: '100.00',
  },
  {
    id: 'PA003',
    name: 'Mohd Razak bin Ibrahim',
    statusKehadiran: 'Tidak Hadir',
    allowance: '0.00',
  },
  {
    id: 'PA004',
    name: 'Nurul Aisyah binti Omar',
    statusKehadiran: 'Hadir',
    allowance: '100.00',
  },
  {
    id: 'PA005',
    name: 'Ali bin Hassan',
    statusKehadiran: 'Hadir',
    allowance: '100.00',
  }
]);

// Modal states
const showSuccessModal = ref(false);
const showRejectSuccessModal = ref(false);
const showConfirmModal = ref(false);
const showPaymentAdviceModal = ref(false);
const isRejecting = ref(false);
const remarks = ref('');
const showLoadingModal = ref(false);

// Helper functions
const getStatusClass = (status) => {
  const statusClasses = {
    "Menunggu Sokongan JPPA": "bg-yellow-100 text-yellow-800",
    "Menunggu Kelulusan Ketua JPPA": "bg-purple-100 text-purple-800",
    "Diluluskan": "bg-green-100 text-green-800",
    "Ditolak": "bg-red-100 text-red-800",
  };
  return statusClasses[status] || "bg-gray-100 text-gray-800";
};

// Computed properties
const totalAllowance = computed(() => {
  return penolongAmil.value
    .reduce((sum, pa) => sum + parseFloat(pa.allowance), 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
});

const attendedCount = computed(() => {
  return penolongAmil.value.filter(pa => pa.statusKehadiran === 'Hadir').length;
});

const attendanceStatus = computed(() => {
  const attended = attendedCount.value;
  const total = penolongAmil.value.length;
  return `${attended}/${total} hadir`;
});

// Form handlers
const handleApprove = () => {
  isRejecting.value = false;
  showConfirmModal.value = true;
};

const handleReject = () => {
  isRejecting.value = true;
  showConfirmModal.value = true;
};

const goBack = () => {
  navigateTo('/BF-PA/PE/MP/Paparan_Ketua_JPPA');
};

const handleModalClose = () => {
  showSuccessModal.value = false;
  // Show loading modal to simulate system processing
  showLoadingModal.value = true;
  
  // Simulate payment advice generation process
  setTimeout(() => {
    showLoadingModal.value = false;
    showPaymentAdviceModal.value = true;
  }, 2000); // 2 seconds loading time
};

const handlePaymentAdviceModalClose = () => {
  showPaymentAdviceModal.value = false;
  navigateTo('/BF-PA/PE/MP/Paparan_Ketua_JPPA');
};

const handleRejectModalClose = () => {
  showRejectSuccessModal.value = false;
  navigateTo('/BF-PA/PE/MP/Paparan_Ketua_JPPA'); // Go to re-review screen
};

const confirmSubmission = async () => {
  try {
    // Mock API call
    showLoadingModal.value = true;
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    showConfirmModal.value = false;
    remarks.value = '';
    
    if (isRejecting.value) {
      showRejectSuccessModal.value = true;
    } else {
      showSuccessModal.value = true;
    }
  } catch (error) {
    console.error('Error processing submission:', error);
  } finally {
    showLoadingModal.value = false;
  }
};
</script>

<style scoped>
/* Add any additional styles here */
</style>
