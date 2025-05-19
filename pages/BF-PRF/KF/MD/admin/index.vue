<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Konfigurasi Had Kifayah</h2>
          <rs-button variant="primary" @click="navigateTo(`admin/tambah`)">
            <Icon name="material-symbols:add" class="mr-1" /> Tambah Baharu
          </rs-button>
        </div>
      </template>

      <template #body>
        <!-- Debug info - remove in production -->
        <div class="mb-4 p-2 bg-gray-100 rounded">
          <p>Jumlah Konfigurasi: {{ kifayahLimits.length }}</p>
          <p>Kelulusan Menunggu: {{ pendingApprovalCount }}</p>
        </div>

        <!-- Updated Table Section -->
        <rs-table
          class="mt-4"
          :key="tableKey"
          :data="kifayahLimits"
          :pageSize="10"
          :showNoColumn="true"
          :options="{
            variant: 'default',
            hover: true,
          }"
        >
          <template v-slot:kadarBerbayar="data"> RM {{ data.text }} </template>
          <template v-slot:kadarPercuma="data"> RM {{ data.text }} </template>

          <template v-slot:tindakan="data">
            <rs-button
              variant="primary"
              size="sm"
              class="!px-2 !py-1"
              @click="navigateTo(`admin/${data.text}`)"
              >Lebih
              <Icon name="mdi:chevron-right" class="ml-1" size="1rem" />
            </rs-button>
          </template>
        </rs-table>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";

definePageMeta({
  title: "Konfigurasi Had Kifayah",
});

const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/KF/HK/admin",
  },
  {
    name: "Konfigurasi Had Kifayah",
    type: "current",
    path: "/BF-PRF/KF/HK/admin",
  },
]);

// Table data and reactivity control
const tableKey = ref(0);
const kifayahLimits = ref([
  {
    kategori: "Utama",
    jenisIsiRumah: "Ketua Keluarga",
    kadarBerbayar: 1200.0,
    kadarPercuma: 1000.0,
    tarikhMulaBerkuatkuasa: "2025-01-01",
    status: "Aktif",
    tindakan: 1,
  },
  {
    kategori: "Utama",
    jenisIsiRumah: "Dewasa Bekerja (18 tahun ke atas)",
    kadarBerbayar: 800.0,
    kadarPercuma: 600.0,
    tarikhMulaBerkuatkuasa: "2025-01-01",
    status: "Aktif",
    tindakan: 2,
  },
  {
    kategori: "Tambahan",
    jenisIsiRumah: "Anak (Bawah 18 tahun)",
    kadarBerbayar: 400.0,
    kadarPercuma: 300.0,
    tarikhMulaBerkuatkuasa: "2025-01-01",
    status: "Tidak Aktif",
    tindakan: 3,
  },
  {
    kategori: "Tambahan",
    jenisIsiRumah: "Bayi (Bawah 2 tahun)",
    kadarBerbayar: 200.0,
    kadarPercuma: 150.0,
    tarikhMulaBerkuatkuasa: "2025-03-15",
    status: "Menunggu Kelulusan",
    tindakan: 4,
  },
]);

// Computed property to count pending approval items
const pendingApprovalCount = computed(() => {
  return kifayahLimits.value.filter(
    (item) => item.status === "Menunggu Kelulusan"
  ).length;
});

// Form data
const formData = ref({
  id: null,
  category: "",
  householdType: "",
  paidHouseRate: 0,
  freeHouseRate: 0,
  effectiveDate: "",
  status: "Menunggu Kelulusan", // Default status for new entries
});

// Options for dropdowns
const kategoriOptions = ref([
  { label: "Utama", value: "Utama" },
  { label: "Tambahan", value: "Tambahan" },
]);

