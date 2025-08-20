<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Notifikasi Status Bayaran Elaun
          </h2>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <FormKit
            type="form"
            id="notificationForm"
            :actions="false"
            @submit="handleSubmit"
          >
            <!-- Maklumat Bayaran -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-4">Maklumat Bayaran</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- ID Payment Advice -->
                <div>
                  <p class="text-sm text-gray-500 mb-1">ID Payment Advice</p>
                  <p class="font-medium text-blue-600">{{ paymentAdviceId }}</p>
                </div>

                <!-- Status Bayaran -->
                <div>
                  <p class="text-sm text-gray-500 mb-1">Status Bayaran</p>
                  <span
                    class="px-3 py-1 text-sm font-medium rounded-full"
                    :class="getStatusClass(paymentStatus)"
                  >
                    {{ paymentStatus }}
                  </span>
                </div>

                <!-- Nama Penolong Amil -->
                <div>
                  <p class="text-sm text-gray-500 mb-1">Nama Penolong Amil</p>
                  <p class="font-medium">{{ paName }}</p>
                </div>

                <!-- Jumlah Bayaran -->
                <div>
                  <p class="text-sm text-gray-500 mb-1">Jumlah Bayaran</p>
                  <p class="font-medium">RM {{ paymentAmount }}</p>
                </div>

                <!-- Tarikh Bayaran -->
                <div>
                  <p class="text-sm text-gray-500 mb-1">Tarikh Bayaran</p>
                  <p class="font-medium">{{ paymentDate }}</p>
                </div>

                <!-- Lokasi Bayaran -->
                <div>
                  <p class="text-sm text-gray-500 mb-1">Lokasi Bayaran</p>
                  <p class="font-medium">{{ paymentLocation }}</p>
                </div>
              </div>
            </div>

            <!-- Maklumat Notifikasi -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-4">Maklumat Notifikasi</h3>
              
              <div class="grid grid-cols-1 gap-6">
                <!-- Kaedah Notifikasi -->
                <FormKit
                  type="select"
                  name="notificationMethod"
                  label="Kaedah Notifikasi"
                  placeholder="Pilih kaedah notifikasi"
                  :options="notificationMethods"
                  value="SMS"
                />

                <!-- Mesej Notifikasi -->
                <FormKit
                  type="textarea"
                  name="notificationMessage"
                  label="Mesej Notifikasi"
                  placeholder="Masukkan mesej notifikasi"
                  value="Tuan/Puan, Bayaran elaun anda sebanyak RM1,500.00 telah diproses dan akan dihantar ke akaun bank anda dalam masa 3 hari bekerja. Terima kasih."
                />

                <!-- Tarikh & Masa Notifikasi -->
                <FormKit
                  type="datetime-local"
                  name="notificationDateTime"
                  label="Tarikh & Masa Notifikasi"
                  value="2024-03-01T10:00"
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
                @click="showSuccessModal = true"
              >
                Hantar Notifikasi
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
            Notifikasi telah berjaya dihantar.
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
  title: "Notifikasi Status Bayaran Elaun",
  description: "Hantar notifikasi status bayaran elaun kepada penolong amil",
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
    name: "Notifikasi Status Bayaran",
    type: "current",
    path: "/BF-PA/PE/AB2/05",
  },
]);

// Form state
const showSuccessModal = ref(false);

// Mock data for dropdowns
const notificationMethods = [
  { label: 'SMS', value: 'SMS' },
  { label: 'E-mel', value: 'EMAIL' },
  { label: 'WhatsApp', value: 'WHATSAPP' },
];

// Mock payment data
const paymentAdviceId = computed(() => 'PAY-2024-001');
const paymentStatus = computed(() => 'Sudah Dihantar ke SAP');
const paName = computed(() => 'Ahmad bin Abdullah');
const paymentAmount = computed(() => '1,500.00');
const paymentDate = computed(() => '01/03/2024');
const paymentLocation = computed(() => 'Pejabat LZS Shah Alam');

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