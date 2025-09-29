<template>
  <div class="p-4">
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- ===== DETAILS (your original 01_04 content) ===== -->
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

    <!-- ===== KELULUSAN (approval form card) ===== -->
    <RsCard class="mt-4 p-4">
      <template #header>
        <h3 class="text-lg font-semibold">Kelulusan</h3>
      </template>

      <template #body>
        <div class="grid grid-cols-12 gap-6">
          <!-- Status Kelulusan -->
          <div class="col-span-12">
            <div class="label mb-2">Status Kelulusan</div>
            <div class="flex flex-wrap gap-6 text-sm">
              <label class="inline-flex items-center gap-2">
                <input type="radio" value="Lulus" v-model="approvalForm.statusKelulusan" />
                <span>Lulus</span>
              </label>
              <label class="inline-flex items-center gap-2">
                <input type="radio" value="Tolak" v-model="approvalForm.statusKelulusan" />
                <span>Tolak</span>
              </label>
            </div>
          </div>

          <!-- Catatan (always visible; required if Tolak) -->
          <div class="col-span-12">
            <div class="label mb-2">
              Catatan
              <span class="text-xs text-gray-500">(wajib jika status = Tolak)</span>
            </div>
            <textarea
              v-model.trim="approvalForm.catatan"
              rows="3"
              class="w-full border rounded px-3 py-2"
              :placeholder="isCatatanRequired ? 'Masukkan catatan (WAJIB apabila Tolak)' : 'Masukkan catatan (pilihan)'"
            ></textarea>
          </div>

          <!-- Tarikh Lulus -->
          <div class="col-span-12 md:col-span-6">
            <div class="label mb-2">Tarikh Lulus</div>
            <input
              type="date"
              v-model="approvalForm.tarikhLulus"
              class="w-full border rounded px-3 py-2"
            />
          </div>

          <!-- Nama Pelulus -->
          <div class="col-span-12 md:col-span-6">
            <div class="label mb-2">Nama Pelulus</div>
            <input
              type="text"
              v-model="approvalForm.namaPelulus"
              class="w-full border rounded px-3 py-2 bg-gray-50"
              readonly
            />
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-between mt-6">
          <rs-button variant="secondary" @click="goBack">
            <Icon name="mdi:arrow-left" class="mr-1" /> Kembali
          </rs-button>

          <div class="flex gap-2">
            <rs-button variant="primary" @click="handleSave">
              <Icon name="mdi:content-save" class="mr-1" /> Simpan
            </rs-button>
            <rs-button variant="primary" @click="handleHantar">
              <Icon name="mdi:send" class="mr-1" /> Hantar
            </rs-button>
          </div>
        </div>
      </template>
    </RsCard>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

definePageMeta({
  title: 'EX-PRF-KF-LK-01_04 | Lihat Maklumat Level Kelulusan',
})

/* ===== Toast (Nuxt) ===== */
const { $toast } = useNuxtApp() || {}

/* ===== Breadcrumb ===== */
const breadcrumb = ref([
  { name: 'Profiling', type: 'link', path: '/BF-PRF/KF/LK/01_01' },
  { name: 'Senarai Maklumat Level Kelulusan', type: 'link', path: '/BF-PRF/KF/LK/01_01' },
  { name: 'Lihat', type: 'current', path: '/BF-PRF/KF/LK/01_04' },
])

/* ===== Storage / data ===== */
const STORAGE_KEY = 'levelKelulusanList'
const record = ref(null)

function readList () {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr : []
  } catch { return [] }
}

/* ===== Helpers ===== */
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

/* ===== Load record by ?id ===== */
onMounted(() => {
  const route = useRoute()
  const id = route.query.id
  const list = readList()
  record.value = list.find(x => String(x.idLevelKelulusan ?? x.id) === String(id)) || null
})

/* ===== Kelulusan form state & actions ===== */
const currentUser = { name: 'Admin' } // ganti dengan user NAS sebenar
const approvalForm = ref({
  statusKelulusan: 'Lulus',                              // 3.4.1
  catatan: '',                                           // 3.4.2 (required if 'Tolak')
  tarikhLulus: new Date().toISOString().slice(0, 10),    // 3.4.3 default today
  namaPelulus: currentUser.name,                         // 3.4.4 user login
})

