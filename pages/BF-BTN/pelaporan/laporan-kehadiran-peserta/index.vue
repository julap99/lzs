<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold">Laporan Kehadiran Peserta Program</h1>
        <p class="text-sm text-gray-500">Sub Modul: Mengurus Pelaporan (Program)</p>
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
          <FormKit type="text" label="Jenis Laporan" v-model="filters.jenisLaporan" placeholder="Program" value="Program" readonly/>

          <!-- 3.1.2 Nama Laporan (Read-only) -->
          <FormKit type="text" label="Nama Laporan" v-model="filters.namaLaporan" placeholder="Laporan Kehadiran Peserta Program" value="Laporan Kehadiran Peserta Program" readonly/>

          <!-- 3.1.3 Tarikh Dari -->
          <FormKit type="date" label="Tarikh Dari" v-model="filters.tarikhDari" :classes="{ input: '!py-2' }" />

          <!-- 3.1.4 Tarikh Hingga -->
          <FormKit type="date" label="Tarikh Hingga" v-model="filters.tarikhHingga" :classes="{ input: '!py-2' }" />

          <!-- 3.1.5 Tahun -->
          <FormKit type="text" label="Tahun" v-model="filters.tahun" placeholder="cth: 2025" />

          <!-- 3.1.6 Kod Program (v-select for large dataset) -->
          <div class="formkit-field">
            <label class="formkit-label">Kod Program</label>
            <v-select 
              v-model="filters.kodProgram"
              :options="kodProgramOptions"
              placeholder="Pilih kod program"
              :searchable="true"
              :clearable="true"
            />
          </div>

          <!-- 3.1.7 Nama Program (v-select) -->
          <div class="formkit-field">
            <label class="formkit-label">Nama Program</label>
            <v-select 
              v-model="filters.namaProgram"
              :options="namaProgramOptions"
              placeholder="Pilih nama program"
              :searchable="true"
              :clearable="true"
            />
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-6 flex flex-wrap items-center gap-2">
          <rs-button class="bg-gray-500 text-white hover:bg-gray-600" variant="gray" @click="resetFilters">Reset</rs-button>
          <rs-button variant="primary" @click="searchKehadiran">Cari</rs-button>
        </div>
      </div>
    </div>

    <!-- 3.2 Laporan Kehadiran Peserta Program -->
    <div class="rounded-2xl border border-gray-200 bg-white shadow-sm" v-if="paparHasil">
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 class="text-lg font-semibold">Laporan Kehadiran Peserta Program</h2>
        <div class="flex items-center gap-2">
          <rs-button variant="secondary" @click="exportPDF">PDF</rs-button>
          <rs-button variant="success" @click="exportExcel">Excel</rs-button>
        </div>
      </div>
      <div class="p-5">
        <rs-table
          :field="['bil','nama','noKadPengenalan','kategoriAsnaf','daerah','kariah','jenisBantuan','statusAsnaf','statusKehadiran','tarikhMasaKehadiran','namaPetugasKaunter']"
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
          <template #statusAsnaf="{ text }">
            <rs-badge :variant="getStatusAsnafVariant(text)">
              {{ text }}
            </rs-badge>
          </template>
          <template #statusKehadiran="{ text }">
            <rs-badge :variant="getStatusKehadiranVariant(text)">
              {{ text }}
            </rs-badge>
          </template>
        </rs-table>
      </div>
    </div>
  </div>

  <!-- PDF Modal -->
  <rs-modal v-model="showPDFModal" title="Laporan Kehadiran Peserta Program" size="xl" position="center">
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
            <div class="font-semibold text-gray-900 mb-2">RT0002 Laporan Kehadiran Peserta Program Tahun 2025</div>
            <div>Tarikh: {{ new Date().toLocaleDateString('ms-MY') }}</div>
            <div>Masa: {{ new Date().toLocaleTimeString('ms-MY') }}</div>
          </div>
        </div>

        <!-- Report Content -->
        <div class="space-y-4">
          <div class="text-center">
            <h2 class="text-xl font-bold text-gray-900">
              LAPORAN KEHADIRAN PESERTA PROGRAM TAHUN 2025
            </h2>
          </div>

          <!-- Data Table -->
          <div class="overflow-x-auto">
            <table class="w-full border-collapse border border-gray-300">
              <thead>
                <tr class="bg-blue-50">
                  <th class="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Bil</th>
                  <th class="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Nama</th>
                  <th class="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">No. Kad Pengenalan</th>
                  <th class="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Kategori Asnaf</th>
                  <th class="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Daerah</th>
                  <th class="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Kariah</th>
                  <th class="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Jenis Bantuan</th>
                  <th class="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Status Asnaf</th>
                  <th class="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Status Kehadiran</th>
                  <th class="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Tarikh & Masa Kehadiran</th>
                  <th class="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Nama Petugas Kaunter</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in filteredRows" :key="index" :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                  <td class="border border-gray-300 px-3 py-2 text-sm">{{ row.bil }}</td>
                  <td class="border border-gray-300 px-3 py-2 text-sm font-medium text-blue-600">{{ row.nama }}</td>
                  <td class="border border-gray-300 px-3 py-2 text-sm">{{ row.noKadPengenalan }}</td>
                  <td class="border border-gray-300 px-3 py-2 text-sm">{{ row.kategoriAsnaf }}</td>
                  <td class="border border-gray-300 px-3 py-2 text-sm">{{ row.daerah }}</td>
                  <td class="border border-gray-300 px-3 py-2 text-sm">{{ row.kariah }}</td>
                  <td class="border border-gray-300 px-3 py-2 text-sm">{{ row.jenisBantuan }}</td>
                  <td class="border border-gray-300 px-3 py-2 text-sm">
                    <span :class="getStatusAsnafClass(row.statusAsnaf)" class="px-2 py-1 rounded-full text-xs font-medium">
                      {{ row.statusAsnaf }}
                    </span>
                  </td>
                  <td class="border border-gray-300 px-3 py-2 text-sm">
                    <span :class="getStatusKehadiranClass(row.statusKehadiran)" class="px-2 py-1 rounded-full text-xs font-medium">
                      {{ row.statusKehadiran }}
                    </span>
                  </td>
                  <td class="border border-gray-300 px-3 py-2 text-sm">{{ row.tarikhMasaKehadiran }}</td>
                  <td class="border border-gray-300 px-3 py-2 text-sm">{{ row.namaPetugasKaunter }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Summary -->
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="font-semibold text-gray-900 mb-2">Ringkasan Laporan:</h3>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span class="font-semibold text-gray-700">Jumlah Peserta:</span>
                <span class="text-gray-900 ml-2">{{ filteredRows.length }}</span>
              </div>
              <div>
                <span class="font-semibold text-gray-700">Hadir:</span>
                <span class="text-gray-900 ml-2">{{ filteredRows.filter(row => row.statusKehadiran === 'Hadir').length }}</span>
              </div>
              <div>
                <span class="font-semibold text-gray-700">Tidak Hadir:</span>
                <span class="text-gray-900 ml-2">{{ filteredRows.filter(row => row.statusKehadiran === 'Tidak Hadir').length }}</span>
              </div>
              <div>
                <span class="font-semibold text-gray-700">Asnaf Aktif:</span>
                <span class="text-gray-900 ml-2">{{ filteredRows.filter(row => row.statusAsnaf === 'Aktif').length }}</span>
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

const filters = reactive({
  jenisLaporan: 'Program',
  namaLaporan: 'Laporan Kehadiran Peserta Program',
  tarikhDari: '',
  tarikhHingga: '',
  tahun: '',
  kodProgram: '',
  namaProgram: '',
})

const kodProgramOptions = [
  { label: 'PRG-001', value: 'PRG-001' },
  { label: 'PRG-002', value: 'PRG-002' },
  { label: 'PRG-003', value: 'PRG-003' },
  { label: 'PRG-004', value: 'PRG-004' },
  { label: 'PRG-005', value: 'PRG-005' },
]

const namaProgramOptions = [
  { label: 'Program Bantuan Makanan', value: 'Program Bantuan Makanan' },
  { label: 'Program Bantuan Pendidikan', value: 'Program Bantuan Pendidikan' },
  { label: 'Program Bantuan Perubatan', value: 'Program Bantuan Perubatan' },
  { label: 'Program Bantuan Kewangan', value: 'Program Bantuan Kewangan' },
  { label: 'Program Bantuan Rumah', value: 'Program Bantuan Rumah' },
]

const columns = [
  { key: 'bil', label: 'Bil' },
  { key: 'nama', label: 'Nama' },
  { key: 'noKadPengenalan', label: 'No. Kad Pengenalan' },
  { key: 'kategoriAsnaf', label: 'Kategori Asnaf' },
  { key: 'daerah', label: 'Daerah' },
  { key: 'kariah', label: 'Kariah' },
  { key: 'jenisBantuan', label: 'Jenis Bantuan' },
  { key: 'statusAsnaf', label: 'Status Asnaf (Aktif)' },
  { key: 'statusKehadiran', label: 'Status Kehadiran' },
  { key: 'tarikhMasaKehadiran', label: 'Tarikh dan Masa Kehadiran' },
  { key: 'namaPetugasKaunter', label: 'Nama Petugas Kaunter' },
]

const allRows = ref(generateMockRows())
const filteredRows = ref([])
const pageSize = ref(10)
const paparHasil = ref(false)
const showPDFModal = ref(false)

function norm(s) { return (s || '').toString().trim().toUpperCase() }
function toISO(d) { return d ? new Date(d + 'T00:00:00') : null }

function searchKehadiran() {
  const rows = allRows.value
  let start = toISO(filters.tarikhDari)
  let end = toISO(filters.tarikhHingga)
  if (start && end && start > end) [start, end] = [end, start]

  filteredRows.value = rows.filter(r => {
    if (filters.tahun && String(new Date(r.tarikhMasaKehadiran.split(' ')[0]).getFullYear()) !== String(filters.tahun)) return false
    if (filters.kodProgram && norm(r.kodProgram) !== norm(filters.kodProgram)) return false
    if (filters.namaProgram && norm(r.namaProgram) !== norm(filters.namaProgram)) return false
    if (start || end) {
      const t = new Date(r.tarikhMasaKehadiran.split(' ')[0])
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
  filters.kodProgram = ''
  filters.namaProgram = ''
  filteredRows.value = []
  paparHasil.value = false
}

function exportPDF() { 
  showPDFModal.value = true
}

function exportExcel() { 
  // Convert data to CSV
  const csvData = convertToCSV(filteredRows.value)
  downloadCSV(csvData, 'laporan-kehadiran-peserta-program.csv')
}

// Convert data to CSV format
function convertToCSV(data) {
  if (!data || data.length === 0) return ''
  
  const headers = ['Bil', 'Nama', 'No. Kad Pengenalan', 'Kategori Asnaf', 'Daerah', 'Kariah', 'Jenis Bantuan', 'Status Asnaf', 'Status Kehadiran', 'Tarikh & Masa Kehadiran', 'Nama Petugas Kaunter']
  const csvContent = [
    headers.join(','),
    ...data.map(row => [
      row.bil,
      `"${row.nama}"`,
      `"${row.noKadPengenalan}"`,
      `"${row.kategoriAsnaf}"`,
      `"${row.daerah}"`,
      `"${row.kariah}"`,
      `"${row.jenisBantuan}"`,
      `"${row.statusAsnaf}"`,
      `"${row.statusKehadiran}"`,
      `"${row.tarikhMasaKehadiran}"`,
      `"${row.namaPetugasKaunter}"`
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

// Get status class for styling (Status Asnaf)
function getStatusAsnafClass(status) {
  switch (status) {
    case 'Aktif':
      return 'bg-green-100 text-green-800'
    case 'Tidak Aktif':
      return 'bg-red-100 text-red-800'
    case 'Dalam Proses':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Get status class for styling (Status Kehadiran)
function getStatusKehadiranClass(status) {
  switch (status) {
    case 'Hadir':
      return 'bg-green-100 text-green-800'
    case 'Tidak Hadir':
      return 'bg-red-100 text-red-800'
    case 'Lewat':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Get status variant for rs-badge (Status Asnaf)
function getStatusAsnafVariant(status) {
  switch (status) {
    case 'Aktif':
      return 'success'
    case 'Tidak Aktif':
      return 'danger'
    case 'Dalam Proses':
      return 'warning'
    default:
      return 'secondary'
  }
}

// Get status variant for rs-badge (Status Kehadiran)
function getStatusKehadiranVariant(status) {
  switch (status) {
    case 'Hadir':
      return 'success'
    case 'Tidak Hadir':
      return 'danger'
    case 'Lewat':
      return 'warning'
    default:
      return 'secondary'
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
      nama: 'Abdullah bin Saad',
      noKadPengenalan: '670102-10-3453',
      kategoriAsnaf: 'Miskin',
      daerah: 'Klang',
      kariah: 'Masjid Bukit Belimbing, Klang',
      jenisBantuan: 'RAMADHAN & RAYA DYMM',
      statusAsnaf: 'Aktif',
      statusKehadiran: 'Hadir',
      tarikhMasaKehadiran: '15/1/2025 09:00',
      namaPetugasKaunter: 'Siti Noraini binti Omar',
      kodProgram: 'PRG-001',
      namaProgram: 'Program Bantuan Makanan',
    },
    {
      bil: 2,
      nama: 'Fatimah binti Hassan',
      noKadPengenalan: '920315-08-5678',
      kategoriAsnaf: 'Miskin',
      daerah: 'Klang',
      kariah: 'Masjid Sultan Ibrahim',
      jenisBantuan: 'RAMADHAN & RAYA DYMM',
      statusAsnaf: 'Aktif',
      statusKehadiran: 'Tidak Hadir',
      tarikhMasaKehadiran: '20/1/2025 10:30',
      namaPetugasKaunter: 'Siti Noraini binti Omar',
      kodProgram: 'PRG-002',
      namaProgram: 'Program Bantuan Pendidikan',
    },
    {
      bil: 3,
      nama: 'Omar bin Ibrahim',
      noKadPengenalan: '780425-12-9012',
      kategoriAsnaf: 'Miskin',
      daerah: 'KLANG',
      kariah: 'Masjid Sultan Ibrahim',
      jenisBantuan: 'RAMADHAN & RAYA DYMM',
      statusAsnaf: 'Dalam Proses',
      statusKehadiran: 'Lewat',
      tarikhMasaKehadiran: '25/1/2025 11:15',
      namaPetugasKaunter: 'Siti Noraini binti Omar',
      kodProgram: 'PRG-003',
      namaProgram: 'Program Bantuan Perubatan',
    },
    {
      bil: 4,
      nama: 'Aminah binti Kassim',
      noKadPengenalan: '880712-05-3456',
      kategoriAsnaf: 'Fakir',
      daerah: 'Klang',
      kariah: 'Masjid Sultan Ibrahim',
      jenisBantuan: 'RAMADHAN & RAYA DYMM',
      statusAsnaf: 'Aktif',
      statusKehadiran: 'Hadir',
      tarikhMasaKehadiran: '30/1/2025 14:00',
      namaPetugasKaunter: 'Mohd Omar bin Manaf',
      kodProgram: 'PRG-004',
      namaProgram: 'Program Bantuan Kewangan',
    },
    {
      bil: 5,
      nama: 'Hassan bin Ali',
      noKadPengenalan: '750203-14-7890',
      kategoriAsnaf: 'Fakir',
      daerah: 'Klang',
      kariah: 'Masjid Sultan Ibrahim',
      jenisBantuan: 'RAMADHAN & RAYA DYMM',
      statusAsnaf: 'Tidak Aktif',
      statusKehadiran: 'Tidak Hadir',
      tarikhMasaKehadiran: '5/2/2025 16:30',
      namaPetugasKaunter: 'Mohd Omar bin Manaf',
      kodProgram: 'PRG-005',
      namaProgram: 'Program Bantuan Rumah',
    },
  ]
}
</script>

<style scoped>
button:focus-visible { outline: none; box-shadow: 0 0 0 2px rgba(59,130,246,0.5); }
</style>
