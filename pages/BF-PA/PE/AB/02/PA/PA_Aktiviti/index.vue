<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Maklumat Aktiviti Penolong Amil
          </h2>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <!-- Penolong Amil Information -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">Maklumat Penolong Amil</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p class="text-sm text-gray-500">ID Penolong Amil</p>
                <p class="font-medium">{{ paInfo.id }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Nama Penolong Amil</p>
                <p class="font-medium">{{ paInfo.name }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Lokasi Kariah</p>
                <p class="font-medium">{{ paInfo.location }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Tarikh Tugasan Tamat</p>
                <p class="font-medium">{{ paInfo.endDate }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Jenis Tugasan</p>
                <p class="font-medium">{{ paInfo.assignmentType }}</p>
              </div>
            </div>
          </div>

          <!-- Activities List -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">Senarai Aktiviti</h3>
            
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No.
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarikh
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aktiviti
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lokasi
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Elaun
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(activity, index) in activities" :key="activity.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      {{ index + 1 }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      {{ activity.date }}
                    </td>
                    <td class="px-6 py-4">
                      {{ activity.name }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      {{ activity.location }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      RM {{ activity.allowance }}
                    </td>
                  </tr>
                </tbody>
                <tfoot class="bg-gray-50">
                  <tr>
                    <td colspan="4" class="px-6 py-4 text-right font-medium">
                      Jumlah Keseluruhan:
                    </td>
                    <td class="px-6 py-4 font-medium text-blue-600">
                      RM {{ totalAllowance }}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-4 mt-6">
            <rs-button
              variant="primary-outline"
              @click="navigateTo('/BF-PA/PE/AB/02/PA')"
            >
              Kembali
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

definePageMeta({
  title: "Maklumat Aktiviti Penolong Amil",
  description: "Maklumat aktiviti penolong amil",
});

const breadcrumb = ref([
  {
    name: "Bancian/Asnaf",
    type: "link",
    path: "/BF-PA/PE/AB",
  },
  {
    name: "Maklumat Aktiviti",
    type: "link",
    path: "/BF-PA/PE/AB/02/PA",
  },
  {
    name: "Maklumat Aktiviti Penolong Amil",
    type: "current",
    path: "/BF-PA/PE/AB/02/PA/PA_Aktiviti",
  },
]);

// Mock PA data
const paInfo = ref({
  id: 'PA001',
  name: 'Ahmad bin Abdullah',
  location: 'Masjid Al-Hidayah',
  endDate: '31/12/2024',
  assignmentType: 'Kariah',
  status: 'Disokong',
});

// Mock activities data
const activities = ref([
  {
    id: 'ACT001',
    date: '01/03/2024',
    name: 'Kutipan Zakat Kariah',
    location: 'Masjid Al-Hidayah',
    status: 'Selesai',
    allowance: '500.00',
  },
  {
    id: 'ACT002',
    date: '02/03/2024',
    name: 'Agihan Bantuan Asnaf',
    location: 'Masjid Al-Hidayah',
    status: 'Dalam Proses',
    allowance: '500.00',
  },
  {
    id: 'ACT003',
    date: '03/03/2024',
    name: 'Program Tazkirah',
    location: 'Masjid Al-Hidayah',
    status: 'Belum Bermula',
    allowance: '500.00',
  },
  {
    id: 'ACT004',
    date: '04/03/2024',
    name: 'Lawatan Asnaf',
    location: 'Masjid Al-Hidayah',
    status: 'Selesai',
    allowance: '500.00',
  },
  {
    id: 'ACT005',
    date: '05/03/2024',
    name: 'Program Qiamullail',
    location: 'Masjid Al-Hidayah',
    status: 'Dalam Proses',
    allowance: '500.00',
  }
]);

// Helper functions
const getStatusClass = (status) => {
  const statusClasses = {
    'Disokong': 'bg-green-100 text-green-800',
    'Tidak Disokong': 'bg-red-100 text-red-800',
  };
  return statusClasses[status] || 'bg-gray-100 text-gray-800';
};

const getActivityStatusClass = (status) => {
  const statusClasses = {
    'Selesai': 'bg-green-100 text-green-800',
    'Dalam Proses': 'bg-yellow-100 text-yellow-800',
    'Belum Bermula': 'bg-blue-100 text-blue-800',
  };
  return statusClasses[status] || 'bg-gray-100 text-gray-800';
};

// Computed properties
const totalAllowance = computed(() => {
  return activities.value
    .reduce((sum, activity) => sum + parseFloat(activity.allowance.replace(/,/g, '')), 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
});
</script>

<style scoped>
/* Add any additional styles here */
</style> 