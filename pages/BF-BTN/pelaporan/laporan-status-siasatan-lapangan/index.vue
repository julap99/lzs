<template>
  <div class="p-6 space-y-6">
    <!-- Title -->
    <div>
      <h1 class="text-2xl font-semibold">Laporan Status Siasatan Lapangan</h1>
    </div>

    <!-- Carian -->
    <div class="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 class="text-lg font-semibold">Carian</h2>
      </div>

      <div class="p-5">
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <FormKit type="select" label="Kategori Asnaf" v-model="form.kategoriAsnaf"
                   :options="kategoriAsnafOptions" placeholder="Pilih kategori" :searchable="true"/>
          <FormKit type="select" label="Kod Bantuan" v-model="form.kodBantuan"
                   :options="kodBantuanOptions" placeholder="Cari kod bantuan..." :searchable="true"/>
          <FormKit type="select" label="Daerah" v-model="form.daerah"
                   :options="daerahOptions" placeholder="Pilih daerah" :searchable="true"/>
          <FormKit type="select" label="Kariah" v-model="form.kariah"
                   :options="kariahOptions" placeholder="Pilih kariah" :searchable="true"/>
          <FormKit type="date" label="Tarikh Mula" v-model="form.tarikhMula" :classes="{ input: '!py-2' }"/>
          <FormKit type="date" label="Tarikh Akhir" v-model="form.tarikhAkhir" :classes="{ input: '!py-2' }"/>
        </div>

        <div class="mt-6 flex flex-wrap items-center gap-2">
          <rs-button variant="primary" @click="onSearch">Cari</rs-button>
          <rs-button variant="secondary" class="!bg-gray-500 !text-white hover:!bg-gray-600" @click="onReset">Reset</rs-button>
        </div>
      </div>
    </div>

    <!-- Hasil -->
    <div v-if="paparHasil" class="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 class="text-lg font-semibold">Laporan Status Siasatan Lapangan</h2>
        <div class="flex items-center gap-2">
          <rs-button variant="secondary" @click="exportPDF">PDF</rs-button>
          <rs-button variant="success" @click="exportExcel">Excel</rs-button>
        </div>
      </div>

      <div class="p-5">
        <rs-table
          :field="fieldOrder"
          :columns="columns"
          :data="displayedRows"
          :advanced="true"
          :show-search="true"
          :show-filter="true"
          :show-no-column="true"
          :options="{ variant: 'default', striped: true, bordered: false, borderless: false, hover: true }"
          :options-advanced="{ sortable: true, filterable: true, responsive: true, outsideBorder: false }"
          :page-size="pageSize"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'

/* ---------------------------
   Form State & Options
--------------------------- */
const form = reactive({
  kategoriAsnaf: '',
  kodBantuan: '',
  daerah: '',
  kariah: '',
  tarikhMula: '',
  tarikhAkhir: '',
})

const kategoriAsnafOptions = [
  { label: 'Fakir', value: 'Fakir' },
  { label: 'Miskin', value: 'Miskin' },
  { label: 'Muallaf', value: 'Muallaf' },
  { label: 'Gharimin', value: 'Gharimin' },
  { label: 'Ibnu Sabil', value: 'Ibnu Sabil' },
  { label: 'Riqab', value: 'Riqab' },
  { label: 'Fi Sabilillah', value: 'Fi Sabilillah' },
]

const kodBantuanOptions = [
  'B102','B103','B104','B105','B106','B108','B109','B110','B111','B112',
  'B113','B114','B115','B116','B117','B118','B120','B121','B123','B125',
  'B126','B128','B129','B131','B132','B134','B135','B136','B137','B138',
  'B139','B143','B146','B148','B151','B156','B157','B165','B171','B172',
  'B173','B210','B300','B303','B305','B306','B307','B308','B309','B311',
  'B312','B313','B314','B315','B321','B322','B324','B400','B500','B501',
  'B502','B508','B509','C128','C129','C132','C156','C157','C501','C502',
  'G129','G156','G157','G501','G502','L500'
].map(v => ({ label: v, value: v }))

