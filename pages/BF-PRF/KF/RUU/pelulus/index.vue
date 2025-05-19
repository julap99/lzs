<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Kelulusan Dimensi</h2>
          <rs-badge variant="warning" class="text-sm">
            <Icon name="mdi:clock-outline" class="mr-1" />
            {{ pendingApprovalCount }} Permohonan Menunggu
          </rs-badge>
        </div>
      </template>

      <template #body>
        <!-- Approval Table Section -->
        <rs-table
          class="mt-4"
          :key="tableKey"
          :data="pendingApprovals"
          :pageSize="10"
          :showNoColumn="true"
          :options="{
            variant: 'default',
            hover: true,
          }"
        >
          <template v-slot:dimensi="data">
            {{ data.text }}
          </template>

          <template v-slot:tarikhPertukaran="data">
            {{ formatDate(data.text) }}
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
                @click="viewDetails(data.value)"
              >
                Lebih
                <Icon name="mdi:chevron-right" class="ml-1" size="1rem" />
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
  title: "Kelulusan Konfigurasi Dimensi",
  middleware: ["auth", "approver"],
});

const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/KF/MD/pelulus",
  },
  {
    name: "Mengurus Konfigurasi",
    type: "link",
    path: "/BF-PRF/KF/MD/pelulus",
  },
  {
    name: "Kelulusan Dimensi",
    type: "current",
    path: "/BF-PRF/KF/MD/pelulus",
  },
]);

// Sample data for dimension approvals
const dimensionApprovals = ref([
  {
    dimensi: "Umur",
    tarikhPertukaran: "2025-05-18T14:30:00",
    status: "Menunggu Kelulusan",
    tindakan: 1,
  },
  {
    dimensi: "Pendapatan",
    tarikhPertukaran: "2025-05-17T11:15:00",
    status: "Menunggu Kelulusan",
    tindakan: 2,
  },
]);

const tableKey = ref(0);

// Computed properties
const pendingApprovals = computed(() => {
  return dimensionApprovals.value.filter(
    (item) => item.status === "Menunggu Kelulusan"
  );
});

const pendingApprovalCount = computed(() => {
  return pendingApprovals.value.length;
});

// Methods
const viewDetails = (item) => {
  navigateTo(`/BF-PRF/KF/MD/pelulus/${item.tindakan}`);
};

const refreshTable = () => {
  tableKey.value++;
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("ms-MY", options);
};

const getStatusVariant = (status) => {
  switch (status) {
    case "Diluluskan":
      return "success";
    case "Ditolak":
      return "danger";
    case "Menunggu Kelulusan":
      return "warning";
    default:
      return "default";
  }
};
</script>
