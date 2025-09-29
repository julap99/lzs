<template>
  <div>
    <layouts-breadcrumb :items="breadcrumb" />
    
    <!-- Report Header Section -->
    <rs-card class="mb-6">
      <template #body>

        <!-- Butang: Lihat Borang -> buka modal -->
        <div class="flex justify-end gap-2">
          <rs-button variant="primary" @click="showSurat = true">
            <Icon name="ic:baseline-visibility" class="w-4 h-4 mr-2" />
            Lihat Borang
          </rs-button>
        </div>

        <div class="space-y-4 mt-4">
          <!-- Logo LZS -->
          <div class="flex justify-start">
            <img src="https://www.zakatselangor.com.my/wp-content/uploads/2018/10/lzs-logo.png" alt="LZS Logo" class="h-16" />
          </div>

          <!-- Report Details -->
          <div class="space-y-2">
            <p class="text-sm font-bold"> RP0002</p>
            <p class="text-lg font-semibold"> Surat Pengesahan Permastautin</p>
            <p class="text-md font-medium text-center">
              BORANG PENGESAHAN PEMASTAUTIN OLEH PENGHULU, KETUA KAMPUNG, PENGERUSI JKKK, NAZIR MASJID, PENGERUSI JAWATANKUASA PENDUDUK/TAMAN PERUMAHAN DALAM NEGERI SELANGOR DARUL EHSAN
            </p>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Bahagian A: Butiran Pemohon/Ibu/Bapa/Penjaga (Form Fields) -->
    <rs-card class="mb-6">
      <template #body>
        <div class="space-y-4">
          <h3 class="text-lg font-semibold">BAHAGIAN A: BUTIRAN PEMOHON/IBU/BAPA/PENJAGA</h3>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Pemohon/Ibu/Bapa/Penjaga:</label>
            <input v-model="formData.namaPemohon" type="text" class="form-input w-full p-2 border rounded" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">No Kad Pengenalan:</label>
            <input v-model="formData.noKP" type="text" class="form-input w-full p-2 border rounded" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Jantina:</label>
            <input v-model="formData.jantina" type="text" class="form-input w-full p-2 border rounded" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tempat Kelahiran:</label>
            <input v-model="formData.tempatKelahiran" type="text" class="form-input w-full p-2 border rounded" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Alamat Dalam Kad Pengenalan:</label>
            <input v-model="formData.alamatKadPengenalan" type="text" class="form-input w-full p-2 border rounded" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Alamat Tempat Tinggal Sekarang:</label>
            <input v-model="formData.alamatSekarang" type="text" class="form-input w-full p-2 border rounded" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">No Telefon (HP):</label>
            <input v-model="formData.telefon" type="text" class="form-input w-full p-2 border rounded" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">No Telefon (R):</label>
            <input v-model="formData.telefonRumah" type="text" class="form-input w-full p-2 border rounded" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tempoh Masa Telah Menetap (Tahun/Bulan/Hari):</label>
            <input v-model="formData.tempohMasaMenetap" type="text" class="form-input w-full p-2 border rounded" />
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Bahagian B: Perakuan Pengesahan Permastautin (Form Fields) -->
    <rs-card class="mb-6">
      <template #body>
        <div class="space-y-4">
          <h3 class="text-lg font-semibold">BAHAGIAN B: PERAKUAN PENGESAHAN PEMASTAUTIN</h3>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Pegawai Yang Mengesahkan:</label>
            <input v-model="formData.namaPegawai" type="text" class="form-input w-full p-2 border rounded" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">No Kad Pengenalan:</label>
            <input v-model="formData.noKPPegawai" type="text" class="form-input w-full p-2 border rounded" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Jawatan:</label>
            <input v-model="formData.jawatan" type="text" class="form-input w-full p-2 border rounded" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh:</label>
            <input v-model="formData.tarikh" type="date" class="form-input w-full p-2 border rounded" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tandatangan, Cop Rasmi, Nama & Alamat Pegawai Yang Mengesahkan:</label>
            <textarea v-model="formData.tandatangan" class="form-input w-full p-2 border rounded h-32" placeholder="Masukkan tandatangan, cop rasmi, nama dan alamat pegawai yang mengesahkan"></textarea>
          </div>

        </div>
      </template>
    </rs-card>

    <!-- MODAL: Preview Surat -->
    <rs-modal v-model="showSurat" size="xl">
      <template #header>
        <div class="flex items-center gap-3">
          <img
            src="https://www.zakatselangor.com.my/wp-content/uploads/2018/10/lzs-logo.png"
            alt="LZS Logo"
            class="h-8"
          />
          <div class="flex-1">
            <div class="text-xs text-gray-600">RP0002</div>
            <div class="text-base font-semibold">Surat Pengesahan Permastautin</div>
          </div>
        </div>
      </template>

      <template #body>
        <!-- HEADER TAJUK BESAR -->
        <p class="text-center text-[12px] font-semibold leading-5 mb-3">
          BORANG PENGESAHAN PEMASTAUTIN OLEH PENGHULU, KETUA KAMPUNG, PENGERUSI JKKK, NAZIR MASJID,
          PENGERUSI JAWATANKUASA PENDUDUK/TAMAN PERUMAHAN DALAM NEGERI SELANGOR DARUL EHSAN
        </p>

        <!-- Grid pratayang surat ikut contoh gambar -->
        <div class="preview-grid">
          <!-- Tajuk seksyen A -->
          <div class="section-title" style="grid-column: 1 / -1;">
            BAHAGIAN A : BUTIRAN PEMOHON/IBU/BAPA/PENJAGA
          </div>

          <!-- Baris-baris Bahagian A -->
          <div class="label">Nama Pemohon/ Ibu/Bapa/Penjaga</div>
          <div class="value">{{ formData.namaPemohon }}</div>

          <div class="label">No Kad Pengenalan</div>
          <div class="value">{{ formData.noKP }}</div>

          <div class="label">Jantina</div>
          <div class="value">{{ formData.jantina }}</div>

          <div class="label">Tempat Kelahiran</div>
          <div class="value">{{ formData.tempatKelahiran }}</div>

          <div class="label">Alamat Dalam Kad Pengenalan</div>
          <div class="value multiline">{{ formData.alamatKadPengenalan }}</div>

          <div class="label">Alamat Tempat Tinggal Sekarang</div>
          <div class="value multiline">{{ formData.alamatSekarang }}</div>

          <!-- Telefon HP -->
          <div class="label">No Telefon (HP)</div>
          <div class="value">{{ formData.telefon }}</div>

          <!-- Telefon Rumah -->
          <div class="label">No Telefon (R)</div>
          <div class="value">{{ formData.telefonRumah }}</div>

          <div class="label">
            Tempoh Masa Telah Menetap
            <div class="text-[10px] text-gray-500">(T) (B) (H)</div>
          </div>
          <div class="value">{{ formData.tempohMasaMenetap }}</div>

          <!-- Tajuk seksyen B -->
          <div class="section-title" style="grid-column: 1 / -1;">
            BAHAGIAN B : PERAKUAN PENGESAHAN PEMASTAUTIN
          </div>

          <!-- Baris-baris Bahagian B -->
          <div class="label">Nama Pegawai Yang Mengesahkan</div>
          <div class="value">{{ formData.namaPegawai }}</div>

          <div class="label">No Kad Pengenalan</div>
          <div class="value">{{ formData.noKPPegawai }}</div>

          <div class="label">Jawatan</div>
          <div class="value">{{ formData.jawatan }}</div>

          <div class="label">Tarikh</div>
          <div class="value">{{ formData.tarikh }}</div>

          <div class="label">Tandatangan, Cop Rasmi, Nama &amp; Alamat Pegawai Yang Mengesahkan</div>
          <div class="value multiline min-h-[100px]">
            {{ formData.tandatangan }}
          </div>
        </div>
      </template>

      <template #footer>
        <div class="w-full flex justify-between">
          <rs-button variant="secondary" @click="showSurat = false">Tutup</rs-button>
          <!-- Ikut style contoh: guna exportPDF() dengan jsPDF + autoTable -->
          <rs-button variant="primary" @click.stop.prevent="exportPDF()">
            <Icon name="ic:baseline-download" class="w-4 h-4 mr-2" />
            Muat Turun (PDF)
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

