<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Rekod Baki Akhir & Serahan Tunai
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
          <!-- Header Info Section -->
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
                name="namaPengguna"
                label="Nama Pengguna (Login)"
                :value="sessionData.namaPengguna"
                disabled
              />

              <FormKit
                type="text"
                name="tarikhMasaRekod"
                label="Tarikh & Masa Rekod Baki Akhir"
                :value="formattedDateTime"
                disabled
              />

              <FormKit
                type="text"
                name="idBukaOperasi"
                label="ID Buka Operasi Berkaitan"
                :value="sessionData.idBukaOperasi"
                disabled
              />

              <FormKit
                type="text"
                name="statusSesi"
                label="Status Sesi"
                :value="sessionData.statusSesi"
                disabled
              />
            </div>
          </div>

          <!-- Rekod Baki Akhir Section -->
          <div class="mb-6">
            <h3 class="text-lg font-medium mb-2">Rekod Baki Akhir</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="number"
                name="jumlahTunaiKertas"
                label="Jumlah Tunai Kertas (RM)"
                validation="required|min:0"
                :validation-messages="{
                  required: 'Jumlah tunai kertas diperlukan',
                  min: 'Jumlah tidak boleh negatif',
                }"
                v-model="formData.jumlahTunaiKertas"
                :disabled="isCompleted"
                help="Masukkan jumlah tunai kertas mengikut CL-01"
              />

              <FormKit
                type="number"
                name="jumlahSyiling"
                label="Jumlah Syiling (RM)"
                validation="required|min:0"
                :validation-messages="{
                  required: 'Jumlah syiling diperlukan',
                  min: 'Jumlah tidak boleh negatif',
                }"
                v-model="formData.jumlahSyiling"
                :disabled="isCompleted"
                help="Masukkan jumlah syiling mengikut CL-01"
              />

              <FormKit
                type="text"
                name="jumlahKeseluruhan"
                label="Jumlah Keseluruhan Tunai (RM)"
                :value="formatCurrency(totalCash)"
                disabled
                help="Jumlah keseluruhan dikira secara automatik"
              />

              <div class="md:col-span-2">
                <FormKit
                  type="textarea"
                  name="catatanTambahan"
                  label="Catatan Tambahan (jika ada)"
                  placeholder="Masukkan sebarang catatan tambahan"
                  v-model="formData.catatanTambahan"
                  :disabled="isCompleted"
                  help="Catatan tambahan untuk rekod baki akhir"
                />
              </div>

              <!-- Balance Warning -->
              <div v-if="totalCash <= 0" class="md:col-span-2">
                <RsAlert type="warning" class="mt-2">
                  <template #icon>
                    <Icon name="heroicons:exclamation-triangle" />
                  </template>
                  <div>
                    <h4 class="font-medium">Amaran Jumlah Tunai</h4>
                    <p>Jumlah keseluruhan tunai mesti lebih daripada 0.</p>
                  </div>
                </RsAlert>
              </div>
            </div>
          </div>

          <!-- Serahan Tunai Section (Conditional) -->
          <div v-if="isBranchAccount" class="mb-6">
            <h3 class="text-lg font-medium mb-2">Serahan Tunai</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="text"
                name="namaPkpPenerima"
                label="Nama PKP Penerima Tunai"
                validation="required"
                :validation-messages="{
                  required: 'Nama PKP penerima diperlukan',
                }"
                v-model="formData.namaPkpPenerima"
                :disabled="isCompleted"
                help="Masukkan nama PKP yang akan menerima tunai"
              />

              <FormKit
                type="text"
                name="tarikhMasaSerahan"
                label="Tarikh & Masa Serahan Tunai"
                :value="formattedDateTime"
                disabled
                help="Tarikh dan masa serahan akan direkodkan secara automatik"
              />

              <div class="md:col-span-2">
                <FormKit
                  type="textarea"
                  name="catatanSerahan"
                  label="Catatan Serahan (jika ada)"
                  placeholder="Masukkan sebarang catatan berkaitan serahan tunai"
                  v-model="formData.catatanSerahan"
                  :disabled="isCompleted"
                  help="Catatan tambahan untuk proses serahan tunai"
                />
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-4 mt-6">
            <rs-button
              variant="primary-outline"
              @click="handleCancel"
              :disabled="isCompleted"
            >
              Batal
            </rs-button>
            <rs-button
              type="submit"
              variant="primary"
              :disabled="isCompleted"
              @click="validateAndShowConfirmation"
            >
              Simpan
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showConfirmationModal"
      title="Sahkan Rekod Baki Akhir"
      size="md"
      position="center"
    >
      <template #body>
        <p class="mb-4">
          Adakah anda pasti untuk mengesahkan rekod baki akhir ini?
        </p>
        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="space-y-2">
            <p class="font-medium">
              Jumlah Tunai Kertas: RM
              {{ formatCurrency(formData.jumlahTunaiKertas) }}
            </p>
            <p class="font-medium">
              Jumlah Syiling: RM {{ formatCurrency(formData.jumlahSyiling) }}
            </p>
            <p class="font-medium text-primary-600">
              Jumlah Keseluruhan: RM {{ formatCurrency(totalCash) }}
            </p>

            <div
              v-if="isBranchAccount"
              class="mt-4 pt-4 border-t border-gray-200"
            >
              <p class="font-medium">Maklumat Serahan Tunai:</p>
              <p class="mt-2">Penerima PKP: {{ formData.namaPkpPenerima }}</p>
              <p>Tarikh & Masa Serahan: {{ formattedDateTime }}</p>
              <p
                v-if="formData.catatanSerahan"
                class="mt-2 text-sm text-gray-600"
              >
                Catatan: {{ formData.catatanSerahan }}
              </p>
            </div>

            <div class="mt-4 pt-4 border-t border-gray-200">
              <p class="text-sm text-gray-600">
                Status selepas simpan:
                <span class="font-medium text-primary-600">
                  {{
                    isBranchAccount
                      ? "Menunggu Penerimaan PKP"
                      : "Akaun Ditutup"
                  }}
                </span>
              </p>
            </div>
          </div>

          <div class="mt-4 p-3 bg-yellow-50 rounded-md">
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
          @click="handleConfirm()"
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
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";

