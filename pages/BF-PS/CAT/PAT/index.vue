<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Results Header -->
    <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
      <div class="flex items-center gap-2">
        <Icon name="ic:baseline-check-circle" class="text-green-600" />
        <div class="text-sm text-green-800">
          <p class="font-medium">Paparan Keputusan Audit Trail</p>
          <p>Hasil carian berdasarkan kriteria yang telah ditetapkan. {{ filteredAuditLogs.length }} rekod ditemui.</p>
        </div>
      </div>
    </div>

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-4">
            <h2 class="text-xl font-semibold">Paparan Keputusan Audit Trail</h2>
            <rs-badge variant="success">{{ filteredAuditLogs.length }} rekod</rs-badge>
          </div>
          <div class="flex gap-2">
            <rs-button
              variant="outline"
              @click="navigateToSearch"
            >
              <Icon name="ic:baseline-arrow-back" class="mr-1" />
              Kembali ke Carian
            </rs-button>
            <rs-button
              variant="primary-outline"
              @click="newSearch"
            >
              <Icon name="ic:baseline-search" class="mr-1" />
              Carian Baharu
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>
        <!-- Search Criteria Summary -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div class="flex items-center gap-2 mb-3">
            <rs-badge variant="info">Kriteria Carian</rs-badge>
            <h4 class="font-medium">Parameter yang digunakan untuk carian ini:</h4>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span class="text-gray-600 font-medium">Tempoh:</span>
              <p>{{ searchCriteria.tarikhMula }} hingga {{ searchCriteria.tarikhTamat }}</p>
            </div>
            <div v-if="searchCriteria.namaPengguna">
              <span class="text-gray-600 font-medium">Pengguna:</span>
              <p>{{ searchCriteria.namaPengguna }}</p>
            </div>
            <div v-if="searchCriteria.modul">
              <span class="text-gray-600 font-medium">Modul:</span>
              <p>{{ searchCriteria.modul }}</p>
            </div>
            <div v-if="searchCriteria.subModul">
              <span class="text-gray-600 font-medium">Sub Modul:</span>
              <p>{{ searchCriteria.subModul }}</p>
            </div>
            <div v-if="searchCriteria.jenisTindakan">
              <span class="text-gray-600 font-medium">Tindakan:</span>
              <p>{{ searchCriteria.jenisTindakan }}</p>
            </div>
          </div>
        </div>

        <!-- Section 3: Paparan Keputusan Audit Trail (Audit Log Table) -->
        <div class="mb-6">
          <div class="flex items-center gap-2 mb-4">
            <rs-badge variant="success">Section 3</rs-badge>
            <h3 class="text-lg font-semibold">Paparan Keputusan Audit Trail</h3>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full table-auto border-collapse border border-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th class="border border-gray-300 px-4 py-2 text-left cursor-pointer hover:bg-gray-100" @click="sortBy('timestamp')">
                    Tarikh & Masa Tindakan
                    <Icon name="ic:baseline-sort" class="inline ml-1" size="16" />
                  </th>
                  <th class="border border-gray-300 px-4 py-2 text-left">Nama Pengguna</th>
                  <th class="border border-gray-300 px-4 py-2 text-left">Modul Sistem</th>
                  <th class="border border-gray-300 px-4 py-2 text-left">Sub Modul</th>
                  <th class="border border-gray-300 px-4 py-2 text-left">Jenis Tindakan</th>
                  <th class="border border-gray-300 px-4 py-2 text-left">Ringkasan</th>
                  <th class="border border-gray-300 px-4 py-2 text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(log, index) in paginatedAuditLogs" :key="log.recordId" class="hover:bg-gray-50">
                  <td class="border border-gray-300 px-4 py-2">{{ log.timestamp }}</td>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="flex items-center gap-2">
                      <span class="font-medium">{{ log.username }}</span>
                      <rs-badge :variant="getUserRoleBadgeVariant(log.userRole)" size="sm">{{ log.userRole }}</rs-badge>
                    </div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">{{ log.module }}</td>
                  <td class="border border-gray-300 px-4 py-2">{{ log.subModule }}</td>
                  <td class="border border-gray-300 px-4 py-2">
                    <rs-badge :variant="getActionBadgeVariant(log.action)">{{ log.action }}</rs-badge>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <span class="text-sm">{{ truncateText(log.summary, 100) }}</span>
                  </td>
                  <td class="border border-gray-300 px-4 py-2 text-center">
                    <rs-button
                      variant="primary-outline"
                      size="sm"
                      @click="viewAuditDetail(log)"
                    >
                      Lihat Perincian
                    </rs-button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty Results -->
          <div v-if="filteredAuditLogs.length === 0" class="text-center py-12 text-gray-500">
            <Icon name="ic:baseline-search-off" size="48" class="mx-auto mb-4 text-gray-300" />
            <p class="text-lg font-medium mb-2">Tiada Rekod Ditemui</p>
            <p>Tiada rekod audit trail yang sepadan dengan kriteria carian yang diberikan.</p>
            <rs-button variant="outline" class="mt-4" @click="navigateToSearch">
              Kembali ke Halaman Carian
            </rs-button>
          </div>

          <!-- Pagination -->
          <div v-if="filteredAuditLogs.length > 0" class="mt-6 flex justify-between items-center">
            <div class="text-sm text-gray-600">
              Menunjukkan {{ ((currentPage - 1) * pageSize) + 1 }} hingga {{ Math.min(currentPage * pageSize, filteredAuditLogs.length) }} daripada {{ filteredAuditLogs.length }} rekod
            </div>
            <div class="flex gap-2">
              <rs-button
                variant="outline"
                size="sm"
                @click="currentPage--"
                :disabled="currentPage === 1"
              >
                Sebelum
              </rs-button>
              <span class="px-4 py-2 text-sm">Halaman {{ currentPage }} daripada {{ totalPages }}</span>
              <rs-button
                variant="outline"
                size="sm"
                @click="currentPage++"
                :disabled="currentPage === totalPages"
              >
                Seterusnya
              </rs-button>
            </div>
          </div>
        </div>

        <!-- Section 4: Cetakan & Eksport -->
        <div v-if="filteredAuditLogs.length > 0" class="border-t pt-6">
          <div class="flex items-center gap-2 mb-4">
            <rs-badge variant="warning">Section 4</rs-badge>
            <h3 class="text-lg font-semibold">Cetakan & Eksport</h3>
          </div>
          
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-700 mb-4">
              Eksport hasil carian untuk tujuan audit ICT, laporan kepada Lembaga Tadbir Urus, atau dokumentasi insiden keselamatan.
            </p>
            <div class="flex gap-3">
              <rs-button
                variant="success-outline"
                @click="exportToPDF"
                :disabled="!canExport"
              >
                <Icon name="ic:baseline-picture-as-pdf" class="mr-1" />
                Cetak PDF
              </rs-button>
              <rs-button
                variant="info-outline"
                @click="exportToExcel"
                :disabled="!canExport"
              >
                <Icon name="ic:baseline-table-view" class="mr-1" />
                Eksport Excel
              </rs-button>
            </div>
            <p v-if="!canExport" class="text-xs text-red-600 mt-2">
              <Icon name="ic:baseline-warning" class="inline mr-1" />
              Eksport hanya dibenarkan untuk peranan Admin, NAS, atau Audit
            </p>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Modal: Lihat Perincian -->
    <rs-modal
      v-model="showDetailModal"
      title="Perincian Log Audit"
      size="xl"
      position="center"
    >
      <template #body>
        <div v-if="selectedAuditLog" class="space-y-6">
          <!-- Basic Information -->
          <div class="bg-blue-50 p-4 rounded-lg">
            <h4 class="font-medium mb-3 flex items-center">
              <Icon name="ic:baseline-info" class="mr-2" />
              Maklumat Asas
            </h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">ID Rekod</label>
                <p class="font-mono text-sm bg-white p-2 rounded border">{{ selectedAuditLog.recordId }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh & Masa</label>
                <p class="bg-white p-2 rounded border">{{ selectedAuditLog.timestamp }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nama Pengguna</label>
                <div class="flex items-center gap-2 bg-white p-2 rounded border">
                  <span>{{ selectedAuditLog.username }}</span>
                  <rs-badge :variant="getUserRoleBadgeVariant(selectedAuditLog.userRole)">{{ selectedAuditLog.userRole }}</rs-badge>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Jenis Tindakan</label>
                <div class="bg-white p-2 rounded border">
                  <rs-badge :variant="getActionBadgeVariant(selectedAuditLog.action)">{{ selectedAuditLog.action }}</rs-badge>
                </div>
              </div>
            </div>
          </div>

          <!-- Module Information -->
          <div>
            <h4 class="font-medium mb-3 flex items-center">
              <Icon name="ic:baseline-widgets" class="mr-2" />
              Maklumat Modul
            </h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Modul</label>
                <p class="bg-gray-50 p-2 rounded border">{{ selectedAuditLog.module }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Sub Modul</label>
                <p class="bg-gray-50 p-2 rounded border">{{ selectedAuditLog.subModule }}</p>
              </div>
            </div>
          </div>

          <!-- Action Details -->
          <div>
            <h4 class="font-medium mb-3 flex items-center">
              <Icon name="ic:baseline-description" class="mr-2" />
              Perincian Tindakan
            </h4>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ringkasan Tindakan</label>
              <p class="text-sm bg-gray-50 p-3 rounded border">{{ selectedAuditLog.summary }}</p>
            </div>
          </div>

          <!-- Data Changes (Conditional Display) -->
          <div v-if="selectedAuditLog.dataBefore || selectedAuditLog.dataAfter">
            <h4 class="font-medium mb-3 flex items-center">
              <Icon name="ic:baseline-compare-arrows" class="mr-2" />
              Perubahan Data
            </h4>
            
            <!-- Data Sebelum (if applicable) -->
            <div v-if="selectedAuditLog.dataBefore && selectedAuditLog.action !== 'Tambah'" class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Data Sebelum</label>
              <pre class="text-xs bg-red-50 border border-red-200 p-3 rounded overflow-x-auto max-h-32">{{ formatJsonData(selectedAuditLog.dataBefore) }}</pre>
            </div>

            <!-- Data Selepas (if applicable) -->
            <div v-if="selectedAuditLog.dataAfter && selectedAuditLog.action !== 'Padam'">
              <label class="block text-sm font-medium text-gray-700 mb-1">Data Selepas</label>
              <pre class="text-xs bg-green-50 border border-green-200 p-3 rounded overflow-x-auto max-h-32">{{ formatJsonData(selectedAuditLog.dataAfter) }}</pre>
            </div>
          </div>

          <!-- Technical Details -->
          <div class="border-t pt-4">
            <h4 class="font-medium mb-3 flex items-center">
              <Icon name="ic:baseline-computer" class="mr-2" />
              Maklumat Teknikal
            </h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label class="block text-gray-600 font-medium">IP Address</label>
                <p class="font-mono bg-gray-50 p-2 rounded border">{{ selectedAuditLog.ipAddress }}</p>
              </div>
              <div>
                <label class="block text-gray-600 font-medium">Session ID</label>
                <p class="font-mono bg-gray-50 p-2 rounded border">{{ selectedAuditLog.sessionId }}</p>
              </div>
              <div class="col-span-2">
                <label class="block text-gray-600 font-medium">User Agent</label>
                <p class="text-xs bg-gray-50 p-2 rounded border">{{ selectedAuditLog.userAgent }}</p>
              </div>
              <div>
                <label class="block text-gray-600 font-medium">Status</label>
                <rs-badge :variant="selectedAuditLog.status === 'Success' ? 'success' : 'danger'">
                  {{ selectedAuditLog.status }}
                </rs-badge>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button 
            variant="primary-outline" 
            @click="showDetailModal = false"
          >
            Tutup
          </rs-button>
          <rs-button
            variant="primary" 
            @click="exportSingleRecord"
            :disabled="!canExport"
          >
            <Icon name="ic:baseline-download" class="mr-1" />
            Eksport Rekod
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

definePageMeta({
  title: "Paparan Keputusan Audit Trail",
});

const breadcrumb = ref([
  {
    name: "Pentadbir Sistem",
    type: "link",
    path: "/BF-PS",
  },
  {
    name: "Carian Audit Trail",
    type: "link",
    path: "/BF-PS/CAT",
  },
  {
    name: "Keputusan Carian",
    type: "current",
    path: "/BF-PS/CAT/PAT",
  },
]);

// State management
const auditLogs = ref([]);
const selectedAuditLog = ref(null);
const showDetailModal = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const sortField = ref('timestamp');
const sortDirection = ref('desc');
const currentUserRole = ref('ADMIN');

// Search criteria from URL parameters
const searchCriteria = ref({
  tarikhMula: '',
  tarikhTamat: '',
  namaPengguna: '',
  modul: '',
  subModul: '',
  jenisTindakan: ''
});

// Computed properties
const filteredAuditLogs = computed(() => {
  return auditLogs.value; // Results are pre-filtered from search
});

const paginatedAuditLogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredAuditLogs.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredAuditLogs.value.length / pageSize.value);
});

