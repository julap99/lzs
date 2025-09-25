<template>
  <div class="p-4">
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Maklumat Level Kelulusan</h2>
          <div class="flex items-center gap-2">
            <!-- 2.1 Tambah -> EX-PRF-KF-LK-01_02 -->
            <rs-button variant="primary" @click="goTambah">
              Tambah
            </rs-button>

            <!-- 2.2 Kemaskini -> EX-PRF-KF-LK-01_03 -->
            <rs-button
              variant="secondary"
              :disabled="!selectedId"
              @click="goKemaskini"
            >
              Kemaskini
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>
        <rs-table
          class="mt-2"
          :key="tableKey"
          :data="rows"
          :field="['tableName','idRowTable','levelType','tarikhMula','statusData','tindakan']"
          :pageSize="10"
          :showNoColumn="false"
          :showFilter="true"
          :showSearch="true"
          :options="{ variant: 'default', hover: true, borded: true, striped: true }"
          advanced
          @rowClick="onRowClick"
        >
          <!-- 3.1.2 Table Name (Query only) -->
          <template #tableName="{ value }">
            <span>{{ value.tableName }}</span>
          </template>

          <!-- 3.1.3 ID Row Table (Query only) -->
          <template #idRowTable="{ value }">
            <span class="tabular-nums">{{ value.idRowTable }}</span>
          </template>

          <!-- 3.1.4 Level Type (Query only) -->
          <template #levelType="{ value }">
            <span class="uppercase">{{ value.levelType }}</span>
          </template>

          <!-- 3.1.5 Tarikh Mula (Date, Query only) -->
          <template #tarikhMula="{ value }">
            <span>{{ formatDate(value.tarikhMula) }}</span>
          </template>

          <!-- 3.1.6 Status data (Text, Query only) -->
          <template #statusData="{ value }">
            <rs-badge :variant="getStatusVariant(value.statusData)">
              {{ value.statusData }}
            </rs-badge>
          </template>

          <!-- Actions: 2.3 Lihat -> EX-PRF-KF-LK-01_04 -->
          <template #tindakan="{ value }">
            <div class="flex items-center justify-center">
              <rs-button
                size="sm"
                variant="primary"
                class="h-8 px-3 text-white"
                @click.stop="goLihat(value.idLevelKelulusan)"
              >
                Lihat
              </rs-button>
            </div>
          </template>
        </rs-table>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  title: 'EX-PRF-KF-LK-01_01 | Senarai Maklumat Level Kelulusan',
})

const router = useRouter()

/** Breadcrumb to LK module */
const breadcrumb = ref([
  { name: 'Profiling', type: 'link', path: '/BF-PRF/KF/LK/01_01' },
  { name: 'Senarai Maklumat Level Kelulusan', type: 'current', path: '/BF-PRF/KF/LK/01_01' },
])

/** Table state */
const tableKey = ref(0)
const rows = ref([])
const selectedId = ref(null)

/** Load rows from storage (or example seed) */
function loadRows () {
  try {
    const raw = localStorage.getItem('levelKelulusanList')
    if (raw) {
      const parsed = JSON.parse(raw)
      rows.value = parsed.map(normalizeItem)
    } else {
      // Example fallback so the page isn't empty
      rows.value = [normalizeItem({
        idLevelKelulusan: 1,           // 3.1.1 Hidden
        tableName: 'rekod_asnaf',      // 3.1.2
        idRowTable: 1,                 // 3.1.3
        levelType: 'row',              // 3.1.4
        tarikhMula: '2026-01-01',      // 3.1.5
        statusData: 'Draf',            // 3.1.6
      })]
    }
  } catch (e) {
    console.error('Load error:', e)
    rows.value = []
  } finally {
    nextTick(() => tableKey.value++)
  }
}

/** Normalize shape for table consumption */
function normalizeItem (it = {}) {
  return {
    // Hidden key per FR 3.1.1
    idLevelKelulusan: it.idLevelKelulusan ?? it.id ?? cryptoRandomId(),
    // Visible columns
    tableName: it.tableName ?? '-',
    idRowTable: Number(it.idRowTable ?? 0),
    levelType: it.levelType ?? '-',
    tarikhMula: it.tarikhMula ?? null,
    statusData: it.statusData ?? 'Draf',
    // For action slot
    tindakan: '',
  }
}

function cryptoRandomId () {
  try {
    return (crypto?.randomUUID && crypto.randomUUID()) || Math.random().toString(36).slice(2)
  } catch {
    return Math.random().toString(36).slice(2)
  }
}

/** Row click -> select for Kemaskini */
function onRowClick (row) {
  selectedId.value = row?.idLevelKelulusan ?? null
}

/** Button: 2.1 Tambah -> EX-PRF-KF-LK-01_02 */
function goTambah () {
  router.push('/BF-PRF/KF/LK/01_02')
}

/** Button: 2.2 Kemaskini -> EX-PRF-KF-LK-01_03?id=… */
function goKemaskini () {
  if (!selectedId.value) return
  router.push({ path: '/BF-PRF/KF/LK/01_03', query: { id: selectedId.value } })
}

/** Button: 2.3 Lihat -> EX-PRF-KF-LK-01_04?id=… */
function goLihat (id) {
  router.push({ path: '/BF-PRF/KF/LK/01_04', query: { id } })
}

/** Helpers */
function formatDate (d) {
  if (!d) return ''
  const dt = new Date(d)
  if (isNaN(dt)) return 'Tarikh Tidak Sah'
  return dt.toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' })
}

function getStatusVariant (s) {
  switch (s) {
    case 'Aktif': return 'success'
    case 'Tidak Aktif': return 'danger'
    case 'Menunggu Kelulusan': return 'warning'
    case 'Draf': return 'secondary'
    default: return 'default'
  }
}

onMounted(loadRows)
</script>

<style scoped>
:deep(.rs-table th),
:deep(.rs-table td) { padding-top: 8px; padding-bottom: 8px; }
</style>
