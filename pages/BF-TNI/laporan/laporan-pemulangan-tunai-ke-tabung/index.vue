<template>
  <div>
    <layouts-breadcrumb :items="breadcrumb" />

    <!-- CARD: Tajuk + Carian -->
    <rs-card class="mt-4">
      <template #header>
        <h1 class="text-xl font-bold">Laporan Pemulangan Tunai ke Tabung</h1>
      </template>

      <template #body>
        <FormKit type="form" :actions="false" id="pemulanganForm" @submit="onJana">
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
              @click="submitForm('pemulanganForm')"
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
            <template #tarikhPemulangan="{ text }">
              <span class="whitespace-nowrap">{{ formatDateTime(text) }}</span>
            </template>

            <template #idPemulangan="{ text }">
              <span class="whitespace-nowrap">{{ text }}</span>
            </template>

            <template #cawangan="{ text }">
              <div class="break-words">{{ text || '—' }}</div>
            </template>

            <template #jumlahDipulangkan="{ text }">
              <div class="text-right whitespace-nowrap">{{ formatRM(text) }}</div>
            </template>

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
      <!-- Jika Nuxt Icon tersedia -->
      <Icon name="iconamoon:arrow-down-2-light" size="40" class="mx-auto text-gray-300" aria-hidden="true" />
      <p class="mt-3">Sila buat carian dahulu</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

definePageMeta({ title: 'Laporan Pemulangan Tunai ke Tabung' })

const breadcrumb = [
  { name: 'Laporan', type: 'link', path: '/BF-TNI/laporan' },
  { name: 'Laporan Pemulangan Tunai ke Tabung', type: 'current', path: '/BF-TNI/laporan/laporan-pemulangan-tunai-ke-tabung' },
]

/* -----------------------
 * Filters
 * ----------------------*/
const filters = reactive({
  jenisAkaun: '',
  daerah: '',
  cawangan: '',
  tarikhMula: '',
  tarikhTamat: '',
})

const jenisAkaunOptions = [
  { value: '', label: 'Semua' },
  { value: 'Kewangan', label: 'Kewangan' },
  { value: 'Operasi Daerah', label: 'Operasi Daerah' },
  { value: 'Cawangan', label: 'Cawangan' },
  { value: 'Amil', label: 'Amil' },
  { value: 'Baitul', label: 'Baitul' },
  { value: 'DPA', label: 'DPA' },
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
 * Senarai cawangan (subset contoh)
 * ----------------------*/
const ALL_CAWANGAN = [
  { value: '-', label: '-', daerah: 'Klang' },
  { value: 'Kompleks MAIS Klang', label: 'Kompleks MAIS Klang', daerah: 'Klang' },

  { value: '-', label: '-', daerah: 'Hulu Langat' },
  { value: 'Bandar Baru Bangi', label: 'Bandar Baru Bangi', daerah: 'Hulu Langat' },

  { value: '-', label: '-', daerah: 'Petaling' },

  { value: '-', label: '-', daerah: 'Gombak' },

  { value: '-', label: '-', daerah: 'Kuala Selangor' },

  { value: '-', label: '-', daerah: 'Sepang' },

  { value: '-', label: '-', daerah: 'Kuala Langat' },

  { value: '-', label: '-', daerah: 'Sabak Bernam' },
  { value: 'Sungai Besar', label: 'Sungai Besar', daerah: 'Sabak Bernam' },
]

const filteredCawanganOptions = computed(() => {
  const base = [{ value: '', label: 'Semua' }]
  if (!filters.daerah) return base.concat(ALL_CAWANGAN)
  return base.concat(ALL_CAWANGAN.filter(c => c.daerah === filters.daerah))
})
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
  { key: 'tarikhPemulangan',   label: 'Tarikh Pemulangan' },
  { key: 'idPemulangan',       label: 'ID Pemulangan' },
  { key: 'jenisAkaun',         label: 'Jenis Akaun' },
  { key: 'daerah',             label: 'Daerah' },
  { key: 'cawangan',           label: 'Cawangan' },
  { key: 'namaPemulang',       label: 'Nama Pemulang' },
  { key: 'jumlahDipulangkan',  label: 'Jumlah Dipulangkan (RM)' },
  { key: 'status',             label: 'Status' },
]
const tableSort = { column: 'tarikhPemulangan', direction: 'desc' }

/* Pilih susunan ikut columns */
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
  filters.daerah = ''
  filters.cawangan = ''
  filters.tarikhMula = ''
  filters.tarikhTamat = ''
  hasSearched.value = false
  results.value = []
}

