<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <!-- Header -->
      <template #header>
        <div class="flex flex-col gap-1">
          <div class="flex justify-between items-center">
            <h1 class="text-xl font-bold uppercase text-center flex-1">
              Laporan Bilangan Keseluruhan Asnaf / Bilangan Asnaf Aktif
            </h1>
            <div class="flex gap-2">
              <rs-button
                variant="primary-outline"
                size="sm"
                @click="downloadExcel"
                class="flex items-center"
              >
                <Icon name="mdi:microsoft-excel" class="mr-1" size="15" />
                Excel
              </rs-button>
              <rs-button
                variant="primary"
                size="sm"
                @click="downloadPDF"
                class="flex items-center"
              >
                <Icon name="mdi:file-pdf-box" class="mr-1" size="15" />
                PDF
              </rs-button>
            </div>
          </div>
          <p class="text-xs text-gray-500 text-center">
            Rekod dipaparkan: <span class="font-semibold">{{ filteredRows.length }}</span> daripada {{ rows.length }}
          </p>
        </div>
      </template>

      <!-- Body -->
      <template #body>
        <!-- Filters -->
        <div class="bg-white rounded-md shadow-sm border border-gray-100 mb-4 p-3">
          <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <!-- Daerah -->
            <FormKit type="select" label="Daerah" v-model="filters.daerah" :options="['', ...daerahOptions]" />
            <!-- Asnaf Kategori -->
            <FormKit type="select" label="Asnaf Kategori" v-model="filters.kategoriAsnaf" :options="['', ...kategoriAsnafOptions]" />
            <!-- Ketua Keluarga -->
            <!-- <FormKit type="select" label="Relationship (Ketua Keluarga)" v-model="filters.ketuaKeluarga" :options="['', 'Ketua Keluarga', 'Bukan Ketua']" /> -->
            <!-- Bulan -->
            <FormKit type="select" label="Bulan" v-model="filters.bulan" :options="['', ...bulanOptions]" />
            <!-- Jantina -->
            <!-- <FormKit type="select" label="Jantina" v-model="filters.jantina" :options="['', 'Lelaki', 'Perempuan']" /> -->
            <!-- Status Perkahwinan -->
            <!-- <FormKit type="select" label="Status Perkahwinan" v-model="filters.statusPerkahwinan" :options="['', ...statusPerkahwinanOptions]" /> -->

            <!-- Kariah -->
            <FormKit type="select" label="Kariah" v-model="filters.kariah" :options="['', ...kariahOptions]" />
            <!-- Kewarganegaraan -->
            <!-- <FormKit type="select" label="Kewarganegaraan" v-model="filters.kewarganegaraan" :options="['', 'Warganegara', 'Bukan Warganegara']" /> -->
            <!-- Bangsa -->
            <!-- <FormKit type="select" label="Bangsa" v-model="filters.bangsa" :options="['', ...bangsaOptions]" /> -->
            <!-- Bantuan Sokongan -->
            <!-- <FormKit type="select" label="Bantuan Sokongan" v-model="filters.bantuanSokongan" :options="['', ...bantuanSokonganOptions]" /> -->
            <!-- Bantuan Utama -->
            <FormKit type="select" label="Bantuan Utama" v-model="filters.bantuanUtama" :options="['', ...bantuanUtamaOptions]" />

            <!-- Nama -->
            <!-- <FormKit type="text"  label="Nama (carian mengandungi)" v-model="filters.nama" /> -->
            <!-- ID -->
            <!-- <FormKit type="text"  label="ID (carian mengandungi)" v-model="filters.id" /> -->

            <!-- Umur -->
            <!-- <FormKit type="number" label="Umur (min)" v-model="filters.umurMin" min="0" />
            <FormKit type="number" label="Umur (max)" v-model="filters.umurMax" min="0" /> -->
            <!-- Bil. Tanggungan -->
            <!-- <FormKit type="number" label="Bil. Tanggungan (min)" v-model="filters.bilTanggunganMin" min="0" />
            <FormKit type="number" label="Bil. Tanggungan (max)" v-model="filters.bilTanggunganMax" min="0" /> -->
          </div>

          <div class="flex items-center gap-2 mt-3">
            <rs-button variant="primary" size="sm" @click="applyFilters">Tapis</rs-button>
            <rs-button variant="primary-outline" size="sm" @click="resetFilters">
              <Icon name="ic:baseline-refresh" class="text-xs" />
              Reset
            </rs-button>
            <span class="text-xs text-gray-500">Rekod ditunjukkan: {{ filteredRows.length }}</span>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full border border-gray-300 bg-white text-sm" aria-label="Laporan Bilangan Keseluruhan Asnaf / Bilangan Asnaf Aktif">
            <thead class="sticky top-0 z-10 bg-gray-100">
              <tr>
                <th class="border px-3 py-2 text-left">No</th>
                <th class="border px-3 py-2 text-left">Nama</th>
                <th class="border px-3 py-2 text-left">ID</th>
                <th class="border px-3 py-2 text-left">Daerah</th>
                <th class="border px-3 py-2 text-left">Asnaf Kategori</th>
                <th class="border px-3 py-2 text-left">Relationship (Ketua Keluarga)</th>
                <th class="border px-3 py-2 text-left">Bulan</th>
                <th class="border px-3 py-2 text-left">Jantina</th>
                <th class="border px-3 py-2 text-right">Umur</th>
                <th class="border px-3 py-2 text-right">Bil. Tanggungan</th>
                <th class="border px-3 py-2 text-left">Status Perkahwinan</th>
                <th class="border px-3 py-2 text-left">Kariah</th>
                <th class="border px-3 py-2 text-left">Kewarganegaraan</th>
                <th class="border px-3 py-2 text-left">Bangsa</th>
                <th class="border px-3 py-2 text-left">Bantuan Sokongan</th>
                <th class="border px-3 py-2 text-left">Bantuan Utama</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(r, i) in filteredRows" :key="i" class="hover:bg-blue-50 transition">
                <td class="border px-3 py-2">{{ r.no ?? '' }}</td>
                <td class="border px-3 py-2">{{ r.nama }}</td>
                <td class="border px-3 py-2">{{ r.id }}</td>
                <td class="border px-3 py-2">{{ r.daerah }}</td>
                <td class="border px-3 py-2">{{ r.kategoriAsnaf }}</td>
                <td class="border px-3 py-2">{{ r.ketuaKeluarga }}</td>
                <td class="border px-3 py-2">{{ r.bulan }}</td>
                <td class="border px-3 py-2">{{ r.jantina }}</td>
                <td class="border px-3 py-2 text-right">{{ r.umur }}</td>
                <td class="border px-3 py-2 text-right">{{ r.bilTanggungan }}</td>
                <td class="border px-3 py-2">{{ r.statusPerkahwinan }}</td>
                <td class="border px-3 py-2">{{ r.kariah }}</td>
                <td class="border px-3 py-2">{{ r.kewarganegaraan }}</td>
                <td class="border px-3 py-2">{{ r.bangsa }}</td>
                <td class="border px-3 py-2">{{ r.bantuanSokongan }}</td>
                <td class="border px-3 py-2">{{ r.bantuanUtama }}</td>
              </tr>
              <tr v-if="filteredRows.length === 0">
                <td colspan="16" class="text-center text-gray-500 py-6">Tiada rekod ditemui.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { jsPDF } from 'jspdf'
