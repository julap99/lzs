<!-- 
  RTMF SCREEN: PA-PP-PD-05_02
  PURPOSE: Department Head Confirmation Detail - Paparan Terperinci Pengesahan
  DESCRIPTION: Detailed department head confirmation view for candidate approval
  ROUTE: /BF-PA/PP/PD/ketua-jabatan/detail/[rujukan]
-->
<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb :items="breadcrumb" />

    <section class="mt-4 space-y-6">
      <header class="flex flex-wrap items-center justify-between gap-4">
        <div class="space-y-1">
          <h1 class="text-2xl font-semibold text-slate-900">Pengesahan Ketua Jabatan</h1>
          <p class="text-sm text-slate-500">Maklumat terperinci permohonan penolong amil.</p>
        </div>
        <rs-button variant="ghost" class="flex items-center gap-2" @click="handleBack">
          <Icon name="ph:arrow-left" class="h-4 w-4" />
          Kembali
        </rs-button>
      </header>

      <!-- Status Ringkas -->
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
            <rs-badge :variant="getConfirmationStatusVariant(confirmationData.statusPengesahan)">
              {{ confirmationData.statusPengesahan || "Belum bermula" }}
            </rs-badge>
          </div>
        </div>
      </div>

      <div class="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
        <!-- Kiri: Info + Dokumen + Borang Keputusan -->
        <div class="space-y-5">
          <!-- Seksyen Maklumat -->
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

          <!-- Dokumen Sokongan -->
          <article v-if="documentList.length" class="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
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

          <!-- Borang Keputusan Pengesahan -->
          <article class="rounded-lg border border-slate-200 bg-white p-4 space-y-6">
            <header class="flex flex-wrap items-start justify-between gap-3">
              <div class="space-y-1">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Keputusan Pengesahan</p>
                <h3 class="text-base font-semibold text-slate-900">Pengesahan Ketua Jabatan</h3>
              </div>
              <div class="flex items-center gap-3">
                <rs-badge
                  v-if="confirmationForm.statusPengesahan"
                  :variant="getConfirmationStatusVariant(confirmationForm.statusPengesahan)"
                  class="text-xs"
                >
                  {{ confirmationForm.statusPengesahan }}
                </rs-badge>
                <div class="text-right text-xs text-slate-400">
                  <p class="text-[10px] uppercase tracking-wider">Tarikh</p>
                  <p class="font-medium text-slate-600">{{ displayDate(confirmationForm.tarikhPengesahan) || currentDateDisplay }}</p>
                </div>
              </div>
            </header>

            <div class="grid gap-6 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)]">
              <!-- Pilihan Keputusan -->
              <section aria-labelledby="keputusan" role="radiogroup" class="space-y-3">
                <p id="keputusan" class="text-xs font-semibold uppercase tracking-wide text-slate-500">Pilihan Keputusan</p>
                <div class="grid gap-3">
                  <label
                    v-for="option in decisionOptions"
                    :key="option.value"
                    class="group flex w-full cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-200"
                    :class="confirmationForm.statusPengesahan === option.value
                      ? option.activeClass
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'"
                  >
                    <input
                      class="sr-only"
                      type="radio"
                      name="statusPengesahan"
                      :value="option.value"
                      v-model="confirmationForm.statusPengesahan"
                      :aria-checked="confirmationForm.statusPengesahan === option.value"
                    />
                    <span class="flex min-w-0 items-center gap-3">
                      <span
                        class="flex h-9 w-9 items-center justify-center rounded-full border transition"
                        :class="confirmationForm.statusPengesahan === option.value
                          ? option.iconClass
                          : 'border-slate-200 bg-white text-slate-400'"
                        aria-hidden="true"
                      >
                        <Icon :name="option.icon" class="h-4 w-4" />
                      </span>
                      <span class="min-w-0">
                        <span class="block font-semibold text-slate-900 group-hover:text-slate-900">{{ option.label }}</span>
                      </span>
                    </span>
                    <Icon v-if="confirmationForm.statusPengesahan === option.value" name="ph:check" class="h-4 w-4 text-emerald-500" />
                  </label>
                </div>
              </section>

              <!-- Catatan -->
              <section class="space-y-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <div class="flex items-start justify-between gap-3">
                  <div class="space-y-1">
                    <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Catatan Pengesahan</p>
                  </div>
                  <span class="text-[11px] text-slate-400">{{ (confirmationForm.catatanPengesahan && confirmationForm.catatanPengesahan.length) || 0 }}/200</span>
                </div>
                <FormKit
                  type="textarea"
                  rows="4"
                  maxlength="200"
                  name="catatanPengesahan"
                  placeholder="Contoh: Maklumat telah disahkan dan lengkap."
                  :validation="confirmationForm.statusPengesahan === 'Tidak Sah' ? 'required' : ''"
                  :validation-messages="{ required: 'Catatan diperlukan apabila status Tidak Sah' }"
                  v-model.trim="confirmationForm.catatanPengesahan"
                  :classes="{
                    input: 'w-full resize-none rounded-lg border border-transparent bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 placeholder:text-slate-400'
                  }"
                />
              </section>
            </div>

            <!-- Dokumen Tambahan -->
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
                  <span v-if="confirmationForm.additionalDocuments.length" class="text-[11px] text-slate-400">
                    {{ confirmationForm.additionalDocuments.length }} fail dipilih
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
              <ul v-if="confirmationForm.additionalDocuments.length" class="mt-3 space-y-2">
                <li
                  v-for="(f, i) in confirmationForm.additionalDocuments"
                  :key="i"
                  class="flex items-center justify-between rounded border px-3 py-2 text-xs bg-white"
                >
                  <span class="truncate">{{ f.name }}</span>
                  <button type="button" class="text-slate-500 hover:text-rose-600" @click="removeSupportingFile(i)">Buang</button>
                </li>
              </ul>
            </section>

            <!-- Butang Hantar -->
            <footer class="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 pt-4">
              <rs-button type="button" variant="ghost" @click="handleBack" :disabled="isSubmitting">Batal</rs-button>
              <rs-button
                type="button"
                variant="primary"
                :disabled="isSubmitting || !confirmationForm.statusPengesahan || (confirmationForm.statusPengesahan === 'Tidak Sah' && !confirmationForm.catatanPengesahan)"
                @click="showConfirmationModal = true"
                class="flex items-center gap-2"
              >
                <Icon v-if="isSubmitting" name="ph:spinner" class="h-4 w-4 animate-spin" />
                <span>{{ isSubmitting ? 'Menghantar...' : 'Hantar Keputusan' }}</span>
              </rs-button>
            </footer>
          </article>
        </div>

        <!-- Kanan: Sejarah Semakan (sticky) -->
        <div class="space-y-5">
          <PDSejarahSemakan
            class="lg:sticky lg:top-24 rounded-lg border border-slate-200 bg-white p-4"
            :items="(sejarahSemakan) || []"
            @preview="previewDocument"
          />
        </div>
      </div>
    </section>

    <!-- Confirmation Modal -->
    <rs-modal v-model="showConfirmationModal" title="Sahkan Keputusan" size="md">
      <template #body>
        <div class="space-y-4 text-center">
          <Icon name="ph:warning-circle" class="mx-auto h-12 w-12 text-amber-500" />
          <div class="space-y-2">
            <h3 class="text-lg font-semibold text-slate-900">Adakah anda pasti?</h3>
            <p class="text-sm text-slate-500">
              Anda akan menghantar keputusan pengesahan jabatan untuk permohonan ini. Tindakan ini tidak boleh dibatalkan.
            </p>
          </div>
          <div class="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
            Keputusan: {{ confirmationForm.statusPengesahan || "Belum dipilih" }}
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

    <!-- Success Modal -->
    <rs-modal v-model="showSuccessModal" title="Pengesahan Berjaya" size="sm">
      <template #body>
        <div class="space-y-4 text-center">
          <Icon name="ph:check-circle" class="mx-auto h-12 w-12 text-emerald-500" />
          <div class="space-y-2">
            <h3 class="text-lg font-semibold text-slate-900">Pengesahan Ketua Jabatan Berjaya</h3>
            <p class="text-sm text-slate-500">
              Keputusan pengesahan anda telah berjaya dihantar dan direkodkan dalam sistem.
            </p>
          </div>
          <div class="space-y-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            <p><strong>Status:</strong> {{ confirmationForm.statusPengesahan }}</p>
            <p><strong>Tarikh:</strong> {{ displayDate(confirmationForm.tarikhPengesahan) }}</p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button variant="primary" @click="handleSuccessConfirm">Kembali ke Senarai</rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Error Modal -->
    <rs-modal v-model="showErrorModal" title="Ralat" size="sm">
      <template #body>
        <div class="space-y-4 text-center">
          <Icon name="ph:warning" class="mx-auto h-12 w-12 text-rose-500" />
          <div class="space-y-2">
            <h3 class="text-lg font-semibold text-slate-900">Ralat Semasa Menghantar</h3>
            <p class="text-sm text-slate-500">{{ errorMessage }}</p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button variant="ghost" @click="showErrorModal = false">Tutup</rs-button>
          <rs-button variant="primary" @click="retrySubmission">Cuba Lagi</rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import PDSejarahSemakan from "@/components/PDSejarahSemakan.vue";

