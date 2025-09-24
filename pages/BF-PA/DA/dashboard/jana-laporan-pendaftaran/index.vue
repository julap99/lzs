<template>
  <div class="space-y-4">
    <!-- Breadcrumb -->
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- ===== 3.1.1 Tajuk / Meta Laporan ===== -->
    <rs-card>
      <template #header>
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center gap-3">
            <Icon name="mdi:file-document-outline" />
            <span class="font-semibold">Laporan Statistik Pendaftaran Penolong Amil</span>
          </div>
          <div class="flex gap-2">
            <rs-button variant="primary" @click="onPrint">Cetak</rs-button>
            <rs-button variant="soft" @click="exportXLSX">Excel (XLSX)</rs-button>
            <rs-button variant="soft" @click="exportCSV">CSV</rs-button>
          </div>
        </div>
      </template>
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="space-y-1">
            <div><span class="font-medium">Tajuk Laporan:</span> Laporan Statistik Pendaftaran Penolong Amil</div>
            <div><span class="font-medium">Organisasi:</span> Lembaga Zakat Selangor</div>
            <div><span class="font-medium">Klasifikasi:</span> <rs-badge variant="soft">Dalaman</rs-badge></div>
          </div>
          <div class="space-y-1">
            <div><span class="font-medium">Dijana Oleh:</span> {{ generatedBy }}</div>
            <div><span class="font-medium">Tarikh/Capa Masa Jana:</span> {{ generatedAtLabel }}</div>
            <div><span class="font-medium">Tempoh:</span> Tahun {{ filters.tahun }}<span v-if="filters.bulan !== 'ALL'">, Bulan {{ filters.bulan }}</span></div>
          </div>
          <div class="space-y-1">
            <div class="font-medium">Ringkasan Penapis</div>
            <div>Daerah: {{ filters.daerah === 'ALL' ? 'Semua' : filters.daerah }}</div>
            <div>Kategori PA: {{ filters.kategori === 'ALL' ? 'Semua' : filters.kategori }}</div>
          </div>
        </div>

        <!-- Penapis ringkas (optional) -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
          <FormKit type="select" v-model="filters.tahun" label="Tahun" :options="tahunOptions" />
          <FormKit type="select" v-model="filters.bulan" label="Bulan" :options="bulanOptions" />
          <FormKit type="select" v-model="filters.daerah" label="Daerah" :options="daerahOptions" />
          <FormKit type="select" v-model="filters.kategori" label="Kategori PA" :options="kategoriOptions" />
        </div>
      </template>
    </rs-card>

    <!-- ===== 3.2.2 Seksyen Kumpulan: Daerah → Kategori PA (page break setiap Daerah) ===== -->
    <div v-for="(byKategori, daerah) in grouped" :key="daerah" class="report-section print-break">
      <div class="flex items-center justify-between mt-2 mb-1">
        <div class="text-lg font-semibold flex items-center gap-2">
          <Icon name="mdi:map-marker-radius-outline" /> Daerah: {{ daerah }}
        </div>
        <rs-badge variant="soft">Klasifikasi: Dalaman</rs-badge>
      </div>
      <div class="text-sm text-gray-600 mb-3">Kumpulan mengikut Kategori PA</div>

      <div v-for="(rows, kategori) in byKategori" :key="kategori" class="mb-6">
        <div class="font-medium mb-2 flex items-center gap-2">
          <Icon name="mdi:shield-account-outline" /> Kategori PA: {{ kategori }}
        </div>

        <!-- ===== 3.2.1 Jadual Utama (Read-only) ===== -->
        <RsTable
          :data="rows"
          :columns="columns"
          :showNoColumn="false"
          :showSearch="false"
          :showFilter="false"
          :options="{ variant: 'default', striped: true, hover: false, borderless: false }"
          :optionsAdvanced="{ sortable: true, filterable: false, responsive: true, outsideBorder: true }"
          advanced
        >
          <!-- Formatters per spesifikasi -->
          <template #noKP="{ text }">{{ maskNRIC(text) }}</template>

          <template #tarikhPermohonan="{ text }">{{ formatDate(text) }}</template>
          <template #tarikhKelulusan="{ text }">{{ formatDate(text) }}</template>
          <template #tarikhMulaLantikan="{ text }">{{ formatDate(text) }}</template>
          <template #tarikhTamatLantikan="{ text }">
            <span :class="isExpired(text) ? 'text-danger-600 font-semibold' : ''">
              {{ formatDate(text) }}
            </span>
          </template>

          <template #tempohBulan="{ value }">
            <span>{{ monthDiffFromRow(value) }}</span>
            </template>


          <template #statusPerkhidmatan="{ text }">
            <rs-badge :variant="statusVariant(text)">{{ text }}</rs-badge>
          </template>
        </RsTable>
      </div>
    </div>

    <!-- ===== 3.3 Bahagian Tandatangan / Footer ===== -->
    <div class="bg-white rounded-2xl border p-5 space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div class="font-medium mb-3">Disediakan oleh</div>
          <div class="h-16 border-b"></div>
          <div class="text-sm mt-2 text-gray-600">Nama & Tarikh</div>
        </div>
        <div>
          <div class="font-medium mb-3">Disemak oleh</div>
          <div class="h-16 border-b"></div>
          <div class="text-sm mt-2 text-gray-600">Nama & Tarikh</div>
        </div>
        <div>
          <div class="font-medium mb-3">Diluluskan oleh</div>
          <div class="h-16 border-b"></div>
          <div class="text-sm mt-2 text-gray-600">Nama & Tarikh</div>
        </div>
      </div>
      <div class="text-xs text-gray-500">
        Klasifikasi: Dalaman • Dihasilkan pada {{ generatedAtLabel }} • “Muka surat” akan dipapar dalam mod cetak.
      </div>
    </div>

    <!-- Footer print (page x/y) -->
    <div class="page-footer print-only">Muka surat <span class="page-number"></span> / <span class="total-pages"></span></div>
  </div>
