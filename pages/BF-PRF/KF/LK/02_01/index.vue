<template>
  <div class="p-4">
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Maklumat Level Kelulusan</h2>
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
          @row-click="onRowClick"
        >
          <!-- Table Name -->
          <template #tableName="{ value }">
            <span>{{ value.tableName }}</span>
          </template>

          <!-- ID Row Table -->
          <template #idRowTable="{ value }">
            <span class="tabular-nums">{{ value.idRowTable }}</span>
          </template>

          <!-- Level Type -->
          <template #levelType="{ value }">
            <span class="uppercase">{{ value.levelType }}</span>
          </template>

          <!-- Tarikh Mula -->
          <template #tarikhMula="{ value }">
            <span>{{ formatDate(value.tarikhMula) }}</span>
          </template>

          <!-- Status Data -->
          <template #statusData="{ value }">
            <rs-badge :variant="getStatusVariant(value.statusData)">
              {{ value.statusData }}
            </rs-badge>
          </template>

          <!-- Tindakan -->
          <template #tindakan="{ value }">
            <div class="flex items-center justify-center gap-2">
              <rs-button
                size="sm"
                variant="primary"
                class="h-8 px-3 text-white"
                @click.stop="goLihat(value.idLevelKelulusan)"
              >
                Lihat
              </rs-button>
              <rs-button
                size="sm"
                variant="secondary"
                class="h-8 px-3 text-white"
                @click.stop="goKelulusan(value.idLevelKelulusan)"
              >
                Kelulusan
              </rs-button>
            </div>
          </template>
        </rs-table>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated, nextTick } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  title: 'EX-PRF-KF-LK-02_01 | Senarai Maklumat Level Kelulusan (Hantar)',
})

const router = useRouter()

/** Breadcrumb */
const breadcrumb = ref([
  { name: 'Profiling', type: 'link', path: '/BF-PRF/KF/LK/02_01' },
  { name: 'Senarai Maklumat Level Kelulusan (Hantar)', type: 'current', path: '/BF-PRF/KF/LK/02_01' },
])

/** Table state */
const tableKey = ref(0)
const rows = ref([])
const selectedId = ref(null)

/** STORAGE KEYS */
const HANTAR_KEY = 'levelKelulusanHantarList'
const MASTER_KEY = 'levelKelulusanList'

/** Storage helpers */
function readList (key) {
  try {
    const raw = localStorage.getItem(key)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr : []
  } catch { return [] }
}
function writeList (key, arr) {
  localStorage.setItem(key, JSON.stringify(arr ?? []))
}

/** Load + SYNC with master:
 *  - If an item was approved/rejected in 02_03 (statusData = Lulus/Tolak), remove it from Hantar.
 *  - Keep only Menunggu Kelulusan in 02_01.
 */
function loadRows () {
  try {
    const hantar = readList(HANTAR_KEY)
    const master = readList(MASTER_KEY)

    let changed = false
    const keep = []

    for (const item of hantar) {
      const id = String(item.idLevelKelulusan ?? item.id)
      const current = master.find(x => String(x.idLevelKelulusan ?? x.id) === id)

      const statusNow = current?.statusData ?? item.statusData ?? 'Menunggu Kelulusan'

      // if already approved/rejected in 02_03, drop from Hantar
      if (statusNow === 'Lulus' || statusNow === 'Tolak') {
        changed = true
        continue
      }

      // keep & sync latest status (usually Menunggu Kelulusan)
      if (statusNow !== item.statusData) changed = true
      keep.push({ ...item, statusData: statusNow })
    }

    if (changed) writeList(HANTAR_KEY, keep)

    rows.value = keep.map(normalizeItem)
  } catch (e) {
    console.error('Load error:', e)
    rows.value = []
  } finally {
    nextTick(() => tableKey.value++)
  }
}

/** Normalize for table */
function normalizeItem (it = {}) {
  return {
    idLevelKelulusan: it.idLevelKelulusan ?? it.id ?? Math.random().toString(36).slice(2),
    tableName: it.tableName ?? '-',
    idRowTable: Number(it.idRowTable ?? 0),
    levelType: it.levelType ?? '-',
    tarikhMula: it.tarikhMula ?? null,
    statusData: it.statusData ?? 'Menunggu Kelulusan',
    tindakan: '',
  }
}

/** Row click -> select id */
function onRowClick (row) {
  selectedId.value =
    row?.idLevelKelulusan ??
    row?.value?.idLevelKelulusan ??
    row?.original?.idLevelKelulusan ?? null
}

function goLihat (id) {
  router.push({ path: '/BF-PRF/KF/LK/02_02', query: { id } })
}

function goKelulusan (id) {
  const targetId = id ?? selectedId.value
  if (!targetId) return
  router.push({ path: '/BF-PRF/KF/LK/02_03', query: { id: String(targetId) } })
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
    case 'Draf': return 'warning'
    case 'Lulus': return 'success'
    case 'Tolak': return 'danger'
    default: return 'default'
  }
}

/** Refresh behaviours */
onMounted(loadRows)
onActivated(loadRows)

// refresh when tab comes back to foreground
if (process.client) {
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) loadRows()
  })
}
</script>

<style scoped>
:deep(.rs-table th),
:deep(.rs-table td) { padding-top: 8px; padding-bottom: 8px; }
</style>
