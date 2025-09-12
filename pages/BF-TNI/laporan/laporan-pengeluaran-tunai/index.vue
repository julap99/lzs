<template>
  <div>
    <layouts-breadcrumb :items="breadcrumb" />

    <!-- CARD: Tajuk + Carian -->
    <rs-card class="mt-4">
      <template #header>
        <h1 class="text-xl font-bold">Laporan Pengeluaran Tunai</h1>
      </template>

      <template #body>
        <FormKit type="form" :actions="false" id="pengeluaranForm" @submit="onJana">
          <div class="grid gap-6 md:grid-cols-4">
            <!-- Daerah -->
            <FormKit
              type="select"
              label="Daerah"
              v-model="filters.daerah"
              :options="daerahOptions"
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
              @click="submitForm('pengeluaranForm')"
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
            filterable: false,   // matikan UI filter/column hide
            responsive: true,
            outsideBorder: true
          }"
        >
          <!-- Cells formatting -->
          <template #tarikh="{ text }">
            {{ formatDate(text) }}
          </template>

          <template #tabung="{ text }">
            <div v-if="text" class="leading-tight">
                <div class="font-medium">{{ text.tabungCode }}</div>
                <div class="text-xs text-gray-500">{{ text.tabungName }}</div>
            </div>
            <span v-else>—</span>
          </template>

          <template #jumlahDimohon="{ text }">
            {{ formatRM(text) }}
          </template>

          <template #status="{ text }">
            <rs-badge :variant="getStatusVariant(text)" class="!text-xs !px-3 !py-1 !rounded-full">
              {{ text }}
            </rs-badge>
          </template>
        </rs-table>
      </template>
    </rs-card>

    <!-- Empty state -->
    <div
      v-else
      class="mt-6 rounded-2xl border border-dashed p-10 text-center text-gray-500 bg-white"
    >
      <div class="text-4xl">⌄</div>
      <p class="mt-3">Sila buat carian & tekan Jana untuk papar jadual</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

definePageMeta({ title: 'Laporan Pengeluaran Tunai' })

const breadcrumb = [
  { name: 'Laporan', type: 'link', path: '/BF-TNI/laporan' },
  { name: 'Laporan Pengeluaran Tunai', type: 'current', path: '/BF-TNI/laporan/laporan-pengeluaran-tunai' },
]

/* -----------------------
 * Filters
 * ----------------------*/
const filters = reactive({
  daerah: '',
  status: '',
  tarikhMula: '',
  tarikhTamat: '',
})

const daerahOptions = [
  { value: '', label: 'Semua' },
  { value: 'Petaling', label: 'Petaling' },
  { value: 'Hulu Langat', label: 'Hulu Langat' },
  { value: 'Klang', label: 'Klang' },
  { value: 'Gombak', label: 'Gombak' },
  { value: 'Sepang', label: 'Sepang' },
  { value: 'Kuala Langat', label: 'Kuala Langat' },
  { value: 'Kuala Selangor', label: 'Kuala Selangor' },
  { value: 'Sabak Bernam', label: 'Sabak Bernam' },
  { value: 'Hulu Selangor', label: 'Hulu Selangor' },
]
const statusOptions = [
  { value: '', label: 'Semua' },
  { value: 'MENUNGGU KELULUSAN', label: 'MENUNGGU KELULUSAN' },
  { value: 'TUNAI DITERIMA - MENUNGGU PENGESAHAN', label: 'TUNAI DITERIMA - MENUNGGU PENGESAHAN' },
  { value: 'LULUS', label: 'LULUS' },
  { value: 'SELESAI', label: 'SELESAI' },
  { value: 'DITOLAK', label: 'DITOLAK' },
]

/* -----------------------
 * State
 * ----------------------*/
const hasSearched = ref(false)
const results = ref([]) // rows after Jana (already filtered by form)

/* -----------------------
 * Table (rs-table)
 * ----------------------*/
const tableColumns = [
  { key: 'id',             label: 'ID Permohonan' },
  { key: 'tarikh',         label: 'Tarikh' },
  { key: 'daerah',         label: 'Daerah' },
  { key: 'pemohon',        label: 'Pemohon' },
  { key: 'tujuan',         label: 'Tujuan' },
  { key: 'tabung',         label: 'Tabung' },            // object with code+name
  { key: 'jumlahDimohon',  label: 'Jumlah Dimohon' },
  { key: 'status',         label: 'Status' },
]
const tableSort = { column: 'tarikh', direction: 'desc' }

// Make it easy to swap to “filtered again” if you add more UI filters
const tableData = computed(() => results.value)

/* -----------------------
 * Actions
 * ----------------------*/
function onReset () {
  filters.daerah = ''
  filters.status = ''
  filters.tarikhMula = ''
  filters.tarikhTamat = ''
  hasSearched.value = false
  results.value = []
}

