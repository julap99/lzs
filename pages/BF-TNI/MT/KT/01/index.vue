<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Kemasukan Tunai (Kemasukan Peti Besi)
          </h2>

          <div class="flex gap-2">
            <rs-button
              variant="primary"
              @click="navigateTo(`/BF-TNI/MT/KT/02`)"
            >
              <Icon name="material-symbols:add" class="mr-1" size="15" /> Tambah
              Baharu
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>
        <!-- Updated Table Section -->
        <rs-table
          class="mt-4"
          :key="tableKey"
          :data="safeBoxList"
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
                variant="secondary"
                size="sm"
                class="!px-2 !py-1"
                @click="auditItem(data.text)"
              >
                Tentukan Jumlah
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
        <p>Adakah anda pasti ingin memadam konfigurasi peti besi ini?</p>
        <p class="text-red-600 font-medium mt-2">
          Amaran: Pemadaman konfigurasi mungkin menjejaskan data yang berkaitan.
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button variant="primary-outline" @click="showDeleteModal = false">
            Batal
          </rs-button>
          <rs-button variant="danger" @click="handleDelete">
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
  title: "Konfigurasi Peti Besi",
  description: "Pengurusan konfigurasi peti besi dalam sistem",
});

const breadcrumb = ref([
  {
    name: "Pengurusan Tunai",
    type: "link",
    path: "/BF-TNI/MT/KT",
  },
  {
    name: "Mengurus Tunai",
    type: "link",
    path: "/BF-TNI/MT/KT/01",
  },
  {
    name: "Kemasukan Tunai (Kemasukan Peti Besi)",
    type: "current",
    path: "/BF-TNI/MT/KT/01",
  },
]);

// Table data and reactivity control
const tableKey = ref(0);
const safeBoxList = ref([
  {
    cawangan: "Cawangan Kuala Lumpur",
    jenisAkaun: "Tunai",
    nilaiAsas: 10000,
    ambangMinimum: 5000,
    kekerapanPemantauan: "Harian",
    status: "Aktif",
    tindakan: 1,
  },
  {
    cawangan: "Cawangan Johor Bahru",
    jenisAkaun: "Amil",
    nilaiAsas: 15000,
    ambangMinimum: 7500,
    kekerapanPemantauan: "Mingguan",
    status: "Aktif",
    tindakan: 2,
  },
  {
    cawangan: "Cawangan Pulau Pinang",
    jenisAkaun: "Operasi Daerah",
    nilaiAsas: 20000,
    ambangMinimum: 10000,
    kekerapanPemantauan: "Bulanan",
    status: "Aktif",
    tindakan: 3,
  },
]);

// Modal control
const showDeleteModal = ref(false);
const selectedId = ref(null);

// Methods
const editItem = (id) => {
  navigateTo(`/BF-TNI/MT/KT/03`);
};

const auditItem = (id) => {
  navigateTo(`/BF-TNI/MT/KT/04`);
};

const confirmDelete = (id) => {
  selectedId.value = id;
  showDeleteModal.value = true;
};

const handleDelete = () => {
  const index = safeBoxList.value.findIndex(
    (item) => item.tindakan === selectedId.value
  );

  if (index !== -1) {
    safeBoxList.value.splice(index, 1);
    refreshTable();
  }
  showDeleteModal.value = false;
  selectedId.value = null;

  alert("Konfigurasi peti besi berjaya dipadamkan");
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
