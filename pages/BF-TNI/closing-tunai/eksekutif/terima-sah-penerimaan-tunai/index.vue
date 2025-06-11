<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Terima & Sahkan Penerimaan Tunai – PKP
          </h2>
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
          <div class="mb-6">
            <h3 class="text-lg font-medium mb-2">Maklumat Header</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="text"
                name="lokasiAkaun"
                label="Lokasi / Akaun Tunai"
                :value="sessionData.lokasiAkaun"
                disabled
              />

              <FormKit
                type="text"
                name="namaPkp"
                label="Nama PKP (login user)"
                :value="sessionData.namaPkp"
                disabled
              />

              <FormKit
                type="text"
                name="tarikhMasaPengesahan"
                label="Masa & Tarikh Pengesahan"
                :value="formattedDateTime"
                disabled
              />

              <FormKit
                type="text"
                name="idBukaOperasi"
                label="ID Buka Operasi Dikaitkan"
                :value="sessionData.idBukaOperasi"
                disabled
              />

              <FormKit
                type="text"
                name="statusSesi"
                label="Status Sesi"
                value="Aktif"
                disabled
              />
            </div>
          </div>

          <!-- 2️⃣ Penerimaan Tunai Section -->
          <div class="mb-6">
            <h3 class="text-lg font-medium mb-2">Butiran Penerimaan Tunai</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="text"
                name="jumlahTunaiKertas"
                label="Jumlah Tunai Kertas (RM)"
                :value="formatCurrency(cashData.jumlahTunaiKertas)"
                disabled
              />

              <FormKit
                type="text"
                name="jumlahSyiling"
                label="Jumlah Syiling (RM)"
                :value="formatCurrency(cashData.jumlahSyiling)"
                disabled
              />

              <FormKit
                type="text"
                name="jumlahKeseluruhan"
                label="Jumlah Keseluruhan Tunai (RM)"
                :value="formatCurrency(cashData.jumlahKeseluruhan)"
                disabled
              />

              <FormKit
                type="text"
                name="tarikhMasaSerahan"
                label="Tarikh & Masa Serahan Tunai"
                :value="cashData.tarikhMasaSerahan"
                disabled
              />

              <FormKit
                type="text"
                name="namaPicPenyerah"
                label="Nama PIC Penyerah"
                :value="cashData.namaPicPenyerah"
                disabled
              />
            </div>
          </div>

          <!-- 3️⃣ Form Pengesahan Section -->
          <div class="mb-6">
            <h3 class="text-lg font-medium mb-2">Pengesahan oleh PKP</h3>
            <div class="grid grid-cols-1 gap-4">
              <FormKit
                type="textarea"
                name="catatanTambahan"
                label="Catatan Tambahan (jika ada)"
                placeholder="Masukkan catatan tambahan jika ada perbezaan tunai atau remark tambahan diperlukan"
                rows="3"
              />
            </div>
          </div>

          <!-- 4️⃣ Action Buttons -->
          <div class="flex justify-end gap-4 mt-6">
            <rs-button
              variant="primary"
              type="submit"
              :loading="processing"
              @click="validateAndShowConfirmation"
            >
              Sahkan Penerimaan
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showConfirmationModal"
      title="Sahkan Penerimaan Tunai"
      size="md"
      position="center"
    >
      <template #body>
        <p class="mb-4">
          Adakah anda pasti untuk mengesahkan penerimaan tunai ini?
        </p>
        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="space-y-2">
            <p class="font-medium">
              Jumlah Tunai Kertas: RM
              {{ formatCurrency(cashData.jumlahTunaiKertas) }}
            </p>
            <p class="font-medium">
              Jumlah Syiling: RM {{ formatCurrency(cashData.jumlahSyiling) }}
            </p>
            <p class="font-medium text-primary-600">
              Jumlah Keseluruhan: RM
              {{ formatCurrency(cashData.jumlahKeseluruhan) }}
            </p>

            <div class="mt-4 pt-4 border-t border-gray-200">
              <p class="text-sm text-gray-600">
                Status selepas simpan:
                <span class="font-medium text-primary-600">
                  {{
                    isBranchAccount
                      ? "Sedia untuk Kemaskini Status Akaun = Ditutup"
                      : "Ditutup"
                  }}
                </span>
              </p>
            </div>
          </div>

          <div class="mt-4 p-4 bg-yellow-50 rounded-lg">
            <p class="text-sm text-yellow-800">
              <Icon
                name="heroicons:exclamation-triangle"
                class="inline-block mr-1"
              />
              Pastikan jumlah yang direkodkan adalah tepat sebelum mengesahkan.
              Rekod tidak boleh diubah selepas disimpan.
            </p>
          </div>
        </div>
      </template>

      <template #footer>
        <rs-button
          @click="showConfirmationModal = false"
          :disabled="processing"
          variant="primary-outline"
        >
          Tutup
        </rs-button>

        <rs-button
          @click="handleConfirm"
          :disabled="processing"
          variant="primary"
        >
          <span v-if="processing">
            <Icon name="eos-icons:loading" class="ml-1" size="1rem" />
            Sedang Menyimpan...
          </span>
          <span v-else>
            <Icon name="heroicons:check-circle" class="mr-1" />
            Sahkan & Simpan
          </span>
        </rs-button>
      </template>
    </rs-modal>

    <!-- Success Modal -->
    <rs-modal
      v-model="showSuccessModal"
      title="Berjaya"
      size="md"
      position="center"
    >
      <template #body>
        <div class="text-center">
          <Icon
            name="heroicons:check-circle"
            class="mx-auto text-green-500"
            size="48"
          />
          <p class="mt-4 text-lg font-medium">
            Sahkan Penerimaan Tunai berjaya.
          </p>
          <p class="mt-2 text-gray-600">
            Sila klik [Tutup Operasi] untuk melengkapkan sesi Closing.
          </p>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-center">
          <rs-button
            variant="primary"
            @click="handleCloseOperation"
            :loading="processing"
          >
            Tutup Operasi
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Error Alert -->
    <rs-alert
      v-if="errorMessage"
      type="error"
      class="fixed bottom-4 right-4 z-50"
      @close="errorMessage = ''"
    >
      <template #icon>
        <Icon name="heroicons:x-circle" />
      </template>
      <div>
        <h4 class="font-medium">Ralat</h4>
        <p>{{ errorMessage }}</p>
      </div>
    </rs-alert>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

