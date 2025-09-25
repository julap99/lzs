<!-- 
  RTMF SCREEN: PA-PP-PD-03_02
  PURPOSE: PT Review Detail - Paparan Terperinci Semakan Dokumen
  DESCRIPTION: Detailed PT review view for document verification
  ROUTE: /BF-PA/PP/PD/PT/detail/[rujukan]
-->
<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb :items="breadcrumb" />

    <section class="mt-4 space-y-6">
      <!-- Header (seragam dengan page ketua divisyen) -->
      <header class="flex flex-wrap items-center justify-between gap-4">
        <div class="space-y-1">
          <h1 class="text-2xl font-semibold text-slate-900">Semakan Pegawai Tadbir</h1>
          <p class="text-sm text-slate-500">Maklumat terperinci semakan dokumen dan kelayakan.</p>
        </div>
        <rs-button variant="ghost" class="flex items-center gap-2" @click="handleBack">
          <Icon name="ph:arrow-left" class="h-4 w-4" />
          Kembali
        </rs-button>
      </header>

      <!-- Status Ringkas (seragam) -->
      <div class="rounded-lg border border-slate-200 bg-white p-4">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="space-y-1">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Status Permohonan</p>
            <h2 class="text-base font-semibold text-slate-900">Rujukan: {{ application.rujukan }}</h2>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <rs-badge :variant="getStatusPendaftaranVariant(application.statusPendaftaran)">
              {{ getLocalizedStatus(application.statusPendaftaran) }}
            </rs-badge>
            <!-- kekalkan guna reviewData.statusSemakan seperti kod asal -->
            <rs-badge :variant="getReviewStatusVariant(reviewData.statusSemakan)">
              {{ reviewData.statusSemakan }}
            </rs-badge>
          </div>
        </div>
      </div>

      <!-- Grid dua kolum (kiri kandungan, kanan sejarah sticky) -->
      <div class="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
        <!-- Kolum kiri -->
        <div class="space-y-5">
          <!-- Info sections (v-for seragam) -->
          <article
            v-for="section in infoSections"
            :key="section.title"
            class="space-y-4 rounded-lg border border-slate-200 bg-white p-4"
          >
            <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-600">{{ section.title }}</h3>
            <div class="space-y-2">
              <div
                v-for="field in section.fields"
                :key="field.label"
                class="grid grid-cols-[160px_minmax(0,1fr)] items-baseline gap-2 text-sm"
              >
                <span class="text-slate-500">{{ field.label }}</span>
                <span class="font-medium text-slate-900">{{ field.value || "-" }}</span>
              </div>
            </div>
          </article>

          <!-- Dokumen Sokongan (seragam) -->
          <article
            v-if="documentList.length"
            class="space-y-3 rounded-lg border border-slate-200 bg-white p-4"
          >
            <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-600">Dokumen Sokongan</h3>
            <ul class="space-y-3">
              <li
                v-for="doc in documentList"
                :key="doc.key"
                class="rounded-md border border-slate-200/70 p-3"
              >
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <div class="min-w-0">
                    <p class="truncate text-sm font-medium text-slate-900">{{ doc.title }}</p>
                    <p class="truncate text-xs text-slate-500">{{ doc.filename }}</p>
                  </div>
                  <rs-button
                    size="sm"
                    variant="ghost"
                    class="flex items-center gap-2"
                    @click="previewDocument(doc.key)"
                  >
                    <Icon name="ph:eye" class="h-4 w-4" />
                    Lihat
                  </rs-button>
                </div>
                <p class="mt-2 text-xs text-slate-400">{{ doc.meta }}</p>
              </li>
            </ul>
          </article>

          <!-- Borang Keputusan (seragam sepenuhnya) -->
          <article class="rounded-lg border border-slate-200 bg-white p-4 space-y-6">
            <header class="flex flex-wrap items-start justify-between gap-3">
              <div class="space-y-1">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Keputusan Semakan</p>
                <h3 class="text-base font-semibold text-slate-900">Semakan Pegawai Tadbir</h3>
              </div>
              <div class="flex items-center gap-3">
                <rs-badge
                  v-if="reviewForm.statusReview"
                  :variant="getReviewStatusVariant(reviewForm.statusReview)"
                  class="text-xs"
                >
                  {{ reviewForm.statusReview }}
                </rs-badge>
                <div class="text-right text-xs text-slate-400">
                  <p class="text-[10px] uppercase tracking-wider">Tarikh</p>
                  <p class="font-medium text-slate-600">{{ currentDate }}</p>
                </div>
              </div>
            </header>

            <div class="grid gap-6 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)]">
              <!-- Pilihan Keputusan (butang pilihan gaya kad) -->
              <section class="space-y-3">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Pilihan Keputusan</p>
                <div class="grid gap-3">
                  <!-- Lengkap -->
                  <button
                    type="button"
                    class="group flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-200"
                    :class="reviewForm.statusReview === 'Lengkap'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'"
                    @click="reviewForm.statusReview = 'Lengkap'"
                  >
                    <span class="flex min-w-0 items-center gap-3">
                      <span
                        class="flex h-9 w-9 items-center justify-center rounded-full border transition"
                        :class="reviewForm.statusReview === 'Lengkap'
                          ? 'border-emerald-500 bg-emerald-100 text-emerald-600'
                          : 'border-slate-200 bg-white text-slate-400'"
                      >
                        <Icon name="ph:check-circle" class="h-4 w-4" />
                      </span>
                      <span class="min-w-0">
                        <span class="block font-semibold text-slate-900 group-hover:text-slate-900">Lengkap</span>
                      </span>
                    </span>
                    <Icon v-if="reviewForm.statusReview === 'Lengkap'" name="ph:check" class="h-4 w-4 text-emerald-500" />
                  </button>

                  <!-- Tidak Lengkap -->
                  <button
                    type="button"
                    class="group flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-200"
                    :class="reviewForm.statusReview === 'Tidak Lengkap'
                      ? 'border-rose-500 bg-rose-50 text-rose-600 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'"
                    @click="reviewForm.statusReview = 'Tidak Lengkap'"
                  >
                    <span class="flex min-w-0 items-center gap-3">
                      <span
                        class="flex h-9 w-9 items-center justify-center rounded-full border transition"
                        :class="reviewForm.statusReview === 'Tidak Lengkap'
                          ? 'border-rose-500 bg-rose-100 text-rose-600'
                          : 'border-slate-200 bg-white text-slate-400'"
                      >
                        <Icon name="ph:x-circle" class="h-4 w-4" />
                      </span>
                      <span class="min-w-0">
                        <span class="block font-semibold text-slate-900 group-hover:text-slate-900">Tidak Lengkap</span>
                      </span>
                    </span>
                    <Icon v-if="reviewForm.statusReview === 'Tidak Lengkap'" name="ph:check" class="h-4 w-4 text-rose-500" />
                  </button>
                </div>
              </section>

              <!-- Catatan (seragam) -->
              <section class="space-y-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <div class="flex items-start justify-between gap-3">
                  <div class="space-y-1">
                    <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Catatan Semakan</p>
                  </div>
                </div>
                <FormKit
                  type="textarea"
                  name="catatanReview"
                  rows="4"
                  placeholder="Sila berikan catatan semakan anda..."
                  validation="required"
                  :validation-messages="{ required: 'Catatan semakan diperlukan' }"
                  v-model="reviewForm.catatanReview"
                  :classes="{
                    input: 'w-full resize-none rounded-lg border border-transparent bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 placeholder:text-slate-400'
                  }"
                />
              </section>
            </div>

            <!-- Dokumen Tambahan (seragam) -->
            <section class="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-4 text-xs text-slate-500">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div class="space-y-1">
                  <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Dokumen Tambahan <span class="font-normal text-slate-400">(Opsyenal)</span>
                  </p>
                </div>
                <div class="flex items-center gap-3">
                  <button
                    type="button"
                    class="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition hover:border-emerald-400 hover:text-emerald-600"
                    @click="openFilePicker"
                  >
                    <Icon name="ph:paperclip" class="h-4 w-4" />
                    <span>Muat naik</span>
                  </button>
                  <span v-if="reviewForm.additionalDocuments && reviewForm.additionalDocuments.length" class="text-[11px] text-slate-400">
                    {{ reviewForm.additionalDocuments.length }} fail dipilih
                  </span>
                </div>
              </div>
              <input
                ref="supportingInput"
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                class="hidden"
                @change="handleSupportingFiles"
              />
            </section>

            <!-- Actions (seragam) -->
            <footer class="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 pt-4">
              <rs-button type="button" variant="ghost" @click="handleBack" :disabled="isSubmitting">Batal</rs-button>
              <rs-button
                type="button"
                variant="primary"
                :disabled="isSubmitting"
                @click="showConfirmationModal = true"
                class="flex items-center gap-2"
              >
                <Icon v-if="isSubmitting" name="ph:spinner" class="h-4 w-4 animate-spin" />
                <span>{{ isSubmitting ? 'Menghantar...' : 'Hantar Keputusan' }}</span>
              </rs-button>
            </footer>
          </article>
        </div>

        <!-- Kolum kanan: card sejarah sticky (PDSejarahSemakan) -->
        <div class="space-y-5">
          <PDSejarahSemakan
            class="lg:sticky lg:top-24 rounded-lg border border-slate-200 bg-white p-4"
            :items="sejarahSemakan"
            @preview="previewDocument"
          />
        </div>
      </div>
    </section>

    <!-- Confirmation Modal (seragam) -->
    <rs-modal v-model="showConfirmationModal" title="Sahkan Keputusan" size="md">
      <template #body>
        <div class="space-y-4 text-center">
          <Icon name="ph:warning-circle" class="mx-auto h-12 w-12 text-amber-500" />
          <div class="space-y-2">
            <h3 class="text-lg font-semibold text-slate-900">Adakah anda pasti?</h3>
            <p class="text-sm text-slate-500">
              Anda akan menghantar keputusan semakan PT untuk permohonan ini. Tindakan ini tidak boleh dibatalkan.
            </p>
          </div>
          <div class="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
            Keputusan: {{ reviewForm.statusReview || 'Belum dipilih' }}
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button variant="ghost" @click="showConfirmationModal = false">Batal</rs-button>
          <rs-button variant="primary" @click="confirmSubmit" :loading="isSubmitting" class="flex items-center gap-2">
            <Icon name="ph:check" class="h-4 w-4" />
            Ya, Hantar Keputusan
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import PDSejarahSemakan from "@/components/PDSejarahSemakan.vue";

