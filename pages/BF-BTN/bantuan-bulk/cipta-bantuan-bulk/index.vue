<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Bulk Processing</h2>
          <rs-button variant="primary" @click="navigateTo('cipta-bantuan-bulk/tambah')">
            <Icon name="material-symbols:add" class="mr-1" /> Tambah
          </rs-button>
        </div>
      </template>

     <template #body>
        <!-- Tabs for different statuses -->
        <RsTab variant="primary" type="default">
          <RsTabItem title="Draf">
            <rs-table
              :data="filteredBantuanList('Draf')"
              :columns="columns"
              :pageSize="pageSize"
              :showNoColumn="true"
              :show-filter="true"
              :show-search="true"
              :options="{
                variant: 'default',
                hover: true,
                striped: true,
              }"
              advanced
            >
              <template v-slot:id="data">
                <a href="#" class="text-primary-600 hover:text-primary-800" @click.prevent="viewBantuan(data.text)">
                  {{ data.text }}
                </a>
              </template>

              <template v-slot:tarikhMohon="data">
                {{ formatDate(data.text) }}
              </template>

              <template v-slot:jumlahAmaun="data">
                <div class="font-medium text-left">
                  {{ data.text }}
                </div>
              </template>

              <template v-slot:status="data">
                <rs-badge :variant="getStatusVariant(data.text)">
                  {{ data.text }}
                </rs-badge>
              </template>

              <template v-slot:actions="{ text, index }">
                <div class="flex justify-center items-center gap-2">
                  <!-- Edit -->
                  <div class="relative flex items-center justify-center" @mouseenter="tooltips['edit'+index] = true" @mouseleave="tooltips['edit'+index] = false">
                    <rs-button 
                      variant="info-text" 
                      class="p-1 w-8 h-8"
                      @click="editBantuan(text)"
                    >
                      <Icon name="ic:outline-edit" size="18" />
                    </rs-button>
                    <transition name="tooltip">
                      <span v-if="tooltips['edit'+index]" class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 transform bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 w-max">
                        Edit
                      </span>
                    </transition>
                  </div>

                  <!-- Delete -->
                  <div class="relative flex items-center justify-center" @mouseenter="tooltips['delete'+index] = true" @mouseleave="tooltips['delete'+index] = false">
                    <rs-button 
                      variant="danger-text" 
                      class="p-1 w-8 h-8"
                      @click="confirmDelete(text)"
                    >
                      <Icon name="ic:outline-delete" size="18" />
                    </rs-button>
                    <transition name="tooltip">
                      <span v-if="tooltips['delete'+index]" class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 transform bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 w-max">
                        Hapus
                      </span>
                    </transition>
                  </div>
                </div>
              </template>
            </rs-table>
          </RsTabItem>

          <RsTabItem title="Dalam Proses">
            <rs-table
              :data="filteredBantuanList('Dalam Proses')"
              :columns="columns"
              :pageSize="pageSize"
              :showNoColumn="true"
              :show-filter="true"
              :show-search="true"
              :options="{
                variant: 'default',
                hover: true,
                striped: true,
              }"
              advanced
            >
              <template v-slot:id="data">
                <a href="#" class="text-primary-600 hover:text-primary-800" @click.prevent="viewBantuan(data.text)">
                  {{ data.text }}
                </a>
              </template>

              <template v-slot:tarikhMohon="data">
                {{ formatDate(data.text) }}
              </template>

              <template v-slot:jumlahAmaun="data">
                <div class="font-medium text-left">
                  {{ data.text }}
                </div>
              </template>

              <template v-slot:status="data">
                <rs-badge :variant="getStatusVariant(data.text)">
                  {{ data.text }}
                </rs-badge>
              </template>

              <template v-slot:actions="{ text, index }">
                <div class="flex justify-center items-center gap-2">
                  <div class="relative flex items-center justify-center" @mouseenter="tooltips['view'+index] = true" @mouseleave="tooltips['view'+index] = false">
                    <rs-button 
                      variant="info-text" 
                      class="p-1 w-8 h-8"
                      @click="viewBantuan(text)"
                    >
                      <Icon name="ic:outline-visibility" size="18" />
                    </rs-button>
                    <transition name="tooltip">
                      <span v-if="tooltips['view'+index]" class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 transform bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 w-max">
                        Lihat
                      </span>
                    </transition>
                  </div>
                </div>
              </template>
            </rs-table>
          </RsTabItem>

          <RsTabItem title="Lulus">
            <rs-table
              :data="filteredBantuanList('Lulus')"
              :columns="columns"
              :pageSize="pageSize"
              :showNoColumn="true"
              :show-filter="true"
              :show-search="true"
              :options="{
                variant: 'default',
                hover: true,
                striped: true,
              }"
              advanced
            >
              <template v-slot:id="data">
                <a href="#" class="text-primary-600 hover:text-primary-800" @click.prevent="viewBantuan(data.text)">
                  {{ data.text }}
                </a>
              </template>

              <template v-slot:tarikhMohon="data">
                {{ formatDate(data.text) }}
              </template>

              <template v-slot:jumlahAmaun="data">
                <div class="font-medium text-left">
                  {{ data.text }}
                </div>
              </template>

              <template v-slot:status="data">
                <rs-badge variant="success">
                  {{ data.text }}
                </rs-badge>
              </template>

              <template v-slot:actions="{ text, index }">
                <div class="flex justify-center items-center gap-2">
                  <div class="relative flex items-center justify-center" @mouseenter="tooltips['view'+index] = true" @mouseleave="tooltips['view'+index] = false">
                    <rs-button 
                      variant="info-text" 
                      class="p-1 w-8 h-8"
                      @click="viewBantuan(text)"
                    >
                      <Icon name="ic:outline-visibility" size="18" />
                    </rs-button>
                    <transition name="tooltip">
                      <span v-if="tooltips['view'+index]" class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 transform bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 w-max">
                        Lihat
                      </span>
                    </transition>
                  </div>
                </div>
              </template>
            </rs-table>
          </RsTabItem>

          <RsTabItem title="Ditolak">
            <rs-table
              :data="filteredBantuanList('Ditolak')"
              :columns="columns"
              :pageSize="pageSize"
              :showNoColumn="true"
              :show-filter="true"
              :show-search="true"
              :options="{
                variant: 'default',
                hover: true,
                striped: true,
              }"
              advanced
            >
              <template v-slot:id="data">
                <a href="#" class="text-primary-600 hover:text-primary-800" @click.prevent="viewBantuan(data.text)">
                  {{ data.text }}
                </a>
              </template>

              <template v-slot:tarikhMohon="data">
                {{ formatDate(data.text) }}
              </template>

              <template v-slot:jumlahAmaun="data">
                <div class="font-medium text-left">
                  {{ data.text }}
                </div>
              </template>

              <template v-slot:status="data">
                <rs-badge variant="danger">
                  {{ data.text }}
                </rs-badge>
              </template>

              <template v-slot:actions="{ text, index }">
                <div class="flex justify-center items-center gap-2">
                  <div class="relative flex items-center justify-center" @mouseenter="tooltips['view'+index] = true" @mouseleave="tooltips['view'+index] = false">
                    <rs-button 
                      variant="info-text" 
                      class="p-1 w-8 h-8"
                      @click="viewBantuan(text)"
                    >
                      <Icon name="ic:outline-visibility" size="18" />
                    </rs-button>
                    <transition name="tooltip">
                      <span v-if="tooltips['view'+index]" class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 transform bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 w-max">
                        Lihat
                      </span>
                    </transition>
                  </div>
                </div>
              </template>
            </rs-table>
          </RsTabItem>
        </RsTab>
      </template>
    </rs-card>

    <!-- Delete Confirmation Modal -->
    <rs-modal
      v-model="showDeleteModal"
      title="Sahkan Padam"
      size="md"
      position="center"
    >
      <template #body>
        <p>Adakah anda pasti untuk hapus rekod bulk processing ini?</p>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button variant="secondary" @click="showDeleteModal = false">
            Tidak
          </rs-button>
          <rs-button variant="danger" @click="handleDelete">
            Ya
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

