<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Semakan dan Kelulusan (Ketua Jabatan)
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
              <!-- Ketua Jabatan Review -->
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
                      <p><strong>Disemak oleh:</strong> {{ application.jppaSupport.reviewedBy }}</p>
                      <p><strong>Tarikh:</strong> {{ application.jppaSupport.reviewedAt }}</p>
                      <p><strong>Catatan:</strong> {{ application.jppaSupport.comments }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Ketua Jabatan Review (Current) -->
              <div class="flex items-start justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div class="flex items-start">
                  <Icon name="ph:check-circle" class="w-5 h-5 mr-3 text-orange-500 mt-1" />
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="font-semibold text-orange-900">Ketua Jabatan</h4>
                      <rs-badge variant="warning">Dalam Proses</rs-badge>
                    </div>
                    <p class="text-sm text-orange-700 mb-2">Pengesahan ketua jabatan</p>
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

          <!-- Maklumat Sokongan Ketua Jabatan -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">Maklumat Sokongan Ketua Jabatan</h3>
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

          <!-- Penilaian Ketua Jabatan -->
          <div class="mb-6">
            <FormKit
              type="form"
              id="reviewForm"
              @submit="handleSubmit"
              :actions="false"
            >
              <div class="mb-6">
                <h3 class="font-medium mb-3">Penilaian Ketua Jabatan</h3>

                <div class="mt-4">
                  <FormKit
                    type="checkbox"
                    name="confirmationCheck"
                    label="Saya mengesahkan bahawa semua maklumat dan dokumen telah disemak dan keputusan saya adalah berdasarkan penilaian yang teliti dan menyahkan permohonan elaun ini"
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
              Sahkan
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Approve Confirmation Modal -->
    <rs-modal
      v-model="showApproveModal"
      title="Sahkan Permohonan"
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
import { ref, computed } from 'vue';

definePageMeta({
  title: "Semakan dan Kelulusan",
  description: "Semakan dan kelulusan permohonan bantuan asnaf",
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
    name: "Semakan dan Kelulusan (Ketua Jabatan)",
    type: "current",
    path: "/BF-PA/PE/AB2/03",
  },
]);

// Mock application data
const application = ref({
  referenceNo: "ASN-2024-001",
  asnafName: "Ahmad bin Abdullah",
  kariahName: "Masjid Wilayah Persekutuan",
  bantuanType: "KEWANGAN",
  applicationDate: "01/03/2024",
  status: "Menunggu Pengesahan Ketua Jabatan",
  paId: "PA-2024-001",
  kariahLocation: "Masjid Wilayah Persekutuan",
  assignmentEndDate: "31/12/2024",
  assignmentType: "FITRAH",
  jppaSupport: {
    reviewedBy: "Sarah binti Hamid",
    reviewedAt: "15/05/2024, 10:45",
    isSupported: true,
    comments: "Berdasarkan semakan dokumen dan maklumat yang dikemukakan, permohonan ini disahkan. Asnaf memenuhi semua kriteria yang ditetapkan.",
  },
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
    "Menunggu Pengesahan Ketua Jabatan": "bg-purple-100 text-purple-800",
    Lulus: "bg-green-100 text-green-800",
    "Tidak Lulus": "bg-red-100 text-red-800",
  };
  return statusClasses[status] || "bg-gray-100 text-gray-800";
};

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
    successMessage.value = "Permohonan telah berjaya disahkan.";
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