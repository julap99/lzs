<template>
  <div class="p-6 space-y-6">
    <div>
      <h1 class="text-2xl font-semibold">Laporan Permohonan Bantuan</h1>
    </div>

    <!-- Search Section -->
    <div class="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 class="text-lg font-semibold">Carian</h2>
      </div>
      <div class="p-5">
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <FormKit
            type="select"
            label="Kategori Asnaf"
            v-model="form.kategoriAsnaf"
            :options="kategoriAsnafOptions"
            placeholder="Pilih kategori"
            :searchable="true"
          />
          <FormKit
            type="select"
            label="Kod Bantuan"
            v-model="form.kodBantuan"
            :options="kodBantuanOptions"
            placeholder="Cari kod bantuan..."
            :searchable="true"
          />
          <FormKit
            type="select"
            label="Daerah"
            v-model="form.daerah"
            :options="daerahOptions"
            placeholder="Pilih daerah"
            :searchable="true"
          />
          <FormKit
            type="select"
            label="Kariah"
            v-model="form.kariah"
            :options="kariahOptions"
            placeholder="Pilih kariah"
            :searchable="true"
          />
          <FormKit
            type="date"
            label="Tarikh Mula"
            v-model="form.tarikhMula"
            :classes="{ input: '!py-2' }"
          />
          <FormKit
            type="date"
            label="Tarikh Akhir"
            v-model="form.tarikhAkhir"
            :classes="{ input: '!py-2' }"
          />
        </div>

        <!-- Actions -->
        <div class="mt-6 flex flex-wrap items-center gap-2">
          <rs-button variant="primary" @click="searchReports">
            Cari
          </rs-button>
          <rs-button
            class="bg-gray-500 text-white hover:bg-gray-600"variant="gray"
            @click="resetForm"
          >
            Reset
          </rs-button>

        </div>
      </div>
    </div>

    <!-- Results Section -->
    <div class="rounded-2xl border border-gray-200 bg-white shadow-sm" v-if="paparHasil">
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 class="text-lg font-semibold">Laporan Permohonan Bantuan</h2>
        <div class="flex items-center gap-2">
          <rs-button variant="secondary" @click="exportPDF">PDF</rs-button>
          <rs-button variant="success" @click="exportExcel">Excel</rs-button>
        </div>
      </div>
      <div class="p-5">
        <rs-table
          :field="[
            'nama','id','jantina','umur','bilanganTanggungan','daerah','kariah',
            'kategoriAsnaf','aid','aidName','aidProduct','tarikhPermohonan','namaOrganisasi'
          ]"
          :columns="columns"
          :data="filteredRows"
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
import { reactive, ref } from 'vue'

/** -----------------------
 *  Form State & Options
 *  ----------------------*/
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
  { label: 'Am', value: 'AM' },
  { label: 'Gombak', value: 'GOMBAK' },
  { label: 'Hq', value: 'HQ' },
  { label: 'Hulu Langat', value: 'HULU LANGAT' },
  { label: 'Hulu Selangor', value: 'HULU SELANGOR' },
  { label: 'Klang', value: 'KLANG' },
  { label: 'Kuala Langat', value: 'KUALA LANGAT' },
  { label: 'Kuala Selangor', value: 'KUALA SELANGOR' },
  { label: 'Petaling', value: 'PETALING' },
  { label: 'Sabak Bernam', value: 'SABAK BERNAM' },
  { label: 'Sepang', value: 'SEPANG' },
]

const kariahOptions = [
  { label: 'Masjid Al - Azim Pandan Indah', value: 'MASJID AL - AZIM PANDAN INDAH' },
  { label: 'Masjid Al Barakah, Taman Sentosa', value: 'MASJID AL BARAKAH, TAMAN SENTOSA' },
  { label: 'Masjid Al Islah, Kg. Nelayan Telok Gong Klang', value: 'MASJID AL ISLAH, KG. NELAYAN TELOK GONG KLANG' },
  { label: 'Masjid Al-Muhtadin, Damansara Damai', value: 'MASJID AL-MUHTADIN, DAMANSARA DAMAI' },
  { label: 'Masjid Ar-Rahimah, Taman Greenwood', value: 'MASJID AR-RAHIMAH , TAMAN GREENWOOD' },
  { label: 'Masjid Ar-Raudhah, Pekan Tanjung Karang', value: 'MASJID AR-RAUDHAH , PEKAN TANJUNG KARANG' },
  { label: 'Masjid Asy-Syakirin, Taman Puchong Utama', value: 'MASJID ASY-SYAKIRIN, TAMAN PUCHONG UTAMA' },
  { label: 'Masjid Darul Muttaqin, Sg. Udang, Klang', value: 'MASJID DARUL MUTTAQIN, SG. UDANG, KLANG' },
  { label: 'Masjid Gombak Utara', value: 'MASJID GOMBAK UTARA' },
  { label: 'Masjid Jamek Kampung Sungai Plong, Kampung Sungai Plong', value: 'MASJID JAMEK KAMPUNG SUNGAI PLONG, KAMPUNG SUNGAI PLONG' },
  { label: 'Masjid Jamiul Ehsan, Kampung Kubu Gajah', value: 'MASJID JAMIUL EHSAN, KAMPUNG KUBU GAJAH' },
]