</template>

<script setup lang="ts">
/**
 * PA-DA-PD-02 (Pendaftaran) — Jana Laporan Statistik Pendaftaran Penolong Amil
 * - Header meta (tajuk, organisasi, masa jana, dijana oleh, tempoh, ringkasan penapis)
 * - Jadual read-only dengan kolum & format yang ditetapkan
 * - Kumpulan: Daerah → Kategori PA (page-break setiap Daerah)
 * - Footer: Disediakan/Disemak/Diluluskan, muka surat x/y, klasifikasi
 */
import { ref, reactive, computed, onMounted } from 'vue'

defineOptions({ name: 'PA-DA-PD-02-Pendaftaran' })

/* ===== Breadcrumb ===== */
const breadcrumb = ref([
  { name: 'Dashboard', type: 'text', path: '/' },
  { name: 'Laporan Pendaftaran ', type: 'text', path: '#' },
])

/* ===== Filters (for header summary) ===== */
const filters = reactive({
  tahun: new Date().getFullYear().toString(),
  bulan: 'ALL', // 01..12 or ALL
  daerah: 'ALL',
  kategori: 'ALL',
})

const tahunOptions = [
  { label: '2023', value: '2023' },
  { label: '2024', value: '2024' },
  { label: '2025', value: '2025' },
]
const bulanOptions = [
  { label: 'Semua', value: 'ALL' },
  ...Array.from({ length: 12 }, (_, i) => {
    const m = String(i + 1).padStart(2, '0')
    return { label: m, value: m }
  }),
]
const daerahOptions = [
  { label: 'Semua', value: 'ALL' },
  { label: 'Gombak', value: 'Gombak' },
  { label: 'Klang', value: 'Klang' },
  { label: 'Hulu Langat', value: 'Hulu Langat' },
  { label: 'Kuala Selangor', value: 'Kuala Selangor' },
]
const kategoriOptions = [
  { label: 'Semua', value: 'ALL' },
  { label: 'PAK', value: 'PAK' },
  { label: 'PAF', value: 'PAF' },
  { label: 'PAP', value: 'PAP' },
  { label: 'PAK+', value: 'PAK+' },
]

/* ===== Meta ===== */
const generatedBy = ref('Pengguna Sistem')
const generatedAt = ref(new Date())
const generatedAtLabel = computed(() => {
  return generatedAt.value.toLocaleString('ms-MY', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  })
})

/* ===== Mock Data (示例) ===== */
type Row = {
  idPA: string
  nama: string
  noKP: string
  kategoriPA: 'PAK' | 'PAF' | 'PAP' | 'PAK+'
  kariah: string
  daerah: string
  tarikhPermohonan: string // ISO
  tarikhKelulusan: string  // ISO
  tarikhMulaLantikan: string // ISO
  tarikhTamatLantikan: string // ISO
  statusPerkhidmatan: 'AKTIF' | 'TAMAT' | 'DIGANTUNG'
  pegawaiPenyelia: string
  noSuratLantikan: string
  catatan?: string
}

