<!-- 
  RTMF SCREEN: PA-KF-KJ-01_01 (Position List)
  PURPOSE: Senarai jawatan penolong amil dengan workflow kelulusan
  DESCRIPTION: Position list with approval workflow for Penolong Amil positions
  ROUTE: /BF-PA/KF/KJ
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Page-specific Role Switcher -->
    <div class="px-4 py-2 mt-0">
      <div class="flex items-center space-x-3">
        <div class="flex items-center space-x-2">
          <Icon name="ic:baseline-account-circle" class="text-gray-600" size="20" />
          <span class="text-sm font-medium text-gray-700">Simulasi Peranan:</span>
        </div>
        <select
          v-model="currentRole"
          @change="handleRoleChange"
          class="py-1.5 px-3 text-sm rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option 
            v-for="option in roleOptions" 
            :key="option.value" 
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>

    <rs-card class="mt-4">
      <template #header>
        <div>
          <h2 class="text-xl font-semibold">Senarai Jawatan Penolong Amil</h2>
        </div>
      </template>

      <template #body>
        <!-- Smart Filter Section -->
        <div class="mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              v-model="filters.searchQuery"
              type="text"
              placeholder="Cari rujukan, kategori, atau nama jawatan..."
              :classes="{
                input: '!py-2',
              }"
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
        <!-- Eksekutif Tabs -->
        <div v-if="currentRole === 'eksekutif'">
          <rs-tab v-model="activeTab" class="mt-4">
            <rs-tab-item title="Aktif">
              <div class="p-4">
                <rs-table
                  :key="`table-${tableKey}-active`"
                  :data="getTableDataByStatus(['Aktif'])"
                  :pageSize="10"
                  :showNoColumn="false"
                  :columns="tableColumns"
                  :options="{
                    variant: 'default',
                    hover: true,
                  }"
                >
                  <template v-slot:status="data">
                    <rs-badge :variant="getStatusVariant(data.text)">
                      {{ data.text }}
                    </rs-badge>
                  </template>

                  <template v-slot:tarikhKuatkuasa="data">
                    <span class="text-sm text-gray-900">
                      {{ formatTarikhKuatkuasa(data.text) }}
                    </span>
                  </template>

                  <template v-slot:tindakan="data">
                    <div class="flex space-x-3">
                      <button
                        @click="viewPosition(data.text)"
                        title="Lihat"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                      </button>
                      <button
                        v-if="canEditPosition(data.text)"
                        @click="editPosition(data.text)"
                        title="Kemaskini"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:outline-edit" class="w-5 h-5 text-secondary" />
                      </button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Sedang Proses">
              <div class="p-4">
                <rs-table
                  :key="`table-${tableKey}-process`"
                  :data="getTableDataByStatus(['Menunggu Pengesahan', 'Menunggu Kelulusan'])"
                  :pageSize="10"
                  :showNoColumn="false"
                  :columns="tableColumns"
                  :options="{
                    variant: 'default',
                    hover: true,
                  }"
                >
                  <template v-slot:status="data">
                    <rs-badge :variant="getStatusVariant(data.text)">
                      {{ data.text }}
                    </rs-badge>
                  </template>

                  <template v-slot:tarikhKuatkuasa="data">
                    <span class="text-sm text-gray-900">
                      {{ formatTarikhKuatkuasa(data.text) }}
                    </span>
                  </template>

                  <template v-slot:tindakan="data">
                    <div class="flex space-x-3">
                      <button
                        @click="viewPosition(data.text)"
                        title="Lihat"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                      </button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Tidak Aktif">
              <div class="p-4">
                <rs-table
                  :key="`table-${tableKey}-inactive`"
                  :data="getTableDataByStatus(['Tidak Aktif'])"
                  :pageSize="10"
                  :showNoColumn="false"
                  :columns="tableColumns"
                  :options="{
                    variant: 'default',
                    hover: true,
                  }"
                >
                  <template v-slot:status="data">
                    <rs-badge :variant="getStatusVariant(data.text)">
                      {{ data.text }}
                    </rs-badge>
                  </template>

                  <template v-slot:tarikhKuatkuasa="data">
                    <span class="text-sm text-gray-900">
                      {{ formatTarikhKuatkuasa(data.text) }}
                    </span>
                  </template>

                  <template v-slot:tindakan="data">
                    <div class="flex space-x-3">
                      <button
                        @click="viewPosition(data.text)"
                        title="Lihat"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                      </button>
                      <button
                        v-if="canEditPosition(data.text)"
                        @click="editPosition(data.text)"
                        title="Kemaskini"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:outline-edit" class="w-5 h-5 text-secondary" />
                      </button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>
          </rs-tab>
        </div>

        <!-- Ketua Jabatan Tabs -->
        <div v-if="currentRole === 'ketua-jabatan'">
          <rs-tab v-model="activeTab" class="mt-4">
            <rs-tab-item title="Aktif">
              <div class="p-4">
                <rs-table
                  :key="`table-${tableKey}-active`"
                  :data="getTableDataByStatus(['Aktif'])"
                  :pageSize="10"
                  :showNoColumn="false"
                  :columns="tableColumns"
                  :options="{
                    variant: 'default',
                    hover: true,
                  }"
                >
                  <template v-slot:status="data">
                    <rs-badge :variant="getStatusVariant(data.text)">
                      {{ data.text }}
                    </rs-badge>
                  </template>

                  <template v-slot:tarikhKuatkuasa="data">
                    <span class="text-sm text-gray-900">
                      {{ formatTarikhKuatkuasa(data.text) }}
                    </span>
                  </template>

                  <template v-slot:tindakan="data">
                    <div class="flex space-x-3">
                      <button
                        @click="viewPosition(data.text)"
                        title="Lihat"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                      </button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Menunggu Pengesahan">
              <div class="p-4">
                <rs-table
                  :key="`table-${tableKey}-pending`"
                  :data="getTableDataByStatus(['Menunggu Pengesahan'])"
                  :pageSize="10"
                  :showNoColumn="false"
                  :columns="tableColumns"
                  :options="{
                    variant: 'default',
                    hover: true,
                  }"
                >
                  <template v-slot:status="data">
                    <rs-badge :variant="getStatusVariant(data.text)">
                      {{ data.text }}
                    </rs-badge>
                  </template>

                  <template v-slot:tarikhKuatkuasa="data">
                    <span class="text-sm text-gray-900">
                      {{ formatTarikhKuatkuasa(data.text) }}
                    </span>
                  </template>

                  <template v-slot:tindakan="data">
                    <div class="flex space-x-3">
                      <button
                        @click="viewPosition(data.text)"
                        title="Lihat"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                      </button>
                      <button
                        @click="navigateToVerification(data.text, 'verify')"
                        title="Sahkan"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:baseline-check-circle" class="w-5 h-5 text-warning" />
                      </button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Tidak Aktif">
              <div class="p-4">
                <rs-table
                  :key="`table-${tableKey}-inactive`"
                  :data="getTableDataByStatus(['Tidak Aktif'])"
                  :pageSize="10"
                  :showNoColumn="false"
                  :columns="tableColumns"
                  :options="{
                    variant: 'default',
                    hover: true,
                  }"
                >
                  <template v-slot:status="data">
                    <rs-badge :variant="getStatusVariant(data.text)">
                      {{ data.text }}
                    </rs-badge>
                  </template>

                  <template v-slot:tarikhKuatkuasa="data">
                    <span class="text-sm text-gray-900">
                      {{ formatTarikhKuatkuasa(data.text) }}
                    </span>
                  </template>

                  <template v-slot:tindakan="data">
                    <div class="flex space-x-3">
                      <button
                        @click="viewPosition(data.text)"
                        title="Lihat"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                      </button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>
          </rs-tab>
        </div>

        <!-- Ketua Divisyen Tabs -->
        <div v-if="currentRole === 'ketua-divisyen'">
          <rs-tab v-model="activeTab" class="mt-4">
            <rs-tab-item title="Aktif">
              <div class="p-4">
                <rs-table
                  :key="`table-${tableKey}-active`"
                  :data="getTableDataByStatus(['Aktif'])"
                  :pageSize="10"
                  :showNoColumn="false"
                  :columns="tableColumns"
                  :options="{
                    variant: 'default',
                    hover: true,
                  }"
                >
                  <template v-slot:status="data">
                    <rs-badge :variant="getStatusVariant(data.text)">
                      {{ data.text }}
                    </rs-badge>
                  </template>

                  <template v-slot:tarikhKuatkuasa="data">
                    <span v-if="data.text" class="text-sm text-gray-900">{{ data.text }}</span>
                    <span v-else class="text-sm text-gray-500 italic">Akan ditetapkan selepas kelulusan</span>
                  </template>

                  <template v-slot:tindakan="data">
                    <div class="flex space-x-3">
                      <button
                        @click="viewPosition(data.text)"
                        title="Lihat"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                      </button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Sedang Proses - Lulus">
              <div class="p-4">
                <div class="flex justify-between items-center mb-4">
                  <!-- Bulk Approval Button - Only in this tab -->
                  <div v-if="hasPendingApprovals" class="flex space-x-3">
                    <rs-button
                      variant="success"
                      @click="openBulkApprovalModal"
                      class="flex items-center"
                    >
                      <Icon name="ic:baseline-check-circle" class="w-4 h-4 mr-2" />
                      Lulus Semua ({{ pendingApprovalCount }})
                    </rs-button>
                  </div>
                </div>
                
                <rs-table
                  :key="`table-${tableKey}-approved-pending`"
                  :data="getTableDataByStatus(['Menunggu Kelulusan'])"
                  :pageSize="10"
                  :showNoColumn="false"
                  :columns="tableColumns"
                  :options="{
                    variant: 'default',
                    hover: true,
                  }"
                >
                  <template v-slot:status="data">
                    <rs-badge :variant="getStatusVariant(data.text)">
                      {{ data.text }}
                    </rs-badge>
                  </template>

                  <template v-slot:tarikhKuatkuasa="data">
                    <span v-if="data.text" class="text-sm text-gray-900">{{ data.text }}</span>
                    <span v-else class="text-sm text-gray-500 italic">Akan ditetapkan selepas kelulusan</span>
                  </template>

                  <template v-slot:tindakan="data">
                    <div class="flex space-x-3">
                      <button
                        @click="viewPosition(data.text)"
                        title="Lihat"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                      </button>
                      <button
                        @click="navigateToVerification(data.text, 'approve')"
                        title="Luluskan"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:baseline-check-circle" class="w-5 h-5 text-success" />
                      </button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Sedang Proses - Ditolak">
              <div class="p-4">
                <rs-table
                  :key="`table-${tableKey}-rejected`"
                  :data="getTableDataByStatus(['Ditolak Ketua Jabatan'])"
                  :pageSize="10"
                  :showNoColumn="false"
                  :columns="tableColumns"
                  :options="{
                    variant: 'default',
                    hover: true,
                  }"
                >
                  <template v-slot:status="data">
                    <rs-badge variant="warning">
                      {{ data.text }}
                    </rs-badge>
                  </template>

                  <template v-slot:tarikhKuatkuasa="data">
                    <span v-if="data.text" class="text-sm text-gray-900">{{ data.text }}</span>
                    <span v-else class="text-sm text-gray-500 italic">Akan ditetapkan selepas kelulusan</span>
                  </template>

                  <template v-slot:tindakan="data">
                    <div class="flex space-x-3">
                      <button
                        @click="viewPosition(data.text)"
                        title="Lihat"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                      </button>
                      <button
                        @click="navigateToVerification(data.text, 'approve')"
                        title="Semak"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:baseline-warning" class="w-5 h-5 text-warning" />
                      </button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Tidak Aktif">
              <div class="p-4">
                <rs-table
                  :key="`table-${tableKey}-inactive`"
                  :data="getTableDataByStatus(['Tidak Aktif'])"
                  :pageSize="10"
                  :showNoColumn="false"
                  :columns="tableColumns"
                  :options="{
                    variant: 'default',
                    hover: true,
                  }"
                >
                  <template v-slot:status="data">
                    <rs-badge :variant="getStatusVariant(data.text)">
                      {{ data.text }}
                    </rs-badge>
                  </template>

                  <template v-slot:tarikhKuatkuasa="data">
                    <span v-if="data.text" class="text-sm text-gray-900">{{ data.text }}</span>
                    <span v-else class="text-sm text-gray-500 italic">Akan ditetapkan selepas kelulusan</span>
                  </template>

                  <template v-slot:tindakan="data">
                    <div class="flex space-x-3">
                      <button
                        @click="viewPosition(data.text)"
                        title="Lihat"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                      </button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>
          </rs-tab>
        </div>
      </template>
    </rs-card>
    
    <!-- Bulk Approval Modal -->
    <div v-if="showBulkApprovalModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <Icon name="ic:baseline-check-circle" class="w-6 h-6 mr-3 text-success" />
            Lulus Semua Jawatan Yang Telah Disahkan
          </h3>
          <button
            @click="closeBulkApprovalModal"
            class="text-gray-400 hover:text-gray-600"
          >
            <Icon name="ic:baseline-close" class="w-6 h-6" />
          </button>
        </div>
        
        <div class="mb-4">
          <p class="text-gray-600 mb-2">
            Anda akan meluluskan <strong>{{ selectedItems.length }} jawatan</strong> yang telah disahkan oleh Ketua Jabatan.
          </p>
          
          <!-- Selected Items Table -->
          <div class="border rounded-lg overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rujukan</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Jawatan</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in selectedItems" :key="item.tindakan" class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm text-gray-900">{{ item.rujukan }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ item.kategoriPenolongAmil }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ item.namaJawatan }}</td>
                  <td class="px-4 py-3">
                    <rs-badge variant="info" size="sm">{{ item.status }}</rs-badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Approval Notes -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Ulasan Kelulusan <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="bulkApprovalNotes"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Masukkan ulasan untuk kelulusan ini..."
          ></textarea>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex justify-end space-x-3">
          <rs-button
            variant="secondary-outline"
            @click="closeBulkApprovalModal"
          >
            Batal
          </rs-button>
          <rs-button
            variant="success"
            @click="performBulkApproval"
            :loading="false"
          >
            <Icon name="ic:baseline-check" class="w-4 h-4 mr-2" />
            Luluskan Semua ({{ selectedItems.length }})
          </rs-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, computed, watch, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { formatDate } from "~/utils/dateFormatter";

