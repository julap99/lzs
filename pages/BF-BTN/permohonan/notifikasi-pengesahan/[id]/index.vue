<template>
  <div class="space-y-6">
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Alert untuk SLA Warning -->
    <rs-alert
      v-if="
        notification.statusNotifikasi === 'belum_disahkan' &&
        slaDaysRemaining <= 7
      "
      variant="warning"
      class="border-l-4 border-yellow-500"
    >
      <div class="flex items-start gap-3">
        <Icon name="ph:warning-circle" class="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 class="font-semibold text-yellow-800">Amaran SLA</h4>
          <p class="text-yellow-700 mt-1">
            Pengesahan perlu dibuat dalam tempoh <strong>{{ slaDaysRemaining }} hari</strong> lagi.
            Sekiranya tidak bertindak, permohonan akan dibatalkan secara automatik.
          </p>
        </div>
      </div>
    </rs-alert>

    <!-- Main Content -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <!-- Left Column - Main Content -->
      <div class="xl:col-span-2 space-y-6">
        <!-- Section 2: Paparan Pengesahan BQ -->
        <rs-card>
          <template #header>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:file-text" class="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 class="text-xl font-bold text-gray-900">
                  Pengesahan BQ
                </h2>
                <p class="text-sm text-gray-600">{{ notification.noRujukan }}</p>
              </div>
            </div>
          </template>

          <template #body>
            <div class="space-y-6">
              <!-- Maklumat Asas -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-gray-50 p-4 rounded-lg">
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    No Rujukan Permohonan
                  </label>
                  <p class="text-base font-medium text-gray-900">
                    {{ notification.noRujukan }}
                  </p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Tarikh Sokongan
                  </label>
                  <p class="text-base font-medium text-gray-900">
                    {{ formatDateTime(notification.tarikhSokongan) }}
                  </p>
                </div>
              </div>

              <!-- Ringkasan BQ -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">
                  Ringkasan BQ
                </label>
                <div class="bg-blue-50 border border-blue-200 p-5 rounded-lg">
                  <p class="text-sm text-gray-800 leading-relaxed mb-4">
                    {{ notification.ringkasanBQ }}
                  </p>
                  <rs-button
                    variant="secondary"
                    @click="showBQModal = true"
                    class="flex items-center gap-2"
                    size="sm"
                  >
                    <Icon name="ph:eye" class="w-4 h-4" />
                    Lihat Butiran Penuh BQ
                  </rs-button>
                </div>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Section 3: Pengesahan/Catatan Maklum Balas -->
        <rs-card v-if="notification.statusNotifikasi === 'belum_disahkan'">
          <template #header>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:check-circle" class="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-900">Pengesahan BQ</h3>
                <p class="text-sm text-gray-600">Sila berikan pengesahan anda</p>
              </div>
            </div>
          </template>

          <template #body>
            <FormKit
              type="form"
              @submit="handleSubmitPengesahan"
              :disabled="isSubmitting"
              :actions="false"
            >
              <!-- Catatan Maklum Balas -->
              <div class="mb-6">
                <FormKit
                  v-model="form.catatanMaklumBalas"
                  type="textarea"
                  label="Catatan Maklum Balas"
                  :help="
                    selectedAction === 'tidak_setuju'
                      ? 'Wajib diisi jika pilih Tidak Setuju'
                      : 'Catatan pilihan untuk rekod'
                  "
                  :validation="
                    selectedAction === 'tidak_setuju' ? 'required' : ''
                  "
                  rows="4"
                  placeholder="Masukkan catatan anda di sini..."
                />
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-col sm:flex-row gap-4">
                <rs-button
                  type="button"
                  variant="primary"
                  @click="handleAction('setuju')"
                  :disabled="isSubmitting"
                  class="flex items-center justify-center gap-3 py-3 px-6 text-base font-semibold"
                  size="lg"
                >
                  <Icon name="ph:check-circle" class="w-5 h-5" />
                  Setuju & Sahkan
                </rs-button>
                <rs-button
                  type="button"
                  variant="danger"
                  @click="handleAction('tidak_setuju')"
                  :disabled="isSubmitting"
                  class="flex items-center justify-center gap-3 py-3 px-6 text-base font-semibold"
                  size="lg"
                >
                  <Icon name="ph:x-circle" class="w-5 h-5" />
                  Tidak Setuju
                </rs-button>
              </div>
            </FormKit>
          </template>
        </rs-card>

        <!-- Section 4: Status Pengesahan -->
        <rs-card v-if="notification.statusNotifikasi !== 'belum_disahkan'">
          <template #header>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:info" class="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-900">Status Pengesahan</h3>
                <p class="text-sm text-gray-600">Maklumat pengesahan yang telah dibuat</p>
              </div>
            </div>
          </template>

          <template #body>
            <div class="space-y-6">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-gray-50 p-4 rounded-lg">
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Status Pengesahan
                  </label>
                  <rs-badge
                    :variant="getStatusVariant(notification.statusNotifikasi)"
                    class="text-sm font-medium px-3 py-1"
                  >
                    {{ getStatusLabel(notification.statusNotifikasi) }}
                  </rs-badge>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Masa/Tarikh Pengesahan
                  </label>
                  <p class="text-base font-medium text-gray-900">
                    {{ formatDateTime(notification.tarikhPengesahan) }}
                  </p>
                </div>
              </div>

              <div v-if="notification.catatanMaklumBalas" class="bg-gray-50 p-4 rounded-lg">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Catatan Maklum Balas
                </label>
                <div class="text-sm text-gray-800 leading-relaxed">
                  {{ notification.catatanMaklumBalas }}
                </div>
              </div>
            </div>
          </template>
        </rs-card>
      </div>

      <!-- Right Column - Sidebar -->
      <div class="xl:col-span-1 space-y-6">
        <!-- Quick Info Card -->
        <rs-card>
          <template #header>
            <h3 class="text-base font-semibold text-gray-900">Maklumat Ringkas</h3>
          </template>
          <template #body>
            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <Icon name="ph:calendar" class="w-4 h-4 text-gray-500" />
                <div class="text-sm">
                  <p class="text-gray-600">Tarikh Notifikasi</p>
                  <p class="font-medium text-gray-900">{{ formatDate(notification.tarikhNotifikasi) }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <Icon name="ph:clock" class="w-4 h-4 text-gray-500" />
                <div class="text-sm">
                  <p class="text-gray-600">SLA</p>
                  <p class="font-medium text-gray-900">{{ notification.slaDays }} hari</p>
                </div>
              </div>
              <div v-if="notification.statusNotifikasi === 'belum_disahkan'" class="flex items-center gap-3">
                <Icon name="ph:warning" class="w-4 h-4 text-yellow-500" />
                <div class="text-sm">
                  <p class="text-gray-600">Baki Masa</p>
                  <p class="font-medium" :class="slaDaysRemaining <= 7 ? 'text-red-600' : 'text-gray-900'">
                    {{ slaDaysRemaining }} hari
                  </p>
                </div>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Section 6: Log Audit -->
        <rs-card>
          <template #header>
            <h3 class="text-base font-semibold text-gray-900">Log Audit</h3>
          </template>
          <template #body>
            <div class="space-y-4">
              <div v-for="log in auditLogs" :key="log.id" class="border-l-2 border-gray-200 pl-4 pb-4 last:pb-0">
                <div class="flex items-start gap-3">
                  <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 -ml-5 border-2 border-white"></div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900">{{ log.tindakan }}</p>
                    <p class="text-xs text-gray-600 mt-1">{{ log.pengguna }}</p>
                    <p class="text-xs text-gray-500 mt-1">{{ formatDateTime(log.tarikh) }}</p>
                    <p v-if="log.catatan" class="text-xs text-gray-700 mt-2 bg-gray-50 p-2 rounded">
                      {{ log.catatan }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </rs-card>
      </div>
    </div>

    <!-- Modal untuk Lihat Penuh BQ -->
    <rs-modal v-model="showBQModal" title="Butiran Lengkap BQ" size="xl">
      <template #header>
        <div class="flex items-center gap-3">
          <Icon name="ph:table" class="w-5 h-5 text-blue-600" />
          <h3 class="text-lg font-semibold">Keterangan Kerja BQ</h3>
        </div>
      </template>
      
      <div class="overflow-x-auto">
        <div class="min-w-full">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Bil
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Keterangan Kerja
                </th>
                <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Unit
                </th>
                <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Kuantiti
                </th>
                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Kadar (RM)
                </th>
                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Jumlah (RM)
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(item, index) in bqDetails" :key="item.id" class="hover:bg-gray-50">
                <td class="px-4 py-4 text-sm font-medium text-gray-900 text-center">
                  {{ index + 1 }}
                </td>
                <td class="px-4 py-4 text-sm text-gray-900">
                  {{ item.keterangan }}
                </td>
                <td class="px-4 py-4 text-sm text-gray-900 text-center">
                  {{ item.unit }}
                </td>
                <td class="px-4 py-4 text-sm text-gray-900 text-center">
                  {{ item.kuantiti.toLocaleString() }}
                </td>
                <td class="px-4 py-4 text-sm text-gray-900 text-right font-medium">
                  {{ formatCurrency(item.kadar) }}
                </td>
                <td class="px-4 py-4 text-sm text-gray-900 text-right font-semibold">
                  {{ formatCurrency(item.jumlah) }}
                </td>
              </tr>
            </tbody>
            <tfoot class="bg-gray-50">
              <tr>
                <td colspan="5" class="px-4 py-4 text-right text-sm font-bold text-gray-900">
                  Jumlah Keseluruhan:
                </td>
                <td class="px-4 py-4 text-right text-base font-bold text-gray-900">
                  {{ formatCurrency(totalBQ) }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </rs-modal>

    <!-- Confirmation Modal -->
    <rs-modal v-model="showConfirmModal" :title="confirmModalTitle" size="md" position="center">
      <div class="text-center space-y-4">
        <div class="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
             :class="selectedAction === 'setuju' ? 'bg-green-100' : 'bg-red-100'">
          <Icon 
            :name="selectedAction === 'setuju' ? 'ph:check-circle' : 'ph:warning-circle'" 
            class="w-8 h-8"
            :class="selectedAction === 'setuju' ? 'text-green-600' : 'text-red-600'"
          />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ confirmModalTitle }}</h3>
          <p class="text-gray-600">{{ confirmModalMessage }}</p>
        </div>
        <div
          v-if="selectedAction === 'tidak_setuju' && !form.catatanMaklumBalas"
          class="bg-red-50 border border-red-200 rounded-lg p-3"
        >
          <p class="text-red-700 text-sm font-medium">
            <Icon name="ph:warning" class="w-4 h-4 inline mr-1" />
            Catatan Maklum Balas diperlukan untuk tindakan "Tidak Setuju"
          </p>
        </div>
      </div>

      <template #footer>
        <div class="flex flex-col sm:flex-row justify-end gap-3">
          <rs-button
            variant="primary-outline"
            @click="showConfirmModal = false"
            :disabled="isSubmitting"
            class="order-2 sm:order-1"
          >
            Batal
          </rs-button>
          <rs-button
            :variant="selectedAction === 'setuju' ? 'primary' : 'danger'"
            @click="confirmSubmit"
            :disabled="
              isSubmitting ||
              (selectedAction === 'tidak_setuju' && !form.catatanMaklumBalas)
            "
            :loading="isSubmitting"
            class="order-1 sm:order-2"
          >
            Ya, {{ selectedAction === "setuju" ? "Setuju" : "Tidak Setuju" }}
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const route = useRoute();
const router = useRouter();

definePageMeta({
  title: "Pengesahan BQ",
});

const breadcrumb = ref([
  {
    name: "Dashboard",
    type: "link",
    path: "/dashboard",
  },
  {
    name: "Notifikasi Pengesahan BQ",
    type: "link",
    path: "/BF-BTN/permohonan/notifikasi-pengesahan",
  },
  {
    name: `Pengesahan - ${route.params.id}`,
    type: "current",
    path: `/BF-BTN/permohonan/notifikasi-pengesahan/${route.params.id}`,
  },
]);

// State
const showBQModal = ref(false);
const showConfirmModal = ref(false);
const selectedAction = ref("");
const isSubmitting = ref(false);

const form = ref({
  catatanMaklumBalas: "",
});

// Mock data - would be replaced with API call
const notification = ref({
  noRujukan: route.params.id,
  ringkasanNotifikasi:
    "BQ untuk permohonan anda telah disokong. Sila semak dan beri pengesahan dalam tempoh yang ditetapkan.",
  tarikhNotifikasi: "2024-03-21 10:30:00",
  tarikhSokongan: "2024-03-21 09:15:00",
  statusNotifikasi: "belum_disahkan",
  slaDays: 30,
  tarikhPengesahan: null,
  catatanMaklumBalas: "",
  ringkasanBQ:
    "Kerja-kerja pembaikan dan penambahbaikan struktur bangunan masjid termasuk kerja-kerja elektrik, paip dan pemasangan.",
});

const bqDetails = ref([
  {
    id: 1,
    keterangan: "Kerja-kerja Pembinaan Asas Konkrit",
    unit: "m³",
    kuantiti: 25,
    kadar: 450.0,
    jumlah: 11250.0,
  },
  {
    id: 2,
    keterangan: "Kerja-kerja Bumbung dan Besi",
    unit: "m²",
    kuantiti: 150,
    kadar: 120.0,
    jumlah: 18000.0,
  },
  {
    id: 3,
    keterangan: "Kerja-kerja Elektrik dan Pendawaian",
    unit: "unit",
    kuantiti: 1,
    kadar: 5500.0,
    jumlah: 5500.0,
  },
]);

const auditLogs = ref([
  {
    id: 1,
    tarikh: "2024-03-21 09:15:00",
    tindakan: "BQ Disokong",
    pengguna: "ETD - Siti binti Ali",
    catatan: "BQ telah disemak dan disokong untuk pengesahan pemohon",
  },
  {
    id: 2,
    tarikh: "2024-03-21 10:30:00",
    tindakan: "Notifikasi Dihantar",
    pengguna: "Sistem",
    catatan: "Notifikasi pengesahan BQ dihantar kepada pemohon",
  },
]);

// Computed properties
const totalBQ = computed(() => {
  return bqDetails.value.reduce((total, item) => total + item.jumlah, 0);
});

const slaDaysRemaining = computed(() => {
  if (notification.value.statusNotifikasi !== "belum_disahkan") return 0;

  const notificationDate = new Date(notification.value.tarikhNotifikasi);
  const today = new Date();
  const daysPassed = Math.floor(
    (today - notificationDate) / (1000 * 60 * 60 * 24)
  );
  return Math.max(0, notification.value.slaDays - daysPassed);
});

const confirmModalTitle = computed(() => {
  return selectedAction.value === "setuju"
    ? "Pengesahan Kelulusan"
    : "Pengesahan Penolakan";
});

const confirmModalMessage = computed(() => {
  if (selectedAction.value === "setuju") {
    return "Adakah anda pasti untuk MENYETUJUI BQ ini? Tindakan ini akan menghantar permohonan untuk kelulusan.";
  }
  return "Adakah anda pasti untuk MENOLAK BQ ini? Permohonan akan dikembalikan kepada ETD untuk rework.";
});

// Methods
const handleAction = (action) => {
  selectedAction.value = action;
  showConfirmModal.value = true;
};

const confirmSubmit = async () => {
  if (
    selectedAction.value === "tidak_setuju" &&
    !form.value.catatanMaklumBalas
  ) {
    return;
  }

  isSubmitting.value = true;

  try {
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Update notification status
    if (selectedAction.value === "setuju") {
      notification.value.statusNotifikasi = "menunggu_kelulusan";
    } else {
      notification.value.statusNotifikasi = "rework_required";
    }

    notification.value.tarikhPengesahan = new Date().toISOString();
    notification.value.catatanMaklumBalas = form.value.catatanMaklumBalas;

    // Add audit log
    auditLogs.value.push({
      id: auditLogs.value.length + 1,
      tarikh: new Date().toISOString(),
      tindakan:
        selectedAction.value === "setuju"
          ? "Pengesahan Disetujui"
          : "Pengesahan Ditolak",
      pengguna: "Pemohon - Ahmad bin Abdullah",
      catatan:
        form.value.catatanMaklumBalas ||
        `BQ ${
          selectedAction.value === "setuju" ? "disetujui" : "ditolak"
        } oleh pemohon`,
    });

    showConfirmModal.value = false;

    // Show success notification
    $toast.success(
      `BQ telah ${
        selectedAction.value === "setuju" ? "disetujui" : "ditolak"
      } berjaya.`
    );

    // Redirect after 2 seconds
    setTimeout(() => {
      router.push("/BF-BTN/permohonan/notifikasi-pengesahan");
    }, 2000);
  } catch (error) {
    $toast.error("Ralat berlaku. Sila cuba lagi.");
  } finally {
    isSubmitting.value = false;
  }
};

const formatDateTime = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleString("ms-MY", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("ms-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("ms-MY", {
    style: "currency",
    currency: "MYR",
  }).format(amount);
};

const getStatusVariant = (status) => {
  const variants = {
    belum_disahkan: "warning",
    telah_disahkan: "success",
    menunggu_kelulusan: "info",
    rework_required: "danger",
    dibatalkan: "danger",
  };
  return variants[status] || "default";
};

const getStatusLabel = (status) => {
  const labels = {
    belum_disahkan: "Belum Disahkan",
    telah_disahkan: "Telah Disahkan",
    menunggu_kelulusan: "Menunggu Kelulusan",
    rework_required: "Rework Required (to ETD)",
    dibatalkan: "Dibatalkan",
  };
  return labels[status] || status;
};

// Lifecycle
onMounted(() => {
  // Load notification data based on route parameter
  // In real app, this would be an API call
});
</script>

<style lang="scss" scoped></style>
