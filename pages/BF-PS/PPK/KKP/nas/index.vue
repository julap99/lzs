<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Security Notice -->
    <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
      <div class="flex items-center gap-2">
        <Icon name="ic:baseline-security" class="text-green-600" />
        <div class="text-sm text-green-800">
          <p class="font-medium">Kawalan Kebenaran NAS</p>
          <p>Kebenaran untuk kumpulan NAS dihadkan kepada fungsi operasi dan tidak termasuk pentadbiran sistem.</p>
        </div>
      </div>
    </div>

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-4">
            <h2 class="text-xl font-semibold">Kebenaran Kumpulan Pengguna (NAS)</h2>
            <rs-badge variant="success" v-if="selectedRole">{{ filteredPermissions.length }} kebenaran</rs-badge>
          </div>
          <div class="flex gap-2">
            <rs-button
              variant="outline"
              @click="refreshPermissions"
            >
              <Icon name="ic:baseline-refresh" class="mr-1" />
              Muat Semula
            </rs-button>
            <rs-button
              variant="success"
              @click="bulkEditPermissions"
              :disabled="!selectedRole"
            >
              <Icon name="ic:baseline-edit" class="mr-1" />
              Edit Pukal
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>
        <!-- Role Selection -->
        <div class="mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="select"
              name="selectedRole"
              label="Pilih Kumpulan Peranan NAS"
              v-model="selectedRole"
              :options="roleOptions"
              validation="required"
              @change="loadRolePermissions"
            />
            <FormKit
              v-if="selectedRole"
              v-model="searchQuery"
              type="text"
              label="Cari Menu/Sub-menu"
              placeholder="Cari menu atau sub-menu..."
              :classes="{
                input: '!py-2',
              }"
            />
          </div>
        </div>

        <!-- Role Summary Section -->
        <div v-if="selectedRole" class="bg-green-50 p-4 rounded-lg mb-6">
          <h3 class="font-medium mb-3">Ringkasan Kebenaran NAS</h3>
          <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div class="bg-white p-3 rounded shadow">
              <div class="text-sm text-gray-500">Menu Utama</div>
              <div class="font-semibold">{{ summary.mainMenus }}</div>
            </div>
            <div class="bg-white p-3 rounded shadow">
              <div class="text-sm text-gray-500">Boleh Lihat</div>
              <div class="font-semibold text-blue-600">{{ summary.canView }}</div>
            </div>
            <div class="bg-white p-3 rounded shadow">
              <div class="text-sm text-gray-500">Boleh Cipta</div>
              <div class="font-semibold text-green-600">{{ summary.canCreate }}</div>
            </div>
            <div class="bg-white p-3 rounded shadow">
              <div class="text-sm text-gray-500">Boleh Kemaskini</div>
              <div class="font-semibold text-yellow-600">{{ summary.canUpdate }}</div>
            </div>
            <div class="bg-white p-3 rounded shadow">
              <div class="text-sm text-gray-500">Boleh Padam</div>
              <div class="font-semibold text-red-600">{{ summary.canDelete }}</div>
            </div>
          </div>
        </div>

        <!-- Permissions Table -->
        <rs-table
          v-if="selectedRole"
          :data="tableData"
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
          <template v-slot:papar="{ text, item }">
            <div class="flex justify-center">
              <input
                type="checkbox"
                v-model="item.papar"
                @change="updatePermission(item, 'papar', item.papar)"
                class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>
          </template>
          
          <template v-slot:cipta="{ text, item }">
            <div class="flex justify-center">
              <input
                type="checkbox"
                v-model="item.cipta"
                @change="updatePermission(item, 'cipta', item.cipta)"
                :disabled="!item.papar || item.readOnly"
                class="w-4 h-4 text-green-600 rounded focus:ring-green-500 disabled:opacity-50"
              />
            </div>
          </template>
          
          <template v-slot:kemaskini="{ text, item }">
            <div class="flex justify-center">
              <input
                type="checkbox"
                v-model="item.kemaskini"
                @change="updatePermission(item, 'kemaskini', item.kemaskini)"
                :disabled="!item.papar || item.readOnly"
                class="w-4 h-4 text-yellow-600 rounded focus:ring-yellow-500 disabled:opacity-50"
              />
            </div>
          </template>
          
          <template v-slot:padam="{ text, item }">
            <div class="flex justify-center">
              <input
                type="checkbox"
                v-model="item.padam"
                @change="updatePermission(item, 'padam', item.padam)"
                :disabled="!item.papar || item.restrictedDelete"
                class="w-4 h-4 text-red-600 rounded focus:ring-red-500 disabled:opacity-50"
              />
            </div>
          </template>

          <template v-slot:catatan="{ text, item }">
            <div class="text-xs text-gray-500">
              <span v-if="item.readOnly" class="text-orange-600">Terhad</span>
              <span v-else-if="item.restrictedDelete" class="text-red-600">Padam Terhad</span>
              <span v-else class="text-green-600">Penuh</span>
            </div>
          </template>

          <template v-slot:tindakan="{ text, item }">
            <div class="flex justify-center items-center gap-2">
              <rs-button
                variant="success"
                size="sm"
                @click="viewPermissionDetails(item)"
                title="Lihat Butiran"
              >
                <Icon name="ic:baseline-visibility" class="w-4 h-4" />
              </rs-button>
              <rs-button
                variant="info"
                size="sm"
                @click="viewPermissionHistory(item)"
                title="Lihat Sejarah"
              >
                <Icon name="ic:baseline-history" class="w-4 h-4" />
              </rs-button>
            </div>
          </template>
        </rs-table>

        <!-- Empty State -->
        <div v-else class="text-center py-12 text-gray-500">
          <Icon name="ic:baseline-group" size="48" class="mx-auto mb-4 text-gray-300" />
          <p class="text-lg font-medium mb-2">Pilih Kumpulan Peranan NAS</p>
          <p>Sila pilih kumpulan peranan NAS untuk melihat dan menguruskan kebenaran akses</p>
        </div>

        <!-- Action Buttons -->
        <div v-if="selectedRole && hasChanges" class="mt-6 flex justify-end gap-2">
          <rs-button 
            variant="outline" 
            @click="resetChanges"
          >
            Reset Perubahan
          </rs-button>
          <rs-button 
            variant="success" 
            @click="saveChanges" 
            :loading="isSaving"
          >
            Simpan Perubahan
          </rs-button>
        </div>
      </template>
    </rs-card>

    <!-- Bulk Edit Modal -->
    <rs-modal
      v-model="showBulkEditModal"
      title="Edit Kebenaran NAS Secara Pukal"
      size="lg"
      position="center"
    >
      <template #body>
        <div class="space-y-4">
          <div class="bg-green-50 p-4 rounded-lg">
            <p class="text-green-800 text-sm">
              <Icon name="ic:baseline-info" class="mr-1" />
              Edit kebenaran secara pukal untuk peranan NAS terpilih. Kebenaran pentadbiran tidak boleh diubah.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="select"
              name="bulkAction"
              label="Tindakan"
              v-model="bulkAction"
              :options="bulkActionOptions"
              validation="required"
            />
            <FormKit
              type="select"
              name="bulkPermissionType"
              label="Jenis Kebenaran"
              v-model="bulkPermissionType"
              :options="permissionTypeOptions"
              validation="required"
            />
          </div>

          <FormKit
            type="select"
            name="bulkMenuFilter"
            label="Filter Menu (Opsional)"
            v-model="bulkMenuFilter"
            :options="menuFilterOptions"
          />
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button 
            variant="primary-outline" 
            @click="showBulkEditModal = false"
          >
            Batal
          </rs-button>
          <rs-button 
            variant="success" 
            @click="applyBulkEdit"
            :loading="isBulkEditing"
          >
            Laksanakan
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Permission Details Modal -->
    <rs-modal
      v-model="showDetailsModal"
      title="Butiran Kebenaran"
      size="lg"
      position="center"
    >
      <template #body>
        <div v-if="selectedPermissionDetails">
          <div class="mb-4">
            <h3 class="font-semibold">{{ selectedPermissionDetails.menu }} - {{ selectedPermissionDetails.subMenu }}</h3>
            <p class="text-gray-600">{{ selectedPermissionDetails.description || 'Tiada deskripsi tersedia' }}</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Current Permissions -->
            <div>
              <h4 class="font-medium mb-3">Kebenaran Semasa</h4>
              <div class="space-y-2">
                <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>Lihat</span>
                  <Icon :name="selectedPermissionDetails.papar ? 'ic:baseline-check-circle' : 'ic:baseline-cancel'" 
                        :class="selectedPermissionDetails.papar ? 'text-green-500' : 'text-red-500'" />
                </div>
                <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>Cipta</span>
                  <Icon :name="selectedPermissionDetails.cipta ? 'ic:baseline-check-circle' : 'ic:baseline-cancel'" 
                        :class="selectedPermissionDetails.cipta ? 'text-green-500' : 'text-red-500'" />
                </div>
                <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>Kemaskini</span>
                  <Icon :name="selectedPermissionDetails.kemaskini ? 'ic:baseline-check-circle' : 'ic:baseline-cancel'" 
                        :class="selectedPermissionDetails.kemaskini ? 'text-green-500' : 'text-red-500'" />
                </div>
                <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>Padam</span>
                  <Icon :name="selectedPermissionDetails.padam ? 'ic:baseline-check-circle' : 'ic:baseline-cancel'" 
                        :class="selectedPermissionDetails.padam ? 'text-green-500' : 'text-red-500'" />
                </div>
              </div>
            </div>

            <!-- Restrictions -->
            <div>
              <h4 class="font-medium mb-3">Had Kebenaran</h4>
              <div class="space-y-2">
                <div v-if="selectedPermissionDetails.readOnly" class="p-2 bg-orange-50 rounded text-orange-800 text-sm">
                  <Icon name="ic:baseline-lock" class="mr-1" />
                  Akses terhad kepada lihat sahaja
                </div>
                <div v-if="selectedPermissionDetails.restrictedDelete" class="p-2 bg-red-50 rounded text-red-800 text-sm">
                  <Icon name="ic:baseline-warning" class="mr-1" />
                  Kebenaran padam dihadkan
                </div>
                <div v-if="!selectedPermissionDetails.readOnly && !selectedPermissionDetails.restrictedDelete" 
                     class="p-2 bg-green-50 rounded text-green-800 text-sm">
                  <Icon name="ic:baseline-check" class="mr-1" />
                  Tiada had kebenaran
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end">
          <rs-button 
            variant="primary-outline" 
            @click="showDetailsModal = false"
          >
            Tutup
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Permission History Modal -->
    <rs-modal
      v-model="showHistoryModal"
      title="Sejarah Perubahan Kebenaran"
      size="lg"
      position="center"
    >
      <template #body>
        <div v-if="selectedPermissionHistory">
          <div class="mb-4">
            <h3 class="font-semibold">{{ selectedPermissionHistory.menu }} - {{ selectedPermissionHistory.subMenu }}</h3>
          </div>
          
          <div class="space-y-3">
            <div v-for="history in permissionHistory" :key="history.id" class="border-l-4 border-green-500 pl-4 py-2">
              <div class="flex justify-between items-start">
                <div>
                  <p class="font-medium">{{ history.action }}</p>
                  <p class="text-sm text-gray-600">{{ history.description }}</p>
                  <p class="text-xs text-gray-500">{{ history.timestamp }}</p>
                </div>
                <rs-badge :variant="getHistoryVariant(history.action)">
                  {{ history.user }}
                </rs-badge>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end">
          <rs-button 
            variant="primary-outline" 
            @click="showHistoryModal = false"
          >
            Tutup
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

