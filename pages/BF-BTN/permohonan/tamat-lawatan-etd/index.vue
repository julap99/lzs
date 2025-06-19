<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl font-semibold">
              Notifikasi Tamat Lawatan ETD
            </h2>
            <p class="text-sm text-gray-600 mt-1">
              Senarai lawatan ETD yang perlu disahkan
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
                placeholder="Cari No Rujukan atau Nama Pegawai ETD..."
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
            class="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
            :class="{
              'border-blue-200 bg-blue-50': notification.status === 'belum_disahkan',
              'border-green-200 bg-green-50': notification.status === 'telah_disahkan'
            }"
          >
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
              <!-- Notification Content -->
              <div class="lg:col-span-2 space-y-2">
                <div class="flex items-start space-x-3">
                  <div class="flex-shrink-0 mt-1">
                    <div
                      class="w-10 h-10 rounded-lg flex items-center justify-center"
                      :class="{
                        'bg-blue-100': notification.status === 'belum_disahkan',
                        'bg-green-100': notification.status === 'telah_disahkan'
                      }"
                    >
                      <Icon 
                        :name="notification.status === 'telah_disahkan' ? 'ph:check-circle' : 'ph:clock'" 
                        class="w-6 h-6"
                        :class="{
                          'text-blue-600': notification.status === 'belum_disahkan',
                          'text-green-600': notification.status === 'telah_disahkan'
                        }"
                      />
                    </div>
                  </div>
                  <div class="flex-1">
                    <h3 class="font-medium text-gray-900 mb-1">
                      Pegawai ETD telah melengkapkan lawatan ke lokasi permohonan anda
                    </h3>
                    <p class="text-sm text-gray-600">
                      Sila sahkan bahawa lawatan telah dijalankan untuk permohonan 
                      <span class="font-mono font-medium">{{ notification.noRujukan }}</span>
                    </p>
                  </div>
                </div>
              </div>

              <!-- Visit Details -->
              <div class="space-y-2 text-sm">
                <div>
                  <span class="font-medium text-gray-700">Tarikh/Masa Lawatan:</span>
                  <p class="text-gray-900">{{ notification.tarikhLawatan }} {{ notification.masaLawatan }}</p>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Nama Pegawai ETD:</span>
                  <p class="text-gray-900">{{ notification.namaPegawaiETD }}</p>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Lokasi Lawatan:</span>
                  <p class="text-gray-900">{{ notification.lokasiLawatan }}</p>
                </div>
              </div>

              <!-- Status & Action -->
              <div class="flex flex-col items-end space-y-3">
                <rs-badge
                  :variant="getStatusVariant(notification.status)"
                  class="text-sm"
                >
                  {{ getStatusText(notification.status) }}
                </rs-badge>

                <rs-button
                  v-if="notification.status === 'belum_disahkan'"
                  variant="primary"
                  size="sm"
                  @click="handleConfirmVisit(notification.id)"
                  class="flex items-center gap-2"
                >
                  <Icon name="ph:check" class="w-4 h-4" />
                  Sahkan Lawatan
                </rs-button>

                <rs-button
                  v-else
                  variant="success-outline"
                  size="sm"
                  @click="handleViewConfirmation(notification.id)"
                  class="flex items-center gap-2"
                >
                  <Icon name="ph:eye" class="w-4 h-4" />
                  Lihat Pengesahan
                </rs-button>
              </div>
            </div>

            <!-- Confirmation Details (for confirmed visits) -->
            <div 
              v-if="notification.status === 'telah_disahkan'" 
              class="mt-4 pt-4 border-t border-green-200"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="font-medium text-gray-700">Masa/Tarikh Pengesahan:</span>
                  <p class="text-gray-900">{{ notification.tarikhPengesahan }} {{ notification.masaPengesahan }}</p>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Nama Pemohon:</span>
                  <p class="text-gray-900">{{ notification.namaPemohon }}</p>
                </div>
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
              : 'Tiada notifikasi lawatan ETD untuk masa ini.' 
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
  title: "Notifikasi Tamat Lawatan ETD",
});