const canExport = computed(() => {
  return ['ADMIN', 'NAS', 'AUDIT'].includes(currentUserRole.value);
});

// Methods
const generateFilteredAuditLogs = (criteria) => {
  const logs = [];
  const modules = ['Profiling', 'Bantuan', 'Pendaftaran', 'BDS', 'Tunai', 'Pentadbir Sistem'];
  const subModules = {
    'Profiling': ['Pengguna', 'Maklumat Peribadi', 'Dokumen'],
    'Bantuan': ['Permohonan', 'Kelulusan', 'Bayaran'],
    'Pendaftaran': ['Pendaftaran Pantas', 'Pendaftaran Lengkap', 'Kemaskini Data'],
    'BDS': ['Semakan Data', 'Pengesahan', 'Laporan'],
    'Tunai': ['Kutipan', 'Bayaran', 'Reconciliation'],
    'Pentadbir Sistem': ['Pengurusan Pengguna', 'Kebenaran', 'Tetapan']
  };
  const actions = ['Tambah', 'Kemaskini', 'Padam', 'Lulus', 'Tolak'];
  const users = [
    { name: 'AdminICT01', role: 'ADMIN' },
    { name: 'NASAdmin02', role: 'NAS' },
    { name: 'EKP03', role: 'EKP' },
    { name: 'EOAD04', role: 'EOAD' },
    { name: 'AuditOfficer01', role: 'AUDIT' }
  ];

  // Generate 100 logs to filter from
  const allLogs = [];
  for (let i = 0; i < 100; i++) {
    const module = modules[Math.floor(Math.random() * modules.length)];
    const subModule = subModules[module][Math.floor(Math.random() * subModules[module].length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 90));
    date.setHours(Math.floor(Math.random() * 24));
    date.setMinutes(Math.floor(Math.random() * 60));
    date.setSeconds(Math.floor(Math.random() * 60));

    const recordId = `AT-${date.getFullYear()}-${String(1000 + i).padStart(4, '0')}`;

    // Generate realistic data changes for actions
    let dataBefore = null;
    let dataAfter = null;
    
    if (action === 'Kemaskini') {
      dataBefore = { status: 'Pending', amount: 1000, updatedBy: 'System' };
      dataAfter = { status: 'Approved', amount: 1200, updatedBy: user.name };
    } else if (action === 'Tambah') {
      dataAfter = { id: Math.floor(Math.random() * 1000), name: 'New Record', createdBy: user.name };
    } else if (action === 'Padam') {
      dataBefore = { id: Math.floor(Math.random() * 1000), name: 'Deleted Record', status: 'Active' };
    }

    allLogs.push({
      recordId,
      timestamp: date.toLocaleString('ms-MY'),
      timestampDate: date,
      username: user.name,
      userRole: user.role,
      module,
      subModule,
      action,
      summary: `${action} rekod dalam ${module} - ${subModule}. Tindakan dilakukan melalui sistem NAS.`,
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      sessionId: `sess_${Math.random().toString(36).substr(2, 16)}`,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: Math.random() > 0.1 ? 'Success' : 'Failed',
      dataBefore,
      dataAfter
    });
  }

  // Apply filters based on search criteria
  let filteredLogs = allLogs;

  // Filter by date range (required)
  if (criteria.tarikhMula && criteria.tarikhTamat) {
    const startDate = new Date(criteria.tarikhMula);
    const endDate = new Date(criteria.tarikhTamat);
    endDate.setHours(23, 59, 59, 999);
    
    filteredLogs = filteredLogs.filter(log => {
      const logDate = new Date(log.timestampDate);
      return logDate >= startDate && logDate <= endDate;
    });
  }

  // Filter by user name
  if (criteria.namaPengguna) {
    const query = criteria.namaPengguna.toLowerCase();
    filteredLogs = filteredLogs.filter(log => 
      log.username.toLowerCase().includes(query)
    );
  }

  // Filter by module
  if (criteria.modul) {
    filteredLogs = filteredLogs.filter(log => log.module === criteria.modul);
  }

  // Filter by sub module
  if (criteria.subModul) {
    filteredLogs = filteredLogs.filter(log => log.subModule === criteria.subModul);
  }

  // Filter by action type
  if (criteria.jenisTindakan) {
    filteredLogs = filteredLogs.filter(log => log.action === criteria.jenisTindakan);
  }

  return filteredLogs.sort((a, b) => new Date(b.timestampDate) - new Date(a.timestampDate));
};

