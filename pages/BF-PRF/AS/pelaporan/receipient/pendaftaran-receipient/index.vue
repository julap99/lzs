<template>
  <div>
    <layouts-breadcrumb :items="breadcrumb" />

    <!-- PENAPIS / CARIAN -->
    <rs-card class="mt-4">
      <template #header>
        <h2 class="text-base font-semibold">Penapis Laporan</h2>
      </template>
      <template #body>
        <FormKit type="form" :actions="false" id="rcpForm" @submit="onJana">
          <div class="grid gap-6 md:grid-cols-3">
            <!-- Jenis Receipient -->
            <FormKit
              type="select"
              label="Jenis Receipient"
              v-model="filters.jenis"
              :options="jenisOptions"
              placeholder="Semua"
              :classes="fkClasses"
            />
          </div>

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
              @click="submitForm('rcpForm')"
            >
              Jana
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- HASIL + EXPORT + HEADER + TABLE (semua dalam SATU kad) -->
    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-end gap-2 print:hidden">
          <rs-button
            variant="primary-outline"
            size="sm"
            class="flex items-center"
            :disabled="!tableRows.length || !hasGenerated"
            @click="exportExcel"
          >
            Export Excel
          </rs-button>
          <rs-button
            variant="primary"
            size="sm"
            class="flex items-center"
            :disabled="!tableRows.length || !hasGenerated"
            @click="exportPDF"
          >
            Export PDF
          </rs-button>
        </div>
      </template>

      <template #body>
        <!-- Empty state sebelum Jana -->
        <div
          v-if="!hasGenerated"
          class="rounded-2xl border border-dashed bg-white p-10 text-center text-gray-500"
        >
          <div class="flex flex-col items-center gap-2">
            <Icon name="iconamoon:arrow-down-2-bold" class="h-8 w-8 opacity-60" />
            <div class="-mt-2 text-xl leading-none">–</div>
            <p class="mt-1 text-base">Sila jana laporan terlebih dahulu</p>
          </div>
        </div>

        <!-- HEADER laporan + TABLE (selepas Jana) -->
        <div v-else class="space-y-4">
          <!-- Header laporan dalam kad yang sama -->
          <div class="flex items-start justify-between gap-6">
            <div class="flex items-start gap-4">
              <img
                src="https://www.zakatselangor.com.my/wp-content/uploads/2018/10/lzs-logo.png"
                alt="LZS"
                class="h-14 w-auto"
              />
              <div class="leading-tight">
                <div class="font-semibold tracking-wide text-[rgb(var(--text-color))]">
                  RR0001
                </div>
                <h2 class="text-xl font-bold text-[rgb(var(--text-color))]">
                  Laporan Pendaftaran Receipient Mengikut Jenis Receipient
                </h2>
              </div>
            </div>

            <!-- Tarikh & Masa jana -->
            <div class="text-sm text-right">
              <div><span class="font-semibold">Tarikh:</span> {{ genDate }}</div>
              <div><span class="font-semibold">Masa:</span> {{ genTime }}</div>
            </div>
          </div>

          <!-- Jadual -->
          <div class="table-wrapper">
            <rs-table
              :data="tableRows"
              :columns="columns"
              :field="['id','nama','jenis','tarikhDaftar']"
              :advanced="true"
              :showSearch="false"
              :showFilter="false"
              :showNoColumn="true"
              :pageSize="10"
              :sort="{ column: 'id', direction: 'asc' }"
              :options="{
                variant:'default', striped:false, bordered:true,
                borderless:false, hover:true, fixed:false
              }"
              :optionsAdvanced="{
                sortable:true, filterable:false, responsive:true, outsideBorder:true
              }"
            >
              <!-- Header -->
              <template #header-id><span class="h-id">ID</span></template>
              <template #header-nama><span class="h-nama">Nama&nbsp;Receipient</span></template>
              <template #header-jenis><span class="h-jenis">Jenis</span></template>
              <template #header-tarikhDaftar><span class="h-tarikh">Tarikh&nbsp;Pendaftaran</span></template>

              <!-- Sel data -->
              <template #id="{ text }"><span class="col-id">{{ text }}</span></template>
              <template #nama="{ text }"><span class="col-nama">{{ text }}</span></template>
              <template #jenis="{ text }"><span class="col-jenis">{{ text }}</span></template>
              <template #tarikhDaftar="{ text }"><span class="col-tarikh">{{ formatDMY(text) }}</span></template>
            </rs-table>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

