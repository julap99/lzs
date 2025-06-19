<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Senarai Permohonan - Semakan Kelulusan
          </h2>
          <div class="flex items-center space-x-2">
            <rs-badge variant="info" class="px-3 py-1">
              <span class="text-sm">{{ totalApplications }} Permohonan</span>
            </rs-badge>
          </div>
        </div>
      </template>

      <template #body>
        <!-- Search and Filter Section -->
        <div class="mb-6">
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1">
              <FormKit
                v-model="searchQuery"
                type="text"
                placeholder="Cari No Rujukan, Nama Pemohon/Institusi, atau Jenis Bantuan..."
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
            <div class="flex gap-2">
              <FormKit
                v-model="filters.status"
                type="select"
                :options="statusOptions"
                placeholder="Pilih Status"
                :classes="{
                  input: '!py-2',
                }"
              />
              <FormKit
                v-model="filters.jenisBantuan"
                type="select"
                :options="jenisBantuanOptions"
                placeholder="Pilih Jenis Bantuan"
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
          </div>
        </div>

        <!-- Applications Table -->
        <rs-table
          :data="filteredApplications"
          :columns="columns"
          :pageSize="pageSize"
          :showNoColumn="true"
          :options="{
            variant: 'default',
            hover: true,
            striped: true,
          }"
          :options-advanced="{
            sortable: true,
            filterable: true,
          }"
          advanced
        >
          <template v-slot:status="{ text }">
            <rs-badge :variant="getStatusVariant(text)">
              {{ getStatusText(text) }}
            </rs-badge>
          </template>

          <template v-slot:prioriti="{ text }">
            <rs-badge :variant="text === 'tinggi' ? 'danger' : 'default'" class="text-xs">
              {{ text === 'tinggi' ? 'SEGERA' : 'BIASA' }}
            </rs-badge>
          </template>

          <template v-slot:tindakan="{ text }">
            <div class="flex justify-center items-center gap-2">
              <rs-button
                variant="primary"
                size="sm"
                @click="handleViewDetails(text)"
              >
                <Icon name="ph:clipboard-text" class="w-4 h-4 mr-1" />
                Buat Keputusan
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
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

definePageMeta({
  title: "Senarai Permohonan - Semakan Kelulusan",
});

const breadcrumb = ref([
  {
    name: "Permohonan Bantuan",
    type: "link",
    path: "/BF-BTN/permohonan/senarai",
  },
  {
    name: "Semakan Kelulusan",
    type: "current",
    path: "/BF-BTN/permohonan/senarai-semakan-kelulusan",
  },
]);

// Table columns configuration
const columns = [
  {
    key: "noRujukan",
    label: "No Rujukan",
    sortable: true,
  },
  {
    key: "namaPemohon",
    label: "Nama Pemohon / Institusi",
    sortable: true,
  },
  {
    key: "jenisBantuan",
    label: "Jenis Bantuan",
    sortable: true,
  },
  {
    key: "jumlahBantuan",
    label: "Jumlah Bantuan (RM)",
    sortable: true,
  },
  {
    key: "prioriti",
    label: "Prioriti",
    sortable: true,
  },
  {
    key: "tarikhSiapSiasatan",
    label: "Tarikh Siap Siasatan",
    sortable: true,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
  },
  {
    key: "tindakan",
    label: "Tindakan",
    sortable: false,
  },
];

// Options for filters
const statusOptions = [
  { label: "Semua Status", value: "" },
  { label: "Menunggu Kelulusan", value: "menunggu_kelulusan" },
  { label: "Dalam Semakan", value: "dalam_semakan" },
];

const jenisBantuanOptions = [
  { label: "Semua Jenis", value: "" },
  { label: "Bantuan Infrastruktur", value: "infrastruktur" },
  { label: "Bantuan Pendidikan", value: "pendidikan" },
  { label: "Bantuan Kesihatan", value: "kesihatan" },
  { label: "Bantuan Ekonomi", value: "ekonomi" },
];

// State
const searchQuery = ref("");
const filters = ref({
  status: "",
  jenisBantuan: "",
});
const currentPage = ref(1);
const pageSize = ref(10);

