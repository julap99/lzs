<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Selenggara Kebenaran Kumpulan Pengguna
          </h2>
          <rs-button
            variant="primary"
            size="sm"
            @click="navigateTo('/BF-PS/PPK/KKP/tambah')"
          >
            + Tambah Kebenaran
          </rs-button>
        </div>
      </template>

      <template #body>
        <!-- Kumpulan Peranan Selection -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Kumpulan Peranan</label
          >

          <!-- Status -->
          <FormKit
            type="select"
            name="status"
            label="Pilih peranan"
            validation="required"
            v-model="selectedRole"
            :options="roleOptions"
            @change="loadRolePermissions"
          />
        </div>

        <!-- Role Summary Section -->
        <div v-if="selectedRole" class="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 class="font-medium mb-3">Ringkasan Senarai Akses ke Menu</h3>
          <div class="grid grid-cols-4 gap-4">
            <div class="bg-white p-3 rounded shadow">
              <div class="text-sm text-gray-500">Menu Utama</div>
              <div class="font-semibold">{{ summary.mainMenus }}</div>
            </div>
            <div class="bg-white p-3 rounded shadow">
              <div class="text-sm text-gray-500">Dibenarkan</div>
              <div class="font-semibold text-success-600">
                {{ summary.allowed }}
              </div>
            </div>
            <div class="bg-white p-3 rounded shadow">
              <div class="text-sm text-gray-500">Tidak Dibenarkan</div>
              <div class="font-semibold text-danger-600">
                {{ summary.notAllowed }}
              </div>
            </div>
            <div
              class="bg-white p-3 rounded shadow flex items-center justify-center"
            >
              <rs-button
                variant="primary-outline"
                size="sm"
                @click="editPermissions(selectedRole)"
              >
                Kemaskini
              </rs-button>
            </div>
          </div>
        </div>

        <!-- Permissions Table -->
        <rs-table
          v-if="selectedRole"
          class="mt-4"
          :key="tableKey"
          :data="permissions"
          :pageSize="10"
          :showNoColumn="true"
          :options="{
            variant: 'default',
            hover: true,
          }"
        >
          <template v-slot:cipta="data">
            <input
              type="checkbox"
              v-model="data.text"
              @change="handleCheckboxChange(data, 'cipta')"
              class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
          </template>
          <template v-slot:papar="data">
            <input
              type="checkbox"
              v-model="data.text"
              @change="handleCheckboxChange(data, 'papar')"
              class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
          </template>
          <template v-slot:kemaskini="data">
            <input
              type="checkbox"
              v-model="data.text"
              @change="handleCheckboxChange(data, 'kemaskini')"
              class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
          </template>
          <template v-slot:padam="data">
            <input
              type="checkbox"
              v-model="data.text"
              @change="handleCheckboxChange(data, 'padam')"
              class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
          </template>
        </rs-table>

        <!-- Empty State -->
        <div v-else class="text-center py-10 text-gray-500">
          <Icon
            name="mdi:account-group"
            size="48"
            class="mx-auto mb-4 text-gray-300"
          />
          <p>Sila pilih kumpulan peranan untuk melihat kebenaran akses</p>
        </div>

        <!-- Save Changes Button -->
        <div v-if="selectedRole && hasChanges" class="mt-6 flex justify-end">
          <rs-button variant="primary" @click="saveChanges" :loading="isSaving">
            Simpan Perubahan
          </rs-button>
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
        <p>Adakah anda pasti ingin memadam tetapan kebenaran ini?</p>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button variant="primary-outline" @click="showDeleteModal = false">
            Batal
          </rs-button>
          <rs-button
            variant="danger"
            @click="deletePermission"
            :loading="isDeleting"
          >
            Sahkan Padam
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Success Toast -->
    <Teleport to="body">
      <div v-if="showToast" class="fixed bottom-4 right-4 z-50">
        <div
          class="bg-success-100 border-l-4 border-success-500 text-success-700 p-4 rounded shadow-lg"
        >
          <div class="flex items-center">
            <Icon name="mdi:check-circle" class="mr-2" />
            <p>{{ toastMessage }}</p>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";

// Create toast composable
const useToast = () => {
  const showToast = ref(false);
  const toastMessage = ref("");

  const displayToast = (message, duration = 3000) => {
    toastMessage.value = message;
    showToast.value = true;

    setTimeout(() => {
      showToast.value = false;
    }, duration);
  };

  return { showToast, toastMessage, displayToast };
};

definePageMeta({
  title: "Selenggara Kebenaran Kumpulan Pengguna",
});

// Breadcrumb configuration
const breadcrumb = ref([
  {
    name: "Pentadbiran Sistem",
    type: "link",
    path: "/BF-PS/PPK/KKP",
  },
  {
    name: "Selenggara Kebenaran Kumpulan Pengguna",
    type: "current",
    path: "/BF-PS/PPK/KKP",
  },
]);

