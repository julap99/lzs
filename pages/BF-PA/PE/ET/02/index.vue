<!-- 
  RTMF SCREEN: PA-PE-ET-02
  PURPOSE: Kiraan & Penjanaan Payment Advice
  DESCRIPTION: Calculation and Payment Advice generation for annual allowances
  ROUTE: /BF-PA/PE/ET/02
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Header Section -->
    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <Icon name="ic:outline-receipt" class="mr-3 text-purple-600" size="24" />
            <h2 class="text-xl font-semibold">
              Kiraan & Penjanaan Payment Advice
            </h2>
          </div>
          <div class="flex items-center space-x-3">
            <rs-button
              variant="secondary-outline"
              size="sm"
              @click="refreshData"
            >
              <Icon name="ic:outline-refresh" class="mr-2" />
              Kemas Kini
            </rs-button>
            <rs-button
              variant="primary"
              size="sm"
              @click="generatePaymentAdvice"
              :disabled="!canGeneratePA || processing"
            >
              <Icon name="ic:outline-receipt" class="mr-2" />
              Jana Payment Advice
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>
        <!-- Info Banner -->
        <div class="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div class="flex items-start">
            <Icon name="ic:outline-info" class="text-purple-600 mt-1 mr-3" />
            <div>
              <h4 class="font-semibold text-purple-900 mb-2">Maklumat Penjanaan Payment Advice</h4>
              <div class="text-sm text-purple-800 space-y-1">
                <p>• Payment Advice hanya boleh dijana selepas semua pengiraan elaun tahunan disahkan</p>
                <p>• Status rekod tidak boleh diubah selepas Payment Advice dijana</p>
                <p>• Semua Penolong Amil yang disahkan akan dijana Payment Advice secara automatik</p>
                <p>• Tahun perkhidmatan: {{ currentYear }} - {{ nextYear }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary Statistics -->
        <div class="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-blue-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-blue-600">{{ totalEligible }}</div>
            <p class="text-sm text-blue-700">Jumlah Layak</p>
          </div>
          <div class="bg-green-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-green-600">{{ totalCalculated }}</div>
            <p class="text-sm text-green-700">Telah Dikira</p>
          </div>
          <div class="bg-orange-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-orange-600">{{ totalAmount }}</div>
            <p class="text-sm text-orange-700">Jumlah Elaun (RM)</p>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-purple-600">{{ paCount }}</div>
            <p class="text-sm text-purple-700">Payment Advice</p>
          </div>
        </div>

        <!-- Payment Advice Status -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-4 text-gray-900">Status Payment Advice</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-green-50 p-4 rounded-lg border border-green-200">
              <div class="flex items-center">
                <Icon name="ic:outline-check-circle" class="text-green-600 mr-3" size="24" />
                <div>
                  <div class="text-lg font-semibold text-green-900">{{ paGenerated }}</div>
                  <p class="text-sm text-green-700">Berjaya Dijana</p>
                </div>
              </div>
            </div>
            <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div class="flex items-center">
                <Icon name="ic:outline-clock" class="text-yellow-600 mr-3" size="24" />
                <div>
                  <div class="text-lg font-semibold text-yellow-900">{{ paPending }}</div>
                  <p class="text-sm text-yellow-700">Dalam Proses</p>
                </div>
              </div>
            </div>
            <div class="bg-red-50 p-4 rounded-lg border border-red-200">
              <div class="flex items-center">
                <Icon name="ic:outline-error" class="text-red-600 mr-3" size="24" />
                <div>
                  <div class="text-lg font-semibold text-red-900">{{ paFailed }}</div>
                  <p class="text-sm text-red-700">Gagal</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Advice List -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-4 text-gray-900">Senarai Payment Advice</h3>
          <rs-table
            :data="paymentAdviceList"
            :columns="paColumns"
            :pageSize="pageSize"
            :options="{
              variant: 'default',
              hover: true,
              striped: true,
            }"
            :options-advanced="{
              sortable: true,
              filterable: true,
            }"
            advanced
          >
            <template v-slot:status="{ text }">
              <rs-badge :variant="getPAStatusVariant(text)">
                {{ text }}
              </rs-badge>
            </template>

            <template v-slot:tindakan="{ text }">
              <div class="flex justify-center items-center gap-2">
                <rs-button
                  variant="primary"
                  size="sm"
                  @click="handleViewPA(text)"
                  title="Lihat Butiran"
                  class="!px-3 !py-1.5"
                >
                  <Icon name="ic:outline-remove-red-eye" class="w-4 h-4 mr-1" />
                  Lihat
                </rs-button>
                <rs-button
                  v-if="canDownloadPA(text)"
                  variant="success"
                  size="sm"
                  @click="handleDownloadPA(text)"
                  title="Muat Turun"
                  class="!px-3 !py-1.5"
                >
                  <Icon name="ic:outline-download" class="w-4 h-4 mr-1" />
                  Muat Turun
                </rs-button>
              </div>
            </template>
          </rs-table>
        </div>

        <!-- Audit Trail -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-4 text-gray-900">Audit Trail & Log Tindakan</h3>
          <div class="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
            <div class="space-y-3">
              <div
                v-for="log in auditLogs"
                :key="log.id"
                class="flex items-start space-x-3 p-3 bg-white rounded border"
              >
                <div class="flex-shrink-0">
                  <Icon 
                    :name="getLogIcon(log.action)" 
                    :class="getLogIconColor(log.action)"
                    size="16"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900">{{ log.action }}</p>
                  <p class="text-sm text-gray-600">{{ log.description }}</p>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ log.timestamp }} oleh {{ log.user }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';

definePageMeta({
  title: "Kiraan & Penjanaan Payment Advice",
  description: "Pengiraan dan penjanaan Payment Advice untuk elaun tahunan",
});

const toast = useToast();

const breadcrumb = ref([
  {
    name: "Pengurusan Elaun",
    type: "link",
    path: "/BF-PA/PE",
  },
  {
    name: "Elaun Tahunan",
    type: "link",
    path: "/BF-PA/PE/ET",
  },
  {
    name: "Payment Advice",
    type: "current",
    path: "/BF-PA/PE/ET/02",
  },
]);

// State
const processing = ref(false);
const pageSize = ref(10);

const currentYear = new Date().getFullYear();
const nextYear = currentYear + 1;

// Mock data - replace with actual API calls
const totalEligible = ref(45);
const totalCalculated = ref(32);
const totalAmount = ref('38,400.00');
const paCount = ref(28);
const paGenerated = ref(25);
const paPending = ref(2);
const paFailed = ref(1);

// Payment Advice data
const paymentAdviceList = ref([
  {
    id: 'PA-ET-2024-001',
    tarikhJana: '15/01/2024',
    jumlahPenolongAmil: 15,
    jumlahElaun: '18,500.00',
    status: 'Berjaya',
    userJana: 'Eksekutif A',
    tarikhProses: '15/01/2024 10:30:00',
  },
  {
    id: 'PA-ET-2024-002',
    tarikhJana: '16/01/2024',
    jumlahPenolongAmil: 10,
    jumlahElaun: '12,800.00',
    status: 'Berjaya',
    userJana: 'Eksekutif B',
    tarikhProses: '16/01/2024 14:15:00',
  },
  {
    id: 'PA-ET-2024-003',
    tarikhJana: '17/01/2024',
    jumlahPenolongAmil: 7,
    jumlahElaun: '7,100.00',
    status: 'Dalam Proses',
    userJana: 'Sistem',
    tarikhProses: '17/01/2024 09:00:00',
  },
  {
    id: 'PA-ET-2024-004',
    tarikhJana: '18/01/2024',
    jumlahPenolongAmil: 3,
    jumlahElaun: '2,400.00',
    status: 'Gagal',
    userJana: 'Sistem',
    tarikhProses: '18/01/2024 11:45:00',
  },
]);

// Audit logs
const auditLogs = ref([
  {
    id: 1,
    action: 'Pengiraan Elaun Tahunan',
    description: '32 Penolong Amil telah dikira elaun tahunan untuk tahun 2024',
    timestamp: '15/01/2024 10:00:00',
    user: 'Eksekutif A',
  },
  {
    id: 2,
    action: 'Penjanaan Payment Advice',
    description: 'Payment Advice PA-ET-2024-001 berjaya dijana untuk 15 Penolong Amil',
    timestamp: '15/01/2024 10:30:00',
    user: 'Sistem',
  },
  {
    id: 3,
    action: 'Penjanaan Payment Advice',
    description: 'Payment Advice PA-ET-2024-002 berjaya dijana untuk 10 Penolong Amil',
    timestamp: '16/01/2024 14:15:00',
    user: 'Sistem',
  },
  {
    id: 4,
    action: 'Penjanaan Payment Advice',
    description: 'Payment Advice PA-ET-2024-003 mula diproses untuk 7 Penolong Amil',
    timestamp: '17/01/2024 09:00:00',
    user: 'Sistem',
  },
  {
    id: 5,
    action: 'Ralat Penjanaan',
    description: 'Payment Advice PA-ET-2024-004 gagal dijana kerana ralat sistem',
    timestamp: '18/01/2024 11:45:00',
    user: 'Sistem',
  },
]);

// Table columns
const paColumns = [
  {
    key: "id",
    label: "ID Payment Advice",
    sortable: true,
    width: "180px",
  },
  {
    key: "tarikhJana",
    label: "Tarikh Jana",
    sortable: true,
    width: "120px",
  },
  {
    key: "jumlahPenolongAmil",
    label: "Jumlah PA",
    sortable: true,
    width: "100px",
  },
  {
    key: "jumlahElaun",
    label: "Jumlah Elaun (RM)",
    sortable: true,
    width: "150px",
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    width: "120px",
  },
  {
    key: "userJana",
    label: "Dijana Oleh",
    sortable: true,
    width: "140px",
  },
  {
    key: "tindakan",
    label: "Tindakan",
    sortable: false,
    width: "150px",
  },
];

// Computed properties
const canGeneratePA = computed(() => {
  return totalCalculated.value > 0 && totalCalculated.value === totalEligible.value;
});

// Helper functions
const getPAStatusVariant = (status) => {
  switch (status) {
    case 'Berjaya': return 'success';
    case 'Dalam Proses': return 'warning';
    case 'Gagal': return 'danger';
    default: return 'default';
  }
};

const getLogIcon = (action) => {
  if (action.includes('Berjaya') || action.includes('Berjaya')) return 'ic:outline-check-circle';
  if (action.includes('Gagal') || action.includes('Ralat')) return 'ic:outline-error';
  if (action.includes('Proses')) return 'ic:outline-clock';
  return 'ic:outline-info';
};

const getLogIconColor = (action) => {
  if (action.includes('Berjaya') || action.includes('Berjaya')) return 'text-green-600';
  if (action.includes('Gagal') || action.includes('Ralat')) return 'text-red-600';
  if (action.includes('Proses')) return 'text-yellow-600';
  return 'text-blue-600';
};

const canDownloadPA = (paId) => {
  const pa = paymentAdviceList.value.find(p => p.id === paId);
  return pa && pa.status === 'Berjaya';
};

// Action handlers
const handleViewPA = (paId) => {
  // Navigate to PA details page
  toast.info(`Lihat butiran Payment Advice: ${paId}`);
};

const handleDownloadPA = (paId) => {
  // Download PA document
  toast.success(`Payment Advice ${paId} berjaya dimuat turun`);
};

const generatePaymentAdvice = async () => {
  if (!canGeneratePA.value) {
    toast.warning('Tidak boleh menjana Payment Advice pada masa ini');
    return;
  }

  try {
    processing.value = true;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    toast.success('Payment Advice berjaya dijana untuk semua Penolong Amil yang layak');
    
    // Refresh data
    refreshData();
  } catch (error) {
    toast.error('Ralat semasa menjana Payment Advice');
    console.error('Error generating Payment Advice:', error);
  } finally {
    processing.value = false;
  }
};

const refreshData = async () => {
  try {
    processing.value = true;
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Data telah dikemas kini');
  } catch (error) {
    toast.error('Ralat semasa mengemas kini data');
  } finally {
    processing.value = false;
  }
};

onMounted(() => {
  // Load initial data
  refreshData();
});
</script>

<style scoped>
/* Add any additional styles here */
</style> 