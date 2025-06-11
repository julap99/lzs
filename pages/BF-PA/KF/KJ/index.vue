<template>
  <div>
    <LayoutsBreadcrumb :breadcrumb="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Konfigurasi Jawatan</h2>
          <rs-button
            variant="primary"
            @click="navigateTo('/BF-PA/KF/KJ/01')"
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
          :data="jawatanList"
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
              <rs-button
                variant="danger"
                size="sm"
                class="!px-2 !py-1"
                @click="confirmDelete(data.text)"
              >
                <Icon name="material-symbols:delete-rounded" size="15"></Icon>
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
        <p>Adakah anda pasti ingin memadam konfigurasi jawatan ini?</p>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button variant="primary-outline" @click="showDeleteModal = false">
            Batal
          </rs-button>
          <rs-button variant="danger" @click="deleteJawatan">
            Sahkan Padam
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import { useToast } from "vue-toastification";

const toast = useToast();

definePageMeta({
  title: "Konfigurasi Jawatan",
});

const breadcrumb = ref([
  {
    title: "Utama",
    path: "/"
  },
  {
    title: "BF-PA",
    path: "/BF-PA"
  },
  {
    title: "Konfigurasi",
    path: "/BF-PA/KF/KJ"
  },
  {
    title: "Jawatan",
    path: "/BF-PA/KF/KJ/01"
  }
]);

// Table data and reactivity control
const tableKey = ref(0);
const jawatanList = ref([
  {
    namaJawatan: "Penolong Amil",
    kategoriAmil: "FITRAH",
    status: "Aktif",
    tempohPerkhidmatan: "2024-2026",
    tindakan: 1
  },
  {
    namaJawatan: "Penolong Amil",
    kategoriAmil: "PADI",
    status: "Aktif",
    tempohPerkhidmatan: "2024-2026",
    tindakan: 2
  },
  {
    namaJawatan: "Penolong Amil",
    kategoriAmil: "KARIAH",
    status: "Menunggu Kelulusan",
    tempohPerkhidmatan: "2024-2026",
    tindakan: 3
  },
  {
    namaJawatan: "Penolong Amil",
    kategoriAmil: "KOMUNITI",
    status: "Aktif",
    tempohPerkhidmatan: "2024-2026",
    tindakan: 4
  }
]);

// Modal control
const showDeleteModal = ref(false);
const jawatanToDelete = ref(null);

// Methods
const editItem = (jawatanId) => {
  navigateTo(`/BF-PA/KF/KJ/01`);
};

const confirmDelete = (jawatanId) => {
  jawatanToDelete.value = jawatanId;
  showDeleteModal.value = true;
};

const deleteJawatan = () => {
  const index = jawatanList.value.findIndex(
    (jawatan) => jawatan.tindakan === jawatanToDelete.value
  );

  if (index !== -1) {
    jawatanList.value.splice(index, 1);
    refreshTable();
  }
  showDeleteModal.value = false;
  jawatanToDelete.value = null;

  toast.success("Konfigurasi jawatan berjaya dipadamkan");
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
    case "Menunggu Kelulusan":
      return "warning";
    default:
      return "default";
  }
};
</script> 