<template>
  <div class="p-6 space-y-6">
    <layouts-breadcrumb :items="breadcrumb" />

    <!-- Toolbar tindakan -->
    <div class="no-print flex items-center justify-end gap-2">
      <rs-button variant="secondary-outline" @click="onReset">Reset</rs-button>
      <rs-button variant="primary" @click="openPreview">Lihat Contoh Borang</rs-button>
    </div>

    <!-- Report Header Section (opsyenal untuk halaman, bukan PDF) -->
    <rs-card class="mb-2">
      <template #body>
        <div class="space-y-4">
          <div class="flex justify-start">
            <img
              src="https://www.zakatselangor.com.my/wp-content/uploads/2018/10/lzs-logo.png"
              alt="LZS Logo"
              class="h-16"
            />
          </div>
          <div class="space-y-2">
            <p class="text-sm font-bold">RP0004</p>
            <p class="text-lg font-semibold">Surat Pengesahan Asnaf – Hospital</p>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- ===================== BAHAGIAN A (rs-card #1) ===================== -->
    <rs-card class="mb-6">
      <template #body>
        <div class="space-y-4">
          <h3 class="text-lg font-semibold">BAHAGIAN A — MAKLUMAT ASNAF</h3>

          <div class="grid gap-4 md:grid-cols-2">
            <FormKit type="text" label="Nama Asnaf (Ketua Keluarga)" v-model="form.asnaf.nama" />
            <FormKit type="text" label="No. Kad Pengenalan Asnaf" v-model="form.asnaf.ic" />
          </div>

          <div class="grid gap-4">
            <FormKit
              type="textarea"
              label="Alamat (baris demi baris)"
              v-model="form.asnaf.alamat"
              :rows="3"
            />
          </div>

          <div class="grid gap-4 md:grid-cols-3">
            <FormKit type="text" label="Daerah" v-model="form.asnaf.daerah" />
            <FormKit
              type="text"
              label="Tempoh Status Asnaf"
              v-model="form.asnaf.tempoh"
              placeholder="cth: ASNAF MISKIN TAHUN 2025"
            />
            <FormKit type="text" label="No. Rujukan (auto)" v-model="noRujukan" disabled />
          </div>

          <!-- Maklumat Pesakit (tanpa tanggungan) -->
          <div class="space-y-2">
            <div class="font-medium">Maklumat Pesakit</div>
            <div class="grid gap-4 md:grid-cols-2">
              <FormKit type="text" label="Nama Pesakit" v-model="form.pesakit.nama" />
              <FormKit type="text" label="No. Kad Pengenalan Pesakit" v-model="form.pesakit.ic" />
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- ===================== BAHAGIAN B (rs-card #2) ===================== -->
    <rs-card class="mb-6">
      <template #body>
        <div class="space-y-4">
          <h3 class="text-lg font-semibold">BAHAGIAN B — MAKLUMAT PEGAWAI YANG MENGESAHKAN</h3>

          <div class="grid gap-4 md:grid-cols-2">
            <FormKit type="text" label="Nama Pegawai" v-model="form.pegawai.nama" />
            <FormKit type="text" label="Jawatan" v-model="form.pegawai.jawatan" />
          </div>

          <div class="grid gap-4">
            <FormKit
              type="textarea"
              label="Nama & Alamat Pegawai/Pejabat"
              v-model="form.pegawai.alamat"
              :rows="3"
            />
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
      </template>
    </rs-card>

    <!-- =================== MODAL: SURAT BERISI SAHAJA =================== -->
    <rs-modal v-model="showPreview" title="Surat Pengesahan Asnaf – Hospital" size="xl" position="center">
      <template #body>
        <!-- Seluruh surat berada dalam satu pembalut untuk rujukan visual -->
        <div id="print-surat-hospital-modal" class="space-y-6 font-serif text-sm leading-relaxed print-page">
          <!-- Report Header (surat) -->
          <rs-card class="mb-6">
            <template #body>
              <div class="space-y-4">
                <div class="flex justify-start">
                  <img
                    src="https://www.zakatselangor.com.my/wp-content/uploads/2018/10/lzs-logo.png"
                    alt="LZS Logo"
                    class="h-16"
                  />
                </div>
                <div class="space-y-2">
                  <p class="text-sm font-bold">RP0004</p>
                  <p class="text-lg font-semibold">Surat Pengesahan Asnaf – Hospital</p>
                </div>
              </div>
            </template>
          </rs-card>

          <!-- Kepala Surat -->
          <rs-card class="mb-6">
            <template #body>
              <div class="text-left space-y-1">
                <div class="text-sm"><span class="font-semibold">Rujukan kami: </span><span class="font-semibold">{{ noRujukan }}</span></div>
                <div class="text-sm"><span class="font-semibold">Tarikh: </span><span class="font-semibold">{{ formatDate(generatedAt) }}</span></div>
                <div class="text-sm"><span class="font-semibold">{{ formatDateHijri(generatedAt) }}</span></div>
                <p class="text-xl text-gray-700 mb-3 arabic">اَلسَلامُ عَلَيْكُم وَرَحْمَةُ اَللهِ وَبَرَكاتُهُ‎</p>
              </div>

              <div class="mt-6 text-left space-y-1">
                <div class="font-bold text-base">{{ orgHeader.name }}</div>
                <div v-for="(ln, i) in orgHeader.address" :key="i" class="text-sm">{{ ln }}</div>
                <div class="text-sm mt-2">Tel: {{ orgHeader.tel }}</div>
                <div class="text-sm">Faks: {{ orgHeader.fax }}</div>
              </div>
            </template>
          </rs-card>

          <!-- Kandungan Surat (preview visual) -->
          <rs-card class="mb-6">
            <template #body>
              <div class="space-y-4 text-sm text-[rgb(var(--text-color))]">
                <div>Tuan/Puan,</div>

                <div class="border-b-2 border-gray-800 py-2">
                  <p class="font-semibold uppercase tracking-wide">
                    PENGESAHAN STATUS ASNAF FAKIR MISKIN DAN MUALLAF BAGI MENDAPAT PENGECUALIAN PEMBAYARAN CAJ RAWATAN HOSPITAL
                    DAN KEMUDAHAN RAWATAN PERUBATAN PESAKIT LUAR DAN WAD KELAS 3
                  </p>
                </div>

                <p>1. Semoga surat ini menemui tuan/puan di dalam kemanisan iman serta memperoleh rahmat daripada Allah s.w.t. Amin.</p>

                <p>
                  2. Adalah dimaklumkan bahawa penama di bawah adalah merupakan seorang penerima bantuan Asnaf Fakir Miskin
                  dan Muallaf Daerah <span class="font-semibold">{{ suratView.daerah }}</span>. Untuk makluman pihak tuan/puan,
                  Lembaga Zakat Selangor (MAIS) (selepas ini dirujuk sebagai “LZS”) diberi kuasa oleh Majlis Agama Islam Selangor
                  untuk mengagihkan wang zakat kepada asnaf fakir miskin dan muallaf di Negeri Selangor.
                </p>

                <div>Berikut adalah maklumat asnaf :</div>

                <table class="w-full border border-gray-800 text-sm table-fixed report-table">
                  <tbody>
                    <tr>
                      <td class="w-1/3 p-2 border-r border-gray-800 font-medium align-top">Nama Asnaf / Kad Pengenalan (Ketua Keluarga)</td>
                      <td class="w-1/2 p-2 border-r border-gray-800 align-top">{{ suratView.ketua.nama }}</td>
                      <td class="w-1/6 p-2 align-top">{{ suratView.ketua.ic }}</td>
                    </tr>
                    <tr>
                      <td class="p-2 border-t border-r border-gray-800 font-medium align-top">Nama Pesakit / Kad Pengenalan</td>
                      <td class="p-2 border-t border-r border-gray-800 align-top">{{ suratView.pesakit.nama }}</td>
                      <td class="p-2 border-t border-gray-800 align-top">{{ suratView.pesakit.ic }}</td>
                    </tr>
                    <tr>
                      <td class="p-2 border-t border-r border-gray-800 font-medium align-top">Alamat</td>
                      <td class="p-2 border-t border-gray-800 whitespace-pre-line align-top" colspan="2">{{ alamatJoin }}</td>
                    </tr>
                    <tr>
                      <td class="p-2 border-t border-r border-gray-800 font-medium align-top">Tempoh Status Asnaf</td>
                      <td class="p-2 border-t border-gray-800 align-top font-semibold" colspan="2">{{ suratView.tempohAsnaf }}</td>
                    </tr>
                  </tbody>
                </table>

                <p>
                  3. Dengan ini segala hormatnya kami merujuk kepada <span class="font-semibold">Surat Pekeliling Bahagian Kewangan
                  (Unit Pengurusan Hasil) Bilangan 14 Tahun 2004</span> yang menyatakan bahawa golongan fakir dan miskin yang menerima
                  bantuan bulanan di bawah peruntukan zakat dari Majlis Agama Islam Negeri merupakan golongan yang sama tarafnya dengan
                  golongan yang mendapat bantuan Jabatan Kebajikan Masyarakat.
                </p>

                <p>
                  4. Oleh yang demikian, golongan fakir dan miskin yang menerima bantuan bulanan dari Majlis Agama Islam Negeri adalah
                  <span class="font-semibold">dikecualikan</span> daripada bayaran caj rawatan hospital dan kemudahan perubatan pesakit luar
                  dan wad Kelas 3 di mana-mana Hospital/Klinik Kesihatan seperti yang dinyatakan dalam surat Kementerian Kewangan
                  <span class="font-semibold">Bil. KPK(PS) 096/28/2793 Jld.3 Sk. 6/2004(3)</span> bertarikh 5 Mei 2004.
                </p>

                <p>
                  5. Sehubungan itu, adalah dihargai agar pihak tuan/puan dapat <span class="font-semibold">mengecualikan</span> bayaran caj rawatan hospital
                  dan kemudahan rawatan perubatan pesakit luar dan wad Kelas 3 kepada penerima bantuan zakat yang dinyatakan di atas.
                  Sebarang pertanyaan berkaitan perkara di atas, sila hubungi Talian Zakat Selangor 1-300-88-4343.
                </p>

                <div>6. Sekian, <span class="text-xl text-gray-700 arabic">وَالسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ ٱللَّهِ وَبَرَكَاتُهُ</span></div>

                <div class="text-center font-semibold">“MENERAJU PERUBAHAN”</div>
              </div>

              <!-- Tandatangan -->
              <div class="space-y-4 mt-6">
                <div class="font-bold">Yang benar,</div>
                <div class="font-bold">LEMBAGA ZAKAT SELANGOR (MAIS)</div>
                <div class="h-12"></div>
                <div class="font-semibold">MOHD AQMAL BIN JAIS</div>
                <div class="text-sm">Ketua Operasi Agihan Daerah {{ suratView.daerah }}</div>
              </div>
            </template>
          </rs-card>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <rs-button variant="secondary-outline" @click="showPreview = false">Tutup</rs-button>
          <rs-button variant="primary" @click="downloadSuratHospital">
            <Icon name="ic:baseline-download" class="w-4 h-4 mr-2" />
            Muat Turun
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

definePageMeta({ title: 'Surat Pengesahan Asnaf – Hospital' })

/* ---------- Breadcrumb ---------- */
const breadcrumb = [
  { name: 'Pelaporan', type: 'link', path: '/BF-PRF/AS/pelaporan' },
  { name: 'Surat Pengesahan Hospital', type: 'link', path: '/BF-PRF/AS/pelaporan/asnaf/pengesahan-hospital' },
]

/* ---------- Alamat rasmi LZS ---------- */
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

/* ---------- Borang State (A & B) ---------- */
const form = ref({
  asnaf:   { nama: '', ic: '', alamat: '', daerah: '', tempoh: '' },
  pesakit: { nama: '', ic: '' },
  pegawai: { nama: '', jawatan: '', alamat: '' },
})

/* ---------- Default Surat (fallback jika borang kosong) ---------- */
const suratDefault = ref({
  daerah: 'Hulu Selangor',
  ketua:   { nama: 'MUHAMMAD NASRIM BIN MOHD NASIR', ic: '104271140061' },
  pesakit: { nama: 'MUHAMMAD SHAARNAS ANAQI BIN MUHAMMAD NASMI', ic: '211107101507' },
  alamat: [
    'NO. 21,',
    'JALAN ARQWAN 4B',
    'TAMAN DESA ULU YAM',
    '44300 BATANG KALI',
    'SELANGOR DARUL EHSAN',
  ],
  tempohAsnaf: 'ASNAF MISKIN TAHUN 2025',
})

/* ---------- View Surat (gabung borang + default) ---------- */
const suratView = computed(() => {
  const a = form.value.asnaf
  const p = form.value.pesakit
  const addr = a.alamat?.trim()
    ? a.alamat.split('\n').map(s => s.trim()).filter(Boolean)
    : suratDefault.value.alamat
  return {
    daerah: a.daerah || suratDefault.value.daerah,
    ketua:  { nama: a.nama || suratDefault.value.ketua.nama, ic: a.ic || suratDefault.value.ketua.ic },
    pesakit:{ nama: p.nama || suratDefault.value.pesakit.nama, ic: p.ic || suratDefault.value.pesakit.ic },
    alamat: addr,
    tempohAsnaf: a.tempoh || suratDefault.value.tempohAsnaf,
  }
})

/* ---------- Helpers ---------- */
const alamatJoin = computed(() => (suratView.value.alamat || []).join('\n'))

/* ---------- Auto tarikh & rujukan ---------- */
const generatedAt = ref(new Date())
const noRujukan   = ref(generateNoRujukan())
function generateNoRujukan() {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `RP0004/${yyyy}${mm}${dd}/${rand}`
}
function formatDate(date) {
  return new Date(date).toLocaleDateString('ms-MY', { day: '2-digit', month: 'long', year: 'numeric' })
}
function formatDateHijri(date) {
  const opts = { day: '2-digit', month: 'long', year: 'numeric' }
  try { return new Intl.DateTimeFormat('ms-MY-u-ca-islamic', opts).format(date) }
  catch { return new Intl.DateTimeFormat('en-u-ca-islamic', opts).format(date) }
}

/* ---------- Upload imej (untuk pratayang UI) ---------- */
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

/* ---------- Export PDF (Muat Turun) ---------- */
async function downloadSuratHospital () {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageWidth  = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 15
  let y = margin

  // (Opsyenal) logo – cuba render, skip jika CORS block
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
  doc.text('RP0004', margin, y); y += 6
  doc.setFontSize(14)
  doc.text('Surat Pengesahan Asnaf – Hospital', pageWidth/2, y, { align:'center' }); y += 10

  doc.setFontSize(10); doc.setFont('helvetica','normal')
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
    // page break
    if (y + lines.length*lineH > pageHeight - margin) { doc.addPage(); y = margin }
    doc.text(lines, margin, y); y += lines.length*lineH + 2
  }

  addPara('Tuan/Puan,')

  // Tajuk (garis bawah tebal)
  doc.setFont('helvetica','bold')
  const tajuk = 'PENGESAHAN STATUS ASNAF FAKIR MISKIN DAN MUALLAF BAGI MENDAPAT PENGECUALIAN PEMBAYARAN CAJ RAWATAN HOSPITAL DAN KEMUDAHAN RAWATAN PERUBATAN PESAKIT LUAR DAN WAD KELAS 3'
  const tLines = doc.splitTextToSize(tajuk, pageWidth - margin*2)
  doc.text(tLines, margin, y)
  y += tLines.length*lineH
  doc.setLineWidth(0.5); doc.line(margin, y, pageWidth - margin, y); y += 4
  doc.setFont('helvetica','normal')

  addPara('1. Semoga surat ini menemui tuan/puan di dalam kemanisan iman serta memperoleh rahmat daripada Allah s.w.t. Amin.')

  addPara(`2. Adalah dimaklumkan bahawa penama di bawah adalah merupakan seorang penerima bantuan Asnaf Fakir Miskin dan Muallaf Daerah ${suratView.value.daerah}. Untuk makluman pihak tuan/puan, Lembaga Zakat Selangor (MAIS) (selepas ini dirujuk sebagai “LZS”) diberi kuasa oleh Majlis Agama Islam Selangor untuk mengagihkan wang zakat kepada asnaf fakir miskin dan muallaf di Negeri Selangor.`)

  // Jadual maklumat asnaf
  const alamat = alamatJoin.value
  autoTable(doc, {
    startY: y,
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 2, lineColor: [0,0,0], lineWidth: 0.2 },
    headStyles: { fillColor: [255,255,255], textColor: [0,0,0] },
    body: [
      [
        { content: 'Nama Asnaf / Kad Pengenalan (Ketua Keluarga)', styles: { fontStyle: 'bold' } },
        { content: suratView.value.ketua.nama },
        { content: suratView.value.ketua.ic },
      ],
      [
        { content: 'Nama Pesakit / Kad Pengenalan', styles: { fontStyle: 'bold' } },
        { content: suratView.value.pesakit.nama },
        { content: suratView.value.pesakit.ic },
      ],
      [
        { content: 'Alamat', styles: { fontStyle: 'bold' } },
        { content: alamat, colSpan: 2 },
      ],
      [
        { content: 'Tempoh Status Asnaf', styles: { fontStyle: 'bold' } },
        { content: suratView.value.tempohAsnaf, colSpan: 2 },
      ],
    ],
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: (pageWidth - margin*2 - 80)/2 },
      2: { cellWidth: (pageWidth - margin*2 - 80)/2 },
    },
    margin: { left: margin, right: margin },
  })
  y = doc.lastAutoTable.finalY + 8

  addPara('3. Dengan ini segala hormatnya kami merujuk kepada Surat Pekeliling Bahagian Kewangan (Unit Pengurusan Hasil) Bilangan 14 Tahun 2004 yang menyatakan bahawa golongan fakir dan miskin yang menerima bantuan bulanan di bawah peruntukan zakat dari Majlis Agama Islam Negeri merupakan golongan yang sama tarafnya dengan golongan yang mendapat bantuan Jabatan Kebajikan Masyarakat.')

  addPara('4. Oleh yang demikian, golongan fakir dan miskin yang menerima bantuan bulanan dari Majlis Agama Islam Negeri adalah dikecualikan daripada bayaran caj rawatan hospital dan kemudahan perubatan pesakit luar dan wad Kelas 3 di mana-mana Hospital/Klinik Kesihatan seperti yang dinyatakan dalam surat Kementerian Kewangan Bil. KPK(PS) 096/28/2793 Jld.3 Sk. 6/2004(3) bertarikh 5 Mei 2004.')

  addPara('5. Sehubungan itu, adalah dihargai agar pihak tuan/puan dapat mengecualikan bayaran caj rawatan hospital dan kemudahan rawatan perubatan pesakit luar dan wad Kelas 3 kepada penerima bantuan zakat yang dinyatakan di atas. Sebarang pertanyaan berkaitan perkara di atas, sila hubungi Talian Zakat Selangor 1-300-88-4343.')

  addPara('6. Sekian,')

  // Tandatangan
  y += 4
  doc.setFont('helvetica','bold'); doc.text('Yang benar,', margin, y); y += 6
  doc.text('LEMBAGA ZAKAT SELANGOR (MAIS)', margin, y); y += 16
  doc.text('MOHD AQMAL BIN JAIS', margin, y); y += 5
  doc.setFont('helvetica','normal')
  addPara(`Ketua Operasi Agihan Daerah ${suratView.value.daerah}`)

  doc.save('Surat_Pengesahan_Asnaf_Hospital.pdf')
  showPreview.value = false
}

