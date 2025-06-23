<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <rs-card class="mt-4">
          <template #header>
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold">
                Maklumat Aktiviti Penolong Amil
              </h2>
            </div>
          </template>

          <template #body>
            <div class="p-4">
              <!-- Penolong Amil Information -->
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
                      class="px-2 py-1 text-xs font-medium rounded-full"
                      :class="getPaymentStatusClass(paInfo.paymentStatus)"
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

              <!-- Activities List -->
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
            </div>
          </template>
        </rs-card>
      </div>

      <!-- Sidebar - Action Panel -->
      <div class="lg:col-span-1 space-y-6">
        <rs-card class="shadow-sm border-0 bg-white sticky top-6">
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Icon name="ph:gear" class="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">Tindakan</h2>
                <p class="text-sm text-gray-500">Pilih tindakan yang sesuai</p>
              </div>
            </div>
          </template>

          <template #body>
            <div class="space-y-4">
              <!-- Status Info -->
              <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div class="flex items-center space-x-2">
                  <Icon name="ph:info" class="w-5 h-5 text-blue-600" />
                  <span class="font-medium text-blue-800">Status Pembayaran</span>
                </div>
                <p class="text-sm text-blue-700 mt-1">
                  {{ paInfo.paymentStatus }}
                </p>
              </div>

              <!-- Action Buttons -->
              <div class="space-y-3 pt-4 border-t">
                <!-- Show only Kembali button if payment is completed -->
                <template v-if="paInfo.paymentStatus === 'Telah Dibayar'">
                  <rs-button
                    variant="primary-outline"
                    @click="handleBack"
                    class="w-full !py-3 text-sm font-medium"
                  >
                    <Icon name="ph:arrow-left" class="w-5 h-5 mr-2" />
                    Kembali
                  </rs-button>
                </template>

                <!-- Show Pay button if payment is pending -->
                <template v-else-if="paInfo.paymentStatus === 'Belum Dibayar'">
                  <rs-button
                    variant="success"
                    @click="handlePay"
                    :disabled="processing"
                    :loading="processing"
                    class="w-full !py-3 text-sm font-medium"
                  >
                    <Icon name="ph:money" class="w-5 h-5 mr-2" />
                    Bayar
                  </rs-button>

                  <rs-button
                    variant="primary-outline"
                    @click="handleBack"
                    class="w-full !py-3 text-sm font-medium"
                  >
                    <Icon name="ph:arrow-left" class="w-5 h-5 mr-2" />
                    Kembali
                  </rs-button>
                </template>

                <!-- Show Semakan Semula button if payment is rejected -->
                <template v-else-if="paInfo.paymentStatus === 'Telah Ditolak'">
                  <rs-button
                    variant="warning"
                    @click="handleReview"
                    :disabled="processing"
                    :loading="processing"
                    class="w-full !py-3 text-sm font-medium"
                  >
                    <Icon name="ph:arrow-clockwise" class="w-5 h-5 mr-2" />
                    Semakan Semula
                  </rs-button>

                  <rs-button
                    variant="primary-outline"
                    @click="handleBack"
                    class="w-full !py-3 text-sm font-medium"
                  >
                    <Icon name="ph:arrow-left" class="w-5 h-5 mr-2" />
                    Kembali
                  </rs-button>
                </template>
              </div>
            </div>
          </template>
        </rs-card>
      </div>
    </div>

    <!-- Success Modal for Payment -->
    <rs-modal
      v-model="showPaymentSuccessModal"
      title="Pembayaran Berjaya"
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
            Pembayaran elaun penolong amil berjaya diproses.
          </p>
          <p class="text-gray-600">
            Status pembayaran telah dikemaskini kepada "Telah Dibayar".
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center">
          <rs-button variant="primary" @click="handlePaymentModalClose">
            Tutup
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

definePageMeta({
  title: "Maklumat Aktiviti Penolong Amil",
  description: "Maklumat aktiviti penolong amil",
});

const breadcrumb = ref([
  {
    name: "Bancian/Asnaf",
    type: "link",
    path: "/BF-PA/PE/AB",
  },
  {
    name: "Maklumat Aktiviti",
    type: "link",
    path: "/BF-PA/PE/AB/02/PA",
  },
  {
    name: "Maklumat Aktiviti Penolong Amil",
    type: "current",
    path: `/BF-PA/PE/AB/02/PA/PA_Aktiviti/${route.params.id}`,
  },
]);

