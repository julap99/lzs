<!-- 
  RTMF SCREEN: PA-PE-ET-03
  PURPOSE: Paparan Maklumat Elaun Tahunan — Paparan Sahaja
  DESCRIPTION: Paparan baca sahaja untuk maklumat elaun tahunan untuk semua peranan
  ROUTE: /BF-PA/PE/ET/03
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Kad Header -->
    <rs-card class="mt-4">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <Icon name="ic:outline-remove-red-eye" class="mr-3 text-blue-600" size="24" />
            <h2 class="text-lg font-semibold">Paparan Maklumat Elaun Tahunan</h2>
          </div>
          <div class="text-xs text-gray-500">
            Rujukan: <b>{{ allowanceData.rujukan || '—' }}</b>
          </div>
        </div>
      </template>

      <template #body>
        <!-- Ringkasan Elaun -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div class="text-xs text-blue-600">Tahun Elaun</div>
            <div class="text-base font-medium text-blue-900">{{ allowanceData.year || '—' }}</div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg border border-green-200">
            <div class="text-xs text-green-600">Jenis Elaun</div>
            <div class="text-base font-medium text-green-900">{{ allowanceData.typeLabel || '—' }}</div>
          </div>
          <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div class="text-xs text-orange-600">Status</div>
            <div class="text-base">
              <rs-badge :variant="getStatusVariant(allowanceData.status)">
                {{ allowanceData.status || '—' }}
              </rs-badge>
            </div>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div class="text-xs text-purple-600">Jumlah Penerima</div>
            <div class="text-base font-medium text-purple-900">{{ allowanceData.count || '—' }}</div>
          </div>
        </div>

        <!-- Maklumat Bajet -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div class="text-xs text-gray-600">Bajet (RM)</div>
            <div class="text-base font-medium text-gray-900">{{ formatCurrency(allowanceData.budget) }}</div>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div class="text-xs text-yellow-600">Jumlah Elaun (RM)</div>
            <div class="text-base font-medium text-yellow-900">{{ formatCurrency(allowanceData.totalAmount) }}</div>
          </div>
          <div class="bg-red-50 p-4 rounded-lg border border-red-200">
            <div class="text-xs text-red-600">Lebihan (RM)</div>
            <div class="text-base font-medium text-red-900">{{ formatCurrency(allowanceData.excessAmount) }}</div>
          </div>
        </div>

        <!-- Timeline Kelulusan -->
        <div class="mb-6">
          <h3 class="text-sm font-semibold text-gray-900 mb-3">Timeline Kelulusan</h3>
          <div class="space-y-3">
            <div class="flex items-center space-x-3">
              <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div class="text-sm">
                <span class="font-medium">Dibuat oleh:</span> {{ allowanceData.createdBy || '—' }}
                <span class="text-gray-500 ml-2">{{ formatDate(allowanceData.createdAt) }}</span>
              </div>
            </div>
            <div v-if="allowanceData.submittedAt" class="flex items-center space-x-3">
              <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div class="text-sm">
                <span class="font-medium">Dihantar untuk kelulusan:</span>
                <span class="text-gray-500 ml-2">{{ formatDate(allowanceData.submittedAt) }}</span>
              </div>
            </div>
            <div v-if="allowanceData.approvedByKJ" class="flex items-center space-x-3">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <div class="text-sm">
                <span class="font-medium">Diluluskan Ketua Jabatan:</span> {{ allowanceData.approvedByKJ }}
                <span class="text-gray-500 ml-2">{{ formatDate(allowanceData.approvedAtKJ) }}</span>
              </div>
            </div>
            <div v-if="allowanceData.approvedByKD" class="flex items-center space-x-3">
              <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
              <div class="text-sm">
                <span class="font-medium">Diluluskan Ketua Divisyen:</span> {{ allowanceData.approvedByKD }}
                <span class="text-gray-500 ml-2">{{ formatDate(allowanceData.approvedAtKD) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Nota -->
        <div v-if="allowanceData.notes" class="mb-6">
          <h3 class="text-sm font-semibold text-gray-900 mb-3">Nota</h3>
          <div class="bg-gray-50 p-3 rounded-lg border">
            <p class="text-sm text-gray-700">{{ allowanceData.notes }}</p>
          </div>
        </div>

        <!-- Jadual Penerima -->
        <div class="mb-6">
          <h3 class="text-sm font-semibold text-gray-900 mb-3">Senarai Penerima</h3>
          <div class="overflow-x-auto rounded-lg border">
            <table class="min-w-full text-sm divide-y">
              <thead class="bg-gray-50 text-left">
                <tr>
                  <th class="px-4 py-3 font-medium text-gray-900">Nama</th>
                  <th class="px-4 py-3 font-medium text-gray-900">ID Pengenalan</th>
                  <th class="px-4 py-3 font-medium text-gray-900">Kategori</th>
                  <th class="px-4 py-3 font-medium text-gray-900">Kariah/Daerah</th>
                  <th class="px-4 py-3 font-medium text-gray-900">Elaun (RM)</th>
                </tr>
              </thead>
              <tbody class="divide-y bg-white">
                <tr v-for="recipient in recipients" :key="recipient.paId" class="hover:bg-gray-50">
                  <td class="px-4 py-3 font-medium text-gray-900">{{ recipient.name }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ recipient.ic }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ recipient.category }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ recipient.parish }}</td>
                  <td class="px-4 py-3 font-medium text-gray-900">{{ formatCurrency(recipient.allowance) }}</td>
                </tr>
                <tr v-if="!recipients.length" class="hover:bg-gray-50">
                  <td class="px-4 py-6 text-center text-gray-500" colspan="5">
                    Tiada penerima dalam senarai ini.
                  </td>
                </tr>
              </tbody>
              <tfoot class="bg-gray-50">
                <tr>
                  <td class="px-4 py-3 text-right font-medium" colspan="4">Jumlah (RM)</td>
                  <td class="px-4 py-3 font-semibold">{{ formatCurrency(totalAllowance) }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <!-- Tindakan -->
        <div class="flex items-center justify-end gap-2">
          <rs-button
            variant="secondary-outline"
            size="sm"
            @click="goBack"
          >
            Kembali
          </rs-button>
          <rs-button
            v-if="currentRole === 'eksekutif' && allowanceData.status === 'DRAF'"
            variant="secondary"
            size="sm"
            @click="editAllowance"
          >
            <Icon name="ic:outline-edit" class="w-4 h-4 mr-2" />
            Kemaskini
          </rs-button>
          <rs-button
            v-if="currentRole === 'ketua-jabatan' && allowanceData.status === 'SEDANG PROSES'"
            variant="success"
            size="sm"
            @click="approveAllowance"
          >
            <Icon name="ic:outline-check" class="w-4 h-4 mr-2" />
            Luluskan
          </rs-button>
          <rs-button
            v-if="currentRole === 'ketua-divisyen' && allowanceData.status === 'SEDANG PROSES'"
            variant="success"
            size="sm"
            @click="approveAllowance"
          >
            <Icon name="ic:outline-check" class="w-4 h-4 mr-2" />
            Luluskan
          </rs-button>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '#components';
import LayoutsBreadcrumb from '~/components/layouts/Breadcrumb.vue';

definePageMeta({
  title: "Paparan Maklumat Elaun Tahunan",
  description: "Read-only view of allowance details for all roles",
});

const toast = useToast();
const router = useRouter();
const route = useRoute();

const goBack = () => router.back();

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
    name: "Paparan Maklumat",
    type: "current",
    path: "/BF-PA/PE/ET/03",
  },
]);

