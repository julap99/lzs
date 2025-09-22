<template>
  <div class="p-6 space-y-6">
    <!-- Title -->
    <div>
      <h1 class="text-2xl font-semibold">Laporan Surat Kelulusan Bantuan</h1>
    </div>

    <!-- Carian Section -->
    <div class="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 class="text-lg font-semibold">Carian</h2>
      </div>

      <div class="p-5">
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <!-- No Rujukan (AAP-...) -->
          <FormKit
            type="select"
            label="No Rujukan"
            v-model="form.noRujukan"
            :options="noRujukanOptions"
            placeholder="Pilih No Rujukan"
            :searchable="true"
          />

          <!-- Kategori Asnaf -->
          <FormKit
            type="select"
            label="Kategori Asnaf"
            v-model="form.kategoriAsnaf"
            :options="kategoriAsnafOptions"
            placeholder="Pilih kategori"
            :searchable="true"
          />

          <!-- Kod Bantuan -->
          <FormKit
            type="select"
            label="Kod Bantuan"
            v-model="form.kodBantuan"
            :options="kodBantuanOptions"
            placeholder="Cari kod bantuan..."
            :searchable="true"
          />
        </div>

        <!-- Cari & Reset Buttons -->
        <div class="mt-6 flex justify-between">
          <rs-button variant="primary" @click="onSearch">Cari</rs-button>
          <rs-button
            variant="secondary"
            @click="onReset"
            class="!bg-gray-500 !text-white hover:!bg-gray-600"
          >
            Reset
          </rs-button>
        </div>
      </div>
    </div>

    <!-- Hasil (Results) Section -->
    <div
      v-if="filteredResults.length"
      class="rounded-2xl border border-gray-200 bg-white shadow-sm"
    >
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 class="text-lg font-semibold">Senarai Surat Kelulusan Bantuan</h2>
      </div>

      <div class="p-5 overflow-x-auto">
        <rs-table
          :columns="columns"
          :data="filteredResults"
          :page-size="pageSize"
          :show-search="true"
          :show-filter="true"
          :options="{ variant: 'default', striped: true, bordered: false, hover: true }"
        >
          <!-- ✅ Kolum tindakan: JANGAN bungkus dengan <td> -->
          <template #tindakan="{ row }">
            <rs-button variant="primary" @click.stop="goToSurat(row)">Lihat</rs-button>
            <!-- Atau guna NuxtLink jika nak elak handler JS:
            <NuxtLink
              :to="`/BF-BTN/pelaporan/laporan-surat-kelulusan-bantuan/${encodeURIComponent(row.noRujukan)}/surat-kelulusan`"
              class="inline-flex items-center px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >Lihat</NuxtLink>
            -->
          </template>
        </rs-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

/* =========================
   Router
   ========================= */
const router = useRouter()

/* =========================
   Form data & options
   ========================= */
const form = reactive({
  noRujukan: '',      // AAP-...
  kategoriAsnaf: '',
  kodBantuan: ''
})

const noRujukanOptions = [
  { label: 'AAP-2025-00163683', value: 'AAP-2025-00163683' },
  { label: 'AAP-2025-00163684', value: 'AAP-2025-00163684' },
  { label: 'AAP-2025-00163685', value: 'AAP-2025-00163685' },
  { label: 'AAP-2025-00163686', value: 'AAP-2025-00163686' }
]

const kategoriAsnafOptions = [
  { label: 'Fakir', value: 'Fakir' },
  { label: 'Miskin', value: 'Miskin' },
  { label: 'Muallaf', value: 'Muallaf' },
  { label: 'Gharimin', value: 'Gharimin' },
  { label: 'Ibnu Sabil', value: 'Ibnu Sabil' },
  { label: 'Riqab', value: 'Riqab' },
  { label: 'Fi Sabilillah', value: 'Fi Sabilillah' }
]

const kodBantuanOptions = [
  { label: 'B102', value: 'B102' },
  { label: 'B103', value: 'B103' },
  { label: 'B104', value: 'B104' },
  { label: 'B105', value: 'B105' },
  { label: 'B106', value: 'B106' }
]

/* =========================
   Table state & columns
   ========================= */
const filteredResults = ref([])
const pageSize = ref(5)

const columns = [
  { key: 'noRujukan', label: 'No Rujukan' },
  { key: 'kategoriAsnaf', label: 'Kategori Asnaf' },
  { key: 'kodBantuan', label: 'Kod Bantuan' },
  { key: 'tarikh', label: 'Tarikh' },
  { key: 'tindakan', label: 'Tindakan' } 
]

/* =========================
   Mock data (lengkap)
   ========================= */
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
    kadarBantuan: 'RM4,400.00 SAHAJA',
    kadarBantuanSebulan: 'RM400.00',
    tempohBantuan: '6 bulan',
    kaedahPenyaluran: 'Akaun',
    tindakan: true
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
    kadarBantuan: 'RM3,000.00 SAHAJA',
    kadarBantuanSebulan: 'RM300.00',
    tempohBantuan: '10 bulan',
    kaedahPenyaluran: 'Akaun',
    tindakan: true
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
    kadarBantuan: 'RM2,500.00 SAHAJA',
    kadarBantuanSebulan: 'RM250.00',
    tempohBantuan: '12 bulan',
    kaedahPenyaluran: 'Tunai',
    tindakan: true
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
    kadarBantuan: 'RM5,000.00 SAHAJA',
    kadarBantuanSebulan: 'RM500.00',
    tempohBantuan: '6 bulan',
    kaedahPenyaluran: 'Akaun',
    tindakan: true
  }
]

/* =========================
   Actions
   ========================= */
const onSearch = () => {
  filteredResults.value = allSurat.filter(surat => {
    return (
      (form.noRujukan ? surat.noRujukan === form.noRujukan : true) &&
      (form.kategoriAsnaf ? surat.kategoriAsnaf === form.kategoriAsnaf : true) &&
      (form.kodBantuan ? surat.kodBantuan === form.kodBantuan : true)
    )
  })
}

const onReset = () => {
  form.noRujukan = ''
  form.kategoriAsnaf = ''
  form.kodBantuan = ''
  filteredResults.value = []
}

/** Navigate ke interface surat (path-based, selamat untuk Nuxt auto routes) */
const goToSurat = (row) => {
  const path = `/BF-BTN/pelaporan/laporan-surat-kelulusan-bantuan/${encodeURIComponent(row.noRujukan)}/surat-kelulusan`
  router.push(path)
}
</script>

<style scoped>
/* Lebar kolum supaya kemas ikut Carian */
rs-table {
  width: 100%;
  border-collapse: collapse;
}
rs-table th, rs-table td {
  border: 1px solid #ddd;
  padding: 8px;
  white-space: nowrap;
}
rs-table th:nth-child(1),
rs-table td:nth-child(1) { width: 220px; } /* No Rujukan */
rs-table th:nth-child(2),
rs-table td:nth-child(2) { width: 160px; } /* Kategori Asnaf */
rs-table th:nth-child(3),
rs-table td:nth-child(3) { width: 140px; } /* Kod Bantuan */
rs-table th:nth-child(4),
rs-table td:nth-child(4) { width: 120px; } /* Tarikh */
rs-table th:nth-child(5),
rs-table td:nth-child(5) { width: 120px; text-align: center; } /* Tindakan */
</style>
