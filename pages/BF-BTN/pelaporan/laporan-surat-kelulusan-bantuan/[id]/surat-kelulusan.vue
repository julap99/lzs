<template>
  <div class="mx-auto max-w-4xl bg-white rounded-2xl border border-gray-200 shadow-sm p-8 print:p-0 print:shadow-none print:border-0">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <img class="h-12 block" src="https://www.zakatselangor.com.my/wp-content/uploads/2018/10/lzs-logo.png" alt="LZS Logo"/>
      <div class="text-right">
        <h1 class="text-xl font-semibold">Surat Kelulusan Bantuan</h1>
      </div>
    </div>

    <!-- Meta: No Rujukan and Tarikh -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <p><strong>No Rujukan :</strong> {{ surat.noRujukan }}</p>
      <p><strong>Tarikh :</strong> {{ surat.tarikh }}</p>
    </div>

    <!-- Penerima Section -->
    <div class="mt-6">
      <h2 class="text-lg font-semibold">Penerima</h2>
      <div class="mt-2 space-y-1">
        <p><strong>Nama Asnaf :</strong> {{ surat.penerimaNama }}</p>
        <p><strong>Alamat Asnaf :</strong> {{ surat.penerimaAlamat }}</p>
      </div>
    </div>

    <!-- Body (Tajuk Surat) -->
    <div class="mt-8">
      <p class="text-lg font-semibold">Maklum Balas Permohonan Bantuan Zakat di Lembaga Zakat Selangor (MAIS)</p>
      <div class="mt-4 leading-relaxed whitespace-pre-line">
        Semoga surat ini menemui tuan / puan di dalam kemanisan iman serta memperoleh keberkatan dan kerahmatan daripada Allah S.W.T., In Shaa Allah.
        Sukacita dimaklumkan bahawa Lembaga Zakat Selangor (MAIS) telah MELULUSKAN permohonan bantuan zakat seperti berikut :
      </div>
    </div>

    <!-- Maklumat Bantuan Table -->
    <div class="mt-6">
      <table class="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th class="border border-gray-400 p-2 text-left font-semibold bg-gray-100">Bil</th>
            <th class="border border-gray-400 p-2 text-left font-semibold bg-gray-100">Perkara</th>
            <th class="border border-gray-400 p-2 text-left font-semibold bg-gray-100">Butir-butir</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-gray-400 p-2">1.</td>
            <td class="border border-gray-400 p-2">No Bantuan / No KP</td>
            <td class="border border-gray-400 p-2">{{ surat.noRujukan }}</td>
          </tr>
          <tr>
            <td class="border border-gray-400 p-2">2.</td>
            <td class="border border-gray-400 p-2">Permohonan Bantuan</td>
            <td class="border border-gray-400 p-2">{{ surat.permohonanBantuan }}</td>
          </tr>
          <tr>
            <td class="border border-gray-400 p-2">3.</td>
            <td class="border border-gray-400 p-2">Nama Penerima</td>
            <td class="border border-gray-400 p-2">{{ surat.penerimaNama }}</td>
          </tr>

          <!-- Conditionally Show Nama Penerima Bayaran -->
          <tr v-if="showPenerimaBayaran">
            <td class="border border-gray-400 p-2">4.</td>
            <td class="border border-gray-400 p-2">Nama Penerima Bayaran</td>
            <td class="border border-gray-400 p-2">{{ surat.penerimaBayaran }}</td>
          </tr>

          <!-- Conditionally Show Kadar Bantuan for One-Off -->
          <tr v-if="isOneOff">
            <td class="border border-gray-400 p-2">5.</td>
            <td class="border border-gray-400 p-2">Kadar Bantuan</td>
            <td class="border border-gray-400 p-2">{{ surat.kadarBantuan }}</td>
          </tr>

          <!-- Conditionally Show Kadar Bantuan Sebulan for Recurring -->
          <tr v-if="isBerkala">
            <td class="border border-gray-400 p-2">6.</td>
            <td class="border border-gray-400 p-2">Kadar Bantuan Sebulan</td>
            <td class="border border-gray-400 p-2">{{ surat.kadarBantuanSebulan }}</td>
          </tr>

          <!-- Jumlah Bantuan -->
          <tr>
            <td class="border border-gray-400 p-2">7.</td>
            <td class="border border-gray-400 p-2">Jumlah Bantuan Keseluruhan</td>
            <td class="border border-gray-400 p-2">{{ jumlahKeseluruhanDisplay }}</td>
          </tr>

          <!-- Conditionally Show Tempoh Bantuan for Recurring -->
          <tr v-if="isBerkala">
            <td class="border border-gray-400 p-2">8.</td>
            <td class="border border-gray-400 p-2">Tempoh Bantuan</td>
            <td class="border border-gray-400 p-2">{{ surat.tempohBantuan }}</td>
          </tr>

          <!-- Kaedah Penyaluran Bantuan -->
          <tr>
            <td class="border border-gray-400 p-2">9.</td>
            <td class="border border-gray-400 p-2">Kaedah Penyaluran Bantuan</td>
            <td class="border border-gray-400 p-2">{{ surat.kaedahPenyaluran }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer -->
    <div class="mt-8 leading-relaxed whitespace-pre-line">
      <p>Sekian, terima kasih.</p>
    </div>

    <!-- Print and Go Back Buttons -->
    <div class="mt-10 flex items-center gap-3 no-print">
      <rs-button variant="secondary" @click="goBack">Kembali</rs-button>
      <rs-button variant="primary" @click="printPage">Cetak</rs-button>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// Selected surat state populated from route params
const surat = reactive({
  noRujukan: '',
  tarikh: '',
  penerimaNama: '',
  penerimaAlamat: '',
  kodBantuan: '',
  permohonanBantuan: '',
  kategoriAsnaf: '',
  penerimaBayaran: '',
  kadarBantuan: null,
  kadarBantuanSebulan: null,
  tempohBantuan: null,
  kaedahPenyaluran: ''
})

const allSurat = {
  'AAP-2025-00163683': {
    noRujukan: 'AAP-2025-00163683',
    tarikh: '03 Mar 2025',
    penerimaNama: 'JONATHAN BALAN SOLOMON',
    penerimaAlamat: 'KAMARAH BINTI YAKUB BLOK B-07-23 KOMPLEKS SURIA KINRARA',
    kodBantuan: 'B102',
    permohonanBantuan: 'BANTUAN KEPERLUAN HIDUP (FAKIR)',
    kategoriAsnaf: 'Fakir',
    penerimaBayaran: 'JONATHAN BALAN SOLOMON',
    kadarBantuan: 'RM4,400.00 SAHAJA',
    kaedahPenyaluran: 'Akaun',
    tindakan: true
  },
  'AAP-2025-00163684': {
    noRujukan: 'AAP-2025-00163684',
    tarikh: '04 Mar 2025',
    penerimaNama: 'MARYAM ALI',
    penerimaAlamat: 'KAMARAH BINTI YAKUB BLOK B-07-24 KOMPLEKS SURIA KINRARA',
    kodBantuan: 'B103',
    permohonanBantuan: 'BANTUAN KEPERLUAN HIDUP (MISKIN)',
    kategoriAsnaf: 'Miskin',
    penerimaBayaran: 'MARYAM ALI',
    kadarBantuanSebulan: 'RM4,400.00 SAHAJA',
    tempohBantuan: '10 bulan',
    kaedahPenyaluran: 'Akaun',
    tindakan: true
  },
  'AAP-2025-00163685': {
    noRujukan: 'AAP-2025-00163685',
    tarikh: '05 Mar 2025',
    penerimaNama: 'ALI MUHAMMAD',
    penerimaAlamat: 'LOT 25, JALAN TEBRAU, KUALA LUMPUR',
    kodBantuan: 'B104',
    permohonanBantuan: 'BANTUAN KEPERLUAN HIDUP (MISKIN)',
    kategoriAsnaf: 'Miskin',
    penerimaBayaran: 'ALI MUHAMMAD',
    kadarBantuanSebulan: 'RM4,400.00 SAHAJA',
    tempohBantuan: '12 bulan',
    kaedahPenyaluran: 'Tunai',
    tindakan: true
  },
  'AAP-2025-00163686': {
    noRujukan: 'AAP-2025-00163686',
    tarikh: '06 Mar 2025',
    penerimaNama: 'SITI NORHANI',
    penerimaAlamat: 'BANDAR BARU PERDANA, SHAH ALAM',
    kodBantuan: 'B105',
    permohonanBantuan: 'BANTUAN KEPERLUAN HIDUP (MUALLAF)',
    kategoriAsnaf: 'Muallaf',
    penerimaBayaran: 'SITI NORHANI',
    kadarBantuan: 'RM5,000.00 SAHAJA',
    kaedahPenyaluran: 'Akaun',
    tindakan: true
  }
}

const isOneOff = computed(() => !!surat.kadarBantuan && !surat.kadarBantuanSebulan)
const isBerkala = computed(() => !!surat.kadarBantuanSebulan)

const showPenerimaBayaran = computed(() => {
  const a = (surat.penerimaBayaran || '').trim().toUpperCase()
  const b = (surat.penerimaNama || '').trim().toUpperCase()
  return !!a && a !== b
})

function parseRM(v) {
  if (!v) return 0
  const cleaned = String(v).replace(/[^\d.,]/g, '').replace(/,/g, '')
  const num = Number(cleaned)
  return Number.isFinite(num) ? num : 0
}
function parseBulan(v) {
  if (!v) return 0
  const m = String(v).match(/(\d+)/)
  return m ? Number(m[1]) : 0
}

const jumlahKeseluruhan = computed(() => {
  if (isOneOff.value) return parseRM(surat.kadarBantuan)
  if (isBerkala.value) return parseRM(surat.kadarBantuanSebulan) * parseBulan(surat.tempohBantuan)
  return 0
})

const jumlahKeseluruhanDisplay = computed(() =>
  jumlahKeseluruhan.value
    ? `RM${jumlahKeseluruhan.value.toLocaleString('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : '-'
)

const router = useRouter()
const route = useRoute()

// Function to hydrate surat data
const hydrateSurat = () => {
  const key = route.params?.id || ''
  console.log('Loading surat for key:', key)
  
  const found = allSurat[key] || Object.values(allSurat)[0]
  console.log('Found surat data:', found)
  
  Object.assign(surat, found)
}

// Initial hydration
hydrateSurat()

// Watch for route changes to update surat data
watch(() => route.params?.id, hydrateSurat)

function goBack() { router.back() }
function printPage() { if (typeof window !== 'undefined') window.print() }
</script>
