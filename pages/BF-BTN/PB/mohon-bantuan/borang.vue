<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Borang Permohonan Bantuan</h2>
        </div>
      </template>

      <template #body>
        <FormKit
          type="form"
          :actions="false"
          @submit="handleSubmit"
          v-model="formData"
        >
          <!-- Applicant Information Section -->
          <div class="space-y-6">
            <h3 class="text-lg font-medium">Maklumat Pemohon</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="text"
                name="namaPemohon"
                label="Nama Pemohon"
                disabled
              />
              <FormKit
                type="text"
                name="noKadPengenalan"
                label="No Kad Pengenalan"
                disabled
              />
              <FormKit
                type="text"
                name="statusHousehold"
                label="Status Household"
                disabled
                v-if="!isAsnaf"
              />
              <FormKit
                type="text"
                name="statusIndividu"
                label="Status Individu"
                disabled
                v-if="!isAsnaf"
              />
            </div>
          </div>

          <!-- Application Details Section -->
          <div class="space-y-6 mt-8">
            <h3 class="text-lg font-medium">Maklumat Permohonan</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="select"
                name="jenisBantuan"
                label="Jenis Bantuan"
                :options="jenisBantuanOptions"
                validation="required"
                validation-label="Jenis Bantuan"
              />
              <FormKit
                type="textarea"
                name="keteranganPermohonan"
                label="Keterangan Permohonan"
                validation="required"
                validation-label="Keterangan Permohonan"
                class="md:col-span-2"
              />
              <FormKit
                type="number"
                name="jumlahBantuan"
                label="Jumlah Bantuan Dipohon (RM)"
                validation="required|number|min:0"
                validation-label="Jumlah Bantuan"
              />
              <FormKit
                type="select"
                name="kaedahPembayaran"
                label="Kaedah Pembayaran"
                :options="kaedahPembayaranOptions"
                validation="required"
                validation-label="Kaedah Pembayaran"
              />
              <FormKit
                type="text"
                name="tarikhPermohonan"
                label="Tarikh Permohonan"
                disabled
              />
            </div>
          </div>

          <!-- Document Upload Section -->
          <div class="space-y-6 mt-8">
            <h3 class="text-lg font-medium">Dokumen Sokongan</h3>
            <div class="grid grid-cols-1 gap-4">
              <FormKit
                type="file"
                name="dokumenSokongan"
                label="Muat Naik Dokumen (PDF / Gambar)"
                accept=".pdf,.jpg,.jpeg,.png"
                validation="required"
                validation-label="Dokumen Sokongan"
                help="Format yang diterima: PDF, JPG, JPEG, PNG"
              />
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-4 mt-8">
            <rs-button
              variant="primary-outline"
              @click="navigateTo('/BF-BTN/PB/mohon-bantuan')"
            >
              Kembali
            </rs-button>
            <rs-button variant="primary" @click="handleSubmit">
              Hantar Permohonan
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Success Modal -->
    <rs-modal
      v-model="showSuccessModal"
      title="Permohonan Berjaya"
      size="md"
      position="center"
    >
      <div class="space-y-4">
        <p class="text-green-600">
          Permohonan anda telah diterima.
        </p>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">Nombor Rujukan</p>
            <p class="font-medium">{{ formData.nomborRujukan }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Status</p>
            <p class="font-medium">{{ formData.status }}</p>
          </div>
        </div>
      </div>

      <template #footer>
        <rs-button variant="primary" @click="navigateTo('/BF-BTN/PB/mohon-bantuan')">
          Kembali ke Menu Utama
        </rs-button>
      </template>
    </rs-modal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: "Borang Permohonan Bantuan",
});

const breadcrumb = ref([
  {
    name: "Pengurusan Bantuan",
    type: "link",
    path: "/BF-BTN/PB/mohon-bantuan",
  },
  {
    name: "Borang Permohonan Bantuan",
    type: "current",
    path: "/BF-BTN/PB/mohon-bantuan/borang",
  },
]);

// State
const formData = ref({
  namaPemohon: "Ahmad bin Abdullah",
  noKadPengenalan: "800101-01-1234",
  statusHousehold: "Miskin",
  statusIndividu: "Asnaf",
  jenisBantuan: "",
  keteranganPermohonan: "",
  jumlahBantuan: "",
  kaedahPembayaran: "",
  tarikhPermohonan: new Date().toLocaleDateString("ms-MY"),
  dokumenSokongan: null,
  nomborRujukan: "",
  status: "Dalam Proses",
});

const showSuccessModal = ref(false);
const isAsnaf = ref(true);

// Options
const jenisBantuanOptions = [
  "Bantuan Sewa Rumah",
  "Ubah Suai Rumah",
  "Bantuan Pendidikan",
  "Bantuan Perubatan",
  "Bantuan Kecemasan",
];

const kaedahPembayaranOptions = [
  "EFT",
  "Tunai",
  "Kaunter Ekspres",
  "Lapangan",
];

// Methods
const handleSubmit = async () => {
  try {
    // TODO: Implement API call to submit application
    formData.value.nomborRujukan = "REF" + Date.now();
    showSuccessModal.value = true;
  } catch (error) {
    console.error("Error submitting application:", error);
  }
};
</script>

<style lang="scss" scoped></style> 