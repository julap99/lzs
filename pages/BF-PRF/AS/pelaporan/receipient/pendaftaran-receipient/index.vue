<template>
  <div>
    <layouts-breadcrumb :items="breadcrumb" />

    <!-- HEADER -->
    <rs-card class="mt-4">
      <template #body>
        <div class="flex items-start justify-between gap-6">
          <div class="flex items-start gap-4">
            <img
              src="https://www.zakatselangor.com.my/wp-content/uploads/2018/10/lzs-logo.png"
              alt="LZS"
              class="h-14 w-auto"
            />
            <div class="leading-tight">
              <div class="font-semibold tracking-wide text-[rgb(var(--text-color))]">
                RR0001
              </div>
              <h2 class="text-xl font-bold text-[rgb(var(--text-color))]">
                Laporan Pendaftaran Receipient Mengikut Jenis Receipient
              </h2>
            </div>
          </div>

          <div class="text-sm text-right">
            <div><span class="font-semibold">Tarikh:</span> {{ today }}</div>
            <div><span class="font-semibold">Masa:</span> {{ now }}</div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- TABLE + EXPORT -->
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
            :field="['id','nama','jenis','tarikhDaftar']"
            :advanced="true"
            :showSearch="false"
            :showFilter="false"
            :showNoColumn="true"
            :pageSize="10"
            :sort="{ column: 'id', direction: 'asc' }"
            :options="{
              variant:'default', striped:false, bordered:true,
              borderless:false, hover:true, fixed:false
            }"
            :optionsAdvanced="{
              sortable:true, filterable:false, responsive:true, outsideBorder:true
            }"
          >
            <!-- Header (stabil & kemas) -->
            <template #header-id><span class="h-id">ID</span></template>
            <template #header-nama><span class="h-nama">Nama&nbsp;Receipient</span></template>
            <template #header-jenis><span class="h-jenis">Jenis</span></template>
            <template #header-tarikhDaftar><span class="h-tarikh">Tarikh&nbsp;Pendaftaran</span></template>

            <!-- Sel data -->
            <template #id="{ text }"><span class="col-id">{{ text }}</span></template>
            <template #nama="{ text }"><span class="col-nama">{{ text }}</span></template>
            <template #jenis="{ text }"><span class="col-jenis">{{ text }}</span></template>
            <template #tarikhDaftar="{ text }"><span class="col-tarikh">{{ formatDMY(text) }}</span></template>
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

definePageMeta({ title: 'Laporan Pendaftaran Receipient Mengikut Jenis Receipient' })

/* Breadcrumb */
const breadcrumb = [
  { name: 'Pelaporan', type: 'link', path: '/BF-PRF/AS/pelaporan/receipient' },
  { name: 'Pendaftaran Receipient', type: 'link', path: '/BF-PRF/AS/pelaporan/receipient/pendaftaran-receipient' },
]

/* Tarikh/Masa header */
const nowDt = new Date()
const today = `${String(nowDt.getDate()).padStart(2,'0')}/${String(nowDt.getMonth()+1).padStart(2,'0')}/${nowDt.getFullYear()}`
const now   = `${String(nowDt.getHours()).padStart(2,'0')}:${String(nowDt.getMinutes()).padStart(2,'0')}:${String(nowDt.getSeconds()).padStart(2,'0')}`

/* Kolum label */
const columns = [
  { key: 'id',           label: 'ID' },
  { key: 'nama',         label: 'Nama Receipient' },
  { key: 'jenis',        label: 'Jenis' },
  { key: 'tarikhDaftar', label: 'Tarikh Pendaftaran' },
]