// Role selection
const selectedRole = ref(null);
const roleOptions = ref([
  { value: null, label: "-- Pilih peranan --" },
  { value: "EKP", label: "Eksekutif Perkhidmatan Pelanggan" },
  { value: "EOAD", label: "Eksekutif Operasi & Admin" },
  { value: "KOAD", label: "Ketua Operasi & Admin" },
]);

// Permissions data
const permissions = ref([]);
const originalPermissions = ref([]); // To track changes
const tableKey = ref(0);

// UI state management
const isSaving = ref(false);
const isDeleting = ref(false);
const showDeleteModal = ref(false);
const permissionToDelete = ref(null);

// Toast functionality
const { showToast, toastMessage, displayToast } = useToast();

// Summary data
const summary = ref({
  mainMenus: 0,
  allowed: 0,
  notAllowed: 0,
});

// Track if there are unsaved changes
const hasChanges = computed(() => {
  if (!originalPermissions.value.length || !permissions.value.length)
    return false;

  return (
    JSON.stringify(originalPermissions.value) !==
    JSON.stringify(permissions.value)
  );
});

// Methods
const updatePermission = (index, type, value) => {
  // Special handling for "papar" permission
  if (type === "papar" && !value) {
    // If viewing permission is removed, also remove other permissions
    permissions.value[index].cipta = false;
    permissions.value[index].kemaskini = false;
    permissions.value[index].padam = false;
  } else if (type !== "papar" && value) {
    // If any other permission is granted, viewing must be enabled
    permissions.value[index].papar = true;
  }

  // Update summary
  updateSummary();
};

const updateSummary = () => {
  const uniqueMenus = [...new Set(permissions.value.map((p) => p.menu))];
  summary.value.mainMenus = uniqueMenus.length;
  summary.value.allowed = permissions.value.filter((p) => p.papar).length;
  summary.value.notAllowed = permissions.value.length - summary.value.allowed;
};

const editPermissions = (roleId) => {
  navigateTo(`/BF-PS/PPK/KKP/${roleId}/kemaskini`);
};

const confirmDelete = (permissionId) => {
  permissionToDelete.value = permissionId;
  showDeleteModal.value = true;
};

const deletePermission = async () => {
  try {
    isDeleting.value = true;

    // Here you would call an API to delete the permission
    // Example: await $fetch(`/api/permissions/${permissionToDelete.value}`, { method: 'DELETE' });

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    displayToast("Kebenaran berjaya dipadam", 3000);
    showDeleteModal.value = false;
    permissionToDelete.value = null;

    // Refresh data
    loadRolePermissions();
  } catch (error) {
    console.error("Error deleting permission:", error);
  } finally {
    isDeleting.value = false;
  }
};

const refreshTable = () => {
  tableKey.value++;
};

const saveChanges = async () => {
  try {
    isSaving.value = true;

    // Here you would call an API to save the permissions
    // Example: await $fetch('/api/permissions', {
    //   method: 'PUT',
    //   body: { roleId: selectedRole.value, permissions: permissions.value }
    // });

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Update original permissions reference to match current state
    originalPermissions.value = JSON.parse(JSON.stringify(permissions.value));

    displayToast("Kebenaran berjaya dikemaskini", 3000);
  } catch (error) {
    console.error("Error saving permissions:", error);
  } finally {
    isSaving.value = false;
  }
};

