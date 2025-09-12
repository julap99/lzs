<template>
  <div>
    <layouts-breadcrumb :items="breadcrumb" />

    <!-- CARD: Tajuk + Carian -->
    <rs-card class="mt-4">
      <template #header>
        <h1 class="text-xl font-bold">Laporan Tambah Nilai Tunai</h1>
      </template>

      <template #body>
        <FormKit type="form" :actions="false" id="tambahNilaiForm" @submit="onJana">
          <div class="grid gap-6 md:grid-cols-4">
            <!-- Jenis Akaun -->
            <FormKit
              type="select"
              label="Jenis Akaun"
              v-model="filters.jenisAkaun"
              :options="jenisAkaunOptions"
              placeholder="Semua"
              :classes="fkClasses"
            />

            <!-- Status -->
            <FormKit
              type="select"
              label="Status"
              v-model="filters.status"
              :options="statusOptions"
              placeholder="Semua"
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

            <!-- Cawangan (dinamik ikut daerah) -->
            <FormKit
              type="select"
              label="Cawangan"
              v-model="filters.cawangan"
              :options="filteredCawanganOptions"
              placeholder="Semua"
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

            <rs-button
              variant="primary"
              size="sm"
              class="!h-9 !px-4 !py-2 !text-sm !rounded-xl !leading-none align-middle"
              @click="submitForm('tambahNilaiForm')"
            >
              Jana
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- RESULTS CARD -->
    <rs-card v-if="hasSearched" class="mt-4">
      <template #header>
        <div class="flex justify-end gap-2">
          <rs-button
            variant="primary-outline"
            size="sm"
            class="flex items-center"
            :disabled="!tableData.length"
            @click="exportCSV"
          >
            Export CSV
          </rs-button>
          <rs-button
            variant="primary"
            size="sm"
            class="flex items-center"
            :disabled="!tableData.length"
            @click="exportPDF"
          >
            Export PDF
          </rs-button>
        </div>
      </template>

      <template #body>
        <div class="table-wrapper">
          <rs-table
            :data="tableData"
            :columns="tableColumns"
            :advanced="true"
            :showSearch="false"
            :showFilter="false"
            :showNoColumn="false"
            :pageSize="10"
            :sort="tableSort"
            :options="{
              variant: 'default',
              striped: false,
              bordered: false,
              borderless: false,
              hover: true,
              fixed: false
            }"
            :optionsAdvanced="{
              sortable: true,
              filterable: false,
              responsive: true,
              outsideBorder: true
            }"
          >
            <!-- Cells formatting -->
            <template #bil="{ text }">
              <div class="text-left tabular-nums">{{ text }}</div>
            </template>

            <template #tarikhPermohonan="{ text }">
              <span class="whitespace-nowrap">{{ formatDateTime(text) }}</span>
            </template>

            <template #idPermohonan="{ text }">
              <span class="whitespace-nowrap">{{ text }}</span>
            </template>

            <template #cawangan="{ text }">
              <div class="break-words">{{ text || '—' }}</div>
            </template>

            <template #tabung="{ text }">
              <div v-if="text" class="leading-tight break-words">
                <div class="font-medium">{{ text.code }}</div>
                <div class="text-xs text-gray-500">{{ text.name }}</div>
              </div>
              <span v-else>—</span>
            </template>

            <template #jumlah="{ text }">
              <div class="text-right whitespace-nowrap">{{ formatRM(text) }}</div>
            </template>

            <!-- Status guna rs-badge (ikut design komponen asal) -->
            <template #status="{ text }">
              <rs-badge
                :variant="getStatusVariant(text)"
                class="!text-xs !px-3 !py-1 !rounded-full"
              >
                {{ text }}
              </rs-badge>
            </template>
          </rs-table>
        </div>
      </template>
    </rs-card>

    <!-- Empty state -->
    <div
      v-else
      class="mt-6 rounded-2xl border border-dashed p-10 text-center text-gray-500 bg-white"
    >
      <div class="text-4xl">⌄</div>
      <p class="mt-3">Sila buat carian dahulu</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

definePageMeta({ title: 'Laporan Tambah Nilai Tunai' })

