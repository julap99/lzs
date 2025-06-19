<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Borang Tambah Peti Besi</h2>
        </div>
      </template>

      <template #body>
        <FormKit
          type="form"
          @submit="handleSubmit"
          :actions="false"
          class="max-w-2xl mx-auto"
          v-model="formData"
        >
          <div class="grid grid-cols-1 gap-4">
            <!-- Nama & Kod Lokasi -->
            <FormKit
              type="select"
              name="location"
              label="Nama & Kod Lokasi"
              placeholder="Pilih lokasi"
              validation="required"
              :validation-messages="{
                required: 'Sila pilih lokasi',
              }"
              :options="locationOptions"
            />

            <!-- Jenis Akaun Peti Besi -->
            <FormKit
              type="select"
              name="accountType"
              label="Jenis Akaun Peti Besi"
              placeholder="Pilih jenis akaun"
              validation="required"
              :validation-messages="{
                required: 'Sila pilih jenis akaun',
              }"
              :options="[
                { label: 'Cawangan', value: 'Cawangan' },
                { label: 'Amil', value: 'Amil' },
                { label: 'Operasi Daerah', value: 'Operasi Daerah' },
                { label: 'Baitul', value: 'Baitul' },
              ]"
            />

            <!-- Nilai Asas Peti Besi -->
            <FormKit
              type="text"
              name="baseValue"
              label="Nilai Asas Peti Besi (RM)"
              placeholder="Masukkan nilai asas"
              validation="required|number"
              :validation-messages="{
                required: 'Nilai asas diperlukan',
                number: 'Nilai mestilah dalam bentuk nombor',
              }"
            />

            <!-- Had Minimum Baki -->
            <FormKit
              type="text"
              name="minimumBalance"
              label="Had Minimum Baki (RM)"
              placeholder="Masukkan had minimum baki"
              validation="required|number"
              :validation-messages="{
                required: 'Had minimum baki diperlukan',
                number: 'Nilai mestilah dalam bentuk nombor',
              }"
            />

            <!-- Tarikh Efektif Konfigurasi -->
            <FormKit
              type="date"
              name="effectiveDate"
              label="Tarikh Efektif Konfigurasi"
              validation="required"
              :validation-messages="{
                required: 'Tarikh efektif diperlukan',
              }"
            />

            <!-- Kekerapan Pemantauan -->
            <FormKit
              type="select"
              name="monitoringFrequency"
              label="Kekerapan Pemantauan"
              placeholder="Pilih kekerapan"
              validation="required"
              :validation-messages="{
                required: 'Sila pilih kekerapan pemantauan',
              }"
              :options="[
                { label: 'Mingguan', value: 'Mingguan' },
                { label: 'Bulanan', value: 'Bulanan' },
              ]"
            />

            <!-- Penetapan Automasi Pemantauan -->
            <FormKit
              type="date"
              name="monitoringDates"
              label="Penetapan Automasi Pemantauan"
              validation="required"
              :validation-messages="{
                required: 'Tarikh pemantauan diperlukan',
              }"
              multiple
            />

            <!-- Kaedah Pemindahan -->
            <FormKit
              type="select"
              name="transferMethod"
              label="Kaedah Pemindahan"
              placeholder="Pilih kaedah pemindahan"
              validation="required"
              :validation-messages="{
                required: 'Sila pilih kaedah pemindahan',
              }"
              :options="[
                { label: 'Tunai', value: 'Tunai' },
                { label: 'eWallet', value: 'eWallet' },
              ]"
            />

            <!-- Status Konfigurasi -->
            <h6 class="text-sm font-semibold">Status Konfigurasi</h6>
            <FormKit
              type="radio"
              name="status"
              validation="required"
              :validation-messages="{
                required: 'Sila pilih status konfigurasi',
              }"
              :options="[
                { label: 'Aktif', value: 'Aktif' },
                { label: 'Tidak Aktif', value: 'Tidak Aktif' },
              ]"
            />

            <!-- Form Actions -->
            <div class="flex justify-end gap-4 mt-6">
              <rs-button variant="secondary" @click="handleCancel">
                Batal
              </rs-button>
              <rs-button type="button" variant="primary" @click="showConfirmationModal = true">
                Simpan & Aktifkan
              </rs-button>
            </div>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showConfirmationModal"
      role="dialog"
      aria-labelledby="confirmation-modal-title"
      aria-describedby="confirmation-modal-description"
      size="md"
      position="center"
    >
      <template #header>
        <div class="flex items-center w-full">
          <h3 id="confirmation-modal-title" class="text-lg font-semibold text-gray-800">
            Sahkan Konfigurasi
          </h3>
        </div>
      </template>
      
      <div class="px-6 py-6">
        <div class="flex items-start">
          <div class="bg-blue-100 rounded-full p-3 mr-4 flex-shrink-0">
            <Icon name="ph:info-fill" size="24" class="text-blue-600" />
          </div>
          <div id="confirmation-modal-description">
            <p class="mb-4 text-gray-800">
              Adakah anda pasti untuk menyimpan konfigurasi peti besi ini?
            </p>
            <p class="text-sm text-gray-600">
              Konfigurasi ini akan digunakan untuk pemantauan dan pengurusan peti besi.
            </p>
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="flex justify-end gap-4">
          <rs-button variant="secondary" @click="showConfirmationModal = false">
            Batal
          </rs-button>
          <rs-button variant="primary" @click="confirmSubmit">
            Sahkan
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
const breadcrumb = ref([
  {
    name: "Peti Besi",
    type: "link",
    path: "/BF-TNI/peti-besi/konfigurasi/tambah",
  },
  {
    name: "Konfigurasi",
    type: "link",
    path: "/BF-TNI/peti-besi/konfigurasi/tambah",
  },
  {
    name: "Tambah",
    type: "current",
    path: "/BF-TNI/peti-besi/konfigurasi/tambah",
  },
]);

const formData = ref({
  location: "",
  accountType: "",
  baseValue: "",
  minimumBalance: "",
  effectiveDate: "",
  monitoringFrequency: "",
  monitoringDates: [],
  transferMethod: "",
  status: "",
});

// Mock location options - replace with actual data from API
const locationOptions = [
  { label: "Cawangan Kuala Lumpur (KL001)", value: "KL001" },
  { label: "Cawangan Johor Bahru (JB001)", value: "JB001" },
  { label: "Cawangan Pulau Pinang (PP001)", value: "PP001" },
];

const showConfirmationModal = ref(false);

const confirmSubmit = async () => {
  showConfirmationModal.value = false;
  await handleSubmit(formData.value);
};

const handleSubmit = async (formData) => {
  try {
    // TODO: Implement form submission logic
    console.log("Form submitted:", formData);
  } catch (error) {
    console.error("Error submitting form:", error);
  }
};

const handleCancel = () => {
  // TODO: Implement cancel logic
  navigateTo("/BF-TNI/peti-besi/konfigurasi");
};
</script>

<style lang="scss" scoped>
:deep(.formkit-input) {
  @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}

:deep(.formkit-label) {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

:deep(.formkit-message) {
  @apply text-sm text-red-600 mt-1;
}

:deep(.formkit-radio-options) {
  @apply space-y-2;
}

:deep(.formkit-radio-option) {
  @apply flex items-center space-x-2;
}

:deep(.formkit-radio-input) {
  @apply h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300;
}

:deep(.formkit-radio-label) {
  @apply text-sm text-gray-700;
}
</style>
