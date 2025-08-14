<template>
  <div class="p-4 space-y-5">
    <!-- Breadcrumb -->
    <nav class="text-sm text-gray-500">
      Pengurusan Elaun › Elaun Tahunan › <span class="text-gray-900 font-medium">Isi Maklumat Penerima</span>
    </nav>

    <!-- Header Card -->
    <div class="rounded-xl border bg-white shadow-sm">
      <div class="px-5 py-4 border-b flex items-center justify-between">
        <h2 class="text-lg font-semibold">Borang Isi Maklumat Penerima — Elaun Tahunan</h2>
        <div class="text-xs text-gray-500">Kod Skrin: BF-PA/PE/ET/01</div>
      </div>

      <div class="p-5 space-y-6">
        <!-- Filters (Required) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium">Tahun Elaun <span class="text-red-500">*</span></label>
            <select class="mt-1 w-full border rounded-lg px-3 py-2" v-model="filters.year" @change="onFilterChanged">
              <option value="" disabled>Pilih tahun…</option>
              <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
            </select>
            <p class="text-xs text-gray-500 mt-1">Wajib dipilih; memandu skop data penerima.</p>
          </div>

          <div>
            <label class="text-sm font-medium">Jenis Elaun <span class="text-red-500">*</span></label>
            <select class="mt-1 w-full border rounded-lg px-3 py-2" v-model="filters.type" @change="onFilterChanged">
              <option value="" disabled>Pilih jenis elaun…</option>
              <option v-for="(label, code) in typeOptions" :key="code" :value="code">{{ label }}</option>
            </select>
            <p class="text-xs text-gray-500 mt-1">Wajib dipilih; memandu senarai calon & kawalan konflik tahun.</p>
          </div>
        </div>

        <!-- Summary / Status Bar -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div class="rounded-lg border p-3">
            <div class="text-xs text-gray-500">Tahun Elaun</div>
            <div class="text-base font-medium">{{ filters.year || '—' }}</div>
          </div>
          <div class="rounded-lg border p-3">
            <div class="text-xs text-gray-500">Jenis Elaun</div>
            <div class="text-base font-medium">{{ typeLabel || '—' }}</div>
          </div>
          <div class="rounded-lg border p-3">
            <div class="text-xs text-gray-500">Status Senarai</div>
            <div class="text-base">
              <span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs" :class="statusBadgeClass(batchStatus)">
                <span class="w-1.5 h-1.5 rounded-full" :class="statusDotClass(batchStatus)" />
                {{ batchStatusLabel(batchStatus) }}
              </span>
            </div>
          </div>
          <div class="rounded-lg border p-3">
            <div class="text-xs text-gray-500">Bilangan Dalam Senarai</div>
            <div class="text-base font-medium">{{ totalCountDisplay }}</div>
          </div>
        </div>

        <!-- Toolbar: Actions -->
        <div class="flex flex-col md:flex-row md:items-center gap-3">
          <div class="flex-1"></div>
          <div class="flex items-center gap-2">
            <button type="button" class="px-3 py-2 rounded-lg border hover:bg-gray-50" @click="reloadBatchStatus" :disabled="!canQuery || loading">
              Set Semula
            </button>
            <button type="button" class="px-3 py-2 rounded-lg text-white disabled:opacity-50"
              :class="canSave ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400'"
              :disabled="!canSave"
              @click="onSave">
              Simpan
            </button>
          </div>
        </div>

        <!-- Status Table (Read-only) -->
        <div class="overflow-x-auto rounded-lg border">
          <table class="min-w-full text-sm divide-y">
            <thead class="bg-gray-50 text-left">
              <tr>
                <th class="px-4 py-3">Tahun Elaun</th>
                <th class="px-4 py-3">Jenis Elaun</th>
                <th class="px-4 py-3">Status</th>
                <th class="px-4 py-3">Bilangan Penerima</th>
                <th class="px-4 py-3 w-40">Tindakan</th>
              </tr>
            </thead>
            <tbody class="divide-y">
              <tr v-if="loading">
                <td class="px-4 py-6 text-center text-gray-500" colspan="5">Memuatkan status senarai…</td>
              </tr>
              <tr v-for="row in rows" :key="row.id">
                <td class="px-4 py-3">{{ row.year }}</td>
                <td class="px-4 py-3">{{ typeOptions[row.typeCode] || row.typeCode }}</td>
                <td class="px-4 py-3">
                  <span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs" :class="statusBadgeClass(row.status)">
                    <span class="w-1.5 h-1.5 rounded-full" :class="statusDotClass(row.status)" />
                    {{ batchStatusLabel(row.status) }}
                  </span>
                </td>
                <td class="px-4 py-3">{{ row.count ?? '—' }}</td>
                <td class="px-4 py-3">
                  <button type="button" class="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs" @click="viewRecipients(row)">
                    Lihat Senarai Nama
                  </button>
                </td>
              </tr>
              <tr v-if="!loading && !rows.length">
                <td class="px-4 py-6 text-center text-gray-500" colspan="5">Tiada rekod. Pilih Tahun & Jenis Elaun, kemudian klik "Simpan" untuk cipta batch.</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const currentYear = new Date().getFullYear()
