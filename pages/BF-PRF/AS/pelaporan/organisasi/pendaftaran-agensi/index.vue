<template>
  <div>
    <layouts-breadcrumb :items="breadcrumb" />

    <!-- HEADER — papar hanya selepas Jana -->
    <rs-card class="mt-4" v-if="hasGenerated">
      <template #body>
        <div class="flex items-start justify-between gap-6">
          <!-- Kiri: Logo + Tajuk -->
          <div class="flex items-start gap-4">
            <img
              src="https://www.zakatselangor.com.my/wp-content/uploads/2018/10/lzs-logo.png"
              alt="LZS"
              class="h-14 w-auto"
            />
            <div class="leading-tight">
              <div class="font-semibold tracking-wide text-[rgb(var(--text-color))]">
                RO0001
              </div>
              <h2 class="text-xl font-bold text-[rgb(var(--text-color))]">
                Laporan Pendaftaran Agensi Mengikut Jenis Organisasi
              </h2>
            </div>
          </div>

          <!-- Kanan: Tarikh & Masa jana -->
          <div class="text-sm text-right">
            <div><span class="font-semibold">Tarikh:</span> {{ genDate }}</div>
            <div><span class="font-semibold">Masa:</span> {{ genTime }}</div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- PENAPIS / CARIAN -->
    <rs-card class="mt-4">
      <template #header>
        <h2 class="text-base font-semibold">Penapis Laporan</h2>
      </template>
      <template #body>
        <FormKit type="form" :actions="false" id="orgForm" @submit="onJana">
          <div class="grid gap-6 md:grid-cols-3">
            <!-- Daerah -->
            <FormKit
              type="select"
              label="Daerah"
              v-model="filters.daerah"
              :options="daerahOptions"
              placeholder="Semua"
              :classes="fkClasses"
            />
          </div>

          <!-- Actions -->
          <div class="mt-6 flex items-center gap-3 justify-end">
            <rs-button
              variant="primary-outline"
              size="sm"
              class="!h-9 !px-4 !py-2 !text-sm !rounded-xl !leading-none align-middle"
              @click="onReset"
            >
              Reset
            </rs-button>

            <rs-button
              variant="primary"
              size="sm"
              class="!h-9 !px-4 !py-2 !text-sm !rounded-xl !leading-none align-middle"
              @click="submitForm('orgForm')"
            >
              Jana
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- HASIL + EXPORT -->
    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-end gap-2 print:hidden">
          <rs-button
            variant="primary-outline"
            size="sm"
            class="flex items-center"
            :disabled="!tableRows.length || !hasGenerated"
            @click="exportExcel"
          >
            Export Excel
          </rs-button>
          <rs-button
            variant="primary"
            size="sm"
            class="flex items-center"
            :disabled="!tableRows.length || !hasGenerated"
            @click="exportPDF"
          >
            Export PDF
          </rs-button>
        </div>
      </template>

      <template #body>
        <!-- Empty state sebelum Jana -->
        <div
          v-if="!hasGenerated"
          class="rounded-2xl border border-dashed bg-white p-10 text-center text-gray-500"
        >
          <div class="flex flex-col items-center gap-2">
            <Icon name="iconamoon:arrow-down-2-bold" class="h-8 w-8 opacity-60" />
            <div class="-mt-2 text-xl leading-none">–</div>
            <p class="mt-1 text-base">Sila jana laporan terlebih dahulu</p>
          </div>
        </div>

        <!-- Jadual selepas Jana -->
        <div v-else class="table-wrapper">
          <rs-table
            :data="tableRows"
            :columns="columns"
            :field="[
              'idOrganisasi','namaOrganisasi','jenisOrganisasi','daerah','alamat',
              'telefon','tarikhPendaftaran','status','pegawai'
            ]"
            :advanced="true"
            :showSearch="false"
            :showFilter="false"
            :showNoColumn="true"
            :pageSize="10"
            :sort="tableSort"
            :options="{
              variant: 'default',
              striped: false,
              bordered: true,
              borderless: false,
              hover: true,
              fixed: false
            }"
            :optionsAdvanced="{
              sortable: true,
              filterable: false,
              responsive: true,
              outsideBorder: true
            }"
          >
            <!-- ====== HEADER SLOTS ====== -->
            <!-- Kekal sebaris walaupun 2 perkataan -->
            <template #header-idOrganisasi>
              <span class="h-one">ID Organisasi</span>
            </template>

            <!-- 2 PERKATAAN → 2 BARIS TEPAT -->
            <template #header-namaOrganisasi>
              <span class="h-2lines"><span>Nama</span><br/><span>Organisasi</span></span>
            </template>
            <template #header-jenisOrganisasi>
              <span class="h-2lines"><span>Jenis</span><br/><span>Organisasi</span></span>
            </template>
            <template #header-daerah><span class="h-one">Daerah</span></template>
            <template #header-alamat><span class="h-one">Alamat</span></template>
            <template #header-telefon><span class="h-one">Telefon</span></template>
            <template #header-tarikhPendaftaran>
              <span class="h-2lines"><span>Tarikh</span><br/><span>Pendaftaran</span></span>
            </template>
            <template #header-status><span class="h-one">Status</span></template>
            <template #header-pegawai>
              <span class="h-2lines"><span>Pegawai</span><br/><span>Bertanggungjawab</span></span>
            </template>

            <!-- ====== CELL SLOTS ====== -->
            <template #idOrganisasi="{ text }"><span class="col-id">{{ text }}</span></template>
            <template #namaOrganisasi="{ text }"><span class="col-nama">{{ text }}</span></template>
            <template #jenisOrganisasi="{ text }"><span class="col-jenis">{{ text }}</span></template>
            <template #daerah="{ text }"><span class="col-daerah">{{ text }}</span></template>
            <template #alamat="{ text }"><span class="col-alamat">{{ text }}</span></template>
            <template #telefon="{ text }"><span class="col-telefon">{{ text }}</span></template>
            <template #tarikhPendaftaran="{ text }"><span class="col-tarikh">{{ formatDMY(text) }}</span></template>
            <template #status="{ text }">
              <div class="w-full flex items-center justify-center">
                <rs-badge :variant="statusVariant(text)" class="!whitespace-nowrap">
                  {{ text }}
                </rs-badge>
              </div>
            </template>

            <template #pegawai="{ text }"><span class="col-pegawai">{{ text }}</span></template>
          </rs-table>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