import ExcelJS from 'exceljs'

definePageMeta({ title: 'Laporan Bilangan Keseluruhan Asnaf / Bilangan Asnaf Aktif' })

const breadcrumb = [
  { name: 'Pelaporan', type: 'link', path: '/reports' },
  { name: 'Jana Laporan', type: 'link', path: '/reports/R5' },
  { name: 'Bilangan Asnaf Aktif', type: 'current', path: '/reports/R5/Laporan-DOAA/Bilangan-Asnaf-Aktif' }
]

/** Options */
const daerahOptions = ['Gombak','Hulu Langat','Klang','Kuala Langat','Kuala Selangor','Petaling','Sabak Bernam','Sepang','Hulu Selangor','Shah Alam']
const kategoriAsnafOptions = ['Fakir','Miskin','Muallaf']
const bulanOptions = ['Januari','Februari','Mac','April','Mei','Jun','Julai','Ogos','September','Oktober','November','Disember']
const statusPerkahwinanOptions = ['Bujang','Berkahwin','Duda','Janda']
const kariahOptions = ['Masjid Al-Falah','Masjid Al-Amin','Masjid Al-Mukminin']
const bangsaOptions = ['Melayu','Cina','India','Lain-lain']
const bantuanSokonganOptions = ['Makanan','Sewa Rumah','Perubatan','Pendidikan','Dialisis','Bencana']
const bantuanUtamaOptions = ['Bantuan Sara Hidup','Bantuan Pendidikan','Bantuan Kesihatan']

