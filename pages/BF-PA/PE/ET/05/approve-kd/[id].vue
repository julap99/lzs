<!-- 
  RTMF SCREEN: PA-PE-ET-05-APPROVE-KD
  PURPOSE: Kelulusan Akhir Elaun Tahunan — Ketua Divisyen
  DESCRIPTION: Halaman kelulusan akhir untuk Ketua Divisyen memeriksa dan meluluskan elaun tahunan
  ROUTE: /BF-PA/PE/ET/05/approve-kd/[id]
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Kad Header -->
    <rs-card class="mt-4">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <Icon name="ic:outline-check-circle" class="mr-3 text-purple-600" size="24" />
            <h2 class="text-lg font-semibold">Kelulusan Akhir Elaun Tahunan</h2>
          </div>
          <div class="text-xs text-gray-500">
            Rujukan: <b>{{ allowanceData.rujukan || '—' }}</b>
          </div>
        </div>
      </template>

      <template #body>
        <!-- Amaran Bajet (jika melebihi) -->
        <div v-if="allowanceData.totalAmount > allowanceData.budget" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div class="flex items-center">
            <Icon name="ic:outline-warning" class="text-red-400 mr-3" size="20" />
            <div>
              <h4 class="text-sm font-medium text-red-800">Amaran: Elaun Melebihi Bajet</h4>
              <p class="text-sm text-red-700 mt-1">
                Jumlah elaun (RM {{ formatCurrency(allowanceData.totalAmount) }}) melebihi bajet (RM {{ formatCurrency(allowanceData.budget) }}).
                Lebihan: RM {{ formatCurrency(allowanceData.excessAmount) }}
              </p>
            </div>
          </div>
        </div>

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
            <div class="text-base font-medium" :class="allowanceData.totalAmount > allowanceData.budget ? 'text-red-600' : 'text-yellow-900'">
              {{ formatCurrency(allowanceData.totalAmount) }}
            </div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg border border-green-200">
            <div class="text-xs text-green-600">Baki (RM)</div>
            <div class="text-base font-medium" :class="allowanceData.totalAmount > allowanceData.budget ? 'text-red-600' : 'text-green-900'">
              {{ formatCurrency(allowanceData.budget - allowanceData.totalAmount) }}
            </div>
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

        <!-- Borang Kelulusan Akhir -->
        <div class="bg-gray-50 p-4 rounded-lg border mb-6">
          <h3 class="text-sm font-semibold text-gray-900 mb-3">Borang Kelulusan Akhir</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Keputusan <span class="text-red-500">*</span>
              </label>
              <FormKit
                v-model="approval.decision"
                type="select"
                :options="decisionOptions"
                placeholder="Pilih keputusan…"
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tarikh Kelulusan <span class="text-red-500">*</span>
              </label>
              <FormKit
                v-model="approval.date"
                type="date"
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Ulasan Kelulusan <span class="text-red-500">*</span>
            </label>
            <FormKit
              v-model="approval.comments"
              type="textarea"
              rows="3"
              placeholder="Masukkan ulasan kelulusan akhir anda..."
              :classes="{
                input: '!py-2',
              }"
            />
          </div>

          <div v-if="approval.decision === 'reject'" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Sebab Penolakan <span class="text-red-500">*</span>
            </label>
            <FormKit
              v-model="approval.rejectionReason"
              type="textarea"
              rows="2"
              placeholder="Nyatakan sebab penolakan..."
              :classes="{
                input: '!py-2',
              }"
            />
          </div>

          <!-- Nota Khas untuk Elaun Melebihi Bajet -->
          <div v-if="allowanceData.totalAmount > allowanceData.budget" class="bg-yellow-50 p-3 rounded-lg border border-yellow-200 mb-4">
            <div class="flex items-center">
              <Icon name="ic:outline-info" class="text-yellow-600 mr-2" size="16" />
              <div class="text-sm text-yellow-800">
                <strong>Nota:</strong> Elaun ini telah disahkan oleh Ketua Jabatan walaupun melebihi bajet. 
                Sila semak semula sebelum membuat keputusan akhir.
              </div>
            </div>
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
            variant="danger"
            size="sm"
            :disabled="!canSubmit || submitting"
            @click="rejectAllowance"
          >
            <Icon name="ic:outline-x" class="w-4 h-4 mr-2" />
            Tolak
          </rs-button>
          <rs-button
            variant="success"
            size="sm"
            :disabled="!canSubmit || submitting"
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
import { FormKit } from '@formkit/vue';
import LayoutsBreadcrumb from '~/components/layouts/Breadcrumb.vue';

