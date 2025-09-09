<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Tuntutan (Pelulus)</h2>
        </div>
      </template>

      <template #body>
        <!-- Main Table -->
        <rs-table
          :data="tableData"
          :columns="columns"
          :showNoColumn="true"
          :showSearch="true"
          :options="{ variant: 'default', hover: true, striped: true }"
          :options-advanced="{ sortable: true, filterable: true }"
          :show-filter="true"
          advanced
        >
          <!-- ID Permohonan: linkable (use { text } like your EOAD example) -->
          <template #idPermohonan="{ text }">
            <a
              href="#"
              class="text-primary-600 hover:text-primary-800"
              @click.prevent="goSemak(text)"
            >
              {{ text }}
            </a>
          </template>

          <!-- Amaun Tuntutan -->
          <template #amaunTuntutan="{ text }">
            <div class="font-medium text-right">RM {{ formatNumber(Number(text)) }}</div>
          </template>

          <!-- Tarikh Permohonan (date + time optional) -->
          <template #tarikhPermohonan="{ text }">
            <div>
              <div class="font-medium">{{ formatDate(text) }}</div>
              <div class="text-sm text-gray-500">{{ formatTime(text) }}</div>
            </div>
          </template>

          <!-- Status Kelulusan -->
          <template #statusKelulusan="{ text }">
            <rs-badge :variant="statusVariant(text)">{{ text || 'Belum Diputus' }}</rs-badge>
          </template>

          <!-- Tindakan: icon-only button (slot gets { value }) -->
          <template #tindakan="{ value }">
            <div class="flex space-x-2">
              <rs-button
                variant="ghost"
                size="sm"
                class="!px-2 !py-1 text-blue-600 hover:text-blue-800"
                @click="goSemak(getAction(value).id)"
                title="Semak & Luluskan"
                aria-label="Semak & Luluskan"
              >
                <Icon name="material-symbols:fact-check-outline" class="w-5 h-5" />
              </rs-button>
            </div>
          </template>
        </rs-table>

        <!-- Pagination (same style as EOAD example) -->
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
    </rs-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTuntutanPelulus } from '~/mocks/useTuntutanPelulus'

definePageMeta({ title: 'Senarai Tuntutan Pelulus' })

const breadcrumb = ref([
  { name: 'Tuntutan dengan Siasatan', type: 'link', path: '/BF-BTN/tuntutan-dengan-siasatan' },
  { name: 'Senarai Tuntutan Pelulus', type: 'current', path: '/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-pelulus' },
])

const { list } = useTuntutanPelulus()

/** Columns follow the same pattern as your EOAD/ETD page */
const columns = [
  { key: 'idPermohonan', label: 'ID Permohonan', sortable: true },
  { key: 'noGL', label: 'No. GL', sortable: true },
  { key: 'pegawaiETD', label: 'Pegawai ETD/EOAD', sortable: true },
  { key: 'tarikhPermohonan', label: 'Tarikh Permohonan', sortable: true },
  { key: 'amaunTuntutan', label: 'Amaun Tuntutan (RM)', sortable: true },
  { key: 'statusKelulusan', label: 'Status', sortable: true },
  { key: 'tindakan', label: 'Tindakan', sortable: false },
]

// optional: search/filter inputs if you want to add them later
const searchQuery = ref('')
const pageSize = ref(10)
const currentPage = ref(1)

/** Map data to table rows + embed tindakan object so the tindakan slot gets a useful value */
const baseRows = computed(() =>
  list.value.map((x) => ({
    id: x.id,
    idPermohonan: x.idPermohonan,
    noGL: x.noGL,
    pegawaiETD: x.pegawaiETD,
    tarikhPermohonan: x.tarikhPermohonan,
    amaunTuntutan: x.amaunTuntutan,
    statusKelulusan: x.statusKelulusan ?? 'Belum Diputus',
    tindakan: { id: x.id }, // slot { value } -> { id }
  }))
)

const filteredRows = computed(() => {
  if (!searchQuery.value) return baseRows.value
  const q = searchQuery.value.toLowerCase()
  return baseRows.value.filter(
    (r) =>
      r.idPermohonan.toLowerCase().includes(q) ||
      r.noGL.toLowerCase().includes(q) ||
      r.pegawaiETD.toLowerCase().includes(q)
  )
})

/** Manual pagination (to mirror your EOAD layout) */
const totalRows = computed(() => filteredRows.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalRows.value / pageSize.value)))
const paginationStart = computed(() => (currentPage.value - 1) * pageSize.value + 1)
const paginationEnd = computed(() => Math.min(currentPage.value * pageSize.value, totalRows.value))

const tableData = computed(() =>
  filteredRows.value.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
)

/** Helpers */
const formatDate = (s: string) => new Date(s).toLocaleDateString('ms-MY')
const formatTime = (s: string) => new Date(s).toLocaleTimeString('ms-MY')
const formatNumber = (n: number) =>
  new Intl.NumberFormat('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    .format(Number.isFinite(n) ? n : 0)

const statusVariant = (status?: string) => {
  if (status === 'Lulus') return 'success'
  if (status === 'Tidak Lulus') return 'danger'
  return 'warning' // Belum Diputus / others
}

/** Tindakan slot value normalizer (keeps slot signature robust) */
const getAction = (v: unknown): { id: string } => {
  const anyV = v as any
  if (anyV?.id) return { id: String(anyV.id) }
  if (anyV?.tindakan?.id) return { id: String(anyV.tindakan.id) }
  return { id: '' }
}

const goSemak = (id: string) => {
  if (!id) return
  navigateTo(`/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-pelulus/${id}/semak-kelulusan`)
}
</script>

<style scoped>
/* optional styling hooks */
</style>