definePageMeta({ title: 'Laporan Pendaftaran Agensi mengikut Jenis Organisasi' })

/* Breadcrumb */
const breadcrumb = [
  { name: 'Pelaporan', type: 'link', path: '/BF-PRF/AS/pelaporan/organisasi' },
  { name: 'Laporan Pendaftaran Organisasi', type: 'link', path: '/BF-PRF/AS/pelaporan/organisasi/pendaftaran-agensi' },
]

/* ========= State jana/report ========= */
const hasGenerated = ref(false)
const generatedAt  = ref(new Date())

/* Tarikh/Masa dipapar di header selepas Jana */
function pad(n){ return String(n).padStart(2,'0') }
const genDate = computed(() => formatDMY(generatedAt.value))
const genTime = computed(() => {
  const d = new Date(generatedAt.value)
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
})

/* ========= Penapis ========= */
const filters = reactive({ daerah: '' })

const daerahOptions = [
  { value: '', label: 'Semua' },
  { value: 'Gombak', label: 'Gombak' },
  { value: 'Hulu Langat', label: 'Hulu Langat' },
  { value: 'Klang', label: 'Klang' },
  { value: 'Kuala Langat', label: 'Kuala Langat' },
  { value: 'Kuala Selangor', label: 'Kuala Selangor' },
  { value: 'Petaling', label: 'Petaling' },
  { value: 'Sabak Bernam', label: 'Sabak Bernam' },
  { value: 'Sepang', label: 'Sepang' },
  { value: 'Shah Alam', label: 'Shah Alam' },
]

