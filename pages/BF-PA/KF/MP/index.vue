<!--  FROM PENOLONG AMIL MOVE TO BANTUAN PROGRAM



  RTMF SCREEN: PA-KF-KJ-01_04 (Create Category Form)
  PURPOSE: Tambah maklumat kategori penolong amil baharu
  DESCRIPTION: Create form for new Penolong Amil category (Eksekutif only)
  ROUTE: 
-->
<template>
  <div>
    <LayoutsBreadcrumb :breadcrumb="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Konfigurasi Aktiviti</h2>
          <rs-button
            variant="primary"
            @click="navigateTo('/BF-PA/KF/MP/01')"
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
                variant="info"
                size="sm"
                class="!px-2 !py-1"
                @click="showQRCode(data.text)"
              >
                <Icon name="material-symbols:qr-code" size="15"></Icon>
              </rs-button>
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
        <p>Adakah anda pasti ingin memadam konfigurasi aktiviti ini?</p>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button variant="primary-outline" @click="showDeleteModal = false">
            Batal
          </rs-button>
          <rs-button variant="danger" @click="deleteAktiviti">
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
  title: "Konfigurasi Aktiviti",
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
    title: "Aktiviti",
    path: "/BF-PA/KF/MP"
  }
]);

// Table data and reactivity control
const tableKey = ref(0);
const aktivitiList = ref([
  {
    namaAktiviti: "Mesyuarat Bulanan Penolong Amil",
    lokasi: "Dewan Utama",
    tarikhMasaMula: "20-03-2024 09:00",
    tarikhMasaTamat: "20-03-2024 12:00",
    jenisAktiviti: "Mesyuarat",
    kategoriAmil: "FITRAH",
    status: "Aktif",
    tindakan: 1
  },
  {
    namaAktiviti: "Program Latihan Asas",
    lokasi: "Bilik Latihan",
    tarikhMasaMula: "25-03-2024 08:00",
    tarikhMasaTamat: "25-03-2024 17:00",
    jenisAktiviti: "Latihan",
    kategoriAmil: "PADI",
    status: "Aktif",
    tindakan: 2
  },
  {
    namaAktiviti: "Program Khidmat Masyarakat",
    lokasi: "Masjid Al-Hidayah",
    tarikhMasaMula: "30-03-2024 08:00",
    tarikhMasaTamat: "30-03-2024 13:00",
    jenisAktiviti: "Program",
    kategoriAmil: "KARIAH",
    status: "Menunggu Kelulusan",
    tindakan: 3
  },
  {
    namaAktiviti: "Mesyuarat Koordinasi",
    lokasi: "Pejabat Zakat",
    tarikhMasaMula: "15-04-2024 10:00",
    tarikhMasaTamat: "15-04-2024 12:00",
    jenisAktiviti: "Mesyuarat",
    kategoriAmil: "KOMUNITI",
    status: "Aktif",
    tindakan: 4
  }
]);

// Modal control
const showDeleteModal = ref(false);
const aktivitiToDelete = ref(null);

// Methods
const editItem = (aktivitiId) => {
  navigateTo(`/BF-PA/KF/MP/01`);
};

const confirmDelete = (aktivitiId) => {
  aktivitiToDelete.value = aktivitiId;
  showDeleteModal.value = true;
};

const deleteAktiviti = () => {
  const index = aktivitiList.value.findIndex(
    (aktiviti) => aktiviti.tindakan === aktivitiToDelete.value
  );

  if (index !== -1) {
    aktivitiList.value.splice(index, 1);
    refreshTable();
  }
  showDeleteModal.value = false;
  aktivitiToDelete.value = null;

  toast.success("Konfigurasi aktiviti berjaya dipadamkan");
};

const refreshTable = () => {
  nextTick(() => {
    tableKey.value++; // Force table to re-render
  });
};

const showQRCode = (aktivitiId) => {
  navigateTo(`/BF-PA/KF/MP/03?id=${aktivitiId}`);
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
      return "disabled"; // Use disabled for proper grey color
  }
};
</script> 