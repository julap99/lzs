<template>
  <div>
    <!-- Page screen: TNI-Dashboard -->
    <!-- Actor: Pentadbir Sistem, Ketua Jabatan, Eksekutif -->
    <!-- Roles: Pentadbir Sistem, Ketua Jabatan, Eksekutif -->
    
    <!-- Page-specific Role Switcher -->
    <div class="bg-gray-100 border-b border-gray-200 px-4 py-2">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <Icon name="ph:user-circle" class="text-gray-600" size="20" />
          <span class="text-sm font-medium text-gray-700">Simulasi Peranan:</span>
        </div>
        <div class="flex items-center space-x-3">
          <div class="min-w-[200px]">
            <FormKit
              type="select"
              v-model="currentRole"
              :options="roleOptions"
              :classes="{ 
                input: '!py-1.5 !px-3 text-sm !rounded-md !border-gray-300',
                wrapper: '!min-w-0'
              }"
              @change="handleRoleChange"
            />
          </div>
          <rs-button
            variant="secondary-outline"
            size="sm"
            @click="toggleRoleInfo"
            :class="{ 'bg-blue-100 text-blue-700 border-blue-300': showRoleInfo }"
            class="!px-3 !py-1.5 !text-sm !whitespace-nowrap"
          >
            <Icon name="ph:eye" class="w-3 h-3 mr-1" />
            {{ showRoleInfo ? 'Sembunyi' : 'Tunjuk' }}
          </rs-button>
        </div>
      </div>
      
      <div v-if="showRoleInfo" class="mt-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="text-sm font-semibold text-gray-900 mb-3">Peranan Semasa:</h4>
            <div class="flex items-center space-x-3">
              <rs-badge :variant="getRoleVariant(currentRole)" class="!text-xs">
                {{ getRoleLabel(currentRole) }}
              </rs-badge>
              <span class="text-xs text-gray-600">{{ getRoleDescription(currentRole) }}</span>
            </div>
          </div>
          <div>
            <h4 class="text-sm font-semibold text-gray-900 mb-3">Kebolehan:</h4>
            <div class="flex flex-wrap gap-2">
              <rs-badge
                v-for="capability in getRoleCapabilities(currentRole)"
                :key="capability"
                variant="secondary"
                size="sm"
                class="!text-xs"
              >
                {{ capability }}
              </rs-badge>
            </div>
          </div>
        </div>
      </div>
    </div>

    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center min-h-[200px]">
      <rs-spinner size="lg" />
    </div>

    <!-- Error State -->
    <rs-alert
      v-else-if="error"
      variant="danger"
      class="mb-6"
      :title="error.title"
      :description="error.message"
    >
      <template #actions>
        <rs-button variant="primary" @click="fetchDashboardData">
          <Icon name="ic:baseline-refresh" class="mr-1" /> Retry
        </rs-button>
      </template>
    </rs-alert>

    <template v-else>
      <!-- Dynamic KPI Summary Cards Based on Role -->
      
      <!-- Pentadbir Sistem KPI -->
      <div v-if="currentRole === 'pentadbir-sistem'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <rs-card
          v-for="(kpi, index) in pentadbirKpiData"
          :key="index"
          class="group transition-all duration-300 hover:shadow-md"
          :class="{ 'opacity-50': isLoading }"
        >
          <div class="relative p-5">
            <!-- Header with Icon -->
            <div class="flex items-center justify-between mb-4">
              <div class="p-2.5 rounded-lg bg-primary/5 group-hover:bg-primary/10">
                <Icon :name="kpi.icon" class="text-xl text-primary" />
              </div>
              <div class="text-xs font-medium px-2 py-1 rounded-full bg-primary/5 text-primary">
                {{ kpi.description }}
              </div>
            </div>

            <!-- Metric Value -->
            <div class="space-y-1">
              <h3 class="text-sm font-medium text-gray-500">{{ kpi.title }}</h3>
              <div class="flex items-baseline gap-2">
                <p class="text-3xl font-semibold tracking-tight text-primary">
                  {{ typeof kpi.value === 'number' ? formatNumber(kpi.value) : kpi.value }}
                </p>
                <span v-if="kpi.trend" class="text-sm" :class="getTrendColor(kpi.trend)">
                  {{ kpi.trend }}%
                </span>
              </div>
            </div>
          </div>
        </rs-card>
      </div>

      <!-- Ketua Jabatan KPI -->
      <div v-else-if="currentRole === 'ketua-jabatan'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <rs-card
          v-for="(kpi, index) in kjKpiData"
          :key="index"
          class="group transition-all duration-300 hover:shadow-md"
          :class="{ 'opacity-50': isLoading }"
        >
          <div class="relative p-5">
            <!-- Header with Icon -->
            <div class="flex items-center justify-between mb-4">
              <div class="p-2.5 rounded-lg bg-warning/5 group-hover:bg-warning/10">
                <Icon :name="kpi.icon" class="text-xl text-warning" />
              </div>
              <div class="text-xs font-medium px-2 py-1 rounded-full bg-warning/5 text-warning">
                {{ kpi.description }}
              </div>
            </div>

            <!-- Metric Value -->
            <div class="space-y-1">
              <h3 class="text-sm font-medium text-gray-500">{{ kpi.title }}</h3>
              <div class="flex items-baseline gap-2">
                <p class="text-3xl font-semibold tracking-tight text-warning">
                  {{ typeof kpi.value === 'number' ? formatNumber(kpi.value) : kpi.value }}
                </p>
                <span v-if="kpi.trend" class="text-sm" :class="getTrendColor(kpi.trend)">
                  {{ kpi.trend }}%
                </span>
              </div>
            </div>
          </div>
        </rs-card>
      </div>

      <!-- Eksekutif KPI -->
      <div v-else-if="currentRole === 'eksekutif'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <rs-card
          v-for="(kpi, index) in eksekutifKpiData"
          :key="index"
          class="group transition-all duration-300 hover:shadow-md"
          :class="{ 'opacity-50': isLoading }"
        >
          <div class="relative p-5">
            <!-- Header with Icon -->
            <div class="flex items-center justify-between mb-4">
              <div class="p-2.5 rounded-lg bg-info/5 group-hover:bg-info/10">
                <Icon :name="kpi.icon" class="text-xl text-info" />
              </div>
              <div class="text-xs font-medium px-2 py-1 rounded-full bg-info/5 text-info">
                {{ kpi.description }}
              </div>
            </div>

            <!-- Metric Value -->
            <div class="space-y-1">
              <h3 class="text-sm font-medium text-gray-500">{{ kpi.title }}</h3>
              <div class="flex items-baseline gap-2">
                <p class="text-3xl font-semibold tracking-tight text-info">
                  {{ typeof kpi.value === 'number' ? formatNumber(kpi.value) : kpi.value }}
                </p>
                <span v-if="kpi.trend" class="text-sm" :class="getTrendColor(kpi.trend)">
                  {{ kpi.trend }}%
                </span>
              </div>
            </div>
          </div>
        </rs-card>
      </div>

      <!-- Default KPI (for other roles) -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <rs-card
          v-for="(kpi, index) in kpiData"
          :key="index"
          class="group transition-all duration-300 hover:shadow-md"
          :class="{ 'opacity-50': isLoading }"
        >
          <div class="relative p-5">
            <!-- Header with Icon -->
            <div class="flex items-center justify-between mb-4">
              <div class="p-2.5 rounded-lg bg-primary/5 group-hover:bg-primary/10">
                <Icon :name="kpi.icon" class="text-xl text-primary" />
              </div>
              <div class="text-xs font-medium px-2 py-1 rounded-full bg-primary/5 text-primary">
                {{ kpi.description }}
              </div>
            </div>

            <!-- Metric Value -->
            <div class="space-y-1">
              <h3 class="text-sm font-medium text-gray-500">{{ kpi.title }}</h3>
              <div class="flex items-baseline gap-2">
                <p class="text-3xl font-semibold tracking-tight text-primary">
                  {{ typeof kpi.value === 'number' ? formatNumber(kpi.value) : kpi.value }}
                </p>
                <span v-if="kpi.trend" class="text-sm" :class="getTrendColor(kpi.trend)">
                  {{ kpi.trend }}%
                </span>
              </div>
            </div>
          </div>
        </rs-card>
      </div>

      <!-- Dynamic Main Content Based on Role -->
      
      <!-- Pentadbir Sistem Content -->
      <div v-if="currentRole === 'pentadbir-sistem'">
        <rs-card>
          <template #header>
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-4">
                <h2 class="text-xl font-semibold">Status Semua Akaun (Pentadbir Sistem)</h2>
                <rs-badge v-if="totalRecords" variant="primary">
                  {{ totalRecords }} rekod
                </rs-badge>
              </div>
              <div class="flex items-center gap-4">
                <rs-button
                  variant="outline"
                  @click="resetFilters"
                  :disabled="!hasActiveFilters"
                >
                  <Icon name="ic:baseline-refresh" class="mr-1" /> Reset
                </rs-button>
                <rs-button
                  variant="primary"
                  @click="exportToCSV"
                  :loading="isExporting"
                  :disabled="!tableData.length"
                >
                  <Icon name="ic:baseline-download" class="mr-1" /> Export CSV
                </rs-button>
              </div>
            </div>
          </template>

          <template #body>
            <!-- Filters -->
            <div class="flex flex-wrap gap-4 mb-6">
              <FormKit
                type="select"
                label="Jenis Akaun"
                v-model="filters.jenisAkaun"
                :options="jenisAkaunOptions"
                class="w-full md:w-48"
                :disabled="isLoading"
              />
              <FormKit
                type="select"
                label="Status Closing"
                v-model="filters.statusClosing"
                :options="statusClosingOptions"
                class="w-full md:w-48"
                :disabled="isLoading"
              />
              <FormKit
                type="text"
                label="Lokasi / Cawangan"
                v-model="filters.lokasi"
                placeholder="Cari lokasi..."
                class="w-full md:w-64"
                :disabled="isLoading"
              />
            </div>

            <!-- Main Table -->
            <rs-table
              :data="filteredPentadbirTableData"
              :options="{
                variant: 'default',
                striped: true,
                hover: true,
                loading: isLoading,
              }"
              :columns="tableColumns"
              :pageSize="pageSize"
              :totalRecords="totalRecords"
              :currentPage="currentPage"
              @page-change="handlePageChange"
              @sort-change="handleSortChange"
              advanced
            >
              <template v-slot:statusOpening="data">
                <rs-badge :variant="getStatusVariant(data.text)">
                  {{ data.text }}
                </rs-badge>
              </template>

              <template v-slot:statusClosing="data">
                <rs-badge :variant="getStatusVariant(data.text)">
                  {{ data.text }}
                </rs-badge>
              </template>

              <template v-slot:bakiBaseline="data">
                <span class="font-mono">RM {{ formatNumber(data.text) }}</span>
              </template>

              <template v-slot:lastClosingDate="data">
                <span class="whitespace-nowrap">{{ formatDateTime(data.text) }}</span>
              </template>

              <template v-slot:lastOpeningDate="data">
                <span class="whitespace-nowrap">{{ formatDateTime(data.text) }}</span>
              </template>
            </rs-table>
          </template>
        </rs-card>
      </div>

      <!-- Ketua Jabatan Content -->
      <div v-else-if="currentRole === 'ketua-jabatan'">
        <rs-card>
          <template #header>
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-4">
                <h2 class="text-xl font-semibold">Status Akaun dalam Jurisdiction (Ketua Jabatan)</h2>
                <rs-badge v-if="totalRecords" variant="warning">
                  {{ totalRecords }} rekod
                </rs-badge>
              </div>
              <div class="flex items-center gap-4">
                <rs-button
                  variant="outline"
                  @click="resetFilters"
                  :disabled="!hasActiveFilters"
                >
                  <Icon name="ic:baseline-refresh" class="mr-1" /> Reset
                </rs-button>
              </div>
            </div>
          </template>

          <template #body>
            <!-- Filters -->
            <div class="flex flex-wrap gap-4 mb-6">
              <FormKit
                type="select"
                label="Jenis Akaun"
                v-model="filters.jenisAkaun"
                :options="jenisAkaunOptions"
                class="w-full md:w-48"
                :disabled="isLoading"
              />
              <FormKit
                type="select"
                label="Status Closing"
                v-model="filters.statusClosing"
                :options="statusClosingOptions"
                class="w-full md:w-48"
                :disabled="isLoading"
              />
            </div>

            <!-- Main Table -->
            <rs-table
              :data="filteredKJTableData"
              :options="{
                variant: 'default',
                striped: true,
                hover: true,
                loading: isLoading,
              }"
              :columns="tableColumns"
              :pageSize="pageSize"
              :totalRecords="totalRecords"
              :currentPage="currentPage"
              @page-change="handlePageChange"
              @sort-change="handleSortChange"
              advanced
            >
              <template v-slot:statusOpening="data">
                <rs-badge :variant="getStatusVariant(data.text)">
                  {{ data.text }}
                </rs-badge>
              </template>

              <template v-slot:statusClosing="data">
                <rs-badge :variant="getStatusVariant(data.text)">
                  {{ data.text }}
                </rs-badge>
              </template>

              <template v-slot:bakiBaseline="data">
                <span class="font-mono">RM {{ formatNumber(data.text) }}</span>
              </template>

              <template v-slot:lastClosingDate="data">
                <span class="whitespace-nowrap">{{ formatDateTime(data.text) }}</span>
              </template>

              <template v-slot:lastOpeningDate="data">
                <span class="whitespace-nowrap">{{ formatDateTime(data.text) }}</span>
              </template>
            </rs-table>
          </template>
        </rs-card>
      </div>

      <!-- Eksekutif Content -->
      <div v-else-if="currentRole === 'eksekutif'">
        <rs-card>
          <template #header>
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-4">
                <h2 class="text-xl font-semibold">Status Akaun Operasi (Eksekutif)</h2>
                <rs-badge v-if="totalRecords" variant="info">
                  {{ totalRecords }} rekod
                </rs-badge>
              </div>
              <div class="flex items-center gap-4">
                <rs-button
                  variant="outline"
                  @click="resetFilters"
                  :disabled="!hasActiveFilters"
                >
                  <Icon name="ic:baseline-refresh" class="mr-1" /> Reset
                </rs-button>
              </div>
            </div>
          </template>

          <template #body>
            <!-- Filters -->
            <div class="flex flex-wrap gap-4 mb-6">
              <FormKit
                type="select"
                label="Status Closing"
                v-model="filters.statusClosing"
                :options="statusClosingOptions"
                class="w-full md:w-48"
                :disabled="isLoading"
              />
              <FormKit
                type="text"
                label="Lokasi / Cawangan"
                v-model="filters.lokasi"
                placeholder="Cari lokasi..."
                class="w-full md:w-64"
                :disabled="isLoading"
              />
            </div>

            <!-- Main Table -->
            <rs-table
              :data="filteredEksekutifTableData"
              :options="{
                variant: 'default',
                striped: true,
                hover: true,
                loading: isLoading,
              }"
              :columns="tableColumns"
              :pageSize="pageSize"
              :totalRecords="totalRecords"
              :currentPage="currentPage"
              @page-change="handlePageChange"
              @sort-change="handleSortChange"
              advanced
            >
              <template v-slot:statusOpening="data">
                <rs-badge :variant="getStatusVariant(data.text)">
                  {{ data.text }}
                </rs-badge>
              </template>

              <template v-slot:statusClosing="data">
                <rs-badge :variant="getStatusVariant(data.text)">
                  {{ data.text }}
                </rs-badge>
              </template>

              <template v-slot:bakiBaseline="data">
                <span class="font-mono">RM {{ formatNumber(data.text) }}</span>
              </template>

              <template v-slot:lastClosingDate="data">
                <span class="whitespace-nowrap">{{ formatDateTime(data.text) }}</span>
              </template>

              <template v-slot:lastOpeningDate="data">
                <span class="whitespace-nowrap">{{ formatDateTime(data.text) }}</span>
              </template>
            </rs-table>
          </template>
        </rs-card>
      </div>

      <!-- Default Content (for other roles) -->
      <div v-else>
        <rs-card>
          <template #header>
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-4">
                <h2 class="text-xl font-semibold">Status Semua Akaun</h2>
                <rs-badge v-if="totalRecords" variant="primary">
                  {{ totalRecords }} rekod
                </rs-badge>
              </div>
              <div class="flex items-center gap-4">
                <rs-button
                  variant="outline"
                  @click="resetFilters"
                  :disabled="!hasActiveFilters"
                >
                  <Icon name="ic:baseline-refresh" class="mr-1" /> Reset
                </rs-button>
                <rs-button
                  variant="primary"
                  @click="exportToCSV"
                  :loading="isExporting"
                  :disabled="!tableData.length"
                >
                  <Icon name="ic:baseline-download" class="mr-1" /> Export CSV
                </rs-button>
              </div>
            </div>
          </template>

          <template #body>
            <!-- Filters -->
            <div class="flex flex-wrap gap-4 mb-6">
              <FormKit
                type="select"
                label="Jenis Akaun"
                v-model="filters.jenisAkaun"
                :options="jenisAkaunOptions"
                class="w-full md:w-48"
                :disabled="isLoading"
              />
              <FormKit
                type="select"
                label="Status Closing"
                v-model="filters.statusClosing"
                :options="statusClosingOptions"
                class="w-full md:w-48"
                :disabled="isLoading"
              />
              <FormKit
                type="text"
                label="Lokasi / Cawangan"
                v-model="filters.lokasi"
                placeholder="Cari lokasi..."
                class="w-full md:w-64"
                :disabled="isLoading"
              />
            </div>

            <!-- Main Table -->
            <rs-table
              :data="tableData"
              :options="{
                variant: 'default',
                striped: true,
                hover: true,
                loading: isLoading,
              }"
              :columns="tableColumns"
              :pageSize="pageSize"
              :totalRecords="totalRecords"
              :currentPage="currentPage"
              @page-change="handlePageChange"
              @sort-change="handleSortChange"
              advanced
            >
              <template v-slot:statusOpening="data">
                <rs-badge :variant="getStatusVariant(data.text)">
                  {{ data.text }}
                </rs-badge>
              </template>

              <template v-slot:statusClosing="data">
                <rs-badge :variant="getStatusVariant(data.text)">
                  {{ data.text }}
                </rs-badge>
              </template>

              <template v-slot:bakiBaseline="data">
                <span class="font-mono">RM {{ formatNumber(data.text) }}</span>
              </template>

              <template v-slot:lastClosingDate="data">
                <span class="whitespace-nowrap">{{ formatDateTime(data.text) }}</span>
              </template>

              <template v-slot:lastOpeningDate="data">
                <span class="whitespace-nowrap">{{ formatDateTime(data.text) }}</span>
              </template>
            </rs-table>
          </template>
        </rs-card>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue';