const rowsAll = ref<Row[]>([
  {
    idPA: 'PA0001', nama: 'Ahmad Karim', noKP: '880101105555',
    kategoriPA: 'PAK', kariah: 'Al-Hidayah', daerah: 'Gombak',
    tarikhPermohonan: '2024-11-20', tarikhKelulusan: '2024-12-15',
    tarikhMulaLantikan: '2025-01-01', tarikhTamatLantikan: '2025-12-31',
    statusPerkhidmatan: 'AKTIF', pegawaiPenyelia: 'En. Razak',
    noSuratLantikan: 'LZS/GOM/PA/2025/001', catatan: '—'
  },
  {
    idPA: 'PA0002', nama: 'Siti Rahmah', noKP: '900202085432',
    kategoriPA: 'PAF', kariah: 'An-Nur', daerah: 'Gombak',
    tarikhPermohonan: '2025-01-05', tarikhKelulusan: '2025-01-20',
    tarikhMulaLantikan: '2025-02-01', tarikhTamatLantikan: '2025-11-30',
    statusPerkhidmatan: 'AKTIF', pegawaiPenyelia: 'Pn. Mariam',
    noSuratLantikan: 'LZS/GOM/PA/2025/015', catatan: ''
  },
  {
    idPA: 'PA0101', nama: 'Lim Wei', noKP: '870707086543',
    kategoriPA: 'PAP', kariah: '—', daerah: 'Klang',
    tarikhPermohonan: '2024-10-11', tarikhKelulusan: '2024-12-02',
    tarikhMulaLantikan: '2025-01-15', tarikhTamatLantikan: '2025-07-31',
    statusPerkhidmatan: 'TAMAT', pegawaiPenyelia: 'En. Farid',
    noSuratLantikan: 'LZS/KLG/PA/2025/003', catatan: 'Tamat awal'
  },
  {
    idPA: 'PA0203', nama: 'Anand', noKP: '950505015432',
    kategoriPA: 'PAK+', kariah: '—', daerah: 'Hulu Langat',
    tarikhPermohonan: '2025-03-01', tarikhKelulusan: '2025-03-25',
    tarikhMulaLantikan: '2025-04-01', tarikhTamatLantikan: '2025-12-31',
    statusPerkhidmatan: 'DIGANTUNG', pegawaiPenyelia: 'Pn. Noraini',
    noSuratLantikan: 'LZS/HLG/PA/2025/042', catatan: 'Dalam siasatan'
  },
])

/* ===== Utils (declared before usage to satisfy TS) ===== */
function maskNRIC(nric: string) {
  if (!nric) return ''
  const digits = (nric || '').replace(/\D/g, '')
  if (digits.length <= 4) return digits
  const first2 = digits.slice(0, 2)
  const last4 = digits.slice(-4)
  return `${first2}******${last4}`
}
function formatDate(iso: string) {
  if (!iso) return '-'
  const d = new Date(iso)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}
function monthDiff(isoStart: string, isoEnd: string) {
  if (!isoStart || !isoEnd) return 0
  const a = new Date(isoStart)
  const b = new Date(isoEnd)
  let months = (b.getFullYear() - a.getFullYear()) * 12
  months += b.getMonth() - a.getMonth()
  // if end day >= start day, count as full month
  if (b.getDate() >= a.getDate()) months += 1
  return Math.max(0, months)
}
function isExpired(iso: string) {
  const today = new Date()
  const d = new Date(iso)
  return d < new Date(today.getFullYear(), today.getMonth(), today.getDate())
}
function statusVariant(s: string) {
  if (s === 'AKTIF') return 'success'
  if (s === 'TAMAT') return 'danger'
  if (s === 'DIGANTUNG') return 'warning'
  return 'secondary'
}
function monthDiffFromRow(
  row: { tarikhMulaLantikan?: string; tarikhTamatLantikan?: string } | any
) {
  return monthDiff(row?.tarikhMulaLantikan, row?.tarikhTamatLantikan)
}


/* ===== Filtered View ===== */
const filteredRows = computed(() => {
  return rowsAll.value.filter(r => {
    if (filters.daerah !== 'ALL' && r.daerah !== filters.daerah) return false
    if (filters.kategori !== 'ALL' && r.kategoriPA !== filters.kategori) return false
    // Tahun/Bulan (optional business rule: guna tarikhMulaLantikan)
    if (filters.tahun !== 'ALL' && !String(r.tarikhMulaLantikan).startsWith(filters.tahun)) return false
    if (filters.bulan !== 'ALL' && String(r.tarikhMulaLantikan).slice(5, 7) !== filters.bulan) return false
    return true
  })
})

/* ===== Grouped: Daerah → Kategori PA ===== */
const grouped = computed(() => {
  const byDaerah: Record<string, Record<string, Row[]>> = {}
  for (const r of filteredRows.value) {
    if (!byDaerah[r.daerah]) byDaerah[r.daerah] = {}
    if (!byDaerah[r.daerah][r.kategoriPA]) byDaerah[r.daerah][r.kategoriPA] = []
    byDaerah[r.daerah][r.kategoriPA].push(r)
  }
  // Keep kategori order: PAK, PAF, PAP, PAK+
  const order = ['PAK', 'PAF', 'PAP', 'PAK+']
  const sorted: Record<string, Record<string, Row[]>> = {}
  Object.keys(byDaerah).sort().forEach(d => {
    sorted[d] = {}
    order.forEach(k => {
      if (byDaerah[d][k as keyof typeof byDaerah[string]]) {
        sorted[d][k] = byDaerah[d][k]
      }
    })
    // any remaining categories
    Object.keys(byDaerah[d]).forEach(k => {
      if (!sorted[d][k]) sorted[d][k] = byDaerah[d][k]
    })
  })
  return sorted
})

