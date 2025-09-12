<template>
  <div>
    <layouts-breadcrumb :items="breadcrumb" />
  </div>

  <h1>Pelaporan</h1>

  <rs-tab>
    <!-- Tab: Asnaf -->
    <rs-tab-item title="Asnaf" :active="true">
      <rs-table
        :field="['Nama Laporan', 'Pilih']"
        :columns="columnsCommon"
        :data="asnafRows"
        :advanced="true"
        :showNoColumn="true"
        :showSearch="false"
        :showFilter="false"
        :options="tableOptions"
        :optionsAdvanced="tableAdv"
        :pageSize="10"
      >
        <!-- Kolum radio -->
        <template #Pilih="{ value }">
          <input
            type="radio"
            name="asnaf-report"
            :value="value.NamaLaporan"
            v-model="selected.asnaf"
          />
        </template>
      </rs-table>
    </rs-tab-item>

    <!-- Tab: Organisasi -->
    <rs-tab-item title="Organisasi">
      <rs-table
        :field="['Nama Laporan', 'Pilih']"
        :columns="columnsCommon"
        :data="organisasiRows"
        :advanced="true"
        :showNoColumn="true"
        :showSearch="false"
        :showFilter="false"
        :options="tableOptions"
        :optionsAdvanced="tableAdv"
        :pageSize="10"
      >
        <template #Pilih="{ value }">
          <input
            type="radio"
            name="org-report"
            :value="value.NamaLaporan"
            v-model="selected.organisasi"
          />
        </template>
      </rs-table>
    </rs-tab-item>

    <!-- Tab: Receipient -->
    <rs-tab-item title="Receipient">
      <rs-table
        :field="['Nama Laporan', 'Pilih']"
        :columns="columnsCommon"
        :data="receipientRows"
        :advanced="true"
        :showNoColumn="true"
        :showSearch="false"
        :showFilter="false"
        :options="tableOptions"
        :optionsAdvanced="tableAdv"
        :pageSize="10"
      >
        <template #Pilih="{ value }">
          <input
            type="radio"
            name="receipient-report"
            :value="value.NamaLaporan"
            v-model="selected.receipient"
          />
        </template>
      </rs-table>
    </rs-tab-item>
  </rs-tab>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { navigateTo } from '#app'

definePageMeta({ title: 'Pelaporan' })

const breadcrumb = [
  { name: 'Pelaporan', type: 'link', path: '/BF-PRF/AS/pelaporan' },
]

// Kolum (key) rs-table
const columnsCommon = [
  { key: 'NamaLaporan', label: 'Nama Laporan' },
  { key: 'Pilih', label: 'Pilih' },
]

// Opsyen jadual
const tableOptions = {
  variant: 'default',
  striped: true,
  bordered: true,
  borderless: false,
  hover: true,
  fixed: true, // gunakan table-fixed untuk kawal lebar kolum
}
const tableAdv = {
  sortable: false,
  filterable: false,
  responsive: true,
  outsideBorder: true,
}

// Data setiap tab
const asnafRows = ref([
  { NamaLaporan: 'Laporan Aging Profil Asnaf', Pilih: '' },
  { NamaLaporan: 'Surat Pengesahan Permastautin', Pilih: '' },
  { NamaLaporan: 'Surat Pengesahan Asnaf - Sekolah/IPT', Pilih: '' },
  { NamaLaporan: 'Surat Pengesahan Asnaf - Hospital', Pilih: '' },
])

const organisasiRows = ref([
  { NamaLaporan: 'Laporan Pendaftaran Agensi mengikut  Jenis Organisasi', Pilih: '' },
])

const receipientRows = ref([
  { NamaLaporan: 'Laporan Pendaftaran Receipient Mengikut Jenis Receipient', Pilih: '' },
])

// State pilihan radio setiap tab
const selected = reactive({
  asnaf: '',
  organisasi: '',
  receipient: '',
})

// Peta pilihan → route (Siti akan create file ikut path ni)
const routeMap = {
  asnaf: {
    'Laporan Aging Profil Asnaf': '/BF-PRF/AS/pelaporan/asnaf/laporan-aging-profil-asnaf',
    'Surat Pengesahan Permastautin': '/BF-PRF/AS/pelaporan/asnaf/pengesahan-permastautin',
    'Surat Pengesahan Asnaf - Sekolah/IPT': '/BF-PRF/AS/pelaporan/asnaf/pengesahan-sekolah-ipt',
    'Surat Pengesahan Asnaf - Hospital': '/BF-PRF/AS/pelaporan/asnaf/pengesahan-hospital',
  },
  organisasi: {
    'Laporan Pendaftaran Agensi mengikut  Jenis Organisasi': '/BF-PRF/AS/pelaporan/organisasi/pendaftaran-agensi',
  },
  receipient: {
    'Laporan Pendaftaran Receipient Mengikut Jenis Receipient': '/BF-PRF/AS/pelaporan/receipient/pendaftaran-receipient',
  },
}

// Auto navigate bila radio dipilih
watch(() => selected.asnaf, (v) => { if (v) go('asnaf') })
watch(() => selected.organisasi, (v) => { if (v) go('organisasi') })
watch(() => selected.receipient, (v) => { if (v) go('receipient') })

const go = (tab) => {
  const nilai = selected[tab]
  if (!nilai) return
  const path = routeMap[tab]?.[nilai]
  if (path) navigateTo(path)
}
</script>

<style scoped>
/* Kecil & center kolum PILIH (dengan showNoColumn = true, PILIH ialah kolum ke-3) */
:deep(.table-content thead tr th:nth-child(3)),
:deep(.table-content tbody tr td:nth-child(3)) {
  min-width: 72px !important;
  width: 72px !important;
  max-width: 80px !important;
  text-align: center;
  white-space: nowrap;
  padding-left: 0.75rem !important;
  padding-right: 0.75rem !important;
}

/* Sedikit besar untuk radio dan center */
:deep(.table-content tbody tr td:nth-child(3) input[type="radio"]) {
  transform: scale(1.1);
}
</style>