// Types
interface KpiData {
  title: string;
  value: string | number;
  icon: string;
  description: string;
  trend?: number;
}

interface TableData {
  lokasi: string;
  namaAkaun: string;
  jenisAkaun: string;
  statusOpening: string;
  statusClosing: string;
  lastClosingDate: string;
  lastOpeningDate: string;
  bakiBaseline: number;
  picClosing: string;
  pkpPenerima: string;
}

interface Filters {
  jenisAkaun: string;
  statusClosing: string;
  lokasi: string;
}

interface ErrorState {
  title: string;
  message: string;
}

// Page Meta
definePageMeta({
  title: 'Dashboard: Ringkasan & Status Akaun Tunai',
});

// Role Simulator State
const currentRole = ref("pentadbir-sistem");
const showRoleInfo = ref(false);

// Page-specific role options for Dashboard
const roleOptions = [
  { label: "Pentadbir Sistem", value: "pentadbir-sistem" },
  { label: "Ketua Jabatan", value: "ketua-jabatan" },
  { label: "Eksekutif", value: "eksekutif" },
];

// Role data for Dashboard
const roleData: Record<string, { label: string; description: string; capabilities: string[] }> = {
  "pentadbir-sistem": {
    label: "Pentadbir Sistem",
    description: "Pengurusan Lengkap Sistem Tunai",
    capabilities: ["Lihat Semua Data", "Export Data", "Pengurusan Lengkap", "Analisis Sistem"],
  },
  "ketua-jabatan": {
    label: "Ketua Jabatan",
    description: "Pemantauan Akaun dalam Jurisdiction",
    capabilities: ["Lihat Data Jurisdiction", "Pemantauan", "Oversight", "Analisis"],
  },
  "eksekutif": {
    label: "Eksekutif",
    description: "Status Akaun Operasi",
    capabilities: ["Lihat Status Operasi", "Pemantauan Operasi", "Status Akaun", "Operasi"],
  },
};

