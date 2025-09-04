
<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useUserStore } from "~/stores/user";

definePageMeta({
  title: "Lengkapkan Profil Penolong Amil",
  layout: "default",
});

const { $swal } = useNuxtApp();
const route = useRoute();
const userStore = useUserStore();

// Breadcrumb
const breadcrumb = [
  { title: "Utama", path: "/" },
  { title: "BF-PA", path: "/BF-PA" },
  { title: "Penolong Amil", path: "/BF-PA/PP/penolong-amil" },
  { title: "Lengkapkan Profil", path: "/BF-PA/PP/penolong-amil/profile-complete" },
];

// --------- Form Model ---------
const profileForm = ref({
  // Peribadi
  nama: "",
  noKadPengenalan: "",
  tempatLahir: "",
  tarikhLahir: "",
  jantina: "",
  statusPerkahwinan: "",
  bangsa: "",
  agama: "Islam",
  warganegara: "Malaysia",

  // Perhubungan
  alamat1: "",
  alamat2: "",
  alamat3: "",
  poskod: "",
  bandar: "",
  negeri: "Selangor",
  daerah: "",
  noTelefon: "",
  noTelefonBimbit: "",
  emel: "",

  // Pekerjaan
  pekerjaan: "",
  namaMajikan: "",
  alamatTempatKerja: "",
  noTelefonPejabat: "",

  // Pendidikan
  tahapPendidikan: "",
  institusiPendidikan: "",
  tahunTamat: "",

  // Foto
  photo: null,

  // Bank
  namaBank: "",
  noAkaun: "",
  swiftcode: "",
  namaPemegangAkaun: "",

  // Waris
  namaWaris: "",
  hubungan: "",
  noTelefonWaris: "",
});

// --------- Options ---------
const jantinaOptions = [
  { label: "Sila Pilih Jantina", value: "" },
  { label: "Lelaki", value: "Lelaki" },
  { label: "Perempuan", value: "Perempuan" },
];

const statusPerkahwinanOptions = [
  { label: "Sila Pilih Status", value: "" },
  { label: "Bujang", value: "Bujang" },
  { label: "Berkahwin", value: "Berkahwin" },
  { label: "Bercerai", value: "Bercerai" },
  { label: "Janda/Duda", value: "Janda/Duda" },
];

const bangsaOptions = [
  { label: "Sila Pilih Bangsa", value: "" },
  { label: "Melayu", value: "Melayu" },
  { label: "Cina", value: "Cina" },
  { label: "India", value: "India" },
  { label: "Lain-lain", value: "Lain-lain" },
];

const warganegaraOptions = [
  { label: "Malaysia", value: "Malaysia" },
  { label: "Bukan Warganegara", value: "Bukan Warganegara" },
];

const negeriOptions = [
  { label: "Sila Pilih Negeri", value: "" },
  { label: "Selangor", value: "Selangor" },
  { label: "Kuala Lumpur", value: "Kuala Lumpur" },
  { label: "Putrajaya", value: "Putrajaya" },
  { label: "Negeri Sembilan", value: "Negeri Sembilan" },
  { label: "Melaka", value: "Melaka" },
  { label: "Johor", value: "Johor" },
  { label: "Pahang", value: "Pahang" },
  { label: "Terengganu", value: "Terengganu" },
  { label: "Kelantan", value: "Kelantan" },
  { label: "Perak", value: "Perak" },
  { label: "Perlis", value: "Perlis" },
  { label: "Kedah", value: "Kedah" },
  { label: "Pulau Pinang", value: "Pulau Pinang" },
];

