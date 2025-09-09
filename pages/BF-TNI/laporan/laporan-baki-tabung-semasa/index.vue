<template>
  <div>
    <layouts-breadcrumb :items="breadcrumb" />

    <!-- CARD: Carian -->
    <rs-card class="mt-4">
      <template #header>
        <h1 class="text-xl font-bold">Laporan Baki Tabung Semasa</h1>
      </template>

      <template #body>
        <FormKit type="form" :actions="false" id="bakiForm" @submit="onJana">
          <div class="grid gap-6 md:grid-cols-3">
            <!-- Jenis Akaun -->
            <FormKit
              type="select"
              label="Jenis Akaun"
              v-model="filters.jenisAkaun"
              :options="jenisAkaunOptions"
              placeholder="— Pilih Jenis Akaun —"
              validation="required"
              validation-visibility="dirty"
              :classes="fkClasses"
            />

            <!-- Daerah -->
            <FormKit
              type="select"
              label="Daerah"
              v-model="filters.daerah"
              :options="daerahOptions"
              placeholder="Semua"
              :classes="fkClasses"
            />

            <!-- Cawangan (Semua Akaun) -->
<FormKit
  type="select"
  label="Cawangan"
  v-model="filters.cawangan"
  :options="cawanganOptions"
  placeholder="Semua"
  help=""
  :classes="fkClasses"
