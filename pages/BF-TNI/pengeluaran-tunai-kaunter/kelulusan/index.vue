<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Kelulusan Tunai Kaunter</h2>
          <rs-button variant="primary-outline" @click="refreshList">
            <Icon name="material-symbols:refresh" class="mr-1" size="15" />
            Refresh List
          </rs-button>
        </div>
      </template>

      <template #body>
        <!-- Filter Panel -->
        <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- No Kaunter -->
            <FormKit
              type="text"
              name="noKaunter"
              label="No Kaunter"
              placeholder="Cari no kaunter..."
            />

            <!-- Status Permohonan -->
            <FormKit
              type="select"
              name="statusPermohonan"
              label="Status Permohonan"
              :options="[
                { label: 'Belum Permohonan', value: 'belum_permohonan' },
                { label: 'Tunggu Kelulusan', value: 'tunggu_kelulusan' },
                { label: 'Diluluskan', value: 'diluluskan' },
                { label: 'Ditolak', value: 'ditolak' },
                { label: 'Telah Diagih', value: 'telah_diagih' }
              ]"
            />

            <!-- Action Buttons -->
            <div class="flex items-end space-x-2">
              <rs-button variant="primary" @click="handleSearch">
                <Icon name="material-symbols:search" class="mr-1" /> Cari
              </rs-button>
              <rs-button variant="secondary" @click="handleReset">
                <Icon name="material-symbols:refresh" class="mr-1" /> Reset
              </rs-button>
            </div>
          </div>
        </div>

        <!-- Table Section -->
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
          <template v-slot:namaEKP="data">
            {{ data.text }}
          </template>

          <template v-slot:noKaunter="data">
            {{ data.text }}
          </template>

          <template v-slot:jumlahPengeluaran="data">
            <div class="font-medium text-right">
              RM {{ formatNumber(data.text) }}
            </div>
          </template>

          <template v-slot:tarikhMasaPermohonan="data">
            <div>
              <div class="font-medium">{{ formatDate(data.text) }}</div>
              <div class="text-sm text-gray-500">{{ formatTime(data.text) }}</div>
            </div>
          </template>

          <template v-slot:statusPermohonan="data">
            <rs-badge :variant="getStatusVariant(data.text)">
              {{ data.text }}
            </rs-badge>
          </template>

          <template v-slot:tindakan="data">
            <div class="flex space-x-2">
              <rs-button
                v-if="data.text.status === 'Tunggu Kelulusan'"
                variant="primary"
                size="sm"
                class="!px-2 !py-1"
                @click="handleSemakLuluskan(data.text.id)"
              >
                <Icon name="material-symbols:check-circle" size="15" class="mr-1" />
                Semak & Luluskan
              </rs-button>
              <rs-button
                v-if="data.text.status === 'Diluluskan'"
                variant="success"
                size="sm"
                class="!px-2 !py-1"
                @click="handleSahkanPengeluaran(data.text.id)"
              >
                <Icon name="material-symbols:payments" size="15" class="mr-1" />
                Sahkan Pengeluaran
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
  title: "Kelulusan Tunai Kaunter",
});

const breadcrumb = ref([
  {
    name: "Pengeluaran Tunai Kaunter",
    type: "link",
    path: "/BF-TNI/pengeluaran-tunai-kaunter",
  },
  {
    name: "Kelulusan",
    type: "current",
    path: "/BF-TNI/pengeluaran-tunai-kaunter/kelulusan",
  },
]);

// Table data and reactivity control
const tableKey = ref(0);
const permohonanList = ref([
  {
    id: "PK-2024-001",
    namaEKP: "Fatin bin Abu",
    noKaunter: "K001",
    jumlahPengeluaran: 400,
    tarikhMasaPermohonan: new Date().toISOString(),
    statusPermohonan: "Tunggu Kelulusan",
    tindakan: { id: "PK-2024-001", status: "Tunggu Kelulusan" }
  },
  {
    id: "PK-2024-002",
    namaEKP: "Siti binti Ali",
    noKaunter: "K002",
    jumlahPengeluaran: 300,
    tarikhMasaPermohonan: new Date().toISOString(),
    statusPermohonan: "Diluluskan",
    tindakan: { id: "PK-2024-002", status: "Diluluskan" }
  }
]);

// Methods
const handleSearch = () => {
  // Implement search logic
  tableKey.value++; // Force table refresh
};

const handleReset = () => {
  // Reset form fields
  tableKey.value++; // Force table refresh
};

const refreshList = () => {
  // Implement refresh logic
  tableKey.value++; // Force table refresh
};

const handleSemakLuluskan = (id) => {
  // Navigate to semakan page
  navigateTo(`/BF-TNI/pengeluaran-tunai-kaunter/kelulusan/semakan/${id}`);
};

const handleSahkanPengeluaran = (id) => {
  // Navigate to sahkan page
  navigateTo(`/BF-TNI/pengeluaran-tunai-kaunter/kelulusan/sahkan/${id}`);
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

const getStatusVariant = (status) => {
  switch (status) {
    case 'Belum Permohonan':
      return 'warning';
    case 'Tunggu Kelulusan':
      return 'info';
    case 'Diluluskan':
      return 'success';
    case 'Ditolak':
      return 'danger';
    case 'Telah Diagih':
      return 'default';
    default:
      return 'default';
  }
};
</script>

<style lang="scss" scoped>
// Add any custom styles here
</style>
