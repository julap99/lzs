<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl font-semibold">Senarai Pengesahan Cawangan</h2>
          </div>
        </div>
      </template>

      <template #body>
        <!-- Smart Filter Section -->
        <div class="mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              v-model="searchQuery"
              type="text"
              placeholder="Cari No Rujukan, Nama Cawangan, atau Nama HQ..."
              :classes="{ input: '!py-2' }"
            />
            <rs-button
              variant="primary"
              @click="performSearch"
              class="!py-2 !px-4"
            >
              <Icon name="ic:baseline-search" class="w-4 h-4 mr-2" />
              Cari
            </rs-button>
          </div>
        </div>

        <!-- Tabbed Table Section -->
        <rs-tab v-model="activeTab" class="mt-4">
          <rs-tab-item title="Menunggu Pengesahan">
            <div class="p-4">
              <rs-table
                :key="`table-${tableKey}-pending`"
                :data="getTableDataByStatus(['Menunggu Pengesahan'])"
                :columns="columns"
                :pageSize="pageSize"
                :showNoColumn="true"
                :options="{ variant: 'default', hover: true, striped: true }"
                :options-advanced="{ sortable: true, filterable: false }"
                advanced
              >
                <template v-slot:noRujukan="{ text }">
                  <a href="#" class="text-primary-600 hover:text-primary-800" @click.prevent="viewCawangan(text)">
                    {{ text }}
                  </a>
                </template>

                <template v-slot:tarikhPermohonan="{ text }">
                  <div>
                    <div class="font-medium">{{ formatDate(text) }}</div>
                    <div class="text-sm text-gray-500">{{ formatTime(text) }}</div>
                  </div>
                </template>

                <template v-slot:status="{ text }">
                  <rs-badge :variant="getStatusVariant(text)">
                    {{ text }}
                  </rs-badge>
                </template>

                <template v-slot:tindakan="{ text }">
                  <div class="flex space-x-2">
                    <rs-button
                      v-if="canPerformAction(text.status)"
                      variant="primary"
                      size="sm"
                      class="!px-2 !py-1"
                      @click="handleSemakPengesahan(text.id)"
                    >
                      <Icon name="ph:check" class="w-4 h-4 mr-1" /> Semak
                    </rs-button>
                  </div>
                </template>
              </rs-table>
            </div>
          </rs-tab-item>

          <rs-tab-item title="Diluluskan">
            <div class="p-4">
              <rs-table
                :key="`table-${tableKey}-approved`"
                :data="getTableDataByStatus(['Diluluskan'])"
                :columns="columns"
                :pageSize="pageSize"
                :showNoColumn="true"
                :options="{ variant: 'default', hover: true, striped: true }"
                :options-advanced="{ sortable: true, filterable: false }"
                advanced
              >
                <template v-slot:noRujukan="{ text }">
                  <a href="#" class="text-primary-600 hover:text-primary-800" @click.prevent="viewCawangan(text)">
                    {{ text }}
                  </a>
                </template>

                <template v-slot:tarikhPermohonan="{ text }">
                  <div>
                    <div class="font-medium">{{ formatDate(text) }}</div>
                    <div class="text-sm text-gray-500">{{ formatTime(text) }}</div>
                  </div>
                </template>

                <template v-slot:status="{ text }">
                  <rs-badge :variant="getStatusVariant(text)">
                    {{ text }}
                  </rs-badge>
                </template>

                <template v-slot:tindakan="{ text }">
                  <div class="flex space-x-2">
                    <rs-button
                      v-if="canPerformAction(text.status)"
                      variant="primary"
                      size="sm"
                      class="!px-2 !py-1"
                      @click="handleSemakPengesahan(text.id)"
                    >
                      <Icon name="ph:check" class="w-4 h-4 mr-1" /> Semak
                    </rs-button>
                  </div>
                </template>
              </rs-table>
            </div>
          </rs-tab-item>

          <rs-tab-item title="Ditolak">
            <div class="p-4">
              <rs-table
                :key="`table-${tableKey}-rejected`"
                :data="getTableDataByStatus(['Ditolak'])"
                :columns="columns"
                :pageSize="pageSize"
                :showNoColumn="true"
                :options="{ variant: 'default', hover: true, striped: true }"
                :options-advanced="{ sortable: true, filterable: false }"
                advanced
              >
                <template v-slot:noRujukan="{ text }">
                  <a href="#" class="text-primary-600 hover:text-primary-800" @click.prevent="viewCawangan(text)">
                    {{ text }}
                  </a>
                </template>

                <template v-slot:tarikhPermohonan="{ text }">
                  <div>
                    <div class="font-medium">{{ formatDate(text) }}</div>
                    <div class="text-sm text-gray-500">{{ formatTime(text) }}</div>
                  </div>
                </template>

                <template v-slot:status="{ text }">
                  <rs-badge :variant="getStatusVariant(text)">
                    {{ text }}
                  </rs-badge>
                </template>

                <template v-slot:tindakan="{ text }">
                  <div class="flex space-x-2">
                    <rs-button
                      v-if="canPerformAction(text.status)"
                      variant="primary"
                      size="sm"
                      class="!px-2 !py-1"
                      @click="handleSemakPengesahan(text.id)"
                    >
                      <Icon name="ph:check" class="w-4 h-4 mr-1" /> Semak
                    </rs-button>
                  </div>
                </template>
              </rs-table>
            </div>
          </rs-tab-item>
        </rs-tab>

        <div class="flex items-center justify-between px-5 mt-4">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-700">Baris per halaman:</span>
            <FormKit
              v-model="pageSize"
              type="select"
              :options="[10, 25, 50]"
              :classes="{ wrapper: 'w-20', outer: 'mb-0', input: '!rounded-lg' }"
            />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-700">
              Menunjukkan {{ paginationStart }} hingga {{ paginationEnd }} daripada {{ totalCawangan }} entri
            </span>
            <div class="flex gap-1">
              <rs-button variant="primary-outline" class="!p-1 !w-8 !h-8" :disabled="currentPage === 1" @click="currentPage--">
                <Icon name="ic:round-keyboard-arrow-left" />
              </rs-button>
              <rs-button variant="primary-outline" class="!p-1 !w-8 !h-8" :disabled="currentPage === totalPages" @click="currentPage++">
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

