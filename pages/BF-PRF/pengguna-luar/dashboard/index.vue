<!-- 
  RTMF SCREEN: PL-DASH-01
  PURPOSE: Dashboard for Pengguna Luar (External Users)
  DESCRIPTION: Main dashboard showing search functionality options for external users
  ROUTE: /BF-PRF/pengguna-luar/dashboard
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Welcome Header -->
    <rs-card class="mb-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-l-4 border-primary">
      <template #body>
        <div class="text-center py-6">
          <h1 class="text-3xl font-bold text-primary mb-2">Selamat Datang ke Sistem Carian LZS</h1>
          <p class="text-xl text-gray-700 mb-3">اَلسَلامُ عَلَيْكُم وَرَحْمَةُ اَللهِ وَبَرَكاتُهُ‎</p>
          <p class="text-lg text-gray-600">Sistem Carian untuk Pengguna Luar</p>
        </div>
      </template>
    </rs-card>

    <!-- User Profile Card -->
    <rs-card class="mb-6">
      <template #body>
        <div class="flex items-center justify-between p-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg">
              {{ userProfile.nama.charAt(0) }}
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-900">{{ userProfile.nama }}</h2>
              <p class="text-xs text-primary font-medium">{{ userProfile.organisasi }}</p>
              <p class="text-xs text-info font-medium">{{ userProfile.emel }}</p>
            </div>
          </div>
          <div class="flex gap-2">
            <rs-button size="sm" variant="primary-outline" @click="showProfile = true" title="Profil">
              <Icon name="heroicons:user" size="16" class="mr-2" />
              Profil
            </rs-button>
            <rs-button size="sm" variant="danger-outline" @click="handleLogout" title="Log Keluar">
              <Icon name="heroicons:arrow-right-on-rectangle" size="16" class="mr-2" />
              Log Keluar
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Alert Section for Pending Applications (moved below profile) -->
    <rs-card v-if="hasPendingApplications && !alertDismissed" class="mb-6 border-l-4 border-warning bg-warning/5">
      <template #body>
        <div class="p-4">
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 bg-warning/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Icon name="heroicons:exclamation-triangle" size="1.2rem" class="text-warning" />
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-warning mb-2">Permohonan Memerlukan Kemaskini</h3>
              <p class="text-gray-700 mb-4">Anda mempunyai permohonan yang memerlukan kemaskini berdasarkan ulasan Eksekutif.</p>
              
              <!-- Pending Application Details -->
              <div class="bg-white border border-warning/20 rounded-lg p-4 mb-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-600 mb-1">ID Permohonan</label>
                    <p class="text-gray-900 font-mono">{{ pendingApplication.idPermohonan }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-600 mb-1">Status</label>
                    <rs-badge variant="warning">{{ pendingApplication.statusPermohonan }}</rs-badge>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-600 mb-1">Tarikh Permohonan</label>
                    <p class="text-gray-900">{{ formatDate(pendingApplication.tarikhPermohonan) }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-600 mb-1">Tarikh Ulasan</label>
                    <p class="text-gray-900">{{ formatDate(pendingApplication.tarikhUlasan) }}</p>
                  </div>
                </div>
                
                <!-- Executive Review -->
                <div class="mb-3">
                  <label class="block text-sm font-medium text-gray-600 mb-1">Ulasan Eksekutif</label>
                  <div class="p-3 border border-warning/20 rounded bg-warning/5">
                    <p class="text-gray-800">{{ pendingApplication.ulasanEksekutif }}</p>
                  </div>
                </div>
              </div>
              
              <!-- Action Buttons -->
              <div class="flex gap-3">
                <rs-button variant="warning" @click="goToUpdateApplication">
                  <Icon name="heroicons:pencil-square" size="1rem" class="mr-2" />
                  Kemaskini Permohonan
                </rs-button>
                <rs-button variant="secondary-outline" @click="dismissAlert">
                  <Icon name="heroicons:x-mark" size="1rem" class="mr-2" />
                  Tutup
                </rs-button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Help Section -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900">Bantuan & Panduan</h3>
      </template>
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <h4 class="font-medium text-gray-900">Cara Menggunakan Sistem</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li class="flex items-start gap-2">
                <Icon name="heroicons:check-circle" size="1rem" class="text-green-500 mt-0.5 flex-shrink-0" />
                <span>Pilih jenis carian yang diperlukan</span>
              </li>
              <li class="flex items-start gap-2">
                <Icon name="heroicons:check-circle" size="1rem" class="text-green-500 mt-0.5 flex-shrink-0" />
                <span>Isi maklumat carian dengan tepat</span>
              </li>
              <li class="flex items-start gap-2">
                <Icon name="heroicons:check-circle" size="1rem" class="text-green-500 mt-0.5 flex-shrink-0" />
                <span>Klik butang "Cari" untuk memulakan carian</span>
              </li>
            </ul>
          </div>
          <div class="space-y-4">
            <h4 class="font-medium text-gray-900">Maklumat Tambahan</h4>
            <div class="space-y-3 text-sm text-gray-600">
              <div class="flex items-start gap-2">
                <Icon name="heroicons:information-circle" size="1rem" class="text-blue-500 mt-0.5 flex-shrink-0" />
                <span>Sistem ini hanya untuk tujuan carian sahaja</span>
              </div>
              <div class="flex items-start gap-2">
                <Icon name="heroicons:information-circle" size="1rem" class="text-blue-500 mt-0.5 flex-shrink-0" />
                <span>Maklumat yang dipaparkan adalah maklumat awam</span>
              </div>
              <div class="flex items-start gap-2">
                <Icon name="heroicons:information-circle" size="1rem" class="text-blue-500 mt-0.5 flex-shrink-0" />
                <span>Untuk maklumat lanjut, sila hubungi LZS</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Profile Modal -->
    <rs-modal v-model="showProfile" title="Profil Pengguna Luar">
      <template #body>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nama Penuh</label>
              <p class="text-gray-900">{{ userProfile.nama }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Emel</label>
              <p class="text-gray-900">{{ userProfile.emel }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Organisasi</label>
              <p class="text-gray-900">{{ userProfile.organisasi }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status Akaun</label>
              <rs-badge variant="success">Aktif</rs-badge>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Jenis Pengguna</label>
              <rs-badge variant="primary">Pengguna Luar</rs-badge>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <rs-button variant="secondary-outline" @click="showProfile = false">
            Tutup
          </rs-button>
          <rs-button variant="primary" @click="navigateTo('/BF-PRF/pengguna-luar/profile/edit')">
            Kemaskini Profil
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

definePageMeta({
  title: "Dashboard Pengguna Luar",
  description: "Dashboard utama untuk pengguna luar dengan akses carian sahaja",
});

const router = useRouter();
const toast = useToast();

const breadcrumb = ref([
  {
    name: "BF-PRF",
    type: "link",
    path: "/BF-PRF",
  },
  {
    name: "Pengguna Luar",
    type: "link",
    path: "/BF-PRF/pengguna-luar",
  },
  {
    name: "Dashboard",
    type: "current",
    path: "/BF-PRF/pengguna-luar/dashboard",
  },
]);

// User profile data
const userProfile = ref({
  nama: "Demo Pengguna Luar",
  emel: "demo@pengguna-luar.com",
  organisasi: "Demo Organization",
});

// Stats data
const stats = ref({
  totalSearches: 0,
  organizationsFound: 0,
  branchesFound: 0,
  recipientsFound: 0,
});

// Search history
const searchHistory = ref([]);

// Modal state
const showProfile = ref(false);

// Pending application data (mock data for presentation)
const pendingApplication = ref({
  idPermohonan: "PRF-2025-001",
  statusPermohonan: "Perlu Pembetulan",
  tarikhPermohonan: "2025-01-15",
  tarikhUlasan: "2025-01-20",
  ulasanEksekutif: "Sila kemaskini alamat organisasi & no telefon. Sila memuat naik dokumen yang terkini."
});

// Alert state
const hasPendingApplications = ref(true); // Set to true for demo purposes
const alertDismissed = ref(false);

// Helper functions
const getSearchIcon = (type) => {
  const icons = {
    'organisasi': 'heroicons:building-office',
    'cawangan': 'heroicons:building-office-2',
    'recipient': 'heroicons:user-group'
  };
  return icons[type] || 'heroicons:magnifying-glass';
};

const getResultVariant = (hasResults) => {
  return hasResults ? 'success' : 'warning';
};

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('ms-MY', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const navigateTo = (path) => {
  router.push(path);
};

const repeatSearch = (search) => {
  // Navigate to the appropriate search page
  switch (search.type) {
    case 'organisasi':
      router.push('/BF-PRF/OR/PP/01');
      break;
    case 'cawangan':
      router.push('/BF-PRF/OR/PB/01');
      break;
    case 'recipient':
      router.push('/BF-PRF/TP/PP/01');
      break;
    default:
      router.push('/BF-PRF/OR/PP/01');
  }
};

const clearSearchHistory = () => {
  searchHistory.value = [];
  toast.success('Sejarah carian telah dikosongkan');
};

const handleLogout = () => {
  // Clear user data
  localStorage.removeItem('userRole');
  localStorage.removeItem('userInfo');
  
  toast.success('Log keluar berjaya');
  
  // Redirect to login
  router.push('/BF-PRF/pengguna-luar/login');
};

// Alert functions
const goToUpdateApplication = () => {
  // Navigate to kemaskini page with the application ID
  router.push(`/BF-PRF/OR/PP/kemaskini/${pendingApplication.value.idPermohonan}`);
};

const dismissAlert = () => {
  alertDismissed.value = true;
  hasPendingApplications.value = false;
  toast.info('Alert telah ditutup');
};

// Check if user has pending applications (mock logic)
const checkPendingApplications = () => {
  // In real implementation, this would check API for pending applications
  // For demo purposes, we'll use the mock data
  if (alertDismissed.value) {
    hasPendingApplications.value = false;
  } else {
    hasPendingApplications.value = true;
  }
};

// Load user data from localStorage
const loadUserData = () => {
  const storedUserInfo = localStorage.getItem('userInfo');
  if (storedUserInfo) {
    try {
      userProfile.value = { ...userProfile.value, ...JSON.parse(storedUserInfo) };
    } catch (error) {
      console.error('Error parsing user info:', error);
    }
  }
};

// Load search history from localStorage
const loadSearchHistory = () => {
  const storedHistory = localStorage.getItem('penggunaLuarSearchHistory');
  if (storedHistory) {
    try {
      searchHistory.value = JSON.parse(storedHistory);
    } catch (error) {
      console.error('Error parsing search history:', error);
    }
  }
};

// Load stats from localStorage
const loadStats = () => {
  const storedStats = localStorage.getItem('penggunaLuarStats');
  if (storedStats) {
    try {
      stats.value = { ...stats.value, ...JSON.parse(storedStats) };
    } catch (error) {
      console.error('Error parsing stats:', error);
    }
  }
};

onMounted(() => {
  console.log("Loading Pengguna Luar dashboard");
  
  // Load user data
  loadUserData();
  loadSearchHistory();
  loadStats();
  
  // Check for pending applications
  checkPendingApplications();
  
  // Ensure sidebar is visible
  const vLayout = document.querySelector('.v-layout');
  if (vLayout) {
    vLayout.classList.remove('menu-hide');
  }
  
  // Ensure menu overlay is not hidden
  const menuOverlay = document.querySelector('.menu-overlay');
  if (menuOverlay) {
    menuOverlay.classList.remove('hide');
  }
});
</script> 