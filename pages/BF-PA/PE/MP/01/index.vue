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
                Semak dan Kira Elaun
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
  title: "Pilih Aktiviti Untuk Pembayaran Elaun",
  description: "Pilih aktiviti mesyuarat/program/latihan untuk pembayaran elaun penolong amil",
});

const breadcrumb = ref([
  {
    name: "Pengurusan Penolong Amil",
    type: "link",
    path: "/BF-PA/PE/MP",
  },
  {
    name: "Mesyuarat/Program",
    type: "link",
    path: "/BF-PA/PE/MP",
  },
  {
    name: "Pilih Aktiviti",
    type: "current",
    path: "/BF-PA/PE/MP/01",
  },
]);

// Table data and reactivity control
const tableKey = ref(0);
const aktivitiList = ref([
  {
    NamaAktiviti: "Latihan Pengurusan Zakat dan Fitrah",
    kodAktiviti: "MP2024-002",
    Jenis: "Latihan",
    Kehadiran: "4/5",
    Lokasi: "Dewan Latihan LZS, Kompleks Zakat Selangor",
    Tarikh: "20/03/2024",
    status: "Belum Dihantar",
    tindakan: "MP2024-002",
  },
  {
    NamaAktiviti: "Program Khidmat Masyarakat Ramadan",
    kodAktiviti: "MP2024-003",
    Jenis: "Program",
    Kehadiran: "3/3",
    Lokasi: "Masjid Al-Hidayah, Shah Alam",
    Tarikh: "25/03/2024",
    status: "Lulus",
    tindakan: "MP2024-003",
  },
  {
    NamaAktiviti: "Latihan Sistem e-Zakat",
    kodAktiviti: "MP2024-005",
    Jenis: "Latihan",
    Kehadiran: "2/2",
    Lokasi: "Bilik Latihan IT, Pejabat Zakat Petaling Jaya",
    Tarikh: "02/04/2024",
    status: "Belum Dihantar",
    tindakan: "MP2024-005",
  },
  {
    NamaAktiviti: "Program Bantuan Asnaf Bulanan",
    kodAktiviti: "MP2024-006",
    Jenis: "Program",
    Kehadiran: "45/50",
    Lokasi: "Dewan Serbaguna Masjid Kg Delek",
    Tarikh: "05/04/2024",
    status: "Di Tolak",
    tindakan: "MP2024-006",
  },
  {
    NamaAktiviti: "Mesyuarat Perancangan Aktiviti Q2",
    kodAktiviti: "MP2024-007",
    Jenis: "Mesyuarat",
    Kehadiran: "2/2",
    Lokasi: "Dewan Mesyuarat JPPA, Pejabat Zakat Kajang",
    Tarikh: "10/04/2024",
    status: "Lulus",
    tindakan: "MP2024-007",
  },
  {
    NamaAktiviti: "Latihan Pengurusan Aduan",
    kodAktiviti: "MP2024-008",
    Jenis: "Latihan",
    Kehadiran: "2/2",
    Lokasi: "Bilik Latihan, Pejabat Zakat Gombak",
    Tarikh: "12/04/2024",
    status: "Belum Dihantar",
    tindakan: "MP2024-008",
  },
]);

// Modal control
const showDeleteModal = ref(false);
const codeToDelete = ref(null);

// Methods
const editItem = (codeId) => {
  // Find the activity data based on the tindakan ID
  const activity = aktivitiList.value.find(item => item.tindakan === codeId);
  if (activity) {
    navigateTo(`/BF-PA/PE/MP/${activity.kodAktiviti}`);
  } else {
    navigateTo(`/BF-PA/PE/MP`);
  }
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
    case "Ditolak":
      return "danger";
    case "Menunggu Kelulusan":
    case "Menunggu Sokongan JPPA":
    case "Menunggu Kelulusan Ketua JPPA":
      return "warning";
    case "Belum Dihantar":
      return "default";
    default:
      return "default";
  }
};
</script>
