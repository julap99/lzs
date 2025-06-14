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
                <!-- ID Penolong Amil -->
                <FormKit
                  type="text"
                  name="paId"
                  label="ID Penolong Amil"
                  placeholder="Masukkan ID Penolong Amil"
                  validation="required"
                  :validation-messages="{
                    required: 'ID Penolong Amil diperlukan',
                  }"
                />

                <!-- Nama Penolong Amil -->
                <FormKit
                  type="text"
                  name="paName"
                  label="Nama Penolong Amil"
                  placeholder="Masukkan nama penolong amil"
                  validation="required"
                  :validation-messages="{
                    required: 'Nama Penolong Amil diperlukan',
                  }"
                />

                <!-- Lokasi Kariah -->
                <FormKit
                  type="select"
                  name="kariahLocation"
                  label="Lokasi Kariah"
                  placeholder="Pilih lokasi kariah"
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

                <!-- Jenis Tugasan -->
                <FormKit
                  type="select"
                  name="assignmentType"
                  label="Jenis Tugasan"
                  placeholder="Pilih jenis tugasan"
                  :options="assignmentTypes"
                  validation="required"
                  :validation-messages="{
                    required: 'Jenis Tugasan diperlukan',
                  }"
                />

                <!-- Kadar Elaun Tugasan -->
                <FormKit
                  type="number"
                  name="allowanceRate"
                  label="Kadar Elaun Tugasan (RM)"
                  placeholder="Masukkan kadar elaun"
                  validation="required|min:0"
                  :validation-messages="{
                    required: 'Kadar Elaun diperlukan',
                    min: 'Kadar Elaun mesti lebih daripada 0',
                  }"
                />
              </div>

              <!-- Jumlah Elaun Dikira (View Only) -->
              <div class="mt-6 p-4 bg-gray-50 rounded-lg">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p class="text-sm text-gray-500">Jumlah Elaun Dikira</p>
                    <p class="text-xl font-bold text-blue-600">RM {{ calculatedAllowance }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Status Layak</p>
                    <span
                      class="px-3 py-1 text-sm font-medium rounded-full"
                      :class="isEligible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    >
                      {{ isEligible ? 'Layak' : 'Tidak Layak' }}
                    </span>
                  </div>
                </div>
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
                @click="navigateTo('/BF-PA/PE/AB/02')"
              >
                Simpan
              </rs-button>
            </div>
          </FormKit>
        </div>
      </template>
    </rs-card>

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

// Mock data for dropdowns
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
</script>

<style scoped>
/* Add any additional styles here */
</style> 