definePageMeta({
  title: "Kebenaran Kumpulan Pengguna - NAS",
});

const breadcrumb = ref([
  {
    name: "Pentadbir Sistem",
    type: "link",
    path: "/BF-PS",
  },
  {
    name: "Pengurusan Peranan & Kebenaran",
    type: "link",
    path: "/BF-PS/PPK",
  },
  {
    name: "Kebenaran Kumpulan Pengguna",
    type: "link",
    path: "/BF-PS/PPK/KKP",
  },
  {
    name: "NAS",
    type: "current",
    path: "/BF-PS/PPK/KKP/nas",
  },
]);

// State management
const selectedRole = ref(null);
const searchQuery = ref("");
const pageSize = ref(15);
const isSaving = ref(false);
const isBulkEditing = ref(false);

// Modal states
const showBulkEditModal = ref(false);
const showDetailsModal = ref(false);
const showHistoryModal = ref(false);

// Form data
const bulkAction = ref("");
const bulkPermissionType = ref("");
const bulkMenuFilter = ref("");

// Data
const permissions = ref([]);
const originalPermissions = ref([]);
const selectedPermissionDetails = ref(null);
const selectedPermissionHistory = ref(null);
const permissionHistory = ref([]);

// Options
const roleOptions = [
  { label: "-- Pilih Kumpulan Peranan NAS --", value: null },
  { label: "Eksekutif Kanan Perkhidmatan", value: "EKP" },
  { label: "Eksekutif Operasi & Admin Daerah", value: "EOAD" },
  { label: "Ketua Operasi & Admin Daerah", value: "KOAD" },
  { label: "Penolong Amil", value: "PA" },
  { label: "Jawatankuasa Pungutan & Pengagihan", value: "JPPA" }
];

