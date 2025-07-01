<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Security Notice -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div class="flex items-center gap-2">
        <Icon name="ic:baseline-security" class="text-blue-600" />
        <div class="text-sm text-blue-800">
          <p class="font-medium">Selenggara Kebenaran Kumpulan Pengguna</p>
          <p>Sistem kawalan akses berasaskan peranan (RBAC) untuk mengurus kebenaran kumpulan pengguna dan individu.</p>
        </div>
      </div>
    </div>

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-4">
            <h2 class="text-xl font-semibold">Kebenaran Kumpulan Pengguna</h2>
            <rs-badge variant="info" v-if="selectedRole">{{ filteredPermissions.length }} kebenaran</rs-badge>
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
              variant="primary"
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
              label="Pilih Kumpulan Peranan"
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
        <div v-if="selectedRole" class="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 class="font-medium mb-3">Ringkasan Kebenaran</h3>
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
        <div v-if="selectedRole" class="overflow-x-auto">
          <table class="min-w-full table-auto border-collapse border border-gray-300">
            <thead class="bg-gray-50">
              <tr>
                <th class="border border-gray-300 px-4 py-2 text-left">No.</th>
                <th class="border border-gray-300 px-4 py-2 text-left">Menu</th>
                <th class="border border-gray-300 px-4 py-2 text-left">Sub Menu</th>
                <th class="border border-gray-300 px-4 py-2 text-center">
                  <span class="text-blue-600">Cipta</span>
                </th>
                <th class="border border-gray-300 px-4 py-2 text-center">
                  <span class="text-blue-600">Papar</span>
                </th>
                <th class="border border-gray-300 px-4 py-2 text-center">
                  <span class="text-yellow-600">Kemaskini</span>
                </th>
                <th class="border border-gray-300 px-4 py-2 text-center">
                  <span class="text-red-600">Padam</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in filteredPermissions" :key="item.id || index" class="hover:bg-gray-50">
                <td class="border border-gray-300 px-4 py-2">{{ index + 1 }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ item.menu }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ item.subMenu }}</td>
                <td class="border border-gray-300 px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    v-model="item.cipta"
                    @change="updatePermission(item, 'cipta', item.cipta)"
                    :disabled="!item.papar"
                    class="w-4 h-4 text-green-600 rounded focus:ring-green-500 disabled:opacity-50"
                  />
                </td>
                <td class="border border-gray-300 px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    v-model="item.papar"
                    @change="updatePermission(item, 'papar', item.papar)"
                    class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </td>
                <td class="border border-gray-300 px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    v-model="item.kemaskini"
                    @change="updatePermission(item, 'kemaskini', item.kemaskini)"
                    :disabled="!item.papar"
                    class="w-4 h-4 text-yellow-600 rounded focus:ring-yellow-500 disabled:opacity-50"
                  />
                </td>
                <td class="border border-gray-300 px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    v-model="item.padam"
                    @change="updatePermission(item, 'padam', item.padam)"
                    :disabled="!item.papar || !canDelete"
                    class="w-4 h-4 text-red-600 rounded focus:ring-red-500 disabled:opacity-50"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12 text-gray-500">
          <Icon name="ic:baseline-admin-panel-settings" size="48" class="mx-auto mb-4 text-gray-300" />
          <p class="text-lg font-medium mb-2">Pilih Kumpulan Peranan</p>
          <p>Sila pilih kumpulan peranan untuk melihat dan menguruskan kebenaran akses</p>
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
            variant="primary" 
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
      title="Edit Kebenaran Secara Pukal"
      size="lg"
      position="center"
    >
      <template #body>
        <div class="space-y-4">
          <div class="bg-blue-50 p-4 rounded-lg">
            <p class="text-blue-800 text-sm">
              <Icon name="ic:baseline-info" class="mr-1" />
              Gunakan fungsi ini untuk mengemas kini kebenaran secara pukal untuk peranan terpilih.
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
            variant="primary" 
            @click="applyBulkEdit"
            :loading="isBulkEditing"
          >
            Laksanakan
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
            <div v-for="history in permissionHistory" :key="history.id" class="border-l-4 border-blue-500 pl-4 py-2">
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
  title: "Selenggara Kebenaran Kumpulan Pengguna",
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
    type: "current",
    path: "/BF-PS/PPK/KKP",
  },
]);

// State management
const selectedRole = ref(null);
const searchQuery = ref("");
const isSaving = ref(false);
const isBulkEditing = ref(false);

