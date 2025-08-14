<!-- 
  RTMF SCREEN: PA-PP-KP-PYB-01 (Detail View)
  PURPOSE: Perkhidmatan Penolong Amil - Detail view for PYB Institusi
  DESCRIPTION: Detail page for PYB Institusi to view and manage Penolong Amil services
  ROUTE: /BF-PA/PP/KP/pyb-institusi/detail/[rujukan]
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Header Section -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center">
            <Icon name="ph:gear" class="w-6 h-6 mr-3 text-primary" />
            Perkhidmatan Penolong Amil
          </h1>
          <p class="text-gray-600 mt-1">
            Rujukan: {{ serviceData.noRujukan }} - {{ serviceData.nama }}
          </p>
        </div>
        <div class="flex gap-2">
          <rs-button
            variant="secondary-outline"
            @click="navigateTo('/BF-PA/PP/KP')"
            class="flex items-center"
          >
            <Icon name="ph:arrow-left" class="w-4 h-4 mr-2" />
            Kembali
          </rs-button>
          <rs-button
            v-if="serviceData.status === 'aktif'"
            variant="danger"
            @click="showTerminateModal = true"
            class="flex items-center"
          >
            <Icon name="ph:stop-circle" class="w-4 h-4 mr-2" />
            Tamatkan Perkhidmatan
          </rs-button>
          <rs-button
            variant="warning"
            @click="showWarningModal = true"
            class="flex items-center"
          >
            <Icon name="ph:envelope" class="w-4 h-4 mr-2" />
            Surat Amaran
          </rs-button>
        </div>
      </div>
    </div>

    <!-- Service Information Cards -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Basic Information -->
      <rs-card>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <Icon name="ph:user" class="w-5 h-5 mr-2" />
            Maklumat Asas
          </h3>
        </template>
        <template #body>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">No Rujukan</label>
                <p class="text-sm text-gray-900 mt-1">{{ serviceData.noRujukan }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Status</label>
                <rs-badge :variant="getStatusVariant(serviceData.status)" class="mt-1">
                  {{ getStatusLabel(serviceData.status) }}
                </rs-badge>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Nama Penolong Amil</label>
              <p class="text-sm text-gray-900 mt-1">{{ serviceData.nama }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">ID Pengenalan</label>
              <p class="text-sm text-gray-900 mt-1">{{ serviceData.idPengenalan }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Kategori</label>
              <p class="text-sm text-gray-900 mt-1">{{ serviceData.kategori }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Institusi</label>
              <p class="text-sm text-gray-900 mt-1">{{ serviceData.institusi }}</p>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Service Details -->
      <rs-card>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <Icon name="ph:clipboard-text" class="w-5 h-5 mr-2" />
            Butiran Perkhidmatan
          </h3>
        </template>
        <template #body>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Tarikh Mula</label>
              <p class="text-sm text-gray-900 mt-1">{{ formatDate(serviceData.tarikhMula) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Tempoh Perkhidmatan</label>
              <p class="text-sm text-gray-900 mt-1">{{ calculateServiceDuration() }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Gaji</label>
              <p class="text-sm text-gray-900 mt-1">RM {{ serviceData.gaji }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Catatan</label>
              <p class="text-sm text-gray-900 mt-1">{{ serviceData.catatan || 'Tiada catatan' }}</p>
            </div>
          </div>
        </template>
      </rs-card>
    </div>

    <!-- Action History -->
    <rs-card>
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <Icon name="ph:clock-counter-clockwise" class="w-5 h-5 mr-2" />
          Sejarah Tindakan
        </h3>
      </template>
      <template #body>
        <div class="space-y-4">
          <div
            v-for="(action, index) in actionHistory"
            :key="index"
            class="flex items-start space-x-4"
          >
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Icon :name="action.icon" class="w-4 h-4 text-white" />
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <p class="text-sm font-medium text-gray-900">{{ action.title }}</p>
                <p class="text-sm text-gray-500">{{ formatDateTime(action.timestamp) }}</p>
              </div>
              <p class="text-sm text-gray-600 mt-1">{{ action.description }}</p>
              <p class="text-xs text-gray-500 mt-1">Oleh: {{ action.by }}</p>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Terminate Service Modal -->
    <div v-if="showTerminateModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <Icon name="ph:warning" class="w-16 h-16 text-danger mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">Tamatkan Perkhidmatan</h3>
          <p class="text-sm text-gray-500 mb-4">
            Adakah anda pasti mahu menamatkan perkhidmatan untuk {{ serviceData.nama }}?
          </p>
          <div class="flex justify-center space-x-3">
            <rs-button
              variant="secondary-outline"
              @click="showTerminateModal = false"
            >
              Batal
            </rs-button>
            <rs-button
              variant="danger"
              @click="terminateService"
            >
              Tamatkan
            </rs-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Warning Letter Modal -->
    <div v-if="showWarningModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <Icon name="ph:envelope" class="w-16 h-16 text-warning mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">Surat Amaran</h3>
          <p class="text-sm text-gray-500 mb-4">
            Hantar surat amaran kepada {{ serviceData.nama }}?
          </p>
          <div class="flex justify-center space-x-3">
            <rs-button
              variant="secondary-outline"
              @click="showWarningModal = false"
            >
              Batal
            </rs-button>
            <rs-button
              variant="warning"
              @click="sendWarningLetter"
            >
              Hantar
            </rs-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { formatDate, formatDateTime } from "~/utils/dateFormatter";

definePageMeta({
  title: "Perkhidmatan Penolong Amil - Detail",
  breadcrumb: [
    {
      name: "BF-PA",
      type: "link",
      path: "/BF-PA",
    },
    {
      name: "PP",
      type: "link",
      path: "/BF-PA/PP",
    },
    {
      name: "Perkhidmatan Penolong Amil",
      type: "link",
      path: "/BF-PA/PP/KP",
    },
    {
      name: "Detail",
      type: "current",
      path: "/BF-PA/PP/KP/pyb-institusi/detail/[rujukan]",
    },
  ],
});

const route = useRoute();
const router = useRouter();

// Reactive data
const showTerminateModal = ref(false);
const showWarningModal = ref(false);

// Breadcrumb
const breadcrumb = ref([
  {
    name: "BF-PA",
    type: "link",
    path: "/BF-PA",
  },
  {
    name: "PP",
    type: "link",
    path: "/BF-PA/PP",
  },
  {
    name: "Perkhidmatan Penolong Amil",
    type: "link",
    path: "/BF-PA/PP/KP",
  },
  {
    name: "Detail",
    type: "current",
    path: `/BF-PA/PP/KP/pyb-institusi/detail/${route.params.rujukan}`,
  },
]);

// Mock service data
const serviceData = ref({
  noRujukan: route.params.rujukan,
  nama: "Ahmad bin Abdullah",
  idPengenalan: "901231012345",
  kategori: "Penolong Amil Kariah",
  institusi: "Surau Al-Amin",
  status: "aktif",
  tarikhMula: "2024-01-15",
  gaji: "1,200.00",
  catatan: "Perkhidmatan berjalan dengan baik",
});

// Mock action history
const actionHistory = ref([
  {
    icon: "ph:user-plus",
    title: "Perkhidmatan Dimulakan",
    description: "Perkhidmatan telah dimulakan dan diaktifkan",
    timestamp: "2024-01-15T09:00:00",
    by: "Admin Sistem",
  },
  {
    icon: "ph:check-circle",
    title: "Pengesahan Status",
    description: "Status perkhidmatan telah disahkan aktif",
    timestamp: "2024-01-15T10:30:00",
    by: "PYB Institusi",
  },
  {
    icon: "ph:clock",
    title: "Pemeriksaan Bulanan",
    description: "Pemeriksaan bulanan telah dijalankan",
    timestamp: "2024-02-15T14:00:00",
    by: "PYB Institusi",
  },
]);

// Methods
const getStatusVariant = (status) => {
  const variants = {
    aktif: "success",
    terminated: "danger",
    suspended: "warning",
  };
  return variants[status] || "disabled";
};

const getStatusLabel = (status) => {
  const labels = {
    aktif: "Aktif",
    terminated: "Telah Ditamatkan",
    suspended: "Dalam Pemerhatian",
  };
  return labels[status] || status;
};

const calculateServiceDuration = () => {
  const startDate = new Date(serviceData.value.tarikhMula);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 30) {
    return `${diffDays} hari`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} bulan`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} tahun`;
  }
};

const terminateService = () => {
  // In real app, this would update the service status
  serviceData.value.status = "terminated";
  
  // Add to action history
  actionHistory.value.unshift({
    icon: "ph:stop-circle",
    title: "Perkhidmatan Ditamatkan",
    description: "Perkhidmatan telah ditamatkan oleh PYB Institusi",
    timestamp: new Date().toISOString(),
    by: "PYB Institusi",
  });
  
  showTerminateModal.value = false;
  
  // Show success message
  // You can implement a notification system here
};

const sendWarningLetter = () => {
  // Add to action history
  actionHistory.value.unshift({
    icon: "ph:envelope",
    title: "Surat Amaran Dihantar",
    description: "Surat amaran telah dihantar kepada penolong amil",
    timestamp: new Date().toISOString(),
    by: "PYB Institusi",
  });
  
  showWarningModal.value = false;
  
  // Show success message
  // You can implement a notification system here
};

onMounted(() => {
  // In real app, fetch service data based on route.params.rujukan
  console.log("Loading service data for:", route.params.rujukan);
});
</script>

<style scoped>
/* Custom styles if needed */
</style> 