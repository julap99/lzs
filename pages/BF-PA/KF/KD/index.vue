<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <h1 class="text-2xl font-bold mb-6 flex items-center gap-2">
      <Icon name="ph:notebook" class="w-6 h-6 text-primary" />
      Pengurusan Kandungan Dokumen
    </h1>

    <rs-card>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Senarai Dokumen</h3>
          <rs-button variant="primary" @click="addNewDocument">
            <Icon name="ic:baseline-add-circle" class="mr-2" />
            Tambah Baru
          </rs-button>
        </div>
      </template>
      <template #body>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th class="px-3 py-2 text-left">Dokumen</th>
                <th class="px-3 py-2 text-left">Jenis</th>
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
                <td class="px-3 py-2">{{ labelJenis(doc.type) }}</td>
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
        <div v-if="selectedDoc" class="max-h-[75vh] overflow-y-auto pr-2">
          <!-- Meta bar -->
          <div class="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-3 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-3">
            <div class="flex gap-4">
              <div><span class="font-semibold">Versi:</span> {{ selectedDoc.version }}</div>
              <div><span class="font-semibold">Status:</span> {{ selectedDoc.status }}</div>
              <div><span class="font-semibold">Tarikh Paparan:</span> {{ formatDate(selectedDoc.date) }}</div>
            </div>
            <div class="flex items-center gap-2">
              <rs-button size="sm" variant="secondary" @click="copySuratHTML" title="Salin HTML">
                <Icon name="ph:copy" class="w-4 h-4" /> Salin
              </rs-button>
              <rs-button size="sm" variant="primary" @click="printSurat" title="Cetak">
                <Icon name="ph:printer" class="w-4 h-4" /> Cetak
              </rs-button>
            </div>
          </div>

          <!-- Paparan mengikut jenis -->
          <template v-if="selectedDoc.type==='surat'">
            <div class="doc-wrapper">
              <div class="doc-page print-area" ref="suratPreview">
                <div class="doc-body" v-html="selectedDoc.content"></div>
              </div>
            </div>
          </template>

          <!-- TERMA & SYARAT: format khas seperti PDF rujukan -->
          <template v-else-if="selectedDoc.type==='html' && isTermsDoc(selectedDoc)">
            <div class="ts-wrapper">
              <div class="ts-page">
                <header class="ts-header">
                  <div class="ts-logo">ZAKAT<br/>SELANGOR</div>
                  <div class="ts-head-text">
                    <div class="ts-head-title">TERMA DAN SYARAT UMUM</div>
                    <div class="ts-head-sub">PELANTIKAN PENOLONG AMIL</div>
                  </div>
                </header>
                <div class="ts-body" v-html="renderTermsContent(selectedDoc.content)"></div>
                <footer class="ts-footer">
                  <div class="ts-footer-bar"></div>
                  <div class="ts-footer-links">www.zakatselangor.com.my</div>
                </footer>
              </div>
            </div>
          </template>

          <template v-else-if="selectedDoc.type==='kad'">
            <div class="space-y-3">
              <!-- Multiple designs support -->
              <div v-if="Array.isArray(selectedDoc.designs) && selectedDoc.designs.length">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div v-for="(d, i) in selectedDoc.designs" :key="d.url || i" class="rounded border p-3">
                    <div class="text-sm font-semibold mb-2">Fail {{ i+1 }}</div>
                    <div v-if="d.previewType==='image'" class="flex justify-center">
                      <a :href="d.url" target="_blank" title="Buka imej">
                        <img :src="d.url" class="max-h-[40vh] rounded border" alt="Kad Tauliah" />
                      </a>
                    </div>
                    <div v-else class="text-sm">
                      Fail PDF dimuat naik. <a :href="d.url" target="_blank" class="text-primary underline">Klik untuk buka.</a>
                    </div>
                    <div class="mt-2 text-xs text-slate-500">
                      <strong>Fail:</strong> {{ d.name }} ({{ d.type }}, {{ humanSize(d.size) }})
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>
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

          <!-- SURAT: Header/Footer static; hanya body boleh edit -->
          <div v-if="selectedDoc.type==='surat'" class="mt-5 space-y-4">
            <rs-alert variant="info" class="text-sm">
              Header &amp; footer dikunci. Sila edit kandungan surat (body) sahaja.
            </rs-alert>

            <!-- Header (paparan sahaja) -->
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

            <!-- Editor Body -->
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

            <!-- Footer (paparan sahaja) -->
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

          <!-- KAD TAULIAH: upload fail sahaja -->
          <div v-else-if="selectedDoc.type==='kad'" class="mt-5 space-y-3">
            <rs-alert variant="info" class="text-sm">
              Muat naik <strong>PDF / JPG / PNG</strong> design kad. Sistem akan simpan pautan dan metadata; kandungan tidak diedit di sini.
            </rs-alert>
            <!-- Dropzone upload -->
            <div
              class="relative border border-dashed rounded-md px-3 py-4 text-center cursor-pointer select-none"
              :class="isDraggingDZ ? 'border-primary bg-primary/5' : 'border-slate-300'"
              @dragover.prevent="onDragOverDZ"
              @dragleave.prevent="onDragLeaveDZ"
              @drop.prevent="onDropDZ"
              @click="triggerDesignPicker"
              aria-label="Muat naik fail design"
            >
              <input ref="designInput" type="file" class="hidden" multiple accept=".pdf,image/*" @change="onDesignSelected" />
              <div class="flex flex-col items-center justify-center gap-1">
                <Icon name="ic:baseline-cloud-upload" class="text-gray-400" size="20" />
                <p class="text-xs text-gray-700">Muat naik fail design</p>
                <p class="text-[11px] text-gray-500">PDF, JPG, PNG</p>
              </div>
            </div>
            <div class="rounded border p-3" v-if="form.kad.previewUrl || (form.kad.files && form.kad.files.length)">
              <div class="text-sm font-semibold mb-2">Pratonton</div>
              <div v-if="form.kad.previewType==='image'" class="flex justify-center mb-3">
                <img :src="form.kad.previewUrl" class="max-h-[40vh] rounded border" alt="Preview Kad" />
              </div>
              <div v-else-if="form.kad.previewUrl" class="text-sm mb-3">
                Fail PDF dimuat naik. <a :href="form.kad.previewUrl" target="_blank" class="text-primary underline">Klik untuk buka.</a>
              </div>
              <ul class="text-xs text-slate-600 divide-y">
                <li v-for="(f,idx) in form.kad.files" :key="f.url" class="py-1 flex items-center justify-between gap-2">
                  <span class="truncate">{{ f.name }} ({{ humanSize(f.size) }})</span>
                  <button class="text-red-600 hover:text-red-700" @click.prevent="removeDesign(idx)">Buang</button>
                </li>
              </ul>
            </div>
          </div>

          <!-- Lain-lain (Terma/PDPA): editor biasa + pratonton terma -->
          <div v-else class="mt-5 space-y-4">
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
            <!-- Pratonton berformat untuk Terma -->
            <div v-if="isTermsDoc(selectedDoc)" class="ts-wrapper">
              <div class="ts-page">
                <header class="ts-header">
                  <div class="ts-logo">ZAKAT<br/>SELANGOR</div>
                  <div class="ts-head-text">
                    <div class="ts-head-title">TERMA DAN SYARAT UMUM</div>
                    <div class="ts-head-sub">PELANTIKAN PENOLONG AMIL</div>
                  </div>
                </header>
                <div class="ts-body" v-html="renderTermsContent(form.content)"></div>
                <footer class="ts-footer">
                  <div class="ts-footer-bar"></div>
                  <div class="ts-footer-links">www.zakatselangor.com.my</div>
                </footer>
              </div>
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

