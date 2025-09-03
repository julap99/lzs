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
                  <input
                    type="checkbox"
                    :checked="isAllSelected"
                    @change="toggleSelectAll"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Pengenalan
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aktiviti : Kehadiran
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
                    <input
                      type="checkbox"
                      :checked="selectedRows.includes(pa.id)"
                      @change="toggleRowSelection(pa.id)"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ pa.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ pa.idPengenalan }}
                  </td>
                  <td class="px-6 py-4 align-top">
                    <ul class="list-disc list-inside space-y-1">
                      <li v-for="activity in filteredActivities(pa.activities)" :key="activity.id" class="flex items-center gap-2">
                        <button class="text-blue-600 hover:text-blue-800 hover:underline text-left"
                                @click="openActivityModal(pa, activity)">
                          {{ activity.name }}
                        </button>
                        <span class="text-gray-500 text-sm">: {{ activity.kehadiran }} kali</span>
                      </li>
                      <li v-if="filteredActivities(pa.activities).length === 0" class="list-none text-gray-400">Tiada aktiviti berkaitan</li>
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
            <tfoot class="bg-white">
              <tr>
                <td colspan="4" class="px-6 py-4 text-right font-medium">
                  Jumlah Keseluruhan Elaun (Baris Dipilih):
                </td>
                <td class="px-6 py-4 font-medium text-right">
                  <span v-if="selectedRows.length > 0" class="text-blue-600">
                    RM {{ totalAllowance }}
                  </span>
                  <span v-else class="text-gray-400">
                    RM 0.00
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
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
              <tr v-for="pa in selectedRecipients" :key="pa.id">
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
                  <rs-button variant="secondary-outline" size="sm" @click="openActivityModal(pa)">Aktiviti</rs-button>
                </td>
              </tr>
              <tr v-if="selectedRecipients.length === 0">
                <td class="px-6 py-6 text-center text-gray-500" colspan="5">Tiada penerima dipilih.</td>
              </tr>
            </tbody>
          </table>
        </div>
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
                <tr v-for="(item, index) in activityModalData" :key="index" class="hover:bg-gray-50">
                  <td class="px-4 py-3">
                    <FormKit
                      v-model="item._checked"
                      type="checkbox"
                      :classes="{ input: '!w-4 !h-4' }"
                    />
                  </td>
                  <td class="px-4 py-3 font-medium text-gray-900">{{ item.namaAsnaf }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ item.idPengenalan }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ item.aktiviti }}</td>
                  <td class="px-4 py-3 text-gray-900">RM {{ Number(item.jumlahElaun).toFixed(2) }}</td>
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
              variant="secondary-outline"
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
              Simpan
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

// Current date for default value
const currentDate = ref(new Date().toISOString().split('T')[0]);

// Activity modal state
const showActivityModal = ref(false);
const selectedRecipient = ref(null);
const selectedActivityName = ref('');
const activityModalData = ref([]);

// Checkbox selection state
const selectedRows = ref([]);

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
    'KEMASKINI/PERMOHONAN BANTUAN : PER BORANG PERMOHONAN',
  ]);
  return (activities || []).filter(a => allowed.has(a.name));
};

const penolongAmil = ref([
  {
    id: 1,
    name: 'Ahmad bin Abdullah',
    idPengenalan: 'A123456789012345',
    kehadiran: 'Hadir',
    activities: [
      {
        id: 1,
        name: 'BANCIAN BARU : PER BORANG PERMOHONAN',
        allowanceRate: '30.00',
        kehadiran: 5
      },
      {
        id: 2,
        name: 'KEMASKINI/PERMOHONAN BANTUAN : PER BORANG PERMOHONAN',
        allowanceRate: '20.00',
        kehadiran: 3
      }
    ]
  },
  {
    id: 2,
    name: 'Mohd Razak bin Ibrahim',
    idPengenalan: 'B987654321098765',
    kehadiran: 'Tidak Hadir',
    activities: [
      {
        id: 1,
        name: 'BANCIAN BARU : PER BORANG PERMOHONAN',
        allowanceRate: '30.00',
        kehadiran: 4
      },
      {
        id: 2,
        name: 'KEMASKINI/PERMOHONAN BANTUAN : PER BORANG PERMOHONAN',
        allowanceRate: '20.00',
        kehadiran: 1
      }
    ]
  },
  {
    id: 3,
    name: 'Siti Aminah binti Hassan',
    idPengenalan: 'C112233445566778',
    kehadiran: 'Hadir',
    activities: [
      {
        id: 1,
        name: 'BANCIAN BARU : PER BORANG PERMOHONAN',
        allowanceRate: '30.00',
        kehadiran: 6
      },
      {
        id: 2,
        name: 'KEMASKINI/PERMOHONAN BANTUAN : PER BORANG PERMOHONAN',
        allowanceRate: '20.00',
        kehadiran: 4
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
  return selectedRows.value.length;
});

const selectedRecipients = computed(() => penolongAmil.value.filter(pa => selectedRows.value.includes(pa.id)));
const rowTotal = (pa) => pa.activities.reduce((s, a) => s + (parseFloat(a.allowanceRate) * a.kehadiran), 0);

// Methods for checkbox selection
const toggleRowSelection = (id) => {
  const index = selectedRows.value.indexOf(id);
  if (index > -1) {
    selectedRows.value.splice(index, 1);
  } else {
    selectedRows.value.push(id);
  }
};

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedRows.value = [];
  } else {
    selectedRows.value = penolongAmil.value.map(pa => pa.id);
  }
};

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
  // Generate simple mock data for asnaf list
  activityModalData.value = generateMockAsnafData(selectedActivityName.value);
  showActivityModal.value = true;
}

function closeActivityModal() {
  showActivityModal.value = false;
  selectedRecipient.value = null;
  selectedActivityName.value = '';
  activityModalData.value = [];
}

function generateMockAsnafData(activityName) {
  const base = [
    { namaAsnaf: 'Ahmad bin Abdullah', idPengenalan: '800101011234', aktiviti: activityName || '—', jumlahElaun: 30, _checked: false, _catatan: '' },
    { namaAsnaf: 'Siti Aminah binti Hassan', idPengenalan: '820520149012', aktiviti: activityName || '—', jumlahElaun: 20, _checked: false, _catatan: '' },
    { namaAsnaf: 'Mohd Razak bin Ibrahim', idPengenalan: '750315085678', aktiviti: activityName || '—', jumlahElaun: 20, _checked: false, _catatan: '' },
  ];
  return base;
}

const hasActivityChanges = computed(() => activityModalData.value.some(r => r._checked));

function applyActivityModalChanges() {
  // In prototype, simply close after basic validation
  if (!hasActivityChanges.value) return;
  closeActivityModal();
}
</script>

<style scoped>
/* Add any additional styles here */
</style> 