<template>
  <div class="mx-auto max-w-4xl bg-white rounded-2xl border border-gray-200 shadow-sm p-8 print:p-0 print:shadow-none print:border-0">
    <!-- Header: Logo + Title -->
    <div class="flex items-center justify-between mb-6">
      <!-- 3.1.1 Logo LZS -->
      <img src="/assets/img/logo/lzs-logo.jpg" alt="Logo LZS" class="h-12 w-auto" />
      <div class="text-right">
        <h1 class="text-xl font-semibold">Surat Kelulusan Bantuan</h1>
      </div>
    </div>

    <!-- 3.2 Surat Kelulusan Bantuan -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <p><strong>No Rujukan :</strong> {{ surat?.noRujukan || '-' }}</p>        <!-- 3.2.1 -->
      <p><strong>Tarikh :</strong> {{ surat?.tarikh || '-' }}</p>               <!-- 3.2.2 -->
    </div>

    <!-- 3.3 Penerima -->
    <div class="mt-6">
      <h2 class="text-lg font-semibold">Penerima</h2>
      <div class="mt-2 space-y-1">
        <p><strong>Nama Asnaf :</strong> {{ surat?.penerimaNama || '-' }}</p>    <!-- 3.3.2 -->
        <p><strong>Alamat Asnaf :</strong> {{ surat?.penerimaAlamat || '-' }}</p><!-- 3.3.3 -->
      </div>
    </div>

    <!-- 3.4 Tajuk Surat -->
    <div class="mt-8">
      <h2 class="sr-only">Tajuk Surat</h2> <!-- 3.4 -->
      <p class="text-lg font-semibold">
        Maklum Balas Permohonan Bantuan Zakat di Lembaga Zakat Selangor (MAIS)
      </p> <!-- 3.4.1 -->
      <div class="mt-4 leading-relaxed whitespace-pre-line">
        <!-- 3.4.3 -->
        Semoga surat ini menemui tuan / puan di dalam kemanisan iman serta memperoleh keberkatan dan kerahmatan daripada  Allah S.W.T., In Shaa Allah.

        Sukacita dimaklumkan bahawa Lembaga Zakat Selangor (MAIS) telah MELULUSKAN permohonan bantuan zakat 
        seperti berikut :
      </div>
    </div>

    <!-- 3.5 Maklumat Bantuan -->
    <div class="mt-8">
      <h2 class="text-lg font-semibold">Maklumat Bantuan</h2>
      <div class="mt-3 space-y-2">
        <p><strong>No Bantuan / No KP :</strong> {{ surat?.kodBantuan || '-' }}</p>            <!-- 3.5.1 -->
        <p><strong>Permohonan Bantuan :</strong> {{ surat?.permohonanBantuan || '-' }}</p>     <!-- 3.5.2 -->
        <p><strong>Nama Penerima :</strong> {{ surat?.penerimaNama || '-' }}</p>               <!-- 3.5.3 -->

        <!-- 3.5.4 Only show if penerimaBayaran != penerimaNama -->
        <p v-if="showPenerimaBayaran">
          <strong>Nama Penerima Bayaran :</strong> {{ surat?.penerimaBayaran }}
        </p>

        <!-- 3.5.5 One-off only -->
        <p v-if="isOneOff">
          <strong>Kadar Bantuan :</strong> {{ surat?.kadarBantuan || '-' }}
        </p>

        <!-- 3.5.6 Berkala only -->
        <p v-if="isBerkala">
          <strong>Kadar Bantuan Sebulan :</strong> {{ surat?.kadarBantuanSebulan || '-' }}
        </p>

        <!-- 3.5.7 Jumlah Bantuan Keseluruhan -->
        <p>
          <strong>Jumlah Bantuan Keseluruhan :</strong> {{ jumlahKeseluruhanDisplay }}
        </p>

        <!-- 3.5.8 Berkala only -->
        <p v-if="isBerkala">
          <strong>Tempoh Bantuan :</strong> {{ surat?.tempohBantuan || '-' }}
        </p>

        <!-- 3.5.9 -->
        <p><strong>Kaedah Penyaluran Bantuan :</strong> {{ surat?.kaedahPenyaluran || '-' }}</p>
      </div>
    </div>

    <!-- 3.5.10 Penutup -->
    <div class="mt-8 leading-relaxed whitespace-pre-line">
      Sebarang pertanyaan atau kemusykilan berkaitan perkara di atas, pihak tuan / puan boleh menghubungi Talian
      Zakat Selangor di talian 1-300-88-4343 atau merujuk kepada mana-mana cawangan Lembaga Zakat Selangor
      yang terdekat.

      Semoga bantuan zakat yang diberikan ini dapat meringankan beban yang ditanggung oleh pihak tuan / puan
      dan diharapkan agar bantuan ini dapat digunakan dengan amanah dan sebaik-baiknya dalam meningkatkan
      ketaqwaan kepada Allah S.W.T.

      Sekian, terima kasih.
    </div>

    <!-- Actions -->
    <div class="mt-10 flex items-center gap-3 no-print">
      <rs-button variant="secondary" @click="goBack">Kembali</rs-button>
      <rs-button variant="primary" @click="printPage">Cetak</rs-button>
    </div>

    <!-- Fallback bila tak jumpa -->
    <div v-if="!surat" class="mt-8 text-red-600 no-print">
      Rekod tidak ditemui untuk ID: {{ id }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import lzsLogo from '~/assets/img/logo/lzs-logo.jpg'

/** Ambil ID dari route (noRujukan) */
const route = useRoute()
const router = useRouter()
const id = computed(() => route.params.id)

/** Mock data — sepadan dengan skrin senarai (boleh ganti dengan API/Store sebenar) */
const allSurat = [
  {
    noRujukan: 'AAP-2025-00163683',
    tarikh: '03 Mar 2025',
    penerimaNama: 'JONATHAN BALAN SOLOMON',
    penerimaAlamat: 'KAMARAH BINTI YAKUB BLOK B-07-23 KOMPLEKS SURIA KINRARA',
    kodBantuan: 'B102',
    permohonanBantuan: 'BANTUAN KEPERLUAN HIDUP (FAKIR)',
    kategoriAsnaf: 'Fakir',
    penerimaBayaran: 'JONATHAN BALAN SOLOMON',
    kadarBantuan: 'RM4,400.00 SAHAJA',     // One-off
    kaedahPenyaluran: 'Akaun'
  },
  {
    noRujukan: 'AAP-2025-00163684',
    tarikh: '04 Mar 2025',
    penerimaNama: 'MARYAM ALI',
    penerimaAlamat: 'KAMARAH BINTI YAKUB BLOK B-07-24 KOMPLEKS SURIA KINRARA',
    kodBantuan: 'B103',
    permohonanBantuan: 'BANTUAN KEPERLUAN HIDUP (MISKIN)',
    kategoriAsnaf: 'Miskin',
    penerimaBayaran: 'MARYAM ALI',
    kadarBantuanSebulan: 'RM300.00',        // Berkala
    tempohBantuan: '10 bulan',
    kaedahPenyaluran: 'Akaun'
  },
  {
    noRujukan: 'AAP-2025-00163685',
    tarikh: '05 Mar 2025',
    penerimaNama: 'ALI MUHAMMAD',
    penerimaAlamat: 'LOT 25, JALAN TEBRAU, KUALA LUMPUR',
    kodBantuan: 'B104',
    permohonanBantuan: 'BANTUAN KEPERLUAN HIDUP (MISKIN)',
    kategoriAsnaf: 'Miskin',
    penerimaBayaran: 'ALI MUHAMMAD',
    kadarBantuanSebulan: 'RM250.00',        // Berkala
    tempohBantuan: '12 bulan',
    kaedahPenyaluran: 'Tunai'
  },
  {
    noRujukan: 'AAP-2025-00163686',
    tarikh: '06 Mar 2025',
    penerimaNama: 'SITI NORHANI',
    penerimaAlamat: 'BANDAR BARU PERDANA, SHAH ALAM',
    kodBantuan: 'B105',
    permohonanBantuan: 'BANTUAN KEPERLUAN HIDUP (MUALLAF)',
    kategoriAsnaf: 'Muallaf',
    penerimaBayaran: 'SITI NORHANI',
    kadarBantuan: 'RM5,000.00 SAHAJA',      // One-off
    kaedahPenyaluran: 'Akaun'
  }
]

/** Dapatkan rekod ikut ID */
const surat = computed(() => allSurat.find(s => s.noRujukan === id.value))

/** Penentuan jenis bantuan */
const isOneOff = computed(() => !!surat.value?.kadarBantuan && !surat.value?.kadarBantuanSebulan)
const isBerkala = computed(() => !!surat.value?.kadarBantuanSebulan)

/** Paparan syarat: penerima bayaran berbeza */
const showPenerimaBayaran = computed(() => {
  if (!surat.value) return false
  const a = (surat.value.penerimaBayaran || '').trim().toUpperCase()
  const b = (surat.value.penerimaNama || '').trim().toUpperCase()
  return a && a !== b
})

/** Util parse nilai Ringgit dari string "RM1,234.56" */
function parseRM(v) {
  if (!v) return 0
  const n = String(v).replace(/[^\d.,]/g, '').replace(',', '')
  return Number(n || 0)
}
/** Util parse bulan dari string "10 bulan" */
function parseBulan(v) {
  if (!v) return 0
  const m = String(v).match(/(\d+)/)
  return m ? Number(m[1]) : 0
}

/** 3.5.7 Jumlah Bantuan Keseluruhan */
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
const jumlahKeseluruhanDisplay = computed(() => {
  return jumlahKeseluruhan.value
    ? `RM${jumlahKeseluruhan.value.toLocaleString('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : '-'
})

/** Actions */
function goBack() {
  router.back()
}
function printPage() {
  window.print()
}
</script>

<style scoped>
@media print {
  .no-print { display: none !important; }
  :host, html, body { background: #fff; }
}
</style>