const daerahOptions = [
  { label: 'AM', value: 'AM' },
  { label: 'GOMBAK', value: 'GOMBAK' },
  { label: 'HQ', value: 'HQ' },
  { label: 'HULU LANGAT', value: 'HULU LANGAT' },
  { label: 'HULU SELANGOR', value: 'HULU SELANGOR' },
  { label: 'KLANG', value: 'KLANG' },
  { label: 'KUALA LANGAT', value: 'KUALA LANGAT' },
  { label: 'KUALA SELANGOR', value: 'KUALA SELANGOR' },
  { label: 'PETALING', value: 'PETALING' },
  { label: 'SABAK BERNAM', value: 'SABAK BERNAM' },
  { label: 'SEPANG', value: 'SEPANG' },
]

const kariahOptions = [
  { label: 'MASJID AL - AZIM PANDAN INDAH', value: 'MASJID AL - AZIM PANDAN INDAH' },
  { label: 'MASJID AL BARAKAH, TAMAN SENTOSA', value: 'MASJID AL BARAKAH, TAMAN SENTOSA' },
  { label: 'MASJID AL ISLAH, KG. NELAYAN TELOK GONG KLANG', value: 'MASJID AL ISLAH, KG. NELAYAN TELOK GONG KLANG' },
  { label: 'MASJID AL-MUHTADIN, DAMANSARA DAMAI', value: 'MASJID AL-MUHTADIN, DAMANSARA DAMAI' },
  { label: 'MASJID AR-RAHIMAH , TAMAN GREENWOOD', value: 'MASJID AR-RAHIMAH , TAMAN GREENWOOD' },
  { label: 'MASJID AR-RAUDHAH , PEKAN TANJUNG KARANG', value: 'MASJID AR-RAUDHAH , PEKAN TANJUNG KARANG' },
  { label: 'MASJID ASY-SYAKIRIN, TAMAN PUCHONG UTAMA', value: 'MASJID ASY-SYAKIRIN, TAMAN PUCHONG UTAMA' },
  { label: 'MASJID DARUL MUTTAQIN, SG. UDANG, KLANG', value: 'MASJID DARUL MUTTAQIN, SG. UDANG, KLANG' },
  { label: 'MASJID GOMBAK UTARA', value: 'MASJID GOMBAK UTARA' },
  { label: 'MASJID JAMEK KAMPUNG SUNGAI PLONG, KAMPUNG SUNGAI PLONG', value: 'MASJID JAMEK KAMPUNG SUNGAI PLONG, KAMPUNG SUNGAI PLONG' },
  { label: 'MASJID JAMIUL EHSAN, KAMPUNG KUBU GAJAH', value: 'MASJID JAMIUL EHSAN, KAMPUNG KUBU GAJAH' },
]

/* ---------------------------
   Columns (exact labels 1–17)
--------------------------- */
const fieldOrder = [
  'nama',               // 1. Nama
  'id',                 // 2. ID
  'jantina',            // 3. Jantina
  'umur',               // 4. Umur
  'bilanganTanggungan', // 5. Bilangan Tanggungan
  'daerah',             // 6. Daerah
  'kariah',             // 7. Kariah
  'aid',                // 8. Aid
  'aidName',            // 9. Aid Name
  'aidProduct',         // 10. Aid Product
  'productPackage',     // 11. Product Package
  'entitlementProduct', // 12. Entitlement Product
  'statusSiasatan',     // 13. Status Siasatan Lapangan
  'tarikhMasaSiasatan', // 14. Tarikh & Masa Siasatan (formatted for table)
  'namaPegawai',        // 15. Nama Pegawai
  'catatanLapangan',    // 16. Catatan Lapangan
  'namaOrganisasi'      // 17. Nama Organisasi (masjid/ surau)
]

