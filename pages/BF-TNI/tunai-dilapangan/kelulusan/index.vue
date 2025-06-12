<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Permohonan Menunggu Kelulusan</h2>
        </div>
      </template>

      <template #body>
        <!-- Filters -->
        <div class="flex flex-wrap gap-4 mb-6">
          <FormKit
            type="text"
            label="ID Permohonan"
            v-model="filters.idPermohonan"
            placeholder="Cari ID Permohonan..."
            class="w-full md:w-48"
          />
          <FormKit
            type="text"
            label="Nama EOAD Pemohon"
            v-model="filters.namaEoad"
            placeholder="Cari nama pemohon..."
            class="w-full md:w-64"
          />
          <FormKit
            type="text"
            label="Lokasi Lapangan"
            v-model="filters.lokasiLapangan"
            placeholder="Cari lokasi..."
            class="w-full md:w-64"
          />
          <div class="flex items-end space-x-2">
            <rs-button variant="primary" @click="handleSearch">
              <Icon name="material-symbols:search" class="mr-1" /> Cari
            </rs-button>
            <rs-button variant="secondary" @click="handleReset">
              <Icon name="material-symbols:refresh" class="mr-1" /> Reset
            </rs-button>
          </div>
        </div>

        <!-- Table -->
        <rs-table
          class="mt-4"
          :key="tableKey"
          :data="permohonanList"
          :pageSize="10"
          :showNoColumn="true"
          :options="{
            variant: 'default',
            hover: true,
          }"
        >
          <template v-slot:idPermohonan="data">
            <a 
              href="#" 
              class="text-primary-600 hover:text-primary-800"
              @click.prevent="viewPermohonan(data.text)"
            >
              {{ data.text }}
            </a>
          </template>

          <template v-slot:tarikhPermohonan="data">
            <div>
              <div class="font-medium">{{ formatDate(data.text) }}</div>
              <div class="text-sm text-gray-500">{{ formatTime(data.text) }}</div>
            </div>
          </template>

          <template v-slot:namaEoad="data">
            {{ data.text }}
          </template>

          <template v-slot:lokasiLapangan="data">
            {{ data.text }}
          </template>

          <template v-slot:jumlahTunai="data">
            <div class="font-medium text-right">
              RM {{ formatNumber(data.text) }}
            </div>
          </template>

          <template v-slot:status="data">
            <rs-badge variant="warning">
              {{ data.text }}
            </rs-badge>
          </template>

          <template v-slot:tindakan="data">
            <div class="flex space-x-2">
              <rs-button
                variant="primary"
                size="sm"
                class="!px-2 !py-1"
                @click="viewAndProcess(data.text)"
              >
                <Icon name="material-symbols:visibility" size="15" class="mr-1" />
                View & Lulus/Tolak
              </rs-button>
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
  title: "Senarai Permohonan Menunggu Kelulusan",
  middleware: ["auth"],
  requiresAuth: true,
});

// Breadcrumb
const breadcrumb = ref([
  {
    name: "Tunai Dilapangan",
    type: "link",
    path: "/BF-TNI/tunai-dilapangan",
  },
  {
    name: "Kelulusan",
    type: "current",
    path: "/BF-TNI/tunai-dilapangan/kelulusan",
  },
]);

// Table data and reactivity control
const tableKey = ref(0);
const filters = ref({
  idPermohonan: "",
  namaEoad: "",
  lokasiLapangan: "",
});

// Sample data - in a real app, this would come from an API
const permohonanList = ref([
  {
    idPermohonan: "TD-2024-001",
    tarikhPermohonan: new Date().toISOString(),
    namaEoad: "Ahmad bin Abdullah",
    lokasiLapangan: "Lokasi A",
    jumlahTunai: 5000,
    status: "Menunggu Kelulusan",
    tindakan: "TD-2024-001"
  },
  {
    idPermohonan: "TD-2024-002",
    tarikhPermohonan: new Date().toISOString(),
    namaEoad: "Siti binti Ali",
    lokasiLapangan: "Lokasi B",
    jumlahTunai: 3000,
    status: "Menunggu Kelulusan",
    tindakan: "TD-2024-002"
  }
]);

// Methods
const handleSearch = () => {
  // Implement search logic
  tableKey.value++; // Force table refresh
};

const handleReset = () => {
  // Reset form fields
  filters.value = {
    idPermohonan: "",
    namaEoad: "",
    lokasiLapangan: "",
  };
  tableKey.value++; // Force table refresh
};

const viewPermohonan = (id) => {
  navigateTo(`/BF-TNI/tunai-dilapangan/kelulusan/form/${id}`);
};

const viewAndProcess = (id) => {
  navigateTo(`/BF-TNI/tunai-dilapangan/kelulusan/form/${id}`);
};

// Helper functions
const formatNumber = (number) => {
  return new Intl.NumberFormat('ms-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(number);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ms-MY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('ms-MY', {
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<style lang="scss" scoped></style>
