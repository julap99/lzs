<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card>
      <template #header>Senarai Permohonan Kelulusan SLA</template>
      <template #body>
        <rs-table
          class="mt-6"
          :key="slaData"
          :data="slaData"
          :pageSize="10"
          :showNoColumn="true"
          :options="{ variant: 'default', hover: true }"
        >
          <!-- Custom headers with blue background -->
          <template v-slot:head="{ column }">
            <span class="bg-blue-600 text-white px-3 py-2 block uppercase font-bold text-sm">
              {{ column.label }}
            </span>
          </template>

          <!-- Status badge -->
          <template v-slot:status="data">
            <div class="flex justify-center">
              <rs-badge :variant="getStatusVariant(data.text)" size="sm">
                {{ data.text }}
              </rs-badge>
            </div>
          </template>

          <!-- Tarikh Mula formatting -->
          <template v-slot:tarikhMula="data">
            <span class="font-medium">{{ formatDate(data.text) }}</span>
          </template>

          <!-- Tindakan button -->
          <template v-slot:tindakan="{ row }">
            <rs-button
              variant="secondary"
              size="sm"
              class="!px-2 !py-1"
              @click="lihat(row)"
            >
              Lihat
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
  title: "Senarai SLA",
});

const breadcrumb = ref([
  { name: "Pengurusan SLA", type: "link", path: `/BF-ADN/SLA` },
  { name: "Senarai SLA", type: "current", path: "/BF-ADN/SLA" },
]);

const slaData = ref([
  {
    tahapAduan: "Kelas 1 (Merah)",
    sla: "48",
    tarikhMula: "2025-09-15",
    status: "Menunggu Kelulusan",
    tindakan: "",
  },
  {
    tahapAduan: "Kelas 2 (Kuning)",
    sla: "72",
    tarikhMula: "2025-09-20",
    status: "Diluluskan",
    tindakan: "",
  },
]);

// Badge coloring
const getStatusVariant = (status) => {
  if (status === "Menunggu Kelulusan") return "warning";
  if (status === "Diluluskan") return "success";
  return "secondary";
};

// Format date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("ms-MY", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

// Action when clicking "Lihat"
const lihat = (row) => {
  console.log("Lihat SLA:", row);
  navigateTo("/BF-ADN/PK/KS/02/02");
};
</script>