const bulkActionOptions = [
  { label: "Berikan Kebenaran", value: "grant" },
  { label: "Batalkan Kebenaran", value: "revoke" }
];

const permissionTypeOptions = [
  { label: "Kebenaran Operasi", value: "operational" },
  { label: "Lihat", value: "papar" },
  { label: "Cipta", value: "cipta" },
  { label: "Kemaskini", value: "kemaskini" }
];

// Table columns
const columns = [
  {
    key: "menu",
    label: "Menu Utama",
    sortable: true,
  },
  {
    key: "subMenu",
    label: "Sub-menu",
    sortable: true,
  },
  {
    key: "papar",
    label: "Lihat",
    sortable: false,
  },
  {
    key: "cipta",
    label: "Cipta",
    sortable: false,
  },
  {
    key: "kemaskini",
    label: "Kemaskini",
    sortable: false,
  },
  {
    key: "padam",
    label: "Padam",
    sortable: false,
  },
  {
    key: "catatan",
    label: "Catatan",
    sortable: false,
  },
  {
    key: "tindakan",
    label: "Tindakan",
    sortable: false,
  },
];

// Computed properties
const filteredPermissions = computed(() => {
  let filtered = permissions.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(permission => 
      permission.menu.toLowerCase().includes(query) ||
      permission.subMenu.toLowerCase().includes(query)
    );
  }

  return filtered;
});

