<template>
  <div>
    <layouts-breadcrumb :items="breadcrumb" />

        <div class="flex justify-between items-center mb-3">
      <h1 class="text-2xl font-semibold flex items-center gap-2">
        <Icon name="ic:outline-info" />
        Butiran Permohonan Akses Peranan
      </h1>

      <!-- BUTANG KEMBALI (baru) -->
      <rs-button variant="secondary" @click="goBack" class="whitespace-nowrap">
        <Icon name="ic:round-arrow-back" class="mr-1" />
        Kembali
      </rs-button>
    </div>

    <!-- LAYOUT: 2 kolum -->
    <div class="grid gap-6 md:grid-cols-2 mt-4">

      <!-- KIRI: 3.1 Konfigurasi Akses Peranan -->
      <rs-card class="mt-0">
        <template #header>
          <h2 class="text-lg font-semibold">Konfigurasi Akses Peranan</h2>
        </template>
        <template #body>
          <div class="space-y-2">
            <div class="flex gap-3">
              <div class="w-48 font-semibold">Status Tugasan:</div>
              <div class="flex-1">{{ record.statusTugasan }}</div>
            </div>

            <div class="flex gap-3">
              <div class="w-48 font-semibold">Mod Akses:</div>
              <div class="flex-1">{{ record.modAkses }}</div>
            </div>

            <div v-if="record.modAkses === 'Kumpulan'" class="flex gap-3">
              <div class="w-48 font-semibold">Senarai Peranan:</div>
              <div class="flex-1">{{ record.perananIndividu }}</div>
            </div>

            <div v-if="record.modAkses === 'Per Individu'" class="flex gap-3">
              <div class="w-48 font-semibold">Senarai Pegawai:</div>
              <div class="flex-1">{{ record.perananIndividu }}</div>
            </div>

            <div class="flex gap-3">
              <div class="w-48 font-semibold">Status Konfigurasi:</div>
              <div class="flex-1">
                <rs-badge :variant="getStatusKonfigurasiVariant(record.statusKonfigurasi)">
                  {{ record.statusKonfigurasi }}
                </rs-badge>
              </div>
            </div>

            <div class="flex gap-3">
              <div class="w-48 font-semibold">Tarikh Mula Kuasa:</div>
              <div class="flex-1">{{ formatDate(record.tarikhMulaKuasa) }}</div>
            </div>

            <div class="flex gap-3">
              <div class="w-48 font-semibold">Catatan Permohonan:</div>
              <div class="flex-1">{{ record.catatanKemaskini || '-' }}</div>
            </div>

            <div class="flex gap-3">
              <div class="w-48 font-semibold">Dikemukakan oleh:</div>
              <div class="flex-1">{{ record.dikemukakanOleh }}</div>
            </div>

            <div class="flex gap-3">
              <div class="w-48 font-semibold">Tarikh Permohonan:</div>
              <div class="flex-1">{{ formatDate(record.tarikhPermohonan) }}</div>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- KANAN: 3.2 / 3.3 / 3.4 Maklumat Kelulusan (bersyarat) -->
      <rs-card class="mt-0">
        <template #header>
          <h2 class="text-lg font-semibold">Maklumat Kelulusan</h2>
        </template>
        <template #body>
          <!-- Status badge di atas -->
          <div class="mb-3">
            <span class="w-48 font-semibold inline-block mr-3">Status Kelulusan:</span>
            <rs-badge :variant="getStatusPermohonanVariant(record.statusPermohonan)">
              {{ record.statusPermohonan }}
            </rs-badge>
          </div>

          <!-- 3.2: Dipaparkan jika status 'Diluluskan' -->
          <div v-if="record.statusPermohonan === 'Diluluskan'" class="space-y-2">
            <div class="flex gap-3">
              <div class="w-48 font-semibold">Diluluskan Oleh:</div>
              <div class="flex-1">{{ record.diluluskanOleh || '-' }}</div>
            </div>
            <div class="flex gap-3">
              <div class="w-48 font-semibold">Tarikh Kelulusan:</div>
              <div class="flex-1">{{ formatDate(record.tarikhKelulusan) }}</div>
            </div>
            <div class="flex gap-3">
              <div class="w-48 font-semibold">Ulasan Ketua Jabatan:</div>
              <div class="flex-1 whitespace-pre-line">{{ record.ulasanKetuaJabatan || '-' }}</div>
            </div>
          </div>

          <!-- 3.3: Dipaparkan jika status 'Ditolak' -->
          <div v-else-if="record.statusPermohonan === 'Ditolak'" class="space-y-2">
            <div class="flex gap-3">
              <div class="w-48 font-semibold">Disemak Oleh:</div>
              <div class="flex-1">{{ record.disemakOleh || '-' }}</div>
            </div>
            <div class="flex gap-3">
              <div class="w-48 font-semibold">Tarikh Semakan:</div>
              <div class="flex-1">{{ formatDate(record.tarikhSemakan) }}</div>
            </div>
            <div class="flex gap-3">
              <div class="w-48 font-semibold">Ulasan Ketua Jabatan:</div>
              <div class="flex-1 whitespace-pre-line">{{ record.ulasanKetuaJabatan || '-' }}</div>
            </div>
          </div>

          <!-- 3.4: Dipaparkan jika status 'Menunggu Kelulusan' -->
          <div v-else class="space-y-2">
            <div class="text-gray-700">Permohonan ini masih menunggu tindakan kelulusan.</div>
          </div>
        </template>
      </rs-card>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({ title: 'ADN-PK-KA-02_3 • Butiran Permohonan Akses Peranan' })

