<template>
  <div>
    <layouts-breadcrumb :items="breadcrumb" />

    <!-- CARD: Tajuk + Carian -->
    <rs-card class="mt-4">
      <template #header>
        <h1 class="text-xl font-bold">Laporan Status Aduan</h1>
      </template>

      <template #body>
        <FormKit type="form" :actions="false" id="aduanForm" @submit="onJana">
          <div class="grid gap-6 md:grid-cols-4">
            <!-- Status Aduan -->
            <FormKit
              type="select"
              label="Status Aduan"
              v-model="filters.status"
              :options="statusOptions"
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
              @click="submitForm('aduanForm')"
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
            @click="exportExcel"
          >
            Export Excel
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
            <!-- Tarikh format -->
            <template #tarikhAduan="{ text }">
              <span class="whitespace-nowrap">{{ formatDateTime(text) }}</span>
            </template>

            <!-- Individu Dibantu: dua baris -->
            <template #individuDibantu="{ text }">
              <div class="leading-tight">
                <div class="font-medium">{{ text?.nama }}</div>
                <div class="text-xs text-gray-500">{{ text?.no }}</div>
              </div>
            </template>

            <!-- Tahap Aduan: badge warna Merah/Kuning/Hijau -->
            <template #tahapAduan="{ text }">
              <rs-badge :variant="getTahapVariant(text)" class="!text-xs !px-3 !py-1 !rounded-full">
                {{ text }}
              </rs-badge>
            </template>

            <!-- Status: badge ikut jenis -->
            <template #status="{ text }">
              <rs-badge :variant="getStatusVariant(text)" class="!text-xs !px-3 !py-1 !rounded-full">
                {{ text }}
              </rs-badge>
            </template>
          </rs-table>
        </div>
      </template>
    </rs-card>

    <!-- Empty state -->
    <div v-else class="mt-6 rounded-2xl border border-dashed p-10 text-center text-gray-500 bg-white">
      <div class="text-4xl">⌄</div>
      <p class="mt-3">Sila buat carian dahulu</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

definePageMeta({ title: 'Laporan Status Aduan' })

const breadcrumb = [
  { name: 'Laporan', type: 'link', path: '/BF-ADN/laporan' },
  { name: 'Laporan Status Aduan', type: 'current', path: '/BF-ADN/laporan/laporan-status-aduan' },
]

/* -----------------------
 * Filters
 * ----------------------*/
const filters = ref({
  status: '',
  tarikhMula: '',
  tarikhTamat: '',
})

const statusOptions = [
  { value: '', label: 'Semua' },
  { value: 'Aduan Baru', label: 'Aduan Baru' },
  { value: 'Siasatan Ringkas', label: 'Siasatan Ringkas' },
  { value: 'Siasatan Lapangan', label: 'Siasatan Lapangan' },
  { value: 'Menunggu Pengesahan', label: 'Menunggu Pengesahan' },
  { value: 'Menunggu Pengesahan Ditutup', label: 'Menunggu Pengesahan Ditutup' },
  { value: 'Quick Assessment', label: 'Quick Assessment' },
  { value: 'Pengesahan Pemastautin', label: 'Pengesahan Pemastautin' },
  { value: 'Selesai', label: 'Selesai' },
  { value: 'Ditutup', label: 'Ditutup' },
]

/* -----------------------
 * State & Table
 * ----------------------*/
const hasSearched = ref(false)
const results = ref([])

const tableColumns = [
  { key: 'tarikhAduan',     label: 'Tarikh & Masa' },
  { key: 'idAduan',         label: 'ID Aduan' },
  { key: 'individuDibantu', label: 'Individu Dibantu' },
  { key: 'tahapAduan',      label: 'Tahap Aduan' },
  { key: 'daerah',          label: 'Daerah' },
  { key: 'status',          label: 'Status' },
]
const tableSort = { column: 'tarikhAduan', direction: 'desc' }
const tableData = computed(() => results.value)

/* -----------------------
 * Actions
 * ----------------------*/
function onReset () {
  filters.value.status = ''
  filters.value.tarikhMula = ''
  filters.value.tarikhTamat = ''
  hasSearched.value = false
  results.value = []
}

