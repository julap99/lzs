<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <h1 class="text-2xl font-bold mb-6 flex items-center gap-2">
      <Icon name="ph:notebook" class="w-6 h-6 text-primary" />
      Pengurusan Kandungan Dokumen
    </h1>

    <rs-card>
      <template #header>
        <h3 class="text-lg font-semibold">Senarai Dokumen</h3>
      </template>
      <template #body>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th class="px-3 py-2 text-left">Dokumen</th>
                <!-- Jenis removed -->
                <th class="px-3 py-2 text-left">Versi</th>
                <th class="px-3 py-2 text-left">Status</th>
                <th class="px-3 py-2 text-left">Tarikh Paparan</th>
                <th class="px-3 py-2 text-left">Tindakan</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-100 text-sm text-slate-700">
              <tr v-for="doc in documents" :key="doc.key">
                <td class="px-3 py-2 font-medium flex items-center gap-2">
                  <Icon :name="doc.icon || 'ph:file-text'" class="w-5 h-5 text-primary" />
                  {{ doc.title }}
                </td>
                <!-- Jenis cell removed -->
                <td class="px-3 py-2">{{ doc.version }}</td>
                <td class="px-3 py-2">
                  <rs-chip :variant="statusVariant(doc.status)" size="sm">{{ doc.status }}</rs-chip>
                </td>
                <td class="px-3 py-2">{{ formatDate(doc.date) }}</td>
                <td class="px-3 py-2 flex gap-1">
                  <rs-button size="sm" variant="ghost" @click="openView(doc)">
                    <Icon name="ph:eye" class="w-4 h-4" /> Lihat
                  </rs-button>
                  <rs-button size="sm" variant="ghost" @click="openEdit(doc)">
                    <Icon name="ph:pencil" class="w-4 h-4" /> Kemaskini
                  </rs-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </rs-card>

    <!-- VIEW MODAL -->
    <rs-modal v-model="showViewModal" :title="selectedDoc?.title || 'Paparan Dokumen'" size="xl">
      <template #default>
        <div v-if="selectedDoc" class="max-h-[70vh] overflow-y-auto pr-2">
          <div class="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-3 text-xs text-slate-600">
            <div><span class="font-semibold">Versi:</span> {{ selectedDoc.version }}</div>
            <div><span class="font-semibold">Status:</span> {{ selectedDoc.status }}</div>
            <div><span class="font-semibold">Tarikh Paparan:</span> {{ formatDate(selectedDoc.date) }}</div>
          </div>

          <template v-if="selectedDoc.type==='surat'">
            <article class="prose prose-slate max-w-none" v-html="selectedDoc.content"></article>
          </template>

          <template v-else-if="selectedDoc.type==='kad'">
            <div class="space-y-3">
              <div v-if="selectedDoc.design?.previewType==='image'" class="flex justify-center">
                <img :src="selectedDoc.design.url" class="max-h-[70vh] rounded border" alt="Kad Tauliah" />
              </div>
              <div v-else-if="selectedDoc.design?.previewType==='pdf'" class="text-center">
                <a :href="selectedDoc.design.url" target="_blank" class="text-primary underline">Buka fail PDF (tab baharu)</a>
              </div>
              <div v-else class="text-slate-500 text-center">Tiada fail design dimuat naik.</div>
              <div class="text-xs text-slate-500" v-if="selectedDoc.design?.name">
                <strong>Fail:</strong> {{ selectedDoc.design.name }} ({{ selectedDoc.design.type }}, {{ humanSize(selectedDoc.design.size) }})
              </div>
            </div>
          </template>

          <template v-else>
            <article class="prose prose-slate max-w-none" v-html="selectedDoc.content"></article>
          </template>
        </div>
      </template>
      <template #footer>
        <rs-button variant="primary" @click="showViewModal=false">Tutup</rs-button>
      </template>
    </rs-modal>

    <!-- EDIT MODAL -->
    <rs-modal v-model="showEditModal" :title="selectedDoc?.title || 'Kemaskini Dokumen'" size="xl">
      <template #default>
        <div v-if="selectedDoc" class="max-h-[70vh] overflow-y-auto pr-2">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <FormKit type="text" label="Versi" v-model="form.version" validation="required" />
            <FormKit type="select" label="Status" v-model="form.status" :options="statusOptions" />
            <FormKit type="date" label="Tarikh Paparan" v-model="form.date" validation="required" />
          </div>

          <!-- SURAT -->
          <div v-if="selectedDoc.type==='surat'" class="mt-5 space-y-4">
            <rs-alert variant="info" class="text-sm">
              Header &amp; footer dikunci. Sila edit kandungan surat (body) sahaja.
            </rs-alert>

            <div class="rounded border bg-slate-50 p-3 text-sm">
              <div class="font-semibold">Header (tidak boleh ubah)</div>
              <div class="mt-2 text-slate-600">
                <div><strong>Rujukan:</strong> {{ form.surat.rujukan }}</div>
                <div><strong>Tarikh:</strong> {{ formatDate(form.surat.tarikhM) }} | {{ form.surat.tarikhH }}</div>
                <div class="mt-2 leading-5">
                  <div class="font-semibold">{{ form.surat.nama }}</div>
                  <div style="white-space:pre-line">{{ form.surat.alamat }}</div>
                </div>
              </div>
            </div>

            <label class="block font-semibold">Kandungan (Body)</label>
            <div class="h-[420px] rounded border border-slate-200">
              <QuillEditor
                v-model:content="form.surat.body"
                content-type="html"
                theme="snow"
                :toolbar="quillToolbar"
                class="ql-clean"
                style="height:100%;"
              />
            </div>

            <div class="rounded border bg-slate-50 p-3 text-sm">
              <div class="font-semibold">Footer (tidak boleh ubah)</div>
              <div class="mt-2 text-slate-600">
                <div class="font-semibold">“MENERAJU PERUBAHAN”</div>
                <div class="mt-2">Yang benar,</div>
                <div><strong>PEMEGANG AMANAH</strong> — LEMBAGA ZAKAT SELANGOR (MAIS), BERDAFTAR</div>
                <div class="mt-1">
                  <strong>MD YUSMIZAN BIN YUSUF</strong><br />
                  Timbalan Ketua Divisyen Operasi Agihan Asnaf
                </div>
              </div>
            </div>
          </div>

          <!-- KAD TAULIAH -->
          <div v-else-if="selectedDoc.type==='kad'" class="mt-5 space-y-3">
            <rs-alert variant="info" class="text-sm">
              Muat naik <strong>PDF / JPG / PNG</strong> design kad. Sistem akan simpan pautan dan metadata; kandungan tidak diedit di sini.
            </rs-alert>
            <FormKit
              type="file"
              label="Fail Design (PDF/JPG/PNG)"
              accept=".pdf,image/*"
              @change="onDesignChange"
            />
            <div class="rounded border p-3" v-if="form.kad.previewUrl">
              <div class="text-sm font-semibold mb-2">Pratonton</div>
              <div v-if="form.kad.previewType==='image'" class="flex justify-center">
                <img :src="form.kad.previewUrl" class="max-h-[60vh] rounded border" alt="Preview Kad" />
              </div>
              <div v-else class="text-sm">
                Fail PDF dimuat naik. <a :href="form.kad.previewUrl" target="_blank" class="text-primary underline">Klik untuk buka.</a>
              </div>
              <div class="mt-2 text-xs text-slate-500">
                <strong>Fail:</strong> {{ form.kad.fileName }} ({{ form.kad.fileType }}, {{ humanSize(form.kad.fileSize) }})
              </div>
            </div>
          </div>

          <!-- TERMA / PDPA -->
          <div v-else class="mt-5">
            <label class="block font-semibold mb-1">Kandungan</label>
            <div class="h-[420px] rounded border border-slate-200">
              <QuillEditor
                v-model:content="form.content"
                content-type="html"
                theme="snow"
                :toolbar="quillToolbar"
                class="ql-clean"
                style="height:100%;"
              />
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <rs-button variant="ghost" @click="showEditModal=false">Batal</rs-button>
        <rs-button variant="primary" @click="saveEdit">
          <Icon name="ph:floppy-disk" class="w-4 h-4" /> Simpan
        </rs-button>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useToast } from "vue-toastification";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

