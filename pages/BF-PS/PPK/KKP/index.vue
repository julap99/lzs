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
          </div>
        </div>

        <!-- Section 2: Senarai Pengguna Bagi Kumpulan Dipilih -->
        <div v-if="selectedRole" class="mb-6">
          <rs-card>
            <template #header>
              <div class="flex items-center gap-2">
                <rs-badge variant="info">Section 2</rs-badge>
                <h3 class="text-lg font-semibold">Senarai Pengguna Bagi Kumpulan {{ selectedRole }}</h3>
              </div>
            </template>
            <template #body>
              <div class="overflow-x-auto">
                <table class="min-w-full table-auto border-collapse border border-gray-300">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="border border-gray-300 px-4 py-2 text-left">No.</th>
                      <th class="border border-gray-300 px-4 py-2 text-left">ID Pengguna</th>
                      <th class="border border-gray-300 px-4 py-2 text-left">Nama</th>
                      <th class="border border-gray-300 px-4 py-2 text-left">Tarikh Kemaskini</th>
                      <th class="border border-gray-300 px-4 py-2 text-left">Tetapan Oleh</th>
                      <th class="border border-gray-300 px-4 py-2 text-center">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(user, index) in groupUsers" :key="user.id" class="hover:bg-gray-50">
                      <td class="border border-gray-300 px-4 py-2">{{ index + 1 }}</td>
                      <td class="border border-gray-300 px-4 py-2">{{ user.userId }}</td>
                      <td class="border border-gray-300 px-4 py-2">
                        <button
                          @click="openIndividualPermissions(user)"
                          class="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                        >
                          {{ user.name }}
                        </button>
                      </td>
                      <td class="border border-gray-300 px-4 py-2">{{ user.lastUpdated }}</td>
                      <td class="border border-gray-300 px-4 py-2">{{ user.updatedBy }}</td>
                      <td class="border border-gray-300 px-4 py-2 text-center">
                        <rs-button
                          variant="danger-outline"
                          size="sm"
                          @click="removeUser(user)"
                          :disabled="!canDelete"
                        >
                          Hapus
                        </rs-button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </rs-card>
        </div>

        <!-- Section 3: Ringkasan Akses Menu -->
        <div v-if="selectedRole" class="mb-6">
          <rs-card>
            <template #header>
              <div class="flex items-center gap-2">
                <rs-badge variant="success">Section 3</rs-badge>
                <h3 class="text-lg font-semibold">Ringkasan Akses Menu</h3>
              </div>
            </template>
            <template #body>
              <div class="overflow-x-auto">
                <table class="min-w-full table-auto border-collapse border border-gray-300">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="border border-gray-300 px-4 py-2 text-left">No.</th>
                      <th class="border border-gray-300 px-4 py-2 text-left">Menu Utama</th>
                      <th class="border border-gray-300 px-4 py-2 text-center">Allowed</th>
                      <th class="border border-gray-300 px-4 py-2 text-center">Not Allowed</th>
                      <th class="border border-gray-300 px-4 py-2 text-center">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(menuSummary, index) in menuAccessSummary" :key="menuSummary.menu" class="hover:bg-gray-50">
                      <td class="border border-gray-300 px-4 py-2">{{ index + 1 }}</td>
                      <td class="border border-gray-300 px-4 py-2 font-medium">{{ menuSummary.menu }}</td>
                      <td class="border border-gray-300 px-4 py-2 text-center">
                        <rs-badge variant="success">{{ menuSummary.allowed }}</rs-badge>
                      </td>
                      <td class="border border-gray-300 px-4 py-2 text-center">
                        <rs-badge variant="danger">{{ menuSummary.notAllowed }}</rs-badge>
                      </td>
                      <td class="border border-gray-300 px-4 py-2 text-center">
                        <rs-button
                          variant="primary-outline"
                          size="sm"
                          @click="editMenuPermissions(menuSummary.menu)"
                        >
                          Kemaskini
                        </rs-button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </rs-card>
        </div>

        <!-- Section 4: Navigation and Search -->
        <div v-if="selectedRole && showDetailedPermissions" class="mb-4">
          <div class="flex items-center gap-4 mb-4">
            <rs-button
              variant="outline"
              @click="backToMenuSummary"
            >
              <Icon name="ic:baseline-arrow-back" class="mr-1" />
              Kembali ke Ringkasan Menu
            </rs-button>
            <div class="flex-1">
              <FormKit
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
        </div>

        <!-- Role Summary Section -->
        <div v-if="selectedRole && showDetailedPermissions" class="bg-gray-50 p-4 rounded-lg mb-6">
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

        <!-- Section 4: Tetapan Akses Menu & Kebenaran Tindakan -->
        <div v-if="selectedRole && showDetailedPermissions" class="mb-6">
          <rs-card>
            <template #header>
              <div class="flex items-center gap-2">
                <rs-badge variant="warning">Section 4</rs-badge>
                <h3 class="text-lg font-semibold">Tetapan Akses Menu & Kebenaran Tindakan</h3>
              </div>
            </template>
            <template #body>
              <div class="overflow-x-auto">
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
            </template>
          </rs-card>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12 text-gray-500">
          <Icon name="ic:baseline-admin-panel-settings" size="48" class="mx-auto mb-4 text-gray-300" />
          <p class="text-lg font-medium mb-2">Pilih Kumpulan Peranan</p>
          <p>Sila pilih kumpulan peranan untuk melihat dan menguruskan kebenaran akses</p>
        </div>

        <!-- Action Buttons -->
        <div v-if="selectedRole && showDetailedPermissions && hasChanges" class="mt-6 flex justify-end gap-2">
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

    <!-- Section 5: Individual Permissions Modal -->
    <rs-modal
      v-model="showIndividualModal"
      :title="`Tetapan Akses Individu - ${selectedUser?.name}`"
      size="xl"
      position="center"
    >
      <template #body>
        <div v-if="selectedUser" class="space-y-4">
          <!-- User Info -->
          <div class="bg-blue-50 p-4 rounded-lg">
            <div class="flex items-center gap-2 mb-2">
              <Icon name="ic:baseline-person" class="text-blue-600" />
              <span class="font-medium">{{ selectedUser.name }}</span>
              <rs-badge variant="info">{{ selectedUser.userId }}</rs-badge>
              <rs-badge variant="secondary">{{ selectedRole }}</rs-badge>
            </div>
            <p class="text-sm text-blue-800">
              Kebenaran individu akan mengatasi kebenaran kumpulan. Kebenaran yang tidak ditetapkan akan mengikut kebenaran kumpulan.
            </p>
          </div>

          <!-- Reset to Group Access Button -->
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <rs-badge variant="warning" v-if="hasIndividualOverrides">Individu Override</rs-badge>
              <span class="text-sm text-gray-600" v-else>Mengikut kebenaran kumpulan</span>
            </div>
            <rs-button
              variant="outline"
              size="sm"
              @click="resetToGroupAccess"
              :disabled="!hasIndividualOverrides"
            >
              <Icon name="ic:baseline-restore" class="mr-1" />
              Reset to Group Access
            </rs-button>
          </div>

          <!-- Individual Permissions Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full table-auto border-collapse border border-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th class="border border-gray-300 px-4 py-2 text-left">Menu</th>
                  <th class="border border-gray-300 px-4 py-2 text-left">Sub Menu</th>
                  <th class="border border-gray-300 px-4 py-2 text-center">Kumpulan</th>
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
                <tr v-for="(item, index) in individualPermissions" :key="item.id || index" class="hover:bg-gray-50">
                  <td class="border border-gray-300 px-4 py-2">{{ item.menu }}</td>
                  <td class="border border-gray-300 px-4 py-2">{{ item.subMenu }}</td>
                  <td class="border border-gray-300 px-4 py-2 text-center">
                    <div class="flex flex-col gap-1 text-xs">
                      <span :class="item.groupPermissions.papar ? 'text-green-600' : 'text-gray-400'">
                        {{ item.groupPermissions.papar ? '✓' : '✗' }} R
                      </span>
                      <span :class="item.groupPermissions.cipta ? 'text-green-600' : 'text-gray-400'">
                        {{ item.groupPermissions.cipta ? '✓' : '✗' }} C
                      </span>
                      <span :class="item.groupPermissions.kemaskini ? 'text-green-600' : 'text-gray-400'">
                        {{ item.groupPermissions.kemaskini ? '✓' : '✗' }} U
                      </span>
                      <span :class="item.groupPermissions.padam ? 'text-green-600' : 'text-gray-400'">
                        {{ item.groupPermissions.padam ? '✓' : '✗' }} D
                      </span>
                    </div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      v-model="item.cipta"
                      @change="updateIndividualPermission(item, 'cipta', item.cipta)"
                      :disabled="!item.papar"
                      class="w-4 h-4 text-green-600 rounded focus:ring-green-500 disabled:opacity-50"
                    />
                  </td>
                  <td class="border border-gray-300 px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      v-model="item.papar"
                      @change="updateIndividualPermission(item, 'papar', item.papar)"
                      class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td class="border border-gray-300 px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      v-model="item.kemaskini"
                      @change="updateIndividualPermission(item, 'kemaskini', item.kemaskini)"
                      :disabled="!item.papar"
                      class="w-4 h-4 text-yellow-600 rounded focus:ring-yellow-500 disabled:opacity-50"
                    />
                  </td>
                  <td class="border border-gray-300 px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      v-model="item.padam"
                      @change="updateIndividualPermission(item, 'padam', item.padam)"
                      :disabled="!item.papar || !canDelete"
                      class="w-4 h-4 text-red-600 rounded focus:ring-red-500 disabled:opacity-50"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button 
            variant="primary-outline" 
            @click="showIndividualModal = false"
          >
            Batal
          </rs-button>
          <rs-button
            variant="primary" 
            @click="saveIndividualPermissions"
            :loading="isSavingIndividual"
          >
            Simpan
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
const isSavingIndividual = ref(false);