const columns = [
  { key: 'nama', label: 'Nama' },
  { key: 'id', label: 'ID' },
  { key: 'jantina', label: 'Jantina' },
  { key: 'umur', label: 'Umur' },
  { key: 'bilanganTanggungan', label: 'Bilangan Tanggungan' },
  { key: 'daerah', label: 'Daerah' },
  { key: 'kariah', label: 'Kariah' },
  { key: 'aid', label: 'Aid' },
  { key: 'aidName', label: 'Aid Name' },
  { key: 'aidProduct', label: 'Aid Product' },
  { key: 'productPackage', label: 'Product Package' },
  { key: 'entitlementProduct', label: 'Entitlement Product' },
  { key: 'statusSiasatan', label: 'Status Siasatan Lapangan' },
  { key: 'tarikhMasaSiasatan', label: 'Tarikh & Masa Siasatan' },
  { key: 'namaPegawai', label: 'Nama Pegawai' },
  { key: 'catatanLapangan', label: 'Catatan Lapangan' },
  { key: 'namaOrganisasi', label: 'Nama Organisasi (masjid/ surau)' },
]

/* ---------------------------
   Data & Filtering
   - keep ISO for filtering (tarikhMasaSiasatanISO)
   - display formatted in table (tarikhMasaSiasatan)
--------------------------- */
const allRows = ref(generateMockRows())
const filteredRows = ref([])
const pageSize = ref(10)
const paparHasil = ref(false)