const route = useRoute();
const { $swal } = useNuxtApp();

definePageMeta({
  title: "Semakan PT - Maklumat Terperinci",
  description: "Paparan terperinci semakan PT",
});

/* Breadcrumb kekal */
const breadcrumb = ref([
  { name: "Penolong Amil", type: "link", path: "/BF-PA/PP/PM/01" },
  { name: "Pendaftaran", type: "link", path: "/BF-PA/PP/PM/01" },
  { name: "Pra Daftar", type: "link", path: "/BF-PA/PP/PD" },
  { name: "PT", type: "link", path: "/BF-PA/PP/PD" },
  { name: "Maklumat Terperinci", type: "current", path: `/BF-PA/PP/PD/PT/detail/${route.params.rujukan}` },
]);

/* ====== STATE / LOGIK ASAL – TIADA PERUBAHAN ====== */
const reviewForm = ref({
  statusReview: "",
  tarikhReview: "",
  disemakOleh: "",
  catatanReview: "",
  additionalDocuments: null,
});
const isSubmitting = ref(false);
const showConfirmationModal = ref(false);

const currentUser = ref({
  name: "Mohd Ali bin Hassan",
  role: "Pegawai Tadbir",
  id: "PT001",
  department: "Bahagian Pentadbiran"
});

const currentDate = ref(new Date().toLocaleDateString('ms-MY'));

