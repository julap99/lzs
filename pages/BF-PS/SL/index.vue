<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-4">
            <h2 class="text-xl font-semibold">Statistik / Laporan</h2>
            <rs-badge variant="info">{{ availableReports.length }} laporan tersedia</rs-badge>
          </div>
          <div class="flex gap-2">
            <rs-button
              variant="outline"
              @click="refreshReports"
            >
              <Icon name="ic:baseline-refresh" class="mr-1" />
              Muat Semula
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>
        <!-- Section 1: Search and Filter -->
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
                v-model="filters.tarikhKemaaskini"
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

        <!-- Section 1: Report Listing Table -->
        <div v-if="!showReportView" class="mb-6">
          <h3 class="text-lg font-semibold mb-4 text-gray-900 border-b pb-2">
            Senarai Statistik / Laporan
          </h3>
          
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

        <!-- Section 2: Report Display Area -->
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
                <p class="text-blue-900">{{ selectedReport?.tarikhKemaaskini }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-blue-800">Bilangan Rekod:</label>
                <p class="text-blue-900">{{ currentReportData.length }} rekod</p>
              </div>
            </div>
          </div>

          <!-- Section 3: Export Buttons -->
          <div class="flex gap-3 mb-4">
            <rs-button
              variant="danger"
              @click="exportPDF(selectedReport)"
              :disabled="currentReportData.length === 0"
              :loading="exporting"
            >
              <Icon name="ic:baseline-picture-as-pdf" class="mr-1" />
              Cetak PDF
            </rs-button>
            <rs-button
              variant="success"
              @click="exportExcel(selectedReport)"
              :disabled="currentReportData.length === 0"
              :loading="exporting"
            >
              <Icon name="ic:baseline-table-chart" class="mr-1" />
              Cetak Excel
            </rs-button>
          </div>

          <!-- Report Data Table -->
          <rs-table
            :data="currentReportData"
            :columns="currentReportColumns"
            :pageSize="reportPageSize"
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
            <template v-slot:jenisPengguna="{ text }" v-if="selectedReport?.id === 1">
              <rs-badge :variant="text === 'Staf' ? 'primary' : 'success'">
                {{ text }}
              </rs-badge>
            </template>

            <template v-slot:status="{ text }" v-if="selectedReport?.id === 1">
              <rs-badge :variant="text === 'Aktif' ? 'success' : 'danger'">
                {{ text }}
              </rs-badge>
            </template>
          </rs-table>

          <!-- No Records Message -->
          <div v-if="currentReportData.length === 0" class="text-center py-8 text-gray-500">
            <Icon name="ic:baseline-info" class="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Tiada rekod dijumpai untuk laporan ini</p>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

definePageMeta({
  title: "Statistik / Laporan",
});

const breadcrumb = ref([
  {
    name: "Pentadbir Sistem",
    type: "link",
    path: "/BF-PS",
  },
  {
    name: "Statistik / Laporan",
    type: "current",
    path: "/BF-PS/SL",
  },
]);

// State
const searchQuery = ref("");
const showReportView = ref(false);
const selectedReport = ref(null);
const exporting = ref(false);
const pageSize = ref(10);
const reportPageSize = ref(15);

// Filters
const filters = ref({
  modul: "",
  tarikhKemaaskini: "",
});

// Filter options
const modulOptions = [
  { label: "Semua Modul", value: "" },
  { label: "Pengurusan Pengguna", value: "Pengurusan Pengguna" },
  { label: "Audit Trail", value: "Audit Trail" },
  { label: "Peranan & Kebenaran", value: "Peranan & Kebenaran" },
  { label: "Penyelenggaraan Am", value: "Penyelenggaraan Am" },
];

const dateOptions = [
  { label: "Semua Tarikh", value: "" },
  { label: "7 hari lepas", value: "7days" },
  { label: "30 hari lepas", value: "30days" },
  { label: "90 hari lepas", value: "90days" },
];

// Report listing table columns
const reportColumns = [
  {
    key: "namaLaporan",
    label: "Nama Laporan",
    sortable: true,
  },
  {
    key: "keteranganRingkas",
    label: "Keterangan Ringkas",
    sortable: false,
  },
  {
    key: "modul",
    label: "Modul",
    sortable: true,
  },
  {
    key: "tarikhKemaaskini",
    label: "Tarikh Kemas Kini",
    sortable: true,
  },
  {
    key: "aksi",
    label: "Aksi",
    sortable: false,
  },
];

// Mock report data
const reports = ref([
  {
    id: 1,
    namaLaporan: "Senarai Pengguna Aktif / Tidak Aktif",
    keteranganRingkas: "Laporan lengkap status pengguna dalam sistem",
    modul: "Pengurusan Pengguna",
    tarikhKemaaskini: "2024-03-20",
    aksi: null
  },
  {
    id: 2,
    namaLaporan: "Audit Trail Mengikut Modul",
    keteranganRingkas: "Jejak aktiviti pengguna mengikut modul sistem",
    modul: "Audit Trail",
    tarikhKemaaskini: "2024-03-19",
    aksi: null
  },
  {
    id: 3,
    namaLaporan: "Laporan Peranan Pengguna",
    keteranganRingkas: "Senarai pengguna dan peranan yang diberikan",
    modul: "Peranan & Kebenaran",
    tarikhKemaaskini: "2024-03-18",
    aksi: null
  },
  {
    id: 4,
    namaLaporan: "Statistik Login Pengguna",
    keteranganRingkas: "Analisis corak login dan akses pengguna",
    modul: "Audit Trail",
    tarikhKemaaskini: "2024-03-17",
    aksi: null
  },
  {
    id: 5,
    namaLaporan: "Laporan Kod Rujukan",
    keteranganRingkas: "Senarai kod rujukan dan konfigurasi sistem",
    modul: "Penyelenggaraan Am",
    tarikhKemaaskini: "2024-03-16",
    aksi: null
  }
]);

// Sample report data for viewing
const userReportData = ref([
  {
    jenisPengguna: 'Staf',
    idPengguna: '800101015432',
    nama: 'Ahmad bin Abdullah',
    emel: 'ahmad.abdullah@nas.gov.my',
    peranan: 'Admin Sistem',
    status: 'Aktif',
    tarikhDaftar: '2024-01-15'
  },
  {
    jenisPengguna: 'Bukan Staf',
    idPengguna: '850505025678',
    nama: 'Siti binti Mohamed',
    emel: 'siti.mohamed@example.com',
    peranan: 'Pegawai Bantuan',
    status: 'Aktif',
    tarikhDaftar: '2024-02-01'
  },
  {
    jenisPengguna: 'Staf',
    idPengguna: '820202036789',
    nama: 'Mohd Ali bin Hassan',
    emel: 'ali.hassan@nas.gov.my',
    peranan: 'Pegawai Sistem',
    status: 'Tidak Aktif',
    tarikhDaftar: '2023-12-10'
  },
  {
    jenisPengguna: 'Staf',
    idPengguna: '870707047890',
    nama: 'Nurul Ain binti Ibrahim',
    emel: 'nurul.ain@nas.gov.my',
    peranan: 'Pegawai Audit',
    status: 'Aktif',
    tarikhDaftar: '2024-01-20'
  },
  {
    jenisPengguna: 'Bukan Staf',
    idPengguna: '830303038901',
    nama: 'Abdul Rahman bin Sulaiman',
    emel: 'abdul.rahman@example.com',
    peranan: 'Pegawai Lapangan',
    status: 'Aktif',
    tarikhDaftar: '2024-02-15'
  }
]);

const auditReportData = ref([
  {
    namaModul: 'Pengurusan Pengguna',
    subModul: 'Daftar Pengguna',
    tindakan: 'Mendaftar pengguna baharu: Ahmad bin Abdullah',
    tarikhRekod: '2024-03-20 10:30:15'
  },
  {
    namaModul: 'Pengurusan Pengguna',
    subModul: 'Senarai Pengguna',
    tindakan: 'Mengemaskini maklumat pengguna: Siti binti Mohamed',
    tarikhRekod: '2024-03-20 09:15:22'
  },
  {
    namaModul: 'Audit Trail',
    subModul: 'Carian Audit Trail',
    tindakan: 'Mengakses laporan audit untuk tempoh Januari 2024',
    tarikhRekod: '2024-03-19 16:20:45'
  },
  {
    namaModul: 'Peranan & Kebenaran',
    subModul: 'Konfigurasi Peranan',
    tindakan: 'Mengemaskini peranan: Pegawai Audit',
    tarikhRekod: '2024-03-19 14:30:18'
  },
  {
    namaModul: 'Penyelenggaraan Am',
    subModul: 'Konfigurasi Kategori & Kod',
    tindakan: 'Menambah kod rujukan baharu: STATUS_PENGGUNA',
    tarikhRekod: '2024-03-18 11:45:30'
  }
]);

// Computed properties
const availableReports = computed(() => {
  return reports.value.map(report => ({
    namaLaporan: report.namaLaporan,
    keteranganRingkas: report.keteranganRingkas,
    modul: report.modul,
    tarikhKemaaskini: report.tarikhKemaaskini,
    aksi: report // Keep full object for actions
  }));
});

const filteredReports = computed(() => {
  let filtered = availableReports.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(report => 
      report.namaLaporan.toLowerCase().includes(query) ||
      report.keteranganRingkas.toLowerCase().includes(query)
    );
  }

  if (filters.value.modul) {
    filtered = filtered.filter(report => report.modul === filters.value.modul);
  }

  if (filters.value.tarikhKemaaskini) {
    // Filter by date range (simplified for demo)
    const today = new Date();
    const days = filters.value.tarikhKemaaskini === '7days' ? 7 : 
                 filters.value.tarikhKemaaskini === '30days' ? 30 : 90;
    const cutoffDate = new Date(today.getTime() - (days * 24 * 60 * 60 * 1000));
    
    filtered = filtered.filter(report => {
      const reportDate = new Date(report.tarikhKemaaskini);
      return reportDate >= cutoffDate;
    });
  }

  return filtered;
});

