<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card>
      <template #header>Senarai SLA</template>
      <template #body>
        <rs-table
          class="mt-6"
          :key="slaData"
          :data="slaData"
          :pageSize="10"
          :showNoColumn="true"
          :options="{
            variant: 'default',
            hover: true,
          }"
        >
          <!-- Custom header for SLA column -->
          <template v-slot:head.sla>
            <span class="font-bold uppercase">SLA</span>
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
          <template v-slot:tindakan>
            <rs-button
              variant="secondary"
              size="sm"
              class="!px-2 !py-1"
              @click="lihat"
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
  {
    name: "Pengurusan SLA",
    type: "link",
    path: `/BF-ADN/SLA`,
  },
  {
    name: "Senarai SLA",
    type: "current",
    path: "/BF-ADN/SLA",
  },
]);

const slaData = ref([
  {
    tahapAduan: "Kelas 1 (Merah)",
    sla: "48 jam",
    tarikhMula: "2025-09-01",
    status: "Aktif",
    tindakan: "",
  },
  {
    tahapAduan: "Kelas 1 (Merah)",
    sla: "24 jam",
    tarikhMula: "2025-06-01",
    status: "Tidak Aktif",
    tindakan: "",
  },
  {
    tahapAduan: "Kelas 2 (Kuning)",
    sla: "72 jam",
    tarikhMula: "2025-08-15",
    status: "Aktif",
    tindakan: "",
  },
]);

// Badge coloring
const getStatusVariant = (status) => {
  return status === "Aktif" ? "success" : "danger";
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
const lihat = () => {
  navigateTo("/BF-ADN/PK/KS/01/02");
};
</script>
