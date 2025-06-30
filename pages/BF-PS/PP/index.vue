<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

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
            >
              <Icon name="ic:baseline-refresh" class="mr-1" />
              Muat Semula
            </rs-button>
            <rs-button
              variant="outline"
              @click="exportToExcel"
              :loading="exporting"
            >
              <Icon name="ic:baseline-table-chart" class="mr-1" />
              Muat Turun Excel
            </rs-button>
            <rs-button
              variant="outline"
              @click="navigateTo('/BF-PS/PP/02')"
            >
              <Icon name="ic:baseline-settings" class="mr-1" />
              Cipta Akaun
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

    <!-- Edit User Modal -->
    <rs-modal v-model="showEditModal" size="lg">
      <rs-card>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Kemaskini Pengguna</h3>
            <rs-button
              variant="ghost"
              @click="showEditModal = false"
            >
              <Icon name="ic:baseline-close" />
            </rs-button>
          </div>
        </template>

        <template #body>
          <form @submit.prevent="saveUser" class="space-y-6">
            <!-- Maklumat Pengguna -->
            <div>
              <h4 class="text-md font-medium mb-4">Maklumat Pengguna</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormKit
                  v-model="editForm.jenisPengguna"
                  type="select"
                  label="Jenis Pengguna"
                  :options="jenisPenggunaOptions"
                  validation="required"
                />
                
                <FormKit
                  v-model="editForm.idPengguna"
                  type="text"
                  label="ID Pengguna"
                  disabled
                />
                
                <FormKit
                  v-model="editForm.nama"
                  type="text"
                  label="Nama"
                  validation="required"
                />
                
                <FormKit
                  v-model="editForm.noKp"
                  type="text"
                  label="No. KP / Passport / Foreign ID"
                  validation="required"
                />
                
                <FormKit
                  v-model="editForm.emel"
                  type="email"
                  label="Emel"
                  validation="required|email"
                />
                
                <FormKit
                  v-model="editForm.noTel"
                  type="text"
                  label="No. Tel Bimbit"
                />
                
                <FormKit
                  v-model="editForm.status"
                  type="select"
                  label="Status"
                  :options="statusOptions"
                  validation="required"
                />
              </div>
            </div>

            <!-- Senarai Peranan Pengguna -->
            <div>
              <h4 class="text-md font-medium mb-4">Senarai Peranan Pengguna</h4>
              <div class="space-y-3">
                <div
                  v-for="(peranan, index) in filteredPeranan"
                  :key="peranan.id"
                  class="flex items-center gap-4 p-3 border rounded-lg"
                >
                  <span class="w-8 text-sm text-gray-500">{{ index + 1 }}</span>
                  <span class="flex-1">{{ peranan.nama }}</span>
                  <FormKit
                    v-model="peranan.selected"
                    type="checkbox"
                    @change="updatePerananSemasa"
                  />
                  <FormKit
                    v-model="editForm.perananSemasa"
                    type="radio"
                    :value="peranan.id"
                    :disabled="!peranan.selected"
                  />
                </div>
              </div>
            </div>
          </form>
        </template>

        <template #footer>
          <div class="flex justify-end gap-3">
            <rs-button
              variant="ghost"
              @click="showEditModal = false"
            >
              Batal
            </rs-button>
            <rs-button
              variant="primary"
              @click="saveUser"
              :loading="saving"
            >
              Simpan
            </rs-button>
          </div>
        </template>
      </rs-card>
    </rs-modal>
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
  { label: "Staf", value: "Staf" },
  { label: "Bukan Staf", value: "Bukan Staf" },
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
const showEditModal = ref(false);
const saving = ref(false);
const exporting = ref(false);
const selectedUser = ref(null);

// Form data for editing
const editForm = ref({
  idPengguna: '',
  jenisPengguna: '',
  nama: '',
  noKp: '',
  emel: '',
  noTel: '',
  status: '',
  perananSemasa: ''
});

