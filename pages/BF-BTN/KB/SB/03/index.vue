<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Kemaskini Bantuan</h2>
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
            <h3 class="text-lg font-medium">Pilihan Modul</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="checkbox"
                name="modSiasatan"
                label="Mod Siasatan"
              />
              <FormKit
                type="checkbox"
                name="studyProfile"
                label="Study Profile"
              />
              <FormKit
                type="checkbox"
                name="semakanStatusProfil"
                label="Semakan Status Profil"
              />
              <FormKit
                type="checkbox"
                name="autoRenewBantuanBerkala"
                label="Auto Renew Bantuan Berkala"
              />
              <FormKit
                type="checkbox"
                name="autoHitBajet"
                label="Auto Hit Bajet"
              />
              <FormKit
                type="checkbox"
                name="tuntutan"
                label="Tuntutan"
              />
              <FormKit
                type="checkbox"
                name="autoCloseOutGL"
                label="Auto Close Out GL"
              />
            </div>
          </div>

          <!-- Modul Pembayaran Section -->
          <div class="space-y-6 mt-8">
            <h3 class="text-lg font-medium">Modul Pembayaran</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="select"
                name="modPembayaran"
                label="Mod Pembayaran"
                :options="['Tunai', 'Bank', 'Kad']"
                validation="required"
                validation-label="Mod Pembayaran"
              />
              <FormKit
                type="select"
                name="modAgihan"
                label="Mod Agihan"
                :options="['Individu', 'Household']"
                validation="required"
                validation-label="Mod Agihan"
              />
              <FormKit
                type="select"
                name="kaedahProses"
                label="Kaedah Proses"
                :options="['Manual', 'Auto']"
                validation="required"
                validation-label="Kaedah Proses"
              />
            </div>
          </div>

          <!-- Frekuensi Section -->
          <div class="space-y-6 mt-8">
            <h3 class="text-lg font-medium">Frekuensi</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="select"
                name="frekuensiPermohonan"
                label="Frekuensi Permohonan"
                :options="['Sekali', 'Berkala']"
                validation="required"
                validation-label="Frekuensi Permohonan"
              />
              <FormKit
                type="select"
                name="frekuensiPembayaran"
                label="Frekuensi Pembayaran"
                :options="['Sekali', 'Berkala']"
                validation="required"
                validation-label="Frekuensi Pembayaran"
              />
              <FormKit
                type="select"
                name="jenisKekerapanPembayaran"
                label="Jenis Kekerapan Pembayaran"
                :options="['Bulanan', 'Tahunan']"
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
                validation="required"
                validation-label="Tarikh Tamat Pembayaran"
              />
            </div>
          </div>

          <!-- Kategori & Jenis Bantuan Section -->
          <div class="space-y-6 mt-8">
            <h3 class="text-lg font-medium">Kategori & Jenis Bantuan</h3>
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
      title="Permohonan Kemaskini Bantuan Berjaya"
      size="md"
      position="center"
    >
      <template #body>
        <div class="text-center">
          <Icon name="material-symbols:check-circle" class="text-green-500 text-5xl mb-4" />
          <p class="text-lg mb-2">Permohonan kemaskini bantuan telah berjaya dihantar.</p>
          <p class="text-gray-600">Perubahan memerlukan kelulusan sebelum boleh digunakan.</p>
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
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useRoute } from "vue-router";

definePageMeta({
  title: "Kemaskini Bantuan",
  description: "Kemaskini maklumat bantuan dalam sistem",
});

const route = useRoute();
const toast = useToast();
const showSuccessModal = ref(false);

const breadcrumb = ref([
  {
    name: "Pengurusan Bantuan",
    type: "link",
    path: "/BF-BTN/KB/SB/01",
  },
  {
    name: "Kemaskini Bantuan",
    type: "current",
    path: "/BF-BTN/KB/SB/03",
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
  status: "Menunggu Kelulusan",
  originalData: null,
});

const getStatusVariant = (status) => {
  const variants = {
    "Menunggu Kelulusan": "warning",
    "Diluluskan": "success",
    "Ditolak": "danger",
    "Aktif": "success",
    "Tidak Aktif": "danger",
  };
  return variants[status] || "default";
};

onMounted(async () => {
  // TODO: Fetch bantuan data based on ID from route.params.id
  // For now using mock data
  const mockData = {
    namaBantuan: "Bantuan Kewangan Bulanan",
    aidProduct: "AID-001",
    productPackage: "PKG-001",
    keteranganBantuan: "Bantuan kewangan bulanan untuk asnaf",
    kodBantuan: "BKB-001",
    modSiasatan: true,
    studyProfile: true,
    semakanStatusProfil: true,
    autoRenewBantuanBerkala: true,
    autoHitBajet: true,
    tuntutan: true,
    autoCloseOutGL: true,
    modPembayaran: "Bank",
    modAgihan: "Individu",
    kaedahProses: "Auto",
    frekuensiPermohonan: "Berkala",
    frekuensiPembayaran: "Berkala",
    jenisKekerapanPembayaran: "Bulanan",
    tarikhMulaPembayaran: "2024-01-01",
    tarikhTamatPembayaran: "2024-12-31",
    kategoriBantuan: "Sosial",
    jenisBantuan: "Individu",
    kadarMinimum: "100",
    kadarMaksimum: "1000",
    hadTaklif: "500",
    tarikhMulaAktif: "2024-01-01",
    tarikhTamatAktif: "2024-12-31",
    status: "Aktif",
  };

  formData.value = { ...mockData };
  formData.value.originalData = JSON.stringify(mockData);
});

const hasChanges = () => {
  if (!formData.value.originalData) return false;
  const currentData = { ...formData.value };
  delete currentData.originalData;
  return JSON.stringify(currentData) !== formData.value.originalData;
};

const handleSubmit = async (formData) => {
  try {
    if (!hasChanges()) {
      toast.warning("Tiada perubahan untuk dikemaskini");
      return;
    }

    // TODO: Implement API call to update bantuan
    console.log("Updating bantuan:", formData);
    
    // Update status to pending approval
    formData.status = "Menunggu Kelulusan";
    
    // Show success modal
    showSuccessModal.value = true;
  } catch (error) {
    toast.error("Ralat semasa mengemaskini bantuan");
    console.error("Error updating bantuan:", error);
  }
};

const navigateToList = () => {
  navigateTo("/BF-BTN/KB/SB/01");
};
</script>
