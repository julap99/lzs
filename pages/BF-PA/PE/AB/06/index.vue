<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Semakan Semula - Eksekutif JPPA
          </h2>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <!-- Maklumat Penolong Amil -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">Maklumat Penolong Amil</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p class="text-sm text-gray-500">Nama Penolong Amil</p>
                <p class="font-medium">{{ paInfo.name }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Lokasi Kariah</p>
                <p class="font-medium">{{ paInfo.location }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Tarikh Tugasan Tamat</p>
                <p class="font-medium">{{ paInfo.endDate }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Jenis Tugasan</p>
                <p class="font-medium">{{ paInfo.assignmentType }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Payment Advice No.</p>
                <p class="font-medium">{{ paInfo.paymentAdviceNo }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Status Pembayaran</p>
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800"
                >
                  {{ paInfo.paymentStatus }}
                </span>
              </div>
              <div>
                <p class="text-sm text-gray-500">No. Akaun Pembayaran</p>
                <p class="font-medium">{{ paInfo.accountNo }}</p>
              </div>
            </div>
          </div>

          <!-- Senarai Aktiviti -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">Senarai Aktiviti</h3>
            
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No.
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarikh
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aktiviti
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Asnaf
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No. Rujukan
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Elaun
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(activity, index) in activities" :key="activity.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      {{ index + 1 }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      {{ activity.date }}
                    </td>
                    <td class="px-6 py-4">
                      {{ activity.name }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      {{ activity.asnafName }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      {{ activity.referenceNo }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      RM {{ activity.allowance }}
                    </td>
                  </tr>
                </tbody>
                <tfoot class="bg-gray-50">
                  <tr>
                    <td colspan="5" class="px-6 py-4 text-right font-medium">
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

          <!-- Form Semakan Semula -->
          <div class="mb-6">
            <FormKit
              type="form"
              id="reviewForm"
              @submit="handleSubmit"
              :actions="false"
            >
              <div class="mb-6">
                <h3 class="text-lg font-semibold mb-4">Semakan Semula</h3>
                
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div class="flex items-start space-x-3">
                    <Icon name="ph:warning" class="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 class="font-medium text-yellow-900">
                        Maklumat Penting
                      </h4>
                      <p class="text-sm text-yellow-700 mt-1">
                        Status pembayaran telah ditolak. Sila semak semula maklumat dan jana semula payment advice jika diperlukan.
                      </p>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="md:col-span-2">
                    <FormKit
                      type="checkbox"
                      name="confirmationCheck"
                      label="Saya mengesahkan bahawa semua maklumat telah disemak semula dan keputusan saya adalah berdasarkan penilaian yang teliti"
                      validation="accepted"
                      :validation-messages="{
                        accepted: 'Sila buat pengesahan sebelum hantar',
                      }"
                    />
                  </div>
                </div>
              </div>
            </FormKit>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-4 mt-6">
            <rs-button
              variant="primary-outline"
              @click="handleBack"
            >
              Kembali
            </rs-button>
            <rs-button
              variant="warning"
              @click="handleRegeneratePayment"
              :disabled="processing"
              :loading="processing"
            >
              <Icon name="ph:arrow-clockwise" class="w-5 h-5 mr-2" />
              Jana Semula Payment Advice
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Success Modal -->
    <rs-modal
      v-model="showSuccessModal"
      title="Penjanaan Semula Berjaya"
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
            Penjanaan semula payment advice telah berjaya dijana.
          </p>
          <p class="text-gray-600">
            Status pembayaran telah dikemaskini dan sedia untuk diproses semula.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center">
          <rs-button variant="primary" @click="handleSuccessModalClose">
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
  title: "Semakan Semula - Eksekutif JPPA",
  description: "Semakan semula pembayaran yang ditolak",
});

const breadcrumb = ref([
  {
    name: "Bancian/Asnaf",
    type: "link",
    path: "/BF-PA/PE/AB",
  },
  {
    name: "Semakan Semula",
    type: "current",
    path: "/BF-PA/PE/AB/06",
  },
]);

// State variables
const processing = ref(false);
const showSuccessModal = ref(false);

// Mock PA data
const paInfo = ref({
  id: 'PA001',
  name: 'Ahmad bin Abdullah',
  location: 'Masjid Al-Hidayah',
  endDate: '31-12-2024',
  assignmentType: 'Kariah',
  status: 'Disokong',
  paymentStatus: 'Telah Ditolak',
  paymentAdviceNo: 'PA-2024-001',
  accountNo: '1234567890',
});

// Mock activities data
const activities = ref([
  {
    id: 'B001',
    date: '01-03-2024',
    name: 'Bancian Baru',
    asnafName: 'Abdul Rahman bin Mohamed',
    referenceNo: 'ASN-2024-001',
    status: 'Selesai',
    allowance: '30.00',
  },
  {
    id: 'AR001',
    date: '02-03-2024',
    name: 'Asnaf Review',
    asnafName: 'Fatimah binti Omar',
    referenceNo: 'ASN-2024-002',
    status: 'Dalam Proses',
    allowance: '20.00',
  },
  {
    id: 'PB001',
    date: '03-03-2024',
    name: 'Permohonan Bantuan',
    asnafName: 'Hassan bin Ismail',
    referenceNo: 'ASN-2024-003',
    status: 'Belum Bermula',
    allowance: '20.00',
  },
  {
    id: 'B002',
    date: '04-03-2024',
    name: 'Bancian Baru',
    asnafName: 'Zainab binti Abdullah',
    referenceNo: 'ASN-2024-004',
    status: 'Selesai',
    allowance: '30.00',
  },
  {
    id: 'AR002',
    date: '05-03-2024',
    name: 'Asnaf Review',
    asnafName: 'Mohamed bin Yusof',
    referenceNo: 'ASN-2024-005',
    status: 'Dalam Proses',
    allowance: '20.00',
  }
]);

// Form options
const reviewStatusOptions = [
  { label: 'Lulus Semula', value: 'LULUS_SEMULA' },
  { label: 'Perlu Penambahbaikan', value: 'PERLU_PENAMBAHBAIKAN' },
  { label: 'Tolak Semula', value: 'TOLAK_SEMULA' },
];

const actionTypeOptions = [
  { label: 'Jana Semula Payment Advice', value: 'JANA_SEMULA' },
  { label: 'Kemaskini Maklumat', value: 'KEMASKINI_MAKLUMAT' },
  { label: 'Hantar Semula untuk Semakan', value: 'HANTAR_SEMULA' },
];

// Computed properties
const totalAllowance = computed(() => {
  return activities.value
    .reduce((sum, activity) => sum + parseFloat(activity.allowance), 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
});

// Action handlers
const handleBack = () => {
  navigateTo('/BF-PA/PE/AB/02/PA/PA_Aktiviti');
};

const handleSubmit = async (formData) => {
  try {
    processing.value = true;
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Form submitted:', formData);
    // Handle form submission logic here
  } catch (error) {
    console.error('Error submitting form:', error);
  } finally {
    processing.value = false;
  }
};

const handleRegeneratePayment = async () => {
  try {
    processing.value = true;
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    showSuccessModal.value = true;
  } catch (error) {
    console.error('Error regenerating payment:', error);
  } finally {
    processing.value = false;
  }
};

const handleSuccessModalClose = () => {
  showSuccessModal.value = false;
  navigateTo('/BF-PA/PE/AB/02/PA');
};
</script>

<style scoped>
/* Add any additional styles here */
</style>