function onJana () {
  // Demo dataset (meniru mockup)
  const demo = [
    {
      tarikhPemulangan: '2025-08-02T09:15:00',
      idPemulangan: 'PT/2025/00987',
      jenisAkaun: 'Kewangan',
      daerah: 'Klang',
      cawangan: '-',
      namaPemulang: 'Ahmad Razali',
      jumlahDipulangkan: 5000,
      status: 'Selesai',
    },
    {
      tarikhPemulangan: '2025-08-04T11:00:00',
      idPemulangan: 'PT/2025/00988',
      jenisAkaun: 'Operasi Daerah',
      daerah: 'Petaling',
      cawangan: '-',
      namaPemulang: 'Siti Nurhaliza',
      jumlahDipulangkan: 2500,
      status: 'Menunggu Pengesahan',
    },
    {
      tarikhPemulangan: '2025-08-05T10:30:00',
      idPemulangan: 'PT/2025/00989',
      jenisAkaun: 'Cawangan',
      daerah: 'Hulu Langat',
      cawangan: 'Bandar Baru Bangi',
      namaPemulang: 'Nor Azlan',
      jumlahDipulangkan: 1800,
      status: 'Selesai',
    },
    {
      tarikhPemulangan: '2025-08-06T14:15:00',
      idPemulangan: 'PT/2025/00990',
      jenisAkaun: 'Amil',
      daerah: 'Gombak',
      cawangan: '-',
      namaPemulang: 'Azimah Karim',
      jumlahDipulangkan: 3250,
      status: 'Menunggu Pengesahan',
    },
    {
      tarikhPemulangan: '2025-08-06T16:40:00',
      idPemulangan: 'PT/2025/00991',
      jenisAkaun: 'Baitul',
      daerah: 'Sepang',
      cawangan: '-',
      namaPemulang: 'Hafiz Rahman',
      jumlahDipulangkan: 950,
      status: 'Selesai',
    },
    {
      tarikhPemulangan: '2025-08-07T09:50:00',
      idPemulangan: 'PT/2025/00992',
      jenisAkaun: 'DPA',
      daerah: 'Kuala Langat',
      cawangan: '-',
      namaPemulang: 'Farah Nabila',
      jumlahDipulangkan: 4120,
      status: 'Selesai',
    },
    {
      tarikhPemulangan: '2025-08-07T15:20:00',
      idPemulangan: 'PT/2025/00993',
      jenisAkaun: 'Operasi Daerah',
      daerah: 'Kuala Selangor',
      cawangan: '-',
      namaPemulang: 'Roslan Tahir',
      jumlahDipulangkan: 1300,
      status: 'Menunggu Pengesahan',
    },
    {
      tarikhPemulangan: '2025-08-08T10:55:00',
      idPemulangan: 'PT/2025/00994',
      jenisAkaun: 'Cawangan',
      daerah: 'Sabak Bernam',
      cawangan: 'Sungai Besar',
      namaPemulang: 'Zaiton Ahmad',
      jumlahDipulangkan: 2050,
      status: 'Selesai',
    },
  ]

  const start = filters.tarikhMula ? new Date(filters.tarikhMula) : null
  const end   = filters.tarikhTamat ? new Date(filters.tarikhTamat) : null

  let rows = demo.filter(r => {
    if (filters.jenisAkaun && r.jenisAkaun !== filters.jenisAkaun) return false
    if (filters.daerah && r.daerah !== filters.daerah) return false
    if (filters.cawangan && r.cawangan !== filters.cawangan) return false
    if (start && new Date(r.tarikhPemulangan) < start) return false
    if (end && new Date(r.tarikhPemulangan) > end) return false
    return true
  })

  rows.sort((a,b) => new Date(b.tarikhPemulangan) - new Date(a.tarikhPemulangan))

  results.value = rows
  hasSearched.value = true
}

/* -----------------------
 * Export
 * ----------------------*/
function exportCSV () {
  if (!tableData.value.length) return
  const header = [
    'Tarikh Pemulangan','ID Pemulangan','Jenis Akaun','Daerah','Cawangan','Nama Pemulang','Jumlah Dipulangkan (RM)','Status'
  ]
  const data = tableData.value.map(r => ([
    formatDateTime(r.tarikhPemulangan),
    r.idPemulangan,
    r.jenisAkaun,
    r.daerah,
    r.cawangan,
    r.namaPemulang,
    formatRM(r.jumlahDipulangkan),
    r.status,
  ]))
  const csv = [header, ...data].map(a => a.map(x => `"${String(x).replace(/"/g,'""')}"`).join(',')).join('\r\n')
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = 'Laporan_Pemulangan_Tunai_ke_Tabung.csv'; a.click()
  URL.revokeObjectURL(url)
}

function exportPDF () {
  if (!tableData.value.length) return
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const head = [[
    'Tarikh Pemulangan','ID Pemulangan','Jenis Akaun','Daerah','Cawangan','Nama Pemulang','Jumlah Dipulangkan (RM)','Status'
  ]]
  const body = tableData.value.map(r => ([
    formatDateTime(r.tarikhPemulangan),
    r.idPemulangan,
    r.jenisAkaun,
    r.daerah,
    r.cawangan,
    r.namaPemulang,
    formatRM(r.jumlahDipulangkan),
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
      doc.text('Laporan Pemulangan Tunai ke Tabung', doc.internal.pageSize.getWidth()/2, 10, { align: 'center' })
    },
  })

  doc.save('Laporan_Pemulangan_Tunai_ke_Tabung.pdf')
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
  if (s === 'Selesai') return 'success'
  if (s === 'Menunggu Pengesahan') return 'warning'
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
/* Kekalkan rupa design; elak scroll kiri/kanan */
.table-wrapper { overflow-x: visible; }

/* Benarkan wrap pada teks panjang supaya muat sekali lihat */
:deep(table) th,
:deep(table) td {
  white-space: normal;
  word-break: break-word;
}

/* Jumlah (kolum ke-7) kanan selari */
:deep(tbody tr td:nth-child(7)),
:deep(thead tr th:nth-child(7)) {
  text-align: right;
  white-space: nowrap;
}
</style>
