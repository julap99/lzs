<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Welcome Section -->
    <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6 mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold mb-2">Selamat Datang ke Modul Pentadbir Sistem</h1>
          <p class="text-blue-100">Papan Pemuka Pentadbiran Sistem - {{ currentDate }}</p>
        </div>
        <div class="text-right">
          <p class="text-sm text-blue-100">Pengguna Aktif: {{ currentUser.name }}</p>
          <p class="text-sm text-blue-100">Peranan: {{ currentUser.role }}</p>
        </div>
      </div>
    </div>

    <!-- System Status Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <rs-card class="bg-white shadow-lg hover:shadow-xl transition-shadow">
        <template #body>
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon name="ic:baseline-people" class="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Jumlah Pengguna</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.totalUsers }}</p>
              <p class="text-xs text-green-600">
                <Icon name="ic:baseline-trending-up" class="w-3 h-3 mr-1" />
                +{{ stats.newUsersToday }} hari ini
              </p>
            </div>
          </div>
        </template>
      </rs-card>

      <rs-card class="bg-white shadow-lg hover:shadow-xl transition-shadow">
        <template #body>
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Icon name="ic:baseline-admin-panel-settings" class="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Peranan Aktif</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.activeRoles }}</p>
              <p class="text-xs text-blue-600">
                <Icon name="ic:baseline-security" class="w-3 h-3 mr-1" />
                {{ stats.totalPermissions }} kebenaran
              </p>
            </div>
          </div>
        </template>
      </rs-card>

      <rs-card class="bg-white shadow-lg hover:shadow-xl transition-shadow">
        <template #body>
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Icon name="ic:baseline-settings" class="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Konfigurasi Kod</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.totalCodes }}</p>
              <p class="text-xs text-gray-600">
                <Icon name="ic:baseline-category" class="w-3 h-3 mr-1" />
                {{ stats.totalCategories }} kategori
              </p>
            </div>
          </div>
        </template>
      </rs-card>

      <rs-card class="bg-white shadow-lg hover:shadow-xl transition-shadow">
        <template #body>
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Icon name="ic:baseline-assessment" class="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Laporan Dijana</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.reportsGenerated }}</p>
              <p class="text-xs text-purple-600">
                <Icon name="ic:baseline-today" class="w-3 h-3 mr-1" />
                {{ stats.reportsToday }} hari ini
              </p>
            </div>
          </div>
        </template>
      </rs-card>
    </div>

    <!-- Quick Actions -->
    <rs-card class="mb-6">
      <template #header>
        <h2 class="text-xl font-semibold flex items-center">
          <Icon name="ic:baseline-flash-on" class="mr-2" />
          Tindakan Pantas
        </h2>
      </template>
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <rs-button
            variant="primary"
            size="lg"
            class="flex flex-col items-center p-6 h-auto"
            @click="navigateTo('/BF-PS/PP/01')"
          >
            <Icon name="ic:baseline-person-add" class="w-8 h-8 mb-2" />
            <span class="font-medium">Daftar Pengguna</span>
            <span class="text-sm opacity-75">Daftar pengguna baharu</span>
          </rs-button>

          <rs-button
            variant="success"
            size="lg"
            class="flex flex-col items-center p-6 h-auto"
            @click="navigateTo('/BF-PS/PPK/KP')"
          >
            <Icon name="ic:baseline-group-add" class="w-8 h-8 mb-2" />
            <span class="font-medium">Konfigurasi Peranan</span>
            <span class="text-sm opacity-75">Urus peranan sistem</span>
          </rs-button>

          <rs-button
            variant="warning"
            size="lg"
            class="flex flex-col items-center p-6 h-auto"
            @click="navigateTo('/BF-PS/PK')"
          >
            <Icon name="ic:baseline-code" class="w-8 h-8 mb-2" />
            <span class="font-medium">Penyelenggaraan Kod</span>
            <span class="text-sm opacity-75">Konfigurasi sistem kod</span>
          </rs-button>

          <rs-button
            variant="info"
            size="lg"
            class="flex flex-col items-center p-6 h-auto"
            @click="navigateTo('/BF-PS/PP/03')"
          >
            <Icon name="ic:baseline-history" class="w-8 h-8 mb-2" />
            <span class="font-medium">Audit Trail</span>
            <span class="text-sm opacity-75">Lihat jejak audit</span>
          </rs-button>

          <rs-button
            variant="secondary"
            size="lg"
            class="flex flex-col items-center p-6 h-auto"
            @click="navigateTo('/BF-PS/SL')"
          >
            <Icon name="ic:baseline-bar-chart" class="w-8 h-8 mb-2" />
            <span class="font-medium">Statistik Laporan</span>
            <span class="text-sm opacity-75">Jana laporan sistem</span>
          </rs-button>

          <rs-button
            variant="outline"
            size="lg"
            class="flex flex-col items-center p-6 h-auto"
            @click="showSystemInfoModal = true"
          >
            <Icon name="ic:baseline-info" class="w-8 h-8 mb-2" />
            <span class="font-medium">Maklumat Sistem</span>
            <span class="text-sm opacity-75">Lihat status sistem</span>
          </rs-button>
        </div>
      </template>
    </rs-card>

    <!-- Recent Activities & System Health -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Recent Activities -->
      <rs-card>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold flex items-center">
              <Icon name="ic:baseline-notifications" class="mr-2" />
              Aktiviti Terkini
            </h3>
            <rs-button variant="ghost" size="sm" @click="navigateTo('/BF-PS/PP/03')">
              Lihat Semua
              <Icon name="ic:baseline-arrow-forward" class="ml-1" />
            </rs-button>
          </div>
        </template>
        <template #body>
          <div class="space-y-4">
            <div v-for="activity in recentActivities" :key="activity.id" class="flex items-start space-x-3">
              <div class="flex-shrink-0">
                <div :class="getActivityIconClass(activity.type)" class="w-8 h-8 rounded-full flex items-center justify-center">
                  <Icon :name="getActivityIcon(activity.type)" class="w-4 h-4" />
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">{{ activity.action }}</p>
                <p class="text-sm text-gray-500">{{ activity.user }} • {{ activity.module }}</p>
                <p class="text-xs text-gray-400">{{ activity.timestamp }}</p>
              </div>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- System Health -->
      <rs-card>
        <template #header>
          <h3 class="text-lg font-semibold flex items-center">
            <Icon name="ic:baseline-health-and-safety" class="mr-2" />
            Status Sistem
          </h3>
        </template>
        <template #body>
          <div class="space-y-4">
            <div v-for="health in systemHealth" :key="health.component" class="flex items-center justify-between">
              <div class="flex items-center">
                <div :class="getHealthStatusClass(health.status)" class="w-3 h-3 rounded-full mr-3"></div>
                <span class="text-sm font-medium">{{ health.component }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500">{{ health.value }}</span>
                <rs-badge :variant="getHealthBadgeVariant(health.status)">
                  {{ health.status }}
                </rs-badge>
              </div>
            </div>
          </div>
        </template>
      </rs-card>
    </div>

    <!-- Module Access Overview -->
    <rs-card>
      <template #header>
        <h3 class="text-lg font-semibold flex items-center">
          <Icon name="ic:baseline-dashboard" class="mr-2" />
          Akses Modul Sistem
        </h3>
      </template>
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="module in moduleAccess" :key="module.name" 
               class="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
               @click="navigateTo(module.path)">
            <div class="flex items-center justify-between mb-2">
              <Icon :name="module.icon" class="w-6 h-6 text-blue-600" />
              <rs-badge :variant="module.available ? 'success' : 'secondary'">
                {{ module.available ? 'Tersedia' : 'Terhad' }}
              </rs-badge>
            </div>
            <h4 class="font-medium text-gray-900 mb-1">{{ module.name }}</h4>
            <p class="text-sm text-gray-500 mb-2">{{ module.description }}</p>
            <div class="flex justify-between text-xs text-gray-400">
              <span>{{ module.lastAccessed }}</span>
              <span>{{ module.accessCount }} akses</span>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

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

// Current user and date
const currentUser = ref({
  name: "AdminNAS01",
  role: "Administrator Sistem"
});

const currentDate = computed(() => {
  return new Date().toLocaleDateString('ms-MY', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Statistics data
const stats = ref({
  totalUsers: 1247,
  newUsersToday: 12,
  activeRoles: 8,
  totalPermissions: 156,
  totalCodes: 85,
  totalCategories: 12,
  reportsGenerated: 342,
  reportsToday: 7
});

// Recent activities
const recentActivities = ref([
  {
    id: 1,
    action: "Pengguna baharu didaftarkan",
    user: "AdminNAS02",
    module: "Pengurusan Pengguna",
    type: "user",
    timestamp: "2 minit yang lalu"
  },
  {
    id: 2,
    action: "Kebenaran peranan dikemaskini",
    user: "AdminNAS01",
    module: "Pengurusan Peranan",
    type: "role",
    timestamp: "15 minit yang lalu"
  },
  {
    id: 3,
    action: "Laporan sistem dijana",
    user: "AdminNAS03",
    module: "Statistik Laporan",
    type: "report",
    timestamp: "1 jam yang lalu"
  },
  {
    id: 4,
    action: "Konfigurasi kod ditambah",
    user: "AdminNAS01",
    module: "Penyelenggaraan Kod",
    type: "config",
    timestamp: "2 jam yang lalu"
  },
  {
    id: 5,
    action: "Akaun pengguna diaktifkan",
    user: "AdminNAS02",
    module: "Pengurusan Pengguna",
    type: "user",
    timestamp: "3 jam yang lalu"
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

// Helper methods
const getActivityIcon = (type) => {
  switch (type) {
    case 'user': return 'ic:baseline-person';
    case 'role': return 'ic:baseline-security';
    case 'report': return 'ic:baseline-assessment';
    case 'config': return 'ic:baseline-settings';
    default: return 'ic:baseline-info';
  }
};

const getActivityIconClass = (type) => {
  switch (type) {
    case 'user': return 'bg-blue-100 text-blue-600';
    case 'role': return 'bg-green-100 text-green-600';
    case 'report': return 'bg-purple-100 text-purple-600';
    case 'config': return 'bg-yellow-100 text-yellow-600';
    default: return 'bg-gray-100 text-gray-600';
  }
};

const getHealthStatusClass = (status) => {
  switch (status) {
    case 'Sihat': return 'bg-green-500';
    case 'Amaran': return 'bg-yellow-500';
    case 'Kritikal': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const getHealthBadgeVariant = (status) => {
  switch (status) {
    case 'Sihat': return 'success';
    case 'Amaran': return 'warning';
    case 'Kritikal': return 'danger';
    default: return 'secondary';
  }
};

// Initialize dashboard data
onMounted(() => {
  // Simulate real-time updates
  setInterval(() => {
    // Update stats slightly
    stats.value.totalUsers += Math.floor(Math.random() * 2);
    stats.value.reportsGenerated += Math.floor(Math.random() * 2);
    
    // Update system health
    systemInfo.value.cpuUsage = Math.max(20, Math.min(80, systemInfo.value.cpuUsage + (Math.random() - 0.5) * 10));
    systemInfo.value.memoryUsage = Math.max(40, Math.min(90, systemInfo.value.memoryUsage + (Math.random() - 0.5) * 5));
  }, 30000); // Update every 30 seconds
});
</script>

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