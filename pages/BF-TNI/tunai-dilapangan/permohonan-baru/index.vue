<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex gap-2 items-center">
          <Icon name="heroicons:document-plus" class="nas-icon-header" />
          <h2 class="nas-section-heade">Permohonan Baru – Tunai Lapangan</h2>
        </div>
      </template>

      <template #body>
        <FormKit
          type="form"
          v-model="formData"
          :actions="false"
          @submit="handleSubmit"
          :classes="{
            messages: 'mb-4',
            form: 'space-y-6',
          }"
        >
          <!-- Section 1: Maklumat Permohonan Tunai Lapangan -->
          <rs-fieldset>
            <template #legend>
              <h3 class="nas-subsection-header">
                Maklumat Permohonan Tunai Lapangan
                <span class="nas-required">*</span>
              </h3>
            </template>

            <div class="nas-field-group">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Nama Pemohon / EOAD -->
                <FormKit
                  type="text"
                  name="namaPemohon"
                  label="Nama Pemohon / EOAD"
                  :value="userInfo.name"
                  readonly
                  help="Auto capture from logged-in user"
                />

                <!-- Tujuan Pengeluaran Tunai -->
                <FormKit
                  type="textarea"
                  name="tujuanPengeluaran"
                  label="Tujuan Pengeluaran Tunai"
                  placeholder="Sila nyatakan tujuan pengeluaran tunai"
                  validation="required"
                  :validation-messages="{
                    required: 'Sila nyatakan tujuan pengeluaran tunai',
                  }"
                  help="Nyatakan tujuan pengeluaran tunai dengan jelas"
                />

                <!-- Jumlah Tunai Dimohon -->
                <div class="nas-amount-input">
                  <span class="nas-currency-prefix">RM</span>
                  <FormKit
                    type="number"
                    name="jumlahTunai"
                    label="Jumlah Tunai Dimohon (RM)"
                    placeholder="0.00"
                    validation="required|min:1"
                    :validation-messages="{
                      required: 'Sila masukkan jumlah tunai',
                      min: 'Jumlah tunai mesti lebih daripada RM 0.00',
                    }"
                    help="Jumlah tunai yang dimohon"
                  />
                </div>

                <!-- Baki Peti Besi Semasa -->
                <FormKit
                  type="text"
                  name="bakiPetiBesi"
                  label="Baki Peti Besi Semasa"
                  :value="formatCurrency(safeBoxBalance)"
                  readonly
                  help="Auto display from system"
                />

                <!-- Lokasi Lapangan -->
                <FormKit
                  type="select"
                  name="lokasiLapangan"
                  label="Lokasi Lapangan"
                  :options="lokasiOptions"
                  placeholder="Sila pilih lokasi lapangan"
                  validation="required"
                  :validation-messages="{
                    required: 'Sila pilih lokasi lapangan',
                  }"
                  help="Pilih lokasi lapangan yang berkaitan"
                />
              </div>
            </div>
          </rs-fieldset>

          <!-- Form Footer -->

          <div class="flex justify-end gap-2">
            <rs-button
              variant="secondary"
              @click="handleCancel"
              class="flex items-center"
            >
              <Icon name="heroicons:x-mark" class="nas-button-icon-left" />
              Batal
            </rs-button>
            <rs-button
              type="submit"
              class="flex items-center"
              @click="handleSubmit"
            >
              <Icon
                name="heroicons:paper-airplane"
                class="nas-button-icon-left"
              />
              Hantar Permohonan
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showConfirmModal"
      title="Sahkan Permohonan"
      :ok-callback="confirmSubmit"
      :cancel-callback="cancelSubmit"
      ok-title="Hantar"
      cancel-title="Kembali"
      :overlay-close="false"
      position="center"
    >
      <div class="space-y-4">
        <p class="text-gray-700">
          Adakah anda pasti untuk menghantar permohonan ini?
        </p>
        <div class="bg-gray-50 p-4 rounded-lg space-y-2">
          <div class="flex justify-between">
            <span class="text-gray-600">Nama Pemohon:</span>
            <span class="font-medium">{{ formData.namaPemohon }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Jumlah Tunai:</span>
            <span class="font-medium">{{
              formatCurrency(formData.jumlahTunai)
            }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Lokasi Lapangan:</span>
            <span class="font-medium">{{
              getLocationLabel(formData.lokasiLapangan)
            }}</span>
          </div>
        </div>
      </div>
    </rs-modal>
  </div>
</template>

<script setup>
definePageMeta({
  title: "Permohonan Baru – Tunai Lapangan",
  middleware: ["auth"],
  requiresAuth: true,
});

// Breadcrumb
const breadcrumb = [
  {
    name: "Tunai Dilapangan",
    path: "/BF-TNI/tunai-dilapangan",
  },
  {
    name: "Permohonan Baru",
    path: "/BF-TNI/tunai-dilapangan/permohonan-baru",
  },
];

// Form Data
const formData = ref({
  namaPemohon: "",
  tujuanPengeluaran: "",
  jumlahTunai: "",
  bakiPetiBesi: "",
  lokasiLapangan: "",
});

// User Info (to be replaced with actual user data)
const userInfo = ref({
  name: "John Doe", // This should come from your auth system
});

// Safe Box Balance (to be replaced with actual data)
const safeBoxBalance = ref(10000.0);

// Location Options (to be replaced with actual data)
const lokasiOptions = [
  { label: "Lokasi A", value: "A" },
  { label: "Lokasi B", value: "B" },
  { label: "Lokasi C", value: "C" },
];

// Loading State
const isSubmitting = ref(false);

// Modal State
const showConfirmModal = ref(false);

// Format Currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat("ms-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// Get Location Label
const getLocationLabel = (value) => {
  const location = lokasiOptions.find((opt) => opt.value === value);
  return location ? location.label : value;
};

// Handle Form Submit
const handleSubmit = async (formData) => {
  showConfirmModal.value = true;
};

// Confirm Submit
const confirmSubmit = async () => {
  try {
    isSubmitting.value = true;
    showConfirmModal.value = false;

    // TODO: Implement form submission logic
    // 1. Save the form
    // 2. Set Status = 'Menunggu Kelulusan'
    // 3. Trigger notification to KOAD/EKS HQ
    // 4. Save Audit Trail
    // 5. Auto navigate back to Listing

    // For now, just show success message
    const { $swal } = useNuxtApp();
    await $swal.fire({
      icon: "success",
      title: "Berjaya",
      text: "Permohonan telah dihantar",
      confirmButtonText: "OK",
    });

    // Navigate back to listing
    navigateTo("/BF-TNI/tunai-dilapangan/permohonan-baru");
  } catch (error) {
    console.error("Error submitting form:", error);
    const { $swal } = useNuxtApp();
    await $swal.fire({
      icon: "error",
      title: "Ralat",
      text: "Permohonan gagal dihantar. Sila cuba lagi.",
      confirmButtonText: "OK",
    });
  } finally {
    isSubmitting.value = false;
  }
};

// Cancel Submit
const cancelSubmit = () => {
  showConfirmModal.value = false;
};

// Handle Cancel
const handleCancel = () => {
  navigateTo("/BF-TNI/tunai-dilapangan");
};
</script>

<style lang="scss" scoped>
/* Card Design Standards */
.nas-form-card {
  margin-bottom: 24px;
}

.nas-card-header {
  display: flex;
  align-items: center;
  padding: 24px 24px 0 24px;
}

.nas-icon-header {
  width: 24px;
  height: 24px;
  color: #005aad; /* LZS Primary Blue */
  margin-right: 8px;
}

.nas-section-header {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.nas-subsection-header {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.nas-required {
  color: #dc2626;
  margin-left: 2px;
}

/* Form Styling */
.nas-field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Amount Input Styling */
.nas-amount-input {
  position: relative;
  display: flex;
  align-items: center;
}

.nas-currency-prefix {
  position: absolute;
  left: 12px;
  top: 46%;
  transform: translateY(-50%);
  color: #6b7280;
  font-weight: 600;
  z-index: 10;
  pointer-events: none;
}

.nas-amount-input :deep(.formkit-wrapper) {
  position: relative;
  width: 100%;
}

.nas-amount-input :deep(.formkit-input) {
  padding-left: 40px !important;
}

.nas-amount-input :deep(input) {
  padding-left: 40px !important;
}

/* Form Footer */
.nas-form-footer {
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
  padding: 24px;
  margin-top: 32px;
}

.nas-footer-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

@media (max-width: 640px) {
  .nas-footer-actions {
    flex-direction: column;
    width: 100%;
  }

  .nas-footer-actions button {
    width: 100%;
  }
}

/* Button Icons */
.nas-button-icon-left {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

/* Form Validation Styles */
:deep(.formkit-input:focus) {
  border-color: #005aad !important;
  box-shadow: 0 0 0 3px rgba(0, 90, 173, 0.1) !important;
}

:deep(.formkit-invalid) {
  border-color: #dc2626 !important;
}

:deep(.formkit-message) {
  color: #dc2626;
  font-size: 12px;
  margin-top: 4px;
}
</style>