const norm = (s) => (s ?? '').toString().trim().toUpperCase()
const parseDateOnly = (d) => (d ? new Date(`${d}T00:00:00`) : null)
const fmtDateTime = (iso) => {
  const dt = new Date(iso)
  if (Number.isNaN(dt.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  const y = dt.getFullYear()
  const m = pad(dt.getMonth() + 1)
  const d = pad(dt.getDate())
  const hh = pad(dt.getHours())
  const mm = pad(dt.getMinutes())
  return `${y}-${m}-${d} ${hh}:${mm}`
}

/* rows for table display (format date) */
const displayedRows = computed(() =>
  filteredRows.value.map(r => ({
    ...r,
    tarikhMasaSiasatan: fmtDateTime(r.tarikhMasaSiasatanISO),
  }))
)

function onSearch() {
  const startRaw = parseDateOnly(form.tarikhMula)
  const endRaw = parseDateOnly(form.tarikhAkhir)
  let start = startRaw
  let end = endRaw
  if (start && end && start > end) [start, end] = [end, start]

  filteredRows.value = allRows.value.filter((r) => {
    if (form.kategoriAsnaf && norm(r.kategoriAsnaf) !== norm(form.kategoriAsnaf)) return false
    if (form.kodBantuan && norm(r.aid) !== norm(form.kodBantuan)) return false
    if (form.daerah && norm(r.daerah) !== norm(form.daerah)) return false
    if (form.kariah && norm(r.kariah) !== norm(form.kariah)) return false

    if (start || end) {
      const t = new Date(r.tarikhMasaSiasatanISO)
      if (Number.isNaN(t.getTime())) return false
      if (start && t < start) return false
      if (end && t > end) return false
    }
    return true
  })

  paparHasil.value = true
}

function onReset() {
  form.kategoriAsnaf = ''
  form.kodBantuan = ''
  form.daerah = ''
  form.kariah = ''
  form.tarikhMula = ''
  form.tarikhAkhir = ''
  filteredRows.value = []
  paparHasil.value = false
}

/* ---------------------------
   Export
--------------------------- */
function exportPDF() {
  window.print()
}

function exportExcel() {
  if (!filteredRows.value.length) return
  const headers = columns.map(c => `"${c.label.replace(/"/g, '""')}"`).join(',')
  const rows = displayedRows.value.map(r => fieldOrder
    .map(k => `"${String(r?.[k] ?? '').replace(/"/g, '""')}"`)
    .join(',')
  )
  const csv = [headers, ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  // Use RegExp constructor to avoid Tailwind JIT mis-parsing /[-:T]/ as an arbitrary property class
  const stamp = new Date().toISOString().replace(new RegExp('[-:T]', 'g'), '').slice(0, 12)
  a.href = url
  a.download = `Laporan_Status_Siasatan_Lapangan_${stamp}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

/* ---------------------------
   Mock Data (exact 17 columns)
   - tarikhMasaSiasatanISO kept for filtering
   - tarikhMasaSiasatan (formatted) generated at display time
--------------------------- */
function generateMockRows() {
  const now = Date.now()
  const ago = (d, h = 9, m = 0) => new Date(now - d * 86400000).setHours(h, m, 0, 0)
  const toISO = (ms) => new Date(ms).toISOString()

  return [
    {
      nama: 'Ahmad Abdullah', id: '900101-14-1234', jantina: 'Lelaki', umur: 34, bilanganTanggungan: 3,
      daerah: 'AM', kariah: 'MASJID AL - AZIM PANDAN INDAH', aid: 'B102', aidName: 'Bantuan Makanan',
      aidProduct: 'Pek Asas', productPackage: 'Pakej 1', entitlementProduct: 'Entitle A',
      statusSiasatan: 'Selesai', tarikhMasaSiasatanISO: toISO(ago(3, 10, 30)),
      namaPegawai: 'Ali', catatanLapangan: 'Semakan selesai di lokasi.',
      namaOrganisasi: 'MASJID AL - AZIM PANDAN INDAH',
      kategoriAsnaf: 'Fakir',
    },
    {
      nama: 'Siti Rahman', id: '920202-10-5678', jantina: 'Perempuan', umur: 32, bilanganTanggungan: 2,
      daerah: 'GOMBAK', kariah: 'MASJID AL BARAKAH, TAMAN SENTOSA', aid: 'B103', aidName: 'Bantuan Kewangan',
      aidProduct: 'Tunai', productPackage: 'Pakej 2', entitlementProduct: 'Entitle B',
      statusSiasatan: 'Dalam Proses', tarikhMasaSiasatanISO: toISO(ago(5, 14, 5)),
      namaPegawai: 'Siti', catatanLapangan: 'Dokumen sokongan sedang disemak.',
      namaOrganisasi: 'MASJID AL BARAKAH, TAMAN SENTOSA',
      kategoriAsnaf: 'Miskin',
    },
    {
      nama: 'Ali Mansor', id: '880303-08-1122', jantina: 'Lelaki', umur: 37, bilanganTanggungan: 4,
      daerah: 'HQ', kariah: 'MASJID AL ISLAH, KG. NELAYAN TELOK GONG KLANG', aid: 'B104', aidName: 'Bantuan Pendidikan',
      aidProduct: 'Baucar', productPackage: 'Pakej 3', entitlementProduct: 'Entitle C',
      statusSiasatan: 'Tertangguh', tarikhMasaSiasatanISO: toISO(ago(8, 16, 45)),
      namaPegawai: 'Kumar', catatanLapangan: 'Menunggu pengesahan sekolah.',
      namaOrganisasi: 'MASJID AL ISLAH, KG. NELAYAN TELOK GONG KLANG',
      kategoriAsnaf: 'Gharimin',
    },
    {
      nama: 'Fatimah Ismail', id: '910404-06-3344', jantina: 'Perempuan', umur: 30, bilanganTanggungan: 1,
      daerah: 'HULU LANGAT', kariah: 'MASJID AL-MUHTADIN, DAMANSARA DAMAI', aid: 'B105', aidName: 'Bantuan Perubatan',
      aidProduct: 'Tunai', productPackage: 'Pakej 1', entitlementProduct: 'Entitle A',
      statusSiasatan: 'Selesai', tarikhMasaSiasatanISO: toISO(ago(2, 11, 10)),
      namaPegawai: 'Siti', catatanLapangan: 'Pembelian ubat diluluskan.',
      namaOrganisasi: 'MASJID AL-MUHTADIN, DAMANSARA DAMAI',
      kategoriAsnaf: 'Muallaf',
    },
    {
      nama: 'Goh Wei Ming', id: '850505-12-7788', jantina: 'Lelaki', umur: 40, bilanganTanggungan: 2,
      daerah: 'KLANG', kariah: 'MASJID DARUL MUTTAQIN, SG. UDANG, KLANG', aid: 'B156', aidName: 'Bantuan Sewa Rumah',
      aidProduct: 'Tunai', productPackage: 'Pakej 1', entitlementProduct: 'Entitle D',
      statusSiasatan: 'Dalam Proses', tarikhMasaSiasatanISO: toISO(ago(1, 9, 0)),
      namaPegawai: 'Amin', catatanLapangan: 'Semakan kadar sewa.',
      namaOrganisasi: 'MASJID DARUL MUTTAQIN, SG. UDANG, KLANG',
      kategoriAsnaf: 'Miskin',
    },
    {
      nama: 'Nur Aisyah Bakar', id: '940606-07-9988', jantina: 'Perempuan', umur: 31, bilanganTanggungan: 3,
      daerah: 'PETALING', kariah: 'MASJID GOMBAK UTARA', aid: 'B171', aidName: 'Bantuan Peralatan Sekolah',
      aidProduct: 'Baucar', productPackage: 'Pakej 2', entitlementProduct: 'Entitle A',
      statusSiasatan: 'Selesai', tarikhMasaSiasatanISO: toISO(ago(4, 15, 20)),
      namaPegawai: 'Lina', catatanLapangan: 'Peralatan telah diserahkan.',
      namaOrganisasi: 'MASJID GOMBAK UTARA',
      kategoriAsnaf: 'Fakir',
    },
    {
      nama: 'Raj Kumar', id: '830707-10-2244', jantina: 'Lelaki', umur: 42, bilanganTanggungan: 5,
      daerah: 'SEPANG', kariah: 'MASJID JAMIUL EHSAN, KAMPUNG KUBU GAJAH', aid: 'B321', aidName: 'Bantuan Modal Niaga',
      aidProduct: 'Tunai', productPackage: 'Pakej 3', entitlementProduct: 'Entitle E',
      statusSiasatan: 'Tertangguh', tarikhMasaSiasatanISO: toISO(ago(10, 13, 0)),
      namaPegawai: 'Farid', catatanLapangan: 'Menunggu pelan perniagaan.',
      namaOrganisasi: 'MASJID JAMIUL EHSAN, KAMPUNG KUBU GAJAH',
      kategoriAsnaf: 'Riqab',
    },
    {
      nama: 'Zainab Omar', id: '970808-02-5566', jantina: 'Perempuan', umur: 28, bilanganTanggungan: 0,
      daerah: 'KUALA SELANGOR', kariah: 'MASJID AR-RAUDHAH , PEKAN TANJUNG KARANG', aid: 'B500', aidName: 'Bantuan Kecemasan',
      aidProduct: 'Tunai', productPackage: 'Pakej 1', entitlementProduct: 'Entitle A',
      statusSiasatan: 'Dalam Proses', tarikhMasaSiasatanISO: toISO(ago(6, 17, 40)),
      namaPegawai: 'Hana', catatanLapangan: 'Lawatan susulan dijadualkan.',
      namaOrganisasi: 'MASJID AR-RAUDHAH , PEKAN TANJUNG KARANG',
      kategoriAsnaf: 'Ibnu Sabil',
    },
  ]
}
</script>

<style scoped>
button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59,130,246,0.5);
}
@media print {
  .p-6 { padding: 0; }
  .rounded-2xl, .shadow-sm, .border { border: none; box-shadow: none; }
}
</style>