definePageMeta({
  title: 'Senarai Bulk Processing',
});

const breadcrumb = ref([
  {
    name: 'Bantuan',
    type: 'link',
    path: '/BF-BTN/bantuan-bulk',
  },
  {
    name: 'Bulk Processing',
    type: 'link',
    path: '/BF-BTN/bantuan-bulk',
  },
  {
    name: 'Cipta Bulk Processing',
    type: 'current',
    path: '/BF-BTN/bantuan-bulk/cipta-bantuan-bulk',
  },
]);

// Table columns configuration
const columns = [
  {
    key: 'bil',
    label: 'Bil.',
    sortable: true,
  },
  {
    key: 'id',
    label: 'Kod BP',
    sortable: true,
  },
  {
    key: 'tajuk',
    label: 'Tajuk',
    sortable: true,
  },
  {
    key: 'aid',
    label: 'Aid',
    sortable: true,
  },
  {
    key: 'aidProduct',
    label: 'Aid Product',
    sortable: true,
  },
  {
    key: 'jumlahAmaun',
    label: 'Jumlah Amaun',
    sortable: true,
  },
  {
    key: 'tarikhMohon',
    label: 'Tarikh Mohon',
    sortable: true,
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
  },
  {
    key: "actions",
    label: "Tindakan",
    sortable: false,
    align: "center",
    width: "120px",
  },
];