/** Sample data (boleh ganti dengan data API) — termasuk medan `no` */
const rows = ref([
  { no:1, nama:'Ahmad Bin Ali', id:'A1001', daerah:'Klang', kategoriAsnaf:'Fakir', ketuaKeluarga:'Ketua Keluarga', bulan:'Januari', jantina:'Lelaki', umur:45, bilTanggungan:5, statusPerkahwinan:'Berkahwin', kariah:'Masjid Al-Falah', kewarganegaraan:'Malaysia', bangsa:'Melayu', bantuanSokongan:'Bantuan Makanan', bantuanUtama:'Bantuan Sara Hidup' },
  { no:2, nama:'Siti Binti Osman', id:'A1002', daerah:'Shah Alam', kategoriAsnaf:'Miskin', ketuaKeluarga:'Tanggungan', bulan:'Februari', jantina:'Perempuan', umur:32, bilTanggungan:2, statusPerkahwinan:'Bujang', kariah:'Masjid Al-Amin', kewarganegaraan:'Malaysia', bangsa:'Melayu', bantuanSokongan:'Bantuan Perubatan', bantuanUtama:'Bantuan Pendidikan' },
  { no:3, nama:'Rahman Binti Salleh', id:'A1003', daerah:'Gombak', kategoriAsnaf:'Muallaf', ketuaKeluarga:'Ketua Keluarga', bulan:'Mac', jantina:'Lelaki', umur:55, bilTanggungan:3, statusPerkahwinan:'Duda', kariah:'Masjid Al-Mukminin', kewarganegaraan:'Indonesia', bangsa:'Cina', bantuanSokongan:'Bantuan Sekolah', bantuanUtama:'Bantuan Sara Hidup' },
  { no:4, nama:'Nurul Binti Hasan', id:'A1004', daerah:'Petaling', kategoriAsnaf:'Fakir', ketuaKeluarga:'Ketua Keluarga', bulan:'April', jantina:'Perempuan', umur:29, bilTanggungan:1, statusPerkahwinan:'Berkahwin', kariah:'Masjid Al-Falah', kewarganegaraan:'Malaysia', bangsa:'Melayu', bantuanSokongan:'Bantuan Makanan', bantuanUtama:'Bantuan Kesihatan' },
  { no:5, nama:'Ismail Bin Rahim', id:'A1005', daerah:'Hulu Langat', kategoriAsnaf:'Miskin', ketuaKeluarga:'Tanggungan', bulan:'Januari', jantina:'Lelaki', umur:61, bilTanggungan:0, statusPerkahwinan:'Janda', kariah:'Masjid Al-Amin', kewarganegaraan:'Rohingya', bangsa:'India', bantuanSokongan:'Bantuan Perubatan', bantuanUtama:'Bantuan Sara Hidup' },
  { no:6, nama:'Mohd Farid Bin Ali', id:'A1006', daerah:'Klang', kategoriAsnaf:'Fakir', ketuaKeluarga:'Ketua Keluarga', bulan:'Februari', jantina:'Lelaki', umur:37, bilTanggungan:4, statusPerkahwinan:'Berkahwin', kariah:'Masjid Al-Falah', kewarganegaraan:'Malaysia', bangsa:'Lain-lain', bantuanSokongan:'Bantuan Sekolah', bantuanUtama:'Bantuan Pendidikan' },
  { no:7, nama:'Mariam Binti Yusuf', id:'A1007', daerah:'Shah Alam', kategoriAsnaf:'Muallaf', ketuaKeluarga:'Ketua Keluarga', bulan:'Mac', jantina:'Perempuan', umur:40, bilTanggungan:3, statusPerkahwinan:'Berkahwin', kariah:'Masjid Al-Mukminin', kewarganegaraan:'Indonesia', bangsa:'Melayu', bantuanSokongan:'Bantuan Makanan', bantuanUtama:'Bantuan Sara Hidup' },
  { no:8,  nama:'Hafiz bin Jamal', id:'A1008', daerah:'Gombak',     kategoriAsnaf:'Fakir',   ketuaKeluarga:'Tanggungan',    bulan:'April',    jantina:'Lelaki',   umur:22, bilTanggungan:0, statusPerkahwinan:'Bujang',     kariah:'Masjid Al-Amin',     kewarganegaraan:'Malaysia',  bangsa:'Melayu', bantuanSokongan:'Bantuan Sekolah',  bantuanUtama:'Bantuan Pendidikan' },
  { no:9,  nama:'Zainab binti Ahmad', id:'A1009', daerah:'Petaling',   kategoriAsnaf:'Miskin',  ketuaKeluarga:'Ketua Keluarga', bulan:'Januari',  jantina:'Perempuan', umur:47, bilTanggungan:6, statusPerkahwinan:'Berkahwin',  kariah:'Masjid Al-Falah',     kewarganegaraan:'Malaysia',  bangsa:'Melayu', bantuanSokongan:'Bantuan Makanan',  bantuanUtama:'Bantuan Kesihatan' },
  { no:10, nama:'Shahrul bin Amin', id:'A1010', daerah:'Hulu Langat',kategoriAsnaf:'Fakir',   ketuaKeluarga:'Ketua Keluarga', bulan:'Februari', jantina:'Lelaki',   umur:35, bilTanggungan:2, statusPerkahwinan:'Berkahwin',  kariah:'Masjid Al-Mukminin',  kewarganegaraan:'Malaysia',  bangsa:'Melayu', bantuanSokongan:'Bantuan Perubatan', bantuanUtama:'Bantuan Sara Hidup' },
  { no:11, nama:'Jamal bin Ibrahim', id:'A1011', daerah:'Klang',      kategoriAsnaf:'Miskin',  ketuaKeluarga:'Ketua Keluarga', bulan:'Mac',      jantina:'Lelaki',   umur:50, bilTanggungan:3, statusPerkahwinan:'Berkahwin',  kariah:'Masjid Al-Falah',     kewarganegaraan:'Malaysia',  bangsa:'Melayu', bantuanSokongan:'Bantuan Sekolah',  bantuanUtama:'Bantuan Pendidikan' },
  { no:12, nama:'Aminah binti Kadir', id:'A1012', daerah:'Shah Alam',  kategoriAsnaf:'Fakir',   ketuaKeluarga:'Tanggungan',    bulan:'April',    jantina:'Perempuan', umur:28, bilTanggungan:1, statusPerkahwinan:'Bujang',     kariah:'Masjid Al-Amin',     kewarganegaraan:'Malaysia',  bangsa:'Melayu', bantuanSokongan:'Bantuan Makanan',  bantuanUtama:'Bantuan Kesihatan' },
  { no:13, nama:'Yusuf bin Abdullah', id:'A1013', daerah:'Gombak',     kategoriAsnaf:'Muallaf', ketuaKeluarga:'Ketua Keluarga', bulan:'Januari',  jantina:'Lelaki',   umur:60, bilTanggungan:2, statusPerkahwinan:'Duda',       kariah:'Masjid Al-Mukminin',  kewarganegaraan:'Indonesia', bangsa:'Melayu', bantuanSokongan:'Bantuan Perubatan', bantuanUtama:'Bantuan Sara Hidup' },
  { no:14, nama:'Azman bin Salleh', id:'A1014', daerah:'Petaling',   kategoriAsnaf:'Fakir',   ketuaKeluarga:'Ketua Keluarga', bulan:'Februari', jantina:'Lelaki',   umur:33, bilTanggungan:3, statusPerkahwinan:'Berkahwin',  kariah:'Masjid Al-Falah',     kewarganegaraan:'Malaysia',  bangsa:'Melayu', bantuanSokongan:'Bantuan Sekolah',  bantuanUtama:'Bantuan Pendidikan' },
  { no:15, nama:'Fatimah bt. Omar', id:'A1015', daerah:'Hulu Langat',kategoriAsnaf:'Miskin',  ketuaKeluarga:'Ketua Keluarga', bulan:'Mac',      jantina:'Perempuan', umur:41, bilTanggungan:5, statusPerkahwinan:'Berkahwin',  kariah:'Masjid Al-Amin',     kewarganegaraan:'Malaysia',  bangsa:'Melayu', bantuanSokongan:'Bantuan Makanan',  bantuanUtama:'Bantuan Sara Hidup' }
])