// UI State - Sequential Flow Control
const showUserListSection = ref(false);      // Section 2
const showMenuSummarySection = ref(false);   // Section 3
const showDetailedPermissions = ref(false);  // Section 4

// Modal states
const showBulkEditModal = ref(false);
const showHistoryModal = ref(false);
const showIndividualModal = ref(false);

// Form data
const bulkAction = ref("");
const bulkPermissionType = ref("");
const bulkMenuFilter = ref("");

// Data
const permissions = ref([]);
const originalPermissions = ref([]);
const selectedPermissionHistory = ref(null);
const permissionHistory = ref([]);

// Section 2: User List Data
const groupUsers = ref([]);

// Section 5: Individual Permissions Data
const selectedUser = ref(null);
const individualPermissions = ref([]);
const originalIndividualPermissions = ref([]);

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

// Section 3: Menu Access Summary
const menuAccessSummary = computed(() => {
  if (!permissions.value.length) return [];
  
  const menuGroups = {};
  permissions.value.forEach(permission => {
    if (!menuGroups[permission.menu]) {
      menuGroups[permission.menu] = {
        menu: permission.menu,
        allowed: 0,
        notAllowed: 0,
        total: 0
      };
    }
    
    menuGroups[permission.menu].total++;
    if (permission.papar) {
      menuGroups[permission.menu].allowed++;
    } else {
      menuGroups[permission.menu].notAllowed++;
    }
  });
  
  return Object.values(menuGroups);
});

