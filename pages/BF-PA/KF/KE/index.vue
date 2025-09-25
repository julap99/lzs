<!-- 
  RTMF SCREEN: PA-KF-KE-01_01 (Allowance List)
  PURPOSE: Senarai elaun penolong amil dengan workflow kelulusan
  DESCRIPTION: Allowance list (tanpa lajur Jenis Elaun & Amaun). Kategori: PAK, PAK+, PAP, PAF
  ROUTE: /BF-PA/KF/KE
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
          <option v-for="option in roleOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>

    <rs-card class="mt-2">
      <template #header>
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl font-semibold">Senarai Elaun Penolong Amil</h2>
            <p class="text-xs text-gray-500 mt-1">
              Paparan lajur: Rujukan, Kategori (PAK, PAK+, PAP, PAF), Kod Bajet, Status, Tarikh Dipaparkan, Tindakan
            </p>
          </div>
        </div>
      </template>

      <template #body>
        <!-- Smart Filter Section -->
        <div class="mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              v-model="filters.searchQuery"
              type="text"
              placeholder="Cari rujukan, kategori, atau kod bajet..."
              :classes="{ input: '!py-2' }"
            />
            <rs-button variant="primary" @click="performSearch" class="!py-2 !px-4">
              <Icon name="ic:baseline-search" class="w-4 h-4 mr-2" />
              Cari
            </rs-button>
          </div>
        </div>

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
                  :options="{ variant: 'default', hover: true }"
                >
                  <template #status="data">
                    <rs-badge :variant="getStatusVariant(data.text)">{{ data.text }}</rs-badge>
                  </template>
                  <template #tarikhPaparan="data">
                    <span v-if="data.text" class="text-sm text-gray-900">{{ data.text }}</span>
                    <span v-else class="text-sm text-gray-500 italic">Akan ditetapkan selepas kelulusan</span>
                  </template>
                  <template #tindakan="data">
                    <div class="flex space-x-3">
                      <button
                        @click="viewAllowance(data.text)"
                        title="Lihat"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                      </button>
                      <button
                        v-if="canEditAllowance(data.text)"
                        @click="editAllowance(data.text)"
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
                  :options="{ variant: 'default', hover: true }"
                >
                  <template #status="data">
                    <rs-badge :variant="getStatusVariant(data.text)">{{ data.text }}</rs-badge>
                  </template>
                  <template #tarikhPaparan="data">
                    <span v-if="data.text" class="text-sm text-gray-900">{{ data.text }}</span>
                    <span v-else class="text-sm text-gray-500 italic">Akan ditetapkan selepas kelulusan</span>
                  </template>
                  <template #tindakan="data">
                    <div class="flex space-x-3">
                      <button
                        @click="viewAllowance(data.text)"
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
                  :options="{ variant: 'default', hover: true }"
                >
                  <template #status="data">
                    <rs-badge :variant="getStatusVariant(data.text)">{{ data.text }}</rs-badge>
                  </template>
                  <template #tarikhPaparan="data">
                    <span v-if="data.text" class="text-sm text-gray-900">{{ data.text }}</span>
                    <span v-else class="text-sm text-gray-500 italic">Akan ditetapkan selepas kelulusan</span>
                  </template>
                  <template #tindakan="data">
                    <div class="flex space-x-3">
                      <button
                        @click="viewAllowance(data.text)"
                        title="Lihat"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                      </button>
                      <button
                        v-if="canEditAllowance(data.text)"
                        @click="editAllowance(data.text)"
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
                  :key="`table-${tableKey}-active-kj`"
                  :data="getTableDataByStatus(['Aktif'])"
                  :pageSize="10"
                  :showNoColumn="false"
                  :columns="tableColumns"
                  :options="{ variant: 'default', hover: true }"
                >
                  <template #status="data">
                    <rs-badge :variant="getStatusVariant(data.text)">{{ data.text }}</rs-badge>
                  </template>
                  <template #tarikhPaparan="data">
                    <span v-if="data.text" class="text-sm text-gray-900">{{ data.text }}</span>
                    <span v-else class="text-sm text-gray-500 italic">Akan ditetapkan selepas kelulusan</span>
                  </template>
                  <template #tindakan="data">
                    <div class="flex space-x-3">
                      <button
                        @click="viewAllowance(data.text)"
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
                  :key="`table-${tableKey}-pending-kj`"
                  :data="getTableDataByStatus(['Menunggu Pengesahan'])"
                  :pageSize="10"
                  :showNoColumn="false"
                  :columns="tableColumns"
                  :options="{ variant: 'default', hover: true }"
                >
                  <template #status="data">
                    <rs-badge :variant="getStatusVariant(data.text)">{{ data.text }}</rs-badge>
                  </template>
                  <template #tarikhPaparan="data">
                    <span v-if="data.text" class="text-sm text-gray-900">{{ data.text }}</span>
                    <span v-else class="text-sm text-gray-500 italic">Akan ditetapkan selepas kelulusan</span>
                  </template>
                  <template #tindakan="data">
                    <div class="flex space-x-3">
                      <button
                        @click="viewAllowance(data.text)"
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
                        <Icon name="iconamoon:arrow-right-2" class="w-5 h-5 text-info" />
                      </button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Tidak Aktif">
              <div class="p-4">
                <rs-table
                  :key="`table-${tableKey}-inactive-kj`"
                  :data="getTableDataByStatus(['Tidak Aktif'])"
                  :pageSize="10"
                  :showNoColumn="false"
                  :columns="tableColumns"
                  :options="{ variant: 'default', hover: true }"
                >
                  <template #status="data">
                    <rs-badge :variant="getStatusVariant(data.text)">{{ data.text }}</rs-badge>
                  </template>
                  <template #tarikhPaparan="data">
                    <span v-if="data.text" class="text-sm text-gray-900">{{ data.text }}</span>
                    <span v-else class="text-sm text-gray-500 italic">Akan ditetapkan selepas kelulusan</span>
                  </template>
                  <template #tindakan="data">
                    <div class="flex space-x-3">
                      <button
                        @click="viewAllowance(data.text)"
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
                  :key="`table-${tableKey}-active-kd`"
                  :data="getTableDataByStatus(['Aktif'])"
                  :pageSize="10"
                  :showNoColumn="false"
                  :columns="tableColumns"
                  :options="{ variant: 'default', hover: true }"
                >
                  <template #status="data">
                    <rs-badge :variant="getStatusVariant(data.text)">{{ data.text }}</rs-badge>
                  </template>
                  <template #tarikhPaparan="data">
                    <span v-if="data.text" class="text-sm text-gray-900">{{ data.text }}</span>
                    <span v-else class="text-sm text-gray-500 italic">Akan ditetapkan selepas kelulusan</span>
                  </template>
                  <template #tindakan="data">
                    <div class="flex space-x-3">
                      <button
                        @click="viewAllowance(data.text)"
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
                  <div v-if="hasPendingApprovals" class="flex space-x-3">
                    <rs-button variant="success" @click="openBulkApprovalModal" class="flex items-center">
                      <Icon name="ic:baseline-check-circle" class="w-4 h-4 mr-2" />
                      Lulus Semua ({{ pendingApprovalCount }})
                    </rs-button>
                  </div>
                </div>

                <rs-table
                  :key="`table-${tableKey}-approved-pending-kd`"
                  :data="getTableDataByStatus(['Menunggu Kelulusan'])"
                  :pageSize="10"
                  :showNoColumn="false"
                  :columns="tableColumns"
                  :options="{ variant: 'default', hover: true }"
                >
                  <template #status="data">
                    <rs-badge :variant="getStatusVariant(data.text)">{{ data.text }}</rs-badge>
                  </template>
                  <template #tarikhPaparan="data">
                    <span v-if="data.text" class="text-sm text-gray-900">{{ data.text }}</span>
                    <span v-else class="text-sm text-gray-500 italic">Akan ditetapkan selepas kelulusan</span>
                  </template>
                  <template #tindakan="data">
                    <div class="flex space-x-3">
                      <button
                        @click="viewAllowance(data.text)"
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
                        <Icon name="iconamoon:arrow-right-2" class="w-5 h-5 text-info" />
                      </button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Sedang Proses - Ditolak">
              <div class="p-4">
                <rs-table
                  :key="`table-${tableKey}-rejected-kd`"
                  :data="getTableDataByStatus(['Ditolak Ketua Jabatan'])"
                  :pageSize="10"
                  :showNoColumn="false"
                  :columns="tableColumns"
                  :options="{ variant: 'default', hover: true }"
                >
                  <template #status="data">
                    <rs-badge variant="warning">{{ data.text }}</rs-badge>
                  </template>
                  <template #tarikhPaparan="data">
                    <span v-if="data.text" class="text-sm text-gray-900">{{ data.text }}</span>
                    <span v-else class="text-sm text-gray-500 italic">Akan ditetapkan selepas kelulusan</span>
                  </template>
                  <template #tindakan="data">
                    <div class="flex space-x-3">
                      <button
                        @click="viewAllowance(data.text)"
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
                        <Icon name="iconamoon:arrow-right-2" class="w-5 h-5 text-info" />
                      </button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Tidak Aktif">
              <div class="p-4">
                <rs-table
                  :key="`table-${tableKey}-inactive-kd`"
                  :data="getTableDataByStatus(['Tidak Aktif'])"
                  :pageSize="10"
                  :showNoColumn="false"
                  :columns="tableColumns"
                  :options="{ variant: 'default', hover: true }"
                >
                  <template #status="data">
                    <rs-badge :variant="getStatusVariant(data.text)">{{ data.text }}</rs-badge>
                  </template>
                  <template #tarikhPaparan="data">
                    <span v-if="data.text" class="text-sm text-gray-900">{{ data.text }}</span>
                    <span v-else class="text-sm text-gray-500 italic">Akan ditetapkan selepas kelulusan</span>
                  </template>
                  <template #tindakan="data">
                    <div class="flex space-x-3">
                      <button
                        @click="viewAllowance(data.text)"
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
            Lulus Semua Elaun Yang Telah Disahkan
          </h3>
          <button @click="closeBulkApprovalModal" class="text-gray-400 hover:text-gray-600">
            <Icon name="ic:baseline-close" class="w-6 h-6" />
          </button>
        </div>

        <div class="mb-4">
          <p class="text-gray-600 mb-2">
            Anda akan meluluskan <strong>{{ selectedItems.length }} elaun</strong> yang telah disahkan oleh Ketua Jabatan.
          </p>

          <!-- Selected Items Table (tanpa Jenis Elaun & Amaun) -->
          <div class="border rounded-lg overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3"></th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rujukan</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in selectedItems" :key="item.tindakan" class="hover:bg-gray-50">
                  <td class="px-4 py-3">
                    <input type="checkbox" v-model="selectedMap[item.tindakan]" class="w-4 h-4" />
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ item.rujukan }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ item.kategoriPenolongAmil }}</td>
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
          <rs-button variant="secondary-outline" @click="closeBulkApprovalModal">Batal</rs-button>
          <rs-button variant="success" @click="performBulkApproval">
            <Icon name="ic:baseline-check" class="w-4 h-4 mr-2" />
            Luluskan Terpilih ({{ selectedCount }})
          </rs-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, computed, watch, onMounted } from "vue";
