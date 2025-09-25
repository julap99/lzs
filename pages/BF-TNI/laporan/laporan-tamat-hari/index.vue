<template>
  <div>
    <layouts-breadcrumb :items="breadcrumb" />

    <!-- CARD: Tajuk + Carian -->
    <rs-card class="mt-4">
      <template #header>
        <h1 class="text-xl font-bold">Laporan Tamat Hari</h1>
      </template>

      <template #body>
        <FormKit type="form" :actions="false" id="tamatHariForm" @submit="onJana">
          <!-- TARIKH = FULL WIDTH -->
          <div class="w-full">
            <FormKit
              type="date"
              label="Tarikh"
              v-model="tarikh"
              :classes="fkClasses"
              placeholder="dd/mm/yyyy"
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
              @click="submitForm('tamatHariForm')"
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
            <template #tarikhMasa="{ text }">
              <span class="whitespace-nowrap">{{ formatDateTime(text) }}</span>
            </template>
            <template #masuk="{ text }">
              <div class="text-right whitespace-nowrap">{{ text ? formatRM(text) : '-' }}</div>
            </template>
            <template #keluar="{ text }">
              <div class="text-right whitespace-nowrap">{{ text ? formatRM(text) : '-' }}</div>
            </template>
            <template #baki="{ text }">
              <div class="text-right whitespace-nowrap">{{ formatRM(text) }}</div>
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

definePageMeta({ title: 'Laporan Tamat Hari' })

const breadcrumb = [
  { name: 'Laporan', type: 'link', path: '/BF-TNI/laporan' },
  { name: 'Laporan Tamat Hari', type: 'current', path: '/BF-TNI/laporan/laporan-tamat-hari' },
]

/* State */
const tarikh = ref('')
const hasSearched = ref(false)
const results = ref([])

/* Table */
const tableColumns = [
  { key: 'tarikhMasa',   label: 'Tarikh & Masa' },
  { key: 'rujukan',      label: 'Rujukan' },
  { key: 'jenis',        label: 'Jenis Transaksi' },
  { key: 'catatan',      label: 'Catatan' },
  { key: 'pegawai',      label: 'Pegawai' },
  { key: 'masuk',        label: 'Masuk (RM)' },
  { key: 'keluar',       label: 'Keluar (RM)' },
  { key: 'baki',         label: 'Baki (RM)' },
]
const tableSort = { column: 'tarikhMasa', direction: 'asc' }
const tableData = computed(() => results.value)

/* Actions */
function onReset () {
  tarikh.value = ''
  hasSearched.value = false
  results.value = []
}

function onJana () {
  // Data contoh (mockup) sentiasa dipaparkan
  const startBaki = 50000
  const transactions = [
    { tarikhMasa: '2025-08-10T08:35:00', rujukan: 'TUNAI-OP-00123', jenis: 'Tambah Nilai', catatan: 'Tambah nilai dari HQ', pegawai: 'Ali Bin Abu', masuk: 20000, keluar: 0 },
    { tarikhMasa: '2025-08-10T11:05:00', rujukan: 'BTN-SRH-00421', jenis: 'Serahan Bantuan', catatan: 'Bantuan Tunai Asnaf', pegawai: 'Rina Binti Musa', masuk: 0, keluar: 5000 },
    { tarikhMasa: '2025-08-10T15:20:00', rujukan: 'BTN-SRH-00422', jenis: 'Serahan Bantuan', catatan: 'Bantuan Banjir', pegawai: 'Rina Binti Musa', masuk: 0, keluar: 10000 },
    { tarikhMasa: '2025-08-10T17:45:00', rujukan: 'TUNAI-KL-00077', jenis: 'Pengeluaran Tunai', catatan: 'Untuk Operasi Harian', pegawai: 'Mohd Faizal', masuk: 0, keluar: 10000 },
  ]
  let baki = startBaki
  results.value = transactions.map(t => { baki = baki + (t.masuk||0) - (t.keluar||0); return { ...t, baki } })
  hasSearched.value = true
}

