<template>
  <div>
    <h1 class="text-2xl font-bold text-left mb-6">
      Butiran Permohonan Kategori Masalah
    </h1>

    <!-- Kad 1: Butiran Permohonan -->
    <rs-card class="mb-6">
      <template #header>
        <div class="text-lg font-semibold">Butiran Permohonan</div>
      </template>
      <template #body>
        <div class="space-y-3">
          <div class="flex gap-3">
            <div class="font-semibold min-w-[190px]">ID Permohonan:</div>
            <div class="flex-1">{{ idPermohonan }}</div>
          </div>

          <div class="flex gap-3">
            <div class="font-semibold min-w-[190px]">Kategori Masalah:</div>
            <div class="flex-1">{{ kategoriMasalah }}</div>
          </div>

          <div class="flex gap-3">
            <div class="font-semibold min-w-[190px]">Tahap Aduan:</div>
            <div class="flex-1">{{ tahapAduan }}</div>
          </div>

          <div class="flex gap-3">
            <div class="font-semibold min-w-[190px]">Penerangan:</div>
            <div class="flex-1">{{ penerangan }}</div>
          </div>

          <div class="flex gap-3 items-center">
            <div class="font-semibold min-w-[190px]">Status Permohonan:</div>
            <div class="flex-1">
              <rs-badge variant="success">Diluluskan</rs-badge>
            </div>
          </div>

          <div class="flex gap-3">
            <div class="font-semibold min-w-[190px]">Tarikh Permohonan:</div>
            <div class="flex-1">{{ tarikhPermohonan }}</div>
          </div>

          <div class="flex gap-3">
            <div class="font-semibold min-w-[190px]">Dikemukakan Oleh:</div>
            <div class="flex-1">{{ dikemukakanOleh }}</div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Kad 2: Maklumat Kelulusan -->
    <rs-card>
      <template #header>
        <div class="text-lg font-semibold">Maklumat Kelulusan</div>
      </template>
      <template #body>
        <div class="space-y-3">
          <div class="flex gap-3">
            <div class="font-semibold min-w-[190px]">Diluluskan Oleh:</div>
            <div class="flex-1">{{ diluluskanOleh }}</div>
          </div>

          <div class="flex gap-3">
            <div class="font-semibold min-w-[190px]">Tarikh Kelulusan:</div>
            <div class="flex-1">{{ tarikhKelulusan }}</div>
          </div>

          <div class="flex gap-3 items-center">
            <div class="font-semibold min-w-[190px]">Status:</div>
            <div class="flex-1">
              <rs-badge variant="danger">Ditolak</rs-badge>
            </div>
          </div>

          <div class="flex gap-3">
            <div class="font-semibold min-w-[190px]">Ditolak Oleh:</div>
            <div class="flex-1">{{ ditolakOleh }}</div>
          </div>

          <div class="flex gap-3">
            <div class="font-semibold min-w-[190px]">Tarikh Penolakan:</div>
            <div class="flex-1">{{ tarikhPenolakan }}</div>
          </div>

          <!-- Ulasan Penolakan (blok kelabu) -->
          <div class="border-l-4 border-gray-300 bg-gray-100 px-3 py-2 rounded">
            <div class="text-sm">
              {{ ulasanPenolakan }}
            </div>
          </div>

          <!-- Status Menunggu (badge oren dalam blok kelabu) -->
          <div class="border-l-4 border-gray-300 bg-gray-100 px-3 py-2 rounded flex items-center gap-3">
            <div class="font-semibold">Status:</div>
            <rs-badge variant="warning">Menunggu Kelulusan</rs-badge>
          </div>

          <!-- Nota tambahan (blok kelabu) -->
          <div class="border-l-4 border-gray-300 bg-gray-100 px-3 py-2 rounded">
            <div class="text-sm">
              {{ notaSemakan }}
            </div>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
definePageMeta({ title: 'Butiran Permohonan Kategori Masalah' })

/* ==== Mock data (read-only) — sama seperti screenshot ==== */
const idPermohonan   = 'KM-PR-0013'
const kategoriMasalah = 'Kekurangan Sumber Pendapatan'
const tahapAduan     = '	Kelas 2 (Kuning)'
const penerangan     = 'Pemohon Kekurangan Sumber Pendapatan.'
const tarikhPermohonan = '2025-09-14'
const dikemukakanOleh  = 'Eksekutif_A'

const diluluskanOleh   = 'KetuaJabatan_1'
const tarikhKelulusan  = '2025-09-15'
const ditolakOleh      = 'KetuaJabatan_1'
const tarikhPenolakan  = '2025-09-15'
const ulasanPenolakan  = 'Penerangan tidak lengkap, sila semak dan hantar semula.'
const notaSemakan      = 'Permohonan ini sedang dalam semakan Ketua Jabatan.'
</script>

<style scoped>
/* Guna utiliti Tailwind + komponen RS; tiada CSS tambahan diperlukan */
</style>
