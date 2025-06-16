<<<<<<< HEAD
<template>
  <div class="space-y-6">
    <!-- Ringkasan Pengguna -->
    <rs-card class="p-5 bg-white shadow-sm">
      <div class="grid md:grid-cols-4 gap-4">
        <div><strong>Nama:</strong> {{ user.nama }}</div>
        <div><strong>Peranan:</strong> {{ user.peranan }}</div>
        <div><strong>Daerah:</strong> {{ user.daerah }}</div>
        <div><strong>Login:</strong> {{ user.loginTime }}</div>
      </div>
    </rs-card>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <rs-card v-for="(kpi, index) in kpiList" :key="index" class="p-4">
        <div class="text-gray-600 text-sm mb-2">{{ kpi.title }}</div>
        <div class="text-2xl font-bold text-primary">{{ kpi.value }}</div>
      </rs-card>
    </div>

    <!-- Senarai Tugasan -->
    <rs-card>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold">Senarai Tugasan</h2>
          <div class="flex gap-2">
            <rs-button variant="outline" @click="refreshData">
              <Icon name="ic:baseline-refresh" class="mr-1" /> Refresh
            </rs-button>
            <rs-button variant="primary" @click="exportData">
              <Icon name="ic:baseline-download" class="mr-1" /> Eksport Excel
            </rs-button>
          </div>
        </div>
      </template>

      <rs-table
        :data="taskList"
        :columns="taskColumns"
        :options="{ hover: true }"
      />
    </rs-card>

    <!-- Notifikasi -->
    <rs-card v-if="notifications.length">
      <template #header>
        <h2 class="text-lg font-semibold">Notifikasi Terkini</h2>
      </template>
      <ul class="divide-y">
        <li
          v-for="(note, i) in notifications"
          :key="i"
          class="py-2 flex items-start gap-2"
        >
          <span
            :class="getBadgeColor(note.type)"
            class="text-xs font-medium whitespace-nowrap"
            >[{{ note.type }}]</span
          >
          <span class="text-sm">{{ note.message }}</span>
        </li>
      </ul>
    </rs-card>

    <rs-alert v-else variant="info">Tiada notifikasi baru.</rs-alert>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface KPI {
  title: string;
  value: number;
}

interface Task {
  tajuk: string;
  tarikh: string;
  status: string;
}

interface Notification {
  type: 'info' | 'success' | 'warning' | 'danger';
  message: string;
}

// User login info
const user = {
  nama: 'Ahmad bin Ali',
  peranan: 'EOAD',
  daerah: 'Klang',
  loginTime: new Date().toLocaleString('ms-MY'),
};

// KPI Summary
const kpiList = ref<KPI[]>([
  { title: 'Permohonan Baharu', value: 45 },
  { title: 'Perlu Tindakan', value: 12 },
  { title: 'Kelulusan Terkini', value: 7 },
  { title: 'Tugasan Semasa', value: 5 },
]);

// Task Table
const taskColumns = [
  { key: 'tajuk', label: 'Tugasan' },
  { key: 'tarikh', label: 'Tarikh' },
  { key: 'status', label: 'Status' },
];

const taskList = ref<Task[]>([
  { tajuk: 'Semak Permohonan 123', tarikh: '2025-06-14', status: 'Belum Selesai' },
  { tajuk: 'Kelulusan Permohonan 456', tarikh: '2025-06-13', status: 'Selesai' },
]);

// Notification List
const notifications = ref<Notification[]>([
  { type: 'info', message: 'Permohonan 789 sedang dalam semakan.' },
  { type: 'success', message: 'Permohonan 456 telah diluluskan oleh Ketua.' },
]);

// Actions
const refreshData = () => {
  console.log('Refresh triggered...');
};

const exportData = () => {
  console.log('Export to Excel triggered...');
};

// Badge color for notification type
const getBadgeColor = (type: string): string => {
  return {
    success: 'text-green-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
    danger: 'text-red-600',
  }[type] || 'text-gray-500';
};
</script>