definePageMeta({ title: 'Surat Pengesahan Permastautin' })

const breadcrumb = [
  { name: 'Pelaporan', type: 'link', path: '/BF-PRF/AS/pelaporan' },
  { name: 'Surat Pengesahan Permastautin', type: 'link', path: '/BF-PRF/AS/pelaporan/asnaf/pengesahan-permastautin' },
]

// Form Data
const formData = ref({
  namaPemohon: '',
  noKP: '',
  jantina: '',
  tempatKelahiran: '',
  alamatKadPengenalan: '',
  alamatSekarang: '',
  telefon: '',
  telefonRumah: '',
  tempohMasaMenetap: '',
  namaPegawai: '',
  noKPPegawai: '',
  jawatan: '',
  tarikh: '',
  tandatangan: ''
})

const showSurat = ref(false)

/* ===========================================================
 * EXPORT PDF — tiru cara contoh (jsPDF + jspdf-autotable)
 * =========================================================== */
function exportPDF () {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  // Tajuk / Header (ringkas, tanpa logo luaran untuk elak CORS)
  const pageWidth = doc.internal.pageSize.getWidth()
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text('Surat Pengesahan Permastautin', pageWidth / 2, 12, { align: 'center' })
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  const tajuk =
    'BORANG PENGESAHAN PEMASTAUTIN OLEH PENGHULU, KETUA KAMPUNG, PENGERUSI JKKK, NAZIR MASJID, PENGERUSI JAWATANKUASA PENDUDUK/TAMAN PERUMAHAN DALAM NEGERI SELANGOR DARUL EHSAN'
  const lines = doc.splitTextToSize(tajuk, pageWidth - 20)
  doc.text(lines, pageWidth / 2, 18, { align: 'center' })
  doc.setFont('helvetica', 'bold')
  doc.text('RP0002', pageWidth - 10, 10, { align: 'right' })

  // Susun jadual dua kolum (Label | Nilai) dengan pemisah seksyen
  const rows = [
    [{ content: 'BAHAGIAN A : BUTIRAN PEMOHON/IBU/BAPA/PENJAGA', colSpan: 2, styles: { fillColor: [243,244,246], fontStyle: 'bold' } }],
    ['Nama Pemohon/ Ibu/Bapa/Penjaga', formData.value.namaPemohon || ''],
    ['No Kad Pengenalan', formData.value.noKP || ''],
    ['Jantina', formData.value.jantina || ''],
    ['Tempat Kelahiran', formData.value.tempatKelahiran || ''],
    ['Alamat Dalam Kad Pengenalan', formData.value.alamatKadPengenalan || ''],
    ['Alamat Tempat Tinggal Sekarang', formData.value.alamatSekarang || ''],
    ['No Telefon (HP)', formData.value.telefon || ''],
    ['No Telefon (R)', formData.value.telefonRumah || ''],
    ['Tempoh Masa Telah Menetap (Tahun/Bulan/Hari)', formData.value.tempohMasaMenetap || ''],

    [{ content: 'BAHAGIAN B : PERAKUAN PENGESAHAN PEMASTAUTIN', colSpan: 2, styles: { fillColor: [243,244,246], fontStyle: 'bold' } }],
    ['Nama Pegawai Yang Mengesahkan', formData.value.namaPegawai || ''],
    ['No Kad Pengenalan', formData.value.noKPPegawai || ''],
    ['Jawatan', formData.value.jawatan || ''],
    ['Tarikh', formData.value.tarikh || ''],
    ['Tandatangan, Cop Rasmi, Nama & Alamat Pegawai Yang Mengesahkan', formData.value.tandatangan || ''],
  ]

  autoTable(doc, {
    startY: 28,
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 3, valign: 'top' },
    head: [],
    body: rows,
    columnStyles: {
      0: { cellWidth: 70, fontStyle: 'bold' },
      1: { cellWidth: 'auto' },
    },
    margin: { top: 16, left: 10, right: 10, bottom: 12 },
    didDrawPage: (data) => {
      // Footer masa jana
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text(`Dijana oleh NAS pada ${new Date().toLocaleString()}`, 10, doc.internal.pageSize.getHeight() - 6)
    },
  })

  doc.save('RP0002_Surat_Pengesahan_Permastautin.pdf')
}