function onJana () {
  // DATA CONTOH (mockup) — sentiasa paparkan tanpa kira filter
  const demo = [
    { tarikhAduan: '2025-08-10T09:00:00', idAduan: 'ADN-10231', individuDibantu: { nama: 'Ahmad Bin Salleh', no: '901201-10-1234' }, tahapAduan: 'Merah',  daerah: 'Gombak',        status: 'Siasatan Ringkas' },
    { tarikhAduan: '2025-08-09T11:15:00', idAduan: 'ADN-10215', individuDibantu: { nama: 'Noraini Binti Omar', no: '880315-05-6578' }, tahapAduan: 'Kuning', daerah: 'Klang',         status: 'Selesai' },
    { tarikhAduan: '2025-08-08T16:20:00', idAduan: 'ADN-10198', individuDibantu: { nama: 'Mohd Razif', no: '920712-08-9012' },         tahapAduan: 'Hijau',  daerah: 'Petaling',      status: 'Ditutup' },
    { tarikhAduan: '2025-08-07T10:05:00', idAduan: 'ADN-10185', individuDibantu: { nama: 'Siti Aisyah Binti Hassan', no: '850402-12-3456' }, tahapAduan: 'Merah',  daerah: 'Kuala Lumpur', status: 'Aduan Baru' },
    { tarikhAduan: '2025-08-07T14:30:00', idAduan: 'ADN-10172', individuDibantu: { nama: 'Abdul Rahman Bin Ismail', no: '790625-08-7890' }, tahapAduan: 'Kuning', daerah: 'Shah Alam',     status: 'Siasatan Lapangan' },
    { tarikhAduan: '2025-08-06T09:45:00', idAduan: 'ADN-10159', individuDibantu: { nama: 'Fatimah Binti Ahmad', no: '910308-12-4568' }, tahapAduan: 'Hijau',  daerah: 'Subang Jaya',   status: 'Menunggu Pengesahan' },
    { tarikhAduan: '2025-08-04T08:10:00', idAduan: 'ADN-10146', individuDibantu: { nama: 'Muhammad Firdaus', no: '870911-07-1537' },    tahapAduan: 'Merah',  daerah: 'Kajang',        status: 'Quick Assessment' },
    { tarikhAduan: '2025-08-03T13:05:00', idAduan: 'ADN-10133', individuDibantu: { nama: 'Nurul Huda Binti Yusof', no: '930204-11-9753' }, tahapAduan: 'Kuning', daerah: 'Puchong',       status: 'Pengesahan Pemastautin' },
    { tarikhAduan: '2025-08-02T15:25:00', idAduan: 'ADN-10120', individuDibantu: { nama: 'Azman Bin Ali', no: '810116-09-4682' },       tahapAduan: 'Hijau',  daerah: 'Selayang',      status: 'Selesai' },
  ]

  results.value = demo
  hasSearched.value = true
}

/* -----------------------
 * Export
 * ----------------------*/
function exportExcel () {
  if (!tableData.value.length) return
  const header = [
    'Tarikh Aduan','ID Aduan','Individu Dibantu','No. Rujukan','Tahap Aduan','Daerah','Status'
  ]
  const data = tableData.value.map(r => ([
    formatDateTime(r.tarikhAduan),
    r.idAduan,
    r.individuDibantu?.nama,
    r.individuDibantu?.no,
    r.tahapAduan,
    r.daerah,
    r.status,
  ]))
  const csv = [header, ...data]
    .map(a => a.map(x => `"${String(x ?? '').replace(/"/g,'""')}"`).join(','))
    .join('\r\n')

  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = 'Laporan_Status_Aduan.csv'; a.click()
  URL.revokeObjectURL(url)
}

function exportPDF () {
  if (!tableData.value.length) return
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const head = [[
    'Tarikh Aduan','ID Aduan','Individu Dibantu','No. Rujukan','Tahap Aduan','Daerah','Status'
  ]]
  const body = tableData.value.map(r => ([
    formatDateTime(r.tarikhAduan),
    r.idAduan,
    r.individuDibantu?.nama,
    r.individuDibantu?.no,
    r.tahapAduan,
    r.daerah,
    r.status,
  ]))

  autoTable(doc, {
    head, body,
    startY: 18,
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [240, 240, 240] },
    margin: { top: 16, left: 10, right: 10, bottom: 12 },
    didDrawPage: () => {
      doc.setFontSize(14); doc.setFont('helvetica', 'bold')
      doc.text('Laporan Status Aduan', doc.internal.pageSize.getWidth()/2, 10, { align: 'center' })
    },
  })

  doc.save('Laporan_Status_Aduan.pdf')
}

/* -----------------------
 * Helpers
 * ----------------------*/
const formatDateTime = (iso) => {
  const d = new Date(iso)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth()+1).padStart(2,'0')
  const dd = String(d.getDate()).padStart(2,'0')
  const hh = String(d.getHours()).padStart(2,'0')
  const mi = String(d.getMinutes()).padStart(2,'0')
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`
}

function submitForm (id) {
  const form = document.getElementById(id)
  if (!form) return
  if (typeof form.requestSubmit === 'function') form.requestSubmit()
  else {
    const tmp = document.createElement('button'); tmp.type = 'submit'; tmp.style.display = 'none'
    form.appendChild(tmp); tmp.click(); form.removeChild(tmp)
  }
}

function getTahapVariant (t) {
  if (t === 'Merah') return 'danger'
  if (t === 'Kuning') return 'warning'
  if (t === 'Hijau') return 'success'
  return 'secondary'
}

function getStatusVariant (s) {
  if (s === 'Selesai' || s === 'Aduan Baru') return 'success'
    if (s === 'Ditutup') return 'danger'
  if (s === 'Siasatan Ringkas' || s === 'Siasatan Lapangan' || s === 'Quick Assessment') return 'warning'
  if (s === 'Menunggu Pengesahan' || s === 'Menunggu Pengesahan Ditutup' || s === 'Pengesahan Pemastautin') return 'warning'
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
/* Elak scroll mendatar; wrap teks panjang */
.table-wrapper { overflow-x: visible; }
:deep(table) th,
:deep(table) td { white-space: normal; word-break: break-word; }

/* Rapatkan nombor telefon / NRIC jadi dua baris kemas */
:deep(td:nth-child(3)) { line-height: 1.15; }
</style>
