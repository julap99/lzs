<template>
  <div class="space-y-4">
    <!-- Breadcrumb -->
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- ===== 3.1.1 Filter Carian ===== -->
    <rs-card>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Icon name="mdi:tune" />
            <span class="font-semibold">Laporan Statistik</span>
          </div>
          <div class="flex gap-2">
            <rs-button variant="danger" @click="onReset">Set Semula</rs-button>
          </div>
        </div>
      </template>
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormKit type="select" v-model="filters.kategoriPA" label="Kategori Penolong Amil" :options="kategoriPAOptions" />
          <FormKit type="select" v-model="filters.lokasiLevel" label="Lokasi (Kariah / Daerah / Institusi)" :options="lokasiLevelOptions" />
          <FormKit type="select" v-model="filters.lokasi" label="Pilih Lokasi" :options="lokasiOptions" :disabled="filters.lokasiLevel==='ALL'" />

          <FormKit type="select" v-model="filters.statusPA" label="Status PA" :options="statusPAOptions" />
          <FormKit type="select" v-model="filters.kategoriTugasan" label="Kategori Tugasan" :options="kategoriTugasanOptions" />

          <!-- Tempoh Perkhidmatan -->
          <div>
            <label class="block text-sm font-medium mb-1">Tempoh Perkhidmatan</label>
            <div class="grid grid-cols-2 gap-2">
              <FormKit type="date" v-model="filters.tarikhMula" label="Mula" />
              <FormKit type="date" v-model="filters.tarikhTamat" label="Tamat" />
            </div>
            <p class="text-xs text-gray-500 mt-1">*Tarikh wajib jika pilih tempoh.</p>
          </div>

          <FormKit type="select" v-model="filters.jenisElaun" label="Jenis Elaun" :options="jenisElaunOptions" />
          <FormKit type="select" v-model="filters.statusBayaran" label="Status Bayaran" :options="statusBayaranOptions" />
          <FormKit type="select" v-model="filters.tahun" label="Tahun" :options="tahunOptions" />
        </div>

        <!-- Validation -->
        <div v-if="validation.error" class="mt-3 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
          <div class="flex items-start gap-2">
            <Icon name="mdi:alert-circle-outline" />
            <div>
              <div class="font-medium">Validasi Gagal</div>
              <div>{{ validation.message }}</div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- ===== 3.2.2 Paparan Statistik (Charts + Summary) ===== -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Graf Tugasan -->
      <rs-card>
        <template #header>
          <div class="flex items-center gap-2">
            <Icon name="mdi:chart-bar" />
            <span class="font-semibold">Graf Tugasan Mengikut Kategori</span>
          </div>
        </template>
        <template #body>
          <div v-if="Apex">
            <component :is="Apex" type="bar" height="280" :series="chartTugasan.series" :options="chartTugasan.options" />
          </div>
          <div v-else class="text-sm text-gray-500">Pasang <code>vue3-apexcharts</code> untuk carta.</div>
        </template>
      </rs-card>

      <!-- Graf Elaun -->
      <rs-card>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Icon name="mdi:chart-donut" />
              <span class="font-semibold">Graf Elaun Mengikut Jenis</span>
            </div>
            <div class="flex gap-2">
              <rs-button size="sm" :variant="elaunMode==='pie'?'primary':'soft'" @click="elaunMode='pie'">Pai</rs-button>
              <rs-button size="sm" :variant="elaunMode==='bar'?'primary':'soft'" @click="elaunMode='bar'">Bar</rs-button>
            </div>
          </div>
        </template>
        <template #body>
          <div v-if="Apex">
            <component :is="Apex" :type="elaunMode" height="280" :series="chartElaun.series" :options="chartElaun.options" />
          </div>
          <div v-else class="text-sm text-gray-500">Pasang <code>vue3-apexcharts</code> untuk carta.</div>
        </template>
      </rs-card>

      <!-- Graf Status PA -->
      <rs-card>
        <template #header>
          <div class="flex items-center gap-2">
            <Icon name="mdi:chart-pie-outline" />
            <span class="font-semibold">Graf Status Pendaftaran PA</span>
          </div>
        </template>
        <template #body>
          <div v-if="Apex">
            <component :is="Apex" type="donut" height="280" :series="chartStatusPA.series" :options="chartStatusPA.options" />
          </div>
          <div v-else class="text-sm text-gray-500">Pasang <code>vue3-apexcharts</code> untuk carta.</div>
        </template>
      </rs-card>
    </div>

    <!-- ===== 3.3 Laporan Tugasan ===== -->
    <rs-card>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Icon name="mdi:clipboard-text-outline" />
            <span class="font-semibold">Laporan Tugasan</span>
          </div>
          <div class="flex gap-2">
            <rs-button variant="primary" @click="goToJanaLaporanTugasan">
              Jana Laporan
            </rs-button>
            <rs-button size="sm" variant="soft" @click="exportXLSX('tugasan')">Excel (XLSX)</rs-button>
            <rs-button size="sm" variant="soft" @click="exportPDF('tugasan')">PDF</rs-button>
          </div>
        </div>
      </template>
      <template #body>
        <RsTable
          :data="laporanTugasan"
          :columns="columnsTugasan"
          advanced
          :showNoColumn="false"
          :showSearch="true"
          :showFilter="true"
          :options="{ variant: 'default', striped: true, hover: true }"
          :optionsAdvanced="{ sortable: true, filterable: true, responsive: true, outsideBorder: true }"
        >
          <template #purataHariSelesai="{ text }">
            <span :class="Number(text) > 7 ? 'text-warning-600 font-medium' : ''">{{ text }}</span>
          </template>
        </RsTable>
      </template>
    </rs-card>

    <!-- ===== 3.3.1 Laporan Status Pendaftaran ===== -->
    <rs-card>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Icon name="mdi:account-badge-outline" />
            <span class="font-semibold">Laporan Status Pendaftaran</span>
          </div>
          <div class="flex gap-2">
            <rs-button variant="primary" @click="goToJanaLaporan">
              Jana Laporan
            </rs-button>
            <rs-button size="sm" variant="soft" @click="exportXLSX('status')">Excel (XLSX)</rs-button>
            <rs-button size="sm" variant="soft" @click="exportPDF('status')">PDF</rs-button>
          </div>
        </div>
      </template>
      <template #body>
        <RsTable
          :data="laporanStatus"
          :columns="columnsStatus"
          advanced
          :showNoColumn="false"
          :showSearch="true"
          :showFilter="true"
          :options="{ variant: 'default', striped: true, hover: true }"
          :optionsAdvanced="{ sortable: true, filterable: true, responsive: true, outsideBorder: true }"
        >
          <template #tarikhTamatPerkhidmatan="{ text }">
            <span :class="isExpired(text) ? 'text-danger-600 font-semibold' : ''">
              {{ formatDate(text) }}
            </span>
          </template>
          <template #statusPA="{ text }">
            <rs-badge :variant="statusBadge(text)">{{ text }}</rs-badge>
          </template>
        </RsTable>
      </template>
    </rs-card>

    <!-- ===== NEW: Laporan Penamatan / Pembaharuan ===== -->
    <rs-card>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Icon name="mdi:calendar-check" />
            <span class="font-semibold">Laporan Penamatan / Pembaharuan</span>
          </div>
          <div class="flex gap-2">
            <rs-button variant="primary" @click="goToJanaLaporanPenamatan">
              Jana Laporan
            </rs-button>
            <rs-button size="sm" variant="soft" @click="exportXLSX('status')">Excel (XLSX)</rs-button>
            <rs-button size="sm" variant="soft" @click="exportPDF('status')">PDF</rs-button>
          </div>
        </div>
      </template>
      <template #body>
        <RsTable
          :data="laporanPenamatan"
          :columns="columnsPenamatan"
          advanced
          :showNoColumn="false"
          :showSearch="true"
          :showFilter="true"
          :options="{ variant: 'default', striped: true, hover: true }"
          :optionsAdvanced="{ sortable: true, filterable: true, responsive: true, outsideBorder: true }"
        >
          <template #noKP="{ text }">{{ maskNRIC(text) }}</template>
          <template #tarikhMula="{ text }">{{ formatDate(text) }}</template>
          <template #tarikhTamat="{ text }">{{ formatDate(text) }}</template>
          <template #tarikhTindakan="{ text }">{{ formatDate(text) }}</template>
          <template #tempohBulan="{ text }">{{ text }}</template>
        </RsTable>
      </template>
    </rs-card>

    <!-- ===== 3.3.2 Laporan Elaun ===== -->
    <rs-card>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Icon name="mdi:cash-multiple" />
            <span class="font-semibold">Laporan Elaun</span>
          </div>
          <div class="flex gap-2">
            <rs-button variant="primary" @click="goToJanaLaporanElaun">
              Jana Laporan
            </rs-button>
            <rs-button size="sm" variant="soft" @click="exportXLSX('elaun')">Excel (XLSX)</rs-button>
            <rs-button size="sm" variant="soft" @click="exportPDF('elaun')">PDF</rs-button>
          </div>
        </div>
      </template>
      <template #body>
        <RsTable
          :data="laporanElaun"
          :columns="columnsElaun"
          advanced
          :showNoColumn="false"
          :showSearch="true"
          :showFilter="true"
          :options="{ variant: 'default', striped: true, hover: true }"
          :optionsAdvanced="{ sortable: true, filterable: true, responsive: true, outsideBorder: true }"
        >
          <template #tarikhBayaran="{ text }">{{ formatDate(text) }}</template>
          <template #jumlahElaun="{ text }">{{ formatRM(Number(text)) }}</template>
          <template #statusBayaran="{ text }">
            <rs-badge :variant="bayaranBadge(text)">{{ text }}</rs-badge>
          </template>
        </RsTable>
      </template>
    </rs-card>

    <!-- Click-through modal: individuals under a bar -->
    <transition name="fade">
      <div v-if="modal.open" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-3xl">
          <div class="px-6 py-4 border-b flex items-center justify-between">
            <div class="font-semibold flex items-center gap-2">
              <Icon name="mdi:account-group" /> Individu — {{ modal.title }}
            </div>
            <button class="text-gray-500 hover:text-gray-700" @click="modal.open=false">
              <Icon name="mdi:close" />
            </button>
          </div>
          <div class="p-6">
            <RsTable
              :data="modal.rows"
              :columns="modalColumns"
              :options="{ variant: 'default', striped: true, hover: true }"
              :optionsAdvanced="{ sortable: true, filterable: true, responsive: true }"
              advanced
            />
          </div>
          <div class="px-6 py-4 border-t flex items-center justify-end gap-2">
            <rs-button variant="primary" @click="exportCSVRows(modal.rows, 'individu.csv')">Muat Turun CSV</rs-button>
            <rs-button variant="soft" @click="modal.open=false">Tutup</rs-button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, shallowRef, onMounted, watch } from 'vue'
