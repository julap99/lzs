<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Pembatalan Bantuan</h2>

          <!-- <div class="flex gap-2">
            <rs-button
              variant="primary-outline"
              @click="navigateTo(`/BF-BTN/KB/SB/04`)"
            >
              Skrin Pelulus
            </rs-button>
          </div> -->
        </div>
      </template>

      <template #body>
        <!-- Updated Table Section -->
        <rs-table
          class="mt-4"
          :key="tableKey"
          :data="bantuanList"
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
                :disabled="data.value.status === 'Menunggu Kelulusan'"
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
    name: "Pengurusan Bantuan",
    type: "link",
    path: "/BF-BTN/KB/SB/01",
  },
  {
    name: "Konfigurasi",
    type: "current",
    path: "/BF-BTN/KB/SB/01",
  },
  {
    name: "Selenggara",
    type: "current",
    path: "/BF-BTN/KB/SB/01",
  },
]);

// Table data and reactivity control
const tableKey = ref(0);
const bantuanList = ref([
  {
    nama: "Bantuan Kebajikan",
    kod: "BK001",
    kategori: "Kebajikan",
    status: "Dalam Pemerhatian",
    tindakan: 1,
  },
  {
    nama: "Bantuan Pendidikan",
    kod: "BP001",
    kategori: "Pendidikan",
    status: "Dalam Pemerhatian",
    tindakan: 2,
  },
  {
    nama: "Bantuan Kecemasan",
    kod: "BKC001",
    kategori: "Kecemasan",
    status: "Dalam Pemerhatian",
    tindakan: 3,
  },
  {
    nama: "Bantuan Perubatan",
    kod: "BPM001",
    kategori: "Kesihatan",
    status: "Dalam Pemerhatian",
    tindakan: 4,
  },
]);

// Modal control
const showDeleteModal = ref(false);
const codeToDelete = ref(null);

// Methods
const editItem = (codeId) => {
  navigateTo(`/BF-BTN/PB/BTLB/02`);
};

const auditItem = (codeId) => {
  navigateTo(`/BF-BTN/KB/SB/05`);
};

const confirmDelete = (codeId) => {
  codeToDelete.value = codeId;
  showDeleteModal.value = true;
};

const deleteCodeGroup = () => {
  const index = bantuanList.value.findIndex(
    (code) => code.tindakan === codeToDelete.value
  );

  if (index !== -1) {
    bantuanList.value.splice(index, 1);
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
    case "Aktif":
      return "success";
    case "Tidak Aktif":
      return "danger";
    case "Dalam Pemerhatian":
      return "warning";
    default:
      return "default";
  }
};
</script>
