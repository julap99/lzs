<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Maklumat Proses Profiling</h2>
        </div>
      </template>

      <template #body>
        <div v-if="loading" class="py-6 text-gray-500">Memuatkan...</div>
        <div v-else-if="!record" class="py-6 text-red-600">Rekod tidak ditemui.</div>
        <div v-else class="space-y-2">
          <div class="flex items-start gap-2">
            <div class="text-sm text-gray-500 whitespace-nowrap min-w-[120px]">Kod Proses</div>
            <div class="font-medium flex-1">{{ record.kodProses || record.idHadKifayah }}</div>
          </div>
          <div class="flex items-start gap-2">
            <div class="text-sm text-gray-500 whitespace-nowrap min-w-[120px]">Nama Proses</div>
            <div class="font-medium flex-1">{{ record.namaProses || record.namaHadKifayah }}</div>
          </div>
          <div class="flex items-start gap-2">
            <div class="text-sm text-gray-500 whitespace-nowrap min-w-[120px]">Keterangan</div>
            <div class="font-medium flex-1 whitespace-pre-line">{{ record.keterangan || '-' }}</div>
          </div>
          <div class="flex items-start gap-2">
            <div class="text-sm text-gray-500 whitespace-nowrap min-w-[120px]">Tarikh Mula</div>
            <div class="font-medium flex-1">{{ formatDate(record.tarikhMula) }}</div>
          </div>
          <div class="flex items-start gap-2">
            <div class="text-sm text-gray-500 whitespace-nowrap min-w-[120px]">Tarikh Tamat</div>
            <div class="font-medium flex-1">{{ record.tarikhTamat ? formatDate(record.tarikhTamat) : '-' }}</div>
          </div>
          <div class="flex items-start gap-2">
            <div class="text-sm text-gray-500 whitespace-nowrap min-w-[120px]">Status</div>
            <div class="flex-1">
              <rs-badge :variant="getStatusVariant(record.status)">{{ record.status || '-' }}</rs-badge>
            </div>
          </div>
          <div class="flex items-start gap-2">
            <div class="text-sm text-gray-500 whitespace-nowrap min-w-[120px]">Status Data</div>
            <div class="flex-1">
              <rs-badge :variant="getStatusVariant(record.statusData)">{{ record.statusData || '-' }}</rs-badge>
            </div>
          </div>
        </div>
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

definePageMeta({
  title: 'Lihat Proses Profiling',
})

const breadcrumb = ref([
  { name: 'Profiling', type: 'link', path: '/BF-PRF/KF/HK/admin' },
  { name: 'Konfigurasi Proses Profiling', type: 'link', path: '/BF-PRF/KF/PP/01_01' },
  { name: 'Lihat', type: 'current', path: '/BF-PRF/KF/PP/01_01/lihat' },
])

const loading = ref(true)
const record = ref(null)
const STORAGE_KEY = 'prosesProfiling'

// Default data (same as listing fallback)
const defaultData = [
  {
    idHadKifayah: 'HK001',
    kodProses: 'PP001',
    namaProses: 'Proses Profiling Utama',
    namaHadKifayah: 'Ketua Keluarga',
    keterangan: 'Proses profiling untuk ketua keluarga',
    kategori: 'Utama',
    jenisIsiRumah: 'Ketua Keluarga',
    kadarBerbayar: 1215.0,
    kadarPercuma: 780.0,
    tarikhMula: '2025-01-01',
    status: 'Aktif',
    statusData: 'Draf',
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

function formatDate(dateString) {
  if (!dateString) return '-'
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleDateString('ms-MY', { year: 'numeric', month: 'short', day: 'numeric' })
}

function getStatusVariant(status) {
  switch (status) {
    case 'Aktif':
      return 'success'
    case 'Tidak Aktif':
      return 'danger'
    case 'Menunggu Kelulusan':
      return 'warning'
    case 'Draf':
      return 'secondary'
    default:
      return 'default'
  }
}

function goBack() {
  navigateTo('/BF-PRF/KF/PP/01_01')
}

onMounted(() => {
  const route = useRoute()
  const id = route.query.id
  const localList = readLocal()
  const merged = [...defaultData, ...localList]
  record.value = merged.find((x) => (x.idPP || x.kodProses || x.idHadKifayah) === id) || null
  loading.value = false
})
</script>

<style scoped>
</style>


