<template>
  <div>
    <layouts-breadcrumb :items="breadcrumb" />

    <!-- HEADER -->
    <rs-card class="mt-4">
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

          <!-- Kanan: Tarikh & Masa -->
          <div class="text-sm text-right">
            <div><span class="font-semibold">Tarikh:</span> {{ today }}</div>
            <div><span class="font-semibold">Masa:</span> {{ now }}</div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- HASIL + EXPORT -->
    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-end gap-2">
          <rs-button
            variant="primary-outline"
            size="sm"
            class="flex items-center"
            :disabled="!rows.length"
            @click="exportExcel"
          >
            Export Excel
          </rs-button>
          <rs-button
            variant="primary"
            size="sm"
            class="flex items-center"
            :disabled="!rows.length"
            @click="exportPDF"
          >
            Export PDF
          </rs-button>
        </div>
      </template>

      <template #body>
        <div class="table-wrapper">
          <rs-table
            :data="rows"
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
            <!-- ====== HEADER SLOTS (header ada kelas h-*) ====== -->
            <template #header-idOrganisasi><span class="h-id">ID&nbsp;Organisasi</span></template>
            <template #header-namaOrganisasi><span class="h-nama">Nama&nbsp;Organisasi</span></template>
            <template #header-jenisOrganisasi><span class="h-jenis">Jenis&nbsp;Organisasi</span></template>
            <template #header-daerah><span class="h-daerah">Daerah</span></template>
            <template #header-alamat><span class="h-alamat">Alamat</span></template>
            <template #header-telefon><span class="h-telefon">Telefon</span></template>
            <template #header-tarikhPendaftaran><span class="h-tarikh">Tarikh&nbsp;Pendaftaran</span></template>
            <template #header-status><span class="h-status">Status</span></template>

            <!-- Paksa 2 baris tepat untuk header panjang -->
            <template #header-pegawai>
              <span class="h-pegawai">
                <span>Pegawai</span><br />
                <span>Bertanggungjawab</span>
              </span>
            </template>

            <!-- ====== CELL SLOTS (data ada kelas col-*) ====== -->
            <template #idOrganisasi="{ text }"><span class="col-id">{{ text }}</span></template>
            <template #namaOrganisasi="{ text }"><span class="col-nama">{{ text }}</span></template>
            <template #jenisOrganisasi="{ text }"><span class="col-jenis">{{ text }}</span></template>
            <template #daerah="{ text }"><span class="col-daerah">{{ text }}</span></template>
            <template #alamat="{ text }"><span class="col-alamat">{{ text }}</span></template>
            <template #telefon="{ text }"><span class="col-telefon">{{ text }}</span></template>
            <template #tarikhPendaftaran="{ text }"><span class="col-tarikh">{{ formatDMY(text) }}</span></template>
            <template #status="{ text }">
              <div class="flex justify-center">
                <rs-badge :variant="statusVariant(text)">{{ text }}</rs-badge>
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
import { ref } from 'vue'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

definePageMeta({ title: 'Laporan Pendaftaran Agensi mengikut Jenis Organisasi' })

/* Breadcrumb */
const breadcrumb = [
  { name: 'Pelaporan', type: 'link', path: '/BF-PRF/AS/pelaporan/organisasi' },
  { name: 'Organisasi', type: 'link', path: '/BF-PRF/AS/pelaporan/organisasi/pendaftaran-agensi' },
]

/* Tarikh/Masa header */
const nowDt = new Date()
const today = `${String(nowDt.getDate()).padStart(2,'0')}/${String(nowDt.getMonth()+1).padStart(2,'0')}/${nowDt.getFullYear()}`
const now   = `${String(nowDt.getHours()).padStart(2,'0')}:${String(nowDt.getMinutes()).padStart(2,'0')}:${String(nowDt.getSeconds()).padStart(2,'0')}`

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

/* Helpers */
const statusVariant = (txt) => {
  const s = String(txt || '').trim().toLowerCase()
  if (s === 'aktif') return 'success'
  if (s === 'tidak aktif') return 'danger'
  return 'default'
}
const formatDMY = (iso) => {
  if (!iso) return '-'
  const d  = new Date(iso)
  const dd = String(d.getDate()).padStart(2,'0')
  const mm = String(d.getMonth()+1).padStart(2,'0')
  const yy = d.getFullYear()
  return `${dd}/${mm}/${yy}`
}

