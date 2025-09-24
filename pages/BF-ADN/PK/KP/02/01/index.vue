<template>
  <div>
    <!-- Breadcrumb -->
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Title -->
    <h2 class="text-xl font-bold mb-6">
      Senarai Permohonan Kelulusan Konfigurasi Penutupan Aduan
    </h2>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead>
          <tr class="bg-gray-900 text-white text-left">
            <th class="px-4 py-2">No</th>
            <th class="px-4 py-2">Sebab Penutupan</th>
            <th class="px-4 py-2">Status</th>
            <th class="px-4 py-2">Tarikh Permohonan</th>
            <th class="px-4 py-2">Dimohon Oleh</th>
            <th class="px-4 py-2">Status Semasa</th>
            <th class="px-4 py-2">Tindakan</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(permohonan, index) in permohonanList"
            :key="index"
            class="hover:bg-gray-50"
          >
            <td class="px-4 py-2 border">{{ index + 1 }}</td>
            <td class="px-4 py-2 border">{{ permohonan.sebab }}</td>
            <td class="px-4 py-2 border">
              <span
                v-if="permohonan.status === 'Aktif'"
                class="bg-green-600 text-white text-xs px-2 py-1 rounded"
              >
                Aktif
              </span>
              <span
                v-else
                class="bg-red-600 text-white text-xs px-2 py-1 rounded"
              >
                Tidak Aktif
              </span>
            </td>
            <td class="px-4 py-2 border">{{ permohonan.tarikh }}</td>
            <td class="px-4 py-2 border">{{ permohonan.dimohonOleh }}</td>
            <td class="px-4 py-2 border">
              <span class="bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                {{ permohonan.statusSemasa }}
              </span>
            </td>
            <td class="px-4 py-2 border space-x-2">
              <!-- Semakan & Kelulusan -->
              <NuxtLink
                to="/BF-ADN/PK/KP/02/02"
                class="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded"
              >
                Semakan & Kelulusan
              </NuxtLink>

              <!-- Lihat -->
              <NuxtLink
                to="/BF-ADN/PK/KP/02/03"
                class="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
              >
                Lihat
              </NuxtLink>
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
  title: "Senarai Permohonan Kelulusan Konfigurasi Penutupan Aduan",
  path: "/BF-ADN/PK/KP/02/01",
});

const breadcrumb = ref([
  { name: "Pengurusan SLA", type: "link", path: "/BF-ADN/SLA" },
  {
    name: "Senarai Permohonan Kelulusan Konfigurasi Penutupan Aduan",
    type: "current",
    path: "/BF-ADN/PK/KP/02/01",
  },
]);

const permohonanList = ref([
  {
    sebab: "Siasatan Tamat",
    status: "Aktif",
    tarikh: "2025-09-18",
    dimohonOleh: "Eksekutif_A",
    statusSemasa: "Menunggu Kelulusan",
  },
  {
    sebab: "Luar Skop Zakat",
    status: "Tidak Aktif",
    tarikh: "2025-09-17",
    dimohonOleh: "Eksekutif_B",
    statusSemasa: "Menunggu Kelulusan",
  },
]);
</script>