/** -----------------------
 *  Table Columns & Data
 *  ----------------------*/
const columns = [
  { key: 'nama', label: 'Nama' },
  { key: 'id', label: 'ID' },
  { key: 'jantina', label: 'Jantina' },
  { key: 'umur', label: 'Umur' },
  { key: 'bilanganTanggungan', label: 'Bilangan Tanggungan' },
  { key: 'daerah', label: 'Daerah' },
  { key: 'kariah', label: 'Kariah' },
  { key: 'kategoriAsnaf', label: 'Kategori Asnaf' },
  { key: 'aid', label: 'Aid' },
  { key: 'aidName', label: 'Aid Name' },
  { key: 'aidProduct', label: 'Aid Product' },
  { key: 'tarikhPermohonan', label: 'Tarikh Permohonan' },
  { key: 'namaOrganisasi', label: 'Nama Organisasi' },
]

// master dataset (mock; ganti dgn API result)
const allRows = ref(generateMockRows())

// helpers
const norm = s => (s || '').toString().trim().toUpperCase()
const toISO = d => (d ? new Date(d + 'T00:00:00') : null)

// filtered rows (assigned on search)
const filteredRows = ref([])

const pageSize = ref(10)
const paparHasil = ref(false)

/** -----------------------
 *  Actions
 *  ----------------------*/
function searchReports() {
  const rows = allRows.value

  // Date guards
  let start = toISO(form.tarikhMula)
  let end = toISO(form.tarikhAkhir)
  if (start && end && start > end) [start, end] = [end, start]

  filteredRows.value = rows.filter(r => {
    if (form.kategoriAsnaf && norm(r.kategoriAsnaf) !== norm(form.kategoriAsnaf)) return false
    if (form.kodBantuan && norm(r.aid) !== norm(form.kodBantuan)) return false
    if (form.daerah && norm(r.daerah) !== norm(form.daerah)) return false
    if (form.kariah && norm(r.kariah) !== norm(form.kariah)) return false
    if (start || end) {
      const t = new Date(r.tarikhPermohonan + 'T00:00:00')
      if (start && t < start) return false
      if (end && t > end) return false
    }
    return true
  })

  paparHasil.value = true
}

function exportPDF() {
  alert('Export to PDF')
}

function exportExcel() {
  alert('Export to Excel')
}

function resetForm() {
  form.kategoriAsnaf = ''
  form.kodBantuan = ''
  form.daerah = ''
  form.kariah = ''
  form.tarikhMula = ''
  form.tarikhAkhir = ''
  filteredRows.value = []
  paparHasil.value = false
}

/** -----------------------
 *  Mock Data
 *  ----------------------*/
