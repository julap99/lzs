<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const showConfirmModal = ref(false);
const showRegistrationModal = ref(false);
const registrationType = ref('');

definePageMeta({
  title: "Hantar Aduan",
});

const breadcrumb = ref([
  {
    name: "Pengurusan Aduan",
    type: "link",
    path: "/BF-ADN/PA/DA/01",
  },
  {
    name: "Hantar Aduan",
    type: "current",
    path: "/BF-ADN/PA/DA/01",
  },
]);

const formData = ref({
  // Form control
  isWakil: false,

  // Maklumat Individu Dibantu
  jenisID: "",
  noKadPengenalan: "",
  namaPenuh: "",
  emel: "",
  noTelefon: "",
  alamatBaris1: "",
  alamatBaris2: "",
  negeri: "Selangor",
  daerah: "",
  kariah: "",
  lokasi: {
    lat: null,
    lng: null,
    address: "",
  },
  penyataanMasalah: "",
  ringkasanAduan: "",
  lampiran: [],

  // Maklumat Pengadu (jika wakil)
  namaPengadu: "",
  noKadPengenalanPengadu: "",
  emelPengadu: "",
  noTelefonPengadu: "",
});

const penyataanMasalahOptions = [
  {
    label: "Terputus Bekalan Makanan/Tiada Tempat Tinggal (Kelas 1/Merah)",
    value: "kelas_1",
  },
  {
    label:
      "Masih Ada Bekalan Makanan/Mempunyai Tempat Tinggal/Tiada Sumber Pendapatan (Kelas 2/Kuning)",
    value: "kelas_2",
  },
  {
    label: "Pendapatan Berkurangan/Keperluan Lain. (Kelas 3/Hijau)",
    value: "kelas_3",
  },
];

const jenisIDOptions = [
  { label: "MyKad (IC)", value: "mykad" },
  { label: "Passport", value: "passport" },
  { label: "MyTentera", value: "mytentera" },
  { label: "MyPolis", value: "mypolis" },
  { label: "Lain-lain", value: "lain" },
];

const daerahOptions = [
  { label: "Petaling", value: "petaling" },
  { label: "Klang", value: "klang" },
  { label: "Hulu Langat", value: "hulu_langat" },
  { label: "Sepang", value: "sepang" },
  { label: "Gombak", value: "gombak" },
  { label: "Kuala Selangor", value: "kuala_selangor" },
  { label: "Hulu Selangor", value: "hulu_selangor" },
  { label: "Sabak Bernam", value: "sabak_bernam" },
];

const kariahOptions = ref([]);

const updateKariahOptions = (daerah) => {
  switch (daerah) {
    case "petaling":
      kariahOptions.value = [
        {
          label: "Kariah Masjid Sultan Salahuddin Abdul Aziz Shah",
          value: "msaas",
        },
        { label: "Kariah Masjid Al-Hidayah", value: "alhidayah" },
      ];
      break;
    case "klang":
      kariahOptions.value = [
        { label: "Kariah Masjid Sultan Suleiman", value: "mss" },
        { label: "Kariah Masjid Al-Hidayah Klang", value: "ahk" },
      ];
      break;
    default:
      kariahOptions.value = [];
  }
};

watch(
  () => formData.value.daerah,
  (newDaerah) => {
    updateKariahOptions(newDaerah);
    formData.value.kariah = "";
  }
);

const handleSubmit = () => {
  // Validate ID number based on selected ID type
  const idType = formData.value.jenisID;
  const idNumber = formData.value.noKadPengenalan;

  let isValid = true;
  let errorMessage = "";

  switch (idType) {
    case "mykad":
      if (!/^\d{12}$/.test(idNumber)) {
        isValid = false;
        errorMessage = "Nombor MyKad mestilah 12 digit";
      }
      break;
    case "passport":
      if (!/^[A-Z0-9]{6,12}$/.test(idNumber)) {
        isValid = false;
        errorMessage = "Format passport tidak sah";
      }
      break;
    case "mytentera":
      if (!/^[A-Z0-9]{6,12}$/.test(idNumber)) {
        isValid = false;
        errorMessage = "Format MyTentera tidak sah";
      }
      break;
    case "mypolis":
      if (!/^[A-Z0-9]{6,12}$/.test(idNumber)) {
        isValid = false;
        errorMessage = "Format MyPolis tidak sah";
      }
      break;
    case "lain":
      if (!idNumber) {
        isValid = false;
        errorMessage = "Sila masukkan nombor ID";
      }
      break;
  }

  if (!isValid) {
    alert(errorMessage);
    return;
  }

  // Check if user needs registration
  if (formData.value.isWakil === 'diri_sendiri' && 
      (formData.value.penyataanMasalah === 'kelas_2' || formData.value.penyataanMasalah === 'kelas_3')) {
    registrationType.value = formData.value.penyataanMasalah === 'kelas_2' ? 'quick' : 'full';
    showRegistrationModal.value = true;
    return;
  }

  showConfirmModal.value = true;
};

