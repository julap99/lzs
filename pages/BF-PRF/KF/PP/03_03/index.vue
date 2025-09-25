<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <h2 class="text-xl font-semibold">Kemaskini Proses Komponen</h2>
      </template>

      <template #body>
        <div v-if="loading" class="py-6 text-gray-500">Memuatkan...</div>
        <div v-else-if="!record" class="py-6 text-red-600">Rekod tidak ditemui.</div>

        <!-- FormKit Form -->
        <FormKit
          v-else
          type="form"
          :actions="false"
          :value="form"
          @submit="onSubmit"
          form-class="space-y-4"
        >
          <!-- Hidden key (3.6.1) -->
          <FormKit type="hidden" name="idKomponenProfiling" v-model="idKomponenProfiling" />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- 3.6.2 Nama Pendaftaran -->
            <FormKit
              type="text"
              name="namaPendaftaran"
              label="Nama Pendaftaran"
              validation="required"
              :options="[{ label: 'Pendaftaran Lengkap', value: 'Pendaftaran Lengkap' }]"
            />

            <!-- 3.6.3 Kod Proses -->
            <FormKit
              type="text"
              name="kodProses"
              label="Kod Proses"
              placeholder="cth: KP001"
              validation="required|matches:/^[A-Za-z0-9_-]+$/"
              :validation-messages="{ matches: 'Hanya huruf/nombor/penghubung/garis bawah dibenarkan.' }"
            />

            <!-- 3.6.4 ID Menu -->
            <FormKit
              type="text"
              name="idMenu"
              label="ID Menu"
              placeholder="cth: 1"
              validation="required|number"
            />

            <!-- 3.6.5 Tarikh Mula -->
            <FormKit
              type="date"
              name="tarikhMula"
              label="Tarikh Mula"
              validation="required"
            />

            <!-- 3.6.6 Status Data -->
            <FormKit
              type="select"
              name="statusData"
              label="Status Data"
              validation="required"
              :options="[
                { label: 'Draf', value: 'Draf' },
                { label: 'Menunggu Kelulusan', value: 'Menunggu Kelulusan' },
              ]"
            />

            <!-- Extra: Status -->
            <FormKit
              type="radio"
              name="status"
              label="Status"
              :options="[
                { label: 'Aktif', value: 'Aktif' },
                { label: 'Tidak Aktif', value: 'Tidak Aktif' },
              ]"
              :value="'Aktif'"
              options-class="flex gap-6"
            />

            <!-- Keterangan -->
            <FormKit
              type="textarea"
              name="keterangan"
              label="Keterangan"
              placeholder="Masukkan keterangan ringkas"
              rows="4"
              outer-class="md:col-span-2"
            />

            <!-- Tarikh Tamat (optional) -->
            <FormKit
              type="date"
              name="tarikhTamat"
              label="Tarikh Tamat"
            />
          </div>

          <div class="flex justify-between items-center pt-4">
            <rs-button btnType="button" variant="secondary" @click="onCancel">
              <Icon name="mdi:arrow-left" class="mr-1" /> Kembali
            </rs-button>
            <rs-button btnType="submit" variant="primary">
              <Icon name="mdi:content-save" class="mr-1" /> Kemaskini
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// Ensure FormKit is globally registered in your Nuxt/Vue app.

definePageMeta({
  title: 'Kemaskini Proses Komponen',
})

const breadcrumb = ref([
  { name: 'Profiling', type: 'link', path: '/BF-PRF/KF/HK/admin' },
  { name: 'Konfigurasi Proses Komponen', type: 'link', path: '/BF-PRF/KF/PP/03_01' },
  { name: 'Kemaskini', type: 'current', path: '/BF-PRF/KF/PP/03_03' },
])

const STORAGE_KEY = 'prosesKomponen'
const loading = ref(true)
const record = ref(null)

// Hidden key (3.6.1)
const idKomponenProfiling = ref('')

// Form data aligned with 3.6.2–3.6.6 (+ extras)
const form = ref({
  idKomponenProfiling: '',
  namaPendaftaran: 'Pendaftaran Lengkap', // 3.6.2
  kodProses: '',                          // 3.6.3
  idMenu: '1',                            // 3.6.4
  tarikhMula: '',                         // 3.6.5
  statusData: 'Draf',                     // 3.6.6
  // extras
  status: 'Aktif',
  keterangan: '',
  tarikhTamat: '',
})