<style scoped>
</style>
=======
<template>
  <div class="space-y-6">
    <!-- Ringkasan Pengguna -->
    <rs-card class="p-5 bg-white shadow-sm">
      <div class="grid md:grid-cols-4 gap-4">
        <div><strong>Nama:</strong> {{ user.nama }}</div>
        <div><strong>Peranan:</strong> {{ user.peranan }}</div>
        <div><strong>Daerah:</strong> {{ user.daerah }}</div>
        <div><strong>Login:</strong> {{ user.loginTime }}</div>
      </div>
    </rs-card>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <rs-card v-for="(kpi, index) in kpiList" :key="index" class="p-4">
        <div class="text-gray-600 text-sm mb-2">{{ kpi.title }}</div>
        <div class="text-2xl font-bold text-primary">{{ kpi.value }}</div>
      </rs-card>
    </div>

    <!-- Senarai Tugasan -->
    <rs-card>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold">Senarai Tugasan</h2>
          <div class="flex gap-2">
            <rs-button variant="outline" @click="refreshData">
              <Icon name="ic:baseline-refresh" class="mr-1" /> Refresh
            </rs-button>
            <rs-button variant="primary" @click="exportData">
              <Icon name="ic:baseline-download" class="mr-1" /> Eksport Excel
            </rs-button>
          </div>
        </div>
      </template>

      <rs-table
        :data="taskList"
        :columns="taskColumns"
        :options="{ hover: true }"
      />
    </rs-card>

    <!-- Notifikasi -->
    <rs-card v-if="notifications.length">
      <template #header>
        <h2 class="text-lg font-semibold">Notifikasi Terkini</h2>
      </template>
      <ul class="divide-y">
        <li
          v-for="(note, i) in notifications"
          :key="i"
          class="py-2 flex items-start gap-2"
        >
          <span
            :class="getBadgeColor(note.type)"
            class="text-xs font-medium whitespace-nowrap"
            >[{{ note.type }}]</span
          >
          <span class="text-sm">{{ note.message }}</span>
        </li>
      </ul>
    </rs-card>

    <rs-alert v-else variant="info">Tiada notifikasi baru.</rs-alert>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface KPI {
  title: string;
  value: number;
}

interface Task {
  tajuk: string;
  tarikh: string;
  status: string;
}

interface Notification {
  type: 'info' | 'success' | 'warning' | 'danger';
  message: string;
}

// User login info
const user = {
  nama: 'Ahmad bin Ali',
  peranan: 'EOAD',
  daerah: 'Klang',
  loginTime: new Date().toLocaleString('ms-MY'),
};

// KPI Summary
const kpiList = ref<KPI[]>([
  { title: 'Permohonan Baharu', value: 45 },
  { title: 'Perlu Tindakan', value: 12 },
  { title: 'Kelulusan Terkini', value: 7 },
  { title: 'Tugasan Semasa', value: 5 },
]);

// Task Table
const taskColumns = [
  { key: 'tajuk', label: 'Tugasan' },
  { key: 'tarikh', label: 'Tarikh' },
  { key: 'status', label: 'Status' },
];

const taskList = ref<Task[]>([
  { tajuk: 'Semak Permohonan 123', tarikh: '2025-06-14', status: 'Belum Selesai' },
  { tajuk: 'Kelulusan Permohonan 456', tarikh: '2025-06-13', status: 'Selesai' },
]);

// Notification List
const notifications = ref<Notification[]>([
  { type: 'info', message: 'Permohonan 789 sedang dalam semakan.' },
  { type: 'success', message: 'Permohonan 456 telah diluluskan oleh Ketua.' },
]);

// Actions
const refreshData = () => {
  console.log('Refresh triggered...');
};

const exportData = () => {
  console.log('Export to Excel triggered...');
};

// Badge color for notification type
const getBadgeColor = (type: string): string => {
  return {
    success: 'text-green-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
    danger: 'text-red-600',
  }[type] || 'text-gray-500';
};
</script>

<style scoped>
</style>
>>>>>>> 3dcc227fdaa7aaa5e054a6ffebfa8addde014eae