// State management
const searchQuery = ref('');
const filters = ref({
  status: '',
});
const pageSize = ref(10);
const currentPage = ref(1);
const showDeleteModal = ref(false);
const selectedBantuanId = ref(null);
const tooltips = ref({});
// Mock data (replace with actual API calls)
const bantuanList = ref([
  {
    id: 'BP-2025-00001',
    tajuk: 'Wang Saku Fakir Mac 2025',
    aid: 'B314 - Bantuan Keperluan Pendidikan IPT (Fakir)',
    aidProduct: '(HQ) KPIPT (Fakir) - Bantuan Wang Saku',
    jumlahAmaun: 'RM20,000.00',
    tarikhMohon: '01/03/2025',
    status: 'Draf',
    actions: 'BP-2025-00001'
  },
  {
    id: 'BP-2025-00002',
    tajuk: 'Wang Saku Fakir Feb 2025',
    aid: 'B314 - Bantuan Keperluan Pendidikan IPT (Fakir)',
    aidProduct: '(HQ) KPIPT (Fakir) - Bantuan Wang Saku',
    jumlahAmaun: 'RM23,000.00',
    tarikhMohon: '01/02/2025',
    status: 'Draf',
    actions: 'BP-2025-00002'
  },
  {
    id: 'BP-2025-00003',
    tajuk: 'Wang Saku Miskin Feb 2025',
    aid: 'B314 - Bantuan Keperluan Pendidikan IPT (Fakir)',
    aidProduct: '(HQ) KPIPT (Fakir) - Bantuan Wang Saku',
    jumlahAmaun: 'RM28,000.00',
    tarikhMohon: '02/02/2025',
    status: 'Dalam Proses',
    actions: 'BP-2025-00003'
  },
  {
    id: 'BP-2025-00004',
    tajuk: 'Bantuan bencana Feb 2025',
    aid: 'B146 - (HQ) BANTUAN BENCANA (FAKIR)',
    aidProduct: '(HQ) BANTUAN BANJIR (FAKIR)',
    jumlahAmaun: 'RM35,000.00',
    tarikhMohon: '25/02/2025',
    status: 'Dalam Proses',
    actions: 'BP-2025-00004'
  },
  {
    id: 'BP-2025-01617',
    tajuk: 'TUNTUTAN KFAM APRIL 2025 - PELAJAR',
    aid: '(HQ) ELAUN KEHADIRAN KELAS AGAM ASAS (MUALLAF)',
    aidProduct: '(HQ) ELAUN KEHADIRAN KELAS AGAM ASAS (MUALLAF)',
    jumlahAmaun: 'RM44,390.00',
    tarikhMohon: '04/05/2025',
    status: 'Lulus',
    actions: 'BP-2025-01617'
  },
  {
    id: 'BP-2025-01589',
    tajuk: 'TUNTUTAN KFAM APRIL 2025 - GURU',
    aid: '(HQ) ELAUN GURU PEMBIMBING ASNAF (MUALLAF)',
    aidProduct: '(HQ) ELAUN GURU PEMBIMBING ASNAF (MUALLAF)',
    jumlahAmaun: 'RM54,710.00',
    tarikhMohon: '30/04/2025',
    status: 'Lulus',
    actions: 'BP-2025-01589'
  },
  {
    id: 'BP-2025-00007',
    tajuk: 'Bantuan Rumah Jan 2025',
    aid: 'B100 - Bantuan Rumah',
    aidProduct: '(HQ) BANTUAN RUMAH',
    jumlahAmaun: 'RM50,000.00',
    tarikhMohon: '05/01/2025',
    status: 'Ditolak',
    actions: 'BP-2025-00007'
  },
  {
    id: 'BP-2025-00008',
    tajuk: 'Bantuan Makanan Feb 2025',
    aid: 'B150 - Bantuan Makanan',
    aidProduct: '(HQ) BANTUAN MAKANAN',
    jumlahAmaun: 'RM15,000.00',
    tarikhMohon: '20/02/2025',
    status: 'Ditolak',
    actions: 'BP-2025-00008'
  },
]);