import { useToast } from "vue-toastification";

const toast = useToast();

definePageMeta({
  title: "Senarai Elaun Penolong Amil",
});

const breadcrumb = [
  { name: "Laman Utama", path: "/" },
  { name: "Modul BF-PA", path: "/BF-PA" },
  { name: "Konfigurasi", path: "/BF-PA/KF" },
  { name: "Maklumat Elaun", path: null },
];

// Role Simulator State
const currentRole = ref("eksekutif");

// Page-specific role options
const roleOptions = [
  { label: "Eksekutif", value: "eksekutif" },
  { label: "Ketua Jabatan", value: "ketua-jabatan" },
  { label: "Ketua Divisyen", value: "ketua-divisyen" },
];

// (Helpers – if you need label/variants elsewhere)
const roleData = {
  eksekutif: { name: "Eksekutif" },
  "ketua-jabatan": { name: "Ketua Jabatan" },
  "ketua-divisyen": { name: "Ketua Divisyen" },
};
const getRoleLabel = (role) => roleData[role]?.name || role;

const handleRoleChange = () => {
  toast.info(`Peranan berubah kepada: ${getRoleLabel(currentRole.value)}`);
  refreshTable();
};

// Filters & search state
const filters = ref({ searchQuery: "" });
const isSearchPerformed = ref(false);

