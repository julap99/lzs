<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card>
      <template #header>Agih Tugas (EOAD)</template>
      <template #body>
        <rs-table
          class="mt-8"
          :key="filteredData"
          :data="filteredData"
          :pageSize="10"
          :showNoColumn="true"
          :options="{
            variant: 'default',
            hover: true,
          }"
        >
          <template v-slot:status="data">
            <rs-badge :variant="getStatusVariant(data.text)" size="sm">
              {{ data.text }}
            </rs-badge>
          </template>
          <template v-slot:pernyataanMasalah="data">
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
          <template v-slot:aksi="data">
            <rs-button
              variant="primary"
              size="sm"
              class="!px-2 !py-1"
              @click="navigateTo(`/BF-ADN/PA/AT/02`)"
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

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Senarai Aduan",
});

const breadcrumb = ref([
  {
    name: "Pengurusan Aduan",
    type: "link",
    path: `/BF-ADN/PA/AT/01`,
  },
  {
    name: "Agih Tugas (EOAD)",
    type: "current",
    path: "/BF-ADN/PA/AT/01",
  },
]);

const data = ref([
  {
    noAduan: "ADN-2024-001",
    namaAduan: "Aduan Keselamatan",
    pernyataanMasalah:
      "Terputus Bekalan Makanan/Tiada Tempat Tinggal (Kelas 1/Merah)",
    tarikhAduan: "2024-03-15",
    status: "Diambil",
    aksi: "ADN-2024-001",
  },
  {
    noAduan: "ADN-2024-002",
    namaAduan: "Aduan Kebersihan",
    pernyataanMasalah:
      "Masih Ada Bekalan Makanan/Mempunyai Tempat Tinggal/Tiada Sumber Pendapatan (Kelas 2/Kuning)",
    tarikhAduan: "2024-03-14",
    status: "Masih Kosong",
    aksi: "ADN-2024-002",
  },
  {
    noAduan: "ADN-2024-003",
    namaAduan: "Aduan Infrastruktur",
    pernyataanMasalah: "Pendapatan Berkurangan/Keperluan Lain (Kelas 3/Hijau)",
    tarikhAduan: "2024-03-13",
    status: "Diambil",
    aksi: "ADN-2024-003",
  },
  {
    noAduan: "ADN-2024-004",
    namaAduan: "Aduan Keselamatan",
    pernyataanMasalah:
      "Terputus Bekalan Makanan/Tiada Tempat Tinggal (Kelas 1/Merah)",
    tarikhAduan: "2024-03-12",
    status: "Masih Kosong",
    aksi: "ADN-2024-004",
  },
  {
    noAduan: "ADN-2024-005",
    namaAduan: "Aduan Kebersihan",
    pernyataanMasalah:
      "Masih Ada Bekalan Makanan/Mempunyai Tempat Tinggal/Tiada Sumber Pendapatan (Kelas 2/Kuning)",
    tarikhAduan: "2024-03-11",
    status: "Masih Kosong",
    aksi: "ADN-2024-005",
  },
]);

const criteria = ref([
  {
    label: "Nama Aduan",
    options: ["Aduan Keselamatan", "Aduan Kebersihan", "Aduan Infrastruktur"],
  },
  {
    label: "Pernyataan Masalah",
    options: [
      "Terputus Bekalan Makanan/Tiada Tempat Tinggal (Kelas 1/Merah)",
      "Masih Ada Bekalan Makanan/Mempunyai Tempat Tinggal/Tiada Sumber Pendapatan (Kelas 2/Kuning)",
      "Pendapatan Berkurangan/Keperluan Lain (Kelas 3/Hijau)",
    ],
  },
  {
    label: "Status",
    options: ["Diambil", "Masih Kosong"],
  },
]);

const selectedCriteria = ref({
  kriteria1: "",
  kriteria2: "",
  kriteria3: "",
});

const filteredData = ref([...data.value]);

const getStatusVariant = (status) => {
  const variants = {
    "Masih Kosong": "warning",
    Diambil: "success",
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
    hour12: true
  });
};

const performSearch = () => {
  filteredData.value = data.value.filter((item) => {
    return (
      (!selectedCriteria.value.kriteria1 ||
        item.namaAduan.includes(selectedCriteria.value.kriteria1)) &&
      (!selectedCriteria.value.kriteria2 ||
        item.pernyataanMasalah.includes(selectedCriteria.value.kriteria2)) &&
      (!selectedCriteria.value.kriteria3 ||
        item.status.includes(selectedCriteria.value.kriteria3))
    );
  });
};

const resetFilter = () => {
  selectedCriteria.value = {
    kriteria1: "",
    kriteria2: "",
    kriteria3: "",
  };
  filteredData.value = [...data.value];
};
</script>

<style lang="scss" scoped></style>