// import { useRouter } from 'vue-router' // Use Nuxt router instead

defineOptions({ name: 'PA-DA-PD-02-Index' })

/* ================== Meta / Breadcrumb ================== */
const breadcrumb = ref([
  { name: 'Dashboard', type: 'text', path: '/' },
  { name: 'Laporan Statistik', type: 'text', path: '#' },
])

/* ================== Filters & Options ================== */
const todayISO = new Date().toISOString().slice(0, 10)

const filters = reactive({
  kategoriPA: 'ALL',
  lokasiLevel: 'ALL', // ALL | KARIAH | DAERAH | INSTITUSI
  lokasi: 'ALL',
  statusPA: 'ALL', // Aktif / Tidak Aktif / Tamat Tempoh / ALL
  kategoriTugasan: 'ALL', // Bancian / Siasatan / Asnaf Review / ALL
  tarikhMula: '', // YYYY-MM-DD
  tarikhTamat: '', // YYYY-MM-DD
  jenisElaun: 'ALL',
  statusBayaran: 'ALL', // Lulus / Pending / Ditolak / ALL
  tahun: new Date().getFullYear().toString(),
})

const kategoriPAOptions = [
  { label: 'Semua', value: 'ALL' },
  { label: 'Kariah', value: 'KARIAH' },
  { label: 'Institusi', value: 'INSTITUSI' },
  { label: 'Hospital', value: 'HOSPITAL' },
]
const lokasiLevelOptions = [
  { label: 'Semua', value: 'ALL' },
  { label: 'Kariah', value: 'KARIAH' },
  { label: 'Daerah', value: 'DAERAH' },
  { label: 'Institusi', value: 'INSTITUSI' },
]
const lokasiOptions = [
  { label: 'Semua', value: 'ALL' },
  { label: 'Kariah Al-Hidayah', value: 'KARIAH:Al-Hidayah' },
  { label: 'Kariah An-Nur', value: 'KARIAH:An-Nur' },
  { label: 'Daerah Gombak', value: 'DAERAH:Gombak' },
  { label: 'Daerah Klang', value: 'DAERAH:Klang' },
  { label: 'Institusi Hospital Selayang', value: 'INSTITUSI:Hospital Selayang' },
  { label: 'Institusi UIAM', value: 'INSTITUSI:UIAM' },
]
const statusPAOptions = [
  { label: 'Semua', value: 'ALL' },
  { label: 'Aktif', value: 'Aktif' },
  { label: 'Tidak Aktif', value: 'Tidak Aktif' },
  { label: 'Tamat Tempoh', value: 'Tamat Tempoh' },
]
const kategoriTugasanOptions = [
  { label: 'Semua', value: 'ALL' },
  { label: 'Bancian', value: 'Bancian' },
  { label: 'Siasatan', value: 'Siasatan' },
  { label: 'Asnaf Review', value: 'Asnaf Review' },
]
const jenisElaunOptions = [
  { label: 'Semua', value: 'ALL' },
  { label: 'Tetap', value: 'Tetap' },
  { label: 'Program', value: 'Program' },
  { label: 'Khas', value: 'Khas' },
]
const statusBayaranOptions = [
  { label: 'Semua', value: 'ALL' },
  { label: 'Lulus', value: 'Lulus' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Ditolak', value: 'Ditolak' },
]
const tahunOptions = [
  { label: '2023', value: '2023' },
  { label: '2024', value: '2024' },
  { label: '2025', value: '2025' },
]

/* ================== Validation ================== */
const validation = reactive({ error: false, message: '' })

function validateBeforeGenerate(): boolean {
  validation.error = false
  validation.message = ''
  const hasDateOne = !!filters.tarikhMula || !!filters.tarikhTamat
  if (hasDateOne && !(filters.tarikhMula && filters.tarikhTamat)) {
    validation.error = true
    validation.message = 'Sila isi kedua-dua Tarikh Mula dan Tarikh Tamat untuk tempoh perkhidmatan.'
  }
  if (filters.tarikhMula && filters.tarikhTamat && filters.tarikhMula > filters.tarikhTamat) {
    validation.error = true
    validation.message = 'Tarikh Mula tidak boleh melebihi Tarikh Tamat.'
  }
  return !validation.error
}

function onGenerate() {
  if (!validateBeforeGenerate()) return
  refreshNonce()
}

function onReset() {
  filters.kategoriPA = 'ALL'
  filters.lokasiLevel = 'ALL'
  filters.lokasi = 'ALL'
  filters.statusPA = 'ALL'
  filters.kategoriTugasan = 'ALL'
  filters.tarikhMula = ''
  filters.tarikhTamat = ''
  filters.jenisElaun = 'ALL'
  filters.statusBayaran = 'ALL'
  filters.tahun = new Date().getFullYear().toString()
  validation.error = false
  validation.message = ''
  refreshNonce()
}

/* ================== Mock Data ================== */
const nonce = ref(0)
function refreshNonce() { nonce.value++ }

const dataIndividu = ref([
  { nama: 'Ahmad Karim', kategoriPA: 'KARIAH', lokasi: 'KARIAH:Al-Hidayah', statusPA: 'Aktif', tugasan: 'Bancian', jumlahDiambil: 8, jumlahSelesai: 6, purataHariSelesai: 5, tarikhMula: '2025-01-10', tarikhTamat: '2025-12-31', jenisElaun: 'Tetap', statusBayaran: 'Lulus', tarikhBayaran: '2025-08-05', jumlahElaun: 300 },
  { nama: 'Siti Rahmah', kategoriPA: 'INSTITUSI', lokasi: 'INSTITUSI:UIAM', statusPA: 'Aktif', tugasan: 'Siasatan', jumlahDiambil: 5, jumlahSelesai: 5, purataHariSelesai: 4, tarikhMula: '2025-03-01', tarikhTamat: '2025-12-31', jenisElaun: 'Program', statusBayaran: 'Pending', tarikhBayaran: '2025-09-01', jumlahElaun: 180 },
  { nama: 'Lim Wei', kategoriPA: 'HOSPITAL', lokasi: 'INSTITUSI:Hospital Selayang', statusPA: 'Tamat Tempoh', tugasan: 'Asnaf Review', jumlahDiambil: 4, jumlahSelesai: 3, purataHariSelesai: 9, tarikhMula: '2024-01-01', tarikhTamat: '2025-07-31', jenisElaun: 'Khas', statusBayaran: 'Ditolak', tarikhBayaran: '2025-07-20', jumlahElaun: 150 },
  { nama: 'Anand', kategoriPA: 'KARIAH', lokasi: 'KARIAH:An-Nur', statusPA: 'Tidak Aktif', tugasan: 'Bancian', jumlahDiambil: 3, jumlahSelesai: 2, purataHariSelesai: 8, tarikhMula: '2025-02-10', tarikhTamat: '2025-12-31', jenisElaun: 'Tetap', statusBayaran: 'Lulus', tarikhBayaran: '2025-08-25', jumlahElaun: 220 },
  { nama: 'Zahra', kategoriPA: 'KARIAH', lokasi: 'DAERAH:Gombak', statusPA: 'Aktif', tugasan: 'Siasatan', jumlahDiambil: 6, jumlahSelesai: 5, purataHariSelesai: 6, tarikhMula: '2025-05-01', tarikhTamat: '2025-12-31', jenisElaun: 'Program', statusBayaran: 'Lulus', tarikhBayaran: '2025-09-10', jumlahElaun: 210 },
  { nama: 'Banu', kategoriPA: 'INSTITUSI', lokasi: 'DAERAH:Klang', statusPA: 'Aktif', tugasan: 'Asnaf Review', jumlahDiambil: 7, jumlahSelesai: 7, purataHariSelesai: 3, tarikhMula: '2025-04-15', tarikhTamat: '2025-12-31', jenisElaun: 'Program', statusBayaran: 'Pending', tarikhBayaran: '2025-09-05', jumlahElaun: 260 },
])

/* ===== NEW mock for Penamatan / Pembaharuan table ===== */
type PenamatanRow = {
  idPA: string
  nama: string
  noKP: string
  kategori: 'PAK' | 'PAF' | 'PAP' | 'PAK+'
  kariahDaerah: string   // "Kariah XYZ / Gombak"
  tarikhMula: string     // ISO
  tarikhTamat: string    // ISO
  tindakan: 'Renew' | 'Tamat' | 'Pending'
  noSurat?: string
  tarikhTindakan?: string // ISO
  sebabPenamatan?: string
  statusSerahTugas: 'Selesai' | 'Belum'
  pegawaiPelulus: string
  catatan?: string
}

const dataPenamatan = ref<PenamatanRow[]>([
  {
    idPA: 'PA0001', nama: 'Ahmad Karim', noKP: '880101105555', kategori: 'PAK',
    kariahDaerah: 'Al-Hidayah / Gombak', tarikhMula: '2025-01-01', tarikhTamat: '2025-12-31',
    tindakan: 'Renew', noSurat: 'LZS/GOM/REN/2025/001', tarikhTindakan: '2025-12-01',
    sebabPenamatan: '', statusSerahTugas: 'Selesai', pegawaiPelulus: 'En. Razak', catatan: ''
  },
  {
    idPA: 'PA0002', nama: 'Siti Rahmah', noKP: '900202085432', kategori: 'PAF',
    kariahDaerah: 'An-Nur / Gombak', tarikhMula: '2024-02-01', tarikhTamat: '2025-01-31',
    tindakan: 'Tamat', noSurat: 'LZS/GOM/TMT/2025/015', tarikhTindakan: '2025-01-31',
    sebabPenamatan: 'Kontrak tamat', statusSerahTugas: 'Selesai', pegawaiPelulus: 'Pn. Mariam', catatan: ''
  },
  {
    idPA: 'PA0101', nama: 'Lim Wei', noKP: '870707086543', kategori: 'PAP',
    kariahDaerah: '— / Klang', tarikhMula: '2024-10-01', tarikhTamat: '2025-09-30',
    tindakan: 'Pending', noSurat: '', tarikhTindakan: '',
    sebabPenamatan: '', statusSerahTugas: 'Belum', pegawaiPelulus: 'En. Farid', catatan: 'Menunggu keputusan'
  },
  {
    idPA: 'PA0203', nama: 'Anand', noKP: '950505015432', kategori: 'PAK+',
    kariahDaerah: '— / Hulu Langat', tarikhMula: '2025-04-01', tarikhTamat: '2025-12-31',
    tindakan: 'Renew', noSurat: 'LZS/HLG/REN/2025/042', tarikhTindakan: '2025-12-15',
    sebabPenamatan: '', statusSerahTugas: 'Selesai', pegawaiPelulus: 'Pn. Noraini', catatan: '—'
  },
])

/* ================== Utils (declare BEFORE usage) ================== */
function formatRM(v: number) {
  return new Intl.NumberFormat('ms-MY', { style: 'currency', currency: 'MYR' }).format(v)
}
function isExpired(iso: string) {
  return new Date(iso) < new Date(todayISO)
}
function statusBadge(s: string) {
  if (s === 'Aktif') return 'success'
  if (s === 'Tamat Tempoh') return 'danger'
  return 'warning'
}
function bayaranBadge(s: string) {
  if (s === 'Lulus') return 'success'
  if (s === 'Pending') return 'warning'
  return 'danger'
}
function groupSum(rows: any[], byKey: string, sumKey: string) {
  return rows.reduce((acc: Record<string, number>, r) => {
    const k = r[byKey] ?? 'Lain-lain'
    acc[k] = (acc[k] || 0) + Number(r[sumKey] || 0)
    return acc
  }, {})
}
function exportCSVRows(rows: any[], filename = 'data.csv') {
  if (!rows || rows.length === 0) {
    const blob = new Blob(['(tiada data)'], { type: 'text/plain;charset=utf-8;' })
    downloadBlob(blob, filename)
    return
  }
  const headers = Object.keys(rows[0])
  const lines = [headers.join(',')]
  rows.forEach((r) => {
    lines.push(headers.map((h) => csvSafe(r[h])).join(','))
  })
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  downloadBlob(blob, filename)
}
function csvSafe(v: any) {
  const s = String(v ?? '')
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}
function jsonToHTMLTable(rows: any[]) {
  if (!rows || rows.length === 0) return '<p>(tiada data)</p>'
  const headers = Object.keys(rows[0])
  const thead = `<tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr>`
  const tbody = rows.map((r) =>
    `<tr>${headers.map((h) => `<td>${r[h] ?? ''}</td>`).join('')}</tr>`
  ).join('')
  return `<table><thead>${thead}</thead><tbody>${tbody}</tbody></table>`
}
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
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
function maskNRIC(nric: string) {
  if (!nric) return ''
  const digits = (nric || '').replace(/\D/g, '')
  if (digits.length <= 4) return digits
  const first2 = digits.slice(0, 2)
  const last4 = digits.slice(-4)
  return `${first2}******${last4}`
}
function monthDiff(isoStart?: string, isoEnd?: string) {
  if (!isoStart || !isoEnd) return 0
  const a = new Date(isoStart)
  const b = new Date(isoEnd)
  if (isNaN(a.getTime()) || isNaN(b.getTime())) return 0
  let months = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth())
  if (b.getDate() >= a.getDate()) months += 1
  return Math.max(0, months)
}

