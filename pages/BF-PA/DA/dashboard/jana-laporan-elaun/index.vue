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
            <span class="font-semibold">Laporan Bayaran Elaun Penolong Amil</span>
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
            <div><span class="font-medium">Tajuk Laporan:</span>Laporan Bayaran Elaun Penolong Amil</div>
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
            <div>Jenis Elaun: {{ filters.jenisElaun === 'ALL' ? 'Semua' : filters.jenisElaun }}</div>
          </div>
        </div>

        <!-- Penapis ringkas -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-3 mt-4">
          <FormKit type="select" v-model="filters.tahun" label="Tahun" :options="tahunOptions" />
          <FormKit type="select" v-model="filters.bulan" label="Bulan" :options="bulanOptions" />
          <FormKit type="select" v-model="filters.daerah" label="Daerah" :options="daerahOptions" />
          <FormKit type="select" v-model="filters.kategori" label="Kategori PA" :options="kategoriOptions" />
          <FormKit type="select" v-model="filters.jenisElaun" label="Jenis Elaun" :options="jenisElaunOptions" />
        </div>
      </template>
    </rs-card>

    <!-- ===== 3.3 Perbezaan Rekod vs Sistem Kewangan ===== -->
    <div
      v-if="hasDiscrepancy"
      class="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3"
    >
      <Icon name="mdi:alert-decagram-outline" class="mt-0.5" />
      <div>
        <div class="font-semibold">Perbezaan rekod dikesan</div>
        <div class="text-sm text-amber-800">
          Jumlah laporan: <b>{{ formatRM(totalJumlahRM) }}</b> ≠ Jumlah sistem kewangan: <b>{{ formatRM(financialSystemTotal) }}</b>
        </div>
        <div class="text-sm mt-2">
          Rujukan batch sistem kewangan:
          <ul class="list-disc ml-5">
            <li v-for="(ref, i) in financialBatchRefs" :key="i">{{ ref }}</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- ===== 3.2.2 Grup: Jenis Elaun → Kategori → Daerah (page break setiap Jenis Elaun) ===== -->
    <div v-for="(byKategori, jenis) in grouped" :key="jenis" class="report-section print-break">
      <div class="flex items-center justify-between mt-2 mb-1">
        <div class="text-lg font-semibold flex items-center gap-2">
          <Icon name="mdi:cash" /> Jenis Elaun: {{ jenis }}
        </div>
        <rs-badge variant="soft">Klasifikasi: Dalaman</rs-badge>
      </div>
      <div class="text-sm text-gray-600 mb-3">Kumpulan: Kategori → Daerah</div>

      <div v-for="(byDaerah, kategori) in byKategori" :key="kategori" class="mb-8">
        <div class="font-medium mb-2 flex items-center gap-2">
          <Icon name="mdi:shield-account-outline" /> Kategori: {{ kategori }}
        </div>

        <div v-for="(rows, daerah) in byDaerah" :key="daerah" class="mb-6">
          <div class="mb-2 text-sm text-gray-700 flex items-center gap-2">
            <Icon name="mdi:map-marker-radius-outline" /> Daerah: {{ daerah }}
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
            <!-- Formatters mengikut URS -->
            <template #tarikhTransaksi="{ text }">{{ formatDate(text) }}</template>
            <template #tarikhBayaran="{ text }">{{ formatDate(text) }}</template>
            <template #amaunUnitRM="{ text }">{{ formatRM(Number(text)) }}</template>
            <template #jumlahRM="{ text }">{{ formatRM(Number(text)) }}</template>
            <template #bankAkaun="{ text }">{{ maskBankAccount(text) }}</template>
            <!-- Status pembayaran: teks biasa (tiada badge) -->
          </RsTable>
        </div>
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
 * PA-DA-PD-02 (Bayaran Elaun) — Jana Laporan Bayaran Elaun Penolong Amil
 * - Header meta (tajuk, organisasi, masa jana, dijana oleh, tempoh, ringkasan penapis)
 * - Jadual read-only dengan kolum & format (MYR, mask akaun, tarikh DD/MM/YYYY)
 * - Kumpulan: Jenis Elaun → Kategori → Daerah (page-break setiap Jenis Elaun)
 * - Komponen perbezaan rekod vs sistem kewangan + rujukan batch
 */
import { ref, reactive, computed } from 'vue'

defineOptions({ name: 'PA-DA-PD-02-BayaranElaun' })

/* ===== Breadcrumb ===== */
const breadcrumb = ref([
  { name: 'Dashboard', type: 'text', path: '/' },
  { name: 'Laporan Elaun', type: 'text', path: '#' },
])