/* ---------- Reset ---------- */
function onReset () {
  form.value = {
    asnaf:   { nama: '', ic: '', alamat: '', daerah: '', tempoh: '' },
    pesakit: { nama: '', ic: '' },
    pegawai: { nama: '', jawatan: '', alamat: '' },
  }
  img.value = { ttd: '', cop: '' }
  generatedAt.value = new Date()
  noRujukan.value = generateNoRujukan()
}
</script>

<style>
/* ===== Paparan & Cetak tajam (untuk preview UI) ===== */
.report-table { border-collapse: collapse; }
.report-table th, .report-table td { border: 1px solid #000; padding: 8px; vertical-align: top; }
.report-table th { font-weight: 700; color: #000; text-align: left; }
.arabic { font-family: "Amiri", "Scheherazade New", "Noto Naskh Arabic", serif; letter-spacing: 0; }
.print-page { max-width: 180mm; margin: 0 auto; }

/* (Masih ada rules print jika nak cetak pratayang) */
@media print {
  @page { size: A4; margin: 15mm; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; color: #000 !important; }
  body.printing-surat-only * { visibility: hidden; }
  body.printing-surat-only #print-surat-hospital-modal,
  body.printing-surat-only #print-surat-hospital-modal * { visibility: visible; }
  body.printing-surat-only #print-surat-hospital-modal { position: absolute; inset: 0; width: 100%; }
  .report-table, .report-table tr, .report-table th, .report-table td { page-break-inside: avoid; }
}
</style>