// Options
const statusOptions = [
  { label: 'Semua', value: '' },
  { label: 'Draf', value: 'Draf' },
  { label: 'Aktif', value: 'Aktif' }
];

// Computed properties
const filteredBantuanList = (status) => {
  let filtered = [...bantuanList.value];
  
  // Filter by status if provided
  if (status) {
    filtered = filtered.filter(item => item.status === status);
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(item => 
      item.id.toLowerCase().includes(query) ||
      item.tajuk.toLowerCase().includes(query)
    );
  }

  if (filters.value.status) {
    filtered = filtered.filter(item => item.status === filters.value.status);
  }

  return filtered;
};

const totalBantuan = computed(() => bantuanList.value.length);
const totalPages = computed(() => Math.ceil(totalBantuan.value / pageSize.value));
const paginationStart = computed(() => ((currentPage.value - 1) * pageSize.value) + 1);
const paginationEnd = computed(() => Math.min(currentPage.value * pageSize.value, totalBantuan.value));

// Methods
const formatDate = (dateString) => {
  if (!dateString) return '';
  // Assuming dateString is in DD/MM/YYYY format
  return dateString;
};

const getStatusVariant = (status) => {
  switch (status) {
    case 'Draf':
      return 'disabled';
    case 'Lulus':
      return 'success';
    case 'Ditolak':
      return 'danger';
    case 'Dalam Proses':
      return 'warning';
    case 'Baru':
      return 'primary';
    default:
      return 'secondary';
  }
};

const editBantuan = (id) => {
  navigateTo(`cipta-bantuan-bulk/${id}/edit`);
};

const viewBantuan = (id) => {
  navigateTo(`cipta-bantuan-bulk/${id}`);
};

const confirmDelete = (id) => {
  selectedBantuanId.value = id;
  showDeleteModal.value = true;
};

const handleDelete = async () => {
  try {
    console.log('Deleting bantuan:', selectedBantuanId.value);
    bantuanList.value = bantuanList.value.filter(item => item.id !== selectedBantuanId.value);
    showDeleteModal.value = false;
    selectedBantuanId.value = null;
  } catch (error) {
    console.error('Error deleting bantuan:', error);
  }
};
</script>

<style lang="scss" scoped>
.rs-table {
  :deep(th) {
    @apply bg-gray-50 text-gray-600 font-medium;
  }
}
.tooltip-enter-active, .tooltip-leave-active {
  transition: opacity 0.2s;
}
.tooltip-enter-from, .tooltip-leave-to {
  opacity: 0;
}
</style>