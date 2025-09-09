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
            <span class="text-gray-800">{{ text }}</span>
          </template>

          
          <template #select="{ text }">
            <!-- 'text' = value yang kita set dalam tableData (di sini: no) -->
            <rs-button
              variant="primary"
              size="sm"
              class="!px-3 !py-1"
              @click="handleSelect(text)"
              :aria-label="`Pilih No ${text}`"
            >
              Pilih
            </rs-button>
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

definePageMeta({ title: 'Jana Laporan' })

const breadcrumb = [
  { name: 'Pelaporan', type: 'link', path: '/reports' },
  { name: 'Jana Laporan', type: 'current', path: '/reports/R5' },
]

/** ========== FORCE DEFAULT TAB DOAA ========== **/
const activeTabIndex = ref(0)  // 0 = DOAA
const tabKey = ref(0)
onMounted(async () => {
  await nextTick()
  activeTabIndex.value = 0
  tabKey.value++
})

/** ========== TABLE SETUP (3 kolum sahaja) ========== **/
const columns = [
  { key: 'no',         label: 'No.',          sortable: true  },
  { key: 'reportName', label: 'Nama Laporan', sortable: true  },
  { key: 'select',     label: 'Pilih',        sortable: false },
]

/** Data baris (tanpa slug/path) */
const rows = ref([
  { no: 1, reportName: 'Laporan Bilangan Keseluruhan Asnaf/Bilangan Asnaf Aktif' },
  { no: 2, reportName: 'Laporan Perbandingan Bilangan dan Perincian Asnaf yang baharu vs lama (New Exit)' },
  { no: 3, reportName: 'Laporan Bantuan Asasi Bulanan' },
  { no: 4, reportName: 'Laporan Prestasi Agihan' },
])

/** Jadikan kolum 'select' memegang nombor baris (supaya slot { text } = no) */
const tableData = computed(() =>
  rows.value.map(r => ({
    ...r,
    select: r.no, // ini yang dihantar ke butang
  }))
)

/** Handler untuk setiap butang  */
function handleSelect(no) {
  switch (no) {
    case 1:
      return navigateTo('/reports/R5/Laporan-DOAA/Bilangan-Asnaf-Aktif')
    case 2:
      return navigateTo('/reports/R5/Laporan-DOAA/Perbandingan-Asnaf-New-Exit') 
    case 3:
      return navigateTo('/reports/R5/Laporan-DOAA/Bantuan-Asasi-Bulanan')
    case 4:
      return navigateTo('/reports/R5/Laporan-DOAA/Prestasi-Agihan')
    default:
      console.warn('Tiada tindakan ditetapkan untuk:', no)
  }
}


/** ========== PAGINATION (UI sahaja, belum slice data) ========== **/
const pageSize = ref(10)
const currentPage = ref(1)
const totalRows = computed(() => tableData.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalRows.value / pageSize.value)))
const paginationStart = computed(() => (currentPage.value - 1) * pageSize.value + 1)
const paginationEnd = computed(() => Math.min(currentPage.value * pageSize.value, totalRows.value))
</script>
