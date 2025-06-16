<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Semakan dan Kelulusan
          </h2>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <!-- Maklumat Asnaf -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">Maklumat Aktiviti</h3>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">No. Rujukan</p>
                  <p class="font-medium">{{ application.referenceNo }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Nama Asnaf</p>
                  <p class="font-medium">{{ application.asnafName }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Kariah</p>
                  <p class="font-medium">{{ application.kariahName }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Jenis Bantuan</p>
                  <p class="font-medium">{{ getBantuanTypeLabel(application.bantuanType) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Tarikh Mohon</p>
                  <p class="font-medium">{{ application.applicationDate }}</p>
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
                  <p class="text-sm text-gray-500">ID Penolong Amil</p>
                  <p class="font-medium">{{ application.paId }}</p>
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
                  <p class="text-sm text-gray-500">Jenis Tugasan</p>
                  <p class="font-medium">{{ getAssignmentTypeLabel(application.assignmentType) }}</p>
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
                          <td class="px-6 py-4 whitespace-nowrap">
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
                            No.
                          </th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nama Aktiviti
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="(activity, index) in activities" :key="activity.id">
                          <td class="px-6 py-4 whitespace-nowrap">
                            {{ index + 1 }}
                          </td>
                          <td class="px-6 py-4">
                            {{ activity.name }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
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
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="application.jppaSupport.isSupported ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  >
                    {{ application.jppaSupport.isSupported ? 'Disokong' : 'Tidak Disokong' }}
                  </span>
                </div>
                <div class="md:col-span-2">
                  <p class="text-sm text-gray-500">Catatan</p>
                  <p class="font-medium">{{ application.jppaSupport.comments }}</p>
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
                    label="Saya mengesahkan bahawa semua maklumat dan dokumen telah disemak dan keputusan saya adalah berdasarkan penilaian yang teliti dan meluluskan permohonan elaun ini"
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
              @click="navigateTo('/BF-PA/PE/AB')"
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
              Lulus
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Approve Confirmation Modal -->
    <rs-modal
      v-model="showApproveModal"
      title="Sahkan Kelulusan"
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
            @click="navigateTo('/BF-PA/PE/AB')"
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
  title: "Semakan dan Kelulusan",
  description: "Semakan dan kelulusan permohonan bantuan asnaf",
});

const breadcrumb = ref([
  {
    name: "Bancian/Asnaf",
    type: "link",
    path: "/BF-PA/PE/AB",
  },
  {
    name: "Semakan dan Kelulusan",
    type: "current",
    path: "/BF-PA/PE/AB/03",
  },
]);

// Mock application data
const application = ref({
  referenceNo: "ASN-2024-001",
  asnafName: "Ahmad bin Abdullah",
  kariahName: "Masjid Wilayah Persekutuan",
  bantuanType: "KEWANGAN",
  applicationDate: "01/03/2024",
  status: "Menunggu Kelulusan Ketua JPPA",
  paId: "PA-2024-001",
  kariahLocation: "Masjid Wilayah Persekutuan",
  assignmentEndDate: "31/12/2024",
  assignmentType: "FITRAH",
  jppaSupport: {
    reviewedBy: "Sarah binti Hamid",
    reviewedAt: "15/05/2024, 10:45",
    isSupported: true,
    comments: "Berdasarkan semakan dokumen dan maklumat yang dikemukakan, permohonan ini disokong untuk diluluskan. Asnaf memenuhi semua kriteria yang ditetapkan.",
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
    name: 'Kutipan Zakat Fitrah',
  },
  {
    id: 'ACT002',
    name: 'Agihan Bantuan Asnaf',
  },
  {
    id: 'ACT003',
    name: 'Program Tazkirah',
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
    successMessage.value = "Permohonan telah berjaya diluluskan.";
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