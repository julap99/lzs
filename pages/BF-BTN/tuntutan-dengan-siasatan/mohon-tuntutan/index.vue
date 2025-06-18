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
                :options="[{ label: '', value: '' }, ...glOptions]"
                validation="required"
                :validation-messages="{
                  required: 'Sila pilih Nombor GL'
                }"
                @change="handleGLChange"
              />
            </div>
          </div>

          <!-- Section 2: Maklumat Bantuan -->
          <div class="mb-8">
            <h3 class="text-lg font-medium mb-4">Maklumat Bantuan</h3>
            <div class="bg-gray-50 p-4 rounded-lg mb-6">
              <h4 class="text-md font-medium mb-4">Butiran asas jenis bantuan</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormKit
                  v-model="formData.kodBantuan"
                  type="select"
                  label="Kod Bantuan"
                  :options="kodBantuanOptions"
                  validation="required"
                  :validation-messages="{
                    required: 'Sila pilih Kod Bantuan'
                  }"
                  @change="handleKodBantuanChange"
                />

                <FormKit
                  v-model="formData.jenisBantuan"
                  type="select"
                  label="Jenis Bantuan"
                  :options="jenisBantuanOptions"
                  validation="required"
                  :validation-messages="{
                    required: 'Sila pilih Jenis Bantuan'
                  }"
                  @change="handleJenisBantuanChange"
                />

                <FormKit
                  v-model="formData.bahanBantuan"
                  type="select"
                  label="Bahan Bantuan"
                  :options="bahanBantuanOptions"
                  validation="required"
                  :validation-messages="{
                    required: 'Sila pilih Bahan Bantuan'
                  }"
                  @change="handleBahanBantuanChange"
                />

                <FormKit
                  v-model="formData.pakejBantuan"
                  type="select"
                  label="Pakej Bantuan"
                  :options="pakejBantuanOptions"
                  validation="required"
                  :validation-messages="{
                    required: 'Sila pilih Pakej Bantuan'
                  }"
                  @change="handlePakejBantuanChange"
                />

                <FormKit
                  v-model="formData.kelayakanBantuan"
                  type="select"
                  label="Kelayakan Bantuan"
                  :options="kelayakanBantuanOptions"
                  validation="required"
                  :validation-messages="{
                    required: 'Sila pilih Kelayakan Bantuan'
                  }"
                />
              </div>
            </div>
          </div>

          <!-- Section 3: Isi Permohonan Tuntutan -->
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

          <!-- Section 4: Muat Naik Dokumen Sokongan -->
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

          <!-- Section 5: Action & Status -->
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
              type="button"
              variant="primary"
              @click="handleSubmit"
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
import { useNuxtApp } from "#app";

definePageMeta({
  title: "Mohon Tuntutan GL (TDS-01)",
});

const { $swal } = useNuxtApp();

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
  kodBantuan: "",
  jenisBantuan: "",
  bahanBantuan: "",
  pakejBantuan: "",
  kelayakanBantuan: "",
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

// Mock data for bantuan options
const kodBantuanOptions = ref([
  { label: 'B400', value: 'B400' }
]);

const jenisBantuanOptions = ref([
  { label: '(HQ) BANTUAN SUMBANGAN PERALATAN & BINA/BAIKPULIH INSTITUSI AGAMA', value: 'HQ_BANTUAN_SUMBANGAN_PERALATAN' },
  { label: 'BANTUAN SUMBANGAN PERALATAN & BINA/BAIKPULIH INSTITUSI AGAMA', value: 'BANTUAN_SUMBANGAN_PERALATAN' }
]);

const bahanBantuanOptions = ref([
  { label: '(HQ) BANTUAN SUMBANGAN PERALATAN INSTITUSI AGAMA', value: 'HQ_BANTUAN_SUMBANGAN_PERALATAN' },
  { label: 'BANTUAN SUMBANGAN PERALATAN INSTITUSI AGAMA', value: 'BANTUAN_SUMBANGAN_PERALATAN' },
  { label: 'BANTUAN SUMBANGAN KARPET', value: 'BANTUAN_SUMBANGAN_KARPET' }
]);

