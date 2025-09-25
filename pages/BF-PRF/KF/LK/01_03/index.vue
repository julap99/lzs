<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Kemaskini Maklumat Level Kelulusan</h2>
        </div>
      </template>

      <template #body>
        <div v-if="loading" class="py-6 text-gray-500">Memuatkan...</div>
        <div v-else-if="!record" class="py-6 text-red-600">Rekod tidak ditemui.</div>

        <div v-else class="space-y-3">
          <!-- 3.3.1 (Hidden) — shown for reference -->
          <div class="row">
            <div class="label">ID Level Kelulusan</div>
            <div class="value">{{ record.idLevelKelulusan }}</div>
          </div>

          <!-- 3.3.2 -->
          <div class="row">
            <div class="label">Table Name</div>
            <div class="value">{{ record.tableName }}</div>
          </div>

          <!-- 3.3.3 -->
          <div class="row">
            <div class="label">ID Row Table</div>
            <div class="value">{{ record.idRowTable }}</div>
          </div>

          <!-- 3.3.4 -->
          <div class="row">
            <div class="label">Level Type</div>
            <div class="value uppercase">{{ record.levelType }}</div>
          </div>

          <!-- 3.3.5 JSON Level -->
          <div class="row">
            <div class="label">Level</div>
            <div class="value w-full">
              <pre class="json-box">{{ pretty(record.level) }}</pre>
            </div>
          </div>

          <!-- 3.3.6 JSON Indicator -->
          <div class="row">
            <div class="label">Indicator</div>
            <div class="value w-full">
              <pre class="json-box">{{ pretty(record.indicator) }}</pre>
            </div>
          </div>

          <!-- 3.3.7 -->
          <div class="row">
            <div class="label">PIC</div>
            <div class="value">{{ record.pic || '-' }}</div>
          </div>

          <!-- 3.3.8 (checkbox, query only) -->
          <div class="row">
            <div class="label">Status</div>
            <div class="value">
              <label class="inline-flex items-center gap-2 cursor-default">
                <input type="checkbox" :checked="record.status === 'Aktif' || record.isActive === true" disabled />
                <span>{{ record.status || (record.isActive ? 'Aktif' : 'Tidak Aktif') }}</span>
              </label>
            </div>
          </div>

          <!-- 3.3.9 -->
          <div class="row">
            <div class="label">Status Data</div>
            <div class="value">
              <rs-badge :variant="getStatusVariant(record.statusData)">
                {{ record.statusData || '-' }}
              </rs-badge>
            </div>
          </div>

          <!-- 3.3.10 -->
          <div class="row">
            <div class="label">Tarikh Mula</div>
            <div class="value">{{ formatDate(record.tarikhMula) }}</div>
          </div>

          <!-- 3.3.11 -->
          <div class="row">
            <div class="label">Tarikh Tamat</div>
            <div class="value">{{ record.tarikhTamat ? formatDate(record.tarikhTamat) : '-' }}</div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- 2.1 & 2.2 Buttons -->
    <div class="mt-4 flex justify-between">
      <rs-button btnType="button" variant="secondary" @click="goBack">
        <Icon name="mdi:arrow-left" class="mr-1" /> Kembali
      </rs-button>

      <rs-button btnType="button" variant="primary" :disabled="!record" @click="goKemaskini">
        <Icon name="mdi:content-save-edit" class="mr-1" /> Kemaskini
      </rs-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({
  title: 'EX-PRF-KF-LK-01_03 | Senarai Kemaskini Maklumat Level Kelulusan',
})

const breadcrumb = ref([
  { name: 'Profiling', type: 'link', path: '/BF-PRF/KF/LK/01_01' },
  { name: 'Senarai Maklumat Level Kelulusan', type: 'link', path: '/BF-PRF/KF/LK/01_01' },
  { name: 'Kemaskini', type: 'current', path: '/BF-PRF/KF/LK/01_03' },
])

const STORAGE_KEY = 'levelKelulusanList'
const loading = ref(true)
const record = ref(null)

/** FR sample fallback (matches your sheet) */
const sample = {
  idLevelKelulusan: 1,
  tableName: '1',
  idRowTable: 1,
  levelType: 'row',
  level: [
    { Flow: '1', Tahap: '1', Value: 'Semak' },
    { Flow: '1', Tahap: '2', Value: 'Siasat' },
    { Flow: '1', Tahap: '3', Value: 'Sokong' },
    { Flow: '1', Tahap: '4', Value: 'Lulus' },
    { Flow: '2', Tahap: '1', Value: 'Semak' },
    { Flow: '2', Tahap: '2', Value: 'Siasat dan Sokong' },
    { Flow: '2', Tahap: '3', Value: 'Lulus' },
  ],
  indicator: [
    { Flow: '1', Tahap: '1', UserGroup: 'Pegawai Penyemak LZS' },
    { Flow: '1', Tahap: '2', UserGroup: 'Penolong Amil', Kriteria: 'Kariah = kariah pemohon' },
    { Flow: '1', Tahap: '2', UserGroup: 'Pegawai Penyiasat LZS' },
    { Flow: '1', Tahap: '3', UserGroup: 'EOAD' },
    { Flow: '1', Tahap: '4', UserGroup: 'KOAD' },
    { Flow: '2', Tahap: '1', UserGroup: 'Pegawai Penyemak LZS' },
    { Flow: '2', Tahap: '2', UserGroup: 'EOAD' },
    { Flow: '2', Tahap: '3', UserGroup: 'KOAD' },
  ],
  pic: '',
  status: 'Aktif',
  statusData: 'Draf',
  tarikhMula: '2025-01-01',
  tarikhTamat: null,
}

/** helpers */
function readList () {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr : []
  } catch { return [] }
}

function formatDate(v) {
  if (!v) return '-'
  const d = new Date(v)
  return isNaN(d) ? '-' : d.toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' })
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

function pretty(val) {
  try { return JSON.stringify(val ?? null, null, 2) }
  catch { return String(val ?? '') }
}

/** navigation */
function goBack () {
  navigateTo('/BF-PRF/KF/LK/01_01')
}
function goKemaskini () {
  if (!record.value) return
  navigateTo({ path: '/BF-PRF/KF/LK/01_02', query: { id: record.value.idLevelKelulusan } })
}

onMounted(() => {
  const route = useRoute()
  const id = route.query.id

  const list = readList()
  const found =
    list.find(x => String(x.idLevelKelulusan ?? x.id) === String(id)) ?? null

  // If opened without id or no data found, show sample (matches FR)
  record.value = found || sample
  loading.value = false
})
</script>

<style scoped>

</style>
