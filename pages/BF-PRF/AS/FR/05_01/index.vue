
<template>
    <div class="container mx-auto px-4 py-6">
      <h2 class="text-2xl font-bold mb-4">Ringkasan Had Kifayah & Multidimensi</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Had Kifayah Summary -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold mb-2">Had Kifayah</h3>
    <div class="mb-2">Baki Pendapatan: <span class="font-bold">RM {{ hadKifayah?.bakiPendapatan?.toFixed(2) }}</span></div>
    <div class="mb-2">Peratusan Perbezaan: <span class="font-bold">{{ hadKifayah?.peratusanPendapatan?.toFixed(2) }}%</span></div>
    <div class="mb-2">Kategori Keluarga Asnaf: <span class="font-bold text-blue-700">{{ hadKifayah?.kategoriKeluarga }}</span></div>
    <div class="mb-2">Kategori Asnaf: <span class="font-bold text-blue-700">{{ hadKifayah?.kategoriAsnaf }}</span></div>
    <div class="mb-2">Jumlah Had Kifayah: <span class="font-bold">RM {{ hadKifayah?.kifayahLimit?.toFixed(2) }}</span></div>
        </div>
        <!-- Multidimensi Summary -->
        <div class="bg-blue-50 rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold mb-2">Multidimensi</h3>
          <div class="mb-2">Merit Keluarga: <span class="font-bold text-blue-700">0.55</span></div>
          <div class="mb-2">Status Multidimensi: <span class="font-bold text-green-700">Produktif C</span></div>
          <div class="mb-2">Quadrant: <span class="font-bold text-purple-700">Asnaf Produktif Sementara</span></div>
        </div>
      </div>
      <div class="mt-8 flex justify-end gap-4">
        <rs-button variant="primary-outline" @click="handleKembali">Kembali</rs-button>
        <rs-button variant="primary" @click="handleSeterusnya">Seterusnya</rs-button>
      </div>
    </div>
  </template>
  
  <script setup>
 
  const handleKembali = () => {
    navigateTo('/BF-PRF/AS/FR/05')
  }
  const handleSeterusnya = () => {
    navigateTo('/BF-PRF/AS/FR/07_1')
  }
  </script>
  