const isCatatanRequired = computed(
  () => approvalForm.value.statusKelulusan === 'Tolak'
)

// 2.2 Simpan (simpan draf kelulusan) + toast
function handleSave () {
  const drafKey = 'levelKelulusanApprovalDraft'
  const id = useRoute().query.id
  const payload = { id, ...approvalForm.value }

  try {
    const raw = localStorage.getItem(drafKey)
    const arr = raw ? JSON.parse(raw) : []
    const idx = arr.findIndex(x => String(x.id) === String(id))
    if (idx >= 0) arr[idx] = payload
    else arr.push(payload)
    localStorage.setItem(drafKey, JSON.stringify(arr))

    $toast?.success?.('Draf kelulusan disimpan.') || alert('Draf kelulusan disimpan.')
  } catch (e) {
    console.error('Gagal simpan draf kelulusan:', e)
    $toast?.error?.('Ralat menyimpan draf kelulusan.') || alert('Ralat menyimpan draf kelulusan.')
  }
}

// 2.3 Hantar (notifikasi + update statusData → redirect 02_01) + toast
function handleHantar () {
  // Validasi: jika 'Tolak', catatan mesti ada
  if (isCatatanRequired.value && !approvalForm.value.catatan.trim()) {
    $toast?.error?.('Catatan diperlukan apabila status = Tolak.') || alert('Catatan diperlukan apabila status = Tolak.')
    return
  }

  try {
    const listKey = 'levelKelulusanList'
    const id = useRoute().query.id
    const list = JSON.parse(localStorage.getItem(listKey) || '[]')
    const idx = list.findIndex(x => String(x.idLevelKelulusan ?? x.id) === String(id))
    if (idx >= 0) {
      // Tukar statusData ikut keputusan
      list[idx].statusData = approvalForm.value.statusKelulusan === 'Lulus' ? 'Lulus' : 'Tolak'

      // Simpan “notifikasi” ringkas (3.5.*)
      const notif = {
        pelulusId: 'PELULUS_ID',                         // 3.5.1
        adminId: 'ADMIN_ID',                             // 3.5.2
        daripada: 'PELULUS_ID',                          // 3.5.3
        header: 'Keputusan Kelulusan Konfigurasi Level Kelulusan', // 3.5.4
        mesej: `Konfigurasi Level Kelulusan ${list[idx].tableName} – ${list[idx].statusData}`, // 3.5.5
        penerima: 'ADMIN_ID',                            // 3.5.6
        tarikh: new Date().toISOString(),                // 3.5.7
        keputusan: { ...approvalForm.value },
        idLevelKelulusan: list[idx].idLevelKelulusan,
      }
      const notifKey = 'levelKelulusanNotifikasi'
      const nArr = JSON.parse(localStorage.getItem(notifKey) || '[]')
      nArr.push(notif)
      localStorage.setItem(notifKey, JSON.stringify(nArr))

      // Persist main list change
      localStorage.setItem(listKey, JSON.stringify(list))
    }

    // Toast berjaya
    $toast?.success?.(
      `Keputusan kelulusan (${approvalForm.value.statusKelulusan}) telah dihantar kepada Admin.`
    ) || alert(`Keputusan kelulusan (${approvalForm.value.statusKelulusan}) telah dihantar kepada Admin.`)

    // Redirect ke senarai 02_01 (akan paparkan status terkini)
    navigateTo('/BF-PRF/KF/LK/02_01')
  } catch (e) {
    console.error('Gagal hantar kelulusan:', e)
    $toast?.error?.('Ralat ketika menghantar keputusan. Sila cuba lagi.') || alert('Ralat ketika menghantar keputusan. Sila cuba lagi.')
  }
}
</script>

<style scoped>
.label { @apply text-sm text-gray-600; }
.section-title { @apply text-sm font-semibold mb-2; }

/* Make spans/blocks look like readonly inputs */
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

.muted { @apply text-gray-500; }
</style>
