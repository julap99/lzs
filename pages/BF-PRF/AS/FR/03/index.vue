<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Semak Dokumen (Pegawai LZS)</h2>
        </div>
      </template>

      <template #body>
        <!-- Form Section -->
        <div class="mb-6">
          <p class="text-sm text-gray-600 mb-4">
            Proses semakan dokumen yang dihantar dan maklumat yang dimasukkan
          </p>

          <FormKit type="form" :actions="false" @submit="handleSubmit">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormKit
                type="text"
                name="icNumber"
                label="No. Kad Pengenalan"
                validation="required"
                v-model="formData.icNumber"
                :validation-messages="{
                  required: 'No. Kad Pengenalan adalah wajib',
                }"
                placeholder="Contoh: 880101121234"
                disabled
              />

              <FormKit
                type="text"
                name="name"
                label="Nama"
                v-model="formData.name"
                disabled
              />
            </div>

            <!-- Permohonan Details Section -->
            <div class="mt-6 mb-6">
              <h3 class="text-lg font-medium mb-4">Maklumat Permohonan</h3>
              <rs-alert variant="info" class="mb-4">
                <template #icon>
                  <Icon name="mdi:information" />
                </template>
                Berikut adalah maklumat permohonan yang telah dihantar oleh
                pengguna.
              </rs-alert>

              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm font-medium text-gray-500">
                      Jenis Permohonan
                    </p>
                    <p class="mt-1 text-sm">Permohonan Baru</p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">
                      Tarikh Permohonan
                    </p>
                    <p class="mt-1 text-sm">15/05/2023</p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">
                      Dokumen Dihantar
                    </p>
                    <ul class="mt-1 text-sm list-disc list-inside">
                      <li>Salinan Kad Pengenalan</li>
                      <li>Surat Pengesahan</li>
                      <li>Dokumen Sokongan</li>
                    </ul>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">
                      Status Semasa
                    </p>
                    <p class="mt-1 text-sm">Menunggu Semakan</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <FormKit
                type="select"
                name="documentStatus"
                label="Status Semak Dokumen"
                validation="required"
                :options="documentStatusOptions"
                v-model="formData.documentStatus"
                :validation-messages="{
                  required: 'Status semakan adalah wajib',
                }"
              />

              <FormKit
                type="text"
                name="reviewedBy"
                label="Disemak oleh"
                validation="required"
                v-model="formData.reviewedBy"
                :validation-messages="{
                  required: 'Nama penyemak adalah wajib',
                }"
              />

              <FormKit
                type="date"
                name="reviewDate"
                label="Tarikh Semakan"
                validation="required"
                v-model="formData.reviewDate"
                :validation-messages="{
                  required: 'Tarikh semakan adalah wajib',
                }"
              />
            </div>

            <div class="mt-6 flex justify-end gap-4">
              <div>
                <rs-button variant="primary-outline" @click="resetForm">
                  Reset
                </rs-button>
              </div>

              <div>
                <rs-button
                  variant="primary"
                  class="ml-auto"
                  @click="validateAndSubmit"
                  :disabled="processing"
                >
                  <span v-if="processing">
                    <Icon name="eos-icons:loading" class="ml-1" size="1rem" />
                  </span>
                  <span v-else>Kemaskini</span>
                </rs-button>
              </div>
            </div>
          </FormKit>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Semak Dokumen",
});

const processing = ref(false);

const breadcrumb = ref([
  {
    name: "Semak Dokumen",
    type: "current",
    path: "/document-review",
  },
]);

const documentStatusOptions = [
  { label: "Lengkap", value: "complete" },
  { label: "Tidak Lengkap", value: "incomplete" },
  { label: "Perlu Tindakan", value: "action_required" },
  { label: "Diluluskan", value: "approved" },
  { label: "Ditolak", value: "rejected" },
];

const formData = ref({
  icNumber: "000000000000",
  name: "Ahmad bin Ali", // This would typically come from API
  documentStatus: "",
  reviewedBy: "",
  reviewDate: "",
});

const resetForm = () => {
  formData.value.documentStatus = "";
  formData.value.reviewedBy = "";
  formData.value.reviewDate = "";
};

const validateAndSubmit = () => {
  if (
    !formData.value.icNumber ||
    !formData.value.documentStatus ||
    !formData.value.reviewedBy ||
    !formData.value.reviewDate
  ) {
    return;
  }

  submitForm();
};

const submitForm = async () => {
  processing.value = true;

  // Simulate API call to update document review status
  setTimeout(() => {
    processing.value = false;
    // Show success message or redirect
    navigateTo(`/BF-PRF/AS/FR/04`);
  }, 1000);
};

const handleSubmit = (data) => {
  console.log("Form submitted:", data);
  validateAndSubmit();
};
</script>
