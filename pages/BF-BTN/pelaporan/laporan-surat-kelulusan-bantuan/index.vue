<template>
  <div class="p-6 space-y-6">
    <LayoutsBreadcrumb :items="breadcrumb" />
    <!-- Title -->
    <div>
      <h1 class="text-2xl font-semibold">Laporan Surat Kelulusan Bantuan</h1>
    </div>

    <!-- Carian -->
    <div class="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 class="text-lg font-semibold">Carian</h2>
      </div>

      <div class="p-5">
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <FormKit
            type="select"
            label="No Rujukan"
            v-model="form.noRujukan"
            :options="noRujukanOptions"
            placeholder="Pilih No Rujukan"
            :searchable="true"
          />
          <FormKit
            type="select"
            label="Kategori Asnaf"
            v-model="form.kategoriAsnaf"
            :options="kategoriAsnafOptions"
            placeholder="Pilih kategori"
            :searchable="true"
          />
          <FormKit
            type="select"
            label="Kod Bantuan"
            v-model="form.kodBantuan"
            :options="kodBantuanOptions"
            placeholder="Cari kod bantuan..."
            :searchable="true"
          />
        </div>

        <div class="mt-6 flex gap-3">
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

    <!-- Senarai Surat -->
    <div
      v-if="showTable && filteredResults.length"
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
          <!-- Tindakan -->
          <template #tindakan="{ value }">
            <div class="flex justify-center items-center">
              <rs-button
                variant="info-text"
                class="p-1 w-8 h-8"
                @click="navigateTo(`/BF-BTN/pelaporan/laporan-surat-kelulusan-bantuan/${value.noRujukan}/surat-kelulusan`)"
                title="Lihat"
                aria-label="Lihat"
              >
                <Icon name="ic:outline-visibility" size="18" />
              </rs-button>
            </div>
          </template>
                  
        </rs-table>
      </div>
    </div>

    <div v-else class="text-sm text-gray-500">
      Tiada data untuk paparan. Sila gunakan carian atau semak mock data.
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const breadcrumb = ref([
  { name: 'Pengurusan Bantuan', type: 'link', path: '/BF-BTN/pelaporan' },
  { name: 'Laporan', type: 'link', path: '/BF-BTN/pelaporan' },
  { name: 'Laporan Surat Kelulusan Bantuan', type: 'current', path: '/BF-BTN/pelaporan/laporan-surat-kelulusan-bantuan' },
])

// 🔹 Mock data (selaras dengan halaman surat)
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
    kadarBantuanSebulan: 'RM4,400.00 SAHAJA',
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
    kadarBantuanSebulan: 'RM4,400.00 SAHAJA',
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
    kaedahPenyaluran: 'Akaun',
    tindakan: true
  }
]

// 🔎 Carian form
const form = reactive({ noRujukan: '', kategoriAsnaf: '', kodBantuan: '' })

// 🔽 Dropdown options
const noRujukanOptions = allSurat.map(s => ({ label: s.noRujukan, value: s.noRujukan }))
const kategoriAsnafOptions = [...new Set(allSurat.map(s => s.kategoriAsnaf))].map(v => ({ label: v, value: v }))
const kodBantuanOptions = [...new Set(allSurat.map(s => s.kodBantuan))].map(v => ({ label: v, value: v }))

// 📋 Table settings
const filteredResults = ref([])
const pageSize = ref(5)
const columns = [
  { key: 'noRujukan', label: 'No Rujukan' },
  { key: 'kategoriAsnaf', label: 'Kategori Asnaf' },
  { key: 'kodBantuan', label: 'Kod Bantuan' },
  { key: 'tarikh', label: 'Tarikh' },
  { key: 'tindakan', label: 'Tindakan' }
]

// To control table visibility before search
const showTable = ref(false)

// 🔍 Actions
function onSearch() {
  filteredResults.value = allSurat.filter(s =>
    (!form.noRujukan || s.noRujukan === form.noRujukan) &&
    (!form.kategoriAsnaf || s.kategoriAsnaf === form.kategoriAsnaf) &&
    (!form.kodBantuan || s.kodBantuan === form.kodBantuan)
  )
  console.log('Filtered results:', filteredResults.value)
  showTable.value = true  // Show the table after search
}

function onReset() {
  form.noRujukan = ''
  form.kategoriAsnaf = ''
  form.kodBantuan = ''
  filteredResults.value = allSurat.slice()
  showTable.value = false  // Hide the table after reset
}

// 🚀 Navigate directly to the surat page
// 🚀 Navigate directly to the surat page (robust)
// function goToSurat(id) {
//   if (!id) return
//   const path = `/BF-BTN/pelaporan/laporan-surat-kelulusan-bantuan/${id.noRujukan}/surat-kelulusan`
//   if (typeof navigateTo === 'function') return navigateTo(path)
//   router.push(path)
// }

onMounted(() => {
  filteredResults.value = allSurat.slice()
  console.log('On mount - allSurat:', allSurat)
  console.log('On mount - filteredResults:', filteredResults.value)
})
</script>


<style lang="scss" scoped>
.rs-table {
  :deep(th) {
    @apply bg-gray-50 text-gray-600 font-medium;
  }
}
.tooltip-enter-active, .tooltip-leave-active {
  transition: opacity 0.2s;
}
.tooltip-enter-from, .tooltip-leave-to {
  opacity: 0;
}
</style>