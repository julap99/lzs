<template>
    <div class="p-4">
        <LayoutsBreadcrumb :items="breadcrumb" />

        <rs-card class="mt-4">
            <template #header>
                <div class="flex justify-between items-center">
                    <h2 class="text-xl font-semibold">Level Kelulusan</h2>

                </div>
            </template>

            <template #body>
                <rs-table class="mt-2" :key="tableKey" :data="rows" :field="[
                    'tableName', 'idRowTable', 'levelType',
                    'level', 'indicator', 'pic',
                    'tarikhMula', 'tarikhTamat', 'statusData', 'tindakan'
                ]" :pageSize="10" :showNoColumn="false" :showFilter="true" :showSearch="true"
                    :options="{ variant: 'default', hover: true, borded: true, striped: true }" advanced
                    @row-click="onRowClick">
                    <!-- Table Name -->
                    <template #tableName="{ value }">
                        <span class="font-medium">{{ value.tableName }}</span>
                    </template>

                    <!-- ID Row Table -->
                    <template #idRowTable="{ value }">
                        <span class="tabular-nums">{{ value.idRowTable }}</span>
                    </template>

                    <!-- Level Type -->
                    <template #levelType="{ value }">
                        <span class="uppercase">{{ value.levelType }}</span>
                    </template>

                    <!-- Level (array pretty-printed) -->
                    <template #level="{ value }">
                        <pre class="cell-pre">{{ toPrettyArrayJson(value.level) }}</pre>
                    </template>

                    <!-- Indicator (array pretty-printed) -->
                    <template #indicator="{ value }">
                        <pre class="cell-pre">{{ toPrettyArrayJson(value.indicator) }}</pre>
                    </template>

                    <!-- PIC -->
                    <template #pic="{ value }">
                        <span>{{ value.pic || '-' }}</span>
                    </template>

                    <!-- Tarikh Mula -->
                    <template #tarikhMula="{ value }">
                        <span>{{ formatDate(value.tarikhMula) }}</span>
                    </template>

                    <!-- Tarikh Tamat -->
                    <template #tarikhTamat="{ value }">
                        <span>{{ value.tarikhTamat ? formatDate(value.tarikhTamat) : '' }}</span>
                    </template>

                    <!-- Status -->
                    <template #statusData="{ value }">
                        <rs-badge :variant="getStatusVariant(value.statusData)">
                            {{ value.statusData }}
                        </rs-badge>
                    </template>

                    <!-- Tindakan -->
                    <template #tindakan="{ value }">
                        <div class="flex items-center justify-center gap-2">
                            <rs-button size="sm" variant="secondary" class="h-8 px-3"
                                @click.stop="goKemaskini(value.idLevelKelulusan)">
                                Kemaskini
                            </rs-button>
                            <rs-button size="sm" variant="primary" class="h-8 px-3 text-white"
                                @click.stop="hantar(value.idLevelKelulusan)">
                                Hantar
                            </rs-button>
                        </div>
                    </template>
                </rs-table>

                <!-- Footer single Kembali button -->
                <div class="flex justify-center mt-4">
                    <rs-button variant="secondary" @click="goKembali">Kembali</rs-button>
                </div>
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
const STORAGE_KEY_HANTAR = 'levelKelulusanHantarList'

/** Breadcrumb */
const breadcrumb = ref([
  { name: 'Profiling', type: 'link', path: '/BF-PRF/KF/LK/01_01' },
  { name: 'Senarai Maklumat Level Kelulusan', type: 'current', path: '/BF-PRF/KF/LK/01_01' },
])

/** Table state */
const tableKey = ref(0)
const rows = ref([])
const selectedId = ref(null)

/** Storage */
const STORAGE_KEY = 'levelKelulusanList'
function readList () {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr : []
  } catch { return [] }
}
function writeList (arr) { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)) }

/** Load rows (normalize to include Level/Indicator/PIC etc.) */
function loadRows () {
  try {
    const list = readList()
    if (list.length) {
      rows.value = list.map(normalizeItem)
    } else {
      rows.value = [normalizeItem({
        idLevelKelulusan: 1,
        tableName: 'rekod_asnaf',
        idRowTable: 1,
        levelType: 'row',
        level: [
          { Flow: '1', Tahap: '1', Value: 'Semak' },
          { Flow: '1', Tahap: '2', Value: 'Siasat' },
          { Flow: '1', Tahap: '3', Value: 'Sokong' },
          { Flow: '1', Tahap: '4', Value: 'Lulus' },
        ],
        indicator: [
          { Flow: '1', Tahap: '1', UserGroup: 'Pegawai Penyemak LZS' },
          { Flow: '1', Tahap: '2', UserGroup: 'Pegawai Penyiasat LZS' },
        ],
        pic: 'Ahmad',
        tarikhMula: '2026-01-01',
        tarikhTamat: '',
        statusData: 'Draf',
      })]
    }
  } catch (e) {
    console.error('Load error:', e)
    rows.value = []
  } finally {
    nextTick(() => tableKey.value++)
  }
}

