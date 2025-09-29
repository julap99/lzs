<template>
  <div class="p-4">
    <LayoutsBreadcrumb :items="breadcrumb" />

    <RsCard class="mt-4 p-4">
      <form class="space-y-6">
        <!-- Top: meta (left/right) -->
        <div class="grid grid-cols-12 gap-6">
          <div class="col-span-12 md:col-span-7 grid grid-cols-12 gap-4 items-center">
            <div class="col-span-4 label">Table Name</div>
            <div class="col-span-8 readonly-field">{{ record?.tableName || '-' }}</div>
          </div>

          <div class="col-span-12 md:col-span-5 grid grid-cols-12 gap-4">
            <div class="col-span-5 label">ID Row Table</div>
            <div class="col-span-7 readonly-field">{{ record?.idRowTable ?? '-' }}</div>

            <div class="col-span-5 label">Level Type</div>
            <div class="col-span-7 readonly-field uppercase">{{ record?.levelType || '-' }}</div>
          </div>
        </div>

        <!-- Main: two columns -->
        <div class="grid grid-cols-12 gap-8">
          <!-- LEFT: Level & Indicator -->
          <div class="col-span-12 md:col-span-7 space-y-8">

            <!-- LEVEL -->
            <section>
              <h3 class="section-title">Level</h3>
              <div v-if="(record?.level?.length || 0) === 0" class="muted">— tiada —</div>
              <div v-else class="space-y-2">
                <div
                  v-for="(row, i) in record.level"
                  :key="'lv-'+i"
                  class="readonly-field font-mono text-sm"
                >
                  {{ stringify(row) }}
                </div>
              </div>
            </section>

            <!-- INDICATOR -->
            <section>
              <h3 class="section-title">Indicator</h3>
              <div v-if="(record?.indicator?.length || 0) === 0" class="muted">— tiada —</div>
              <div v-else class="space-y-2">
                <div
                  v-for="(row, i) in record.indicator"
                  :key="'ind-'+i"
                  class="readonly-field font-mono text-sm"
                >
                  {{ stringify(row) }}
                </div>
              </div>
            </section>
          </div>

          <!-- RIGHT: Status, Status Data, Tarikh, PIC -->
          <aside class="col-span-12 md:col-span-5 space-y-8">
            <section>
              <h3 class="section-title">Status</h3>
              <div class="inline-flex items-center gap-2 readonly-field !py-1 !px-3 w-auto">
                <span
                  class="status-dot"
                  :class="(record?.status === 'Aktif' || record?.isActive) ? 'ok' : 'no'"
                />
                <span>{{ record?.status || (record?.isActive ? 'Aktif' : 'Tidak Aktif') || '-' }}</span>
              </div>
            </section>

            <section>
              <h3 class="section-title">Status Data</h3>
              <rs-badge :variant="getStatusVariant(record?.statusData)">
                {{ record?.statusData || '-' }}
              </rs-badge>
            </section>

            <section>
              <h3 class="section-title">Tarikh</h3>
              <div class="grid grid-cols-12 gap-3">
                <div class="col-span-5 label">Tarikh Mula</div>
                <div class="col-span-7 readonly-field">{{ formatDate(record?.tarikhMula) }}</div>

                <div class="col-span-5 label">Tarikh Tamat</div>
                <div class="col-span-7 readonly-field">
                  {{ record?.tarikhTamat ? formatDate(record.tarikhTamat) : '-' }}
                </div>
              </div>
            </section>

            <section>
              <h3 class="section-title">PIC</h3>
              <div class="readonly-field">{{ record?.pic || '-' }}</div>
            </section>
          </aside>
        </div>

        <!-- Footer -->
        <div class="flex justify-between pt-2">
          <rs-button btnType="button" variant="secondary" @click="goBack">
            <Icon name="mdi:arrow-left" class="mr-1" /> Kembali
          </rs-button>
        </div>
      </form>
    </RsCard>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({
  title: 'EX-PRF-KF-LK-01_04 | Lihat Maklumat Level Kelulusan',
})

const breadcrumb = ref([
  { name: 'Profiling', type: 'link', path: '/BF-PRF/KF/LK/01_01' },
  { name: 'Senarai Maklumat Level Kelulusan', type: 'link', path: '/BF-PRF/KF/LK/01_01' },
  { name: 'Lihat', type: 'current', path: '/BF-PRF/KF/LK/01_04' },
])

const STORAGE_KEY = 'levelKelulusanList'
const record = ref(null)

function readList () {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr : []
  } catch { return [] }
}

function formatDate (v) {
  if (!v) return '-'
  const d = new Date(v)
  return isNaN(d) ? '-' : d.toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' })
}

function stringify (row) {
  try { return JSON.stringify(row) } catch { return String(row ?? '') }
}

function getStatusVariant (status) {
  switch (status) {
    case 'Aktif': return 'success'
    case 'Tidak Aktif': return 'danger'
    case 'Menunggu Kelulusan': return 'warning'
    case 'Draf': return 'warning'
    case 'Lulus': return 'success'
    case 'Tolak': return 'danger'
    default: return 'default'
  }
}

function goBack () {
  navigateTo('/BF-PRF/KF/LK/02_01')
}

onMounted(() => {
  const route = useRoute()
  const id = route.query.id
  const list = readList()
  record.value = list.find(x => String(x.idLevelKelulusan ?? x.id) === String(id)) || null
})
</script>

<style scoped>
.label { @apply text-sm text-gray-600; }
.section-title { @apply text-sm font-semibold mb-2; }


/* Make spans look like readonly inputs for visual consistency */
.readonly-field {
  @apply border rounded px-3 py-2 bg-gray-50 text-gray-800;
  min-height: 38px;
}

/* Small status dot */
.status-dot {
  @apply inline-block rounded-full;
  width: 8px; height: 8px;
}
.status-dot.ok { @apply bg-green-500; }
.status-dot.no { @apply bg-gray-400; }

/* Optional: monospace JSON “box” – not used now (we use chips per row)
.json-box { @apply bg-gray-50 border rounded p-3 overflow-auto; }
*/
</style>