const toast = useToast();

const breadcrumb = [
  { name: "Laman Utama", path: "/" },
  { name: "Modul BF-PA", path: "/BF-PA" },
  { name: "Konfigurasi", path: "/BF-PA/KF" },
  { name: "Kandungan Dokumen", path: null },
];

const statusOptions = [
  { label: "AKTIF", value: "AKTIF" },
  { label: "TIDAK AKTIF", value: "TIDAK AKTIF" },
];

const quillToolbar = [
  [{ header: [2, 3, false] }],
  ["bold", "italic", "underline"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ align: [] }],
  ["link"],
  ["clean"],
];

const documents = ref([
  {
    key: "suratTawaran",
    type: "surat",
    title: "Surat Tawaran",
    version: "V3.0",
    status: "AKTIF",
    date: "2025-06-01",
    surat: {
      rujukan: "LZS/DOAA/JPPA/T/600/PELANTIKAN PA Bil (413/2025)",
      tarikhM: "2025-06-06",
      tarikhH: "09 Zulhijjah 1446H",
      nama: "WAN JABARUDIN BIN WAN HASSAN",
      alamat: "No.8, Jalan Gp 3/4\nTaman Gombak Permai\n68100 Batu Caves\nSELANGOR DARUL EHSAN.",
      body: `
<p>Tuan,</p>
<p><strong>PELANTIKAN SEBAGAI KETUA PENOLONG AMIL KARIAH LEMBAGA ZAKAT SELANGOR (MAIS) SESI 2025</strong></p>
<p>Semoga surat ini menemui tuan dalam kemanisan iman serta mendapat keberkatan dan kerahmatan daripada Allah S.W.T., In Shaa Allah.</p>
<ol>
<li>LZS bersetuju melantik pihak tuan sebagaimana dinyatakan dalam Butiran Pelantikan. Terma &amp; Syarat Umum dan Panduan Pengurusan dilampirkan. Surat ini menjadi kontrak mengikat sah di antara LZS dan pihak tuan.</li>
<li>Pihak tuan dikehendaki mengembalikan <strong>Borang Setuju Terima</strong> dalam <strong>14</strong> hari bekerja; tiada jawapan dalam <strong>30</strong> hari dianggap tidak berminat.</li>
<li>Harap tuan menjalankan tugas dengan amanah serta mematuhi terma &amp; syarat LZS.</li>
<li>Pertanyaan: <strong>1-300-88-4343</strong>.</li>
</ol>
<p>Sekian.</p>
`
    },
    content: ""
  },
  {
    key: "kadTauliah",
    type: "kad",
    title: "Kad Tauliah",
    version: "V1.8",
    status: "AKTIF",
    date: "2025-06-15",
    design: null,
    content: ""
  },
  {
    key: "terma",
    type: "html",
    title: "Terma & Syarat",
    version: "V2.4",
    status: "AKTIF",
    date: "2025-07-01",
    content: `
      <h2>TERMA &amp; SYARAT UMUM PELANTIKAN PENOLONG AMIL</h2>
      <p>(Ringkasan/isi kandungan… boleh diedit)</p>
    `
  },
  {
    key: "pdpa",
    type: "html",
    title: "PDPA",
    version: "V1.5",
    status: "AKTIF",
    date: "2025-08-01",
    content: `
      <h2>NOTIS PERSETUJUAN PDPA</h2>
      <p>Saya memberikan persetujuan secara nyata (explicit consent)…</p>
    `
  },
]);