const householdOptions = ref([
  { label: "Ketua Keluarga", value: "Ketua Keluarga" },
  {
    label: "Dewasa Bekerja (18 tahun ke atas)",
    value: "Dewasa Bekerja (18 tahun ke atas)",
  },
  {
    label: "Dewasa Tidak Bekerja (18 tahun ke atas)",
    value: "Dewasa Tidak Bekerja (18 tahun ke atas)",
  },
  { label: "Anak (Bawah 18 tahun)", value: "Anak (Bawah 18 tahun)" },
  { label: "Bayi (Bawah 2 tahun)", value: "Bayi (Bawah 2 tahun)" },
]);

// Modal control
const showModal = ref(false);
const isEditing = ref(false);
const processing = ref(false);

const modalTitle = computed(() => {
  return isEditing.value ? "Kemaskini Had Kifayah" : "Tambah Had Kifayah";
});

// Make sure the table refreshes when component mounts
onMounted(() => {
  refreshTable();
});

// Methods
const showAddModal = () => {
  isEditing.value = false;
  resetForm();
  showModal.value = true;
};

const editItem = (item) => {
  isEditing.value = true;
  // Create a deep copy to avoid modifying the original data
  formData.value = JSON.parse(JSON.stringify(item));
  // Set status to "Menunggu Kelulusan" as we're editing
  formData.value.originalStatus = item.status; // Store original status
  showModal.value = true;
};

const toggleStatus = (item) => {
  const index = kifayahLimits.value.findIndex((i) => i.id === item.id);
  if (index !== -1) {
    const updatedItem = { ...kifayahLimits.value[index] };
    // Set to pending status instead of directly changing
    updatedItem.previousStatus = updatedItem.status;
    updatedItem.status = "Menunggu Kelulusan";
    updatedItem.statusChangeRequested =
      updatedItem.previousStatus === "Aktif" ? "Tidak Aktif" : "Aktif";

    kifayahLimits.value.splice(index, 1, updatedItem);
    refreshTable();
  }
};

const handleSubmit = () => {
  processing.value = true;

  // Ensure numeric values are properly parsed
  const paidRate = parseFloat(formData.value.paidHouseRate);
  const freeRate = parseFloat(formData.value.freeHouseRate);

  if (isNaN(paidRate) || isNaN(freeRate)) {
    alert("Sila masukkan nilai kadar yang sah");
    processing.value = false;
    return;
  }

  // Create a new object to avoid reference issues
  const submittedData = {
    id: formData.value.id,
    category: formData.value.category,
    householdType: formData.value.householdType,
    paidHouseRate: paidRate,
    freeHouseRate: freeRate,
    effectiveDate: formData.value.effectiveDate,
    status: "Menunggu Kelulusan", // Always set to pending for approval
  };

  setTimeout(() => {
    if (isEditing.value) {
      // For editing, store the original data for reference
      submittedData.originalStatus = formData.value.originalStatus;

      // Update existing item
      const index = kifayahLimits.value.findIndex(
        (i) => i.id === submittedData.id
      );
      if (index !== -1) {
        kifayahLimits.value.splice(index, 1, submittedData);
      }
    } else {
      // Add new item
      const newId =
        kifayahLimits.value.length > 0
          ? Math.max(...kifayahLimits.value.map((i) => i.id)) + 1
          : 1;

      submittedData.id = newId;
      kifayahLimits.value.push(submittedData);
    }

    refreshTable();
    processing.value = false;
    showModal.value = false;
  }, 500);
};

const cancelForm = () => {
  showModal.value = false;
  resetForm();
};

const resetForm = () => {
  formData.value = {
    id: null,
    category: "",
    householdType: "",
    paidHouseRate: 0,
    freeHouseRate: 0,
    effectiveDate: "",
    status: "Menunggu Kelulusan", // Default status for new entries
  };
};

const refreshTable = () => {
  nextTick(() => {
    tableKey.value++; // Force table to re-render
    console.log("Table refreshed, records:", kifayahLimits.value.length);
    console.log("Pending approval:", pendingApprovalCount.value);
  });
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("ms-MY", options);
};

const formatCurrency = (value) => {
  if (value === undefined || value === null) return "0.00";
  return parseFloat(value).toLocaleString("ms-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
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
