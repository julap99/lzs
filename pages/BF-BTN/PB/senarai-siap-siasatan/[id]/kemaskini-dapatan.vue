<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Kemaskini Dapatan Siasatan</h2>
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
                name="lokasiPremis"
                label="Lokasi Premis"
                readonly
              />
              <FormKit
                type="text"
                name="jenisBantuan"
                label="Jenis Bantuan"
                readonly
              />
              <FormKit
                type="text"
                name="kategoriBantuan"
                label="Kategori Bantuan"
                readonly
              />
            </div>
          </rs-fieldset>

          <!-- Section 2: Input Dapatan Siasatan -->
          <rs-fieldset class="mb-6">
            <template #legend>
              <h3 class="text-lg font-medium">Input Dapatan Siasatan</h3>
            </template>

            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormKit
                  type="datetime-local"
                  name="tarikhMasaLawatan"
                  label="Tarikh & Masa Lawatan"
                  validation="required"
                  :validation-messages="{
                    required: 'Sila masukkan tarikh dan masa lawatan',
                  }"
                />
                <FormKit
                  type="select"
                  name="statusSiasatan"
                  label="Status Siasatan"
                  :options="statusSiasatanOptions"
                  validation="required"
                  :validation-messages="{
                    required: 'Sila pilih status siasatan',
                  }"
                />
              </div>

              <FormKit
                type="file"
                name="gambarLokasi"
                label="Gambar Lokasi / Bukti"
                accept="image/*"
                multiple
                help="Muat naik gambar lokasi atau bukti lawatan (format: JPG, PNG, maksimum 5MB setiap fail)"
                :classes="{
                  input: '!py-2',
                }"
              />

              <FormKit
                type="textarea"
                name="catatanLawatan"
                label="Catatan Lawatan EOAD"
                rows="4"
                validation="required"
                :validation-messages="{
                  required: 'Sila masukkan catatan lawatan',
                }"
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
          </rs-fieldset>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-3 mt-6">
            <rs-button
              variant="primary-outline"
              @click="handleCancel"
            >
              Batal
            </rs-button>
            <rs-button
              variant="warning"
              @click="showTidakSelesaiConfirm = true"
              :disabled="processing"
            >
              Lawatan Tidak Selesai
            </rs-button>
            <rs-button
              variant="primary"
              @click="showSelesaiConfirm = true"
              :disabled="processing"
            >
              Simpan & Tandakan Selesai Siasatan
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Selesai Siasatan Confirmation Modal -->
    <rs-modal
      v-model="showSelesaiConfirm"
      title="Sahkan Selesai Siasatan"
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
              Sahkan Selesai Siasatan
            </h3>
            <p class="mt-2 text-sm text-gray-500">
              Adakah anda pasti untuk menandakan siasatan ini sebagai selesai?
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
              <span class="text-success">Selesai Siasatan Lapangan</span>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button
            variant="primary-outline"
            @click="showSelesaiConfirm = false"
            :disabled="processing"
          >
            Batal
          </rs-button>
          <rs-button
            variant="primary"
            @click="handleSelesaiSiasatan"
            :loading="processing"
          >
            Sahkan
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Tidak Selesai Confirmation Modal -->
    <rs-modal
      v-model="showTidakSelesaiConfirm"
      title="Sahkan Lawatan Tidak Selesai"
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
              Sahkan Lawatan Tidak Selesai
            </h3>
            <p class="mt-2 text-sm text-gray-500">
              Adakah anda pasti untuk menandakan lawatan ini sebagai tidak selesai?
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
              <span class="text-warning">Siap Untuk Siasatan Lapangan</span>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button
            variant="primary-outline"
            @click="showTidakSelesaiConfirm = false"
            :disabled="processing"
          >
            Batal
          </rs-button>
          <rs-button
            variant="warning"
            @click="handleTidakSelesai"
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
  title: "Kemaskini Dapatan Siasatan",
});

const breadcrumb = ref([
  {
    name: "Permohonan Bantuan",
    type: "link",
    path: "/BF-BTN/PB/senarai",
  },
  {
    name: "Siap Untuk Siasatan Lapangan",
    type: "link",
    path: "/BF-BTN/PB/senarai-siap-siasatan",
  },
  {
    name: "Kemaskini Dapatan Siasatan",
    type: "current",
    path: `/BF-BTN/PB/senarai-siap-siasatan/${route.params.id}/kemaskini-dapatan`,
  },
]);

// Mock data - would be replaced with API call
const formData = ref({
  idPermohonan: "NAS-2025-0001",
  namaPemohon: "Ahmad bin Abdullah",
  lokasiPremis: "No. 123, Jalan ABC, Taman XYZ, 50000 Kuala Lumpur",
  jenisBantuan: "Bantuan Kewangan",
  kategoriBantuan: "Asnaf Fakir",
  status: "Siap Untuk Siasatan Lapangan",
  tarikhMasaLawatan: "",
  statusSiasatan: "",
  gambarLokasi: [],
  catatanLawatan: "",
});

// Status options
const statusSiasatanOptions = [
  { label: "Selesai Siasatan Lapangan", value: "selesai_siasatan_lapangan" },
  { label: "Lawatan Tidak Selesai", value: "lawatan_tidak_selesai" },
];

// State
const processing = ref(false);
const showSelesaiConfirm = ref(false);
const showTidakSelesaiConfirm = ref(false);

// Methods
const getStatusVariant = (status) => {
  const variants = {
    siap_siasatan_lapangan: "warning",
    selesai_siasatan_lapangan: "success",
    lawatan_tidak_selesai: "danger",
  };
  return variants[status.toLowerCase()] || "default";
};

const handleCancel = () => {
  router.push("/BF-BTN/PB/senarai-siap-siasatan");
};

const handleSelesaiSiasatan = async () => {
  try {
    processing.value = true;
    // API call to update status to "Selesai Siasatan Lapangan"
    // await updateApplicationStatus(formData.value.idPermohonan, "selesai_siasatan_lapangan");
    showSelesaiConfirm.value = false;
    router.push("/BF-BTN/PB/senarai-siap-siasatan");
  } catch (error) {
    console.error("Error updating status:", error);
  } finally {
    processing.value = false;
  }
};

const handleTidakSelesai = async () => {
  try {
    processing.value = true;
    // API call to keep status as "Siap Untuk Siasatan Lapangan"
    // await updateApplicationStatus(formData.value.idPermohonan, "siap_siasatan_lapangan");
    showTidakSelesaiConfirm.value = false;
    router.push("/BF-BTN/PB/senarai-siap-siasatan");
  } catch (error) {
    console.error("Error updating status:", error);
  } finally {
    processing.value = false;
  }
};
</script>

<style lang="scss" scoped></style> 