const route = useRoute();

definePageMeta({
  title: "Pengesahan Ketua Jabatan - Maklumat Terperinci",
  description: "Paparan terperinci pengesahan ketua jabatan",
});

// Breadcrumb diseragamkan
const breadcrumb = ref([
  { name: "Penolong Amil", type: "link", path: "/BF-PA/PP/PD" },
  { name: "Pendaftaran", type: "link", path: "/BF-PA/PP/PD" },
  { name: "Pra Daftar", type: "link", path: "/BF-PA/PP/PD" },
  { name: "Ketua Jabatan", type: "link", path: "/BF-PA/PP/PD" },
  { name: "Maklumat Terperinci", type: "current", path: `/BF-PA/PP/PD/ketua-jabatan/detail/${route.params.rujukan}` },
]);

// Helper tarikh
const fmtIso = (d = new Date()) => new Date(d).toISOString();
const displayDate = (d) => {
  if (!d) return "";
  return new Intl.DateTimeFormat("ms-MY", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(d));
};
const currentDateDisplay = displayDate(new Date());

// Pengguna semasa (mock)
const currentUser = ref({
  name: "Prof. Dr. Ismail bin Ahmad",
  role: "Ketua Jabatan",
  id: "KJ001",
  department: "Jabatan Pentadbiran",
});