// State variables
const processing = ref(false);
const showPaymentSuccessModal = ref(false);

// Mock PA data - will be loaded based on ID
const paInfo = ref({
  id: '',
  name: '',
  location: '',
  endDate: '',
  assignmentType: '',
  status: '',
  paymentStatus: '',
  paymentAdviceNo: '',
  accountNo: '',
});

// Mock activities data
const activities = ref([]);

// Mock data for different PA IDs
const paDataMap = {
  'PA001': {
    id: 'PA001',
    name: 'Ahmad bin Abdullah',
    location: 'Masjid Al-Hidayah',
    endDate: '31/12/2024',
    assignmentType: 'Kariah',
    status: 'Disokong',
    paymentStatus: 'Telah Ditolak',
    paymentAdviceNo: 'PA-2024-001',
    accountNo: '1234567890',
    activities: [
      {
        id: 'B001',
        date: '01/03/2024',
        name: 'Bancian Baru',
        asnafName: 'Abdul Rahman bin Mohamed',
        referenceNo: 'ASN-2024-001',
        status: 'Selesai',
        allowance: '30.00',
      },
      {
        id: 'AR001',
        date: '02/03/2024',
        name: 'Asnaf Review',
        asnafName: 'Fatimah binti Omar',
        referenceNo: 'ASN-2024-002',
        status: 'Dalam Proses',
        allowance: '20.00',
      },
      {
        id: 'PB001',
        date: '03/03/2024',
        name: 'Permohonan Bantuan',
        asnafName: 'Hassan bin Ismail',
        referenceNo: 'ASN-2024-003',
        status: 'Belum Bermula',
        allowance: '20.00',
      },
      {
        id: 'B002',
        date: '04/03/2024',
        name: 'Bancian Baru',
        asnafName: 'Zainab binti Abdullah',
        referenceNo: 'ASN-2024-004',
        status: 'Selesai',
        allowance: '30.00',
      },
      {
        id: 'AR002',
        date: '05/03/2024',
        name: 'Asnaf Review',
        asnafName: 'Mohamed bin Yusof',
        referenceNo: 'ASN-2024-005',
        status: 'Dalam Proses',
        allowance: '20.00',
      }
    ]
  },
  'PA002': {
    id: 'PA002',
    name: 'Siti Aminah binti Hassan',
    location: 'Masjid Al-Ikhlas',
    endDate: '31/12/2024',
    assignmentType: 'Kariah',
    status: 'Disokong',
    paymentStatus: 'Belum Dibayar',
    paymentAdviceNo: 'PA-2024-002',
    accountNo: '2345678901',
    activities: [
      {
        id: 'B003',
        date: '01/03/2024',
        name: 'Bancian Baru',
        asnafName: 'Rahman bin Ali',
        referenceNo: 'ASN-2024-006',
        status: 'Selesai',
        allowance: '30.00',
      },
      {
        id: 'AR003',
        date: '02/03/2024',
        name: 'Asnaf Review',
        asnafName: 'Aminah binti Hassan',
        referenceNo: 'ASN-2024-007',
        status: 'Selesai',
        allowance: '20.00',
      }
    ]
  },
  'PA003': {
    id: 'PA003',
    name: 'Mohd Razak bin Ibrahim',
    location: 'Masjid Al-Amin',
    endDate: '31/12/2024',
    assignmentType: 'Kariah',
    status: 'Disokong',
    paymentStatus: 'Telah Dibayar',
    paymentAdviceNo: 'PA-2024-003',
    accountNo: '3456789012',
    activities: [
      {
        id: 'PB002',
        date: '01/03/2024',
        name: 'Permohonan Bantuan',
        asnafName: 'Ibrahim bin Mohamed',
        referenceNo: 'ASN-2024-008',
        status: 'Selesai',
        allowance: '20.00',
      },
      {
        id: 'AR004',
        date: '02/03/2024',
        name: 'Asnaf Review',
        asnafName: 'Siti binti Omar',
        referenceNo: 'ASN-2024-009',
        status: 'Selesai',
        allowance: '20.00',
      }
    ]
  },
  'PA004': {
    id: 'PA004',
    name: 'Nurul Aisyah binti Omar',
    location: 'Masjid Al-Falah',
    endDate: '31/12/2024',
    assignmentType: 'Kariah',
    status: 'Disokong',
    paymentStatus: 'Belum Dibayar',
    paymentAdviceNo: 'PA-2024-004',
    accountNo: '4567890123',
    activities: [
      {
        id: 'B004',
        date: '01/03/2024',
        name: 'Bancian Baru',
        asnafName: 'Omar bin Abdullah',
        referenceNo: 'ASN-2024-010',
        status: 'Selesai',
        allowance: '30.00',
      },
      {
        id: 'PB003',
        date: '02/03/2024',
        name: 'Permohonan Bantuan',
        asnafName: 'Aisyah binti Hassan',
        referenceNo: 'ASN-2024-011',
        status: 'Selesai',
        allowance: '20.00',
      }
    ]
  },
  'PA005': {
    id: 'PA005',
    name: 'Ali bin Hassan',
    location: 'Masjid Kg Delek',
    endDate: '31/12/2024',
    assignmentType: 'Kariah',
    status: 'Disokong',
    paymentStatus: 'Telah Dibayar',
    paymentAdviceNo: 'PA-2024-005',
    accountNo: '5678901234',
    activities: [
      {
        id: 'B005',
        date: '01/03/2024',
        name: 'Bancian Baru',
        asnafName: 'Hassan bin Mohamed',
        referenceNo: 'ASN-2024-012',
        status: 'Selesai',
        allowance: '30.00',
      },
      {
        id: 'AR005',
        date: '02/03/2024',
        name: 'Asnaf Review',
        asnafName: 'Fatimah binti Ali',
        referenceNo: 'ASN-2024-013',
        status: 'Selesai',
        allowance: '20.00',
      },
      {
        id: 'PB004',
        date: '03/03/2024',
        name: 'Permohonan Bantuan',
        asnafName: 'Mohamed bin Omar',
        referenceNo: 'ASN-2024-014',
        status: 'Selesai',
        allowance: '20.00',
      }
    ]
  }
};