/* ---------------------
   MOCK DATA
   --------------------- */
const documents = ref([
  // SURAT (header/footer kekal; body editable)
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
      // Body di-init ikut format asal (boleh diedit)
      body: `
<p>Tuan,</p>
<p><strong>PELANTIKAN SEBAGAI KETUA PENOLONG AMIL KARIAH LEMBAGA ZAKAT SELANGOR (MAIS) SESI 2025</strong></p>
<p>Semoga surat ini menemui tuan dalam kemanisan iman serta mendapat keberkatan dan kerahmatan daripada Allah S.W.T., In Shaa Allah.</p>
<ol>
<li>Sukacita dimaklumkan bahawa LZS bersetuju melantik pihak tuan sebagai Ketua Penolong Amil Kariah sebagaimana dinyatakan dalam Butiran Pelantikan. Terma &amp; Syarat Umum dan Panduan Pengurusan dilampirkan. Surat ini menjadi kontrak mengikat sah di antara LZS dan pihak tuan.</li>
<li>Sekiranya pihak tuan bersetuju, pihak tuan dikehendaki mengisi dan mengembalikan <strong>Borang Setuju Terima</strong> dalam tempoh <strong>14</strong> hari bekerja dari tarikh penerimaan Surat Tawaran Pelantikan ini. LZS menganggap pihak tuan tidak berminat sekiranya tiada sebarang jawapan dalam <strong>30</strong> hari bekerja.</li>
<li>Segala kerjasama amat dihargai. Diharapkan pihak tuan dapat menjalankan tugas dengan amanah serta mematuhi terma-terma dan syarat-syarat yang ditetapkan oleh LZS.</li>
<li>Sebarang pertanyaan: <strong>1-300-88-4343</strong>.</li>
</ol>
<p>Sekian.</p>
`
    },
    content: "" // akan dijana daripada template header/body/footer
  },

  // KAD TAULIAH (upload file sahaja)
  {
    key: "kadTauliah",
    type: "kad",
    title: "Kad Tauliah",
    version: "V1.8",
    status: "AKTIF",
    date: "2025-06-15",
    design: null, // { url,name,type,size,previewType:'image'|'pdf' }
    content: ""   // tidak digunakan (papar design)
  },

  // TERMA (free editor)
  {
    key: "terma",
    type: "html",
    title: "Terma & Syarat",
    version: "V2.4",
    status: "AKTIF",
    date: "2025-07-01",
    content: `
      <h2>TERMA &amp; SYARAT UMUM PELANTIKAN PENOLONG AMIL</h2>
      <p>TERMA DAN SYARAT UMUM
PELANTIKAN PENOLONG AMIL
Ketua Penolong Amil Fitrah / Ketua Penolong Amil Kariah / Penolong Amil Fitrah / Penolong Amil
Kariah / Penolong Ami Padi, [selepas ini dirujuk secara umum sebagai Penolong Amil (“PA”)]
bersetuju untuk terikat dengan terma-terma dan syarat-syarat berikut :
1. Pelantikan sebagai PA
1.1 Pelantikan hendaklah bermula pada tarikh sebagaimana yang dinyatakan di
dalam Surat Tawaran Pelantikan.
1.2 PA hendaklah melaksanakan perkhidmatan sebagaimana ditetapkan dalam
Lampiran A Surat Tawaran Pelantikan sepanjang Tempoh Pelantikan (selepas
ini dirujuk sebagai “Perkhidmatan”).
2. Tanggungjawab Umum PA
2.1 PA hendaklah bertanggungjawab mematuhi dan melaksanakan tanggungjawab
sebagaimana berikut :
2.1.1 Melaksanakan Perkhidmatan selaras dengan Panduan berikut (yang
mana terpakai) :
(a) Panduan Pengurusan Penolong Amil Fitrah / Padi Menggunakan
Mobile Apps;
(b) Panduan Pengurusan Penolong Amil Fitrah; atau
(c) Panduan Pengurusan Penolong Amil Kariah.
2.1.2 WAJIB memakai kad tauliah semasa melaksanakan Perkhidmatan
sepanjang Tempoh Pelantikan.
2.1.3 Sekiranya PA dilantik untuk membuat kutipan zakat :
(a) TIDAK DIBENARKAN membuat kutipan zakat harta, qadha
zakat, sedekah, fidyah, wakaf dan tasfiyah (wang tak patuh
syariah) bagi pihak LZS walaupun terdapat permintaan
daripada pembayar zakat.
(b) TIDAK DIBENARKAN menyerahkan wang kutipan zakat ke
kaunter LZS atau kepada pegawai LZS.
(c) TIDAK DIBENARKAN membuat kutipan zakat di luar negeri
Selangor.
2.1.4 TIDAK DIBENARKAN menggunakan jawatan sebagai PA bagi tujuan
peribadi dan kepentingan diri sendiri sehingga menjejaskan tugas dan
tanggungjawab serta kredibiliti sebagai PA.
2.1.5 TIDAK DIBENARKAN membuat pernyataan awam secara lisan atau
bertulis sama ada melalui media massa, elektronik atau sosial yang boleh
menjejaskan imej agama Islam atau LZS.
2.1.6 Membenarkan LZS atau wakilnya yang sah untuk memeriksa rekod-rekod
berkaitan dengan Perkhidmatan bagi memastikan Perkhidmatan
dilaksanakan mengikut Terma dan Syarat Pelantikan.
2.1.7 Menghadiri apa-apa mesyuarat, taklimat, taklimat keselamatan, kursus,
latihan, program kompetensi atau aktiviti yang dianjurkan oleh LZS.
2.1.8 Menjaga nama baik LZS ketika melaksanakan tugas dan tanggungjawab
di bawah pelantikan ini dengan tidak melibatkan diri dalam sebarang
kegiatan yang boleh menjejaskan imej dan nama baik LZS.
2.1.9 PA hendaklah segera memaklumkan kepada LZS sekiranya PA
mendapat maklumat mengenai apa-apa salah laku, penyelewengan atau
pelanggaran mana-mana Terma dan Syarat Pelantikan yang dilakukan
oleh Ketua Penolong Amil Fitrah / Kariah.
2.1.10 Tanggungjawab Ketua Penolong Amil Fitrah / Kariah
(a) Ketua Penolong Amil Fitrah / Kariah hendaklah bertanggungjawab
memantau PA di bawah seliaannya.
(b) Ketua Penolong Amil Fitrah / Kariah hendaklah segera
memaklumkan kepada LZS sekiranya mendapat maklumat
berlakunya salah laku, penyelewengan atau pelanggaran manamana Terma dan Syarat Pelantikan Penolong Amil yang dilakukan
oleh PA di bawah seliaannya.
(c) Ketua Penolong Amil Fitrah / Kariah hendakah memaklumkan
kepada LZS sekiranya PA di bawah seliaannya meninggal dunia,
hilang upaya, cacat pancaindera, mengalami kemalangan atau
berpindah kariah masjid atau surau sepanjang Tempoh Pelantikan
ini berkuatkuasa. Bagi maksud subperenggan ini, Ketua Penolong
Amil Fitrah / Kariah hendaklah mengambil alih peranan dan
tanggungjawab PA tersebut apabila diarahkan oleh LZS.
3. Peranan dan Tanggungjawab LZS
3.1 Sebarang pembayaran upah / insentif oleh LZS kepada PA hendaklah tertakluk
kepada pematuhan Terma dan Syarat Pelantikan oleh PA.
3.2 LZS berhak untuk membuat semakan semula ke atas prestasi kerja PA sepanjang
Tempoh Pelantikan untuk diambil tindakan sewajarnya.
4. Kerahsiaan
4.1 PA hendaklah menjaga kerahsiaan data peribadi dan segala maklumat yang
diterima daripada Perkhidmatan ini dan maklumat tersebut hanya boleh
digunakan untuk tujuan pelaksanaan Perkhidmatan sahaja.
4.2 PA dikehendaki menjaga kerahsiaan sebarang maklumat dan data yang
diperolehi daripada pelantikan ini di mana maklumat serta data tersebut tidak
boleh disebarkan, diserahkan, dijual, dipindahmilik, dihasilkan semula,
diterbitkan, diedarkan, disalin, dipertunjukkan atau diubahsuai kepada manamana pihak lain tanpa terlebih dahulu mendapat kebenaran daripada LZS.
4.3 Tanggungjawab ini akan kekal mengikat PA dan LZS berhak mengambil tindakan
ke atas PA sekiranya PA melanggar tanggungjawab di bawah perenggan ini.
5. Perlindungan Data Peribadi
PA hendaklah tertakluk kepada peruntukan di bawah Akta Perlindungan Data Peribadi
2010 dengan melindungi dan menjaga kerahsiaan data peribadi dan segala maklumat
yang diterima daripada pelaksanaan Perkhidmatan ini.
6. Konflik Kepentingan
6.1 PA hendaklah pada setiap masa sepanjang Tempoh Pelantikan berkuatkuasa
memastikan bahawa PA tidak mempunyai sebarang konflik kepentingan dengan
mana-mana Pemegang Amanah LZS, warga kerja LZS atau pihak ketiga yang
boleh mendedahkan PA kepada konflik kepentingan peribadi atau apa-apa konflik
dengan kepentingan LZS.
6.2 Sekiranya PA mendapati terdapat konflik kepentingan, PA bertanggungjawab
mengisytiharkan secara terperinci kepada LZS.
7. Aku Janji
PA beraku janji untuk :
7.1 tidak cuba menawar atau memberi rasuah kepada mana-mana individu dalam LZS
atau individu lain sebagai sogokan untuk dipilih dalam pelantikan ini.
7.2 melaksanakan perkhidmatan dengan jujur dan tidak akan memberi atau
menawarkan rasuah sepanjang Tempoh Pelantikan atau selepas tamat Tempoh
Pelantikan untuk apa jua tujuan; atau
7.3 melaporkan kepada Suruhanjaya Pencegahan Rasuah Malaysia atau balai polis
berhampiran dengan serta merta, sekiranya terdapat mana-mana individu yang
cuba untuk memberi atau meminta rasuah daripada PA sebagai sogokan untuk
apa-apa tujuan.
8. Keselamatan Siber
PA hendaklah mengambil langkah-langkah yang munasabah dan bersesuaian bagi
memastikan keselamatan data dan maklumat LZS yang diperolehi daripada pelantikan
ini dilindungi daripada sebarang bentuk ancaman, pencerobohan, atau apa-apa
penyalahgunaan lain. PA hendaklah memaklumkan kepada LZS sekiranya terdapat
ancaman atau serangan siber atau kemungkinan berlakunya ancaman keselamatan siber
yang boleh menyebabkan kebocoran data atau maklumat LZS kepada pihak ketiga atau
menjejaskan perkhidmatan PA di bawah pelantikan ini.
9. Penamatan pelantikan
9.1 LZS berhak menamatkan pelantikan ini dengan memberikan suatu notis bertulis
tiga puluh (30) hari kepada PA.
9.2 PA boleh pada bila-bila masa memberi notis empat belas (14) hari kepada LZS
menyatakan hasrat untuk menamatkan pelantikan dengan alasan-alasan yang
munasabah. LZS boleh mempertimbangkan untuk menamatkan pelantikan
tersebut dengan mengeluarkan suatu notis penamatan kepada PA.
9.3 LZS berhak menamatkan pelantikan PA pada bila-bila masa dengan memberikan
notis tanpa menyatakan sebarang alasan sekiranya PA didapati :
(a) melanggar mana-mana terma atau syarat yang dinyatakan dalam Terma
dan Syarat Pelantikan ini;
(b) mengambil, memanipulasi atau menyalahgunakan mana-mana data atau
maklumat peribadi pembayar zakat atau asnaf untuk kepentingan peribadi
PA atau apa-apa tujuan selain yang dinyatakan dalam pelantikan ini;
(c) menjual atau menukar mana-mana Peralatan Mobile Apps;
(d) memalsukan maklumat berkaitan kutipan atau agihan zakat;
(e) apa-apa tindakan atau perlakuan yang menjejaskan imej LZS;
(f) disabitkan dengan mana-mana kesalahan jenayah sivil termasuk jenayah
syariah, sama ada sedang dalam siasatan atau telah disabitkan dengan
kesalahan jenayah sivil atau syariah; atau
(g) alasan lain sebagaimana dinyatakan dalam Panduan,
LZS boleh mengambil apa-apa tindakan yang difikirkan wajar ke atas PA
mengikut budi bicara LZS.
9.4 LZS berhak menamatkan pelantikan ini dengan memberi notis sekiranya PA
meninggal dunia, hilang upaya, cacat pancaindera atau berpindah daerah,
kawasan atau kariah masjid dalam Tempoh Pelantikan.
9.5 Bagi maksud perenggan 9, sekiranya terdapat kekosongan jawatan PA di dalam
daerah, kawasan dan kariah masjid yang berkenaan, maka pengganti kepada PA
tersebut hendaklah ditetapkan oleh LZS berdasarkan cadangan Jawatankuasa
Masjid.
10. Kesan penamatan
Sekiranya pelantikan ini ditamatkan, maka PA hendaklah melaksanakan perkara-perkara
seperti berikut :
(a) menamatkan segala tugas dan aktiviti sebagai PA dengan serta-merta;
(b) memulangkan segala dokumen berkaitan Perkhidmatan, kad tauliah termasuk
wang kutipan zakat (jika berkenaan) dalam tempoh tujuh (7) hari dari tarikh tamat
Tempoh Pelantikan atau tarikh penerimaan notis penamatan sebagaimana yang
dinyatakan dalam perenggan 9.
11. Pindaan
LZS berhak meminda, mengubah atau mengenepikan mana-mana terma atau syarat di
dalam Surat Tawaran Pelantikan serta Terma dan Syarat Pelantikan ini mengikut
keperluan semasa tanpa memerlukan persetujuan daripada PA. Sebarang pindaan,
perubahan atau pengenepian ke atas mana-mana Terma dan Syarat Pelantikan ini akan
dimaklumkan kepada PA.
12. Arahan LZS
LZS boleh dari semasa ke semasa memberi arahan kepada PA bagi perkara yang
berkaitan dengan tugas dan tanggungjawab PA di bawah pelantikan ini.
PENOLONG AMIL DIKEHENDAKI MEMATUHI SEGALA TERMA-TERMA DAN SYARATSYARAT PERUNTUKAN DI ATAS.
Sekiranya pihak tuan bersetuju dengan terma-terma dan syarat-syarat tawaran di atas maka sila
nyatakan persetujuan pihak tuan dengan menandatangani BORANG SETUJU TERIMA yang
dilampirkan bersama-sama.
LEMBAGA ZAKAT SELANGOR
Menara Zakat Sultan Idris Shah, No.1 Persiaran Bandar Raya, Seksyen 14, 40000 Shah Alam, Selangor Darul Ehsan
Tel: 03-8314 2222 Faks: 03-8314 2233/2244 http://www.zakatselangor.com.my Talian Zakat Selangor: 1-300-88-4343</p>
    `
  },

  // PDPA (free editor)
  {
    key: "pdpa",
    type: "html",
    title: "PDPA",
    version: "V1.5",
    status: "AKTIF",
    date: "2025-08-01",
    content: `
      <h2>NOTIS PERSETUJUAN PDPA</h2>
      <p>Saya dengan ini bersetuju memberi persetujuan secara nyata (explicit consent) kepada Lembaga Zakat Selangor untuk mengumpul, memproses, menggunakan data peribadi saya bagi tujuan pentadbiran, kajian, dakwah, promosi dan aktiviti-aktiviti lain berkaitan fungsi Zakat Selangor seperti yang dinyatakan di dalam Notis Privasi Zakat Selangor di www.zakatselangor.com.my
Saya mengesahkan bahawa segala maklumat dan data yang diberikan adalah BENAR, TEPAT, LENGKAP dan TERKINI. Saya faham dan bersetuju sekiranya saya memberi maklumat palsu dan tidak benar, pihak Lembaga Zakat Selangor berhak mengambil tindakan ke atas saya.</p>
    `
  },
]);

