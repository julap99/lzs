<!-- 
  RTMF SCREEN: PA-PP-PD-01_02
  PURPOSE: Centralized Detail View - Maklumat Penolong Amil Terperinci
  DESCRIPTION: Role-aware detailed information view for Penolong Amil applications
  ROUTE: /BF-PA/PP/PD/detail/[rujukan]
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Maklumat Terperinci Penolong Amil</h2>
          <div class="flex gap-2">
            <rs-button variant="secondary-outline" @click="handleBack">
              <Icon name="ph:arrow-left" class="w-4 h-4 mr-1" />
              Kembali
            </rs-button>
            <rs-button v-if="canEdit" variant="primary" @click="handleEdit">
              <Icon name="ph:pencil" class="w-4 h-4 mr-1" />
              Kemaskini
            </rs-button>
            <rs-button variant="info" @click="handleViewProcessTrace" title="PA-PP-PD-01_04: Jejak Proses">
              <Icon name="ph:flow-arrow" class="w-4 h-4 mr-1" />
              Jejak Proses
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <!-- Ringkasan Status -->
          <div class="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Status Permohonan</h3>
                <p class="text-sm text-gray-600">Rujukan: {{ application.rujukan }}</p>
              </div>
              <div class="flex gap-2">
                <rs-badge :variant="getStatusPendaftaranVariant(application.statusAkhir)">
                  {{ application.statusAkhir }}
                </rs-badge>
                <rs-badge :variant="getStatusLantikanVariant(application.statusLantikan)">
                  {{ application.statusLantikan }}
                </rs-badge>
              </div>
            </div>
          </div>

          <!-- Maklumat Peribadi -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">Maklumat Peribadi</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Nama" :value="application.nama" />
              <Field label="Jenis Pengenalan" :value="application.jenisPengenalan" />
              <Field label="ID Pengenalan" :value="application.noKP" />
              <Field label="Tarikh Lahir" :value="formatDate(application.tarikhLahir)" />
              <Field label="Umur" :value="umur + ' tahun'" />
              <Field label="Jantina" :value="application.jantina" />
              <Field label="Taraf Perkahwinan" :value="application.tarafPerkahwinan" />
              <Field label="Warganegara" :value="application.warganegara" />
            </div>
          </div>

          <!-- Maklumat Untuk Dihubungi -->
<div class="mb-6 p-6 border border-gray-200 rounded-lg">
  <h3 class="text-lg font-semibold mb-4 text-gray-900">Maklumat Untuk Dihubungi</h3>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Field label="Emel" :value="application.email" />
    <Field label="No Telefon" :value="application.noTelefon" />

    <!-- Alamat 1/2/3 berasingan tapi dalam kolum yang sama -->
    <div class="md:col-span-2 grid grid-cols-1 gap-2">
      <Field label="Alamat 1" :value="application.alamat1 || '-'" />
      <Field v-if="application.alamat2" label="Alamat 2" :value="application.alamat2" />
      <Field v-if="application.alamat3" label="Alamat 3" :value="application.alamat3" />
      <p
        v-if="!application.alamat1 && !application.alamat2 && !application.alamat3"
        class="text-gray-500"
      >-</p>
    </div>

    <Field label="Daerah" :value="application.daerah" />
    <Field label="Bandar" :value="application.bandar" />
    <Field label="Poskod" :value="application.poskod" />
    <Field label="Negeri" :value="application.negeri" />
  </div>
</div>


          <!-- Maklumat Pendaftaran -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Maklumat Pendaftaran</h3>
              <rs-button size="sm" variant="primary-outline" @click="handleViewPendaftaran">
                <Icon name="ph:eye" class="w-4 h-4 mr-1" /> Lihat
              </rs-button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Kategori Penolong Amil" :value="application.kategoriPenolongAmil" />
              <Field label="Jawatan" :value="application.jawatan" />
              <Field label="Institusi / Kariah" :value="application.institusiKariah" />
              <Field label="Tarikh Pendaftaran" :value="formatDate(application.tarikhPendaftaran)" />
              <Field label="Sesi Perkhidmatan" :value="application.sesiPerkhidmatan" />
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status Akhir</label>
                <rs-badge :variant="getStatusPendaftaranVariant(application.statusAkhir)">
                  {{ application.statusAkhir }}
                </rs-badge>
              </div>
            </div>
          </div>

          <!-- Maklumat Perkhidmatan -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Maklumat Perkhidmatan</h3>
              <rs-button size="sm" variant="primary-outline" @click="handleViewPerkhidmatan">
                <Icon name="ph:eye" class="w-4 h-4 mr-1" /> Lihat
              </rs-button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Kategori Penolong Amil" :value="application.kategoriPenolongAmil" />
              <Field label="Jawatan" :value="application.jawatan" />
              <Field label="Institusi / Kariah" :value="application.institusiKariah" />
              <Field label="Tarikh Lantikan" :value="application.tarikhLantikan ? formatDate(application.tarikhLantikan) : '-'" />
              <Field label="Sesi Perkhidmatan" :value="application.sesiPerkhidmatan" />
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status Lantikan / Perkhidmatan</label>
                <rs-badge :variant="getStatusLantikanVariant(application.statusLantikan)">
                  {{ application.statusLantikan }}
                </rs-badge>
              </div>
            </div>
          </div>

          <!-- Maklumat Bank -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">Maklumat Bank</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Nama Bank" :value="application.namaBank" />
              <Field label="No Akaun Bank" :value="application.noAkaunBank" />
              <Field label="Swiftcode" :value="application.swiftcode" />
              <Field label="Nama Pemegang Akaun" :value="application.namaPemegangAkaun" />
            </div>
          </div>

          <!-- Maklumat Waris -->
          <div class="mb-2 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">Maklumat Waris</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Nama Waris" :value="application.namaWaris" />
              <Field label="Hubungan" :value="application.hubunganWaris" />
              <Field label="No Telefon Waris" :value="application.telefonWaris" />
            </div>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, defineComponent, h } from "vue";