const tableData = computed(() => {
  return filteredPermissions.value.map(permission => ({
    ...permission,
    tindakan: permission
  }));
});

const menuFilterOptions = computed(() => {
  const uniqueMenus = [...new Set(permissions.value.map(p => p.menu))];
  return [
    { label: "Semua Menu", value: "" },
    ...uniqueMenus.map(menu => ({ label: menu, value: menu }))
  ];
});

const summary = computed(() => {
  const perms = filteredPermissions.value;
  return {
    mainMenus: [...new Set(perms.map(p => p.menu))].length,
    canView: perms.filter(p => p.papar).length,
    canCreate: perms.filter(p => p.cipta).length,
    canUpdate: perms.filter(p => p.kemaskini).length,
    canDelete: perms.filter(p => p.padam).length,
  };
});

const hasChanges = computed(() => {
  if (!originalPermissions.value.length || !permissions.value.length) return false;
  return JSON.stringify(originalPermissions.value) !== JSON.stringify(permissions.value);
});

// Methods  
const refreshPermissions = () => {
  if (selectedRole.value) {
    loadRolePermissions();
  }
  $toast.info('Senarai kebenaran NAS telah dimuat semula');
};

const loadRolePermissions = async () => {
  if (!selectedRole.value) {
    permissions.value = [];
    return;
  }

  try {
    // Mock data based on NAS role
    let data = getNASMockPermissions(selectedRole.value);
    
    permissions.value = data;
    originalPermissions.value = JSON.parse(JSON.stringify(data));
    
    $toast.success(`Kebenaran NAS untuk ${selectedRole.value} telah dimuatkan`);
  } catch (error) {
    $toast.error('Ralat semasa memuatkan kebenaran NAS');
    console.error('Error loading NAS permissions:', error);
  }
};

