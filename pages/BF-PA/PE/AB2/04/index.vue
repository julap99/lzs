<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Jana Payment Advice
          </h2>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <FormKit
            type="form"
            id="paymentAdviceForm"
            :actions="false"
            @submit="handleSubmit"
          >
            <!-- Maklumat PA -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-4">Maklumat PA</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Nama Penolong Amil -->
                <FormKit
                  type="text"
                  name="paName"
                  label="Nama Penolong Amil"
                  placeholder="Masukkan nama penolong amil"
                  value="Ahmad bin Abdullah"
                />

                <!-- Jumlah Bayaran -->
                <FormKit
                  type="number"
                  name="paymentAmount"
                  label="Jumlah Bayaran (RM)"
                  placeholder="Masukkan jumlah bayaran"
                  value="1500"
                />

                <!-- Tarikh & Lokasi -->
                <FormKit
                  type="date"
                  name="paymentDate"
                  label="Tarikh Bayaran"
                  value="2024-03-01"
                />

                <FormKit
                  type="select"
                  name="paymentLocation"
                  label="Lokasi Bayaran"
                  placeholder="Pilih lokasi bayaran"
                  :options="paymentLocations"
                  value="LZS_SA"
                />
              </div>

              <!-- Payment Advice Details (View Only) -->
              <div class="mt-6 p-4 bg-gray-50 rounded-lg">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p class="text-sm text-gray-500">ID Payment Advice</p>
                    <p class="font-medium text-blue-600">{{ paymentAdviceId }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Status Penghantaran</p>
                    <span
                      class="px-3 py-1 text-sm font-medium rounded-full"
                      :class="getStatusClass(paymentStatus)"
                    >
                      {{ paymentStatus }}
                    </span>
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
              <rs-button
                type="submit"
                variant="primary"
                @click="showSuccessModal = true"
              >
                Jana Payment Advice
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
            Payment Advice telah berjaya dijana.
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
  title: "Jana Payment Advice",
  description: "Jana payment advice untuk penolong amil",
});

const breadcrumb = ref([
  {
    name: "Bancian/Asnaf",
    type: "link",
    path: "/BF-PA/PE/AB",
  },
  {
    name: "Jana Payment Advice",
    type: "current",
    path: "/BF-PA/PE/AB/04",
  },
]);

// Form state
const showSuccessModal = ref(false);

// Mock data for dropdowns
const paymentLocations = [
  { label: 'Pejabat LZS Shah Alam', value: 'LZS_SA' },
  { label: 'Pejabat LZS Klang', value: 'LZS_KLANG' },
  { label: 'Pejabat LZS Kajang', value: 'LZS_KAJANG' },
  { label: 'Pejabat LZS Gombak', value: 'LZS_GOMBAK' },
  { label: 'Pejabat LZS Hulu Langat', value: 'LZS_HULU_LANGAT' },
];

// Computed values
const paymentAdviceId = computed(() => 'PAY-2024-001');
const paymentStatus = computed(() => 'Sudah Dihantar ke SAP');

// Helper functions
const getStatusClass = (status) => {
  const statusClasses = {
    'Sudah Dihantar ke SAP': 'bg-green-100 text-green-800',
    'Belum Menghantar': 'bg-yellow-100 text-yellow-800',
    'Sedang Diproses': 'bg-blue-100 text-blue-800',
  };
  return statusClasses[status] || 'bg-gray-100 text-gray-800';
};

// Form submission handler
const handleSubmit = () => {
  showSuccessModal.value = true;
};
</script>

<style scoped>
/* Add any additional styles here */
</style> 