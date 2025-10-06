<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Enhanced Header Notice for Role Management -->
    <div class="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-6 mb-6">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
          <Icon name="ic:baseline-admin-panel-settings" class="text-emerald-600 w-8 h-8" />
        </div>
        <div>
          <h1 class="text-xl font-bold text-emerald-900 mb-2">Pusat Pengurusan Peranan & Kebenaran</h1>
          <p class="text-emerald-700">Konfigurasi peranan pengguna dan kawalan akses sistem. Perubahan peranan akan menjejaskan kebenaran akses secara real-time.</p>
        </div>
        <div class="ml-auto">
          <rs-badge variant="warning" size="lg">
            <Icon name="ic:baseline-security" class="mr-1" />
            Kawalan Kritikal
          </rs-badge>
        </div>
      </div>
    </div>

    <!-- Role Management Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <!-- Total Roles -->
      <div class="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 rounded-xl shadow-lg stats-card hover-lift">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-emerald-100 text-sm font-medium">Jumlah Peranan</p>
            <p class="text-3xl font-bold">{{ totalRoles }}</p>
            <div class="flex items-center mt-2">
              <Icon name="ic:baseline-admin-panel-settings" class="w-4 h-4 text-emerald-200 mr-1" />
              <span class="text-emerald-200 text-xs">Sistem NAS</span>
            </div>
          </div>
          <div class="bg-emerald-400 bg-opacity-30 p-3 rounded-lg">
            <Icon name="ic:baseline-group" class="w-8 h-8 text-emerald-100" />
          </div>
        </div>
      </div>

      <!-- Active Roles -->
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg stats-card hover-lift">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blue-100 text-sm font-medium">Peranan Aktif</p>
            <p class="text-3xl font-bold">{{ activeRoles }}</p>
            <div class="flex items-center mt-2">
              <Icon name="ic:baseline-check-circle" class="w-4 h-4 text-blue-200 mr-1" />
              <span class="text-blue-200 text-xs">Dalam kegunaan</span>
            </div>
          </div>
          <div class="bg-blue-400 bg-opacity-30 p-3 rounded-lg">
            <Icon name="ic:baseline-verified" class="w-8 h-8 text-blue-100" />
          </div>
        </div>
      </div>

      <!-- Total Permissions -->
      <div class="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg stats-card hover-lift">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-purple-100 text-sm font-medium">Jumlah Kebenaran</p>
            <p class="text-3xl font-bold">{{ totalPermissions }}</p>
            <div class="flex items-center mt-2">
              <Icon name="ic:baseline-key" class="w-4 h-4 text-purple-200 mr-1" />
              <span class="text-purple-200 text-xs">Akses terkonfigurasi</span>
            </div>
          </div>
          <div class="bg-purple-400 bg-opacity-30 p-3 rounded-lg">
            <Icon name="ic:baseline-lock" class="w-8 h-8 text-purple-100" />
          </div>
        </div>
      </div>

      <!-- High Security Roles -->
      <div class="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg stats-card hover-lift">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-orange-100 text-sm font-medium">Peranan Tinggi</p>
            <p class="text-3xl font-bold">{{ highSecurityRoles }}</p>
            <div class="flex items-center mt-2">
              <Icon name="ic:baseline-shield" class="w-4 h-4 text-orange-200 mr-1" />
              <span class="text-orange-200 text-xs">Keselamatan tinggi</span>
            </div>
          </div>
          <div class="bg-orange-400 bg-opacity-30 p-3 rounded-lg">
            <Icon name="ic:baseline-security" class="w-8 h-8 text-orange-100" />
          </div>
        </div>
      </div>
    </div>

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-4">
            <h2 class="text-xl font-semibold">Konfigurasi Peranan</h2>
            <rs-badge variant="info">{{ filteredRoles.length }} peranan</rs-badge>
          </div>
          <div class="flex gap-2">
            <rs-button
              variant="primary"
              @click="addRole"
            >
              <Icon name="ic:baseline-add" class="mr-1" />
              Tambah Peranan
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>
        <!-- Search Criteria Section -->
        <div class="mb-6 p-6 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 class="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
            <Icon name="ic:baseline-search" class="text-gray-600" />
            Kriteria Carian
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <FormKit
              v-model="searchCriteria.kodPeranan"
              type="text"
              label="Kod Peranan"
              placeholder="Masukkan kod peranan"
              :classes="{
                input: '!py-2',
              }"
            />
            
            <FormKit
              v-model="searchCriteria.namaPeranan"
              type="text"
              label="Nama Peranan"
              placeholder="Masukkan nama peranan"
              :classes="{
                input: '!py-2',
              }"
            />
            
            <FormKit
              v-model="searchCriteria.status"
              type="select"
              label="Status"
              :options="statusFilterOptions"
              :classes="{
                input: '!py-2',
              }"
            />
          </div>
          
          <div class="flex justify-end gap-3 pt-4 border-t border-gray-300">
            <rs-button
              variant="ghost"
              @click="resetSearch"
            >
              <Icon name="ic:baseline-refresh" class="mr-1" />
              Reset
            </rs-button>
            <rs-button
              variant="primary"
              @click="performSearch"
            >
              <Icon name="ic:baseline-search" class="mr-1" />
              Cari
            </rs-button>
          </div>
        </div>

        <!-- Roles Table -->
        <rs-table
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
            filterable: false,
          }"
          advanced
        >
          <template v-slot:status="{ text }">
            <rs-badge :variant="getStatusVariant(text)">
              {{ text }}
            </rs-badge>
          </template>

          <template v-slot:tindakan="{ text }">
            <div class="flex justify-center items-center gap-2">
              <rs-button
                variant="primary"
                size="sm"
                @click="editRole(text)"
                title="Kemaskini Peranan"
              >
                <Icon name="ic:baseline-edit" class="w-4 h-4" />
              </rs-button>
              <rs-button
                variant="info"
                size="sm"
                @click="viewPermissions(text)"
                title="Lihat Kebenaran"
              >
                <Icon name="ic:baseline-visibility" class="w-4 h-4" />
              </rs-button>
              <rs-button
                variant="danger"
                size="sm"
                @click="confirmDelete(text)"
                title="Hapus Peranan"
                :disabled="!canDeleteRole(text)"
              >
                <Icon name="ic:baseline-delete" class="w-4 h-4" />
              </rs-button>
            </div>
          </template>
        </rs-table>
      </template>
    </rs-card>

    <!-- Add/Edit Role Modal -->
    <rs-modal
      v-model="showRoleModal"
      :title="isEditing ? 'Kemaskini Peranan' : 'Tambah Peranan Baharu'"
      size="lg"
      position="center"
    >
      <template #body>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="text"
              name="kodPeranan"
              label="Kod Peranan"
              v-model="currentRole.kodPeranan"
              placeholder="Contoh: EKP, EOAD, ADMIN"
              validation="required"
              :validation-messages="{
                required: 'Kod Peranan diperlukan'
              }"
            />
            <FormKit
              type="text"
              name="namaPeranan"
              label="Nama Peranan"
              v-model="currentRole.namaPeranan"
              placeholder="Nama peranan"
              validation="required"
            />
          </div>

          <FormKit
            type="textarea"
            name="deskripsi"
            label="Deskripsi"
            v-model="currentRole.deskripsi"
            placeholder="Deskripsi peranan dan tanggungjawab"
            validation="required"
            rows="3"
          />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="select"
              name="tahapAkses"
              label="Tahap Akses"
              v-model="currentRole.tahapAkses"
              :options="accessLevelOptions"
              validation="required"
            />
            <FormKit
              type="select"
              name="status"
              label="Status"
              v-model="currentRole.status"
              :options="statusOptions"
              validation="required"
            />
          </div>

          <!-- Module Access Configuration -->
          <div class="border-t pt-4">
            <h4 class="font-medium mb-3">Akses Modul</h4>
            <div class="border rounded-lg overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input 
                        type="checkbox" 
                        @change="toggleAllModules($event)"
                        :checked="currentRole.moduleAccess.length === availableModules.length"
                        class="rounded border-gray-300"
                      />
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Modul</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="module in availableModules" :key="module.code" class="hover:bg-gray-50">
                    <td class="px-4 py-3 whitespace-nowrap">
                      <input 
                        type="checkbox" 
                        v-model="currentRole.moduleAccess"
                        :value="module.code"
                        class="rounded border-gray-300"
                      />
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{{ module.name }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Permission Level Configuration -->
          <div class="border-t pt-4">
            <h4 class="font-medium mb-3">Tahap Kebenaran</h4>
            <div class="border rounded-lg overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input 
                        type="checkbox" 
                        @change="toggleAllPermissions($event)"
                        :checked="currentRole.permissions.length === availablePermissions.length"
                        class="rounded border-gray-300"
                      />
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Kebenaran</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="permission in availablePermissions" :key="permission.code" class="hover:bg-gray-50">
                    <td class="px-4 py-3 whitespace-nowrap">
                      <input 
                        type="checkbox" 
                        v-model="currentRole.permissions"
                        :value="permission.code"
                        class="rounded border-gray-300"
                      />
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{{ permission.name }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button 
            variant="outline" 
            @click="resetForm"
          >
            Reset
          </rs-button>
          <rs-button 
            variant="primary-outline" 
            @click="showRoleModal = false"
          >
            Batal
          </rs-button>
          <rs-button 
            variant="primary" 
            @click="saveRole"
            :loading="saving"
          >
            {{ isEditing ? "Kemaskini" : "Simpan" }}
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- View Permissions Modal -->
    <rs-modal
      v-model="showPermissionsModal"
      title="Kebenaran Peranan"
      size="lg"
      position="center"
    >
      <template #body>
        <div v-if="selectedRole">
          <div class="mb-4">
            <h3 class="text-lg font-semibold">{{ selectedRole.namaPeranan }}</h3>
            <p class="text-gray-600">{{ selectedRole.deskripsi }}</p>
          </div>

          <div class="space-y-6">
            <!-- Module Access -->
            <div>
              <h4 class="font-medium mb-3">Akses Modul</h4>
              <div class="border rounded-lg overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Modul</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="(moduleCode, index) in selectedRole.moduleAccess" :key="moduleCode" class="hover:bg-gray-50">
                      <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ index + 1 }}</td>
                      <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{{ getModuleName(moduleCode) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Permissions -->
            <div>
              <h4 class="font-medium mb-3">Tahap Kebenaran</h4>
              <div class="border rounded-lg overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Kebenaran</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="(permCode, index) in selectedRole.permissions" :key="permCode" class="hover:bg-gray-50">
                      <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ index + 1 }}</td>
                      <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{{ getPermissionName(permCode) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end">
          <rs-button 
            variant="primary-outline" 
            @click="showPermissionsModal = false"
          >
            Tutup
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Delete Confirmation Modal -->
    <rs-modal
      v-model="showDeleteModal"
      title="Sahkan Padam Peranan"
      size="md"
      position="center"
    >
      <template #body>
        <div class="bg-red-50 p-4 rounded-lg mb-4">
          <Icon name="ic:baseline-warning" class="text-red-600 w-6 h-6 mb-2" />
          <p class="text-red-800 font-medium">Amaran Kritikal!</p>
        </div>
        <p>Adakah anda pasti ingin memadam peranan <strong>"{{ roleToDelete?.namaPeranan }}"</strong>?</p>
        <p class="text-red-600 font-medium mt-2">
          Pemadaman peranan akan menjejaskan semua pengguna yang menggunakan peranan ini.
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button variant="primary-outline" @click="showDeleteModal = false">
            Batal
          </rs-button>
          <rs-button variant="danger" @click="deleteRole">
            Sahkan Padam
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

definePageMeta({
  title: "Konfigurasi Peranan",
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
    name: "Konfigurasi Peranan",
    type: "current",
    path: "/BF-PS/PPK/KP",
  },
]);

// State management
const searchCriteria = ref({
  kodPeranan: "",
  namaPeranan: "",
  status: "",
});
const pageSize = ref(10);
const saving = ref(false);

// Modal states
const showRoleModal = ref(false);
const showPermissionsModal = ref(false);
const showDeleteModal = ref(false);
const isEditing = ref(false);

// Form data
const currentRole = ref({
  kodPeranan: '',
  namaPeranan: '',
  deskripsi: '',
  tahapAkses: 'Standard',
  status: 'Aktif',
  moduleAccess: [],
  permissions: []
});

const selectedRole = ref(null);
const roleToDelete = ref(null);

// Options
const statusOptions = [
  { label: "Aktif", value: "Aktif" },
  { label: "Tidak Aktif", value: "Tidak Aktif" }
];

const statusFilterOptions = [
  { label: "Semua Status", value: "" },
  { label: "Aktif", value: "Aktif" },
  { label: "Tidak Aktif", value: "Tidak Aktif" }
];

const accessLevelOptions = [
  { label: "Standard", value: "Standard" },
  { label: "Elevated", value: "Elevated" },
  { label: "Admin", value: "Admin" },
  { label: "Super Admin", value: "Super Admin" }
];

const availableModules = [
  { code: 'BF-PS', name: 'Pentadbir Sistem' },
  { code: 'BF-PRF', name: 'Profiling' },
  { code: 'BF-BTN', name: 'Pengurusan Bantuan' },
  { code: 'BF-TNI', name: 'Pengurusan Tunai' },
  { code: 'BF-PA', name: 'Pengurusan Penolong Amil' },
  { code: 'BF-ADN', name: 'Pengurusan Aduan' }
];

const availablePermissions = [
  { code: 'READ', name: 'Baca' },
  { code: 'WRITE', name: 'Tulis' },
  { code: 'UPDATE', name: 'Kemaskini' },
  { code: 'DELETE', name: 'Hapus' },
  { code: 'APPROVE', name: 'Lulus' },
  { code: 'AUDIT', name: 'Audit' },
  { code: 'EXPORT', name: 'Eksport' },
  { code: 'CONFIG', name: 'Konfigurasi' }
];

const moduleFilterOptions = computed(() => {
  return [
    { label: "Semua Modul", value: "" },
    ...availableModules.map(module => ({
      label: module.name,
      value: module.code
    }))
  ];
});

// Mock data - Roles
const roles = ref([
  {
    id: 1,
    kodPeranan: 'ADMIN',
    namaPeranan: 'Administrator Sistem',
    deskripsi: 'Akses penuh kepada semua modul dan fungsi sistem',
    tahapAkses: 'Super Admin',
    status: 'Aktif',
    moduleAccess: ['BF-PS', 'BF-PRF', 'BF-BTN', 'BF-TNI', 'BF-PA', 'BF-ADN'],
    permissions: ['READ', 'WRITE', 'UPDATE', 'DELETE', 'APPROVE', 'AUDIT', 'EXPORT', 'CONFIG'],
    jumlahPengguna: 3
  },
  {
    id: 2,
    kodPeranan: 'EKP',
    namaPeranan: 'Eksekutif Perkhidmatan Pelanggan',
    deskripsi: 'Mengendalikan perkhidmatan pelanggan dan pendaftaran asnaf',
    tahapAkses: 'Standard',
    status: 'Aktif',
    moduleAccess: ['BF-PRF', 'BF-BTN'],
    permissions: ['READ', 'WRITE', 'UPDATE'],
    jumlahPengguna: 15
  },
  {
    id: 3,
    kodPeranan: 'EOAD',
    namaPeranan: 'Eksekutif Operasi & Admin',
    deskripsi: 'Mengendalikan operasi harian dan pentadbiran',
    tahapAkses: 'Elevated',
    status: 'Aktif',
    moduleAccess: ['BF-PRF', 'BF-BTN', 'BF-TNI', 'BF-ADN'],
    permissions: ['READ', 'WRITE', 'UPDATE', 'APPROVE', 'EXPORT'],
    jumlahPengguna: 8
  },
  {
    id: 4,
    kodPeranan: 'JPPA',
    namaPeranan: 'Jawatankuasa Pungutan dan Pengagihan Asnaf',
    deskripsi: 'Mengendalikan kelulusan dan pengagihan bantuan',
    tahapAkses: 'Elevated',
    status: 'Aktif',
    moduleAccess: ['BF-PRF', 'BF-BTN', 'BF-PA'],
    permissions: ['READ', 'APPROVE', 'EXPORT'],
    jumlahPengguna: 12
  },
  {
    id: 5,
    kodPeranan: 'PA',
    namaPeranan: 'Penolong Amil',
    deskripsi: 'Membantu dalam operasi lapangan dan pengumpulan data',
    tahapAkses: 'Standard',
    status: 'Aktif',
    moduleAccess: ['BF-PRF', 'BF-PA'],
    permissions: ['READ', 'WRITE'],
    jumlahPengguna: 25
  },
  {
    id: 6,
    kodPeranan: 'AUDIT',
    namaPeranan: 'Pegawai Audit',
    deskripsi: 'Mengendalikan audit dan pemantauan sistem',
    tahapAkses: 'Admin',
    status: 'Aktif',
    moduleAccess: ['BF-PS', 'BF-PRF', 'BF-BTN', 'BF-TNI'],
    permissions: ['READ', 'AUDIT', 'EXPORT'],
    jumlahPengguna: 2
  },
  {
    id: 7,
    kodPeranan: 'GUEST',
    namaPeranan: 'Tetamu',
    deskripsi: 'Akses terhad untuk paparan sahaja',
    tahapAkses: 'Standard',
    status: 'Tidak Aktif',
    moduleAccess: ['BF-PRF'],
    permissions: ['READ'],
    jumlahPengguna: 0
  }
]);

// Table columns
const columns = [
  {
    key: "kodPeranan",
    label: "Kod Peranan",
    sortable: true,
  },
  {
    key: "namaPeranan",
    label: "Nama Peranan",
    sortable: true,
  },
  {
    key: "deskripsi",
    label: "Deskripsi",
    sortable: true,
  },
  {
    key: "jumlahPengguna",
    label: "Jumlah Pengguna",
    sortable: true,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
  },
  {
    key: "tindakan",
    label: "Tindakan",
    sortable: false,
  },
];

// Computed properties
const filteredRoles = computed(() => {
  let filtered = roles.value;

  // Filter by Kod Peranan
  if (searchCriteria.value.kodPeranan) {
    const query = searchCriteria.value.kodPeranan.toLowerCase();
    filtered = filtered.filter(role => 
      role.kodPeranan.toLowerCase().includes(query)
    );
  }

  // Filter by Nama Peranan
  if (searchCriteria.value.namaPeranan) {
    const query = searchCriteria.value.namaPeranan.toLowerCase();
    filtered = filtered.filter(role => 
      role.namaPeranan.toLowerCase().includes(query)
    );
  }

  // Filter by Status
  if (searchCriteria.value.status) {
    filtered = filtered.filter(role => role.status === searchCriteria.value.status);
  }

  return filtered;
});

const tableData = computed(() => {
  return filteredRoles.value.map(role => ({
    kodPeranan: role.kodPeranan,
    namaPeranan: role.namaPeranan,
    deskripsi: role.deskripsi,
    jumlahPengguna: role.jumlahPengguna,
    status: role.status,
    tindakan: role
  }));
});

// Enhanced Statistics for PPK/KP Module
const totalRoles = computed(() => roles.value.length);
const activeRoles = computed(() => roles.value.filter(role => role.status === 'Aktif').length);
const totalPermissions = computed(() => 156); // Mock total permissions
const highSecurityRoles = computed(() => roles.value.filter(role => role.tahapAkses === 'Super Admin').length);

// Enhanced Loading States
const refreshingRoles = ref(false);

// Methods
const getStatusVariant = (status) => {
  return status === 'Aktif' ? 'success' : 'danger';
};

const getAccessLevelVariant = (level) => {
  switch (level) {
    case 'Super Admin': return 'danger';
    case 'Admin': return 'warning';
    case 'Elevated': return 'info';
    default: return 'default';
  }
};

const refreshRoles = async () => {
  refreshingRoles.value = true;
  console.log('🔄 Refreshing roles...');
  
  try {
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('✅ Roles refreshed successfully');
  } finally {
    refreshingRoles.value = false;
  }
};

const exportRoles = async () => {
  console.log('📊 Exporting roles and permissions...');
  // Simulate export delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log('✅ Roles exported successfully');
};

const addRole = () => {
  isEditing.value = false;
  currentRole.value = {
    kodPeranan: '',
    namaPeranan: '',
    deskripsi: '',
    tahapAkses: 'Standard',
    status: 'Aktif',
    moduleAccess: [],
    permissions: []
  };
  showRoleModal.value = true;
};

const editRole = (role) => {
  isEditing.value = true;
  currentRole.value = { ...role };
  showRoleModal.value = true;
};

const saveRole = async () => {
  try {
    saving.value = true;
    
    // Simulate validation
    if (!currentRole.value.kodPeranan || !currentRole.value.namaPeranan) {
      $toast.error('Sila lengkapkan semua field yang diperlukan');
      return;
    }

    // Check for duplicate role code
    const isDuplicate = roles.value.some(role => 
      role.kodPeranan.toLowerCase() === currentRole.value.kodPeranan.toLowerCase() && 
      role.id !== currentRole.value.id
    );
    
    if (isDuplicate) {
      $toast.error('Kod Peranan sudah wujud. Sila gunakan kod yang berbeza.');
      return;
    }

    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (isEditing.value) {
      // Update existing role
      const index = roles.value.findIndex(role => role.id === currentRole.value.id);
      if (index > -1) {
        roles.value[index] = { ...currentRole.value };
      }
      logAuditAction('Kemaskini', 'Peranan', currentRole.value.namaPeranan);
      $toast.success('Peranan berjaya dikemaskini');
    } else {
      // Add new role
      const newId = Math.max(...roles.value.map(role => role.id), 0) + 1;
      roles.value.push({
        id: newId,
        jumlahPengguna: 0,
        ...currentRole.value
      });
      logAuditAction('Tambah', 'Peranan', currentRole.value.namaPeranan);
      $toast.success('Peranan berjaya ditambah');
    }

    showRoleModal.value = false;
  } catch (error) {
    $toast.error('Ralat semasa menyimpan peranan');
  } finally {
    saving.value = false;
  }
};

const viewPermissions = (role) => {
  selectedRole.value = role;
  showPermissionsModal.value = true;
};

const confirmDelete = (role) => {
  roleToDelete.value = role;
  showDeleteModal.value = true;
};

const deleteRole = () => {
  const index = roles.value.findIndex(role => role.id === roleToDelete.value.id);
  if (index > -1) {
    roles.value.splice(index, 1);
    logAuditAction('Hapus', 'Peranan', roleToDelete.value.namaPeranan);
    $toast.success('Peranan berjaya dipadamkan');
  }
  showDeleteModal.value = false;
  roleToDelete.value = null;
};

const canDeleteRole = (role) => {
  // Cannot delete roles that have users assigned or system roles
  return role.jumlahPengguna === 0 && !['ADMIN', 'EKP', 'EOAD'].includes(role.kodPeranan);
};

const resetForm = () => {
  currentRole.value = {
    kodPeranan: '',
    namaPeranan: '',
    deskripsi: '',
    tahapAkses: 'Standard',
    status: 'Aktif',
    moduleAccess: [],
    permissions: []
  };
};

const getModuleName = (code) => {
  const module = availableModules.find(m => m.code === code);
  return module ? module.name : code;
};

const getPermissionName = (code) => {
  const permission = availablePermissions.find(p => p.code === code);
  return permission ? permission.name : code;
};

const logAuditAction = (action, type, item) => {
  // Simulate audit logging
  const auditLog = {
    username: 'AdminNAS01',
    userRole: 'Admin Sistem',
    action: `${action} ${type}`,
    item: item,
    timestamp: new Date().toLocaleString('ms-MY'),
    module: 'Konfigurasi Peranan'
  };
  
  console.log('Audit Log:', auditLog);
};

// Search methods
const performSearch = () => {
  // The filtering is reactive and handled by filteredRoles computed property
  console.log('Performing search with criteria:', searchCriteria.value);
};

const resetSearch = () => {
  searchCriteria.value = {
    kodPeranan: "",
    namaPeranan: "",
    status: "",
  };
};

// Toggle all modules
const toggleAllModules = (event) => {
  if (event.target.checked) {
    currentRole.value.moduleAccess = availableModules.map(m => m.code);
  } else {
    currentRole.value.moduleAccess = [];
  }
};

// Toggle all permissions
const toggleAllPermissions = (event) => {
  if (event.target.checked) {
    currentRole.value.permissions = availablePermissions.map(p => p.code);
  } else {
    currentRole.value.permissions = [];
  }
};

// Initialize
onMounted(() => {
  // Set initial data
  console.log('👥 Pengurusan Peranan module initialized');
});
</script>

<style scoped>
/* Enhanced Role Management Styling */
.stats-card {
  transition: all 0.3s ease-in-out;
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

/* Fade-in animations */
.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Role card enhancements */
.role-card {
  transition: all 0.2s ease-in-out;
  border-left: 4px solid transparent;
}

.role-card:hover {
  border-left-color: #10b981;
  background-color: #f0fdfa;
  transform: translateX(4px);
}

/* Permission badge styling */
.permission-badge {
  transition: all 0.2s ease-in-out;
}

.permission-badge:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Security level indicators */
.security-high {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.security-medium {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.security-low {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

/* Button enhancements */
.btn-enhanced {
  transition: all 0.2s ease-in-out;
}

.btn-enhanced:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>

<style scoped>
</style>