/* Data contoh (17 rekod) */
const rows = ref([
  { id: 'RCP001', nama: 'Ahmad bin Ali',                jenis: 'Individu', tarikhDaftar: '2023-03-15' },
  { id: 'RCP002', nama: 'Siti Aisyah binti Rahman',     jenis: 'Individu', tarikhDaftar: '2023-05-02' },
  { id: 'RCP003', nama: 'Mohd Farid bin Ismail',        jenis: 'Individu', tarikhDaftar: '2024-01-11' },
  { id: 'RCP004', nama: 'Nurul Huda binti Hassan',      jenis: 'Individu', tarikhDaftar: '2024-02-22' },
  { id: 'RCP005', nama: 'Azman bin Karim',              jenis: 'Individu', tarikhDaftar: '2023-12-05' },
  { id: 'RCP006', nama: 'Zainab binti Omar',            jenis: 'Individu', tarikhDaftar: '2024-04-10' },
  { id: 'RCP007', nama: 'Hafiz bin Abdullah',           jenis: 'Individu', tarikhDaftar: '2023-06-19' },
  { id: 'RCP008', nama: 'Khairul Anuar bin Zulkifli',   jenis: 'Individu', tarikhDaftar: '2024-05-28' },
  { id: 'RCP009', nama: 'Farhana binti Mohamad',        jenis: 'Individu', tarikhDaftar: '2023-07-12' },
  { id: 'RCP010', nama: 'Saiful Nizam bin Rahim',       jenis: 'Individu', tarikhDaftar: '2023-11-09' },

  // Tambahan 7 rekod (Syarikat)
  { id: 'RCP011', nama: 'Syarikat Maju Jaya Sdn Bhd',               jenis: 'Syarikat', tarikhDaftar: '2023-11-14' },
  { id: 'RCP012', nama: 'Koperasi Sejahtera Selangor Berhad',       jenis: 'Syarikat', tarikhDaftar: '2024-03-28' },
  { id: 'RCP013', nama: 'Syarikat Cahaya Gemilang Sdn Bhd',         jenis: 'Syarikat', tarikhDaftar: '2023-04-19' },
  { id: 'RCP014', nama: 'Syarikat Dinamik Niaga Sdn Bhd',           jenis: 'Syarikat', tarikhDaftar: '2024-08-07' },
  { id: 'RCP015', nama: 'Alam Hijau Resources',                     jenis: 'Syarikat', tarikhDaftar: '2024-09-16' },
  { id: 'RCP016', nama: 'Global Perkasa Trading Sdn Bhd',           jenis: 'Syarikat', tarikhDaftar: '2023-10-25' },
  { id: 'RCP017', nama: 'Syarikat Seri Makmur Sdn Bhd',             jenis: 'Syarikat', tarikhDaftar: '2024-05-12' },
])

/* Helpers */
function formatDMY (iso) {
  if (!iso) return '-'
  const d = new Date(iso)
  const dd = String(d.getDate()).padStart(2,'0')
  const mm = String(d.getMonth()+1).padStart(2,'0')
  const yy = d.getFullYear()
  return `${dd}/${mm}/${yy}`
}

/* Export Excel (CSV) */
function exportExcel () {
  if (!rows.value.length) return
  const header = ['No','ID','Nama Receipient','Jenis','Tarikh Pendaftaran']
  const data = rows.value.map((r, i) => [ i+1, r.id, r.nama, r.jenis, formatDMY(r.tarikhDaftar) ])
  const csv = [header, ...data].map(a => a.map(x => `"${String(x).replace(/"/g,'""')}"`).join(',')).join('\r\n')
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = `RR0001_Pendaftaran_Receipient_${today}.csv`; a.click()
  URL.revokeObjectURL(url)
}

/* Export PDF */
function exportPDF () {
  if (!rows.value.length) return
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  doc.setFontSize(14); doc.setFont('helvetica','bold')
  doc.text('RR0001: Laporan Pendaftaran Receipient Mengikut Jenis Receipient', doc.internal.pageSize.getWidth()/2, 12, { align: 'center' })
  doc.setFontSize(10); doc.setFont('helvetica','normal')
  doc.text(`Tarikh: ${today}`, doc.internal.pageSize.getWidth()-20, 8, { align: 'right' })
  doc.text(`Masa: ${now}`,     doc.internal.pageSize.getWidth()-20, 13, { align: 'right' })

  const head = [['No','ID','Nama Receipient','Jenis','Tarikh Pendaftaran']]
  const body = rows.value.map((r, i) => [ i+1, r.id, r.nama, r.jenis, formatDMY(r.tarikhDaftar) ])

  autoTable(doc, {
    head, body, startY: 20,
    styles: { fontSize: 9, cellPadding: 2, valign: 'middle' },
    headStyles: { fillColor: [240,240,240] },
    margin: { top: 16, left: 10, right: 10, bottom: 12 },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 }, // No.
      1: { cellWidth: 25 },                   // ID
      2: { cellWidth: 90 },                   // Nama
      3: { cellWidth: 30 },                   // Jenis
      4: { cellWidth: 40 },                   // Tarikh
    }
  })

  doc.save(`RR0001_Pendaftaran_Receipient_${today}.pdf`)
}
</script>

<style scoped>
.table-wrapper { overflow-x: visible; }

/* Konsisten */
:deep(table) th, :deep(table) td {
  white-space: normal;
  word-break: break-word;
  vertical-align: middle;
}

/* Kolum No. (first bila showNoColumn=true) – sebaris */
:deep(thead tr th:first-child),
:deep(tbody tr td:first-child) {
  width: 64px; min-width: 64px; max-width: 64px;
  text-align: center;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

/* Header pendek kekal 1 baris */
:deep(.h-id), :deep(.h-jenis), :deep(.h-tarikh), :deep(.h-nama) {
  white-space: nowrap; display: inline-block;
}

/* Sel data */
:deep(.col-id)      { white-space: nowrap; }
:deep(.col-nama)    { min-width: 240px; max-width: 360px; word-break: keep-all; }
:deep(.col-jenis)   { white-space: nowrap; min-width: 110px; }
:deep(.col-tarikh)  { white-space: nowrap; }
</style>
