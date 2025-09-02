<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Bantuan</h2>
        </div>
      </template>

      <template #body>
        <!-- Main Tabs -->
        <rs-tab variant="primary" type="card">
          <rs-tab-item title="Permohonan" active>
            <!-- Permohonan Tab Content -->
            <div>
              <h3 class="text-lg font-semibold mb-4 text-gray-800">
                Senarai Permohonan
              </h3>
              <!-- Applications Table -->
              <rs-table
                :data="filteredPermohonanData"
                :columns="bantuanColumns"
                :pageSize="pageSize"
                :showNoColumn="true"
                :options="{
                  variant: 'default',
                  hover: true,
                  striped: true,
                }"
                :options-advanced="{
                  sortable: true,
                  filterable: false,
                }"
                advanced
              >
                <template v-slot:status="{ text }">
                  <rs-badge :variant="getStatusVariant(text)">
                    {{ text }}
                  </rs-badge>
                </template>

                <template v-slot:aksi="{ text }">
                  <div class="flex justify-center items-center gap-2">
                    <rs-button
                      variant="primary"
                      size="sm"
                      class="p-1 flex gap-2"
                      @click="handleReview(text)"
                    >
                      Semak
                    </rs-button>
                    <rs-button
                      variant="danger"
                      size="sm"
                      class="p-1 flex gap-2"
                      @click="handleCancel(text)"
                    >
                      Batal
                    </rs-button>
                  </div>
                </template>
              </rs-table>

              <!-- Pagination -->
              <div class="flex items-center justify-between px-5 mt-4">
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-700">Baris per halaman:</span>
                  <FormKit
                    v-model="pageSize"
                    type="select"
                    :options="[10, 25, 50]"
                    :classes="{
                      wrapper: 'w-20',
                      outer: 'mb-0',
                      input: '!rounded-lg',
                    }"
                  />
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-700">
                    Menunjukkan {{ paginationStart }} hingga
                    {{ paginationEndPermohonan }} daripada {{ totalPermohonanData }} entri
                  </span>
                  <div class="flex gap-1">
                    <rs-button
                      variant="primary-outline"
                      class="!p-1 !w-8 !h-8"
                      :disabled="currentPage === 1"
                      @click="currentPage--"
                    >
                      <Icon name="ic:round-keyboard-arrow-left" />
                    </rs-button>
                    <rs-button
                      variant="primary-outline"
                      class="!p-1 !w-8 !h-8"
                      :disabled="currentPage === totalPagesPermohonan"
                      @click="currentPage++"
                    >
                      <Icon name="ic:round-keyboard-arrow-right" />
                    </rs-button>
                  </div>
                </div>
              </div>
            </div>
          </rs-tab-item>

          <rs-tab-item title="Lulus">
            <!-- Lulus Tab Content -->
            <div>
              <h3 class="text-lg font-semibold mb-4 text-gray-800">
                Senarai Permohonan Lulus
              </h3>
              <!-- Applications Table -->
              <rs-table
                :data="filteredLulusData"
                :columns="bantuanColumns"
                :pageSize="pageSize"
                :showNoColumn="true"
                :options="{
                  variant: 'default',
                  hover: true,
                  striped: true,
                }"
                :options-advanced="{
                  sortable: true,
                  filterable: false,
                }"
                advanced
              >
                <template v-slot:status="{ text }">
                  <rs-badge :variant="getStatusVariant(text)">
                    {{ text }}
                  </rs-badge>
                </template>

                <template v-slot:aksi="{ text }">
                  <div class="flex justify-center items-center gap-2">
                    <rs-button
                      variant="primary"
                      size="sm"
                      class="p-1 flex gap-2"
                      @click="handleReview(text)"
                    >
                      Semak
                    </rs-button>
                    <rs-button
                      variant="danger"
                      size="sm"
                      class="p-1 flex gap-2"
                      @click="handleCancel(text)"
                    >
                      Batal
                    </rs-button>
                  </div>
                </template>
              </rs-table>

              <!-- Pagination -->
              <div class="flex items-center justify-between px-5 mt-4">
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-700">Baris per halaman:</span>
                  <FormKit
                    v-model="pageSize"
                    type="select"
                    :options="[10, 25, 50]"
                    :classes="{
                      wrapper: 'w-20',
                      outer: 'mb-0',
                      input: '!rounded-lg',
                    }"
                  />
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-700">
                    Menunjukkan {{ paginationStart }} hingga
                    {{ paginationEndLulus }} daripada {{ totalLulusData }} entri
                  </span>
                  <div class="flex gap-1">
                    <rs-button
                      variant="primary-outline"
                      class="!p-1 !w-8 !h-8"
                      :disabled="currentPage === 1"
                      @click="currentPage--"
                    >
                      <Icon name="ic:round-keyboard-arrow-left" />
                    </rs-button>
                    <rs-button
                      variant="primary-outline"
                      class="!p-1 !w-8 !h-8"
                      :disabled="currentPage === totalPagesLulus"
                      @click="currentPage++"
                    >
                      <Icon name="ic:round-keyboard-arrow-right" />
                    </rs-button>
                  </div>
                </div>
              </div>
            </div>
          </rs-tab-item>

          <rs-tab-item title="Ditolak">
            <!-- Ditolak Tab Content -->
            <div>
              <h3 class="text-lg font-semibold mb-4 text-gray-800">
                Senarai Permohonan Ditolak
              </h3>
              <!-- Applications Table -->
              <rs-table
                :data="filteredDitolakData"
                :columns="bantuanColumns"
                :pageSize="pageSize"
                :showNoColumn="true"
                :options="{
                  variant: 'default',
                  hover: true,
                  striped: true,
                }"
                :options-advanced="{
                  sortable: true,
                  filterable: false,
                }"
                advanced
              >
                <template v-slot:status="{ text }">
                  <rs-badge :variant="getStatusVariant(text)">
                    {{ text }}
                  </rs-badge>
                </template>

                <template v-slot:aksi="{ text }">
                  <div class="flex justify-center items-center gap-2">
                    <rs-button
                      variant="primary"
                      size="sm"
                      class="p-1 flex gap-2"
                      @click="handleReview(text)"
                    >
                      Semak
                    </rs-button>
                    <rs-button
                      variant="danger"
                      size="sm"
                      class="p-1 flex gap-2"
                      @click="handleCancel(text)"
                    >
                      Batal
                    </rs-button>
                  </div>
                </template>
              </rs-table>

              <!-- Pagination -->
              <div class="flex items-center justify-between px-5 mt-4">
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-700">Baris per halaman:</span>
                  <FormKit
                    v-model="pageSize"
                    type="select"
                    :options="[10, 25, 50]"
                    :classes="{
                      wrapper: 'w-20',
                      outer: 'mb-0',
                      input: '!rounded-lg',
                    }"
                  />
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-700">
                    Menunjukkan {{ paginationStart }} hingga
                    {{ paginationEndDitolak }} daripada {{ totalDitolakData }} entri
                  </span>
                  <div class="flex gap-1">
                    <rs-button
                      variant="primary-outline"
                      class="!p-1 !w-8 !h-8"
                      :disabled="currentPage === 1"
                      @click="currentPage--"
                    >
                      <Icon name="ic:round-keyboard-arrow-left" />
                    </rs-button>
                    <rs-button
                      variant="primary-outline"
                      class="!p-1 !w-8 !h-8"
                      :disabled="currentPage === totalPagesDitolak"
                      @click="currentPage++"
                    >
                      <Icon name="ic:round-keyboard-arrow-right" />
                    </rs-button>
                  </div>
                </div>
              </div>
            </div>
          </rs-tab-item>
        </rs-tab>
      </template>
    </rs-card>
  </div>


