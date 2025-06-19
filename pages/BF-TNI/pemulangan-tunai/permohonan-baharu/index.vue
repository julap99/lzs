<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Permohonan Baharu</h2>
        </div>
      </template>

      <template #body>
        <FormKit
          type="form"
          :actions="false"
          @submit="handleSubmit"
          v-model="formData"
        >
          <!-- 1️⃣ Header Info Section -->
          <div class="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 class="text-lg font-medium mb-4">Maklumat Header</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="text"
                name="namaPemohon"
                label="Nama Pemohon"
                :value="currentUserName"
                disabled
              />

              <FormKit
                type="text"
                name="lokasiAkaun"
                label="Lokasi / Akaun Tunai"
                :value="formData.lokasiAkaun"
                disabled
              />

              <FormKit
                type="text"
                name="tarikhMasaPermohonan"
                label="Tarikh & Masa Permohonan"
                :value="formattedDateTime"
                disabled
              />
            </div>
          </div>

          <!-- 2️⃣ Form Input Section -->
          <div class="space-y-6">
            <FormKit
              type="number"
              name="jumlahTunai"
              label="Jumlah Tunai Dipulangkan (RM)"
              validation="required|min:0"
              :validation-messages="{
                required: 'Jumlah tunai adalah wajib',
                min: 'Jumlah tidak boleh negatif',
              }"
              :help="`Baki belum guna: RM ${formatCurrency(bakiBelumGuna)}`"
            />

            <FormKit
              type="select"
              name="rujukanPermohonan"
              label="Rujukan Permohonan Pengeluaran Asal"
              validation="required"
              :validation-messages="{
                required: 'Rujukan permohonan adalah wajib',
              }"
              :options="rujukanOptions"
            />

            <FormKit
              type="text"
              name="tujuanAsal"
              label="Tujuan Asal Pengeluaran Tunai"
              :value="selectedRujukan?.tujuan"
              disabled
            />

            <FormKit
              type="datetime-local"
              name="tarikhMasaSerahan"
              label="Tarikh & Masa Serahan Fizikal"
              validation="required"
              :validation-messages="{
                required: 'Tarikh dan masa serahan adalah wajib',
              }"
            />

            <FormKit
              type="textarea"
              name="catatanTambahan"
              label="Catatan Tambahan (jika ada)"
              rows="3"
            />
          </div>

          <!-- 3️⃣ Submit Button -->
          <div class="mt-6 flex justify-end">
            <rs-button
              type="submit"
              variant="primary"
              :loading="isSubmitting"
              @click="showConfirmationModal = true"
            >
              Hantar untuk Kelulusan
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showConfirmationModal"
      title="Sahkan Permohonan"
      :ok-callback="handleConfirm"
      @cancel="showConfirmationModal = false"
      position="center"
    >
      <p>Adakah anda pasti untuk menghantar permohonan ini?</p>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

definePageMeta({
  title: "Permohonan Baharu",
  description: "Borang permohonan baharu untuk pemulangan tunai",
});

const breadcrumb = ref([
  {
    name: "Pemulangan Tunai",
    type: "link",
    path: "/BF-TNI/pemulangan-tunai",
  },
  {
    name: "Permohonan Baharu",
    type: "current",
    path: "/BF-TNI/pemulangan-tunai/permohonan-baharu",
  },
]);

// Mock data - replace with actual data from API
const currentUserName = ref("Ahmad bin Abdullah");
const bakiBelumGuna = ref(5000.0);

const formData = ref({
  namaPemohon: currentUserName.value,
  lokasiAkaun: "Cawangan Kuala Lumpur",
  tarikhMasaPermohonan: new Date().toISOString(),
  jumlahTunai: 0,
  rujukanPermohonan: "",
  tujuanAsal: "",
  tarikhMasaSerahan: "",
  catatanTambahan: "",
});

// Mock rujukan options - replace with actual data from API
const rujukanOptions = ref([
  { label: "REF-001 - Bantuan Banjir", value: "REF-001" },
  { label: "REF-002 - Bantuan Kebakaran", value: "REF-002" },
  { label: "REF-003 - Bantuan Kemanusiaan", value: "REF-003" },
]);

const selectedRujukan = computed(() => {
  const rujukan = rujukanOptions.value.find(
    (r) => r.value === formData.value.rujukanPermohonan
  );
  return rujukan ? { tujuan: rujukan.label.split(" - ")[1] } : null;
});

const formattedDateTime = computed(() => {
  return new Date().toLocaleString("ms-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
});

const formatCurrency = (amount) => {
  return amount.toLocaleString("ms-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const isSubmitting = ref(false);
const showConfirmationModal = ref(false);

const handleSubmit = async (formData) => {
  isSubmitting.value = true;
  try {
    // TODO: Implement API call to save the application
    console.log("Form submitted:", formData);
    // Show success modal and redirect
    navigateTo("/BF-TNI/pemulangan-tunai/senarai");
  } catch (error) {
    console.error("Error submitting form:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const handleConfirm = async () => {
  showConfirmationModal.value = false;
  await handleSubmit(formData.value);
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

:deep(.formkit-help) {
  @apply text-sm text-gray-500 mt-1;
}
</style>