function generateMockRows() {
  return [
    {
      nama: 'Ahmad Abdullah',
      id: '900101-14-1234',
      jantina: 'Lelaki',
      umur: 34,
      bilanganTanggungan: 3,
      daerah: 'AM',
      kariah: 'Masjid Al - Azim Pandan Indah',
      kategoriAsnaf: 'Fakir',
      aid: 'B102',
      aidName: 'Bantuan Makanan',
      aidProduct: 'Pek Asas',
      tarikhPermohonan: '2025-01-15',
      namaOrganisasi: 'Masjid Al - Azim Pandan Indah',
    },
    {
      nama: 'Siti Rahman',
      id: '920202-10-5678',
      jantina: 'Perempuan',
      umur: 32,
      bilanganTanggungan: 2,
      daerah: 'GOMBAK',
      kariah: 'Masjid Al Barakah, Taman Sentosa',
      kategoriAsnaf: 'Miskin',
      aid: 'B103',
      aidName: 'Bantuan Kewangan',
      aidProduct: 'Tunai',
      tarikhPermohonan: '2025-02-10',
      namaOrganisasi: 'Masjid Al Barakah, Taman Sentosa',
    },
    {
      nama: 'Ali Mansor',
      id: '880303-08-1122',
      jantina: 'Lelaki',
      umur: 37,
      bilanganTanggungan: 4,
      daerah: 'HQ',
      kariah: 'Masjid Al Islah, Kg. Nelayan Telok Gong Klang',
      kategoriAsnaf: 'Gharimin',
      aid: 'B104',
      aidName: 'Bantuan Pendidikan',
      aidProduct: 'Baucar',
      tarikhPermohonan: '2025-03-20',
      namaOrganisasi: 'Masjid Al Islah, Kg. Nelayan Telok Gong Klang',
    },
    {
      nama: 'Fatimah Ismail',
      id: '910404-06-3344',
      jantina: 'Perempuan',
      umur: 30,
      bilanganTanggungan: 1,
      daerah: 'HULU LANGAT',
      kariah: 'Masjid Al-Muhtadin, Damansara Damai',
      kategoriAsnaf: 'Muallaf',
      aid: 'B105',
      aidName: 'Bantuan Perubatan',
      aidProduct: 'Tunai',
      tarikhPermohonan: '2025-04-05',
      namaOrganisasi: 'Masjid Al-Muhtadin, Damansara Damai',
    },
    {
      nama: 'Mohamed Zainal',
      id: '870505-10-5566',
      jantina: 'Lelaki',
      umur: 38,
      bilanganTanggungan: 5,
      daerah: 'HULU SELANGOR',
      kariah: 'Masjid Ar-Rahimah, Taman Greenwood',
      kategoriAsnaf: 'Fi Sabilillah',
      aid: 'B106',
      aidName: 'Bantuan Rumah',
      aidProduct: 'Pek Asas',
      tarikhPermohonan: '2025-05-22',
      namaOrganisasi: 'Masjid Ar-Rahimah, Taman Greenwood',
    },
    {
      nama: 'Aminah Latif',
      id: '930606-14-7788',
      jantina: 'Perempuan',
      umur: 28,
      bilanganTanggungan: 2,
      daerah: 'KLANG',
      kariah: 'Masjid Ar-Raudhah, Pekan Tanjung Karang',
      kategoriAsnaf: 'Riqab',
      aid: 'B108',
      aidName: 'Bantuan Asasi',
      aidProduct: 'Tunai',
      tarikhPermohonan: '2025-06-12',
      namaOrganisasi: 'Masjid Ar-Raudhah, Pekan Tanjung Karang',
    },
    {
      nama: 'Rashid Omar',
      id: '850707-05-9900',
      jantina: 'Lelaki',
      umur: 40,
      bilanganTanggungan: 4,
      daerah: 'KUALA LANGAT',
      kariah: 'Masjid Asy-Syakirin, Taman Puchong Utama',
      kategoriAsnaf: 'Ibnu Sabil',
      aid: 'B109',
      aidName: 'Bantuan Ekonomi',
      aidProduct: 'Baucar',
      tarikhPermohonan: '2025-07-01',
      namaOrganisasi: 'Masjid Asy-Syakirin, Taman Puchong Utama',
    },
    {
      nama: 'Zahra Karim',
      id: '940808-03-2211',
      jantina: 'Perempuan',
      umur: 27,
      bilanganTanggungan: 1,
      daerah: 'KUALA SELANGOR',
      kariah: 'Masjid Darul Muttaqin, Sg. Udang, Klang',
      kategoriAsnaf: 'Miskin',
      aid: 'B110',
      aidName: 'Bantuan Perniagaan',
      aidProduct: 'Tunai',
      tarikhPermohonan: '2025-08-14',
      namaOrganisasi: 'Masjid Darul Muttaqin, Sg. Udang, Klang',
    },
    {
      nama: 'Hassan Bakar',
      id: '860909-12-4433',
      jantina: 'Lelaki',
      umur: 39,
      bilanganTanggungan: 3,
      daerah: 'PETALING',
      kariah: 'Masjid Gombak Utara',
      kategoriAsnaf: 'Fakir',
      aid: 'B111',
      aidName: 'Bantuan Khas',
      aidProduct: 'Pek Asas',
      tarikhPermohonan: '2025-09-09',
      namaOrganisasi: 'Masjid Gombak Utara',
    },
    {
      nama: 'Nabilah Shamsudin',
      id: '950101-07-6655',
      jantina: 'Perempuan',
      umur: 25,
      bilanganTanggungan: 2,
      daerah: 'SABAK BERNAM',
      kariah: 'Masjid Jamek Kampung Sungai Plong, Kampung Sungai Plong',
      kategoriAsnaf: 'Muallaf',
      aid: 'B112',
      aidName: 'Bantuan Pendidikan',
      aidProduct: 'Tunai',
      tarikhPermohonan: '2025-09-11',
      namaOrganisasi: 'Masjid Jamek Kampung Sungai Plong, Kampung Sungai Plong',
    },
    {
      nama: 'Jamal Rahman',
      id: '890202-11-8877',
      jantina: 'Lelaki',
      umur: 36,
      bilanganTanggungan: 4,
      daerah: 'SEPANG',
      kariah: 'Masjid Jamiul Ehsan, Kampung Kubu Gajah',
      kategoriAsnaf: 'Gharimin',
      aid: 'B113',
      aidName: 'Bantuan Kesihatan',
      aidProduct: 'Baucar',
      tarikhPermohonan: '2025-09-10',
      namaOrganisasi: 'Masjid Jamiul Ehsan, Kampung Kubu Gajah',
    },
  ]
}
</script>

<style scoped>
/* Optional: focus states for buttons */
button:focus-visible { outline: none; box-shadow: 0 0 0 2px rgba(59,130,246,0.5); }
</style>
