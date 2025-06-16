<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Page Header -->
    <div class="mt-6 mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Rekod Baki Akhir & Serahan Tunai</h1>
          <p class="mt-1 text-sm text-gray-600">
            Lengkapkan baki akhir dan proses serahan tunai untuk sesi operasi semasa.
          </p>
        </div>
        <rs-badge
          :variant="sessionData.statusSesi === 'Aktif' ? 'success' : 'default'"
          class="text-sm px-4 py-2"
        >
          {{ sessionData.statusSesi }}
        </rs-badge>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Kiri: Kandungan utama -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Maklumat Header -->
        <rs-card>
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:info" class="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">Maklumat Operasi</h2>
                <p class="text-sm text-gray-500">Butiran sesi semasa dan ID operasi</p>
              </div>
            </div>
          </template>

          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit type="text" label="Lokasi / Akaun Tunai" :value="sessionData.lokasiAkaun" disabled />
              <FormKit type="text" label="Nama Pengguna (Login)" :value="sessionData.namaPengguna" disabled />
              <FormKit type="text" label="Tarikh & Masa Rekod" :value="formattedDateTime" disabled />
              <FormKit type="text" label="ID Buka Operasi" :value="sessionData.idBukaOperasi" disabled />
              <FormKit type="text" label="Status Sesi" :value="sessionData.statusSesi" disabled />
            </div>
          </template>
        </rs-card>

        <!-- Rekod Baki Akhir -->
        <rs-card>
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:wallet" class="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">Rekod Baki Akhir</h2>
                <p class="text-sm text-gray-500">Maklumat tunai yang perlu direkod</p>
              </div>
            </div>
          </template>

          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit type="number" label="Jumlah Tunai Kertas (RM)" v-model="formData.jumlahTunaiKertas" :disabled="isCompleted" validation="required|min:0" />
              <FormKit type="number" label="Jumlah Syiling (RM)" v-model="formData.jumlahSyiling" :disabled="isCompleted" validation="required|min:0" />
              <FormKit type="text" label="Jumlah Keseluruhan Tunai (RM)" :value="formatCurrency(totalCash)" disabled />
              <FormKit type="textarea" label="Catatan Tambahan (jika ada)" v-model="formData.catatanTambahan" :disabled="isCompleted" class="md:col-span-2" />
              <div v-if="totalCash <= 0" class="md:col-span-2">
                <RsAlert type="warning">
                  <template #icon>
                    <Icon name="heroicons:exclamation-triangle" />
                  </template>
                  Jumlah keseluruhan tunai mesti lebih daripada 0.
                </RsAlert>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Serahan Tunai -->
        <!-- <rs-card v-if="isBranchAccount">
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:handshake" class="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">Serahan Tunai</h2>
                <p class="text-sm text-gray-500">Maklumat serahan kepada PKP</p>
              </div>
            </div>
          </template>

          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit type="text" label="Nama PKP Penerima Tunai" v-model="formData.namaPkpPenerima" :disabled="isCompleted" validation="required" />
              <FormKit type="text" label="Tarikh & Masa Serahan Tunai" :value="formattedDateTime" disabled />
              <FormKit type="textarea" label="Catatan Serahan (jika ada)" v-model="formData.catatanSerahan" :disabled="isCompleted" class="md:col-span-2" />
            </div>
          </template>
        </rs-card> -->
      </div>

      <!-- Sidebar Tindakan -->
      <div class="lg:col-span-1">
        <rs-card class="sticky top-6">
           <template #header>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:hand" class="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">Maklumat Serahan & Tindakan</h2>
                <p class="text-sm text-gray-500">Maklumat serahan tunai kepada PKP</p>
              </div>
            </div>
          </template>

          <template #body>
            <FormKit type="form" :actions="false">
              <div class="space-y-4">
                <!-- Baki Tunai -->
                <FormKit
                  v-if="!isCompleted"
                  type="number"
                  label="Jumlah Tunai Kertas (RM)"
                  validation="required|min:0"
                  v-model="formData.jumlahTunaiKertas"
                />
                <FormKit
                  v-if="!isCompleted"
                  type="number"
                  label="Jumlah Syiling (RM)"
                  validation="required|min:0"
                  v-model="formData.jumlahSyiling"
                />
                <div class="text-sm font-medium">
                  Jumlah Keseluruhan:
                  <span class="font-bold text-gray-800">
                    RM {{ formatCurrency(totalCash) }}
                  </span>
                </div>

                <!-- Serahan Tunai (jika akaun cawangan) -->
                <template v-if="isBranchAccount">
                  <hr class="my-4" />
                  <div class="text-sm font-semibold text-gray-600">Serahan Tunai</div>
                  <FormKit
                    type="text"
                    label="Nama PKP Penerima"
                    validation="required"
                    v-model="formData.namaPkpPenerima"
                  />
                  <FormKit
                    type="text"
                    label="Tarikh & Masa Serahan"
                    :value="formattedDateTime"
                    disabled
                  />
                  <FormKit
                    type="textarea"
                    label="Catatan Serahan (jika ada)"
                    v-model="formData.catatanSerahan"
                  />
                </template>

                <!-- Button -->
                <div class="flex justify-between items-center mt-6">
                  <rs-button
                    type="submit"
                    variant="primary"
                    :disabled="isCompleted"
                    @click="validateAndShowConfirmation"
                  >
                    Simpan
                  </rs-button>

                  <rs-button
                    variant="primary-outline"
                    @click="handleCancel"
                    :disabled="isCompleted"
                  >
                    Batal
                  </rs-button>
                </div>
              </div>
            </FormKit>
          </template>

        </rs-card>
      </div>
    </div>


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
  lokasiAkaun: "Cawangan Kuala Selangor",
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