/* ===== Table Columns (order matches URS) ===== */
const columns = [
  { key: 'idPA', label: 'ID_PA', sortable: true },
  { key: 'nama', label: 'Nama (ikut MyKad)', sortable: true },
  { key: 'noKP', label: 'No. KP', sortable: true },
  { key: 'kategoriPA', label: 'Kategori PA', sortable: true },
  { key: 'kariah', label: 'Kariah', sortable: true },
  { key: 'daerah', label: 'Daerah', sortable: true },
  { key: 'tarikhPermohonan', label: 'Tarikh Permohonan', sortable: true },
  { key: 'tarikhKelulusan', label: 'Tarikh Kelulusan', sortable: true },
  { key: 'tarikhMulaLantikan', label: 'Tarikh Mula Lantikan', sortable: true },
  { key: 'tarikhTamatLantikan', label: 'Tarikh Tamat Lantikan', sortable: true },
  { key: 'tempohBulan', label: 'Tempoh (bulan)', sortable: true },
  { key: 'statusPerkhidmatan', label: 'Status Perkhidmatan', sortable: true },
  { key: 'pegawaiPenyelia', label: 'Pegawai Penyelia', sortable: true },
  { key: 'noSuratLantikan', label: 'No. Surat Lantikan', sortable: true },
  { key: 'catatan', label: 'Catatan', sortable: false },
]

/* ===== Export (XLSX/CSV) ===== */
function rowsFlatForExport() {
  // flatten from filteredRows; add computed Tempoh (bulan)
  return filteredRows.value.map(r => ({
    ID_PA: r.idPA,
    Nama: r.nama,
    'No. KP': maskNRIC(r.noKP),
    'Kategori PA': r.kategoriPA,
    Kariah: r.kariah,
    Daerah: r.daerah,
    'Tarikh Permohonan': formatDate(r.tarikhPermohonan),
    'Tarikh Kelulusan': formatDate(r.tarikhKelulusan),
    'Tarikh Mula Lantikan': formatDate(r.tarikhMulaLantikan),
    'Tarikh Tamat Lantikan': formatDate(r.tarikhTamatLantikan),
    'Tempoh (bulan)': monthDiff(r.tarikhMulaLantikan, r.tarikhTamatLantikan),
    'Status Perkhidmatan': r.statusPerkhidmatan,
    'Pegawai Penyelia': r.pegawaiPenyelia,
    'No. Surat Lantikan': r.noSuratLantikan,
    Catatan: r.catatan ?? ''
  }))
}

function exportCSV() {
  const data = rowsFlatForExport()
  if (data.length === 0) return
  const headers = Object.keys(data[0])
  const csv = [
    headers.join(','),
    ...data.map(row => headers.map(h => csvSafe(row[h as keyof typeof row])).join(','))
  ].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  downloadBlob(blob, `Laporan_Pendaftaran_PA_${filters.tahun}_${filters.bulan}.csv`)
}

function exportXLSX() {
  const data = rowsFlatForExport()
  // If SheetJS is available globally, use it; else fall back to CSV
  // @ts-ignore
  if (window && window.XLSX) {
    // @ts-ignore
    const ws = window.XLSX.utils.json_to_sheet(data)
    // @ts-ignore
    const wb = window.XLSX.utils.book_new()
    // @ts-ignore
    window.XLSX.utils.book_append_sheet(wb, ws, 'Data')
    // @ts-ignore
    const wbout = window.XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    downloadBlob(blob, `Laporan_Pendaftaran_PA_${filters.tahun}_${filters.bulan}.xlsx`)
  } else {
    exportCSV()
  }
}

function csvSafe(v: any) {
  const s = String(v ?? '')
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/* ===== Cetak ===== */
function onPrint() {
  window.print()
}

/* ===== Print page counters (best-effort) ===== */
onMounted(() => {
  // Some browsers support CSS counters; as a fallback, leave placeholders.
})
</script>

<style scoped>
/* Ensure page break for each daerah section when printing */
@media print {
  .print-break {
    page-break-before: always;
  }
  .print-break:first-of-type {
    page-break-before: auto;
  }
  .print-only { display: block !important; }
  .page-footer {
    position: fixed;
    bottom: 0;
    left: 0; right: 0;
    padding: 6px 12px;
    font-size: 10px;
    text-align: right;
  }
}
/* Hide footer on screen */
.print-only { display: none; }
</style>
