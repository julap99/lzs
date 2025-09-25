<template>
  <div>
    <layouts-breadcrumb :items="breadcrumb" />

    <!-- CARD: Carian -->
    <rs-card class="mt-4">
      <template #header>
        <h1 class="text-xl font-bold">Carian</h1>
      </template>

      <template #body>
        <FormKit type="form" :actions="false" id="carianForm" @submit="onCari">
          <div class="grid gap-6 md:grid-cols-2">
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
              placeholder="Semua Daerah"
              :classes="fkClasses"
            />

            <!-- Cawangan (muncul bila jenis akaun Cawangan/Kewangan) -->
            <FormKit
              v-if="showCawangan"
              type="select"
              label="Cawangan"
              v-model="filters.cawangan"
              :options="cawanganOptions"
              :disabled="!canPickCawangan"
              placeholder="-- Pilih Daerah Dahulu --"
              help="Dipaparkan jika pilihan Jenis Akaun ialah Cawangan atau Kewangan."
              :classes="fkClasses"
            />

            <!-- Tarikh -->
            <FormKit
              type="date"
              label="Tarikh"
              v-model="filters.tarikh"
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

            <!-- Submit via rs-button (programmatic submit) -->
            <rs-button
              variant="primary"
              size="sm"
              class="!h-9 !px-4 !py-2 !text-sm !rounded-xl !leading-none align-middle"
              @click="submitForm('carianForm')"
            >
              Cari
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- CARD: Senarai + Export -->
    <rs-card class="mt-4">
      <template #header>
        <div class="flex flex-col gap-1 w-full">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-semibold">Senarai Serahan Tunai</h2>
            <div class="flex gap-2">
              <rs-button
                variant="primary-outline"
                size="sm"
                class="flex items-center"
                :disabled="!results.length"
                @click="downloadExcel"
              >
                <Icon name="mdi:microsoft-excel" class="mr-1" size="15" />
                Excel
              </rs-button>
              <rs-button
                variant="primary"
                size="sm"
                class="flex items-center"
                :disabled="!results.length"
                @click="downloadPDF"
              >
                <Icon name="mdi:file-pdf-box" class="mr-1" size="15" />
                PDF
              </rs-button>
            </div>
          </div>
          <p class="text-xs text-gray-500">
            Rekod dipaparkan:
            <span class="font-semibold">{{ results.length }}</span>
            <span v-if="filters.tarikh" class="ml-1">pada {{ filters.tarikh }}</span>
          </p>
        </div>
      </template>

      <template #body>
        <!-- Empty state / Results -->
        <div
          v-if="!hasSearched"
          class="rounded-2xl border border-dashed p-10 text-center text-gray-500"
        >
          <div class="text-4xl">⌄</div>
          <p class="mt-3">Sila buat carian dahulu</p>
        </div>

        <div v-else>
          <div v-if="results.length === 0" class="rounded-xl border p-6 text-gray-500">
            Tiada rekod ditemui untuk kriteria carian.
          </div>

          <div v-else class="overflow-x-auto rounded-xl border">
            <table class="min-w-full text-sm" aria-label="Senarai Serahan Tunai">
              <thead class="bg-gray-50">
                <tr class="text-left">
                  <th class="px-4 py-3 font-semibold">ID Transaksi</th>
                  <th class="px-4 py-3 font-semibold">Tarikh &amp; Masa</th>
                  <th class="px-4 py-3 font-semibold">Jenis Transaksi</th>
                  <th class="px-4 py-3 font-semibold">Nama Asnaf</th>
                  <th class="px-4 py-3 font-semibold">No. Kad Pengenalan</th>
                  <th class="px-4 py-3 font-semibold">Jumlah (RM)</th>
                  <th class="px-4 py-3 font-semibold">Pegawai Serahan</th>
                  <th class="px-4 py-3 font-semibold">Status Serahan</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in results" :key="row.id" class="border-t">
                  <td class="px-4 py-3">{{ row.id }}</td>
                  <td class="px-4 py-3">{{ formatDateTime(row.datetime) }}</td>
                  <td class="px-4 py-3">
                    <rs-badge
                      :variant="getJenisVariant(row.jenisTransaksi)"
                      class="!text-xs !px-2 !py-0.5 !rounded-full"
                    >
                      {{ row.jenisTransaksi }}
                    </rs-badge>
                  </td>
                  <td class="px-4 py-3">{{ row.nama }}</td>
                  <td class="px-4 py-3">{{ row.nokp }}</td>
                  <td class="px-4 py-3">{{ formatRM(row.jumlah) }}</td>
                  <td class="px-4 py-3">{{ row.pegawai }}</td>
                  <td class="px-4 py-3">
                    <rs-badge
                      :variant="getStatusVariant(row.status)"
                      class="!text-xs !px-2 !py-0.5 !rounded-full"
                    >
                      {{ row.status }}
                    </rs-badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import ExcelJS from 'exceljs'

definePageMeta({ title: 'Laporan Serahan Bantuan Tunai' })

