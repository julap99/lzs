<template>
  <div>
    <!-- Breadcrumb -->
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Title and Button -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold">Senarai Konfigurasi Penutupan Aduan</h2>
      <button
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        @click="tambahKonfigurasi"
      >
        Tambah Konfigurasi
      </button>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead>
          <tr class="bg-gray-100 text-left">
            <th class="px-4 py-2 border">#</th>
            <th class="px-4 py-2 border">Sebab Penutupan</th>
            <th class="px-4 py-2 border">Status</th>
            <th class="px-4 py-2 border">Tindakan</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in konfigurasiList"
            :key="index"
            class="hover:bg-gray-50"
          >
            <td class="px-4 py-2 border">{{ index + 1 }}</td>
            <td class="px-4 py-2 border">{{ item.sebab }}</td>
            <td class="px-4 py-2 border">
              <span
                v-if="item.status === 'Aktif'"
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
            <td class="px-4 py-2 border space-x-2">
              <button
                class="bg-cyan-500 hover:bg-cyan-600 text-white text-sm px-3 py-1 rounded"
                @click="lihatKonfigurasi(item)"
              >
                Lihat
              </button>
              <button
                class="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-1 rounded"
                @click="kemaskiniKonfigurasi(item)"
              >
                Kemaskini
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
  title: "Senarai Konfigurasi Penutupan Aduan",
  path: "/BF-ADN/PK/KP/01/01",
});

const breadcrumb = ref([
  { name: "Pengurusan SLA", type: "link", path: "/BF-ADN/SLA" },
  {
    name: "Senarai Konfigurasi Penutupan Aduan",
    type: "current",
    path: "/BF-ADN/PK/KP/01/01",
  },
]);

// Dummy data
const konfigurasiList = ref([
  {
    sebab: "Bantuan telah diterima daripada agensi lain",
    status: "Aktif",
  },
  {
    sebab: "Individu tidak dijumpai selepas siasatan",
    status: "Tidak Aktif",
  },
]);

// Actions
const tambahKonfigurasi = () => {
  navigateTo("/BF-ADN/PK/KP/01/02");
};

const lihatKonfigurasi = (item) => {
  navigateTo(`/BF-ADN/PK/KA/01/03`);
};

const kemaskiniKonfigurasi = (item) => {
  navigateTo(`/BF-ADN/PK/KP/01/04`);
};
</script>