const toast = useToast();

definePageMeta({
  title: "Senarai Jawatan Penolong Amil",
});

const breadcrumb = [
  { name: 'Laman Utama', path: '/' },
  { name: 'Modul BF-PA', path: '/BF-PA' },
  { name: 'Konfigurasi', path: '/BF-PA/KF' },
  { name: 'Maklumat Jawatan', path: null }
];

// Role Simulator State
const currentRole = ref("eksekutif"); // Default role

// Page-specific role options for KF/KJ module
const roleOptions = [
  { label: "Eksekutif", value: "eksekutif" },
  { label: "Ketua Jabatan", value: "ketua-jabatan" },
  { label: "Ketua Divisyen", value: "ketua-divisyen" },
];

// Role data for KF/KJ module
const roleData = {
  eksekutif: {
    name: "Eksekutif",
    description: "Kemaskini Jawatan Penolong Amil",
    capabilities: ["Lihat Senarai", "Kemaskini Jawatan", "Edit Penuh"],
  },
  "ketua-jabatan": {
    name: "Ketua Jabatan",
    description: "Pengesahan Jawatan Penolong Amil",
    capabilities: ["Lihat Senarai", "Sahkan Jawatan", "Monitor Progress"],
  },
  "ketua-divisyen": {
    name: "Ketua Divisyen",
    description: "Kelulusan Akhir Jawatan Penolong Amil",
    capabilities: ["Lihat Senarai", "Sahkan/Tolak Jawatan", "Kelulusan Akhir"],
  },
};

