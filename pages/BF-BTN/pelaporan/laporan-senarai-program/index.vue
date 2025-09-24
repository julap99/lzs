<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold">Laporan Senarai Program</h1>
        <p class="text-sm text-gray-500">Sub Modul: Mengurus Pelaporan (Program)</p>
      </div>
      <!-- <div class="flex items-center gap-2">
        <rs-button variant="secondary" @click="exportPDF">PDF</rs-button>
        <rs-button variant="success" @click="exportExcel">Excel</rs-button>
      </div> -->
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
          :show-no-column="false"
          :options="{ variant: 'default', striped: true, bordered: false, borderless: false, hover: true }"
          :options-advanced="{ sortable: true, filterable: true, responsive: true, outsideBorder: true }"
          :page-size="pageSize"
        >
          <template #status="{ text }">
            <rs-badge :variant="getStatusClass(text)">
              {{ text }}
            </rs-badge>
          </template>
        </rs-table>
      </div>
    </div>
  </div>

  <!-- PDF Modal -->
  <rs-modal v-model="showPDFModal" title="Laporan Senarai Program" size="xl" position="center">
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
            <div class="font-semibold text-gray-900 mb-2">RP0001 Laporan Senarai Program Tahun 2025</div>
            <div>Tarikh: {{ new Date().toLocaleDateString('ms-MY') }}</div>
            <div>Masa: {{ new Date().toLocaleTimeString('ms-MY') }}</div>
          </div>
        </div>

        <!-- Report Content -->
        <div class="space-y-4">
          <div class="text-center">
            <h2 class="text-xl font-bold text-gray-900">
              LAPORAN SENARAI PROGRAM TAHUN 2025
            </h2>
          </div>

          <!-- Data Table -->
          <div class="overflow-x-auto">
            <table class="w-full border-collapse border border-gray-300">
              <thead>
                <tr class="bg-blue-50">
                  <th class="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Bil</th>
                  <th class="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Kod Program</th>
                  <th class="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Nama Program</th>
                  <th class="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Lokasi Program</th>
                  <th class="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Daerah</th>
                  <th class="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Tarikh Program</th>
                  <th class="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Bilangan Peserta</th>
                  <th class="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in filteredRows" :key="index" :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                  <td class="border border-gray-300 px-3 py-2 text-sm">{{ row.bil }}</td>
                  <td class="border border-gray-300 px-3 py-2 text-sm font-medium text-blue-600">{{ row.kodProgram }}</td>
                  <td class="border border-gray-300 px-3 py-2 text-sm">{{ row.namaProgram }}</td>
                  <td class="border border-gray-300 px-3 py-2 text-sm">{{ row.lokasiProgram }}</td>
                  <td class="border border-gray-300 px-3 py-2 text-sm">{{ row.daerah }}</td>
                  <td class="border border-gray-300 px-3 py-2 text-sm">{{ row.tarikhProgram }}</td>
                  <td class="border border-gray-300 px-3 py-2 text-sm text-center">{{ row.bilPeserta }}</td>
                  <td class="border border-gray-300 px-3 py-2 text-sm">
                    <span :class="getStatusClass(row.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                      {{ row.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Summary -->
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="font-semibold text-gray-900 mb-2">Ringkasan Laporan:</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span class="font-semibold text-gray-700">Jumlah Program:</span>
                <span class="text-gray-900 ml-2">{{ filteredRows.length }}</span>
              </div>
              <div>
                <span class="font-semibold text-gray-700">Jumlah Peserta:</span>
                <span class="text-gray-900 ml-2">{{ filteredRows.reduce((sum, row) => sum + row.bilPeserta, 0) }}</span>
              </div>
              <div>
                <span class="font-semibold text-gray-700">Program Selesai:</span>
                <span class="text-gray-900 ml-2">{{ filteredRows.filter(row => row.status === 'Selesai').length }}</span>
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
import kariahData from '../kariah-data.json'

const filters = reactive({
  tarikhDari: '',
  tarikhHingga: '',
  tahun: '',
  daerah: '',
})

const daerahOptions = kariahData.daerahOptions


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
const showPDFModal = ref(false)

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
  filteredRows.value = []
  paparHasil.value = false
}

function exportPDF() { 
  showPDFModal.value = true
}

function exportExcel() { 
  // Convert data to CSV
  const csvData = convertToCSV(filteredRows.value)
  downloadCSV(csvData, 'laporan-senarai-program.csv')
}

// Convert data to CSV format
function convertToCSV(data) {
  if (!data || data.length === 0) return ''
  
  const headers = ['Bil', 'Kod Program', 'Nama Program', 'Lokasi Program', 'Daerah', 'Tarikh Program', 'Bilangan Peserta', 'Status']
  const csvContent = [
    headers.join(','),
    ...data.map(row => [
      row.bil,
      `"${row.kodProgram}"`,
      `"${row.namaProgram}"`,
      `"${row.lokasiProgram}"`,
      `"${row.daerah}"`,
      `"${row.tarikhProgram}"`,
      row.bilPeserta,
      `"${row.status}"`
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
    case 'Selesai':
      return 'bg-green-100 text-green-800'
    case 'Dalam Proses':
      return 'bg-yellow-100 text-yellow-800'
    case 'Draf':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
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
      kodProgram: 'PG-2025-1001',
      namaProgram: 'Program Bersama DYMM 2025',
      lokasiProgram: 'Masjid Tengku Ampuan Jemaah Bukit Jelutong Jalan Mimbar U8/2 Bukit Jelutong, 40150, Shah Alam, Selangor.',
      daerah: 'Shah Alam',
      
      tarikhProgram: '1/12/2025',
      bilPeserta: 400,
      status: 'Selesai',
    },
    {
      bil: 2,
      kodProgram: 'PG-2025-1002',
      namaProgram: 'Program SJK 2025',
      lokasiProgram: 'No 2650, Persiaran Kayangan, Seksyen 7, 40000 Shah Alam, Selangor',
      daerah: 'Shah Alam',
      
      tarikhProgram: '5/6/2025',
      bilPeserta: 150,
      status: 'Selesai',
    },
    {
      bil: 3,
      kodProgram: 'PG-2025-1003',
      namaProgram: 'Program Kerjaya 2025',
      lokasiProgram: 'KM 24, Jalan Pahang Lama, 53100 Gombak, Selangor',
      daerah: 'Gombak',
      
      tarikhProgram: '1/2/2025',
      bilPeserta: 50,
      status: 'Selesai',
    },
  ]
}
</script>

<style scoped>
button:focus-visible { outline: none; box-shadow: 0 0 0 2px rgba(59,130,246,0.5); }
</style>


