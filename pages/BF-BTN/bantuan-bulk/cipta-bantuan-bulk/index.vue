<<<<<<< HEAD
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Bantuan Bulk</h2>
          <rs-button variant="primary" @click="navigateTo('cipta-bantuan-bulk/tambah')">
            <Icon name="material-symbols:add" class="mr-1" /> Tambah
          </rs-button>
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
                placeholder="Cari kod BP, tajuk bantuan..."
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
            <div class="flex gap-2">
              <FormKit
                v-model="filters.status"
                type="select"
                placeholder="Status"
                :options="statusOptions"
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
          </div>
        </div>

        <!-- Main Table -->
        <rs-table
          :data="filteredBantuanList"
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
          <!-- Custom column templates -->
          <template v-slot:kodBP="{ text }">
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

          <template v-slot:tindakan="{ text }">
            <div class="flex space-x-2">
              <rs-button
                variant="primary"
                size="sm"
                class="!px-2 !py-1"
                @click="viewBantuan(text.id)"
              >
                <Icon name="material-symbols:visibility" class="w-4 h-4 mr-1" />
                Lihat
              </rs-button>
              <!-- <rs-button
                v-if="text.status === 'Draf'"
                variant="warning"
                size="sm"
                class="!px-2 !py-1"
                @click="editBantuan(text.id)"
              >
                <Icon name="material-symbols:edit" class="w-4 h-4 mr-1" />
                Edit
              </rs-button>
              <rs-button
                v-if="text.status === 'Draf'"
                variant="danger"
                size="sm"
                class="!px-2 !py-1"
                @click="confirmDelete(text.id)"
              >
                <Icon name="material-symbols:delete" class="w-4 h-4 mr-1" />
                Padam
              </rs-button> -->
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
        <p>Adakah anda pasti untuk memadam rekod bantuan bulk ini?</p>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button variant="secondary" @click="showDeleteModal = false">
            Batal
          </rs-button>
          <rs-button variant="danger" @click="handleDelete">
            Padam
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

definePageMeta({
  title: 'Senarai Bantuan Bulk',
});

