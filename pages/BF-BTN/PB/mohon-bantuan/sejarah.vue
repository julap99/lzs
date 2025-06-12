<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Sejarah Permohonan</h2>
        </div>
      </template>

      <template #body>
        <!-- Search and Filter Section -->
        <div class="px-5 mb-4">
          <div class="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <FormKit
              v-model="searchQuery"
              type="search"
              placeholder="Cari permohonan..."
              :classes="{
                wrapper: 'w-full md:w-64',
                outer: 'mb-0',
                input: '!rounded-lg',
              }"
            />
            <div class="flex gap-2">
              <rs-button
                variant="primary-outline"
                class="!px-3"
                @click="isFilterOpen = !isFilterOpen"
              >
                <Icon name="ic:outline-filter-alt" class="mr-1" size="1rem" />
                <span>Penapis</span>
              </rs-button>
              <rs-button
                variant="primary-outline"
                class="!px-3"
                @click="handleRefresh"
              >
                <Icon name="ic:outline-refresh" class="mr-1" size="1rem" />
                <span>Segar Semula</span>
              </rs-button>
            </div>
          </div>

          <!-- Filter Panel -->
          <div v-if="isFilterOpen" class="mt-4 p-4 bg-gray-50 rounded-lg">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormKit
                v-model="filters.status"
                type="select"
                label="Status"
                :options="statusOptions"
                :classes="{
                  outer: 'mb-0',
                  input: '!rounded-lg',
                }"
              />
              <FormKit
                v-model="filters.jenisBantuan"
                type="select"
                label="Jenis Bantuan"
                :options="jenisBantuanOptions"
                :classes="{
                  outer: 'mb-0',
                  input: '!rounded-lg',
                }"
              />
              <FormKit
                v-model="filters.tahun"
                type="select"
                label="Tahun"
                :options="tahunOptions"
                :classes="{
                  outer: 'mb-0',
                  input: '!rounded-lg',
                }"
              />
            </div>
          </div>
        </div>

        <!-- Applications Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  No. Rujukan
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tarikh
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Jenis Bantuan
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Jumlah (RM)
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tindakan
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="permohonan in filteredApplications" :key="permohonan.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ permohonan.nomborRujukan }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ permohonan.tarikh }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ permohonan.jenisBantuan }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  RM {{ permohonan.jumlah }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <rs-badge :variant="getStatusVariant(permohonan.status)">
                    {{ permohonan.status }}
                  </rs-badge>
                </td>
                <td class="px-6 py-4 text-center">
                  <div class="flex justify-center items-center gap-2">
                    <rs-button
                      variant="primary-outline"
                      class="p-1 w-6 h-6"
                      @click="viewDetails(permohonan)"
                    >
                      <Icon name="ph:eye" />
                    </rs-button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between px-5 mt-4">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-700">Baris per halaman:</span>
            <FormKit
              v-model="pageSize"
              type="select"
              :options="[10, 25, 50, 100]"
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
              {{ paginationEnd }} daripada {{ totalApplications }} entri
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
                :disabled="currentPage === totalPages"
                @click="currentPage++"
              >
                <Icon name="ic:round-keyboard-arrow-right" />
              </rs-button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Details Modal -->
    <rs-modal
      v-model="isDetailsModalVisible"
      title="Butiran Permohonan"
      size="lg"
      position="center"
    >
      <div v-if="selectedApplication" class="space-y-6">
        <!-- Basic Information -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">No. Rujukan</p>
            <p class="font-medium">{{ selectedApplication.nomborRujukan }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Tarikh</p>
            <p class="font-medium">{{ selectedApplication.tarikh }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Jenis Bantuan</p>
            <p class="font-medium">{{ selectedApplication.jenisBantuan }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Jumlah</p>
            <p class="font-medium">RM {{ selectedApplication.jumlah }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Status</p>
            <p class="font-medium">
              <rs-badge :variant="getStatusVariant(selectedApplication.status)">
                {{ selectedApplication.status }}
              </rs-badge>
            </p>
          </div>
        </div>

        <!-- Application Details -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium">Keterangan Permohonan</h3>
          <p class="text-gray-600">{{ selectedApplication.keterangan }}</p>
        </div>

        <!-- Documents -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium">Dokumen Sokongan</h3>
          <div class="grid grid-cols-2 gap-4">
            <div
              v-for="(doc, index) in selectedApplication.dokumen"
              :key="index"
              class="flex items-center gap-2 p-2 bg-gray-50 rounded"
            >
              <Icon name="material-symbols:description" class="text-gray-500" />
              <span class="text-sm">{{ doc.nama }}</span>
              <rs-button
                variant="primary-outline"
                size="sm"
                class="ml-auto"
                @click="downloadDocument(doc)"
              >
                <Icon name="material-symbols:download" />
              </rs-button>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <rs-button variant="primary" @click="isDetailsModalVisible = false">
          Tutup
        </rs-button>
      </template>
    </rs-modal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: "Sejarah Permohonan",
});

const breadcrumb = ref([
  {
    name: "Pengurusan Bantuan",
    type: "link",
    path: "/BF-BTN/PB/mohon-bantuan",
  },
  {
    name: "Sejarah Permohonan",
    type: "current",
    path: "/BF-BTN/PB/mohon-bantuan/sejarah",
  },
]);

// State
const searchQuery = ref("");
const isFilterOpen = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const isDetailsModalVisible = ref(false);
const selectedApplication = ref(null);

const filters = ref({
  status: "",
  jenisBantuan: "",
  tahun: "",
});

// Mock data - Replace with API call
const applications = ref([
  {
    id: 1,
    nomborRujukan: "REF2024001",
    tarikh: "01/01/2024",
    jenisBantuan: "Bantuan Sewa Rumah",
    jumlah: 500,
    status: "Dalam Proses",
    keterangan: "Permohonan bantuan sewa rumah untuk bulan Januari 2024",
    dokumen: [
      { nama: "Slip Sewa.pdf", url: "#" },
      { nama: "Kad Pengenalan.jpg", url: "#" },
    ],
  },
  {
    id: 2,
    nomborRujukan: "REF2024002",
    tarikh: "15/01/2024",
    jenisBantuan: "Bantuan Pendidikan",
    jumlah: 1000,
    status: "Diluluskan",
    keterangan: "Permohonan bantuan pendidikan untuk semester 1 2024",
    dokumen: [
      { nama: "Slip Yuran.pdf", url: "#" },
      { nama: "Kad Matrikulasi.jpg", url: "#" },
    ],
  },
]);

// Options
const statusOptions = [
  "Semua",
  "Dalam Proses",
  "Diluluskan",
  "Ditolak",
  "Selesai",
];

const jenisBantuanOptions = [
  "Semua",
  "Bantuan Sewa Rumah",
  "Ubah Suai Rumah",
  "Bantuan Pendidikan",
  "Bantuan Perubatan",
  "Bantuan Kecemasan",
];

const tahunOptions = [
  "Semua",
  "2024",
  "2023",
  "2022",
];

// Computed
const filteredApplications = computed(() => {
  let filtered = [...applications.value];

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (app) =>
        app.nomborRujukan.toLowerCase().includes(query) ||
        app.jenisBantuan.toLowerCase().includes(query)
    );
  }

  // Apply filters
  if (filters.value.status && filters.value.status !== "Semua") {
    filtered = filtered.filter((app) => app.status === filters.value.status);
  }
  if (filters.value.jenisBantuan && filters.value.jenisBantuan !== "Semua") {
    filtered = filtered.filter(
      (app) => app.jenisBantuan === filters.value.jenisBantuan
    );
  }
  if (filters.value.tahun && filters.value.tahun !== "Semua") {
    filtered = filtered.filter((app) =>
      app.tarikh.includes(filters.value.tahun)
    );
  }

  return filtered;
});

const totalApplications = computed(() => filteredApplications.value.length);

const totalPages = computed(() =>
  Math.ceil(totalApplications.value / pageSize.value)
);

const paginationStart = computed(
  () => (currentPage.value - 1) * pageSize.value + 1
);

const paginationEnd = computed(() =>
  Math.min(currentPage.value * pageSize.value, totalApplications.value)
);

// Methods
const handleRefresh = () => {
  // TODO: Implement refresh logic
  searchQuery.value = "";
  filters.value = {
    status: "",
    jenisBantuan: "",
    tahun: "",
  };
  currentPage.value = 1;
};

const getStatusVariant = (status: string) => {
  const variants = {
    "Dalam Proses": "warning",
    Diluluskan: "success",
    Ditolak: "danger",
    Selesai: "info",
  };
  return variants[status] || "default";
};

const viewDetails = (application) => {
  selectedApplication.value = application;
  isDetailsModalVisible.value = true;
};

const downloadDocument = (doc) => {
  // TODO: Implement document download logic
  console.log("Downloading document:", doc);
};
</script>

<style lang="scss" scoped></style> 