/* ---------------------
   BUILDERS
   --------------------- */
const nl2br = (t = "") => t.replace(/\n/g, "<br>");
// Trim empty paragraphs and normalize spacing coming from editor
function cleanBodyHtml(html = "") {
  let out = String(html);
  // remove empty paragraph lines
  out = out.replace(/<p>\s*(?:<br\s*\/>|&nbsp;|\s)*<\/p>/gi, "");
  // collapse multiple consecutive empty lines
  out = out.replace(/(\s*<p>\s*<\/p>\s*){2,}/gi, "<p></p>");
  return out.trim();
}

const buildSuratHTML = (s) => {
  const tarikhM = s.tarikhM ? new Date(s.tarikhM).toLocaleDateString("ms-MY", { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-';
  const sesi = s.tarikhM ? new Date(s.tarikhM).getFullYear() : '';
  return `
  <div class=\"lt-letter\">
    <header class=\"lt-header\">
      <div class=\"lt-header-left\">
        <div class=\"lt-logo\">ZAKAT<br/>SELANGOR</div>
      </div>
      <div class=\"lt-header-right\">
        <div class=\"lt-org\">Lembaga Zakat Selangor (MAIS)</div>
        <div class=\"lt-address\">No. 78 Jalan SS 21/58 Damansara Utama, 47400 Petaling Jaya, Selangor.</div>
        <div class=\"lt-address\">Telefon: 1-300-88-4343 | Faks: 03-8314 2231/2234</div>
      </div>
    </header>

    <div class=\"lt-meta\">
      <div><span class=\"lt-meta-label\">Rujukan kami</span><span class=\"lt-meta-sep\">:</span><span>${s.rujukan || '-'}</span></div>
      <div><span class=\"lt-meta-label\">Tarikh</span><span class=\"lt-meta-sep\">:</span><span>${tarikhM} | ${s.tarikhH || '-'}</span></div>
    </div>

    <div class=\"lt-bismillah\">?????? ?? ??????????? ??????????</div>

    <address class=\"lt-recipient\">
      <strong>${s.nama || '-'}</strong><br/>${nl2br(s.alamat || '')}
    </address>

    <p class=\"lt-salute\">Tuan,</p>

    <h2 class=\"lt-title\">SURAT TAWARAN PELANTIKAN</h2>
    <h3 class=\"lt-subject\">PELANTIKAN SEBAGAI KETUA PENOLONG AMIL KARIAH LEMBAGA ZAKAT SELANGOR (MAIS) SESI ${sesi || ''}</h3>

    <div class=\"lt-body\">${cleanBodyHtml(s.body) || ''}</div>

    <div class=\"lt-closing\">
      <p class=\"lt-tagline\">\"MENERAJU PERUBAHAN\"</p>
      <p>Yang benar,</p>
      <p><strong>PEMEGANG AMANAH</strong><br/>LEMBAGA ZAKAT SELANGOR (MAIS), BERDAFTAR</p>
      <p class=\"lt-signer\"><strong>MD YUSMIZAN BIN YUSUF</strong><br/>Timbalan Ketua Divisyen Operasi Agihan Asnaf</p>
    </div>

    <footer class=\"lt-footer\">
      <div class=\"lt-footer-bar\"></div>
      <div class=\"lt-footer-links\">www.zakatselangor.com.my</div>
    </footer>
  </div>`;
};

/* ---------------------
   STATE MODAL
   --------------------- */
const showEditModal = ref(false);
const showViewModal = ref(false);
const selectedDoc = ref(null);

const form = reactive({
  version: "",
  status: "",
  date: "",
  content: "",
  surat: {
    rujukan: "",
    tarikhM: "",
    tarikhH: "",
    nama: "",
    alamat: "",
    body: ""
  },
    kad: {
      previewUrl: "",
      previewType: "",
      fileName: "",
      fileType: "",
      fileSize: 0,
      files: []
    }
  });

/* ---------------------
   ACTIONS
   --------------------- */
const openView = (doc) => {
  selectedDoc.value = doc;
  // pastikan surat sudah dirender
  if (doc.type === "surat") {
    doc.content = buildSuratHTML(doc.surat);
  }
  showViewModal.value = true;
};

const openEdit = (doc) => {
  selectedDoc.value = doc;
  form.version = doc.version;
  form.status = doc.status;
  form.date = doc.date;

  if (doc.type === "surat") {
    form.surat = { ...doc.surat };        // clone data
    form.content = buildSuratHTML(form.surat); // (untuk rujukan, tidak dipapar)
  } else if (doc.type === "kad") {
    // hydrate from designs array if exists, else single design
    const designs = Array.isArray(doc.designs) ? doc.designs : (doc.design ? [doc.design] : []);
    form.kad.files = designs.map(d => ({ url: d.url, name: d.name, type: d.type, size: d.size, previewType: d.previewType }));
    const first = form.kad.files[0] || {};
    form.kad.previewUrl = first.url || "";
    form.kad.previewType = first.previewType || "";
    form.kad.fileName = first.name || "";
    form.kad.fileType = first.type || "";
    form.kad.fileSize = first.size || 0;
  } else {
    form.content = doc.content;
  }
  showEditModal.value = true;
};

function addDesignFiles(fileList = []) {
  const files = Array.from(fileList || []);
  if (!files.length) return;
  files.forEach((file) => {
    const url = URL.createObjectURL(file);
    const isPdf = file.type === 'application/pdf';
    form.kad.files.push({ url, name: file.name, type: file.type, size: file.size, previewType: isPdf ? 'pdf' : 'image' });
  });
  const first = form.kad.files[0];
  if (first) {
    form.kad.previewUrl = first.url;
    form.kad.previewType = first.previewType;
    form.kad.fileName = first.name;
    form.kad.fileType = first.type;
    form.kad.fileSize = first.size;
  }
}

const onDesignChange = (e) => {
  const files = e?.target?.files;
  if (!files || !files.length) return;
  addDesignFiles(files);
};

// Dropzone helpers (Kad Tauliah)
const designInput = ref(null);
const isDraggingDZ = ref(false);
function triggerDesignPicker() { if (designInput.value) designInput.value.click(); }
function onDesignSelected(e) { onDesignChange(e); if (designInput.value) designInput.value.value = ''; }
function onDragOverDZ() { isDraggingDZ.value = true; }
function onDragLeaveDZ() { isDraggingDZ.value = false; }
function onDropDZ(e) {
  isDraggingDZ.value = false;
  const list = e?.dataTransfer?.files;
  if (!list || !list.length) return;
  addDesignFiles(list);
}

function removeDesign(idx) {
  const f = form.kad.files[idx];
  if (f?.url) {
    try { URL.revokeObjectURL(f.url); } catch {}
  }
  form.kad.files.splice(idx, 1);
  const first = form.kad.files[0];
  if (first) {
    form.kad.previewUrl = first.url;
    form.kad.previewType = first.previewType;
    form.kad.fileName = first.name;
    form.kad.fileType = first.type;
    form.kad.fileSize = first.size;
  } else {
    form.kad.previewUrl = '';
    form.kad.previewType = '';
    form.kad.fileName = '';
    form.kad.fileType = '';
    form.kad.fileSize = 0;
  }
}

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
    // Simpan semua fail sebagai designs; kekalkan doc.design untuk kompat lama
    if (form.kad.files && form.kad.files.length) {
      doc.designs = form.kad.files.map(f => ({ url: f.url, name: f.name, type: f.type, size: f.size, previewType: f.previewType }));
      doc.design = doc.designs[0];
    } else if (form.kad.previewUrl) {
      doc.design = { url: form.kad.previewUrl, name: form.kad.fileName, type: form.kad.fileType, size: form.kad.fileSize, previewType: form.kad.previewType };
      doc.designs = [doc.design];
    }
  } else {
    doc.content = form.content;
  }

  documents.value.splice(idx, 1, doc);
  toast.success(`${doc.title} berjaya dikemaskini.`);
  showEditModal.value = false;
};

