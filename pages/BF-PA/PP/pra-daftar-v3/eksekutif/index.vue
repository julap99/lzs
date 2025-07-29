<!-- 
  RTMF SCREEN: PA-PP-PD-04_01
  PURPOSE: Executive List - Senarai Sokongan (Eksekutif)
  DESCRIPTION: Executive support list for approval workflow
  ROUTE: /BF-PA/PP/pra-daftar-v3/eksekutif
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Senarai Penolong Amil untuk Sokongan Eksekutif
          </h2>
          <div class="flex gap-2">
            <rs-button
              variant="secondary-outline"
              @click="handleUploadSupport"
            >
              <Icon name="ph:upload" class="w-4 h-4 mr-1" />
              Muat Naik Sokongan
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>
        <!-- Smart Filter Section -->
        <div class="mb-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormKit
              v-model="filters.searchQuery"
              type="text"
              placeholder="Cari nombor rujukan, nama calon..."
              :classes="{
                input: '!py-2',
              }"
            />
            <FormKit
              v-model="filters.statusPendaftaran"
              type="select"
              :options="statusPendaftaranOptions"
              placeholder="Status Pendaftaran"
              :classes="{
                input: '!py-2',
              }"
            />
            <FormKit
              v-model="filters.sesiPerkhidmatan"
              type="select"
              :options="sesiPerkhidmatanOptions"
              placeholder="Sesi Perkhidmatan"
              :classes="{
                input: '!py-2',
              }"
            />
          </div>
        </div>

        <!-- Applications Table -->
        <rs-table
          :data="filteredApplications"
          :columns="columns"
          :pageSize="pageSize"
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
          <template v-slot:statusPendaftaran="{ text }">
            <rs-badge :variant="getStatusPendaftaranVariant(text)">
              {{ text }}
            </rs-badge>
          </template>

          <template v-slot:tindakan="{ text }">
            <div class="flex justify-center items-center gap-2">
              <rs-button
                variant="primary"
                size="sm"
                @click="handleView(text)"
              >
                <Icon name="ph:eye" class="w-4 h-4 mr-1" />
                Lihat
              </rs-button>
              <rs-button
                variant="success"
                size="sm"
                @click="handleSupport(text)"
              >
                <Icon name="ph:hand-thumbs-up" class="w-4 h-4 mr-1" />
                Sokong
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

definePageMeta({
  title: "Sokongan Eksekutif - Penolong Amil",
  description: "Senarai penolong amil untuk sokongan eksekutif",
});

const breadcrumb = ref([
  {
    name: "Penolong Amil",
    type: "link",
    path: "/BF-PA/PP/PM/01",
  },
  {
    name: "Pra Daftar V3",
    type: "link",
    path: "/BF-PA/PP/pra-daftar-v3",
  },
  {
    name: "Sokongan Eksekutif",
    type: "current",
    path: "/BF-PA/PP/pra-daftar-v3/eksekutif",
  },
]);

// Mock data for applications that need executive support
const applications = ref([
  {
    id: 1,
    rujukan: "PA-2024-001",
    namaCalon: "Ahmad Bin Abdullah",
    noKP: "900101031234",
    kategoriPenolongAmil: "PAK",
    jawatan: "Ketua Penolong Amil",
    sesiPerkhidmatan: "Pelantikan Penolong Amil Kariah 2025-2027",
    statusPendaftaran: "MENUNGGU_SOKONGAN_EKSEKUTIF",
    statusLantikan: "BELUM_DILANTIK",
    tarikhMohon: "2024-01-15",
    institusi: "Masjid Negeri Selangor",
    pic: "Ahmad bin Abdullah",
  },
  {
    id: 2,
    rujukan: "PA-2024-002",
    namaCalon: "Siti Fatimah Binti Hassan",
    noKP: "850315071234",
    kategoriPenolongAmil: "PAF",
    jawatan: "Penolong Amil",
    sesiPerkhidmatan: "Pelantikan Penolong Amil Fitrah 2024-2026",
    statusPendaftaran: "MENUNGGU_SOKONGAN_EKSEKUTIF",
    statusLantikan: "BELUM_DILANTIK",
    tarikhMohon: "2024-01-16",
    institusi: "Masjid Negeri Selangor",
    pic: "Ahmad bin Abdullah",
  },
  {
    id: 3,
    rujukan: "PA-2024-003",
    namaCalon: "Muhammad Syafiq Bin Omar",
    noKP: "920525081234",
    kategoriPenolongAmil: "PA Padi",
    jawatan: "Penolong Amil",
    sesiPerkhidmatan: "Pelantikan Penolong Amil Padi 2024-2026",
    statusPendaftaran: "MENUNGGU_SOKONGAN_EKSEKUTIF",
    statusLantikan: "BELUM_DILANTIK",
    tarikhMohon: "2024-01-17",
    institusi: "Masjid Negeri Selangor",
    pic: "Ahmad bin Abdullah",
  },
]);