// Mock data - consistent with other pages
const users = ref([
  {
    id: 1,
    jenisPengguna: 'Staf',
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
    jenisPengguna: 'Bukan Staf',
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
    jenisPengguna: 'Staf',
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
    jenisPengguna: 'Staf',
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
    jenisPengguna: 'Bukan Staf',
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
    jenisPengguna: 'Staf',
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
    jenisPengguna: 'Bukan Staf',
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
    jenisPengguna: 'Staf',
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
  { id: 1, nama: 'Admin Sistem', jenisPengguna: 'Staf', selected: false },
  { id: 2, nama: 'Pegawai Bantuan', jenisPengguna: 'Bukan Staf', selected: false },
  { id: 3, nama: 'Pegawai Sistem', jenisPengguna: 'Staf', selected: false },
  { id: 4, nama: 'Pegawai Audit', jenisPengguna: 'Staf', selected: false },
  { id: 5, nama: 'Pegawai Lapangan', jenisPengguna: 'Bukan Staf', selected: false },
  { id: 6, nama: 'Pengguna Awam', jenisPengguna: 'Bukan Staf', selected: false },
  { id: 7, nama: 'Pegawai Pentadbir', jenisPengguna: 'Staf', selected: false }
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
    jenisPengguna: user.jenisPengguna,
    nama: user.nama,
    noKp: user.noKp,
    emel: user.emel,
    perananSemasa: user.perananSemasa,
    jenisSumberData: user.jenisSumberData,
    status: user.status,
    tindakan: user // Keep the full user object for action buttons
  }));
});

const totalUsers = computed(() => filteredUsers.value.length);
const totalPages = computed(() => Math.ceil(totalUsers.value / pageSize.value));
const paginationStart = computed(() => (currentPage.value - 1) * pageSize.value + 1);
const paginationEnd = computed(() => Math.min(currentPage.value * pageSize.value, totalUsers.value));

const filteredPeranan = computed(() => {
  return perananList.value.filter(peranan => 
    peranan.jenisPengguna === editForm.value.jenisPengguna || 
    editForm.value.jenisPengguna === ''
  );
});

// Methods
const editUser = (user) => {
  selectedUser.value = user;
  editForm.value = {
    idPengguna: user.noKp,
    jenisPengguna: user.jenisPengguna,
    nama: user.nama,
    noKp: user.noKp,
    emel: user.emel,
    noTel: user.noTel || '',
    status: user.status,
    perananSemasa: ''
  };
  
  // Reset peranan selection
  perananList.value.forEach(p => p.selected = false);
  
  showEditModal.value = true;
};

const deleteUser = async (user) => {
  const confirmed = await $confirm({
    title: 'Sahkan Hapus',
    message: `Adakah anda pasti mahu menghapuskan pengguna "${user.nama}"?`,
    confirmText: 'Hapus',
    cancelText: 'Batal',
    color: 'red'
  });

  if (confirmed) {
    try {
      // Remove from local array
      const index = users.value.findIndex(u => u.id === user.id);
      if (index > -1) {
        users.value.splice(index, 1);
      }
      
      $toast.success('Pengguna berjaya dihapuskan');
    } catch (error) {
      $toast.error('Ralat semasa menghapuskan pengguna');
    }
  }
};

const canDeleteUser = (user) => {
  // Check if user has related records
  // This is a placeholder - implement actual logic
  return true;
};

const updatePerananSemasa = () => {
  // Ensure only one peranan semasa is selected
  const selectedPeranan = perananList.value.filter(p => p.selected);
  if (selectedPeranan.length === 1) {
    editForm.value.perananSemasa = selectedPeranan[0].id;
  }
};

const saveUser = async () => {
  try {
    saving.value = true;
    
    // Update local data
    const index = users.value.findIndex(u => u.id === selectedUser.value.id);
    if (index > -1) {
      users.value[index] = {
        ...users.value[index],
        ...editForm.value
      };
    }
    
    $toast.success('Pengguna berjaya dikemaskini');
    showEditModal.value = false;
  } catch (error) {
    $toast.error('Ralat semasa menyimpan pengguna');
  } finally {
    saving.value = false;
  }
};

const refreshData = () => {
  // Simulate data refresh
  $toast.info('Data telah dimuat semula');
};

const exportToExcel = async () => {
  try {
    exporting.value = true;
    
    // Simulate export delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create mock download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `Senarai_Pengguna_${new Date().toISOString().split('T')[0]}.xlsx`;
    link.click();
    
    $toast.success('Laporan Excel berjaya dimuat turun');
  } catch (error) {
    $toast.error('Ralat semasa memuat turun laporan');
  } finally {
    exporting.value = false;
  }
};
</script>

<style scoped>
/* Custom styles if needed */
</style>