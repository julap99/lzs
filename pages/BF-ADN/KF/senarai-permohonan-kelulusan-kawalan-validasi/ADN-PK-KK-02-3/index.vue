<template>
  <div class="container">
    <layouts-breadcrumb :items="breadcrumb" />

    <!-- Header + Button Kembali -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Butiran Permohonan Kawalan Validasi</h1>

      <rs-button variant="secondary" @click="goBack" class="whitespace-nowrap">
        <Icon name="ic:round-arrow-back" class="mr-1" />
        Kembali
      </rs-button>
    </div>

    <!-- Kad 1: Butiran Permohonan (READ TEXT ONLY) -->
    <rs-card class="mb-6">
      <template #header>
        <div class="text-lg font-semibold">Butiran Permohonan</div>
      </template>
      <template #body>
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <div class="text-sm text-gray-500">Jenis Validasi</div>
            <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
              {{ currentData?.validasiJenis || '-' }}
            </div>
          </div>

          <div>
            <div class="text-sm text-gray-500">Tempoh Semakan</div>
            <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
              {{ currentData?.tempohSemakan || '-' }}
            </div>
          </div>

          <div v-if="showSenaraiNegeri">
            <div class="text-sm text-gray-500">Senarai Negeri Baharu</div>
            <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
              {{ currentData?.senaraiNegeri || '-' }}
            </div>
          </div>

          <div>
            <div class="text-sm text-gray-500">Status Konfigurasi</div>
            <div class="mt-1">
              <rs-badge :variant="statusKonfigurasiVariant">
                {{ currentData?.statusKonfigurasi || '-' }}
              </rs-badge>
            </div>
          </div>

          <div>
            <div class="text-sm text-gray-500">Tarikh Mula Kuasa</div>
            <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
              {{ currentData?.tarikhMulaKuasa || '-' }}
            </div>
          </div>

          <div class="md:col-span-2">
            <div class="text-sm text-gray-500">Catatan Permohonan</div>
            <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50 whitespace-pre-line">
              {{ currentData?.catatanPermohonan || '-' }}
            </div>
          </div>

          <div>
            <div class="text-sm text-gray-500">Dikemukakan Oleh</div>
            <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
              {{ currentData?.dikemukakanOleh || '-' }}
            </div>
          </div>

          <div>
            <div class="text-sm text-gray-500">Tarikh Permohonan</div>
            <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
              {{ currentData?.tarikhPermohonan || '-' }}
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Kad 2: Maklumat Kelulusan (READ TEXT ONLY) -->
    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Maklumat Kelulusan</div>
      </template>
      <template #body>
        <!-- Menunggu Kelulusan -->
        <div v-if="statusPermohonan === 'Menunggu Kelulusan'">
          <div class="flex justify-between items-center">
            <div class="text-sm text-gray-500">Status Semasa</div>
            <rs-badge :variant="approvalBadgeVariant">{{ waitingLabel }}</rs-badge>
          </div>
        </div>

        <!-- Diluluskan -->
        <div v-else-if="statusPermohonan === 'Diluluskan'" class="grid md:grid-cols-2 gap-4">
          <div>
            <div class="text-sm text-gray-500">Diluluskan Oleh</div>
            <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
              {{ currentData?.diluluskanOleh || '-' }}
            </div>
          </div>
          <div>
            <div class="text-sm text-gray-500">Tarikh Kelulusan</div>
            <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
              {{ currentData?.tarikhKelulusan || '-' }}
            </div>
          </div>
          <div class="md:col-span-2">
            <div class="text-sm text-gray-500">Ulasan Ketua Jabatan</div>
            <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50 whitespace-pre-line">
              {{ currentData?.ulasanKetuaJabatan || '-' }}
            </div>
          </div>
          <div class="md:col-span-2 text-right">
            <span class="mr-2 font-medium">Status Permohonan:</span>
            <rs-badge :variant="approvalBadgeVariant">{{ statusPermohonan }}</rs-badge>
          </div>
        </div>

        <!-- Ditolak -->
        <div v-else-if="statusPermohonan === 'Ditolak' " class="grid md:grid-cols-2 gap-4">
          <div>
            <div class="text-sm text-gray-500">Disemak Oleh</div>
            <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
              {{ currentData?.disemakOleh || '-' }}
            </div>
          </div>
          <div>
            <div class="text-sm text-gray-500">Tarikh Semakan</div>
            <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
              {{ currentData?.tarikhSemakan || '-' }}
            </div>
          </div>
          <div class="md:col-span-2">
            <div class="text-sm text-gray-500">Ulasan Ketua Jabatan</div>
            <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50 whitespace-pre-line">
              {{ currentData?.ulasanKetuaJabatan2 || '-' }}
            </div>
          </div>
          <div class="md:col-span-2 text-right">
            <span class="mr-2 font-medium">Status Permohonan:</span>
            <rs-badge :variant="approvalBadgeVariant">{{ statusPermohonan }}</rs-badge>
          </div>
        </div>

        <!-- Fallback status tak dikenali -->
        <div v-else>
          <div class="pt-2 text-right">
            <span class="mr-2 font-medium">Status Permohonan:</span>
            <rs-badge variant="secondary">{{ statusPermohonan || '-' }}</rs-badge>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, reactive, watchEffect, computed } from 'vue'