// Bulk approval state
const showBulkApprovalModal = ref(false);
const selectedItems = ref([]);
const bulkApprovalNotes = ref("");
const selectedMap = ref({});
const selectedCount = computed(() => selectedItems.value.filter((i) => selectedMap.value[i.tindakan]).length);

// Table data
const tableKey = ref(0);
const allowancesList = ref([
  // PAK
  {
    rujukan: "KE-2024-001",
    kategoriPenolongAmil: "PAK",
    status: "Aktif",
    tarikhPaparan: "01-01-2024",
    tindakan: 1,
  },

  // PAK+
  {
    rujukan: "KE-2024-003",
    kategoriPenolongAmil: "PAK+",
    status: "Aktif",
    tarikhPaparan: "01-01-2024",
    tindakan: 2,
  },
  {
    rujukan: "KE-2024-004",
    kategoriPenolongAmil: "PAF",
    status: "Aktif",
    tarikhPaparan: "01-03-2024",
    tindakan: 3,
  },

  // PAP
  {
    rujukan: "KE-2024-005",
    kategoriPenolongAmil: "PAP",
    status: "Aktif",
    tarikhPaparan: "01-03-2024",
    tindakan: 4,
  }
]);

// Table columns (tanpa Jenis Elaun & Amaun)
const tableColumns = [
  { key: "rujukan", name: "Rujukan", sortable: true },
  { key: "kategoriPenolongAmil", name: "Kategori", sortable: true },
  { key: "status", name: "Status", sortable: true },
  { key: "tarikhPaparan", name: "Tarikh Dipaparkan", sortable: true },
  { key: "tindakan", name: "Tindakan", sortable: false },
];