import { useRoute, navigateTo } from "#app";

/** Kecil & reusable: paparan label + nilai */
const Field = defineComponent({
  name: "Field",
  props: { label: String, value: [String, Number] },
  setup(props) {
    return () =>
      h("div", {}, [
        h("label", { class: "block text-sm font-medium text-gray-700 mb-1" }, props.label),
        h("p", { class: "text-gray-900" }, props.value || "-"),
      ]);
  },
});

definePageMeta({
  title: "Maklumat Terperinci Penolong Amil",
  description: "Maklumat terperinci penolong amil dengan verifikasi berperingkat",
});

const route = useRoute();
const currentRole = ref(route.query.role || "pyb");

/** Breadcrumb */
const breadcrumb = ref([
  { name: "Penolong Amil", type: "link", path: "/BF-PA/PP/PM/01" },
  { name: "Pendaftaran", type: "link", path: "/BF-PA/PP/PM/01" },
  { name: "Pra Daftar", type: "link", path: "/BF-PA/PP/PD" },
  { name: "Maklumat Terperinci", type: "current", path: `/BF-PA/PP/PD/detail/${route.params.rujukan || "PA-2024-009"}` },
]);

/** ========= MOCK DATA (mengikut senarai yang diminta) =========
 *  PA-2024-009 | Ismail bin Hassan | 870625098765 | Komuniti | Penolong Amil Komuniti | Masjid Al-Amin
 */
const application = ref({
  // Ringkasan/Status
  rujukan: route.params.rujukan || "PA-2024-009",
  statusAkhir: "Draf",           // Status akhir pendaftaran
  statusLantikan: "Menunggu",    // Status perkhidmatan

  // Maklumat Peribadi
  nama: "Ismail bin Hassan",
  jenisPengenalan: "MyKAD",
  noKP: "870625098765",
  tarikhLahir: "1987-06-25",     // dari IC 870625
  jantina: "Lelaki",
  tarafPerkahwinan: "Berkahwin",
  warganegara: "Warganegara",

  // Maklumat Untuk Dihubungi
  email: "ismail.hassan@email.com",
  noTelefon: "0127789901",
  alamat1: "No. 12, Jalan Semenyih",
  alamat2: "Taman Kajang Jaya",
  alamat3: "",
  daerah: "Hulu Langat",
  bandar: "Kajang",
  poskod: "43000",
  negeri: "Selangor",

  // Maklumat Pendaftaran
  kategoriPenolongAmil: "Komuniti",
  jawatan: "Penolong Amil Komuniti",
  institusiKariah: "Masjid Al-Amin",
  tarikhPendaftaran: "2024-02-10",
  sesiPerkhidmatan: "Sesi 1",

  // Maklumat Perkhidmatan
  tarikhLantikan: "", // belum dilantik

  // Maklumat Bank
  namaBank: "Bank Islam Malaysia Berhad",
  noAkaunBank: "123456789012",
  swiftcode: "BIMBMYKL",
  namaPemegangAkaun: "Ismail bin Hassan",

  // Maklumat Waris
  namaWaris: "Siti Aminah binti Ali",
  hubunganWaris: "Isteri",
  telefonWaris: "0123456780",
});

/** Umur dikira dari tarikh lahir */
const umur = computed(() => {
  try {
    const dob = new Date(application.value.tarikhLahir);
    if (Number.isNaN(dob.getTime())) return "-";
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  } catch {
    return "-";
  }
});

const alamatPenuh = computed(() => {
  const parts = [
    application.value.alamat1,
    application.value.alamat2,
    application.value.alamat3,
  ].filter(Boolean).map(s => s.trim()).filter(s => s.length > 0);
  return parts.join(', ');
});

/** Util: format tarikh ke DD-MM-YYYY */
const pad2 = (n) => String(n).padStart(2, "0");
const formatDate = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${pad2(d.getDate())}-${pad2(d.getMonth() + 1)}-${d.getFullYear()}`;
};

/** Badge variants */
const getStatusPendaftaranVariant = (status) => {
  const map = {
    Draf: "disabled",
    Dihantar: "warning",
    "Telah Disaring": "info",
    "Telah Disemak": "info",
    "Telah Disokong": "success",
    "Telah Disahkan": "success",
    "Telah Diluluskan": "success",
    Ditolak: "danger",
  };
  return map[status] || "secondary";
};

const getStatusLantikanVariant = (status) => {
  const map = {
    Menunggu: "warning",
    Dilantik: "info",
    Aktif: "success",
    "Tidak Aktif": "secondary",
    Ditamatkan: "danger",
  };
  return map[status] || "secondary";
};

/** Boleh edit? */
const canEdit = computed(() => {
  return currentRole.value === "pyb" && ["Draf", "Dihantar"].includes(application.value.statusAkhir);
});

/** Actions */
const handleBack = () => navigateTo("/BF-PA/PP/PD");
const handleEdit = () => navigateTo(`/BF-PA/PP/PD/edit/${application.value.rujukan}`);
const handleViewPendaftaran = () => navigateTo(`/BF-PA/PP/PD/detail-pendaftaran/${application.value.rujukan}`);
const handleViewPerkhidmatan = () => navigateTo(`/BF-PA/PP/PD/detail-perkhidmatan/${application.value.rujukan}`);
const handleViewProcessTrace = () => navigateTo(`/BF-PA/PP/PD/process-trace/${application.value.rujukan}`);
</script>

<style scoped>
/* Custom styles for RTMF compliance (optional) */
</style>
