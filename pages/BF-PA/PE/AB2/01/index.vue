<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Kira Jumlah Elaun Mengikut Penolong Amil dan Kariah
          </h2>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <FormKit
            type="form"
            id="allowanceForm"
            :actions="false"
            @submit="handleSubmit"
          >
            <!-- Section 1: Elaun Tugasan -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-4">Elaun Tugasan</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormKit
                  type="select"
                  name="kariah"
                  label="Kariah"
                  placeholder="Pilih kariah"
                  :options="kariahCategories"
                  validation="required"
                  :validation-messages="{
                    required: 'Kariah diperlukan',
                  }"
                />
                <!-- Institusi -->
                <FormKit
                  type="select"
                  name="institusi"
                  label="Institusi"
                  placeholder="Pilih institusi"
                  :options="kariahLocations"
                  validation="required"
                  :validation-messages="{
                    required: 'Institusi diperlukan',
                  }"
                />

                <!-- Tarikh Tamat Tugasan -->
                <FormKit
                  type="date"
                  name="assignmentEndDate"
                  label="Tarikh Tamat Tugasan"
                  :value="currentDate"
                  validation="required"
                  :validation-messages="{
                    required: 'Tarikh Tamat Tugasan diperlukan',
                  }"
                />

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
              <rs-button
                type="submit"
                variant="primary"
                @click="handleKira"
              >
                Kira
              </rs-button>
            </div>
          </FormKit>
        </div>
      </template>
    </rs-card>

    <!-- Section 2: Senarai Penerima (shown after clicking Kira) -->
    <div v-if="showCalculationTable" class="mt-8">
      <h3 class="text-lg font-semibold mb-4">Senarai Penerima</h3>
      
      <div class="bg-gray-50 p-4 rounded-lg">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-white">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <FormKit
                    v-model="selectAllCandidates"
                    type="checkbox"
                    :classes="{ input: '!w-4 !h-4' }"
                    @input="toggleSelectAllCandidates"
                  />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Pengenalan
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aktiviti : Kehadiran (kali)
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Elaun
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah Elaun
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <template v-for="(pa, index) in penolongAmil" :key="pa.id">
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div v-if="!isInRecipients(pa.id)">
                      <FormKit
                        v-model="pa._checked"
                      type="checkbox"
                        :classes="{ input: '!w-4 !h-4' }"
                      />
                    </div>
                    <div v-else>
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Telah Dipilih
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ pa.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ pa.idPengenalan }}
                  </td>
                  <td class="px-6 py-4 align-top">
                    <ul class="list-disc pl-5 space-y-0.5 text-xs leading-tight">
                      <li v-for="activity in filteredActivities(pa.activities)" :key="activity.id">
                        <button class="font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-left"
                                @click="openActivityModal(pa, activity)">
                          {{ activity.name }}
                        </button>
                        <span class="text-sm">
                          : <span class="text-green-600 font-medium">{{ activity.kehadiran }}</span>
                          <span v-if="activity.cancelledAsnaf.length > 0" class="text-red-600">({{ activity.cancelledAsnaf.length }})</span>
                        </span>
                      </li>
                      <li v-if="filteredActivities(pa.activities).length === 0" class="list-none text-gray-500">
                        Tiada rekod aktiviti.
                      </li>
                    </ul>
                  </td>
                  <td class="px-6 py-4 text-center align-top">
                    <ul class="list-none space-y-1">
                      <li v-for="activity in filteredActivities(pa.activities)" :key="activity.id">
                        RM {{ Number(activity.allowanceRate).toFixed(2) }}
                      </li>
                    </ul>
                  </td>
                  <td class="px-6 py-4 text-center font-medium">
                    RM {{ pa.activities.reduce((total, activity) => total + (parseFloat(activity.allowanceRate) * activity.kehadiran), 0).toFixed(2) }}
                  </td>
                  
                </tr>
              </template>
            </tbody>

          </table>
        </div>
      </div>

      <!-- Kemas Kini Senarai Button -->
      <div class="flex items-center justify-end mb-6">
        <rs-button
          variant="primary"
          :disabled="selectedRowsCount === 0"
          @click="commitSelected"
        >
          <Icon name="ic:baseline-check" class="mr-2" />
          Kemas Kini Senarai ({{ selectedRowsCount }})
        </rs-button>
      </div>

      <!-- Section 3: Maklumat Penerima -->
      <div class="mt-8">
        <h3 class="text-lg font-semibold mb-4">Maklumat Penerima</h3>
        <div class="overflow-x-auto rounded-lg border">
          <table class="min-w-full divide-y">
            <thead class="bg-gray-50 text-left">
              <tr>
                <th class="px-6 py-3 text-sm font-medium text-gray-900">Nama</th>
                <th class="px-6 py-3 text-sm font-medium text-gray-900">ID Pengenalan</th>
                <th class="px-6 py-3 text-sm font-medium text-gray-900">Aktiviti</th>
                <th class="px-6 py-3 text-sm font-medium text-gray-900">Jumlah Elaun</th>
                <th class="px-6 py-3 text-sm font-medium text-gray-900">Tindakan</th>
              </tr>
            </thead>
            <tbody class="divide-y bg-white">
              <tr v-for="(pa, index) in recipients" :key="pa.id">
                <td class="px-6 py-3">{{ pa.name }}</td>
                <td class="px-6 py-3">{{ pa.idPengenalan }}</td>
                <td class="px-6 py-3">
                  <ul class="list-disc pl-5 space-y-1 text-sm">
                    <li v-for="activity in filteredActivities(pa.activities)" :key="activity.id">{{ activity.name }} ({{ activity.kehadiran }})</li>
                    <li v-if="filteredActivities(pa.activities).length === 0" class="list-none text-gray-400">—</li>
                  </ul>
                </td>
                <td class="px-6 py-3 font-semibold">RM {{ rowTotal(pa).toFixed(2) }}</td>
                <td class="px-6 py-3">
                  <rs-button 
                    variant="danger" 
                    size="sm" 
                    @click="removeRecipient(index)"
                  >
                    <Icon name="ic:outline-delete" size="16" />
                  </rs-button>
                </td>
              </tr>
              <tr v-if="recipients.length === 0">
                <td class="px-6 py-6 text-center text-gray-500" colspan="5">Tiada penerima dipilih.</td>
              </tr>
            </tbody>
            <tfoot class="bg-gray-50">
              <tr>
                <td class="px-6 py-3 text-right font-medium" colspan="4">Jumlah Keseluruhan Elaun:</td>
                <td class="px-6 py-3 font-semibold">RM {{ totalRecipientsAllowance.toFixed(2) }}</td>
                <td class="px-6 py-3"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="flex items-center justify-end gap-2 mt-6">
        <rs-button
          variant="secondary"
          size="sm"
          :disabled="saving"
          @click="saveDraft"
        >
          <Icon name="ic:baseline-save" class="mr-2" />
          Simpan draf
        </rs-button>
        <rs-button
          variant="primary"
          size="sm"
          :disabled="!canSubmit || saving"
          @click="openSubmitModal"
        >
          <Icon name="ic:baseline-send" class="mr-2" />
          Hantar
        </rs-button>
      </div>
    </div>

    <!-- Modal Aktiviti: Pembatalan Elaun -->
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
                  <th class="px-4 py-3 font-medium text-gray-900 w-16">Checkbox</th>
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
                    <FormKit
                      v-model="item._checked"
                      type="checkbox"
                      :classes="{ input: '!w-4 !h-4' }"
                    />
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
                    <FormKit
                      v-if="item._checked"
                      v-model="item._catatan"
                      type="textarea"
                      rows="2"
                      placeholder="Masukkan catatan pembatalan..."
                      :classes="{ input: '!py-2 !px-2 text-xs' }"
                    />
              <input
                      v-else
                type="text"
                      disabled
                      :value="item._catatan"
                      class="w-full py-2 px-2 text-xs bg-gray-100 text-gray-500 border border-gray-200 rounded"
                    />
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
              Batal
            </rs-button>
            <rs-button
              variant="primary"
              size="sm"
              @click="applyActivityModalChanges"
              :disabled="!hasActivityChanges"
            >
              Pilih
            </rs-button>
          </div>
        </div>
      </div>
    </div>

        <!-- Hantar Confirmation Modal -->
    <div v-if="showSubmitModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-4">Hantar untuk Kelulusan</h3>
          <p class="text-sm text-gray-600 mb-4">Pastikan semua maklumat adalah betul sebelum menghantar untuk kelulusan.</p>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Ulasan Eksekutif</label>
            <FormKit
              v-model="submitNotes"
              type="textarea"
              rows="3"
              placeholder="Masukkan ulasan akhir sebelum menghantar..."
              :classes="{ input: '!py-2' }"
            />
            <p class="text-xs text-gray-600 mt-1">Ulasan ini akan dilihat oleh Ketua Jabatan dan Ketua Divisyen</p>
          </div>
          
          <div class="flex items-center justify-end gap-3 mt-6">
            <rs-button
              variant="secondary-outline"
              size="sm"
              @click="closeSubmitModal"
            >
              Batal
            </rs-button>
            <rs-button
              variant="primary"
              size="sm"
              @click="confirmSubmit"
              :disabled="saving"
            >
              <Icon name="ic:baseline-send" class="mr-2" />
              {{ saving ? 'Menghantar...' : 'Hantar' }}
            </rs-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

