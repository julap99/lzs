<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card>
      <template #header>Senarai Tindakan Perlu Semakan (EOAD)</template>
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
          <template v-slot:statusSemasa="data">
            <rs-badge :variant="getStatusVariant(data.text)" size="sm">
              {{ data.text }}
            </rs-badge>
          </template>
          <template v-slot:tarikhKemaskini="data">
            <span class="font-medium">{{ formatDate(data.text) }}</span>
          </template>
          <template v-slot:aksi="data">
            <rs-button
              variant="primary"
              size="sm"
              class="!px-2 !py-1"
              @click="navigateToDetail(data.row.idPermohonan)"
            >
              Semak
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
import { useRouter } from "vue-router";

definePageMeta({
  title: "Senarai Tindakan Perlu Semakan",
});

const router = useRouter();

const breadcrumb = ref([
  {
    name: "Pengesahan Profil",
    type: "link",
    path: `/BF-PRF/OR/KP/02`,
  },
  {
    name: "Senarai Tindakan Perlu Semakan",
    type: "current",
    path: "/BF-PRF/OR/KP/02",
  },
]);

const data = ref([
  {
    idPermohonan: "PRF-2025-001",
    namaOrganisasi: "Persatuan Amal Selangor",
    tarikhKemaskini: "2025-06-10",
    statusSemasa: "Perlu Pengesahan EOAD",
  },
  {
    idPermohonan: "PRF-2025-002",
    namaOrganisasi: "Koperasi Usahawan Muda",
    tarikhKemaskini: "2025-06-09",
    statusSemasa: "Perlu Pengesahan EOAD",
  },
  {
    idPermohonan: "PRF-2025-003",
    namaOrganisasi: "NGO Anak Malaysia",
    tarikhKemaskini: "2025-06-08",
    statusSemasa: "Perlu Pengesahan EOAD",
  },
]);

const filteredData = ref([...data.value]);

const getStatusVariant = (status) => {
  const variants = {
    "Perlu Pengesahan EOAD": "warning",
    Disahkan: "success",
    "Tidak Sah": "danger",
  };
  return variants[status] || "default";
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

const navigateToDetail = (idPermohonan) => {
  router.push(`/BF-PRF/OR/KP/02/Detail/${idPermohonan}`);
};
</script>

<style lang="scss" scoped></style>
