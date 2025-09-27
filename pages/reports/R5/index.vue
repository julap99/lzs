<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />
  </div>
  <div>
    <h1>Jana Laporan</h1>
  </div>

  <ClientOnly placeholder="Memuatkan…">
    <rs-tab v-model="activeTabIndex" :key="tabKey">

      <rs-tab-item title="Laporan DOAA" :value="0">
        <rs-table
          :data="tableData"
          :columns="columns"
          :showNoColumn="false"
          advanced
          :showSearch="true"
          :showFilter="false"
          :options="{ variant: 'default', hover: true, striped: true }"
          :options-advanced="{ sortable: true }"
        >

          <template #no="{ text }">
            <span>{{ text }}</span>
          </template>


          <template #reportName="{ text }">
            <span>{{ text }}</span>
          </template>

          <template #select="{ text }">
            <input
              type="radio"
              name="doaa-report"
              :value="text"
              v-model="selectedReport"
              @change="handleSelect(text)"
            />
          </template>
        </rs-table>
      </rs-tab-item>


      <rs-tab-item title="Laporan DPCH" :value="1"></rs-tab-item>
      <rs-tab-item title="Laporan DPA"  :value="2"></rs-tab-item>
      <rs-tab-item title="Laporan DKEW" :value="3"></rs-tab-item>
      <rs-tab-item title="Laporan Pengguna Laporan" :value="4"></rs-tab-item>
    </rs-tab>
  </ClientOnly>


  <div class="flex items-center justify-between px-5 mt-4">
    <div class="flex items-center gap-2">
      <span class="text-sm text-gray-700">Baris per halaman:</span>
      <FormKit
        v-model="pageSize"
        type="select"
        :options="[10, 25, 50]"
        :classes="{ wrapper: 'w-20', outer: 'mb-0', input: '!rounded-lg' }"
      />
    </div>
    <div class="flex items-center gap-2">
      <span class="text-sm text-gray-700">
        Menunjukkan {{ paginationStart }} hingga {{ paginationEnd }} daripada {{ totalRows }} entri
      </span>
      <div class="flex gap-1">
        <rs-button
          variant="primary-outline"
          class="!p-1 !w-8 !h-8"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          <Icon name="ic:round-keyboard-arrow-left" />
        </rs-button>
        <rs-button
          variant="primary-outline"
          class="!p-1 !w-8 !h-8"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          <Icon name="ic:round-keyboard-arrow-right" />
        </rs-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { navigateTo } from '#app'

definePageMeta({ title: 'Jana Laporan' })

const breadcrumb = [
  { name: 'Pelaporan', type: 'link', path: '/reports' },
  { name: 'Jana Laporan', type: 'current', path: '/reports/R5' },
]

/** ========== TAB SETUP ========== **/
const activeTabIndex = ref(0)
const tabKey = ref(0)
onMounted(async () => {
  await nextTick()
  activeTabIndex.value = 0
  tabKey.value++
})

/** ========== TABLE ========== **/
const columns = [
  { key: 'no',         label: 'No.',          sortable: true  },
  { key: 'reportName', label: 'Nama Laporan', sortable: true  },
  { key: 'select',     label: 'Pilih',        sortable: false },
]

const rows = ref([
  { no: 1, reportName: 'Laporan Penerima Bantuan Semasa' },
  { no: 2, reportName: 'Laporan Aging Asnaf Review' },
  { no: 3, reportName: 'Laporan Aging Bantuan' },
  { no: 4, reportName: 'Laporan Asnaf Keciciran Bantuan Utama' },
  { no: 5, reportName: 'Laporan Bantuan Sewa Rumah' },
])

const tableData = computed(() =>
  rows.value.map(r => ({
    ...r,
    select: r.no, // isi radio dengan no
  }))
)

/** ========== RADIO PILIHAN ========== **/
const selectedReport = ref(null)

function handleSelect(no) {
  switch (no) {
    case 1:
      return navigateTo('R5/Laporan-DOAA/Laporan-Penerima-Bantuan-Semasa')
    case 2:
      return navigateTo('R5/Laporan-DOAA/Laporan-Aging-Asnaf-Review') 
    case 3:
      return navigateTo('R5/Laporan-DOAA/Laporan-Aging-Bantuan')
    case 4:
      return navigateTo('R5/Laporan-DOAA/Laporan-Asnaf-Keciciran-Bantuan-Utama')
    case 5:
      return navigateTo('R5/Laporan-DOAA/Laporan-Bantuan-Sewa-Rumah')
    default:
      console.warn('Tiada tindakan ditetapkan untuk:', no)
  }
}

/** ========== PAGINATION ========== **/
const pageSize = ref(10)
const currentPage = ref(1)
const totalRows = computed(() => tableData.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalRows.value / pageSize.value)))
const paginationStart = computed(() => (currentPage.value - 1) * pageSize.value + 1)
const paginationEnd = computed(() => Math.min(currentPage.value * pageSize.value, totalRows.value))
</script>