/* ================== Filter Pipeline (AND) ================== */
const filteredRows = computed(() => {
  const rows = dataIndividu.value
  return rows.filter((r) => {
    if (filters.kategoriPA !== 'ALL' && r.kategoriPA !== filters.kategoriPA) return false
    if (filters.lokasiLevel !== 'ALL') {
      if (!r.lokasi.startsWith(filters.lokasiLevel + ':')) return false
    }
    if (filters.lokasi !== 'ALL' && r.lokasi !== filters.lokasi) return false
    if (filters.statusPA !== 'ALL' && r.statusPA !== filters.statusPA) return false
    if (filters.kategoriTugasan !== 'ALL' && r.tugasan !== filters.kategoriTugasan) return false
    if (filters.jenisElaun !== 'ALL' && r.jenisElaun !== filters.jenisElaun) return false
    if (filters.statusBayaran !== 'ALL' && r.statusBayaran !== filters.statusBayaran) return false
    if (filters.tahun && !String(r.tarikhMula).startsWith(filters.tahun) && !String(r.tarikhTamat).startsWith(filters.tahun)) return false

    if (filters.tarikhMula && filters.tarikhTamat) {
      if (r.tarikhMula > filters.tarikhTamat || r.tarikhTamat < filters.tarikhMula) return false
    }
    return true
  })
})

