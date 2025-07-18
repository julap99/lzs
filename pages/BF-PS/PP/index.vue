<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Header Notice -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div class="flex items-center gap-2">
        <Icon name="ic:baseline-people" class="text-blue-600" />
        <div class="text-sm text-blue-800">
          <p class="font-medium">Pengurusan Pengguna Sistem</p>
          <p>Senarai lengkap pengguna dalam sistem dengan fungsi carian, kemaskini, dan pengurusan peranan.</p>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg stats-card fade-in">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blue-100 text-sm">Jumlah Pengguna</p>
            <p class="text-2xl font-bold">{{ totalUsers }}</p>
          </div>
          <Icon name="ic:baseline-people" class="w-8 h-8 text-blue-200" />
        </div>
      </div>
      <div class="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg stats-card fade-in">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-100 text-sm">Pengguna Aktif</p>
            <p class="text-2xl font-bold">{{ activeUsers }}</p>
          </div>
          <Icon name="ic:baseline-check-circle" class="w-8 h-8 text-green-200" />
        </div>
      </div>
      <div class="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg stats-card fade-in">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-orange-100 text-sm">Staf Sistem</p>
            <p class="text-2xl font-bold">{{ staffUsers }}</p>
          </div>
          <Icon name="ic:baseline-badge" class="w-8 h-8 text-orange-200" />
        </div>
      </div>
      <div class="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg stats-card fade-in">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-purple-100 text-sm">Peranan Unik</p>
            <p class="text-2xl font-bold">{{ uniqueRoles }}</p>
          </div>
          <Icon name="ic:baseline-security" class="w-8 h-8 text-purple-200" />
        </div>
      </div>
    </div>

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-4">
            <h2 class="text-xl font-semibold">Senarai Pengguna</h2>
            <rs-badge variant="primary">{{ totalUsers }} pengguna</rs-badge>
          </div>
          <div class="flex gap-2">
            <rs-button
              variant="outline"
              @click="refreshData"
              :loading="refreshing"
            >
              <Icon name="ic:baseline-refresh" class="mr-1" />
              {{ refreshing ? 'Memuat...' : 'Muat Semula' }}
            </rs-button>
            <rs-button
              variant="outline"
              @click="exportToExcel"
              :loading="exporting"
            >
              <Icon name="ic:baseline-table-chart" class="mr-1" />
              {{ exporting ? 'Mengeksport...' : 'Muat Turun Excel' }}
            </rs-button>

            <rs-button
              variant="primary"
              @click="navigateTo('/BF-PS/PP/01')"
            >
              <Icon name="ic:baseline-person-add" class="mr-1" />
              Daftar Pengguna Baharu
            </rs-button>
          </div>
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
                placeholder="Cari nama, No. KP, atau emel..."
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
            <div class="flex gap-2">
              <FormKit
                v-model="filters.jenisPengguna"
                type="select"
                :options="jenisPenggunaOptions"
                placeholder="Jenis Pengguna"
                :classes="{
                  input: '!py-2',
                }"
              />
              <FormKit
                v-model="filters.status"
                type="select"
                :options="statusOptions"
                placeholder="Status"
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
          </div>
        </div>

        <!-- Users Table -->
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
            filterable: true,
          }"
          advanced
        >
          <template v-slot:jenisPengguna="{ text }">
            <rs-badge :variant="text === 'Staf' ? 'primary' : 'success'">
              {{ text }}
            </rs-badge>
          </template>

          <template v-slot:status="{ text }">
            <rs-badge :variant="text === 'Aktif' ? 'success' : 'danger'">
              {{ text }}
            </rs-badge>
          </template>

          <template v-slot:jenisSumberData="{ text }">
            <rs-badge variant="info">{{ text }}</rs-badge>
          </template>

          <template v-slot:tindakan="{ text }">
            <div class="flex justify-center items-center gap-2">
              <rs-button
                variant="primary"
                size="sm"
                @click="editUser(text)"
                title="Kemaskini"
              >
                <Icon name="ic:baseline-edit" class="w-4 h-4" />
              </rs-button>
              <rs-button
                variant="danger"
                size="sm"
                @click="deleteUser(text)"
                :disabled="!canDeleteUser(text)"
                title="Hapus"
              >
                <Icon name="ic:baseline-delete" class="w-4 h-4" />
              </rs-button>
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
              {{ paginationEnd }} daripada {{ totalUsers }} entri
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



    <!-- Success Modal for Operations -->
    <rs-modal
      v-model="showSuccessModal"
      title="Operasi Berjaya"
      size="md"
      position="center"
    >
      <template #body>
        <div class="text-center py-6">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="ic:baseline-check-circle" class="w-8 h-8 text-green-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Operasi Selesai!</h3>
          <p class="text-gray-600 mb-4">{{ successMessage }}</p>
          <div class="bg-blue-50 p-3 rounded-lg text-sm">
            <p class="font-medium text-blue-900">Sistem telah dikemaskini</p>
            <p class="text-blue-700">Data pengguna telah disegerakkan</p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center">
          <rs-button variant="primary" @click="showSuccessModal = false">
            <Icon name="ic:baseline-check" class="mr-1" />
            Terima Kasih
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Export Modal -->
    <rs-modal
      v-model="showExportModal"
      title="Eksport Data Pengguna"
      size="md"
      position="center"
    >
      <template #body>
        <div class="text-center py-6">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="ic:baseline-download-done" class="w-8 h-8 text-blue-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Eksport Excel Berjaya</h3>
          <p class="text-gray-600 mb-4">Fail senarai pengguna telah dijana dengan jayanya</p>
          
          <!-- Mock Progress Bar -->
          <div class="bg-gray-200 rounded-full h-2 mb-4">
            <div class="bg-blue-600 h-2 rounded-full transition-all duration-1000" :style="{ width: exportProgress + '%' }"></div>
          </div>
          
          <div class="bg-green-50 p-3 rounded-lg text-sm">
            <p class="font-medium text-green-900">📊 Fail siap untuk dimuat turun</p>
            <p class="text-green-700">Format: XLSX | Saiz: {{ exportFileSize }} | {{ totalUsers }} rekod</p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center space-x-3">
          <rs-button variant="outline" @click="showExportModal = false">
            Tutup
          </rs-button>
          <rs-button variant="success" @click="simulateDownload">
            <Icon name="ic:baseline-download" class="mr-1" />
            Muat Turun
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Delete Confirmation Modal -->
    <rs-modal
      v-model="showDeleteModal"
      title="Pengesahan Hapus Pengguna"
      size="sm"
      position="center"
    >
      <template #body>
        <div class="text-center py-4">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="ic:baseline-warning" class="w-8 h-8 text-red-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Hapus Pengguna</h3>
          <p class="text-gray-600 mb-4">Adakah anda pasti mahu menghapuskan pengguna <strong>"{{ userToDelete?.nama }}"</strong>?</p>
          <div class="bg-yellow-50 p-3 rounded-lg text-sm text-left">
            <p class="font-medium text-yellow-900">⚠️ Amaran:</p>
            <p class="text-yellow-800">Tindakan ini tidak boleh dibatalkan dan akan mempengaruhi:</p>
            <ul class="list-disc list-inside text-yellow-700 mt-1">
              <li>Akses pengguna ke sistem</li>
              <li>Rekod audit berkaitan</li>
              <li>Sejarah aktiviti</li>
            </ul>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center space-x-3">
          <rs-button variant="outline" @click="showDeleteModal = false">
            Batal
          </rs-button>
          <rs-button variant="danger" @click="confirmDelete" :loading="deleting">
            <Icon name="ic:baseline-delete-forever" class="mr-1" />
            {{ deleting ? 'Menghapus...' : 'Ya, Hapus' }}
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Loading Overlay -->
    <div v-if="refreshing" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-sm mx-4">
        <div class="text-center">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="ic:baseline-sync" class="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Memuat Semula Data</h3>
          <p class="text-gray-600 mb-4">Sila tunggu sebentar...</p>
          
          <!-- Progress Steps -->
          <div class="space-y-2 text-left">
            <div class="flex items-center text-sm">
              <Icon name="ic:baseline-check-circle" class="w-4 h-4 text-green-500 mr-2" />
              <span class="text-green-700">Menghubungi pangkalan data</span>
            </div>
            <div class="flex items-center text-sm">
              <Icon name="ic:baseline-sync" class="w-4 h-4 text-blue-500 mr-2 animate-spin" />
              <span class="text-blue-700">Mengemas kini senarai pengguna</span>
            </div>
            <div class="flex items-center text-sm text-gray-400">
              <Icon name="ic:baseline-radio-button-unchecked" class="w-4 h-4 mr-2" />
              <span>Menyusun data terkini</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