const breadcrumb = ref([
  {
    name: "Permohonan Bantuan",
    type: "link",
    path: "/BF-BTN/PB/senarai",
  },
  {
    name: "Notifikasi Tamat Lawatan ETD",
    type: "current",
    path: "/BF-BTN/permohonan/tamat-lawatan-etd",
  },
]);

// Options for filters
const statusOptions = [
  { label: "Semua Status", value: "semua" },
  { label: "Belum Disahkan", value: "belum_disahkan" },
  { label: "Telah Disahkan", value: "telah_disahkan" },
];

// State
const searchQuery = ref("");
const filters = ref({
  status: "semua",
});
const currentPage = ref(1);
const pageSize = ref(10);

// Mock data - notifications for ETD visit confirmations
const notifications = ref([
  {
    id: "ETD-2024-001",
    noRujukan: "NAS-2025-0001",
    namaPemohon: "Ahmad bin Abdullah",
    tarikhLawatan: "20 Nov 2024",
    masaLawatan: "10:30 AM",
    namaPegawaiETD: "Mohd Razak bin Hassan",
    lokasiLawatan: "No. 123, Jalan Merdeka, Taman Sejahtera, 50000 Kuala Lumpur",
    status: "belum_disahkan",
    tarikhNotifikasi: "2024-11-20",
    maklumatTambahan: "Lawatan untuk semakan keadaan tempat tinggal dan pendapatan keluarga",
  },
  {
    id: "ETD-2024-002", 
    noRujukan: "NAS-2025-0002",
    namaPemohon: "Siti Aminah binti Ismail",
    tarikhLawatan: "19 Nov 2024",
    masaLawatan: "2:00 PM",
    namaPegawaiETD: "Farah binti Ahmad",
    lokasiLawatan: "No. 456, Jalan Damai, Kampung Bahagia, 53000 Kuala Lumpur",
    status: "telah_disahkan",
    tarikhNotifikasi: "2024-11-19",
    tarikhPengesahan: "19 Nov 2024",
    masaPengesahan: "3:45 PM",
    maklumatTambahan: "Lawatan berjaya dan dokumen lengkap",
  },
  {
    id: "ETD-2024-003",
    noRujukan: "NAS-2025-0003", 
    namaPemohon: "Mohd Ali bin Omar",
    tarikhLawatan: "18 Nov 2024",
    masaLawatan: "9:00 AM",
    namaPegawaiETD: "Ahmad bin Yusof",
    lokasiLawatan: "No. 789, Jalan Harmoni, Taman Indah, 54000 Kuala Lumpur",
    status: "belum_disahkan",
    tarikhNotifikasi: "2024-11-18",
    maklumatTambahan: "Lawatan untuk verifikasi maklumat keluarga",
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
        notification.namaPegawaiETD.toLowerCase().includes(query) ||
        notification.namaPemohon.toLowerCase().includes(query)
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
  return notifications.value.length;
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
  // Navigate to confirmation page
  router.push(`/BF-BTN/permohonan/tamat-lawatan-etd/${notificationId}`);
};

const handleViewConfirmation = (notificationId) => {
  // Navigate to view confirmation details
  router.push(`/BF-BTN/permohonan/tamat-lawatan-etd/${notificationId}`);
};

const getStatusVariant = (status) => {
  const variants = {
    belum_disahkan: "warning",
    telah_disahkan: "success",
  };
  return variants[status] || "default";
};

const getStatusText = (status) => {
  const statusMap = {
    belum_disahkan: "Belum Disahkan",
    telah_disahkan: "Telah Disahkan",
  };
  return statusMap[status] || status;
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
.bg-blue-50 {
  background-color: #eff6ff;
}

.bg-green-50 {
  background-color: #f0fdf4;
}

.border-blue-200 {
  border-color: #bfdbfe;
}

.border-green-200 {
  border-color: #bbf7d0;
}

.border-green-200 {
  border-color: #bbf7d0;
}
</style>