const daerahOptions = [
  { label: "Sila Pilih Daerah", value: "" },
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

const tahapPendidikanOptions = [
  { label: "Sila Pilih Tahap Pendidikan", value: "" },
  { label: "Tiada Pendidikan Formal", value: "Tiada Pendidikan Formal" },
  { label: "Pendidikan Rendah", value: "Pendidikan Rendah" },
  { label: "Pendidikan Menengah", value: "Pendidikan Menengah" },
  { label: "Diploma", value: "Diploma" },
  { label: "Ijazah Sarjana Muda", value: "Ijazah Sarjana Muda" },
  { label: "Ijazah Sarjana", value: "Ijazah Sarjana" },
  { label: "Doktor Falsafah", value: "Doktor Falsafah" },
];

const bankOptions = [
  { label: "Bank Islam Malaysia Berhad", value: "Bank Islam Malaysia Berhad" },
  { label: "Maybank", value: "Maybank" },
  { label: "CIMB Bank", value: "CIMB Bank" },
  { label: "Public Bank", value: "Public Bank" },
  { label: "RHB Bank", value: "RHB Bank" },
];

// --------- Direktori & Config Validasi ---------
const poskodDirectory = {
  "43000": { bandar: "Kajang", daerah: "Hulu Langat", negeri: "Selangor" },
  "40100": { bandar: "Shah Alam", daerah: "Petaling", negeri: "Selangor" },
  "47500": { bandar: "Subang Jaya", daerah: "Petaling", negeri: "Selangor" },
};

const bankConfig = {
  "Bank Islam Malaysia Berhad": { swift: "BIMBMYKL", lengths: [14] },
  Maybank: { swift: "MBBEMYKL", lengths: [12] },
  "CIMB Bank": { swift: "CIBBMYKL", lengths: [10, 12] },
  "Public Bank": { swift: "PBBEMYKL", lengths: [10] },
  "RHB Bank": { swift: "RHBBMYKL", lengths: [10, 12] },
};

// --------- Helpers: MyKAD → DoB, Umur, Validasi ---------
function mykadToDob(ic) {
  if (!ic) return "";
  const digits = ic.replace(/\D/g, "");
  if (digits.length < 6) return "";
  const yy = Number(digits.slice(0, 2));
  const mm = Number(digits.slice(2, 4));
  const dd = Number(digits.slice(4, 6));
  const curYY = new Date().getFullYear() % 100;
  const year = (yy <= curYY ? 2000 : 1900) + yy;
  if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return "";
  return `${year}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
}

const umur = computed(() => {
  const dobStr = profileForm.value.tarikhLahir;
  if (!dobStr) return "";
  const dob = new Date(dobStr);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return Number.isFinite(age) ? String(age) : "";
});

const isEmailValid = computed(() =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.value.emel || "")
);

const emailError = computed(() =>
  profileForm.value.emel && !isEmailValid.value ? "Format emel tidak sah." : ""
);

const isPoskodValid = computed(() => {
  const poskod = profileForm.value.poskod || "";
  if (!/^\d{5}$/.test(poskod)) return false;
  const dir = poskodDirectory[poskod];
  if (!dir) return true; // tiada padanan → lulus asas 5 digit
  const okBandar = !profileForm.value.bandar || profileForm.value.bandar === dir.bandar;
  const okDaerah = !profileForm.value.daerah || profileForm.value.daerah === dir.daerah;
  const okNegeri = !profileForm.value.negeri || profileForm.value.negeri === dir.negeri;
  return okBandar && okDaerah && okNegeri;
});

const poskodError = computed(() =>
  profileForm.value.poskod && !isPoskodValid.value
    ? "Poskod mesti 5 digit dan sepadan dengan bandar/daerah/negeri."
    : ""
);

const accountNumberError = computed(() => {
  const bank = profileForm.value.namaBank;
  const cfg = bankConfig[bank];
  const acc = (profileForm.value.noAkaun || "").replace(/[\s-]/g, "");
  if (!acc) return "";
  if (!/^\d+$/.test(acc)) return "No Akaun mestilah nombor sahaja.";
  if (cfg && !cfg.lengths.includes(acc.length)) {
    return `Panjang No Akaun untuk ${bank} mestilah ${cfg.lengths.join(" atau ")} digit.`;
  }
  return "";
});

// --------- Watchers: Auto-Populate ---------
watch(
  () => profileForm.value.noKadPengenalan,
  (ic) => {
    const dob = mykadToDob(ic);
    if (dob) profileForm.value.tarikhLahir = dob;
  },
  { immediate: true }
);

watch(
  () => profileForm.value.warganegara,
  (v) => {
    if (!v) profileForm.value.warganegara = "Malaysia";
  },
  { immediate: true }
);

watch(
  () => profileForm.value.negeri,
  (v) => {
    if (!v) profileForm.value.negeri = "Selangor";
  },
  { immediate: true }
);

watch(
  () => profileForm.value.namaBank,
  (bank) => {
    if (bank && bankConfig[bank]) {
      profileForm.value.swiftcode = bankConfig[bank].swift;
    } else {
      profileForm.value.swiftcode = "";
    }
  },
  { immediate: true }
);

// Auto-padankan bandar/daerah/negeri bila poskod diisi (jika kosong)
watch(
  () => profileForm.value.poskod,
  (pos) => {
    const dir = poskodDirectory[pos];
    if (dir) {
      if (!profileForm.value.bandar) profileForm.value.bandar = dir.bandar;
      if (!profileForm.value.daerah) profileForm.value.daerah = dir.daerah;
      if (!profileForm.value.negeri) profileForm.value.negeri = dir.negeri;
    }
  }
);

// --------- Mock Data (pre-fill) ---------
onMounted(() => {
  // Data asas (nama & IC dari rekod — read-only)
  profileForm.value.nama = "Ismail bin Hassan";
  profileForm.value.noKadPengenalan = "870625098765";
  profileForm.value.emel = "ismail.hassan@email.com";

  // Auto tarikh lahir melalui watcher
  profileForm.value.tempatLahir = "Kajang, Selangor";
  profileForm.value.jantina = "Lelaki";
  profileForm.value.statusPerkahwinan = "Berkahwin";
  profileForm.value.bangsa = "Melayu";
  profileForm.value.warganegara = "Malaysia";

  // Alamat & kontak (padan poskod → bandar/daerah/negeri)
  profileForm.value.alamat1 = "No. 12, Jalan Semenyih";
  profileForm.value.alamat2 = "Taman Kajang Jaya";
  profileForm.value.alamat3 = "";
  profileForm.value.poskod = "43000";
  profileForm.value.bandar = "Kajang";
  profileForm.value.daerah = "Hulu Langat";
  profileForm.value.negeri = "Selangor";
  profileForm.value.noTelefon = "03-87345678";
  profileForm.value.noTelefonBimbit = "0127789901";

  // Pekerjaan
  profileForm.value.pekerjaan = "Pegawai Khidmat Pelanggan";
  profileForm.value.namaMajikan = "Syarikat Maju Jaya Sdn Bhd";
  profileForm.value.alamatTempatKerja = "No. 8, Jalan Perdana, 43000 Kajang, Selangor";
  profileForm.value.noTelefonPejabat = "03-87234567";

  // Pendidikan
  profileForm.value.tahapPendidikan = "Ijazah Sarjana Muda";
  profileForm.value.institusiPendidikan = "Universiti Kebangsaan Malaysia";
  profileForm.value.tahunTamat = "2010";

  // Bank
  profileForm.value.namaBank = "Bank Islam Malaysia Berhad";
  profileForm.value.noAkaun = "12345678901234"; // 14 digit (ikut config)
  profileForm.value.namaPemegangAkaun = "Ismail bin Hassan";

  // Waris
  profileForm.value.namaWaris = "Siti Aminah binti Ali";
  profileForm.value.hubungan = "Isteri";
  profileForm.value.noTelefonWaris = "0123456780";

  // Sembunyikan sidebar (jika perlu)
  const vLayout = document.querySelector(".v-layout");
  if (vLayout) vLayout.classList.add("menu-hide");
  const menuOverlay = document.querySelector(".menu-overlay");
  if (menuOverlay) menuOverlay.classList.add("hide");
});

// --------- Handlers ---------
const handlePhotoUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (!file.type.startsWith("image/")) {
      alert("Sila pilih fail gambar sahaja.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Saiz fail terlalu besar. Sila pilih fail kurang daripada 5MB.");
      return;
    }
    profileForm.value.photo = file;
  }
};

const handleSubmit = async () => {
  // Validasi minimum sebelum PDPA modal
  if (!isEmailValid.value) {
    $swal.fire({ icon: "error", title: "Emel tidak sah", text: "Sila semak format emel anda." });
    return;
  }
  if (!isPoskodValid.value) {
    $swal.fire({ icon: "error", title: "Poskod tidak sah", text: "Poskod mesti 5 digit dan sepadan dengan bandar/daerah/negeri." });
    return;
  }
  if (accountNumberError.value) {
    $swal.fire({ icon: "error", title: "No Akaun Tidak Sah", text: accountNumberError.value });
    return;
  }

  // PDPA & Akuan Konflik
  const result = await $swal.fire({
    title: "Terma dan Syarat",
    html: `
      <div class="text-left space-y-4 max-h-96 overflow-y-auto">
        <div class="border-b pb-3">
          <h4 class="font-semibold text-gray-900 mb-2">PDPA</h4>
          <p class="text-sm text-gray-700 leading-relaxed">
            Saya dengan ini bersetuju memberi persetujuan secara nyata (explicit consent) kepada Lembaga Zakat Selangor untuk mengumpul, memproses, menggunakan data peribadi saya bagi tujuan pentadbiran, kajian, dakwah, promosi dan aktiviti-aktiviti lain berkaitan fungsi Zakat Selangor seperti yang dinyatakan di dalam Notis Privasi Zakat Selangor di www.zakatselangor.com.my
          </p>
          <div class="mt-3">
            <label class="flex items-center">
              <input type="checkbox" id="pdpa-consent" class="mr-2 rounded border-gray-300 text-primary focus:ring-primary">
              <span class="text-sm text-gray-700">Saya bersetuju dengan terma PDPA</span>
            </label>
          </div>
        </div>
        <div>
          <h4 class="font-semibold text-gray-900 mb-2">Akuan Konflik</h4>
          <p class="text-sm text-gray-700 leading-relaxed">
            Saya mengesahkan bahawa segala maklumat dan data yang diberikan adalah BENAR, TEPAT, LENGKAP dan TERKINI. Saya faham dan bersetuju sekiranya saya memberi maklumat palsu dan tidak benar, pihak Lembaga Zakat Selangor berhak mengambil tindakan ke atas saya.
          </p>
          <div class="mt-3">
            <label class="flex items-center">
              <input type="checkbox" id="conflict-consent" class="mr-2 rounded border-gray-300 text-primary focus:ring-primary">
              <span class="text-sm text-gray-700">Saya mengesahkan maklumat adalah benar dan tepat</span>
            </label>
          </div>
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Simpan & Teruskan",
    cancelButtonText: "Batal",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    reverseButtons: true,
    allowOutsideClick: false,
    didOpen: () => {
      const confirmButton = document.querySelector(".swal2-confirm");
      if (confirmButton) {
        confirmButton.disabled = true;
        confirmButton.classList.add("opacity-50", "cursor-not-allowed");
      }
      const pdpaCheckbox = document.getElementById("pdpa-consent");
      const conflictCheckbox = document.getElementById("conflict-consent");
      const updateButtonState = () => {
        if (pdpaCheckbox && conflictCheckbox && confirmButton) {
          if (pdpaCheckbox.checked && conflictCheckbox.checked) {
            confirmButton.disabled = false;
            confirmButton.classList.remove("opacity-50", "cursor-not-allowed");
          } else {
            confirmButton.disabled = true;
            confirmButton.classList.add("opacity-50", "cursor-not-allowed");
          }
        }
      };
      pdpaCheckbox?.addEventListener("change", updateButtonState);
      conflictCheckbox?.addEventListener("change", updateButtonState);
    },
  });

  if (result.isConfirmed) {
    navigateTo("/BF-PA/PP/penolong-amil/profil");
  }
};

