<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Tambah Bantuan Baharu</h2>
        </div>
      </template>

      <template #body>
        <FormKit
          type="form"
          :actions="false"
          @submit="handleSubmit"
          v-model="formData"
        >
          <!-- Basic Information Section -->
          <div class="space-y-6">
            <h3 class="text-lg font-medium">Maklumat Asas</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="text"
                name="namaBantuan"
                label="Nama Bantuan"
                validation="required"
                validation-label="Nama Bantuan"
              />
              <FormKit
                type="text"
                name="aidProduct"
                label="Aid Product"
                validation="required"
                validation-label="Aid Product"
              />
              <FormKit
                type="text"
                name="productPackage"
                label="Product Package"
                validation="required"
                validation-label="Product Package"
              />
              <FormKit
                type="textarea"
                name="keteranganBantuan"
                label="Keterangan Bantuan"
                validation="required"
                validation-label="Keterangan Bantuan"
              />
              <FormKit
                type="text"
                name="kodBantuan"
                label="Kod Bantuan"
                validation="required"
                validation-label="Kod Bantuan"
              />
            </div>
          </div>

          <!-- Checkbox Options Section -->
          <div class="space-y-6 mt-8">
            <h3 class="text-lg font-medium">Tetapan Sistem</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="checkbox"
                name="modSiasatan"
                label="Mod Siasatan"
                value="Y"
              />
              <FormKit
                type="checkbox"
                name="studyProfile"
                label="Study Profile"
                value="Y"
              />
              <FormKit
                type="checkbox"
                name="semakanStatusProfil"
                label="Semakan Status Profil"
                value="Y"
              />
              <FormKit
                type="checkbox"
                name="autoRenewBantuanBerkala"
                label="Auto-renew Bantuan Berkala"
                value="Y"
              />
              <FormKit
                type="checkbox"
                name="autoHitBajet"
                label="Auto-hit Bajet"
                value="Y"
              />
              <FormKit
                type="checkbox"
                name="tuntutan"
                label="Tuntutan"
                value="Y"
              />
              <FormKit
                type="checkbox"
                name="autoCloseOutGL"
                label="Auto Close out GL"
                value="Y"
              />
            </div>
          </div>

          <!-- Aid Matrix Section -->
          <div class="space-y-6 mt-8">
            <h3 class="text-lg font-medium">Aid Matrix</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="select"
                name="modPembayaran"
                label="Mod Pembayaran"
                :options="[
                  'Tunai',
                  'Vcash',
                  'Bank In (EFT)',
                  'Cheque',
                  'ePayment',
                  'Biller Payment',
                  'TT',
                ]"
                validation="required"
                validation-label="Mod Pembayaran"
              />
              <FormKit
                type="select"
                name="modAgihan"
                label="Mod Agihan"
                :options="['Direct', 'GL/WO/PO']"
                validation="required"
                validation-label="Mod Agihan"
              />
              <FormKit
                type="select"
                name="kaedahProses"
                label="Kaedah Proses"
                :options="['Single', 'Bulk']"
                validation="required"
                validation-label="Kaedah Proses"
              />
              <FormKit
                type="select"
                name="frekuensiPermohonan"
                label="Frekuensi Permohonan"
                :options="[
                  'Sekali setahun',
                  'Sekali seumur hidup',
                  'Dua kali setahun',
                  'Tiada had',
                  'Sekali dalam 5 tahun',
                ]"
                validation="required"
                validation-label="Frekuensi Permohonan"
              />
              <FormKit
                type="select"
                name="frekuensiPembayaran"
                label="Frekuensi Pembayaran"
                :options="['One off', 'Berkala']"
                validation="required"
                validation-label="Frekuensi Pembayaran"
                @input="handleFrekuensiPembayaranChange"
              />
            </div>

            <!-- Conditional Fields for Berkala Payment -->
            <div
              v-if="formData.frekuensiPembayaran === 'Berkala'"
              class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
            >
              <FormKit
                type="select"
                name="jenisKekerapanPembayaran"
                label="Jenis Kekerapan Pembayaran"
                :options="['Bulanan (Monthly)', 'Tahunan (Yearly)']"
                validation="required"
                validation-label="Jenis Kekerapan Pembayaran"
              />
              <FormKit
                type="date"
                name="tarikhMulaPembayaran"
                label="Tarikh Mula Pembayaran"
                validation="required"
                validation-label="Tarikh Mula Pembayaran"
              />
              <FormKit
                type="date"
                name="tarikhTamatPembayaran"
                label="Tarikh Tamat Pembayaran"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormKit
                type="select"
                name="kategoriBantuan"
                label="Kategori Bantuan"
                :options="[
                  'Sosial',
                  'Pendidikan',
                  'Ekonomi',
                  'Pembangunan Ihsan',
                  'Institusi Agama',
                  'Aid Profil',
                  'Fakir',
                  'Miskin',
                  'Mualaf',
                  'Gharmin',
                  'Riqab',
                  'Ibnu Sabil',
                  'Fisabilillah',
                ]"
                validation="required"
                validation-label="Kategori Bantuan"
              />
              <FormKit
                type="select"
                name="jenisBantuan"
                label="Jenis Bantuan"
                :options="['Individu', 'Household']"
                validation="required"
                validation-label="Jenis Bantuan"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormKit
                type="number"
                name="kadarMinimum"
                label="Kadar Minimum"
                validation="required|number|min:0"
                validation-label="Kadar Minimum"
              />
              <FormKit
                type="number"
                name="kadarMaksimum"
                label="Kadar Maksimum"
                validation="required|number|min:0"
                validation-label="Kadar Maksimum"
              />
            </div>
          </div>

          <!-- Penetapan Had Taklif Section -->
          <div class="space-y-6 mt-8">
            <h3 class="text-lg font-medium">Penetapan Had Taklif</h3>
            <div class="grid grid-cols-1 gap-4">
              <FormKit
                type="number"
                name="hadTaklif"
                label="Had Maksimum Bantuan"
                help="Had maksimum bantuan mengikut syarat kelayakan"
                validation="required|number|min:0"
                validation-label="Had Maksimum Bantuan"
              />
            </div>
          </div>

          <!-- Tempoh Aktif Bantuan Section -->
          <div class="space-y-6 mt-8">
            <h3 class="text-lg font-medium">Tempoh Aktif Bantuan</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="date"
                name="tarikhMulaAktif"
                label="Tarikh Mula Aktif"
                validation="required"
                validation-label="Tarikh Mula Aktif"
              />
              <FormKit
                type="date"
                name="tarikhTamatAktif"
                label="Tarikh Tamat Aktif"
                validation="required"
                validation-label="Tarikh Tamat Aktif"
              />
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-4 mt-8">
            <rs-button
              variant="primary-outline"
              @click="navigateTo('/BF-BTN/KB/SB/01')"
            >
              Batal
            </rs-button>
            <rs-button variant="primary" @click="handleSubmit">
              Simpan
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Success Modal -->
    <rs-modal
      v-model="showSuccessModal"
      title="Bantuan Berjaya Ditambah"
      size="md"
      position="center"
    >
      <template #body>
        <div class="text-center">
          <Icon name="material-symbols:check-circle" class="text-green-500 text-5xl mb-4" />
          <p class="text-lg mb-2">Bantuan baharu telah berjaya ditambah.</p>
          <p class="text-gray-600">Bantuan ini memerlukan kelulusan sebelum boleh digunakan.</p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center">
          <rs-button variant="primary" @click="navigateToList">
            Kembali ke Senarai
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useToast } from "vue-toastification";