// Data borang
const confirmationForm = ref({
  statusPengesahan: "",
  tarikhPengesahan: "",
  disahkanOleh: "",
  catatanPengesahan: "",
  additionalDocuments: [],
});

// State UI
const isSubmitting = ref(false);
const showConfirmationModal = ref(false);
const showSuccessModal = ref(false);
const showErrorModal = ref(false);
const errorMessage = ref("");
const supportingInput = ref(null);

// Data permohonan (mock ikut RTMF)
const application = ref({
  rujukan: route.params.rujukan,
  noKP: "870625098765",
  nama: "Ismail bin Hassan",
  jantina: "Lelaki",
  bangsa: "Melayu",
  agama: "Islam",
  emel: "ismail.hassan@email.com",
  telefon: "0127789901",
  alamatRumah: "No. 12, Jalan Semenyih, Taman Kajang Jaya",
  poskod: "43000",
  bandar: "Kajang",
  negeri: "Selangor",
  kategoriPenolongAmil: "Komuniti",
  jawatan: "Penolong Amil Komuniti",
  institusiKariah: "Masjid Al-Amin",
  sesiPerkhidmatan: "Sesi 1",
  statusPendaftaran: "Dihantar",
  statusLantikan: "Menunggu",
  salinanKadPengenalan: "salinan_kp_ismail.pdf",
  suratSokongan: "surat_sokongan_ismail.pdf",
  dokumenLain: null,
  uploadDate: "12-01-2024",
});

