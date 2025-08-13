<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Semakan dan Sokongan (JPPA)
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

          <!-- Penilaian JPPA -->
          <div class="mb-6">
            <FormKit
              type="form"
              id="reviewForm"
              @submit="handleSubmit"
              :actions="false"
            >
              <div class="mb-6">
                <h3 class="font-medium mb-3">Penilaian JPPA</h3>

                <div class="mt-4">
                  <FormKit
                    type="checkbox"
                    name="confirmationCheck"
                    label="Saya mengesahkan bahawa semua maklumat dan dokumen telah disemak dan keputusan saya adalah berdasarkan penilaian yang teliti dan menyokong permohonan elaun ini"
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
              Sokong
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Success Modal for Approval -->
    <rs-modal
      v-model="showSuccessModal"
      title="Sokongan Berjaya Dihantar"
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
            Permohonan elaun penolong amil berjaya disokong dan dihantar.
          </p>
          <p class="text-gray-600">
            Status permohonan telah dikemaskini kepada "Menunggu Kelulusan Ketua JPPA".
          </p>
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
      :title="isRejecting ? 'Pengesahan Tolak' : 'Pengesahan Sokong'"
      size="md"
      position="center"
    >
      <template #body>
        <div>
          <p class="mb-4">
            {{ isRejecting 
              ? 'Adakah anda pasti untuk menolak permohonan elaun penolong amil ini?'
              : 'Adakah anda pasti untuk menyokong permohonan elaun penolong amil ini?'
            }}
          </p>
          <p class="text-gray-600 text-sm">
            {{ isRejecting 
              ? 'Selepas ditolak, permohonan ini tidak boleh dihantar semula. Notifikasi akan dihantar kepada pemohon.'
              : 'Selepas disokong, permohonan akan dihantar kepada Ketua JPPA untuk kelulusan.'
            }}
          </p>
          <div class="mt-4">
            <FormKit
              type="textarea"
              name="remarks"
              :label="isRejecting ? 'Sebab Penolakan (Pilihan)' : 'Ulasan / Justifikasi (Pilihan)'"
              :placeholder="isRejecting ? 'Masukkan sebab penolakan permohonan (jika ada)' : 'Masukkan ulasan dan justifikasi sokongan (jika ada)'"
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
            {{ isRejecting ? 'Tolak' : 'Sokong' }}
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

definePageMeta({
  title: "Semakan dan Sokongan",
  description: "Semakan dan sokongan permohonan bantuan asnaf",
});

const breadcrumb = ref([
  {
    name: "Bancian/Asnaf",
    type: "link",
    path: "/BF-PA/PE/AB/Paparan_JPPA",
  },
  {
    name: "Semakan dan Sokongan",
    type: "current",
    path: "/BF-PA/PE/AB/02",
  },
]);

// Mock application data
const application = ref({
  referenceNo: "ASN-2024-001",
  asnafName: "Ahmad bin Abdullah",
  kariahName: "Masjid Wilayah Persekutuan",
  bantuanType: "KEWANGAN",
  applicationDate: "01-03-2024",
  status: "Menunggu Sokongan JPPA",
  paId: "PA-2024-001",
  paName: "Mohd Razak bin Ibrahim",
  kariahLocation: "Masjid Wilayah Persekutuan",
  assignmentEndDate: "31-12-2024",
  assignmentType: "KARIAH",
  allowanceRate: "280.00",
  calculatedAllowance: "280.00",
  isEligible: true,
});

// Mock Penolong Amil data
const penolongAmil = ref([
  {
    id: 'PA001',
    name: 'Ahmad bin Abdullah',
    totalAllowance: '70.00',
  },
  {
    id: 'PA002',
    name: 'Siti Aminah binti Hassan',
    totalAllowance: '50.00',
  },
  {
    id: 'PA003',
    name: 'Mohd Razak bin Ibrahim',
    totalAllowance: '40.00',
  },
  {
    id: 'PA004',
    name: 'Nurul Aisyah binti Omar',
    totalAllowance: '50.00',
  },
  {
    id: 'PA005',
    name: 'Ali bin Hassan',
    totalAllowance: '70.00',
  }
]);

// Mock activities data
const activities = ref([
  {
    id: 'B001',
    name: 'Bancian Baru',
    allowanceRate: '30.00',
  },
  {
    id: 'AR001',
    name: 'Asnaf Review',
    allowanceRate: '20.00',
  },
  {
    id: 'PB001',
    name: 'Permohonan Bantuan',
    allowanceRate: '20.00',
  },
  {
    id: 'B002',
    name: 'Bancian Baru',
    allowanceRate: '30.00',
  },
  {
    id: 'AR002',
    name: 'Asnaf Review',
    allowanceRate: '20.00',
  }
]);

// Modal states
const showSuccessModal = ref(false);
const showRejectSuccessModal = ref(false);
const showConfirmModal = ref(false);
const isRejecting = ref(false);
const remarks = ref('');

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

const getAssignmentTypeLabel = (value) => {
  const types = {
    FITRAH: "Fitrah",
    PADI: "Padi",
    KARIAH: "Kariah",
    KOMUNITI: "Komuniti",
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

// Computed properties
const totalAllowance = computed(() => {
  return activities.value
    .reduce((sum, activity) => sum + parseFloat(activity.allowanceRate), 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
  navigateTo('/BF-PA/PE/AB/Paparan_JPPA');
};

const handleModalClose = () => {
  showSuccessModal.value = false;
  navigateTo('/BF-PA/PE/AB/Paparan_JPPA');
};

const handleRejectModalClose = () => {
  showRejectSuccessModal.value = false;
  navigateTo('/BF-PA/PE/AB/Paparan_JPPA');
};

const confirmSubmission = async () => {
  try {
    // Mock API call
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
  }
};
</script>

<style scoped>
/* Add any additional styles here */
</style> 