definePageMeta({
  title: "Kira Jumlah Elaun",
  description: "Kira jumlah elaun mengikut penolong amil dan kariah",
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
    name: "Kira Jumlah Elaun",
    type: "current",
    path: "/BF-PA/PE/AB2/01",
  },
]);

// Form state
const isSubmitting = ref(false);
const showCalculationTable = ref(false);
const saving = ref(false);
const showSubmitModal = ref(false);
const submitNotes = ref('');

// Current date for default value
const currentDate = ref(new Date().toISOString().split('T')[0]);

// Activity modal state
const showActivityModal = ref(false);
const selectedRecipient = ref(null);
const selectedActivityName = ref('');
const selectedActivity = ref(null);
const activityModalData = ref([]);

// Checkbox selection state
const selectedRows = ref([]);
const recipients = ref([]);
const selectAllCandidates = ref(false);

// Mock data for dropdowns
const kariahCategories = [
  { label: 'Kariah', value: 'KARIAH' },
  { label: 'Padi', value: 'PADI' },
  { label: 'Fitrah', value: 'FITRAH' },
  { label: 'Komuniti', value: 'KOMUNITI' },
];

const kariahLocations = [
  { label: 'Masjid Sultan Salahuddin Abdul Aziz Shah, Shah Alam', value: 'MSJ-SGR-001' },
  { label: 'Masjid Al-Hidayah, Petaling Jaya', value: 'MSJ-SGR-002' },
  { label: 'Masjid Al-Ikhlas, Subang Jaya', value: 'MSJ-SGR-003' },
  { label: 'Masjid Al-Muttaqin, Klang', value: 'MSJ-SGR-004' },
  { label: 'Masjid Al-Rahman, Kajang', value: 'MSJ-SGR-005' },
  { label: 'Masjid Al-Amin, Ampang', value: 'MSJ-SGR-006' },
  { label: 'Masjid Al-Huda, Hulu Langat', value: 'MSJ-SGR-007' },
  { label: 'Masjid Al-Mustaqim, Sepang', value: 'MSJ-SGR-008' },
  { label: 'Masjid Al-Istiqamah, Kuala Selangor', value: 'MSJ-SGR-009' },
  { label: 'Masjid Al-Hidayah, Sabak Bernam', value: 'MSJ-SGR-010' },
];