// Role simulator helper functions
const getRoleVariant = (role) => {
  const variants = {
    eksekutif: "success",
    "ketua-jabatan": "warning",
    "ketua-divisyen": "danger",
  };
  return variants[role] || "default";
};

const getRoleLabel = (role) => {
  return roleData[role]?.name || role;
};



const handleRoleChange = () => {
  // Role changed
  
  // Show role change notification
  const roleLabel = getRoleLabel(currentRole.value);
  toast.info(`Peranan berubah kepada: ${roleLabel}`);
  
  // Refresh table to show role-specific data
  refreshTable();
};



// Filters
const filters = ref({
  searchQuery: "",
});





// Table data and reactivity control
const tableKey = ref(0);
const positionsList = ref([
  {
    rujukan: "KJ-2024-001",
    kategoriPenolongAmil: "Penolong Amil Fitrah",
    namaJawatan: "Ketua Penolong Amil",
    kodSingkatan: "KPA",
    status: "Aktif",
    tarikhKuatkuasa: "01-01-2024",
    tindakan: 1
  },
  {
    rujukan: "KJ-2024-002",
    kategoriPenolongAmil: "Penolong Amil Fitrah",
    namaJawatan: "Penolong Ketua Amil",
    kodSingkatan: "PKA",
    status: "Aktif",
    tarikhKuatkuasa: "01-01-2024",
    tindakan: 2
  },
  {
    rujukan: "KJ-2024-003",
    kategoriPenolongAmil: "Penolong Amil Padi",
    namaJawatan: "Ketua Penolong Amil Padi",
    kodSingkatan: "KPAP",
    status: "Aktif",
    tarikhKuatkuasa: "01-01-2024",
    tindakan: 3
  },
  {
    rujukan: "KJ-2024-004",
    kategoriPenolongAmil: "Penolong Amil Padi",
    namaJawatan: "Penolong Amil Eksekutif",
    kodSingkatan: "PAE",
    status: "Aktif",
    tarikhKuatkuasa: "01-01-2024",
    tindakan: 4
  },
  {
    rujukan: "KJ-2024-005",
    kategoriPenolongAmil: "Penolong Amil Kariah",
    namaJawatan: "Ketua Penolong Amil Kariah",
    kodSingkatan: "KPAK",
    status: "Menunggu Pengesahan",
    tarikhKuatkuasa: "", // Empty - not yet approved
    tindakan: 5
  },
  {
    rujukan: "KJ-2024-006",
    kategoriPenolongAmil: "Penolong Amil Komuniti",
    namaJawatan: "Penolong Amil Koordinator",
    kodSingkatan: "PAC",
    status: "Menunggu Kelulusan",
    tarikhKuatkuasa: "", // Empty - not yet approved
    tindakan: 6
  },
  {
    rujukan: "KJ-2024-007",
    kategoriPenolongAmil: "Penolong Amil Komuniti",
    namaJawatan: "Penolong Amil Pembantu",
    kodSingkatan: "PAP",
    status: "Tidak Aktif",
    tarikhKuatkuasa: "01-01-2023",
    tindakan: 7
  },
  {
    rujukan: "KJ-2024-008",
    kategoriPenolongAmil: "Penolong Amil Kariah",
    namaJawatan: "Penolong Amil Pentadbir",
    kodSingkatan: "PAPT",
    status: "Tidak Aktif",
    tarikhKuatkuasa: "01-01-2023",
    tindakan: 8
  },
  // Additional items for "Sedang Proses - Lulus" to showcase bulk approval
  {
    rujukan: "KJ-2024-009",
    kategoriPenolongAmil: "Penolong Amil Fitrah",
    namaJawatan: "Penolong Amil Khas",
    kodSingkatan: "PAK",
    status: "Menunggu Kelulusan",
    tarikhKuatkuasa: "", // Empty - not yet approved
    tindakan: 9
  },
  {
    rujukan: "KJ-2024-010",
    kategoriPenolongAmil: "Penolong Amil Padi",
    namaJawatan: "Penolong Amil Senior",
    kodSingkatan: "PAS",
    status: "Menunggu Kelulusan",
    tarikhKuatkuasa: "", // Empty - not yet approved
    tindakan: 10
  },
  {
    rujukan: "KJ-2024-011",
    kategoriPenolongAmil: "Penolong Amil Kariah",
    namaJawatan: "Penolong Amil Junior",
    kodSingkatan: "PAJ",
    status: "Menunggu Kelulusan",
    tarikhKuatkuasa: "", // Empty - not yet approved
    tindakan: 11
  },
  {
    rujukan: "KJ-2024-012",
    kategoriPenolongAmil: "Penolong Amil Komuniti",
    namaJawatan: "Penolong Amil Trainee",
    kodSingkatan: "PAT",
    status: "Menunggu Kelulusan",
    tarikhKuatkuasa: "", // Empty - not yet approved
    tindakan: 12
  },
  {
    rujukan: "KJ-2024-013",
    kategoriPenolongAmil: "Penolong Amil Fitrah",
    namaJawatan: "Penolong Amil Supervisor",
    kodSingkatan: "PASV",
    status: "Ditolak Ketua Jabatan",
    tarikhKuatkuasa: "", // Empty - rejected
    tindakan: 13
  }
]);