definePageMeta({
  title: "Tambah Bantuan Baharu",
  description: "Tambah bantuan baharu dalam sistem",
});

const toast = useToast();
const showSuccessModal = ref(false);

const breadcrumb = ref([
  {
    name: "Pengurusan Bantuan",
    type: "link",
    path: "/BF-BTN/KB/SB/01",
  },
  {
    name: "Tambah Baharu",
    type: "current",
    path: "/BF-BTN/KB/SB/02",
  },
]);

const formData = ref({
  namaBantuan: "",
  aidProduct: "",
  productPackage: "",
  keteranganBantuan: "",
  kodBantuan: "",
  modSiasatan: false,
  studyProfile: false,
  semakanStatusProfil: false,
  autoRenewBantuanBerkala: false,
  autoHitBajet: false,
  tuntutan: false,
  autoCloseOutGL: false,
  modPembayaran: "",
  modAgihan: "",
  kaedahProses: "",
  frekuensiPermohonan: "",
  frekuensiPembayaran: "",
  jenisKekerapanPembayaran: "",
  tarikhMulaPembayaran: "",
  tarikhTamatPembayaran: "",
  kategoriBantuan: "",
  jenisBantuan: "",
  kadarMinimum: "",
  kadarMaksimum: "",
  hadTaklif: "",
  tarikhMulaAktif: "",
  tarikhTamatAktif: "",
});

const handleFrekuensiPembayaranChange = (value) => {
  if (value !== "Berkala") {
    formData.value.jenisKekerapanPembayaran = "";
    formData.value.tarikhMulaPembayaran = "";
    formData.value.tarikhTamatPembayaran = "";
  }
};

const handleSubmit = async (formData) => {
  try {
    // TODO: Implement API call to save the data
    console.log("Form submitted:", formData);
    showSuccessModal.value = true;
  } catch (error) {
    console.error("Error submitting form:", error);
    toast.error("Ralat semasa menambah bantuan");
  }
};

const navigateToList = () => {
  showSuccessModal.value = false;
  navigateTo("/BF-BTN/KB/SB/01");
};
</script>