import { useRoute, useRouter } from '#imports'

definePageMeta({ title: 'Butiran Permohonan Kawalan Validasi' })

const router = useRouter()
const goBack = () => router.push('/BF-ADN/KF/senarai-permohonan-kelulusan-kawalan-validasi')

const breadcrumb = [
  { name: 'Mengurus Konfigurasi', type: 'link', path: '/BF-ADN/KF' },
  { name: 'Senarai Permohonan Kawalan Validasi', type: 'text', path: '/BF-ADN/KF/semakan-kelulusan-kawalan-validasi' },
  { name: 'Butiran Permohonan Kawalan Validasi', type: 'text', path: '/BF-ADN/KF/semakan-kelulusan-kawalan-validasi/ADN-PK-KK-02-3' },
]

/* Data asal (dikekalkan) */
const mockData = reactive({
  'KV-PR-0002': {
    validasiJenis: 'Validasi Negeri - Semak Negeri Dibenarkan',
    tempohSemakan: 'Setiap kali pendaftaran',
    senaraiNegeri: 'Selangor, Johor, Perak',
    statusKonfigurasi: 'Tidak Aktif',
    tarikhMulaKuasa: '13-09-2025',
    catatanPermohonan: 'Ubah kepada negeri dibenarkan berdasarkan polisi baru.',
    dikemukakanOleh: 'Ahmad Fauzi',
    tarikhPermohonan: '12-09-2025',
    diluluskanOleh: 'Siti Norlia',
    tarikhKelulusan: '14-09-2025',
    ulasanKetuaJabatan: 'Permohonan diluluskan berdasarkan keperluan semasa.',
    statusKelulusan: 'Diluluskan',
    disemakOleh: '',
    tarikhSemakan: '',
    ulasanKetuaJabatan2: '',
    statusKelulusan2: '',
    statusKelulusan3: 'Menunggu Kelulusan',
  },
  'KV-PR-0003': {
    validasiJenis: 'Validasi Warganegara - Semak Warganegara Sahaja',
    tempohSemakan: 'Setiap kali pendaftaran',
    statusKonfigurasi: 'Aktif',
    tarikhMulaKuasa: '15-09-2025',
    catatanPermohonan: 'Ubah kepada warganegara sahaja berdasarkan polisi baru.',
    dikemukakanOleh: 'Zainab Binti Ali',
    tarikhPermohonan: '14-09-2025',
    diluluskanOleh: '',
    tarikhKelulusan: '',
    ulasanKetuaJabatan: '',
    statusKelulusan: 'Ditolak',
    disemakOleh: 'Mohd Rizal',
    tarikhSemakan: '16-09-2025',
    ulasanKetuaJabatan2: 'Permohonan ditolak kerana tidak memenuhi syarat.',
    statusKelulusan2: 'Ditolak',
    statusKelulusan3: 'Menunggu Kelulusan',
  }
})

/* Pemilihan rekod ikut query string */
const route = useRoute()
const selectedKey = ref(route.query.noPermohonan)
const currentData = ref(mockData[selectedKey.value] || {})

/* Status permohonan utama */
const statusPermohonan = ref(currentData.value?.statusKelulusan || '')

/* Papar “Senarai Negeri Baharu” bila jenis validasi negeri */
const showSenaraiNegeri = computed(() => {
  const j = currentData.value?.validasiJenis || ''
  return j.toLowerCase().includes('negeri')
})

/* Badge variant untuk status konfigurasi */
const statusKonfigurasiVariant = computed(() => {
  const s = currentData.value?.statusKonfigurasi
  if (s === 'Aktif') return 'success'
  if (s === 'Tidak Aktif') return 'danger'
  return 'secondary'
})

/* Badge variant + label untuk status kelulusan */
const approvalBadgeVariant = computed(() => {
  if (statusPermohonan.value === 'Diluluskan') return 'success'
  if (statusPermohonan.value === 'Ditolak') return 'danger'
  if (statusPermohonan.value === 'Menunggu Kelulusan') return 'warning'
  return 'secondary'
})
const waitingLabel = computed(() => currentData.value?.statusKelulusan3 || 'Menunggu Kelulusan')

/* Sync bila route berubah */
watchEffect(() => {
  if (route.query.noPermohonan) {
    selectedKey.value = route.query.noPermohonan
    currentData.value = mockData[selectedKey.value] || {}
    statusPermohonan.value = currentData.value.statusKelulusan || ''
  }
})
</script>

<style scoped>
.container { max-width: 1200px; margin: 0 auto; }
</style>
