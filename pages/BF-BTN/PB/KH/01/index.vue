<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Permohonan Kelulusan Khas</h2>
          <FormKit type="text" v-model="searchQuery" placeholder="Cari Nama / No. Rujukan" class="w-1/3" />
        </div>
      </template>

      <template #body>
        <table class="min-w-full table-auto border">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-2 text-left">No Rujukan</th>
              <th class="px-4 py-2 text-left">Nama Pemohon</th>
              <th class="px-4 py-2 text-left">Tarikh Terima</th>
              <th class="px-4 py-2 text-left">Status</th>
              <th class="px-4 py-2 text-left">Pegawai</th>
              <th class="px-4 py-2 text-left">Tindakan</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredData" :key="item.rujukan" class="border-t">
              <td class="px-4 py-2">{{ item.rujukan }}</td>
              <td class="px-4 py-2">{{ item.nama }}</td>
              <td class="px-4 py-2">{{ item.tarikh }}</td>
              <td class="px-4 py-2">{{ item.status }}</td>
              <td class="px-4 py-2">{{ item.pegawai }}</td>
              <td class="px-4 py-2">
                <rs-button size="sm" @click="semakPermohonan(item.rujukan)">Semak</rs-button>
              </td>
            </tr>
            <tr v-if="filteredData.length === 0">
              <td colspan="6" class="px-4 py-4 text-center text-gray-500">Tiada permohonan dijumpai.</td>
            </tr>
          </tbody>
        </table>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const breadcrumb = [
  { name: 'Kelulusan Khas', path: '/BF-BTN/PB/KH/01', type: 'link' },
  { name: 'Senarai Permohonan', path: '', type: 'current' },
];

const searchQuery = ref('');

const data = ref([
  {
    rujukan: 'KH20250721001',
    nama: 'Ahmad bin Abdullah',
    tarikh: '21 Julai 2025',
    status: 'Menunggu',
    pegawai: 'Siti Aminah',
  },
  {
    rujukan: 'KH20250720002',
    nama: 'Noraini bt Hussin',
    tarikh: '20 Julai 2025',
    status: 'Lulus',
    pegawai: 'Zulkifli Omar',
  },
]);

const filteredData = computed(() => {
  if (!searchQuery.value) return data.value;
  return data.value.filter(item =>
    item.nama.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    item.rujukan.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const semakPermohonan = (rujukan) => {
  router.push(`/BF-BTN/PB/KH/02?rujukan=${rujukan}`);
};
</script>

<style scoped>
/* Tambah gaya tambahan jika perlu */
</style>