const getNASMockPermissions = (role) => {
  const basePermissions = [
    { menu: "Dashboard", subMenu: "Utama", papar: true, cipta: false, kemaskini: false, padam: false, readOnly: false, restrictedDelete: false },
    { menu: "Profiling Asnaf", subMenu: "Pendaftaran Pantas", papar: true, cipta: true, kemaskini: true, padam: false, readOnly: false, restrictedDelete: true },
    { menu: "Profiling Asnaf", subMenu: "Pendaftaran Lengkap", papar: true, cipta: true, kemaskini: true, padam: false, readOnly: false, restrictedDelete: true },
    { menu: "Profiling Asnaf", subMenu: "Kemaskini Profil", papar: true, cipta: false, kemaskini: true, padam: false, readOnly: false, restrictedDelete: false },
    { menu: "Profiling Asnaf", subMenu: "Senarai Asnaf", papar: true, cipta: false, kemaskini: false, padam: false, readOnly: false, restrictedDelete: false },
    { menu: "Pengurusan Bantuan", subMenu: "Mohon Bantuan", papar: true, cipta: true, kemaskini: true, padam: false, readOnly: false, restrictedDelete: true },
    { menu: "Pengurusan Bantuan", subMenu: "Senarai Permohonan", papar: true, cipta: false, kemaskini: true, padam: false, readOnly: false, restrictedDelete: false },
    { menu: "Pengurusan Bantuan", subMenu: "Kelulusan", papar: false, cipta: false, kemaskini: false, padam: false, readOnly: true, restrictedDelete: true },
    { menu: "Pengurusan Tunai", subMenu: "Pengeluaran Kaunter", papar: true, cipta: true, kemaskini: false, padam: false, readOnly: false, restrictedDelete: true },
    { menu: "Pengurusan Tunai", subMenu: "Baki Tunai", papar: true, cipta: false, kemaskini: false, padam: false, readOnly: true, restrictedDelete: true },
    { menu: "Penolong Amil", subMenu: "Pendaftaran", papar: true, cipta: true, kemaskini: true, padam: false, readOnly: false, restrictedDelete: true },
    { menu: "Penolong Amil", subMenu: "Elaun", papar: true, cipta: false, kemaskini: true, padam: false, readOnly: false, restrictedDelete: false },
    { menu: "Laporan", subMenu: "Laporan Asnaf", papar: true, cipta: false, kemaskini: false, padam: false, readOnly: true, restrictedDelete: true },
    { menu: "Laporan", subMenu: "Laporan Bantuan", papar: true, cipta: false, kemaskini: false, padam: false, readOnly: true, restrictedDelete: true }
  ];

  // Customize permissions based on NAS role
  switch (role) {
    case 'EKP':
      return basePermissions.map(p => {
        if (p.menu === 'Dashboard' || p.menu === 'Profiling Asnaf' || p.menu === 'Pengurusan Bantuan') {
          return { ...p, papar: true, cipta: p.menu === 'Profiling Asnaf' || p.subMenu === 'Mohon Bantuan' };
        } else if (p.menu === 'Laporan') {
          return { ...p, papar: true, readOnly: true };
        }
        return { ...p, papar: false, cipta: false, kemaskini: false, padam: false };
      });
    
    case 'EOAD':
      return basePermissions.map(p => {
        if (p.menu === 'Pengurusan Bantuan' && p.subMenu === 'Kelulusan') {
          return { ...p, papar: true, kemaskini: true };
        } else if (p.menu === 'Pengurusan Tunai') {
          return { ...p, papar: true, kemaskini: p.subMenu !== 'Baki Tunai' };
        }
        return p;
      });
    
    case 'KOAD':
      return basePermissions.map(p => {
        if (p.menu === 'Pengurusan Bantuan' && p.subMenu === 'Kelulusan') {
          return { ...p, papar: true, kemaskini: true, readOnly: false };
        } else if (p.menu === 'Pengurusan Tunai') {
          return { ...p, papar: true, kemaskini: true };
        } else if (p.menu === 'Penolong Amil') {
          return { ...p, papar: true, kemaskini: true };
        }
        return p;
      });
    
    case 'PA':
      return basePermissions.map(p => {
        if (p.menu === 'Dashboard' || p.menu === 'Profiling Asnaf' || p.menu === 'Penolong Amil') {
          return { ...p, papar: true, cipta: p.menu === 'Profiling Asnaf' };
        } else if (p.menu === 'Laporan') {
          return { ...p, papar: true, readOnly: true };
        }
        return { ...p, papar: false, cipta: false, kemaskini: false, padam: false };
      });
    
    case 'JPPA':
      return basePermissions.map(p => {
        if (p.menu === 'Pengurusan Bantuan' && p.subMenu === 'Kelulusan') {
          return { ...p, papar: true, kemaskini: true, readOnly: false };
        } else if (p.menu === 'Laporan') {
          return { ...p, papar: true, readOnly: true };
        } else if (p.menu === 'Dashboard') {
          return { ...p, papar: true };
        }
        return { ...p, papar: false, cipta: false, kemaskini: false, padam: false };
      });
    
    default:
      return basePermissions;
  }
};