const breadcrumb = [
  { name: 'Laporan', type: 'link', path: '/BF-TNI/laporan' },
  { name: 'Laporan Serahan Bantuan Tunai', type: 'current', path: '/BF-TNI/laporan/serahan-bantuan-tunai' },
]

/* -----------------------
 * State & Pilihan
 * ----------------------*/
const filters = reactive({
  jenisAkaun: '',
  daerah: '',
  cawangan: '',
  tarikh: '', // yyyy-mm-dd
})

const jenisAkaunOptions = [
  'Kewangan',
  'Operasi Daerah',
  'Cawangan',
  'Amil',
  'Baitul',
  'DPA',
]

const daerahOptions = [
  { value: '', label: 'Semua Daerah' },
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

// Dummy peta cawangan ikut daerah — ganti dengan data sebenar
const cawanganByDaerah = {
  Gombak: ['Batu Caves', 'Selayang'],
  'Hulu Langat': ['Bandar Baru Bangi', 'Kajang'],
  Klang: ['Klang Utara', 'Klang Selatan'],
  'Kuala Langat': ['Banting'],
  'Kuala Selangor': ['Kuala Selangor'],
  Petaling: ['PJ', 'Subang Jaya'],
  'Sabak Bernam': ['Sabak Bernam'],
  Sepang: ['Cyberjaya', 'Dengkil'],
  'Shah Alam': ['Seksyen 7', 'Seksyen 19'],
}

/* -----------------------
 * UI Logic
 * ----------------------*/
const showCawangan = computed(() =>
  ['Cawangan', 'Kewangan'].includes(filters.jenisAkaun)
)
const canPickCawangan = computed(() =>
  showCawangan.value && !!filters.daerah
)
const cawanganOptions = computed(() => {
  if (!filters.daerah) return []
  const list = cawanganByDaerah[filters.daerah] || []
  return list.map(c => ({ value: c, label: c }))
})
watch(() => [filters.jenisAkaun, filters.daerah], () => {
  filters.cawangan = ''
})

/* -----------------------
 * Actions (Cari/Reset)
 * ----------------------*/
const hasSearched = ref(false)
const results = ref([])

function onReset() {
  filters.jenisAkaun = ''
  filters.daerah = ''
  filters.cawangan = ''
  filters.tarikh = ''
  hasSearched.value = false
  results.value = []
}

function onCari(values) {
  // MOCK demo – tukar ke panggilan API sebenar bila sedia
  hasSearched.value = true
  const demo = [
    { id: 'TN-0001', datetime: '2025-05-08T09:15:00', jenisTransaksi: 'Agihan Lain-Lain', nama: 'Aslam',   nokp: '15460464',      jumlah: 70000, pegawai: 'Ahmad Zulkarnain', status: 'Selesai' },
    { id: 'TN-0002', datetime: '2025-05-21T11:30:00', jenisTransaksi: 'Tunai Kaunter',    nama: 'Amri',    nokp: '560844213',     jumlah: 5000,  pegawai: 'Noraini Binti Ali',  status: 'Gagal' },
    { id: 'TN-0003', datetime: '2025-08-25T14:45:00', jenisTransaksi: 'Agihan Lain-Lain', nama: 'Fatimah', nokp: '780120045678',  jumlah: 3500,  pegawai: 'Mohd Salleh',        status: 'Selesai' },
    { id: 'TN-0004', datetime: '2025-08-30T16:10:00', jenisTransaksi: 'Tunai Kaunter',    nama: 'Rahman',  nokp: '650321088899',  jumlah: 1200,  pegawai: 'Siti Aminah',        status: 'Selesai' },
    { id: 'TN-0005', datetime: '2025-09-01T10:05:00', jenisTransaksi: 'Agihan Lain-Lain', nama: 'Salmah',  nokp: '900101036666',  jumlah: 2000,  pegawai: 'Ahmad Zulkarnain',   status: 'Dalam Proses' },
    { id: 'TN-0006', datetime: '2025-09-02T15:20:00', jenisTransaksi: 'Tunai Kaunter',    nama: 'Halim',   nokp: '810412088990',  jumlah: 800,   pegawai: 'Noraini Binti Ali',  status: 'Selesai' },
  ]
  results.value = values.tarikh
    ? demo.filter(r => r.datetime.slice(0,10) === values.tarikh)
    : demo
}

/* -----------------------
 * Util format & badge mapping
 * ----------------------*/
const formatRM = n =>
  new Intl.NumberFormat('ms-MY', { minimumFractionDigits: 0 }).format(n)
const pad2 = n => String(n).padStart(2, '0')
function formatDateTime(iso) {
  const d = new Date(iso)
  const dd = pad2(d.getDate())
  const mm = pad2(d.getMonth() + 1)
  const yyyy = d.getFullYear()
  let h = d.getHours()
  const m = pad2(d.getMinutes())
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  return `${dd}/${mm}/${yyyy} ${pad2(h)}:${m} ${ampm}`
}
const getJenisVariant = (jenis) => {
  const map = {
    'Agihan Lain-Lain': 'success',
    'Tunai Kaunter': 'danger',
  }
  return map[jenis] || 'secondary'
}
const getStatusVariant = (status) => {
  const map = {
    'Selesai': 'primary',
    'Dalam Proses': 'warning',
    'Gagal': 'danger',
    'Lulus': 'success',
    'Menunggu': 'warning',
    'Ditolak': 'danger',
    'Draf': 'disabled',
    'Baru': 'info',
    'Aktif': 'primary',
  }
  return map[status] || 'secondary'
}

/* -----------------------
 * Export: PDF (table) & Excel (table)
 * ----------------------*/
function downloadPDF () {
  if (!results.value.length) return
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

  const head = [[
    'ID Transaksi',
    'Tarikh & Masa',
    'Jenis Transaksi',
    'Nama Asnaf',
    'No. Kad Pengenalan',
    'Jumlah (RM)',
    'Pegawai Serahan',
    'Status Serahan'
  ]]

  const body = results.value.map(r => ([
    r.id,
    formatDateTime(r.datetime),
    r.jenisTransaksi,
    r.nama,
    r.nokp,
    formatRM(r.jumlah),
    r.pegawai,
    r.status,
  ]))

  autoTable(doc, {
    head,
    body,
    startY: 18,
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [240, 240, 240] },
    columnStyles: { 5: { halign: 'right' } },
    margin: { top: 16, left: 10, right: 10, bottom: 12 },
    didDrawPage: () => {
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Senarai Serahan Tunai', doc.internal.pageSize.getWidth() / 2, 10, { align: 'center' })
    },
  })

  doc.save('Senarai_Serahan_Tunai.pdf')
}

