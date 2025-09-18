<template>
  <div>
    <!-- Breadcrumb -->
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- ===== 3.1.1 Filter Bar ===== -->
    <rs-card class="mt-4">
      <template #header>
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center gap-2">
            <Icon name="material-symbols:tune" />
            <span class="font-semibold">Filter Bar</span>
          </div>
          <div class="flex items-center gap-2">
            <rs-button variant="primary" @click="onApply">Tapis</rs-button>
            <rs-button variant="danger" @click="onReset">Set Semula</rs-button>
          </div>
        </div>
      </template>
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Tahun -->
          <FormKit
            type="select"
            v-model="filters.tahun"
            label="Tahun"
            :options="tahunOptions"
            :classes="{ label: 'text-sm font-medium', input: '!py-2' }"
          />

          <!-- Bulan -->
          <FormKit
            type="select"
            v-model="filters.bulan"
            label="Bulan"
            :options="bulanOptions"
            :classes="{ label: 'text-sm font-medium', input: '!py-2' }"
          />

          <!-- Daerah -->
          <FormKit
            type="select"
            v-model="filters.daerah"
            label="Daerah"
            :options="daerahOptions"
            :classes="{ label: 'text-sm font-medium', input: '!py-2' }"
          />

          <!-- Kategori PA -->
          <FormKit
            type="select"
            v-model="filters.kategori"
            label="Kategori PA"
            :options="kategoriOptions"
            :classes="{ label: 'text-sm font-medium', input: '!py-2' }"
          />

          <!-- Jenis Aktiviti -->
          <FormKit
            type="select"
            v-model="filters.jenisAktiviti"
            label="Jenis Aktiviti"
            :options="jenisAktivitiOptions"
            :classes="{ label: 'text-sm font-medium', input: '!py-2' }"
          />

          <!-- Status Permohonan -->
          <FormKit
            type="select"
            v-model="filters.statusPermohonan"
            label="Status Permohonan"
            :options="statusPermohonanOptions"
            :classes="{ label: 'text-sm font-medium', input: '!py-2' }"
          />

          <!-- Status Tugasan -->
          <FormKit
            type="select"
            v-model="filters.statusTugasan"
            label="Status Tugasan"
            :options="statusTugasanOptions"
            :classes="{ label: 'text-sm font-medium', input: '!py-2' }"
          />

          <!-- Placeholder to balance grid on desktop -->
          <div class="hidden md:block"></div>
        </div>
      </template>
    </rs-card>

    <!-- ===== 3.2.2 Kad Ringkasan Utama ===== -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
      <div class="p-4 rounded-2xl bg-white shadow border border-gray-100">
        <div class="flex items-center gap-3">
          <div class="rounded-xl p-3 bg-gray-50">
            <Icon name="mdi:account-group-outline" class="text-xl" />
          </div>
          <div>
            <div class="text-xs uppercase tracking-wide text-gray-500">Bil. PA Aktif</div>
            <div class="text-2xl font-semibold text-gray-900">{{ summary.bilPaAktif }}</div>
          </div>
        </div>
      </div>
      <div class="p-4 rounded-2xl bg-white shadow border border-gray-100">
        <div class="flex items-center gap-3">
          <div class="rounded-xl p-3 bg-gray-50">
            <Icon name="mdi:file-document-outline" class="text-xl" />
          </div>
          <div>
            <div class="text-xs uppercase tracking-wide text-gray-500">Bil. Permohonan (Bh/Pbh)</div>
            <div class="text-2xl font-semibold text-gray-900">{{ summaryLabelPermohonan }}</div>
          </div>
        </div>
      </div>
      <div class="p-4 rounded-2xl bg-white shadow border border-gray-100">
        <div class="flex items-center gap-3">
          <div class="rounded-xl p-3 bg-gray-50">
            <Icon name="mdi:clipboard-text-clock-outline" class="text-xl" />
          </div>
          <div>
            <div class="text-xs uppercase tracking-wide text-gray-500">Bil. Tugasan Aktif</div>
            <div class="text-2xl font-semibold text-gray-900">{{ summary.bilTugasanAktif }}</div>
          </div>
        </div>
      </div>
      <div class="p-4 rounded-2xl bg-white shadow border border-gray-100">
        <div class="flex items-center gap-3">
          <div class="rounded-xl p-3 bg-gray-50">
            <Icon name="mdi:cash" class="text-xl" />
          </div>
          <div>
            <div class="text-xs uppercase tracking-wide text-gray-500">Jumlah Elaun Bulan Ini (RM)</div>
            <div class="text-2xl font-semibold text-gray-900">{{ formatRM(summary.jumlahElaunBulanIni) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== 3.3.1 Carta PA Aktif Mengikut Kategori (Donut/Bar) ===== -->
    <rs-card class="mt-4">
      <template #header>
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center gap-2">
            <Icon name="mdi:chart-donut" />
            <span class="font-semibold">Carta PA Aktif Mengikut Kategori</span>
          </div>
          <div class="flex items-center gap-2">
            <rs-button size="sm" :variant="chartMode === 'donut' ? 'primary' : 'soft'" @click="chartMode = 'donut'">
              Donut
            </rs-button>
            <rs-button size="sm" :variant="chartMode === 'bar' ? 'primary' : 'soft'" @click="chartMode = 'bar'">
              Bar
            </rs-button>
          </div>
        </div>
      </template>
      <template #body>
        <div v-if="ApexChart" class="w-full">
          <component
            :is="ApexChart"
            height="340"
            :type="chartMode === 'donut' ? 'donut' : 'bar'"
            :series="chartPAKategori.series"
            :options="chartPAKategori.options"
          />
        </div>
        <div v-else class="text-sm text-gray-500 p-4 bg-gray-50 rounded">
          Pasang <code>vue3-apexcharts</code> untuk melihat carta. Data ringkas: {{ chartPAKategoriDebug }}
        </div>
      </template>
    </rs-card>

    <!-- ===== 3.3.4 Carta Permohonan (Baharu vs Pembaharuan ikut bulan) ===== -->
    <rs-card class="mt-4">
      <template #header>
        <div class="flex items-center gap-2">
          <Icon name="mdi:chart-bar" />
          <span class="font-semibold">Carta Permohonan (Baharu vs Pembaharuan)</span>
        </div>
      </template>
      <template #body>
        <div v-if="ApexChart">
          <component :is="ApexChart" height="340" type="bar" :series="chartPermohonan.series" :options="chartPermohonan.options" />
        </div>
        <div v-else class="text-sm text-gray-500 p-4 bg-gray-50 rounded">Carta memerlukan <code>vue3-apexcharts</code>.</div>
      </template>
    </rs-card>

    <!-- ===== 3.3.1 Carta Status Permohonan (Tahap Proses) ===== -->
    <rs-card class="mt-4">
      <template #header>
        <div class="flex items-center gap-2">
          <Icon name="mdi:chart-timeline-variant-shimmer" />
          <span class="font-semibold">Carta Status Permohonan (Draf → Sokongan → Kelulusan → Lulus/Gagal)</span>
        </div>
      </template>
      <template #body>
        <div v-if="ApexChart">
          <component :is="ApexChart" height="320" type="bar" :series="chartStatusPermohonan.series" :options="chartStatusPermohonan.options" />
        </div>
        <div v-else class="text-sm text-gray-500 p-4 bg-gray-50 rounded">Carta memerlukan <code>vue3-apexcharts</code>.</div>
      </template>
    </rs-card>

    <!-- ===== 3.3.2 Jadual Tugasan PA ===== -->
    <rs-card class="mt-4">
      <template #header>
        <div class="flex items-center gap-2">
          <Icon name="mdi:clipboard-list-outline" />
          <span class="font-semibold">Jadual Tugasan PA</span>
        </div>
      </template>
      <template #body>
        <RsTable
          :data="tableTugasan"
          :columns="columnsTugasan"
          advanced
          :showNoColumn="false"
          :showSearch="true"
          :showFilter="true"
          :options="{ variant: 'default', striped: true, hover: true }"
          :optionsAdvanced="{ sortable: true, filterable: true, responsive: true, outsideBorder: true }"
        >
          <template #namaPA="{ text }">
            <div class="font-medium">{{ text }}</div>
          </template>
          <template #bilBancian="{ text }"><rs-badge variant="soft">{{ text }}</rs-badge></template>
          <template #bilSemakan="{ text }"><rs-badge variant="soft">{{ text }}</rs-badge></template>
          <template #bilPermohonan="{ text }"><rs-badge variant="soft">{{ text }}</rs-badge></template>
          <template #tarikhTerkini="{ text }"><span class="whitespace-nowrap">{{ formatDate(text) }}</span></template>
          <template #statusTugasan="{ text }">
            <rs-badge :variant="statusVariant(text)">{{ text }}</rs-badge>
          </template>
          <template #slaDue="{ text }">
            <span :class="slaClass(text)">{{ text }} hari</span>
          </template>
        </RsTable>
      </template>
    </rs-card>

    <!-- ===== 3.3.1 Carta Elaun PA Mengikut Bulan ===== -->
    <rs-card class="mt-4">
      <template #header>
        <div class="flex items-center gap-2">
          <Icon name="mdi:chart-line" />
          <span class="font-semibold">Carta Elaun PA Mengikut Bulan</span>
        </div>
      </template>
      <template #body>
        <div v-if="ApexChart">
          <component :is="ApexChart" height="340" type="line" :series="chartElaun.series" :options="chartElaun.options" />
        </div>
        <div v-else class="text-sm text-gray-500 p-4 bg-gray-50 rounded">Carta memerlukan <code>vue3-apexcharts</code>.</div>
      </template>
    </rs-card>

    <!-- ===== 3.3.2 Prestasi Latihan / Program ===== -->
    <rs-card class="mt-4">
      <template #header>
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center gap-2">
            <Icon name="mdi:school-outline" />
            <span class="font-semibold">Prestasi Latihan / Program</span>
          </div>
          <div>
            <rs-button size="sm" @click="toggleProgramView">Tukar Paparan: {{ programView === 'table' ? 'Bar Chart' : 'Jadual' }}</rs-button>
          </div>
        </div>
      </template>
      <template #body>
        <div v-if="programView === 'table'">
          <RsTable
            :data="tableProgram"
            :columns="columnsProgram"
            advanced
            :showNoColumn="false"
            :showSearch="true"
            :options="{ variant: 'default', hover: true, striped: true }"
            :optionsAdvanced="{ sortable: true, filterable: true, responsive: true }"
          >
            <template #tarikh="{ text }">{{ formatDate(text) }}</template>
            <template #peratusKehadiran="{ text }">
              <div class="flex items-center gap-2">
                <div class="h-2 bg-gray-200 rounded w-full">
                  <div class="h-2 rounded bg-primary-500" :style="{ width: text + '%' }"></div>
                </div>
                <span class="w-12 text-right">{{ text }}%</span>
              </div>
            </template>
          </RsTable>
        </div>
        <div v-else>
          <div v-if="ApexChart">
            <component :is="ApexChart" height="320" type="bar" :series="chartProgram.series" :options="chartProgram.options" />
          </div>
          <div v-else class="text-sm text-gray-500 p-4 bg-gray-50 rounded">Carta memerlukan <code>vue3-apexcharts</code>.</div>
        </div>
      </template>
    </rs-card>

    <!-- ===== 2.1 Button: Jana Laporan (PD-02) ===== -->
    <div class="mt-6 flex items-center gap-2">
      <rs-button variant="primary" @click="goToJanaLaporan">
            Jana Laporan
        </rs-button>
      <rs-button variant="danger" @click="onReset">Tapis / Set Semula</rs-button>
    </div>

    <!-- Simple Modal for PD-02 (Report Generation) -->
    <transition name="fade">
      <div v-if="showReport" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-3xl">
          <div class="px-6 py-4 border-b flex items-center justify-between">
            <div class="font-semibold flex items-center gap-2">
              <Icon name="mdi:file-export-outline" /> Jana Laporan (PD-02)
            </div>
            <button class="text-gray-500 hover:text-gray-700" @click="showReport=false">
              <Icon name="mdi:close" />
            </button>
          </div>
          <div class="p-6 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormKit type="select" v-model="report.format" label="Format" :options="reportFormatOptions" />
              <FormKit type="select" v-model="report.skop" label="Skop Laporan" :options="reportScopeOptions" />
              <FormKit type="select" v-model="report.tahap" label="Tahap Perincian" :options="reportDetailOptions" />
            </div>
            <div class="text-sm text-gray-500">*Laporan dihasilkan berdasarkan filter semasa.</div>
          </div>
          <div class="px-6 py-4 border-t flex items-center justify-end gap-2">
            <rs-button variant="soft" @click="showReport=false">Batal</rs-button>
            <rs-button variant="primary" @click="downloadReport">Muat Turun</rs-button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
/**
 * PA-DA-PD-01 — Dashboard & Statistik (BF-PA)
 * Single <script setup> to avoid TS/JSX issues and "multiple script" errors.
 */
import { ref, reactive, computed, onMounted, shallowRef } from 'vue'

defineOptions({ name: 'PA-DA-PD-01' })

// ===== Breadcrumb =====
const breadcrumb = ref([
  { name: 'Dashboard', type: 'text', path: '/' },
  { name: 'Dashboard & Pelaporan', type: 'text', path: '#' },
])

// ===== Filters (3.1.1) =====
const filters = reactive({
  tahun: new Date().getFullYear().toString(),
  bulan: (new Date().getMonth() + 1).toString().padStart(2, '0'),
  daerah: 'ALL',
  kategori: 'ALL',
  jenisAktiviti: 'ALL',
  statusPermohonan: 'ALL',
  statusTugasan: 'ALL',
})

const tahunOptions = [
  { label: 'Semua', value: 'ALL' },
  { label: '2023', value: '2023' },
  { label: '2024', value: '2024' },
  { label: '2025', value: '2025' },
]
const bulanOptions = [
  { label: 'Semua', value: 'ALL' },
  ...Array.from({ length: 12 }, (_, i) => {
    const m = (i + 1).toString().padStart(2, '0')
    return { label: m, value: m }
  }),
]
const daerahOptions = [
  { label: 'Semua', value: 'ALL' },
  { label: 'Gombak', value: 'Gombak' },
  { label: 'Hulu Langat', value: 'Hulu Langat' },
  { label: 'Klang', value: 'Klang' },
  { label: 'Kuala Selangor', value: 'Kuala Selangor' },
]
const kategoriOptions = [
  { label: 'Semua', value: 'ALL' },
  { label: 'Kariah', value: 'Kariah' },
  { label: 'Institusi', value: 'Institusi' },
  { label: 'Hospital', value: 'Hospital' },
]
const jenisAktivitiOptions = [
  { label: 'Semua', value: 'ALL' },
  { label: 'Mesyuarat', value: 'Mesyuarat' },
  { label: 'Program', value: 'Program' },
]
const statusPermohonanOptions = [
  { label: 'Semua', value: 'ALL' },
  { label: 'Draf', value: 'Draf' },
  { label: 'Sokongan', value: 'Sokongan' },
  { label: 'Kelulusan', value: 'Kelulusan' },
  { label: 'Lulus', value: 'Lulus' },
  { label: 'Gagal', value: 'Gagal' },
]
const statusTugasanOptions = [
  { label: 'Semua', value: 'ALL' },
  { label: 'Lengkap', value: 'Lengkap' },
  { label: 'Gagal', value: 'Gagal' },
  { label: 'Dalam Tindakan', value: 'Dalam Tindakan' },
]

function onApply() {
  // Computeds will react to filters automatically.
}
function onReset() {
  filters.tahun = new Date().getFullYear().toString()
  filters.bulan = 'ALL'
  filters.daerah = 'ALL'
  filters.kategori = 'ALL'
  filters.jenisAktiviti = 'ALL'
  filters.statusPermohonan = 'ALL'
  filters.statusTugasan = 'ALL'
}

// ===== Mock Data =====
const mockState = reactive({ nonce: 0 })

const paList = ref([
  { nama: 'Ahmad Karim', kategori: 'Kariah', status: 'Aktif', daerah: 'Gombak' },
  { nama: 'Siti Rahmah', kategori: 'Institusi', status: 'Aktif', daerah: 'Klang' },
  { nama: 'Lim Wei', kategori: 'Hospital', status: 'Tamat', daerah: 'Hulu Langat' },
  { nama: 'Anand', kategori: 'Kariah', status: 'Aktif', daerah: 'Kuala Selangor' },
  { nama: 'Zahra', kategori: 'Kariah', status: 'Dibatalkan', daerah: 'Gombak' },
  { nama: 'Banu', kategori: 'Institusi', status: 'Aktif', daerah: 'Gombak' },
])

const permohonanMonthly = ref([
  { month: '01', tahun: '2025', baharu: 12, pembaharuan: 20 },
  { month: '02', tahun: '2025', baharu: 18, pembaharuan: 15 },
  { month: '03', tahun: '2025', baharu: 22, pembaharuan: 19 },
  { month: '04', tahun: '2025', baharu: 17, pembaharuan: 21 },
  { month: '05', tahun: '2025', baharu: 30, pembaharuan: 25 },
  { month: '06', tahun: '2025', baharu: 28, pembaharuan: 27 },
  { month: '07', tahun: '2025', baharu: 24, pembaharuan: 29 },
  { month: '08', tahun: '2025', baharu: 26, pembaharuan: 31 },
  { month: '09', tahun: '2025', baharu: 20, pembaharuan: 18 },
  { month: '10', tahun: '2025', baharu: 0,  pembaharuan: 0 },
  { month: '11', tahun: '2025', baharu: 0,  pembaharuan: 0 },
  { month: '12', tahun: '2025', baharu: 0,  pembaharuan: 0 },
])

const permohonanByStatus = ref([
  { tahap: 'Draf', count: 18 },
  { tahap: 'Sokongan', count: 25 },
  { tahap: 'Kelulusan', count: 14 },
  { tahap: 'Lulus', count: 40 },
  { tahap: 'Gagal', count: 6 },
])

const tugasanPa = ref([
  { namaPA: 'Ahmad Karim', bilBancian: 5, bilSemakan: 3, bilPermohonan: 2, tarikhTerkini: '2025-09-10', statusTugasan: 'Dalam Tindakan', slaDue: 2 },
  { namaPA: 'Siti Rahmah', bilBancian: 3, bilSemakan: 5, bilPermohonan: 4, tarikhTerkini: '2025-09-09', statusTugasan: 'Lengkap', slaDue: 0 },
  { namaPA: 'Lim Wei', bilBancian: 2, bilSemakan: 1, bilPermohonan: 1, tarikhTerkini: '2025-09-07', statusTugasan: 'Gagal', slaDue: -1 },
  { namaPA: 'Anand', bilBancian: 6, bilSemakan: 4, bilPermohonan: 3, tarikhTerkini: '2025-09-11', statusTugasan: 'Dalam Tindakan', slaDue: 3 },
])

const elaunMonthly = ref([
  { month: '01', tahun: '2025', paLayak: 20, jumlahRM: 3200 },
  { month: '02', tahun: '2025', paLayak: 24, jumlahRM: 3800 },
  { month: '03', tahun: '2025', paLayak: 27, jumlahRM: 4100 },
  { month: '04', tahun: '2025', paLayak: 29, jumlahRM: 4600 },
  { month: '05', tahun: '2025', paLayak: 33, jumlahRM: 5100 },
  { month: '06', tahun: '2025', paLayak: 35, jumlahRM: 5400 },
  { month: '07', tahun: '2025', paLayak: 36, jumlahRM: 5600 },
  { month: '08', tahun: '2025', paLayak: 38, jumlahRM: 5900 },
  { month: '09', tahun: '2025', paLayak: 21, jumlahRM: 3300 },
])

const programs = ref([
  { nama: 'Latihan Asas PA', tarikh: '2025-07-15', hadir: 48, peratusKehadiran: 96 },
  { nama: 'Program Bancian Komuniti', tarikh: '2025-08-10', hadir: 72, peratusKehadiran: 90 },
  { nama: 'Seminar Semakan Asnaf', tarikh: '2025-09-01', hadir: 60, peratusKehadiran: 75 },
])

// ===== Derived (filters applied) =====
const filteredPA = computed(() => paList.value.filter((x) =>
  (filters.daerah === 'ALL' || x.daerah === filters.daerah) &&
  (filters.kategori === 'ALL' || x.kategori === filters.kategori)
))

const filteredPermohonanMonthly = computed(() => permohonanMonthly.value
  .filter((x) => x.tahun === filters.tahun)
  .filter((x) => (filters.bulan === 'ALL' ? true : x.month === filters.bulan)))

const filteredPermohonanByStatus = computed(() => permohonanByStatus.value)

const filteredTugasan = computed(() => tugasanPa.value
  .filter((x) => (filters.statusTugasan === 'ALL' || x.statusTugasan === filters.statusTugasan)))

const filteredElaun = computed(() => elaunMonthly.value
  .filter((x) => x.tahun === filters.tahun)
  .filter((x) => (filters.bulan === 'ALL' ? true : x.month === filters.bulan)))

const filteredPrograms = computed(() => programs.value)

// ===== Summary Cards =====
const summary = computed(() => {
  const bilPaAktif = filteredPA.value.filter((x) => x.status === 'Aktif').length
  const totalPermohonan = filteredPermohonanMonthly.value.reduce((acc, x) => acc + x.baharu + x.pembaharuan, 0)
  const bilTugasanAktif = filteredTugasan.value.filter((x) => x.statusTugasan !== 'Lengkap').length
  const bulanIni = (new Date().getMonth() + 1).toString().padStart(2, '0')
  const elaunBulanIni = filteredElaun.value.find((x) => x.month === bulanIni)
  const jumlahElaunBulanIni = elaunBulanIni ? elaunBulanIni.jumlahRM : 0
  return { bilPaAktif, totalPermohonan, bilTugasanAktif, jumlahElaunBulanIni }
})

const summaryLabelPermohonan = computed(() => {
  const m = filteredPermohonanMonthly.value
  const bh = m.reduce((acc, x) => acc + x.baharu, 0)
  const pb = m.reduce((acc, x) => acc + x.pembaharuan, 0)
  return `${summary.value.totalPermohonan} (${bh}/${pb})`
})

// ===== Charts =====
const ApexChart = shallowRef<any | null>(null)

onMounted(async () => {
  try {
    const mod = await import('vue3-apexcharts')
    ApexChart.value = mod.default
  } catch (e) {
    console.warn('vue3-apexcharts tidak dipasang. Papar fallback ringkas.', e)
  }
})

const chartMode = ref<'donut' | 'bar'>('donut')
const chartPAKategori = computed(() => {
  const kategoriList = ['Kariah', 'Institusi', 'Hospital']
  const statusList = ['Aktif', 'Tamat', 'Dibatalkan']

  const seriesByStatus = statusList.map((status) => ({
    name: status,
    data: kategoriList.map((kat) => filteredPA.value.filter((x) => x.kategori === kat && x.status === status).length),
  }))

  const donutSeries = kategoriList.map((kat) => filteredPA.value.filter((x) => x.kategori === kat && x.status === 'Aktif').length)

  const options = {
    chart: { stacked: chartMode.value === 'bar' },
    labels: kategoriList,
    xaxis: { categories: kategoriList },
    legend: { position: 'top' },
    dataLabels: { enabled: true },
  }

  return {
    series: chartMode.value === 'donut' ? donutSeries : seriesByStatus,
    options,
  }
})

const chartPAKategoriDebug = computed(() => ({ donut: chartPAKategori.value.series }))

const chartPermohonan = computed(() => {
  const cats = filteredPermohonanMonthly.value.map((x) => x.month)
  const series = [
    { name: 'Baharu', data: filteredPermohonanMonthly.value.map((x) => x.baharu) },
    { name: 'Pembaharuan', data: filteredPermohonanMonthly.value.map((x) => x.pembaharuan) },
  ]
  const options = { xaxis: { categories: cats }, legend: { position: 'top' } }
  return { series, options }
})

const chartStatusPermohonan = computed(() => {
  const cats = filteredPermohonanByStatus.value.map((x) => x.tahap)
  const series = [{ name: 'Bilangan', data: filteredPermohonanByStatus.value.map((x) => x.count) }]
  const options = { xaxis: { categories: cats }, dataLabels: { enabled: true } }
  return { series, options }
})

const chartElaun = computed(() => {
  const cats = filteredElaun.value.map((x) => x.month)
  const series = [
    { name: 'Jumlah PA Layak', type: 'column', data: filteredElaun.value.map((x) => x.paLayak) },
    { name: 'Jumlah Bayaran (RM)', type: 'line', data: filteredElaun.value.map((x) => x.jumlahRM) },
  ]
  const options = {
    xaxis: { categories: cats },
    stroke: { width: [0, 3] },
    dataLabels: { enabled: true, enabledOnSeries: [1] },
    yaxis: [ { title: { text: 'PA Layak' } }, { opposite: true, title: { text: 'RM' } } ],
    legend: { position: 'top' },
  }
  return { series, options }
})

const programView = ref<'table' | 'bar'>('table')
function toggleProgramView() { programView.value = programView.value === 'table' ? 'bar' : 'table' }
const chartProgram = computed(() => {
  const cats = filteredPrograms.value.map((x) => x.nama)
  const series = [{ name: '% Kehadiran', data: filteredPrograms.value.map((x) => x.peratusKehadiran) }]
  const options = { xaxis: { categories: cats }, dataLabels: { enabled: true }, yaxis: { max: 100 } }
  return { series, options }
})

// ===== Tables =====
const tableTugasan = computed(() => filteredTugasan.value)
const columnsTugasan = [
  { key: 'namaPA', label: 'Nama PA', sortable: true },
  { key: 'bilBancian', label: 'Bil. Tugasan (Bancian)', sortable: true },
  { key: 'bilSemakan', label: 'Bil. Tugasan (Semakan Asnaf)', sortable: true },
  { key: 'bilPermohonan', label: 'Bil. Tugasan (Permohonan Bantuan)', sortable: true },
  { key: 'tarikhTerkini', label: 'Tarikh Terkini', sortable: true },
  { key: 'statusTugasan', label: 'Status Tugasan', sortable: true },
  { key: 'slaDue', label: 'SLA Due (hari)', sortable: true },
]

const tableProgram = computed(() => filteredPrograms.value)
const columnsProgram = [
  { key: 'nama', label: 'Nama Program', sortable: true },
  { key: 'tarikh', label: 'Tarikh', sortable: true },
  { key: 'hadir', label: 'Bil. Hadir', sortable: true },
  { key: 'peratusKehadiran', label: '% Kehadiran', sortable: true },
]

// ===== Report (PD-02) =====
const showReport = ref(false)
const report = reactive({ format: 'CSV', skop: 'Dashboard', tahap: 'Ringkas' })
const reportFormatOptions = [ { label: 'CSV', value: 'CSV' }, { label: 'XLSX (stub)', value: 'XLSX' }, { label: 'PDF (stub)', value: 'PDF' } ]
const reportScopeOptions = [ { label: 'Dashboard', value: 'Dashboard' }, { label: 'Tugasan PA', value: 'Tugasan' }, { label: 'Permohonan', value: 'Permohonan' } ]
const reportDetailOptions = [ { label: 'Ringkas', value: 'Ringkas' }, { label: 'Terperinci', value: 'Terperinci' } ]

function downloadReport() {
  const rows = [
    ['Bil PA Aktif', summary.value.bilPaAktif],
    ['Bil Permohonan (Total)', summary.value.totalPermohonan],
    ['Bil Tugasan Aktif', summary.value.bilTugasanAktif],
    ['Jumlah Elaun Bulan Ini (RM)', summary.value.jumlahElaunBulanIni],
  ]
  const csv = 'Metric,Value\n' + rows.map((r) => r.join(',')).join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `Laporan_BF-PA_${filters.tahun}-${filters.bulan === 'ALL' ? 'ALL' : filters.bulan}.csv`
  a.click()
  URL.revokeObjectURL(url)
  showReport.value = false
}

// ===== Utils =====
function formatRM(v: number) {
  return new Intl.NumberFormat('ms-MY', { style: 'currency', currency: 'MYR' }).format(v)
}
function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('ms-MY', { year: 'numeric', month: 'short', day: '2-digit' })
}
function statusVariant(s: string) {
  switch (s) {
    case 'Lengkap': return 'success'
    case 'Gagal': return 'danger'
    default: return 'warning'
  }
}
function slaClass(days: number | string) {
  const n = typeof days === 'string' ? parseFloat(days) : days
  if (n < 0) return 'text-danger-600 font-medium'
  if (n === 0) return 'text-warning-600 font-medium'
  return 'text-gray-700'
}
// const router = useRouter() // Use navigateTo instead

function goToJanaLaporan() {
  navigateTo('/BF-PA/DA/dashboard/jana-laporan-statistik')
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
