<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Senarai Permohonan Semakan & Kelulusan
          </h2>
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
                placeholder="Cari No Rujukan atau Nama Pemohon..."
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
              {{ text }}
            </rs-badge>
          </template>

          <template v-slot:aksi="{ row }">
            <div class="flex justify-center items-center gap-2">
              <rs-button
                variant="info"
                class="p-1 flex gap-2"
                @click="handleView(row.noRujukan)"
              >
                <Icon name="ph:eye" class="w-4 h-4" />
                Lihat
              </rs-button>
              <rs-button
                variant="primary"
                class="p-1 flex gap-2"
                @click="handleSemak(row.noRujukan)"
              >
                <Icon name="ph:check" class="w-4 h-4" />
                Semak
              </rs-button>
            </div>
          </template>

          <template v-slot:semak="{ row }">
            <div class="flex justify-center items-center">
              <rs-button
                variant="success"
                class="p-1 flex gap-2"
                @click="redirectToSemak()"
              >
                <Icon name="ph:check-circle" class="w-4 h-4" />
                Semak
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
import { ref, computed } from 'vue';

const breadcrumb = ref([
  {
    name: 'Permohonan Bantuan',
    type: 'link',
    path: '/BF-BTN/PB/senarai',
  },
  {
    name: 'Semakan & Kelulusan',
    type: 'current',
    path: '/BF-BTN/PB/semakan-dan-kelulusan/01',
  },
]);

const columns = [
  {
    key: 'noRujukan',
    label: 'No Rujukan Permohonan',
    sortable: true,
  },
  {
    key: 'namaPemohon',
    label: 'Nama Pemohon',
    sortable: true,
  },
  {
    key: 'status',
    label: 'Status Permohonan',
    sortable: true,
  },
  {
    key: 'tarikhTerima',
    label: 'Tarikh Terima Permohonan',
    sortable: true,
  },
  {
    key: 'namaPegawai',
    label: 'Nama Pegawai',
    sortable: true,
  },
  {
    key: 'aksi',
    label: 'Aksi',
    sortable: false,
  },
  {
    key: 'semak',
    label: 'Semak',
    sortable: false,
  },
];

const statusOptions = [
  { label: 'Semua Status', value: '' },
  { label: 'Baru', value: 'Baru' },
  { label: 'Dalam Semakan', value: 'Dalam Semakan' },
  { label: 'Lulus', value: 'Lulus' },
  { label: 'Tidak Lengkap', value: 'Tidak Lengkap' },
];

const searchQuery = ref('');
const filters = ref({ status: '' });
const currentPage = ref(1);
const pageSize = ref(10);

const applications = ref([
  {
    noRujukan: 'BTN-2024-0001',
    namaPemohon: 'Ali bin Abu',
    status: 'Baru',
    tarikhTerima: '2024-06-01',
    namaPegawai: 'Siti binti Ahmad',
    semak: '',
  },
  {
    noRujukan: 'BTN-2024-0002',
    namaPemohon: 'Fatimah binti Osman',
    status: 'Dalam Semakan',
    tarikhTerima: '2024-06-02',
    namaPegawai: 'Rahman bin Salleh',
    semak: '',
  },
  {
    noRujukan: 'BTN-2024-0003',
    namaPemohon: 'Zulkifli bin Hassan',
    status: 'Lulus',
    tarikhTerima: '2024-06-03',
    namaPegawai: 'Noraini binti Yusuf',
    semak: '',
  },
  {
    noRujukan: 'BTN-2024-0004',
    namaPemohon: 'Siti Aminah binti Ali',
    status: 'Tidak Lengkap',
    tarikhTerima: '2024-06-04',
    namaPegawai: 'Ahmad bin Zainal',
    semak: '',
  },
]);

const filteredApplications = computed(() => {
  let result = [...applications.value];

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (app) =>
        app.noRujukan.toLowerCase().includes(query) ||
        app.namaPemohon.toLowerCase().includes(query)
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

const totalApplications = computed(() => {
  // Count after search/filter
  let result = [...applications.value];
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (app) =>
        app.noRujukan.toLowerCase().includes(query) ||
        app.namaPemohon.toLowerCase().includes(query)
    );
  }
  if (filters.value.status) {
    result = result.filter((app) => app.status === filters.value.status);
  }
  return result.length;
});

const totalPages = computed(() => {
  return Math.ceil(totalApplications.value / pageSize.value) || 1;
});

const paginationStart = computed(() => {
  return totalApplications.value === 0 ? 0 : (currentPage.value - 1) * pageSize.value + 1;
});

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * pageSize.value, totalApplications.value);
});

function handleView(noRujukan) {
  alert(`Lihat permohonan: ${noRujukan}`);
}

function handleSemak(noRujukan) {
  alert(`Semak permohonan: ${noRujukan}`);
}

function redirectToSemak() {
  navigateTo('/BF-BTN/PB/semakan-dan-kelulusan/02');
}

function getStatusVariant(status) {
  const variants = {
    'Baru': 'info',
    'Dalam Semakan': 'warning',
    'Lulus': 'success',
    'Tidak Lengkap': 'danger',
  };
  return variants[status] || 'default';
}
</script>

<style lang="scss" scoped>
</style>