// Status semasa pengesahan
const confirmationData = ref({
  statusPengesahan: "Dalam Proses",
  tarikhPengesahan: "",
  disahkanOleh: "",
  catatanPengesahan: "",
});

// Senarai info (dua-kolum)
const infoSections = computed(() => [
  {
    title: "Maklumat Peribadi",
    fields: [
      { label: "ID Pengenalan", value: application.value.noKP },
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
      { label: "Status Lantikan", value: application.value.statusLantikan },
    ],
  },
]);

// Dokumen
const documentList = computed(() => {
  const baseMeta = `Dimuat naik oleh ${application.value.nama} | Kemaskini: ${application.value.uploadDate}`;
  return [
    { key: "salinanKadPengenalan", title: "Salinan Kad Pengenalan", filename: application.value.salinanKadPengenalan, meta: baseMeta, show: !!application.value.salinanKadPengenalan },
    { key: "suratSokongan", title: "Surat Sokongan", filename: application.value.suratSokongan, meta: baseMeta, show: !!application.value.suratSokongan },
    { key: "dokumenLain", title: "Dokumen Lain", filename: application.value.dokumenLain, meta: baseMeta, show: !!application.value.dokumenLain },
  ].filter(d => d.show);
});

// Pilihan keputusan pengesahan
const decisionOptions = [
  {
    value: "Sah",
    label: "Sah",
    icon: "ph:check-circle",
    activeClass: "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm",
    iconClass: "border-emerald-500 bg-emerald-100 text-emerald-600",
  },
  {
    value: "Tidak Sah",
    label: "Tidak Sah",
    icon: "ph:x-circle",
    activeClass: "border-rose-500 bg-rose-50 text-rose-600 shadow-sm",
    iconClass: "border-rose-500 bg-rose-100 text-rose-600",
  },
];

// Sejarah Semakan (gabung + status semasa KJ)
const sejarahSemakan = computed(() => ([
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
    role: "PT",
    nama: "Mohd Ali bin Hassan",
    tarikh: "25-01-2024 09:45",
    tindakan: "Semakan PT",
    status: "Selesai",
    catatan: "Dokumen lengkap dan memenuhi syarat. Disyorkan untuk sokongan eksekutif",
    dokumen: [],
  },
  {
    role: "Eksekutif",
    nama: "Dr. Aminah binti Abdullah",
    tarikh: "30-01-2024 11:20",
    tindakan: "Sokongan",
    status: "Selesai",
    catatan: "Calon layak dan disokong untuk pengesahan ketua jabatan",
    dokumen: [],
  },
  {
    role: "Ketua Jabatan",
    nama: currentUser.value.name,
    tarikh: currentDateDisplay,
    tindakan: "Pengesahan",
    status: "Dalam Proses",
    catatan: "Menunggu keputusan pengesahan",
    dokumen: [],
  },
]));

// Variants & localization
const getStatusPendaftaranVariant = (status) => {
  const statusVariants = {
    Draft: "disabled",
    Dihantar: "warning",
    "Dalam Semakan": "info",
    Disaring: "info",
    "Disemak PT": "info",
    "Disokong Eksekutif": "success",
    "Disahkan Jabatan": "success",
    "Diluluskan Divisyen": "success",
    Diluluskan: "success",
    Ditolak: "danger",
    Submitted: "warning",
    Pending: "info",
    Approved: "success",
    Rejected: "danger",
  };
  return statusVariants[status] || "secondary";
};
const getConfirmationStatusVariant = (status) => {
  const statusVariants = {
    "Belum bermula": "secondary",
    "Dalam Proses": "info",
    Sah: "success",
    "Tidak Sah": "danger",
  };
  return statusVariants[status] || "secondary";
};
const getLocalizedStatus = (status) => {
  const statusMap = {
    Submitted: "Dihantar",
    Pending: "Menunggu",
    Approved: "Diluluskan",
    Rejected: "Ditolak",
    Draft: "Draf",
    Dihantar: "Dihantar",
    "Dalam Semakan": "Dalam Semakan",
    Disaring: "Disaring",
    "Disemak PT": "Disemak PT",
    "Disokong Eksekutif": "Disokong Eksekutif",
    "Disahkan Jabatan": "Disahkan Jabatan",
    "Diluluskan Divisyen": "Diluluskan Divisyen",
    Diluluskan: "Diluluskan",
    Ditolak: "Ditolak",
  };
  return statusMap[status] || status;
};