</template>

<script setup>
import { ref, computed } from "vue";

definePageMeta({
  title: "Senarai Bantuan",
});

const breadcrumb = ref([
  {
    name: "Bantuan",
    type: "link",
    path: "/BF-BTN/bantuan",
  },
  {
    name: "Senarai",
    type: "current",
    path: "/BF-BTN/bantuan",
  },
]);

// Table columns configuration for Bantuan tabs
const bantuanColumns = [
  {
    key: "noBantuan",
    label: "No Bantuan",
    sortable: true,
  },
  {
    key: "namaBantuan",
    label: "Nama Bantuan",
    sortable: true,
  },
  {
    key: "status",
    label: "Status Permohonan",
    sortable: true,
  },
  {
    key: "kekerapan",
    label: "Kekerapan",
    sortable: true,
  },
  {
    key: "tarikhPermohonan",
    label: "Tarikh Permohonan",
    sortable: true,
  },
  {
    key: "aksi",
    label: "Aksi",
    sortable: false,
  },
];



// State
const searchQuery = ref("");
const filters = ref({
  status: "",
});
const currentPage = ref(1);
const pageSize = ref(10);

// Mock data for Permohonan tab - applications with status: Permohonan Dihantar, Dalam Semakan, Dalam Siasatan, Dalam Kelulusan
const permohonanData = ref([
  {
    noBantuan: "B001",
    namaBantuan: "Bantuan Makanan",
    status: "Permohonan Dihantar",
    kekerapan: "Bulanan",
    tarikhPermohonan: "2024-01-15",
    aksi: "B001",
  },
  {
    noBantuan: "B002",
    namaBantuan: "Bantuan Pendidikan",
    status: "Dalam Semakan",
    kekerapan: "Sekali",
    tarikhPermohonan: "2024-01-16",
    aksi: "B002",
  },
  {
    noBantuan: "B003",
    namaBantuan: "Bantuan Perubatan",
    status: "Dalam Siasatan",
    kekerapan: "Bulanan",
    tarikhPermohonan: "2024-01-17",
    aksi: "B003",
  },
  {
    noBantuan: "B004",
    namaBantuan: "Bantuan Rumah",
    status: "Dalam Kelulusan",
    kekerapan: "Sekali",
    tarikhPermohonan: "2024-01-18",
    aksi: "B004",
  },
]);