/* Kolum label untuk rs-table */
const columns = [
  { key: 'idOrganisasi',      label: 'ID Organisasi' },
  { key: 'namaOrganisasi',    label: 'Nama Organisasi' },
  { key: 'jenisOrganisasi',   label: 'Jenis Organisasi' },
  { key: 'daerah',            label: 'Daerah' },
  { key: 'alamat',            label: 'Alamat' },
  { key: 'telefon',           label: 'Telefon' },
  { key: 'tarikhPendaftaran', label: 'Tarikh Pendaftaran' },
  { key: 'status',            label: 'Status' },
  { key: 'pegawai',           label: 'Pegawai Bertanggungjawab' },
]

/* Susunan sort awal — ikut ID supaya No. selari dengan ID */
const tableSort = { column: 'idOrganisasi', direction: 'asc' }

/* Data contoh */
const rows = ref([
  { idOrganisasi: 'ORG001', namaOrganisasi: 'Masjid Sultan Abdul Aziz', jenisOrganisasi: 'Masjid',    daerah: 'Klang',        alamat: 'Jalan Masjid, Klang',             telefon: '03-33718888', tarikhPendaftaran: '2023-01-12', status: 'Aktif',       pegawai: 'Ahmad bin Ali' },
  { idOrganisasi: 'ORG002', namaOrganisasi: 'Surau Al-Falah',           jenisOrganisasi: 'Surau',     daerah: 'Shah Alam',    alamat: 'Seksyen 7, Shah Alam',            telefon: '03-55235555', tarikhPendaftaran: '2023-02-18', status: 'Aktif',       pegawai: 'Roslan bin Omar' },
  { idOrganisasi: 'ORG003', namaOrganisasi: 'Sekolah Islam Hidayah',    jenisOrganisasi: 'Institusi', daerah: 'Gombak',       alamat: 'Batu Caves, Gombak',              telefon: '03-61896666', tarikhPendaftaran: '2023-03-05', status: 'Aktif',       pegawai: 'Siti binti Rahman' },
  { idOrganisasi: 'ORG004', namaOrganisasi: 'Pertubuhan Amal Sejahtera',jenisOrganisasi: 'NGO',       daerah: 'Petaling',     alamat: 'Kota Damansara',                   telefon: '03-61587777', tarikhPendaftaran: '2023-04-09', status: 'Aktif',       pegawai: 'Faridah binti Musa' },
  { idOrganisasi: 'ORG005', namaOrganisasi: 'Hospital Pakar Selangor',  jenisOrganisasi: 'Hospital',  daerah: 'Sepang',       alamat: 'Dengkil, Sepang',                  telefon: '03-87658888', tarikhPendaftaran: '2023-05-21', status: 'Tidak Aktif', pegawai: 'Dr. Khalid bin Hamzah' },
  { idOrganisasi: 'ORG006', namaOrganisasi: 'Masjid Jamek Kampung Raja Uda', jenisOrganisasi: 'Masjid', daerah: 'Klang',     alamat: 'Kg. Raja Uda, Klang',              telefon: '03-33719999', tarikhPendaftaran: '2023-06-15', status: 'Aktif',       pegawai: 'Ahmad bin Ali' },
  { idOrganisasi: 'ORG007', namaOrganisasi: 'Surau An-Nur',             jenisOrganisasi: 'Surau',     daerah: 'Hulu Langat',  alamat: 'Bandar Baru Bangi',                telefon: '03-89223333', tarikhPendaftaran: '2023-07-01', status: 'Aktif',       pegawai: 'Roslan bin Omar' },
  { idOrganisasi: 'ORG008', namaOrganisasi: 'Sekolah Rendah Islam Al-Amin', jenisOrganisasi: 'Institusi', daerah: 'Petaling', alamat: 'Subang Jaya',                     telefon: '03-56339999', tarikhPendaftaran: '2023-08-10', status: 'Aktif',       pegawai: 'Siti binti Rahman' },
  { idOrganisasi: 'ORG009', namaOrganisasi: 'Persatuan Prihatin Masyarakat', jenisOrganisasi: 'NGO', daerah: 'Gombak',       alamat: 'UIA Gombak',                       telefon: '03-61964444', tarikhPendaftaran: '2023-09-14', status: 'Aktif',       pegawai: 'Faridah binti Musa' },
  { idOrganisasi: 'ORG010', namaOrganisasi: 'Pusat Komuniti Hulu Langat', jenisOrganisasi: 'Institusi', daerah: 'Hulu Langat', alamat: 'Kajang',                         telefon: '03-87355555', tarikhPendaftaran: '2023-10-20', status: 'Aktif',       pegawai: 'Dr. Khalid bin Hamzah' },
])

