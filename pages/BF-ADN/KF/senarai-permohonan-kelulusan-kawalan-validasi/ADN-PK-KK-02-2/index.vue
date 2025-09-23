<template>
  <div class="container">
    <layouts-breadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <h1 class="text-xl font-bold">Semakan & Kelulusan Akses Peranan</h1>
      </template>

      <template #body>
        <div class="grid grid-cols-2 gap-4">
          <!-- Butiran Konfigurasi Semasa -->
          <div class="p-4 border rounded-lg shadow-md">
            <h2 class="text-lg font-semibold">Butiran Konfigurasi Semasa</h2>
            <div><strong>Jenis Validasi:</strong> {{ validasiJenis }}</div>
            <div><strong>Status Konfigurasi:</strong> {{ statusKonfigurasi }}</div>
            <div><strong>Tarikh Mula Kuasa:</strong> {{ tarikhMulaKuasa }}</div>
            <div><strong>Parameter Kawalan:</strong> {{ parameterKawalan }}</div>
          </div>

          <!-- Butiran Permohonan -->
          <div class="p-4 border rounded-lg shadow-md">
            <h2 class="text-lg font-semibold">Butiran Permohonan</h2>
            <div><strong>Jenis Validasi:</strong> {{ validasiJenis }}</div>
            <div><strong>Catatan Permohonan:</strong> {{ catatanPermohonan }}</div>
            <div><strong>Tarikh Permohonan:</strong> {{ tarikhPermohonan }}</div>
            <div><strong>Dimohon Oleh:</strong> {{ dimohonOleh }}</div>
          </div>
        </div>

        <!-- Tindakan -->
        <div class="mt-4 p-4 border rounded-lg shadow-md">
          <h2 class="text-lg font-semibold">Tindakan</h2>
          <textarea v-model="ulasanPelulus" placeholder="Masukkan catatan kelulusan..." required></textarea>
          <div class="mt-3">
            <rs-button @click="luluskan" variant="success" size="sm">Luluskan</rs-button>
            <rs-button @click="tolak" variant="danger" size="sm" class="ml-3">Tolak Permohonan</rs-button>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({ title: 'Semakan & Kelulusan Akses Peranan' })

const breadcrumb = [
  { name: 'Mengurus Konfigurasi', type: 'link', path: '/BF-ADN/KF' },
  { name: 'Semakan & Kelulusan Akses Peranan', type: 'text', path: '/BF-ADN/KF/semakan-kelulusan-kawalan-validasi/ADN-PK-KK-02-2' },
]

const validasiJenis = ref('Validasi IC - Semak Duplikasi')
const statusKonfigurasi = ref('Aktif')
const tarikhMulaKuasa = ref('01-08-2025')
const parameterKawalan = ref('1 IC hanya boleh digunakan 1 kali dalam 90 hari')

const catatanPermohonan = ref('Ubah kepada 60 hari berdasarkan polisi baru.')
const tarikhPermohonan = ref('15-09-2025')
const dimohonOleh = ref('Siti Norlia')

const ulasanPelulus = ref('')

function luluskan() {
  // Simulate approval action
  alert("Permohonan telah diluluskan.")
}

function tolak() {
  // Simulate rejection action
  alert("Permohonan telah ditolak.")
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

textarea {
  width: 100%;
  height: 100px;
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
}

button {
  margin-top: 10px;
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

.rs-button {
  padding: 10px 20px;
  font-size: 14px;
}
</style>
