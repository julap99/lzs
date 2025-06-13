<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Input Syor Bantuan</h2>
          <rs-badge
            v-if="formData.status"
            :variant="getStatusVariant(formData.status)"
          >
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
                name="noKpPemohon"
                label="No KP Pemohon"
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
                label="Kategori Bantuan & Asnaf"
                readonly
              />
            </div>
          </rs-fieldset>

          <!-- Section 2: Rujuk Hasil Siasatan -->
          <rs-fieldset class="mb-6">
            <template #legend>
              <h3 class="text-lg font-medium">Rujuk Hasil Siasatan</h3>
            </template>

            <div class="space-y-4">
              <FormKit
                type="textarea"
                name="catatanHasilSiasatan"
                label="Catatan Hasil Siasatan"
                rows="4"
                readonly
                :classes="{
                  input: '!py-2',
                }"
              />

              <!-- Image Gallery -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  Gambar Lokasi
                </label>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div
                    v-for="(image, index) in formData.gambarLokasi"
                    :key="index"
                    class="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
                  >
                    <img
                      :src="image.url"
                      :alt="image.description"
                      class="w-full h-full object-cover"
                    />
                    <div
                      class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity"
                    >
                      <div
                        class="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white text-sm"
                      >
                        {{ image.description }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </rs-fieldset>

          <!-- Section 3: Input Syor Bantuan -->
          <rs-fieldset class="mb-6">
            <template #legend>
              <h3 class="text-lg font-medium">Input Syor Bantuan</h3>
            </template>

            <div class="space-y-4">
              <FormKit
                type="select"
                name="jenisBantuanDicadangkan"
                label="Jenis Bantuan Dicadangkan"
                :options="jenisBantuanOptions"
                multiple
                validation="required"
                :validation-messages="{
                  required: 'Sila pilih jenis bantuan',
                }"
                :classes="{
                  input: '!py-2',
                }"
              />

              <FormKit
                type="text"
                name="jumlahBantuanDicadangkan"
                label="Jumlah Bantuan Dicadangkan (RM)"
                validation="required|number|min:0"
                :validation-messages="{
                  required: 'Sila masukkan jumlah bantuan',
                  number: 'Sila masukkan nilai yang sah',
                  min: 'Jumlah bantuan tidak boleh negatif',
                }"
                :classes="{
                  input: '!py-2',
                }"
              />

              <FormKit
                type="select"
                name="tempohBantuan"
                label="Tempoh / Kekerapan Bantuan"
                :options="tempohBantuanOptions"
                validation="required"
                :validation-messages="{
                  required: 'Sila pilih tempoh bantuan',
                }"
                :classes="{
                  input: '!py-2',
                }"
              />

              <FormKit
                type="text"
                name="statusSyor"
                label="Status Syor"
                readonly
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
          </rs-fieldset>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-3 mt-6">
            <rs-button variant="primary-outline" @click="handleCancel">
              Batal
            </rs-button>
            <rs-button
              variant="primary"
              @click="showSubmitConfirm = true"
              :disabled="processing"
            >
              Submit Syor Bantuan
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Submit Confirmation Modal -->
    <rs-modal
      v-model="showSubmitConfirm"
      title="Sahkan Submit Syor Bantuan"
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
              Sahkan Submit Syor Bantuan
            </h3>
            <p class="mt-2 text-sm text-gray-500">
              Adakah anda pasti untuk menghantar syor bantuan ini?
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
              <span class="text-success">Syor Bantuan Dikemukakan</span>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button
            variant="primary-outline"
            @click="showSubmitConfirm = false"
            :disabled="processing"
          >
            Batal
          </rs-button>
          <rs-button
            variant="primary"
            @click="handleSubmit"
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
  title: "Input Syor Bantuan",
});

const breadcrumb = ref([
  {
    name: "Permohonan Bantuan",
    type: "link",
    path: "/BF-BTN/PB/senarai",
  },
  {
    name: "Selesai Siasatan Lapangan",
    type: "link",
    path: "/BF-BTN/PB/senarai-selesai-siasatan-lapangan",
  },
  {
    name: "Input Syor Bantuan",
    type: "current",
    path: `/BF-BTN/PB/senarai-selesai-siasatan-lapangan/${route.params.id}/syor-bantuan`,
  },
]);

// Options
const jenisBantuanOptions = [
  { label: "Bantuan Kewangan", value: "bantuan_kewangan" },
  { label: "Bantuan Barangan", value: "bantuan_barangan" },
  { label: "Bantuan Perkhidmatan", value: "bantuan_perkhidmatan" },
];

const tempohBantuanOptions = [
  { label: "Sekali Bayar", value: "sekali_bayar" },
  { label: "Bulanan", value: "bulanan" },
  { label: "6 Bulan", value: "6_bulan" },
  { label: "12 Bulan", value: "12_bulan" },
];

// Mock data - would be replaced with API call
const formData = ref({
  idPermohonan: "NAS-2025-0001",
  namaPemohon: "Ahmad bin Abdullah",
  noKpPemohon: "800101-01-1234",
  jenisBantuan: "Bantuan Kewangan",
  kategoriBantuan: "Asnaf Fakir",
  status: "Selesai Siasatan Lapangan",
  catatanHasilSiasatan:
    "Pemohon telah disiasat dan didapati layak untuk menerima bantuan. Keadaan rumah memerlukan pembaikan dan pemohon tidak mempunyai sumber pendapatan tetap.",
  gambarLokasi: [
    {
      url: "#",
      description: "Depan Rumah",
    },
    {
      url: "#",
      description: "Bahagian Dalam",
    },
    {
      url: "#",
      description: "Keadaan Dapur",
    },
  ],
  jenisBantuanDicadangkan: [],
  jumlahBantuanDicadangkan: "",
  tempohBantuan: "",
  statusSyor: "Syor Bantuan Dikemukakan",
});

// State
const processing = ref(false);
const showSubmitConfirm = ref(false);

// Methods
const getStatusVariant = (status) => {
  const variants = {
    selesai_siasatan_lapangan: "success",
    syor_bantuan_dikemukakan: "info",
  };
  return variants[status.toLowerCase()] || "default";
};

const handleCancel = () => {
  router.push("/BF-BTN/PB/senarai-selesai-siasatan-lapangan");
};

const handleSubmit = async () => {
  try {
    processing.value = true;
    // API call to update status to "Syor Bantuan Dikemukakan"
    // await updateApplicationStatus(formData.value.idPermohonan, "syor_bantuan_dikemukakan");
    showSubmitConfirm.value = false;
    router.push(
      `/BF-BTN/PB/senarai-selesai-siasatan-lapangan/${route.params.id}/catatan-sokongan`
    );
  } catch (error) {
    console.error("Error updating status:", error);
  } finally {
    processing.value = false;
  }
};
</script>

<style lang="scss" scoped></style>
