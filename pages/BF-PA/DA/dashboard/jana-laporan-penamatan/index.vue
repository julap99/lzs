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
            <span class="font-semibold">Laporan Penamatan / Pembaharuan Tempoh Perkhidmatan</span>
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
            <div><span class="font-medium">Tajuk Laporan:</span> Penamatan / Pembaharuan Tempoh Perkhidmatan</div>
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
            <div>Kategori: {{ filters.kategori === 'ALL' ? 'Semua' : filters.kategori }}</div>
            <div>Tindakan: {{ filters.tindakan === 'ALL' ? 'Semua' : filters.tindakan }}</div>
          </div>
        </div>

        <!-- Penapis ringkas -->
        <div class="grid grid-cols-1 md:grid-cols-6 gap-3 mt-4">
          <FormKit type="select" v-model="filters.tahun" label="Tahun" :options="tahunOptions" />
          <FormKit type="select" v-model="filters.bulan" label="Bulan" :options="bulanOptions" />
          <FormKit type="select" v-model="filters.daerah" label="Daerah" :options="daerahOptions" />
          <FormKit type="select" v-model="filters.kategori" label="Kategori" :options="kategoriOptions" />
          <FormKit type="select" v-model="filters.tindakan" label="Tindakan" :options="tindakanOptions" />
          <div>
            <label class="block text-sm font-medium mb-1">Tapisan Tarikh</label>
            <div class="flex items-center gap-3">
              <label class="flex items-center gap-2 text-sm">
                <input type="radio" value="TAMAT" v-model="tarikhFilterBy" />
                Tarikh Tamat
              </label>
              <label class="flex items-center gap-2 text-sm">
                <input type="radio" value="TINDAKAN" v-model="tarikhFilterBy" />
                Tarikh Tindakan
              </label>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- ===== 3.2.2 Kumpul: Daerah → pecahan Tindakan (page break setiap Daerah) ===== -->
    <div v-for="(byTindakan, daerah) in grouped" :key="daerah" class="report-section print-break">
      <div class="flex items-center justify-between mt-2 mb-1">
        <div class="text-lg font-semibold flex items-center gap-2">
          <Icon name="mdi:map-marker-radius-outline" /> Daerah: {{ daerah }}
        </div>
        <rs-badge variant="soft">Klasifikasi: Dalaman</rs-badge>
      </div>
      <div class="text-sm text-gray-600 mb-3">Pecahan mengikut Tindakan: Renew / Tamat / Pending</div>

      <div v-for="(rows, tindakan) in byTindakan" :key="tindakan" class="mb-6">
        <div class="font-medium mb-2 flex items-center gap-2">
          <Icon name="mdi:shield-refresh-outline" /> Tindakan: {{ tindakan }}
        </div>

        <!-- ===== 3.2.1 Jadual (Read-only) ===== -->
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
          <!-- Formatters ikut URS -->
          <template #noKP="{ text }">{{ maskNRIC(text) }}</template>

          <template #tarikhMula="{ text }">{{ formatDate(text) }}</template>
          <template #tarikhTamat="{ text }">{{ formatDate(text) }}</template>
          <template #tarikhTindakan="{ text }">{{ formatDate(text) }}</template>

          <template #tempohBulan="{ value }">
            <span>{{ monthDiffFromRow(value) }}</span>
          </template>

          <!-- Semua status sebagai teks biasa: tindakan, status serah tugas -->
        </RsTable>
      </div>
    </div>

    <!-- Footer / Cetakan -->
    <div class="bg-white rounded-2xl border p-5 space-y-6">
      <div class="text-xs text-gray-500">
        Klasifikasi: Dalaman • Dihasilkan pada {{ generatedAtLabel }} • “Muka surat” dipapar dalam mod cetak.
      </div>
    </div>

    <div class="page-footer print-only">Muka surat <span class="page-number"></span> / <span class="total-pages"></span></div>
  </div>
</template>

<script setup lang="ts">
/**
 * PA-DA-PD-02 — Jana Laporan Penamatan / Pembaharuan Tempoh Perkhidmatan
 * - Header/meta, filters
 * - Table columns (read-only) with date mask & NRIC mask
 * - Grouping: Daerah → Tindakan (Renew/Tamat/Pending) with page break per Daerah
 * - Tempoh (bulan) = beza antara Tarikh Mula & Tarikh Tamat
 */
import { ref, reactive, computed } from 'vue'

defineOptions({ name: 'PA-DA-PD-02-PenamatanPembaharuan' })

/* ===== Breadcrumb ===== */
const breadcrumb = ref([
  { name: 'Dashboard', type: 'text', path: '/' },
  { name: 'Laporan Penamatan/Pembaharuan', type: 'text', path: '#' },
])