/* ===== Filter for Penamatan Table (use tarikhTamat / tarikhTindakan year, and by daerah/kategori) ===== */
const filteredPenamatan = computed(() => {
  return dataPenamatan.value.filter((r) => {
    // year filter by either tarikhTindakan or tarikhTamat
    const t = r.tarikhTindakan || r.tarikhTamat
    if (filters.tahun !== 'ALL' && (!t || !String(t).startsWith(filters.tahun))) return false

    // lokasiLevel -> check suffix of daerah in "Kariah / Daerah"
    if (filters.lokasiLevel === 'DAERAH' && filters.lokasi !== 'ALL') {
      const daerah = (r.kariahDaerah.split('/').pop() || '').trim()
      const expected = filters.lokasi.replace('DAERAH:', '')
      if (daerah !== expected) return false
    }

    if (filters.kategoriPA !== 'ALL') {
      // map to generic categories if needed; here we treat ALL as pass
      // (kategori in this dataset is detailed PAK/PAF/PAP/PAK+; skip strict map)
    }

    return true
  })
})

/* ================== Charts ================== */
const Apex = shallowRef<any | null>(null)
onMounted(async () => {
  try {
    const mod = await import('vue3-apexcharts')
    Apex.value = mod.default
  } catch {
    // noop – fallback text will render
  }
})