// Get current role from localStorage or default to eksekutif
const currentRole = ref(localStorage.getItem('et:currentRole') || 'eksekutif');

// Allowance data
const allowanceData = ref({
  id: '',
  rujukan: '',
  year: '',
  type: '',
  typeLabel: '',
  status: '',
  count: 0,
  totalAmount: 0,
  budget: 10000,
  excessAmount: 0,
  createdBy: '',
  createdAt: '',
  submittedAt: '',
  approvedByKJ: '',
  approvedAtKJ: '',
  approvedByKD: '',
  approvedAtKD: '',
  notes: ''
});

// Recipients data
const recipients = ref([]);

// Computed values
const totalAllowance = computed(() => {
  return recipients.value.reduce((sum, r) => sum + (Number(r.allowance) || 0), 0);
});

// Helper functions
function getStatusVariant(status) {
  switch (status) {
    case 'DRAF': return 'secondary';
    case 'SEDANG PROSES': return 'info';
    case 'MENUNGGU KELULUSAN': return 'warning';
    case 'PERLU PENGESAHAN': return 'warning';
    case 'LULUS': return 'success';
    case 'DITOLAK': return 'danger';
    default: return 'secondary';
  }
}

function formatCurrency(amount) {
  return Number(amount || 0).toLocaleString('en-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatDate(dateString) {
  if (!dateString) return '—';
  try {
    return new Date(dateString).toLocaleDateString('ms-MY', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
}

// Load allowance data
function loadAllowanceData() {
  const id = route.query.id;
  if (!id) {
    toast.error('ID elaun tidak ditemui');
    goBack();
    return;
  }

  // Load from localStorage or use sample data
  const year = route.query.year;
  const type = route.query.type;
  
  if (year && type) {
    // Load from localStorage
    const recipientsKey = `et:recipients:${year}:${type}`;
    const countKey = `et:count:${year}:${type}`;
    const statusKey = `et:status:${year}:${type}`;
    
    try {
      const recipientsData = localStorage.getItem(recipientsKey);
      const count = localStorage.getItem(countKey);
      const status = localStorage.getItem(statusKey);
      
      if (recipientsData) {
        recipients.value = JSON.parse(recipientsData);
      }
      
      // Update allowance data
      allowanceData.value = {
        ...allowanceData.value,
        id: id,
        rujukan: id,
        year: Number(year),
        type: type,
        typeLabel: getTypeLabel(type),
        status: status || 'DRAF',
        count: Number(count) || 0,
        totalAmount: totalAllowance.value,
        budget: 10000, // Default budget
        excessAmount: Math.max(0, totalAllowance.value - 10000)
      };
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Gagal memuatkan data elaun');
    }
  } else {
    // Use sample data for demonstration
    allowanceData.value = {
      id: id,
      rujukan: id,
      year: 2024,
      type: 'ET-KPAK',
      typeLabel: 'Elaun Tahunan KPAK',
      status: 'SEDANG PROSES',
      count: 25,
      totalAmount: 12500.00,
      budget: 10000.00,
      excessAmount: 2500.00,
      createdBy: 'eksekutif',
      createdAt: '2024-01-15T10:00:00Z',
      submittedAt: '2024-01-16T15:00:00Z',
      approvedByKJ: null,
      approvedAtKJ: null,
      approvedByKD: null,
      approvedAtKD: null,
      notes: 'Elaun untuk KPAK tahun 2024'
    };
    
    // Sample recipients
    recipients.value = [
      {
        paId: 'PA001',
        name: 'Ahmad bin Abdullah',
        ic: '800101145678',
        category: 'KPAK',
        parish: 'Kariah A',
        allowance: 500.00
      },
      {
        paId: 'PA002',
        name: 'Siti binti Mohamed',
        ic: '820315123456',
        category: 'KPAK',
        parish: 'Kariah B',
        allowance: 500.00
      }
    ];
  }
}

function getTypeLabel(type) {
  const typeOptions = {
    'ET-KPAK': 'Elaun Tahunan KPAK',
    'ET-KPAF': 'Elaun Tahunan KPAF',
    'ET-ANUG': 'Anugerah Penolong Amil',
    'ANUG-KPAK': 'Ketua Penolong Amil Kariah (KPAK) terbaik',
    'ANUG-PAK': 'Penolong Amil Kariah (PAK) terbaik',
    'ANUG-KPAF': 'Ketua Penolong Amil Fitrah (KPAF) terbaik',
    'ANUG-PAF': 'Penolong Amil Fitrah (PAF) terbaik',
    'ANUG-PAP': 'Penolong Amil Padi (PAP) terbaik',
    'ANUG-PAKPLUS': 'Penolong Amil Komuniti (PAK+) terbaik'
  };
  return typeOptions[type] || type;
}

// Action functions
function editAllowance() {
  router.push(`/BF-PA/PE/ET/04?id=${allowanceData.value.id}`);
}

function approveAllowance() {
  // Check if allowance exceeds budget
  if (allowanceData.value.totalAmount > allowanceData.value.budget) {
    if (currentRole.value === 'ketua-jabatan') {
      allowanceData.value.status = 'PERLU PENGESAHAN';
      toast.warning('Elaun melebihi bajet - perlu pengesahan');
    } else {
      allowanceData.value.status = 'LULUS';
      toast.success('Elaun berjaya diluluskan');
    }
  } else {
    allowanceData.value.status = 'LULUS';
    toast.success('Elaun berjaya diluluskan');
  }
  
  // Update localStorage
  const year = allowanceData.value.year;
  const type = allowanceData.value.type;
  localStorage.setItem(`et:status:${year}:${type}`, allowanceData.value.status);
}

// Load data on mount
onMounted(() => {
  loadAllowanceData();
});
</script>

<style scoped>
/* Add any additional styles here */
</style> 