// Mock data - would be replaced with API call
const applications = ref([
  {
    noRujukan: "BF-2024-INF-001",
    namaPemohon: "Syarikat ABC Sdn Bhd",
    jenisBantuan: "Bantuan Infrastruktur",
    jumlahBantuan: "150,000.00",
    prioriti: "tinggi",
    tarikhSiapSiasatan: "2024-11-15",
    status: "menunggu_kelulusan",
    tindakan: "BF-2024-INF-001",
  },
  {
    noRujukan: "BF-2024-PEN-002",
    namaPemohon: "Ahmad bin Abdullah",
    jenisBantuan: "Bantuan Pendidikan",
    jumlahBantuan: "5,000.00",
    prioriti: "biasa",
    tarikhSiapSiasatan: "2024-11-14",
    status: "menunggu_kelulusan",
    tindakan: "BF-2024-PEN-002",
  },
  {
    noRujukan: "BF-2024-KES-003",
    namaPemohon: "Klinik Kesihatan Sdn Bhd",
    jenisBantuan: "Bantuan Kesihatan",
    jumlahBantuan: "75,000.00",
    prioriti: "tinggi",
    tarikhSiapSiasatan: "2024-11-13",
    status: "dalam_semakan",
    tindakan: "BF-2024-KES-003",
  },
  {
    noRujukan: "BF-2024-EKO-004",
    namaPemohon: "Fatimah binti Hassan",
    jenisBantuan: "Bantuan Ekonomi",
    jumlahBantuan: "12,000.00",
    prioriti: "biasa",
    tarikhSiapSiasatan: "2024-11-12",
    status: "menunggu_kelulusan",
    tindakan: "BF-2024-EKO-004",
  },
  {
    noRujukan: "BF-2024-INF-005",
    namaPemohon: "Masjid Al-Hikmah",
    jenisBantuan: "Bantuan Infrastruktur",
    jumlahBantuan: "300,000.00",
    prioriti: "tinggi",
    tarikhSiapSiasatan: "2024-11-11",
    status: "menunggu_kelulusan",
    tindakan: "BF-2024-INF-005",
  },
]);

// Computed properties
const filteredApplications = computed(() => {
  let result = [...applications.value];

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (app) =>
        app.noRujukan.toLowerCase().includes(query) ||
        app.namaPemohon.toLowerCase().includes(query) ||
        app.jenisBantuan.toLowerCase().includes(query)
    );
  }

  // Apply filters
  if (filters.value.status) {
    result = result.filter(
      (app) => app.status.toLowerCase() === filters.value.status.toLowerCase()
    );
  }

  if (filters.value.jenisBantuan) {
    result = result.filter(
      (app) => app.jenisBantuan.toLowerCase().includes(filters.value.jenisBantuan.toLowerCase())
    );
  }

  // Apply pagination
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return result.slice(start, end);
});

const totalApplications = computed(() => {
  let result = [...applications.value];
  
  // Apply same filters for total count
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (app) =>
        app.noRujukan.toLowerCase().includes(query) ||
        app.namaPemohon.toLowerCase().includes(query) ||
        app.jenisBantuan.toLowerCase().includes(query)
    );
  }

  if (filters.value.status) {
    result = result.filter(
      (app) => app.status.toLowerCase() === filters.value.status.toLowerCase()
    );
  }

  if (filters.value.jenisBantuan) {
    result = result.filter(
      (app) => app.jenisBantuan.toLowerCase().includes(filters.value.jenisBantuan.toLowerCase())
    );
  }

  return result.length;
});

const totalPages = computed(() => {
  return Math.ceil(totalApplications.value / pageSize.value);
});

const paginationStart = computed(() => {
  return totalApplications.value === 0 ? 0 : (currentPage.value - 1) * pageSize.value + 1;
});

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * pageSize.value, totalApplications.value);
});

// Methods
const handleViewDetails = (noRujukan) => {
  router.push(`/BF-BTN/permohonan/senarai-semakan-kelulusan/${noRujukan}`);
};

const getStatusVariant = (status) => {
  const variants = {
    menunggu_kelulusan: "warning",
    dalam_semakan: "info",
    lulus: "success",
    ditolak: "danger",
    tangguh: "secondary",
  };
  return variants[status?.toLowerCase()] || "default";
};

const getStatusText = (status) => {
  const statusMap = {
    menunggu_kelulusan: "Menunggu Kelulusan",
    dalam_semakan: "Dalam Semakan",
    lulus: "Lulus",
    ditolak: "Ditolak",
    tangguh: "Tangguh",
  };
  return statusMap[status?.toLowerCase()] || status;
};
</script>

<style lang="scss" scoped></style>