const truncateText = (text, length) => {
  return text.length > length ? text.substring(0, length) + '...' : text;
};

const getUserRoleBadgeVariant = (role) => {
  const variants = {
    'ADMIN': 'danger',
    'NAS': 'primary',
    'EKP': 'info',
    'EOAD': 'success',
    'AUDIT': 'warning'
  };
  return variants[role] || 'default';
};

const getActionBadgeVariant = (action) => {
  const variants = {
    'Tambah': 'success',
    'Kemaskini': 'info',
    'Padam': 'danger',
    'Lulus': 'primary',
    'Tolak': 'warning'
  };
  return variants[action] || 'default';
};

const sortBy = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'desc' ? 'asc' : 'desc';
  } else {
    sortField.value = field;
    sortDirection.value = 'desc';
  }
  
  // Sort the audit logs
  auditLogs.value.sort((a, b) => {
    let aVal = a[field];
    let bVal = b[field];
    
    if (field === 'timestamp') {
      aVal = new Date(a.timestampDate);
      bVal = new Date(b.timestampDate);
    }
    
    if (sortDirection.value === 'desc') {
      return bVal > aVal ? 1 : -1;
    } else {
      return aVal > bVal ? 1 : -1;
    }
  });
};

const navigateToSearch = () => {
  navigateTo('/BF-PS/CAT');
};