// Mock data for Lulus tab - applications with status: Lulus
const lulusData = ref([
  {
    noBantuan: "B005",
    namaBantuan: "Bantuan Kecemasan",
    status: "Lulus",
    kekerapan: "Sekali",
    tarikhPermohonan: "2024-01-10",
    aksi: "B005",
  },
  {
    noBantuan: "B006",
    namaBantuan: "Bantuan Kematian",
    status: "Lulus",
    kekerapan: "Sekali",
    tarikhPermohonan: "2024-01-12",
    aksi: "B006",
  },
  {
    noBantuan: "B007",
    namaBantuan: "Bantuan Kelahiran",
    status: "Lulus",
    kekerapan: "Sekali",
    tarikhPermohonan: "2024-01-14",
    aksi: "B007",
  },
]);

// Mock data for Ditolak tab - applications with status: Tidak Lulus
const ditolakData = ref([
  {
    noBantuan: "B008",
    namaBantuan: "Bantuan Perniagaan",
    status: "Tidak Lulus",
    kekerapan: "Sekali",
    tarikhPermohonan: "2024-01-05",
    aksi: "B008",
  },
  {
    noBantuan: "B009",
    namaBantuan: "Bantuan Kenderaan",
    status: "Tidak Lulus",
    kekerapan: "Sekali",
    tarikhPermohonan: "2024-01-08",
    aksi: "B009",
  },
]);

// Simulasi Peranan (dropdown only, no logic)
const selectedRole = ref("Penyemak");
const roleOptions = [
  { label: "Penyemak", value: "Penyemak" },
  { label: "EOAD", value: "EOAD" },
  { label: "ETD", value: "ETD" },
  { label: "KOAD, KJ, KD", value: "KOAD,KJ,KD" },
];

// Computed properties for Permohonan tab
const filteredPermohonanData = computed(() => {
  let result = [...permohonanData.value];

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (app) =>
        app.noBantuan.toLowerCase().includes(query) ||
        app.namaBantuan.toLowerCase().includes(query) ||
        app.status.toLowerCase().includes(query)
    );
  }

  // Apply filters
  if (filters.value.status) {
    result = result.filter((app) => app.status === filters.value.status);
  }

  // Apply pagination
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return result.slice(start, end);
});

const totalPermohonanData = computed(() => {
  return permohonanData.value.length;
});

const totalPagesPermohonan = computed(() => {
  return Math.ceil(totalPermohonanData.value / pageSize.value);
});

const paginationStart = computed(() => {
  return (currentPage.value - 1) * pageSize.value + 1;
});

const paginationEndPermohonan = computed(() => {
  return Math.min(currentPage.value * pageSize.value, totalPermohonanData.value);
});

// Computed properties for Lulus tab
const filteredLulusData = computed(() => {
  let result = [...lulusData.value];

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (app) =>
        app.noBantuan.toLowerCase().includes(query) ||
        app.namaBantuan.toLowerCase().includes(query) ||
        app.status.toLowerCase().includes(query)
    );
  }

  // Apply filters
  if (filters.value.status) {
    result = result.filter((app) => app.status === filters.value.status);
  }

  // Apply pagination
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return result.slice(start, end);
});

const totalLulusData = computed(() => {
  return lulusData.value.length;
});

const totalPagesLulus = computed(() => {
  return Math.ceil(totalLulusData.value / pageSize.value);
});

const paginationEndLulus = computed(() => {
  return Math.min(currentPage.value * pageSize.value, totalLulusData.value);
});

// Computed properties for Ditolak tab
const filteredDitolakData = computed(() => {
  let result = [...ditolakData.value];

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (app) =>
        app.noBantuan.toLowerCase().includes(query) ||
        app.namaBantuan.toLowerCase().includes(query) ||
        app.status.toLowerCase().includes(query)
    );
  }

  // Apply filters
  if (filters.value.status) {
    result = result.filter((app) => app.status === filters.value.status);
  }

  // Apply pagination
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return result.slice(start, end);
});

const totalDitolakData = computed(() => {
  return ditolakData.value.length;
});

const totalPagesDitolak = computed(() => {
  return Math.ceil(totalDitolakData.value / pageSize.value);
});

const paginationEndDitolak = computed(() => {
  return Math.min(currentPage.value * pageSize.value, totalDitolakData.value);
});



// Methods
const handleReview = (noBantuan) => {
  console.log("Review bantuan:", noBantuan);
  navigateTo(`/BF-BTN/bantuan/${noBantuan}`);
};

const handleCancel = (noBantuan) => {
  console.log("Cancel bantuan:", noBantuan);
  // Handle cancel logic - would be replaced with actual implementation
  // You can add confirmation modal or API call here
};

const getStatusVariant = (status) => {
  const variants = {
    "permohonan dihantar": "info",
    "dalam semakan": "warning",
    "dalam siasatan": "warning",
    "dalam kelulusan": "secondary",
    "lulus": "success",
    "tidak lulus": "danger",
    "draf": "default",
  };
  return variants[status.toLowerCase()] || "default";
};


</script>

<style lang="scss" scoped></style>
