<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="nas-card-header">
          <Icon name="heroicons:document-plus" class="nas-icon-header" />
          <h2 class="nas-section-header">
            {{
              isEdit
                ? "Edit Permohonan Tambah Nilai Tunai"
                : "Mohon Tambah Nilai Tunai"
            }}
          </h2>
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
          <!-- Header Info -->
          <rs-fieldset>
            <template #legend>
              <h3 class="nas-subsection-header">
                Maklumat Pemohon <span class="nas-required">*</span>
              </h3>
            </template>

            <div class="nas-field-group">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormKit
                  type="text"
                  name="namaPemohon"
                  label="Nama Pemohon"
                  :value="userInfo.name"
                  readonly
                  help="Nama pemohon yang berdaftar"
                />
                <FormKit
                  type="text"
                  name="lokasiAkaun"
                  label="Lokasi / Akaun Peti Besi"
                  :value="userInfo.safeBoxAccount"
                  readonly
                  help="Lokasi dan nombor akaun peti besi"
                />
              </div>
            </div>
          </rs-fieldset>

          <!-- Form Input -->
          <rs-fieldset>
            <template #legend>
              <h3 class="nas-subsection-header">
                Maklumat Permohonan <span class="nas-required">*</span>
              </h3>
            </template>

            <div class="nas-field-group">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="nas-amount-input">
                  <FormKit
                    type="number"
                    name="jumlahDipohon"
                    label="Jumlah Tambah Nilai Dipohon (RM)"
                    validation="required|number|min:1"
                    validation-label="Jumlah Dipohon"
                    :validation-messages="{
                      required: 'Sila masukkan jumlah dipohon',
                      number: 'Sila masukkan nilai yang sah',
                      min: 'Jumlah minimum ialah RM 1.00',
                    }"
                    help="Masukkan jumlah yang dipohon untuk ditambah ke dalam peti besi"
                    step="0.01"
                    min="1"
                  />
                </div>
                <FormKit
                  type="text"
                  name="tarikhPermohonan"
                  label="Tarikh Permohonan"
                  :value="currentDate"
                  readonly
                  help="Tarikh permohonan dibuat"
                />
              </div>

              <div class="mt-4">
                <FormKit
                  type="textarea"
                  name="justifikasi"
                  label="Justifikasi / Catatan Tambahan"
                  validation="required"
                  validation-label="Justifikasi"
                  :validation-messages="{
                    required: 'Sila masukkan justifikasi permohonan',
                  }"
                  rows="4"
                  maxlength="500"
                  help="Berikan justifikasi atau sebab untuk permohonan tambah nilai tunai"
                  @blur="autoSave"
                />
                <div class="nas-char-counter">
                  {{ formData.justifikasi?.length || 0 }}/500 aksara
                </div>
              </div>
            </div>
          </rs-fieldset>

          <!-- Action Buttons -->
          <div class="nas-form-footer">
            <div class="nas-footer-actions">
              <rs-button
                variant="outline"
                size="lg"
                @click="goBack"
                :disabled="isSubmitting"
              >
                <Icon
                  name="heroicons:arrow-left"
                  class="nas-button-icon-left"
                />
                Batal
              </rs-button>

              <rs-button
                type="submit"
                variant="primary"
                size="lg"
                :loading="isSubmitting"
                :disabled="isSubmitting"
                @click="handleSubmit"
              >
                <Icon
                  name="heroicons:paper-airplane"
                  class="nas-button-icon-left"
                />
                {{ isEdit ? "Kemaskini Permohonan" : "Hantar Permohonan" }}
              </rs-button>
            </div>
          </div>
        </FormKit>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
const router = useRouter();
const route = useRoute();

definePageMeta({
  title: "Mohon Tambah Nilai Tunai",
  middleware: ["auth"],
});

// State
const isEdit = ref(false);
const isSubmitting = ref(false);
const formData = ref({});

// Breadcrumb
const breadcrumb = ref([
  {
    name: "Tambah Nilai Tunai",
    type: "current",
    path: "/BF-TNI/tambah-nilai-tunai",
  },
  {
    name: "Mohon Tambah Nilai Tunai",
    type: "current",
    path: "/BF-TNI/tambah-nilai-tunai/mohon-tambah-nilai-tunai",
  },
]);

// Mock user info - replace with actual user data
const userInfo = ref({
  name: "John Doe",
  safeBoxAccount: "Peti Besi A-123",
});

// Get current date in YYYY-MM-DD format
const currentDate = new Date().toISOString().split("T")[0];

// Check if we're in edit mode
onMounted(() => {
  const requestId = route.params.id;
  if (requestId) {
    isEdit.value = true;
    // TODO: Fetch request details and populate form
    loadRequestData(requestId);
  }
});

// Methods
const loadRequestData = async (requestId) => {
  // TODO: Implement API call to fetch request data
  // Mock data for now
  formData.value = {
    jumlahDipohon: "5000.00",
    justifikasi: "Sample justification text",
  };
};

const handleSubmit = async (formData) => {
  try {
    isSubmitting.value = true;

    // TODO: Implement API call to save/update request
    console.log("Submitting form data:", formData);

    // Mock API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Show success message and redirect
    // TODO: Replace with actual notification system
    alert(
      isEdit.value
        ? "Permohonan berjaya dikemaskini"
        : "Permohonan berjaya dihantar"
    );
    goBack();
  } catch (error) {
    console.error("Error submitting form:", error);
    // TODO: Show error message
    alert("Ralat: " + error.message);
  } finally {
    isSubmitting.value = false;
  }
};

const goBack = () => {
  router.push("/BF-TNI/tambah-nilai-tunai/mohon-tambah-nilai-tunai");
};

const autoSave = () => {
  // TODO: Implement auto-save functionality
  console.log("Auto-saving form data:", formData.value);
};
</script>

<style lang="scss" scoped>
.nas-card-header {
  @apply flex items-center gap-2;
}

.nas-icon-header {
  @apply w-6 h-6 text-primary;
}

.nas-section-header {
  @apply text-xl font-semibold text-gray-800;
}

.nas-subsection-header {
  @apply text-base font-semibold text-gray-700 mb-4;
}

.nas-required {
  @apply text-red-500 ml-1;
}

.nas-field-group {
  @apply space-y-4;
}

.nas-amount-input {
  @apply relative;

  :deep(input) {
    @apply pl-3;
  }
}

.nas-char-counter {
  @apply text-sm text-gray-500 mt-1 text-right;
}

.nas-form-footer {
  @apply mt-8 pt-6 border-t border-gray-200;
}

.nas-footer-actions {
  @apply flex justify-end gap-4;
}

.nas-button-icon-left {
  @apply w-5 h-5 mr-2;
}

:deep(.rs-fieldset legend) {
  @apply w-full p-0 mb-4;
}

:deep(.rs-fieldset legend h3) {
  @apply text-base font-semibold text-gray-700 m-0 p-2 bg-gray-50 rounded border-b border-gray-200;
}
</style>
