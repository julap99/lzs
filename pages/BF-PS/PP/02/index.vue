<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-4">
            <h2 class="text-xl font-semibold">Cipta Akaun Pengguna</h2>
            <rs-badge variant="warning">{{ pendingAccounts }} akaun menunggu</rs-badge>
          </div>
          <div class="flex gap-2">
            <rs-button
              variant="primary"
              @click="runProcess"
              :loading="processing"
              :disabled="pendingAccounts === 0"
            >
              <Icon name="ic:baseline-play-arrow" class="mr-1" />
              Jalankan Proses
            </rs-button>
            <rs-button
              variant="outline"
              @click="refreshData"
            >
              <Icon name="ic:baseline-refresh" class="mr-1" />
              Muat Semula
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>
        <!-- Process Status -->
        <div v-if="processing" class="mb-6">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-center gap-3">
              <rs-spinner size="sm" />
              <div>
                <h4 class="font-medium text-blue-900">Memproses Akaun Pengguna...</h4>
                <p class="text-sm text-blue-700">{{ currentStep }}</p>
              </div>
            </div>
            <div class="mt-3">
              <div class="w-full bg-blue-200 rounded-full h-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${processProgress}%` }"
                ></div>
              </div>
              <p class="text-xs text-blue-600 mt-1">{{ processProgress }}% selesai</p>
            </div>
          </div>
        </div>

        <!-- Process Summary -->
        <div v-if="processCompleted" class="mb-6">
          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <div class="flex items-center gap-3">
              <Icon name="ic:baseline-check-circle" class="text-green-600 text-xl" />
              <div>
                <h4 class="font-medium text-green-900">Proses Selesai</h4>
                <p class="text-sm text-green-700">
                  {{ processedAccounts }} akaun berjaya dicipta, {{ failedAccounts }} gagal
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- New Users Detection -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-4 text-gray-900 border-b pb-2">
            Pengesanan Pengguna Baharu
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-blue-50 p-4 rounded-lg">
              <div class="flex items-center gap-2 mb-2">
                <Icon name="ic:baseline-business" class="text-blue-600" />
                <span class="font-medium text-blue-900">NAS (Staf)</span>
              </div>
              <p class="text-2xl font-bold text-blue-700">{{ adUsers }} pengguna</p>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <div class="flex items-center gap-2 mb-2">
                <Icon name="ic:baseline-people" class="text-green-600" />
                <span class="font-medium text-green-900">AD/NPS (Bukan Staf)</span>
              </div>
              <p class="text-2xl font-bold text-green-700">{{ npsUsers }} pengguna</p>
            </div>
            <div class="bg-orange-50 p-4 rounded-lg">
              <div class="flex items-center gap-2 mb-2">
                <Icon name="ic:baseline-person" class="text-orange-600" />
                <span class="font-medium text-orange-900">Awam (Asnaf)</span>
              </div>
              <p class="text-2xl font-bold text-orange-700">{{ manualUsers }} pengguna</p>
            </div>
          </div>
        </div>

        <!-- Generated Accounts Table -->
        <div>
          <h3 class="text-lg font-semibold mb-4 text-gray-900 border-b pb-2">
            Akaun Yang Dicipta
          </h3>
          
          <rs-table
            :data="generatedAccounts"
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
            <template v-slot:status="{ text }">
              <rs-badge :variant="text === 'Aktif' ? 'success' : 'danger'">
                {{ text }}
              </rs-badge>
            </template>

            <template v-slot:emailStatus="{ text }">
              <rs-badge :variant="text === 'Berjaya' ? 'success' : 'danger'">
                {{ text }}
              </rs-badge>
            </template>

            <template v-slot:tindakan="{ text }">
              <div class="flex justify-center items-center gap-2">
                <rs-button
                  v-if="text.emailStatus === 'Gagal'"
                  variant="outline"
                  size="sm"
                  @click="downloadNotification(text)"
                >
                  <Icon name="ic:baseline-download" class="w-4 h-4 mr-1" />
                  Muat Turun Surat
                </rs-button>
                <rs-button
                  variant="primary"
                  size="sm"
                  @click="viewDetails(text)"
                >
                  <Icon name="ic:baseline-visibility" class="w-4 h-4 mr-1" />
                  Lihat
                </rs-button>
              </div>
            </template>
          </rs-table>
        </div>
      </template>
    </rs-card>

    <!-- Account Details Modal -->
    <rs-modal v-model="showDetailsModal" size="lg">
      <rs-card>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Maklumat Akaun Pengguna</h3>
            <rs-button
              variant="ghost"
              @click="showDetailsModal = false"
            >
              <Icon name="ic:baseline-close" />
            </rs-button>
          </div>
        </template>

        <template #body>
          <div v-if="selectedAccount" class="space-y-6">
            <!-- Basic Information -->
            <div>
              <h4 class="text-md font-medium mb-3">Maklumat Asas</h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-sm font-medium text-gray-600">Nama Pengguna</label>
                  <p class="text-gray-900">{{ selectedAccount.nama }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-600">ID Pengguna</label>
                  <p class="text-gray-900 font-mono">{{ selectedAccount.userId }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-600">No. KP</label>
                  <p class="text-gray-900">{{ selectedAccount.noKp }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-600">Sumber Data</label>
                  <p class="text-gray-900">{{ selectedAccount.sumberData }}</p>
                </div>
              </div>
            </div>

            <!-- Account Details -->
            <div>
              <h4 class="text-md font-medium mb-3">Maklumat Akaun</h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-sm font-medium text-gray-600">Kata Laluan Sementara</label>
                  <p class="text-gray-900 font-mono">{{ selectedAccount.tempPassword }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-600">Peranan</label>
                  <p class="text-gray-900">{{ selectedAccount.peranan }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-600">Status</label>
                  <rs-badge :variant="selectedAccount.status === 'Aktif' ? 'success' : 'danger'">
                    {{ selectedAccount.status }}
                  </rs-badge>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-600">Tarikh Cipta</label>
                  <p class="text-gray-900">{{ selectedAccount.tarikhCipta }}</p>
                </div>
              </div>
            </div>

            <!-- Security Information -->
            <div>
              <h4 class="text-md font-medium mb-3">Maklumat Keselamatan</h4>
              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div class="flex items-start gap-3">
                  <Icon name="ic:baseline-warning" class="text-yellow-600 mt-0.5" />
                  <div>
                    <h5 class="font-medium text-yellow-900">Amaran Keselamatan</h5>
                    <ul class="text-sm text-yellow-800 mt-1 space-y-1">
                      <li>• Kata laluan sementara sah untuk 14 hari sahaja</li>
                      <li>• Pengguna mesti menukar kata laluan pada log masuk pertama</li>
                      <li>• Akaun akan dikunci selepas 3 percubaan log masuk yang gagal</li>
                      <li>• Akaun akan dinyahaktifkan selepas 14 hari tidak aktif</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- Email Status -->
            <div>
              <h4 class="text-md font-medium mb-3">Status Emel</h4>
              <div class="flex items-center gap-3">
                <rs-badge :variant="selectedAccount.emailStatus === 'Berjaya' ? 'success' : 'danger'">
                  {{ selectedAccount.emailStatus }}
                </rs-badge>
                <span class="text-sm text-gray-600">
                  {{ selectedAccount.emailStatus === 'Berjaya' ? 
                     `Dihantar pada ${selectedAccount.emailSentTime}` : 
                     'Gagal menghantar emel. Sila muat turun surat notifikasi.' }}
                </span>
              </div>
            </div>
          </div>
        </template>

        <template #footer>
          <div class="flex justify-end gap-3">
            <rs-button
              variant="ghost"
              @click="showDetailsModal = false"
            >
              Tutup
            </rs-button>
            <rs-button
              v-if="selectedAccount?.emailStatus === 'Gagal'"
              variant="primary"
              @click="downloadNotification(selectedAccount)"
            >
              <Icon name="ic:baseline-download" class="mr-1" />
              Muat Turun Surat Notifikasi
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
  title: "Cipta Akaun Pengguna",
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
    name: "Cipta Akaun Pengguna",
    type: "current",
    path: "/BF-PS/PP/02",
  },
]);

// Process states
const processing = ref(false);
const processCompleted = ref(false);
const processProgress = ref(0);
const currentStep = ref('');

// Modal states
const showDetailsModal = ref(false);
const selectedAccount = ref(null);
const pageSize = ref(10);

// Table configuration
const columns = [
  {
    key: "nama",
    label: "Nama Pengguna",
    sortable: true,
  },
  {
    key: "userId",
    label: "ID Pengguna",
    sortable: true,
  },
  {
    key: "noKp",
    label: "No. KP",
    sortable: true,
  },
  {
    key: "sumberData",
    label: "Sumber Data",
    sortable: true,
  },
  {
    key: "peranan",
    label: "Peranan",
    sortable: true,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
  },
  {
    key: "emailStatus",
    label: "Status Emel",
    sortable: true,
  },
  {
    key: "tarikhCipta",
    label: "Tarikh Cipta",
    sortable: true,
  },
  {
    key: "tindakan",
    label: "Tindakan",
    sortable: false,
  },
];

// Mock data for new users waiting for account creation
const pendingUsers = ref([
  {
    id: 1,
    nama: 'Ahmad bin Abdullah',
    noKp: '800101015432',
    sumberData: 'NAS',
    peranan: 'Admin Sistem',
    status: 'Menunggu'
  },
  {
    id: 2,
    nama: 'Siti binti Mohamed',
    noKp: '850505025678',
    sumberData: 'AD',
    peranan: 'Pegawai Bantuan',
    status: 'Menunggu'
  },
  {
    id: 3,
    nama: 'Mohd Ali bin Hassan',
    noKp: '820202036789',
    sumberData: 'NPS',
    peranan: 'Pegawai Sistem',
    status: 'Menunggu'
  },
  {
    id: 4,
    nama: 'Nurul Ain binti Ibrahim',
    noKp: '870707047890',
    sumberData: 'NAS',
    peranan: 'Pegawai Audit',
    status: 'Menunggu'
  },
  {
    id: 5,
    nama: 'Abdul Rahman bin Sulaiman',
    noKp: '830303038901',
    sumberData: 'AD',
    peranan: 'Pegawai Lapangan',
    status: 'Menunggu'
  }
]);

// Generated accounts data
const generatedAccounts = ref([]);

// Computed properties
const pendingAccounts = computed(() => pendingUsers.value.length);

const adUsers = computed(() => 
  pendingUsers.value.filter(user => user.sumberData === 'AD').length
);

const npsUsers = computed(() => 
  pendingUsers.value.filter(user => user.sumberData === 'NPS').length
);

const manualUsers = computed(() => 
  pendingUsers.value.filter(user => user.sumberData === 'Awam').length
);

const processedAccounts = computed(() => 
  generatedAccounts.value.filter(account => account.emailStatus === 'Berjaya').length
);

const failedAccounts = computed(() => 
  generatedAccounts.value.filter(account => account.emailStatus === 'Gagal').length
);

// Methods
const generateUserId = (noKp) => {
  // Generate user ID based on IC number
  const last6Digits = noKp.slice(-6);
  return `NAS${last6Digits}`;
};

const generateTempPassword = () => {
  // Generate a strong temporary password
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = 'NAS@';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const simulateEmailSending = async () => {
  // Simulate email sending with 90% success rate
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Math.random() > 0.1; // 90% success rate
};

const runProcess = async () => {
  if (pendingUsers.value.length === 0) return;

  processing.value = true;
  processProgress.value = 0;
  processCompleted.value = false;
  generatedAccounts.value = [];

  const steps = [
    'Mengesan pengguna baharu...',
    'Menjana ID pengguna...',
    'Menjana kata laluan sementara...',
    'Menetapkan peranan...',
    'Menghantar emel notifikasi...',
    'Menyelesaikan proses...'
  ];

  for (let i = 0; i < pendingUsers.value.length; i++) {
    const user = pendingUsers.value[i];
    
    // Update progress for each step
    for (let step = 0; step < steps.length; step++) {
      currentStep.value = steps[step];
      processProgress.value = ((i * steps.length + step) / (pendingUsers.value.length * steps.length)) * 100;
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // Generate account
    const userId = generateUserId(user.noKp);
    const tempPassword = generateTempPassword();
    const emailSuccess = await simulateEmailSending();
    
    const account = {
      id: user.id,
      nama: user.nama,
      userId: userId,
      noKp: user.noKp,
      sumberData: user.sumberData,
      peranan: user.peranan,
      status: 'Aktif',
      tempPassword: tempPassword,
      emailStatus: emailSuccess ? 'Berjaya' : 'Gagal',
      emailSentTime: emailSuccess ? new Date().toLocaleString('ms-MY') : null,
      tarikhCipta: new Date().toLocaleDateString('ms-MY')
    };

    generatedAccounts.value.push(account);
  }

  // Remove processed users from pending list
  pendingUsers.value = [];

  processing.value = false;
  processProgress.value = 100;
  processCompleted.value = true;

  // Show success notification
  $toast.success(`${generatedAccounts.value.length} akaun pengguna berjaya dicipta`);
};

const refreshData = () => {
  // Reset the process
  processing.value = false;
  processCompleted.value = false;
  processProgress.value = 0;
  currentStep.value = '';
  generatedAccounts.value = [];
  
  // Restore pending users (for demo purposes)
  if (pendingUsers.value.length === 0) {
    pendingUsers.value = [
      {
        id: 1,
        nama: 'Ahmad bin Abdullah',
        noKp: '800101015432',
        sumberData: 'NAS',
        peranan: 'Admin Sistem',
        status: 'Menunggu'
      },
      {
        id: 2,
        nama: 'Siti binti Mohamed',
        noKp: '850505025678',
        sumberData: 'AD',
        peranan: 'Pegawai Bantuan',
        status: 'Menunggu'
      },
      {
        id: 3,
        nama: 'Mohd Ali bin Hassan',
        noKp: '820202036789',
        sumberData: 'NPS',
        peranan: 'Pegawai Sistem',
        status: 'Menunggu'
      },
      {
        id: 4,
        nama: 'Nurul Ain binti Ibrahim',
        noKp: '870707047890',
        sumberData: 'NAS',
        peranan: 'Pegawai Audit',
        status: 'Menunggu'
      },
      {
        id: 5,
        nama: 'Abdul Rahman bin Sulaiman',
        noKp: '830303038901',
        sumberData: 'AD',
        peranan: 'Pegawai Lapangan',
        status: 'Menunggu'
      }
    ];
  }

  $toast.info('Data telah dimuat semula');
};

const viewDetails = (account) => {
  selectedAccount.value = account;
  showDetailsModal.value = true;
};

const downloadNotification = (account) => {
  // Simulate PDF download
  const link = document.createElement('a');
  link.href = '#';
  link.download = `Surat_Notifikasi_${account.userId}.pdf`;
  link.click();
  
  $toast.success(`Surat notifikasi untuk ${account.nama} sedang dimuat turun`);
};

// Initialize
onMounted(() => {
  // Set initial state
});
</script>

<style scoped>
/* Custom styles if needed */
</style>