// Role simulator helper functions
const getRoleVariant = (role: string): string => {
  const variants: Record<string, string> = {
    "pentadbir-sistem": "primary",
    "ketua-jabatan": "warning",
    "eksekutif": "info",
  };
  return variants[role] || "default";
};

const getRoleLabel = (role: string): string => {
  return roleData[role]?.label || role;
};

const getRoleDescription = (role: string): string => {
  return roleData[role]?.description || "";
};

const getRoleCapabilities = (role: string): string[] => {
  return roleData[role]?.capabilities || [];
};

const handleRoleChange = () => {
  console.log("Role changed to:", currentRole.value);
};

const toggleRoleInfo = () => {
  showRoleInfo.value = !showRoleInfo.value;
};

// Constants
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes
const INITIAL_PAGE_SIZE = 10;

// State
const breadcrumb = [
  { title: 'Dashboard', to: '/BF-TNI/dashboard' },
  { title: 'Ringkasan & Status Akaun Tunai', to: '/BF-TNI/dashboard' },
];

const isLoading = ref(false);
const isExporting = ref(false);
const error = ref<ErrorState | null>(null);
const currentPage = ref(1);
const pageSize = ref(INITIAL_PAGE_SIZE);
const totalRecords = ref(0);
const refreshInterval = ref<NodeJS.Timeout | null>(null);

