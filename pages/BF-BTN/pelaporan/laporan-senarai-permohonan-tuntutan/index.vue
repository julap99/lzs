<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold">Laporan Senarai Permohonan Tuntutan</h1>
        <p class="text-sm text-gray-500">Sub Modul: Mengurus Pelaporan (Tuntutan)</p>
      </div>
    </div>

    <!-- 3.1 Kriteria Carian -->
    <div class="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 class="text-lg font-semibold">Kriteria Carian</h2>
      </div>
      <div class="p-5">
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <!-- 3.1.1 Jenis Laporan (Read-only) -->
          <FormKit type="text" label="Jenis Laporan" v-model="filters.jenisLaporan" placeholder="Tuntutan" value="Tuntutan" readonly/>

          <!-- 3.1.2 Nama Laporan (Read-only) -->
          <FormKit type="text" label="Nama Laporan" v-model="filters.namaLaporan" placeholder="Laporan Senarai Permohonan Tuntutan" value="Laporan Senarai Permohonan Tuntutan" readonly/>

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
          <rs-button variant="primary" @click="searchTuntutan">Cari</rs-button>
        </div>
      </div>
    </div>

    <!-- 3.2 Laporan Senarai Tuntutan -->
    <div class="rounded-2xl border border-gray-200 bg-white shadow-sm" v-if="paparHasil">
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 class="text-lg font-semibold">Laporan Senarai Tuntutan</h2>
        <div class="flex items-center gap-2">
          <rs-button variant="secondary" @click="exportPDF">PDF</rs-button>
          <rs-button variant="success" @click="exportExcel">Excel</rs-button>
        </div>
      </div>
      <div class="p-5">
        <rs-table
          :field="['bil','noTuntutan','aid','aidProduct','daerah','cawangan','tarikhPermohonan','statusPermohonan','jumlahTuntutan']"
          :columns="columns"
          :data="filteredRows"
          :advanced="true"
          :show-search="true"
          :show-filter="true"
          :show-no-column="false"
          :options="{ variant: 'default', striped: true, bordered: false, borderless: false, hover: true }"
          :options-advanced="{ sortable: true, filterable: true, responsive: true, outsideBorder: true }"
          :page-size="pageSize"
        >
          <template #statusPermohonan="{ text }">
            <rs-badge :variant="getStatusVariant(text)">
              {{ text }}
            </rs-badge>
          </template>
          <template #jumlahTuntutan="{ text }">
            {{ formatCurrency(text) }}
          </template>
        </rs-table>
      </div>
    </div>
  </div>

  <!-- PDF Modal -->
  <rs-modal v-model="showPDFModal" title="Laporan Senarai Permohonan Tuntutan" size="xl" position="center">
    <template #body>
      <div class="space-y-6">
        <!-- Report Header -->
        <div class="flex justify-between items-start pb-4 border-b">
          <div class="flex-1">
            <img src="https://www.zakatselangor.com.my/wp-content/uploads/2018/10/lzs-logo.png" alt="LZS" class="h-12 mb-4" />
            <div class="text-sm text-gray-600">
              <div class="font-semibold text-gray-900">Lembaga Zakat Selangor</div>
              <div>Majlis Agama Islam Selangor</div>
              <div>Menara Selatan, Bangunan Sultan Idris Shah</div>
              <div>Persiaran Masjid, Seksyen 5</div>
              <div>40000 Shah Alam, Selangor</div>
            </div>
          </div>
          <div class="text-right text-sm text-gray-600">
            <div class="font-semibold text-gray-900 mb-2">RT0001 Laporan Senarai Permohonan Tuntutan Tahun 2025</div>
            <div>Tarikh: {{ new Date().toLocaleDateString('ms-MY') }}</div>
            <div>Masa: {{ new Date().toLocaleTimeString('ms-MY') }}</div>
          </div>
        </div>

        <!-- Report Content -->
        <div class="space-y-4">
          <div class="text-center">
            <h2 class="text-xl font-bold text-gray-900">
              LAPORAN SENARAI PERMOHONAN TUNTUTAN TAHUN 2025
            </h2>
          </div>

          <!-- Data Table -->
          <div class="overflow-x-auto">
            <table class="w-full border-collapse border border-gray-300">
              <thead>
                <tr class="bg-blue-50">
                  <th class="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Bil</th>
                  <th class="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">No. Tuntutan</th>
                  <th class="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Aid</th>
                  <th class="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Aid Product</th>
                  <th class="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Daerah</th>
                  <th class="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Cawangan</th>
                  <th class="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Tarikh Permohonan</th>
                  <th class="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Status Permohonan</th>
                  <th class="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Jumlah Tuntutan (RM)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in filteredRows" :key="index" :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                  <td class="border border-gray-300 px-3 py-2 text-sm">{{ row.bil }}</td>
                  <td class="border border-gray-300 px-3 py-2 text-sm font-medium text-blue-600">{{ row.noTuntutan }}</td>
                  <td class="border border-gray-300 px-3 py-2 text-sm">{{ row.aid }}</td>
                  <td class="border border-gray-300 px-3 py-2 text-sm">{{ row.aidProduct }}</td>
                  <td class="border border-gray-300 px-3 py-2 text-sm">{{ row.daerah }}</td>
                  <td class="border border-gray-300 px-3 py-2 text-sm">{{ row.cawangan }}</td>
                  <td class="border border-gray-300 px-3 py-2 text-sm">{{ row.tarikhPermohonan }}</td>
                  <td class="border border-gray-300 px-3 py-2 text-sm">
                    <span :class="getStatusClass(row.statusPermohonan)" class="px-2 py-1 rounded-full text-xs font-medium">
                      {{ row.statusPermohonan }}
                    </span>
                  </td>
                  <td class="border border-gray-300 px-3 py-2 text-sm text-right font-medium">{{ formatCurrency(row.jumlahTuntutan) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Summary -->
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="font-semibold text-gray-900 mb-2">Ringkasan Laporan:</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span class="font-semibold text-gray-700">Jumlah Tuntutan:</span>
                <span class="text-gray-900 ml-2">{{ filteredRows.length }}</span>
              </div>
              <div>
                <span class="font-semibold text-gray-700">Jumlah Nilai (RM):</span>
                <span class="text-gray-900 ml-2">{{ formatCurrency(filteredRows.reduce((sum, row) => sum + row.jumlahTuntutan, 0)) }}</span>
              </div>
              <div>
                <span class="font-semibold text-gray-700">Tuntutan Lulus:</span>
                <span class="text-gray-900 ml-2">{{ filteredRows.filter(row => row.statusPermohonan === 'Lulus').length }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-center gap-3">
        <rs-button variant="success-outline" @click="downloadPDF">
          <Icon name="heroicons:arrow-down-tray" size="16" class="mr-2" />
          Muat Turun PDF
        </rs-button>
        <rs-button variant="primary-outline" @click="showPDFModal = false">
          <Icon name="heroicons:x-mark" size="16" class="mr-2" />
          Tutup Laporan
        </rs-button>
      </div>
    </template>
  </rs-modal>
</template>

<script setup>
import { reactive, ref } from 'vue'
import kariahData from './kariah-data.json'

const filters = reactive({
  jenisLaporan: 'Tuntutan',
  namaLaporan: 'Laporan Senarai Permohonan Tuntutan',
  tarikhDari: '',
  tarikhHingga: '',
  tahun: '',
  daerah: '',
  cawangan: '',
})

const daerahOptions = kariahData.daerahOptions

const cawanganOptions = [
  { label: 'HQ', value: 'HQ' },
  { label: 'Cawangan 1', value: 'CAW1' },
  { label: 'Cawangan 2', value: 'CAW2' },
]

const columns = [
  { key: 'bil', label: 'Bil' },
  { key: 'noTuntutan', label: 'No. Tuntutan' },
  { key: 'aid', label: 'Aid' },
  { key: 'aidProduct', label: 'Aid Product' },
  { key: 'daerah', label: 'Daerah' },
  { key: 'cawangan', label: 'Cawangan' },
  { key: 'tarikhPermohonan', label: 'Tarikh Permohonan' },
  { key: 'statusPermohonan', label: 'Status Permohonan' },
  { key: 'jumlahTuntutan', label: 'Jumlah Tuntutan (RM)' },
]

const allRows = ref(generateMockRows())
const filteredRows = ref([])
const pageSize = ref(10)
const paparHasil = ref(false)
const showPDFModal = ref(false)

function norm(s) { return (s || '').toString().trim().toUpperCase() }
function toISO(d) { return d ? new Date(d + 'T00:00:00') : null }

function searchTuntutan() {
  const rows = allRows.value
  let start = toISO(filters.tarikhDari)
  let end = toISO(filters.tarikhHingga)
  if (start && end && start > end) [start, end] = [end, start]

  filteredRows.value = rows.filter(r => {
    // Year filter - check if year matches
    if (filters.tahun && filters.tahun.trim() !== '') {
      const rowYear = new Date(r.tarikhPermohonan).getFullYear()
      if (String(rowYear) !== String(filters.tahun)) return false
    }
    
    // District filter - check if daerah matches (case insensitive)
    if (filters.daerah && filters.daerah.trim() !== '') {
      const selectedDaerah = typeof filters.daerah === 'object' ? filters.daerah.value : filters.daerah
      if (norm(r.daerah) !== norm(selectedDaerah)) return false
    }
    
    // Branch filter - check if cawangan matches (case insensitive)
    if (filters.cawangan && filters.cawangan.trim() !== '') {
      const selectedCawangan = typeof filters.cawangan === 'object' ? filters.cawangan.value : filters.cawangan
      if (norm(r.cawangan) !== norm(selectedCawangan)) return false
    }
    
    // Date range filter
    if (start || end) {
      const t = new Date(r.tarikhPermohonan)
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

function exportPDF() { 
  showPDFModal.value = true
}

function exportExcel() { 
  // Convert data to CSV
  const csvData = convertToCSV(filteredRows.value)
  downloadCSV(csvData, 'laporan-senarai-permohonan-tuntutan.csv')
}

// Convert data to CSV format
function convertToCSV(data) {
  if (!data || data.length === 0) return ''
  
  const headers = ['Bil', 'No. Tuntutan', 'Aid', 'Aid Product', 'Daerah', 'Cawangan', 'Tarikh Permohonan', 'Status Permohonan', 'Jumlah Tuntutan (RM)']
  const csvContent = [
    headers.join(','),
    ...data.map(row => [
      row.bil,
      `"${row.noTuntutan}"`,
      `"${row.aid}"`,
      `"${row.aidProduct}"`,
      `"${row.daerah}"`,
      `"${row.cawangan}"`,
      `"${row.tarikhPermohonan}"`,
      `"${row.statusPermohonan}"`,
      row.jumlahTuntutan
    ].join(','))
  ].join('\n')
  
  return csvContent
}

// Download CSV file
function downloadCSV(csvContent, filename) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Get status class for styling
function getStatusClass(status) {
  switch (status) {
    case 'Lulus':
      return 'bg-green-100 text-green-800'
    case 'Dalam Proses':
      return 'bg-yellow-100 text-yellow-800'
    case 'Ditolak':
      return 'bg-red-100 text-red-800'
    case 'Draf':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Get status variant for rs-badge
function getStatusVariant(status) {
  switch (status) {
    case 'Lulus':
      return 'success'
    case 'Dalam Proses':
      return 'warning'
    case 'Ditolak':
      return 'danger'
    case 'Draf':
      return 'secondary'
    default:
      return 'secondary'
  }
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('ms-MY', { 
    style: 'currency', 
    currency: 'MYR',
    minimumFractionDigits: 2 
  }).format(amount)
}

// Download PDF (placeholder - you can integrate with a PDF library like jsPDF)
function downloadPDF() {
  // For now, just show an alert. In a real implementation, you would:
  // 1. Use a library like jsPDF or html2pdf to convert the modal content to PDF
  // 2. Generate the PDF with the report data
  alert('PDF download functionality would be implemented here with a PDF library')
}

function generateMockRows() {
  return [
    {
      bil: 1,
      noTuntutan: 'TNT-2025-001',
      aid: 'B102',
      aidProduct: 'Bantuan Makanan',
      daerah: 'Shah Alam',
      cawangan: 'HQ',
      tarikhPermohonan: '15/1/2025',
      statusPermohonan: 'Lulus',
      jumlahTuntutan: 1200.00,
    },
    {
      bil: 2,
      noTuntutan: 'TNT-2025-002',
      aid: 'B103',
      aidProduct: 'Bantuan Kewangan',
      daerah: 'Gombak',
      cawangan: 'CAW1',
      tarikhPermohonan: '20/1/2025',
      statusPermohonan: 'Dalam Proses',
      jumlahTuntutan: 2400.00,
    },
    {
      bil: 3,
      noTuntutan: 'TNT-2025-003',
      aid: 'B104',
      aidProduct: 'Bantuan Pendidikan',
      daerah: 'Petaling',
      cawangan: 'CAW2',
      tarikhPermohonan: '25/1/2025',
      statusPermohonan: 'Ditolak',
      jumlahTuntutan: 1800.00,
    },
    {
      bil: 4,
      noTuntutan: 'TNT-2025-004',
      aid: 'B105',
      aidProduct: 'Bantuan Perubatan',
      daerah: 'Klang',
      cawangan: 'HQ',
      tarikhPermohonan: '30/1/2025',
      statusPermohonan: 'Lulus',
      jumlahTuntutan: 3000.00,
    },
    {
      bil: 5,
      noTuntutan: 'TNT-2025-005',
      aid: 'B106',
      aidProduct: 'Bantuan Rumah',
      daerah: 'Hulu Langat',
      cawangan: 'CAW1',
      tarikhPermohonan: '5/2/2025',
      statusPermohonan: 'Draf',
      jumlahTuntutan: 5000.00,
    },
  ]
}
</script>

<style scoped>
button:focus-visible { outline: none; box-shadow: 0 0 0 2px rgba(59,130,246,0.5); }
</style>