/* Validation asal dibiar longgar mengikut fail input */
const isFormValid = computed(() => true);

/* Mock application data asal */
const application = ref({
  rujukan: route.params.rujukan,
  noKP: "901231012345",
  nama: "Ahmad bin Abdullah",
  jantina: "Lelaki",
  bangsa: "Melayu",
  agama: "Islam",
  emel: "ahmad.abdullah@email.com",
  telefon: "0123456789",
  alamatRumah: "No. 123, Jalan Utama, Taman Seri Indah",
  poskod: "50000",
  bandar: "Kuala Lumpur",
  negeri: "Kuala Lumpur",
  kategoriPenolongAmil: "Fitrah",
  jawatan: "Penolong Amil Fitrah",
  institusiKariah: "Masjid Wilayah Persekutuan",
  sesiPerkhidmatan: "Sesi 1",
  statusPendaftaran: "Disaring",
  statusLantikan: "Menunggu",
  salinanKadPengenalan: "salinan_kp_ahmad.pdf",
  suratSokongan: "surat_sokongan_ahmad.pdf",
  dokumenLain: null,
  uploadDate: "15-03-2024",
  timeline: [
    { action: "Permohonan Dihantar", date: "15-03-2024 10:30", notes: "Permohonan berjaya dihantar untuk semakan" },
    { action: "Dokumen Disemak",  date: "16-03-2024 14:15", notes: "Semua dokumen lengkap dan sah" },
    { action: "Saringan Selesai", date: "17-03-2024 09:00", notes: "Saringan telah diselesaikan oleh Jabatan Pengurusan Risiko" },
    { action: "Menunggu Semakan PT", date: "18-03-2024 11:30", notes: "Permohonan dalam proses semakan PT" }
  ]
});

