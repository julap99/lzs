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
                @click="navigateTo('/BF-PA/PE/AB')"
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
      <div class="bg-gray-50 p-4 rounded-lg">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-white">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No.
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Penolong Amil
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aktiviti
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <template v-for="(pa, index) in penolongAmil" :key="pa.id">
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ index + 1 }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ pa.name }}
                  </td>
                  <td class="px-6 py-4">
                    <ul class="list-disc list-inside">
                      <li v-for="activity in pa.activities" :key="activity.id" class="flex justify-between items-center">
                        <span class="flex-1 text-center">{{ activity.name }}</span>
                        <span class="text-blue-600 ml-4">RM {{ activity.allowanceRate }}</span>
                      </li>
                    </ul>
                    <div class="text-right mt-2 font-medium text-blue-600">
                      Jumlah Elaun: RM {{ (pa.activities.length * 500).toFixed(2) }}
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
            <tfoot class="bg-white">
              <tr>
                <td colspan="2" class="px-6 py-4 text-right font-medium">
                  Jumlah Keseluruhan Elaun:
                </td>
                <td class="px-6 py-4 font-medium text-blue-600 text-right">
                  RM {{ totalAllowance }}
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
          @click="handleSimpan"
        >
          Simpan
        </rs-button>
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
            Maklumat pengiraan elaun telah berjaya disimpan.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center">
          <rs-button
            variant="primary"
            @click="navigateTo('/BF-PA/PE/AB')"
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
    name: "Bancian/Asnaf",
    type: "link",
    path: "/BF-PA/PE/AB",
  },
  {
    name: "Kira Jumlah Elaun",
    type: "current",
    path: "/BF-PA/PE/AB/01",
  },
]);

// Form state
const isSubmitting = ref(false);
const showSuccessModal = ref(false);
const showCalculationTable = ref(false);

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
    id: 'PA001',
    name: 'Ahmad bin Abdullah',
    activities: [
      { id: 1, name: 'Kutipan Zakat Kariah', allowanceRate: '500.00' },
      { id: 2, name: 'Agihan Bantuan Asnaf', allowanceRate: '500.00' },
      { id: 3, name: 'Program Tazkirah', allowanceRate: '500.00' }
    ]
  },
  {
    id: 'PA002',
    name: 'Siti Aminah binti Hassan',
    activities: [
      { id: 1, name: 'Kutipan Zakat Kariah', allowanceRate: '500.00' },
      { id: 2, name: 'Lawatan Asnaf', allowanceRate: '500.00' }
    ]
  },
  {
    id: 'PA003',
    name: 'Mohd Razak bin Ibrahim',
    activities: [
      { id: 1, name: 'Agihan Bantuan Asnaf', allowanceRate: '500.00' },
      { id: 2, name: 'Program Qiamullail', allowanceRate: '500.00' }
    ]
  },
  {
    id: 'PA004',
    name: 'Nurul Aisyah binti Omar',
    activities: [
      { id: 1, name: 'Program Tazkirah', allowanceRate: '500.00' },
      { id: 2, name: 'Lawatan Asnaf', allowanceRate: '500.00' }
    ]
  },
  {
    id: 'PA005',
    name: 'Ali bin Hassan',
    activities: [
      { id: 1, name: 'Kutipan Zakat Kariah', allowanceRate: '500.00' },
      { id: 2, name: 'Program Qiamullail', allowanceRate: '500.00' },
      { id: 3, name: 'Lawatan Asnaf', allowanceRate: '500.00' }
    ]
  }
]);

const totalAllowance = computed(() => {
  return penolongAmil.value.reduce((total, pa) => {
    return total + (pa.activities.length * 500)
  }, 0).toFixed(2)
});

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
};

const handleSimpan = () => {
  navigateTo('/BF-PA/PE/AB');
};
</script>

<style scoped>
/* Add any additional styles here */
</style> 