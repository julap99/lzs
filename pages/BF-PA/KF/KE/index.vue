<template>
  <div>
    <LayoutsBreadcrumb :breadcrumb="breadcrumb" />
    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Elaun</h2>
        </div>
      </template>
      <template #body>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori Amil</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Elaun</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jawatan</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kadar Elaun</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Tindakan</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(item, idx) in elaunList" :key="idx">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.kategoriAmil }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.jenisElaun }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.jawatan }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">RM {{ item.kadarElaun }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span :class="item.status === 'Aktif' ? 'text-green-600 font-semibold' : 'text-yellow-600 font-semibold'">{{ item.status }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <rs-button variant="primary" @click="navigateTo(item.path)">Kemaskini</rs-button>
                  <rs-button variant="primary" @click="navigateTo('/BF-PA/KF/KE/02')">Tukar Status</rs-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Konfigurasi Elaun",
});

const breadcrumb = ref([
  { title: "Utama", path: "/" },
  { title: "BF-PA", path: "/BF-PA" },
  { title: "Konfigurasi", path: "/BF-PA/KF" },
  { title: "Elaun", path: "/BF-PA/KF/KE" }
]);

const elaunList = ref([
  {
    kategoriAmil: "Fitrah",
    jawatan: "Penolong Amil",
    jenisElaun: "Elaun Bancian Baru",
    kadarElaun: 30,
    status: "Aktif",
    path: "/BF-PA/KF/KE/L1"
  },
  {
    kategoriAmil: "Padi",
    jawatan: "Penolong Amil",
    jenisElaun: "Elaun Kemaskini",
    kadarElaun: 20,
    status: "Aktif",
    path: "/BF-PA/KF/KE/L2"
  },
  {
    kategoriAmil: "Kariah",
    jawatan: "Penolong Amil",
    jenisElaun: "Elaun Permohonan Bantuan",
    kadarElaun: 20,
    status: "Menunggu Kelulusan",
    path: "/BF-PA/KF/KE/L3"
  },
  {
    kategoriAmil: "Komuniti",
    jawatan: "Penolong Amil",
    jenisElaun: "Elaun Raya",
    kadarElaun: 150,
    status: "Tidak Aktif",
    path: "/BF-PA/KF/KE/L4"
  }
]);
</script> 