const elaunMode = ref<'pie' | 'bar'>('pie')

const chartTugasan = computed(() => {
  const cats = ['Bancian', 'Siasatan', 'Asnaf Review']
  const counts = cats.map((c) => filteredRows.value.filter((r) => r.tugasan === c).length)
  return {
    series: [{ name: 'Bilangan Tugasan (Individu)', data: counts }],
    options: {
      xaxis: { categories: cats },
      dataLabels: { enabled: true },
      chart: {
        events: {
          dataPointSelection: (_e: any, _ctx: any, config: any) => {
            const kategori = cats[config.dataPointIndex]
            openModalIndividu(`Tugasan: ${kategori}`, filteredRows.value.filter((r) => r.tugasan === kategori))
          },
        },
      },
      tooltip: { y: { formatter: (v: number) => `${v} individu` } },
    },
  }
})

const chartElaun = computed(() => {
  const sums = groupSum(filteredRows.value, 'jenisElaun', 'jumlahElaun')
  const labels = Object.keys(sums)
  const data = Object.values(sums)
  return {
    series: elaunMode.value === 'pie' ? data : [{ name: 'Jumlah Elaun (RM)', data }],
    options: {
      labels,
      xaxis: { categories: labels },
      dataLabels: { enabled: true },
      tooltip: { y: { formatter: (v: number) => formatRM(v) } },
    },
  }
})

