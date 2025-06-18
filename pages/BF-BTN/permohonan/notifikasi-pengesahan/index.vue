<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl font-semibold">
              Notifikasi Pengesahan BQ
            </h2>
            <p class="text-sm text-gray-600 mt-1">
              Senarai BQ permohonan anda yang memerlukan pengesahan
            </p>
          </div>
          <rs-badge variant="info" class="text-sm">
            {{ totalPendingConfirmations }} Menunggu Pengesahan
          </rs-badge>
        </div>
      </template>

      <template #body>
        <!-- Search and Filter Section -->
        <div class="mb-6">
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1">
              <FormKit
                v-model="searchQuery"
                type="text"
                placeholder="Cari No Rujukan atau Jenis Bantuan..."
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
            <div class="flex gap-2">
              <FormKit
                v-model="filters.status"
                type="select"
                :options="statusOptions"
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
          </div>
        </div>

        <!-- Notifications List -->
        <div class="space-y-4">
          <div
            v-for="notification in filteredNotifications"
            :key="notification.id"
            class="border border-gray-200 rounded-lg p-5 bg-white hover:shadow-md transition-shadow"
            :class="{
              'border-orange-200 bg-orange-50': notification.status === 'belum_disahkan',
              'border-green-200 bg-green-50': notification.status === 'telah_disahkan',
              'border-red-200 bg-red-50': notification.status === 'dibatalkan'
            }"
          >
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
              <!-- Notification Content -->
              <div class="lg:col-span-2 space-y-3">
                <div class="flex items-start space-x-3">
                  <div class="flex-shrink-0 mt-1">
                    <div
                      class="w-10 h-10 rounded-lg flex items-center justify-center"
                      :class="{
                        'bg-orange-100': notification.status === 'belum_disahkan',
                        'bg-green-100': notification.status === 'telah_disahkan',
                        'bg-red-100': notification.status === 'dibatalkan'
                      }"
                    >
                      <Icon 
                        :name="getStatusIcon(notification.status)" 
                        class="w-5 h-5"
                        :class="{
                          'text-orange-600': notification.status === 'belum_disahkan',
                          'text-green-600': notification.status === 'telah_disahkan',
                          'text-red-600': notification.status === 'dibatalkan'
                        }"
                      />
                    </div>
                  </div>
                  <div class="flex-1">
                    <h3 class="font-semibold text-gray-900 mb-2">
                      Pengesahan BQ - {{ notification.noRujukan }}
                    </h3>
                    <p class="text-sm text-gray-700 leading-relaxed mb-3">
                      {{ notification.ringkasanNotifikasi }}
                    </p>
                    
                    <!-- SLA Information -->
                    <div class="flex items-center gap-4 text-xs">
                      <div class="flex items-center gap-1 text-blue-600">
                        <Icon name="ph:clock" class="w-3 h-3" />
                        <span>SLA: {{ notification.slaDays }} hari</span>
                      </div>
                      <div v-if="notification.status === 'belum_disahkan'" class="flex items-center gap-1">
                        <Icon name="ph:warning" class="w-3 h-3 text-orange-500" />
                        <span class="text-orange-600 font-medium">
                          Baki: {{ calculateSLADaysRemaining(notification.tarikhNotifikasi, notification.slaDays) }} hari
                        </span>
                      </div>
                      <div class="text-gray-500">
                        {{ formatDateTime(notification.tarikhNotifikasi) }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Additional Details -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
                  <div>
                    <span class="font-medium text-gray-700">Jenis Bantuan:</span>
                    <p class="text-gray-900">{{ notification.jenisBantuan }}</p>
                  </div>
                  <div>
                    <span class="font-medium text-gray-700">Lokasi:</span>
                    <p class="text-gray-900">{{ notification.lokasi }}</p>
                  </div>
                  <div>
                    <span class="font-medium text-gray-700">Pegawai ETD:</span>
                    <p class="text-gray-900">{{ notification.namaPegawaiETD }}</p>
                  </div>
                  <div v-if="notification.status === 'telah_disahkan' && notification.tarikhPengesahan">
                    <span class="font-medium text-gray-700">Tarikh Pengesahan:</span>
                    <p class="text-gray-900">{{ formatDateTime(notification.tarikhPengesahan) }}</p>
                  </div>
                </div>

                <!-- Confirmation Details (for confirmed/cancelled) -->
                <div 
                  v-if="notification.status !== 'belum_disahkan'" 
                  class="mt-4 pt-4 border-t"
                  :class="{
                    'border-green-200': notification.status === 'telah_disahkan',
                    'border-red-200': notification.status === 'dibatalkan'
                  }"
                >
                  <div v-if="notification.status === 'telah_disahkan' && notification.catatanPengesahan" class="text-sm">
                    <span class="font-medium text-gray-700">Catatan Pengesahan:</span>
                    <p class="text-gray-900 mt-1">{{ notification.catatanPengesahan }}</p>
                  </div>
                  <div v-if="notification.status === 'dibatalkan' && notification.sebabPembatalan" class="text-sm">
                    <span class="font-medium text-gray-700">Sebab Pembatalan:</span>
                    <p class="text-red-700 mt-1">{{ notification.sebabPembatalan }}</p>
                  </div>
                </div>
              </div>

              <!-- Status & Action -->
              <div class="flex flex-col items-end space-y-3">
                <rs-badge
                  :variant="getStatusVariant(notification.status)"
                  class="text-sm px-3 py-1"
                >
                  {{ getStatusText(notification.status) }}
                </rs-badge>

                <rs-button
                  v-if="notification.status === 'belum_disahkan'"
                  variant="primary"
                  size="sm"
                  @click="handleConfirmVisit(notification.id)"
                  class="flex items-center gap-2 min-w-[140px] justify-center"
                >
                  <Icon name="ph:check-circle" class="w-4 h-4" />
                  Semak & Sahkan BQ
                </rs-button>

                <rs-button
                  v-else
                  variant="secondary"
                  size="sm"
                  @click="handleViewConfirmation(notification.id)"
                  class="flex items-center gap-2 min-w-[140px] justify-center"
                >
                  <Icon name="ph:eye" class="w-4 h-4" />
                  Lihat Butiran
                </rs-button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredNotifications.length === 0" class="text-center py-12">
          <div class="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Icon name="ph:bell" class="w-12 h-12 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Tiada Notifikasi</h3>
          <p class="text-gray-500">
            {{ searchQuery || filters.status !== 'semua' 
              ? 'Tiada notifikasi yang sepadan dengan carian anda.' 
              : 'Tiada notifikasi pengesahan BQ untuk masa ini.' 
            }}
          </p>
        </div>

        <!-- Pagination -->
        <div v-if="filteredNotifications.length > 0" class="flex items-center justify-between px-5 mt-6">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-700">Baris per halaman:</span>
            <FormKit
              v-model="pageSize"
              type="select"
              :options="[5, 10, 25]"
              :classes="{
                wrapper: 'w-20',
                outer: 'mb-0',
                input: '!rounded-lg',
              }"
            />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-700">
              Menunjukkan {{ paginationStart }} hingga
              {{ paginationEnd }} daripada {{ totalNotifications }} entri
            </span>
            <div class="flex gap-1">
              <rs-button
                variant="primary-outline"
                class="!p-1 !w-8 !h-8"
                :disabled="currentPage === 1"
                @click="currentPage--"
              >
                <Icon name="ic:round-keyboard-arrow-left" />
              </rs-button>
              <rs-button
                variant="primary-outline"
                class="!p-1 !w-8 !h-8"
                :disabled="currentPage === totalPages"
                @click="currentPage++"
              >
                <Icon name="ic:round-keyboard-arrow-right" />
              </rs-button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

