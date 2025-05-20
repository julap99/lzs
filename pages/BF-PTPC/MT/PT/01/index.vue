<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card>
      <template #header>
        Senarai Nama dan Jumlah Bantuan Ageing > 60 hari</template
      >
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
          <template v-slot:aksi="data">
            <rs-button
              variant="primary"
              size="sm"
              class="!px-2 !py-1"
              @click="navigateTo(`/BF-PTPC/MT/PT/02/${data.text}`)"
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
    name: "Pengurusan Tunai",
    type: "link",
    path: `/BF-PTPC/MT/PT/01`,
  },
  {
    name: "Pemulangan Tunai",
    type: "link",
    path: `/BF-PTPC/MT/PT/01`,
  },
  {
    name: "Senarai Nama dan Jumlah Bantuan Ageing > 60 hari",
    type: "current",
    path: "/BF-PTPC/MT/PT/01",
  },
]);

const data = ref([
  {
    namaPemohon: "Ahmad bin Abdullah",
    noKadPengenalan: "800101-01-1234",
    paNombor: "PA-2024-001",
    tarikhKelulusan: "2024-01-10",
    jenisBantuan: "Bantuan Kewangan",
    jumlahBantuan: "RM 1,000.00",
    statusTuntutan: "Belum Dituntut",
    tarikhSenaraiDijana: "2024-03-15",
    aksi: "PA-2024-001",
  },
  {
    namaPemohon: "Siti binti Aminah",
    noKadPengenalan: "850202-02-5678",
    paNombor: "PA-2024-002",
    tarikhKelulusan: "2024-01-15",
    jenisBantuan: "Bantuan Makanan",
    jumlahBantuan: "RM 500.00",
    statusTuntutan: "Dituntut",
    tarikhSenaraiDijana: "2024-03-15",
    aksi: "PA-2024-002",
  },
  {
    namaPemohon: "Mohd Razak bin Ismail",
    noKadPengenalan: "900303-03-9012",
    paNombor: "PA-2024-003",
    tarikhKelulusan: "2024-01-20",
    jenisBantuan: "Bantuan Pendidikan",
    jumlahBantuan: "RM 2,000.00",
    statusTuntutan: "Belum Dituntut",
    tarikhSenaraiDijana: "2024-03-15",
    aksi: "PA-2024-003",
  },
  {
    namaPemohon: "Nurul Huda binti Omar",
    noKadPengenalan: "910404-04-3456",
    paNombor: "PA-2024-004",
    tarikhKelulusan: "2024-02-01",
    jenisBantuan: "Bantuan Kewangan",
    jumlahBantuan: "RM 1,500.00",
    statusTuntutan: "Dituntut",
    tarikhSenaraiDijana: "2024-03-15",
    aksi: "PA-2024-004",
  },
  {
    namaPemohon: "Tan Wei Ling",
    noKadPengenalan: "920505-05-7890",
    paNombor: "PA-2024-005",
    tarikhKelulusan: "2024-02-10",
    jenisBantuan: "Bantuan Makanan",
    jumlahBantuan: "RM 750.00",
    statusTuntutan: "Belum Dituntut",
    tarikhSenaraiDijana: "2024-03-15",
    aksi: "PA-2024-005",
  },
  {
    namaPemohon: "Amir bin Hassan",
    noKadPengenalan: "930606-06-2345",
    paNombor: "PA-2024-006",
    tarikhKelulusan: "2024-01-25",
    jenisBantuan: "Bantuan Pendidikan",
    jumlahBantuan: "RM 2,500.00",
    statusTuntutan: "Belum Dituntut",
    tarikhSenaraiDijana: "2024-03-15",
    aksi: "PA-2024-006",
  },
  {
    namaPemohon: "Farah binti Lim",
    noKadPengenalan: "940707-07-6789",
    paNombor: "PA-2024-007",
    tarikhKelulusan: "2024-02-12",
    jenisBantuan: "Bantuan Kewangan",
    jumlahBantuan: "RM 1,200.00",
    statusTuntutan: "Dituntut",
    tarikhSenaraiDijana: "2024-03-15",
    aksi: "PA-2024-007",
  },
  {
    namaPemohon: "Zain bin Ismail",
    noKadPengenalan: "950808-08-0123",
    paNombor: "PA-2024-008",
    tarikhKelulusan: "2024-02-20",
    jenisBantuan: "Bantuan Makanan",
    jumlahBantuan: "RM 600.00",
    statusTuntutan: "Belum Dituntut",
    tarikhSenaraiDijana: "2024-03-15",
    aksi: "PA-2024-008",
  },
  {
    namaPemohon: "Lily Wong",
    noKadPengenalan: "960909-09-4567",
    paNombor: "PA-2024-009",
    tarikhKelulusan: "2024-01-18",
    jenisBantuan: "Bantuan Pendidikan",
    jumlahBantuan: "RM 3,000.00",
    statusTuntutan: "Belum Dituntut",
    tarikhSenaraiDijana: "2024-03-15",
    aksi: "PA-2024-009",
  },
  {
    namaPemohon: "Ravi Kumar",
    noKadPengenalan: "970101-10-8901",
    paNombor: "PA-2024-010",
    tarikhKelulusan: "2024-02-05",
    jenisBantuan: "Bantuan Kewangan",
    jumlahBantuan: "RM 1,800.00",
    statusTuntutan: "Dituntut",
    tarikhSenaraiDijana: "2024-03-15",
    aksi: "PA-2024-010",
  },
  {
    namaPemohon: "Aishah binti Yusof",
    noKadPengenalan: "980202-11-2345",
    paNombor: "PA-2024-011",
    tarikhKelulusan: "2024-02-14",
    jenisBantuan: "Bantuan Makanan",
    jumlahBantuan: "RM 450.00",
    statusTuntutan: "Belum Dituntut",
    tarikhSenaraiDijana: "2024-03-15",
    aksi: "PA-2024-011",
  },
  {
    namaPemohon: "Chong Wei Ming",
    noKadPengenalan: "990303-12-6789",
    paNombor: "PA-2024-012",
    tarikhKelulusan: "2024-01-29",
    jenisBantuan: "Bantuan Pendidikan",
    jumlahBantuan: "RM 2,800.00",
    statusTuntutan: "Belum Dituntut",
    tarikhSenaraiDijana: "2024-03-15",
    aksi: "PA-2024-012",
  },
  {
    namaPemohon: "Salmah binti Othman",
    noKadPengenalan: "000404-13-0123",
    paNombor: "PA-2024-013",
    tarikhKelulusan: "2024-02-18",
    jenisBantuan: "Bantuan Kewangan",
    jumlahBantuan: "RM 1,300.00",
    statusTuntutan: "Dituntut",
    tarikhSenaraiDijana: "2024-03-15",
    aksi: "PA-2024-013",
  },
  {
    namaPemohon: "Raj Muthu",
    noKadPengenalan: "010505-14-4567",
    paNombor: "PA-2024-014",
    tarikhKelulusan: "2024-01-22",
    jenisBantuan: "Bantuan Makanan",
    jumlahBantuan: "RM 550.00",
    statusTuntutan: "Belum Dituntut",
    tarikhSenaraiDijana: "2024-03-15",
    aksi: "PA-2024-014",
  },
  {
    namaPemohon: "Noor binti Aziz",
    noKadPengenalan: "020606-15-8901",
    paNombor: "PA-2024-015",
    tarikhKelulusan: "2024-01-30",
    jenisBantuan: "Bantuan Pendidikan",
    jumlahBantuan: "RM 2,200.00",
    statusTuntutan: "Belum Dituntut",
    tarikhSenaraiDijana: "2024-03-15",
    aksi: "PA-2024-015",
  },
]);

const criteria = ref([
  {
    label: "Nama Asnaf",
    options: [
      "Ahmad bin Abdullah",
      "Siti binti Aminah",
      "Mohd Razak bin Ismail",
    ],
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
</script>