// Legacy/default sample (used only for demo/fallback)
const defaultData = [
  {
    idKomponenProfiling: 'PP001',
    namaPendaftaran: 'Pendaftaran Lengkap',
    kodProses: 'PP001',
    idMenu: '1',
    tarikhMula: '2025-01-01',
    statusData: 'Draf',
    // extras
    status: 'Aktif',
    keterangan: 'Proses Komponen untuk ketua keluarga',
    tarikhTamat: '',
  },
]

// --- Storage helpers ---
function readLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    console.error('Fail to read localStorage', e)
    return []
  }
}

function writeLocal(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch (e) {
    console.error('Fail to write localStorage', e)
  }
}

function formatToInputDate(dateString) {
  if (!dateString) return ''
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}

function onCancel() {
  navigateTo('/BF-PRF/KF/PP/03_01')
}

function onSubmit(payload) {
  // FormKit passes the resolved form data as `payload`
  const data = payload || form.value

  // Validate required (defensive – FormKit also validates)
  if (!data.namaPendaftaran || !data.kodProses || !data.idMenu || !data.tarikhMula || !data.statusData) {
    alert('Sila lengkapkan medan wajib.')
    return
  }

  // Ensure hidden key (3.6.1). Prefer existing key; fallback to current kodProses.
  const key = idKomponenProfiling.value || data.kodProses

  const updatedItem = {
    idKomponenProfiling: key,                 // 3.6.1 (hidden)
    namaPendaftaran: data.namaPendaftaran,    // 3.6.2
    kodProses: data.kodProses,                // 3.6.3
    idMenu: data.idMenu,                      // 3.6.4
    tarikhMula: data.tarikhMula,              // 3.6.5
    statusData: data.statusData,              // 3.6.6
    // extras
    status: data.status,
    keterangan: data.keterangan,
    tarikhTamat: data.tarikhTamat,
  }

  const list = readLocal()
  const merged = [...defaultData, ...list]

  // Find by hidden key, or legacy keys for backward-compatibility
  const idx = merged.findIndex((x) =>
    x.idKomponenProfiling === record.value?.idKomponenProfiling ||
    x.idKomponenProfiling === key ||
    x.kodProses === record.value?.kodProses
  )

  if (idx >= 0) {
    merged[idx] = { ...merged[idx], ...updatedItem }
    // Save back only non-default items
    const nonDefault = merged.filter(item =>
      !defaultData.some(def => def.idKomponenProfiling === item.idKomponenProfiling)
    )
    writeLocal(nonDefault)

    const { $toast } = useNuxtApp()
    if ($toast) $toast.success('Data berjaya dikemaskini')
    else alert('Data berjaya dikemaskini')

    navigateTo('/BF-PRF/KF/PP/03_01')
  } else {
    alert('Rekod tidak ditemui untuk dikemaskini.')
  }
}

onMounted(() => {
  const route = useRoute()
  const id = route.query.id

  const localList = readLocal()
  const merged = [...defaultData, ...localList]

  // Accept id by multiple shapes: idKomponenProfiling (new), kodProses (legacy)
  const found = id
    ? merged.find((x) =>
        x.idKomponenProfiling === id ||
        x.kodProses === id
      )
    : null

  if (found) {
    record.value = found
    idKomponenProfiling.value = found.idKomponenProfiling || found.kodProses

    form.value = {
      idKomponenProfiling: idKomponenProfiling.value,
      namaPendaftaran: found.namaPendaftaran || 'Pendaftaran Lengkap',
      kodProses: found.kodProses || idKomponenProfiling.value || '',
      idMenu: (found.idMenu ?? '1').toString(),
      tarikhMula: formatToInputDate(found.tarikhMula),
      statusData: found.statusData || 'Draf',
      // extras
      status: found.status || 'Aktif',
      keterangan: found.keterangan || '',
      tarikhTamat: formatToInputDate(found.tarikhTamat),
    }
  }

  loading.value = false
})
</script>

<style scoped>
/* Optional: rely on FormKit default theme + rs-card styles */
</style>