/* Export */
function exportExcel () {
  if (!tableData.value.length) return
  const header = ['Tarikh & Masa','Rujukan','Jenis Transaksi','Catatan','Pegawai','Masuk (RM)','Keluar (RM)','Baki (RM)']
  const data = tableData.value.map(r => [
    formatDateTime(r.tarikhMasa), r.rujukan, r.jenis, r.catatan, r.pegawai,
    r.masuk ? formatRM(r.masuk) : '-', r.keluar ? formatRM(r.keluar) : '-', formatRM(r.baki),
  ])
  const csv = [header, ...data].map(a => a.map(x => `"${String(x).replace(/"/g,'""')}"`).join(',')).join('\r\n')
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = 'Laporan_Tamat_Hari.csv'; a.click()
  URL.revokeObjectURL(url)
}

function exportPDF () {
  if (!tableData.value.length) return
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const head = [['Tarikh & Masa','Rujukan','Jenis Transaksi','Catatan','Pegawai','Masuk (RM)','Keluar (RM)','Baki (RM)']]
  const body = tableData.value.map(r => [
    formatDateTime(r.tarikhMasa), r.rujukan, r.jenis, r.catatan, r.pegawai,
    r.masuk ? formatRM(r.masuk) : '-', r.keluar ? formatRM(r.keluar) : '-', formatRM(r.baki),
  ])
  autoTable(doc, {
    head, body, startY: 18,
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [240, 240, 240] },
    columnStyles: { 5: { halign: 'right' }, 6: { halign: 'right' }, 7: { halign: 'right' } },
    margin: { top: 16, left: 10, right: 10, bottom: 12 },
    didDrawPage: () => {
      doc.setFontSize(14); doc.setFont('helvetica', 'bold')
      doc.text('Laporan Tamat Hari', doc.internal.pageSize.getWidth()/2, 10, { align: 'center' })
    },
  })
  doc.save('Laporan_Tamat_Hari.pdf')
}

/* Helpers */
function submitForm (id) {
  const form = document.getElementById(id)
  if (!form) return
  if (typeof form.requestSubmit === 'function') form.requestSubmit()
  else {
    const tmp = document.createElement('button'); tmp.type = 'submit'; tmp.style.display = 'none'
    form.appendChild(tmp); tmp.click(); form.removeChild(tmp)
  }
}

const formatRM = n => new Intl.NumberFormat('ms-MY',{ minimumFractionDigits:2, maximumFractionDigits:2 }).format(Number(n)||0)

function formatDateTime (iso) {
  const d = new Date(iso)
  const yyyy = d.getFullYear(), mm = String(d.getMonth()+1).padStart(2,'0'), dd = String(d.getDate()).padStart(2,'0')
  const hh = String(d.getHours()).padStart(2,'0'), min = String(d.getMinutes()).padStart(2,'0')
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`
}

/* FormKit full width */
const fkClasses = {
  outer: 'w-full space-y-1',
  label: 'text-sm font-medium text-gray-900',
  inner: 'w-full mt-1 formkit-disabled:opacity-60 rounded-xl border bg-white focus-within:ring-2 focus-within:ring-blue-500',
  input: 'w-full rounded-xl border-0 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none',
  help: 'text-xs text-gray-500 mt-1',
  messages: 'text-xs text-red-600 mt-1',
}
</script>

<style scoped>
.table-wrapper { overflow-x: visible; }
:deep(table) th, :deep(table) td { white-space: normal; word-break: break-word; }
:deep(thead tr th:nth-child(6)), :deep(tbody tr td:nth-child(6)),
:deep(thead tr th:nth-child(7)), :deep(tbody tr td:nth-child(7)),
:deep(thead tr th:nth-child(8)), :deep(tbody tr td:nth-child(8)) {
  text-align: right; white-space: nowrap;
}
</style>