/* Mock review data asal */
const reviewData = ref({
  statusSemakan: "Dalam Proses", // kekal guna 'statusSemakan' untuk badge atas
  tarikhReview: "",
  disemakOleh: "",
  catatanReview: "",
});

/* ====== SUSUN ATUR / DATA PAPARAN (REKA LETAK SAHAJA) ====== */
const infoSections = computed(() => [
  {
    title: "Maklumat Peribadi",
    fields: [
      { label: "Nombor Kad Pengenalan", value: application.value.noKP },
      { label: "Nama Penuh", value: application.value.nama },
      { label: "Jantina", value: application.value.jantina },
      { label: "Bangsa", value: application.value.bangsa },
      { label: "Agama", value: application.value.agama },
      { label: "Alamat Emel", value: application.value.emel },
      { label: "Nombor Telefon", value: application.value.telefon },
    ],
  },
  {
    title: "Maklumat Alamat",
    fields: [
      { label: "Alamat Rumah", value: application.value.alamatRumah },
      { label: "Poskod", value: application.value.poskod },
      { label: "Bandar", value: application.value.bandar },
      { label: "Negeri", value: application.value.negeri },
    ],
  },
  {
    title: "Maklumat Perkhidmatan",
    fields: [
      { label: "Kategori Penolong Amil", value: application.value.kategoriPenolongAmil },
      { label: "Jawatan", value: application.value.jawatan },
      { label: "Institusi/Kariah", value: application.value.institusiKariah },
      { label: "Sesi Perkhidmatan", value: application.value.sesiPerkhidmatan },
    ],
  },
]);

const documentList = computed(() => {
  const baseMeta = `Dimuat naik oleh ${application.value.nama} | Kemaskini: ${application.value.uploadDate}`;
  return [
    { key: "salinanKadPengenalan", title: "Salinan Kad Pengenalan", filename: application.value.salinanKadPengenalan, meta: baseMeta, show: !!application.value.salinanKadPengenalan },
    { key: "suratSokongan", title: "Surat Sokongan", filename: application.value.suratSokongan, meta: baseMeta, show: !!application.value.suratSokongan },
    { key: "dokumenLain", title: "Dokumen Lain", filename: application.value.dokumenLain, meta: baseMeta, show: !!application.value.dokumenLain },
  ].filter(d => d.show);
});

/* Sidebar sejarah (untuk PDSejarahSemakan – sama corak seperti page ketua divisyen) */
const sejarahSemakan = computed(() => [
  {
    role: "PIC",
    nama: "Ahmad Abdullah",
    tarikh: "15-01-2024 10:30",
    tindakan: "Pendaftaran",
    status: "Selesai",
    catatan: "Calon berjaya didaftarkan dengan maklumat lengkap",
    dokumen: [],
  },
  {
    role: "Jabatan Pengurusan Risiko",
    nama: "Siti Fatimah binti Omar",
    tarikh: "20-01-2024 14:15",
    tindakan: "Saringan Risiko",
    status: "Selesai",
    catatan: "Calon lulus saringan risiko. Tiada rekod jenayah atau masalah kewangan",
    dokumen: [],
  },
  {
    role: "Pegawai Tadbir",
    nama: currentUser.value.name,
    tarikh: currentDate.value,
    tindakan: "Semakan Dokumen",
    status: "Dalam Proses",
    catatan: "Menunggu keputusan semakan",
    dokumen: [],
  },
]);

/* ====== HELPERS (KEKAL) ====== */
const getStepVariant = (step) => {
  const stepStatus = {
    'registration': 'bg-green-100 text-green-800 border-2 border-green-300',
    'screening': 'bg-green-100 text-green-800 border-2 border-green-300',
    'review': 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
  };
  return stepStatus[step] || 'bg-gray-100 text-gray-400 border-2 border-gray-200';
};

