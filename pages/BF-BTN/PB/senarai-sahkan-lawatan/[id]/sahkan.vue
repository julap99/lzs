<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Sahkan Lawatan</h2>
          <rs-badge v-if="formData.status" :variant="getStatusVariant(formData.status)">
            {{ formData.status }}
          </rs-badge>
        </div>
      </template>

      <template #body>
        <FormKit
          type="form"
          :actions="false"
          @submit="handleSubmit"
          v-model="formData"
        >
          <!-- Section 1: Maklumat Permohonan -->
          <rs-fieldset class="mb-6">
            <template #legend>
              <h3 class="text-lg font-medium">Maklumat Permohonan</h3>
            </template>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="text"
                name="idPermohonan"
                label="ID Permohonan"
                readonly
              />
              <FormKit
                type="text"
                name="namaPemohon"
                label="Nama Pemohon"
                readonly
              />
              <FormKit
                type="text"
                name="jenisBantuan"
                label="Jenis Bantuan"
                readonly
              />
            </div>
          </rs-fieldset>

          <!-- Section 2: Maklumat Lawatan -->
          <rs-fieldset class="mb-6">
            <template #legend>
              <h3 class="text-lg font-medium">Maklumat Lawatan</h3>
            </template>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="date"
                name="tarikhLawatan"
                label="Tarikh Lawatan"
                validation="required"
                :validation-messages="{
                  required: 'Sila masukkan tarikh lawatan',
                }"
              />
              <FormKit
                type="text"
                name="lokasiLawatan"
                label="Lokasi Lawatan (GPS / Alamat)"
                validation="required"
                :validation-messages="{
                  required: 'Sila masukkan lokasi lawatan',
                }"
              />
              <FormKit
                type="text"
                name="pegawaiBertugas"
                label="Pegawai Bertugas"
                validation="required"
                :validation-messages="{
                  required: 'Sila masukkan nama pegawai bertugas',
                }"
              />
              <FormKit
                type="file"
                name="buktiLawatan"
                label="Bukti Lawatan (Gambar, Borang)"
                accept="image/*,.pdf"
                multiple
                validation="required"
                :validation-messages="{
                  required: 'Sila muat naik bukti lawatan',
                }"
              />
            </div>
          </rs-fieldset>

          <!-- Section 3: Catatan Pegawai -->
          <rs-fieldset class="mb-6">
            <template #legend>
              <h3 class="text-lg font-medium">Catatan Pegawai</h3>
            </template>

            <div class="grid grid-cols-1 gap-4">
              <FormKit
                type="textarea"
                name="catatanPegawai"
                label="Catatan Pegawai"
                :rows="4"
                placeholder="Masukkan catatan jika perlu..."
              />
            </div>
          </rs-fieldset>

          <!-- Section 4: Action Buttons -->
          <div class="flex justify-end gap-3">
            <rs-button
              variant="primary-outline"
              @click="handleCancel"
            >
              Batal
            </rs-button>
            <rs-button
              variant="primary"
              @click="handleSubmit"
              :loading="processing"
            >
              Simpan & Sahkan Lawatan
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showConfirmModal"
      title="Sahkan Lawatan"
      size="md"
      position="center"
    >
      <template #body>
        <div class="space-y-4">
          <div class="text-center">
            <Icon
              name="ph:warning-circle"
              class="mx-auto text-warning"
              size="3rem"
            />
            <h3 class="mt-4 text-lg font-medium text-gray-900">
              Sahkan Lawatan
            </h3>
            <p class="mt-2 text-sm text-gray-500">
              Adakah anda pasti untuk mengesahkan lawatan ini?
            </p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg space-y-2">
            <div class="flex justify-between">
              <span class="font-medium">ID Permohonan:</span>
              <span>{{ formData.idPermohonan }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Nama Pemohon:</span>
              <span>{{ formData.namaPemohon }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Status Semasa:</span>
              <span>{{ formData.status }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Status Selepas:</span>
              <span class="text-success">Lawatan Disahkan</span>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button
            variant="primary-outline"
            @click="showConfirmModal = false"
            :disabled="processing"
          >
            Batal
          </rs-button>
          <rs-button
            variant="success"
            @click="confirmSubmit"
            :loading="processing"
          >
            Sahkan
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

definePageMeta({
  title: "Sahkan Lawatan",
});

const breadcrumb = ref([
  {
    name: "Permohonan Bantuan",
    type: "link",
    path: "/BF-BTN/PB/senarai",
  },
  {
    name: "Untuk Sahkan Lawatan",
    type: "link",
    path: "/BF-BTN/PB/senarai-sahkan-lawatan",
  },
  {
    name: "Sahkan Lawatan",
    type: "current",
    path: `/BF-BTN/PB/senarai-sahkan-lawatan/${route.params.id}/sahkan`,
  },
]);

// State
const processing = ref(false);
const showConfirmModal = ref(false);

// Form data
const formData = ref({
  idPermohonan: route.params.id,
  namaPemohon: "Ahmad bin Abdullah", // Would be fetched from API
  jenisBantuan: "Bantuan Kecemasan", // Would be fetched from API
  status: "syor_bantuan_dikemukakan",
  tarikhLawatan: "",
  lokasiLawatan: "",
  pegawaiBertugas: "",
  buktiLawatan: [],
  catatanPegawai: "",
});

// Methods
const getStatusVariant = (status) => {
  const variants = {
    syor_bantuan_dikemukakan: "warning",
    lawatan_disahkan: "success",
  };
  return variants[status.toLowerCase()] || "default";
};

const handleCancel = () => {
  router.push("/BF-BTN/PB/senarai-sahkan-lawatan");
};

const handleSubmit = () => {
  showConfirmModal.value = true;
};

const confirmSubmit = async () => {
  try {
    processing.value = true;
    // Implement API call to update status
    formData.value.status = "lawatan_disahkan";
    // toast.success("Lawatan telah disahkan");
    router.push("/BF-BTN/PB/senarai-sahkan-lawatan");
  } catch (error) {
    toast.error("Ralat semasa mengesahkan lawatan");
    console.error(error);
  } finally {
    processing.value = false;
    showConfirmModal.value = false;
  }
};
</script>

<style lang="scss" scoped></style> 