<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Kelulusan Had Kifayah</h2>
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
          <template v-slot:kategori="data">
            {{ data.text }}
          </template>

          <template v-slot:jenisIsiRumah="data">
            {{ data.text }}
          </template>

          <template v-slot:kadarBerbayar="data">
            RM {{ formatCurrency(data.text) }}
          </template>

          <template v-slot:kadarPercuma="data">
            RM {{ formatCurrency(data.text) }}
          </template>

          <template v-slot:tarikhMulaBerkuatkuasa="data">
            {{ formatDate(data.text) }}
          </template>

          <template v-slot:status="data">
            <rs-badge :variant="getStatusVariant(data.text)">
              {{ data.text }}
            </rs-badge>
          </template>

          <template v-slot:createdAt="data">
            {{ formatDate(data.text) }}
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
import { ref, computed, onMounted } from "vue";

definePageMeta({
  title: "Kelulusan Had Kifayah",
  middleware: ["auth", "approver"], // Assuming you have middleware for approvers
});

const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/KF/HK/01/pelulus",
  },
  {
    name: "Mengurus Konfigurasi",
    type: "link",
    path: "/BF-PRF/KF/HK/01/pelulus",
  },
  {
    name: "Kelulusan Had Kifayah",
    type: "current",
    path: "/BF-PRF/KF/HK/01/pelulus",
  },
]);

// Sample data - in a real app, this would come from an API
const kifayahLimits = ref([
  {
    kategori: "Utama",
    jenisIsiRumah: "Ketua Keluarga",
    kadarBerbayar: 1200.0,
    kadarPercuma: 1000.0,
    tarikhMulaBerkuatkuasa: "2025-01-01",
    status: "Menunggu Kelulusan",
    createdBy: "Ahmad bin Ali",
    createdAt: "2025-05-15T10:30:00",
    tindakan: 1,
  },
  {
    kategori: "Utama",
    jenisIsiRumah: "Dewasa Bekerja (18 tahun ke atas)",
    kadarBerbayar: 800.0,
    kadarPercuma: 600.0,
    tarikhMulaBerkuatkuasa: "2025-01-01",
    status: "Menunggu Kelulusan",
    createdBy: "Siti binti Abu",
    createdAt: "2025-05-16T14:45:00",
    tindakan: 2,
  },
  {
    kategori: "Tambahan",
    jenisIsiRumah: "Anak (Bawah 18 tahun)",
    kadarBerbayar: 400.0,
    kadarPercuma: 300.0,
    tarikhMulaBerkuatkuasa: "2025-01-01",
    status: "Menunggu Kelulusan",
    createdBy: "Ali bin Hassan",
    createdAt: "2025-05-10T09:15:00",
    tindakan: 3,
  },
]);

const tableKey = ref(0);

// Computed properties
const pendingApprovals = computed(() => {
  return kifayahLimits.value.filter(
    (item) => item.status === "Menunggu Kelulusan"
  );
});

const pendingApprovalCount = computed(() => {
  return pendingApprovals.value.length;
});

// Methods
const viewDetails = (item) => {
  // Navigate to detail view
  navigateTo(`/BF-PRF/KF/HK/pelulus/${item.id}`);
};

const refreshTable = () => {
  tableKey.value++;
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("ms-MY", options);
};

const formatCurrency = (value) => {
  if (value === undefined || value === null) return "0.00";
  return parseFloat(value).toLocaleString("ms-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
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
