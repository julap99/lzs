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
            <span class="font-semibold">Laporan Tugasan Penolong Amil</span>
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
            <div><span class="font-medium">Tajuk Laporan:</span>Laporan Tugasan Penolong Amil</div>
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
            <div>Jenis Tugasan: {{ filters.jenisTugasan === 'ALL' ? 'Semua' : filters.jenisTugasan }}</div>
          </div>
        </div>

        <!-- Penapis ringkas + pilihan kumpul -->
        <div class="grid grid-cols-1 md:grid-cols-6 gap-3 mt-4">
          <FormKit type="select" v-model="filters.tahun" label="Tahun" :options="tahunOptions" />
          <FormKit type="select" v-model="filters.bulan" label="Bulan" :options="bulanOptions" />
          <FormKit type="select" v-model="filters.daerah" label="Daerah" :options="daerahOptions" />
          <FormKit type="select" v-model="filters.kategori" label="Kategori PA" :options="kategoriOptions" />
          <FormKit type="select" v-model="filters.jenisTugasan" label="Jenis Tugasan" :options="jenisTugasanOptions" />
          <div>
            <label class="block text-sm font-medium mb-1">Kumpul Mengikut</label>
            <div class="flex items-center gap-3">
              <label class="flex items-center gap-2 text-sm">
                <input type="radio" value="KARIAH" v-model="groupBy" />
                Kariah
              </label>
              <label class="flex items-center gap-2 text-sm">
                <input type="radio" value="DAERAH" v-model="groupBy" />
                Daerah
              </label>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- ===== 3.2.2 Grup: Jenis Tugasan → (Kariah|Daerah) → Kategori PA ===== -->
    <div v-for="(byLoc, jenis) in grouped" :key="jenis" class="report-section print-break">
      <div class="flex items-center justify-between mt-2 mb-1">
        <div class="text-lg font-semibold flex items-center gap-2">
          <Icon name="mdi:clipboard-list-outline" /> Jenis Tugasan: {{ jenis }}
        </div>
        <rs-badge variant="soft">Klasifikasi: Dalaman</rs-badge>
      </div>
      <div class="text-sm text-gray-600 mb-3">Kumpulan: {{ groupBy === 'KARIAH' ? 'Kariah' : 'Daerah' }} → Kategori PA</div>

      <div v-for="(byKategori, loc) in byLoc" :key="loc" class="mb-8">
        <div class="font-medium mb-2 flex items-center gap-2">
          <Icon name="mdi:map-marker-radius-outline" />
          <span>{{ groupBy === 'KARIAH' ? 'Kariah' : 'Daerah' }}: {{ loc }}</span>
        </div>

        <div v-for="(rows, kategori) in byKategori" :key="kategori" class="mb-6">
          <div class="mb-2 text-sm text-gray-700 flex items-center gap-2">
            <Icon name="mdi:shield-account-outline" /> Kategori PA: {{ kategori }}
          </div>

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
            <!-- Formatters mengikut URS -->
            <template #tarikhTugasan="{ text }">{{ formatDate(text) }}</template>
            <template #amaunUnitRM="{ text }">{{ formatRM(Number(text)) }}</template>
            <template #jumlahElaunRM="{ text }">{{ formatRM(Number(text)) }}</template>
          </RsTable>
        </div>
      </div>
    </div>

    <!-- ===== 3.3 Rangkuman Padanan Log ===== -->
    <rs-card>
      <template #header>
        <div class="flex items-center gap-2">
          <Icon name="mdi:clipboard-check-outline" />
          <span class="font-semibold">Rangkuman Padanan Log</span>
        </div>
      </template>
      <template #body>
        <div v-if="logsSummary.length > 0" class="space-y-1">
          <div v-for="(log, i) in logsSummary" :key="i" class="text-sm">
            • Disahkan oleh <b>{{ log.nama }}</b> pada <b>{{ formatDate(log.tarikh) }}</b> — {{ log.count }} tugasan
          </div>
        </div>
        <div v-else class="text-sm text-gray-500">Tiada rekod pengesahan untuk paparan semasa.</div>
      </template>
    </rs-card>

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
 * PA-DA-PD-02 (Tugasan) —Laporan Tugasan Penolong Amil
 * - Header/meta, filters
 * - Table columns (read-only) with MYR/Date formatting
 * - Grouping: Jenis Tugasan → (Kariah|Daerah) → Kategori PA
 * - Jumlah Elaun (RM) = Amaun Unit × Bil. Unit
 * - Rangkuman padanan log: “Disahkan oleh [nama] pada [tarikh]”
 */
import { ref, reactive, computed } from 'vue'

defineOptions({ name: 'PA-DA-PD-02-Tugasan' })

/* ===== Breadcrumb ===== */
const breadcrumb = ref([
  { name: 'Dashboard', type: 'text', path: '/' },
  { name: 'Laporan Tugasan', type: 'text', path: '#' },
])