// Helpers
const filteredActivities = (activities = []) => {
  const allowed = new Set([
    'BANCIAN BARU : PER BORANG PERMOHONAN',
    'KEMASKINI : PER BORANG PERMOHONAN',
    'PERMOHONAN BANTUAN : PER BORANG PERMOHONAN',
  ]);
  return (activities || []).filter(a => allowed.has(a.name));
};

const penolongAmil = ref([
  {
    id: 1,
    name: 'Ahmad bin Abdullah',
    idPengenalan: '800101011234',
    kehadiran: 'Hadir',
    _checked: false,
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
  },
  {
    id: 2,
    name: 'Mohd Razak bin Ibrahim',
    idPengenalan: '750315085678',
    kehadiran: 'Tidak Hadir',
    _checked: false,
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
        originalKehadiran: 2,
        cancelledAsnaf: []
      },
      {
        id: 3,
        name: 'PERMOHONAN BANTUAN : PER BORANG PERMOHONAN',
        allowanceRate: '25.00',
        kehadiran: 1,
        originalKehadiran: 1,
        cancelledAsnaf: []
      }
    ]
  },
  {
    id: 3,
    name: 'Siti Aminah binti Hassan',
    idPengenalan: '820520149012',
    kehadiran: 'Hadir',
    _checked: false,
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
        kehadiran: 4,
        originalKehadiran: 4,
        cancelledAsnaf: []
      }
    ]
  }
]);