const chartStatusPA = computed(() => {
  const cats = ['Aktif', 'Tidak Aktif', 'Tamat Tempoh']
  const counts = cats.map((c) => filteredRows.value.filter((r) => r.statusPA === c).length)
  return {
    series: counts,
    options: {
      labels: cats,
      dataLabels: { enabled: true },
      legend: { position: 'bottom' },
      tooltip: { y: { formatter: (v: number) => `${v} individu` } },
    },
  }
})

/* ================== Tables (existing) ================== */
const laporanTugasan = computed(() =>
  filteredRows.value.map((r) => ({
    nama: r.nama,
    jumlahTugasanDiambil: r.jumlahDiambil,
    jumlahTugasanSelesai: r.jumlahSelesai,
    kategoriTugasan: r.tugasan,
    lokasi: r.lokasi.replace(':', ' — '),
    purataHariSelesai: r.purataHariSelesai,
  }))
)
const columnsTugasan = [
  { key: 'nama', label: 'Nama Penolong Amil' },
  { key: 'jumlahTugasanDiambil', label: 'Jumlah Tugasan Diambil' },
  { key: 'jumlahTugasanSelesai', label: 'Jumlah Tugasan Selesai' },
  { key: 'kategoriTugasan', label: 'Kategori Tugasan' },
  { key: 'lokasi', label: 'Lokasi' },
  { key: 'purataHariSelesai', label: 'Purata Hari Selesai' },
]

