<template>
  <div>
    <!-- Breadcrumb -->
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Header with title + button -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold">Senarai SLA</h2>
      <NuxtLink to="/BF-ADN/PK/KS/01/02">
        <rs-button variant="primary" size="sm">
          + Tambah SLA
        </rs-button>
      </NuxtLink>
    </div>

    <!-- Card with DataTable -->
    <rs-card>
      <template #body>
        <rs-table
          class="mt-4"
          :data="slaData"
          :pageSize="5"
          :showNoColumn="true"
          :options="{
            variant: 'default',
            hover: true,
            bordered: true,
            striped: true,
            sortable: true
          }"
        >
          <!-- Custom Headings -->
          <template #head.tahapAduan>
            <span class="font-bold uppercase">Tahap Aduan</span>
          </template>
          <template #head.sla>
            <span class="font-bold uppercase">SLA</span>
          </template>
          <template #head.tarikhMula>
            <span class="font-bold uppercase">Tarikh Mula</span>
          </template>
          <template #head.status>
            <span class="font-bold uppercase">Status</span>
          </template>
          <template #head.tindakan>
            <span class="font-bold uppercase">Tindakan</span>
          </template>

          <!-- Status badge -->
          <template #status="data">
            <div class="flex justify-center">
              <rs-badge :variant="getStatusVariant(data.text)" size="sm">
                {{ data.text }}
              </rs-badge>
            </div>
          </template>

          <!-- Tarikh formatting -->
          <template #tarikhMula="data">
            <span class="font-medium">{{ formatDate(data.text) }}</span>
          </template>

          <!-- Action Buttons -->
          <template #tindakan="{ row }">
            <div class="flex space-x-2 justify-center">
              <NuxtLink to="/BF-ADN/PK/KS/01/02">
                <rs-button variant="secondary" size="sm" class="!px-2 !py-1">
                  Lihat
                </rs-button>
              </NuxtLink>
            </div>
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
  path: "/BF-ADN/PK/KS/01/01",
});

const breadcrumb = ref([
  { name: "Pengurusan SLA", type: "link", path: `/BF-ADN/SLA` },
  { name: "Senarai SLA", type: "current", path: "/BF-ADN/PK/KS/01/01" },
]);

// Dummy SLA Data
const slaData = ref([
  {
    tahapAduan: "Kelas 1 (Merah)",
    sla: "48 jam",
    tarikhMula: "2025-09-01",
    status: "Aktif",
  },
  {
    tahapAduan: "Kelas 1 (Merah)",
    sla: "24 jam",
    tarikhMula: "2025-06-01",
    status: "Tidak Aktif",
  },
  {
    tahapAduan: "Kelas 2 (Kuning)",
    sla: "72 jam",
    tarikhMula: "2025-08-15",
    status: "Aktif",
  },
]);

// Badge colors
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
</script>
