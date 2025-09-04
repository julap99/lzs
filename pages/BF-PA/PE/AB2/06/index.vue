<!-- 
  RTMF SCREEN: PA-PE-AB2-06
  PURPOSE: Semakan dan Kelulusan (Ketua Divisyen)
  DESCRIPTION: Final verification and approval by Division Head for assignment allowances
  ROUTE: /BF-PA/PE/AB2/06
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Semakan dan Kelulusan (Ketua Divisyen)
          </h2>
          <rs-badge
            v-if="application.status"
            :variant="getStatusVariant(application.status)"
          >
            {{ application.status }}
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
                  <p class="text-sm text-gray-500">Nama Aktiviti</p>
                  <p class="font-medium">{{ application.activityName }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Jenis Aktiviti</p>
                  <p class="font-medium">{{ getActivityTypeLabel(application.activityType) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Tarikh Aktiviti</p>
                  <p class="font-medium">{{ application.activityDate }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Lokasi</p>
                  <p class="font-medium">{{ application.location }}</p>
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
                <div>
                  <p class="text-sm text-gray-500">Jumlah Penolong Amil</p>
                  <p class="font-medium">{{ application.totalPenolongAmil }} orang</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 3: Maklumat Penerima -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">Maklumat Penerima</h3>
            <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div class="overflow-x-auto">
                <table class="min-w-full text-sm divide-y">
                  <thead class="bg-gray-50 text-left">
                    <tr>
                      <th class="px-6 py-3 font-medium text-gray-900">Nama</th>
                      <th class="px-6 py-3 font-medium text-gray-900">ID Pengenalan</th>
                      <th class="px-6 py-3 font-medium text-gray-900">Aktiviti</th>
                      <th class="px-6 py-3 font-medium text-gray-900">Jumlah Elaun</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y bg-white">
                    <tr v-for="(pa, index) in recipients" :key="pa.id">
                      <td class="px-6 py-3">{{ pa.name }}</td>
                      <td class="px-6 py-3">{{ pa.idPengenalan }}</td>
                      <td class="px-6 py-3">
                        <ul class="list-disc pl-5 space-y-1 text-sm">
                          <li v-for="activity in filteredActivities(pa.activities)" :key="activity.id">
                            <button 
                              @click="openActivityModal(pa, activity)"
                              class="text-blue-600 hover:text-blue-800 underline"
                            >
                              {{ activity.name }}
                            </button>
                            <span class="text-gray-600">: 
                              <span class="text-green-600 font-medium">{{ activity.kehadiran }}</span>
                              <span v-if="activity.cancelledAsnaf.length > 0" class="text-red-600">({{ activity.cancelledAsnaf.length }})</span>
                            </span>
                          </li>
                          <li v-if="filteredActivities(pa.activities).length === 0" class="list-none text-gray-400">—</li>
                        </ul>
                      </td>
                      <td class="px-6 py-3 font-semibold">RM {{ rowTotal(pa).toFixed(2) }}</td>
                    </tr>
                    <tr v-if="recipients.length === 0">
                      <td class="px-6 py-6 text-center text-gray-500" colspan="4">Tiada penerima dipilih.</td>
                    </tr>
                  </tbody>
                  <tfoot class="bg-gray-50">
                    <tr>
                      <td class="px-6 py-3 text-right font-medium" colspan="3">Jumlah Keseluruhan Elaun:</td>
                      <td class="px-6 py-3 font-semibold">RM {{ totalRecipientsAllowance.toFixed(2) }}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>


          <!-- Review History -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Sejarah Semakan
            </h3>
            
            <div class="space-y-4">
              <!-- JPPA Review -->
              <div class="flex items-start justify-between p-4">
                <div class="flex items-start">
                  <Icon name="ph:thumbs-up" class="w-5 h-5 mr-3 text-gray-500 mt-1" />
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="font-semibold text-gray-900">JPPA</h4>
                      <rs-badge variant="success">Selesai</rs-badge>
                    </div>
                    <p class="text-sm text-gray-700 mb-2">Sokongan eksekutif</p>
                    <div class="text-xs text-gray-600 space-y-1">
                      <p><strong>Disemak oleh:</strong> Sarah binti Hamid (Eksekutif)</p>
                      <p><strong>Tarikh:</strong> 15/05/2024, 10:45</p>
                      <p><strong>Catatan:</strong> Berdasarkan semakan dokumen dan maklumat yang dikemukakan, permohonan ini disahkan. Asnaf memenuhi semua kriteria yang ditetapkan.</p>
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
                      <p><strong>Disemak oleh:</strong> Ahmad bin Ismail (Ketua Jabatan)</p>
                      <p><strong>Tarikh:</strong> 18/05/2024, 14:30</p>
                      <p><strong>Catatan:</strong> Permohonan telah disemak dan diluluskan untuk diteruskan ke peringkat seterusnya.</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Ketua Divisyen Review (Current) -->
              <div class="flex items-start justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div class="flex items-start">
                  <Icon name="ph:check-circle" class="w-5 h-5 mr-3 text-orange-500 mt-1" />
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="font-semibold text-orange-900">Ketua Divisyen</h4>
                      <rs-badge variant="warning">Dalam Proses</rs-badge>
                    </div>
                    <p class="text-sm text-orange-700 mb-2">Pengesahan ketua divisyen</p>
                    <div class="text-xs text-orange-600 space-y-1">
                      <p><strong>Disemak oleh:</strong> -</p>
                      <p><strong>Tarikh:</strong> -</p>
                      <p><strong>Status:</strong> Menunggu keputusan pengesahan</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Penilaian Ketua Divisyen -->
          <div class="mb-6">
            <FormKit
              type="form"
              id="reviewForm"
              @submit="handleSubmit"
              :actions="false"
            >
              <div class="mb-6">
                <h3 class="font-medium mb-3">Penilaian Ketua Divisyen</h3>

                <div class="mt-4">
                  <FormKit
                    type="checkbox"
                    name="confirmationCheck"
                    label="Saya mengesahkan bahawa semua maklumat telah disemak dan keputusan saya adalah berdasarkan penilaian yang teliti dan meluluskan permohonan elaun ini"
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
              Lulus
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Approve Confirmation Modal -->
    <rs-modal
      v-model="showApproveModal"
      title="Lulus Permohonan"
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
              label="Ulasan (Jika Perlu)"
              placeholder="Masukkan ulasan jika perlu"
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
            Lulus
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Reject Confirmation Modal -->
    <rs-modal
      v-model="showRejectModal"
      title="Tolak Permohonan"
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
            Tolak
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Payment Advice Success Modal -->
    <rs-modal
      v-model="showPaymentAdviceModal"
      title="Payment Advice Telah Dijana"
      size="md"
      position="center"
    >
      <template #body>
        <div class="text-center p-6">
          <Icon
            name="heroicons:check-circle"
            class="text-green-500 mx-auto mb-4"
            size="64"
          />
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Berjaya!</h3>
          <p class="text-gray-700 mb-4">
            Payment Advice telah dijana dan dihantar kepada SAP.
          </p>
          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <p class="text-sm text-green-800">
              <strong>No. Rujukan:</strong> PA-2024-001<br>
              <strong>Jumlah Elaun:</strong> RM {{ totalRecipientsAllowance.toFixed(2) }}<br>
              <strong>Tarikh Dijana:</strong> {{ new Date().toLocaleDateString('ms-MY') }}
            </p>
          </div>
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

    <!-- Activity Modal: Read-only Review -->
    <div v-if="showActivityModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-5xl mx-4 max-h-[90vh] overflow-hidden">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold">Pembatalan Elaun: Senarai Nama Asnaf oleh: {{ selectedRecipient?.name || '—' }}</h3>
            <button 
              @click="closeActivityModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <Icon name="ic:baseline-close" size="24" />
            </button>
          </div>
          
          <div class="overflow-x-auto rounded-lg border">
            <table class="min-w-full text-sm divide-y">
              <thead class="bg-gray-50 text-left">
                <tr>
                  <th class="px-4 py-3 font-medium text-gray-900">Status</th>
                  <th class="px-4 py-3 font-medium text-gray-900">Nama Asnaf</th>
                  <th class="px-4 py-3 font-medium text-gray-900">ID Pengenalan</th>
                  <th class="px-4 py-3 font-medium text-gray-900">Aktiviti</th>
                  <th class="px-4 py-3 font-medium text-gray-900">Jumlah Elaun</th>
                  <th class="px-4 py-3 font-medium text-gray-900">Catatan</th>
                </tr>
              </thead>
              <tbody class="divide-y bg-white">
                <tr v-for="(item, index) in activityModalData" :key="index" 
                    :class="[
                      'hover:bg-gray-50',
                      item._isCancelled ? 'bg-red-50 opacity-75' : ''
                    ]">
                  <td class="px-4 py-3">
                    <span 
                      class="px-2 py-1 text-xs font-medium rounded-full"
                      :class="item._isCancelled ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'"
                    >
                      {{ item._isCancelled ? 'Dibatalkan' : 'Aktif' }}
                    </span>
                  </td>
                  <td class="px-4 py-3 font-medium" 
                      :class="item._isCancelled ? 'text-red-600 line-through' : 'text-gray-900'">
                    {{ item.namaAsnaf }}
                  </td>
                  <td class="px-4 py-3" 
                      :class="item._isCancelled ? 'text-red-600 line-through' : 'text-gray-900'">
                    {{ item.idPengenalan }}
                  </td>
                  <td class="px-4 py-3" 
                      :class="item._isCancelled ? 'text-red-600 line-through' : 'text-gray-900'">
                    {{ item.aktiviti }}
                  </td>
                  <td class="px-4 py-3" 
                      :class="item._isCancelled ? 'text-red-600 line-through' : 'text-gray-900'">
                    RM {{ Number(item.jumlahElaun).toFixed(2) }}
                  </td>
                  <td class="px-4 py-3">
                    <div class="text-xs text-gray-600">
                      {{ item._catatan || '—' }}
                    </div>
                  </td>
                </tr>
                <tr v-if="activityModalData.length === 0">
                  <td class="px-4 py-6 text-center text-gray-500" colspan="6">Tiada data untuk dipaparkan.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="flex items-center justify-end gap-3 mt-6">
            <rs-button
              variant="secondary"
              size="sm"
              @click="closeActivityModal"
            >
              Tutup
            </rs-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'nuxt/app';
import { useToast } from 'vue-toastification';

definePageMeta({
  title: "Semakan dan Kelulusan (Ketua Divisyen)",
  description: "Final verification and approval by Division Head",
});

const route = useRoute();
const toast = useToast();

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
    name: "Kelulusan Ketua Divisyen",
    type: "current",
    path: "/BF-PA/PE/AB2/06",
  },
]);

