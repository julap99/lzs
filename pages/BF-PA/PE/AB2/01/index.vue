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
            <!-- Maklumat Pengiraan Elaun -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-4">Maklumat Pengiraan Elaun</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormKit
                  type="select"
                  name="kariahLocation"
                  label="Jenis Kategori"
                  placeholder="Pilih kategori"
                  :options="kariahCategories"
                  validation="required"
                  :validation-messages="{
                    required: 'Jenis-jenis Kariah',
                  }"
                />
                <!-- Lokasi Kariah  (To be added : a dropdown list of kariah (FAIZ))-->
                <FormKit
                  type="select"
                  name="kariahLocation"
                  label="Lokasi Institusi"
                  placeholder="Pilih lokasi institusi"
                  :options="kariahLocations"
                  validation="required"
                  :validation-messages="{
                    required: 'Lokasi Kariah diperlukan',
                  }"
                />

                <!-- Tarikh Tugasan Tamat -->
                <FormKit
                  type="date"
                  name="assignmentEndDate"
                  label="Tarikh Tugasan Tamat"
                  validation="required"
                  :validation-messages="{
                    required: 'Tarikh Tugasan Tamat diperlukan',
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

    <!-- Calculation Table Section (shown after clicking Kira) -->
    <div v-if="showCalculationTable" class="mt-8">
      <h3 class="text-lg font-semibold mb-4">Senarai Penolong Amil dan Aktiviti</h3>
      
      <!-- Selection Info -->
      <!-- <div v-if="selectedRowsCount > 0" class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p class="text-blue-800 text-sm">
          <Icon name="heroicons:information-circle" class="inline mr-2" />
          {{ selectedRowsCount }} baris dipilih
        </p>
      </div> -->
      
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
                  No.
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Pengenalan
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aktiviti
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kehadiran
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kadar Elaun
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
                    {{ index + 1 }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ pa.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ pa.idPengenalan }}
                  </td>
                  <td class="px-6 py-4">
                    <ul class="list-disc list-inside">
                      <li v-for="activity in pa.activities" :key="activity.id" class="flex justify-between items-center">
                        <span class="flex-1 text-center">{{ activity.name }}</span>
                      </li>
                    </ul>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <ul class="list-disc list-inside">
                      <li v-for="(activity, actIndex) in pa.activities" :key="activity.id" class="flex justify-center items-center">
                        <span class="text-sm font-medium">{{ actIndex + 1 }}</span>
                      </li>
                    </ul>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <ul class="list-disc list-inside">
                      <li v-for="activity in pa.activities" :key="activity.id" class="flex justify-between items-center">
                        <span class="ml-4">RM {{ activity.allowanceRate }}</span>
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
                <td colspan="7" class="px-6 py-4 text-right font-medium">
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

      <!-- Simpan Button -->
      <div class="flex justify-end mt-6">
        <rs-button
          variant="primary"
          @click="showConfirmationModal = true"
        >
          Simpan
        </rs-button>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <Icon name="ph:warning" class="w-6 h-6 text-orange-600 mr-3" />
            <h3 class="text-lg font-semibold text-gray-900">Pengesahan Tindakan</h3>
          </div>
          
          <p class="text-gray-600 mb-4">
            Adakah anda pasti untuk menyimpan perubahan ini? Perubahan akan dihantar untuk pengesahan Ketua Jabatan.
          </p>

          <!-- Confirmation Fields -->
          <div class="space-y-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Ulasan Sokongan</label>
              <textarea
                v-model="confirmationData.ulasanSokongan"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan ulasan sokongan anda..."
                required
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nama Penyokong</label>
              <input
                v-model="confirmationData.namaPenyokong"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan nama anda..."
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tarikh Sokongan</label>
              <input
                v-model="confirmationData.tarikhSokongan"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div class="flex justify-end space-x-3">
            <rs-button
              variant="secondary"
              @click="showConfirmationModal = false"
            >
              Batal
            </rs-button>
            <rs-button
              variant="primary"
              @click="confirmAction"
              :disabled="!confirmationData.ulasanSokongan.trim() || !confirmationData.namaPenyokong.trim()"
              :loading="isSubmitting"
            >
              Ya, Simpan
            </rs-button>
          </div>
        </div>
      </div>
    </div>

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
            Maklumat pengiraan elaun telah berjaya disimpan dan dihantar untuk pengesahan Ketua Jabatan.
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
const showSuccessModal = ref(false);
const showCalculationTable = ref(false);
const showConfirmationModal = ref(false);

