<template>
  <div class="p-6 space-y-6">
    <layouts-breadcrumb :items="breadcrumb" />

    <rs-card>
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold">Borang Pengesahan Status Asnaf-Sekolah/IPT</h1>
          <div class="no-print flex gap-2">
            <rs-button variant="secondary-outline" @click="onReset">Reset</rs-button>
            <rs-button variant="primary" @click="openPreview">Lihat Contoh Borang</rs-button>
          </div>
        </div>
      </template>

      <template #body>
        <!-- ===================== BAHAGIAN A ===================== -->
        <rs-card> 
          <div class="space-y-4">
          <div class="font-bold text-base">Bahagian A — Maklumat Asnaf</div>

          <div class="grid gap-4 md:grid-cols-2">
            <FormKit type="text" label="Nama Asnaf (Ketua Keluarga)" v-model="form.asnaf.nama" />
            <FormKit type="text" label="No. Kad Pengenalan Asnaf" v-model="form.asnaf.ic" />
          </div>

          <div class="grid gap-4">
            <FormKit type="textarea" label="Alamat (baris demi baris)" v-model="form.asnaf.alamat" :rows="3" />
          </div>

          <div class="grid gap-4 md:grid-cols-3">
            <FormKit type="text" label="Daerah" v-model="form.asnaf.daerah" />
            <FormKit type="text" label="Tempoh Status Asnaf" v-model="form.asnaf.tempoh" placeholder="cth: ASNAF MISKIN TAHUN 2025" />
            <FormKit type="text" label="No. Rujukan (auto)" v-model="noRujukan" disabled />
          </div>

          <!-- Tanggungan -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <div class="font-medium">Senarai Tanggungan</div>
              <rs-button size="sm" variant="secondary-outline" @click="addTanggungan">+ Tambah Tanggungan</rs-button>
            </div>

            <div class="space-y-3">
              <div v-for="(row, idx) in form.tanggungan" :key="row.uid" class="grid gap-3 md:grid-cols-12 items-end">
                <div class="md:col-span-5">
                  <FormKit type="text" :label="`Nama Tanggungan #${idx+1}`" v-model="row.nama" />
                </div>
                <div class="md:col-span-5">
                  <FormKit type="text" label="No. Kad Pengenalan" v-model="row.ic" />
                </div>
                <div class="md:col-span-2">
                  <rs-button block size="sm" variant="danger-outline" @click="removeTanggungan(idx)">Buang</rs-button>
                </div>
              </div>
              <div v-if="!form.tanggungan.length" class="text-sm text-gray-500">— Tiada tanggungan ditambah —</div>
            </div>
          </div>
        </div>
        </rs-card>

        <rs-divider class="my-6" />

        <!-- ===================== BAHAGIAN B ===================== -->
        <rs-card> 
          <div class="space-y-4">
            <div class="font-bold text-base">Bahagian B — Maklumat Pegawai Yang Mengesahkan</div>

            <div class="grid gap-4 md:grid-cols-2">
              <FormKit type="text" label="Nama Pegawai" v-model="form.pegawai.nama" />
              <FormKit type="text" label="Jawatan" v-model="form.pegawai.jawatan" />
            </div>

            <div class="grid gap-4">
              <FormKit type="textarea" label="Nama & Alamat Pegawai/Pejabat" v-model="form.pegawai.alamat" :rows="3" />
            </div>

            <div class="grid gap-6 md:grid-cols-2">
              <div>
                <label class="block text-sm font-medium mb-1">Tandatangan (imej)</label>
                <input type="file" accept="image/*" @change="onFile($event, 'ttd')" class="rs-input-file" />
                <div v-if="img.ttd" class="mt-2 p-2 border rounded w-fit">
                  <img :src="img.ttd" alt="Tandatangan" class="h-16 object-contain" />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium mb-1">Cop Rasmi (imej)</label>
                <input type="file" accept="image/*" @change="onFile($event, 'cop')" class="rs-input-file" />
                <div v-if="img.cop" class="mt-2 p-2 border rounded w-fit">
                  <img :src="img.cop" alt="Cop Rasmi" class="h-16 object-contain" />
                </div>
              </div>
            </div>
          </div>
        </rs-card>
      </template>
    </rs-card>

    <!-- =================== MODAL: SURAT BERISI SAHAJA =================== -->
    <rs-modal v-model="showPreview" title="Surat Pengesahan Asnaf - Sekolah/IPT" size="xl" position="center">
      <template #body>
        <!-- Seluruh surat berada dalam satu pembalut untuk cetak -->
        <div id="print-surat-modal" class="space-y-6 font-serif text-sm leading-relaxed print-page">

          <!-- Report Header Section -->
          <rs-card class="mb-6">
            <template #body>
              <div class="space-y-4">
                <!-- Logo LZS -->
                <div class="flex justify-start">
                  <img
                    src="https://www.zakatselangor.com.my/wp-content/uploads/2018/10/lzs-logo.png"
                    alt="LZS Logo"
                    class="h-16"
                  />
                </div>
                <!-- Report Details -->
                <div class="space-y-2">
                  <p class="text-sm font-bold">RP0003</p>
                  <p class="text-lg font-semibold">Surat Pengesahan Asnaf - Sekolah/IPT</p>
                </div>
              </div>
            </template>
          </rs-card>

          <!-- Kepala Surat (auto ref no + dates) + Alamat LZS di kiri -->
          <rs-card class="mb-6">
            <template #body>
              <!-- Rujukan & Tarikh -->
              <div class="text-left space-y-1">
                <div class="text-sm">
                  <span class="font-semibold">Rujukan kami: </span>
                  <span class="font-semibold">{{ noRujukan }}</span>
                </div>
                <div class="text-sm">
                  <span class="font-semibold">Tarikh: </span>
                  <span class="font-semibold">{{ formatDate(generatedAt) }}</span>
                </div>
                <div class="text-sm">
                  <span class="font-semibold">{{ formatDateHijri(generatedAt) }}</span>
                </div>
                <p class="text-xl text-gray-700 mb-3 arabic">
                  اَلسَلامُ عَلَيْكُم وَرَحْمَةُ اَللهِ وَبَرَكاتُهُ‎
                </p>
              </div>

              <!-- Alamat & Maklumat LZS -->
              <div class="mt-6 text-left space-y-1">
                <div class="font-bold text-base">{{ orgHeader.name }}</div>
                <div v-for="(ln, i) in orgHeader.address" :key="i" class="text-sm">{{ ln }}</div>
                <div class="text-sm mt-2">Tel: {{ orgHeader.tel }}</div>
                <div class="text-sm">Faks: {{ orgHeader.fax }}</div>
              </div>
            </template>
          </rs-card>

          <!-- Surat Body -->
          <rs-card class="mb-6">
            <template #body>
              <div class="space-y-4 text-sm text-[rgb(var(--text-color))]">
                <!-- Salam pembuka -->
                <div>Tuan/Puan,</div>

                <!-- Tajuk (garisan bawah sahaja) -->
                <div class="border-b-2 border-gray-800 py-2">
                  <p class="font-semibold uppercase tracking-wide">
                    PENGESAHAN STATUS ASNAF FAKIR MISKIN DAN MUALLAF DI BAWAH BANTUAN LEMBAGA ZAKAT SELANGOR (MAIS)
                  </p>
                </div>

                <!-- Perenggan 1 -->
                <p>
                  Semoga surat ini menemui tuan/puan di dalam kemanisan iman serta memperoleh rahmat daripada Allah s.w.t. Amin.
                </p>

                <!-- Perenggan 2 -->
                <p>
                  2. Adalah dimaklumkan bahawa penama di bawah adalah merupakan seorang penerima bantuan Asnaf Fakir Miskin
                  dan Muallaf Daerah <span class="font-semibold">{{ suratView.daerah }}</span>. Untuk makluman pihak tuan/puan,
                  Lembaga Zakat Selangor (MAIS) (selepas ini dirujuk sebagai “LZS”) diberi kuasa oleh Majlis Agama Islam Selangor
                  untuk mengagihkan wang zakat kepada asnaf fakir miskin dan muallaf di Negeri Selangor.
                </p>

                <div>Berikut adalah maklumat asnaf :</div>

                <!-- Jadual Maklumat Asnaf -->
                <table class="w-full border border-gray-800 text-sm table-fixed report-table">
                  <tbody>
                    <tr>
                      <td class="w-1/3 p-2 border-r border-gray-800 font-medium align-top">
                        Nama Asnaf / Kad Pengenalan (Ketua Keluarga)
                      </td>
                      <td class="w-1/2 p-2 border-r border-gray-800 align-top">{{ suratView.ketua.nama }}</td>
                      <td class="w-1/6 p-2 align-top">{{ suratView.ketua.ic }}</td>
                    </tr>
                    <tr>
                      <td class="p-2 border-t border-r border-gray-800 font-medium align-top">
                        Nama Tanggungan / Kad Pengenalan
                      </td>
                      <td class="p-2 border-t border-r border-gray-800 whitespace-pre-line align-top">
                        {{ tanggunganNamaJoin }}
                      </td>
                      <td class="p-2 border-t border-gray-800 whitespace-pre-line align-top">
                        {{ tanggunganIcJoin }}
                      </td>
                    </tr>
                    <!-- Alamat: penuh kanan -->
                    <tr>
                      <td class="p-2 border-t border-r border-gray-800 font-medium align-top">Alamat</td>
                      <td class="p-2 border-t border-gray-800 whitespace-pre-line align-top" colspan="2">
                        {{ alamatJoin }}
                      </td>
                    </tr>
                    <!-- Tempoh Status: penuh kanan -->
                    <tr>
                      <td class="p-2 border-t border-r border-gray-800 font-medium align-top">Tempoh Status Asnaf</td>
                      <td class="p-2 border-t border-gray-800 align-top font-semibold" colspan="2">
                        {{ suratView.tempohAsnaf }}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <!-- Perenggan 3 -->
                <p>
                  3. Sehubungan itu, jika terdapat sebarang pertanyaan berkaitan perkara di atas, sila hubungi Talian Zakat Selangor
                  di talian 1-300-88-4343. Segala kerjasama yang diberikan dari pihak tuan/puan amat kami hargai dan diucapkan
                  ribuan terima kasih.
                </p>

                <!-- Penutup -->
                <div>
                  Sekian,
                  <span class="text-xl text-gray-700 arabic">اَلسَلامُ عَلَيْكُم وَرَحْمَةُ اَللهِ وَبَرَكاتُهُ‎</span>
                </div>

                <div class="text-center font-semibold">“MENERAJU PERUBAHAN”</div>
              </div>

              <!-- Tandatangan -->
              <div class="space-y-4 mt-6">
                <div class="font-bold">Yang benar,</div>
                <div class="font-bold">LEMBAGA ZAKAT SELANGOR (MAIS)</div>
                <div class="h-12"></div>
                <div class="font-semibold">MOHD AQMAL BIN JAIS</div>
                <div class="text-sm">Ketua Operasi Agihan Daerah Hulu Selangor</div>
              </div>
            </template>
          </rs-card>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <rs-button variant="secondary-outline" @click="showPreview = false">Tutup</rs-button>
          <rs-button variant="primary" @click="downloadSuratTawaran">
            <Icon name="ic:baseline-download" class="w-4 h-4 mr-2" />
            Muat Turun
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