const breadcrumb = [
  { name: 'Laporan', type: 'link', path: '/BF-TNI/laporan' },
  { name: 'Laporan Tambah Nilai Tunai', type: 'current', path: '/BF-TNI/laporan/laporan-tambah-nilai-tunai' },
]

/* -----------------------
 * Filters
 * ----------------------*/
const filters = reactive({
  jenisAkaun: '',
  status: '',
  daerah: '',
  cawangan: '',
  tarikhMula: '',
  tarikhTamat: '',
})

const jenisAkaunOptions = [
  { value: '', label: 'Semua' },
  { value: 'Cawangan', label: 'Cawangan' },
  { value: 'Kewangan', label: 'Kewangan' },
  { value: 'Operasi Daerah', label: 'Operasi Daerah' },
  { value: 'Baitul', label: 'Baitul' },
  { value: 'Amil', label: 'Amil' },
  { value: 'DPA', label: 'DPA' },
]
const statusOptions = [
  { value: '', label: 'Semua' },
  { value: 'MENUNGGU SEMAKAN', label: 'MENUNGGU SEMAKAN' },
  { value: 'LULUS SEMAKAN', label: 'LULUS SEMAKAN' },
  { value: 'LULUS SEMAKAN – MENUNGGU PINDAHAN', label: 'LULUS SEMAKAN – MENUNGGU PINDAHAN' },
  { value: 'TELAH DIARAHKAN', label: 'TELAH DIARAHKAN' },
  { value: 'SAH & SIAP', label: 'SAH & SIAP' },
  { value: 'SELESAI', label: 'SELESAI' },
  { value: 'DITOLAK', label: 'DITOLAK' },
]
const daerahOptions = [
  { value: '', label: 'Semua' },
  { value: 'Klang', label: 'Klang' },
  { value: 'Hulu Langat', label: 'Hulu Langat' },
  { value: 'Petaling', label: 'Petaling' },
  { value: 'Gombak', label: 'Gombak' },
  { value: 'Kuala Selangor', label: 'Kuala Selangor' },
  { value: 'Hulu Selangor', label: 'Hulu Selangor' },
  { value: 'Kuala Langat', label: 'Kuala Langat' },
  { value: 'Sabak Bernam', label: 'Sabak Bernam' },
  { value: 'Sepang', label: 'Sepang' },
]

/* -----------------------
 * Senarai cawangan LZS
 * ----------------------*/
const ALL_CAWANGAN = [
  // Klang
  { value: 'Kompleks MAIS Klang', label: 'Kompleks MAIS Klang', daerah: 'Klang' },

  // Hulu Langat
  { value: 'Bandar Baru Ampang', label: 'Bandar Baru Ampang', daerah: 'Hulu Langat' },
  { value: 'Bandar Baru Bangi', label: 'Bandar Baru Bangi', daerah: 'Hulu Langat' },
  { value: 'Kajang', label: 'Kajang', daerah: 'Hulu Langat' },

  // Petaling
  { value: 'Menara Zakat Sultan Idris Shah', label: 'Menara Zakat Sultan Idris Shah (Ibu Pejabat)', daerah: 'Petaling' },
  { value: 'Damansara', label: 'Cawangan Damansara', daerah: 'Petaling' },
  { value: 'Presint ALAMi Seksyen 13', label: 'Presint ALAMi Seksyen 13', daerah: 'Petaling' },
  { value: 'UTC Shah Alam', label: 'UTC Shah Alam (Anggerik Mall)', daerah: 'Petaling' },
  { value: 'Masjid Negeri Shah Alam', label: 'Masjid Negeri Shah Alam', daerah: 'Petaling' },

  // Gombak
  { value: 'Taman Melawati', label: 'Taman Melawati', daerah: 'Gombak' },
  { value: 'Bandar Baru Selayang', label: 'Bandar Baru Selayang', daerah: 'Gombak' },

  // Kuala Selangor
  { value: 'Kuala Selangor', label: 'Kuala Selangor', daerah: 'Kuala Selangor' },

  // Hulu Selangor
  { value: 'Kuala Kubu Bharu', label: 'Kuala Kubu Bharu', daerah: 'Hulu Selangor' },

  // Kuala Langat
  { value: 'Banting', label: 'Banting', daerah: 'Kuala Langat' },

  // Sabak Bernam
  { value: 'Sungai Besar', label: 'Sungai Besar', daerah: 'Sabak Bernam' },

  // Sepang
  { value: 'Saujana KLIA', label: 'Saujana KLIA', daerah: 'Sepang' },
  { value: 'MMU', label: 'Kaunter MMU (Multimedia University)', daerah: 'Sepang' },
]

