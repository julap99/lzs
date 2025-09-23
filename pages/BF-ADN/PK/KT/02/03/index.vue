<template>
  <div>
    <!-- Breadcrumb -->
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Title -->
    <h2 class="text-xl font-bold mb-6 text-center">
      Butiran Permohonan Kategori Masalah
    </h2>

    <!-- Butiran Permohonan -->
    <div class="border-l-4 border-blue-600 bg-white shadow rounded p-4 mb-6">
      <h3 class="font-bold mb-4">Butiran Permohonan</h3>
      <p><span class="font-medium">ID Permohonan:</span> {{ permohonan.id }}</p>
      <p><span class="font-medium">Kategori Masalah:</span> {{ permohonan.kategori }}</p>
      <p><span class="font-medium">Tahap Aduan:</span> {{ permohonan.tahap }}</p>
      <p><span class="font-medium">Penerangan:</span> {{ permohonan.penerangan }}</p>
      <p>
        <span class="font-medium">Status Permohonan:</span>
        <span
          v-if="permohonan.status === 'Diluluskan'"
          class="bg-green-600 text-white text-xs px-2 py-1 rounded"
        >
          Diluluskan
        </span>
        <span
          v-else-if="permohonan.status === 'Ditolak'"
          class="bg-red-600 text-white text-xs px-2 py-1 rounded"
        >
          Ditolak
        </span>
        <span
          v-else
          class="bg-orange-400 text-white text-xs px-2 py-1 rounded"
        >
          Menunggu Kelulusan
        </span>
      </p>
      <p><span class="font-medium">Tarikh Permohonan:</span> {{ permohonan.tarikh }}</p>
      <p><span class="font-medium">Dikemukakan Oleh:</span> {{ permohonan.dikemukakanOleh }}</p>
    </div>

    <!-- Maklumat Kelulusan -->
    <div class="border-l-4 border-blue-600 bg-white shadow rounded p-4 mb-6">
      <h3 class="font-bold mb-4">Maklumat Kelulusan</h3>
      <p><span class="font-medium">Diluluskan Oleh:</span> {{ kelulusan.diluluskanOleh }}</p>
      <p><span class="font-medium">Tarikh Kelulusan:</span> {{ kelulusan.tarikhKelulusan }}</p>
      <p>
        <span class="font-medium">Status:</span>
        <span
          v-if="kelulusan.status === 'Diluluskan'"
          class="bg-green-600 text-white text-xs px-2 py-1 rounded"
        >
          Diluluskan
        </span>
        <span
          v-else-if="kelulusan.status === 'Ditolak'"
          class="bg-red-600 text-white text-xs px-2 py-1 rounded"
        >
          Ditolak
        </span>
        <span
          v-else
          class="bg-orange-400 text-white text-xs px-2 py-1 rounded"
        >
          Menunggu Kelulusan
        </span>
      </p>
      <p><span class="font-medium">Ditolak Oleh:</span> {{ kelulusan.ditolakOleh }}</p>
      <p><span class="font-medium">Tarikh Penolakan:</span> {{ kelulusan.tarikhPenolakan }}</p>
      <p><span class="font-medium">Ulasan Penolakan:</span></p>
      <div class="bg-gray-100 p-2 rounded border text-sm">
        {{ kelulusan.ulasan }}
      </div>
    </div>

    <!-- Status Info -->
    <div class="bg-gray-100 p-3 rounded border-l-4 border-blue-600">
      <p>
        <span class="font-medium">Status:</span>
        <span class="bg-orange-400 text-white text-xs px-2 py-1 rounded">
          Menunggu Kelulusan
        </span>
      </p>
      <p class="mt-2">
        Permohonan ini sedang dalam semakan Ketua Jabatan.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Butiran Permohonan Kategori Masalah",
  path: "/BF-ADN/PK//KT/02/03",
});

const breadcrumb = ref([
  { name: "Pengurusan SLA", type: "link", path: "/BF-ADN/SLA" },
  { name: "Senarai Permohonan Kelulusan", type: "link", path: "/BF-ADN/PK/02/01" },
  { name: "Butiran Permohonan", type: "current", path: "/BF-ADN/PK/02/03" },
]);

// Example data (static for now, can be made dynamic)
const permohonan = ref({
  id: "KM-PR-0012",
  kategori: "Tiada Tempat Tinggal",
  tahap: "Kelas 1 (Merah)",
  penerangan: "Pemohon kehilangan tempat tinggal kekal akibat bencana.",
  status: "Diluluskan",
  tarikh: "2025-09-14",
  dikemukakanOleh: "Eksekutif_A",
});

const kelulusan = ref({
  diluluskanOleh: "KetuaJabatan_1",
  tarikhKelulusan: "2025-09-15",
  status: "Ditolak",
  ditolakOleh: "KetuaJabatan_1",
  tarikhPenolakan: "2025-09-15",
  ulasan: "Penerangan tidak lengkap, sila semak dan hantar semula.",
});
</script>