definePageMeta({
  title: "Terima & Sahkan Penerimaan Tunai – PKP",
});

const router = useRouter();
const processing = ref(false);
const showConfirmationModal = ref(false);
const showSuccessModal = ref(false);
const errorMessage = ref("");

const breadcrumb = ref([
  {
    name: "Pengurusan Tunai",
    type: "link",
    path: "/BF-TNI/closing-tunai",
  },
  {
    name: "Terima & Sahkan Penerimaan Tunai – PKP",
    type: "current",
  },
]);

// Mock session data - replace with actual data from API
const sessionData = ref({
  lokasiAkaun: "Cawangan Kuala Lumpur",
  namaPkp: "Ahmad bin Hassan",
  idBukaOperasi: "OPK-20240315-001",
  isBranchAccount: true,
});

// Mock cash data from CL-02 - replace with actual data from API
const cashData = ref({
  jumlahTunaiKertas: 5000.0,
  jumlahSyiling: 150.5,
  jumlahKeseluruhan: 5150.5,
  tarikhMasaSerahan: "15 Mac 2024, 10:30 AM",
  namaPicPenyerah: "Siti binti Abdullah",
});

const formData = ref({
  // Header Info
  lokasiAkaun: sessionData.value.lokasiAkaun,
  namaPkp: sessionData.value.namaPkp,
  tarikhMasaPengesahan: new Date().toISOString(),
  idBukaOperasi: sessionData.value.idBukaOperasi,
  statusSesi: "Aktif",

  // Penerimaan Tunai
  jumlahTunaiKertas: cashData.value.jumlahTunaiKertas,
  jumlahSyiling: cashData.value.jumlahSyiling,
  jumlahKeseluruhan: cashData.value.jumlahKeseluruhan,
  tarikhMasaSerahan: cashData.value.tarikhMasaSerahan,
  namaPicPenyerah: cashData.value.namaPicPenyerah,

  // Pengesahan
  catatanTambahan: "",
});

// Computed properties
const isBranchAccount = computed(() => sessionData.value.isBranchAccount);

const formattedDateTime = computed(() => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date().toLocaleDateString("ms-MY", options);
});

// Helper functions
const formatCurrency = (value) => {
  return new Intl.NumberFormat("ms-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);
};

// Event handlers
const validateAndShowConfirmation = () => {
  showConfirmationModal.value = true;
};

const handleConfirm = async () => {
  processing.value = true;
  errorMessage.value = "";

  try {
    // TODO: Implement API call to save the data
    await new Promise((resolve) => setTimeout(resolve, 1000));

    showConfirmationModal.value = false;
    showSuccessModal.value = true;
  } catch (error) {
    console.error("Error saving data:", error);
    errorMessage.value =
      "Ralat: Gagal menyimpan pengesahan penerimaan tunai. Sila cuba lagi.";
  } finally {
    processing.value = false;
  }
};

const handleCloseOperation = async () => {
  processing.value = true;
  errorMessage.value = "";

  try {
    // TODO: Implement API call to close the operation
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    // Redirect to appropriate page after closing

    showSuccessModal.value = false;
  } catch (error) {
    console.error("Error closing operation:", error);
    errorMessage.value = "Ralat: Gagal menutup operasi. Sila cuba lagi.";
  } finally {
    processing.value = false;
  }
};

const handleSubmit = (data) => {
  console.log("Form submitted:", data);
  validateAndShowConfirmation();
};
</script>

<style lang="scss" scoped>
.nas-form-section {
  @apply mb-6;

  h3 {
    @apply text-lg font-medium mb-2;
  }
}

.nas-field-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4;
}

.nas-field-full {
  @apply md:col-span-2;
}
</style>
