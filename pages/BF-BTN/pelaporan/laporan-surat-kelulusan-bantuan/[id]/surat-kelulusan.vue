<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Mock data fallback (sama dengan index.vue)
const allSurat = [
  { noRujukan: 'AAP-2025-00163683', tarikh: '03 Mar 2025', penerimaNama: 'JONATHAN BALAN SOLOMON', penerimaAlamat: 'KAMARAH BINTI YAKUB BLOK B-07-23 KOMPLEKS SURIA KINRARA', kodBantuan: 'B102', permohonanBantuan: 'BANTUAN KEPERLUAN HIDUP (FAKIR)', kategoriAsnaf: 'Fakir', penerimaBayaran: 'JONATHAN BALAN SOLOMON', kadarBantuan: 'RM4,400.00 SAHAJA', kaedahPenyaluran: 'Akaun' },
  { noRujukan: 'AAP-2025-00163684', tarikh: '04 Mar 2025', penerimaNama: 'MARYAM ALI', penerimaAlamat: 'KAMARAH BINTI YAKUB BLOK B-07-24 KOMPLEKS SURIA KINRARA', kodBantuan: 'B103', permohonanBantuan: 'BANTUAN KEPERLUAN HIDUP (MISKIN)', kategoriAsnaf: 'Miskin', penerimaBayaran: 'MARYAM ALI', kadarBantuanSebulan: 'RM300.00', tempohBantuan: '10 bulan', kaedahPenyaluran: 'Akaun' },
  { noRujukan: 'AAP-2025-00163685', tarikh: '05 Mar 2025', penerimaNama: 'ALI MUHAMMAD', penerimaAlamat: 'LOT 25, JALAN TEBRAU, KUALA LUMPUR', kodBantuan: 'B104', permohonanBantuan: 'BANTUAN KEPERLUAN HIDUP (MISKIN)', kategoriAsnaf: 'Miskin', penerimaBayaran: 'ALI MUHAMMAD', kadarBantuanSebulan: 'RM250.00', tempohBantuan: '12 bulan', kaedahPenyaluran: 'Tunai' },
  { noRujukan: 'AAP-2025-00163686', tarikh: '06 Mar 2025', penerimaNama: 'SITI NORHANI', penerimaAlamat: 'BANDAR BARU PERDANA, SHAH ALAM', kodBantuan: 'B105', permohonanBantuan: 'BANTUAN KEPERLUAN HIDUP (MUALLAF)', kategoriAsnaf: 'Muallaf', penerimaBayaran: 'SITI NORHANI', kadarBantuan: 'RM5,000.00 SAHAJA', kaedahPenyaluran: 'Akaun' }
]

const route = useRoute()
const router = useRouter()
const id = computed(() => route.params.id)

// Ambil dari state, fallback ke mock data
const surat = computed(() => {
  return history.state?.surat || allSurat.find(s => s.noRujukan === id.value) || null
})

const isOneOff = computed(() => !!surat.value?.kadarBantuan && !surat.value?.kadarBantuanSebulan)
const isBerkala = computed(() => !!surat.value?.kadarBantuanSebulan)

const showPenerimaBayaran = computed(() => {
  if (!surat.value) return false
  const a = (surat.value.penerimaBayaran || '').trim().toUpperCase()
  const b = (surat.value.penerimaNama || '').trim().toUpperCase()
  return a && a !== b
})

function parseRM(v) {
  if (!v) return 0
  const n = String(v).replace(/[^\d.,]/g, '').replace(',', '')
  return Number(n || 0)
}
function parseBulan(v) {
  if (!v) return 0
  const m = String(v).match(/(\d+)/)
  return m ? Number(m[1]) : 0
}

const jumlahKeseluruhan = computed(() => {
  if (!surat.value) return 0
  if (isOneOff.value) {
    return parseRM(surat.value.kadarBantuan)
  }
  if (isBerkala.value) {
    const sebulan = parseRM(surat.value.kadarBantuanSebulan)
    const bulan = parseBulan(surat.value.tempohBantuan)
    return sebulan * bulan
  }
  return 0
})
const jumlahKeseluruhanDisplay = computed(() =>
  jumlahKeseluruhan.value
    ? `RM${jumlahKeseluruhan.value.toLocaleString('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : '-'
)

function goBack() { router.back() }
function printPage() { window.print() }
</script>

<template>
  <div class="mx-auto max-w-4xl bg-white rounded-2xl border border-gray-200 shadow-sm p-8 print:p-0 print:shadow-none print:border-0">
    <div class="flex items-center justify-between mb-6">
      <img class="h-12 block" src="https://www.zakatselangor.com.my/wp-content/uploads/2018/10/lzs-logo.png" alt="LZS Logo"/>
      <div class="text-right">
        <h1 class="text-xl font-semibold">Surat Kelulusan Bantuan</h1>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <p><strong>No Rujukan :</strong> {{ surat?.noRujukan || '-' }}</p>
      <p><strong>Tarikh :</strong> {{ surat?.tarikh || '-' }}</p>
    </div>

    <div class="mt-6">
      <h2 class="text-lg font-semibold">Penerima</h2>
      <div class="mt-2 space-y-1">
        <p><strong>Nama Asnaf :</strong> {{ surat?.penerimaNama || '-' }}</p>
        <p><strong>Alamat Asnaf :</strong> {{ surat?.penerimaAlamat || '-' }}</p>
      </div>
    </div>

    <div class="mt-8">
      <p class="text-lg font-semibold">
        Maklum Balas Permohonan Bantuan Zakat di Lembaga Zakat Selangor (MAIS)
      </p>
      <div class="mt-4 leading-relaxed whitespace-pre-line">
        Sukacita dimaklumkan bahawa Lembaga Zakat Selangor (MAIS) telah MELULUSKAN permohonan
        bantuan zakat seperti berikut :
      </div>
    </div>

    <div class="mt-8">
      <h2 class="text-lg font-semibold">Maklumat Bantuan</h2>
      <div class="mt-3 space-y-2">
        <p><strong>No Bantuan / No KP :</strong> {{ surat?.kodBantuan || '-' }}</p>
        <p><strong>Permohonan Bantuan :</strong> {{ surat?.permohonanBantuan || '-' }}</p>
        <p><strong>Nama Penerima :</strong> {{ surat?.penerimaNama || '-' }}</p>

        <p v-if="showPenerimaBayaran"><strong>Nama Penerima Bayaran :</strong> {{ surat?.penerimaBayaran }}</p>
        <p v-if="isOneOff"><strong>Kadar Bantuan :</strong> {{ surat?.kadarBantuan || '-' }}</p>
        <p v-if="isBerkala"><strong>Kadar Bantuan Sebulan :</strong> {{ surat?.kadarBantuanSebulan || '-' }}</p>
        <p><strong>Jumlah Bantuan Keseluruhan :</strong> {{ jumlahKeseluruhanDisplay }}</p>
        <p v-if="isBerkala"><strong>Tempoh Bantuan :</strong> {{ surat?.tempohBantuan || '-' }}</p>
        <p><strong>Kaedah Penyaluran Bantuan :</strong> {{ surat?.kaedahPenyaluran || '-' }}</p>
      </div>
    </div>

    <div class="mt-10 flex items-center gap-3 no-print">
      <rs-button variant="secondary" @click="goBack">Kembali</rs-button>
      <rs-button variant="primary" @click="printPage">Cetak</rs-button>
    </div>

    <div v-if="!surat" class="mt-8 text-red-600 no-print">
      Rekod tidak ditemui untuk ID: {{ id }}
    </div>
  </div>
</template>