async function downloadExcel () {
  if (!results.value.length) return
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet('Serahan Tunai', {
    views: [{ state: 'frozen', ySplit: 1 }],
    properties: { defaultRowHeight: 18 }
  })

  ws.columns = [
    { header: 'ID Transaksi',         key: 'id',              width: 16 },
    { header: 'Tarikh & Masa',        key: 'datetime',        width: 22 },
    { header: 'Jenis Transaksi',      key: 'jenisTransaksi',  width: 18 },
    { header: 'Nama Asnaf',           key: 'nama',            width: 22 },
    { header: 'No. Kad Pengenalan',   key: 'nokp',            width: 20 },
    { header: 'Jumlah (RM)',          key: 'jumlah',          width: 14, style: { numFmt: '#,##0' } },
    { header: 'Pegawai Serahan',      key: 'pegawai',         width: 22 },
    { header: 'Status Serahan',       key: 'status',          width: 16 },
  ]
  ws.autoFilter = { from: 'A1', to: 'H1' }

  results.value.forEach(r => {
    ws.addRow({
      id: r.id,
      datetime: formatDateTime(r.datetime),
      jenisTransaksi: r.jenisTransaksi,
      nama: r.nama,
      nokp: r.nokp,
      jumlah: Number(r.jumlah) || 0,
      pegawai: r.pegawai,
      status: r.status,
    })
  })

  const header = ws.getRow(1)
  header.font = { bold: true }
  header.alignment = { vertical: 'middle', horizontal: 'left' }
  header.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } }

  const lastRowNum = ws.lastRow ? ws.lastRow.number : 1
  for (let r = 1; r <= lastRowNum; r++) {
    const row = ws.getRow(r)
    row.eachCell((cell, colNumber) => {
      cell.border = {
        top:    { style: 'thin', color: { argb: 'FFDDDDDD' } },
        left:   { style: 'thin', color: { argb: 'FFDDDDDD' } },
        bottom: { style: 'thin', color: { argb: 'FFDDDDDD' } },
        right:  { style: 'thin', color: { argb: 'FFDDDDDD' } },
      }
      if (colNumber === 6 && r !== 1) {
        cell.alignment = { horizontal: 'right' }
      }
    })
  }

  ws.pageSetup = {
    orientation: 'landscape',
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    horizontalCentered: true,
    margins: { left: 0.3, right: 0.3, top: 0.5, bottom: 0.5, header: 0.3, footer: 0.3 }
  }

  const buf = await wb.xlsx.writeBuffer()
  const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'Laporan_Serahan_Tunai.xlsx'
  a.click()
  URL.revokeObjectURL(url)
}

/* -----------------------
 * Helpers
 * ----------------------*/
// Trigger FormKit form submit; uses requestSubmit when available
function submitForm (id) {
  const form = document.getElementById(id)
  if (!form) return
  if (typeof form.requestSubmit === 'function') {
    form.requestSubmit()
  } else {
    // Fallback: create a temporary submit button to fire a real submit event
    const tmp = document.createElement('button')
    tmp.type = 'submit'
    tmp.style.display = 'none'
    form.appendChild(tmp)
    tmp.click()
    form.removeChild(tmp)
  }
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