const laporanStatus = computed(() =>
  filteredRows.value.map((r) => ({
    nama: r.nama,
    statusPA: r.statusPA,
    tarikhTamatPerkhidmatan: r.tarikhTamat,
    lokasi: r.lokasi.replace(':', ' — '),
    kategoriPA: r.kategoriPA,
  }))
)
const columnsStatus = [
  { key: 'nama', label: 'Nama Penolong Amil' },
  { key: 'statusPA', label: 'Status' },
  { key: 'tarikhTamatPerkhidmatan', label: 'Tarikh Tamat Perkhidmatan' },
  { key: 'lokasi', label: 'Kariah / Daerah / Institusi' },
  { key: 'kategoriPA', label: 'Kategori PA' },
]

const laporanElaun = computed(() =>
  filteredRows.value.map((r) => ({
    nama: r.nama,
    jenisElaun: r.jenisElaun,
    tarikhBayaran: r.tarikhBayaran,
    jumlahElaun: r.jumlahElaun,
    statusBayaran: r.statusBayaran,
    jenisTugasan: r.tugasan,
  }))
)
const columnsElaun = [
  { key: 'nama', label: 'Nama Penolong Amil' },
  { key: 'jenisElaun', label: 'Jenis Elaun' },
  { key: 'tarikhBayaran', label: 'Tarikh Bayaran' },
  { key: 'jumlahElaun', label: 'Jumlah Elaun (RM)' },
  { key: 'statusBayaran', label: 'Status Bayaran' },
  { key: 'jenisTugasan', label: 'Jenis Tugasan' },
]

/* ================== NEW: Laporan Penamatan Table ================== */
const laporanPenamatan = computed(() =>
  filteredPenamatan.value.map((r) => ({
    idPA: r.idPA,
    nama: r.nama,
    noKP: r.noKP,
    kategori: r.kategori,
    kariahDaerah: r.kariahDaerah,
    tarikhMula: r.tarikhMula,
    tarikhTamat: r.tarikhTamat,
    tindakan: r.tindakan,
    noSurat: r.noSurat || '',
    tarikhTindakan: r.tarikhTindakan || '',
    tempohBulan: monthDiff(r.tarikhMula, r.tarikhTamat),
    sebabPenamatan: r.sebabPenamatan || '',
    statusSerahTugas: r.statusSerahTugas,
    pegawaiPelulus: r.pegawaiPelulus,
    catatan: r.catatan || '',
  }))
)