/* -----------------------
 * Cawangan dinamik ikut daerah
 * ----------------------*/
const filteredCawanganOptions = computed(() => {
  const base = [{ value: '', label: 'Semua' }]
  if (!filters.daerah) return base.concat(ALL_CAWANGAN)
  return base.concat(ALL_CAWANGAN.filter(c => c.daerah === filters.daerah))
})

// Reset cawangan jika tak lagi valid bila daerah bertukar
watch(() => filters.daerah, () => {
  const exists = filteredCawanganOptions.value.some(o => o.value === filters.cawangan)
  if (!exists) filters.cawangan = ''
})

/* -----------------------
 * State
 * ----------------------*/
const hasSearched = ref(false)
const results = ref([])

/* -----------------------
 * Table
 * ----------------------*/
const tableColumns = [
  { key: 'bil',               label: 'Bil' },
  { key: 'tarikhPermohonan',  label: 'Tarikh Permohonan' },
  { key: 'idPermohonan',      label: 'ID Permohonan' },
  { key: 'daerah',            label: 'Daerah' },
  { key: 'cawangan',          label: 'Cawangan' },
  { key: 'tabung',            label: 'Tabung' },
  { key: 'jenisAkaun',        label: 'Jenis Akaun' },
  { key: 'jenisTambahNilai',  label: 'Jenis Tambah Nilai' },
  { key: 'jumlah',            label: 'Jumlah (RM)' },
  { key: 'status',            label: 'Status' },
]
const tableSort = { column: 'tarikhPermohonan', direction: 'desc' }

/* Pastikan turutan ikut columns (Bil di kiri) */
const tableData = computed(() =>
  results.value.map(row => {
    const ordered = {}
    for (const col of tableColumns) ordered[col.key] = row[col.key]
    return ordered
  })
)

/* -----------------------
 * Actions
 * ----------------------*/
function onReset () {
  filters.jenisAkaun = ''
  filters.status = ''
  filters.daerah = ''
  filters.cawangan = ''
  filters.tarikhMula = ''
  filters.tarikhTamat = ''
  hasSearched.value = false
  results.value = []
}