definePageMeta({ title: 'Laporan Pendaftaran Receipient Mengikut Jenis Receipient' })

/* Breadcrumb */
const breadcrumb = [
  { name: 'Pelaporan', type: 'link', path: '/BF-PRF/AS/pelaporan/receipient' },
  { name: 'Pendaftaran Receipient', type: 'link', path: '/BF-PRF/AS/pelaporan/receipient/pendaftaran-receipient' },
]

/* ========= State jana/report ========= */
const hasGenerated = ref(false)
const generatedAt  = ref(new Date())

function pad(n){ return String(n).padStart(2,'0') }
function formatDMY(d) {
  if (!d) return '-'
  const dt = (d instanceof Date) ? d : new Date(d)
  return `${pad(dt.getDate())}/${pad(dt.getMonth()+1)}/${dt.getFullYear()}`
}
const genDate = computed(() => formatDMY(generatedAt.value))
const genTime = computed(() => {
  const d = new Date(generatedAt.value); return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
})

/* ========= Penapis ========= */
const filters = reactive({ jenis: '' })
const jenisOptions = [
  { value: '', label: 'Semua' },
  { value: 'Individu', label: 'Individu' },
  { value: 'Syarikat', label: 'Syarikat' },
]

/* Kolum label */
const columns = [
  { key: 'id',           label: 'ID' },
  { key: 'nama',         label: 'Nama Receipient' },
  { key: 'jenis',        label: 'Jenis' },
  { key: 'tarikhDaftar', label: 'Tarikh Pendaftaran' },
]

/* Data contoh (17 rekod) */
const rows = ref([
  { id: 'RCP001', nama: 'Ahmad bin Ali',                jenis: 'Individu', tarikhDaftar: '2023-03-15' },
  { id: 'RCP002', nama: 'Siti Aisyah binti Rahman',     jenis: 'Individu', tarikhDaftar: '2023-05-02' },
  { id: 'RCP003', nama: 'Mohd Farid bin Ismail',        jenis: 'Individu', tarikhDaftar: '2024-01-11' },
  { id: 'RCP004', nama: 'Nurul Huda binti Hassan',      jenis: 'Individu', tarikhDaftar: '2024-02-22' },
  { id: 'RCP005', nama: 'Azman bin Karim',              jenis: 'Individu', tarikhDaftar: '2023-12-05' },
  { id: 'RCP006', nama: 'Zainab binti Omar',            jenis: 'Individu', tarikhDaftar: '2024-04-10' },
  { id: 'RCP007', nama: 'Hafiz bin Abdullah',           jenis: 'Individu', tarikhDaftar: '2023-06-19' },
  { id: 'RCP008', nama: 'Khairul Anuar bin Zulkifli',   jenis: 'Individu', tarikhDaftar: '2024-05-28' },
  { id: 'RCP009', nama: 'Farhana binti Mohamad',        jenis: 'Individu', tarikhDaftar: '2023-07-12' },
  { id: 'RCP010', nama: 'Saiful Nizam bin Rahim',       jenis: 'Individu', tarikhDaftar: '2023-11-09' },
  { id: 'RCP011', nama: 'Syarikat Maju Jaya Sdn Bhd',               jenis: 'Syarikat', tarikhDaftar: '2023-11-14' },
  { id: 'RCP012', nama: 'Koperasi Sejahtera Selangor Berhad',       jenis: 'Syarikat', tarikhDaftar: '2024-03-28' },
  { id: 'RCP013', nama: 'Syarikat Cahaya Gemilang Sdn Bhd',         jenis: 'Syarikat', tarikhDaftar: '2023-04-19' },
  { id: 'RCP014', nama: 'Syarikat Dinamik Niaga Sdn Bhd',           jenis: 'Syarikat', tarikhDaftar: '2024-08-07' },
  { id: 'RCP015', nama: 'Alam Hijau Resources',                     jenis: 'Syarikat', tarikhDaftar: '2024-09-16' },
  { id: 'RCP016', nama: 'Global Perkasa Trading Sdn Bhd',           jenis: 'Syarikat', tarikhDaftar: '2023-10-25' },
  { id: 'RCP017', nama: 'Syarikat Seri Makmur Sdn Bhd',             jenis: 'Syarikat', tarikhDaftar: '2024-05-12' },
])

/* Penapis data */
const filteredRows = computed(() => {
  if (!filters.jenis) return rows.value
  return rows.value.filter(r => r.jenis === filters.jenis)
})

/* Data dipaparkan */
const tableRows = computed(() => filteredRows.value)

