<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Kelulusan Status Household / Individu</h2>
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
          <template v-slot:statusAsnaf="data">
            {{ data.text }}
          </template>

          <template v-slot:kategori="data">
            <rs-badge variant="info">{{ data.text }}</rs-badge>
          </template>

          <template v-slot:requestedBy="data">
            {{ data.text }}
          </template>

          <template v-slot:requestDate="data">
            {{ formatDate(data.text) }}
          </template>

          <template v-slot:status="data">
            <rs-badge :variant="getStatusVariant(data.text)">
              {{ data.text }}
            </rs-badge>
          </template>

          <template v-slot:tindakan="data">
            <rs-button
              variant="primary"
              size="sm"
              class="!px-2 !py-1"
              @click="navigateTo(`pelulus/${data.text}`)"
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
import { ref, computed } from "vue";

definePageMeta({
  title: "Kelulusan Status Household / Individu",
  middleware: ["auth", "approver"], // Assuming you have middleware for approvers
});

const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/KF/SHI/pelulus",
  },
  {
    name: "Mengurus Konfigurasi",
    type: "link",
    path: "/BF-PRF/KF/SHI/pelulus",
  },
  {
    name: "Kelulusan Status Household / Individu",
    type: "current",
    path: "/BF-PRF/KF/SHI/pelulus",
  },
]);

// Sample data - in a real app, this would come from an API
const statusApprovals = ref([
  {
    statusAsnaf: "Fakir",
    kategori: "Household",
    requestedBy: "Ahmad bin Ali",
    requestDate: "2025-01-15T10:30:00",
    status: "Menunggu Kelulusan",
    tindakan: 1,
  },
  {
    statusAsnaf: "Miskin",
    kategori: "Household", 
    requestedBy: "Siti binti Omar",
    requestDate: "2025-01-14T14:15:00",
    status: "Menunggu Kelulusan",
    tindakan: 2,
  },
  {
    statusAsnaf: "Mualaf",
    kategori: "Individu",
    requestedBy: "Mohd Zain bin Hassan",
    requestDate: "2025-01-13T09:00:00",
    status: "Menunggu Kelulusan",
    tindakan: 3,
  },
  {
    statusAsnaf: "Gharimin",
    kategori: "Household",
    requestedBy: "Nurul Ain binti Ahmad",
    requestDate: "2025-01-12T16:45:00",
    status: "Menunggu Kelulusan",
    tindakan: 4,
  },
]);

const tableKey = ref(0);

// Computed properties
const pendingApprovals = computed(() => {
  return statusApprovals.value.filter(
    (item) => item.status === "Menunggu Kelulusan"
  );
});

const pendingApprovalCount = computed(() => {
  return pendingApprovals.value.length;
});

// Methods
const viewDetails = (item) => {
  // Navigate to detail view
  navigateTo(`/BF-PRF/KF/SHI/pelulus/${item.id}`);
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
    minute: "2-digit"
  };
  return new Date(dateString).toLocaleDateString("ms-MY", options);
};

const getStatusVariant = (status) => {
  switch (status) {
    case "Aktif":
      return "success";
    case "Tidak Aktif":
      return "danger";
    case "Menunggu Kelulusan":
      return "warning";
    case "Diluluskan":
      return "success";
    case "Ditolak":
      return "danger";
    default:
      return "default";
  }
};
</script> 