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
              @click="navigateTo('/BF-PA/PE/AB2')"
            >
              Kembali
            </rs-button>
            <rs-button
              variant="danger-outline"
              @click="showRejectModal = true"
            >
              Tolak
            </rs-button>
            <rs-button
              variant="primary"
              @click="showApproveModal = true"
            >
              Sokong
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Approve Confirmation Modal -->
    <rs-modal
      v-model="showApproveModal"
      title="Sahkan Sokongan"
      size="sm"
      position="center"
    >
      <template #body>
        <div class="p-4">
          <FormKit
            type="form"
            id="approveForm"
            :actions="false"
            @submit="handleApprove"
          >
            <FormKit
              type="textarea"
              name="remarks"
              label="Catatan (Jika Perlu)"
              placeholder="Masukkan catatan jika perlu"
              rows="3"
            />
          </FormKit>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-4">
          <rs-button
            variant="primary-outline"
            @click="showApproveModal = false"
          >
            Batal
          </rs-button>
          <rs-button
            variant="primary"
            :loading="isSubmitting"
            @click="handleApprove"
          >
            Sahkan
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Reject Confirmation Modal -->
    <rs-modal
      v-model="showRejectModal"
      title="Sahkan Penolakan"
      size="sm"
      position="center"
    >
      <template #body>
        <div class="p-4">
          <FormKit
            type="form"
            id="rejectForm"
            :actions="false"
            @submit="handleReject"
          >
            <FormKit
              type="textarea"
              name="remarks"
              label="Sebab Penolakan"
              placeholder="Masukkan sebab penolakan"
              validation="required"
              :validation-messages="{
                required: 'Sebab penolakan diperlukan',
              }"
              rows="3"
            />
          </FormKit>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-4">
          <rs-button
            variant="primary-outline"
            @click="showRejectModal = false"
          >
            Batal
          </rs-button>
          <rs-button
            variant="danger"
            :loading="isSubmitting"
            @click="handleReject"
          >
            Sahkan
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Success Modal -->
    <rs-modal
      v-model="showSuccessModal"
      title="Berjaya"
      size="sm"
      position="center"
    >
      <template #body>
        <div class="text-center p-4">
          <Icon
            name="heroicons:check-circle"
            class="text-green-500 mx-auto mb-4"
            size="48"
          />
          <p class="text-gray-700">
            {{ successMessage }}
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center">
          <rs-button
            variant="primary"
            @click="navigateTo('/BF-PA/PE/AB2')"
          >
            OK
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
    path: "/BF-PA/PE/AB",
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
  applicationDate: "01/03/2024",
  status: "Menunggu Sokongan JPPA",
  paId: "PA-2024-001",
  paName: "Mohd Razak bin Ibrahim",
  kariahLocation: "Masjid Wilayah Persekutuan",
  assignmentEndDate: "31/12/2024",
  assignmentType: "KARIAH",
  allowanceRate: "1,500.00",
  calculatedAllowance: "1,500.00",
  isEligible: true,
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
    name: 'Ahmad bin Abdullah',
    totalAllowance: '1,500.00',
  },
  {
    id: 'PA003',
    name: 'Ahmad bin Abdullah',
    totalAllowance: '1,500.00',
  },
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
]);

// Modal states
const showApproveModal = ref(false);
const showRejectModal = ref(false);
const showSuccessModal = ref(false);
const isSubmitting = ref(false);
const successMessage = ref('');

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
  return penolongAmil.value
    .reduce((sum, pa) => sum + parseFloat(pa.totalAllowance.replace(/,/g, '')), 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
});

// Form handlers
const handleApprove = async () => {
  isSubmitting.value = true;
  
  try {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    showApproveModal.value = false;
    successMessage.value = "Permohonan telah berjaya disokong dan dihantar kepada Ketua JPPA.";
    showSuccessModal.value = true;
  } catch (error) {
    console.error('Error approving application:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const handleReject = async () => {
  isSubmitting.value = true;
  
  try {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    showRejectModal.value = false;
    successMessage.value = "Permohonan telah ditolak.";
    showSuccessModal.value = true;
  } catch (error) {
    console.error('Error rejecting application:', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* Add any additional styles here */
</style> 