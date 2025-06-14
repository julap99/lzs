<template>
  <div class="min-h-screen">
    <div class="">
      <LayoutsBreadcrumb :items="breadcrumb" />

      <!-- Page Header -->
      <div class="mt-6 mb-8">
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Notifikasi & Pengesahan BQ</h1>
            <p class="mt-1 text-sm text-gray-600">
              Semak dan sahkan BQ selepas disokong oleh Panel Hartanah
            </p>
          </div>
          <rs-badge
            :variant="getNotificationStatusVariant(notificationData.status)"
            class="text-sm px-4 py-2"
          >
            {{ notificationData.status }}
          </rs-badge>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Section 1: Notification Card -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon name="ph:bell" class="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Notifikasi
                  </h2>
                  <p class="text-sm text-gray-500">
                    Maklumat notifikasi BQ yang perlu disemak
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="space-y-6">
                <!-- Notification Summary -->
                <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div class="flex items-start">
                    <Icon name="ph:info" class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-blue-800">
                        Ringkasan Notifikasi
                      </h3>
                      <p class="mt-1 text-sm text-blue-700">
                        {{ notificationData.ringkasanNotifikasi }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Notification Details -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700">
                      Tarikh / Masa Notifikasi
                    </label>
                    <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <span class="text-sm text-gray-900">
                        {{ formatDateTime(notificationData.tarikhNotifikasi) }}
                      </span>
                    </div>
                  </div>

                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700">
                      Status Notifikasi
                    </label>
                    <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <rs-badge
                        :variant="getNotificationStatusVariant(notificationData.status)"
                        class="text-sm"
                      >
                        {{ notificationData.status }}
                      </rs-badge>
                    </div>
                  </div>
                </div>

                <!-- Action Button -->
                <div class="pt-4 border-t">
                  <rs-button
                    variant="primary"
                    @click="toggleBQDisplay"
                    class="w-full sm:w-auto !py-3 !px-6 text-sm font-medium"
                    :disabled="showBQSection"
                  >
                    <Icon name="ph:clipboard-text" class="w-5 h-5 mr-2" />
                    {{ showBQSection ? 'BQ Sedang Dipaparkan' : 'Semak & Sahkan BQ' }}
                  </rs-button>
                </div>
              </div>
            </template>
          </rs-card>

          <!-- Section 2: BQ Display Card (Conditional) -->
          <rs-card v-if="showBQSection" class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div
                      class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
                    >
                      <Icon name="ph:list-bullets" class="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h2 class="text-lg font-semibold text-gray-900">
                      Paparan Pengesahan BQ
                    </h2>
                    <p class="text-sm text-gray-500">
                      BQ yang telah disokong oleh Panel Hartanah
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-sm font-medium text-gray-900">
                    {{ bqData.items.length }} Item
                  </div>
                  <div class="text-xs text-gray-500">Jumlah kerja</div>
                </div>
              </div>
            </template>

            <template #body>
              <div class="space-y-6">
                <!-- BQ Summary -->
                <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 class="text-sm font-medium text-green-800 mb-2">
                    Ringkasan BQ
                  </h3>
                  <p class="text-sm text-green-700">
                    {{ bqData.ringkasan }}
                  </p>
                </div>

                <!-- Support Date -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700">
                      Tarikh Sokongan Panel Hartanah
                    </label>
                    <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <span class="text-sm text-gray-900">
                        {{ formatDateTime(bqData.tarikhSokongan) }}
                      </span>
                    </div>
                  </div>

                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700">
                      Jumlah Anggaran
                    </label>
                    <div class="mt-1 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <span class="text-sm font-semibold text-blue-800">
                        {{ bqData.jumlahAnggaran }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- View Full Button -->
                <div class="text-center">
                  <rs-button
                    variant="primary-outline"
                    @click="showBQModal = true"
                    class="!py-3 !px-6 text-sm font-medium"
                  >
                    <Icon name="ph:eye" class="w-5 h-5 mr-2" />
                    Lihat BQ Penuh
                  </rs-button>
                </div>

                <!-- Quick BQ Preview -->
                <div class="border rounded-lg overflow-hidden">
                  <div class="bg-gray-50 px-4 py-3 border-b">
                    <h4 class="text-sm font-medium text-gray-900">
                      Pratonton BQ (3 item pertama)
                    </h4>
                  </div>
                  <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                        <tr>
                          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Bil
                          </th>
                          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Keterangan Kerja
                          </th>
                          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Unit
                          </th>
                          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Kuantiti
                          </th>
                          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Harga Unit
                          </th>
                          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Jumlah
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr
                          v-for="(item, index) in bqData.items.slice(0, 3)"
                          :key="index"
                          class="hover:bg-gray-50"
                        >
                          <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {{ index + 1 }}
                          </td>
                          <td class="px-4 py-4 text-sm text-gray-900">
                            {{ item.keteranganKerja }}
                          </td>
                          <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {{ item.unit }}
                          </td>
                          <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {{ item.kuantiti }}
                          </td>
                          <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {{ item.hargaUnit }}
                          </td>
                          <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {{ item.jumlah }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div v-if="bqData.items.length > 3" class="bg-gray-50 px-4 py-3 text-center border-t">
                    <p class="text-sm text-gray-600">
                      dan {{ bqData.items.length - 3 }} item lagi...
                    </p>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>
        </div>

        <!-- Section 3: Confirmation Sidebar -->
        <div class="lg:col-span-1 space-y-6">
          <rs-card class="shadow-sm border-0 bg-white sticky top-6">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon
                      name="ph:handshake"
                      class="w-6 h-6 text-orange-600"
                    />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Pengesahan / Maklum Balas
                  </h2>
                  <p class="text-sm text-gray-500">
                    Beri pengesahan atau catatan
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <FormKit
                type="form"
                :actions="false"
                @submit="handleConfirmation"
                v-model="confirmationData"
              >
                <div class="space-y-6">
                  <!-- Feedback Notes -->
                  <div class="space-y-1">
                    <FormKit
                      type="textarea"
                      name="catatanMaklumBalas"
                      label="Catatan Maklum Balas"
                      rows="4"
                      placeholder="Masukkan catatan anda di sini..."
                      :validation="requireFeedbackForDisagree ? 'required' : ''"
                      :validation-messages="{
                        required: 'Catatan diperlukan jika tidak bersetuju dengan BQ',
                      }"
                      :help="requireFeedbackForDisagree ? 'Catatan wajib diisi kerana anda memilih tidak setuju' : 'Catatan adalah pilihan'"
                      :classes="{ outer: 'mb-0' }"
                    />
                  </div>

                  <!-- Action Buttons -->
                  <div class="space-y-3 pt-4 border-t">
                    <rs-button
                      variant="success"
                      @click="handleSetuju"
                      class="w-full !py-3 text-sm font-medium"
                      :disabled="!showBQSection"
                    >
                      <Icon name="ph:check-circle" class="w-5 h-5 mr-2" />
                      Setuju dengan BQ
                    </rs-button>

                    <rs-button
                      variant="danger"
                      @click="handleTidakSetuju"
                      class="w-full !py-3 text-sm font-medium"
                      :disabled="!showBQSection"
                    >
                      <Icon name="ph:x-circle" class="w-5 h-5 mr-2" />
                      Tidak Setuju
                    </rs-button>

                    <rs-button
                      variant="primary-outline"
                      @click="handleCancel"
                      class="w-full !py-3 text-sm font-medium"
                    >
                      <Icon name="ph:arrow-left" class="w-5 h-5 mr-2" />
                      Kembali
                    </rs-button>
                  </div>

                  <!-- Help Text -->
                  <div v-if="!showBQSection" class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div class="flex">
                      <Icon name="ph:warning" class="w-5 h-5 text-yellow-400 mt-0.5" />
                      <div class="ml-3">
                        <h3 class="text-sm font-medium text-yellow-800">
                          Sila semak BQ terlebih dahulu
                        </h3>
                        <p class="mt-1 text-xs text-yellow-700">
                          Klik butang "Semak & Sahkan BQ" untuk melihat maklumat BQ sebelum memberi pengesahan.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </FormKit>
            </template>
          </rs-card>
        </div>
      </div>
    </div>

    <!-- Full BQ Modal -->
    <rs-modal
      v-model="showBQModal"
      title="BQ Lengkap"
      size="5xl"
      position="center"
    >
      <template #body>
        <div class="space-y-6">
          <!-- BQ Header Info -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label class="text-sm font-medium text-gray-700">ID Permohonan</label>
              <p class="text-sm font-mono text-gray-900">{{ bqData.idPermohonan }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Tarikh Sokongan</label>
              <p class="text-sm text-gray-900">{{ formatDateTime(bqData.tarikhSokongan) }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Jumlah Anggaran</label>
              <p class="text-sm font-semibold text-blue-800">{{ bqData.jumlahAnggaran }}</p>
            </div>
          </div>

          <!-- Full BQ Table -->
          <div class="border rounded-lg overflow-hidden">
            <div class="overflow-x-auto max-h-96">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50 sticky top-0">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bil
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Keterangan Kerja
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kuantiti
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Harga Unit
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jumlah
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="(item, index) in bqData.items"
                    :key="index"
                    class="hover:bg-gray-50"
                  >
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ index + 1 }}
                    </td>
                    <td class="px-4 py-4 text-sm text-gray-900">
                      {{ item.keteranganKerja }}
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ item.unit }}
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ item.kuantiti }}
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ item.hargaUnit }}
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {{ item.jumlah }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- BQ Summary -->
            <div class="bg-gray-50 px-4 py-3 border-t">
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-gray-900">Jumlah Keseluruhan:</span>
                <span class="text-lg font-bold text-blue-800">{{ bqData.jumlahAnggaran }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end">
          <rs-button variant="primary-outline" @click="showBQModal = false">
            Tutup
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Success Modal -->
    <rs-modal
      v-model="showSuccessModal"
      :title="getModalTitle()"
      size="md"
      position="center"
    >
      <template #body>
        <div class="space-y-6">
          <div class="text-center">
            <div
              class="mx-auto flex items-center justify-center h-16 w-16 rounded-full"
              :class="getModalIconClass()"
            >
              <Icon
                :name="getModalIcon()"
                class="h-8 w-8"
                :class="getModalIconColor()"
              />
            </div>
            <h3 class="mt-4 text-lg font-semibold text-gray-900">
              {{ getModalTitle() }}
            </h3>
            <p class="mt-2 text-sm text-gray-600">
              {{ getModalMessage() }}
            </p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700">ID Permohonan:</span>
              <span class="text-sm font-mono text-gray-900">{{ bqData.idPermohonan }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700">Status Baharu:</span>
              <rs-badge
                :variant="getStatusVariant(newStatus)"
                class="text-xs"
              >
                {{ newStatus }}
              </rs-badge>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700">Tarikh Tindakan:</span>
              <span class="text-sm text-gray-900">{{ formatDateTime(new Date()) }}</span>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-center">
          <rs-button variant="primary" @click="handleBackToList">
            OK
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

definePageMeta({
  title: "Notifikasi & Pengesahan BQ",
});

const breadcrumb = ref([
  {
    name: "Dashboard",
    type: "link",
    path: "/dashboard",
  },
  {
    name: "Permohonan Saya",
    type: "link",
    path: "/permohonan-saya",
  },
  {
    name: "Notifikasi & Pengesahan BQ",
    type: "current",
    path: `/BF-BTN/permohonan/notifikasi-pengesahan-bq/${route.params.id}`,
  },
]);

// Mock data - would be replaced with API calls
const notificationData = ref({
  status: "Belum Disahkan",
  ringkasanNotifikasi: `BQ untuk permohonan anda telah disokong oleh Panel Hartanah. Sila semak dan beri pengesahan dalam tempoh 7 hari bekerja dari tarikh notifikasi ini.`,
  tarikhNotifikasi: new Date('2025-01-15T10:30:00'),
});

const bqData = ref({
  idPermohonan: "NAS-2025-0001",
  ringkasan: "BQ ini mengandungi pecahan bantuan kewangan yang akan diberikan kepada pemohon untuk keperluan keluarga dan kos sara hidup.",
  tarikhSokongan: new Date('2025-01-14T16:45:00'),
  jumlahAnggaran: "RM 5,500.00",
  items: [
    {
      keteranganKerja: "Bantuan Kewangan Bulanan - Keperluan Asas Keluarga",
      unit: "Bulan",
      kuantiti: "6",
      hargaUnit: "RM 300.00",
      jumlah: "RM 1,800.00"
    },
    {
      keteranganKerja: "Bantuan Kos Perubatan dan Rawatan",
      unit: "Paket",
      kuantiti: "1",
      hargaUnit: "RM 1,200.00",
      jumlah: "RM 1,200.00"
    },
    {
      keteranganKerja: "Bantuan Kos Pendidikan Anak-anak",
      unit: "Semester",
      kuantiti: "2",
      hargaUnit: "RM 500.00",
      jumlah: "RM 1,000.00"
    },
    {
      keteranganKerja: "Bantuan Kos Makanan dan Keperluan Harian",
      unit: "Bulan",
      kuantiti: "3",
      hargaUnit: "RM 200.00",
      jumlah: "RM 600.00"
    },
    {
      keteranganKerja: "Bantuan Kos Utiliti dan Bil Rumah",
      unit: "Bulan",
      kuantiti: "4",
      hargaUnit: "RM 150.00",
      jumlah: "RM 600.00"
    },
    {
      keteranganKerja: "Bantuan Kecemasan untuk Keperluan Mendesak",
      unit: "Lump Sum",
      kuantiti: "1",
      hargaUnit: "RM 300.00",
      jumlah: "RM 300.00"
    }
  ]
});

// Component state
const showBQSection = ref(false);
const showBQModal = ref(false);
const showSuccessModal = ref(false);
const actionType = ref("");
const newStatus = ref("");

// Form data
const confirmationData = ref({
  catatanMaklumBalas: "",
});

// Computed
const requireFeedbackForDisagree = computed(() => {
  return actionType.value === "tidak_setuju";
});

// Methods
const toggleBQDisplay = () => {
  showBQSection.value = true;
};

const formatDateTime = (date) => {
  return new Date(date).toLocaleString("ms-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getNotificationStatusVariant = (status) => {
  const variants = {
    "Belum Disahkan": "warning",
    "Telah Disahkan": "success",
    "Dibatalkan": "danger",
    "Menunggu Kelulusan": "info",
    "Rework Required": "danger"
  };
  return variants[status] || "default";
};

const getStatusVariant = (status) => {
  const variants = {
    "Belum Disahkan": "warning",
    "Telah Disahkan": "success",
    "Dibatalkan": "danger",
    "Menunggu Kelulusan": "info",
    "Rework Required": "danger"
  };
  return variants[status] || "default";
};

const handleSetuju = () => {
  // Validate and process agreement
  console.log("Processing Agreement:", confirmationData.value);
  
  // Update status to "Menunggu Kelulusan"
  newStatus.value = "Menunggu Kelulusan";
  actionType.value = "setuju";
  
  // Update notification status
  notificationData.value.status = "Telah Disahkan";
  
  // Show success modal
  showSuccessModal.value = true;
};

const handleTidakSetuju = () => {
  // Set action type first to trigger validation
  actionType.value = "tidak_setuju";
  
  // Check if feedback is provided
  if (!confirmationData.value.catatanMaklumBalas || confirmationData.value.catatanMaklumBalas.trim() === "") {
    // FormKit validation will handle this
    return;
  }
  
  // Validate and process disagreement
  console.log("Processing Disagreement:", confirmationData.value);
  
  // Update status to "Rework Required" and trigger rework cycle to ETD
  newStatus.value = "Rework Required";
  
  // Update notification status
  notificationData.value.status = "Dibatalkan";
  
  // Show success modal
  showSuccessModal.value = true;
};

const handleConfirmation = () => {
  // This function can be used as a fallback for form submission
  console.log("Form submitted:", confirmationData.value);
};

const handleCancel = () => {
  router.push("/BF-BTN/permohonan/notifikasi-pengesahan-bq");
};

const handleBackToList = () => {
  showSuccessModal.value = false;
  router.push("/BF-BTN/permohonan/notifikasi-pengesahan-bq");
};

// Modal helper functions
const getModalTitle = () => {
  switch (actionType.value) {
    case "setuju":
      return "Pengesahan Berjaya";
    case "tidak_setuju":
      return "Permohonan Rework";
    default:
      return "Tindakan Berjaya";
  }
};

const getModalMessage = () => {
  switch (actionType.value) {
    case "setuju":
      return "BQ telah disahkan dan permohonan akan diteruskan ke peringkat kelulusan.";
    case "tidak_setuju":
      return "Permohonan telah dihantar kembali untuk rework berdasarkan catatan anda.";
    default:
      return "Tindakan anda telah berjaya direkodkan.";
  }
};

const getModalIconClass = () => {
  switch (actionType.value) {
    case "setuju":
      return "bg-green-100";
    case "tidak_setuju":
      return "bg-orange-100";
    default:
      return "bg-green-100";
  }
};

const getModalIcon = () => {
  switch (actionType.value) {
    case "setuju":
      return "ph:check-circle";
    case "tidak_setuju":
      return "ph:arrow-counter-clockwise";
    default:
      return "ph:check-circle";
  }
};

const getModalIconColor = () => {
  switch (actionType.value) {
    case "setuju":
      return "text-green-600";
    case "tidak_setuju":
      return "text-orange-600";
    default:
      return "text-green-600";
  }
};
</script>

<style lang="scss" scoped>
// Custom animations and transitions
.group:hover .group-hover\:text-blue-600 {
  transition: color 0.2s ease-in-out;
}

// Enhanced focus states
.focus\:ring-2:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

// Smooth transitions
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

// Table hover effects
tbody tr:hover {
  background-color: rgba(249, 250, 251, 0.5);
  transition: background-color 0.2s ease-in-out;
}

// Sticky table header
.sticky {
  position: sticky;
  top: 0;
  z-index: 10;
}
</style>