/* Export Excel (CSV) */
function exportExcel () {
  if (!rows.value.length) return
  const header = ['No','ID Organisasi','Nama Organisasi','Jenis Organisasi','Daerah','Alamat','Telefon','Tarikh Pendaftaran','Status','Pegawai Bertanggungjawab']
  const data = rows.value.map((r, i) => [
    i + 1, r.idOrganisasi, r.namaOrganisasi, r.jenisOrganisasi, r.daerah,
    r.alamat, r.telefon, formatDMY(r.tarikhPendaftaran), r.status, r.pegawai
  ])
  const csv = [header, ...data]
    .map(a => a.map(x => `"${String(x).replace(/"/g,'""')}"`).join(','))
    .join('\r\n')
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = `RO0001_Laporan_Pendaftaran_Agensi_${today}.csv`; a.click()
  URL.revokeObjectURL(url)
}

/* Export PDF */
function exportPDF () {
  if (!rows.value.length) return
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

  // Tajuk + Tarikh/Masa
  doc.setFontSize(14); doc.setFont('helvetica','bold')
  doc.text('RO0001: Laporan Pendaftaran Agensi Mengikut Jenis Organisasi', doc.internal.pageSize.getWidth()/2, 12, { align: 'center' })
  doc.setFontSize(10); doc.setFont('helvetica','normal')
  doc.text(`Tarikh: ${today}`, doc.internal.pageSize.getWidth()-20, 8,  { align: 'right' })
  doc.text(`Masa: ${now}`,     doc.internal.pageSize.getWidth()-20, 13, { align: 'right' })

  const head = [[
    'No','ID Organisasi','Nama Organisasi','Jenis Organisasi','Daerah','Alamat','Telefon','Tarikh Pendaftaran','Status','Pegawai Bertanggungjawab'
  ]]
  const body = rows.value.map((r, i) => [
    i + 1, r.idOrganisasi, r.namaOrganisasi, r.jenisOrganisasi, r.daerah,
    r.alamat, r.telefon, formatDMY(r.tarikhPendaftaran), r.status, r.pegawai
  ])

  autoTable(doc, {
    head, body, startY: 20,
    styles: { fontSize: 9, cellPadding: 2, valign: 'middle' },
    headStyles: { fillColor: [240,240,240] },
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
    }
  })
  doc.save(`RO0001_Laporan_Pendaftaran_Agensi_${today}.pdf`)
}
</script>

<style scoped>
.table-wrapper { overflow-x: visible; }

/* Sel header & data konsisten */
:deep(table) th, :deep(table) td {
  white-space: normal;
  word-break: break-word;
  vertical-align: middle;
}

/* ====== KOLUM NO. — sebaris & cukup ruang ====== */
:deep(thead tr th:first-child),
:deep(tbody tr td:first-child) {
  width: 64px; min-width: 64px; max-width: 64px;
  text-align: center;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;          /* pastikan "No." tak wrap */
  letter-spacing: normal;       /* elak jadi "N o ." */
  line-height: 1.2;
}

/* ====== HEADER-ONLY STYLES (h-*) ====== */
:deep(.h-id),
:deep(.h-nama),
:deep(.h-jenis),
:deep(.h-daerah),
:deep(.h-alamat),
:deep(.h-telefon),
:deep(.h-tarikh),
:deep(.h-status) {
  white-space: nowrap;          /* semua header pendek kekal 1 baris */
  display: inline-block;
}

/* Header Pegawai = tepat 2 baris (pakai <br/>) */
:deep(.h-pegawai) {
  display: inline-block;
  white-space: normal;          /* benarkan pecah di <br> sahaja */
  word-break: keep-all;
  line-height: 1.15;
}

/* ====== CELL STYLES (col-*) — tak ganggu header ====== */
:deep(.col-id)      { white-space: nowrap; }
:deep(.col-nama)    { min-width: 220px; max-width: 260px; word-break: keep-all; }
:deep(.col-jenis)   { white-space: nowrap; min-width: 150px; }
:deep(.col-daerah)  { white-space: nowrap; min-width: 110px; }
:deep(.col-alamat)  { min-width: 220px; }            /* data alamat boleh balut */
:deep(.col-telefon) { white-space: nowrap; }
:deep(.col-tarikh)  { white-space: nowrap; }
:deep(.col-pegawai) { min-width: 220px; word-break: keep-all; }

/* Cantikkan border rs-table (pilihan) */
:deep(table.table-content) { border-color: rgb(var(--border-color)); }
</style>
