<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Dashboard Header Notice -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <Icon name="ic:baseline-admin-panel-settings" class="text-blue-600 w-8 h-8" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-blue-900 mb-2">Dashboard Pentadbir Sistem</h1>
          <p class="text-blue-700">Pusat kawalan utama untuk pengurusan sistem, pengguna, peranan, dan audit trail. Pantau aktiviti sistem secara real-time.</p>
        </div>
        <div class="ml-auto">
          <rs-badge variant="success" size="lg">
            <Icon name="ic:baseline-check-circle" class="mr-1" />
            Sistem Aktif
          </rs-badge>
        </div>
      </div>
    </div>

    <!-- Key Metrics Dashboard -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <!-- Total Users -->
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg stats-card hover-lift">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blue-100 text-sm font-medium">Jumlah Pengguna</p>
            <p class="text-3xl font-bold">{{ totalUsers }}</p>
            <div class="flex items-center mt-2">
              <Icon name="ic:baseline-trending-up" class="w-4 h-4 text-blue-200 mr-1" />
              <span class="text-blue-200 text-xs">+12 minggu ini</span>
            </div>
          </div>
          <div class="bg-blue-400 bg-opacity-30 p-3 rounded-lg">
            <Icon name="ic:baseline-people" class="w-8 h-8 text-blue-100" />
          </div>
        </div>
      </div>

      <!-- Active Sessions -->
      <div class="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg stats-card hover-lift">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-100 text-sm font-medium">Sesi Aktif</p>
            <p class="text-3xl font-bold">{{ activeSessions }}</p>
            <div class="flex items-center mt-2">
              <Icon name="ic:baseline-circle" class="w-4 h-4 text-green-200 mr-1 animate-pulse" />
              <span class="text-green-200 text-xs">Masa nyata</span>
            </div>
          </div>
          <div class="bg-green-400 bg-opacity-30 p-3 rounded-lg">
            <Icon name="ic:baseline-wifi" class="w-8 h-8 text-green-100" />
          </div>
        </div>
      </div>

      <!-- System Modules -->
      <div class="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg stats-card hover-lift">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-purple-100 text-sm font-medium">Modul Sistem</p>
            <p class="text-3xl font-bold">{{ systemModules }}</p>
            <div class="flex items-center mt-2">
              <Icon name="ic:baseline-check-circle" class="w-4 h-4 text-purple-200 mr-1" />
              <span class="text-purple-200 text-xs">Semua aktif</span>
            </div>
          </div>
          <div class="bg-purple-400 bg-opacity-30 p-3 rounded-lg">
            <Icon name="ic:baseline-widgets" class="w-8 h-8 text-purple-100" />
          </div>
        </div>
      </div>

      <!-- Security Status -->
      <div class="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg stats-card hover-lift">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-orange-100 text-sm font-medium">Status Keselamatan</p>
            <p class="text-3xl font-bold">{{ securityScore }}%</p>
            <div class="flex items-center mt-2">
              <Icon name="ic:baseline-security" class="w-4 h-4 text-orange-200 mr-1" />
              <span class="text-orange-200 text-xs">Optimal</span>
            </div>
          </div>
          <div class="bg-orange-400 bg-opacity-30 p-3 rounded-lg">
            <Icon name="ic:baseline-shield" class="w-8 h-8 text-orange-100" />
          </div>
        </div>
      </div>
    </div>

    <!-- Main Dashboard Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Quick Actions Panel -->
      <div class="lg:col-span-2">
        <rs-card>
          <template #header>
            <div class="flex items-center gap-2">
              <Icon name="ic:baseline-speed" class="text-blue-600" />
              <h3 class="text-lg font-semibold">Tindakan Pantas</h3>
            </div>
          </template>
          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- User Management Actions -->
              <div class="space-y-3">
                <h4 class="font-medium text-gray-700 flex items-center">
                  <Icon name="ic:baseline-people" class="mr-2 text-blue-500" />
                  Pengurusan Pengguna
                </h4>
                <div class="space-y-2">
                  <rs-button variant="outline" size="sm" class="w-full justify-start" @click="navigateTo('/BF-PS/PP')">
                    <Icon name="ic:baseline-list" class="mr-2" />
                    Senarai Pengguna
                  </rs-button>
                  <rs-button variant="outline" size="sm" class="w-full justify-start" @click="navigateTo('/BF-PS/PP/01')">
                    <Icon name="ic:baseline-person-add" class="mr-2" />
                    Daftar Pengguna Baharu
                  </rs-button>
                  <rs-button variant="outline" size="sm" class="w-full justify-start" @click="navigateTo('/BF-PS/PP/03')">
                    <Icon name="ic:baseline-security" class="mr-2" />
                    Audit Pengguna
                  </rs-button>
                </div>
              </div>

              <!-- System Management Actions -->
              <div class="space-y-3">
                <h4 class="font-medium text-gray-700 flex items-center">
                  <Icon name="ic:baseline-settings" class="mr-2 text-green-500" />
                  Pengurusan Sistem
                </h4>
                <div class="space-y-2">
                  <rs-button variant="outline" size="sm" class="w-full justify-start" @click="navigateTo('/BF-PS/PPK/KP')">
                    <Icon name="ic:baseline-admin-panel-settings" class="mr-2" />
                    Peranan & Kebenaran
                  </rs-button>
                  <rs-button variant="outline" size="sm" class="w-full justify-start" @click="navigateTo('/BF-PS/PK')">
                    <Icon name="ic:baseline-code" class="mr-2" />
                    Penyelenggaraan Kod
                  </rs-button>
                  <rs-button variant="outline" size="sm" class="w-full justify-start" @click="navigateTo('/BF-PS/CAT')">
                    <Icon name="ic:baseline-search" class="mr-2" />
                    Carian Audit Trail
                  </rs-button>
                </div>
              </div>

              <!-- Reports & Analytics -->
              <div class="space-y-3">
                <h4 class="font-medium text-gray-700 flex items-center">
                  <Icon name="ic:baseline-assessment" class="mr-2 text-purple-500" />
                  Laporan & Analisis
                </h4>
                <div class="space-y-2">
                  <rs-button variant="outline" size="sm" class="w-full justify-start" @click="navigateTo('/BF-PS/SL')">
                    <Icon name="ic:baseline-bar-chart" class="mr-2" />
                    Statistik Laporan
                  </rs-button>
                  <rs-button variant="outline" size="sm" class="w-full justify-start" @click="generateSystemReport">
                    <Icon name="ic:baseline-description" class="mr-2" />
                    Jana Laporan Sistem
                  </rs-button>
                  <rs-button variant="outline" size="sm" class="w-full justify-start" @click="systemHealthCheck">
                    <Icon name="ic:baseline-health-and-safety" class="mr-2" />
                    Pemeriksaan Kesihatan
                  </rs-button>
                </div>
              </div>

              <!-- Maintenance Actions -->
              <div class="space-y-3">
                <h4 class="font-medium text-gray-700 flex items-center">
                  <Icon name="ic:baseline-build" class="mr-2 text-orange-500" />
                  Penyelenggaraan
                </h4>
                <div class="space-y-2">
                  <rs-button variant="outline" size="sm" class="w-full justify-start" @click="backupSystem" :loading="backingUp">
                    <Icon name="ic:baseline-backup" class="mr-2" />
                    {{ backingUp ? 'Membuat Sandaran...' : 'Sandaran Sistem' }}
                  </rs-button>
                  <rs-button variant="outline" size="sm" class="w-full justify-start" @click="clearCache" :loading="clearingCache">
                    <Icon name="ic:baseline-clear-all" class="mr-2" />
                    {{ clearingCache ? 'Membersihkan...' : 'Bersihkan Cache' }}
                  </rs-button>
                  <rs-button variant="outline" size="sm" class="w-full justify-start" @click="systemUpdate" :loading="updating">
                    <Icon name="ic:baseline-system-update" class="mr-2" />
                    {{ updating ? 'Mengemas kini...' : 'Kemas kini Sistem' }}
                  </rs-button>
                </div>
              </div>
            </div>
          </template>
        </rs-card>
      </div>

      <!-- System Status & Activity -->
      <div class="space-y-6">
        <!-- System Status -->
        <rs-card>
          <template #header>
            <div class="flex items-center gap-2">
              <Icon name="ic:baseline-monitor-heart" class="text-green-600" />
              <h3 class="text-lg font-semibold">Status Sistem</h3>
            </div>
          </template>
          <template #body>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Pangkalan Data</span>
                <div class="flex items-center">
                  <div class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span class="text-sm font-medium text-green-700">Dalam Talian</span>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Pelayan Web</span>
                <div class="flex items-center">
                  <div class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span class="text-sm font-medium text-green-700">Optimal</span>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Sistem Cache</span>
                <div class="flex items-center">
                  <div class="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                  <span class="text-sm font-medium text-yellow-700">Perlahan</span>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Backup Harian</span>
                <div class="flex items-center">
                  <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span class="text-sm font-medium text-green-700">Selesai</span>
                </div>
              </div>
            </div>
            
            <!-- System Performance -->
            <div class="mt-6 pt-4 border-t border-gray-200">
              <h4 class="text-sm font-medium text-gray-700 mb-3">Prestasi Sistem</h4>
              <div class="space-y-3">
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span class="text-gray-600">CPU</span>
                    <span class="font-medium">{{ cpuUsage }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-blue-600 h-2 rounded-full transition-all duration-500" :style="{ width: cpuUsage + '%' }"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span class="text-gray-600">Memori</span>
                    <span class="font-medium">{{ memoryUsage }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-green-600 h-2 rounded-full transition-all duration-500" :style="{ width: memoryUsage + '%' }"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span class="text-gray-600">Storan</span>
                    <span class="font-medium">{{ storageUsage }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-orange-600 h-2 rounded-full transition-all duration-500" :style="{ width: storageUsage + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Recent Activity -->
        <rs-card>
          <template #header>
            <div class="flex items-center gap-2">
              <Icon name="ic:baseline-history" class="text-blue-600" />
              <h3 class="text-lg font-semibold">Aktiviti Terkini</h3>
            </div>
          </template>
          <template #body>
            <div class="space-y-3">
              <div v-for="activity in recentActivities" :key="activity.id" class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon :name="activity.icon" class="w-4 h-4 text-blue-600" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
                  <p class="text-xs text-gray-500">{{ activity.description }}</p>
                  <p class="text-xs text-gray-400 mt-1">{{ activity.time }}</p>
                </div>
              </div>
            </div>
            <div class="mt-4 pt-3 border-t border-gray-200">
              <rs-button variant="outline" size="sm" class="w-full" @click="navigateTo('/BF-PS/CAT')">
                <Icon name="ic:baseline-visibility" class="mr-2" />
                Lihat Semua Aktiviti
              </rs-button>
            </div>
          </template>
        </rs-card>
      </div>
    </div>

    <!-- System Information Modal -->
    <rs-modal
      v-model="showSystemInfoModal"
      title="Maklumat Sistem"
      size="lg"
      position="center"
    >
      <template #body>
        <div class="space-y-6">
          <!-- System Version -->
          <div>
            <h4 class="font-medium mb-3">Versi Sistem</h4>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">Aplikasi</p>
                  <p class="font-medium">{{ systemInfo.version }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Build</p>
                  <p class="font-medium">{{ systemInfo.build }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Tarikh Release</p>
                  <p class="font-medium">{{ systemInfo.releaseDate }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Environment</p>
                  <p class="font-medium">{{ systemInfo.environment }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Database Status -->
          <div>
            <h4 class="font-medium mb-3">Status Pangkalan Data</h4>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">Sambungan</p>
                  <div class="flex items-center">
                    <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <p class="font-medium">Aktif</p>
                  </div>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Response Time</p>
                  <p class="font-medium">{{ systemInfo.dbResponseTime }}ms</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Storage Used</p>
                  <p class="font-medium">{{ systemInfo.storageUsed }}%</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Backup Terakhir</p>
                  <p class="font-medium">{{ systemInfo.lastBackup }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Server Resources -->
          <div>
            <h4 class="font-medium mb-3">Sumber Server</h4>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm">CPU Usage</span>
                <div class="flex items-center space-x-2">
                  <div class="w-32 bg-gray-200 rounded-full h-2">
                    <div class="bg-blue-600 h-2 rounded-full" :style="`width: ${systemInfo.cpuUsage}%`"></div>
                  </div>
                  <span class="text-sm font-medium">{{ systemInfo.cpuUsage }}%</span>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm">Memory Usage</span>
                <div class="flex items-center space-x-2">
                  <div class="w-32 bg-gray-200 rounded-full h-2">
                    <div class="bg-green-600 h-2 rounded-full" :style="`width: ${systemInfo.memoryUsage}%`"></div>
                  </div>
                  <span class="text-sm font-medium">{{ systemInfo.memoryUsage }}%</span>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm">Disk Usage</span>
                <div class="flex items-center space-x-2">
                  <div class="w-32 bg-gray-200 rounded-full h-2">
                    <div class="bg-yellow-600 h-2 rounded-full" :style="`width: ${systemInfo.diskUsage}%`"></div>
                  </div>
                  <span class="text-sm font-medium">{{ systemInfo.diskUsage }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end">
          <rs-button variant="primary-outline" @click="showSystemInfoModal = false">
            Tutup
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

definePageMeta({
  title: "Dashboard Pentadbir Sistem",
});

const breadcrumb = ref([
  {
    name: "Pentadbir Sistem",
    type: "current",
    path: "/BF-PS",
  },
]);

// State management
const showSystemInfoModal = ref(false);

// Enhanced Dashboard Statistics
const totalUsers = ref(1247);
const activeSessions = ref(89);
const systemModules = ref(6);
const securityScore = ref(97);

// System Performance Metrics
const cpuUsage = ref(45);
const memoryUsage = ref(67);
const storageUsage = ref(72);

// Loading states for maintenance actions
const backingUp = ref(false);
const clearingCache = ref(false);
const updating = ref(false);

// Recent Activities with enhanced presentation
const recentActivities = ref([
  {
    id: 1,
    title: "Pengguna Baharu Didaftarkan",
    description: "AdminICT01 mendaftar pengguna baharu dalam sistem",
    icon: "ic:baseline-person-add",
    time: "2 minit yang lalu"
  },
  {
    id: 2,
    title: "Peranan EKP Dikemaskini",
    description: "Kebenaran akses untuk peranan EKP telah dikemaskini",
    icon: "ic:baseline-admin-panel-settings",
    time: "15 minit yang lalu"
  },
  {
    id: 3,
    title: "Kod NEGERI Baharu",
    description: "Kod rujukan negeri baharu telah ditambah ke sistem",
    icon: "ic:baseline-code",
    time: "1 jam yang lalu"
  },
  {
    id: 4,
    title: "Laporan Audit Dijana",
    description: "AuditOfficer01 menjana laporan audit trail bulanan",
    icon: "ic:baseline-assessment",
    time: "2 jam yang lalu"
  },
  {
    id: 5,
    title: "Backup Sistem Selesai",
    description: "Sandaran harian sistem telah berjaya diselesaikan",
    icon: "ic:baseline-backup",
    time: "3 jam yang lalu"
  }
]);

// System health
const systemHealth = ref([
  {
    component: "Web Server",
    status: "Sihat",
    value: "99.9% uptime"
  },
  {
    component: "Database",
    status: "Sihat",
    value: "< 50ms response"
  },
  {
    component: "Authentication",
    status: "Sihat",
    value: "Active Directory OK"
  },
  {
    component: "File Storage",
    status: "Amaran",
    value: "78% penuh"
  },
  {
    component: "Backup Service",
    status: "Sihat",
    value: "Daily backup OK"
  }
]);

// Module access
const moduleAccess = ref([
  {
    name: "Pengurusan Pengguna",
    description: "Daftar, cipta dan audit pengguna",
    icon: "ic:baseline-people",
    path: "/BF-PS/PP",
    available: true,
    lastAccessed: "Hari ini",
    accessCount: 45
  },
  {
    name: "Pengurusan Peranan",
    description: "Konfigurasi peranan dan kebenaran",
    icon: "ic:baseline-admin-panel-settings",
    path: "/BF-PS/PPK",
    available: true,
    lastAccessed: "Semalam",
    accessCount: 23
  },
  {
    name: "Penyelenggaraan Kod",
    description: "Konfigurasi kategori dan kod sistem",
    icon: "ic:baseline-settings",
    path: "/BF-PS/PK",
    available: true,
    lastAccessed: "2 hari lalu",
    accessCount: 18
  },
  {
    name: "Carian Audit Trail",
    description: "Carian dan paparan rekod audit sistem",
    icon: "ic:baseline-security",
    path: "/BF-PS/CAT",
    available: true,
    lastAccessed: "Hari ini",
    accessCount: 34
  },
  {
    name: "Statistik Laporan",
    description: "Jana dan lihat laporan sistem",
    icon: "ic:baseline-assessment",
    path: "/BF-PS/SL",
    available: true,
    lastAccessed: "Hari ini",
    accessCount: 67
  }
]);

// System information
const systemInfo = ref({
  version: "v2.1.0",
  build: "2024.01.15.001",
  releaseDate: "15 Januari 2024",
  environment: "Production",
  dbResponseTime: 42,
  storageUsed: 68,
  lastBackup: "14 Jan 2024, 23:00",
  cpuUsage: 35,
  memoryUsage: 62,
  diskUsage: 78
});

// Enhanced Dashboard Methods
const generateSystemReport = async () => {
  console.log('🎯 Generating system report...');
  // Simulate report generation delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  console.log('✅ System report generated successfully');
};

const systemHealthCheck = async () => {
  console.log('🔍 Running system health check...');
  // Simulate health check delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log('✅ System health check completed - All systems optimal');
};

const backupSystem = async () => {
  backingUp.value = true;
  console.log('💾 Starting system backup...');
  
  try {
    // Simulate backup process
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('✅ System backup completed successfully');
  } finally {
    backingUp.value = false;
  }
};

const clearCache = async () => {
  clearingCache.value = true;
  console.log('🧹 Clearing system cache...');
  
  try {
    // Simulate cache clearing
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('✅ System cache cleared successfully');
    
    // Update cache status in performance indicators
    if (storageUsage.value > 50) {
      storageUsage.value -= 15;
    }
  } finally {
    clearingCache.value = false;
  }
};

const systemUpdate = async () => {
  updating.value = true;
  console.log('🔄 Checking for system updates...');
  
  try {
    // Simulate update check
    await new Promise(resolve => setTimeout(resolve, 2500));
    console.log('✅ System is up to date');
  } finally {
    updating.value = false;
  }
};

// Initialize dashboard data
onMounted(() => {
  console.log('🎛️ Dashboard Pentadbir Sistem loaded');
  
  // Simulate real-time updates for presentation
  setInterval(() => {
    // Update statistics slightly
    totalUsers.value += Math.floor(Math.random() * 2);
    activeSessions.value = Math.max(50, Math.min(150, activeSessions.value + (Math.random() - 0.5) * 10));
    
    // Update system performance
    cpuUsage.value = Math.max(20, Math.min(80, cpuUsage.value + (Math.random() - 0.5) * 5));
    memoryUsage.value = Math.max(40, Math.min(90, memoryUsage.value + (Math.random() - 0.5) * 3));
    storageUsage.value = Math.max(60, Math.min(95, storageUsage.value + (Math.random() - 0.5) * 2));
  }, 30000); // Update every 30 seconds
});
</script>

<style scoped>
/* Enhanced Dashboard Styling */
.stats-card {
  transition: all 0.3s ease-in-out;
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

/* Fade-in animation for dashboard elements */
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

/* Pulsing indicator for live data */
.pulse-indicator {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

/* Progress bar animations */
.progress-bar {
  transition: width 0.8s ease-in-out;
}

/* Button enhancements */
.btn-enhanced {
  transition: all 0.2s ease-in-out;
}

.btn-enhanced:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Activity feed styling */
.activity-item {
  transition: all 0.2s ease-in-out;
}

.activity-item:hover {
  background-color: #f8fafc;
  transform: scale(1.01);
}

/* Status indicators */
.status-indicator {
  position: relative;
}

.status-indicator::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #10b981;
  animation: pulse 2s infinite;
}

/* Responsive grid adjustments */
@media (max-width: 768px) {
  .stats-card {
    margin-bottom: 1rem;
  }
  
  .hover-lift:hover {
    transform: none;
  }
}

/* Quick action buttons */
.quick-action {
  transition: all 0.2s ease-in-out;
  border-left: 3px solid transparent;
}

.quick-action:hover {
  border-left-color: #3b82f6;
  background-color: #f8fafc;
  padding-left: 1rem;
}

/* System health indicators */
.health-status {
  display: flex;
  align-items: center;
  transition: all 0.2s ease-in-out;
}

.health-status:hover {
  background-color: #f1f5f9;
  border-radius: 6px;
  padding: 4px 8px;
}
</style>

<style scoped>
/* Custom dashboard styles */
.transition-shadow {
  transition: box-shadow 0.3s ease;
}

/* Responsive grid adjustments */
@media (max-width: 768px) {
  .grid-cols-1.md\:grid-cols-2.lg\:grid-cols-4 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}
</style> 