// Section 5: Individual Permissions Computed
const hasIndividualOverrides = computed(() => {
  if (!individualPermissions.value.length || !originalIndividualPermissions.value.length) return false;
  return JSON.stringify(individualPermissions.value) !== JSON.stringify(originalIndividualPermissions.value);
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
    // Reset all UI sections
    showUserListSection.value = false;
    showMenuSummarySection.value = false;
    showDetailedPermissions.value = false;
    return;
  }

  try {
    // Mock data based on role
    let data = getMockPermissions(selectedRole.value);
    
    console.log('Loading permissions for role:', selectedRole.value);
    console.log('Permission data:', data);
    
    permissions.value = data;
    originalPermissions.value = JSON.parse(JSON.stringify(data));
    
    // Load group users
    groupUsers.value = getMockGroupUsers(selectedRole.value);
    
    $toast.success(`Kebenaran untuk ${selectedRole.value} telah dimuatkan`);
  } catch (error) {
    $toast.error('Ralat semasa memuatkan kebenaran');
    console.error('Error loading permissions:', error);
  }
};

const getMockPermissions = (role) => {
  const basePermissions = [
    { id: 1, menu: "Dashboard", subMenu: "Utama", papar: true, cipta: false, kemaskini: false, padam: false },
    { id: 2, menu: "Profil", subMenu: "Kemas Kini Profil", papar: true, cipta: false, kemaskini: true, padam: false },
    { id: 3, menu: "Profil", subMenu: "Tukar Kata Laluan", papar: true, cipta: false, kemaskini: true, padam: false },
    { id: 4, menu: "Bantuan", subMenu: "Semakan Permohonan", papar: true, cipta: true, kemaskini: true, padam: false },
    { id: 5, menu: "Bantuan", subMenu: "Senarai Bantuan", papar: true, cipta: false, kemaskini: false, padam: false },
    { id: 6, menu: "Tuntutan", subMenu: "Permohonan Tuntutan", papar: false, cipta: false, kemaskini: false, padam: false },
    { id: 7, menu: "Tuntutan", subMenu: "Semakan Status", papar: false, cipta: false, kemaskini: false, padam: false },
    { id: 8, menu: "Laporan", subMenu: "Laporan Operasi", papar: true, cipta: false, kemaskini: false, padam: false },
    { id: 9, menu: "Laporan", subMenu: "Laporan Kewangan", papar: false, cipta: false, kemaskini: false, padam: false },
    { id: 10, menu: "Pengurusan Pengguna", subMenu: "Senarai Pengguna", papar: false, cipta: false, kemaskini: false, padam: false },
    { id: 11, menu: "Pengurusan Pengguna", subMenu: "Peranan", papar: false, cipta: false, kemaskini: false, padam: false },
    { id: 12, menu: "Pentadbiran", subMenu: "Dokumen", papar: true, cipta: true, kemaskini: true, padam: false },
    { id: 13, menu: "Pentadbiran", subMenu: "Tetapan Sistem", papar: false, cipta: false, kemaskini: false, padam: false }
  ];

  // Customize permissions based on role
  switch (role) {
    case 'EOAD':
      return basePermissions.map(p => {
        if (p.menu === 'Dashboard' || p.menu === 'Profil' || p.menu === 'Bantuan' || p.menu === 'Laporan') {
          return { ...p, papar: true, kemaskini: p.menu !== 'Dashboard' && p.menu !== 'Laporan' };
        }
        if (p.menu === 'Tuntutan') {
          return { ...p, papar: true, cipta: true, kemaskini: true };
        }
        return p;
      });
    
    case 'JPPA':
      return basePermissions.map(p => {
        if (p.menu === 'Dashboard' || p.menu === 'Profil' || p.menu === 'Laporan') {
          return { ...p, papar: true, kemaskini: p.menu === 'Profil' };
        }
        if (p.menu === 'Bantuan') {
          return { ...p, papar: true };
        }
        return p;
      });
    
    case 'PA':
      return basePermissions.map(p => {
        if (p.menu === 'Dashboard' || p.menu === 'Profil' || p.menu === 'Bantuan') {
          return { ...p, papar: true, cipta: p.menu === 'Bantuan', kemaskini: true };
        }
        if (p.menu === 'Tuntutan') {
          return { ...p, papar: true, cipta: true };
        }
        return p;
      });
    
    case 'AdminNAS':
      return basePermissions.map(p => {
        if (p.menu !== 'Pentadbiran' || p.subMenu !== 'Tetapan Sistem') {
          return { ...p, papar: true, cipta: p.menu !== 'Dashboard' && p.menu !== 'Laporan', kemaskini: p.menu !== 'Dashboard' && p.menu !== 'Laporan', padam: p.menu !== 'Pengurusan Pengguna' && p.menu !== 'Dashboard' && p.menu !== 'Laporan' };
        }
        return p;
      });
    
    case 'EKP':
      return basePermissions.map(p => {
        if (p.menu === 'Dashboard' || p.menu === 'Profil') {
          return { ...p, papar: true, kemaskini: p.menu === 'Profil' };
        }
        if (p.menu === 'Bantuan' || p.menu === 'Laporan') {
          return { ...p, papar: true };
        }
        return p;
      });
    
    case 'AUDIT':
      return basePermissions.map(p => {
        if (p.menu === 'Dashboard' || p.menu === 'Profil' || p.menu === 'Laporan' || p.menu === 'Pentadbiran') {
          return { ...p, papar: true, kemaskini: p.menu === 'Profil' };
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

// Section 1: Show User List and Menu Summary
const showUserList = () => {
  // Reset all sections first
  showUserListSection.value = false;
  showMenuSummarySection.value = false;
  showDetailedPermissions.value = false;
  
  // Show Section 2 and Section 3 immediately
  showUserListSection.value = true;
  showMenuSummarySection.value = true;
  
  $toast.info('Menunjukkan senarai pengguna dan ringkasan menu');
};

// Section 2: Group Users Methods
const getMockGroupUsers = (role) => {
  const baseUsers = {
    'EOAD': [
      { id: 1, userId: '900101-14-1234', name: 'Ahmad Fariz bin Abdullah', lastUpdated: '15/06/2024 10:30', updatedBy: 'AdminICT01' },
      { id: 2, userId: '850315-08-5678', name: 'Siti Aminah binti Hassan', lastUpdated: '12/06/2024 14:15', updatedBy: 'AdminICT01' },
      { id: 3, userId: '920720-11-9012', name: 'Muhammad Rizal bin Omar', lastUpdated: '10/06/2024 09:45', updatedBy: 'AdminICT02' }
    ],
    'JPPA': [
      { id: 4, userId: '880425-03-3456', name: 'Fatimah binti Yusof', lastUpdated: '14/06/2024 11:20', updatedBy: 'AdminICT01' },
      { id: 5, userId: '910208-07-7890', name: 'Azman bin Ibrahim', lastUpdated: '13/06/2024 16:30', updatedBy: 'AdminICT01' }
    ],
    'PA': [
      { id: 6, userId: '890612-05-2345', name: 'Noor Azlina binti Mahmud', lastUpdated: '11/06/2024 08:15', updatedBy: 'AdminICT02' },
      { id: 7, userId: '940830-12-6789', name: 'Hafiz bin Razak', lastUpdated: '09/06/2024 13:45', updatedBy: 'AdminICT01' },
      { id: 8, userId: '870405-09-0123', name: 'Khadijah binti Ali', lastUpdated: '08/06/2024 15:20', updatedBy: 'AdminICT02' }
    ],
    'AdminNAS': [
      { id: 9, userId: '860918-06-4567', name: 'Ismail bin Ahmad', lastUpdated: '07/06/2024 10:00', updatedBy: 'SuperAdmin' },
      { id: 10, userId: '930225-10-8901', name: 'Zainab binti Mohd', lastUpdated: '06/06/2024 12:30', updatedBy: 'SuperAdmin' }
    ],
    'EKP': [
      { id: 11, userId: '881107-04-5678', name: 'Rashid bin Hassan', lastUpdated: '05/06/2024 14:45', updatedBy: 'AdminICT01' }
    ],
    'AUDIT': [
      { id: 12, userId: '900523-08-9012', name: 'Aishah binti Rahman', lastUpdated: '04/06/2024 09:15', updatedBy: 'AdminICT02' },
      { id: 13, userId: '851210-11-3456', name: 'Kamal bin Yahya', lastUpdated: '03/06/2024 11:00', updatedBy: 'AdminICT01' }
    ]
  };
  
  return baseUsers[role] || [];
};

const removeUser = (user) => {
  if (!canDelete.value) {
    $toast.warning('Hapus pengguna tidak dibenarkan untuk peranan selain Admin');
    return;
  }
  
  // Simulate user removal
  const index = groupUsers.value.findIndex(u => u.id === user.id);
  if (index > -1) {
    groupUsers.value.splice(index, 1);
    logAuditAction('Hapus Pengguna', user.name, `Pengguna dihapus dari kumpulan ${selectedRole.value}`);
    $toast.success(`Pengguna ${user.name} telah dihapus dari kumpulan ${selectedRole.value}`);
  }
};

// Section 3: Menu Access Summary Methods
const editMenuPermissions = (menuName) => {
  // Hide previous sections and show Section 4
  showUserListSection.value = false;
  showMenuSummarySection.value = false;
  showDetailedPermissions.value = true;
  
  // Auto-filter to show only selected menu
  searchQuery.value = menuName;
  
  $toast.info(`Menunjukkan kebenaran terperinci untuk menu: ${menuName}`);
};

const backToMenuSummary = () => {
  // Hide Section 4 and show Sections 2 & 3
  showDetailedPermissions.value = false;
  showUserListSection.value = true;
  showMenuSummarySection.value = true;
  
  // Clear search filter
  searchQuery.value = "";
  
  $toast.info('Kembali ke ringkasan menu');
};

// Section 5: Individual Permissions Methods
const openIndividualPermissions = (user) => {
  selectedUser.value = user;
  
  // Create individual permissions based on group permissions
  individualPermissions.value = permissions.value.map(permission => ({
    ...permission,
    groupPermissions: {
      papar: permission.papar,
      cipta: permission.cipta,
      kemaskini: permission.kemaskini,
      padam: permission.padam
    }
  }));
  
  originalIndividualPermissions.value = JSON.parse(JSON.stringify(individualPermissions.value));
  showIndividualModal.value = true;
};

const updateIndividualPermission = (item, type, value) => {
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

  logAuditAction('Kemaskini Kebenaran Individu', `${selectedUser.value.name} - ${item.menu} - ${item.subMenu}`, `${type}: ${value}`);
};

const resetToGroupAccess = () => {
  individualPermissions.value = originalIndividualPermissions.value.map(permission => ({
    ...permission,
    papar: permission.groupPermissions.papar,
    cipta: permission.groupPermissions.cipta,
    kemaskini: permission.groupPermissions.kemaskini,
    padam: permission.groupPermissions.padam
  }));
  
  $toast.info('Kebenaran individu telah direset kepada kebenaran kumpulan');
};

const saveIndividualPermissions = async () => {
  try {
    isSavingIndividual.value = true;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update original permissions reference
    originalIndividualPermissions.value = JSON.parse(JSON.stringify(individualPermissions.value));

    logAuditAction('Simpan Kebenaran Individu', selectedUser.value.name, 'Kebenaran individu dikemaskini');
    
    const timestamp = new Date().toLocaleString('ms-MY');
    $toast.success(`Kebenaran individu untuk [${selectedUser.value.name}] telah dikemaskini oleh [${currentUserRole.value}01] pada ${timestamp}.`);
    
    showIndividualModal.value = false;
  } catch (error) {
    $toast.error('Ralat semasa menyimpan kebenaran individu');
  } finally {
    isSavingIndividual.value = false;
  }
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