const nl2br = (t = "") => t.replace(/\n/g, "<br>");
const buildSuratHTML = (s) => `
  <section style="font-size:15px; line-height:1.6">
    <div>
      <p style="margin:.25rem 0;"><strong>Rujukan:</strong> ${s.rujukan || "-"}</p>
      <p style="margin:.25rem 0;"><strong>Tarikh:</strong> ${s.tarikhM ? new Date(s.tarikhM).toLocaleDateString("ms-MY") : "-"} &nbsp;|&nbsp; ${s.tarikhH || "-"}</p>
      <hr style="margin:1rem 0;border:none;border-top:1px solid #e5e7eb;">
      <address style="font-style:normal; line-height:1.45; margin-bottom:1rem;">
        <strong>${s.nama || "-"}</strong><br>${nl2br(s.alamat || "")}
      </address>
    </div>
    <div>${s.body || ""}</div>
    <div style="margin-top:1rem;">
      <p style="font-weight:600;">“MENERAJU PERUBAHAN”</p>
      <p>Yang benar,</p>
      <p><strong>PEMEGANG AMANAH</strong> <br/>LEMBAGA ZAKAT SELANGOR (MAIS), BERDAFTAR</p>
      <p><strong>MD YUSMIZAN BIN YUSUF</strong><br/>Timbalan Ketua Divisyen Operasi Agihan Asnaf</p>
    </div>
  </section>
`;

