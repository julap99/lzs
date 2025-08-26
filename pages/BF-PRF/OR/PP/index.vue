<template>
  <div>
    <!-- Page-specific Role Switcher -->
    <div class="bg-gray-100 border-b border-gray-200 px-4 py-2">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <Icon name="ic:baseline-account-circle" class="text-gray-600" size="20" />
          <span class="text-sm font-medium text-gray-700">Simulasi Peranan:</span>
        </div>
        <div class="flex items-center space-x-3">
          <div class="min-w-[200px]">
            <FormKit
              type="select"
              v-model="currentRole"
              :options="roleOptions"
              :classes="{ 
                input: '!py-1.5 !px-3 text-sm !rounded-md !border-gray-300',
                wrapper: '!min-w-0'
              }"
              @change="handleRoleChange"
            />
          </div>
        </div>
      </div>
    </div>

    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl font-semibold">{{ getRoleSpecificTitle() }}</h2>
            <p class="text-sm text-gray-600 mt-1">{{ getRoleSpecificDescription() }}</p>
          </div>
        </div>
      </template>

      <template #body>
        <div class="mb-6">
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1">
              <FormKit
                v-model="searchQuery"
                type="text"
                :placeholder="getSearchPlaceholder()"
                :classes="{ input: '!py-2' }"
              />
            </div>
            <div class="flex gap-2">
              <FormKit
                v-model="filters.status"
                type="select"
                :options="getStatusOptions()"
                :classes="{ input: '!py-2' }"
              />
            </div>
          </div>
        </div>

        <rs-table
          :data="filteredOrganizations"
          :columns="getRoleSpecificColumns()"
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
                <Icon name="ph:check" class="w-4 h-4 mr-1" /> {{ getActionButtonText() }}
              </rs-button>
            </div>
          </template>
        </rs-table>

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
import { ref, computed, watch } from 'vue';

definePageMeta({ title: 'Senarai Pengesahan Organisasi' });

// Role Switcher State
const currentRole = ref('organisasi');

const breadcrumb = ref([
  { name: 'Pengesahan', type: 'link', path: '/BF-PRF/OR/AP/01' },
  { name: 'Senarai Organisasi', type: 'current', path: '/BF-PRF/OR/AP/01' },
]);

// Role Options
const roleOptions = [
  { label: 'Organisasi', value: 'organisasi' },
  { label: 'Eksekutif', value: 'eksekutif' },
];

// Role Data
const roleData = {
  organisasi: {
    name: 'Organisasi',
    description: 'Pengesahan dan kelulusan organisasi',
    capabilities: ['Lihat Senarai', 'Semak Pengesahan', 'Buat Pengesahan', 'Monitor Status'],
  },
  eksekutif: {
    name: 'Eksekutif',
    description: 'Pengurusan dan pengesahan eksekutif',
    capabilities: ['Lihat Senarai', 'Semak Pengesahan', 'Buat Pengesahan', 'Kelulusan Akhir'],
  },
};

// Role-specific Columns
const getRoleSpecificColumns = () => {
  const baseColumns = [
    { key: 'noRujukan', label: 'No. Rujukan', sortable: true },
    { key: 'namaOrganisasi', label: 'Nama Organisasi', sortable: true },
    { key: 'tarikhPermohonan', label: 'Tarikh Permohonan', sortable: true },
    { key: 'jenisOrganisasi', label: 'Jenis Organisasi', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'pegawai', label: 'Pegawai Bertugas', sortable: true },
    { key: 'tindakan', label: 'Tindakan', sortable: false },
  ];

  if (currentRole.value === 'eksekutif') {
    // Add additional columns for Eksekutif role
    baseColumns.splice(5, 0, { key: 'prioriti', label: 'Prioriti', sortable: true });
  }

  return baseColumns;
};

// Role-specific Status Options
const getStatusOptions = () => {
  const baseOptions = [
    { label: 'Semua Status', value: '' },
    { label: 'Menunggu Pengesahan', value: 'menunggu_pengesahan' },
    { label: 'Diluluskan', value: 'diluluskan' },
    { label: 'Ditolak', value: 'ditolak' },
  ];

  if (currentRole.value === 'eksekutif') {
    baseOptions.splice(2, 0, { label: 'Dalam Semakan', value: 'dalam_semakan' });
  }

  return baseOptions;
};

// Role-specific Search Placeholder
const getSearchPlaceholder = () => {
  if (currentRole.value === 'organisasi') {
    return 'Cari No Rujukan, Nama Organisasi, atau Emel...';
  } else {
    return 'Cari No Rujukan, Nama Organisasi, Pegawai, atau Prioriti...';
  }
};

// Role-specific Title
const getRoleSpecificTitle = () => {
  if (currentRole.value === 'organisasi') {
    return 'Senarai Pengesahan Organisasi (Organisasi)';
  } else {
    return 'Senarai Pengesahan Organisasi (Eksekutif)';
  }
};

// Role-specific Description
const getRoleSpecificDescription = () => {
  if (currentRole.value === 'organisasi') {
    return 'Urus pengesahan dan kelulusan organisasi - Semak, Sahkan, dan Monitor Status';
  } else {
    return 'Pengurusan eksekutif untuk pengesahan organisasi - Semak, Sahkan, dan Kelulusan Akhir';
  }
};

