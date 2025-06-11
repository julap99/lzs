<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Pemulangan Tunai</h2>
          <rs-button variant="outline" @click="refreshList">
            <Icon name="material-symbols:refresh" class="mr-1" /> Refresh List
          </rs-button>
        </div>
      </template>

      <template #body>
        <!-- Filter Panel -->
        <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- ID Permohonan -->
            <FormKit
              type="text"
              name="idPermohonan"
              label="ID Permohonan Pemulangan Tunai"
              placeholder="Cari ID permohonan..."
            />

            <!-- Nama Pemohon -->
            <FormKit
              type="text"
              name="namaPemohon"
              label="Nama Pemohon"
              placeholder="Cari nama pemohon..."
            />

            <!-- Status Permohonan -->
            <FormKit
              type="select"
              name="statusPermohonan"
              label="Status Permohonan"
              :options="[
                { label: 'Diluluskan', value: 'diluluskan' },
                { label: 'Tunai Dipulangkan', value: 'tunai_dipulangkan' }
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
          :data="pemulanganList"
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
              @click.prevent="viewDetails(data.text)"
            >
              {{ data.text }}
            </a>
          </template>

          <template v-slot:namaPemohon="data">
            {{ data.text }}
          </template>

          <template v-slot:lokasiPetiBesi="data">
            {{ data.text }}
          </template>

          <template v-slot:tarikhMasaPermohonan="data">
            <div>
              <div class="font-medium">{{ formatDate(data.text) }}</div>
              <div class="text-sm text-gray-500">{{ formatTime(data.text) }}</div>
            </div>
          </template>

          <template v-slot:jumlahDipulangkan="data">
            <div class="font-medium text-right">
              RM {{ formatNumber(data.text) }}
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
                v-if="data.text.status === 'Diluluskan'"
                variant="primary"
                size="sm"
                class="!px-2 !py-1"
                @click="rekodPemulangan(data.text.id)"
              >
                Rekod Pemulangan Tunai
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
  title: "Senarai Pemulangan Tunai",
});

const breadcrumb = ref([
  {
    name: "Pentadbiran",
    type: "link",
    path: "/BF-TNI/pemulangan-tunai",
  },
  {
    name: "Pemulangan Tunai",
    type: "link",
    path: "/BF-TNI/pemulangan-tunai",
  },
  {
    name: "Senarai",
    type: "current",
    path: "/BF-TNI/pemulangan-tunai/senarai",
  },
]);

// Table data and reactivity control
const tableKey = ref(0);
const pemulanganList = ref([
  {
    idPermohonan: "PT-2024-001",
    namaPemohon: "Ahmad bin Abdullah",
    lokasiPetiBesi: "Peti Besi HQ",
    tarikhMasaPermohonan: new Date().toISOString(),
    jumlahDipulangkan: 5000,
    statusPermohonan: "Diluluskan",
    tindakan: { id: "PT-2024-001", status: "Diluluskan" }
  },
  {
    idPermohonan: "PT-2024-002",
    namaPemohon: "Siti binti Ali",
    lokasiPetiBesi: "Peti Besi Cawangan",
    tarikhMasaPermohonan: new Date().toISOString(),
    jumlahDipulangkan: 3000,
    statusPermohonan: "Tunai Dipulangkan",
    tindakan: { id: "PT-2024-002", status: "Tunai Dipulangkan" }
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

const viewDetails = (id) => {
  // Navigate to details page
  navigateTo(`/BF-TNI/pemulangan-tunai/rekod/${id}`);
};

const rekodPemulangan = (id) => {
  // Navigate to PT-05 form
  navigateTo(`/BF-TNI/pemulangan-tunai/rekod-pemulangan/${id}`);
};

// Helper functions
const formatNumber = (number) => {
  return new Intl.NumberFormat('ms-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(number);
};

const formatDate = (dateTime) => {
  if (!dateTime) return "-";
  return new Date(dateTime).toLocaleDateString("ms-MY", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};

const formatTime = (dateTime) => {
  if (!dateTime) return "-";
  return new Date(dateTime).toLocaleTimeString("ms-MY", {
    hour: "2-digit",
    minute: "2-digit"
  });
};

const getStatusVariant = (status) => {
  switch (status.toLowerCase()) {
    case 'diluluskan':
      return 'success';
    case 'tunai dipulangkan':
      return 'info';
    default:
      return 'default';
  }
};
</script>

<style lang="scss" scoped></style>