const currentReportData = computed(() => {
  if (!selectedReport.value) return [];
  
  switch (selectedReport.value.id) {
    case 1:
      return userReportData.value.map(user => ({
        jenisPengguna: user.jenisPengguna,
        idPengguna: user.idPengguna,
        nama: user.nama,
        emel: user.emel,
        peranan: user.peranan,
        status: user.status,
        tarikhDaftar: user.tarikhDaftar
      }));
    case 2:
      return auditReportData.value.map(audit => ({
        namaModul: audit.namaModul,
        subModul: audit.subModul,
        tindakan: audit.tindakan,
        tarikhRekod: audit.tarikhRekod
      }));
    default:
      return [];
  }
});

const currentReportColumns = computed(() => {
  if (!selectedReport.value) return [];
  
  switch (selectedReport.value.id) {
    case 1:
      return [
        { key: "jenisPengguna", label: "Jenis Pengguna", sortable: true },
        { key: "idPengguna", label: "ID Pengguna", sortable: true },
        { key: "nama", label: "Nama", sortable: true },
        { key: "emel", label: "Emel", sortable: true },
        { key: "peranan", label: "Peranan", sortable: true },
        { key: "status", label: "Status", sortable: true },
        { key: "tarikhDaftar", label: "Tarikh Daftar", sortable: true }
      ];
    case 2:
      return [
        { key: "namaModul", label: "Nama Modul", sortable: true },
        { key: "subModul", label: "Sub Modul", sortable: true },
        { key: "tindakan", label: "Tindakan", sortable: false },
        { key: "tarikhRekod", label: "Tarikh Rekod", sortable: true }
      ];
    default:
      return [];
  }
});