// Load data based on PA ID
onMounted(() => {
  const paId = route.params.id;
  const paData = paDataMap[paId];
  
  if (paData) {
    paInfo.value = {
      id: paData.id,
      name: paData.name,
      location: paData.location,
      endDate: paData.endDate,
      assignmentType: paData.assignmentType,
      status: paData.status,
      paymentStatus: paData.paymentStatus,
      paymentAdviceNo: paData.paymentAdviceNo,
      accountNo: paData.accountNo,
    };
    activities.value = paData.activities;
  } else {
    // Handle case when PA ID is not found
    console.error('PA ID not found:', paId);
  }
});

// Helper functions
const getPaymentStatusClass = (status) => {
  const statusClasses = {
    'Belum Dibayar': 'bg-yellow-100 text-yellow-800',
    'Telah Dibayar': 'bg-green-100 text-green-800',
    'Telah Ditolak': 'bg-red-100 text-red-800',
    'Dalam Proses': 'bg-blue-100 text-blue-800',
  };
  return statusClasses[status] || 'bg-gray-100 text-gray-800';
};

// Computed properties
const totalAllowance = computed(() => {
  return activities.value
    .reduce((sum, activity) => sum + parseFloat(activity.allowance), 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
});

// Action handlers
const handleBack = () => {
  navigateTo('/BF-PA/PE/AB/02/PA');
};

const handlePay = async () => {
  try {
    processing.value = true;
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update payment status
    paInfo.value.paymentStatus = 'Telah Dibayar';
    showPaymentSuccessModal.value = true;
  } catch (error) {
    console.error('Error processing payment:', error);
  } finally {
    processing.value = false;
  }
};

const handleReview = () => {
  navigateTo('/BF-PA/PE/AB/06');
};

const handlePaymentModalClose = () => {
  showPaymentSuccessModal.value = false;
  navigateTo('/BF-PA/PE/AB/02/PA');
};
</script>

<style scoped>
/* Add any additional styles here */
</style> 