/* ===== Filters ===== */
const filters = reactive({
  tahun: new Date().getFullYear().toString(),
  bulan: 'ALL', // 01..12 or ALL
  daerah: 'ALL',
  kategori: 'ALL',       // PAK/PAF/PAP/PAK+ / ALL
  jenisElaun: 'ALL',     // Tetap/Program/Khas / ALL
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
const jenisElaunOptions = [
  { label: 'Semua', value: 'ALL' },
  { label: 'Tetap', value: 'Tetap' },
  { label: 'Program', value: 'Program' },
  { label: 'Khas', value: 'Khas' },
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
  tarikhTransaksi: string // ISO
  idPA: string
  nama: string
  kategori: 'PAK' | 'PAF' | 'PAP' | 'PAK+'
  jenisElaun: 'Tetap' | 'Program' | 'Khas'
  kodBajet: string
  bilUnit: number
  amaunUnitRM: number
  jumlahRM: number
  statusPembayaran: 'SUDAH DIBAYAR' | 'BELUM DIBAYAR'
  noBaucarEFT: string
  tarikhBayaran?: string // ISO
  bankAkaun: string      // "BANK_NAME | 1234567890"
  kariahDaerah: string   // "Kariah ABC / Gombak"
  catatan?: string
}

const rowsAll = ref<Row[]>([
  {
    tarikhTransaksi: '2025-08-31', idPA: 'PA0001', nama: 'Ahmad Karim', kategori: 'PAK',
    jenisElaun: 'Tetap', kodBajet: 'BJT-1001', bilUnit: 1, amaunUnitRM: 300, jumlahRM: 300,
    statusPembayaran: 'SUDAH DIBAYAR', noBaucarEFT: 'EFT-2025-00011', tarikhBayaran: '2025-09-05',
    bankAkaun: 'BIMB | 1234567890', kariahDaerah: 'Al-Hidayah / Gombak', catatan: ''
  },
  {
    tarikhTransaksi: '2025-09-01', idPA: 'PA0002', nama: 'Siti Rahmah', kategori: 'PAF',
    jenisElaun: 'Program', kodBajet: 'BJT-2203', bilUnit: 3, amaunUnitRM: 60, jumlahRM: 180,
    statusPembayaran: 'BELUM DIBAYAR', noBaucarEFT: '-', tarikhBayaran: '',
    bankAkaun: 'Maybank | 876543210', kariahDaerah: 'An-Nur / Gombak', catatan: 'Menunggu kelulusan'
  },
  {
    tarikhTransaksi: '2025-07-20', idPA: 'PA0101', nama: 'Lim Wei', kategori: 'PAP',
    jenisElaun: 'Khas', kodBajet: 'BJT-9901', bilUnit: 1, amaunUnitRM: 150, jumlahRM: 150,
    statusPembayaran: 'SUDAH DIBAYAR', noBaucarEFT: 'EFT-2025-00077', tarikhBayaran: '2025-07-20',
    bankAkaun: 'RHB | 4455667788', kariahDaerah: '— / Klang', catatan: ''
  },
  {
    tarikhTransaksi: '2025-09-03', idPA: 'PA0203', nama: 'Anand', kategori: 'PAK+',
    jenisElaun: 'Tetap', kodBajet: 'BJT-1001', bilUnit: 1, amaunUnitRM: 220, jumlahRM: 220,
    statusPembayaran: 'SUDAH DIBAYAR', noBaucarEFT: 'EFT-2025-00045', tarikhBayaran: '2025-09-05',
    bankAkaun: 'CIMB | 2211335577', kariahDaerah: '— / Hulu Langat', catatan: '—'
  },
])

/* ===== Utils (declare BEFORE usage) ===== */
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
function maskBankAccount(s: string) {
  if (!s) return ''
  const [bank, acct] = s.split('|').map(x => x.trim())
  if (!acct) return bank || s
  const last4 = acct.slice(-4)
  return `${bank} | ******${last4}`
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
const filteredRows = computed(() => {
  return rowsAll.value.filter(r => {
    if (filters.daerah !== 'ALL' && !r.kariahDaerah.endsWith(` / ${filters.daerah}`)) return false
    if (filters.kategori !== 'ALL' && r.kategori !== filters.kategori) return false
    if (filters.jenisElaun !== 'ALL' && r.jenisElaun !== filters.jenisElaun) return false
    if (filters.tahun !== 'ALL' && !String(r.tarikhTransaksi).startsWith(filters.tahun)) return false
    if (filters.bulan !== 'ALL' && String(r.tarikhTransaksi).slice(5, 7) !== filters.bulan) return false
    return true
  })
})

/* ===== Grouped: Jenis Elaun → Kategori → Daerah ===== */
const grouped = computed(() => {
  const byJenis: Record<string, Record<string, Record<string, Row[]>>> = {}
  for (const r of filteredRows.value) {
    if (!byJenis[r.jenisElaun]) byJenis[r.jenisElaun] = {}
    if (!byJenis[r.jenisElaun][r.kategori]) byJenis[r.jenisElaun][r.kategori] = {}
    const daerah = r.kariahDaerah.split('/').pop()?.trim() || '—'
    if (!byJenis[r.jenisElaun][r.kategori][daerah]) byJenis[r.jenisElaun][r.kategori][daerah] = []
    byJenis[r.jenisElaun][r.kategori][daerah].push(r)
  }
  // keep stable order
  const jenisOrder = ['Tetap', 'Program', 'Khas']
  const kategoriOrder = ['PAK', 'PAF', 'PAP', 'PAK+']
  const sorted: Record<string, Record<string, Record<string, Row[]>>> = {}
  Object.keys(byJenis).sort((a, b) => jenisOrder.indexOf(a) - jenisOrder.indexOf(b)).forEach(j => {
    sorted[j] = {}
    Object.keys(byJenis[j]).sort((a, b) => kategoriOrder.indexOf(a) - kategoriOrder.indexOf(b)).forEach(k => {
      sorted[j][k] = {}
      Object.keys(byJenis[j][k]).sort().forEach(d => {
        sorted[j][k][d] = byJenis[j][k][d]
      })
    })
  })
  return sorted
})

/* ===== Totals & Discrepancy (3.3) ===== */
const totalJumlahRM = computed(() => filteredRows.value.reduce((acc, r) => acc + (r.jumlahRM || 0), 0))
const financialSystemTotal = ref(850) // mock: jumlah dari sistem kewangan
const financialBatchRefs = ref<string[]>(['FIN-BATCH-2025-09-05-01', 'FIN-BATCH-2025-09-10-07'])
const hasDiscrepancy = computed(() => Math.round(totalJumlahRM.value * 100) !== Math.round(financialSystemTotal.value * 100))

/* ===== Table Columns ===== */
const columns = [
  { key: 'tarikhTransaksi', label: 'Tarikh Transaksi', sortable: true },
  { key: 'idPA', label: 'ID_PA', sortable: true },
  { key: 'nama', label: 'Nama', sortable: true },
  { key: 'kategori', label: 'Kategori', sortable: true },
  { key: 'jenisElaun', label: 'Jenis Elaun', sortable: true },
  { key: 'kodBajet', label: 'Kod Bajet', sortable: true },
  { key: 'bilUnit', label: 'Bil. Unit', sortable: true },
  { key: 'amaunUnitRM', label: 'Amaun Unit (RM)', sortable: true },
  { key: 'jumlahRM', label: 'Jumlah (RM)', sortable: true },
  { key: 'statusPembayaran', label: 'Status Pembayaran', sortable: true },
  { key: 'noBaucarEFT', label: 'No. Baucar / EFT Ref', sortable: true },
  { key: 'tarikhBayaran', label: 'Tarikh Bayaran', sortable: true },
  { key: 'bankAkaun', label: 'Bank / No. Akaun', sortable: true },
  { key: 'kariahDaerah', label: 'Kariah/Daerah', sortable: true },
  { key: 'catatan', label: 'Catatan', sortable: false },
]

/* ===== Export ===== */
function rowsFlatForExport() {
  return filteredRows.value.map(r => ({
    'Tarikh Transaksi': formatDate(r.tarikhTransaksi),
    ID_PA: r.idPA,
    Nama: r.nama,
    Kategori: r.kategori,
    'Jenis Elaun': r.jenisElaun,
    'Kod Bajet': r.kodBajet,
    'Bil. Unit': r.bilUnit,
    'Amaun Unit (RM)': r.amaunUnitRM,
    'Jumlah (RM)': r.jumlahRM,
    'Status Pembayaran': r.statusPembayaran,
    'No. Baucar / EFT Ref': r.noBaucarEFT,
    'Tarikh Bayaran': formatDate(r.tarikhBayaran),
    'Bank / No. Akaun': maskBankAccount(r.bankAkaun),
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
  downloadBlob(blob, `Laporan_Elaun_PA_${filters.tahun}_${filters.bulan}.csv`)
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
    downloadBlob(blob, `Laporan_Elaun_PA_${filters.tahun}_${filters.bulan}.xlsx`)
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
/* Page break per Jenis Elaun */
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