// Confirmation data
const confirmationData = ref({
  ulasanSokongan: '',
  namaPenyokong: '',
  tarikhSokongan: new Date().toISOString().split('T')[0]
});

// Checkbox selection state
const selectedRows = ref([]);

// Mock data for dropdowns
const kariahCategories = [
  { label: 'Kariah', value: 'KARIAH' },
  { label: 'Komuniti', value: 'KOMUNITI' },
];

const kariahLocations = [
  { label: 'Masjid Wilayah Persekutuan', value: 'MSJ-KUL-001' },
  { label: 'Masjid Al-Khairiyah', value: 'MSJ-KUL-002' },
  { label: 'Masjid Bandar Utama', value: 'MSJ-KUL-003' },
  { label: 'Masjid Damansara Perdana', value: 'MSJ-KUL-004' },
  { label: 'Masjid Kg Delek', value: 'MSJ-KUL-005' },
];

const assignmentTypes = [
  { label: 'Fitrah', value: 'FITRAH' },
  { label: 'Padi', value: 'PADI' },
  { label: 'Kariah', value: 'KARIAH' },
  { label: 'Komuniti', value: 'KOMUNITI' },
];

// Computed values
const calculatedAllowance = computed(() => {
  // Mock calculation - in real app, this would be based on actual business logic
  return '1,500.00';
});

const isEligible = computed(() => {
  // Mock eligibility check - in real app, this would be based on actual business rules
  return true;
});

const penolongAmil = ref([
  {
    id: 1,
    name: 'Ahmad bin Abdullah',
    idPengenalan: 'A123456789012345',
    kehadiran: 'Hadir',
    activities: [
      {
        id: 1,
        name: 'Kutipan Zakat Kariah',
        allowanceRate: '20.00',
        kehadiran: 5
      },
      {
        id: 2,
        name: 'Agihan Bantuan Asnaf',
        allowanceRate: '50.00',
        kehadiran: 3
      },
      {
        id: 3,
        name: 'Program Tazkirah',
        allowanceRate: '100.00',
        kehadiran: 2
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
        name: 'Kutipan Zakat Kariah',
        allowanceRate: '50.00',
        kehadiran: 4
      },
      {
        id: 2,
        name: 'Agihan Bantuan Asnaf',
        allowanceRate: '40.00',
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
        name: 'Kutipan Zakat Kariah',
        allowanceRate: '50.00',
        kehadiran: 6
      },
      {
        id: 2,
        name: 'Agihan Bantuan Asnaf',
        allowanceRate: '40.00',
        kehadiran: 4
      },
      {
        id: 3,
        name: 'Program Tazkirah',
        allowanceRate: '100.00',
        kehadiran: 3
      },
      {
        id: 4,
        name: 'Program Qiamullail',
        allowanceRate: '200.00',
        kehadiran: 2
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

const handleSimpan = () => {
  if (selectedRows.value.length === 0) {
    alert('Sila pilih sekurang-kurangnya satu baris untuk disimpan.');
    return;
  }
  
  // Show confirmation modal instead of direct navigation
  showConfirmationModal.value = true;
};

const confirmAction = async () => {
  if (!confirmationData.value.ulasanSokongan.trim() || !confirmationData.value.namaPenyokong.trim()) {
    return;
  }

  isSubmitting.value = true;
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Close confirmation modal
    showConfirmationModal.value = false;
    
    // Show success message
    showSuccessModal.value = true;
    
    // Reset confirmation data
    confirmationData.value = {
      ulasanSokongan: '',
      namaPenyokong: '',
      tarikhSokongan: new Date().toISOString().split('T')[0]
    };
    
  } catch (error) {
    console.error('Error saving:', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* Add any additional styles here */
</style> 