definePageMeta({ title: 'Borang Pengesahan Status Asnaf' })

/* ---------- Breadcrumb ---------- */
const breadcrumb = [
  { name: 'Pelaporan', type: 'link', path: '/BF-PRF/AS/pelaporan' },
  { name: 'Surat Pengesahan Sekolah/IPT', type: 'link', path: '/BF-PRF/AS/pelaporan/asnaf/pengesahan-sekolah-ipt' },
]

/* ---------- Data Org ---------- */
const orgHeader = {
  name: 'Lembaga Zakat Selangor (MAIS)',
  address: [
    'Menara Zakat Sultan Idris Shah,',
    'No. 1, Persiaran Bandar Raya, Seksyen 14,',
    '40000 Shah Alam, Selangor Darul Ehsan.',
  ],
  tel: '+603 8314 2222',
  fax: '+603 8314 2233/2244',
}

/* ---------- Borang State ---------- */
const form = ref({
  asnaf: { nama: '', ic: '', alamat: '', daerah: '', tempoh: '' },
  tanggungan: [],
  pegawai: { nama: '', jawatan: '', alamat: '' },
})

/* ---------- Default Surat (fallback jika borang kosong) ---------- */
const suratDefault = ref({
  daerah: 'Hulu Selangor',
  ketua: { nama: 'AHMAD SUFI BIN ZAKARIA', ic: '800701146041' },
  tanggungan: [{ nama: 'SYADIATUL ALYA BINTI AHMAD SUFI', ic: '070122101672' }],
  alamat: ['A-G-8', 'PANGSAPURI SERI KEMBANGAN', 'TAMAN TASIK TERATAI', '48200 SERENDAH', 'SELANGOR DARUL EHSAN'],
  tempohAsnaf: 'ASNAF MISKIN TAHUN 2025',
})

