<!-- 
  RTMF SCREEN: PA-PE-ET
  PURPOSE: Elaun Tahunan Penolong Amil - Main Dashboard
  DESCRIPTION: Main dashboard for Annual Allowance management for Penolong Amil
  ROUTE: /BF-PA/PE/ET
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Main Dashboard -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      <!-- Senarai Penolong Amil Layak -->
      <rs-card class="hover:shadow-lg transition-shadow cursor-pointer" @click="navigateTo('/BF-PA/PE/ET/01')">
        <template #header>
          <div class="flex items-center">
            <Icon name="ic:outline-people" class="mr-3 text-blue-600" size="24" />
            <h3 class="text-lg font-semibold text-gray-900">Senarai Penolong Amil Layak</h3>
          </div>
        </template>
        <template #body>
          <div class="text-center py-6">
            <div class="text-3xl font-bold text-blue-600 mb-2">{{ eligibleCount }}</div>
            <p class="text-gray-600">Penolong Amil Layak Elaun Tahunan</p>
            <div class="mt-4">
              <rs-badge variant="info" class="text-sm">
                {{ currentYear }} - {{ nextYear }}
              </rs-badge>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Pengiraan Elaun Tahunan -->
      <rs-card class="hover:shadow-lg transition-shadow cursor-pointer" @click="navigateTo('/BF-PA/PE/ET/01/02')">
        <template #header>
          <div class="flex items-center">
            <Icon name="ic:outline-calculate" class="mr-3 text-green-600" size="24" />
            <h3 class="text-lg font-semibold text-gray-900">Pengiraan Elaun Tahunan</h3>
          </div>
        </template>
        <template #body>
          <div class="text-center py-6">
            <div class="text-3xl font-bold text-green-600 mb-2">{{ calculatedCount }}</div>
            <p class="text-gray-600">Elaun Telah Dikira</p>
            <div class="mt-4">
              <rs-badge variant="success" class="text-sm">
                {{ calculatedPercentage }}% Selesai
              </rs-badge>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Payment Advice -->
      <rs-card class="hover:shadow-lg transition-shadow cursor-pointer" @click="navigateTo('/BF-PA/PE/ET/02')">
        <template #header>
          <div class="flex items-center">
            <Icon name="ic:outline-receipt" class="mr-3 text-purple-600" size="24" />
            <h3 class="text-lg font-semibold text-gray-900">Payment Advice</h3>
          </div>
        </template>
        <template #body>
          <div class="text-center py-6">
            <div class="text-3xl font-bold text-purple-600 mb-2">{{ paCount }}</div>
            <p class="text-gray-600">Payment Advice Dijana</p>
            <div class="mt-4">
              <rs-badge :variant="paStatusVariant" class="text-sm">
                {{ paStatus }}
              </rs-badge>
            </div>
          </div>
        </template>
      </rs-card>
    </div>

    <!-- Quick Actions -->
    <rs-card class="mt-8">
      <template #header>
        <div class="flex items-center">
          <Icon name="ic:outline-flash-on" class="mr-2" />
          <h3 class="text-lg font-semibold">Tindakan Pantas</h3>
        </div>
      </template>
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <rs-button
            variant="primary"
            @click="navigateTo('/BF-PA/PE/ET/01')"
            class="h-16 text-left justify-start"
          >
            <Icon name="ic:outline-people" class="mr-3" />
            <div>
              <div class="font-semibold">Senarai Penolong Amil</div>
              <div class="text-sm opacity-80">Lihat dan urus kelayakan elaun tahunan</div>
            </div>
          </rs-button>

          <rs-button
            variant="success"
            @click="navigateTo('/BF-PA/PE/ET/01/02')"
            class="h-16 text-left justify-start"
          >
            <Icon name="ic:outline-calculate" class="mr-3" />
            <div>
              <div class="font-semibold">Kira Elaun</div>
              <div class="text-sm opacity-80">Pengiraan elaun tahunan untuk Penolong Amil</div>
            </div>
          </rs-button>

          <rs-button
            variant="warning"
            @click="navigateTo('/BF-PA/PE/ET/02')"
            class="h-16 text-left justify-start"
          >
            <Icon name="ic:outline-receipt" class="mr-3" />
            <div>
              <div class="font-semibold">Payment Advice</div>
              <div class="text-sm opacity-80">Penjanaan dan pengurusan Payment Advice</div>
            </div>
          </rs-button>
        </div>
      </template>
    </rs-card>

    <!-- Summary Statistics -->
    <rs-card class="mt-8">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <Icon name="ic:outline-analytics" class="mr-2" />
            <h3 class="text-lg font-semibold">Statistik Elaun Tahunan {{ currentYear }}</h3>
          </div>
          <rs-button
            variant="secondary-outline"
            size="sm"
            @click="refreshStats"
          >
            <Icon name="ic:outline-refresh" class="mr-1" />
            Kemas Kini
          </rs-button>
        </div>
      </template>
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{{ totalPenolongAmil }}</div>
            <p class="text-sm text-gray-600">Jumlah Penolong Amil</p>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">{{ totalElaunAmount }}</div>
            <p class="text-sm text-gray-600">Jumlah Elaun (RM)</p>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-orange-600">{{ pendingCount }}</div>
            <p class="text-sm text-gray-600">Menunggu Pengiraan</p>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-600">{{ completedCount }}</div>
            <p class="text-sm text-gray-600">Selesai Diproses</p>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';

definePageMeta({
  title: "Elaun Tahunan Penolong Amil",
  description: "Pengurusan elaun tahunan untuk Penolong Amil",
});

const toast = useToast();

const breadcrumb = ref([
  {
    name: "Pengurusan Elaun",
    type: "link",
    path: "/BF-PA/PE",
  },
  {
    name: "Elaun Tahunan",
    type: "current",
    path: "/BF-PA/PE/ET",
  },
]);

// Mock data - replace with actual API calls
const eligibleCount = ref(45);
const calculatedCount = ref(32);
const paCount = ref(28);
const totalPenolongAmil = ref(67);
const totalElaunAmount = ref('67,500.00');
const pendingCount = ref(13);
const completedCount = ref(28);

const currentYear = new Date().getFullYear();
const nextYear = currentYear + 1;

const calculatedPercentage = computed(() => {
  return Math.round((calculatedCount.value / eligibleCount.value) * 100);
});

const paStatus = computed(() => {
  if (paCount.value === 0) return 'Belum Dijana';
  if (paCount.value === calculatedCount.value) return 'Selesai';
  if (paCount.value > 0) return 'Dalam Proses';
  return 'Belum Dijana';
});

const paStatusVariant = computed(() => {
  if (paStatus.value === 'Selesai') return 'success';
  if (paStatus.value === 'Dalam Proses') return 'warning';
  return 'default';
});

const refreshStats = async () => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Statistik telah dikemas kini');
  } catch (error) {
    toast.error('Ralat semasa mengemas kini statistik');
  }
};

onMounted(() => {
  // Load initial data
  refreshStats();
});
</script>

<style scoped>
/* Add any additional styles here */
</style> 