// Table columns
const tableColumns = [
  {
    key: 'rujukan',
    name: 'Rujukan',
    sortable: true,
  },
  {
    key: 'kategoriPenolongAmil',
    name: 'Kategori',
    sortable: true,
  },
  {
    key: 'namaJawatan',
    name: 'Nama Jawatan',
    sortable: true,
  },
  {
    key: 'kodSingkatan',
    name: 'Kod Singkatan',
    sortable: true,
  },
  {
    key: 'tarikhKuatkuasa',
    name: 'Tarikh Kuatkuasa',
    sortable: true,
  },
  {
    key: 'status',
    name: 'Status',
    sortable: true,
  },
  {
    key: 'tindakan',
    name: 'Tindakan',
    sortable: false,
  },
];

// Tab management
const activeTab = ref("Aktif");

// Watch for role changes and adjust active tab
watch(currentRole, (newRole) => {
  const bestTab = getBestAvailableTabForRole.value;
  if (bestTab && isTabValidForRole(bestTab, newRole)) {
    activeTab.value = bestTab;
  } else {
    // Find first valid tab for the new role
    const validTabs = getValidTabsForRole(newRole);
    if (validTabs.length > 0) {
      activeTab.value = validTabs[0];
    }
  }
});

// Get the best available tab for the current role
const getBestAvailableTabForRole = computed(() => {
  const role = currentRole.value;
  
  if (role === 'ketua-jabatan') {
    // Ketua Jabatan can see: "Menunggu Pengesahan", "Aktif", "Tidak Aktif"
    // Priority: Aktif > Menunggu Pengesahan > Tidak Aktif
    if (getTableDataByStatus(['Aktif']).length > 0) {
      return "Aktif";
    } else if (getTableDataByStatus(['Menunggu Pengesahan']).length > 0) {
      return "Menunggu Pengesahan";
    } else {
      return "Tidak Aktif";
    }
  } else if (role === 'ketua-divisyen') {
    // Ketua Divisyen can see: "Sedang Proses - Lulus", "Aktif", "Sedang Proses - Ditolak", "Tidak Aktif"
    // Priority: Aktif > Sedang Proses - Lulus > Sedang Proses - Ditolak > Tidak Aktif
    if (getTableDataByStatus(['Aktif']).length > 0) {
      return "Aktif";
    } else if (getTableDataByStatus(['Menunggu Kelulusan']).length > 0) {
      return "Sedang Proses - Lulus";
    } else if (getTableDataByStatus(['Ditolak Ketua Jabatan']).length > 0) {
      return "Sedang Proses - Ditolak";
    } else {
      return "Tidak Aktif";
    }
  } else {
    // Eksekutif can see: "Aktif", "Sedang Proses", "Tidak Aktif"
    // Priority: Aktif > Sedang Proses > Tidak Aktif
    if (getTableDataByStatus(['Aktif']).length > 0) {
      return "Aktif";
    } else if (getTableDataByStatus(['Menunggu Pengesahan', 'Menunggu Kelulusan']).length > 0) {
      return "Sedang Proses";
    } else {
      return "Tidak Aktif";
    }
  }
});