function onJana () {
  // Demo dataset (ikut contoh mockup)
  const demo = [
    {
      idPermohonan: 'TN/2025/00125',
      tarikhPermohonan: '2025-08-01T10:35:00',
      daerah: 'Klang',
      cawangan: 'Kompleks MAIS Klang',
      tabung: { code: 'TB-KLG-KMK-K1', name: 'Tabung Kaunter 1' },
      jenisAkaun: 'Cawangan',
      jenisTambahNilai: 'Tunai',
      jumlah: 10000,
      status: 'LULUS SEMAKAN',
    },
    {
      idPermohonan: 'TN/2025/00126',
      tarikhPermohonan: '2025-08-03T09:10:00',
      daerah: 'Hulu Langat',
      cawangan: 'Bandar Baru Bangi',
      tabung: { code: 'TB-HLG-BBB-UTM', name: 'Tabung Utama Bandar Baru' },
      jenisAkaun: 'Kewangan',
      jenisTambahNilai: 'eWallet',
      jumlah: 5000,
      status: 'MENUNGGU SEMAKAN',
    },
    {
      idPermohonan: 'TN/2025/00127',
      tarikhPermohonan: '2025-08-05T14:45:00',
      daerah: 'Petaling',
      cawangan: '-',
      tabung: { code: 'TB-PTG-SHA-OPS', name: 'Tabung Operasi Daerah Shah Alam' },
      jenisAkaun: 'Operasi Daerah',
      jenisTambahNilai: 'Tunai',
      jumlah: 3500,
      status: 'LULUS SEMAKAN – MENUNGGU PINDAHAN',
    },
    {
      idPermohonan: 'TN/2025/00128',
      tarikhPermohonan: '2025-08-07T09:00:00',
      daerah: 'Kuala Selangor',
      cawangan: '-',
      tabung: { code: 'TB-KUS-UTM-01', name: 'Tabung Utama Kuala Selangor' },
      jenisAkaun: 'Kewangan',
      jenisTambahNilai: 'Tunai',
      jumlah: 2000,
      status: 'MENUNGGU SEMAKAN',
    },
    {
      idPermohonan: 'TN/2025/00122',
      tarikhPermohonan: '2025-08-06T14:30:00',
      daerah: 'Petaling',
      cawangan: '-',
      tabung: { code: 'TB-PTG-SHA-BTL01', name: 'Tabung Baitul Shah Alam 01' },
      jenisAkaun: 'Baitul',
      jenisTambahNilai: 'Tunai',
      jumlah: 800,
      status: 'LULUS SEMAKAN',
    },
    {
      idPermohonan: 'TN/2025/00129',
      tarikhPermohonan: '2025-08-09T10:10:00',
      daerah: 'Hulu Langat',
      cawangan: '-',
      tabung: { code: 'TB-DPA-HLG01', name: 'Tabung DPA Hulu Langat 01' },
      jenisAkaun: 'DPA',
      jenisTambahNilai: 'eWallet',
      jumlah: 3200,
      status: 'SELESAI',
    },
    {
      idPermohonan: 'TN/2025/00131',
      tarikhPermohonan: '2025-08-10T09:25:00',
      daerah: 'Gombak',
      cawangan: '-',
      tabung: { code: 'TB-OPS-GBK01', name: 'Tabung Operasi Daerah Gombak 01' },
      jenisAkaun: 'Operasi Daerah',
      jenisTambahNilai: 'eWallet',
      jumlah: 1750,
      status: 'MENUNGGU SEMAKAN',
    },
  ]

  const start = filters.tarikhMula ? new Date(filters.tarikhMula) : null
  const end   = filters.tarikhTamat ? new Date(filters.tarikhTamat) : null

  let rows = demo.filter(r => {
    if (filters.jenisAkaun && r.jenisAkaun !== filters.jenisAkaun) return false
    if (filters.status && r.status !== filters.status) return false
    if (filters.daerah && r.daerah !== filters.daerah) return false
    if (filters.cawangan && r.cawangan !== filters.cawangan) return false
    if (start && new Date(r.tarikhPermohonan) < start) return false
    if (end && new Date(r.tarikhPermohonan) > end) return false
    return true
  })

  // Sort: terbaru ke lama
  rows.sort((a,b) => new Date(b.tarikhPermohonan) - new Date(a.tarikhPermohonan))

  // Letak 'bil' dahulu supaya kekal kolum paling kiri
  rows = rows.map((r, i) => ({ bil: i + 1, ...r }))

  results.value = rows
  hasSearched.value = true
}

/* -----------------------
 * Export
 * ----------------------*/
function exportCSV () {
  if (!tableData.value.length) return
  const header = [
    'Bil','Tarikh Permohonan','ID Permohonan','Daerah','Cawangan','Tabung','Jenis Akaun','Jenis Tambah Nilai','Jumlah (RM)','Status'
  ]
  const data = tableData.value.map(r => ([
    r.bil,
    formatDateTime(r.tarikhPermohonan),
    r.idPermohonan,
    r.daerah,
    r.cawangan,
    r.tabung ? `${r.tabung.code} - ${r.tabung.name}` : '-',
    r.jenisAkaun,
    r.jenisTambahNilai,
    formatRM(r.jumlah),
    r.status,
  ]))
  const csv = [header, ...data].map(a => a.map(x => `"${String(x).replace(/"/g,'""')}"`).join(',')).join('\r\n')
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = 'Laporan_Tambah_Nilai_Tunai.csv'; a.click()
  URL.revokeObjectURL(url)
}