/* ---------- View Surat (gabung borang + default) ---------- */
const suratView = computed(() => {
  const a = form.value.asnaf
  const addr =
    a.alamat?.trim()
      ? a.alamat.split('\n').map(s => s.trim()).filter(Boolean)
      : suratDefault.value.alamat
  return {
    daerah: a.daerah || suratDefault.value.daerah,
    ketua: {
      nama: a.nama || suratDefault.value.ketua.nama,
      ic: a.ic || suratDefault.value.ketua.ic,
    },
    tanggungan: form.value.tanggungan.length ? form.value.tanggungan : suratDefault.value.tanggungan,
    alamat: addr,
    tempohAsnaf: a.tempoh || suratDefault.value.tempohAsnaf,
  }
})

/* ---------- Helpers untuk jadual ---------- */
const tanggunganNamaJoin = computed(() => (suratView.value.tanggungan || []).map(t => t.nama || '-').join('\n'))
const tanggunganIcJoin   = computed(() => (suratView.value.tanggungan || []).map(t => t.ic || '-').join('\n'))
const alamatJoin         = computed(() => (suratView.value.alamat || []).join('\n'))

/* ---------- Tanggungan actions ---------- */
const addTanggungan = () => form.value.tanggungan.push({ uid: crypto.randomUUID(), nama: '', ic: '' })
const removeTanggungan = (idx) => form.value.tanggungan.splice(idx, 1)