definePageMeta({ title: 'Senarai Pengesahan Cawangan' });

const breadcrumb = ref([
  { name: 'Pengesahan', type: 'link', path: '/BF-PRF/OR/PB' },
  { name: 'Senarai Cawangan', type: 'current', path: '/BF-PRF/OR/PB' },
]);

// Columns definition
const columns = [
  { key: 'noRujukan', label: 'No. Rujukan', sortable: true },
  { key: 'namaCawangan', label: 'Nama Cawangan', sortable: true },
  { key: 'namaHQ', label: 'Nama HQ', sortable: true },
  { key: 'daerah', label: 'Daerah', sortable: true },
  { key: 'tarikhPermohonan', label: 'Tarikh Permohonan', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'tindakan', label: 'Tindakan', sortable: false },
];

// Tab and table state
const activeTab = ref(0);
const tableKey = ref(0);

const searchQuery = ref('');
const pageSize = ref(10);
const currentPage = ref(1);

const cawanganList = ref([
  {
    noRujukan: 'PB-240511',
    namaCawangan: 'Cawangan Seri Damai',
    namaHQ: 'Yayasan Insan Malaysia',
    daerah: 'Kuala Lumpur',
    tarikhPermohonan: new Date().toISOString(),
    status: 'Menunggu Pengesahan',
    tindakan: { id: 'PB-240511', status: 'Menunggu Pengesahan' },
  },
  {
    noRujukan: 'PB-240512',
    namaCawangan: 'Cawangan Taman Ilmu',
    namaHQ: 'Pertubuhan Amal Jariah',
    daerah: 'Selangor',
    tarikhPermohonan: new Date().toISOString(),
    status: 'Diluluskan',
    tindakan: { id: 'PB-240512', status: 'Diluluskan' },
  },
  {
    noRujukan: 'PB-240513',
    namaCawangan: 'Cawangan Bandar Baru',
    namaHQ: 'Yayasan Pendidikan Islami Malaysia',
    daerah: 'Johor',
    tarikhPermohonan: new Date().toISOString(),
    status: 'Ditolak',
    tindakan: { id: 'PB-240513', status: 'Ditolak' },
  },
  {
    noRujukan: 'PB-240514',
    namaCawangan: 'Cawangan Wangsa Maju',
    namaHQ: 'Institut Dakwah Malaysia',
    daerah: 'Kuala Lumpur',
    tarikhPermohonan: new Date().toISOString(),
    status: 'Menunggu Pengesahan',
    tindakan: { id: 'PB-240514', status: 'Menunggu Pengesahan' },
  },
  {
    noRujukan: 'PB-240515',
    namaCawangan: 'Cawangan Subang Jaya',
    namaHQ: 'Pertubuhan Kebajikan Islam',
    daerah: 'Selangor',
    tarikhPermohonan: new Date().toISOString(),
    status: 'Diluluskan',
    tindakan: { id: 'PB-240515', status: 'Diluluskan' },
  },
  {
    noRujukan: 'PB-240516',
    namaCawangan: 'Cawangan Batu Pahat',
    namaHQ: 'Yayasan Tahfiz Al-Quran',
    daerah: 'Johor',
    tarikhPermohonan: new Date().toISOString(),
    status: 'Ditolak',
    tindakan: { id: 'PB-240516', status: 'Ditolak' },
  },
]);

