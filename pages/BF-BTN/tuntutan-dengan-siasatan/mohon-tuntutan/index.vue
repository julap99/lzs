<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Mohon Tuntutan GL (TDS-01)</h2>
        </div>
      </template>

      <template #body>
        <form @submit.prevent="handleSubmit">
          <!-- Section 1: Pilih GL -->
          <div class="mb-8">
            <h3 class="text-lg font-medium mb-4">Pilih GL</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormKit
                v-model="formData.noGL"
                type="select"
                label="Nombor GL"
                :options="glOptions"
                validation="required"
                :validation-messages="{
                  required: 'Sila pilih Nombor GL'
                }"
                @change="handleGLChange"
              />
            </div>
          </div>

          <!-- Section 2: Isi Permohonan Tuntutan -->
          <div class="mb-8">
            <h3 class="text-lg font-medium mb-4">Isi Permohonan Tuntutan</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormKit
                v-model="formData.noGL"
                type="text"
                label="No. GL"
                disabled
              />

              <FormKit
                v-model="formData.amaunTuntutan"
                type="number"
                label="Amaun Tuntutan (RM)"
                validation="required|number|min:0"
                :validation-messages="{
                  required: 'Sila masukkan amaun tuntutan',
                  number: 'Sila masukkan nilai yang sah',
                  min: 'Amaun tidak boleh negatif'
                }"
                step="0.01"
                min="0"
              />

              <FormKit
                v-model="formData.tarikhPerkhidmatan"
                type="date"
                label="Tarikh Perkhidmatan"
                validation="required"
                :validation-messages="{
                  required: 'Sila pilih tarikh perkhidmatan'
                }"
              />

              <FormKit
                v-model="formData.catatanTambahan"
                type="textarea"
                label="Catatan Tambahan"
                rows="3"
                placeholder="Masukkan catatan tambahan jika perlu..."
              />
            </div>
          </div>

          <!-- Section 3: Muat Naik Dokumen Sokongan -->
          <div class="mb-8">
            <h3 class="text-lg font-medium mb-4">Muat Naik Dokumen Sokongan</h3>
            <div class="grid grid-cols-1 gap-6">
              <FormKit
                v-model="formData.dokumenSokongan"
                type="file"
                label="Upload Dokumen"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                validation="required"
                :validation-messages="{
                  required: 'Sila muat naik sekurang-kurangnya satu dokumen sokongan'
                }"
                help="Format yang diterima: PDF, JPG, JPEG, PNG. Saiz maksimum: 5MB"
              />
            </div>
          </div>

          <!-- Section 4: Action & Status -->
          <div class="flex justify-end gap-4">
            <rs-button
              type="button"
              variant="secondary"
              @click="handleSaveDraft"
            >
              <Icon name="material-symbols:save" class="w-4 h-4 mr-1" />
              Simpan Draf
            </rs-button>
            <rs-button
              type="submit"
              variant="primary"
            >
              <Icon name="material-symbols:send" class="w-4 h-4 mr-1" />
              Hantar Tuntutan
            </rs-button>
          </div>
        </form>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Mohon Tuntutan GL (TDS-01)",
});

const breadcrumb = ref([
  {
    name: "Tuntutan dengan Siasatan",
    type: "link",
    path: "/BF-BTN/tuntutan-dengan-siasatan",
  },
  {
    name: "Mohon Tuntutan",
    type: "current",
    path: "/BF-BTN/tuntutan-dengan-siasatan/mohon-tuntutan",
  },
]);

// Form data
const formData = ref({
  noGL: "",
  amaunTuntutan: "",
  tarikhPerkhidmatan: "",
  catatanTambahan: "",
  dokumenSokongan: [],
});

// Sample GL options - Replace with actual API call
const glOptions = ref([
  { label: "GL-001 - Bantuan Makanan", value: "GL-001" },
  { label: "GL-002 - Bantuan Pendidikan", value: "GL-002" },
  { label: "GL-003 - Bantuan Perubatan", value: "GL-003" },
]);

// Handle GL selection change
const handleGLChange = (value) => {
  // Auto-populate related fields based on selected GL
  console.log("Selected GL:", value);
  // Add logic to fetch and populate GL details
};

// Handle form submission
const handleSubmit = async () => {
  try {
    // Validate form
    const isValid = await validateForm();
    if (!isValid) return;

    // Prepare form data
    const formDataToSubmit = {
      ...formData.value,
      status: "Dalam Semakan",
      tarikhTuntutan: new Date().toISOString(),
    };

    // Submit form data
    console.log("Submitting form:", formDataToSubmit);
    // Add API call here

    // Show success message
    // Navigate to success page or show notification
  } catch (error) {
    console.error("Error submitting form:", error);
    // Show error message
  }
};

// Handle save as draft
const handleSaveDraft = async () => {
  try {
    // Prepare draft data
    const draftData = {
      ...formData.value,
      status: "Draf",
      tarikhTuntutan: new Date().toISOString(),
    };

    // Save draft
    console.log("Saving draft:", draftData);
    // Add API call here

    // Show success message
    // Navigate to draft list or show notification
  } catch (error) {
    console.error("Error saving draft:", error);
    // Show error message
  }
};

// Form validation
const validateForm = async () => {
  // Add form validation logic here
  return true;
};
</script>

<style lang="scss" scoped>
// Add any additional styles here
</style>