// Mock application data
const application = ref({
  referenceNo: 'REF/2024/001',
  activityName: 'Program Khidmat Masyarakat',
  activityType: 'PROGRAM',
  activityDate: '2024-03-15',
  location: 'Masjid Al-Amin, Shah Alam',
  status: 'Menunggu Kelulusan Ketua Divisyen',
  kariahLocation: 'Masjid Al-Amin',
  assignmentEndDate: '2024-03-20',
  assignmentType: 'KARIAH',
  totalPenolongAmil: 5,
  jppaApprovalDate: '2024-03-16',
  jppaApprover: 'Ahmad bin Abdullah',
  ketuaJabatanApprovalDate: '2024-03-17',
  ketuaJabatanApprover: 'Mohd Ali bin Hassan'
});

// Mock recipients data (processed from AB2/01)
const recipients = ref([
  {
    id: 1,
    name: 'Ahmad bin Abdullah',
    idPengenalan: '800101011234',
    activities: [
      {
        id: 1,
        name: 'BANCIAN BARU : PER BORANG PERMOHONAN',
        allowanceRate: '30.00',
        kehadiran: 2,
        originalKehadiran: 3,
        cancelledAsnaf: [1]
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
    idPengenalan: '750315085678',
    activities: [
      {
        id: 1,
        name: 'BANCIAN BARU : PER BORANG PERMOHONAN',
        allowanceRate: '30.00',
        kehadiran: 3,
        originalKehadiran: 3,
        cancelledAsnaf: []
      },
      {
        id: 2,
        name: 'KEMASKINI : PER BORANG PERMOHONAN',
        allowanceRate: '20.00',
        kehadiran: 2,
        originalKehadiran: 3,
        cancelledAsnaf: [2]
      },
      {
        id: 3,
        name: 'PERMOHONAN BANTUAN : PER BORANG PERMOHONAN',
        allowanceRate: '25.00',
        kehadiran: 1,
        originalKehadiran: 3,
        cancelledAsnaf: [1, 3]
      }
    ]
  },
  {
    id: 3,
    name: 'Siti Aminah binti Hassan',
    idPengenalan: '820520149012',
    activities: [
      {
        id: 1,
        name: 'BANCIAN BARU : PER BORANG PERMOHONAN',
        allowanceRate: '30.00',
        kehadiran: 3,
        originalKehadiran: 3,
        cancelledAsnaf: []
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
  }
]);

// Activity modal state
const showActivityModal = ref(false);
const selectedRecipient = ref(null);
const selectedActivity = ref(null);
const activityModalData = ref([]);

// Approval form data
const approvalData = ref({
  confirmationCheck: false,
  comments: '',
  rejectionReason: ''
});

// Modal states
const showApproveModal = ref(false);
const showRejectModal = ref(false);
const showPaymentAdviceModal = ref(false);
const isSubmitting = ref(false);

// Helper functions
const filteredActivities = (activities = []) => {
  const allowed = new Set([
    'BANCIAN BARU : PER BORANG PERMOHONAN',
    'KEMASKINI : PER BORANG PERMOHONAN',
    'PERMOHONAN BANTUAN : PER BORANG PERMOHONAN',
  ]);
  return (activities || []).filter(a => allowed.has(a.name));
};

const rowTotal = (pa) => pa.activities.reduce((s, a) => s + (parseFloat(a.allowanceRate) * a.kehadiran), 0);

// Computed properties
const totalRecipientsAllowance = computed(() => {
  return recipients.value.reduce((total, pa) => total + rowTotal(pa), 0);
});

// Helper functions
const getActivityTypeLabel = (type) => {
  const types = {
    'PROGRAM': 'Program',
    'MESYUARAT': 'Mesyuarat',
    'TUGASAN': 'Tugasan'
  };
  return types[type] || type;
};

const getAssignmentTypeLabel = (type) => {
  const types = {
    'KARIAH': 'Kariah',
    'FITRAH': 'Fitrah',
    'PADI': 'Padi',
    'WAKAF': 'Wakaf'
  };
  return types[type] || type;
};

const getStatusClass = (status) => {
  switch (status) {
    case 'Menunggu Kelulusan Ketua Divisyen':
      return 'bg-purple-100 text-purple-800'
    case 'Diluluskan':
      return 'bg-green-100 text-green-800'
    case 'Ditolak':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
};

const getStatusVariant = (status) => {
  switch (status) {
    case 'Menunggu Kelulusan Ketua Divisyen':
      return 'warning'
    case 'Diluluskan':
      return 'success'
    case 'Ditolak':
      return 'danger'
    default:
      return 'secondary'
  }
};

// Activity modal functions
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
    { namaAsnaf: 'Ahmad bin Ali', idPengenalan: '800101011234', aktiviti: activity.name, jumlahElaun: '30.00', _isCancelled: false, _catatan: '' },
    { namaAsnaf: 'Siti Fatimah binti Omar', idPengenalan: '820520149012', aktiviti: activity.name, jumlahElaun: '30.00', _isCancelled: false, _catatan: '' },
    { namaAsnaf: 'Mohd Hassan bin Abdullah', idPengenalan: '750315085678', aktiviti: activity.name, jumlahElaun: '30.00', _isCancelled: false, _catatan: '' },
  ];
  
  // Simulate some cancelled Asnaf
  if (activity.cancelledAsnaf && activity.cancelledAsnaf.length > 0) {
    activity.cancelledAsnaf.forEach((cancelledId, index) => {
      if (mockAsnaf[index]) {
        mockAsnaf[index]._isCancelled = true;
        mockAsnaf[index]._catatan = 'Dibatalkan oleh Eksekutif';
      }
    });
  }
  
  return mockAsnaf;
};


// Form handlers
const handleApprove = async () => {
  isSubmitting.value = true;
  
  try {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    showApproveModal.value = false;
    showPaymentAdviceModal.value = true;
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
    toast.success('Permohonan telah ditolak.');
    // Navigate back to dashboard
    setTimeout(() => {
      navigateTo('/BF-PA/PE/AB2');
    }, 1500);
  } catch (error) {
    console.error('Error rejecting application:', error);
  } finally {
    isSubmitting.value = false;
  }
};

// Load data on mount
onMounted(() => {
  // Load application data based on route params if needed
  console.log('Loading Ketua Divisyen approval screen');
});
</script>

<style scoped>
/* Add any additional styles here */
</style> 