// Check if a tab is valid for a specific role
const isTabValidForRole = (tab, role) => {
  switch (tab) {
    case "Sedang Proses":
      return role === 'eksekutif';
    case "Menunggu Pengesahan":
      return role === 'ketua-jabatan';
    case "Sedang Proses - Lulus":
      return role === 'ketua-divisyen';
    case "Sedang Proses - Ditolak":
      return role === 'ketua-divisyen';
    case "Aktif":
      return true; // All roles can see active items
    case "Tidak Aktif":
      return true; // All roles can see inactive items
    default:
      return false;
  }
};

// Get valid tabs for a specific role
const getValidTabsForRole = (role) => {
  if (role === 'eksekutif') {
    return ["Aktif", "Sedang Proses", "Tidak Aktif"];
  } else if (role === 'ketua-jabatan') {
    return ["Aktif", "Menunggu Pengesahan", "Tidak Aktif"];
  } else if (role === 'ketua-divisyen') {
    return ["Aktif", "Sedang Proses - Lulus", "Sedang Proses - Ditolak", "Tidak Aktif"];
  }
  return [];
};

// Filter table data based on status
const getTableDataByStatus = (statuses) => {
  let result = positionsList.value.filter(position => 
    statuses.includes(position.status)
  );
  
  // Apply search filter
  if (filters.value.searchQuery) {
    const query = filters.value.searchQuery.toLowerCase();
    result = result.filter(position => 
      position.rujukan.toLowerCase().includes(query) ||
      position.kategoriPenolongAmil.toLowerCase().includes(query) ||
      position.namaJawatan.toLowerCase().includes(query) ||
      position.kodSingkatan.toLowerCase().includes(query)
    );
  }
  

  
  // Apply kategori filter
  
  
  return result;
};

