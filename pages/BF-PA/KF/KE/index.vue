<template>
  <div>
    <LayoutsBreadcrumb :breadcrumb="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Konfigurasi Elaun</h2>
          <rs-button
            variant="primary"
            @click="navigateTo('/BF-PA/KF/KE/01')"
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
          :data="elaunList"
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
        <p>Adakah anda pasti ingin memadam konfigurasi elaun ini?</p>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button variant="primary-outline" @click="showDeleteModal = false">
            Batal
          </rs-button>
          <rs-button variant="danger" @click="deleteElaun">
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
  title: "Konfigurasi Elaun",
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
    path: "/BF-PA/KF"
  },
  {
    title: "Elaun",
    path: "/BF-PA/KF/KE"
  }
]);

// Table data and reactivity control
const tableKey = ref(0);
const elaunList = ref([
  {
    kategoriAmil: "FITRAH",
    jawatan: "Penolong Amil",
    jenisAktiviti: "Mesyuarat",
    kadarElaun: "RM 50.00",
    status: "Aktif",
    tindakan: 1
  },
  {
    kategoriAmil: "PADI",
    jawatan: "Penolong Amil",
    jenisAktiviti: "Program",
    kadarElaun: "RM 100.00",
    status: "Aktif",
    tindakan: 2
  },
  {
    kategoriAmil: "KARIAH",
    jawatan: "Penolong Amil",
    jenisAktiviti: "Latihan",
    kadarElaun: "RM 75.00",
    status: "Menunggu Kelulusan",
    tindakan: 3
  },
  {
    kategoriAmil: "KOMUNITI",
    jawatan: "Penolong Amil",
    jenisAktiviti: "Mesyuarat",
    kadarElaun: "RM 50.00",
    status: "Aktif",
    tindakan: 4
  }
]);

// Modal control
const showDeleteModal = ref(false);
const elaunToDelete = ref(null);

// Methods
const editItem = (elaunId) => {
  navigateTo(`/BF-PA/KF/KE/01`);
};

const confirmDelete = (elaunId) => {
  elaunToDelete.value = elaunId;
  showDeleteModal.value = true;
};

const deleteElaun = () => {
  const index = elaunList.value.findIndex(
    (elaun) => elaun.tindakan === elaunToDelete.value
  );

  if (index !== -1) {
    elaunList.value.splice(index, 1);
    refreshTable();
  }
  showDeleteModal.value = false;
  elaunToDelete.value = null;

  toast.success("Konfigurasi elaun berjaya dipadamkan");
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