/* ---------- Ref No & Tarikh ---------- */
const today = ref(new Date())
const generatedAt = today
const noRujukan = ref(genNoRujukan())
function genNoRujukan () {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `RP0003/${y}${m}${day}/${rand}`
}
function formatDate (date) {
  return new Date(date).toLocaleDateString('ms-MY', { day: '2-digit', month: 'long', year: 'numeric' })
}
function formatDateHijri (date) {
  const opts = { day: '2-digit', month: 'long', year: 'numeric' }
  try { return new Intl.DateTimeFormat('ms-MY-u-ca-islamic', opts).format(date) }
  catch { return new Intl.DateTimeFormat('en-u-ca-islamic', opts).format(date) }
}

/* ---------- Upload imej (ttd/cop) — disimpan jika nak guna kemudian ---------- */
const img = ref({ ttd: '', cop: '' })
function onFile (e, which) {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => { img.value[which] = reader.result }
  reader.readAsDataURL(file)
}

/* ---------- Modal Preview ---------- */
const showPreview = ref(false)
function openPreview () { showPreview.value = true }

/* ---------- Muat Turun: EXPORT PDF (jspdf + autotable) ---------- */
async function downloadSuratTawaran () {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageWidth  = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 15
  let y = margin

  // Logo (opsyenal – skip jika CORS)
  async function addLogo() {
    try {
      const url = 'https://www.zakatselangor.com.my/wp-content/uploads/2018/10/lzs-logo.png'
      const img = new Image(); img.crossOrigin = 'anonymous'; img.src = url
      await new Promise(res => { img.onload = res; img.onerror = res })
      const cv = document.createElement('canvas'); cv.width = img.width; cv.height = img.height
      cv.getContext('2d').drawImage(img, 0, 0)
      doc.addImage(cv.toDataURL('image/png'), 'PNG', margin, y, 28, 28)
    } catch {}
    y += 32
  }
  await addLogo()

  // Header
  doc.setFont('helvetica','bold'); doc.setFontSize(10)
  doc.text('RP0003', margin, y); y += 6
  doc.setFontSize(14)
  doc.text('Surat Pengesahan Asnaf - Sekolah/IPT', pageWidth/2, y, { align:'center' }); y += 10

  doc.setFont('helvetica','normal'); doc.setFontSize(10)
  doc.text(`Rujukan kami: ${noRujukan.value}`, margin, y); y += 6
  doc.text(`Tarikh: ${formatDate(generatedAt.value)}`, margin, y); y += 6
  doc.text(`${formatDateHijri(generatedAt.value)}`, margin, y); y += 8

  // Alamat LZS
  doc.setFont('helvetica','bold'); doc.text(orgHeader.name, margin, y); y += 5
  doc.setFont('helvetica','normal')
  orgHeader.address.forEach(ln => { doc.text(ln, margin, y); y += 5 })
  doc.text(`Tel: ${orgHeader.tel}`, margin, y); y += 5
  doc.text(`Faks: ${orgHeader.fax}`, margin, y); y += 10

  const lineH = 5
  function addPara(txt) {
    const lines = doc.splitTextToSize(txt, pageWidth - margin*2)
    if (y + lines.length*lineH > pageHeight - margin) { doc.addPage(); y = margin }
    doc.text(lines, margin, y); y += lines.length*lineH + 2
  }

  // Isi surat (ikut modal)
  addPara('Tuan/Puan,')

  // Tajuk bergaris bawah
  doc.setFont('helvetica','bold')
  const tajuk = 'PENGESAHAN STATUS ASNAF FAKIR MISKIN DAN MUALLAF DI BAWAH BANTUAN LEMBAGA ZAKAT SELANGOR (MAIS)'
  const tLines = doc.splitTextToSize(tajuk, pageWidth - margin*2)
  doc.text(tLines, margin, y)
  y += tLines.length*lineH
  doc.setLineWidth(0.5); doc.line(margin, y, pageWidth - margin, y); y += 4
  doc.setFont('helvetica','normal')

  addPara('Semoga surat ini menemui tuan/puan di dalam kemanisan iman serta memperoleh rahmat daripada Allah s.w.t. Amin.')

  addPara(`2. Adalah dimaklumkan bahawa penama di bawah adalah merupakan seorang penerima bantuan Asnaf Fakir Miskin dan Muallaf Daerah ${suratView.value.daerah}. Untuk makluman pihak tuan/puan, Lembaga Zakat Selangor (MAIS) (selepas ini dirujuk sebagai “LZS”) diberi kuasa oleh Majlis Agama Islam Selangor untuk mengagihkan wang zakat kepada asnaf fakir miskin dan muallaf di Negeri Selangor.`)

  // Jadual maklumat asnaf
  autoTable(doc, {
    startY: y,
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 2, lineColor: [0,0,0], lineWidth: 0.2, valign: 'top' },
    headStyles: { fillColor: [255,255,255], textColor: [0,0,0] },
    body: [
      [
        { content: 'Nama Asnaf / Kad Pengenalan (Ketua Keluarga)', styles: { fontStyle: 'bold' } },
        { content: suratView.value.ketua.nama },
        { content: suratView.value.ketua.ic },
      ],
      [
        { content: 'Nama Tanggungan / Kad Pengenalan', styles: { fontStyle: 'bold' } },
        { content: tanggunganNamaJoin.value, styles: { cellWidth: 'wrap' } },
        { content: tanggunganIcJoin.value, styles: { cellWidth: 'wrap' } },
      ],
      [
        { content: 'Alamat', styles: { fontStyle: 'bold' } },
        { content: alamatJoin.value, colSpan: 2 },
      ],
      [
        { content: 'Tempoh Status Asnaf', styles: { fontStyle: 'bold' } },
        { content: suratView.value.tempohAsnaf, colSpan: 2, styles: { fontStyle: 'bold' } },
      ],
    ],
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: (pageWidth - margin*2 - 80) * 0.6 },
      2: { cellWidth: (pageWidth - margin*2 - 80) * 0.4 },
    },
    margin: { left: margin, right: margin },
  })
  y = doc.lastAutoTable.finalY + 8

  addPara('3. Sehubungan itu, jika terdapat sebarang pertanyaan berkaitan perkara di atas, sila hubungi Talian Zakat Selangor di talian 1-300-88-4343. Segala kerjasama yang diberikan dari pihak tuan/puan amat kami hargai dan diucapkan ribuan terima kasih.')

  addPara('Sekian,')

  // Tandatangan (ikut modal)
  y += 4
  doc.setFont('helvetica','bold'); doc.text('Yang benar,', margin, y); y += 6
  doc.text('LEMBAGA ZAKAT SELANGOR (MAIS)', margin, y); y += 16
  doc.text('MOHD AQMAL BIN JAIS', margin, y); y += 5
  doc.setFont('helvetica','normal'); addPara('Ketua Operasi Agihan Daerah Hulu Selangor')

  doc.save('Surat_Pengesahan_Asnaf_Sekolah_IPT.pdf')
  showPreview.value = false
}