const loadRolePermissions = async () => {
  if (!selectedRole.value) return;

  try {
    // In a real application, you would fetch this data from an API
    // Example: const response = await $fetch(`/api/permissions/${selectedRole.value}`);

    // For now, we'll use the mock data
    let data = [];

    if (selectedRole.value === "EKP") {
      data = [
        {
          menu: "Dashboard",
          subMenu: "Utama",
          cipta: false,
          papar: true,
          kemaskini: false,
          padam: false,
        },
        {
          menu: "Pengurusan Pengguna",
          subMenu: "Senarai Pengguna",
          cipta: false,
          papar: true,
          kemaskini: false,
          padam: false,
        },
        {
          menu: "Pengurusan Pengguna",
          subMenu: "Peranan",
          cipta: false,
          papar: true,
          kemaskini: false,
          padam: false,
        },
        {
          menu: "Pengurusan Pengguna",
          subMenu: "Kebenaran",
          cipta: false,
          papar: false,
          kemaskini: false,
          padam: false,
        },
        {
          menu: "Perkhidmatan Pelanggan",
          subMenu: "Aduan",
          cipta: true,
          papar: true,
          kemaskini: true,
          padam: false,
        },
        {
          menu: "Perkhidmatan Pelanggan",
          subMenu: "Pertanyaan",
          cipta: true,
          papar: true,
          kemaskini: true,
          padam: false,
        },
        {
          menu: "Perkhidmatan Pelanggan",
          subMenu: "Maklumat Pelanggan",
          cipta: false,
          papar: true,
          kemaskini: false,
          padam: false,
        },
        {
          menu: "Laporan",
          subMenu: "Laporan Aduan",
          cipta: false,
          papar: true,
          kemaskini: false,
          padam: false,
        },
      ];
    } else if (selectedRole.value === "EOAD") {
      data = [
        {
          menu: "Dashboard",
          subMenu: "Utama",
          cipta: false,
          papar: true,
          kemaskini: false,
          padam: false,
        },
        {
          menu: "Pengurusan Pengguna",
          subMenu: "Senarai Pengguna",
          cipta: false,
          papar: true,
          kemaskini: false,
          padam: false,
        },
        {
          menu: "Pengurusan Pengguna",
          subMenu: "Peranan",
          cipta: false,
          papar: false,
          kemaskini: false,
          padam: false,
        },
        {
          menu: "Operasi",
          subMenu: "Penyelenggaraan",
          cipta: true,
          papar: true,
          kemaskini: true,
          padam: false,
        },
        {
          menu: "Operasi",
          subMenu: "Inventori",
          cipta: true,
          papar: true,
          kemaskini: true,
          padam: false,
        },
        {
          menu: "Operasi",
          subMenu: "Jadual Kerja",
          cipta: true,
          papar: true,
          kemaskini: true,
          padam: false,
        },
        {
          menu: "Pentadbiran",
          subMenu: "Dokumen",
          cipta: true,
          papar: true,
          kemaskini: true,
          padam: false,
        },
        {
          menu: "Pentadbiran",
          subMenu: "Tetapan Sistem",
          cipta: false,
          papar: true,
          kemaskini: false,
          padam: false,
        },
        {
          menu: "Laporan",
          subMenu: "Laporan Operasi",
          cipta: false,
          papar: true,
          kemaskini: false,
          padam: false,
        },
      ];
    } else if (selectedRole.value === "KOAD") {
      data = [
        {
          menu: "Dashboard",
          subMenu: "Utama",
          cipta: false,
          papar: true,
          kemaskini: false,
          padam: false,
        },
        {
          menu: "Dashboard",
          subMenu: "Eksekutif",
          cipta: false,
          papar: true,
          kemaskini: false,
          padam: false,
        },
        {
          menu: "Pengurusan Pengguna",
          subMenu: "Senarai Pengguna",
          cipta: true,
          papar: true,
          kemaskini: true,
          padam: true,
        },
        {
          menu: "Pengurusan Pengguna",
          subMenu: "Peranan",
          cipta: true,
          papar: true,
          kemaskini: true,
          padam: true,
        },
        {
          menu: "Pengurusan Pengguna",
          subMenu: "Kebenaran",
          cipta: true,
          papar: true,
          kemaskini: true,
          padam: true,
        },
        {
          menu: "Perkhidmatan Pelanggan",
          subMenu: "Aduan",
          cipta: true,
          papar: true,
          kemaskini: true,
          padam: true,
        },
        {
          menu: "Perkhidmatan Pelanggan",
          subMenu: "Pertanyaan",
          cipta: true,
          papar: true,
          kemaskini: true,
          padam: true,
        },
        {
          menu: "Perkhidmatan Pelanggan",
          subMenu: "Maklumat Pelanggan",
          cipta: true,
          papar: true,
          kemaskini: true,
          padam: true,
        },
        {
          menu: "Operasi",
          subMenu: "Penyelenggaraan",
          cipta: true,
          papar: true,
          kemaskini: true,
          padam: true,
        },
        {
          menu: "Operasi",
          subMenu: "Inventori",
          cipta: true,
          papar: true,
          kemaskini: true,
          padam: true,
        },
        {
          menu: "Operasi",
          subMenu: "Jadual Kerja",
          cipta: true,
          papar: true,
          kemaskini: true,
          padam: true,
        },
        {
          menu: "Pentadbiran",
          subMenu: "Dokumen",
          cipta: true,
          papar: true,
          kemaskini: true,
          padam: true,
        },
        {
          menu: "Pentadbiran",
          subMenu: "Tetapan Sistem",
          cipta: true,
          papar: true,
          kemaskini: true,
          padam: true,
        },
        {
          menu: "Laporan",
          subMenu: "Laporan Aduan",
          cipta: true,
          papar: true,
          kemaskini: true,
          padam: false,
        },
        {
          menu: "Laporan",
          subMenu: "Laporan Operasi",
          cipta: true,
          papar: true,
          kemaskini: true,
          padam: false,
        },
        {
          menu: "Laporan",
          subMenu: "Laporan Prestasi",
          cipta: true,
          papar: true,
          kemaskini: true,
          padam: false,
        },
      ];
    }

    permissions.value = data;
    // Create a deep copy to track changes
    originalPermissions.value = JSON.parse(JSON.stringify(data));

    // Update summary
    updateSummary();

    refreshTable();
  } catch (error) {
    console.error("Error loading permissions:", error);
  }
};

const handleCheckboxChange = async () => {};

// Load initial data
onMounted(() => {
  if (selectedRole.value) {
    loadRolePermissions();
  }
});
</script>