const yearOptions = [currentYear - 1, currentYear]

const typeOptions = {
  'ET-KPAK': 'Elaun Tahunan KPAK',
  'ET-KPAF': 'Elaun Tahunan KPAF',
  'ET-ANUG': 'Anugerah Penolong Amil',
  'ANUG-KPAK': 'Ketua Penolong Amil Kariah (KPAK) terbaik',
  'ANUG-PAK': 'Penolong Amil Kariah (PAK) terbaik',
  'ANUG-KPAF': 'Ketua Penolong Amil Fitrah (KPAF) terbaik',
  'ANUG-PAF': 'Penolong Amil Fitrah (PAF) terbaik',
  'ANUG-PAP': 'Penolong Amil Padi (PAP) terbaik',
  'ANUG-PAKPLUS': 'Penolong Amil Komuniti (PAK+) terbaik'
}

const filters = reactive({
  year: route.query.year ? Number(route.query.year) : '',
  type: route.query.type ? String(route.query.type) : ''
})

const typeLabel = computed(() => typeOptions[filters.type] || '')
const canQuery = computed(() => !!filters.year && !!filters.type)
const canSave = computed(() => canQuery.value && !loading.value)

const batchStatus = ref('DRAF')
const rows = ref([])
const loading = ref(false)

/* ---------- UI helpers status ---------- */
function statusBadgeClass(s) {
  if (s === 'MENUNGGU KELULUSAN') return 'bg-amber-50 text-amber-700'
  if (s === 'SEDANG PROSES') return 'bg-blue-50 text-blue-700'
  if (s === 'DILULUSKAN') return 'bg-emerald-50 text-emerald-700'
  if (s === 'DITOLAK') return 'bg-rose-50 text-rose-700'
  if (s === 'DRAF') return 'bg-gray-50 text-gray-700'
  return 'bg-gray-50 text-gray-700'
}
function statusDotClass(s) {
  if (s === 'MENUNGGU KELULUSAN') return 'bg-amber-500'
  if (s === 'SEDANG PROSES') return 'bg-blue-500'
  if (s === 'DILULUSKAN') return 'bg-emerald-500'
  if (s === 'DITOLAK') return 'bg-rose-500'
  if (s === 'DRAF') return 'bg-gray-400'
  return 'bg-gray-400'
}
function batchStatusLabel(s){
  // Papar lowercase untuk konsisten gaya
  return s ? s.toLowerCase() : '—'
}

/* ---------- Bilangan dalam kad ringkasan ---------- */
const totalCountDisplay = computed(() => {
  if (!rows.value.length) return '—'
  const r = rows.value[0]
  return r.count ?? '—'
})