function exportPDF () {
  if (!tableData.value.length) return
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const head = [[
    'Bil','Tarikh Permohonan','ID Permohonan','Daerah','Cawangan','Tabung','Jenis Akaun','Jenis Tambah Nilai','Jumlah (RM)','Status'
  ]]
  const body = tableData.value.map(r => ([
    r.bil,
    formatDateTime(r.tarikhPermohonan),
    r.idPermohonan,
    r.daerah,
    r.cawangan,
    r.tabung ? `${r.tabung.code} - ${r.tabung.name}` : '-',
    r.jenisAkaun,
    r.jenisTambahNilai,
    formatRM(r.jumlah),
    r.status,
  ]))

  autoTable(doc, {
    head, body,
    startY: 18,
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [240, 240, 240] },
    columnStyles: { 8: { halign: 'right' } },
    margin: { top: 16, left: 10, right: 10, bottom: 12 },
    didDrawPage: () => {
      doc.setFontSize(14); doc.setFont('helvetica', 'bold')
      doc.text('Laporan Tambah Nilai Tunai', doc.internal.pageSize.getWidth()/2, 10, { align: 'center' })
    },
  })

  doc.save('Laporan_Tambah_Nilai_Tunai.pdf')
}

/* -----------------------
 * Helpers
 * ----------------------*/
function submitForm (id) {
  const form = document.getElementById(id)
  if (!form) return
  if (typeof form.requestSubmit === 'function') form.requestSubmit()
  else {
    const tmp = document.createElement('button'); tmp.type = 'submit'; tmp.style.display = 'none'
    form.appendChild(tmp); tmp.click(); form.removeChild(tmp)
  }
}

const formatRM = n =>
  new Intl.NumberFormat('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    .format(Number(n) || 0)

function formatDateTime (iso) {
  const d = new Date(iso)
  const dd = String(d.getDate()).padStart(2,'0')
  const mm = String(d.getMonth()+1).padStart(2,'0')
  const yyyy = d.getFullYear()
  let hh = d.getHours()
  const min = String(d.getMinutes()).padStart(2,'0')
  const ampm = hh >= 12 ? 'PM' : 'AM'
  hh = hh % 12; if (hh === 0) hh = 12
  const hhStr = String(hh).padStart(2,'0')
  return `${dd}/${mm}/${yyyy} ${hhStr}:${min} ${ampm}`
}

function getStatusVariant (s) {
  // Guna varian standard komponen (ikut mockup design system)
  if (s === 'SELESAI' || s === 'SAH & SIAP' || s === 'LULUS SEMAKAN') return 'success'
  if (s.startsWith('LULUS SEMAKAN –') || s === 'MENUNGGU SEMAKAN' || s === 'TELAH DIARAHKAN') return 'warning'
  if (s === 'DITOLAK') return 'danger'
  return 'secondary'
}

/* -----------------------
 * FormKit classes
 * ----------------------*/
const fkClasses = {
  outer: 'space-y-1',
  label: 'text-sm font-medium text-gray-900',
  inner:
    'mt-1 formkit-disabled:opacity-60 rounded-xl border bg-white focus-within:ring-2 focus-within:ring-blue-500',
  input:
    'w-full rounded-xl border-0 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none',
  help: 'text-xs text-gray-500 mt-1',
  messages: 'text-xs text-red-600 mt-1',
}
</script>

<style scoped>
/* Kekal rupa asal, hanya pastikan:
   - Bil di kiri
   - Tiada scroll mendatar (wrap text panjang)
*/

.table-wrapper {
  overflow-x: visible; /* elak bar skrol mendatar */
}

/* Pastikan lajur pertama (Bil) kiri */
:deep(table) thead tr th:first-child,
:deep(table) tbody tr td:first-child {
  text-align: left !important;
}

/* Benarkan pembalutan teks untuk elak overflow */
:deep(table) th,
:deep(table) td {
  white-space: normal;          /* default wrap */
  word-break: break-word;       /* pecahkan perkataan panjang */
}

/* Kekalkan nombor jumlah sentiasa satu baris (kiri/kanan tak lari) */
:deep(td:nth-child(9)) {
  white-space: nowrap;          /* Jumlah (RM) */
}
</style>
