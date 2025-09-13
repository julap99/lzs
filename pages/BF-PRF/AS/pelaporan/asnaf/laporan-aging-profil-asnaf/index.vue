<template>
  <div class="p-6 space-y-4">
    <!-- Breadcrumb -->
    <div>
      <layouts-breadcrumb :items="breadcrumb" />
    </div>

    <!-- Kad laporan -->
    <rs-card class="mt-2">
      <!-- Body kad dengan padding supaya table tak rapat tepi -->
      <div class="p-4 md:p-6 space-y-4">
        <!-- Header: logo di atas, kod + tajuk di bawah logo, tarikh/masa di kanan -->
        <div class="flex items-start justify-between gap-6">
          <div class="flex flex-col items-start">
            <img src="/assets/img/logo/lzs-logo-main.png" alt="Logo LZS" class="h-12 w-auto" />
            <div class="mt-2 leading-tight">
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
            <div><span class="opacity-70">Masa:</span> {{ formatTime(generatedAt) }}</div>
          </div>
        </div>


        <!-- Jadual laporan -->
        <div class="mt-2">
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
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

definePageMeta({ title: 'Pelaporan — Laporan Aging Profil Asnaf' })

// ===== Breadcrumb =====
const breadcrumb = [
  { name: 'Pelaporan', type: 'link', path: '/BF-PRF/pelaporan' },
  { name: 'Laporan Aging Profil Asnaf', type: 'text' },
]

// ===== Meta laporan =====
const reportCode = 'RP0001'
const reportName = 'Laporan Aging Profil Asnaf'
const logoUrl = '/assets/img/logo/lzs-logo-main.png'

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
function janaLaporan() {
  generatedAt.value = new Date()
}

// ===== Util format =====
function pad(n) { return n.toString().padStart(2, '0') }
function formatDate(d) {
  if (!d) return '-'
  const dt = new Date(d)
  return `${pad(dt.getDate())}/${pad(dt.getMonth() + 1)}/${dt.getFullYear()}`
}
function formatTime(d) {
  if (!d) return '-'
  const dt = new Date(d)
  return `${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())}`
}

// ===== rs-table config =====
// Nota: kita TIDAK letak 'Bil' dalam field/columns kerana No. akan dijana oleh rs-table (showNoColumn=true)
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

// Bentuk data untuk rs-table
const tableRows = computed(() =>
  sourceRows.value.map((r) => ({
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
</script>

<style scoped>
/* Biarkan teks boleh balut dan tambah ruang yang kemas */
:deep(.table-content thead tr th),
:deep(.table-content tbody tr td) {
  white-space: normal;
}

/* Kolum No. (auto dari showNoColumn) – kecil & center */
:deep(.table-content thead tr th:nth-child(1)),
:deep(.table-content tbody tr td:nth-child(1)) {
  min-width: 64px !important;
  width: 72px !important;
  max-width: 80px !important;
  text-align: center;
  padding-left: 1rem !important;
  padding-right: 1rem !important;
}

/* Kolum alamat biar lebih luas untuk elak sempit */
:deep(.table-content thead tr th:nth-child(4)),
:deep(.table-content tbody tr td:nth-child(4)) {
  min-width: 280px !important;
}

/* --- Pastikan rupa “ada garis tepi” & kemasan footer seperti contoh --- */
:deep(.table-wrapper) {
  border: 1px solid rgb(var(--border-color)); /* garis tepi luar */
  border-radius: 0.75rem;                      /* bucu bulat macam screenshot */
  overflow: hidden;                             /* elak border terputus */
}
:deep(.table-footer) {
  border-top: 1px solid rgb(var(--border-color)); /* garis penutup atas pagination */
}

@media print {
  .print\:hidden { display: none !important; }
}
</style>