/* ---------------------
   UTILS
   --------------------- */
const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("ms-MY", { day: "2-digit", month: "short", year: "numeric" });
};

const statusVariant = (status) => {
  switch (status) {
    case "AKTIF": return "success";
    case "TIDAK AKTIF": return "danger";
    default: return "info";
  }
};

const humanSize = (n = 0) => {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
};

const labelJenis = (t) => t === "surat" ? "Surat Tawaran" : t === "kad" ? "Kad Tauliah" : "Umum";

/* Auto-render kandungan surat pada load */
documents.value.forEach((d) => {
  if (d.type === "surat") d.content = buildSuratHTML(d.surat);
});

/* View modal helpers (surat) */
function printSurat() { window.print(); }
async function copySuratHTML() {
  try { await navigator.clipboard.writeText(String(selectedDoc.value?.content || '')); toast.success('HTML surat disalin ke papan klip'); }
  catch { toast.error('Gagal menyalin HTML'); }
}

function isTermsDoc(doc = {}) {
  const key = String(doc.key || '').toLowerCase();
  const title = String(doc.title || '').toLowerCase();
  const content = String(doc.content || '').toLowerCase();
  return key.includes('terma') || title.includes('terma') || /terma\s+dan\s+syarat/.test(content) || content.includes('pelantikan penolong amil');
}