// Role-based access control
const canEditPosition = (positionId) => {
  return currentRole.value === "eksekutif"; // Only Eksekutif can edit
};

const canVerifyPosition = (positionId) => {
  return currentRole.value === "ketua-jabatan";
};

const canApprovePosition = (positionId) => {
  return currentRole.value === "ketua-divisyen";
};

// Methods
const viewPosition = (positionId) => {
  navigateTo(`/BF-PA/KF/KJ/detail/${positionId}`);
};

const editPosition = (positionId) => {
  navigateTo(`/BF-PA/KF/KJ/edit/${positionId}`);
};



const verifyPosition = (positionId) => {
  navigateTo(`/BF-PA/KF/KJ/verify/${positionId}`);
};

const approvePosition = (positionId) => {
  navigateTo(`/BF-PA/KF/KJ/approve/${positionId}`);
};

const navigateToVerification = (positionId, action) => {
  if (action === 'verify') {
    navigateTo(`/BF-PA/KF/KJ/verify/${positionId}`);
  } else if (action === 'approve') {
    navigateTo(`/BF-PA/KF/KJ/approve/${positionId}`);
  }
};

const refreshTable = () => {
  nextTick(() => {
    tableKey.value++; // Force table to re-render
  });
};

// Helper function to determine badge variant based on status
const getStatusVariant = (status) => {
  const variants = {
    'Aktif': 'success',
    'Tidak Aktif': 'danger',
    'Menunggu Pengesahan': 'warning',
    'Menunggu Kelulusan': 'info',
    'Ditolak Ketua Jabatan': 'danger',
  };
  return variants[status] || 'disabled';
};