const handleBack = () => {
  navigateTo("/BF-PA/PP/penolong-amil");
};
</script>

<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Progress Indicator -->
    <rs-card class="mb-6">
      <template #body>
        <div class="flex items-center justify-between p-4">
          <div class="flex items-center gap-4">
            <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
              3
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Lengkapkan Profil</h3>
              <p class="text-sm text-gray-600">Maklumat peribadi dan foto</p>
            </div>
          </div>
          <rs-badge variant="warning">Dalam Proses</rs-badge>
        </div>
      </template>
    </rs-card>

    <!-- Profile Form -->
    <rs-card>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Maklumat Peribadi</h2>
          <rs-button variant="secondary-outline" @click="handleBack">
            <Icon name="ph:arrow-left" class="w-4 h-4 mr-1" />
            Kembali
          </rs-button>
        </div>
      </template>

      <template #body>
        <div class="space-y-8">
          <!-- Personal Information -->
          <div class="space-y-6">
            

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormKit
                type="text"
                name="nama"
                label="Nama Penuh"
                v-model="profileForm.nama"
                disabled
                :classes="{ input: '!py-2' }"
                help="Dipaparkan daripada rekod pendaftaran. Tidak boleh diubah."
              />

              <FormKit
                type="text"
                name="noKadPengenalan"
                label="Nombor Kad Pengenalan"
                v-model="profileForm.noKadPengenalan"
                disabled
                :classes="{ input: '!py-2' }"
                help="Dipaparkan daripada rekod pendaftaran. Tidak boleh diubah."
              />

              <FormKit
                type="text"
                name="tempatLahir"
                label="Tempat Lahir"
                v-model="profileForm.tempatLahir"
                :classes="{ input: '!py-2' }"
              />

              <FormKit
                type="date"
                name="tarikhLahir"
                label="Tarikh Lahir"
                v-model="profileForm.tarikhLahir"
                :classes="{ input: '!py-2' }"
                help="Auto-populate dari nombor MyKAD"
              />

              <FormKit
                type="text"
                name="umur"
                label="Umur"
                :value="umur"
                disabled
                :classes="{ input: '!py-2' }"
                help="Auto-populate dari tarikh lahir"
              />

              <FormKit
                type="select"
                name="jantina"
                label="Jantina"
                v-model="profileForm.jantina"
                :options="jantinaOptions"
                :classes="{ input: '!py-2' }"
              />

              <FormKit
                type="select"
                name="statusPerkahwinan"
                label="Status Perkahwinan"
                v-model="profileForm.statusPerkahwinan"
                :options="statusPerkahwinanOptions"
                :classes="{ input: '!py-2' }"
              />

              <FormKit
                type="select"
                name="bangsa"
                label="Bangsa"
                v-model="profileForm.bangsa"
                :options="bangsaOptions"
                :classes="{ input: '!py-2' }"
              />

              <FormKit
                type="select"
                name="warganegara"
                label="Warganegara"
                v-model="profileForm.warganegara"
                :options="warganegaraOptions"
                :classes="{ input: '!py-2' }"
                help="Default: Malaysia"
              />
            </div>
          </div>

          <!-- Contact Information -->
          <div class="space-y-6">
            <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">Maklumat untuk Dihubungi</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormKit
                type="textarea"
                name="alamat1"
                label="Alamat 1"
                v-model="profileForm.alamat1"
                :classes="{ input: '!py-2' }"
              />

              <FormKit
                type="select"
                name="negeri"
                label="Negeri"
                v-model="profileForm.negeri"
                :options="negeriOptions"
                :classes="{ input: '!py-2' }"
                help="Default: Selangor"
              />

              <FormKit
                type="textarea"
                name="alamat2"
                label="Alamat 2"
                v-model="profileForm.alamat2"
                :classes="{ input: '!py-2' }"
              />

              <FormKit
                type="select"
                name="daerah"
                label="Daerah"
                v-model="profileForm.daerah"
                :options="daerahOptions"
                :classes="{ input: '!py-2' }"
              />

              <FormKit
                type="textarea"
                name="alamat3"
                label="Alamat 3"
                v-model="profileForm.alamat3"
                :classes="{ input: '!py-2' }"
              />

              <FormKit
                type="text"
                name="bandar"
                label="Bandar"
                v-model="profileForm.bandar"
                :classes="{ input: '!py-2' }"
              />

              <div>
                <FormKit
                  type="text"
                  name="poskod"
                  label="Poskod"
                  v-model="profileForm.poskod"
                  :classes="{ input: '!py-2' }"
                  help="Validasi 5 digit, mesti sepadan dengan daerah/bandar"
                />
                <p v-if="poskodError" class="text-sm text-red-600 mt-1">{{ poskodError }}</p>
              </div>

              <FormKit
                type="tel"
                name="noTelefon"
                label="Nombor Telefon"
                v-model="profileForm.noTelefon"
                :classes="{ input: '!py-2' }"
              />

              <FormKit
                type="tel"
                name="noTelefonBimbit"
                label="Nombor Telefon Bimbit"
                v-model="profileForm.noTelefonBimbit"
                :classes="{ input: '!py-2' }"
              />

              <div class="md:col-span-2">
                <FormKit
                  type="email"
                  name="emel"
                  label="Alamat E-mel"
                  v-model="profileForm.emel"
                  :classes="{ input: '!py-2' }"
                  placeholder="nama@domain.com"
                />
                <p v-if="emailError" class="text-sm text-red-600 mt-1">{{ emailError }}</p>
              </div>
            </div>
          </div>

          

          <!-- Bank Information -->
          <div class="space-y-6">
            <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">Maklumat Bank</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormKit
                type="select"
                name="namaBank"
                label="Nama Bank"
                v-model="profileForm.namaBank"
                :options="bankOptions"
                :classes="{ input: '!py-2' }"
              />

              <div>
                <FormKit
                  type="text"
                  name="noAkaun"
                  label="No Akaun Bank"
                  v-model="profileForm.noAkaun"
                  :classes="{ input: '!py-2' }"
                  placeholder="Nombor sahaja"
                />
                <p v-if="accountNumberError" class="text-sm text-red-600 mt-1">{{ accountNumberError }}</p>
              </div>

              <FormKit
                type="text"
                name="swiftcode"
                label="Swiftcode"
                v-model="profileForm.swiftcode"
                disabled
                :classes="{ input: '!py-2 bg-gray-100' }"
                
              />

              <FormKit
                type="text"
                name="namaPemegangAkaun"
                label="Nama Pemegang Akaun"
                v-model="profileForm.namaPemegangAkaun"
                :classes="{ input: '!py-2' }"
              />
            </div>
          </div>

          <!-- Waris -->
          <div class="space-y-6">
            <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">Maklumat Waris</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormKit type="text" name="namaWaris" label="Nama Waris" v-model="profileForm.namaWaris" :classes="{ input: '!py-2' }" />

              <FormKit type="text" name="hubungan" label="Hubungan" v-model="profileForm.hubungan" :classes="{ input: '!py-2' }" />

              <FormKit type="tel" name="noTelefonWaris" label="No Telefon Waris" v-model="profileForm.noTelefonWaris" :classes="{ input: '!py-2' }" />
            </div>
          </div>

          <!-- Photo Upload -->
          <div class="space-y-6">
            <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">Foto Profil</h3>

            <div class="space-y-4">
              <div class="bg-warning/5 border border-warning/20 rounded-lg p-4">
                <div class="flex items-start gap-3">
                  <Icon name="ph:warning" class="text-warning mt-0.5" size="20" />
                  <div>
                    <p class="font-semibold text-warning mb-2">Foto Profil Diperlukan</p>
                    <p class="text-gray-700 text-sm">Sila muat naik foto profil anda. Foto ini digunakan untuk kad tauliah dan dokumen rasmi.</p>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Muat Naik Foto</label>
                  <input
                    type="file"
                    accept="image/*"
                    @change="handlePhotoUpload"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  />
                  <p class="text-xs text-gray-500 mt-1">Format: JPG, PNG. Saiz maksimum: 5MB</p>
                </div>

                <div v-if="profileForm.photo" class="flex items-center justify-center">
                  <div class="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                    <img :src="URL.createObjectURL(profileForm.photo)" alt="Preview" class="w-28 h-28 object-cover rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end gap-4 pt-6 border-t">
            <rs-button variant="secondary-outline" @click="handleBack">Reset</rs-button>
            <rs-button variant="primary" @click="handleSubmit">
              <Icon name="ph:check" class="w-4 h-4 mr-2" />
              Simpan & Teruskan
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped>
/* Custom styles (optional) */
</style>
```