/** Normalize shape for table */
function normalizeItem (it = {}) {
  return {
    idLevelKelulusan: it.idLevelKelulusan ?? it.id ?? cryptoRandomId(),
    tableName: it.tableName ?? '-',
    idRowTable: Number(it.idRowTable ?? 0),
    levelType: it.levelType ?? '-',
    level: Array.isArray(it.level) ? it.level : coerceToArray(it.level),
    indicator: Array.isArray(it.indicator) ? it.indicator : coerceToArray(it.indicator),
    pic: it.pic ?? '',
    tarikhMula: it.tarikhMula ?? null,
    tarikhTamat: it.tarikhTamat ?? null,
    statusData: it.statusData ?? 'Draf',
    tindakan: '',
  }
}
function coerceToArray (v) {
  if (v == null) return []
  if (Array.isArray(v)) return v
  return [v]
}
function cryptoRandomId () {
  try { return (crypto?.randomUUID && crypto.randomUUID()) || Math.random().toString(36).slice(2) }
  catch { return Math.random().toString(36).slice(2) }
}

/** Pretty printers */
function toPrettyArrayJson (arr) {
  try { return JSON.stringify(arr, null, 0) } catch { return String(arr) }
}

/** Events / navigation */
function onRowClick (row) {
  selectedId.value =
    row?.idLevelKelulusan ??
    row?.value?.idLevelKelulusan ??
    row?.original?.idLevelKelulusan ?? null
}

function goTambah () {
  router.push('/BF-PRF/KF/LK/01_02')
}
function goKemaskini (id) {
  const targetId = id ?? selectedId.value
  if (!targetId) return
  router.push(`/BF-PRF/KF/LK/01_03/${targetId}`)
}
function goLihat (id) {
  router.push({ path: '/BF-PRF/KF/LK/01_04', query: { id } })
}
function goKembali () {
  router.back()
}

/** HANTAR helpers (02_01 bucket) */
function readHantarList () {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HANTAR)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr : []
  } catch { return [] }
}
function writeHantarList (arr) {
  localStorage.setItem(STORAGE_KEY_HANTAR, JSON.stringify(arr))
}
function toSubmission (item) {
  const copy = JSON.parse(JSON.stringify(item))
  copy.submittedAt = new Date().toISOString()
  copy.tableName ??= '-'
  copy.idRowTable = Number(copy.idRowTable ?? 0)
  copy.levelType ??= '-'
  copy.level = Array.isArray(copy.level) ? copy.level : (copy.level ? [copy.level] : [])
  copy.indicator = Array.isArray(copy.indicator) ? copy.indicator : (copy.indicator ? [copy.indicator] : [])
  copy.pic ??= ''
  copy.statusData ??= 'Menunggu Kelulusan'
  return copy
}

/** Notifikasi ringkas (toast jika ada, fallback alert) */
function notifySuccess (message) {
  try {
    const { $toast } = useNuxtApp ? useNuxtApp() : {}
    if ($toast?.success) { $toast.success(message); return }
  } catch (_) {}
  alert(message)
}

/** Action: Hantar -> set 'Menunggu Kelulusan', push ke 02_01 bucket, show toast, redirect 01_01 */
function hantar (id) {
  // 1) update main list: set status -> Menunggu Kelulusan
  const list = readList()
  const idx = list.findIndex(x => String(x.idLevelKelulusan) === String(id))
  if (idx === -1) return

  list[idx].statusData = 'Menunggu Kelulusan'
  writeList(list)
  loadRows()

  // 2) upsert ke bucket 02_01
  const sub = toSubmission(list[idx])
  const hantarList = readHantarList()
  const hIdx = hantarList.findIndex(x => String(x.idLevelKelulusan) === String(id))
  if (hIdx >= 0) hantarList[hIdx] = sub
  else hantarList.push(sub)
  writeHantarList(hantarList)

  // 3) notifikasi
  notifySuccess('Rekod berjaya dihantar untuk kelulusan.')

  // 4) redirect ke 01_01 (kekal di sini)
  if (router.currentRoute.value.path !== '/BF-PRF/KF/LK/01_01') {
    router.push('/BF-PRF/KF/LK/01_01')
  } else {
    nextTick(() => loadRows())
  }
}

/** Helpers */
function formatDate (d) {
  if (!d) return ''
  const dt = new Date(d)
  if (isNaN(dt)) return 'Tarikh Tidak Sah'
  return dt.toLocaleDateString('ms-MY', { day: 'numeric', month: 'numeric', year: 'numeric' })
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


onMounted(loadRows)
</script>


<style scoped>
:deep(.rs-table th),
:deep(.rs-table td) {
    padding-top: 8px;
    padding-bottom: 8px;
}

/* Make Level/Indicator JSON wrap like screenshot */
.cell-pre {
    white-space: pre-wrap;
    word-break: break-word;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
    font-size: 12px;
    line-height: 1.2;
}
</style>