// KPI Data for different roles
const pentadbirKpiData: Ref<KpiData[]> = ref([
  {
    title: 'Total Akaun Aktif',
    value: 156,
    icon: 'material-symbols:account-balance',
    description: 'Sistem',
    trend: 12
  },
  {
    title: 'Jumlah Tunai (RM)',
    value: 2847500,
    icon: 'material-symbols:payments',
    description: 'Keseluruhan',
    trend: 8
  },
  {
    title: 'Akaun Menunggu Closing',
    value: 23,
    icon: 'material-symbols:pending',
    description: 'Tertunggak',
    trend: -5
  },
  {
    title: 'Akaun Gagal Opening',
    value: 7,
    icon: 'material-symbols:error',
    description: 'Isu',
    trend: -2
  }
]);

const kjKpiData: Ref<KpiData[]> = ref([
  {
    title: 'Akaun dalam Jurisdiction',
    value: 45,
    icon: 'material-symbols:location-on',
    description: 'Kawasan',
    trend: 3
  },
  {
    title: 'Tunai dalam Jurisdiction (RM)',
    value: 875000,
    icon: 'material-symbols:payments',
    description: 'Kawasan',
    trend: 6
  },
  {
    title: 'Menunggu Kelulusan',
    value: 8,
    icon: 'material-symbols:pending',
    description: 'Kelulusan',
    trend: -1
  },
  {
    title: 'Akaun Aktif',
    value: 37,
    icon: 'material-symbols:check-circle',
    description: 'Status',
    trend: 2
  }
]);