// Methods
const viewReport = (report) => {
  selectedReport.value = report;
  showReportView.value = true;
  
  // Log audit trail
  logAuditAction('Lihat Laporan', report.namaLaporan);
};

const backToReportList = () => {
  showReportView.value = false;
  selectedReport.value = null;
};

const exportPDF = async (report) => {
  try {
    exporting.value = true;
    
    // Simulate export delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create mock download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${report.namaLaporan.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    link.click();
    
    // Log audit trail
    logAuditAction('Cetak PDF', report.namaLaporan);
    
    $toast.success(`Laporan PDF "${report.namaLaporan}" berjaya dimuat turun`);
  } catch (error) {
    $toast.error('Ralat semasa memuat turun laporan PDF');
  } finally {
    exporting.value = false;
  }
};

const exportExcel = async (report) => {
  try {
    exporting.value = true;
    
    // Simulate export delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create mock download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${report.namaLaporan.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
    link.click();
    
    // Log audit trail
    logAuditAction('Cetak Excel', report.namaLaporan);
    
    $toast.success(`Laporan Excel "${report.namaLaporan}" berjaya dimuat turun`);
  } catch (error) {
    $toast.error('Ralat semasa memuat turun laporan Excel');
  } finally {
    exporting.value = false;
  }
};

const refreshReports = () => {
  // Simulate refresh
  $toast.info('Senarai laporan telah dimuat semula');
};

const logAuditAction = (action, reportName) => {
  // Simulate audit logging
  const auditLog = {
    username: 'AdminNAS01',
    reportType: reportName,
    action: action,
    timestamp: new Date().toLocaleString('ms-MY'),
    userRole: 'Admin Sistem'
  };
  
  console.log('Audit Log:', auditLog);
  
  // Add to audit report data for demo
  if (action.includes('Lihat') || action.includes('Cetak')) {
    auditReportData.value.unshift({
      namaModul: 'Statistik / Laporan',
      subModul: 'Pengurusan Laporan',
      tindakan: `${action}: ${reportName}`,
      tarikhRekod: new Date().toLocaleString('ms-MY')
    });
  }
};

// Initialize
onMounted(() => {
  // Set initial data
});
</script>

<style scoped>
/* Custom styles if needed */
</style>