// Modal states
const showBulkEditModal = ref(false);
const showHistoryModal = ref(false);

// Form data
const bulkAction = ref("");
const bulkPermissionType = ref("");
const bulkMenuFilter = ref("");

// Data
const permissions = ref([]);
const originalPermissions = ref([]);
const selectedPermissionHistory = ref(null);
const permissionHistory = ref([]);

// Mock current user role for access control
const currentUserRole = ref('ADMIN'); // Mock: ADMIN, ICT, etc.

// Options
const roleOptions = [
  { label: "-- Pilih Kumpulan Peranan --", value: null },
  { label: "EOAD - Eksekutif Operasi & Admin Daerah", value: "EOAD" },
  { label: "JPPA - Jawatankuasa Pungutan & Pengagihan", value: "JPPA" },
  { label: "PA - Penolong Amil", value: "PA" },
  { label: "AdminNAS - Administrator NAS", value: "AdminNAS" },
  { label: "EKP - Eksekutif Kanan Perkhidmatan", value: "EKP" },
  { label: "AUDIT - Pegawai Audit", value: "AUDIT" }
];

const bulkActionOptions = [
  { label: "Berikan Kebenaran", value: "grant" },
  { label: "Batalkan Kebenaran", value: "revoke" }
];

const permissionTypeOptions = [
  { label: "Semua Kebenaran", value: "all" },
  { label: "Lihat", value: "papar" },
  { label: "Cipta", value: "cipta" },
  { label: "Kemaskini", value: "kemaskini" },
  { label: "Padam", value: "padam" }
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

const canDelete = computed(() => {
  return ['ADMIN', 'ICT'].includes(currentUserRole.value);
});

// Methods
const refreshPermissions = () => {
  if (selectedRole.value) {
    loadRolePermissions();
  }
  $toast.info('Senarai kebenaran telah dimuat semula');
};

const loadRolePermissions = async () => {
  if (!selectedRole.value) {
    permissions.value = [];
    return;
  }

  try {
    // Mock data based on role
    let data = getMockPermissions(selectedRole.value);
    
    console.log('Loading permissions for role:', selectedRole.value);
    console.log('Permission data:', data);
    
    permissions.value = data;
    originalPermissions.value = JSON.parse(JSON.stringify(data));
    
    $toast.success(`Kebenaran untuk ${selectedRole.value} telah dimuatkan`);
  } catch (error) {
    $toast.error('Ralat semasa memuatkan kebenaran');
    console.error('Error loading permissions:', error);
  }
};

const getMockPermissions = (role) => {
  const basePermissions = [
    { id: 1, menu: "Dashboard", subMenu: "Utama", papar: true, cipta: false, kemaskini: false, padam: false },
    { id: 2, menu: "Laporan", subMenu: "Laporan Operasi", papar: true, cipta: false, kemaskini: false, padam: false },
    { id: 3, menu: "Operasi", subMenu: "Penyelenggaraan", papar: true, cipta: true, kemaskini: true, padam: false },
    { id: 4, menu: "Operasi", subMenu: "Inventori", papar: true, cipta: true, kemaskini: true, padam: false },
    { id: 5, menu: "Operasi", subMenu: "Jadual Kerja", papar: true, cipta: true, kemaskini: true, padam: false },
    { id: 6, menu: "Pengurusan Pengguna", subMenu: "Senarai Pengguna", papar: false, cipta: false, kemaskini: false, padam: false },
    { id: 7, menu: "Pengurusan Pengguna", subMenu: "Peranan", papar: false, cipta: false, kemaskini: false, padam: false },
    { id: 8, menu: "Pentadbiran", subMenu: "Dokumen", papar: true, cipta: true, kemaskini: true, padam: false },
    { id: 9, menu: "Pentadbiran", subMenu: "Tetapan Sistem", papar: false, cipta: false, kemaskini: false, padam: false }
  ];

  // Customize permissions based on role
  switch (role) {
    case 'EOAD':
      return basePermissions.map(p => {
        if (p.menu === 'Dashboard' || p.menu === 'Operasi' || p.menu === 'Laporan') {
          return { ...p, papar: true, kemaskini: true };
        }
        return p;
      });
    
    case 'JPPA':
      return basePermissions.map(p => {
        if (p.menu === 'Dashboard' || p.menu === 'Laporan') {
          return { ...p, papar: true };
        }
        return p;
      });
    
    case 'PA':
      return basePermissions.map(p => {
        if (p.menu === 'Dashboard' || p.menu === 'Operasi') {
          return { ...p, papar: true, cipta: true };
        }
        return p;
      });
    
    case 'AdminNAS':
      return basePermissions.map(p => {
        if (p.menu !== 'Pentadbiran' || p.subMenu !== 'Tetapan Sistem') {
          return { ...p, papar: true, cipta: true, kemaskini: true, padam: p.menu !== 'Pengurusan Pengguna' };
        }
        return p;
      });
    
    case 'EKP':
      return basePermissions.map(p => {
        if (p.menu === 'Dashboard' || p.menu === 'Operasi') {
          return { ...p, papar: true };
        }
        return p;
      });
    
    case 'AUDIT':
      return basePermissions.map(p => {
        if (p.menu === 'Dashboard' || p.menu === 'Laporan' || p.menu === 'Pentadbiran') {
          return { ...p, papar: true };
        }
        return p;
      });
    
    default:
      return basePermissions;
  }
};

const updatePermission = (item, type, value) => {
  // Business logic for permission dependencies
  if (type === 'papar' && !value) {
    // If view permission is removed, remove all others
    item.cipta = false;
    item.kemaskini = false;
    item.padam = false;
  } else if (type !== 'papar' && value && !item.papar) {
    // If any other permission is granted, view must be enabled
    item.papar = true;
  }

  // Admin-only delete restriction
  if (type === 'padam' && value && !canDelete.value) {
    $toast.warning('Padam akses tidak dibenarkan untuk peranan selain Admin');
    item.padam = false;
    return;
  }

  logAuditAction('Kemaskini Kebenaran', `${item.menu} - ${item.subMenu}`, `${type}: ${value}`);
};

const bulkEditPermissions = () => {
  if (!selectedRole.value) {
    $toast.error('Sila pilih kumpulan peranan terlebih dahulu');
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
    let targetPermissions = permissions.value;
    if (bulkMenuFilter.value) {
      targetPermissions = permissions.value.filter(p => p.menu === bulkMenuFilter.value);
    }

    // Apply bulk action
    const isGrant = bulkAction.value === 'grant';
    
    targetPermissions.forEach(permission => {
      if (bulkPermissionType.value === 'all') {
        permission.papar = isGrant;
        permission.cipta = isGrant;
        permission.kemaskini = isGrant;
        permission.padam = isGrant;
      } else {
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
    });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    logAuditAction('Edit Pukal', selectedRole.value, `${bulkAction.value} ${bulkPermissionType.value}`);
    $toast.success('Kebenaran telah dikemaskini secara pukal');

    showBulkEditModal.value = false;
    resetBulkForm();
  } catch (error) {
    $toast.error('Ralat semasa melaksanakan edit pukal');
  } finally {
    isBulkEditing.value = false;
  }
};

const editSinglePermission = (item) => {
  // Navigate to detailed permission edit page
  navigateTo(`/BF-PS/PPK/KKP/edit/${item.menu}/${item.subMenu}`);
};

const viewPermissionHistory = (permission) => {
  selectedPermissionHistory.value = permission;
  
  // Mock history data
  permissionHistory.value = [
    {
      id: 1,
      action: 'Kemaskini Kebenaran',
      description: 'Memberikan kebenaran lihat dan kemaskini',
      user: 'AdminICT01',
      timestamp: '2024-01-15 10:30:00'
    },
    {
      id: 2,
      action: 'Cipta Kebenaran',
      description: 'Kebenaran awal dicipta untuk peranan',
      user: 'SystemAdmin',
      timestamp: '2024-01-10 09:15:00'
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

    logAuditAction('Simpan Kebenaran', selectedRole.value, 'Kebenaran dikemaskini');
    
    const timestamp = new Date().toLocaleString('ms-MY');
    $toast.success(`Kebenaran kumpulan [${selectedRole.value}] telah dikemaskini oleh [${currentUserRole.value}01] pada ${timestamp}.`);
  } catch (error) {
    $toast.error('Ralat semasa menyimpan kebenaran');
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
    username: `${currentUserRole.value}01`,
    userRole: currentUserRole.value,
    action: action,
    target: target,
    details: details,
    timestamp: new Date().toLocaleString('ms-MY'),
    module: 'Selenggara Kebenaran Kumpulan Pengguna'
  };
  
  console.log('Audit Log:', auditLog);
};

// Initialize
onMounted(() => {
  console.log('PPK KKP component mounted');
  // Load initial data if needed
});
</script>

<style scoped>
/* Custom checkbox styles */
input[type="checkbox"]:disabled {
  cursor: not-allowed;
}
</style>