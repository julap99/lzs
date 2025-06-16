<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Input Catatan Sokongan</h2>
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

          <!-- Section 2: Syor Bantuan -->
          <rs-fieldset class="mb-6">
            <template #legend>
              <h3 class="text-lg font-medium">Syor Bantuan</h3>
            </template>

            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormKit
                  type="text"
                  name="jenisBantuanDicadangkan"
                  label="Jenis Bantuan Dicadangkan"
                  readonly
                />
                <FormKit
                  type="text"
                  name="jumlahBantuanDicadangkan"
                  label="Jumlah Bantuan Dicadangkan (RM)"
                  readonly
                />
                <FormKit
                  type="text"
                  name="tempohBantuan"
                  label="Tempoh / Kekerapan Bantuan"
                  readonly
                />
              </div>
            </div>
          </rs-fieldset>

          <!-- Section 3: Input Catatan Sokongan -->
          <rs-fieldset class="mb-6">
            <template #legend>
              <h3 class="text-lg font-medium">Input Catatan Sokongan</h3>
            </template>

            <div class="space-y-4">
              <FormKit
                type="textarea"
                name="catatanSokongan"
                label="Catatan Sokongan Bantuan"
                rows="4"
                validation="required"
                :validation-messages="{
                  required: 'Sila masukkan catatan sokongan',
                }"
                :classes="{
                  input: '!py-2',
                }"
              />

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormKit
                  type="text"
                  name="tarikhCatatan"
                  label="Tarikh & Masa Catatan"
                  readonly
                  :classes="{
                    input: '!py-2',
                  }"
                />
                <FormKit
                  type="text"
                  name="namaPegawai"
                  label="Nama Pegawai EOAD"
                  readonly
                  :classes="{
                    input: '!py-2',
                  }"
                />
              </div>
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
              Simpan Catatan Sokongan
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Submit Confirmation Modal -->
    <rs-modal
      v-model="showSubmitConfirm"
      title="Sahkan Simpan Catatan Sokongan"
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
              Sahkan Simpan Catatan Sokongan
            </h3>
            <p class="mt-2 text-sm text-gray-500">
              Adakah anda pasti untuk menyimpan catatan sokongan ini?
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
  title: "Input Catatan Sokongan",
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
    name: "Input Catatan Sokongan",
    type: "current",
    path: `/BF-BTN/PB/senarai-selesai-siasatan-lapangan/${route.params.id}/catatan-sokongan`,
  },
]);

// Mock data - would be replaced with API call
const formData = ref({
  idPermohonan: "NAS-2025-0001",
  namaPemohon: "Ahmad bin Abdullah",
  noKpPemohon: "800101-01-1234",
  jenisBantuan: "Bantuan Kewangan",
  kategoriBantuan: "Asnaf Fakir",
  status: "Syor Bantuan Dikemukakan",
  jenisBantuanDicadangkan: "Bantuan Kewangan",
  jumlahBantuanDicadangkan: "RM 1,000.00",
  tempohBantuan: "Sekali Bayar",
  catatanSokongan: "",
  tarikhCatatan: new Date().toLocaleString("ms-MY"),
  namaPegawai: "Siti binti Ali", // This would be auto-captured from the logged-in user
});

// State
const processing = ref(false);
const showSubmitConfirm = ref(false);

// Methods
const getStatusVariant = (status) => {
  const variants = {
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
    // API call to save catatan sokongan
    // await saveCatatanSokongan(formData.value);
    showSubmitConfirm.value = false;
    router.push("/BF-BTN/PB/senarai-selesai-siasatan-lapangan");
  } catch (error) {
    console.error("Error saving catatan sokongan:", error);
  } finally {
    processing.value = false;
  }
};

onMounted(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
</script>

<style lang="scss" scoped></style>
