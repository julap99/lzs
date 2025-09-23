<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Maklumat Proses Komponen</h2>
        </div>
      </template>

      <template #body>
        <div v-if="loading" class="py-6 text-gray-500">Memuatkan...</div>
        <div v-else-if="!record" class="py-6 text-red-600">Rekod tidak ditemui.</div>

        <!-- Read-only FormKit form -->
        <FormKit
          v-else
          type="form"
          :actions="false"
          :value="form"
          form-class="space-y-4"
        >
          <!-- Hidden key (3.6.1) -->
          <FormKit type="hidden" name="idKomponenProfiling" v-model="form.idKomponenProfiling" />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- 3.6.2 Nama Pendaftaran -->
            <FormKit
              type="text"
              name="namaPendaftaran"
              label="Nama Pendaftaran"
              :disabled="true"
            />

            <!-- 3.6.3 Kod Proses -->
            <FormKit
              type="text"
              name="kodProses"
              label="Kod Proses"
              :disabled="true"
            />

            <!-- 3.6.4 ID Menu -->
            <FormKit
              type="text"
              name="idMenu"
              label="ID Menu"
              :disabled="true"
            />

            <!-- 3.6.5 Tarikh Mula -->
            <FormKit
              type="date"
              name="tarikhMula"
              label="Tarikh Mula"
              :disabled="true"
            />

            <!-- Optional: Tarikh Tamat -->
            <FormKit
              type="date"
              name="tarikhTamat"
              label="Tarikh Tamat"
              :disabled="true"
            />

            <!-- Extra: Status (radio shown as static) -->
            <div>
              <label class="block text-sm font-medium mb-2">Status</label>
              <rs-badge :variant="getStatusVariant(form.status)">{{ form.status || '-' }}</rs-badge>
            </div>

            <!-- 3.6.6 Status Data (static badge) -->
            <div>
              <label class="block text-sm font-medium mb-2">Status Data</label>
              <rs-badge :variant="getStatusVariant(form.statusData)">{{ form.statusData || '-' }}</rs-badge>
            </div>

            <!-- Optional: Keterangan -->
            <FormKit
              type="textarea"
              name="keterangan"
              label="Keterangan"
              :disabled="true"
              rows="4"
              outer-class="md:col-span-2"
            />
          </div>
        </FormKit>
      </template>
    </rs-card>

    <div class="mt-4">
      <rs-button btnType="button" variant="secondary" @click="goBack">
        <Icon name="mdi:arrow-left" class="mr-1" /> Kembali
      </rs-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({ title: 'Lihat Proses Komponen' })

const breadcrumb = ref([
  { name: 'Profiling', type: 'link', path: '/BF-PRF/KF/HK/admin' },
  { name: 'Konfigurasi Proses Komponen', type: 'link', path: '/BF-PRF/KF/PP/03_01' },
  { name: 'Lihat', type: 'current', path: '/BF-PRF/KF/PP/03_04' },
])

const loading = ref(true)
const record = ref(null)
const STORAGE_KEY = 'prosesKomponen'

const form = ref({
  idKomponenProfiling: '', // 3.6.1
  namaPendaftaran: 'Pendaftaran Lengkap', // 3.6.2
  kodProses: '', // 3.6.3
  idMenu: '1', // 3.6.4
  tarikhMula: '', // 3.6.5 (yyyy-MM-dd)
  statusData: 'Draf', // 3.6.6
  // extras
  status: 'Aktif',
  keterangan: '',
  tarikhTamat: '',
})

// Default sample aligned with 3.6.x
const defaultData = [
  {
    idKomponenProfiling: 'PP001', // 3.6.1 (hidden)
    namaPendaftaran: 'Pendaftaran Lengkap', // 3.6.2
    kodProses: 'PP001', // 3.6.3
    idMenu: '1', // 3.6.4
    tarikhMula: '2025-01-01', // 3.6.5
    statusData: 'Draf', // 3.6.6
    // extras
    status: 'Aktif',
    keterangan: 'Proses Komponen contoh',
    tarikhTamat: '',
  },
]

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

function formatToInputDate(dateString) {
  if (!dateString) return ''
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}

function getStatusVariant(status) {
  switch (status) {
    case 'Aktif': return 'success'
    case 'Tidak Aktif': return 'danger'
    case 'Menunggu Kelulusan': return 'warning'
    case 'Draf': return 'secondary'
    default: return 'default'
  }
}

function goBack() {
  navigateTo('/BF-PRF/KF/PP/03_01')
}

onMounted(() => {
  const route = useRoute()
  const id = route.query.id

  const localList = readLocal()
  const merged = [...defaultData, ...localList]

  // Prefer new key (idKomponenProfiling). Keep legacy fallbacks for safety.
  const found = merged.find((x) =>
    x.idKomponenProfiling === id ||
    x.kodProses === id ||
    x.idPP === id || // legacy
    x.idHadKifayah === id // legacy
  )

  if (found) {
    record.value = found
    form.value = {
      idKomponenProfiling: found.idKomponenProfiling || found.kodProses || '',
      namaPendaftaran: found.namaPendaftaran || 'Pendaftaran Lengkap',
      kodProses: found.kodProses || '',
      idMenu: (found.idMenu ?? '1').toString(),
      tarikhMula: formatToInputDate(found.tarikhMula),
      statusData: found.statusData || 'Draf',
      // extras
      status: found.status || '-',
      keterangan: found.keterangan || '',
      tarikhTamat: formatToInputDate(found.tarikhTamat),
    }
  }

  loading.value = false
})
</script>

<style scoped>
/* Rely on FormKit default theme + rs-card */
</style>
