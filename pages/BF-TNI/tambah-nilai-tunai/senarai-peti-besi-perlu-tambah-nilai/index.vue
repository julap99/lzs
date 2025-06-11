<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Senarai Peti Besi Perlu Tambah Nilai
          </h2>
          <rs-button variant="outline" @click="refreshList">
            <Icon name="material-symbols:refresh" class="mr-1" /> Refresh List
          </rs-button>
        </div>
      </template>

      <template #body>
        <!-- Filter Panel -->
        <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- ID Peti Besi -->
            <FormKit
              type="text"
              name="idPetiBesi"
              label="ID Peti Besi"
              placeholder="Cari ID peti besi..."
            />

            <!-- Nama & Kod Cawangan -->
            <FormKit
              type="text"
              name="namaCawangan"
              label="Nama & Kod Cawangan"
              placeholder="Cari nama atau kod cawangan..."
            />

            <!-- Status Tambah Nilai -->
            <FormKit
              type="select"
              name="statusTambahNilai"
              label="Status Tambah Nilai"
              :options="[
                { label: 'Perlu Proses', value: 'perlu_proses' },
                {
                  label: 'Sudah Ditambah Nilai',
                  value: 'sudah_ditambah_nilai',
                },
                { label: 'Arahan Dikeluarkan', value: 'arahan_dikeluarkan' },
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
          :key="tableKey"
          :data="safeBoxList"
          :pageSize="10"
          :showNoColumn="true"
          :options="{
            variant: 'default',
            hover: true,
          }"
        >
          <template v-slot:bakiSemasa="{ text }">
            RM {{ formatNumber(text) }}
          </template>

          <template v-slot:hadMinimum="{ text }">
            RM {{ formatNumber(text) }}
          </template>

          <template v-slot:nilaiAsas="{ text }">
            RM {{ formatNumber(text) }}
          </template>

          <template v-slot:jumlahDicadangkan="{ text }">
            RM {{ formatNumber(text) }}
          </template>

          <template v-slot:status="{ text }">
            <rs-badge :variant="getStatusVariant(text)">
              {{ formatStatus(text) }}
            </rs-badge>
          </template>

          <template v-slot:tindakan="{ value }">
            <div class="flex space-x-2">
              <rs-button
                v-if="value.status === 'perlu_proses'"
                variant="primary"
                size="sm"
                class="!px-2 !py-1"
                @click="handleTambahNilai(value)"
              >
                Tambah Nilai
              </rs-button>
              <rs-button
                v-if="value.status === 'sudah_ditambah_nilai'"
                variant="info"
                size="sm"
                class="!px-2 !py-1"
                @click="handleKeluarkanArahan(value)"
              >
                Keluarkan Arahan
              </rs-button>
              <rs-button
                v-if="value.status === 'arahan_dikeluarkan'"
                variant="secondary"
                size="sm"
                class="!px-2 !py-1"
                @click="handleSuratArahan(value)"
              >
                Surat Arahan
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
  title: "Senarai Peti Besi Perlu Tambah Nilai",
  description: "Senarai peti besi yang memerlukan tambah nilai",
});

const breadcrumb = ref([
  {
    name: "Tambah Nilai Tunai",
    type: "link",
    path: "/BF-TNI/tambah-nilai-tunai",
  },
  {
    name: "Senarai Peti Besi Perlu Tambah Nilai",
    type: "current",
    path: "/BF-TNI/tambah-nilai-tunai/senarai-peti-besi-perlu-tambah-nilai",
  },
]);

// Table data and reactivity control
const tableKey = ref(0);
const safeBoxList = ref([
  {
    idPetiBesi: "PB001",
    namaCawangan: "Cawangan Kuala Lumpur (KL001)",
    jenisAkaun: "Amil",
    bakiSemasa: 5000.0,
    hadMinimum: 10000.0,
    nilaiAsas: 15000.0,
    jumlahDicadangkan: 10000.0,
    sourceTrigger: "Auto",
    status: "perlu_proses",
    tindakan: { id: "PB001", status: "perlu_proses" },
  },
  {
    idPetiBesi: "PB002",
    namaCawangan: "Cawangan Johor Bahru (JB001)",
    jenisAkaun: "Operasi Daerah",
    bakiSemasa: 7500.0,
    hadMinimum: 8000.0,
    nilaiAsas: 12000.0,
    jumlahDicadangkan: 4500.0,
    sourceTrigger: "Manual",
    status: "sudah_ditambah_nilai",
    tindakan: { id: "PB002", status: "sudah_ditambah_nilai" },
  },
  {
    idPetiBesi: "PB003",
    namaCawangan: "Cawangan Pulau Pinang (PP001)",
    jenisAkaun: "Tunai",
    bakiSemasa: 12000.0,
    hadMinimum: 10000.0,
    nilaiAsas: 20000.0,
    jumlahDicadangkan: 8000.0,
    sourceTrigger: "Auto",
    status: "arahan_dikeluarkan",
    tindakan: { id: "PB003", status: "arahan_dikeluarkan" },
  },
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

const handleTambahNilai = (value) => {
  navigateTo(`/BF-TNI/tambah-nilai-tunai/tambah-nilai/${value.id}`);
};

const handleKeluarkanArahan = (value) => {
  navigateTo(`/BF-TNI/tambah-nilai-tunai/keluarkan-arahan/${value.id}`);
};

const handleSuratArahan = (value) => {
  // Implement download PDF logic
  console.log("Downloading surat arahan for:", value.id);

  navigateTo(`/BF-TNI/tambah-nilai-tunai/keluarkan-arahan/${value.id}`);
};

// Helper functions
const formatNumber = (number) => {
  return new Intl.NumberFormat("ms-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

const getStatusVariant = (status) => {
  const variants = {
    perlu_proses: "warning",
    sudah_ditambah_nilai: "info",
    arahan_dikeluarkan: "success",
  };
  return variants[status] || "default";
};

const formatStatus = (status) => {
  const statusMap = {
    perlu_proses: "Perlu Proses",
    sudah_ditambah_nilai: "Sudah Ditambah Nilai",
    arahan_dikeluarkan: "Arahan Dikeluarkan",
  };
  return statusMap[status] || status;
};
</script>

<style lang="scss" scoped></style>
