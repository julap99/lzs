<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Pilih Aktiviti Untuk Pembayaran Elaun</h2>
        </div>
      </template>

      <template #body>
        <!-- Updated Table Section -->
        <rs-table
          class="mt-4"
          :key="tableKey"
          :data="aktivitiList"
          :pageSize="10"
          :showNoColumn="true"
          :options="{
            variant: 'default',
            hover: true,
          }"
        >
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
                @click="editItem(data.text)"
              >
                Kemaskini
              </rs-button>
            </div>
          </template>
        </rs-table>
      </template>
    </rs-card>

    <!-- Delete Confirmation Modal -->
    <rs-modal
      v-model="showDeleteModal"
      title="Sahkan Padam"
      size="md"
      position="center"
    >
      <template #body>
        <p>Adakah anda pasti ingin memadam kod rujukan ini?</p>
        <p class="text-red-600 font-medium mt-2">
          Amaran: Pemadaman kod rujukan mungkin menjejaskan data yang berkaitan.
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button variant="primary-outline" @click="showDeleteModal = false">
            Batal
          </rs-button>
          <rs-button variant="danger" @click="deleteCodeGroup">
            Sahkan Padam
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

definePageMeta({
  title: "Konfigurasi Kod Rujukan",
  description: "Pengurusan konfigurasi kod rujukan dalam sistem",
});

const breadcrumb = ref([
  {
    name: "Pengurusan Penolong Amil",
    type: "link",
    path: "/BF-PA/PE/MP/01",
  },
  {
    name: "Mesyuarat/Program",
    type: "current",
    path: "/BF-PA/PE/MP/01",
  },
  {
    name: "Pilih Aktiviti Untuk Pembayaran Elaun",
    type: "current",
    path: "/BF-PA/PE/MP/01",
  },
]);

// Table data and reactivity control
const tableKey = ref(0);
const aktivitiList = ref([
  {
    NamaAktiviti:"Nama Aktiviti",
    kodAktiviti: "MP001",
    Jenis: "Mesyuarat",
    Kehadiran:"15/30",
    Lokasi: "Lokasi",
    Tarikh: "2025-01-01",
    status: "Menunggu Kelulusan",
    tindakan: 1,
  },
  {
    NamaAktiviti:"Nama Aktiviti",
    kodAktiviti: "MP001",
    Jenis: "Mesyuarat",
    Kehadiran:"15/30",
    Lokasi: "Lokasi",
    Tarikh: "2025-01-01",
    status: "Menunggu Kelulusan",
    tindakan: 2,
  },
  {
    NamaAktiviti:"Nama Aktiviti",
    kodAktiviti: "MP001",
    Jenis: "Program",
    Kehadiran:"15/30",
    Lokasi: "Lokasi",
    Tarikh: "2025-01-01",
    status: "Lulus",
    tindakan: 3,
  },
  {
    NamaAktiviti:"Nama Aktiviti",
    kodAktiviti: "MP001",
    Jenis: "Latihan",
    Kehadiran:"15/30",
    Lokasi: "Lokasi",
    Tarikh: "2025-01-01",
    status: "Menunggu Kelulusan",
    tindakan: 4,
  },
]);

// Modal control
const showDeleteModal = ref(false);
const codeToDelete = ref(null);

// Methods
const editItem = (codeId) => {
  navigateTo(`/BF-PA/PE/MP/02`);
};

// const auditItem = (codeId) => {
//   navigateTo(`/BF-BTN/KB/SB/05`);
// };

// const confirmDelete = (codeId) => {
//   codeToDelete.value = codeId;
//   showDeleteModal.value = true;
// };

const deleteCodeGroup = () => {
  const index = aktivitiList.value.findIndex(
    (code) => code.tindakan === codeToDelete.value
  );

  if (index !== -1) {
    aktivitiList.value.splice(index, 1);
    refreshTable();
  }
  showDeleteModal.value = false;
  codeToDelete.value = null;

  alert("Kod rujukan berjaya dipadamkan");
};

const refreshTable = () => {
  nextTick(() => {
    tableKey.value++; // Force table to re-render
  });
};

// Helper function to determine badge variant based on status
const getStatusVariant = (status) => {
  switch (status) {
    case "Lulus":
      return "success";
    case "Di Tolak":
      return "danger";
    case "Menunggu Kelulusan":
      return "warning";
    default:
      return "default";
  }
};
</script>