const totalAllowance = computed(() => {
  return penolongAmil.value
    .filter(pa => selectedRows.value.includes(pa.id))
    .reduce((total, pa) => {
      return total + pa.activities.reduce((activityTotal, activity) => 
        activityTotal + (parseFloat(activity.allowanceRate) * activity.kehadiran), 0)
    }, 0).toFixed(2)
});

const isAllSelected = computed(() => {
  return penolongAmil.value.length > 0 && selectedRows.value.length === penolongAmil.value.length;
});

const selectedRowsCount = computed(() => {
  return penolongAmil.value.filter(pa => pa._checked && !isInRecipients(pa.id)).length;
});

const selectedRecipients = computed(() => penolongAmil.value.filter(pa => selectedRows.value.includes(pa.id)));
const rowTotal = (pa) => pa.activities.reduce((s, a) => s + (parseFloat(a.allowanceRate) * a.kehadiran), 0);

// New computed properties for Section 3
const canSubmit = computed(() => recipients.value.length > 0);
const totalRecipientsAllowance = computed(() => {
  return recipients.value.reduce((total, pa) => {
    return total + pa.activities.reduce((activityTotal, activity) => 
      activityTotal + (parseFloat(activity.allowanceRate) * activity.kehadiran), 0)
  }, 0);
});

// Methods for checkbox selection
const toggleRowSelection = (id) => {
  const index = selectedRows.value.indexOf(id);
  if (index > -1) {
    selectedRows.value.splice(index, 1);
  } else {
    selectedRows.value.push(id);
  }
};

function toggleSelectAllCandidates() {
  // The watcher will handle the actual checkbox updates
  // This function just needs to exist for the @input event
}

function isInRecipients(paId) {
  return recipients.value.some(r => r.id === paId);
}