const getStepLineVariant = (step) => {
  const lineStatus = {
    'registration': 'bg-green-300',
    'screening': 'bg-green-300',
    'review': 'bg-yellow-300'
  };
  return lineStatus[step] || 'bg-gray-200';
};

const getStatusPendaftaranVariant = (status) => {
  const statusVariants = {
    Draft: "disabled",
    Draf: "disabled",
    Submitted: "warning",
    Dihantar: "warning",
    // Pending uniform
    "Belum Disaring": "warning",
    "Menunggu Semakan": "warning",
    "Menunggu Sokongan": "warning",
    "Menunggu Pengesahan": "warning",
    "Menunggu Kelulusan": "warning",
    // Completed (Telah ...)
    Disaring: "secondary",
    "Disemak PT": "secondary",
    "Disokong Eksekutif": "secondary",
    "Disahkan Jabatan": "secondary",
    "Telah Disaring": "secondary",
    "Telah Disemak": "secondary",
    "Telah Disokong": "secondary",
    "Telah Disahkan": "secondary",
    // Final approvals
    "Telah Diluluskan": "primary",
    Diluluskan: "primary",
    // Rejected
    Ditolak: "danger",
    Rejected: "danger",
  };
  return statusVariants[status] || "secondary";
};

const getReviewStatusVariant = (status) => {
  const statusVariants = {
    "Dalam Proses": "warning",
    Lulus: "success",
    "Tidak Lulus": "danger",
  };
  return statusVariants[status] || "secondary";
};

const getLocalizedStatus = (status) => {
  const statusMap = {
    Submitted: 'Dihantar',
    Draft: 'Draf',
    Dihantar: 'Dihantar',
    'Belum Disaring': 'Belum Disaring',
    'Menunggu Semakan': 'Menunggu Semakan',
    'Menunggu Sokongan': 'Menunggu Sokongan',
    'Menunggu Pengesahan': 'Menunggu Pengesahan',
    'Menunggu Kelulusan': 'Menunggu Kelulusan',
    'Telah Disaring': 'Telah Disaring',
    'Telah Disemak': 'Telah Disemak',
    'Telah Disokong': 'Telah Disokong',
    'Telah Disahkan': 'Telah Disahkan',
    'Telah Diluluskan': 'Telah Diluluskan',
    Diluluskan: 'Diluluskan',
    Ditolak: 'Ditolak',
  };
  return statusMap[status] || status;
};

/* ====== ACTIONS (KEKAL TANPA UBAH LOGIK) ====== */
const handleBack = () => {
  navigateTo("/BF-PA/PP/PD");
};

const confirmSubmit = async () => {
  showConfirmationModal.value = false;
  await handleSubmit();
};

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;

    // Update review data
    reviewData.value = {
      ...reviewData.value,
      ...reviewForm.value,
      statusReview: reviewForm.value.statusReview,
      tarikhReview: reviewForm.value.tarikhReview,
      disemakOleh: reviewForm.value.disemakOleh,
    };

    alert(`Berjaya! Keputusan semakan PT berjaya dihantar. Status: ${reviewForm.value.statusReview}`);
    navigateTo("/BF-PA/PP/PD");
  } catch (error) {
    alert("Ralat! Ralat berlaku semasa menghantar semakan PT");
  } finally {
    isSubmitting.value = false;
  }
};

const openFilePicker = () => {
  if (supportingInput.value) supportingInput.value.click();
};

const supportingInput = ref(null);

const handleSupportingFiles = (e) => {
  const files = Array.from(e?.target?.files || []);
  reviewForm.value.additionalDocuments = files;
  if (e?.target) e.target.value = '';
};

const previewDocument = (documentType) => {
  alert(`Melihat dokumen: ${documentType}`);
};

/* Init (kekal) */
onMounted(() => {
  reviewForm.value.tarikhReview = new Date().toISOString().split('T')[0];
  reviewForm.value.disemakOleh = currentUser.value.name;
  console.log("Loading PT review details for:", route.params.rujukan);
});
</script>

<style scoped>
/* Fokus input seragam seperti halaman ketua divisyen */
.formkit-input:focus {
  border-color: #10b981; /* emerald-500 */
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.12);
}
</style>