// Tabs
const activeTab = ref("Aktif");

watch(currentRole, (newRole) => {
  const bestTab = getBestAvailableTabForRole.value;
  if (bestTab && isTabValidForRole(bestTab, newRole)) {
    activeTab.value = bestTab;
  } else {
    const validTabs = getValidTabsForRole(newRole);
    if (validTabs.length > 0) activeTab.value = validTabs[0];
  }
});

const getBestAvailableTabForRole = computed(() => {
  const role = currentRole.value;
  if (role === "ketua-jabatan") {
    if (getTableDataByStatus(["Aktif"]).length > 0) return "Aktif";
    if (getTableDataByStatus(["Menunggu Pengesahan"]).length > 0) return "Menunggu Pengesahan";
    return "Tidak Aktif";
  } else if (role === "ketua-divisyen") {
    if (getTableDataByStatus(["Aktif"]).length > 0) return "Aktif";
    if (getTableDataByStatus(["Menunggu Kelulusan"]).length > 0) return "Menunggu Kelulusan";
    return "Tidak Aktif";
  } else {
    if (getTableDataByStatus(["Aktif"]).length > 0) return "Aktif";
    if (getTableDataByStatus(["Menunggu Pengesahan", "Menunggu Kelulusan"]).length > 0) return "Sedang Proses";
    return "Tidak Aktif";
  }
});

const isTabValidForRole = (tab, role) => {
  switch (tab) {
    case "Sedang Proses":
      return role === "eksekutif";
    case "Menunggu Pengesahan":
      return role === "ketua-jabatan";
    case "Menunggu Kelulusan":
      return role === "ketua-divisyen";
    case "Aktif":
    case "Tidak Aktif":
      return true;
    default:
      return false;
  }
};

const getValidTabsForRole = (role) => {
  const allTabs = ["Sedang Proses", "Menunggu Pengesahan", "Menunggu Kelulusan", "Aktif", "Tidak Aktif"];
  return allTabs.filter((tab) => isTabValidForRole(tab, role));
};