// Filters
const filters = ref({
  searchQuery: "",
  statusPendaftaran: "",
  sesiPerkhidmatan: "",
});

// Pagination
const currentPage = ref(1);
const pageSize = ref(10);

// Status options
const statusPendaftaranOptions = ref([
  { label: "Semua Status", value: "" },
  { label: "Menunggu Sokongan Eksekutif", value: "MENUNGGU_SOKONGAN_EKSEKUTIF" },
  { label: "Sokongan Diberikan", value: "SOKONGAN_DIBERIKAN" },
  { label: "Sokongan Ditolak", value: "SOKONGAN_DITOLAK" },
]);

const sesiPerkhidmatanOptions = ref([
  { label: "Semua Sesi", value: "" },
  { label: "Pelantikan Penolong Amil Kariah 2025-2027", value: "Pelantikan Penolong Amil Kariah 2025-2027" },
  { label: "Pelantikan Penolong Amil Fitrah 2024-2026", value: "Pelantikan Penolong Amil Fitrah 2024-2026" },
  { label: "Pelantikan Penolong Amil Padi 2024-2026", value: "Pelantikan Penolong Amil Padi 2024-2026" },
]);

// Table columns
const columns = ref([
  { key: "rujukan", label: "Rujukan" },
  { key: "namaCalon", label: "Nama Calon" },
  { key: "noKP", label: "No KP" },
  { key: "kategoriPenolongAmil", label: "Kategori" },
  { key: "jawatan", label: "Jawatan" },
  { key: "sesiPerkhidmatan", label: "Sesi Perkhidmatan" },
  { key: "statusPendaftaran", label: "Status Pendaftaran" },
  { key: "tindakan", label: "Tindakan" },
]);

// Computed properties
const filteredApplications = computed(() => {
  let result = [...applications.value];

  // Apply search filter
  if (filters.value.searchQuery) {
    const query = filters.value.searchQuery.toLowerCase();
    result = result.filter(app =>
      app.rujukan.toLowerCase().includes(query) ||
      app.namaCalon.toLowerCase().includes(query) ||
      app.noKP.toLowerCase().includes(query)
    );
  }

  // Apply status filter
  if (filters.value.statusPendaftaran) {
    result = result.filter(app => app.statusPendaftaran === filters.value.statusPendaftaran);
  }

  // Apply sesi filter
  if (filters.value.sesiPerkhidmatan) {
    result = result.filter(app => app.sesiPerkhidmatan === filters.value.sesiPerkhidmatan);
  }

  return result;
});

const totalApplications = computed(() => filteredApplications.value.length);
const totalPages = computed(() => Math.ceil(totalApplications.value / pageSize.value));
const paginationStart = computed(() => (currentPage.value - 1) * pageSize.value + 1);
const paginationEnd = computed(() => Math.min(currentPage.value * pageSize.value, totalApplications.value));

// Helper functions
const getStatusPendaftaranVariant = (status) => {
  const variants = {
    "MENUNGGU_SOKONGAN_EKSEKUTIF": "warning",
    "SOKONGAN_DIBERIKAN": "success",
    "SOKONGAN_DITOLAK": "danger",
  };
  return variants[status] || "default";
};

// Action handlers
const handleView = (application) => {
  navigateTo(`/BF-PA/PP/pra-daftar-v3/eksekutif/detail/${application.rujukan}`);
};

const handleSupport = (application) => {
  // Update status to show executive support given
  application.statusPendaftaran = "SOKONGAN_DIBERIKAN";
  alert(`Sokongan eksekutif telah diberikan untuk ${application.namaCalon}`);
};

const handleUploadSupport = () => {
  navigateTo("/BF-PA/PP/pra-daftar-v3/eksekutif/upload");
};
</script> 