definePageMeta({
  title: "Senarai Pengguna",
});

const breadcrumb = ref([
  {
    name: "Pentadbir Sistem",
    type: "link",
    path: "/BF-PS",
  },
  {
    name: "Pengurusan Pengguna",
    type: "link",
    path: "/BF-PS/PP",
  },
  {
    name: "Senarai Pengguna",
    type: "current",
    path: "/BF-PS/PP",
  },
]);

// Table columns configuration
const columns = [
  {
    key: "jenisPengguna",
    label: "Jenis Pengguna",
    sortable: true,
  },
  {
    key: "nama",
    label: "Nama",
    sortable: true,
  },
  {
    key: "noKp",
    label: "No. KP/Passport/Foreign ID",
    sortable: true,
  },
  {
    key: "emel",
    label: "Emel",
    sortable: true,
  },
  {
    key: "perananSemasa",
    label: "Peranan Semasa",
    sortable: true,
  },
  {
    key: "jenisSumberData",
    label: "Jenis Sumber Data",
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

// Options for filters
const jenisPenggunaOptions = [
  { label: "Semua", value: "" },
  { label: "Staf", value: "AD" },
  { label: "Bukan Staf", value: "NPS" },
];

const statusOptions = [
  { label: "Semua", value: "" },
  { label: "Aktif", value: "Aktif" },
  { label: "Tidak Aktif", value: "Tidak Aktif" },
];

// State
const searchQuery = ref("");
const filters = ref({
  jenisPengguna: "",
  status: "",
});
const currentPage = ref(1);
const pageSize = ref(10);
const saving = ref(false);
const exporting = ref(false);
const refreshing = ref(false);
const deleting = ref(false);

// New modal states
const showSuccessModal = ref(false);
const showExportModal = ref(false);
const showDeleteModal = ref(false);
const successMessage = ref('');
const exportProgress = ref(0);
const exportFileSize = ref('');
const userToDelete = ref(null);



// Mock data - consistent with other pages
const users = ref([
  {
    id: 1,
    jenisPengguna: 'AD',
    nama: 'Ahmad bin Abdullah',
    noKp: '800101015432',
    emel: 'ahmad.abdullah@nas.gov.my',
    perananSemasa: 'Admin Sistem',
    jenisSumberData: 'NAS',
    status: 'Aktif',
    noTel: '012-3456789'
  },
  {
    id: 2,
    jenisPengguna: 'NPS',
    nama: 'Siti binti Mohamed',
    noKp: '850505025678',
    emel: 'siti.mohamed@example.com',
    perananSemasa: 'Pegawai Bantuan',
    jenisSumberData: 'AD',
    status: 'Aktif',
    noTel: '013-4567890'
  },
  {
    id: 3,
    jenisPengguna: 'AD',
    nama: 'Mohd Ali bin Hassan',
    noKp: '820202036789',
    emel: 'ali.hassan@nas.gov.my',
    perananSemasa: 'Pegawai Sistem',
    jenisSumberData: 'NPS',
    status: 'Tidak Aktif',
    noTel: '014-5678901'
  },
  {
    id: 4,
    jenisPengguna: 'AD',
    nama: 'Nurul Ain binti Ibrahim',
    noKp: '870707047890',
    emel: 'nurul.ain@nas.gov.my',
    perananSemasa: 'Pegawai Audit',
    jenisSumberData: 'NAS',
    status: 'Aktif',
    noTel: '015-6789012'
  },
  {
    id: 5,
    jenisPengguna: 'NPS',
    nama: 'Abdul Rahman bin Sulaiman',
    noKp: '830303038901',
    emel: 'abdul.rahman@example.com',
    perananSemasa: 'Pegawai Lapangan',
    jenisSumberData: 'AD',
    status: 'Aktif',
    noTel: '016-7890123'
  },
  {
    id: 6,
    jenisPengguna: 'AD',
    nama: 'Fatimah binti Ahmad',
    noKp: '860606069012',
    emel: 'fatimah.ahmad@nas.gov.my',
    perananSemasa: 'Pegawai Pentadbir',
    jenisSumberData: 'NPS',
    status: 'Aktif',
    noTel: '017-8901234'
  },
  {
    id: 7,
    jenisPengguna: 'Awam',
    nama: 'Ismail bin Omar',
    noKp: '840404049123',
    emel: 'ismail.omar@example.com',
    perananSemasa: 'Pengguna Awam',
    jenisSumberData: 'Awam',
    status: 'Tidak Aktif',
    noTel: '018-9012345'
  },
  {
    id: 8,
    jenisPengguna: 'AD',
    nama: 'Zainab binti Yusof',
    noKp: '880808089234',
    emel: 'zainab.yusof@nas.gov.my',
    perananSemasa: 'Admin Sistem',
    jenisSumberData: 'NAS',
    status: 'Aktif',
    noTel: '019-0123456'
  }
]);

// Peranan data
const perananList = ref([
  { id: 1, nama: 'Admin Sistem', jenisPengguna: 'AD', selected: false },
  { id: 2, nama: 'Pegawai Bantuan', jenisPengguna: 'NPS', selected: false },
  { id: 3, nama: 'Pegawai Sistem', jenisPengguna: 'AD', selected: false },
  { id: 4, nama: 'Pegawai Audit', jenisPengguna: 'AD', selected: false },
  { id: 5, nama: 'Pegawai Lapangan', jenisPengguna: 'NPS', selected: false },
  { id: 6, nama: 'Pengguna Awam', jenisPengguna: 'Awam', selected: false },
  { id: 7, nama: 'Pegawai Pentadbir', jenisPengguna: 'AD', selected: false },
  { id: 8, nama: 'Pegawai Khas', jenisPengguna: 'NPS', selected: false }
]);

// Computed properties
const filteredUsers = computed(() => {
  let filtered = users.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(user => 
      user.nama.toLowerCase().includes(query) ||
      user.noKp.toLowerCase().includes(query) ||
      user.emel.toLowerCase().includes(query)
    );
  }

  if (filters.value.jenisPengguna) {
    filtered = filtered.filter(user => user.jenisPengguna === filters.value.jenisPengguna);
  }

  if (filters.value.status) {
    filtered = filtered.filter(user => user.status === filters.value.status);
  }

  return filtered;
});

const tableData = computed(() => {
  return filteredUsers.value.map(user => ({
    jenisPengguna: getJenisPenggunaDisplay(user.jenisPengguna),
    nama: user.nama,
    noKp: user.noKp,
    emel: user.emel,
    perananSemasa: user.perananSemasa,
    jenisSumberData: user.jenisSumberData,
    status: user.status,
    tindakan: user // Keep the full user object for action buttons
  }));
});

// Helper function to convert technical jenisPengguna to display value
const getJenisPenggunaDisplay = (jenisPengguna) => {
  switch (jenisPengguna) {
    case 'AD':
      return 'Staf';
    case 'NPS':
    case 'Awam':
      return 'Bukan Staf';
    default:
      return jenisPengguna;
  }
};

const totalUsers = computed(() => filteredUsers.value.length);
const totalPages = computed(() => Math.ceil(totalUsers.value / pageSize.value));
const paginationStart = computed(() => (currentPage.value - 1) * pageSize.value + 1);
const paginationEnd = computed(() => Math.min(currentPage.value * pageSize.value, totalUsers.value));

// Statistics computed properties
const activeUsers = computed(() => {
  return users.value.filter(user => user.status === 'Aktif').length;
});

const staffUsers = computed(() => {
  return users.value.filter(user => user.jenisPengguna === 'AD').length;
});

const uniqueRoles = computed(() => {
  const roles = new Set(users.value.map(user => user.perananSemasa));
  return roles.size;
});



// Methods
const editUser = (user) => {
  // Navigate to PP/01 with edit mode and user ID
  navigateTo(`/BF-PS/PP/01?mode=edit&userId=${user.id}`);
};

const deleteUser = (user) => {
  userToDelete.value = user;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  try {
    deleting.value = true;
    
    // Simulate deletion delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Remove from local array
    const index = users.value.findIndex(u => u.id === userToDelete.value.id);
    if (index > -1) {
      users.value.splice(index, 1);
    }
    
    showDeleteModal.value = false;
    successMessage.value = `Pengguna "${userToDelete.value.nama}" telah berjaya dihapuskan dari sistem.`;
    showSuccessModal.value = true;
    
  } catch (error) {
    console.error('Error deleting user:', error);
    successMessage.value = 'Ralat berlaku semasa menghapuskan pengguna. Sila cuba lagi.';
    showSuccessModal.value = true;
  } finally {
    deleting.value = false;
    userToDelete.value = null;
  }
};

const canDeleteUser = (user) => {
  // Check if user has related records
  // This is a placeholder - implement actual logic
  return true;
};



const refreshData = async () => {
  try {
    refreshing.value = true;
    
    // Simulate data refresh delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In real implementation, this would fetch fresh data from API
    // For demo, we'll just show success
    successMessage.value = `Data pengguna telah dimuat semula. ${totalUsers.value} rekod dikemaskini.`;
    showSuccessModal.value = true;
    
  } catch (error) {
    console.error('Error refreshing data:', error);
    successMessage.value = 'Ralat berlaku semasa memuat semula data. Sila cuba lagi.';
    showSuccessModal.value = true;
  } finally {
    refreshing.value = false;
  }
};

const exportToExcel = async () => {
  try {
    exporting.value = true;
    exportProgress.value = 0;
    exportFileSize.value = `${Math.round(totalUsers.value * 0.02)}KB`;
    
    // Show export modal with progress
    showExportModal.value = true;
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      exportProgress.value += 25;
      if (exportProgress.value >= 100) {
        clearInterval(progressInterval);
      }
    }, 400);
    
    // Simulate export delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
  } catch (error) {
    console.error('Error exporting data:', error);
    showExportModal.value = false;
    successMessage.value = 'Ralat berlaku semasa mengeksport data. Sila cuba lagi.';
    showSuccessModal.value = true;
  } finally {
    exporting.value = false;
  }
};

const simulateDownload = () => {
  console.log(`💾 Simulating Excel download: Senarai_Pengguna_${new Date().toISOString().split('T')[0]}.xlsx`);
  showExportModal.value = false;
  successMessage.value = `Fail Excel dengan ${totalUsers.value} rekod pengguna telah berjaya dimuat turun.`;
  showSuccessModal.value = true;
  
  // Reset progress for next use
  exportProgress.value = 0;
};
</script>

<style scoped>
/* Statistics cards hover effects */
.stats-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Presentation enhancements */
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

/* Button hover animations */
.btn-enhanced {
  transition: all 0.2s ease-in-out;
}

.btn-enhanced:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Progress bar animation */
.progress-bar {
  transition: width 0.3s ease-in-out;
}
</style>