// Role-specific Action Button Text
const getActionButtonText = () => {
  if (currentRole.value === 'organisasi') {
    return 'Semak & Buat Pengesahan';
  } else {
    return 'Semak & Kelulusan Eksekutif';
  }
};

// Role-specific Data
const getRoleSpecificData = () => {
  if (currentRole.value === 'organisasi') {
    return [
      {
        noRujukan: 'ORG-240501',
        namaOrganisasi: 'Syarikat Teknologi Maju Sdn Bhd',
        tarikhPermohonan: new Date().toISOString(),
        jenisOrganisasi: 'Swasta',
        status: 'Menunggu Pengesahan',
        pegawai: 'Noraini Binti Azman',
        tindakan: { id: 'ORG-240501', status: 'Menunggu Pengesahan' },
      },
      {
        noRujukan: 'ORG-240502',
        namaOrganisasi: 'Pertubuhan Amal Iman Malaysia',
        tarikhPermohonan: new Date().toISOString(),
        jenisOrganisasi: 'NGO',
        status: 'Diluluskan',
        pegawai: 'Abdul Razak Bin Yusof',
        tindakan: { id: 'ORG-240502', status: 'Diluluskan' },
      },
      {
        noRujukan: 'ORG-240503',
        namaOrganisasi: 'Sekolah Menengah Tahfiz Al-Amin',
        tarikhPermohonan: new Date().toISOString(),
        jenisOrganisasi: 'IPT',
        status: 'Ditolak',
        pegawai: 'Zarina Binti Kamal',
        tindakan: { id: 'ORG-240503', status: 'Ditolak' },
      },
    ];
  } else {
    // Eksekutif role data with additional fields
    return [
      {
        noRujukan: 'ORG-240501',
        namaOrganisasi: 'Syarikat Teknologi Maju Sdn Bhd',
        tarikhPermohonan: new Date().toISOString(),
        jenisOrganisasi: 'Swasta',
        status: 'Menunggu Pengesahan',
        pegawai: 'Noraini Binti Azman',
        prioriti: 'Tinggi',
        tindakan: { id: 'ORG-240501', status: 'Menunggu Pengesahan' },
      },
      {
        noRujukan: 'ORG-240502',
        namaOrganisasi: 'Pertubuhan Amal Iman Malaysia',
        tarikhPermohonan: new Date().toISOString(),
        jenisOrganisasi: 'NGO',
        status: 'Dalam Semakan',
        pegawai: 'Abdul Razak Bin Yusof',
        prioriti: 'Sederhana',
        tindakan: { id: 'ORG-240502', status: 'Dalam Semakan' },
      },
      {
        noRujukan: 'ORG-240503',
        namaOrganisasi: 'Sekolah Menengah Tahfiz Al-Amin',
        tarikhPermohonan: new Date().toISOString(),
        jenisOrganisasi: 'IPT',
        status: 'Diluluskan',
        pegawai: 'Zarina Binti Kamal',
        prioriti: 'Rendah',
        tindakan: { id: 'ORG-240503', status: 'Diluluskan' },
      },
      {
        noRujukan: 'ORG-240504',
        namaOrganisasi: 'Institut Latihan Kemahiran Malaysia',
        tarikhPermohonan: new Date().toISOString(),
        jenisOrganisasi: 'Institut',
        status: 'Menunggu Pengesahan',
        pegawai: 'Ahmad Bin Ismail',
        prioriti: 'Tinggi',
        tindakan: { id: 'ORG-240504', status: 'Menunggu Pengesahan' },
      },
    ];
  }
};

const searchQuery = ref('');
const filters = ref({ status: '' });
const pageSize = ref(10);
const currentPage = ref(1);

const organizationList = computed(() => getRoleSpecificData());

const filteredOrganizations = computed(() => {
  let filtered = [...organizationList.value];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(item =>
      item.noRujukan.toLowerCase().includes(query) ||
      item.namaOrganisasi.toLowerCase().includes(query) ||
      item.pegawai.toLowerCase().includes(query) ||
      (currentRole.value === 'eksekutif' && item.prioriti && item.prioriti.toLowerCase().includes(query))
    );
  }

  if (filters.value.status) {
    filtered = filtered.filter(item =>
      item.status.toLowerCase().replace(/\s+/g, '_') === filters.value.status
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

// Role-specific Action Capabilities
const canPerformAction = (status) => {
  if (currentRole.value === 'organisasi') {
    return status === 'Menunggu Pengesahan';
  } else {
    return ['Menunggu Pengesahan', 'Dalam Semakan'].includes(status);
  }
};

const handleRoleChange = () => {
  // Reset filters and search when role changes
  searchQuery.value = '';
  filters.value.status = '';
  currentPage.value = 1;
  
  // Show role change notification
  console.log(`Peranan berubah kepada: ${currentRole.value}`);
};

const viewOrganization = (id) => navigateTo(`/BF-PRF/OR/AP/${id}`);
const handleSemakPengesahan = (id) => navigateTo(`/BF-PRF/OR/PP/06`);

// Watch for role changes to reset pagination
watch(currentRole, () => {
  currentPage.value = 1;
});
</script>
