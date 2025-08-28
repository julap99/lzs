<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl font-semibold">Pengesahan Organisasi</h2>
          </div>
        </div>
      </template>

      <template #body>
        <!-- Search Section -->
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
                  <div class="flex space-x-3">
                    <!-- View Button - Always available -->
                    <button
                      @click="viewItem(text.id)"
                      title="Lihat"
                      class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <Icon name="ic:baseline-visibility" size="20" class="text-primary" />
                    </button>
                    
                    <!-- Edit Button - Available for all statuses -->
                    <button
                      @click="editItem(text.id)"
                      title="Kemaskini"
                      class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <Icon name="ic:outline-edit" size="20" class="text-warning" />
                    </button>
                    
                    <!-- Semak Button - Only for pending items -->
                    <button
                      v-if="canPerformAction(text.status)"
                      @click="handleSemakPengesahan(text.id)"
                      title="Semak"
                      class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <Icon name="ic:baseline-assignment" size="20" class="text-info" />
                    </button>
                    
                    <!-- Delete Button - Only for Eksekutif role -->
                    <button
                      v-if="canDelete(text.status)"
                      @click="confirmDelete(text.id, text)"
                      title="Padam"
                      class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <Icon name="ic:outline-delete" size="20" class="text-danger" />
                    </button>
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
                  <div class="flex space-x-3">
                    <!-- View Button - Always available -->
                    <button
                      @click="viewItem(text.id)"
                      title="Lihat"
                      class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <Icon name="ic:baseline-visibility" size="20" class="text-primary" />
                    </button>
                    
                    <!-- Edit Button - Available for all statuses -->
                    <button
                      @click="editItem(text.id)"
                      title="Kemaskini"
                      class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <Icon name="ic:outline-edit" size="20" class="text-warning" />
                    </button>
                    
                    <!-- Semak Button - Only for pending items -->
                    <button
                      v-if="canPerformAction(text.status)"
                      @click="handleSemakPengesahan(text.id)"
                      title="Semak"
                      class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <Icon name="ic:baseline-assignment" size="20" class="text-info" />
                    </button>
                    
                    <!-- Delete Button - Only for Eksekutif role -->
                    <button
                      v-if="canDelete(text.status)"
                      @click="confirmDelete(text.id, text)"
                      title="Padam"
                      class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <Icon name="ic:outline-delete" size="20" class="text-danger" />
                    </button>
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
                  <div class="flex space-x-3">
                    <!-- View Button - Always available -->
                    <button
                      @click="viewItem(text.id)"
                      title="Lihat"
                      class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <Icon name="ic:baseline-visibility" size="20" class="text-primary" />
                    </button>
                    
                    <!-- Edit Button - Available for all statuses -->
                    <button
                      @click="editItem(text.id)"
                      title="Kemaskini"
                      class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <Icon name="ic:outline-edit" size="20" class="text-warning" />
                    </button>
                    
                    <!-- Semak Button - Only for pending items -->
                    <button
                      v-if="canPerformAction(text.status)"
                      @click="handleSemakPengesahan(text.id)"
                      title="Semak"
                      class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <Icon name="ic:baseline-assignment" size="20" class="text-info" />
                    </button>
                    
                    <!-- Delete Button - Only for Eksekutif role -->
                    <button
                      v-if="canDelete(text.status)"
                      @click="confirmDelete(text.id, text)"
                      title="Padam"
                      class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <Icon name="ic:outline-delete" size="20" class="text-danger" />
                    </button>
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

    <!-- Enhanced Delete Confirmation Modal -->
    <rs-modal
      v-model="showDeleteModal"
      title="Sahkan Padam"
      size="md"
      position="center"
    >
      <template #body>
        <div class="space-y-4">
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex items-center space-x-2">
              <Icon name="ic:baseline-warning" class="w-5 h-5 text-red-600" />
              <span class="font-medium text-red-800">Amaran Padam</span>
            </div>
            <p class="text-sm text-red-700 mt-2">
              Anda akan memadam maklumat organisasi berikut:
            </p>
            <div class="mt-2 p-2 bg-white border rounded text-sm">
              <strong>{{ itemToDelete?.noRujukan }}</strong> - {{ itemToDelete?.namaOrganisasi }}
            </div>
          </div>

          <div class="space-y-3">
            <label class="flex items-start space-x-3">
              <input
                type="checkbox"
                v-model="deleteConfirmation.checkbox"
                class="mt-1 w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
              />
              <span class="text-sm text-gray-700">
                Saya mengesahkan tindakan padam ini dan memahami bahawa tindakan ini tidak boleh dibuat asal
              </span>
            </label>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Taip "PADAM" untuk mengesahkan:
              </label>
              <FormKit
                v-model="deleteConfirmation.text"
                type="text"
                placeholder="Taip PADAM"
                :classes="{ input: '!py-2 text-center font-mono' }"
              />
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button variant="primary-outline" @click="cancelDelete">
            Batal
          </rs-button>
          <rs-button 
            variant="danger" 
            :disabled="!canConfirmDelete"
            @click="confirmDeleteAction"
          >
            Padam
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