const updatePermission = (item, type, value) => {
  // Business logic for NAS permission dependencies
  if (type === 'papar' && !value) {
    // If view permission is removed, remove all others
    item.cipta = false;
    item.kemaskini = false;
    item.padam = false;
  } else if (type !== 'papar' && value && !item.papar) {
    // If any other permission is granted, view must be enabled
    item.papar = true;
  }

  // NAS specific restrictions
  if (item.readOnly && (type === 'cipta' || type === 'kemaskini' || type === 'padam')) {
    $toast.warning('Kebenaran ini terhad untuk peranan NAS');
    return;
  }

  if (item.restrictedDelete && type === 'padam') {
    $toast.warning('Kebenaran padam dihadkan untuk item ini');
    return;
  }

  logAuditAction('Kemaskini Kebenaran NAS', `${item.menu} - ${item.subMenu}`, `${type}: ${value}`);
};

const bulkEditPermissions = () => {
  if (!selectedRole.value) {
    $toast.error('Sila pilih kumpulan peranan NAS terlebih dahulu');
    return;
  }
  showBulkEditModal.value = true;
};

const applyBulkEdit = async () => {
  try {
    isBulkEditing.value = true;
    
    // Validate inputs
    if (!bulkAction.value || !bulkPermissionType.value) {
      $toast.error('Sila lengkapkan semua field yang diperlukan');
      return;
    }

    // Filter permissions based on menu filter
    let targetPermissions = permissions.value.filter(p => !p.readOnly);
    if (bulkMenuFilter.value) {
      targetPermissions = targetPermissions.filter(p => p.menu === bulkMenuFilter.value);
    }

    // Apply bulk action
    const isGrant = bulkAction.value === 'grant';
    
    targetPermissions.forEach(permission => {
      if (bulkPermissionType.value === 'operational') {
        permission.papar = isGrant;
        permission.cipta = isGrant && !permission.readOnly;
        permission.kemaskini = isGrant && !permission.readOnly;
        // Don't grant delete permissions in bulk for NAS
      } else {
        if (!permission.readOnly) {
          permission[bulkPermissionType.value] = isGrant;
          
          // Apply business logic
          if (bulkPermissionType.value !== 'papar' && isGrant && !permission.papar) {
            permission.papar = true;
          } else if (bulkPermissionType.value === 'papar' && !isGrant) {
            permission.cipta = false;
            permission.kemaskini = false;
            permission.padam = false;
          }
        }
      }
    });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    logAuditAction('Edit Pukal NAS', selectedRole.value, `${bulkAction.value} ${bulkPermissionType.value}`);
    $toast.success('Kebenaran NAS telah dikemaskini secara pukal');
    
    showBulkEditModal.value = false;
    resetBulkForm();
  } catch (error) {
    $toast.error('Ralat semasa melaksanakan edit pukal NAS');
  } finally {
    isBulkEditing.value = false;
  }
};