const eksekutifKpiData: Ref<KpiData[]> = ref([
  {
    title: 'Akaun Operasi',
    value: 12,
    icon: 'material-symbols:business',
    description: 'Operasi',
    trend: 1
  },
  {
    title: 'Tunai Operasi (RM)',
    value: 125000,
    icon: 'material-symbols:payments',
    description: 'Operasi',
    trend: 4
  },
  {
    title: 'Status Aktif',
    value: 10,
    icon: 'material-symbols:check-circle',
    description: 'Aktif',
    trend: 0
  },
  {
    title: 'Perlu Tindakan',
    value: 2,
    icon: 'material-symbols:warning',
    description: 'Tindakan',
    trend: -1
  }
]);

// Default KPI Data
const kpiData: Ref<KpiData[]> = ref([
  {
    title: 'Total Akaun Aktif',
    value: 156,
    icon: 'material-symbols:account-balance',
    description: 'Sistem',
    trend: 12
  },
  {
    title: 'Jumlah Tunai (RM)',
    value: 2847500,
    icon: 'material-symbols:payments',
    description: 'Keseluruhan',
    trend: 8
  },
  {
    title: 'Akaun Menunggu Closing',
    value: 23,
    icon: 'material-symbols:pending',
    description: 'Tertunggak',
    trend: -5
  },
  {
    title: 'Akaun Gagal Opening',
    value: 7,
    icon: 'material-symbols:error',
    description: 'Isu',
    trend: -2
  }
]);