/** Filters state */
const filters = ref({
  daerah:'', kategoriAsnaf:'', ketuaKeluarga:'', bulan:'', jantina:'',
  statusPerkahwinan:'', kariah:'', kewarganegaraan:'', bangsa:'',
  bantuanSokongan:'', bantuanUtama:'', nama:'', id:'',
  umurMin:'', umurMax:'', bilTanggunganMin:'', bilTanggunganMax:''
})

/** Filtered rows */
const filteredRows = computed(() => {
  const f = filters.value
  return rows.value.filter(r => {
    if (f.daerah && r.daerah !== f.daerah) return false
    if (f.kategoriAsnaf && r.kategoriAsnaf !== f.kategoriAsnaf) return false
    if (f.ketuaKeluarga && r.ketuaKeluarga !== f.ketuaKeluarga) return false
    if (f.bulan && r.bulan !== f.bulan) return false
    if (f.jantina && r.jantina !== f.jantina) return false
    if (f.statusPerkahwinan && r.statusPerkahwinan !== f.statusPerkahwinan) return false
    if (f.kariah && r.kariah !== f.kariah) return false
    if (f.kewarganegaraan && r.kewarganegaraan !== f.kewarganegaraan) return false
    if (f.bangsa && r.bangsa !== f.bangsa) return false
    if (f.bantuanSokongan && r.bantuanSokongan !== f.bantuanSokongan) return false
    if (f.bantuanUtama && r.bantuanUtama !== f.bantuanUtama) return false

    if (f.nama && !r.nama.toLowerCase().includes(f.nama.toLowerCase())) return false
    if (f.id && !r.id.toLowerCase().includes(f.id.toLowerCase())) return false

    const uMin = f.umurMin !== '' ? Number(f.umurMin) : null
    const uMax = f.umurMax !== '' ? Number(f.umurMax) : null
    if (uMin !== null && r.umur < uMin) return false
    if (uMax !== null && r.umur > uMax) return false

    const bMin = f.bilTanggunganMin !== '' ? Number(f.bilTanggunganMin) : null
    const bMax = f.bilTanggunganMax !== '' ? Number(f.bilTanggunganMax) : null
    if (bMin !== null && r.bilTanggungan < bMin) return false
    if (bMax !== null && r.bilTanggungan > bMax) return false

    return true
  })
})