// Form submission handler
const handleSubmit = async (formData) => {
  isSubmitting.value = true;
  
  try {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    showSuccessModal.value = true;
  } catch (error) {
    console.error('Error submitting form:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const handleKira = () => {
  showCalculationTable.value = true;
  selectedRows.value = []; // Reset selection when showing table
};

function openActivityModal(pa, activity) {
  selectedRecipient.value = pa || null;
  selectedActivityName.value = activity?.name || '';
  selectedActivity.value = activity || null;
  
  // Generate mock data for asnaf list with cancellation status
  activityModalData.value = generateMockAsnafData(selectedActivityName.value, activity);
  showActivityModal.value = true;
}

function closeActivityModal() {
  showActivityModal.value = false;
  selectedRecipient.value = null;
  selectedActivityName.value = '';
  selectedActivity.value = null;
  activityModalData.value = [];
}

function generateMockAsnafData(activityName, activity) {
  const base = [
    { 
      id: 'asnaf1',
      namaAsnaf: 'Ahmad bin Abdullah', 
      idPengenalan: '800101011234', 
      aktiviti: activityName || '—', 
      jumlahElaun: 30, 
      _checked: false, 
      _catatan: '',
      _isCancelled: false
    },
    { 
      id: 'asnaf2',
      namaAsnaf: 'Siti Aminah binti Hassan', 
      idPengenalan: '820520149012', 
      aktiviti: activityName || '—', 
      jumlahElaun: 20, 
      _checked: false, 
      _catatan: '',
      _isCancelled: false
    },
    { 
      id: 'asnaf3',
      namaAsnaf: 'Mohd Razak bin Ibrahim', 
      idPengenalan: '750315085678', 
      aktiviti: activityName || '—', 
      jumlahElaun: 20, 
      _checked: false, 
      _catatan: '',
      _isCancelled: false
    },
  ];
  
  // Mark previously cancelled asnaf as cancelled
  if (activity && activity.cancelledAsnaf) {
    base.forEach(asnaf => {
      if (activity.cancelledAsnaf.includes(asnaf.id)) {
        asnaf._isCancelled = true;
        asnaf._checked = true;
        asnaf._catatan = 'Dibatalkan sebelumnya';
      }
    });
  }
  
  return base;
}

const hasActivityChanges = computed(() => {
  if (!selectedActivity.value) return false;
  
  // Check if any checkbox state differs from the current cancellation state
  return activityModalData.value.some(item => {
    const isCurrentlyCancelled = selectedActivity.value.cancelledAsnaf.includes(item.id);
    return item._checked !== isCurrentlyCancelled;
  });
});

function applyActivityModalChanges() {
  if (!selectedRecipient.value || !selectedActivity.value) return;
  
  // Update the activity's cancelled asnaf list
  const cancelledAsnafIds = activityModalData.value
    .filter(item => item._checked)
    .map(item => item.id);
  
  // Update the activity data
  selectedActivity.value.cancelledAsnaf = cancelledAsnafIds;
  selectedActivity.value.kehadiran = selectedActivity.value.originalKehadiran - cancelledAsnafIds.length;
  
  closeActivityModal();
}

// Watch for changes in individual checkboxes to update select all state
watch(() => penolongAmil.value.map(r => r._checked), (newValues) => {
  const availableRows = penolongAmil.value.filter(r => !isInRecipients(r.id));
  const totalRows = availableRows.length;
  const checkedRows = availableRows.filter(r => r._checked).length;
  
  if (checkedRows === 0) {
    selectAllCandidates.value = false;
  } else if (checkedRows === totalRows) {
    selectAllCandidates.value = true;
  } else {
    selectAllCandidates.value = false; // Indeterminate state
  }
}, { deep: true });

// Ensure header checkbox drives visible row checkboxes reliably
watch(selectAllCandidates, (val) => {
  penolongAmil.value.forEach(row => {
    if (!isInRecipients(row.id)) {
      row._checked = val;
    }
  });
});

// New functions for Section 2 to Section 3 flow
function commitSelected() {
  // Get all checked items that are not already in recipients
  const selectedItems = penolongAmil.value.filter(pa => pa._checked && !isInRecipients(pa.id));
  
  // Add to recipients list
  selectedItems.forEach(item => {
    recipients.value.push({ ...item, _selected: true });
  });
  
  // Clear selection
  selectedRows.value = [];
  selectAllCandidates.value = false;
  penolongAmil.value.forEach(pa => {
    pa._checked = false;
  });
}

function removeRecipient(index) {
  const recipient = recipients.value[index];
  if (confirm(`Adakah anda pasti mahu membuang ${recipient.name} dari senarai?`)) {
    recipients.value.splice(index, 1);
  }
}

// Footer button functions
function saveDraft() {
  saving.value = true;
  setTimeout(() => {
    saving.value = false;
    // Show success message (mockup only)
    alert('Draf berjaya disimpan');
  }, 1000);
}

function openSubmitModal() {
  if (!canSubmit.value) return;
  submitNotes.value = ''; // Start with empty notes
  showSubmitModal.value = true;
}

function closeSubmitModal() {
  showSubmitModal.value = false;
  submitNotes.value = '';
}

function confirmSubmit() {
  saving.value = true;
  setTimeout(() => {
    saving.value = false;
    showSubmitModal.value = false;
    navigateTo('/BF-PA/PE/AB2/03');
  }, 1000);
}
</script>

<style scoped>
/* Add any additional styles here */
</style> 