const viewPermissionDetails = (permission) => {
  selectedPermissionDetails.value = permission;
  showDetailsModal.value = true;
};

const viewPermissionHistory = (permission) => {
  selectedPermissionHistory.value = permission;
  
  // Mock history data for NAS
  permissionHistory.value = [
    {
      id: 1,
      action: 'Kemaskini Kebenaran',
      description: 'Kebenaran NAS dikemaskini mengikut polisi baharu',
      user: 'AdminNAS02',
      timestamp: '2024-01-14 14:20:00'
    },
    {
      id: 2,
      action: 'Cipta Kebenaran',
      description: 'Kebenaran NAS awal dicipta untuk peranan',
      user: 'SystemAdmin',
      timestamp: '2024-01-08 11:45:00'
    }
  ];
  
  showHistoryModal.value = true;
};

const saveChanges = async () => {
  try {
    isSaving.value = true;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update original permissions reference
    originalPermissions.value = JSON.parse(JSON.stringify(permissions.value));
    
    logAuditAction('Simpan Kebenaran NAS', selectedRole.value, 'Kebenaran NAS dikemaskini');
    $toast.success('Kebenaran NAS berjaya disimpan');
  } catch (error) {
    $toast.error('Ralat semasa menyimpan kebenaran NAS');
  } finally {
    isSaving.value = false;
  }
};

const resetChanges = () => {
  permissions.value = JSON.parse(JSON.stringify(originalPermissions.value));
  $toast.info('Perubahan telah direset');
};

const resetBulkForm = () => {
  bulkAction.value = "";
  bulkPermissionType.value = "";
  bulkMenuFilter.value = "";
};

const getHistoryVariant = (action) => {
  switch (action) {
    case 'Cipta Kebenaran': return 'success';
    case 'Kemaskini Kebenaran': return 'info';
    case 'Padam Kebenaran': return 'danger';
    default: return 'default';
  }
};

const logAuditAction = (action, target, details) => {
  const auditLog = {
    username: 'AdminNAS02',
    userRole: 'Admin NAS',
    action: action,
    target: target,
    details: details,
    timestamp: new Date().toLocaleString('ms-MY'),
    module: 'Kebenaran Kumpulan Pengguna NAS'
  };
  
  console.log('Audit Log:', auditLog);
};

// Initialize
onMounted(() => {
  // Set initial data
});
</script>

<style scoped>
/* Custom checkbox styles for NAS */
input[type="checkbox"]:disabled {
  cursor: not-allowed;
}

.text-orange-600 {
  color: #d97706;
}
</style>
