<template>
  <div>
    <!-- Breadcrumb -->
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Title -->
    <h2 class="text-xl font-bold mb-6">Senarai Permohonan Kelulusan</h2>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead>
          <tr class="bg-blue-600 text-white text-left">
            <th class="px-4 py-2">ID Permohonan</th>
            <th class="px-4 py-2">Jenis Permohonan</th>
            <th class="px-4 py-2">Kategori Masalah</th>
            <th class="px-4 py-2">Tahap Aduan</th>
            <th class="px-4 py-2">Dikemukakan Oleh</th>
            <th class="px-4 py-2">Tarikh Permohonan</th>
            <th class="px-4 py-2">Status</th>
            <th class="px-4 py-2">Tindakan</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(permohonan, index) in permohonanList"
            :key="index"
            class="hover:bg-gray-50"
          >
            <td class="px-4 py-2 border">{{ permohonan.id }}</td>
            <td class="px-4 py-2 border">
              <span
                v-if="permohonan.jenis === 'Baru'"
                class="bg-blue-500 text-white text-xs px-2 py-1 rounded"
              >
                Baru
              </span>
              <span
                v-else-if="permohonan.jenis === 'Kemaskini'"
                class="bg-orange-500 text-white text-xs px-2 py-1 rounded"
              >
                Kemaskini
              </span>
            </td>
            <td class="px-4 py-2 border">{{ permohonan.kategori }}</td>
            <td class="px-4 py-2 border">{{ permohonan.tahap }}</td>
            <td class="px-4 py-2 border">{{ permohonan.dikemukakanOleh }}</td>
            <td class="px-4 py-2 border">{{ permohonan.tarikh }}</td>
            <td class="px-4 py-2 border">{{ permohonan.status }}</td>
            <td class="px-4 py-2 border">
              <button
                class="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded"
                @click="semakPermohonan(permohonan)"
              >
                Semak
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Senarai Permohonan Kelulusan",
  path: "/BF-ADN/PK/KT/02/01",
});

const breadcrumb = ref([
  { name: "Pengurusan SLA", type: "link", path: "/BF-ADN/SLA" },
  { name: "Senarai Permohonan Kelulusan", type: "current", path: "/BF-ADN/PK/02/01" },
]);

const permohonanList = ref([
  {
    id: "KM-PR-0012",
    jenis: "Baru",
    kategori: "Tiada Tempat Tinggal",
    tahap: "Kelas 1 (Merah)",
    dikemukakanOleh: "Eksekutif_A",
    tarikh: "2025-09-14",
    status: "Menunggu Kelulusan",
  },
  {
    id: "KM-PR-0013",
    jenis: "Kemaskini",
    kategori: "Kekurangan Sumber Pendapatan",
    tahap: "Kelas 2 (Kuning)",
    dikemukakanOleh: "Eksekutif_B",
    tarikh: "2025-09-13",
    status: "Menunggu Kelulusan",
  },
]);

const semakPermohonan = (permohonan) => {
  navigateTo(`/BF-ADN/PK/KT/02/02`);
};
</script>