/* Aksi Jana/Reset */
function onJana () {
  generatedAt.value = new Date()
  hasGenerated.value = true
}
function onReset () {
  filters.jenis = ''
  generatedAt.value = new Date()
  hasGenerated.value = false
}

/* Export Excel (CSV) — ikut gaya Aging (guna data bertapis) */
function exportExcel () {
  if (!tableRows.value.length) return
  const header = ['No','ID','Nama Receipient','Jenis','Tarikh Pendaftaran']
  const data = tableRows.value.map((r, i) => [ i+1, r.id, r.nama, r.jenis, formatDMY(r.tarikhDaftar) ])
  const csv = [header, ...data]
    .map(row => row.map(x => `"${String(x).replace(/"/g,'""')}"`).join(','))
    .join('\r\n')
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `RR0001_Pendaftaran_Receipient_${genDate.value}${filters.jenis ? '_'+filters.jenis : ''}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

/* Export PDF — header bold/hitam + meta Tarikh/Jenis */
function exportPDF () {
  if (!tableRows.value.length) return
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

  const head = [[ 'No','ID','Nama Receipient','Jenis','Tarikh Pendaftaran' ]]
  const body = tableRows.value.map((r, i) => [ i+1, r.id, r.nama, r.jenis, formatDMY(r.tarikhDaftar) ])

  autoTable(doc, {
    head, body, startY: 20,
    styles: { fontSize: 9, cellPadding: 2, valign: 'middle' },
    headStyles: { fillColor: [240,240,240], textColor: [0,0,0], fontStyle: 'bold' },
    margin: { top: 16, left: 10, right: 10, bottom: 12 },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },  // No
      1: { cellWidth: 28 },                    // ID
      2: { cellWidth: 120 },                   // Nama
      3: { cellWidth: 32 },                    // Jenis
      4: { cellWidth: 36 },                    // Tarikh
    },
    didDrawPage: () => {
      doc.setFontSize(14); doc.setFont('helvetica','bold')
      doc.text('RR0001: Laporan Pendaftaran Receipient Mengikut Jenis Receipient',
        doc.internal.pageSize.getWidth()/2, 10, { align:'center' })
      doc.setFontSize(10); doc.setFont('helvetica','normal')
      const meta = `Tarikh: ${genDate.value}${filters.jenis ? '  |  Jenis: ' + filters.jenis : ''}`
      doc.text(meta, doc.internal.pageSize.getWidth()/2, 15, { align:'center' })
    },
  })

  doc.save(`RR0001_Pendaftaran_Receipient_${genDate.value}${filters.jenis ? '_'+filters.jenis : ''}.pdf`)
}

/* Helpers / UI */
function submitForm (id) {
  const form = document.getElementById(id)
  if (!form) return
  if (typeof form.requestSubmit === 'function') form.requestSubmit()
  else {
    const tmp = document.createElement('button'); tmp.type = 'submit'; tmp.style.display = 'none'
    form.appendChild(tmp); tmp.click(); form.removeChild(tmp)
  }
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

<style scoped>
/* Muat satu halaman (tanpa scroll mendatar) */
.table-wrapper { overflow-x: hidden; }

/* ===== Baiki isu "N o ." pada kolum No. ===== */
:deep(.table-content thead th),
:deep(.table-content tbody td) {
  white-space: normal;
  word-break: normal !important;     /* elak pecah huruf */
  overflow-wrap: anywhere;
  vertical-align: middle;
}
:deep(.table-content thead tr th:first-child),
:deep(.table-content tbody tr td:first-child) {
  min-width: 64px; width: 64px; max-width: 64px;
  text-align: center;
  white-space: nowrap !important;
  word-break: keep-all !important;
  overflow-wrap: normal !important;
  letter-spacing: normal;
  line-height: 1.2;
}

/* Header jadual (UI) hitam & bold */
:deep(.table-content thead tr th) {
  color: #000 !important;
  font-weight: 700 !important;
}

/* Kolum lain */
:deep(.col-id)    { white-space: nowrap; }
:deep(.col-jenis) { white-space: nowrap; min-width: 100px; }
:deep(.col-nama)  { min-width: 220px; max-width: 560px; }
:deep(.col-tarikh){ white-space: nowrap; }

/* Border luar & footer */
:deep(table.table-content) { border-color: rgb(var(--border-color)); }
:deep(.table-footer) { border-top: 1px solid rgb(var(--border-color)); }

@media print {
  .print\:hidden { display: none !important; }
}
</style>