/* ---------- Router & filter ---------- */
function onFilterChanged(){
  const q = {}
  if (filters.year) q.year = String(filters.year)
  if (filters.type) q.type = String(filters.type)
  router.replace({ query: q })

  rows.value = []
  batchStatus.value = 'DRAF'
  if (canQuery.value) reloadBatchStatus()
}

/* ---------- Simulasi "DB" & LocalStorage ---------- */
const savedBatches = new Map()

// Ambil bilangan penerima yang disimpan oleh skrin kedua
function getSavedCount(year, type) {
  const raw = localStorage.getItem(`et:count:${year}:${type}`)
  if (raw == null) return undefined
  const n = Number(raw)
  return Number.isFinite(n) ? n : undefined
}

// Ambil status yang diset oleh skrin kedua (cth: MENUNGGU KELULUSAN)
function getSavedStatus(year, type) {
  const s = localStorage.getItem(`et:status:${year}:${type}`)
  return s || undefined
}

async function apiFetchBatchStatus({year, type}){
  await sleep(300)
  const key = `${year}-${type}`
  const row = savedBatches.get(key)
  const count = getSavedCount(year, type)
  const statusFromLocal = getSavedStatus(year, type)

  if (!row) {
    if (count == null && !statusFromLocal) return []
    return [{
      id: `BATCH-${year}-${type}`,
      year,
      typeCode: type,
      status: statusFromLocal || 'DRAF',
      count: count ?? 0
    }]
  }
  // Ada batch dalam "DB": overlay count & status dari localStorage jika ada
  return [{
    ...row,
    count: count ?? row.count,
    status: statusFromLocal || row.status
  }]
}

async function apiSaveBatchLight({year, typeCode}){
  await sleep(500)
  const key = `${year}-${typeCode}`
  const existing = savedBatches.get(key)
  const countFromLocal = getSavedCount(year, typeCode)
  // Simpan sebagai "SEDANG PROSES" bila tekan Simpan di skrin pertama
  const payload = {
    id: `BATCH-${year}-${typeCode}`,
    year,
    typeCode,
    status: 'SEDANG PROSES',
    count: countFromLocal ?? existing?.count ?? 0,
    updatedAt: Date.now()
  }
  savedBatches.set(key, payload)
  return { batchId: payload.id, status: 'SEDANG PROSES' }
}

function sleep(ms){ return new Promise(res=>setTimeout(res, ms)) }

/* ---------- Load status ---------- */
async function reloadBatchStatus(){
  if (!canQuery.value) return
  loading.value = true
  try {
    const list = await apiFetchBatchStatus({ year: filters.year, type: filters.type })
    rows.value = list
    batchStatus.value = list[0]?.status || 'DRAF'
  } catch (e){
    console.error(e)
    alert('Gagal memuatkan status senarai.')
  } finally {
    loading.value = false
  }
}

/* ---------- Simpan batch ---------- */
async function onSave(){
  if (!canSave.value) return
  loading.value = true
  try{
    const res = await apiSaveBatchLight({ year: filters.year, typeCode: filters.type })
    batchStatus.value = res.status || 'SEDANG PROSES'
    await reloadBatchStatus()
    alert('Berjaya disimpan. Status batch kini: "sedang proses".')
  } catch (e){
    console.error(e)
    alert('Gagal menyimpan batch. Sila cuba lagi.')
  } finally {
    loading.value = false
  }
}

/* ---------- Pergi ke skrin kedua ---------- */
function viewRecipients(row){
  router.push({ path: '/BF-PA/PE/ET/01', query: { year: row.year, type: row.typeCode } })
}

watch(() => [filters.year, filters.type], ([y,t])=>{
  if (y && t && !rows.value.length) reloadBatchStatus()
}, { immediate: true })
</script>

<style scoped>
</style>
