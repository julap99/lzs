<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card>
      <template #header>Tugasan Saya (EOAD)</template>
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
          <template v-slot:kategoriAduan="data">
            <rs-badge
              :variant="getKategoriAduanVariant(data.text)"
              size="sm"
              class="w-4 h-4 rounded-full"
              :title="data.text"
            >
            </rs-badge>
          </template>
          <template v-slot:status="data">
            <rs-badge :variant="getStatusVariant(data.text)" size="sm">
              {{ data.text }}
            </rs-badge>
          </template>
          <template v-slot:SLA="data">
            <rs-badge
              :variant="getSLAVariant(data.text)"
              size="sm"
              class="w-4 h-4 rounded-full"
              :title="formatSLA(data.text)"
            />
          </template>
          <template v-slot:tarikhAduan="data">
            <span class="font-medium">{{ formatDate(data.text) }}</span>
          </template>
          <template v-slot:aksi="data">
            <div class="flex gap-2">
              <rs-button
                variant="secondary"
                size="sm"
                class="!px-2 !py-1"
                @click="navigateTo(`/BF-ADN/PA/TS/03`)"
              >
                Audit
                <Icon name="mdi:clipboard-check" class="ml-1" size="1rem" />
              </rs-button>
              <rs-button
                variant="primary"
                size="sm"
                class="!px-2 !py-1"
                @click="navigateByStatus(data.text)"
              >
                Urus
                <Icon name="mdi:chevron-right" class="ml-1" size="1rem" />
              </rs-button>
              <!-- <rs-button
                variant="primary"
                size="sm"
                class="!px-2 !py-1"
                @click="navigateTo(`/BF-ADN/PA/TS/02`)"
              >
                Urus
                <Icon name="mdi:chevron-right" class="ml-1" size="1rem" />
              </rs-button> -->
            </div>
          </template>
        </rs-table>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

definePageMeta({
  title: "Tugasan Saya",
});

const breadcrumb = ref([
  {
    name: "Pengurusan Aduan",
    type: "link",
    path: `/BF-ADN/PA/TS/01`,
  },
  {
    name: "Tugasan Saya (EOAD)",
    type: "current",
    path: "/BF-ADN/PA/TS/01",
  },
]);

const data = ref([
  {
    noRujukan: "ADN-2024-001",
    namaIndividu: "Ahmad bin Abdullah",
    kategoriAduan: 1,
    lokasi: "Kuala Lumpur",
    SLA: 24,
    tarikhAduan: "2024-03-15",
    status: "Aduan Baru",
    aksi: "ADN-2024-001",
  },
  {
    noRujukan: "ADN-2024-002",
    namaIndividu: "Noraini binti Ali",
    kategoriAduan: 1,
    lokasi: "Putrajaya",
    SLA: 24,
    tarikhAduan: "2024-03-14",
    status: "Dalam Proses - Siasatan Ringkas",
    aksi: "ADN-2024-002",
  },
  {
    noRujukan: "ADN-2024-003",
    namaIndividu: "Siti binti Hassan",
    kategoriAduan: 2,
    lokasi: "Selangor",
    SLA: 25,
    tarikhAduan: "2024-03-13",
    status: "Dalam Proses - Quick Assessment",
    aksi: "ADN-2024-003",
  },
  {
    noRujukan: "ADN-2024-004",
    namaIndividu: "Zulhelmi bin Rashid",
    kategoriAduan: 3,
    lokasi: "Melaka",
    SLA: 72,
    tarikhAduan: "2024-03-10",
    status: "Dalam Proses - Siasatan Lapangan",
    aksi: "ADN-2024-004",
  },
  {
    noRujukan: "ADN-2024-005",
    namaIndividu: "Sharifah Aida",
    kategoriAduan: 2,
    lokasi: "Johor Bahru",
    SLA: 24,
    tarikhAduan: "2024-03-09",
    status: "Menunggu Kelulusan Bantuan",
    aksi: "ADN-2024-005",
  },
  {
    noRujukan: "ADN-2024-006",
    namaIndividu: "Mohamad Hafiz",
    kategoriAduan: 1,
    lokasi: "Seremban",
    SLA: 12,
    tarikhAduan: "2024-03-08",
    status: "Ditamatkan – Tukar Kategori",
    aksi: "ADN-2024-006",
  },
  {
    noRujukan: "ADN-2024-007",
    namaIndividu: "Liyana Zahid",
    kategoriAduan: 2,
    lokasi: "Ipoh",
    SLA: 48,
    tarikhAduan: "2024-03-07",
    status: "Selesai",
    aksi: "ADN-2024-007",
  },
  {
    noRujukan: "ADN-2024-008",
    namaIndividu: "Khairul Azhar",
    kategoriAduan: 3,
    lokasi: "Kuantan",
    SLA: 36,
    tarikhAduan: "2024-03-06",
    status: "Ditutup",
    aksi: "ADN-2024-008",
  },
]);