/* ---------- Cetak hanya kandungan modal (kekal, tidak digunakan oleh PDF) ---------- */
async function legacyPrintOnly () {
  document.body.classList.add('printing-surat-only')
  await nextTick()
  window.print()
  setTimeout(() => document.body.classList.remove('printing-surat-only'), 300)
}

/* ---------- Util ---------- */
function onReset () {
  form.value = {
    asnaf: { nama: '', ic: '', alamat: '', daerah: '', tempoh: '' },
    tanggungan: [],
    pegawai: { nama: '', jawatan: '', alamat: '' },
  }
  img.value = { ttd: '', cop: '' }
  today.value = new Date()
  noRujukan.value = genNoRujukan()
}
</script>

<style>
/* ===== Paparan & Cetak tajam ===== */
.report-table { border-collapse: collapse; }
.report-table th, .report-table td { border: 1px solid #000; padding: 8px; vertical-align: top; }
.report-table th { font-weight: 700; color: #000; text-align: left; }
.arabic { font-family: "Amiri", "Scheherazade New", "Noto Naskh Arabic", serif; letter-spacing: 0; }
.print-page { max-width: 180mm; margin: 0 auto; }

/* ===== Mod Cetak: hanya kandungan surat dalam modal ===== */
@media print {
  @page { size: A4; margin: 15mm; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; color: #000 !important; }
  body.printing-surat-only * { visibility: hidden; }
  body.printing-surat-only #print-surat-modal,
  body.printing-surat-only #print-surat-modal * { visibility: visible; }
  body.printing-surat-only #print-surat-modal { position: absolute; inset: 0; width: 100%; }
  .report-table, .report-table tr, .report-table th, .report-table td { page-break-inside: avoid; }
}
</style>
