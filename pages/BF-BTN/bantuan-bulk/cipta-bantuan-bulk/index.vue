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
        <!-- Main Table -->
        <rs-table
          :data="filteredBantuanList"
          :columns="columns"
          :pageSize="pageSize"
          :showNoColumn="true"
          :showSearch="true"
          :showFilter="true"
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
          <!-- Custom column templates -->
          <template v-slot:id="{ text }">
            <a 
              href="#" 
              class="text-primary-600 hover:text-primary-800"
              @click.prevent="viewBantuan(text)"
            >
              {{ text }}
            </a>
          </template>

          <template v-slot:status="{ text }">
            <rs-badge :variant="getStatusVariant(text)">
              {{ text }}
            </rs-badge>
          </template>
          <template v-slot:actions="{ text, index }">
                  <div class="flex justify-end space-x-2">
                    <!-- Edit button with tooltip -->
                    <div class="relative" @mouseenter="tooltips['edit'+index] = true" @mouseleave="tooltips['edit'+index] = false">
                      <rs-button 
                        variant="info-text" 
                        class="p-1 w-8 h-8"
                        @click="editBantuan(text)"
                      >
                        <Icon name="ic:outline-edit" size="18" />
                      </rs-button>
                      <transition name="tooltip">
                        <span v-if="tooltips['edit'+index]" class="absolute bottom-full mb-2 right-0 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                          Edit
                        </span>
                      </transition>
                    </div>

                    <div class="relative" @mouseenter="tooltips['view'+index] = true" @mouseleave="tooltips['view'+index] = false">
                      <rs-button 
                        variant="info-text" 
                        class="p-1 w-8 h-8"
                        @click="viewBantuan(text)"
                      >
                        <Icon name="ic:outline-visibility" size="18" />
                      </rs-button>
                      <transition name="tooltip">
                        <span v-if="tooltips['view'+index]" class="absolute bottom-full mb-2 right-0 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                          Lihat
                        </span>
                      </transition>
                    </div>

                    <div class="relative" @mouseenter="tooltips['delete'+index] = true" @mouseleave="tooltips['delete'+index] = false">
                      <rs-button variant="danger-text" class="p-1 w-8 h-8" @click = "confirmDelete(text)">
                        <Icon name="ic:outline-delete" size="18" />
                      </rs-button>
                      <transition name="tooltip">
                        <span v-if="tooltips['delete'+index]" class="absolute bottom-full mb-2 right-0 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                          Hapus
                        </span>
                      </transition>
                    </div>
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
              {{ paginationEnd }} daripada {{ totalBantuan }} entri
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
    name: 'Senarai Bulk Processing',
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
    status: 'Draf',
    actions: 'BP-2025-00003'
  },
  {
    id: 'BP-2025-00004',
    tajuk: 'Bantuan bencana Feb 2025',
    aid: 'B146 - (HQ) BANTUAN BENCANA (FAKIR)',
    aidProduct: '(HQ) BANTUAN BANJIR (FAKIR)',
    jumlahAmaun: 'RM35,000.00',
    tarikhMohon: '25/02/2025',
    status: 'Draf',
    actions: 'BP-2025-00004'
  },
]);

// Options
const statusOptions = [
  { label: 'Semua', value: '' },
  { label: 'Draf', value: 'Draf' },
  { label: 'Aktif', value: 'Aktif' }
];

// Computed properties
const filteredBantuanList = computed(() => {
  let filtered = [...bantuanList.value];
  
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
});

const totalBantuan = computed(() => filteredBantuanList.value.length);
const totalPages = computed(() => Math.ceil(totalBantuan.value / pageSize.value));
const paginationStart = computed(() => ((currentPage.value - 1) * pageSize.value) + 1);
const paginationEnd = computed(() => Math.min(currentPage.value * pageSize.value, totalBantuan.value));

// Methods
const getStatusVariant = (status) => {
  switch (status) {
    case 'Draf':
      return 'warning';
    case 'Sedang Diproses':
      return 'info';
    case 'Ditolak':
      return 'danger';
    case 'Baru':
      return 'primary';
    case '  ':
      return 'success';
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