/* === Terma & Syarat: auto-convert numbered paragraphs to nested ordered lists === */
function normalizeParas(html = '') {
  if (!html) return '';
  let h = String(html).trim();
  // If there are no <p> tags, convert <br> and line breaks into paragraphs
  if (!/<\s*p[\s>]/i.test(h)) {
    // unify breaks
    h = h.replace(/\r\n|\r/g, '\n');
    // split by <br> or newlines
    const parts = h
      .split(/<\s*br\s*\/?\s*>|\n/gi)
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => `<p>${s}</p>`)
      .join('');
    return parts;
  }
  return h;
}
function convertNumberedParasToLists(html = '') {
  if (!html) return '';
  const tokens = [];
  const regex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let lastIndex = 0; let m;
  while ((m = regex.exec(html)) !== null) {
    if (m.index > lastIndex) tokens.push({ type: 'raw', html: html.slice(lastIndex, m.index) });
    const inner = (m[1] || '').trim();
    // Match numeric like 1. or 2.1 or 2.1.3
    const num = inner.match(/^(\d+(?:\.\d+)*)(?:[\.)])?\s+(.*)$/);
    // Match alpha like a) or (a) or a.
    const alp = inner.match(/^\(?([a-z])\)?[\.)]?\s+(.*)$/i);
    if (num) {
      const level = num[1].split('.').length;
      const content = num[2] || '';
      tokens.push({ type: 'li', level, content, listType: 'decimal' });
    } else if (alp) {
      // treat alpha as level +1 under the current depth when appropriate; default level 2
      const level = 2; // common case (a) under 2.x
      const content = alp[2] || '';
      tokens.push({ type: 'li', level, content, listType: 'alpha' });
    } else {
      tokens.push({ type: 'p', html: `<p>${inner}</p>` });
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < html.length) tokens.push({ type: 'raw', html: html.slice(lastIndex) });

  let out = '';
  let openLevel = 0;
  const typeStack = [];
  const openList = (t) => { out += t === 'alpha' ? '<ol type="a">' : '<ol>'; typeStack.push(t); openLevel++; };
  const closeOne = () => { out += '</ol>'; typeStack.pop(); openLevel--; };
  const closeTo = (lvl) => { while (openLevel > lvl) closeOne(); };

  for (const tok of tokens) {
    if (tok.type === 'li') {
      // open missing levels with matching type; if switching type at same level, close then reopen
      while (openLevel < tok.level) openList(tok.listType || 'decimal');
      // ensure same type at current depth
      if (openLevel && typeStack[typeStack.length - 1] !== tok.listType && tok.listType) {
        closeOne();
        openList(tok.listType);
      }
      closeTo(tok.level);
      out += `<li>${tok.content}</li>`;
    } else {
      closeTo(0);
      out += tok.html;
    }
  }
  closeTo(0);
  return out;
}