/>

            <!-- Jenis Tabung (MUNCUL HANYA BILA JENIS AKAUN = CAWANGAN) -->
            <FormKit
              v-if="showJenisTabung"
              type="select"
              label="Jenis Tabung"
              v-model="filters.jenisTabung"
              :options="jenisTabungOptions"
              placeholder="— Pilih Jenis Tabung —"
              help="Muncul jika Jenis Akaun ialah Cawangan."
              :classes="fkClasses"
            />

            <!-- Tarikh Mula -->
            <FormKit
              type="date"
              label="Tarikh Mula"
              v-model="filters.tarikhMula"
              :classes="fkClasses"
              placeholder="dd/mm/yyyy"
            />

            <!-- Tarikh Tamat -->
            <FormKit
              type="date"
              label="Tarikh Tamat"
              v-model="filters.tarikhTamat"
              :classes="fkClasses"
              placeholder="dd/mm/yyyy"
            />
          </div>

          <!-- Actions -->
          <div class="mt-6 flex items-center gap-3 justify-end">
            <rs-button
              variant="primary-outline"
              size="sm"
              class="!h-9 !px-4 !py-2 !text-sm !rounded-xl !leading-none align-middle"
              @click="onReset"
            >
              Reset
            </rs-button>

            <!-- Submit via rs-button (programmatic) -->
            <rs-button
              variant="primary"
              size="sm"
              class="!h-9 !px-4 !py-2 !text-sm !rounded-xl !leading-none align-middle"
              @click="submitForm('bakiForm')"
            >
              Jana
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- SUMMARY CARDS (UTAMA) -->
    <div v-if="showUtama && hasGenerated" class="mt-4 grid gap-4 md:grid-cols-4">
      <div class="rounded-2xl border bg-white p-5">
        <div class="text-xs text-gray-500 mb-1">Tabung</div>
        <div class="text-lg font-semibold">Nama Tabung Utama</div>
        <div class="text-sm text-gray-500">Kompleks MAIS Klang</div>
      </div>

      <div class="rounded-2xl border bg-white p-5">
        <div class="text-xs text-gray-500 mb-1">Baki Bawa Hadapan</div>
        <div class="text-2xl font-bold">RM {{ formatRM(bakiAwal) }}</div>
      </div>

      <div class="rounded-2xl border bg-white p-5">
        <div class="text-xs text-gray-500 mb-1">Had Minimum</div>
        <div class="text-2xl font-bold">RM {{ formatRM(hadMin) }}</div>
      </div>

      <div class="rounded-2xl border bg-white p-5">
        <div class="text-xs text-gray-500 mb-1">Baki Akhir</div>
        <div class="text-2xl font-bold">RM {{ formatRM(bakiAkhir) }}</div>
      </div>
    </div>

    <!-- TABLE 1: TABUNG UTAMA (KEKAL DI ATAS) -->
    <rs-card v-if="showUtama && hasGenerated" class="mt-4">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="font-semibold">Transaksi Tabung Utama</h3>
          <div class="flex justify-end gap-2">
            <rs-button
              variant="primary-outline"
              size="sm"
              class="flex items-center"
              :disabled="!rows.length"
              @click="exportCSV"
            >
              Export CSV
            </rs-button>
            <rs-button
              variant="primary"
              size="sm"
              class="flex items-center"
              :disabled="!rows.length"
              @click="exportPDF"
            >
              Export PDF
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>
        <div class="overflow-x-auto rounded-xl border">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-50">
              <tr class="text-left">
                <th class="px-4 py-3 font-semibold">Tarikh &amp; Masa</th>
                <th class="px-4 py-3 font-semibold">Rujukan</th>
                <th class="px-4 py-3 font-semibold">Jenis Transaksi</th>
                <th class="px-4 py-3 font-semibold">Bantuan</th>
                <th class="px-4 py-3 font-semibold">Nama Penerima</th>
                <th class="px-4 py-3 font-semibold">Pegawai Serahan</th>
                <th class="px-4 py-3 font-semibold text-right">Debit (RM)</th>
                <th class="px-4 py-3 font-semibold text-right">Kredit (RM)</th>
                <th class="px-4 py-3 font-semibold text-right">Baki (RM)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in rows" :key="r.rujukan" class="border-t">
                <td class="px-4 py-3">{{ formatDateTime(r.datetime) }}</td>
                <td class="px-4 py-3">{{ r.rujukan }}</td>
                <td class="px-4 py-3">{{ r.jenis }}</td>
                <td class="px-4 py-3">{{ r.bantuan || '-' }}</td>
                <td class="px-4 py-3">{{ r.penerima || '-' }}</td>
                <td class="px-4 py-3">{{ r.pegawai || '-' }}</td>
                <td class="px-4 py-3 text-right">{{ r.debit ? formatRM(r.debit) : '' }}</td>
                <td class="px-4 py-3 text-right">{{ r.kredit ? formatRM(r.kredit) : '' }}</td>
                <td class="px-4 py-3 text-right">{{ formatRM(r.baki) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </rs-card>

    <!-- ✨ NEW: SUMMARY CARDS (TABUNG PIC) -->
    <div
      v-if="showPic && hasGenerated"
      class="mt-4 grid gap-4 md:grid-cols-3"
    >
      <div class="rounded-2xl border bg-white p-5">
        <div class="text-xs text-gray-500 mb-1">Tabung PIC</div>
        <div class="text-lg font-semibold">Nama Tabung PIC</div>
        <div class="text-sm text-gray-500">Kompleks MAIS Klang</div>
      </div>
      <div class="rounded-2xl border bg-white p-5">
        <div class="text-xs text-gray-500 mb-1">Baki Bawa Hadapan</div>
        <div class="text-2xl font-bold">RM {{ formatRM(bakiAwalPic) }}</div>
      </div>
      <div class="rounded-2xl border bg-white p-5">
        <div class="text-xs text-gray-500 mb-1">Baki Akhir</div>
        <div class="text-2xl font-bold">RM {{ formatRM(bakiAkhirPic) }}</div>
      </div>
    </div>

    <!-- TABLE 2: TABUNG PIC (DI BAWAH, MUNCUL HANYA JIKA JENIS AKAUN = CAWANGAN & JENIS TABUNG = PIC) -->
    <rs-card v-if="showPic && hasGenerated" class="mt-4">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="font-semibold">Transaksi Tabung PIC</h3>
          <div class="flex justify-end gap-2">
            <rs-button
              variant="primary-outline"
              size="sm"
              class="flex items-center"
              :disabled="!rowsPic.length"
              @click="exportCSVPic"
            >
              Export CSV
            </rs-button>
            <rs-button
              variant="primary"
              size="sm"
              class="flex items-center"
              :disabled="!rowsPic.length"
              @click="exportPDFPic"
            >
              Export PDF
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>
        <div class="overflow-x-auto rounded-xl border">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-50">
              <tr class="text-left">
                <th class="px-4 py-3 font-semibold">Tarikh &amp; Masa</th>
                <th class="px-4 py-3 font-semibold">Rujukan</th>
                <th class="px-4 py-3 font-semibold">Jenis Transaksi</th>
                <th class="px-4 py-3 font-semibold">Bantuan</th>
                <th class="px-4 py-3 font-semibold">Nama Penerima</th>
                <th class="px-4 py-3 font-semibold">Pegawai Serahan</th>
                <th class="px-4 py-3 font-semibold text-right">Debit (RM)</th>
                <th class="px-4 py-3 font-semibold text-right">Kredit (RM)</th>
                <th class="px-4 py-3 font-semibold text-right">Baki (RM)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in rowsPic" :key="r.rujukan + r.datetime" class="border-t">
                <td class="px-4 py-3">{{ formatDateTime(r.datetime) }}</td>
                <td class="px-4 py-3">{{ r.rujukan }}</td>
                <td class="px-4 py-3">{{ r.jenis }}</td>
                <td class="px-4 py-3">{{ r.bantuan || '-' }}</td>
                <td class="px-4 py-3">{{ r.penerima || '-' }}</td>
                <td class="px-4 py-3">{{ r.pegawai || '-' }}</td>
                <td class="px-4 py-3 text-right">{{ r.debit ? formatRM(r.debit) : '' }}</td>
                <td class="px-4 py-3 text-right">{{ r.kredit ? formatRM(r.kredit) : '' }}</td>
                <td class="px-4 py-3 text-right">{{ formatRM(r.baki) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </rs-card>

    <!-- Empty state (hanya bila belum jana) -->
    <div
      v-if="!hasGenerated"
      class="mt-6 rounded-2xl border border-dashed p-10 text-center text-gray-500 bg-white"
    >
      <div class="text-4xl">⌄</div>
      <p class="mt-3">Sila jana laporan terlebih dahulu</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

definePageMeta({ title: 'Laporan Baki Tabung Semasa' })

const breadcrumb = [
  { name: 'Laporan', type: 'link', path: '/BF-TNI/laporan' },
  { name: 'Laporan Baki Tabung Semasa', type: 'current', path: '/BF-TNI/laporan/laporan-baki-tabung-semasa' },
]

/* ======================
   Filters
   ====================== */
const filters = reactive({
  jenisAkaun: 'Cawangan',
  jenisTabung: 'Tabung Utama', // baru
  daerah: '',
  cawangan: '',
  tarikhMula: '',
  tarikhTamat: '',
})

const jenisAkaunOptions = [
  'Kewangan', 'Operasi Daerah', 'Cawangan', 'Amil', 'Baitul', 'DPA',
]

const jenisTabungOptions = [
  'Tabung Utama', 'Tabung PIC'
]

const daerahOptions = [
  { value: '', label: 'Semua' },
  { value: 'Gombak', label: 'Gombak' },
  { value: 'Hulu Langat', label: 'Hulu Langat' },
  { value: 'Klang', label: 'Klang' },
  { value: 'Kuala Langat', label: 'Kuala Langat' },
  { value: 'Kuala Selangor', label: 'Kuala Selangor' },
  { value: 'Petaling', label: 'Petaling' },
  { value: 'Sabak Bernam', label: 'Sabak Bernam' },
  { value: 'Sepang', label: 'Sepang' },
  { value: 'Shah Alam', label: 'Shah Alam' },
]

// dummy cawangan per daerah
const cawanganByDaerah = {
  Gombak: ['Batu Caves', 'Selayang'],
  'Hulu Langat': ['Bandar Baru Bangi', 'Kajang'],
  Klang: ['Klang Utara', 'Klang Selatan'],
  Petaling: ['PJ', 'Subang Jaya'],
  Sepang: ['Cyberjaya', 'Dengkil'],
  'Shah Alam': ['Seksyen 7', 'Seksyen 19'],
}


const cawanganOptions = computed(() => {
  if (!filters.daerah) return [{ value: '', label: 'Semua' }]
  return [{ value: '', label: 'Semua' }, ...((cawanganByDaerah[filters.daerah] || []).map(c => ({ value: c, label: c })))]
})

// Jenis Tabung hanya bila Cawangan
const showJenisTabung = computed(() => filters.jenisAkaun === 'Cawangan')

// Kawal paparan seksyen
const isCawangan = computed(() => filters.jenisAkaun === 'Cawangan')
const showUtama = computed(() => !isCawangan.value || filters.jenisTabung === 'Tabung Utama')
const showPic   = computed(() => isCawangan.value && filters.jenisTabung === 'Tabung PIC')

watch(() => [filters.jenisAkaun, filters.daerah], () => { filters.cawangan = '' })
watch(() => filters.jenisAkaun, (v) => {
  // reset Jenis Tabung bila tukar jenis akaun
  filters.jenisTabung = v === 'Cawangan' ? 'Tabung Utama' : ''
})

/* ======================
   Data / Summary (mock)
   ====================== */
const hasGenerated = ref(false)
const rows = ref([])       // UTAMA
const rowsPic = ref([])    // PIC

const bakiAwal = ref(40000)
const hadMin = ref(15000)
const bakiAkhir = computed(() => rows.value.length ? rows.value[rows.value.length - 1].baki : bakiAwal.value)

/* === PIC balances (derived, tanpa ubah data sedia ada) === */
const rowsPicSorted = computed(() =>
  [...rowsPic.value].sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
)
const bakiAkhirPic = computed(() =>
  rowsPicSorted.value.length ? rowsPicSorted.value[rowsPicSorted.value.length - 1].baki : 0
)
/* Kira baki bawa hadapan PIC dari rekod pertama:
   baki_awal = baki_pertama + kredit_pertama - debit_pertama
   (sesuai dengan mock: 2500 + 500 - 0 = 3000) */
const bakiAwalPic = computed(() => {
  if (!rowsPicSorted.value.length) return 0
  const f = rowsPicSorted.value[0]
  const debit = Number(f.debit) || 0
  const kredit = Number(f.kredit) || 0
  return (Number(f.baki) || 0) + kredit - debit
})

/* ======================
   Actions
   ====================== */
function onReset () {
  filters.jenisAkaun = 'Cawangan'
  filters.jenisTabung = 'Tabung Utama'
  filters.daerah = ''
  filters.cawangan = ''
  filters.tarikhMula = ''
  filters.tarikhTamat = ''
  hasGenerated.value = false
  rows.value = []
  rowsPic.value = []
}

// Generate (mock data)
function onJana (_values) {
  hasGenerated.value = true

  // UTAMA – demo
  const demoUtama = [
    { datetime: '2025-08-31T08:30:00', rujukan: 'AKT-K1',  jenis: 'Tambah Nilai',                bantuan: '', penerima: '',    pegawai: 'Ketua Cawangan', debit: 5000, kredit: 0,    baki: 35000 },
    { datetime: '2025-08-31T10:00:00', rujukan: 'TNI-122', jenis: 'Serahan Tunai ke Tabung PIC', bantuan: '', penerima: '',    pegawai: 'Aznan',          debit: 0,    kredit: 3000, baki: 30000 },
    { datetime: '2025-08-31T16:00:00', rujukan: 'TNI-14',  jenis: 'Pemulangan Tunai',            bantuan: '', penerima: '',    pegawai: 'PIC 1',          debit: 500,  kredit: 0,    baki: 30500 },
  ]

  // PIC – demo
  const demoPic = [
    { datetime: '2025-08-31T12:00:00', rujukan: 'PA/2025/000781', jenis: 'Agihan Lain-Lain', bantuan: 'BANTUAN KEWANGAN BULANAN (MISKIN)', penerima: 'AHMAD KAMAL BIN YUSOFF',  pegawai: 'PIC 1', debit: 0,   kredit: 500, baki: 2500 },
    { datetime: '2025-08-31T12:00:00', rujukan: 'PA/2025/000781', jenis: 'Tunai Kaunter',    bantuan: 'BKATEGORI MAKAN/MINUM (FAKIR)',   penerima: 'SHAHRULERWA BIN AMIR',      pegawai: 'PIC 1', debit: 0,   kredit: 300, baki: 2200 },
  ]

  rows.value = demoUtama
  rowsPic.value = demoPic
}

/* ======================
   Export (UTAMA)
   ====================== */
function exportCSV () {
  if (!rows.value.length) return
  const header = [
    'Tarikh & Masa','Rujukan','Jenis Transaksi','Bantuan','Nama Penerima','Pegawai Serahan','Debit (RM)','Kredit (RM)','Baki (RM)'
  ]
  const data = rows.value.map(r => ([
    formatDateTime(r.datetime), r.rujukan, r.jenis, r.bantuan || '',
    r.penerima || '', r.pegawai || '', r.debit || '', r.kredit || '', r.baki
  ]))
  const csv = [header, ...data].map(a => a.map(x => `"${String(x).replace(/"/g,'""')}"`).join(',')).join('\r\n')
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = 'Laporan_Baki_Tabung_Utama.csv'; a.click()
  URL.revokeObjectURL(url)
}

function exportPDF () {
  if (!rows.value.length) return
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const head = [[
    'Tarikh & Masa','Rujukan','Jenis Transaksi','Bantuan','Nama Penerima','Pegawai Serahan','Debit (RM)','Kredit (RM)','Baki (RM)'
  ]]
  const body = rows.value.map(r => ([
    formatDateTime(r.datetime),
    r.rujukan,
    r.jenis,
    r.bantuan || '',
    r.penerima || '',
    r.pegawai || '',
    r.debit ? formatRM(r.debit) : '',
    r.kredit ? formatRM(r.kredit) : '',
    formatRM(r.baki),
  ]))
  autoTable(doc, {
    head, body,
    startY: 18,
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [240,240,240] },
    columnStyles: { 6: { halign:'right' }, 7: { halign:'right' }, 8: { halign:'right' } },
    margin: { top: 16, left: 10, right: 10, bottom: 12 },
    didDrawPage: () => {
      doc.setFontSize(14); doc.setFont('helvetica','bold')
      doc.text('Laporan Baki Tabung Utama', doc.internal.pageSize.getWidth()/2, 10, { align:'center' })
    },
  })
  doc.save('Laporan_Baki_Tabung_Utama.pdf')
}

/* ======================
   Export (PIC)
   ====================== */
function exportCSVPic () {
  if (!rowsPic.value.length) return
  const header = [
    'Tarikh & Masa','Rujukan','Jenis Transaksi','Bantuan','Nama Penerima','Pegawai Serahan','Debit (RM)','Kredit (RM)','Baki (RM)'
  ]
  const data = rowsPic.value.map(r => ([
    formatDateTime(r.datetime), r.rujukan, r.jenis, r.bantuan || '',
    r.penerima || '', r.pegawai || '', r.debit || '', r.kredit || '', r.baki
  ]))
  const csv = [header, ...data].map(a => a.map(x => `"${String(x).replace(/"/g,'""')}"`).join(',')).join('\r\n')
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = 'Laporan_Baki_Tabung_PIC.csv'; a.click()
  URL.revokeObjectURL(url)
}

function exportPDFPic () {
  if (!rowsPic.value.length) return
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const head = [[
    'Tarikh & Masa','Rujukan','Jenis Transaksi','Bantuan','Nama Penerima','Pegawai Serahan','Debit (RM)','Kredit (RM)','Baki (RM)'
  ]]
  const body = rowsPic.value.map(r => ([
    formatDateTime(r.datetime),
    r.rujukan,
    r.jenis,
    r.bantuan || '',
    r.penerima || '',
    r.pegawai || '',
    r.debit ? formatRM(r.debit) : '',
    r.kredit ? formatRM(r.kredit) : '',
    formatRM(r.baki),
  ]))
  autoTable(doc, {
    head, body,
    startY: 18,
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [240,240,240] },
    columnStyles: { 6: { halign:'right' }, 7: { halign:'right' }, 8: { halign:'right' } },
    margin: { top: 16, left: 10, right: 10, bottom: 12 },
    didDrawPage: () => {
      doc.setFontSize(14); doc.setFont('helvetica','bold')
      doc.text('Laporan Baki Tabung PIC', doc.internal.pageSize.getWidth()/2, 10, { align:'center' })
    },
  })
  doc.save('Laporan_Baki_Tabung_PIC.pdf')
}

/* ======================
   Helpers / UI
   ====================== */
function submitForm (id) {
  const form = document.getElementById(id)
  if (!form) return
  if (typeof form.requestSubmit === 'function') form.requestSubmit()
  else {
    const tmp = document.createElement('button'); tmp.type = 'submit'; tmp.style.display = 'none'
    form.appendChild(tmp); tmp.click(); form.removeChild(tmp)
  }
}

const formatRM = n => new Intl.NumberFormat('ms-MY', { minimumFractionDigits: 0 }).format(n)
const pad2 = n => String(n).padStart(2, '0')
function formatDateTime (iso) {
  const d = new Date(iso)
  const dd = pad2(d.getDate()), mm = pad2(d.getMonth()+1), yyyy = d.getFullYear()
  let h = d.getHours(), m = pad2(d.getMinutes()); const ampm = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12
  return `${dd}/${mm}/${yyyy} ${pad2(h)}:${m} ${ampm}`
}

const fkClasses = {
  outer: 'space-y-1',
  label: 'text-sm font-medium text-gray-900',
  inner: 'mt-1 formkit-disabled:opacity-60 rounded-xl border bg-white focus-within:ring-2 focus-within:ring-blue-500',
  input: 'w-full rounded-xl border-0 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none',
  help: 'text-xs text-gray-500 mt-1',
  messages: 'text-xs text-red-600 mt-1',
}
</script>
