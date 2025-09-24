<template>
  <div class="p-6 space-y-4">
    <!-- Breadcrumb -->
    <div>
      <layouts-breadcrumb :items="breadcrumb" />
    </div>

    <!-- ===================== -->
    <!-- CARD: Penapis/Carian -->
    <!-- ===================== -->
    <rs-card class="mt-2">
      <template #header>
        <h2 class="text-base font-semibold">Penapis Laporan</h2>
      </template>
      <template #body>
        <FormKit type="form" :actions="false" id="agingForm" @submit="onJana">
          <div class="grid gap-6 md:grid-cols-3">
            <!-- Daerah -->
            <FormKit
              type="select"
              label="Daerah"
              v-model="filters.daerah"
              :options="daerahOptions"
              placeholder="Semua"
              :classes="fkClasses"
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
              @click="submitForm('agingForm')"
            >
              Jana
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- ===================== -->
    <!-- Kad laporan utama     -->
    <!-- ===================== -->
    <rs-card class="mt-2">
      <div class="p-4 md:p-6 space-y-4">
        <!-- ====== SEBELUM JANA: empty state ====== -->
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

        <!-- ====== SELEPAS JANA: header + export + table ====== -->
        <div v-else class="space-y-4">
          <!-- Header: logo kiri, kod + tajuk; tarikh kanan -->
          <div class="flex items-start justify-between gap-6">
            <div class="flex items-center gap-4">
              <img
                src="/assets/img/logo/lzs-logo-main.png"
                alt="LZS"
                class="h-12 w-auto"
              />
              <div class="leading-tight">
                <div class="font-semibold tracking-wide text-[rgb(var(--text-color))]">
                  {{ reportCode }}
                </div>
                <h2 class="text-lg font-semibold text-[rgb(var(--text-color))]">
                  {{ reportName }}
                </h2>
              </div>
            </div>

            <div class="text-sm text-right">
              <div><span class="opacity-70">Tarikh:</span> {{ formatDate(generatedAt) }}</div>
            </div>
          </div>

          <!-- Export actions -->
          <div class="flex justify-end gap-2 print:hidden">
            <rs-button
              variant="primary-outline"
              size="sm"
              class="flex items-center"
              :disabled="!tableRows.length"
              @click="exportExcel"
            >
              Export Excel
            </rs-button>
            <rs-button
              variant="primary"
              size="sm"
              class="flex items-center"
              :disabled="!tableRows.length"
              @click="exportPDF"
            >
              Export PDF
            </rs-button>
          </div>

          <!-- Jadual laporan -->
          <div>
            <rs-table
              :field="field"
              :columns="columns"
              :data="tableRows"
              :advanced="true"
              :showNoColumn="true"
              :showSearch="false"
              :showFilter="false"
              :options="tableOptions"
              :optionsAdvanced="tableAdv"
              :pageSize="25"
            />
          </div>
        </div>
      </div>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

definePageMeta({ title: 'Pelaporan — Laporan Aging Profil Asnaf' })

// ===== Breadcrumb =====
const breadcrumb = [
  { name: 'Pelaporan', type: 'link', path: '/BF-PRF/pelaporan' },
  { name: 'Laporan Aging Profil Asnaf', type: 'text' },
]

// ===== Meta laporan =====
const reportCode = 'RP0001'
const reportName = 'Laporan Aging Profil Asnaf'

// ===== State paparan =====
const hasGenerated = ref(false)

// ===== Penapis =====
const filters = reactive({ daerah: '' })

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

// ===== Data contoh =====
const sourceRows = ref([
  {
    id: 1,
    noId: 'A1001',
    nama: 'Ahmad bin Ali',
    alamat: '52, Jalan Langat, 41200 Klang, Selangor',
    daerah: 'Klang',
    poskod: '41200',
    kariah: 'Masjid Kampung Johan Setia',
    telefon: '017-3456715',
    tarikhKemaskini: new Date('2022-12-01'),
  },
  {
    id: 2,
    noId: 'A1002',
    nama: 'Siti binti Osman',
    alamat: 'No 2650, Persiaran Kayangan, Seksyen 7, 40000 Shah Alam, Selangor',
    daerah: 'Shah Alam',
    poskod: '40000',
    kariah: 'Masjid Seksyen 7',
    telefon: '019-3204871',
    tarikhKemaskini: new Date('2023-06-05'),
  },
  {
    id: 3,
    noId: 'A1003',
    nama: 'Rahman bin Salleh',
    alamat: 'KM 24, Jalan Pahang Lama, 53100 Gombak, Selangor',
    daerah: 'Gombak',
    poskod: '53100',
    kariah: 'Masjid Zakaria Baru',
    telefon: '013-2323476',
    tarikhKemaskini: new Date('2024-02-01'),
  },
])

// ===== Masa jana =====
const generatedAt = ref(new Date())
function onJana () {
  generatedAt.value = new Date()
  hasGenerated.value = true
}

// ===== Util format =====
function pad(n) { return n.toString().padStart(2, '0') }
function formatDate(d) {
  if (!d) return '-'
  const dt = new Date(d)
  return `${pad(dt.getDate())}/${pad(dt.getMonth() + 1)}/${dt.getFullYear()}`
}

// ===== rs-table config =====
const field = [
  'No Kad Pengenalan/Foreign ID',
  'Nama',
  'Alamat Terkini',
  'Daerah',
  'Poskod',
  'Kariah',
  'No Telefon',
  'Tarikh Terakhir Kemaskini Profil',
]