/* ===== Filters ===== */
const filters = reactive({
  tahun: new Date().getFullYear().toString(),
  bulan: 'ALL', // 01..12 or ALL
  daerah: 'ALL',
  kategori: 'ALL',       // PAK/PAF/PAP/PAK+ / ALL
  jenisTugasan: 'ALL',   // BANCIAN BARU / KEMASKINI / PERMOHONAN BANTUAN / ALL
})
const groupBy = ref<'KARIAH' | 'DAERAH'>('KARIAH')

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
const jenisTugasanOptions = [
  { label: 'Semua', value: 'ALL' },
  { label: 'BANCIAN BARU', value: 'BANCIAN BARU' },
  { label: 'KEMASKINI', value: 'KEMASKINI' },
  { label: 'PERMOHONAN BANTUAN', value: 'PERMOHONAN BANTUAN' },
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
  tarikhTugasan: string // ISO
  idTugasan: string
  idPA: string
  nama: string
  kategoriPA: 'PAK' | 'PAF' | 'PAP' | 'PAK+'
  jenisTugasan: 'BANCIAN BARU' | 'KEMASKINI' | 'PERMOHONAN BANTUAN'
  rujukan: string
  bilUnit: number
  amaunUnitRM: number          // kadar pada tarikh tugasan
  statusPengesahan: string     // text
  statusPembayaran: string     // text
  pegawaiPenyemak: string
  kariahDaerah: string         // "Kariah XYZ / Gombak"
  catatan?: string
  disahkanOleh?: string
  tarikhSah?: string           // ISO
}

const rowsAll = ref<Row[]>([
  {
    tarikhTugasan: '2025-09-01', idTugasan: 'TG-0001', idPA: 'PA0001', nama: 'Ahmad Karim',
    kategoriPA: 'PAK', jenisTugasan: 'BANCIAN BARU', rujukan: 'BRG-2025-0001',
    bilUnit: 1, amaunUnitRM: 30, statusPengesahan: 'Disahkan', statusPembayaran: 'SUDAH DIBAYAR',
    pegawaiPenyemak: 'En. Razak', kariahDaerah: 'Al-Hidayah / Gombak', catatan: '',
    disahkanOleh: 'En. Razak', tarikhSah: '2025-09-02'
  },
  {
    tarikhTugasan: '2025-09-04', idTugasan: 'TG-0002', idPA: 'PA0002', nama: 'Siti Rahmah',
    kategoriPA: 'PAF', jenisTugasan: 'KEMASKINI', rujukan: 'UPD-2025-051',
    bilUnit: 2, amaunUnitRM: 25, statusPengesahan: 'Disahkan', statusPembayaran: 'BELUM DIBAYAR',
    pegawaiPenyemak: 'Pn. Mariam', kariahDaerah: 'An-Nur / Gombak', catatan: '—',
    disahkanOleh: 'Pn. Mariam', tarikhSah: '2025-09-05'
  },
  {
    tarikhTugasan: '2025-08-30', idTugasan: 'TG-0101', idPA: 'PA0101', nama: 'Lim Wei',
    kategoriPA: 'PAP', jenisTugasan: 'PERMOHONAN BANTUAN', rujukan: 'APP-2025-100',
    bilUnit: 1, amaunUnitRM: 50, statusPengesahan: 'Sahkan Kemudian', statusPembayaran: 'BELUM DIBAYAR',
    pegawaiPenyemak: 'En. Farid', kariahDaerah: '— / Klang', catatan: ''
  },
  {
    tarikhTugasan: '2025-09-03', idTugasan: 'TG-0203', idPA: 'PA0203', nama: 'Anand',
    kategoriPA: 'PAK+', jenisTugasan: 'BANCIAN BARU', rujukan: 'BRG-2025-0003',
    bilUnit: 3, amaunUnitRM: 20, statusPengesahan: 'Disahkan', statusPembayaran: 'SUDAH DIBAYAR',
    pegawaiPenyemak: 'Pn. Noraini', kariahDaerah: '— / Hulu Langat', catatan: '—',
    disahkanOleh: 'Pn. Noraini', tarikhSah: '2025-09-04'
  },
])