// Filter table data based on status
const getTableDataByStatus = (statuses) => {
  let result = cawanganList.value.filter(cawangan => 
    statuses.includes(cawangan.status)
  );
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(cawangan => 
      cawangan.noRujukan.toLowerCase().includes(query) ||
      cawangan.namaCawangan.toLowerCase().includes(query) ||
      cawangan.namaHQ.toLowerCase().includes(query)
    );
  }
  
  return result;
};

const filteredCawangan = computed(() => {
  let filtered = [...cawanganList.value];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(item =>
      item.noRujukan.toLowerCase().includes(query) ||
      item.namaCawangan.toLowerCase().includes(query) ||
      item.namaHQ.toLowerCase().includes(query)
    );
  }

  return filtered;
});

const totalCawangan = computed(() => filteredCawangan.value.length);
const totalPages = computed(() => Math.ceil(totalCawangan.value / pageSize.value));
const paginationStart = computed(() => ((currentPage.value - 1) * pageSize.value) + 1);
const paginationEnd = computed(() => Math.min(currentPage.value * pageSize.value, totalCawangan.value));

const formatDate = (dateString) => new Date(dateString).toLocaleDateString('ms-MY');
const formatTime = (dateString) => new Date(dateString).toLocaleTimeString('ms-MY');

const getStatusVariant = (status) => {
  const variants = {
    'Menunggu Pengesahan': 'warning',
    'Diluluskan': 'success',
    'Ditolak': 'danger'
  };
  return variants[status] || 'default';
};

// Action capabilities - only allow action for pending status
const canPerformAction = (status) => {
  return ['Menunggu Pengesahan'].includes(status);
};

// Search function
const performSearch = () => {
  // Force table re-render when search is performed
  tableKey.value++;
  currentPage.value = 1;
};

const viewCawangan = (id) => navigateTo(`/BF-PRF/OR/PB/${id}`);
const handleSemakPengesahan = (id) => navigateTo(`/BF-PRF/OR/PB/03`);
</script> 