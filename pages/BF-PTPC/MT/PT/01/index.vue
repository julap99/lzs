<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card>
      <template #header> Senarai Nama dan Jumlah Bantuan Ageing > 60 hari</template>
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
          <template v-slot:jumlahBantuan="data">
            <span class="font-medium">{{ data.text }}</span>
          </template>
          <template v-slot:aksi="data">
            <rs-button
              variant="primary"
              size="sm"
              class="!px-2 !py-1"
              @click="navigateTo(`/BF-PTPC/MT/AG/02/${data.text}`)"
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
  title: "Senarai Nama dan Jumlah Bantuan Ageing > 60 hari",
});

const breadcrumb = ref([
  {
    name: "Senarai Nama dan Jumlah Bantuan Ageing > 60 hari",
    type: "current",
    path: "/BF-PTPC/MT/PT/01",
  },
]);

const data = ref([
  {
    namaAsnaf: "Ahmad bin Abdullah",
    noKadPengenalan: "800101-01-1234",
    jenisBantuan: "Bantuan Kewangan",
    jumlahBantuan: "RM 1,000.00",
    paNombor: "PA-2024-001",
    aksi: "PA-2024-001",
  },
  {
    namaAsnaf: "Siti binti Aminah",
    noKadPengenalan: "850202-02-5678",
    jenisBantuan: "Bantuan Makanan",
    jumlahBantuan: "RM 500.00",
    paNombor: "PA-2024-002",
    aksi: "PA-2024-002",
  },
  {
    namaAsnaf: "Mohd Razak bin Ismail",
    noKadPengenalan: "900303-03-9012",
    jenisBantuan: "Bantuan Pendidikan",
    jumlahBantuan: "RM 2,000.00",
    paNombor: "PA-2024-003",
    aksi: "PA-2024-003",
  },
  {
    namaAsnaf: "Nurul Huda binti Omar",
    noKadPengenalan: "910404-04-3456",
    jenisBantuan: "Bantuan Kewangan",
    jumlahBantuan: "RM 1,500.00",
    paNombor: "PA-2024-004",
    aksi: "PA-2024-004",
  },
  {
    namaAsnaf: "Tan Wei Ling",
    noKadPengenalan: "920505-05-7890",
    jenisBantuan: "Bantuan Makanan",
    jumlahBantuan: "RM 750.00",
    paNombor: "PA-2024-005",
    aksi: "PA-2024-005",
  },
  {
    namaAsnaf: "Amir bin Hassan",
    noKadPengenalan: "930606-06-2345",
    jenisBantuan: "Bantuan Pendidikan",
    jumlahBantuan: "RM 2,500.00",
    paNombor: "PA-2024-006",
    aksi: "PA-2024-006",
  },
  {
    namaAsnaf: "Farah binti Lim",
    noKadPengenalan: "940707-07-6789",
    jenisBantuan: "Bantuan Kewangan",
    jumlahBantuan: "RM 1,200.00",
    paNombor: "PA-2024-007",
    aksi: "PA-2024-007",
  },
  {
    namaAsnaf: "Zain bin Ismail",
    noKadPengenalan: "950808-08-0123",
    jenisBantuan: "Bantuan Makanan",
    jumlahBantuan: "RM 600.00",
    paNombor: "PA-2024-008",
    aksi: "PA-2024-008",
  },
  {
    namaAsnaf: "Lily Wong",
    noKadPengenalan: "960909-09-4567",
    jenisBantuan: "Bantuan Pendidikan",
    jumlahBantuan: "RM 3,000.00",
    paNombor: "PA-2024-009",
    aksi: "PA-2024-009",
  },
  {
    namaAsnaf: "Ravi Kumar",
    noKadPengenalan: "970101-10-8901",
    jenisBantuan: "Bantuan Kewangan",
    jumlahBantuan: "RM 1,800.00",
    paNombor: "PA-2024-010",
    aksi: "PA-2024-010",
  },
  {
    namaAsnaf: "Aishah binti Yusof",
    noKadPengenalan: "980202-11-2345",
    jenisBantuan: "Bantuan Makanan",
    jumlahBantuan: "RM 450.00",
    paNombor: "PA-2024-011",
    aksi: "PA-2024-011",
  },
  {
    namaAsnaf: "Chong Wei Ming",
    noKadPengenalan: "990303-12-6789",
    jenisBantuan: "Bantuan Pendidikan",
    jumlahBantuan: "RM 2,800.00",
    paNombor: "PA-2024-012",
    aksi: "PA-2024-012",
  },
  {
    namaAsnaf: "Salmah binti Othman",
    noKadPengenalan: "000404-13-0123",
    jenisBantuan: "Bantuan Kewangan",
    jumlahBantuan: "RM 1,300.00",
    paNombor: "PA-2024-013",
    aksi: "PA-2024-013",
  },
  {
    namaAsnaf: "Raj Muthu",
    noKadPengenalan: "010505-14-4567",
    jenisBantuan: "Bantuan Makanan",
    jumlahBantuan: "RM 550.00",
    paNombor: "PA-2024-014",
    aksi: "PA-2024-014",
  },
  {
    namaAsnaf: "Noor binti Aziz",
    noKadPengenalan: "020606-15-8901",
    jenisBantuan: "Bantuan Pendidikan",
    jumlahBantuan: "RM 2,200.00",
    paNombor: "PA-2024-015",
    aksi: "PA-2024-015",
  },
]);

const criteria = ref([
  {
    label: "Nama Asnaf",
    options: ["Ahmad bin Abdullah", "Siti binti Aminah", "Mohd Razak bin Ismail"],
  },
  {
    label: "Jenis Bantuan",
    options: ["Bantuan Kewangan", "Bantuan Makanan", "Bantuan Pendidikan"],
  },
  {
    label: "PA Nombor",
    options: ["PA-2024-001", "PA-2024-002", "PA-2024-003"],
  },
]);

const selectedCriteria = ref({
  kriteria1: "",
  kriteria2: "",
  kriteria3: "",
});

const filteredData = ref([...data.value]);

const performSearch = () => {
  filteredData.value = data.value.filter((item) => {
    return (
      (!selectedCriteria.value.kriteria1 ||
        item.namaAsnaf.includes(selectedCriteria.value.kriteria1)) &&
      (!selectedCriteria.value.kriteria2 ||
        item.jenisBantuan.includes(selectedCriteria.value.kriteria2)) &&
      (!selectedCriteria.value.kriteria3 ||
        item.paNombor.includes(selectedCriteria.value.kriteria3))
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
