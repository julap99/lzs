<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-4">
            <h2 class="text-xl font-semibold">Audit Pengguna</h2>
            <rs-badge variant="info">{{ totalRecords }} rekod audit</rs-badge>
          </div>
          <div class="flex gap-2">
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
              @click="exportToPDF"
              :loading="exporting"
            >
              <Icon name="ic:baseline-picture-as-pdf" class="mr-1" />
              Muat Turun PDF
            </rs-button>
            <rs-button
              variant="primary"
              @click="printReport"
            >
              <Icon name="ic:baseline-print" class="mr-1" />
              Cetak
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>
        <!-- Search and Filter Panel -->
        <div class="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 class="text-lg font-semibold mb-4">Panel Carian & Penapis</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormKit
              v-model="filters.namaPengguna"
              type="text"
              label="Nama Pengguna"
              placeholder="Cari nama pengguna..."
            />
            
            <FormKit
              v-model="filters.idPengguna"
              type="text"
              label="ID Pengguna (No KP)"
              placeholder="Cari No KP..."
            />
            
            <FormKit
              v-model="filters.peranan"
              type="select"
              label="Peranan"
              :options="perananOptions"
              placeholder="Pilih peranan..."
            />
            
            <FormKit
              v-model="filters.modul"
              type="select"
              label="Modul"
              :options="modulOptions"
              placeholder="Pilih modul..."
            />
            
            <FormKit
              v-model="filters.tarikhMula"
              type="date"
              label="Tarikh Mula"
            />
            
            <FormKit
              v-model="filters.tarikhAkhir"
              type="date"
              label="Tarikh Akhir"
            />
          </div>
          
          <div class="flex gap-3 mt-4">
            <rs-button
              variant="primary"
              @click="searchAuditLogs"
              :loading="searching"
            >
              <Icon name="ic:baseline-search" class="mr-1" />
              Cari
            </rs-button>
            <rs-button
              variant="ghost"
              @click="resetFilters"
            >
              <Icon name="ic:baseline-refresh" class="mr-1" />
              Reset
            </rs-button>
          </div>
        </div>

        <!-- Audit Log Table -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-4">Jejak Audit Pengguna</h3>
          
          <rs-table
            :data="filteredAuditLogs"
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
            <template v-slot:namaPengguna="{ text, row }">
              <button
                class="text-primary hover:underline font-medium"
                @click="viewUserDetails(row)"
              >
                {{ text }}
              </button>
            </template>

            <template v-slot:peranan="{ text }">
              <rs-badge variant="primary">{{ text }}</rs-badge>
            </template>

            <template v-slot:modul="{ text }">
              <rs-badge :variant="getModulVariant(text)">{{ text }}</rs-badge>
            </template>

            <template v-slot:tindakan="{ text }">
              <span class="text-sm">{{ text }}</span>
            </template>

            <template v-slot:tarikhMasa="{ text }">
              <span class="text-sm whitespace-nowrap">{{ text }}</span>
            </template>
          </rs-table>

          <!-- Pagination -->
          <div class="flex items-center justify-between px-5 mt-4">
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-700">Baris per halaman:</span>
              <FormKit
                v-model="pageSize"
                type="select"
                :options="[10, 25, 50, 100]"
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
                {{ paginationEnd }} daripada {{ totalRecords }} entri
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
        </div>
      </template>
    </rs-card>

    <!-- User Details Side Panel -->
    <rs-modal v-model="showUserDetails" size="xl">
      <rs-card>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Maklumat Terperinci Pengguna</h3>
            <rs-button
              variant="ghost"
              @click="showUserDetails = false"
            >
              <Icon name="ic:baseline-close" />
            </rs-button>
          </div>
        </template>

        <template #body>
          <div v-if="selectedUser" class="space-y-6">
            <!-- Basic User Information -->
            <div>
              <h4 class="text-md font-medium mb-3 border-b pb-2">Maklumat Asas Pengguna</h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-sm font-medium text-gray-600">Nama Pengguna</label>
                  <p class="text-gray-900">{{ selectedUser.namaPengguna }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-600">ID Pengguna</label>
                  <p class="text-gray-900 font-mono">{{ selectedUser.idPengguna }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-600">Status Akaun</label>
                  <rs-badge :variant="selectedUser.statusAkaun === 'Aktif' ? 'success' : 'danger'">
                    {{ selectedUser.statusAkaun }}
                  </rs-badge>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-600">Peranan Semasa</label>
                  <p class="text-gray-900">{{ selectedUser.perananSemasa }}</p>
                </div>
              </div>
            </div>

            <!-- Role History -->
            <div>
              <h4 class="text-md font-medium mb-3 border-b pb-2">Sejarah Perubahan Peranan</h4>
              <div class="space-y-3">
                <div
                  v-for="(role, index) in selectedUser.sejarahPeranan"
                  :key="index"
                  class="flex items-center gap-4 p-3 border rounded-lg"
                >
                  <div class="flex-1">
                    <p class="font-medium">{{ role.peranan }}</p>
                    <p class="text-sm text-gray-600">{{ role.tarikhPerubahan }}</p>
                  </div>
                  <rs-badge variant="info">{{ role.status }}</rs-badge>
                </div>
              </div>
            </div>

            <!-- Module Access -->
            <div>
              <h4 class="text-md font-medium mb-3 border-b pb-2">Akses Modul</h4>
              <div class="grid grid-cols-2 gap-4">
                <div
                  v-for="module in selectedUser.aksesModul"
                  :key="module.nama"
                  class="flex items-center gap-2 p-2 border rounded"
                >
                  <Icon 
                    :name="getModuleIcon(module.nama)" 
                    :class="module.aktif ? 'text-green-600' : 'text-gray-400'"
                  />
                  <span class="text-sm">{{ module.nama }}</span>
                  <rs-badge :variant="module.aktif ? 'success' : 'gray'" size="sm">
                    {{ module.aktif ? 'Aktif' : 'Tidak Aktif' }}
                  </rs-badge>
                </div>
              </div>
            </div>

            <!-- Recent Activities -->
            <div>
              <h4 class="text-md font-medium mb-3 border-b pb-2">Aktiviti Terkini</h4>
              <div class="space-y-2 max-h-60 overflow-y-auto">
                <div
                  v-for="activity in selectedUser.aktivitiTerkini"
                  :key="activity.id"
                  class="flex items-start gap-3 p-2 border rounded"
                >
                  <Icon 
                    :name="getActivityIcon(activity.tindakan)" 
                    class="text-blue-600 mt-0.5"
                  />
                  <div class="flex-1">
                    <p class="text-sm font-medium">{{ activity.tindakan }}</p>
                    <p class="text-xs text-gray-600">{{ activity.modul }} • {{ activity.tarikhMasa }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template #footer>
          <div class="flex justify-end gap-3">
            <rs-button
              variant="ghost"
              @click="showUserDetails = false"
            >
              Tutup
            </rs-button>
            <rs-button
              variant="primary"
              @click="exportUserReport"
            >
              <Icon name="ic:baseline-download" class="mr-1" />
              Muat Turun Laporan Pengguna
            </rs-button>
          </div>
        </template>
      </rs-card>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

definePageMeta({
  title: "Audit Pengguna",
});

const breadcrumb = ref([
  {
    name: "Pentadbir Sistem",
    type: "link",
    path: "/BF-PS",
  },
  {
    name: "Pengurusan Jejak Audit",
    type: "link",
    path: "/BF-PS/PAT",
  },
  {
    name: "Audit Pengguna",
    type: "current",
    path: "/BF-PS/PP/03",
  },
]);

// States
const searching = ref(false);
const exporting = ref(false);
const showUserDetails = ref(false);
const selectedUser = ref(null);
const currentPage = ref(1);
const pageSize = ref(25);

// Filters
const filters = ref({
  namaPengguna: '',
  idPengguna: '',
  peranan: '',
  modul: '',
  tarikhMula: '',
  tarikhAkhir: ''
});

// Options for filters
const perananOptions = [
  { label: 'Semua', value: '' },
  { label: 'Admin Sistem', value: 'Admin Sistem' },
  { label: 'Pegawai Bantuan', value: 'Pegawai Bantuan' },
  { label: 'Pegawai Sistem', value: 'Pegawai Sistem' },
  { label: 'Pegawai Audit', value: 'Pegawai Audit' },
  { label: 'Pegawai Lapangan', value: 'Pegawai Lapangan' }
];

const modulOptions = [
  { label: 'Semua', value: '' },
  { label: 'Profil', value: 'Profil' },
  { label: 'Bantuan', value: 'Bantuan' },
  { label: 'Tuntutan', value: 'Tuntutan' },
  { label: 'Pengurusan Pengguna', value: 'Pengurusan Pengguna' },
  { label: 'Audit', value: 'Audit' }
];

// Table columns
const columns = [
  {
    key: "namaPengguna",
    label: "Nama Pengguna",
    sortable: true,
  },
  {
    key: "idPengguna",
    label: "ID Pengguna",
    sortable: true,
  },
  {
    key: "peranan",
    label: "Peranan",
    sortable: true,
  },
  {
    key: "modul",
    label: "Modul Diakses",
    sortable: true,
  },
  {
    key: "tindakan",
    label: "Tindakan",
    sortable: true,
  },
  {
    key: "tarikhMasa",
    label: "Tarikh & Masa",
    sortable: true,
  },
  {
    key: "pegawaiBertanggungjawab",
    label: "Pegawai Bertanggungjawab",
    sortable: true,
  },
];

// Mock audit log data
const auditLogs = ref([
  {
    id: 1,
    namaPengguna: 'Ahmad bin Abdullah',
    idPengguna: '800101015432',
    peranan: 'Admin Sistem',
    modul: 'Pengurusan Pengguna',
    tindakan: 'Mendaftar pengguna baharu',
    tarikhMasa: '2024-03-20 10:30:15',
    pegawaiBertanggungjawab: 'AdminNAS01',
    userId: 1
  },
  {
    id: 2,
    namaPengguna: 'Siti binti Mohamed',
    idPengguna: '850505025678',
    peranan: 'Pegawai Bantuan',
    modul: 'Bantuan',
    tindakan: 'Mengemaskini permohonan bantuan',
    tarikhMasa: '2024-03-20 09:15:22',
    pegawaiBertanggungjawab: 'PegawaiBantuan01',
    userId: 2
  },
  {
    id: 3,
    namaPengguna: 'Mohd Ali bin Hassan',
    idPengguna: '820202036789',
    peranan: 'Pegawai Sistem',
    modul: 'Profil',
    tindakan: 'Melihat maklumat profil',
    tarikhMasa: '2024-03-20 08:45:10',
    pegawaiBertanggungjawab: 'PegawaiSistem01',
    userId: 3
  },
  {
    id: 4,
    namaPengguna: 'Nurul Ain binti Ibrahim',
    idPengguna: '870707047890',
    peranan: 'Pegawai Audit',
    modul: 'Audit',
    tindakan: 'Mengakses laporan audit',
    tarikhMasa: '2024-03-19 16:20:45',
    pegawaiBertanggungjawab: 'PegawaiAudit01',
    userId: 4
  },
  {
    id: 5,
    namaPengguna: 'Abdul Rahman bin Sulaiman',
    idPengguna: '830303038901',
    peranan: 'Pegawai Lapangan',
    modul: 'Tuntutan',
    tindakan: 'Memproses tuntutan',
    tarikhMasa: '2024-03-19 14:30:18',
    pegawaiBertanggungjawab: 'PegawaiLapangan01',
    userId: 5
  },
  {
    id: 6,
    namaPengguna: 'Ahmad bin Abdullah',
    idPengguna: '800101015432',
    peranan: 'Admin Sistem',
    modul: 'Pengurusan Pengguna',
    tindakan: 'Mengemaskini peranan pengguna',
    tarikhMasa: '2024-03-19 11:15:30',
    pegawaiBertanggungjawab: 'AdminNAS01',
    userId: 1
  },
  {
    id: 7,
    namaPengguna: 'Fatimah binti Ahmad',
    idPengguna: '860606069012',
    peranan: 'Pegawai Pentadbir',
    modul: 'Profil',
    tindakan: 'Mendaftar profil baharu',
    tarikhMasa: '2024-03-19 10:45:12',
    pegawaiBertanggungjawab: 'PegawaiPentadbir01',
    userId: 6
  },
  {
    id: 8,
    namaPengguna: 'Ismail bin Omar',
    idPengguna: '840404049123',
    peranan: 'Pengguna Awam',
    modul: 'Bantuan',
    tindakan: 'Memohon bantuan',
    tarikhMasa: '2024-03-18 15:20:33',
    pegawaiBertanggungjawab: 'PenggunaAwam01',
    userId: 7
  }
]);

// Mock user details data
const userDetails = ref([
  {
    id: 1,
    namaPengguna: 'Ahmad bin Abdullah',
    idPengguna: '800101015432',
    statusAkaun: 'Aktif',
    perananSemasa: 'Admin Sistem',
    sejarahPeranan: [
      { peranan: 'Admin Sistem', tarikhPerubahan: '2024-01-15', status: 'Aktif' },
      { peranan: 'Pegawai Sistem', tarikhPerubahan: '2023-06-01', status: 'Tidak Aktif' }
    ],
    aksesModul: [
      { nama: 'Pengurusan Pengguna', aktif: true },
      { nama: 'Audit', aktif: true },
      { nama: 'Profil', aktif: true },
      { nama: 'Bantuan', aktif: true },
      { nama: 'Tuntutan', aktif: true }
    ],
    aktivitiTerkini: [
      { id: 1, tindakan: 'Mendaftar pengguna baharu', modul: 'Pengurusan Pengguna', tarikhMasa: '2024-03-20 10:30:15' },
      { id: 2, tindakan: 'Mengemaskini peranan pengguna', modul: 'Pengurusan Pengguna', tarikhMasa: '2024-03-19 11:15:30' },
      { id: 3, tindakan: 'Mengakses laporan audit', modul: 'Audit', tarikhMasa: '2024-03-18 14:20:45' }
    ]
  },
  {
    id: 2,
    namaPengguna: 'Siti binti Mohamed',
    idPengguna: '850505025678',
    statusAkaun: 'Aktif',
    perananSemasa: 'Pegawai Bantuan',
    sejarahPeranan: [
      { peranan: 'Pegawai Bantuan', tarikhPerubahan: '2024-02-01', status: 'Aktif' }
    ],
    aksesModul: [
      { nama: 'Bantuan', aktif: true },
      { nama: 'Profil', aktif: true },
      { nama: 'Tuntutan', aktif: false },
      { nama: 'Audit', aktif: false },
      { nama: 'Pengurusan Pengguna', aktif: false }
    ],
    aktivitiTerkini: [
      { id: 1, tindakan: 'Mengemaskini permohonan bantuan', modul: 'Bantuan', tarikhMasa: '2024-03-20 09:15:22' },
      { id: 2, tindakan: 'Melihat maklumat profil', modul: 'Profil', tarikhMasa: '2024-03-19 16:30:10' }
    ]
  }
]);

// Computed properties
const filteredAuditLogs = computed(() => {
  let filtered = auditLogs.value;

  if (filters.value.namaPengguna) {
    const query = filters.value.namaPengguna.toLowerCase();
    filtered = filtered.filter(log => 
      log.namaPengguna.toLowerCase().includes(query)
    );
  }

  if (filters.value.idPengguna) {
    const query = filters.value.idPengguna.toLowerCase();
    filtered = filtered.filter(log => 
      log.idPengguna.toLowerCase().includes(query)
    );
  }

  if (filters.value.peranan) {
    filtered = filtered.filter(log => log.peranan === filters.value.peranan);
  }

  if (filters.value.modul) {
    filtered = filtered.filter(log => log.modul === filters.value.modul);
  }

  if (filters.value.tarikhMula) {
    filtered = filtered.filter(log => log.tarikhMasa >= filters.value.tarikhMula);
  }

  if (filters.value.tarikhAkhir) {
    filtered = filtered.filter(log => log.tarikhMasa <= filters.value.tarikhAkhir);
  }

  return filtered;
});

const totalRecords = computed(() => filteredAuditLogs.value.length);
const totalPages = computed(() => Math.ceil(totalRecords.value / pageSize.value));
const paginationStart = computed(() => (currentPage.value - 1) * pageSize.value + 1);
const paginationEnd = computed(() => Math.min(currentPage.value * pageSize.value, totalRecords.value));

// Methods
const getModulVariant = (modul) => {
  const variants = {
    'Profil': 'primary',
    'Bantuan': 'success',
    'Tuntutan': 'warning',
    'Pengurusan Pengguna': 'info',
    'Audit': 'danger'
  };
  return variants[modul] || 'gray';
};

const getModuleIcon = (moduleName) => {
  const icons = {
    'Pengurusan Pengguna': 'ic:baseline-people',
    'Audit': 'ic:baseline-security',
    'Profil': 'ic:baseline-person',
    'Bantuan': 'ic:baseline-help',
    'Tuntutan': 'ic:baseline-receipt'
  };
  return icons[moduleName] || 'ic:baseline-apps';
};

const getActivityIcon = (tindakan) => {
  if (tindakan.includes('Mendaftar')) return 'ic:baseline-person-add';
  if (tindakan.includes('Mengemaskini')) return 'ic:baseline-edit';
  if (tindakan.includes('Melihat')) return 'ic:baseline-visibility';
  if (tindakan.includes('Mengakses')) return 'ic:baseline-login';
  if (tindakan.includes('Memproses')) return 'ic:baseline-settings';
  if (tindakan.includes('Memohon')) return 'ic:baseline-send';
  return 'ic:baseline-info';
};

const searchAuditLogs = async () => {
  searching.value = true;
  
  // Simulate search delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Log the search action
  const searchLog = {
    id: Date.now(),
    namaPengguna: 'AdminNAS01',
    idPengguna: '800101015432',
    peranan: 'Admin Sistem',
    modul: 'Audit',
    tindakan: 'Mencari jejak audit',
    tarikhMasa: new Date().toLocaleString('ms-MY'),
    pegawaiBertanggungjawab: 'AdminNAS01',
    userId: 1
  };
  
  auditLogs.value.unshift(searchLog);
  
  searching.value = false;
  currentPage.value = 1;
  
  $toast.success(`Carian selesai. ${totalRecords.value} rekod dijumpai.`);
};

const resetFilters = () => {
  filters.value = {
    namaPengguna: '',
    idPengguna: '',
    peranan: '',
    modul: '',
    tarikhMula: '',
    tarikhAkhir: ''
  };
  currentPage.value = 1;
};

const viewUserDetails = (log) => {
  selectedUser.value = userDetails.value.find(user => user.id === log.userId);
  showUserDetails.value = true;
  
  // Log the detail view action
  const detailLog = {
    id: Date.now(),
    namaPengguna: 'AdminNAS01',
    idPengguna: '800101015432',
    peranan: 'Admin Sistem',
    modul: 'Audit',
    tindakan: `Melihat maklumat terperinci: ${log.namaPengguna}`,
    tarikhMasa: new Date().toLocaleString('ms-MY'),
    pegawaiBertanggungjawab: 'AdminNAS01',
    userId: 1
  };
  
  auditLogs.value.unshift(detailLog);
};

const exportToExcel = async () => {
  exporting.value = true;
  
  // Simulate export delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Create mock download
  const link = document.createElement('a');
  link.href = '#';
  link.download = `Audit_Log_${new Date().toISOString().split('T')[0]}.xlsx`;
  link.click();
  
  // Log the export action
  const exportLog = {
    id: Date.now(),
    namaPengguna: 'AdminNAS01',
    idPengguna: '800101015432',
    peranan: 'Admin Sistem',
    modul: 'Audit',
    tindakan: 'Muat turun laporan Excel',
    tarikhMasa: new Date().toLocaleString('ms-MY'),
    pegawaiBertanggungjawab: 'AdminNAS01',
    userId: 1
  };
  
  auditLogs.value.unshift(exportLog);
  
  exporting.value = false;
  $toast.success('Laporan Excel berjaya dimuat turun');
};

const exportToPDF = async () => {
  exporting.value = true;
  
  // Simulate export delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Create mock download
  const link = document.createElement('a');
  link.href = '#';
  link.download = `Audit_Log_${new Date().toISOString().split('T')[0]}.pdf`;
  link.click();
  
  // Log the export action
  const exportLog = {
    id: Date.now(),
    namaPengguna: 'AdminNAS01',
    idPengguna: '800101015432',
    peranan: 'Admin Sistem',
    modul: 'Audit',
    tindakan: 'Muat turun laporan PDF',
    tarikhMasa: new Date().toLocaleString('ms-MY'),
    pegawaiBertanggungjawab: 'AdminNAS01',
    userId: 1
  };
  
  auditLogs.value.unshift(exportLog);
  
  exporting.value = false;
  $toast.success('Laporan PDF berjaya dimuat turun');
};

const printReport = () => {
  // Log the print action
  const printLog = {
    id: Date.now(),
    namaPengguna: 'AdminNAS01',
    idPengguna: '800101015432',
    peranan: 'Admin Sistem',
    modul: 'Audit',
    tindakan: 'Mencetak laporan audit',
    tarikhMasa: new Date().toLocaleString('ms-MY'),
    pegawaiBertanggungjawab: 'AdminNAS01',
    userId: 1
  };
  
  auditLogs.value.unshift(printLog);
  
  // Simulate print
  window.print();
  $toast.success('Laporan sedang dicetak');
};

const exportUserReport = () => {
  if (!selectedUser.value) return;
  
  // Create mock download
  const link = document.createElement('a');
  link.href = '#';
  link.download = `Laporan_Pengguna_${selectedUser.value.namaPengguna.replace(/\s+/g, '_')}.pdf`;
  link.click();
  
  // Log the export action
  const exportLog = {
    id: Date.now(),
    namaPengguna: 'AdminNAS01',
    idPengguna: '800101015432',
    peranan: 'Admin Sistem',
    modul: 'Audit',
    tindakan: `Muat turun laporan pengguna: ${selectedUser.value.namaPengguna}`,
    tarikhMasa: new Date().toLocaleString('ms-MY'),
    pegawaiBertanggungjawab: 'AdminNAS01',
    userId: 1
  };
  
  auditLogs.value.unshift(exportLog);
  
  $toast.success('Laporan pengguna berjaya dimuat turun');
};

// Initialize
onMounted(() => {
  // Set default date range (last 30 days)
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
  
  filters.value.tarikhAkhir = today.toISOString().split('T')[0];
  filters.value.tarikhMula = thirtyDaysAgo.toISOString().split('T')[0];
});
</script>

<style scoped>
/* Custom styles if needed */
</style>