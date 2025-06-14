<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Maklumat Aktiviti
          </h2>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <!-- Batch Information -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">Maklumat Batch</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p class="text-sm text-gray-500">Batch No</p>
                <p class="font-medium text-blue-600">{{ batchInfo.id }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Institusi</p>
                <p class="font-medium">{{ batchInfo.institution }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Kategori</p>
                <p class="font-medium">{{ batchInfo.category }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Tarikh</p>
                <p class="font-medium">{{ batchInfo.date }}</p>
              </div>
            </div>
          </div>

          <!-- Penolong Amil List -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">Senarai Penolong Amil Yang Terlibat</h3>
            
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No.
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Penolong Amil
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Elaun
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tindakan
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(pa, index) in penolongAmil" :key="pa.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      {{ index + 1 }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <a 
                        href="#" 
                        class="text-blue-600 hover:text-blue-800"
                        @click.prevent="navigateTo(`/BF-PA/PE/AB/02/PA/PA_Aktiviti?id=${pa.id}`)"
                      >
                        {{ pa.name }}
                      </a>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      RM {{ pa.totalAllowance }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <rs-button
                        variant="primary"
                        size="sm"
                        @click="navigateTo(`/BF-PA/PE/AB/02/PA/PA_Aktiviti?id=${pa.id}`)"
                      >
                        Lihat Aktiviti
                      </rs-button>
                    </td>
                  </tr>
                </tbody>
                <tfoot class="bg-gray-50">
                  <tr>
                    <td colspan="2" class="px-6 py-4 text-right font-medium">
                      Jumlah Keseluruhan:
                    </td>
                    <td class="px-6 py-4 font-medium text-blue-600">
                      RM {{ totalAllowance }}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <!-- Activities List -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4">Senarai Aktiviti Yang Dilakukan</h3>
            
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No.
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Aktiviti
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(activity, index) in activities" :key="activity.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      {{ index + 1 }}
                    </td>
                    <td class="px-6 py-4">
                      {{ activity.name }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-4 mt-6">
            <rs-button
              variant="primary-outline"
              @click="navigateTo('/BF-PA/PE/AB')"
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
  title: "Maklumat Aktiviti",
  description: "Maklumat aktiviti dan penolong amil",
});

const breadcrumb = ref([
  {
    name: "Bancian/Asnaf",
    type: "link",
    path: "/BF-PA/PE/AB",
  },
  {
    name: "Maklumat Aktiviti",
    type: "current",
    path: "/BF-PA/PE/AB/02/PA",
  },
]);

// Mock batch data
const batchInfo = ref({
  id: 'BATCH-2024-001',
  institution: 'Masjid Al-Hidayah',
  category: 'Kariah',
  date: '01/03/2024',
});

// Mock Penolong Amil data
const penolongAmil = ref([
  {
    id: 'PA001',
    name: 'Ahmad bin Abdullah',
    totalAllowance: '1,500.00',
  },
  {
    id: 'PA002',
    name: 'Ahmad bin Abdullah',
    totalAllowance: '1,500.00',
  },
  {
    id: 'PA003',
    name: 'Ahmad bin Abdullah',
    totalAllowance: '1,500.00',
  },
]);

// Mock activities data
const activities = ref([
  {
    id: 'ACT001',
    name: 'Kutipan Zakat Fitrah',
    totalAllowance: '1,500.00',
  },
  {
    id: 'ACT002',
    name: 'Agihan Bantuan Asnaf',
    totalAllowance: '1,500.00',
  },
  {
    id: 'ACT002',
    name: 'Program Tazkirah',
    totalAllowance: '1,500.00',
  },
]);

// Computed properties for totals
const totalAllowance = computed(() => {
  return penolongAmil.value
    .reduce((sum, pa) => sum + parseFloat(pa.totalAllowance.replace(/,/g, '')), 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
});

const totalActivityAllowance = computed(() => {
  return activities.value
    .reduce((sum, activity) => sum + parseFloat(activity.totalAllowance.replace(/,/g, '')), 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
});
</script>

<style scoped>
/* Add any additional styles here */
</style> 