const breadcrumb = [
  { name: 'Akses Peranan', type: 'link', path: '/BF-ADN/KA' },
  { name: 'Senarai Permohonan Kelulusan', type: 'link', path: '/BF-ADN/KA/senarai-permohonan-kelulusan' },
  { name: 'Butiran Permohonan', type: 'text', path: '/BF-ADN/KA/ADN-PK-KA-02_3' },
]

/* ===== Dataset selari dengan 02_2 (id 1 & 2) + maklumat kelulusan ===== */
const listData = [
  {
    id: 1,
    statusTugasan: 'Siasatan Ringkas',
    modAkses: 'Kumpulan',
    perananIndividu: 'KOAD, EPOAD',
    statusKonfigurasi: 'Aktif',
    tarikhMulaKuasa: '2025-09-15',
    statusPermohonan: 'Menunggu Kelulusan',
    catatanKemaskini: 'Permohonan baru dikemukakan untuk semakan',
    dikemukakanOleh: 'admin2',
    tarikhPermohonan: '2025-09-14',
    // tiada maklumat kelulusan lagi
  },
  {
    id: 2,
    statusTugasan: 'Quick Assessment',
    modAkses: 'Per Individu',
    perananIndividu: 'Nazri Bin Ali',
    statusKonfigurasi: 'Aktif',
    tarikhMulaKuasa: '2025-09-18',
    statusPermohonan: 'Diluluskan',
    catatanKemaskini: 'Tambah akses individu.',
    dikemukakanOleh: 'Siti Sarah',
    tarikhPermohonan: '2025-09-19',
    // Maklumat kelulusan (contoh)
    diluluskanOleh: 'Ketua Jabatan (KOAD)',
    tarikhKelulusan: '2025-09-20',
    ulasanKetuaJabatan: 'Permohonan disahkan. Akses diperlukan untuk tugas lapangan.',
  },
  // Jika mahu contoh Ditolak, boleh tambah id:3 di sini.
]

/* Ambil id dari route/query */
const route = useRoute()
const selectedId = computed(() => Number(route.params.id || route.query.id || 0))
const record = computed(() => listData.find(r => r.id === selectedId.value) || listData[0])

/* Helpers */
function formatDate (iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${day}/${m}/${y}`
}
function getStatusKonfigurasiVariant (t) {
  if (t === 'Aktif') return 'success'
  if (t === 'Tidak Aktif') return 'danger'
  return 'secondary'
}
function getStatusPermohonanVariant (t) {
  if (t === 'Diluluskan') return 'success'
  if (t === 'Ditolak') return 'danger'
  if (t === 'Menunggu Kelulusan') return 'warning'
  return 'secondary'
}

function goBack() {
  navigateTo('/BF-ADN/KF/senarai-permohonan-kelulusan-akses-peranan')
}

</script>

<style scoped>
/* Ubah lebar label jika perlu: w-48 -> w-56/w-64 */
</style>