const pakejBantuanOptions = ref([
  { label: '(GL) (HQ) BANTUAN CUCIAN KARPET INSTITUSI AGAMA', value: 'GL_HQ_BANTUAN_CUCIAN_KARPET' },
  { label: '(GL) (HQ) BANTUAN SUMBANGAN KARPET INSTITUSI AGAMA', value: 'GL_HQ_BANTUAN_SUMBANGAN_KARPET' },
  { label: '(GL) (HQ) BANTUAN SUMBANGAN PERALATAN INSTITUSI AGAMA', value: 'GL_HQ_BANTUAN_SUMBANGAN_PERALATAN' },
  { label: '(GL) (HQ) SUMBANGAN PERALATAN SEKOLAH AGAMA', value: 'GL_HQ_SUMBANGAN_PERALATAN_SEKOLAH' },
  { label: 'SUMBANGAN PERALATAN SURAU SEKOLAH', value: 'SUMBANGAN_PERALATAN_SURAU' },
  { label: 'BANTUAN SUMBANGAN KARPET', value: 'BANTUAN_SUMBANGAN_KARPET' }
]);

const kelayakanBantuanOptions = ref([
  { label: '(GL) (HQ) BANTUAN CUCIAN KARPET INSTITUSI AGAMA', value: 'GL_HQ_BANTUAN_CUCIAN_KARPET' },
  { label: '(GL) (HQ) BANTUAN SUMBANGAN KARPET INSTITUSI AGAMA', value: 'GL_HQ_BANTUAN_SUMBANGAN_KARPET' },
  { label: '(GL) (HQ) BANTUAN SUMBANGAN PERALATAN INSTITUSI AGAMA', value: 'GL_HQ_BANTUAN_SUMBANGAN_PERALATAN' },
  { label: '(GL) (HQ) SUMBANGAN PERALATAN SEKOLAH AGAMA', value: 'GL_HQ_SUMBANGAN_PERALATAN_SEKOLAH' },
  { label: '(GL) SUMBANGAN PERALATAN SURAU SEKOLAH', value: 'GL_SUMBANGAN_PERALATAN_SURAU' },
  { label: '(GL) BANTUAN SUMBANGAN KARPET', value: 'GL_BANTUAN_SUMBANGAN_KARPET' },
  { label: '(GL) SUMBANGAN PERALATAN SEKOLAH AGAMA', value: 'GL_SUMBANGAN_PERALATAN_SEKOLAH' }
]);

// Handle GL selection change
const handleGLChange = (value) => {
  // Auto-populate related fields based on selected GL
  console.log("Selected GL:", value);
  // Add logic to fetch and populate GL details
};

// Handle changes in bantuan fields
const handleKodBantuanChange = (value) => {
  // Reset dependent fields
  formData.value.jenisBantuan = '';
  formData.value.bahanBantuan = '';
  formData.value.pakejBantuan = '';
  formData.value.kelayakanBantuan = '';
};

const handleJenisBantuanChange = (value) => {
  // Reset dependent fields
  formData.value.bahanBantuan = '';
  formData.value.pakejBantuan = '';
  formData.value.kelayakanBantuan = '';
};

const handleBahanBantuanChange = (value) => {
  // Reset dependent fields
  formData.value.pakejBantuan = '';
  formData.value.kelayakanBantuan = '';
};

const handlePakejBantuanChange = (value) => {
  // Reset dependent field
  formData.value.kelayakanBantuan = '';
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
    await $swal.fire({
      icon: 'success',
      title: 'Berjaya!',
      text: 'Permohonan tuntutan anda telah berjaya dihantar',
      confirmButtonText: 'OK'
    });
    navigateTo('/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan');
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
    await $swal.fire({
      icon: 'success',
      title: 'Berjaya!',
      text: 'Permohonan tuntutan anda telah berjaya disimpan sebagai "Draf"',
      confirmButtonText: 'OK'
    });
    navigateTo('/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan');
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