const columnsPenamatan = [
  { key: 'idPA', label: 'ID_PA', sortable: true },
  { key: 'nama', label: 'Nama', sortable: true },
  { key: 'noKP', label: 'No. KP', sortable: true },
  { key: 'kategori', label: 'Kategori', sortable: true },
  { key: 'kariahDaerah', label: 'Kariah/Daerah', sortable: true },
  { key: 'tarikhMula', label: 'Tarikh Mula', sortable: true },
  { key: 'tarikhTamat', label: 'Tarikh Tamat', sortable: true },
  { key: 'tindakan', label: 'Tindakan', sortable: true },
  { key: 'noSurat', label: 'No. Surat (Renew/Tamat)', sortable: true },
  { key: 'tarikhTindakan', label: 'Tarikh Tindakan', sortable: true },
  { key: 'tempohBulan', label: 'Tempoh (bulan)', sortable: true },
  { key: 'sebabPenamatan', label: 'Sebab Penamatan', sortable: true },
  { key: 'statusSerahTugas', label: 'Status Serah Tugas', sortable: true },
  { key: 'pegawaiPelulus', label: 'Pegawai Pelulus', sortable: true },
  { key: 'catatan', label: 'Catatan', sortable: false },
]

/* ================== Modal (Click-through) ================== */
const modal = reactive({ open: false, title: '', rows: [] as any[] })
const modalColumns = [
  { key: 'nama', label: 'Nama' },
  { key: 'kategoriPA', label: 'Kategori PA' },
  { key: 'lokasi', label: 'Lokasi' },
  { key: 'tugasan', label: 'Tugasan' },
  { key: 'statusPA', label: 'Status PA' },
  { key: 'tarikhMula', label: 'Tarikh Mula' },
  { key: 'tarikhTamat', label: 'Tarikh Tamat' },
]
function openModalIndividu(title: string, rows: any[]) {
  modal.title = title
  modal.rows = rows
  modal.open = true
}

/* ================== Export (PDF / Excel) ================== */
function exportXLSX(which: 'tugasan' | 'status' | 'elaun') {
  const map = {
    tugasan: { rows: laporanTugasan.value, name: 'Laporan_Tugasan' },
    status:  { rows: laporanStatus.value,  name: 'Laporan_Status_Pendaftaran' },
    elaun:   { rows: laporanElaun.value,   name: 'Laporan_Elaun' },
  } as const
  const { rows, name } = map[which]
  // If SheetJS (XLSX) is available globally, use it; otherwise fall back to CSV.
  // @ts-ignore
  if (window && window.XLSX) {
    // @ts-ignore
    const ws = window.XLSX.utils.json_to_sheet(rows)
    // @ts-ignore
    const wb = window.XLSX.utils.book_new()
    // @ts-ignore
    window.XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    // @ts-ignore
    const wbout = window.XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    downloadBlob(blob, `${name}.xlsx`)
  } else {
    exportCSVRows(rows, `${name}.csv`)
  }
}

function exportPDF(which: 'tugasan' | 'status' | 'elaun') {
  const title = {
    tugasan: 'Laporan Tugasan',
    status: 'Laporan Status Pendaftaran',
    elaun: 'Laporan Elaun'
  }[which]
  const rows = {
    tugasan: laporanTugasan.value,
    status: laporanStatus.value,
    elaun: laporanElaun.value
  }[which]

  const tableHTML = jsonToHTMLTable(rows)
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; }
    h1 { font-size: 18px; margin-bottom: 12px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; }
    th { background: #f2f2f2; text-align: left; }
  </style>
</head>
<body onload="window.print(); setTimeout(()=>window.close(),300)">
  <h1>${title}</h1>
  ${tableHTML}
</body>
</html>`

  const win = window.open('', '_blank')
  if (win) {
    win.document.open()
    win.document.write(html)
    win.document.close()
  }
}

/* ================== Router navigation ================== */
// const router = useRouter() // Use navigateTo instead
function goToJanaLaporan() {
  navigateTo('/BF-PA/DA/dashboard/jana-laporan-pendaftaran')
}
function goToJanaLaporanElaun() {
  navigateTo('/BF-PA/DA/dashboard/jana-laporan-elaun')
}
function goToJanaLaporanTugasan() {
  navigateTo('/BF-PA/DA/dashboard/jana-laporan-tugasan')
}
function goToJanaLaporanPenamatan() {
  navigateTo('/BF-PA/DA/dashboard/jana-laporan-penamatan')
}

/* ================== watchers ================== */
watch(nonce, () => {
  // place to re-fetch if wired to API
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
