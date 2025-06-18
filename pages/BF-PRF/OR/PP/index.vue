<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Pengesahan Organisasi</h2>
        </div>
      </template>

      <template #body>
        <div class="mb-6">
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1">
              <FormKit
                v-model="searchQuery"
                type="text"
                placeholder="Cari No Rujukan, Nama Organisasi, atau Emel..."
                :classes="{ input: '!py-2' }"
              />
            </div>
            <div class="flex gap-2">
              <FormKit
                v-model="filters.status"
                type="select"
                :options="statusOptions"
                :classes="{ input: '!py-2' }"
              />
            </div>
          </div>
        </div>

        <rs-table
          :data="filteredOrganizations"
          :columns="columns"
          :pageSize="pageSize"
          :showNoColumn="true"
          :options="{ variant: 'default', hover: true, striped: true }"
          :options-advanced="{ sortable: true, filterable: true }"
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
                v-if="text.status === 'Menunggu Pengesahan'"
                variant="primary"
                size="sm"
                class="!px-2 !py-1"
                @click="handleSemakPengesahan(text.id)"
              >
                <Icon name="ph:check" class="w-4 h-4 mr-1" /> Semak & Buat Pengesahan
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
import { ref, computed } from 'vue';

definePageMeta({ title: 'Senarai Pengesahan Organisasi' });

const breadcrumb = ref([
  { name: 'Pengesahan', type: 'link', path: '/BF-PRF/OR/AP/01' },
  { name: 'Senarai Organisasi', type: 'current', path: '/BF-PRF/OR/AP/01' },
]);

const columns = [
  { key: 'noRujukan', label: 'No. Rujukan', sortable: true },
  { key: 'namaOrganisasi', label: 'Nama Organisasi', sortable: true },
  { key: 'tarikhPermohonan', label: 'Tarikh Permohonan', sortable: true },
  { key: 'jenisOrganisasi', label: 'Jenis Organisasi', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'pegawai', label: 'Pegawai Bertugas', sortable: true },
  { key: 'tindakan', label: 'Tindakan', sortable: false },
];

const searchQuery = ref('');
const filters = ref({ status: '' });
const pageSize = ref(10);
const currentPage = ref(1);

const statusOptions = [
  { label: 'Menunggu Pengesahan', value: 'menunggu_pengesahan' },
  { label: 'Diluluskan', value: 'diluluskan' },
  { label: 'Ditolak', value: 'ditolak' },
];

const organizationList = ref([
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
]);

const filteredOrganizations = computed(() => {
  let filtered = [...organizationList.value];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(item =>
      item.noRujukan.toLowerCase().includes(query) ||
      item.namaOrganisasi.toLowerCase().includes(query) ||
      item.pegawai.toLowerCase().includes(query)
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
    'Diluluskan': 'success',
    'Ditolak': 'danger'
  };
  return variants[status] || 'default';
};

const viewOrganization = (id) => navigateTo(`/BF-PRF/OR/AP/${id}`);
const handleSemakPengesahan = (id) => navigateTo(`/BF-PRF/OR/PP/03`);
</script>