const columns = [
  { key: 'NoKadPengenalan', label: 'No Kad Pengenalan/Foreign ID' },
  { key: 'Nama', label: 'Nama' },
  { key: 'AlamatTerkini', label: 'Alamat Terkini' },
  { key: 'Daerah', label: 'Daerah' },
  { key: 'Poskod', label: 'Poskod' },
  { key: 'Kariah', label: 'Kariah' },
  { key: 'NoTelefon', label: 'No Telefon' },
  { key: 'TarikhTerakhirKemaskiniProfil', label: 'Tarikh Terakhir Kemaskini Profil' },
]

// Penapis ikut daerah
const filteredRows = computed(() => {
  if (!filters.daerah) return sourceRows.value
  return sourceRows.value.filter(r => r.daerah === filters.daerah)
})

// Bentuk data untuk rs-table
const tableRows = computed(() =>
  filteredRows.value.map((r) => ({
    NoKadPengenalan: r.noId,
    Nama: r.nama,
    AlamatTerkini: r.alamat,
    Daerah: r.daerah,
    Poskod: r.poskod,
    Kariah: r.kariah,
    NoTelefon: r.telefon,
    TarikhTerakhirKemaskiniProfil: formatDate(r.tarikhKemaskini),
  }))
)

const tableOptions = {
  variant: 'default',
  striped: true,
  bordered: true,
  borderless: false,
  hover: true,
  fixed: false,
}

// ✅ Aktifkan border tepi luar (left/right/top/bottom) pada rs-table
const tableAdv = {
  sortable: false,
  filterable: false,
  responsive: true,
  outsideBorder: true,
}

/* ======================
   Export helpers
   ====================== */
function exportExcel () {
  if (!tableRows.value.length) return

  const header = [
    'Bil',
    'No Kad Pengenalan/Foreign ID',
    'Nama',
    'Alamat Terkini',
    'Daerah',
    'Poskod',
    'Kariah',
    'No Telefon',
    'Tarikh Terakhir Kemaskini Profil',
  ]
  const data = tableRows.value.map((r, i) => ([
    i + 1,
    r.NoKadPengenalan,
    r.Nama,
    r.AlamatTerkini,
    r.Daerah,
    r.Poskod,
    r.Kariah,
    r.NoTelefon,
    r.TarikhTerakhirKemaskiniProfil,
  ]))

  // Escape CSV + newline Windows + BOM untuk Excel
  const csv = [header, ...data]
    .map(row => row.map(x => `"${String(x).replace(/"/g,'""')}"`).join(','))
    .join('\r\n')

  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'Laporan_Aging_Profil_Asnaf.csv'
  a.click()
  URL.revokeObjectURL(url)
}

function exportPDF () {
  if (!tableRows.value.length) return

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const head = [[
    'Bil',
    'No Kad Pengenalan/Foreign ID',
    'Nama',
    'Alamat Terkini',
    'Daerah',
    'Poskod',
    'Kariah',
    'No Telefon',
    'Tarikh Terakhir Kemaskini Profil',
  ]]
  const body = tableRows.value.map((r, i) => ([
    i + 1,
    r.NoKadPengenalan,
    r.Nama,
    r.AlamatTerkini,
    r.Daerah,
    r.Poskod,
    r.Kariah,
    r.NoTelefon,
    r.TarikhTerakhirKemaskiniProfil,
  ]))

  autoTable(doc, {
    head,
    body,
    startY: 18,
    styles: { fontSize: 9, cellPadding: 2 },
    // ✅ Header PDF: hitam & tebal
    headStyles: {
      fillColor: [240, 240, 240], // latar kelabu lembut (boleh tukar ke [255,255,255] kalau nak putih)
      textColor: [0, 0, 0],       // hitam
      fontStyle: 'bold',          // tebal
    },
    margin: { top: 16, left: 10, right: 10, bottom: 12 },
    didDrawPage: () => {
      doc.setFontSize(14); doc.setFont('helvetica','bold')
      doc.text('Laporan Aging Profil Asnaf', doc.internal.pageSize.getWidth()/2, 10, { align:'center' })
      doc.setFontSize(10); doc.setFont('helvetica','normal')
      const meta = `Tarikh: ${formatDate(generatedAt.value)}${filters.daerah ? '  |  Daerah: ' + filters.daerah : ''}`
      doc.text(meta, doc.internal.pageSize.getWidth()/2, 15, { align:'center' })
    },
  })

  doc.save('Laporan_Aging_Profil_Asnaf.pdf')
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

function onReset () {
  filters.daerah = ''
  generatedAt.value = new Date()
  hasGenerated.value = false
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
/* Teks boleh balut */
:deep(.table-content thead tr th),
:deep(.table-content tbody tr td) {
  white-space: normal;
}

/* Header jadual (UI) hitam & bold */
:deep(.table-content thead tr th) {
  color: #000 !important;
  font-weight: 700 !important;
}

/* Kolum No. (auto) – kecil & center */
:deep(.table-content thead tr th:nth-child(1)),
:deep(.table-content tbody tr td:nth-child(1)) {
  min-width: 64px !important;
  width: 72px !important;
  max-width: 80px !important;
  text-align: center;
  padding-left: 1rem !important;
  padding-right: 1rem !important;
}

/* Kolum alamat lebih luas */
:deep(.table-content thead tr th:nth-child(4)),
:deep(.table-content tbody tr td:nth-child(4)) {
  min-width: 280px !important;
}

/* Garis tepi & footer */
:deep(.table-wrapper) {
  border: 1px solid rgb(var(--border-color));
  border-radius: 0.75rem;
  overflow: hidden;
}
:deep(.table-footer) {
  border-top: 1px solid rgb(var(--border-color));
}

@media print {
  .print\:hidden { display: none !important; }
}
</style>
