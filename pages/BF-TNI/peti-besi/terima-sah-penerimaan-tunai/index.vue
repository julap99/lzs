<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Arahan Aktif - Terima & Sahkan Penerimaan Tunai</h2>
        </div>
      </template>

      <template #body>
        <!-- Filter Panel -->
        <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Kod Cawangan / Peti Besi -->
            <FormKit
              type="text"
              name="kodCawangan"
              label="Kod Cawangan / Peti Besi"
              placeholder="Cari kod cawangan..."
            />

            <!-- Status Terimaan -->
            <FormKit
              type="select"
              name="statusTerimaan"
              label="Status Terimaan"
              :options="[
                { label: 'Diterima', value: 'diterima' },
                { label: 'Gagal', value: 'gagal' },
                { label: 'Ditangguh', value: 'ditangguh' },
                { label: 'Belum Diterima', value: 'belum_diterima' }
              ]"
            />

            <!-- Tarikh Pindahan -->
            <FormKit
              type="date"
              name="tarikhPindahan"
              label="Tarikh Pindahan"
              range
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
          :data="instructionList"
          :pageSize="10"
          :showNoColumn="true"
          :options="{
            variant: 'default',
            hover: true,
          }"
        >
          <template v-slot:kodCawangan="data">
            {{ data.text }}
          </template>

          <template v-slot:jenisAkaun="data">
            {{ data.text }}
          </template>

          <template v-slot:jumlahTunai="data">
            <div class="font-medium text-right">
              RM {{ formatNumber(data.text) }}
            </div>
          </template>

          <template v-slot:namaPegawai="data">
            {{ data.text }}
          </template>

          <template v-slot:tarikhMasaPindahan="data">
            <div>
              <div class="font-medium">{{ formatDate(data.text) }}</div>
              <div class="text-sm text-gray-500">{{ formatTime(data.text) }}</div>
            </div>
          </template>

          <template v-slot:rujukan="data">
            <a 
              href="#" 
              class="text-primary-600 hover:text-primary-800"
              @click.prevent="viewReference(data.text)"
            >
              {{ data.text }}
            </a>
          </template>

          <template v-slot:statusTerimaan="data">
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
                :disabled="data.text.isConfirmed"
                @click="confirmReceipt(data.text.id)"
              >
                <Icon name="material-symbols:check-circle" size="15" class="mr-1" />
                Sahkan Penerimaan
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
  title: "Senarai Arahan Aktif - Terima & Sahkan Penerimaan Tunai",
});

const breadcrumb = ref([
  {
    name: "Pentadbiran",
    type: "link",
    path: "/BF-TNI/peti-besi",
  },
  {
    name: "Peti Besi",
    type: "link",
    path: "/BF-TNI/peti-besi",
  },
  {
    name: "Terima & Sahkan Penerimaan Tunai",
    type: "current",
    path: "/BF-TNI/peti-besi/terima-sah-penerimaan-tunai",
  },
]);

// Table data and reactivity control
const tableKey = ref(0);
const instructionList = ref([
  {
    kodCawangan: "PB001",
    jenisAkaun: "Amil",
    jumlahTunai: 5000,
    namaPegawai: "Ahmad bin Abdullah",
    tarikhMasaPindahan: new Date().toISOString(),
    rujukan: "KT-04-2024-001",
    statusTerimaan: "Belum Diterima",
    tindakan: { id: "AR-2024-001", isConfirmed: false }
  },
  {
    kodCawangan: "PB002",
    jenisAkaun: "Operasi Daerah",
    jumlahTunai: 3000,
    namaPegawai: "Siti binti Ali",
    tarikhMasaPindahan: new Date().toISOString(),
    rujukan: "KT-04-2024-002",
    statusTerimaan: "Diterima",
    tindakan: { id: "AR-2024-002", isConfirmed: true }
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

const viewReference = (reference) => {
  // Implement view reference logic
  console.log("Viewing reference:", reference);
};

const confirmReceipt = (id) => {
  // Navigate to confirmation form
  navigateTo(`/BF-TNI/peti-besi/terima-sah-penerimaan-tunai/sahkan/${id}`);
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
    case 'diterima':
      return 'success';
    case 'gagal':
      return 'danger';
    case 'ditangguh':
      return 'warning';
    case 'belum diterima':
      return 'default';
    default:
      return 'default';
  }
};
</script>

<style lang="scss" scoped></style>
