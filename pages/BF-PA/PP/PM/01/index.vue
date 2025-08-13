<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai PIC Masjid</h2>
          <rs-button
            variant="primary"
            @click="navigateTo(`/BF-PA/PP/PM/02`)"
          >
            <Icon name="material-symbols:add" class="mr-1" size="15" /> Daftar
            Baru
          </rs-button>
        </div>
      </template>

      <template #body>
        <!-- Updated Table Section -->
        <rs-table
          class="mt-4"
          :key="tableKey"
          :data="picMasjidList"
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
                @click="viewItem(data.text)"
                v-if="hasPermission('view')"
              >
                <Icon
                  name="material-symbols:visibility"
                  size="15"
                  class="mr-1"
                ></Icon>
                Lihat
              </rs-button>
              <rs-button
                variant="warning"
                size="sm"
                class="!px-2 !py-1"
                @click="editItem(data.text)"
                v-if="hasPermission('update')"
              >
                <Icon
                  name="material-symbols:edit"
                  size="15"
                  class="mr-1"
                ></Icon>
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
        <p>Adakah anda pasti ingin memadam rekod PIC Masjid ini?</p>
        <p class="text-red-600 font-medium mt-2">
          Amaran: Pemadaman rekod PIC Masjid mungkin menjejaskan data yang
          berkaitan.
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button variant="primary-outline" @click="showDeleteModal = false">
            Batal
          </rs-button>
          <rs-button variant="danger" @click="deleteRecord">
            Sahkan Padam
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Senarai PIC Masjid",
  description: "Pengurusan maklumat PIC (Person In Charge) Masjid",
});

const breadcrumb = ref([
  {
    name: "Penolong Amil",
    type: "link",
    path: "/BF-PA/PP/PM/01",
  },
  {
    name: "Pendaftaran",
    type: "link",
    path: "/BF-PA/PP/PM/01",
  },
  {
    name: "PIC Masjid",
    type: "current",
    path: "/BF-PA/PP/PM/01",
  },
]);

// Table data and reactivity control
const tableKey = ref(0);
const picMasjidList = ref([
  {
    namaMasjid: "Masjid Tuanku Mizan Zainal Abidin",
    kodMasjid: "MSJ-KUL-002",
    namaPIC: "Khairul bin Anuar",
    emel: "khairul@masjid.gov.my",
    noTelefon: "017-8765432",
    tarikhDaftar: "10/03/2025",
    status: "Menunggu Kelulusan",
  },
  {
    namaMasjid: "Masjid Sultan Salahuddin Abdul Aziz Shah",
    kodMasjid: "MSJ-SLG-001",
    namaPIC: "Ahmad bin Abdullah",
    emel: "ahmad@masjid.gov.my",
    noTelefon: "019-1234567",
    tarikhDaftar: "12/01/2025",
    status: "Aktif",
  },
  {
    namaMasjid: "Masjid Wilayah Persekutuan",
    kodMasjid: "MSJ-KUL-001",
    namaPIC: "Mohd Razak bin Ibrahim",
    emel: "razak@masjid.gov.my",
    noTelefon: "013-9876543",
    tarikhDaftar: "03/02/2025",
    status: "Aktif",
  },
  {
    namaMasjid: "Masjid Putra",
    kodMasjid: "MSJ-PTJ-001",
    namaPIC: "Ismail bin Hassan",
    emel: "ismail@masjid.gov.my",
    noTelefon: "012-3456789",
    tarikhDaftar: "25/02/2025",
    status: "Aktif",
  },
]);

// Modal control
const showDeleteModal = ref(false);
const recordToDelete = ref(null);

// User permissions (simulate based on user role)
const userPermissions = ref({
  create: true,
  view: true,
  update: true,
  delete: false, // Disabled delete functionality as per original code
});

// Methods
const hasPermission = (action) => {
  return userPermissions.value[action] === true;
};

const viewItem = (recordId) => {
  navigateTo(`/BF-PS/PPK/KP/pic-masjid/${recordId}/view`);
};

const editItem = (recordId) => {
  navigateTo(`/BF-PS/PPK/KP/pic-masjid/${recordId}/edit`);
};

const confirmDelete = (recordId) => {
  recordToDelete.value = recordId;
  showDeleteModal.value = true;
};

const deleteRecord = () => {
  const index = picMasjidList.value.findIndex(
    (record) => record.tindakan === recordToDelete.value
  );

  if (index !== -1) {
    picMasjidList.value.splice(index, 1);
    refreshTable();
  }
  showDeleteModal.value = false;
  recordToDelete.value = null;

  alert("Rekod PIC Masjid berjaya dipadamkan");
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
      return "disabled"; // Use disabled for proper grey color
  }
};
</script>