definePageMeta({ title: 'Senarai Pengesahan Organisasi' });

const breadcrumb = ref([
  { name: 'Pengesahan', type: 'link', path: '/BF-PRF/OR/PP' },
  { name: 'Senarai Organisasi', type: 'current', path: '/BF-PRF/OR/PP' },
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
    status: 'Diluluskan',
    tindakan: { id: 'ORG-240502', status: 'Diluluskan' },
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
    status: 'Menunggu Pengesahan',
    tindakan: { id: 'ORG-240506', status: 'Menunggu Pengesahan' },
  },
  {
    noRujukan: 'ORG-240507',
    namaOrganisasi: 'Universiti Teknologi Malaysia',
    tarikhPermohonan: new Date().toISOString(),
    jenisOrganisasi: 'IPT',
    status: 'Ditolak',
    tindakan: { id: 'ORG-240507', status: 'Ditolak' },
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
    'Diluluskan': 'success',
    'Ditolak': 'danger'
  };
  return variants[status] || 'default';
};

// Delete confirmation state
const showDeleteModal = ref(false);
const itemToDelete = ref(null);
const deleteConfirmation = ref({
  checkbox: false,
  text: ''
});

// User role simulation - for demo purposes
const currentUserRole = ref('Eksekutif'); // Eksekutif, Pengurus, etc.

// Action capabilities for Eksekutif role
const canPerformAction = (status) => {
  return ['Menunggu Pengesahan'].includes(status);
};

// Edit permissions - all statuses can be edited (will go back to approval)
const canEdit = (status) => {
  return true; // All items can be edited
};

// Delete permissions - only Eksekutif role can delete
const canDelete = (status) => {
  return currentUserRole.value === 'Eksekutif';
};

// Computed property for delete confirmation validation
const canConfirmDelete = computed(() => {
  return deleteConfirmation.value.checkbox && 
         deleteConfirmation.value.text === 'PADAM';
});

// Search function
const performSearch = () => {
  // Force table re-render when search is performed
  tableKey.value++;
  currentPage.value = 1;
};

// CRUD Operations
const viewItem = (id) => navigateTo(`/BF-PRF/OR/PP/view/${id}`);
const editItem = (id) => navigateTo(`/BF-PRF/OR/PP/kemaskini/${id}`);
const handleSemakPengesahan = (id) => navigateTo(`/BF-PRF/OR/PP/04`);

// Delete operations
const confirmDelete = (id, item) => {
  // Find the full item data from the table data by ID
  const fullItem = filteredTableData.value.find(org => org.tindakan.id === id);
  itemToDelete.value = fullItem;
  showDeleteModal.value = true;
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  itemToDelete.value = null;
  deleteConfirmation.value = {
    checkbox: false,
    text: ''
  };
};

const confirmDeleteAction = () => {
  if (!canConfirmDelete.value) return;
  
  // Remove item from the list
  const index = organizationList.value.findIndex(
    item => item.noRujukan === itemToDelete.value.noRujukan
  );
  
  if (index !== -1) {
    organizationList.value.splice(index, 1);
    
    // Log audit action (in real implementation, this would be an API call)
    console.log('Audit Log:', {
      action: 'DELETE',
      user: currentUserRole.value,
      item: itemToDelete.value,
      timestamp: new Date().toISOString()
    });
    
    // Force table re-render
    tableKey.value++;
  }
  
  cancelDelete();
};

// Legacy function for backward compatibility
const viewOrganization = (id) => viewItem(id);
</script>