function onJana () {
  // Mock dataset (as in the screenshot)
  const demo = [
    {
      id: 'REQ-LAP-0002',
      tarikh: '2025-08-31',
      daerah: 'Petaling',
      pemohon: 'Siti',
      tujuan: 'TUNAI LAPANGAN',
      tabung: { tabungCode: 'TBG-1212', tabungName: 'Tabung Operasi Daerah' },
      jumlahDimohon: 1500,
      status: 'TUNAI DITERIMA - MENUNGGU PENGESAHAN',
    },
    {
      id: 'REQ-PRG-0004',
      tarikh: '2025-08-29',
      daerah: 'Hulu Langat',
      pemohon: 'Nadia',
      tujuan: 'PROGRAM',
      tabung: { tabungCode: 'TBG-1214', tabungName: 'Tabung DPA' },
      jumlahDimohon: 3000,
      status: 'LULUS',
    },
    {
      id: 'REQ-OPS-0005',
      tarikh: '2025-09-01',
      daerah: 'Petaling',
      pemohon: 'Mohd Noor',
      tujuan: 'ADUAN',
      tabung: { tabungCode: 'TBG-1212', tabungName: 'Tabung Operasi Daerah' },
      jumlahDimohon: 1200,
      status: 'SELESAI',
    },
    {
      id: 'REQ-OPS-0006',
      tarikh: '2025-09-01',
      daerah: 'Klang',
      pemohon: 'Amil A',
      tujuan: 'OPERASI HARIAN',
      tabung: { tabungCode: 'TBG-1212', tabungName: 'Tabung Amil Klang 01' },
      jumlahDimohon: 300,
      status: 'DITOLAK',
    },
  ]

  // Apply form filters
  const start = filters.tarikhMula ? new Date(filters.tarikhMula) : null
  const end   = filters.tarikhTamat ? new Date(filters.tarikhTamat) : null

  results.value = demo.filter(r => {
    if (filters.daerah && r.daerah !== filters.daerah) return false
    if (filters.status && r.status !== filters.status) return false
    if (start && new Date(r.tarikh) < start) return false
    if (end && new Date(r.tarikh) > end) return false
    return true
  })

  hasSearched.value = true
}

/* -----------------------
 * Export
 * ----------------------*/
function exportCSV () {
  if (!tableData.value.length) return
  const header = [
    'ID Permohonan','Tarikh','Daerah','Pemohon','Tujuan','Tabung','Jumlah Dimohon','Status'
  ]
  const data = tableData.value.map(r => ([
    r.id,
    formatDate(r.tarikh),
    r.daerah,
    r.pemohon,
    r.tujuan,
    `${r.tabung.tabungCode} - ${r.tabung.tabungName}`,
    formatRM(r.jumlahDimohon),
    r.status,
  ]))
  const csv = [header, ...data].map(a => a.map(x => `"${String(x).replace(/"/g,'""')}"`).join(',')).join('\r\n')
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = 'Laporan_Pengeluaran_Tunai.csv'; a.click()
  URL.revokeObjectURL(url)
}

function exportPDF () {
  if (!tableData.value.length) return
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const head = [[
    'ID Permohonan','Tarikh','Daerah','Pemohon','Tujuan','Tabung','Jumlah Dimohon','Status'
  ]]
  const body = tableData.value.map(r => ([
    r.id,
    formatDate(r.tarikh),
    r.daerah,
    r.pemohon,
    r.tujuan,
    `${r.tabung.tabungCode} - ${r.tabung.tabungName}`,
    formatRM(r.jumlahDimohon),
    r.status,
  ]))

  autoTable(doc, {
    head, body,
    startY: 18,
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [240, 240, 240] },
    columnStyles: { 6: { halign: 'right' } },
    margin: { top: 16, left: 10, right: 10, bottom: 12 },
    didDrawPage: () => {
      doc.setFontSize(14); doc.setFont('helvetica', 'bold')
      doc.text('Laporan Pengeluaran Tunai', doc.internal.pageSize.getWidth()/2, 10, { align: 'center' })
    },
  })

  doc.save('Laporan_Pengeluaran_Tunai.pdf')
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

const formatRM = n => new Intl.NumberFormat('ms-MY', { minimumFractionDigits: 0 }).format(Number(n) || 0)
const formatDate = isoStr => {
  const d = new Date(isoStr)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth()+1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${yyyy}-${mm}-${dd}` // atau dd/mm/yyyy jika mahu
}
const getStatusVariant = (s) => {
  if (s === 'TUNAI DITERIMA - MENUNGGU PENGESAHAN') return 'warning'
  if (s === 'LULUS' || s === 'SELESAI') return 'success'
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