// Table Configuration
const tableColumns = [
  { key: 'lokasi', label: 'Lokasi / Akaun Tunai', sortable: true },
  { key: 'namaAkaun', label: 'Nama Akaun / Cawangan', sortable: true },
  { key: 'jenisAkaun', label: 'Jenis Akaun', sortable: true },
  { key: 'statusOpening', label: 'Status Opening', sortable: true },
  { key: 'statusClosing', label: 'Status Closing', sortable: true },
  { key: 'lastClosingDate', label: 'Tarikh & Masa Last Closing', sortable: true },
  { key: 'lastOpeningDate', label: 'Tarikh & Masa Last Opening', sortable: true },
  { key: 'bakiBaseline', label: 'Baki Baseline terkini (RM)', sortable: true },
  { key: 'picClosing', label: 'PIC Closing terakhir', sortable: true },
  { key: 'pkpPenerima', label: 'PKP Penerima', sortable: true },
];

// Table data for different roles
const pentadbirTableData = ref<TableData[]>([]);
const kjTableData = ref<TableData[]>([]);
const eksekutifTableData = ref<TableData[]>([]);
const tableData = ref<TableData[]>([]);

// Computed properties for filtered data
const filteredPentadbirTableData = computed(() => {
  return pentadbirTableData.value;
});

