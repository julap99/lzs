<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Tabung</h2>
          <rs-button variant="primary" @click="navigateTo(`/BF-TNI/peti-besi/konfigurasi/tambah`)">
            <Icon name="material-symbols:add" class="mr-1" /> Tambah Baharu
          </rs-button>
        </div>
      </template>

      <template #body>
        <!-- Search Input -->
        <div class="mb-4">
          <FormKit
            type="text"
            v-model="searchQuery"
            placeholder="Cari tabung..."
            outer-class="mb-0"
          />
        </div>

        <!-- Table Section -->
        <rs-table
          class="mt-4"
          :key="tableKey"
          :data="filteredSafeBoxes"
          :pageSize="10"
          :showNoColumn="true"
          :options="{
            variant: 'default',
            hover: true,
          }"
        >
          <template v-slot:namaAkaun="data">
            <div>
              <div class="font-medium">{{ data.text.nama }}</div>
              <div class="text-sm text-gray-500">{{ data.text.lokasi }}</div>
            </div>
          </template>

          <template v-slot:jenisAkaun="data">
            {{ data.text }}
          </template>

          <template v-slot:nilaiAsas="data">
            RM {{ formatNumber(data.text) }}
          </template>

          <template v-slot:hadMinimumBaki="data">
            RM {{ formatNumber(data.text) }}
          </template>

          <template v-slot:kaedahPemindahan="data">
            <rs-badge variant="outline">
              {{ data.text }}
            </rs-badge>
          </template>

          <template v-slot:bakiSemasa="data">
            RM {{ formatNumber(data.text) }}
          </template>

          <template v-slot:status="data">
            <rs-badge :variant="getStatusVariant(data.text)">
              {{ data.text }}
            </rs-badge>
          </template>

          <template v-slot:tindakan="data">
            <div class="flex space-x-2">
              <rs-button
                variant="primary"
                size="sm"
                class="!px-2 !py-1"
                @click="updateSafeBox(data.text)"
              >
                <Icon name="material-symbols:edit" size="15" class="mr-1" />
                Kemaskini Tabung
              </rs-button>
            </div>
          </template>
        </rs-table>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

definePageMeta({
  title: "Senarai Tabung",
});

const breadcrumb = ref([
  {
    name: "Pentadbiran",
    type: "link",
    path: "/BF-TNI/peti-besi",
  },
  {
    name: "Tabung",
    type: "link",
    path: "/BF-TNI/peti-besi",
  },
  {
    name: "Konfigurasi",
    type: "link",
    path: "/BF-TNI/peti-besi/konfigurasi",
  },
  {
    name: "Senarai",
    type: "current",
    path: "/BF-TNI/peti-besi/konfigurasi/senarai",
  },
]);

// Table data and search
const tableKey = ref(0);
const searchQuery = ref("");
const safeBoxes = ref([
  {
    namaAkaun: { nama: "Tabung Utama", lokasi: "Pejabat Pusat" },
    jenisAkaun: "Cawangan",
    nilaiAsas: 10000,
    hadMinimumBaki: 5000,
    kaedahPemindahan: "Tunai",
    bakiSemasa: 15000,
    status: "Aktif",
    tindakan: "SB001"
  },
  {
    namaAkaun: { nama: "Tabung Cawangan Johor", lokasi: "Johor Bahru" },
    jenisAkaun: "Cawangan",
    nilaiAsas: 8000,
    hadMinimumBaki: 4000,
    kaedahPemindahan: "eWallet",
    bakiSemasa: 12000,
    status: "Aktif",
    tindakan: "SB002"
  },
  {
    namaAkaun: { nama: "Tabung Amil Pusat", lokasi: "Pejabat Pusat" },
    jenisAkaun: "Amil",
    nilaiAsas: 15000,
    hadMinimumBaki: 7500,
    kaedahPemindahan: "Tunai",
    bakiSemasa: 20000,
    status: "Aktif",
    tindakan: "SB003"
  },
  {
    namaAkaun: { nama: "Tabung Operasi Daerah", lokasi: "Kuala Lumpur" },
    jenisAkaun: "Operasi Daerah",
    nilaiAsas: 12000,
    hadMinimumBaki: 6000,
    kaedahPemindahan: "eWallet",
    bakiSemasa: 18000,
    status: "Aktif",
    tindakan: "SB004"
  },
  {
    namaAkaun: { nama: "Tabung Baitul Mal", lokasi: "Shah Alam" },
    jenisAkaun: "Baitul",
    nilaiAsas: 20000,
    hadMinimumBaki: 10000,
    kaedahPemindahan: "Tunai",
    bakiSemasa: 25000,
    status: "Aktif",
    tindakan: "SB005"
  },
  {
    namaAkaun: { nama: "Tabung Cawangan Melaka", lokasi: "Melaka" },
    jenisAkaun: "Cawangan",
    nilaiAsas: 7000,
    hadMinimumBaki: 3500,
    kaedahPemindahan: "eWallet",
    bakiSemasa: 9000,
    status: "Tidak Aktif",
    tindakan: "SB006"
  },
  {
    namaAkaun: { nama: "Tabung Amil Daerah", lokasi: "Seremban" },
    jenisAkaun: "Amil",
    nilaiAsas: 9000,
    hadMinimumBaki: 4500,
    kaedahPemindahan: "Tunai",
    bakiSemasa: 11000,
    status: "Aktif",
    tindakan: "SB007"
  },
  {
    namaAkaun: { nama: "Tabung Operasi Pusat", lokasi: "Putrajaya" },
    jenisAkaun: "Operasi Daerah",
    nilaiAsas: 18000,
    hadMinimumBaki: 9000,
    kaedahPemindahan: "eWallet",
    bakiSemasa: 22000,
    status: "Aktif",
    tindakan: "SB008"
  },
  {
    namaAkaun: { nama: "Tabung Baitul Mal Cawangan", lokasi: "Penang" },
    jenisAkaun: "Baitul",
    nilaiAsas: 15000,
    hadMinimumBaki: 7500,
    kaedahPemindahan: "Tunai",
    bakiSemasa: 19000,
    status: "Tidak Aktif",
    tindakan: "SB009"
  },
  {
    namaAkaun: { nama: "Tabung Cawangan Sabah", lokasi: "Kota Kinabalu" },
    jenisAkaun: "Cawangan",
    nilaiAsas: 11000,
    hadMinimumBaki: 5500,
    kaedahPemindahan: "eWallet",
    bakiSemasa: 16000,
    status: "Aktif",
    tindakan: "SB010"
  }
]);

// Computed properties
const filteredSafeBoxes = computed(() => {
  if (!searchQuery.value) return safeBoxes.value;
  
  const query = searchQuery.value.toLowerCase();
  return safeBoxes.value.filter(box => 
    box.namaAkaun.nama.toLowerCase().includes(query) ||
    box.namaAkaun.lokasi.toLowerCase().includes(query) ||
    box.jenisAkaun.toLowerCase().includes(query)
  );
});

// Helper functions
const formatNumber = (number) => {
  return new Intl.NumberFormat('ms-MY').format(number);
};

const getStatusVariant = (status) => {
  switch (status.toLowerCase()) {
    case 'aktif':
      return 'success';
    case 'tidak aktif':
      return 'danger';
    default:
      return 'default';
  }
};

// Action handlers
const updateSafeBox = (id) => {
  navigateTo(`/BF-TNI/peti-besi/konfigurasi/tambah`);
};
</script>

<style lang="scss" scoped>
// Add any custom styles here if needed
</style>
