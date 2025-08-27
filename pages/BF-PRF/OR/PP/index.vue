<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
                  <div class="flex justify-between items-center">
            <div>
              <h2 class="text-xl font-semibold">Senarai Pengesahan Organisasi</h2>
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
              placeholder="Cari No Rujukan, Nama Organisasi, atau Emel..."
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
                  <a href="#" class="text-primary-600 hover:text-primary-800" @click.prevent="viewOrganization(text)">
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

          <rs-tab-item title="Dalam Semakan">
            <div class="p-4">
              <rs-table
                :key="`table-${tableKey}-review`"
                :data="getTableDataByStatus(['Dalam Semakan'])"
                :columns="columns"
                :pageSize="pageSize"
                :showNoColumn="true"
                :options="{ variant: 'default', hover: true, striped: true }"
                :options-advanced="{ sortable: true, filterable: false }"
                advanced
              >
                <template v-slot:noRujukan="{ text }">
                  <a href="#" class="text-primary-600 hover:text-primary-800" @click.prevent="viewOrganization(text)">
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
                  <a href="#" class="text-primary-600 hover:text-primary-800" @click.prevent="viewOrganization(text)">
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
                  <a href="#" class="text-primary-600 hover:text-primary-800" @click.prevent="viewOrganization(text)">
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
              Menunjukkan {{ paginationStart }} hingga {{ paginationEnd }} daripada {{ totalOrganizations }} entri
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

definePageMeta({ title: 'Senarai Pengesahan Organisasi' });

const breadcrumb = ref([
  { name: 'Pengesahan', type: 'link', path: '/BF-PRF/OR/AP/01' },
  { name: 'Senarai Organisasi', type: 'current', path: '/BF-PRF/OR/AP/01' },
]);

// Columns definition
const columns = [
  { key: 'noRujukan', label: 'No. Rujukan', sortable: true },
  { key: 'namaOrganisasi', label: 'Nama Organisasi', sortable: true },
  { key: 'tarikhPermohonan', label: 'Tarikh Permohonan', sortable: true },
  { key: 'jenisOrganisasi', label: 'Jenis Organisasi', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'tindakan', label: 'Tindakan', sortable: false },
];

// Tab and table state
const activeTab = ref(0);
const tableKey = ref(0);

// Mock data for Eksekutif role
const organizationList = ref([
  {
    noRujukan: 'ORG-240501',
    namaOrganisasi: 'Syarikat Teknologi Maju Sdn Bhd',
    tarikhPermohonan: new Date().toISOString(),
    jenisOrganisasi: 'Swasta',
    status: 'Menunggu Pengesahan',
    tindakan: { id: 'ORG-240501', status: 'Menunggu Pengesahan' },
  },
  {
    noRujukan: 'ORG-240502',
    namaOrganisasi: 'Pertubuhan Amal Iman Malaysia',
    tarikhPermohonan: new Date().toISOString(),
    jenisOrganisasi: 'NGO',
    status: 'Dalam Semakan',
    tindakan: { id: 'ORG-240502', status: 'Dalam Semakan' },
  },
  {
    noRujukan: 'ORG-240503',
    namaOrganisasi: 'Sekolah Menengah Tahfiz Al-Amin',
    tarikhPermohonan: new Date().toISOString(),
    jenisOrganisasi: 'IPT',
    status: 'Diluluskan',
    tindakan: { id: 'ORG-240503', status: 'Diluluskan' },
  },
  {
    noRujukan: 'ORG-240504',
    namaOrganisasi: 'Institut Latihan Kemahiran Malaysia',
    tarikhPermohonan: new Date().toISOString(),
    jenisOrganisasi: 'Institut',
    status: 'Menunggu Pengesahan',
    tindakan: { id: 'ORG-240504', status: 'Menunggu Pengesahan' },
  },
  {
    noRujukan: 'ORG-240505',
    namaOrganisasi: 'Syarikat Pembangunan Hartanah Sdn Bhd',
    tarikhPermohonan: new Date().toISOString(),
    jenisOrganisasi: 'Swasta',
    status: 'Ditolak',
    tindakan: { id: 'ORG-240505', status: 'Ditolak' },
  },
  {
    noRujukan: 'ORG-240506',
    namaOrganisasi: 'Persatuan Belia Islam Malaysia',
    tarikhPermohonan: new Date().toISOString(),
    jenisOrganisasi: 'NGO',
    status: 'Dalam Semakan',
    tindakan: { id: 'ORG-240506', status: 'Dalam Semakan' },
  },
  {
    noRujukan: 'ORG-240507',
    namaOrganisasi: 'Universiti Teknologi Malaysia',
    tarikhPermohonan: new Date().toISOString(),
    jenisOrganisasi: 'IPT',
    status: 'Diluluskan',
    tindakan: { id: 'ORG-240507', status: 'Diluluskan' },
  },
]);

const searchQuery = ref('');
const pageSize = ref(10);
const currentPage = ref(1);

// Filter table data based on status
const getTableDataByStatus = (statuses) => {
  let result = organizationList.value.filter(organization => 
    statuses.includes(organization.status)
  );
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(organization => 
      organization.noRujukan.toLowerCase().includes(query) ||
      organization.namaOrganisasi.toLowerCase().includes(query)
    );
  }
  
  return result;
};

const filteredOrganizations = computed(() => {
  let filtered = [...organizationList.value];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(item =>
      item.noRujukan.toLowerCase().includes(query) ||
      item.namaOrganisasi.toLowerCase().includes(query)
    );
  }

  return filtered;
});

const totalOrganizations = computed(() => filteredOrganizations.value.length);
const totalPages = computed(() => Math.ceil(totalOrganizations.value / pageSize.value));
const paginationStart = computed(() => ((currentPage.value - 1) * pageSize.value) + 1);
const paginationEnd = computed(() => Math.min(currentPage.value * pageSize.value, totalOrganizations.value));

const formatDate = (dateString) => new Date(dateString).toLocaleDateString('ms-MY');
const formatTime = (dateString) => new Date(dateString).toLocaleTimeString('ms-MY');

const getStatusVariant = (status) => {
  const variants = {
    'Menunggu Pengesahan': 'warning',
    'Dalam Semakan': 'info',
    'Diluluskan': 'success',
    'Ditolak': 'danger'
  };
  return variants[status] || 'default';
};

// Action capabilities for Eksekutif role
const canPerformAction = (status) => {
  return ['Menunggu Pengesahan', 'Dalam Semakan'].includes(status);
};

// Search function
const performSearch = () => {
  // Force table re-render when search is performed
  tableKey.value++;
  currentPage.value = 1;
};

const viewOrganization = (id) => navigateTo(`/BF-PRF/OR/AP/${id}`);
const handleSemakPengesahan = (id) => navigateTo(`/BF-PRF/OR/PP/06`);
</script>