// Helper function to format tarikhKuatkuasa display
const formatTarikhKuatkuasa = (date) => {
  if (!date || date === '') {
    return 'Belum ditetapkan';
  }
  return formatDate(date);
};

const getRoleSpecificDescription = () => {
  const roleData = {
    eksekutif: "Kemaskini Jawatan Penolong Amil - Edit dalam Kategori",
    "ketua-jabatan": "Pengesahan Jawatan Penolong Amil - Sahkan Jawatan",
    "ketua-divisyen": "Kelulusan Akhir Jawatan Penolong Amil - Sahkan/Tolak dalam Borang",
  };
  return roleData[currentRole.value] || "Tidak Diketahui";
};

// Initialize with best available tab
onMounted(() => {
  const bestTab = getBestAvailableTabForRole.value;
  if (bestTab) {
    activeTab.value = bestTab;
  }
});

// Search functionality
const performSearch = () => {
  if (!filters.value.searchQuery) {
    toast.warning('Sila masukkan kriteria carian');
    return;
  }
  
  toast.success('Carian berjaya dilakukan');
  refreshTable();
};



// Bulk approval functionality
const showBulkApprovalModal = ref(false);
const selectedItems = ref([]);
const bulkApprovalNotes = ref("");

const hasPendingApprovals = computed(() => {
  return positionsList.value.filter(position => 
    position.status === 'Menunggu Kelulusan'
  ).length > 0;
});

const pendingApprovalCount = computed(() => {
  return positionsList.value.filter(position => 
    position.status === 'Menunggu Kelulusan'
  ).length;
});

const openBulkApprovalModal = () => {
  selectedItems.value = positionsList.value.filter(position => 
    position.status === 'Menunggu Kelulusan'
  );
  showBulkApprovalModal.value = true;
};

const closeBulkApprovalModal = () => {
  showBulkApprovalModal.value = false;
  selectedItems.value = [];
  bulkApprovalNotes.value = "";
};

const performBulkApproval = async () => {
  if (!bulkApprovalNotes.value.trim()) {
    toast.warning('Sila masukkan ulasan kelulusan');
    return;
  }
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Get current date in DD-MM-YYYY format
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    
    // Update all selected items
    selectedItems.value.forEach(position => {
      position.status = 'Aktif';
      position.tarikhKuatkuasa = formattedDate;
    });
    
    toast.success(`${selectedItems.value.length} jawatan berjaya diluluskan`);
    closeBulkApprovalModal();
    refreshTable();
  } catch (error) {
    toast.error('Ralat semasa meluluskan jawatan');
  }
};
</script> 