definePageMeta({
  title: "Notifikasi Pengesahan BQ",
});

const breadcrumb = ref([
  {
    name: "Dashboard",
    type: "link",
    path: "/dashboard",
  },
  {
    name: "Notifikasi Pengesahan BQ",
    type: "current",
    path: "/BF-BTN/permohonan/notifikasi-pengesahan",
  },
]);

// Options for filters
const statusOptions = [
  { label: "Semua Status", value: "semua" },
  { label: "Belum Disahkan", value: "belum_disahkan" },
  { label: "Telah Disahkan", value: "telah_disahkan" },
  { label: "Dibatalkan", value: "dibatalkan" },
];

// State
const searchQuery = ref("");
const filters = ref({
  status: "semua",
});
const currentPage = ref(1);
const pageSize = ref(10);

// Mock data - notifications for BQ confirmations as per requirements
const notifications = ref([
  {
    id: "BQ-2024-001",
    noRujukan: "NAS-2025-0001",
    ringkasanNotifikasi: "BQ untuk permohonan anda telah disokong. Sila semak dan beri pengesahan dalam tempoh 30 hari.",
    tarikhNotifikasi: "2024-03-21 10:30:00",
    status: "belum_disahkan",
    slaDays: 30,
    tarikhSokongan: "2024-03-21 09:15:00",
    namaPegawaiETD: "Siti binti Ali",
    jenisBantuan: "Bantuan Pembaikan Rumah",
    lokasi: "No. 123, Jalan Merdeka, Taman Sejahtera, 50000 Kuala Lumpur",
  },
  {
    id: "BQ-2024-002",
    noRujukan: "NAS-2025-0002",
    ringkasanNotifikasi: "BQ untuk permohonan anda telah disokong. Sila semak dan beri pengesahan dalam tempoh 30 hari.",
    tarikhNotifikasi: "2024-03-20 14:15:00",
    status: "telah_disahkan",
    slaDays: 30,
    tarikhSokongan: "2024-03-20 13:00:00",
    tarikhPengesahan: "2024-03-20 16:30:00",
    namaPegawaiETD: "Farah binti Ahmad",
    jenisBantuan: "Bantuan Pembinaan Masjid",
    lokasi: "No. 456, Jalan Damai, Kampung Bahagia, 53000 Kuala Lumpur",
    catatanPengesahan: "BQ disetujui tanpa sebarang perubahan. Kerja boleh dimulakan.",
  },
  {
    id: "BQ-2024-003",
    noRujukan: "NAS-2025-0003",
    ringkasanNotifikasi: "BQ untuk permohonan anda telah disokong. Sila semak dan beri pengesahan dalam tempoh 30 hari.",
    tarikhNotifikasi: "2024-03-19 09:45:00",
    status: "dibatalkan",
    slaDays: 30,
    tarikhSokongan: "2024-03-19 08:30:00",
    namaPegawaiETD: "Ahmad bin Yusof",
    jenisBantuan: "Bantuan Pembaikan Sekolah",
    lokasi: "No. 789, Jalan Harmoni, Taman Indah, 54000 Kuala Lumpur",
    sebabPembatalan: "Tidak bertindak dalam tempoh SLA yang ditetapkan (30 hari).",
  },
  {
    id: "BQ-2024-004",
    noRujukan: "NAS-2025-0004",
    ringkasanNotifikasi: "BQ untuk permohonan anda telah disokong. Sila semak dan beri pengesahan dalam tempoh 30 hari.",
    tarikhNotifikasi: "2024-03-22 11:15:00",
    status: "belum_disahkan",
    slaDays: 30,
    tarikhSokongan: "2024-03-22 10:00:00",
    namaPegawaiETD: "Mohd Razak bin Hassan",
    jenisBantuan: "Bantuan Infrastruktur Surau",
    lokasi: "No. 321, Jalan Bahagia, Taman Harmoni, 51000 Kuala Lumpur",
  },
]);