const breadcrumb = ref([
  {
    name: 'Bantuan',
    type: 'link',
    path: '/BF-BTN/bantuan-bulk',
  },
  {
    name: 'Bantuan Bulk',
    type: 'link',
    path: '/BF-BTN/bantuan-bulk',
  },
  {
    name: 'Senarai Bantuan Bulk',
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
    key: 'kodBP',
    label: 'Kod BP',
    sortable: true,
  },
  {
    key: 'tajukBantuan',
    label: 'Tajuk Bantuan',
    sortable: true,
  },
  {
    key: 'bantuan',
    label: 'Bantuan (Aid)',
    sortable: true,
  },
  {
    key: 'produkBantuan',
    label: 'Produk Bantuan',
    sortable: true,
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
  },
  {
    key: 'tindakan',
    label: 'Tindakan',
    sortable: false,
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

// Mock data (replace with actual API calls)
const bantuanList = ref([
  {
    kodBP: 'BP-2025-00001',
    tajukBantuan: 'Wang Saku Fakir Mac 2025',
    bantuan: 'B314 - Bantuan Keperluan Pendidikan IPT (Fakir)',
    produkBantuan: '(HQ) KPIPT (Fakir) - Bantuan Wang Saku',
    status: 'Draft',
    tindakan: { id: 'BP-2025-00001', status: 'Draft' }
  },
  {
    kodBP: 'BP-2025-00002',
    tajukBantuan: 'Wang Saku Fakir Feb 2025',
    bantuan: 'B314 - Bantuan Keperluan Pendidikan IPT (Fakir)',
    produkBantuan: '(HQ) KPIPT (Fakir) - Bantuan Wang Saku',
    status: 'Draft',
    tindakan: { id: 'BP-2025-00002', status: 'Draft' }
  },
  {
    kodBP: 'BP-2025-00003',
    tajukBantuan: 'Wang Saku Fakir Mac 2025',
    bantuan: 'B314 - Bantuan Keperluan Pendidikan IPT (Fakir)',
    produkBantuan: '(HQ) KPIPT (Fakir) - Bantuan Wang Saku',
    status: 'Draft',
    tindakan: { id: 'BP-2025-00003', status: 'Draft' }
  },
  {
    kodBP: 'BP-2025-00004',
    tajukBantuan: 'Bantuan bencana Feb 2025',
    bantuan: 'B146 - (HQ) BANTUAN BENCANA (FAKIR)',
    produkBantuan: '(HQ) BANTUAN BANJIR (FAKIR)',
    status: 'Draft',
    tindakan: { id: 'BP-2025-00004', status: 'Draft' }
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
      item.kodBP.toLowerCase().includes(query) ||
      item.tajukBantuan.toLowerCase().includes(query)
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

const viewBantuan = (id) => {
  navigateTo(`cipta-bantuan-bulk/${id}`);
};

const editBantuan = (id) => {
  navigateTo(`cipta-bantuan-bulk/${id}/edit`);
};

const confirmDelete = (id) => {
  selectedBantuanId.value = id;
  showDeleteModal.value = true;
};

const handleDelete = async () => {
  try {
    // Implement delete logic here
    console.log('Deleting bantuan:', selectedBantuanId.value);
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
</style>
=======
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Bantuan Bulk</h2>
          <rs-button variant="primary" @click="navigateTo('cipta-bantuan-bulk/tambah')">
            <Icon name="material-symbols:add" class="mr-1" /> Tambah
          </rs-button>
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
                placeholder="Cari kod BP, tajuk bantuan..."
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
            <div class="flex gap-2">
              <FormKit
                v-model="filters.status"
                type="select"
                placeholder="Status"
                :options="statusOptions"
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
          </div>
        </div>

        <!-- Main Table -->
        <rs-table
          :data="filteredBantuanList"
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
          <!-- Custom column templates -->
          <template v-slot:kodBP="{ text }">
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

          <template v-slot:tindakan="{ text }">
            <div class="flex space-x-2">
              <rs-button
                variant="primary"
                size="sm"
                class="!px-2 !py-1"
                @click="viewBantuan(text.id)"
              >
                <Icon name="material-symbols:visibility" class="w-4 h-4 mr-1" />
                Lihat
              </rs-button>
              <!-- <rs-button
                v-if="text.status === 'Draf'"
                variant="warning"
                size="sm"
                class="!px-2 !py-1"
                @click="editBantuan(text.id)"
              >
                <Icon name="material-symbols:edit" class="w-4 h-4 mr-1" />
                Edit
              </rs-button>
              <rs-button
                v-if="text.status === 'Draf'"
                variant="danger"
                size="sm"
                class="!px-2 !py-1"
                @click="confirmDelete(text.id)"
              >
                <Icon name="material-symbols:delete" class="w-4 h-4 mr-1" />
                Padam
              </rs-button> -->
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
        <p>Adakah anda pasti untuk memadam rekod bantuan bulk ini?</p>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button variant="secondary" @click="showDeleteModal = false">
            Batal
          </rs-button>
          <rs-button variant="danger" @click="handleDelete">
            Padam
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

definePageMeta({
  title: 'Senarai Bantuan Bulk',
});

const breadcrumb = ref([
  {
    name: 'Bantuan',
    type: 'link',
    path: '/BF-BTN/bantuan-bulk',
  },
  {
    name: 'Bantuan Bulk',
    type: 'link',
    path: '/BF-BTN/bantuan-bulk',
  },
  {
    name: 'Senarai Bantuan Bulk',
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
    key: 'kodBP',
    label: 'Kod BP',
    sortable: true,
  },
  {
    key: 'tajukBantuan',
    label: 'Tajuk Bantuan',
    sortable: true,
  },
  {
    key: 'bantuan',
    label: 'Bantuan (Aid)',
    sortable: true,
  },
  {
    key: 'produkBantuan',
    label: 'Produk Bantuan',
    sortable: true,
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
  },
  {
    key: 'tindakan',
    label: 'Tindakan',
    sortable: false,
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

// Mock data (replace with actual API calls)
const bantuanList = ref([
  {
    kodBP: 'BP-2025-00001',
    tajukBantuan: 'Wang Saku Fakir Mac 2025',
    bantuan: 'B314 - Bantuan Keperluan Pendidikan IPT (Fakir)',
    produkBantuan: '(HQ) KPIPT (Fakir) - Bantuan Wang Saku',
    status: 'Draft',
    tindakan: { id: 'BP-2025-00001', status: 'Draft' }
  },
  {
    kodBP: 'BP-2025-00002',
    tajukBantuan: 'Wang Saku Fakir Feb 2025',
    bantuan: 'B314 - Bantuan Keperluan Pendidikan IPT (Fakir)',
    produkBantuan: '(HQ) KPIPT (Fakir) - Bantuan Wang Saku',
    status: 'Draft',
    tindakan: { id: 'BP-2025-00002', status: 'Draft' }
  },
  {
    kodBP: 'BP-2025-00003',
    tajukBantuan: 'Wang Saku Fakir Mac 2025',
    bantuan: 'B314 - Bantuan Keperluan Pendidikan IPT (Fakir)',
    produkBantuan: '(HQ) KPIPT (Fakir) - Bantuan Wang Saku',
    status: 'Draft',
    tindakan: { id: 'BP-2025-00003', status: 'Draft' }
  },
  {
    kodBP: 'BP-2025-00004',
    tajukBantuan: 'Bantuan bencana Feb 2025',
    bantuan: 'B146 - (HQ) BANTUAN BENCANA (FAKIR)',
    produkBantuan: '(HQ) BANTUAN BANJIR (FAKIR)',
    status: 'Draft',
    tindakan: { id: 'BP-2025-00004', status: 'Draft' }
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
      item.kodBP.toLowerCase().includes(query) ||
      item.tajukBantuan.toLowerCase().includes(query)
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

const viewBantuan = (id) => {
  navigateTo(`cipta-bantuan-bulk/${id}`);
};

const editBantuan = (id) => {
  navigateTo(`cipta-bantuan-bulk/${id}/edit`);
};

const confirmDelete = (id) => {
  selectedBantuanId.value = id;
  showDeleteModal.value = true;
};

const handleDelete = async () => {
  try {
    // Implement delete logic here
    console.log('Deleting bantuan:', selectedBantuanId.value);
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
</style>
>>>>>>> 3dcc227fdaa7aaa5e054a6ffebfa8addde014eae