const handleRegistrationConfirm = () => {
  showRegistrationModal.value = false;
  // Redirect based on registration type
  if (registrationType.value === 'quick') {
    router.push('/BF-ADN/PA/DA/quick-registration');
  } else {
    router.push('/BF-ADN/PA/DA/full-registration');
  }
};

const handleRegistrationCancel = () => {
  showRegistrationModal.value = false;
};

const handleConfirm = () => {
  console.log("Form submitted:", formData.value);
  showConfirmModal.value = false;
  router.push("/BF-ADN/PA/DA/02");
};

const handleCancel = () => {
  showConfirmModal.value = false;
};

// Geo-Lokasi functions
const getCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        formData.value.lokasi.lat = position.coords.latitude;
        formData.value.lokasi.lng = position.coords.longitude;
        // Here you would typically call a geocoding service to get the address
        // For now, we'll just set a placeholder
        formData.value.lokasi.address = "Lokasi semasa";
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  }
};
</script>

<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mx-auto">
      <template #header>
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold">Hantar Aduan</h1>
        </div>
      </template>

      <template #body>
        <FormKit
          type="form"
          @submit="handleSubmit"
          :actions="false"
          class="space-y-8"
        >
          <!-- Maklumat Individu Dibantu -->
          <div class="space-y-6">
            <div class="flex items-center gap-2">
              <h2 class="text-lg font-semibold">Maklumat Individu Dibantu</h2>
              <div class="h-px flex-1 bg-gray-200"></div>
            </div>

            <div
              class="bg-white p-6 rounded-lg border border-gray-200 space-y-6"
            >
              <!-- Maklumat Peribadi -->
              <div class="space-y-4">
                <h3 class="text-md font-medium text-gray-700">
                  Maklumat Peribadi
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Jenis ID & Nombor -->
                  <div class="space-y-2">
                    <FormKit
                      v-model="formData.jenisID"
                      type="select"
                      label="Jenis ID"
                      :options="jenisIDOptions"
                      validation="required"
                      validation-visibility="dirty"
                    />
                  </div>

                  <FormKit
                    v-model="formData.noKadPengenalan"
                    label="Nombor ID"
                    type="text"
                    validation="required"
                    validation-visibility="dirty"
                    :validation-messages="{
                      required: 'Nombor ID diperlukan',
                    }"
                  />

                  <FormKit
                    v-model="formData.namaPenuh"
                    label="Nama Penuh"
                    type="text"
                    validation="required"
                    validation-visibility="dirty"
                  />

                  <FormKit
                    v-model="formData.emel"
                    label="Emel"
                    type="email"
                    validation="required|email"
                    validation-visibility="dirty"
                  />

                  <FormKit
                    v-model="formData.noTelefon"
                    label="No. Telefon"
                    type="tel"
                    validation="required|matches:/^[0-9]{10}$/"
                    validation-visibility="dirty"
                    help="Format: xxxxxxxxxx"
                  />
                </div>
              </div>

              <!-- Alamat -->
              <div class="space-y-4">
                <h3 class="text-md font-medium text-gray-700">Alamat</h3>
                <div class="space-y-4">
                  <FormKit
                    v-model="formData.alamatBaris1"
                    label="Alamat Baris 1"
                    type="text"
                    validation="required"
                    validation-visibility="dirty"
                  />

                  <FormKit
                    v-model="formData.alamatBaris2"
                    label="Alamat Baris 2"
                    type="text"
                  />

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormKit
                      v-model="formData.negeri"
                      label="Negeri"
                      type="text"
                      :disabled="true"
                      validation="required"
                      validation-visibility="dirty"
                    />

                    <FormKit
                      v-model="formData.daerah"
                      label="Daerah"
                      type="select"
                      :options="daerahOptions"
                      validation="required"
                      validation-visibility="dirty"
                    />

                    <FormKit
                      v-model="formData.kariah"
                      label="Kariah"
                      type="select"
                      :options="kariahOptions"
                      validation="required"
                      validation-visibility="dirty"
                      :disabled="!formData.daerah"
                    />
                  </div>

                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700"
                      >Lokasi</label
                    >
                    <div class="flex gap-2">
                      <FormKit
                        v-model="formData.lokasi.address"
                        type="text"
                        placeholder="Pilih lokasi"
                        validation="required"
                        validation-visibility="dirty"
                        class="flex-1"
                      />
                      <rs-button
                        type="button"
                        variant="primary-outline"
                        @click="getCurrentLocation"
                        class="whitespace-nowrap"
                      >
                        <i class="fas fa-location-dot mr-2"></i>
                        Dapatkan Lokasi
                      </rs-button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Butiran Aduan -->
              <div class="space-y-4">
                <h3 class="text-md font-medium text-gray-700">Butiran Aduan</h3>
                <div class="space-y-4">
                  <div class="space-y-2">
                    <span class="text-md font-medium text-foreground"
                      >Tahap Keperluan Bantuan</span
                    >
                    <FormKit
                      v-model="formData.penyataanMasalah"
                      type="radio"
                      :options="penyataanMasalahOptions"
                      validation="required"
                      validation-visibility="dirty"
                      :classes="{
                        fieldset: 'border-0 !p-0',
                        legend: '!font-semibold !text-sm mb-0',
                        options: '!flex !flex-col gap-4 mt-3',
                      }"
                    />
                  </div>

                  <FormKit
                    v-model="formData.ringkasanAduan"
                    label="Penyataan Masalah"
                    type="textarea"
                    rows="4"
                    validation="required"
                    validation-visibility="dirty"
                  />

                  <FormKit
                    v-model="formData.lampiran"
                    label="Lampiran/Gambar"
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf"
                    help="Format yang diterima: JPG, PNG, PDF"
                  />

                  <!-- Aduan Untuk -->
                  <div class="bg-gray-50 p-6 rounded-lg">
                    <h2 class="text-lg font-semibold mb-4">Aduan Untuk</h2>
                    <FormKit
                      v-model="formData.isWakil"
                      type="radio"
                      :options="[
                        { label: 'Diri sendiri', value: 'diri_sendiri' },
                        { label: 'Orang lain (wakil)', value: 'wakil' },
                      ]"
                      :classes="{
                        fieldset: 'border-0 !p-0',
                        legend: '!font-semibold !text-sm mb-0',
                        options: '!flex !flex-col gap-4 mt-3',
                      }"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Maklumat Pengadu (jika wakil) -->
          <div v-if="formData.isWakil === 'wakil'" class="space-y-6 mt-6">
            <div class="flex items-center gap-2">
              <h2 class="text-lg font-semibold">Maklumat Pengadu (Wakil)</h2>
              <div class="h-px flex-1 bg-gray-200"></div>
            </div>

            <div class="bg-white p-6 rounded-lg border border-gray-200">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormKit
                  v-model="formData.namaPengadu"
                  label="Nama"
                  type="text"
                  validation="required"
                  validation-visibility="dirty"
                />

                <FormKit
                  v-model="formData.noKadPengenalanPengadu"
                  label="No. Kad Pengenalan"
                  type="text"
                  validation="required|length:12"
                  validation-visibility="dirty"
                />

                <FormKit
                  v-model="formData.emelPengadu"
                  label="Emel"
                  type="email"
                  validation="required|email"
                  validation-visibility="dirty"
                />

                <FormKit
                  v-model="formData.noTelefonPengadu"
                  label="No. Telefon"
                  type="tel"
                  validation="required|matches:/^[0-9]{3}-[0-9]{7}$/"
                  validation-visibility="dirty"
                  help="Format: xxx-xxxxxxx"
                />
              </div>
            </div>
          </div>

          <div class="flex justify-end mt-8">
            <rs-button
              type="submit"
              variant="primary"
              class="min-w-[200px]"
              @click="handleSubmit"
            >
              Hantar Aduan
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <rs-modal
      v-model="showConfirmModal"
      title="Pengesahan"
      :show-close="true"
      @close="handleCancel"
      position="center"
      ok-title="Ya"
      :ok-callback="handleConfirm"
      cancel-title="Tidak"
      :cancel-callback="handleCancel"
    >
      <template #default>
        <p class="text-center mb-6">
          Adakah anda pasti untuk menghantar aduan ini?
        </p>
      </template>
    </rs-modal>

    <rs-modal
      v-model="showRegistrationModal"
      title="Pendaftaran"
      :show-close="true"
      @close="handleRegistrationCancel"
      position="center"
      ok-title="OK"
      :ok-callback="handleRegistrationConfirm"
      cancel-title="Batal"
      :cancel-callback="handleRegistrationCancel"
    >
      <template #default>
        <p class="text-center mb-6">
          Untuk meneruskan aduan ini, anda perlu membuat pendaftaran terlebih dahulu.
        </p>
      </template>
    </rs-modal>
  </div>
</template>