/* ===== Utils ===== */
function formatRM(v: number) {
  return new Intl.NumberFormat('ms-MY', { style: 'currency', currency: 'MYR' }).format(v || 0)
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

/* ===== Filtered & Enriched (add jumlahElaunRM) ===== */
const filteredRows = computed(() => {
  return rowsAll.value.filter(r => {
    if (filters.daerah !== 'ALL' && !r.kariahDaerah.endsWith(` / ${filters.daerah}`)) return false
    if (filters.kategori !== 'ALL' && r.kategoriPA !== filters.kategori) return false
    if (filters.jenisTugasan !== 'ALL' && r.jenisTugasan !== filters.jenisTugasan) return false
    if (filters.tahun !== 'ALL' && !String(r.tarikhTugasan).startsWith(filters.tahun)) return false
    if (filters.bulan !== 'ALL' && String(r.tarikhTugasan).slice(5, 7) !== filters.bulan) return false
    return true
  })
})

const tableRows = computed(() => {
  return filteredRows.value.map(r => ({
    ...r,
    jumlahElaunRM: r.bilUnit * r.amaunUnitRM, // Peraturan: Jumlah = Amaun Unit × Bil. Unit
  }))
})

/* ===== Grouped: Jenis Tugasan → (Kariah|Daerah) → Kategori PA ===== */
const grouped = computed(() => {
  const byJenis: Record<string, Record<string, Record<string, any[]>>> = {}
  for (const r of tableRows.value) {
    const jenis = r.jenisTugasan
    if (!byJenis[jenis]) byJenis[jenis] = {}

    // pilih lokasi ikut groupBy
    const [kariahRaw, daerahRaw] = (r.kariahDaerah || ' / ').split('/')
    const kariah = (kariahRaw || '—').trim()
    const daerah = (daerahRaw || '—').trim()
    const loc = groupBy.value === 'KARIAH' ? kariah : daerah

    if (!byJenis[jenis][loc]) byJenis[jenis][loc] = {}
    if (!byJenis[jenis][loc][r.kategoriPA]) byJenis[jenis][loc][r.kategoriPA] = []
    byJenis[jenis][loc][r.kategoriPA].push(r)
  }

  // stable order
  const jenisOrder = ['BANCIAN BARU', 'KEMASKINI', 'PERMOHONAN BANTUAN']
  const kategoriOrder = ['PAK', 'PAF', 'PAP', 'PAK+']
  const sorted: Record<string, Record<string, Record<string, any[]>>> = {}
  Object.keys(byJenis).sort((a, b) => jenisOrder.indexOf(a) - jenisOrder.indexOf(b)).forEach(j => {
    sorted[j] = {}
    Object.keys(byJenis[j]).sort().forEach(loc => {
      sorted[j][loc] = {}
      Object.keys(byJenis[j][loc]).sort((a, b) => kategoriOrder.indexOf(a) - kategoriOrder.indexOf(b)).forEach(cat => {
        sorted[j][loc][cat] = byJenis[j][loc][cat]
      })
    })
  })
  return sorted
})

/* ===== Logs Summary (3.3) ===== */
const logsSummary = computed(() => {
  // group by (disahkanOleh, tarikhSah)
  const keyMap = new Map<string, { nama: string; tarikh: string; count: number }>()
  for (const r of filteredRows.value) {
    if (!r.disahkanOleh || !r.tarikhSah) continue
    const key = `${r.disahkanOleh}|${r.tarikhSah}`
    const prev = keyMap.get(key)
    if (prev) {
      prev.count += 1
    } else {
      keyMap.set(key, { nama: r.disahkanOleh, tarikh: r.tarikhSah, count: 1 })
    }
  }
  return Array.from(keyMap.values()).sort((a, b) => (a.tarikh > b.tarikh ? -1 : 1))
})

/* ===== Table Columns ===== */
const columns = [
  { key: 'tarikhTugasan', label: 'Tarikh Tugasan', sortable: true },
  { key: 'idTugasan', label: 'ID_Tugasan', sortable: true },
  { key: 'idPA', label: 'ID_PA', sortable: true },
  { key: 'nama', label: 'Nama', sortable: true },
  { key: 'kategoriPA', label: 'Kategori PA', sortable: true },
  { key: 'jenisTugasan', label: 'Jenis Tugasan', sortable: true },
  { key: 'rujukan', label: 'Rujukan Borang/Permohonan', sortable: true },
  { key: 'bilUnit', label: 'Bil. Unit', sortable: true },
  { key: 'amaunUnitRM', label: 'Amaun Unit (RM)', sortable: true },
  { key: 'jumlahElaunRM', label: 'Jumlah Elaun (RM)', sortable: true },
  { key: 'statusPengesahan', label: 'Status Pengesahan', sortable: true },
  { key: 'statusPembayaran', label: 'Status Pembayaran', sortable: true },
  { key: 'pegawaiPenyemak', label: 'Pegawai Penyemak/Disahkan Oleh', sortable: true },
  { key: 'kariahDaerah', label: 'Kariah/Daerah', sortable: true },
  { key: 'catatan', label: 'Catatan', sortable: false },
]

/* ===== Export ===== */
function rowsFlatForExport() {
  return tableRows.value.map(r => ({
    'Tarikh Tugasan': formatDate(r.tarikhTugasan),
    ID_Tugasan: r.idTugasan,
    ID_PA: r.idPA,
    Nama: r.nama,
    'Kategori PA': r.kategoriPA,
    'Jenis Tugasan': r.jenisTugasan,
    'Rujukan Borang/Permohonan': r.rujukan,
    'Bil. Unit': r.bilUnit,
    'Amaun Unit (RM)': r.amaunUnitRM,
    'Jumlah Elaun (RM)': r.jumlahElaunRM,
    'Status Pengesahan': r.statusPengesahan,
    'Status Pembayaran': r.statusPembayaran,
    'Pegawai Penyemak/Disahkan Oleh': r.pegawaiPenyemak,
    'Kariah/Daerah': r.kariahDaerah,
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
  downloadBlob(blob, `Laporan_Tugasan_PA_${filters.tahun}_${filters.bulan}.csv`)
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
    downloadBlob(blob, `Laporan_Tugasan_PA_${filters.tahun}_${filters.bulan}.xlsx`)
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
/* Page break per Jenis Tugasan (nice for printing) */
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