/* Badge status */
const statusVariant = (txt) => {
  const s = String(txt || '').trim().toLowerCase()
  if (s === 'aktif') return 'success'
  if (s === 'tidak aktif') return 'danger'
  return 'default'
}

/* Format DD/MM/YYYY — terima Date atau string */
const formatDMY = (d) => {
  if (!d) return '-'
  const dt = (d instanceof Date) ? d : new Date(d)
  const dd = String(dt.getDate()).padStart(2,'0')
  const mm = String(dt.getMonth()+1).padStart(2,'0')
  const yy = dt.getFullYear()
  return `${dd}/${mm}/${yy}`
}

/* ====== Penapis data ====== */
const filteredRows = computed(() => {
  if (!filters.daerah) return rows.value
  return rows.value.filter(r => r.daerah === filters.daerah)
})

/* Data untuk jadual (hasil tapisan) */
const tableRows = computed(() => filteredRows.value)

/* ====== Aksi Jana/Reset ====== */
function onJana () {
  generatedAt.value = new Date()
  hasGenerated.value = true
}

function onReset () {
  filters.daerah = ''
  generatedAt.value = new Date()
  hasGenerated.value = false
}

/* ====== Export Excel (CSV) — ikut gaya Aging ====== */
function exportExcel () {
  if (!tableRows.value.length) return
  const header = [
    'No','ID Organisasi','Nama Organisasi','Jenis Organisasi','Daerah',
    'Alamat','Telefon','Tarikh Pendaftaran','Status','Pegawai Bertanggungjawab'
  ]
  const data = tableRows.value.map((r, i) => ([
    i + 1, r.idOrganisasi, r.namaOrganisasi, r.jenisOrganisasi, r.daerah,
    r.alamat, r.telefon, formatDMY(r.tarikhPendaftaran), r.status, r.pegawai
  ]))

  const csv = [header, ...data]
    .map(row => row.map(x => `"${String(x).replace(/"/g,'""')}"`).join(','))
    .join('\r\n')

  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `RO0001_Laporan_Pendaftaran_Agensi_${formatDMY(generatedAt.value)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

/* ====== Export PDF — header hitam & bold + meta Tarikh/Daerah ====== */
function exportPDF () {
  if (!tableRows.value.length) return
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

  const head = [[
    'No','ID Organisasi','Nama Organisasi','Jenis Organisasi','Daerah',
    'Alamat','Telefon','Tarikh Pendaftaran','Status','Pegawai Bertanggungjawab'
  ]]
  const body = tableRows.value.map((r, i) => ([
    i + 1, r.idOrganisasi, r.namaOrganisasi, r.jenisOrganisasi, r.daerah,
    r.alamat, r.telefon, formatDMY(r.tarikhPendaftaran), r.status, r.pegawai
  ]))

  autoTable(doc, {
    head, body, startY: 20,
    styles: { fontSize: 9, cellPadding: 2, valign: 'middle' },
    headStyles: { fillColor: [240,240,240], textColor: [0,0,0], fontStyle: 'bold' },
    margin: { top: 16, left: 10, right: 10, bottom: 12 },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { cellWidth: 22 },
      2: { cellWidth: 48 },
      3: { cellWidth: 28 },
      4: { cellWidth: 24 },
      5: { cellWidth: 55 },
      6: { cellWidth: 28 },
      7: { cellWidth: 28 },
      8: { cellWidth: 22 },
      9: { cellWidth: 40 },
    },
    didDrawPage: () => {
      doc.setFontSize(14); doc.setFont('helvetica','bold')
      doc.text('RO0001: Laporan Pendaftaran Agensi Mengikut Jenis Organisasi', doc.internal.pageSize.getWidth()/2, 10, { align:'center' })
      doc.setFontSize(10); doc.setFont('helvetica','normal')
      const meta = `Tarikh: ${formatDMY(generatedAt.value)}${filters.daerah ? '  |  Daerah: ' + filters.daerah : ''}`
      doc.text(meta, doc.internal.pageSize.getWidth()/2, 15, { align:'center' })
    },
  })

  doc.save(`RO0001_Laporan_Pendaftaran_Agensi_${formatDMY(generatedAt.value)}.pdf`)
}

/* ======================
   Helpers / UI
   ====================== */
function submitForm (id) {
  const form = document.getElementById(id)
  if (!form) return
  if (typeof form.requestSubmit === 'function') form.requestSubmit()
  else {
    const tmp = document.createElement('button'); tmp.type = 'submit'; tmp.style.display = 'none'
    form.appendChild(tmp); tmp.click(); form.removeChild(tmp)
  }
}

const fkClasses = {
  outer: 'space-y-1',
  label: 'text-sm font-medium text-gray-900',
  inner: 'mt-1 formkit-disabled:opacity-60 rounded-xl border bg-white focus-within:ring-2 focus-within:ring-blue-500',
  input: 'w-full rounded-xl border-0 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none',
  help: 'text-xs text-gray-500 mt-1',
  messages: 'text-xs text-red-600 mt-1',
}
</script>

<style scoped>
/* ===== Elak scroll mendatar ===== */
.table-wrapper { overflow-x: hidden; }

/* Balut kandungan dengan kemas (tanpa pecah huruf rawak) */
:deep(table) th,
:deep(table) td {
  white-space: normal;
  word-break: normal;
  overflow-wrap: anywhere;
  vertical-align: middle;
}

/* ===== Kolum No. — kemas & center ===== */
:deep(thead tr th:first-child),
:deep(tbody tr td:first-child) {
  width: 56px; min-width: 56px; max-width: 56px;
  text-align: center !important;
  white-space: nowrap !important;
  word-break: keep-all !important;
  overflow-wrap: normal !important;
  font-variant-numeric: tabular-nums;
  letter-spacing: normal;
  line-height: 1.2;
}
/* Paksa align tengah jika header gunakan flex/ikon sort */
:deep(thead tr th:first-child),
:deep(thead tr th:first-child > *),
:deep(thead tr th:first-child .flex),
:deep(thead tr th:first-child .rs-th-inner) {
  justify-content: center !important;
  text-align: center !important;
}

/* ===== HEADER STYLE ===== */
/* 1) Header sebaris (single-word / khusus ID Organisasi) */
:deep(.h-one) {
  display: inline-block;
  white-space: nowrap;
}

/* 2) Header 2 baris tepat:
      - setiap <span> dalam .h-2lines -> nowrap
      - hanya pecah di <br>, tak jadi 3 baris */
:deep(.h-2lines) {
  display: inline-block;
  line-height: 1.15;
  white-space: normal;
}
:deep(.h-2lines > span) {
  display: block;
  white-space: nowrap;   /* elak wrap tambahan */
}

/* ===== Cell width tuning (jimat ruang, masih mudah baca) ===== */
:deep(.col-id)      { white-space: nowrap; }
:deep(.col-nama)    { min-width: 180px; max-width: 240px; word-break: keep-all; }
:deep(.col-jenis)   { white-space: nowrap; min-width: 120px; }
:deep(.col-daerah)  { white-space: nowrap; min-width: 110px; }
:deep(.col-alamat)  { min-width: 200px; max-width: 320px; }
:deep(.col-telefon) { white-space: nowrap; }
:deep(.col-tarikh)  { white-space: nowrap; }
:deep(.col-pegawai) { min-width: 180px; max-width: 260px; word-break: keep-all; }

/* Border & footer */
:deep(table.table-content) { border-color: rgb(var(--border-color)); }
:deep(.table-footer) { border-top: 1px solid rgb(var(--border-color)); }

@media print {
  .print\:hidden { display: none !important; }
}
</style>
