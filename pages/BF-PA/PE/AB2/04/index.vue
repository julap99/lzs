<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Paparan Permohonan Elaun Yang Diluluskan
          </h2>
          <rs-badge variant="success">
            Sudah Dihantar ke SAP
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
                  <p class="text-sm text-gray-500">Institusi</p>
                  <p class="font-medium">{{ application.institution }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Kariah</p>
                  <p class="font-medium">{{ application.kariah }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Tarikh Tamat Tugasan</p>
                  <p class="font-medium">{{ application.assignmentEndDate }}</p>
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
                  <p class="text-sm text-gray-500">Jumlah Penolong Amil</p>
                  <p class="font-medium">{{ application.totalPenolongAmil }} orang</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Jumlah Keseluruhan Elaun</p>
                  <p class="font-medium text-blue-600">RM {{ application.totalAllowance }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 3: Maklumat Penerima -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">Maklumat Penerima</h3>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-white">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nama
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID Pengenalan
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aktiviti
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jumlah Elaun
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="recipient in recipients" :key="recipient.id">
                      <td class="px-6 py-4 whitespace-nowrap">
                        {{ recipient.name }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        {{ recipient.idPengenalan }}
                      </td>
                      <td class="px-6 py-4">
                        <div class="space-y-1">
                          <div v-for="activity in filteredActivities(recipient.activities)" :key="activity.id" class="flex items-center justify-between">
                            <button
                              @click="openActivityModal(recipient, activity)"
                              class="text-blue-600 hover:text-blue-800 text-sm underline"
                            >
                              {{ activity.name }}
                            </button>
                            <span class="text-sm text-gray-600">
                              <span class="text-green-600">{{ activity.kehadiran - activity.cancelledAsnaf.length }}</span>
                              <span v-if="activity.cancelledAsnaf.length > 0" class="text-red-600">({{ activity.cancelledAsnaf.length }})</span>
                            </span>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap font-medium text-blue-600">
                        RM {{ rowTotal(recipient) }}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot class="bg-white">
                    <tr>
                      <td colspan="3" class="px-6 py-4 text-right font-medium">
                        Jumlah Keseluruhan Elaun:
                      </td>
                      <td class="px-6 py-4 font-medium text-blue-600">
                        RM {{ totalRecipientsAllowance }}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          <!-- Payment Advice Information -->
            <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">Maklumat Payment Advice</h3>
            <div class="bg-green-50 p-4 rounded-lg border border-green-200">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-green-600 font-medium">Payment Advice No:</p>
                  <p class="font-medium">{{ application.paymentAdviceNo }}</p>
                </div>
                <div>
                  <p class="text-sm text-green-600 font-medium">Tarikh Dihantar ke SAP:</p>
                  <p class="font-medium">{{ application.sapSubmissionDate }}</p>
                </div>
                <div>
                  <p class="text-sm text-green-600 font-medium">Status SAP:</p>
                  <p class="font-medium">{{ application.sapStatus }}</p>
                </div>
                <div>
                  <p class="text-sm text-green-600 font-medium">Jumlah Pembayaran:</p>
                  <p class="font-medium text-green-600">RM {{ application.totalAllowance }}</p>
                </div>
              </div>
              
              <!-- Action Button -->
              <div class="mt-4">
                <rs-button 
                  variant="primary-outline" 
                  size="sm" 
                  @click="openPaymentAdviceModal"
                >
                  <Icon name="ic:baseline-visibility" class="mr-2" />
                  Lihat Butiran Payment Advice
                </rs-button>
              </div>
            </div>
          </div>

          <!-- Sejarah Semakan -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Sejarah Semakan
            </h3>
            
            <div class="space-y-4">
              <!-- Eksekutif Review -->
              <div class="flex items-start justify-between p-4">
                <div class="flex items-start">
                  <Icon name="ph:thumbs-up" class="w-5 h-5 mr-3 text-gray-500 mt-1" />
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="font-semibold text-gray-900">Eksekutif</h4>
                      <rs-badge variant="success">Selesai</rs-badge>
                    </div>
                    <p class="text-sm text-gray-700 mb-2">Sokongan eksekutif</p>
                    <div class="text-xs text-gray-600 space-y-1">
                      <p><strong>Disemak oleh:</strong> {{ application.eksekutifApprover }} (Eksekutif)</p>
                      <p><strong>Tarikh:</strong> {{ application.eksekutifApprovalDate }}</p>
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

              <!-- Ketua Divisyen Review -->
              <div class="flex items-start justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div class="flex items-start">
                  <Icon name="ph:check-circle" class="w-5 h-5 mr-3 text-green-500 mt-1" />
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="font-semibold text-green-700">Ketua Divisyen</h4>
                      <rs-badge variant="success">Lulus</rs-badge>
                    </div>
                    <p class="text-sm text-green-700 mb-2">Kelulusan akhir</p>
                    <div class="text-xs text-green-600 space-y-1">
                      <p><strong>Disemak oleh:</strong> {{ application.ketuaDivisyenApprover }} (Ketua Divisyen)</p>
                      <p><strong>Tarikh:</strong> {{ application.ketuaDivisyenApprovalDate }}</p>
                      <p><strong>Catatan:</strong> Permohonan telah diluluskan dan Payment Advice telah dijana</p>
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
            </div>
        </div>
      </template>
    </rs-card>

    <!-- Activity Modal (Read-only) -->
    <rs-modal
      v-model="showActivityModal"
      :title="`Pembatalan Elaun: Senarai Nama Asnaf oleh: ${selectedRecipient?.name || ''}`"
      size="lg"
      position="center"
    >
      <template #body>
        <div class="p-4">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Asnaf
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Pengenalan
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aktiviti
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jumlah Elaun
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="asnaf in activityModalData" :key="asnaf.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="asnaf.isCancelled ? 'text-red-500 line-through' : ''">
                      {{ asnaf.name }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="asnaf.isCancelled ? 'text-red-500 line-through' : ''">
                      {{ asnaf.idPengenalan }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="asnaf.isCancelled ? 'text-red-500 line-through' : ''">
                      {{ asnaf.activity }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="asnaf.isCancelled ? 'text-red-500 line-through' : ''">
                      RM {{ asnaf.allowance }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <rs-badge :variant="asnaf.isCancelled ? 'danger' : 'success'">
                      {{ asnaf.isCancelled ? 'Dibatalkan' : 'Aktif' }}
                    </rs-badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end">
          <rs-button
            variant="primary-outline"
            @click="closeActivityModal"
          >
            Tutup
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Payment Advice Details Modal -->
    <rs-modal v-model="showPaymentAdviceModal" size="lg">
      <template #header>
        <h3 class="text-lg font-semibold">Butiran Payment Advice</h3>
      </template>
      
      <div class="space-y-6">
        <!-- Status Overview -->
        <div class="bg-green-50 p-4 rounded-lg border border-green-200">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="font-medium text-green-800">Status Payment Advice</h4>
              <p class="text-sm text-green-600">{{ application.paymentAdviceStatus }}</p>
            </div>
            <rs-badge variant="success">Berjaya</rs-badge>
          </div>
        </div>

        <!-- Detailed Information Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Generation Details -->
          <div class="space-y-3">
            <h4 class="font-medium text-gray-900">Maklumat Penjanaan</h4>
            <div class="space-y-2">
              <div>
                <p class="text-sm text-gray-500">Payment Advice No:</p>
                <p class="font-medium">{{ application.paymentAdviceNo }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Dijana oleh:</p>
                <p class="font-medium">{{ application.generatedBy }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Tarikh Dijana:</p>
                <p class="font-medium">{{ application.generatedDate }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Kaedah Penjanaan:</p>
                <p class="font-medium">{{ application.generationMethod }}</p>
              </div>
            </div>
          </div>
          
          <!-- SAP Integration -->
          <div class="space-y-3">
            <h4 class="font-medium text-gray-900">Integrasi SAP</h4>
            <div class="space-y-2">
              <div>
                <p class="text-sm text-gray-500">SAP Transaction ID:</p>
                <p class="font-medium">{{ application.sapTransactionId }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Tarikh Dihantar ke SAP:</p>
                <p class="font-medium">{{ application.sapSubmissionDate }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">SAP Response Code:</p>
                <p class="font-medium text-green-600">{{ application.sapResponseCode }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Status SAP:</p>
                <p class="font-medium text-green-600">{{ application.sapStatus }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Timeline -->
        <div class="space-y-3">
          <h4 class="font-medium text-gray-900">Timeline Pembayaran</h4>
          <div class="space-y-2">
            <div class="flex items-center space-x-3">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span class="text-sm">Payment Advice Dijana - {{ application.generatedDate }}</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span class="text-sm">Dihantar ke SAP - {{ application.sapSubmissionDate }}</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span class="text-sm">SAP Response - {{ application.sapResponseDate }}</span>
            </div>
          </div>
        </div>

        <!-- Payment Summary -->
        <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 class="font-medium text-blue-800 mb-2">Ringkasan Pembayaran</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-blue-600">Jumlah Keseluruhan:</p>
              <p class="font-medium text-lg">RM {{ application.totalAllowance }}</p>
            </div>
            <div>
              <p class="text-sm text-blue-600">Bilangan Penerima:</p>
              <p class="font-medium">{{ application.totalPenolongAmil }} Penolong Amil</p>
            </div>
          </div>
        </div>

        <!-- Error Details (if applicable) -->
        <div v-if="application.errorDetails" class="bg-red-50 p-4 rounded-lg border border-red-200">
          <h4 class="font-medium text-red-800 mb-2">Butiran Ralat</h4>
          <div class="space-y-2">
            <div>
              <p class="text-sm text-red-600">Kod Ralat:</p>
              <p class="font-medium">{{ application.errorDetails.code }}</p>
            </div>
            <div>
              <p class="text-sm text-red-600">Mesej Ralat:</p>
              <p class="font-medium">{{ application.errorDetails.message }}</p>
            </div>
            <div>
              <p class="text-sm text-red-600">Cadangan Tindakan:</p>
              <p class="font-medium">{{ application.errorDetails.suggestion }}</p>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <rs-button 
            v-if="application.paymentAdviceStatus === 'Gagal'"
            variant="warning" 
            @click="regeneratePaymentAdvice"
          >
            <Icon name="ic:baseline-refresh" class="mr-2" />
            Jana Semula Payment Advice
          </rs-button>
          <rs-button variant="secondary" @click="closePaymentAdviceModal">
            Tutup
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

definePageMeta({
  title: "Paparan Permohonan Elaun Yang Diluluskan",
  description: "View approved allowance applications",
});

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
    name: "Paparan Permohonan Diluluskan",
    type: "current",
    path: "/BF-PA/PE/AB2/04",
  },
]);

// Mock application data
const application = ref({
  referenceNo: 'REF/2024/001',
  institution: 'Masjid Al-Hidayah',
  kariah: 'Masjid Al-Hidayah',
  assignmentEndDate: '31/12/2024',
  totalPenolongAmil: 3,
  totalAllowance: '450.00',
  paymentAdviceNo: 'PA/2024/001',
  paymentAdviceStatus: 'Berjaya',
  generatedBy: 'Datuk Dr. Ismail bin Ahmad (Ketua Divisyen)',
  generatedDate: '14/03/2024 14:30:25',
  generationMethod: 'Automatik (Selepas Kelulusan)',
  sapTransactionId: 'SAP-TXN-20240314-001',
  sapSubmissionDate: '14/03/2024 14:31:10',
  sapResponseCode: '200',
  sapResponseDate: '14/03/2024 14:31:45',
  sapStatus: 'Sudah Dihantar ke SAP',
  retryAttempts: 0,
  errorDetails: null,
  eksekutifApprover: 'Ahmad bin Abdullah',
  eksekutifApprovalDate: '10/03/2024',
  ketuaJabatanApprover: 'Mohd Ali bin Hassan',
  ketuaJabatanApprovalDate: '12/03/2024',
  ketuaDivisyenApprover: 'Datuk Dr. Ismail bin Ahmad',
  ketuaDivisyenApprovalDate: '14/03/2024',
});

// Mock recipients data (same structure as AB2/01)
const recipients = ref([
  {
    id: 1,
    name: 'Ahmad bin Abdullah',
    idPengenalan: '850123-10-1234',
    activities: [
      {
        id: 1,
        name: 'BANCIAN BARU : PER BORANG PERMOHONAN',
        allowanceRate: '30.00',
        kehadiran: 4,
        originalKehadiran: 5,
        cancelledAsnaf: [
          { id: 1, name: 'Siti Fatimah binti Omar', idPengenalan: '920456-78-9012' }
        ]
      },
      {
        id: 2,
        name: 'KEMASKINI : PER BORANG PERMOHONAN',
        allowanceRate: '20.00',
        kehadiran: 3,
        originalKehadiran: 3,
        cancelledAsnaf: []
      }
    ]
  },
  {
    id: 2,
    name: 'Mohd Razak bin Ibrahim',
    idPengenalan: '780912-34-5678',
    activities: [
      {
        id: 1,
        name: 'BANCIAN BARU : PER BORANG PERMOHONAN',
        allowanceRate: '30.00',
        kehadiran: 4,
        originalKehadiran: 4,
        cancelledAsnaf: []
      },
      {
        id: 2,
        name: 'KEMASKINI : PER BORANG PERMOHONAN',
        allowanceRate: '20.00',
        kehadiran: 1,
        originalKehadiran: 2,
        cancelledAsnaf: [
          { id: 2, name: 'Abdul Rahman bin Ismail', idPengenalan: '880123-45-6789' }
        ]
      },
      {
        id: 3,
        name: 'PERMOHONAN BANTUAN : PER BORANG PERMOHONAN',
        allowanceRate: '25.00',
        kehadiran: 3,
        originalKehadiran: 3,
        cancelledAsnaf: []
      }
    ]
  },
  {
    id: 3,
    name: 'Siti Aminah binti Hassan',
    idPengenalan: '910345-67-8901',
    activities: [
      {
        id: 1,
        name: 'BANCIAN BARU : PER BORANG PERMOHONAN',
        allowanceRate: '30.00',
        kehadiran: 6,
        originalKehadiran: 6,
        cancelledAsnaf: []
      }
    ]
  }
]);

// Modal states
const showActivityModal = ref(false);
const selectedRecipient = ref(null);
const selectedActivity = ref(null);
const activityModalData = ref([]);
const showPaymentAdviceModal = ref(false);

// Helper functions
const filteredActivities = (activities) => {
  return activities.filter(activity => 
    ['BANCIAN BARU : PER BORANG PERMOHONAN', 'KEMASKINI : PER BORANG PERMOHONAN', 'PERMOHONAN BANTUAN : PER BORANG PERMOHONAN'].includes(activity.name)
  );
};

const rowTotal = (recipient) => {
  return filteredActivities(recipient.activities)
    .reduce((total, activity) => {
      const activeCount = activity.kehadiran - activity.cancelledAsnaf.length;
      return total + (activeCount * parseFloat(activity.allowanceRate));
    }, 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const totalRecipientsAllowance = computed(() => {
  return recipients.value
    .reduce((total, recipient) => total + parseFloat(rowTotal(recipient).replace(/,/g, '')), 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
});

const openActivityModal = (recipient, activity) => {
  selectedRecipient.value = recipient;
  selectedActivity.value = activity;
  activityModalData.value = generateMockAsnafData(activity);
  showActivityModal.value = true;
};

const closeActivityModal = () => {
  showActivityModal.value = false;
  selectedRecipient.value = null;
  selectedActivity.value = null;
  activityModalData.value = [];
};

const generateMockAsnafData = (activity) => {
  const mockAsnaf = [
    { id: 1, name: 'Ahmad bin Abdullah', idPengenalan: '850123-10-1234', activity: activity.name, allowance: activity.allowanceRate || '30.00', isCancelled: false },
    { id: 2, name: 'Siti Fatimah binti Omar', idPengenalan: '920456-78-9012', activity: activity.name, allowance: activity.allowanceRate || '30.00', isCancelled: false },
    { id: 3, name: 'Mohd Ali bin Hassan', idPengenalan: '880123-45-6789', activity: activity.name, allowance: activity.allowanceRate || '30.00', isCancelled: false },
    { id: 4, name: 'Nurul Ain binti Ahmad', idPengenalan: '910345-67-8901', activity: activity.name, allowance: activity.allowanceRate || '30.00', isCancelled: false },
    { id: 5, name: 'Abdul Rahman bin Ismail', idPengenalan: '870234-56-7890', activity: activity.name, allowance: activity.allowanceRate || '30.00', isCancelled: false },
    { id: 6, name: 'Fatimah binti Yusof', idPengenalan: '930567-89-0123', activity: activity.name, allowance: activity.allowanceRate || '30.00', isCancelled: false }
  ];

  // Mark cancelled asnaf based on activity data
  activity.cancelledAsnaf.forEach(cancelled => {
    const asnaf = mockAsnaf.find(a => a.idPengenalan === cancelled.idPengenalan);
    if (asnaf) {
      asnaf.isCancelled = true;
    }
  });

  return mockAsnaf;
};

// Payment Advice modal functions
const openPaymentAdviceModal = () => {
  showPaymentAdviceModal.value = true;
};

const closePaymentAdviceModal = () => {
  showPaymentAdviceModal.value = false;
};

const regeneratePaymentAdvice = () => {
  // Simulate regeneration process
  console.log('Regenerating Payment Advice...');
  
  // Update application data to show regeneration
  application.value.paymentAdviceStatus = 'Dalam Proses';
  application.value.generatedDate = new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  // Simulate API call delay
  setTimeout(() => {
    // 80% success rate
    const isSuccess = Math.random() > 0.2;
    
    if (isSuccess) {
      application.value.paymentAdviceStatus = 'Berjaya';
      application.value.sapStatus = 'Sudah Dihantar ke SAP';
      application.value.sapResponseCode = '200';
      application.value.errorDetails = null;
    } else {
      application.value.paymentAdviceStatus = 'Gagal';
      application.value.sapStatus = 'Gagal Dihantar ke SAP';
      application.value.sapResponseCode = '500';
      application.value.errorDetails = {
        code: 'SAP_ERR_500',
        message: 'SAP system temporarily unavailable',
        suggestion: 'Please try again later or contact system administrator'
      };
    }
    
    // Close modal after regeneration
    closePaymentAdviceModal();
  }, 2000);
};
</script>

<style scoped>
/* Add any additional styles here */
</style> 