const showEditModal = ref(false);
const showViewModal = ref(false);
const selectedDoc = ref(null);

const form = reactive({
  version: "",
  status: "",
  date: "",
  content: "",
  surat: { rujukan: "", tarikhM: "", tarikhH: "", nama: "", alamat: "", body: "" },
  kad: { previewUrl: "", previewType: "", fileName: "", fileType: "", fileSize: 0 }
});

const openView = (doc) => {
  selectedDoc.value = doc;
  if (doc.type === "surat") doc.content = buildSuratHTML(doc.surat);
  showViewModal.value = true;
};

const openEdit = (doc) => {
  selectedDoc.value = doc;
  form.version = doc.version;
  form.status = doc.status;
  form.date = doc.date;

  if (doc.type === "surat") {
    form.surat = { ...doc.surat };
    form.content = buildSuratHTML(form.surat);
  } else if (doc.type === "kad") {
    form.kad.previewUrl = doc.design?.url || "";
    form.kad.previewType = doc.design?.previewType || "";
    form.kad.fileName = doc.design?.name || "";
    form.kad.fileType = doc.design?.type || "";
    form.kad.fileSize = doc.design?.size || 0;
  } else {
    form.content = doc.content;
  }
  showEditModal.value = true;
};

const onDesignChange = (e) => {
  const file = e?.target?.files?.[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  const isPdf = file.type === "application/pdf";
  form.kad.previewUrl = url;
  form.kad.previewType = isPdf ? "pdf" : "image";
  form.kad.fileName = file.name;
  form.kad.fileType = file.type;
  form.kad.fileSize = file.size;
};

const saveEdit = () => {
  if (!selectedDoc.value) return;
  const idx = documents.value.findIndex((d) => d.key === selectedDoc.value.key);
  if (idx === -1) return;

  const doc = { ...documents.value[idx] };
  doc.version = form.version;
  doc.status = form.status;
  doc.date = form.date;

  if (doc.type === "surat") {
    doc.surat = { ...form.surat };
    doc.content = buildSuratHTML(doc.surat);
  } else if (doc.type === "kad") {
    if (form.kad.previewUrl) {
      doc.design = {
        url: form.kad.previewUrl,
        name: form.kad.fileName,
        type: form.kad.fileType,
        size: form.kad.fileSize,
        previewType: form.kad.previewType
      };
    }
  } else {
    doc.content = form.content;
  }

  documents.value.splice(idx, 1, doc);
  toast.success(`${doc.title} berjaya dikemaskini.`);
  showEditModal.value = false;
};

const formatDate = (v) =>
  v ? new Date(v).toLocaleDateString("ms-MY", { day: "2-digit", month: "short", year: "numeric" }) : "-";

const statusVariant = (s) => (s === "AKTIF" ? "success" : s === "TIDAK AKTIF" ? "danger" : "info");

const humanSize = (n = 0) => (n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1048576).toFixed(1)} MB`);

documents.value.forEach((d) => {
  if (d.type === "surat") d.content = buildSuratHTML(d.surat);
});
</script>

<style scoped>
.ql-clean .ql-editor { font-size: 0.95rem; line-height: 1.6; padding: .75rem 1rem; }
.ql-clean .ql-editor p { margin: .5rem 0; }
.ql-clean .ql-editor h2 { font-size: 1.125rem; margin: .75rem 0 .5rem; }
.ql-clean .ql-editor h3 { font-size: 1rem; margin: .75rem 0 .5rem; }
.ql-clean .ql-editor ol, .ql-clean .ql-editor ul { padding-left: 1.25rem; }
.prose :where(h2){ margin-top:0; }
</style>
