<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Mohon Tambah Nilai Tunai</h2>
          <rs-button variant="primary-outline" @click="refreshList">
            <Icon name="material-symbols:refresh" class="mr-1" size="15" />
            Refresh List
          </rs-button>
        </div>
      </template>

      <template #body>
        <rs-table
          class="mt-4"
          :key="tableKey"
          :data="requests"
          :pageSize="10"
          :showNoColumn="true"
          :options="{
            variant: 'default',
            hover: false,
          }"
        >
          <template v-slot:id="{ text, value }">
            <a
              href="#"
              class="text-primary-600 hover:text-primary-800"
              @click.prevent="handleRequestClick(value)"
            >
              {{ text }}
            </a>
          </template>

          <template v-slot:tarikhPermohonan="{ text }">
            <div>
              <div class="font-medium">{{ formatDate(text) }}</div>
              <div class="text-sm text-gray-500">{{ formatTime(text) }}</div>
            </div>
          </template>

          <template v-slot:lokasiAkaun="{ text }">
            {{ text }}
          </template>

          <template v-slot:jumlahDipohon="{ text }">
            <div class="font-medium text-right">
              RM {{ formatNumber(text) }}
            </div>
          </template>

          <template v-slot:status="{ text }">
            <rs-badge :variant="getStatusVariant(text)">
              {{ text }}
            </rs-badge>
          </template>

          <template v-slot:tindakan="{ value }">
            <div class="flex space-x-2">
              <rs-button
                v-if="value.status === 'Draft'"
                variant="primary"
                size="sm"
                class="!px-2 !py-1"
                @click="editRequest(value)"
              >
                <Icon name="material-symbols:edit" size="15" class="mr-1" />
                Edit
              </rs-button>
              <rs-button
                variant="info"
                size="sm"
                class="!px-2 !py-1"
                @click="viewRequest(value)"
              >
                <Icon
                  name="material-symbols:visibility"
                  size="15"
                  class="mr-1"
                />
                View
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
  title: "Mohon Tambah Nilai Tunai",
  description: "Senarai permohonan tambah nilai tunai",
});

// Breadcrumb
const breadcrumb = ref([
  {
    name: "Tambah Nilai Tunai",
    type: "link",
    path: "/BF-TNI/tambah-nilai-tunai",
  },
  {
    name: "Mohon Tambah Nilai Tunai",
    type: "current",
    path: "/BF-TNI/tambah-nilai-tunai/mohon-tambah-nilai-tunai",
  },
]);

// Table data and reactivity control
const tableKey = ref(0);
const requests = ref([
  {
    id: "REQ-001",
    tarikhPermohonan: "2024-03-20T10:30:00",
    lokasiAkaun: "Peti Besi A-123",
    jumlahDipohon: 5000.0,
    status: "Menunggu Proses",
    tindakan: 1,
  },
  {
    id: "REQ-002",
    tarikhPermohonan: "2024-03-19T14:45:00",
    lokasiAkaun: "Peti Besi B-456",
    jumlahDipohon: 10000.0,
    status: "Draft",
    tindakan: 2,
  },
]);

// Methods
const refreshList = () => {
  // TODO: Implement API call to refresh the list
  tableKey.value++;
};

const handleRequestClick = (request) => {
  if (request.status === "Draft") {
    editRequest(request);
  } else {
    viewRequest(request);
  }
};

const editRequest = (request) => {
  navigateTo(
    `/BF-TNI/tambah-nilai-tunai/mohon-tambah-nilai-tunai/form`
  );
};

const viewRequest = (request) => {
  navigateTo(
    `/BF-TNI/tambah-nilai-tunai/mohon-tambah-nilai-tunai/view/${request.id}`
  );
};

// Helper functions
const getStatusVariant = (status) => {
  const variants = {
    Draft: "warning",
    "Menunggu Proses": "info",
    Selesai: "success",
    Ditolak: "danger",
  };
  return variants[status] || "default";
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("ms-MY", options);
};

const formatTime = (dateString) => {
  if (!dateString) return "";
  const options = { hour: "2-digit", minute: "2-digit" };
  return new Date(dateString).toLocaleTimeString("ms-MY", options);
};

const formatNumber = (value) => {
  if (value === undefined || value === null) return "0.00";
  return parseFloat(value).toLocaleString("ms-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
</script>

<style lang="scss" scoped>
// Add any custom styles here if needed
</style>