const criteria = ref([
  {
    label: "Kategori Aduan",
    options: ["Keselamatan", "Kebersihan", "Infrastruktur"],
  },
  {
    label: "SLA",
    options: ["1", "2", "3"],
  },
  { 
    label: "Status",
    options: ["Belum Selesai", "Sedang Diproses", "Selesai"],
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
    "Aduan Baru": "warning",
    "Dalam Proses - Siasatan Ringkas": "primary",
    "Dalam Proses - Quick Assessment": "primary",
    "Dalam Proses - Siasatan Lapangan": "primary",
    "Menunggu Kelulusan Bantuan": "info",
    "Ditamatkan – Tukar Kategori": "info",
    "Selesai": "success",
    "Ditutup": "danger",
  };
  return variants[status] || "default";
};

const navigateByStatus = (status) => {
  console.log(status)
  if (status === "Aduan Baru") {
    navigateTo("/BF-ADN/PA/AT/02");
  } else if (status === "Dalam Proses - Siasatan Ringkas") {
    navigateTo("/BF-ADN/PA/TS/02");
  } else if (status == "Dalam Proses - Siasatan Lapangan") {
    navigateTo("/BF-ADN/PA/TS/04");
  } else if (status == "Dalam Proses - Quick Assessment") {
    navigateTo("/BF-ADN/PA/QA/01");
  } 
  else if (status == "Dalam Proses - Quick Assessment") {
    navigateTo("/BF-ADN/PA/QA/01");
  }else {
    // Default fallback kalau nak
    navigateTo("/BF-ADN/PA/AT/02");
  }
};

const getKategoriAduanVariant = (kategoriAduan) => {
  const variants = {
    1: "danger",
    2: "warning",
    3: "success",
  };
  return variants[kategoriAduan] || "default";
};

const getSLAVariant = (sla) => {
  const variants = {
    25: "success",
    24: "warning",
    50: "danger",
  };
  return variants[sla] || "default";
};

const calculateSLAHours = (tarikhAduan) => {
  const now = new Date();
  const aduanDate = new Date(tarikhAduan);
  const diffTime = Math.abs(now - aduanDate);
  return Math.ceil(diffTime / (1000 * 60 * 60));
};

const formatSLA = (tarikhAduan) => {
  const hours = calculateSLAHours(tarikhAduan);
  return `${hours} jam`;
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("ms-MY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const performSearch = () => {
  filteredData.value = data.value.filter((item) => {
    return (
      (!selectedCriteria.value.kriteria1 ||
        item.kategoriAduan.includes(selectedCriteria.value.kriteria1)) &&
      (!selectedCriteria.value.kriteria2 ||
        item.kelas.includes(selectedCriteria.value.kriteria2)) &&
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

onMounted(() => {
  // In real application, fetch only tasks that are taken by the current user
  // filteredData.value = await fetchUserTasks();
});
</script>

<style lang="scss" scoped></style>