definePageMeta({
  title: "Kelulusan Akhir Elaun Tahunan",
  description: "Halaman kelulusan akhir untuk Ketua Divisyen memeriksa dan meluluskan elaun tahunan",
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
    name: "Kelulusan Akhir",
    type: "current",
    path: "/BF-PA/PE/ET/05/approve-kd",
  },
]);

const allowanceData = ref({
  id: '', rujukan: '', year: '', type: '', typeLabel: '', status: '', count: 0, totalAmount: 0,
  budget: 10000, excessAmount: 0, createdBy: '', createdAt: '', submittedAt: '',
  approvedByKJ: '', approvedAtKJ: '', approvedByKD: '', approvedAtKD: '', notes: ''
});

const recipients = ref([]);

const approval = ref({
  decision: '',
  date: '',
  comments: '',
  rejectionReason: ''
});

const submitting = ref(false);

const totalAllowance = computed(() => {
  return recipients.value.reduce((sum, r) => sum + (Number(r.allowance) || 0), 0);
});

const canSubmit = computed(() => {
  return approval.value.decision && 
         approval.value.date && 
         approval.value.comments &&
         (approval.value.decision !== 'reject' || approval.value.rejectionReason);
});

const decisionOptions = [
  { label: 'Pilih keputusan…', value: '' },
  { label: 'Luluskan', value: 'approve' },
  { label: 'Tolak', value: 'reject' }
];

function getStatusVariant(status) {
  switch (status) {
    case 'DRAF': return 'secondary';
    case 'SEDANG PROSES': return 'info';
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
    const date = new Date(dateString);
    return date.toLocaleDateString('ms-MY', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return '—';
  }
}

function loadAllowanceData() {
  const id = route.params.id;
  if (!id) { 
    toast.error('ID elaun tidak ditemui'); 
    goBack(); 
    return; 
  }

  // Load from localStorage or use sample data
  const year = route.query.year;
  const type = route.query.type;
  
  if (year && type) {
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
      
      allowanceData.value = {
        ...allowanceData.value, 
        id: id, 
        rujukan: id, 
        year: Number(year), 
        type: type,
        typeLabel: getTypeLabel(type), 
        status: status || 'SEDANG PROSES', 
        count: Number(count) || 0,
        totalAmount: totalAllowance.value, 
        budget: 10000, 
        excessAmount: Math.max(0, totalAllowance.value - 10000)
      };
    } catch (error) { 
      toast.error('Gagal memuatkan data elaun'); 
    }
  } else {
    // Sample data for demonstration
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
      submittedAt: '2024-01-15T11:00:00Z',
      approvedByKJ: 'KJ001',
      approvedAtKJ: '2024-01-16T10:00:00Z',
      notes: 'Elaun melebihi bajet - telah disahkan Ketua Jabatan'
    };
    
    recipients.value = [
      {
        paId: 'PA001',
        name: 'Ahmad bin Ali',
        ic: '800101-01-1234',
        category: 'KPAK',
        parish: 'Masjid Al-Hidayah',
        allowance: 500.00
      },
      {
        paId: 'PA002',
        name: 'Siti binti Omar',
        ic: '850505-05-5678',
        category: 'KPAK',
        parish: 'Masjid Al-Hidayah',
        allowance: 500.00
      }
    ];
  }
}

function getTypeLabel(type) {
  const typeLabels = {
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
  return typeLabels[type] || type;
}

async function approveAllowance() {
  if (!canSubmit.value) return;
  
  submitting.value = true;
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update status
    allowanceData.value.status = 'LULUS';
    allowanceData.value.approvedByKD = 'KD001';
    allowanceData.value.approvedAtKD = new Date().toISOString();
    
    // Save to localStorage
    const year = allowanceData.value.year;
    const type = allowanceData.value.type;
    localStorage.setItem(`et:status:${year}:${type}`, 'LULUS');
    
    toast.success('Elaun berjaya diluluskan');
    
    // Navigate back to main dashboard
    setTimeout(() => {
      router.push('/BF-PA/PE/ET');
    }, 1500);
    
  } catch (error) {
    toast.error('Gagal meluluskan elaun');
  } finally {
    submitting.value = false;
  }
}

async function rejectAllowance() {
  if (!canSubmit.value) return;
  
  submitting.value = true;
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update status
    allowanceData.value.status = 'DITOLAK';
    
    // Save to localStorage
    const year = allowanceData.value.year;
    const type = allowanceData.value.type;
    localStorage.setItem(`et:status:${year}:${type}`, 'DITOLAK');
    
    toast.success('Elaun berjaya ditolak');
    
    // Navigate back to main dashboard
    setTimeout(() => {
      router.push('/BF-PA/PE/ET');
    }, 1500);
    
  } catch (error) {
    toast.error('Gagal menolak elaun');
  } finally {
    submitting.value = false;
  }
}

onMounted(() => {
  loadAllowanceData();
});
</script> 