// Computed properties
const filteredNotifications = computed(() => {
  let result = [...notifications.value];

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (notification) =>
        notification.noRujukan.toLowerCase().includes(query) ||
        notification.jenisBantuan.toLowerCase().includes(query) ||
        notification.namaPegawaiETD.toLowerCase().includes(query)
    );
  }

  // Apply filters
  if (filters.value.status !== "semua") {
    result = result.filter(
      (notification) => notification.status === filters.value.status
    );
  }

  // Apply pagination
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return result.slice(start, end);
});

const totalNotifications = computed(() => {
  let result = [...notifications.value];

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (notification) =>
        notification.noRujukan.toLowerCase().includes(query) ||
        notification.jenisBantuan.toLowerCase().includes(query) ||
        notification.namaPegawaiETD.toLowerCase().includes(query)
    );
  }

  // Apply filters
  if (filters.value.status !== "semua") {
    result = result.filter(
      (notification) => notification.status === filters.value.status
    );
  }

  return result.length;
});

const totalPendingConfirmations = computed(() => {
  return notifications.value.filter(n => n.status === 'belum_disahkan').length;
});

const totalPages = computed(() => {
  return Math.ceil(totalNotifications.value / pageSize.value);
});

const paginationStart = computed(() => {
  return (currentPage.value - 1) * pageSize.value + 1;
});

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * pageSize.value, totalNotifications.value);
});

// Methods
const handleConfirmVisit = (notificationId) => {
  // Navigate to BQ confirmation page
  router.push(`/BF-BTN/permohonan/notifikasi-pengesahan/${notificationId}`);
};

const handleViewConfirmation = (notificationId) => {
  // Navigate to view BQ confirmation details
  router.push(`/BF-BTN/permohonan/notifikasi-pengesahan/${notificationId}`);
};

const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString('ms-MY', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

const calculateSLADaysRemaining = (tarikhNotifikasi, slaDays) => {
  if (!tarikhNotifikasi) return 0;
  const notificationDate = new Date(tarikhNotifikasi);
  const today = new Date();
  const daysPassed = Math.floor((today - notificationDate) / (1000 * 60 * 60 * 24));
  return Math.max(0, slaDays - daysPassed);
};

const getStatusVariant = (status) => {
  const variants = {
    belum_disahkan: "warning",
    telah_disahkan: "success",
    dibatalkan: "danger",
  };
  return variants[status] || "default";
};

const getStatusText = (status) => {
  const statusMap = {
    belum_disahkan: "Belum Disahkan",
    telah_disahkan: "Telah Disahkan",
    dibatalkan: "Dibatalkan",
  };
  return statusMap[status] || status;
};

const getStatusIcon = (status) => {
  const icons = {
    belum_disahkan: "ph:warning",
    telah_disahkan: "ph:check-circle",
    dibatalkan: "ph:x-circle",
  };
  return icons[status] || "ph:question";
};
</script>

<style lang="scss" scoped>
// Custom hover effects
.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

// Transition effects
.transition-shadow {
  transition: box-shadow 0.15s ease-in-out;
}

// Custom background colors for notification status
.bg-orange-50 {
  background-color: #fef3c7;
}

.bg-green-50 {
  background-color: #f0fdf4;
}

.bg-red-50 {
  background-color: #fef2f2;
}

.border-orange-200 {
  border-color: #fef2f2;
}

.border-green-200 {
  border-color: #bbf7d0;
}

.border-red-200 {
  border-color: #fef2f2;
}
</style>