function applyFilters() {
  /* no-op: computed already reacts — kept for UX parity */
}

function resetFilters() {
  Object.keys(filters.value).forEach(k => (filters.value[k] = ''))
}

/** ===== Export: PDF (kad per rekod, sertakan `No`) ===== */
function downloadPDF() {
  const doc = new jsPDF({ orientation:'landscape', unit:'mm', format:'a4' })
  doc.setFontSize(14); doc.setFont('helvetica','bold')
  doc.text('Laporan Bilangan Keseluruhan Asnaf / Bilangan Asnaf Aktif', 148.5, 14, { align:'center' })
  doc.setFontSize(9); doc.setFont('helvetica','normal')

  let x = 10, y = 22, line = 5, colGap = 95, maxY = 195
  filteredRows.value.forEach((r) => {
    const col1 = [
      `No: ${r.no ?? ''}`,
      `Daerah: ${r.daerah}`,
      `Asnaf Kategori: ${r.kategoriAsnaf}`,
      `Relationship: ${r.ketuaKeluarga}`,
      `Bulan: ${r.bulan}`,
      `Jantina: ${r.jantina}`,
      `Umur: ${r.umur}`,
      `Bil. Tanggungan: ${r.bilTanggungan}`,
    ]
    const col2 = [
      `Status Perkahwinan: ${r.statusPerkahwinan}`,
      `Kariah: ${r.kariah}`,
      `Nama: ${r.nama}`,
      `ID: ${r.id}`,
      `Kewarganegaraan: ${r.kewarganegaraan}`,
      `Bangsa: ${r.bangsa}`,
      `Bantuan Sokongan: ${r.bantuanSokongan}`,
      `Bantuan Utama: ${r.bantuanUtama}`,
    ]

    // Kolum kiri
    col1.forEach(t => { doc.text(String(t), x, y); y += line })
    // Kolum kanan (selaraskan semula y permulaan)
    y -= line * col1.length
    col2.forEach((t, i) => { doc.text(String(t), x + colGap, y + line * i) })
    y += Math.max(col1.length, col2.length) * line + 3

    if (y > maxY) { doc.addPage(); y = 14 }
  })

  doc.save('Laporan_Bilangan_Asnaf_Aktif.pdf')
}