definePageMeta({
  title: "Rekod Baki Akhir & Serahan Tunai",
});

const router = useRouter();
const isCompleted = ref(false);
const processing = ref(false);
const showConfirmationModal = ref(false);
const errorMessage = ref("");

const breadcrumb = ref([
  {
    name: "Pengurusan Tunai",
    type: "link",
    path: "/BF-TNI/closing-tunai",
  },
  {
    name: "Rekod Baki Akhir & Serahan Tunai",
    type: "current",
  },
]);

// Mock session data - replace with actual data from API
const sessionData = ref({
  lokasiAkaun: "Cawangan Kuala Lumpur",
  namaPengguna: "Ahmad bin Hassan",
  idBukaOperasi: "OPK-20240315-001",
  statusSesi: "Aktif",
  isBranchAccount: true, // This will determine if cash handover section is shown
});

const formData = ref({
  // Header Info
  lokasiAkaun: sessionData.value.lokasiAkaun,
  namaPengguna: sessionData.value.namaPengguna,
  tarikhMasaRekod: new Date().toISOString(),
  idBukaOperasi: sessionData.value.idBukaOperasi,
  statusSesi: sessionData.value.statusSesi,

  // Rekod Baki Akhir
  jumlahTunaiKertas: null,
  jumlahSyiling: null,
  jumlahKeseluruhan: 0,
  catatanTambahan: "",

  // Serahan Tunai
  namaPkpPenerima: "",
  tarikhMasaSerahan: new Date().toISOString(),
  catatanSerahan: "",
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

const totalCash = computed(() => {
  const kertas = parseFloat(formData.value.jumlahTunaiKertas) || 0;
  const syiling = parseFloat(formData.value.jumlahSyiling) || 0;
  return kertas + syiling;
});

// Helper functions
const formatCurrency = (value) => {
  return new Intl.NumberFormat("ms-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);
};

// Event handlers
const handleCancel = () => {
  router.back();
};

const validateAndShowConfirmation = () => {
  const errors = [];

  // Validate cash amounts
  if (
    !formData.value.jumlahTunaiKertas &&
    formData.value.jumlahTunaiKertas !== 0
  ) {
    errors.push("Jumlah tunai kertas diperlukan");
  } else if (formData.value.jumlahTunaiKertas < 0) {
    errors.push("Jumlah tunai kertas tidak boleh negatif");
  }

  if (!formData.value.jumlahSyiling && formData.value.jumlahSyiling !== 0) {
    errors.push("Jumlah syiling diperlukan");
  } else if (formData.value.jumlahSyiling < 0) {
    errors.push("Jumlah syiling tidak boleh negatif");
  }

  // Validate total cash
  if (totalCash.value <= 0) {
    errors.push("Jumlah keseluruhan tunai mesti lebih daripada 0");
  }

  // Validate PKP receiver for branch accounts
  if (isBranchAccount.value) {
    if (!formData.value.namaPkpPenerima?.trim()) {
      errors.push("Nama PKP penerima diperlukan untuk akaun cawangan");
    }
  }

  if (errors.length > 0) {
    // Show error message
    alert(errors.join("\n"));
    return;
  }

  showConfirmationModal.value = true;
};

const handleConfirm = async () => {
  processing.value = true;
  errorMessage.value = "";

  try {
    // Prepare data for submission
    const submissionData = {
      ...formData.value,
      jumlahKeseluruhan: totalCash.value,
      tarikhMasaRekod: new Date().toISOString(),
      tarikhMasaSerahan: isBranchAccount.value
        ? new Date().toISOString()
        : null,
      statusSesi: isBranchAccount.value
        ? "Menunggu Penerimaan PKP"
        : "Akaun Ditutup",
    };

    // TODO: Implement API call to save the data
    await new Promise((resolve) => setTimeout(resolve, 1000));

    isCompleted.value = true;
    showConfirmationModal.value = false;

    // Show success message
    alert("Rekod baki akhir berjaya disimpan");

    // Redirect based on account type
    // if (isBranchAccount.value) {
    //   router.push('/BF-TNI/closing-tunai/menunggu-penerimaan-pkp');
    // } else {
    //   router.push('/BF-TNI/closing-tunai/akaun-ditutup');
    // }

    router.push("/BF-TNI/closing-tunai/eksekutif/terima-sah-penerimaan-tunai");
  } catch (error) {
    console.error("Error saving data:", error);
    errorMessage.value =
      "Ralat: Gagal menyimpan rekod baki akhir. Sila cuba lagi.";
  } finally {
    processing.value = false;
  }
};

const handleSubmit = (data) => {
  console.log("Form submitted:", data);
  validateAndShowConfirmation();
};

// Add watchers for real-time validation
watch(
  () => formData.value.jumlahTunaiKertas,
  (newValue) => {
    if (newValue < 0) {
      formData.value.jumlahTunaiKertas = 0;
    }
  }
);

watch(
  () => formData.value.jumlahSyiling,
  (newValue) => {
    if (newValue < 0) {
      formData.value.jumlahSyiling = 0;
    }
  }
);
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