const filteredKJTableData = computed(() => {
  return kjTableData.value;
});

const filteredEksekutifTableData = computed(() => {
  return eksekutifTableData.value;
});

// Filters
const filters = ref<Filters>({
  jenisAkaun: '',
  statusClosing: '',
  lokasi: '',
});

// Computed
const hasActiveFilters = computed(() => {
  return Object.values(filters.value).some(value => value !== '');
});

// Utility Functions
const getStatusVariant = (status: string): string => {
  const variants: Record<string, string> = {
    'Aktif': 'success',
    'Tidak Aktif': 'danger',
    'Ditutup': 'success',
    'Belum Closing': 'warning',
    'Menunggu PKP': 'info',
  };
  return variants[status] || 'default';
};

const getTrendColor = (trend: number): string => {
  if (trend > 0) return 'text-success';
  if (trend < 0) return 'text-danger';
  return 'text-gray-500';
};

const formatNumber = (value: string | number): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('ms-MY').format(num);
};

const formatDateTime = (dateTime: string): string => {
  return new Date(dateTime).toLocaleString('ms-MY', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Event Handlers
const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchDashboardData();
};

const handleSortChange = (sort: { key: string; order: 'asc' | 'desc' }) => {
  console.log("TNI-Dashboard: Sort changed:", sort);
  fetchDashboardData();
};

const handleSearch = () => {
  console.log("TNI-Dashboard: Search triggered");
  fetchDashboardData();
};

const resetFilters = () => {
  filters.value = {
    jenisAkaun: '',
    statusClosing: '',
    lokasi: '',
  };
  console.log("TNI-Dashboard: Filters reset");
  fetchDashboardData();
};

const exportToCSV = () => {
  console.log("TNI-Dashboard: Export to CSV");
  isExporting.value = true;
  // Simulate export
  setTimeout(() => {
    isExporting.value = false;
  }, 2000);
};

// Data fetching
const fetchDashboardData = () => {
  console.log("TNI-Dashboard: Fetching dashboard data for role:", currentRole.value);
  isLoading.value = true;
  
  // Simulate API call
  setTimeout(() => {
    // Mock data based on role
    if (currentRole.value === 'pentadbir-sistem') {
      pentadbirTableData.value = [
        {
          lokasi: "Kuala Lumpur",
          namaAkaun: "Akaun Tunai KL",
          jenisAkaun: "Operasi",
          statusOpening: "Aktif",
          statusClosing: "Ditutup",
          lastClosingDate: "2024-03-18T17:00:00",
          lastOpeningDate: "2024-03-19T08:00:00",
          bakiBaseline: 150000,
          picClosing: "Ahmad bin Abdullah",
          pkpPenerima: "Siti binti Ali"
        }
      ];
    } else if (currentRole.value === 'ketua-jabatan') {
      kjTableData.value = [
        {
          lokasi: "Shah Alam",
          namaAkaun: "Akaun Tunai SA",
          jenisAkaun: "Operasi",
          statusOpening: "Aktif",
          statusClosing: "Ditutup",
          lastClosingDate: "2024-03-18T17:00:00",
          lastOpeningDate: "2024-03-19T08:00:00",
          bakiBaseline: 75000,
          picClosing: "Mohd bin Hassan",
          pkpPenerima: "Fatimah binti Omar"
        }
      ];
    } else if (currentRole.value === 'eksekutif') {
      eksekutifTableData.value = [
        {
          lokasi: "Petaling Jaya",
          namaAkaun: "Akaun Tunai PJ",
          jenisAkaun: "Operasi",
          statusOpening: "Aktif",
          statusClosing: "Ditutup",
          lastClosingDate: "2024-03-18T17:00:00",
          lastOpeningDate: "2024-03-19T08:00:00",
          bakiBaseline: 45000,
          picClosing: "Ali bin Ahmad",
          pkpPenerima: "Aminah binti Salleh"
        }
      ];
    }
    
    totalRecords.value = 1;
    isLoading.value = false;
  }, 1000);
};

// Options
const jenisAkaunOptions = [
  { label: 'Operasi', value: 'operasi' },
  { label: 'Amil', value: 'amil' },
  { label: 'Baitul', value: 'baitul' },
];

const statusClosingOptions = [
  { label: 'Ditutup', value: 'ditutup' },
  { label: 'Belum Closing', value: 'belum_closing' },
  { label: 'Menunggu PKP', value: 'menunggu_pkp' },
];

// Lifecycle
onMounted(() => {
  fetchDashboardData();
  refreshInterval.value = setInterval(fetchDashboardData, REFRESH_INTERVAL);
});

onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value);
  }
});
</script>

<style lang="scss" scoped></style>
