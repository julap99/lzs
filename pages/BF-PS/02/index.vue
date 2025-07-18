<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Header Notice -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <Icon name="ic:baseline-description" class="text-blue-600 w-8 h-8" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-blue-900 mb-2">Jana & Cetak Laporan Sistem</h1>
          <p class="text-blue-700">Jana dan cetak laporan komprehensif untuk pengurusan sistem, audit trail, dan analisis data pengguna.</p>
        </div>
        <div class="ml-auto">
          <rs-badge variant="info" size="lg">
            <Icon name="ic:baseline-security" class="mr-1" />
            Akses Terkawal
          </rs-badge>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg stats-card hover-lift">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blue-100 text-sm font-medium">Jumlah Laporan</p>
            <p class="text-3xl font-bold">{{ totalReports }}</p>
            <div class="flex items-center mt-2">
              <Icon name="ic:baseline-trending-up" class="w-4 h-4 text-blue-200 mr-1" />
              <span class="text-blue-200 text-xs">Tersedia</span>
            </div>
          </div>
          <div class="bg-blue-400 bg-opacity-30 p-3 rounded-lg">
            <Icon name="ic:baseline-description" class="w-8 h-8 text-blue-100" />
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg stats-card hover-lift">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-100 text-sm font-medium">Laporan Dijana</p>
            <p class="text-3xl font-bold">{{ generatedReports }}</p>
            <div class="flex items-center mt-2">
              <Icon name="ic:baseline-check-circle" class="w-4 h-4 text-green-200 mr-1" />
              <span class="text-green-200 text-xs">Hari ini</span>
            </div>
          </div>
          <div class="bg-green-400 bg-opacity-30 p-3 rounded-lg">
            <Icon name="ic:baseline-file-download" class="w-8 h-8 text-green-100" />
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg stats-card hover-lift">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-purple-100 text-sm font-medium">Modul Aktif</p>
            <p class="text-3xl font-bold">{{ activeModules }}</p>
            <div class="flex items-center mt-2">
              <Icon name="ic:baseline-widgets" class="w-4 h-4 text-purple-200 mr-1" />
              <span class="text-purple-200 text-xs">Sistem</span>
            </div>
          </div>
          <div class="bg-purple-400 bg-opacity-30 p-3 rounded-lg">
            <Icon name="ic:baseline-admin-panel-settings" class="w-8 h-8 text-purple-100" />
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg stats-card hover-lift">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-orange-100 text-sm font-medium">Pengguna Aktif</p>
            <p class="text-3xl font-bold">{{ activeUsers }}</p>
            <div class="flex items-center mt-2">
              <Icon name="ic:baseline-people" class="w-4 h-4 text-orange-200 mr-1" />
              <span class="text-orange-200 text-xs">Masa nyata</span>
            </div>
          </div>
          <div class="bg-orange-400 bg-opacity-30 p-3 rounded-lg">
            <Icon name="ic:baseline-person" class="w-8 h-8 text-orange-100" />
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Report Generation Panel -->
      <div class="lg:col-span-2">
        <rs-card>
          <template #header>
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-4">
                <h2 class="text-xl font-semibold">Senarai Laporan Sistem</h2>
                <rs-badge variant="success">{{ filteredReports.length }} laporan tersedia</rs-badge>
              </div>
              <div class="flex gap-2">
                <rs-button
                  variant="primary"
                  @click="generateSystemReport"
                  :loading="isGenerating"
                >
                  <Icon v-if="!isGenerating" name="ic:baseline-add" class="mr-1" />
                  <Icon v-if="isGenerating" name="ic:baseline-sync" class="mr-1 animate-spin" />
                  {{ isGenerating ? 'Menjana...' : 'Jana Laporan Sistem' }}
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
                    placeholder="Cari nama laporan..."
                    :classes="{
                      input: '!py-2',
                    }"
                  />
                </div>
                <div class="flex gap-2">
                  <FormKit
                    v-model="filters.modul"
                    type="select"
                    :options="modulOptions"
                    placeholder="Pilih Modul"
                    :classes="{
                      input: '!py-2',
                    }"
                  />
                  <FormKit
                    v-model="filters.tarikhKemasKini"
                    type="select"
                    :options="dateOptions"
                    placeholder="Tarikh Kemas Kini"
                    :classes="{
                      input: '!py-2',
                    }"
                  />
                </div>
              </div>
            </div>

            <!-- Reports Table -->
            <div v-if="!showReportView" class="mb-6">
              <rs-table
                :data="filteredReports"
                :columns="reportColumns"
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
                <template v-slot:aksi="{ text }">
                  <div class="flex justify-center items-center gap-2">
                    <rs-button
                      variant="primary"
                      size="sm"
                      @click="viewReport(text)"
                      title="Lihat Laporan"
                    >
                      <Icon name="ic:baseline-visibility" class="w-4 h-4" />
                    </rs-button>
                    <rs-button
                      variant="danger"
                      size="sm"
                      @click="exportPDF(text)"
                      title="Cetak PDF"
                    >
                      <Icon name="ic:baseline-picture-as-pdf" class="w-4 h-4" />
                    </rs-button>
                    <rs-button
                      variant="success"
                      size="sm"
                      @click="exportExcel(text)"
                      title="Cetak Excel"
                    >
                      <Icon name="ic:baseline-table-chart" class="w-4 h-4" />
                    </rs-button>
                  </div>
                </template>
              </rs-table>
            </div>

            <!-- Report Detail View -->
            <div v-if="showReportView" class="mb-6">
              <div class="flex items-center gap-4 mb-4">
                <rs-button
                  variant="ghost"
                  @click="backToReportList"
                >
                  <Icon name="ic:baseline-arrow-back" class="mr-1" />
                  Kembali ke Senarai
                </rs-button>
                <h3 class="text-lg font-semibold text-gray-900">{{ selectedReport?.namaLaporan }}</h3>
              </div>

              <!-- Report Metadata -->
              <div class="bg-blue-50 p-4 rounded-lg mb-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="text-sm font-medium text-blue-800">Nama Laporan:</label>
                    <p class="text-blue-900">{{ selectedReport?.namaLaporan }}</p>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-blue-800">Tarikh Kemas Kini:</label>
                    <p class="text-blue-900">{{ selectedReport?.tarikhKemasKini }}</p>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-blue-800">Bilangan Rekod:</label>
                    <p class="text-blue-900">{{ currentReportData.length }} rekod</p>
                  </div>
                </div>
              </div>

              <!-- Export Buttons -->
              <div class="flex gap-3 mb-4">
                <rs-button
                  variant="danger"
                  @click="exportPDF(selectedReport)"
                  :loading="isExportingPDF"
                >
                  <Icon name="ic:baseline-picture-as-pdf" class="mr-1" />
                  {{ isExportingPDF ? 'Menjana PDF...' : 'Cetak PDF' }}
                </rs-button>
                <rs-button
                  variant="success"
                  @click="exportExcel(selectedReport)"
                  :loading="isExportingExcel"
                >
                  <Icon name="ic:baseline-table-chart" class="mr-1" />
                  {{ isExportingExcel ? 'Menjana Excel...' : 'Cetak Excel' }}
                </rs-button>
              </div>

              <!-- Report Data Table -->
              <div class="overflow-x-auto">
                <rs-table
                  :data="currentReportData"
                  :columns="getReportDetailColumns(selectedReport?.jenis)"
                  :pageSize="10"
                  :showNoColumn="true"
                  :options="{
                    variant: 'default',
                    hover: true,
                    striped: true,
                  }"
                />
              </div>
            </div>
          </template>
        </rs-card>
      </div>

      <!-- Right Sidebar: Policy Information -->
      <div class="space-y-6">
        <!-- Policy Information -->
        <rs-card>
          <template #header>
            <div class="flex items-center gap-2">
              <Icon name="ic:baseline-policy" class="text-blue-600" />
              <h3 class="text-lg font-semibold">Polisi & Dasar</h3>
            </div>
          </template>
          <template #body>
            <div class="space-y-4">
              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 class="font-medium text-yellow-800 mb-2">Polisi Dasar Pengurusan Data ICT</h4>
                <p class="text-sm text-yellow-700 mb-2">Kuatkuasa: 1 Januari 2020</p>
                <p class="text-xs text-yellow-600">Semua laporan mesti mematuhi polisi pengurusan data ICT yang ditetapkan.</p>
              </div>
              
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 class="font-medium text-blue-800 mb-2">Polisi Perlindungan Data Peribadi LZS</h4>
                <p class="text-xs text-blue-600">Data peribadi pengguna dilindungi mengikut Akta Perlindungan Data Peribadi 2010.</p>
              </div>
              
              <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 class="font-medium text-green-800 mb-2">Manual Kuasa</h4>
                <p class="text-xs text-green-600">Akses laporan terhad kepada pengguna yang mempunyai kuasa yang sah.</p>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Quick Actions -->
        <rs-card>
          <template #header>
            <div class="flex items-center gap-2">
              <Icon name="ic:baseline-speed" class="text-blue-600" />
              <h3 class="text-lg font-semibold">Tindakan Pantas</h3>
            </div>
          </template>
          <template #body>
            <div class="space-y-3">
              <rs-button
                variant="outline"
                size="sm"
                class="w-full justify-start"
                @click="navigateTo('/BF-PS/CAT')"
              >
                <Icon name="ic:baseline-search" class="mr-2" />
                Carian Audit Trail
              </rs-button>
              <rs-button
                variant="outline"
                size="sm"
                class="w-full justify-start"
                @click="navigateTo('/BF-PS/PP')"
              >
                <Icon name="ic:baseline-people" class="mr-2" />
                Senarai Pengguna
              </rs-button>
              <rs-button
                variant="outline"
                size="sm"
                class="w-full justify-start"
                @click="navigateTo('/BF-PS/SL')"
              >
                <Icon name="ic:baseline-bar-chart" class="mr-2" />
                Statistik Laporan
              </rs-button>
            </div>
          </template>
        </rs-card>
      </div>
    </div>

    <!-- Report Generation Modal -->
    <rs-modal
      v-model="showGenerationModal"
      title="Jana Laporan Sistem"
      size="lg"
      position="center"
    >
      <template #body>
        <div class="space-y-6">
          <div class="bg-blue-50 p-4 rounded-lg">
            <p class="text-sm text-blue-800">
              <Icon name="ic:baseline-info" class="mr-1" />
              Pilih jenis laporan yang ingin dijana. Laporan akan dijana berdasarkan data semasa sistem.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="reportType in availableReportTypes"
              :key="reportType.id"
              class="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors"
              :class="{ 'border-blue-500 bg-blue-50': selectedReportType === reportType.id }"
              @click="selectedReportType = reportType.id"
            >
              <div class="flex items-center gap-3">
                <Icon :name="reportType.icon" class="text-blue-600 w-6 h-6" />
                <div>
                  <h4 class="font-medium text-gray-900">{{ reportType.name }}</h4>
                  <p class="text-sm text-gray-600">{{ reportType.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button variant="outline" @click="showGenerationModal = false">
            Batal
          </rs-button>
          <rs-button
            variant="primary"
            @click="confirmGenerateReport"
            :disabled="!selectedReportType"
            :loading="isGenerating"
          >
            Jana Laporan
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

definePageMeta({
  title: "Jana & Cetak Laporan Sistem",
});

const breadcrumb = ref([
  {
    name: "Pentadbir Sistem",
    type: "link",
    path: "/BF-PS",
  },
  {
    name: "Jana & Cetak Laporan",
    type: "current",
    path: "/BF-PS/02",
  },
]);

// State management
const searchQuery = ref('');
const filters = ref({
  modul: '',
  tarikhKemasKini: '',
});
const showReportView = ref(false);
const selectedReport = ref(null);
const currentReportData = ref([]);
const showGenerationModal = ref(false);
const selectedReportType = ref(null);
const isGenerating = ref(false);
const isExportingPDF = ref(false);
const isExportingExcel = ref(false);

// Statistics
const totalReports = ref(12);
const generatedReports = ref(8);
const activeModules = ref(6);
const activeUsers = ref(1247);

// Page size for pagination
const pageSize = ref(10);

// Available report types for generation
const availableReportTypes = ref([
  {
    id: 'user_list',
    name: 'Laporan Senarai Pengguna',
    description: 'Senarai pengguna aktif dan tidak aktif',
    icon: 'ic:baseline-people',
  },
  {
    id: 'audit_trail',
    name: 'Laporan Audit Trail',
    description: 'Rekod audit trail mengikut modul',
    icon: 'ic:baseline-security',
  },
  {
    id: 'system_stats',
    name: 'Laporan Statistik Sistem',
    description: 'Statistik penggunaan sistem',
    icon: 'ic:baseline-bar-chart',
  },
  {
    id: 'role_permissions',
    name: 'Laporan Peranan & Kebenaran',
    description: 'Senarai peranan dan kebenaran pengguna',
    icon: 'ic:baseline-admin-panel-settings',
  },
]);

// Reports data
const reports = ref([
  {
    id: 1,
    namaLaporan: 'Laporan Senarai Pengguna Aktif / Tidak Aktif',
    keteranganRingkas: 'Senarai pengguna aktif dan tidak aktif dalam sistem',
    tarikhKemasKini: '15 Januari 2024',
    modul: 'Pengurusan Pengguna',
    jenis: 'user_list',
    roleAccess: ['Admin', 'PPA', 'PA', 'LZS'],
  },
  {
    id: 2,
    namaLaporan: 'Laporan Audit Trail Mengikut Modul',
    keteranganRingkas: 'Rekod audit trail untuk semua modul sistem',
    tarikhKemasKini: '14 Januari 2024',
    modul: 'Audit Trail',
    jenis: 'audit_trail',
    roleAccess: ['Admin', 'PPA'],
  },
  {
    id: 3,
    namaLaporan: 'Laporan Statistik Sistem',
    keteranganRingkas: 'Statistik penggunaan dan aktiviti sistem',
    tarikhKemasKini: '13 Januari 2024',
    modul: 'Statistik',
    jenis: 'system_stats',
    roleAccess: ['Admin', 'PPA', 'PA'],
  },
  {
    id: 4,
    namaLaporan: 'Laporan Peranan & Kebenaran Pengguna',
    keteranganRingkas: 'Senarai peranan dan kebenaran untuk semua pengguna',
    tarikhKemasKini: '12 Januari 2024',
    modul: 'Pengurusan Peranan',
    jenis: 'role_permissions',
    roleAccess: ['Admin'],
  },
  {
    id: 5,
    namaLaporan: 'Laporan Aktiviti Pengguna',
    keteranganRingkas: 'Aktiviti pengguna dalam sistem',
    tarikhKemasKini: '11 Januari 2024',
    modul: 'Pengurusan Pengguna',
    jenis: 'user_activity',
    roleAccess: ['Admin', 'PPA'],
  },
  {
    id: 6,
    namaLaporan: 'Laporan Keselamatan Sistem',
    keteranganRingkas: 'Status keselamatan dan log keselamatan',
    tarikhKemasKini: '10 Januari 2024',
    modul: 'Keselamatan',
    jenis: 'security',
    roleAccess: ['Admin'],
  },
]);

// Filter options
const modulOptions = ref([
  { label: 'Semua Modul', value: '' },
  { label: 'Pengurusan Pengguna', value: 'Pengurusan Pengguna' },
  { label: 'Audit Trail', value: 'Audit Trail' },
  { label: 'Statistik', value: 'Statistik' },
  { label: 'Pengurusan Peranan', value: 'Pengurusan Peranan' },
  { label: 'Keselamatan', value: 'Keselamatan' },
]);

const dateOptions = ref([
  { label: 'Semua Tarikh', value: '' },
  { label: 'Hari Ini', value: 'today' },
  { label: 'Minggu Ini', value: 'this_week' },
  { label: 'Bulan Ini', value: 'this_month' },
  { label: 'Tahun Ini', value: 'this_year' },
]);

// Table columns for reports list
const reportColumns = ref([
  { key: 'namaLaporan', label: 'Nama Laporan', sortable: true },
  { key: 'keteranganRingkas', label: 'Keterangan Ringkas', sortable: true },
  { key: 'tarikhKemasKini', label: 'Tarikh Kemas Kini', sortable: true },
  { key: 'aksi', label: 'Aksi', sortable: false },
]);

// Computed properties
const filteredReports = computed(() => {
  let filtered = reports.value;

  // Filter by search query
  if (searchQuery.value) {
    filtered = filtered.filter(report =>
      report.namaLaporan.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      report.keteranganRingkas.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  // Filter by module
  if (filters.value.modul) {
    filtered = filtered.filter(report => report.modul === filters.value.modul);
  }

  // Filter by date (simplified)
  if (filters.value.tarikhKemasKini) {
    // Add date filtering logic here
  }

  return filtered;
});

// Methods
const generateSystemReport = () => {
  showGenerationModal.value = true;
};

const confirmGenerateReport = async () => {
  if (!selectedReportType.value) return;

  isGenerating.value = true;
  
  try {
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Add new report to the list
    const newReport = {
      id: reports.value.length + 1,
      namaLaporan: `Laporan ${availableReportTypes.value.find(t => t.id === selectedReportType.value)?.name}`,
      keteranganRingkas: 'Laporan yang baru dijana',
      tarikhKemasKini: new Date().toLocaleDateString('ms-MY'),
      modul: 'Sistem',
      jenis: selectedReportType.value,
      roleAccess: ['Admin'],
    };
    
    reports.value.unshift(newReport);
    totalReports.value++;
    generatedReports.value++;
    
    showGenerationModal.value = false;
    selectedReportType.value = null;
    
    // Show success message
    alert('Laporan berjaya dijana!');
  } catch (error) {
    console.error('Error generating report:', error);
    alert('Ralat semasa menjana laporan. Sila cuba lagi.');
  } finally {
    isGenerating.value = false;
  }
};

const viewReport = (report) => {
  selectedReport.value = report;
  showReportView.value = true;
  
  // Load report data based on type
  loadReportData(report.jenis);
};

const backToReportList = () => {
  showReportView.value = false;
  selectedReport.value = null;
  currentReportData.value = [];
};

const exportPDF = async (report) => {
  isExportingPDF.value = true;
  
  try {
    // Simulate PDF export
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert(`Laporan "${report.namaLaporan}" berjaya dieksport sebagai PDF!`);
  } catch (error) {
    console.error('Error exporting PDF:', error);
    alert('Ralat semasa mengeksport PDF. Sila cuba lagi.');
  } finally {
    isExportingPDF.value = false;
  }
};

const exportExcel = async (report) => {
  isExportingExcel.value = true;
  
  try {
    // Simulate Excel export
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert(`Laporan "${report.namaLaporan}" berjaya dieksport sebagai Excel!`);
  } catch (error) {
    console.error('Error exporting Excel:', error);
    alert('Ralat semasa mengeksport Excel. Sila cuba lagi.');
  } finally {
    isExportingExcel.value = false;
  }
};

const loadReportData = (reportType) => {
  // Mock data based on report type
  switch (reportType) {
    case 'user_list':
      currentReportData.value = [
        {
          no: 1,
          jenisPengguna: 'Admin',
          idPengguna: 'AdminICT01',
          nama: 'Ahmad bin Abdullah',
          emel: 'ahmad.abdullah@lzs.gov.my',
          perananPengguna: 'Pentadbir Sistem',
          status: 'Aktif',
          tarikhDaftar: '15 Januari 2024',
        },
        {
          no: 2,
          jenisPengguna: 'PPA',
          idPengguna: 'PPA001',
          nama: 'Siti binti Mohamed',
          emel: 'siti.mohamed@lzs.gov.my',
          perananPengguna: 'Pegawai Pentadbir',
          status: 'Aktif',
          tarikhDaftar: '14 Januari 2024',
        },
        {
          no: 3,
          jenisPengguna: 'PA',
          idPengguna: 'PA001',
          nama: 'Mohd Ali bin Hassan',
          emel: 'mohd.ali@lzs.gov.my',
          perananPengguna: 'Pegawai Audit',
          status: 'Tidak Aktif',
          tarikhDaftar: '10 Januari 2024',
        },
      ];
      break;
      
    case 'audit_trail':
      currentReportData.value = [
        {
          no: 1,
          namaModul: 'Pengurusan Pengguna',
          namaSubModul: 'Daftar Pengguna',
          tindakanPengguna: 'Tambah pengguna baharu',
          tarikhRekod: '15 Januari 2024, 10:30',
        },
        {
          no: 2,
          namaModul: 'Audit Trail',
          namaSubModul: 'Carian Audit',
          tindakanPengguna: 'Carian rekod audit',
          tarikhRekod: '15 Januari 2024, 09:15',
        },
        {
          no: 3,
          namaModul: 'Statistik Laporan',
          namaSubModul: 'Jana Laporan',
          tindakanPengguna: 'Jana laporan sistem',
          tarikhRekod: '14 Januari 2024, 16:45',
        },
      ];
      break;
      
    default:
      currentReportData.value = [];
  }
};

const getReportDetailColumns = (reportType) => {
  switch (reportType) {
    case 'user_list':
      return [
        { key: 'no', label: 'No.' },
        { key: 'jenisPengguna', label: 'Jenis Pengguna' },
        { key: 'idPengguna', label: 'Id Pengguna' },
        { key: 'nama', label: 'Nama' },
        { key: 'emel', label: 'Emel' },
        { key: 'perananPengguna', label: 'Peranan Pengguna' },
        { key: 'status', label: 'Status' },
        { key: 'tarikhDaftar', label: 'Tarikh Daftar' },
      ];
      
    case 'audit_trail':
      return [
        { key: 'no', label: 'No.' },
        { key: 'namaModul', label: 'Nama Modul' },
        { key: 'namaSubModul', label: 'Nama Sub Modul' },
        { key: 'tindakanPengguna', label: 'Tindakan Pengguna' },
        { key: 'tarikhRekod', label: 'Tarikh Rekod' },
      ];
      
    default:
      return [];
  }
};

// Initialize page
onMounted(() => {
  console.log('📊 Jana & Cetak Laporan page loaded');
});
</script>

<style scoped>
/* Enhanced styling */
.stats-card {
  transition: all 0.3s ease-in-out;
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.fade-in {
  animation: fadeIn 0.6s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .stats-card {
    margin-bottom: 1rem;
  }
  
  .hover-lift:hover {
    transform: none;
  }
}
</style>