/* ===== Filters ===== */
const filters = reactive({
  tahun: new Date().getFullYear().toString(),
  bulan: 'ALL', // 01..12 or ALL
  daerah: 'ALL',
  kategori: 'ALL',         // PAK/PAF/PAP/PAK+ / ALL
  tindakan: 'ALL',         // Renew/Tamat/Pending / ALL
})
const tarikhFilterBy = ref<'TAMAT' | 'TINDAKAN'>('TAMAT')

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
const tindakanOptions = [
  { label: 'Semua', value: 'ALL' },
  { label: 'Renew', value: 'Renew' },
  { label: 'Tamat', value: 'Tamat' },
  { label: 'Pending', value: 'Pending' },
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

/* ===== Mock Data ===== */
type Row = {
  idPA: string
  nama: string
  noKP: string
  kategori: 'PAK' | 'PAF' | 'PAP' | 'PAK+'
  kariahDaerah: string   // "Kariah XYZ / Gombak"
  tarikhMula: string     // ISO
  tarikhTamat: string    // ISO
  tindakan: 'Renew' | 'Tamat' | 'Pending'
  noSurat?: string
  tarikhTindakan?: string // ISO
  tempohBulan?: number    // computed for export (optional)
  sebabPenamatan?: string
  statusSerahTugas: 'Selesai' | 'Belum'
  pegawaiPelulus: string
  catatan?: string
}

const rowsAll = ref<Row[]>([
  {
    idPA: 'PA0001', nama: 'Ahmad Karim', noKP: '880101105555', kategori: 'PAK',
    kariahDaerah: 'Al-Hidayah / Gombak',
    tarikhMula: '2025-01-01', tarikhTamat: '2025-12-31',
    tindakan: 'Renew', noSurat: 'LZS/GOM/REN/2025/001', tarikhTindakan: '2025-12-01',
    sebabPenamatan: '', statusSerahTugas: 'Selesai', pegawaiPelulus: 'En. Razak', catatan: ''
  },
  {
    idPA: 'PA0002', nama: 'Siti Rahmah', noKP: '900202085432', kategori: 'PAF',
    kariahDaerah: 'An-Nur / Gombak',
    tarikhMula: '2024-02-01', tarikhTamat: '2025-01-31',
    tindakan: 'Tamat', noSurat: 'LZS/GOM/TMT/2025/015', tarikhTindakan: '2025-01-31',
    sebabPenamatan: 'Kontrak tamat', statusSerahTugas: 'Selesai', pegawaiPelulus: 'Pn. Mariam', catatan: ''
  },
  {
    idPA: 'PA0101', nama: 'Lim Wei', noKP: '870707086543', kategori: 'PAP',
    kariahDaerah: '— / Klang',
    tarikhMula: '2024-10-01', tarikhTamat: '2025-09-30',
    tindakan: 'Pending', noSurat: '', tarikhTindakan: '',
    sebabPenamatan: '', statusSerahTugas: 'Belum', pegawaiPelulus: 'En. Farid', catatan: 'Menunggu keputusan'
  },
  {
    idPA: 'PA0203', nama: 'Anand', noKP: '950505015432', kategori: 'PAK+',
    kariahDaerah: '— / Hulu Langat',
    tarikhMula: '2025-04-01', tarikhTamat: '2025-12-31',
    tindakan: 'Renew', noSurat: 'LZS/HLG/REN/2025/042', tarikhTindakan: '2025-12-15',
    sebabPenamatan: '', statusSerahTugas: 'Selesai', pegawaiPelulus: 'Pn. Noraini', catatan: '—'
  },
])

/* ===== Utils ===== */
function maskNRIC(nric: string) {
  if (!nric) return ''
  const digits = (nric || '').replace(/\D/g, '')
  if (digits.length <= 4) return digits
  const first2 = digits.slice(0, 2)
  const last4 = digits.slice(-4)
  return `${first2}******${last4}`
}
function formatDate(iso?: string) {
  if (!iso) return '-'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '-'
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}
function monthDiff(isoStart?: string, isoEnd?: string) {
  if (!isoStart || !isoEnd) return 0
  const a = new Date(isoStart)
  const b = new Date(isoEnd)
  if (isNaN(a.getTime()) || isNaN(b.getTime())) return 0
  let months = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth())
  if (b.getDate() >= a.getDate()) months += 1
  return Math.max(0, months)
}
function monthDiffFromRow(
  row: { tarikhMula?: string; tarikhTamat?: string } | any
) {
  return monthDiff(row?.tarikhMula, row?.tarikhTamat)
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

/* ===== Filtered ===== */
function tarikhUntukTapisan(r: Row) {
  // ikut pilihan: Tarikh Tamat atau Tarikh Tindakan
  return tarikhFilterBy.value === 'TINDAKAN' ? (r.tarikhTindakan || r.tarikhTamat) : r.tarikhTamat
}
const filteredRows = computed(() => {
  return rowsAll.value.filter(r => {
    if (filters.daerah !== 'ALL' && !r.kariahDaerah.endsWith(` / ${filters.daerah}`)) return false
    if (filters.kategori !== 'ALL' && r.kategori !== filters.kategori) return false
    if (filters.tindakan !== 'ALL' && r.tindakan !== filters.tindakan) return false
    const t = tarikhUntukTapisan(r) || ''
    if (filters.tahun !== 'ALL' && !String(t).startsWith(filters.tahun)) return false
    if (filters.bulan !== 'ALL' && String(t).slice(5, 7) !== filters.bulan) return false
    return true
  })
})

/* ===== Grouped: Daerah → Tindakan ===== */
const grouped = computed(() => {
  const byDaerah: Record<string, Record<string, Row[]>> = {}
  for (const r of filteredRows.value) {
    const daerah = (r.kariahDaerah.split('/').pop() || '—').trim()
    if (!byDaerah[daerah]) byDaerah[daerah] = {}
    if (!byDaerah[daerah][r.tindakan]) byDaerah[daerah][r.tindakan] = []
    byDaerah[daerah][r.tindakan].push(r)
  }
  // sort tindakan order
  const tindakanOrder = ['Renew', 'Tamat', 'Pending']
  const sorted: Record<string, Record<string, Row[]>> = {}
  Object.keys(byDaerah).sort().forEach(d => {
    sorted[d] = {}
    tindakanOrder.forEach(tk => {
      if (byDaerah[d][tk]) sorted[d][tk] = byDaerah[d][tk]
    })
    // any remaining
    Object.keys(byDaerah[d]).forEach(tk => {
      if (!sorted[d][tk]) sorted[d][tk] = byDaerah[d][tk]
    })
  })
  return sorted
})

/* ===== Table Columns ===== */
const columns = [
  { key: 'idPA', label: 'ID_PA', sortable: true },
  { key: 'nama', label: 'Nama', sortable: true },
  { key: 'noKP', label: 'No. KP', sortable: true },
  { key: 'kategori', label: 'Kategori', sortable: true },
  { key: 'kariahDaerah', label: 'Kariah/Daerah', sortable: true },
  { key: 'tarikhMula', label: 'Tarikh Mula', sortable: true },
  { key: 'tarikhTamat', label: 'Tarikh Tamat', sortable: true },
  { key: 'tindakan', label: 'Tindakan', sortable: true },
  { key: 'noSurat', label: 'No. Surat (Renew/Tamat)', sortable: true },
  { key: 'tarikhTindakan', label: 'Tarikh Tindakan', sortable: true },
  { key: 'tempohBulan', label: 'Tempoh (bulan)', sortable: true },
  { key: 'sebabPenamatan', label: 'Sebab Penamatan', sortable: true },
  { key: 'statusSerahTugas', label: 'Status Serah Tugas', sortable: true },
  { key: 'pegawaiPelulus', label: 'Pegawai Pelulus', sortable: true },
  { key: 'catatan', label: 'Catatan', sortable: false },
]

/* ===== Export ===== */
function rowsFlatForExport() {
  return filteredRows.value.map(r => ({
    ID_PA: r.idPA,
    Nama: r.nama,
    'No. KP': maskNRIC(r.noKP),
    Kategori: r.kategori,
    'Kariah/Daerah': r.kariahDaerah,
    'Tarikh Mula': formatDate(r.tarikhMula),
    'Tarikh Tamat': formatDate(r.tarikhTamat),
    Tindakan: r.tindakan,
    'No. Surat (Renew/Tamat)': r.noSurat ?? '',
    'Tarikh Tindakan': formatDate(r.tarikhTindakan),
    'Tempoh (bulan)': monthDiff(r.tarikhMula, r.tarikhTamat),
    'Sebab Penamatan': r.sebabPenamatan ?? '',
    'Status Serah Tugas': r.statusSerahTugas,
    'Pegawai Pelulus': r.pegawaiPelulus,
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
  downloadBlob(blob, `Laporan_PenamatanPembaharuan_${filters.tahun}_${filters.bulan}.csv`)
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
    downloadBlob(blob, `Laporan_PenamatanPembaharuan_${filters.tahun}_${filters.bulan}.xlsx`)
  } else {
    exportCSV()
  }
}

/* ===== Cetak ===== */
function onPrint() {
  window.print()
}
</script>

<style scoped>
/* Page break per Daerah */
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