/** ===== Export: Excel (16 kolum termasuk `No`) ===== */
async function downloadExcel() {
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet('Bilangan Asnaf Aktif')

  ws.addRow([
    'No','Daerah','Asnaf Kategori','Relationship (Ketua Keluarga)','Bulan','Jantina',
    'Umur','Bil. Tanggungan','Status Perkahwinan','Kariah','Nama','ID',
    'Kewarganegaraan','Bangsa','Bantuan Sokongan','Bantuan Utama'
  ])
  const header = ws.getRow(1)
  header.font = { bold: true }
  header.fill = { type:'pattern', pattern:'solid', fgColor:{ argb:'FFE0E0E0' } }

  filteredRows.value.forEach(r => {
    ws.addRow([
      r.no ?? '', r.daerah, r.kategoriAsnaf, r.ketuaKeluarga, r.bulan, r.jantina, r.umur,
      r.bilTanggungan, r.statusPerkahwinan, r.kariah, r.nama, r.id,
      r.kewarganegaraan, r.bangsa, r.bantuanSokongan, r.bantuanUtama
    ])
  })

  const widths = [6,14,16,24,8,10,8,14,18,12,18,18,18,12,18,18]
  ws.columns = widths.map(w => ({ width: w }))

  const buf = await wb.xlsx.writeBuffer()
  const blob = new Blob([buf], { type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = 'Laporan_Bilangan_Asnaf_Aktif.xlsx'; a.click()
  URL.revokeObjectURL(url)
}
</script>
