<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Konfigurasi Kod Rujukan</h2>
          <rs-button
            variant="primary"
            @click="navigateTo(`/BF-PS/PPK/KP/kod-baharu`)"
          >
            <Icon name="material-symbols:add" class="mr-1" /> Tambah Baharu
          </rs-button>
        </div>
      </template>

      <template #body>
        <!-- Updated Table Section -->
        <rs-table
          class="mt-4"
          :key="tableKey"
          :data="codeGroups"
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
              <!-- <rs-button
                variant="danger"
                size="sm"
                class="!px-2 !py-1"
                @click="confirmDelete(data.text)"
              >
                <Icon name="material-symbols:delete-rounded" size="15"></Icon>
              </rs-button> -->
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
    name: "Pentadbiran Sistem",
    type: "link",
    path: "/BF-PS/PPK/KP",
  },
  {
    name: "Konfigurasi Kod Rujukan",
    type: "current",
    path: "/BF-PS/PPK/KP",
  },
]);

// Table data and reactivity control
const tableKey = ref(0);
const codeGroups = ref([
  {
    kod: "Negeri",
    deskripsi: "Senarai kod negeri di Malaysia",
    status: "Aktif",
    tindakan: 1,
  },
  {
    kod: "Daerah",
    deskripsi: "Senarai kod daerah mengikut negeri",
    status: "Aktif",
    tindakan: 2,
  },
  {
    kod: "Status Pendidikan",
    deskripsi: "Tahap pendidikan seperti SPM, Diploma, Ijazah",
    status: "Aktif",
    tindakan: 3,
  },
  {
    kod: "Status Permohonan",
    deskripsi: "Status permohonan seperti Baru, Dalam Proses, Lulus, Ditolak",
    status: "Aktif",
    tindakan: 4,
  },
]);

// Modal control
const showDeleteModal = ref(false);
const codeToDelete = ref(null);

// Methods
const editItem = (codeId) => {
  navigateTo(`/BF-PS/PK/admin/${codeId}`);
};

const confirmDelete = (codeId) => {
  codeToDelete.value = codeId;
  showDeleteModal.value = true;
};

const deleteCodeGroup = () => {
  const index = codeGroups.value.findIndex(
    (code) => code.tindakan === codeToDelete.value
  );

  if (index !== -1) {
    codeGroups.value.splice(index, 1);
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
    default:
      return "default";
  }
};
</script>