function renderTermsContent(html = '') {
  const normalized = normalizeParas(html);
  const cleaned = cleanBodyHtml(normalized);
  return convertNumberedParasToLists(cleaned);
}
</script>

<style scoped>
/* Surat Tawaran nicer preview */
.doc-wrapper { display:flex; justify-content:center; padding:8px; max-height:70vh; overflow:auto; overscroll-behavior:contain; -webkit-overflow-scrolling:touch; }
.doc-page { width:794px; max-width:100%; background:#fff; border:1px solid #e5e7eb; box-shadow:0 4px 20px rgba(0,0,0,.06); border-radius:8px; padding:32px 40px; color:#0f172a; }
.doc-body :deep(p){ margin:.5rem 0; line-height:1.7; }
.doc-body :deep(ol), .doc-body :deep(ul){ margin:.5rem 0 .5rem 1.25rem; }
.doc-body :deep(h2){ margin:.75rem 0 .5rem; font-size:1.125rem; }
.doc-body :deep(img){ max-width:100%; height:auto; display:block; }
@media print { body *{ visibility:hidden } .print-area, .print-area *{ visibility:visible } .print-area{ position:absolute; left:0; top:0; box-shadow:none !important; border:none !important } }
/* Editor spacing supaya kemas */
.ql-clean .ql-editor { font-size: 0.95rem; line-height: 1.6; padding: .75rem 1rem; }
.ql-clean .ql-editor p { margin: .5rem 0; }
.ql-clean .ql-editor h2 { font-size: 1.125rem; margin: .75rem 0 .5rem; }
.ql-clean .ql-editor h3 { font-size: 1rem; margin: .75rem 0 .5rem; }
.ql-clean .ql-editor ol, .ql-clean .ql-editor ul { padding-left: 1.25rem; }

/* Paparan artikel supaya mudah baca (jika Tailwind Typography dipasang, class .prose akan bantu) */
.prose :where(h2){ margin-top:0; }

/* TERMA & SYARAT layout */
.ts-wrapper{display:flex;justify-content:center;padding:8px;max-height:70vh;overflow:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}
.ts-page{width:794px;max-width:100%;background:#fff;border:1px solid #e5e7eb;box-shadow:0 4px 20px rgba(0,0,0,.06);border-radius:8px;padding:24px 32px;color:#0f172a}
.ts-header{display:flex;align-items:flex-start;gap:16px;margin-bottom:10px}
.ts-logo{border:2px solid #0ea5e9;color:#0ea5e9;font-weight:800;line-height:1;letter-spacing:.5px;border-radius:6px;padding:6px 8px;text-align:center;width:86px}
.ts-head-text{flex:1}
.ts-head-title{font-weight:800;text-transform:uppercase;color:#0f172a;margin:2px 0}
.ts-head-sub{font-weight:700;text-transform:uppercase;color:#0f172a}
.ts-body{font-family:"Times New Roman",ui-serif,Georgia,serif;font-size:14px;color:#0f172a}
.ts-body :where(p){margin:.45rem 0;line-height:1.8;text-align:justify;hyphens:auto;text-indent:24px}
.ts-body :where(h1,h2,h3,h4){text-indent:0}
.ts-body :where(li p){text-indent:0}
.ts-body :where(ol,ul){margin:.5rem 0 .5rem 1.25rem}
.ts-body :where(ol){list-style:decimal}
.ts-body :where(ol ol){list-style:decimal}
.ts-body :where(li){margin:.2rem 0}
.ts-footer{margin-top:16px}
.ts-footer-bar{height:6px;background:linear-gradient(90deg,#0ea5e9,#0ea5e9 40%,#0ea5e9 60%,#0369a1)}
.ts-footer-links{font-size:12px;color:#475569;margin-top:6px}
</style>