// Data filter (carian berdasarkan rujukan / kategori / kod bajet sahaja)
const getTableDataByStatus = (statuses) => {
  let result = allowancesList.value.filter((a) => statuses.includes(a.status));
  if (isSearchPerformed.value && filters.value.searchQuery) {
    const q = filters.value.searchQuery.toLowerCase();
    result = result.filter(
      (a) =>
        a.rujukan.toLowerCase().includes(q) ||
        a.kategoriPenolongAmil.toLowerCase().includes(q)
    );
  }
  return result;
};

// Access control
const canEditAllowance = () => currentRole.value === "eksekutif";
const canVerifyAllowance = () => currentRole.value === "ketua-jabatan";
const canApproveAllowance = () => currentRole.value === "ketua-divisyen";

// Methods
const viewAllowance = (allowanceId) => navigateTo(`/BF-PA/KF/KE/detail/${allowanceId}`);
const editAllowance = (allowanceId) => navigateTo(`/BF-PA/KF/KE/edit/${allowanceId}`);

const verifyAllowance = (allowanceId) => {
  const allowance = allowancesList.value.find((a) => a.tindakan === allowanceId);
  if (allowance) {
    allowance.status = "Menunggu Kelulusan";
    refreshTable();
    toast.success("Elaun penolong amil berjaya disahkan oleh Ketua Jabatan");
  }
};

const approveAllowance = (allowanceId) => {
  const allowance = allowancesList.value.find((a) => a.tindakan === allowanceId);
  if (allowance) {
    allowance.status = "Aktif";
    refreshTable();
    toast.success("Elaun penolong amil berjaya diluluskan oleh Ketua Divisyen");
  }
};

const navigateToVerification = (allowanceId, action) => {
  if (action === "verify") navigateTo(`/BF-PA/KF/KE/verify/${allowanceId}`);
  else if (action === "approve") navigateTo(`/BF-PA/KF/KE/approve/${allowanceId}`);
};

const refreshTable = () => {
  nextTick(() => (tableKey.value += 1));
};

const getStatusVariant = (status) => {
  const variants = {
    Aktif: "success",
    "Tidak Aktif": "danger",
    "Menunggu Pengesahan": "warning",
    "Menunggu Kelulusan": "info",
    "Ditolak Ketua Jabatan": "warning",
  };
  return variants[status] || "disabled";
};

// Initialize with best tab
onMounted(() => {
  const bestTab = getBestAvailableTabForRole.value;
  if (bestTab) activeTab.value = bestTab;
});

// Search
const performSearch = () => {
  if (!filters.value.searchQuery) {
    toast.warning("Sila masukkan kriteria carian");
    return;
  }
  isSearchPerformed.value = true;
  toast.success("Carian berjaya dilakukan");
  refreshTable();
};

// Bulk approval
const hasPendingApprovals = computed(
  () => allowancesList.value.filter((a) => a.status === "Menunggu Kelulusan").length > 0
);
const pendingApprovalCount = computed(
  () => allowancesList.value.filter((a) => a.status === "Menunggu Kelulusan").length
);

const openBulkApprovalModal = () => {
  selectedItems.value = allowancesList.value.filter((a) => a.status === "Menunggu Kelulusan");
  selectedMap.value = {};
  selectedItems.value.forEach((item) => (selectedMap.value[item.tindakan] = true));
  showBulkApprovalModal.value = true;
};

const closeBulkApprovalModal = () => {
  showBulkApprovalModal.value = false;
  selectedItems.value = [];
  bulkApprovalNotes.value = "";
};

const performBulkApproval = async () => {
  if (!bulkApprovalNotes.value.trim()) {
    toast.warning("Sila masukkan ulasan kelulusan");
    return;
  }
  try {
    await new Promise((r) => setTimeout(r, 500));
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    const today = `${dd}-${mm}-${yyyy}`;

    const toApprove = selectedItems.value.filter((i) => selectedMap.value[i.tindakan]);
    if (toApprove.length === 0) {
      toast.warning("Sila pilih sekurang-kurangnya satu elaun");
      return;
    }
    toApprove.forEach((a) => {
      a.status = "Aktif";
      a.tarikhPaparan = today;
    });

    toast.success(`${toApprove.length} elaun berjaya diluluskan`);
    closeBulkApprovalModal();
    refreshTable();
  } catch (e) {
    toast.error("Ralat semasa meluluskan elaun");
  }
};
</script>
