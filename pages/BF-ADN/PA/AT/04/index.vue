<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Section 1: Ringkasan Status Aduan -->
    <!-- <rs-card>
      <template #header>Ringkasan Status Aduan</template>
      <template #body>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <rs-card v-for="summary in summaryData" :key="summary.label" variant="secondary">
            <div class="flex flex-col items-center p-4">
              <div class="text-2xl font-bold">{{ summary.count }}</div>
              <div class="text-sm mt-1">{{ summary.label }}</div>
            </div>
          </rs-card>
        </div>
      </template>
    </rs-card> -->

    <!-- Section 2: Senarai Tugasan Terbaru -->
    <rs-card class="mt-6">
      <template #header>Senarai Tugasan Terbaru</template>
      <template #body>
        <rs-table
          class="mt-4"
          :key="filteredData"
          :data="filteredData"
          :pageSize="10"
          :showNoColumn="true"
          :options="{
            variant: 'default',
            hover: true,
          }"
        >
          <template v-slot:noAduan="data">
            <span class="font-semibold text-gray-800">{{ data.text }}</span>
          </template>

          <template v-slot:namaPenuh="data">
            <span>{{ data.text }}</span>
          </template>

          <template v-slot:tahapKeperluan="data">
            <rs-badge
              :variant="getPernyataanMasalahVariant(data.text)"
              size="sm"
              class="w-4 h-4 rounded-full"
              :title="data.text"
            >
              <!-- {{ data.text }} -->
            </rs-badge>
          </template>

          <template v-slot:tarikhAduan="data">
            <span class="font-medium">{{ formatDate(data.text) }}</span>
          </template>

          <template v-slot:status="data">
            <div class="flex justify-center">
              <rs-badge :variant="getStatusVariant(data.text)" size="sm">
                {{ data.text }}
              </rs-badge>
            </div>
          </template>

          <template v-slot:aksi="data">
            <rs-button
              variant="primary"
              size="sm"
              class="!px-2 !py-1"
              @click="navigateByStatus(data.text)"
            >
              Lebih
              <Icon name="mdi:chevron-right" class="ml-1" size="1rem" />
            </rs-button>
          </template>
        </rs-table>
      </template>
    </rs-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

definePageMeta({
  title: "Dashboard Pengurusan Aduan",
});

const breadcrumb = ref([
  {
    name: "Pengurusan Aduan",
    type: "link",
    path: `/BF-ADN/PA/Dashboard`,
  },
  {
    name: "Dashboard",
    type: "current",
    path: "/BF-ADN/PA/Dashboard",
  },
]);

// Section 1: Summary Data
const summaryData = ref([
  { label: "Aduan Baru", count: 12 },
  { label: "Dalam Proses - Siasatan Ringkas", count: 5 },
  { label: "Dalam Proses - Siasatan Lapangan", count: 7 },
  { label: "Menunggu Kelulusan Bantuan", count: 3 },
  { label: "Menunggu Serahan Bantuan", count: 2 },
  { label: "Selesai", count: 20 },
  { label: "Ditutup", count: 1 },
]);

// Section 2: DataTable
const data = ref([
  {
    noAduan: "ADN-2024-010",
    namaPenuh: "Ahmad bin Abdullah",
    tahapKeperluan: "Pendapatan Berkurangan/Keperluan Lain (Kelas 3/Hijau)",
    tarikhAduan: "2024-06-10",
    status: "Aduan Baru",
    aksi: "Aduan Baru",
  },
  {
    noAduan: "ADN-2024-015",
    namaPenuh: "Nur Aisyah binti Omar",
    tahapKeperluan: "Terputus Bekalan Makanan/Tiada Tempat Tinggal (Kelas 1/Merah)",
    tarikhAduan: "2024-06-11",
    status: "Aduan Baru",
    aksi: "Aduan Baru",
  },
  {
    noAduan: "ADN-2024-016",
    namaPenuh: "Mohamad Hafiz bin Rahim",
    tahapKeperluan: "Masih Ada Bekalan Makanan/Mempunyai Tempat Tinggal/Tiada Sumber Pendapatan (Kelas 2/Kuning)",
    tarikhAduan: "2024-06-12",
    status: "Aduan Baru",
    aksi: "Aduan Baru",
  },
  {
    noAduan: "ADN-2024-017",
    namaPenuh: "Farah Nadia binti Kamal",
    tahapKeperluan: "Pendapatan Berkurangan/Keperluan Lain (Kelas 3/Hijau)",
    tarikhAduan: "2024-06-13",
    status: "Aduan Baru",
    aksi: "Aduan Baru",
  }
]);

const filteredData = ref(data.value.filter(item => item.status === "Aduan Baru"));

const getStatusVariant = (status) => {
  const variants = {
    "Aduan Baru": "warning",
    "Dalam Proses - Siasatan Ringkas": "primary",
    "Dalam Proses - Quick Assessment": "primary",
    "Dalam Proses - Siasatan Lapangan": "primary",
    "Menunggu Kelulusan Bantuan": "info",
    "Menunggu Serahan Bantuan": "info",
    "Selesai": "success",
    "Ditutup": "danger",
    "Ditamatkan – Tukar Kategori": "gray",
  };
  return variants[status] || "default";
};

const getPernyataanMasalahVariant = (pernyataan) => {
  if (pernyataan.includes("Kelas 1/Merah")) return "danger";
  if (pernyataan.includes("Kelas 2/Kuning")) return "warning";
  if (pernyataan.includes("Kelas 3/Hijau")) return "success";
  return "default";
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("ms-MY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const navigateByStatus = (status) => {
  if (status === "Aduan Baru") {
    navigateTo("/BF-ADN/PA/AT/02");
  } else if (status === "Dalam Proses - Siasatan Ringkas") {
    navigateTo("/BF-ADN/PA/TS/02");
  } else if (status === "Dalam Proses - Siasatan Lapangan") {
    //navigateTo("/BF-ADN/PA/AT/05");
  } else if (status === "Menunggu Kelulusan Bantuan") {
    //navigateTo("/BF-ADN/PA/AT/08");
  } else {
    navigateTo("/BF-ADN/PA/AT/02");
  }
};
</script>

<style lang="scss" scoped>
// Add any custom styles here
</style>
