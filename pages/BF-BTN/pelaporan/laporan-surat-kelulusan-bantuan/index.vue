<template>
  <div class="p-6 space-y-6">
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

    <!-- Senarai Surat -->
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
          <!-- Tindakan -->
          <template #tindakan="{ row }">
            <rs-button
              variant="ghost"
              size="sm"
              class="!px-2 !py-1 text-blue-600 hover:text-blue-800"
              @click="goToSurat(row.noRujukan)"
              title="Lihat Surat Kelulusan Bantuan"
              aria-label="Lihat Surat Kelulusan Bantuan"
            >
              <Icon name="material-symbols:visibility-outline" class="w-5 h-5" />
            </rs-button>
          </template>
        </rs-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 🚀 Pergi ke page surat-kelulusan
function goToSurat(id) {
  if (!id) return
  const surat = allSurat.find(s => s.noRujukan === id)
  router.push({
    path: `/BF-BTN/pelaporan/laporan-surat-kelulusan-bantuan/${id}/surat-kelulusan`,
    state: { surat }
  })
}

const form = reactive({ noRujukan: '', kategoriAsnaf: '', kodBantuan: '' })

// 🔹 Mock data
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
    kaedahPenyaluran: 'Akaun',
    tindakan: true
  }
]

// Dropdown options
const noRujukanOptions = allSurat.map(s => ({ label: s.noRujukan, value: s.noRujukan }))
const kategoriAsnafOptions = [...new Set(allSurat.map(s => s.kategoriAsnaf))].map(v => ({ label: v, value: v }))
const kodBantuanOptions = [...new Set(allSurat.map(s => s.kodBantuan))].map(v => ({ label: v, value: v }))

// Table
const filteredResults = ref([])
const pageSize = ref(5)
const columns = [
  { key: 'noRujukan', label: 'No Rujukan' },
  { key: 'kategoriAsnaf', label: 'Kategori Asnaf' },
  { key: 'kodBantuan', label: 'Kod Bantuan' },
  { key: 'tarikh', label: 'Tarikh' },
  { key: 'tindakan', label: 'Tindakan' }
]

function onSearch() {
  filteredResults.value = allSurat.filter(s =>
    (!form.noRujukan || s.noRujukan === form.noRujukan) &&
    (!form.kategoriAsnaf || s.kategoriAsnaf === form.kategoriAsnaf) &&
    (!form.kodBantuan || s.kodBantuan === form.kodBantuan)
  )
}
function onReset() {
  form.noRujukan = ''
  form.kategoriAsnaf = ''
  form.kodBantuan = ''
  filteredResults.value = allSurat.slice()
}

// Debug: tunjuk semua route
onMounted(() => {
  console.log('ROUTES:', router.getRoutes().map(r => r.path))
  filteredResults.value = allSurat.slice()
})
</script>