const newSearch = () => {
  navigateTo('/BF-PS/CAT');
};

const viewAuditDetail = (log) => {
  selectedAuditLog.value = log;
  showDetailModal.value = true;
};

const formatJsonData = (data) => {
  try {
    return JSON.stringify(data, null, 2);
  } catch (e) {
    return data;
  }
};

const exportSingleRecord = () => {
  if (!canExport.value) {
    $toast.warning('Eksport rekod hanya dibenarkan untuk Admin/NAS/Audit');
    return;
  }
  $toast.success(`Eksport rekod ${selectedAuditLog.value.recordId} sedang dijanakan...`);
  showDetailModal.value = false;
};

const exportToPDF = () => {
  if (!canExport.value) {
    $toast.warning('Eksport PDF hanya dibenarkan untuk Admin/NAS/Audit');
    return;
  }
  $toast.success('PDF sedang dijanakan...');
};

const exportToExcel = () => {
  if (!canExport.value) {
    $toast.warning('Eksport Excel hanya dibenarkan untuk Admin/NAS/Audit');
    return;
  }
  $toast.success('Excel sedang dijanakan...');
};

// Initialize
onMounted(() => {
  console.log('CAT/PAT Results component mounted');
  
  // Get search parameters from URL
  const route = useRoute();
  const query = route.query;
  
  // Parse search criteria
  searchCriteria.value = {
    tarikhMula: query.tarikhMula || '',
    tarikhTamat: query.tarikhTamat || '',
    namaPengguna: query.namaPengguna || '',
    modul: query.modul || '',
    subModul: query.subModul || '',
    jenisTindakan: query.jenisTindakan || ''
  };
  
  // Generate filtered results based on search criteria
  auditLogs.value = generateFilteredAuditLogs(searchCriteria.value);
  
  // Show toast with result count
  $toast.success(`Carian selesai. ${auditLogs.value.length} rekod ditemui.`);
});
</script>

<style scoped>
.cursor-pointer:hover {
  background-color: #f3f4f6;
}
</style> 