// Navigasi
const handleBack = () => navigateTo("/BF-PA/PP/PD");

// Hantar keputusan
const confirmSubmit = async () => {
  showConfirmationModal.value = false;
  await handleSubmit();
};

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;

    const payload = {
      rujukan: application.value.rujukan,
      keputusan: confirmationForm.value.statusPengesahan,
      catatan: (confirmationForm.value.catatanPengesahan || "").trim(),
      tarikhPengesahan: fmtIso(),
      disahkanOleh: currentUser.value.id,
    };

    // Sediakan FormData untuk dokumen
    const formData = new FormData();
    formData.append("payload", JSON.stringify(payload));
    (confirmationForm.value.additionalDocuments || []).forEach((f, i) => {
      formData.append(`files[${i}]`, f, f.name);
    });

    // TODO: Panggil API sebenar
    // await $fetch('/api/pa/pradaftar/pengesahan-kj', { method: 'POST', body: formData });

    // Kemas kini state paparan
    confirmationData.value.statusPengesahan = payload.keputusan;
    confirmationData.value.tarikhPengesahan = payload.tarikhPengesahan;
    confirmationData.value.disahkanOleh = currentUser.value.name;
    confirmationData.value.catatanPengesahan = payload.catatan;

    // Selarikan status pendaftaran:
    // Jika "Sah" -> Disahkan Jabatan; jika "Tidak Sah" -> Ditolak
    application.value.statusPendaftaran = payload.keputusan === "Sah" ? "Disahkan Jabatan" : "Ditolak";

    // Tunjuk modal berjaya
    showSuccessModal.value = true;
  } catch (e) {
    errorMessage.value = (e && e.message) || "Ralat tidak diketahui.";
    showErrorModal.value = true;
  } finally {
    isSubmitting.value = false;
  }
};

const handleSuccessConfirm = () => {
  showSuccessModal.value = false;
  navigateTo("/BF-PA/PP/PD");
};

const retrySubmission = () => {
  showErrorModal.value = false;
  handleSubmit();
};

// Dokumen tambahan
const MAX_FILES = 5;
const MAX_SIZE_MB = 10;

const openFilePicker = () => supportingInput.value?.click();
const handleSupportingFiles = (event) => {
  const incoming = Array.from(event?.target?.files || []);
  const safe = [];
  for (const f of incoming) {
    if (f.size <= MAX_SIZE_MB * 1024 * 1024) {
      safe.push(f);
      if (safe.length >= MAX_FILES) break;
    }
  }
  confirmationForm.value.additionalDocuments = safe;
  if (event?.target) event.target.value = "";
};
const removeSupportingFile = (idx) => {
  confirmationForm.value.additionalDocuments.splice(idx, 1);
};

// Preview dokumen
const previewDocument = (documentType) => {
  try {
    const documentName = application.value[documentType];
    if (!documentName) throw new Error("Dokumen tidak ditemui");
    alert(`Melihat dokumen: ${documentName}`);
    // TODO: ganti dgn viewer modal/pdf
  } catch (err) {
    alert(`Ralat: ${err.message}`);
  }
};

onMounted(() => {
  confirmationForm.value.tarikhPengesahan = fmtIso();
  confirmationForm.value.disahkanOleh = currentUser.value.name;
  // Fetch sebenar boleh dibuat di sini berdasarkan route.params.rujukan
  console.log("Loading department head confirmation details for:", route.params.rujukan);
});
</script>

<style scoped>
.formkit-input:focus {
  border-color: #0f172a;
  box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.15);
}
.formkit-input.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.12);
}
</style>