/* ===========================================================
 * Fungsi asal Siti (saya biarkan, tidak digunakan oleh butang)
 * =========================================================== */
const downloadPDF = () => {
  const doc = new jsPDF()
  const logo = 'https://www.zakatselangor.com.my/wp-content/uploads/2018/10/lzs-logo.png'
  doc.addImage(logo, 'PNG', 10, 10, 50, 20)
  doc.setFontSize(16)
  doc.text('Surat Pengesahan Permastautin', 10, 40)
  doc.setFontSize(12)
  doc.text(`Nama Pemohon: ${formData.value.namaPemohon}`, 10, 50)
  doc.text(`No Kad Pengenalan: ${formData.value.noKP}`, 10, 60)
  doc.text(`Alamat Tempat Tinggal Sekarang: ${formData.value.alamatSekarang}`, 10, 70)
  doc.text(`No Telefon (HP): ${formData.value.telefon}`, 10, 80)
  doc.text(`Tempoh Masa Telah Menetap: ${formData.value.tempohMasaMenetap}`, 10, 90)
  doc.save('surat-pengesahan-permastautin.pdf')
}
</script>

<style scoped>
.form-input { outline: none; }

/* Gaya jadual surat mengikut contoh gambar */
.preview-grid {
  display: grid;
  grid-template-columns: 260px 1fr; /* kiri label, kanan nilai */
  gap: 0;
  border: 1px solid #d1d5db; /* gray-300 */
  font-size: 12px;
}

.preview-grid > div {
  border-bottom: 1px solid #e5e7eb; /* gray-200 */
  padding: 8px 10px;
}

.preview-grid > div:nth-child(odd) { /* label cells */
  border-right: 1px solid #e5e7eb;
}

.preview-grid .label {
  font-weight: 600;
  background: #f9fafb; /* gray-50 */
}

.preview-grid .value {
  background: #fff;
  white-space: pre-line;
}

.preview-grid .multiline {
  min-height: 64px; /* utk kotak alamat & catatan */
}

.preview-grid .section-title {
  background: #f3f4f6; /* gray-100 */
  font-weight: 700;
}
</style>
