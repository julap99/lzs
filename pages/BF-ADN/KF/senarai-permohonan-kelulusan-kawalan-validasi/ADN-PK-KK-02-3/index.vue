<template>
  <div class="container">
    <layouts-breadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <h1 class="text-xl font-bold">Butiran Permohonan Kawalan Validasi</h1>
      </template>

      <template #body>
        <div class="grid grid-cols-2 gap-4">
          <!-- Butiran Permohonan -->
          <div class="p-4 border rounded-lg shadow-md">
            <h2 class="text-lg font-semibold">Butiran Permohonan</h2>
            <div><strong>Jenis Validasi:</strong> {{ currentData.validasiJenis }}</div>
            <div><strong>Tempoh Semakan:</strong> {{ currentData.tempohSemakan }}</div>
            <div v-if="currentData.validasiJenis === 'Validasi Negeri'"><strong>Senarai Negeri Baharu:</strong> {{ currentData.senaraiNegeri }}</div>
            <rs-badge :variant="statusKonfigurasiVariant">{{ currentData.statusKonfigurasi }}</rs-badge>
            <div><strong>Tarikh Mula Kuasa:</strong> {{ currentData.tarikhMulaKuasa }}</div>
            <div><strong>Catatan Permohonan:</strong> {{ currentData.catatanPermohonan }}</div>
            <div><strong>Dikemukakan Oleh:</strong> {{ currentData.dikemukakanOleh }}</div>
            <div><strong>Tarikh Permohonan:</strong> {{ currentData.tarikhPermohonan }}</div>
          </div>

          <!-- Maklumat Kelulusan - Diluluskan / Ditolak / Menunggu Kelulusan -->
          <div v-if="statusPermohonan === 'Diluluskan'" class="p-4 border rounded-lg shadow-md">
            <h2 class="text-lg font-semibold">Maklumat Kelulusan</h2>
            <div><strong>Diluluskan Oleh:</strong> {{ currentData.diluluskanOleh }}</div>
            <div><strong>Tarikh Kelulusan:</strong> {{ currentData.tarikhKelulusan }}</div>
            <div><strong>Ulasan Ketua Jabatan:</strong> {{ currentData.ulasanKetuaJabatan }}</div>
            <rs-badge :variant="statusKelulusanVariant">{{ currentData.statusKelulusan }}</rs-badge>
          </div>

          <div v-if="statusPermohonan === 'Ditolak'" class="p-4 border rounded-lg shadow-md">
            <h2 class="text-lg font-semibold">Maklumat Kelulusan</h2>
            <div><strong>Disemak Oleh:</strong> {{ currentData.disemakOleh }}</div>
            <div><strong>Tarikh Semakan:</strong> {{ currentData.tarikhSemakan }}</div>
            <div><strong>Ulasan Ketua Jabatan:</strong> {{ currentData.ulasanKetuaJabatan2 }}</div>
            <rs-badge :variant="statusKelulusanVariant">{{ currentData.statusKelulusan2 }}</rs-badge>
          </div>

          <div v-if="statusPermohonan === 'Menunggu Kelulusan'" class="p-4 border rounded-lg shadow-md">
            <h2 class="text-lg font-semibold">Maklumat Kelulusan</h2>
            <rs-badge :variant="statusKelulusanVariant">{{ currentData.statusKelulusan3 }}</rs-badge>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, reactive, watchEffect, onMounted } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({ title: 'Butiran Permohonan Kawalan Validasi' })

const breadcrumb = [
  { name: 'Mengurus Konfigurasi', type: 'link', path: '/BF-ADN/KF' },
  { name: 'Senarai Permohonan Kawalan Validasi', type: 'text', path: '/BF-ADN/KF/semakan-kelulusan-kawalan-validasi' },
  { name: 'Butiran Permohonan Kawalan Validasi', type: 'text', path: '/BF-ADN/KF/semakan-kelulusan-kawalan-validasi/ADN-PK-KK-02-3' },
]

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

const route = useRoute()
const selectedKey = ref(route.query.noPermohonan) // Get the noPermohonan from the route
const currentData = ref(mockData[selectedKey.value])

const statusPermohonan = ref(currentData.value.statusKelulusan)

function statusKonfigurasiVariant() {
  return currentData.value.statusKonfigurasi === 'Aktif' ? 'success' : 'danger'
}

function statusKelulusanVariant() {
  if (statusPermohonan.value === 'Diluluskan') return 'success'
  if (statusPermohonan.value === 'Ditolak') return 'danger'
  if (statusKelulusan2.value === 'Diluluskan') return 'success'
  if (statusKelulusan2.value === 'Ditolak') return 'danger'
  if (statusKelulusan3.value === 'Menunggu Kelulusan') return 'warning'
}

// Watch for route changes and update currentData accordingly
watchEffect(() => {
  if (route.query.noPermohonan) {
    selectedKey.value = route.query.noPermohonan
    currentData.value = mockData[selectedKey.value] || {}
    statusPermohonan.value = currentData.value.statusKelulusan || ''
  }
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.rs-badge {
  margin-top: 5px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.border {
  border: 1px solid #ddd;
}

.rounded-lg {
  border-radius: 8px;
}

.shadow-md {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
