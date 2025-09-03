<!-- 
  RTMF SCREEN: PA-PP-PD-01_04
  PURPOSE: Edit Form - Borang Kemaskini Maklumat Penolong Amil
  DESCRIPTION: Edit form for updating Penolong Amil information (mengikut spesifikasi medan yang diminta)
  ROUTE: /BF-PA/PP/PD/edit/[rujukan]
-->
<template>
  <div>
    <RoleSimulator :initial-role="currentRole" @role-change="handleRoleChange" />
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Kemaskini Permohonan Penolong Amil
          </h2>
          <rs-button variant="secondary-outline" @click="handleBack">
            <Icon name="ph:arrow-left" class="w-4 h-4 mr-1" />
            Kembali
          </rs-button>
        </div>
      </template>

      <template #body>
        <FormKit v-model="formData" type="form" @submit="handleSubmit" :actions="false">
          <!-- Maklumat Peribadi -->
          <rs-card class="mb-6">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-800">Maklumat Peribadi</h3>
            </template>
            <template #body>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormKit v-model="formData.nama" type="text" name="nama" label="Nama" :classes="{ input: '!py-2' }" />
                <FormKit v-model="formData.jenisPengenalan" type="select" name="jenisPengenalan" label="Jenis Pengenalan" :options="jenisPengenalanOptions" :classes="{ input: '!py-2' }" />
                <FormKit v-model="formData.noKP" type="text" name="noKP" label="ID Pengenalan" :classes="{ input: '!py-2' }" />
                <FormKit v-model="formData.tarikhLahir" type="date" name="tarikhLahir" label="Tarikh Lahir" :classes="{ input: '!py-2' }" />
                <FormKit type="text" name="umur" label="Umur" :value="umur" disabled :classes="{ input: '!py-2' }" />
                <FormKit v-model="formData.jantina" type="select" name="jantina" label="Jantina" :options="jantinaOptions" :classes="{ input: '!py-2' }" />
                <FormKit v-model="formData.tarafPerkahwinan" type="select" name="tarafPerkahwinan" label="Taraf Perkahwinan" :options="tarafPerkahwinanOptions" :classes="{ input: '!py-2' }" />
                <FormKit v-model="formData.warganegara" type="select" name="warganegara" label="Warganegara" :options="warganegaraOptions" :classes="{ input: '!py-2' }" />
              </div>
            </template>
          </rs-card>

          <!-- Maklumat Untuk Dihubungi -->
          <rs-card class="mb-6">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-800">Maklumat Untuk Dihubungi</h3>
            </template>
            <template #body>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormKit v-model="formData.email" type="email" name="email" label="Emel" :classes="{ input: '!py-2' }" />
                <FormKit v-model="formData.noTelefon" type="tel" name="noTelefon" label="No Telefon" :classes="{ input: '!py-2' }" />

                <!-- Alamat 1/2/3: satu kolum bertingkat, span penuh -->
                <div class="md:col-span-2 grid grid-cols-1 gap-4">
                  <FormKit v-model="formData.alamat1" type="text" name="alamat1" label="Alamat 1" :classes="{ input: '!py-2' }" />
                  <FormKit v-model="formData.alamat2" type="text" name="alamat2" label="Alamat 2" :classes="{ input: '!py-2' }" />
                  <FormKit v-model="formData.alamat3" type="text" name="alamat3" label="Alamat 3" :classes="{ input: '!py-2' }" />
                </div>

                <FormKit v-model="formData.daerah" type="select" name="daerah" label="Daerah" :options="daerahSelangorOptions" :classes="{ input: '!py-2' }" />
                <FormKit v-model="formData.bandar" type="text" name="bandar" label="Bandar" :classes="{ input: '!py-2' }" />
                <FormKit v-model="formData.poskod" type="text" name="poskod" label="Poskod" :classes="{ input: '!py-2' }" />
                <FormKit v-model="formData.negeri" type="select" name="negeri" label="Negeri" :options="[{ label: 'Selangor', value: 'Selangor' }]" disabled :classes="{ input: '!py-2' }" />
              </div>
            </template>
          </rs-card>

          <!-- Maklumat Pendaftaran -->
          <rs-card class="mb-6">
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-800">Maklumat Pendaftaran</h3>
                <!--<rs-button size="sm" variant="info" @click="handleLihatPendaftaran">
                  <Icon name="ph:eye" class="w-4 h-4 mr-1" /> Lihat
                </rs-button>-->
              </div>
            </template>
            <template #body>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormKit v-model="formData.kategoriPenolongAmil" type="select" name="kategoriPenolongAmil" label="Kategori Penolong Amil" :options="kategoriPenolongAmilOptions" :classes="{ input: '!py-2' }" />
                <FormKit v-model="formData.jawatan" type="select" name="jawatan" label="Jawatan" :options="jawatanOptions" :classes="{ input: '!py-2' }" />
                <FormKit v-model="formData.institusiKariah" type="select" name="institusiKariah" label="Institusi / Kariah" :options="institusiKariahOptions" :classes="{ input: '!py-2' }" />
                <FormKit v-model="formData.tarikhPendaftaran" type="date" name="tarikhPendaftaran" label="Tarikh Pendaftaran" :classes="{ input: '!py-2' }" />
                <FormKit v-model="formData.sesiPerkhidmatan" type="select" name="sesiPerkhidmatan" label="Sesi Perkhidmatan" :options="sesiPerkhidmatanOptions" :classes="{ input: '!py-2' }" />
                <FormKit v-model="formData.statusAkhir" type="select" name="statusAkhir" label="Status Akhir" :options="statusAkhirOptions" :classes="{ input: '!py-2' }" />
              </div>
            </template>
          </rs-card>

          <!-- Maklumat Perkhidmatan -->
          <rs-card class="mb-6">
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-800">Maklumat Perkhidmatan</h3>
                <!--<rs-button size="sm" variant="info" @click="handleLihatPerkhidmatan">
                  <Icon name="ph:eye" class="w-4 h-4 mr-1" /> Lihat
                </rs-button>-->
              </div>
            </template>
            <template #body>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormKit v-model="formData.kategoriPenolongAmil" type="select" name="kategoriPenolongAmil2" label="Kategori Penolong Amil" :options="kategoriPenolongAmilOptions" :classes="{ input: '!py-2' }" />
                <FormKit v-model="formData.jawatan" type="select" name="jawatan2" label="Jawatan" :options="jawatanOptions" :classes="{ input: '!py-2' }" />
                <FormKit v-model="formData.institusiKariah" type="select" name="institusiKariah2" label="Institusi / Kariah" :options="institusiKariahOptions" :classes="{ input: '!py-2' }" />
                <FormKit v-model="formData.tarikhLantikan" type="date" name="tarikhLantikan" label="Tarikh Lantikan" :classes="{ input: '!py-2' }" />
                <FormKit v-model="formData.sesiPerkhidmatan" type="select" name="sesiPerkhidmatan2" label="Sesi Perkhidmatan" :options="sesiPerkhidmatanOptions" :classes="{ input: '!py-2' }" />
                <FormKit v-model="formData.statusLantikan" type="select" name="statusLantikan" label="Status Lantikan / Perkhidmatan" :options="statusLantikanOptions" :classes="{ input: '!py-2' }" />
              </div>
            </template>
          </rs-card>

          <!-- Maklumat Bank -->
          <rs-card class="mb-6">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-800">Maklumat Bank</h3>
            </template>
            <template #body>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormKit v-model="formData.namaBank" type="text" name="namaBank" label="Nama Bank" :classes="{ input: '!py-2' }" />
                <FormKit v-model="formData.noAkaun" type="text" name="noAkaun" label="No Akaun Bank" :classes="{ input: '!py-2' }" />
                <FormKit v-model="formData.swiftcode" type="text" name="swiftcode" label="Swiftcode" :classes="{ input: '!py-2' }" />
                <FormKit v-model="formData.namaAkaun" type="text" name="namaAkaun" label="Nama Pemegang Akaun" :classes="{ input: '!py-2' }" />
              </div>
            </template>
          </rs-card>

          <!-- Maklumat Waris -->
          <rs-card class="mb-6">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-800">Maklumat Waris</h3>
            </template>
            <template #body>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormKit v-model="formData.namaWaris" type="text" name="namaWaris" label="Nama Waris" :classes="{ input: '!py-2' }" />
                <FormKit v-model="formData.hubunganWaris" type="select" name="hubunganWaris" label="Hubungan" :options="hubunganWarisOptions" :classes="{ input: '!py-2' }" />
                <FormKit v-model="formData.telefonWaris" type="tel" name="telefonWaris" label="No Telefon Waris" :classes="{ input: '!py-2' }" />
              </div>
            </template>
          </rs-card>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-4 mt-6">
            <rs-button variant="secondary" @click="handleCancel">Batal</rs-button>
            <rs-button type="button" variant="primary" :disabled="isSubmitting" @click="handleSubmitDirect">
              <Icon v-if="isSubmitting" name="ph:spinner" class="w-4 h-4 mr-2 animate-spin" />
              {{ isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Success Modal -->
    <rs-modal v-model="showSuccessModal" title="Berjaya!" size="sm" @close="handleModalClose">
      <div class="text-center">
        <Icon name="ph:check-circle" class="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 class="text-lg font-semibold mb-2">Permohonan Berjaya Dikemaskini!</h3>
        <p class="text-gray-600 mb-4">
          Nombor Rujukan: <strong>{{ generatedRujukan }}</strong>
        </p>
        <p class="text-sm text-gray-500">
          Permohonan anda telah berjaya dikemaskini dan dihantar untuk semakan.
        </p>
      </div>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";

definePageMeta({
  title: "Kemaskini Permohonan Penolong Amil",
  description: "Kemaskini maklumat permohonan penolong amil (mengikut spesifikasi medan)",
});

const route = useRoute();
const rujukan = route.params?.rujukan || "PA-2024-009";

const breadcrumb = ref([
  { name: "Penolong Amil", type: "link", path: "/BF-PA/PP/PM/01" },
  { name: "Pendaftaran", type: "link", path: "/BF-PA/PP/PM/01" },
  { name: "Senarai Permohonan", type: "link", path: "/BF-PA/PP/PD" },
  { name: "Kemaskini Permohonan", type: "current", path: `/BF-PA/PP/PD/edit/${rujukan}` },
]);

// Role simulator
const currentRole = ref("PIC");

// FORM DATA (ikut senarai medan)
const formData = reactive({
  // Peribadi
  nama: "",
  jenisPengenalan: "",
  noKP: "",
  tarikhLahir: "",
  jantina: "",
  tarafPerkahwinan: "",
  warganegara: "",

  // Hubungi
  email: "",
  noTelefon: "",
  alamat1: "",
  alamat2: "",
  alamat3: "",
  daerah: "",
  bandar: "",
  poskod: "",
  negeri: "Selangor",

  // Pendaftaran
  kategoriPenolongAmil: "",
  jawatan: "",
  institusiKariah: "",
  tarikhPendaftaran: "",
  sesiPerkhidmatan: "",
  statusAkhir: "",

  // Perkhidmatan
  tarikhLantikan: "",
  statusLantikan: "",

  // Bank
  namaBank: "",
  noAkaun: "",
  swiftcode: "",
  namaAkaun: "",

  // Waris
  namaWaris: "",
  hubunganWaris: "",
  telefonWaris: "",
});

// OPTIONS
const jenisPengenalanOptions = [
  { label: "MyKAD", value: "MyKAD" },
  { label: "Passport", value: "Passport" },
  { label: "Sijil Lahir", value: "Sijil Lahir" },
];
const jantinaOptions = [
  { label: "Lelaki", value: "Lelaki" },
  { label: "Perempuan", value: "Perempuan" },
];
const tarafPerkahwinanOptions = [
  { label: "Bujang", value: "Bujang" },
  { label: "Berkahwin", value: "Berkahwin" },
  { label: "Duda", value: "Duda" },
  { label: "Janda", value: "Janda" },
];
const warganegaraOptions = [
  { label: "Warganegara", value: "Warganegara" },
  { label: "Pemastautin Tetap (PR)", value: "PR" },
  { label: "Bukan Warganegara", value: "Bukan Warganegara" },
];
const daerahSelangorOptions = [
  { label: "Hulu Langat", value: "Hulu Langat" },
  { label: "Petaling", value: "Petaling" },
  { label: "Gombak", value: "Gombak" },
  { label: "Sepang", value: "Sepang" },
  { label: "Klang", value: "Klang" },
  { label: "Kuala Langat", value: "Kuala Langat" },
  { label: "Kuala Selangor", value: "Kuala Selangor" },
  { label: "Hulu Selangor", value: "Hulu Selangor" },
  { label: "Sabak Bernam", value: "Sabak Bernam" },
];
const kategoriPenolongAmilOptions = [
  { label: "Kariah", value: "Kariah" },
  { label: "Komuniti", value: "Komuniti" },
  { label: "Padi", value: "Padi" },
  { label: "Fitrah", value: "Fitrah" },
  { label: "Zakat", value: "Zakat" },
];
const jawatanOptions = [
  { label: "Penolong Amil Kariah", value: "Penolong Amil Kariah" },
  { label: "Penolong Amil Komuniti", value: "Penolong Amil Komuniti" },
  { label: "Penolong Amil Padi", value: "Penolong Amil Padi" },
  { label: "Penolong Amil Fitrah", value: "Penolong Amil Fitrah" },
  { label: "Penolong Amil Zakat", value: "Penolong Amil Zakat" },
];
// Masjid di Selangor
const institusiKariahOptions = [
  { label: "Masjid Al-Amin (Hulu Langat)", value: "Masjid Al-Amin" },
  { label: "Masjid Sultan Salahuddin Abdul Aziz Shah (Shah Alam)", value: "Masjid Sultan Salahuddin Abdul Aziz Shah" },
  { label: "Masjid Tengku Ampuan Jemaah (Bukit Jelutong)", value: "Masjid Tengku Ampuan Jemaah" },
  { label: "Masjid Al-Falah (USJ)", value: "Masjid Al-Falah" },
  { label: "Masjid Jamek Sultan Hisamuddin (Sepang)", value: "Masjid Jamek Sultan Hisamuddin" },
];
const sesiPerkhidmatanOptions = [
  { label: "Sesi 1", value: "Sesi 1" },
  { label: "Sesi 2", value: "Sesi 2" },
  { label: "Sesi 3", value: "Sesi 3" },
  { label: "Sesi 4", value: "Sesi 4" },
];
const statusAkhirOptions = [
  { label: "Draf", value: "Draf" },
  { label: "Dihantar", value: "Dihantar" },
  { label: "Telah Disaring", value: "Telah Disaring" },
  { label: "Telah Disemak", value: "Telah Disemak" },
  { label: "Telah Disokong", value: "Telah Disokong" },
  { label: "Telah Disahkan", value: "Telah Disahkan" },
  { label: "Diluluskan", value: "Diluluskan" },
  { label: "Ditolak", value: "Ditolak" },
];
const statusLantikanOptions = [
  { label: "Menunggu", value: "Menunggu" },
  { label: "Dilantik", value: "Dilantik" },
  { label: "Aktif", value: "Aktif" },
  { label: "Tidak Aktif", value: "Tidak Aktif" },
  { label: "Ditamatkan", value: "Ditamatkan" },
];
const hubunganWarisOptions = [
  { label: "Suami", value: "Suami" },
  { label: "Isteri", value: "Isteri" },
  { label: "Bapa", value: "Bapa" },
  { label: "Ibu", value: "Ibu" },
  { label: "Anak", value: "Anak" },
  { label: "Abang/Kakak", value: "Abang/Kakak" },
  { label: "Adik", value: "Adik" },
  { label: "Lain-lain", value: "Lain-lain" },
];

// UMUR (dikira auto)
const umur = computed(() => {
  if (!formData.tarikhLahir) return "";
  const today = new Date();
  const dob = new Date(formData.tarikhLahir);
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return isNaN(age) ? "" : `${age}`;
});

// Modal state
const showSuccessModal = ref(false);
const isSubmitting = ref(false);
const generatedRujukan = ref(rujukan);

// PRA-ISI: Guna data sama (Ismail bin Hassan — PA-2024-009, Selangor)
onMounted(() => {
  const mock = {
    // Peribadi
    nama: "Ismail bin Hassan",
    jenisPengenalan: "MyKAD",
    noKP: "870625098765",
    tarikhLahir: "1987-06-25",
    jantina: "Lelaki",
    tarafPerkahwinan: "Berkahwin",
    warganegara: "Warganegara",

    // Hubungi
    email: "ismail.hassan@email.com",
    noTelefon: "0127789901",
    alamat1: "No. 12, Jalan Semenyih",
    alamat2: "Taman Kajang Jaya",
    alamat3: "",
    daerah: "Hulu Langat",
    bandar: "Kajang",
    poskod: "43000",
    negeri: "Selangor",

    // Pendaftaran (ikut status semasa — Draf)
    kategoriPenolongAmil: "Komuniti",
    jawatan: "Penolong Amil Komuniti",
    institusiKariah: "Masjid Al-Amin",
    tarikhPendaftaran: "2024-01-12",
    sesiPerkhidmatan: "Sesi 1",
    statusAkhir: "Draf",

    // Perkhidmatan (belum dilantik)
    tarikhLantikan: "",
    statusLantikan: "Menunggu",

    // Bank
    namaBank: "Bank Islam Malaysia Berhad",
    noAkaun: "123456789012",
    swiftcode: "BIMBMYKL",
    namaAkaun: "Ismail bin Hassan",

    // Waris
    namaWaris: "Siti Aminah binti Ali",
    hubunganWaris: "Isteri",
    telefonWaris: "0123456780",
  };
  Object.assign(formData, mock);
});

// Handlers
const handleSubmitDirect = async () => {
  isSubmitting.value = true;
  try {
    await new Promise((r) => setTimeout(r, 800));
    generatedRujukan.value = rujukan; // kekalkan rujukan sedia ada ketika edit
    showSuccessModal.value = true;
  } catch (e) {
    alert("Ralat berlaku semasa menyimpan perubahan. Sila cuba lagi.");
  } finally {
    isSubmitting.value = false;
  }
};
const handleSubmit = () => handleSubmitDirect();

const handleCancel = () => {
  navigateTo("/BF-PA/PP/PD");
};
const handleBack = () => {
  navigateTo("/BF-PA/PP/PD");
};
const handleModalClose = () => {
  showSuccessModal.value = false;
  navigateTo("/BF-PA/PP/PD");
};
const handleRoleChange = (newRole) => {
  currentRole.value = newRole;
};

// Lihat/papar terperinci
const handleLihatPendaftaran = () => {
  navigateTo(`/BF-PA/PP/PD/detail/${rujukan}?role=pyb`);
};
const handleLihatPerkhidmatan = () => {
  navigateTo(`/BF-PA/PP/PD/service-history/${rujukan}`);
};
</script>

<style scoped>
/* Custom styles for edit form */
</style>
