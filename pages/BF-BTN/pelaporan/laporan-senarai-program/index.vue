<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold">Laporan Senarai Program</h1>
        <p class="text-sm text-gray-500">Sub Modul: Mengurus Pelaporan (Program)</p>
      </div>
      <div class="flex items-center gap-2">
        <rs-button variant="secondary" @click="exportPDF">PDF</rs-button>
        <rs-button variant="success" @click="exportExcel">Excel</rs-button>
      </div>
    </div>

    <!-- 3.1 Kriteria Carian -->
    <div class="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 class="text-lg font-semibold">Kriteria Carian</h2>
      </div>
      <div class="p-5">
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <FormKit type="text" label="Jenis Laporan" v-model="filters.namaLaporan" placeholder="Laporan Senarai Program" value="Program" readonly/>

          <!-- 3.1.2 Nama Laporan (Read-only) -->
          <FormKit type="text" label="Nama Laporan" v-model="filters.namaLaporan" placeholder="Laporan Senarai Program" value="Laporan Senarai Program" readonly/>

          <!-- 3.1.3 Tarikh Dari -->
          <FormKit type="date" label="Tarikh Dari" v-model="filters.tarikhDari" :classes="{ input: '!py-2' }" />

          <!-- 3.1.4 Tarikh Hingga -->
          <FormKit type="date" label="Tarikh Hingga" v-model="filters.tarikhHingga" :classes="{ input: '!py-2' }" />

          <!-- 3.1.5 Tahun -->
          <FormKit type="text" label="Tahun" v-model="filters.tahun" placeholder="cth: 2025" />

          <!-- 3.1.6 Daerah (v-select for large dataset) -->
          <div class="formkit-field">
            <label class="formkit-label">Daerah</label>
            <v-select 
              v-model="filters.daerah"
              :options="daerahOptions"
              placeholder="Pilih daerah"
              :searchable="true"
              :clearable="true"
            />
          </div>

          <!-- 3.1.7 Cawangan (v-select) -->
          <div class="formkit-field">
            <label class="formkit-label">Cawangan</label>
            <v-select 
              v-model="filters.cawangan"
              :options="cawanganOptions"
              placeholder="Pilih cawangan"
              :searchable="true"
              :clearable="true"
            />
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-6 flex flex-wrap items-center gap-2">
          <rs-button class="bg-gray-500 text-white hover:bg-gray-600" variant="gray" @click="resetFilters">Reset</rs-button>
          <rs-button variant="primary" @click="searchPrograms">Cari</rs-button>
        </div>
      </div>
    </div>

    <!-- 3.2 Laporan Senarai Program -->
    <div class="rounded-2xl border border-gray-200 bg-white shadow-sm" v-if="paparHasil">
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 class="text-lg font-semibold">Laporan Senarai Program</h2>
        <div class="flex items-center gap-2">
          <rs-button variant="secondary" @click="exportPDF">PDF</rs-button>
          <rs-button variant="success" @click="exportExcel">Excel</rs-button>
        </div>
      </div>
      <div class="p-5">
        <rs-table
          :field="['bil','kodProgram','namaProgram','lokasiProgram','daerah','tarikhProgram','bilPeserta','status']"
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

const filters = reactive({
  tarikhDari: '',
  tarikhHingga: '',
  tahun: '',
  daerah: '',
  cawangan: '',
})

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

const cawanganOptions = [
  { label: 'HQ', value: 'HQ' },
  { label: 'Cawangan 1', value: 'CAW1' },
  { label: 'Cawangan 2', value: 'CAW2' },
]

const columns = [
  { key: 'bil', label: 'Bil' },
  { key: 'kodProgram', label: 'Kod Program' },
  { key: 'namaProgram', label: 'Nama Program' },
  { key: 'lokasiProgram', label: 'Lokasi Program' },
  { key: 'daerah', label: 'Daerah' },
  { key: 'tarikhProgram', label: 'Tarikh Program' },
  { key: 'bilPeserta', label: 'Bilangan Peserta' },
  { key: 'status', label: 'Status' },
]

const allRows = ref(generateMockRows())
const filteredRows = ref([])
const pageSize = ref(10)
const paparHasil = ref(false)

function norm(s) { return (s || '').toString().trim().toUpperCase() }
function toISO(d) { return d ? new Date(d + 'T00:00:00') : null }

function searchPrograms() {
  const rows = allRows.value
  let start = toISO(filters.tarikhDari)
  let end = toISO(filters.tarikhHingga)
  if (start && end && start > end) [start, end] = [end, start]

  filteredRows.value = rows.filter(r => {
    if (filters.tahun && String(new Date(r.tarikhProgram).getFullYear()) !== String(filters.tahun)) return false
    if (filters.daerah && norm(r.daerah) !== norm(filters.daerah)) return false
    if (filters.cawangan && norm(r.cawangan) !== norm(filters.cawangan)) return false
    if (start || end) {
      const t = new Date(r.tarikhProgram)
      if (start && t < start) return false
      if (end && t > end) return false
    }
    return true
  })
  paparHasil.value = true
}

function resetFilters() {
  filters.tarikhDari = ''
  filters.tarikhHingga = ''
  filters.tahun = ''
  filters.daerah = ''
  filters.cawangan = ''
  filteredRows.value = []
  paparHasil.value = false
}

function exportPDF() { alert('Export to PDF') }
function exportExcel() { alert('Export to Excel') }

function generateMockRows() {
  return [
    {
      bil: 1,
      kodProgram: 'PRG-2025-001',
      namaProgram: 'Program Bantuan Pendidikan',
      lokasiProgram: 'Dewan Komuniti Pandan Indah',
      daerah: 'AM',
      cawangan: 'HQ',
      tarikhProgram: '2025-03-12',
      bilPeserta: 120,
      status: 'Selesai',
    },
    {
      bil: 2,
      kodProgram: 'PRG-2025-014',
      namaProgram: 'Program Kesihatan Komuniti',
      lokasiProgram: 'Klinik Desa Taman Sentosa',
      daerah: 'GOMBAK',
      cawangan: 'CAW1',
      tarikhProgram: '2025-04-05',
      bilPeserta: 80,
      status: 'Dalam Proses',
    },
    {
      bil: 3,
      kodProgram: 'PRG-2025-021',
      namaProgram: 'Program Ekonomi Asnaf',
      lokasiProgram: 'Kompleks Niaga Seri Muda',
      daerah: 'PETALING',
      cawangan: 'CAW2',
      tarikhProgram: '2025-05-20',
      bilPeserta: 60,
      status: 'Draf',
    },
  ]
}
</script>

<style scoped>
button:focus-visible { outline: none; box-shadow: 0 0 0 2px rgba(59,130,246,0.5); }
</style>


