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
            <h1 class="text-2xl font-bold text-gray-900">
              Pengesahan Lawatan ETD
            </h1>
            <p class="mt-1 text-sm text-gray-600">
              Sahkan bahawa lawatan ETD telah dijalankan untuk permohonan anda
            </p>
          </div>
          <rs-badge
            :variant="getStatusVariant(visitData.status)"
            class="text-sm px-4 py-2"
          >
            {{ getStatusText(visitData.status) }}
          </rs-badge>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Section 1: Visit Notification Summary -->
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
                    Ringkasan Notifikasi
                  </h2>
                  <p class="text-sm text-gray-500">
                    Maklumat notifikasi lawatan ETD
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div
                class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
              >
                <div class="flex items-start space-x-3">
                  <div class="flex-shrink-0 mt-1">
                    <Icon name="ph:info" class="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 class="font-medium text-blue-900 mb-1">
                      Pegawai ETD telah melengkapkan lawatan ke lokasi
                      permohonan anda
                    </h3>
                    <p class="text-sm text-blue-700">
                      Sila sahkan bahawa lawatan telah dijalankan untuk
                      permohonan
                      <span class="font-mono font-semibold">{{
                        visitData.noRujukan
                      }}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >No Rujukan Permohonan</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm font-mono text-gray-900">{{
                      visitData.noRujukan
                    }}</span>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Status Notifikasi</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <rs-badge
                      :variant="getStatusVariant(visitData.status)"
                      class="text-sm"
                    >
                      {{ getStatusText(visitData.status) }}
                    </rs-badge>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>

          <!-- Section 2: Visit Details (Read-only) -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon name="ph:map-pin" class="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Butiran Lawatan ETD
                  </h2>
                  <p class="text-sm text-gray-500">
                    Maklumat lengkap lawatan yang telah dijalankan
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Tarikh Lawatan</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{
                      visitData.tarikhLawatan
                    }}</span>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Masa Lawatan</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{
                      visitData.masaLawatan
                    }}</span>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Nama Pegawai ETD</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{
                      visitData.namaPegawaiETD
                    }}</span>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Jawatan</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{
                      visitData.jawatanPegawai
                    }}</span>
                  </div>
                </div>

                <div class="space-y-1 md:col-span-2">
                  <label class="text-sm font-medium text-gray-700"
                    >Lokasi Lawatan</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{
                      visitData.lokasiLawatan
                    }}</span>
                  </div>
                </div>

                <div
                  v-if="visitData.maklumatTambahan"
                  class="space-y-1 md:col-span-2"
                >
                  <label class="text-sm font-medium text-gray-700"
                    >Maklumat Tambahan</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{
                      visitData.maklumatTambahan
                    }}</span>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>

          <!-- Section 3: Digital Signature (if not confirmed yet) -->
          <rs-card
            v-if="visitData.status === 'belum_disahkan'"
            class="shadow-sm border-0 bg-white"
          >
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon name="ph:signature" class="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Tandatangan Digital
                  </h2>
                  <p class="text-sm text-gray-500">
                    Turunkan tandatangan anda untuk mengesahkan lawatan
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="space-y-4">
                <div
                  class="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
                >
                  <div class="flex items-start space-x-3">
                    <Icon
                      name="ph:warning"
                      class="w-5 h-5 text-yellow-600 mt-0.5"
                    />
                    <div>
                      <h4 class="font-medium text-yellow-800">
                        Arahan Tandatangan
                      </h4>
                      <p class="text-sm text-yellow-700 mt-1">
                        Sila turunkan tandatangan anda di ruang yang disediakan
                        menggunakan tetikus, touchscreen, atau signature pad.
                        Tandatangan ini akan digunakan untuk mengesahkan bahawa
                        lawatan ETD telah dijalankan.
                      </p>
                    </div>
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">
                    Ruang Tandatangan <span class="text-red-500">*</span>
                  </label>
                  <div
                    class="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50"
                  >
                    <canvas
                      ref="signatureCanvas"
                      @mousedown="startDrawing"
                      @mousemove="draw"
                      @mouseup="stopDrawing"
                      @touchstart="startDrawing"
                      @touchmove="draw"
                      @touchend="stopDrawing"
                      class="w-full h-48 bg-white rounded border cursor-crosshair"
                      width="600"
                      height="200"
                    ></canvas>
                    <div class="flex justify-between items-center mt-3">
                      <p class="text-sm text-gray-500">
                        Turunkan tandatangan anda di ruang putih di atas
                      </p>
                      <rs-button
                        variant="secondary-outline"
                        size="sm"
                        @click="clearSignature"
                        class="flex items-center gap-2"
                      >
                        <Icon name="ph:eraser" class="w-4 h-4" />
                        Padam
                      </rs-button>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>

          <!-- Section 4: Confirmation Details (if already confirmed) -->
          <rs-card v-else class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon
                      name="ph:check-circle"
                      class="w-6 h-6 text-green-600"
                    />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Butiran Pengesahan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Maklumat pengesahan lawatan yang telah dilakukan
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div
                class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
              >
                <div class="flex items-start space-x-3">
                  <Icon
                    name="ph:check-circle"
                    class="w-5 h-5 text-green-600 mt-0.5"
                  />
                  <div>
                    <h3 class="font-medium text-green-900 mb-1">
                      Lawatan Telah Disahkan
                    </h3>
                    <p class="text-sm text-green-700">
                      Anda telah berjaya mengesahkan bahawa lawatan ETD telah
                      dijalankan pada {{ visitData.tarikhPengesahan }}
                      {{ visitData.masaPengesahan }}.
                    </p>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Masa/Tarikh Pengesahan</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900"
                      >{{ visitData.tarikhPengesahan }}
                      {{ visitData.masaPengesahan }}</span
                    >
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Nama Pemohon</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{
                      visitData.namaPemohon
                    }}</span>
                  </div>
                </div>

                <div class="space-y-1 md:col-span-2">
                  <label class="text-sm font-medium text-gray-700"
                    >Status Lawatan</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <rs-badge variant="success" class="text-sm">
                      Lawatan Lapangan Selesai
                    </rs-badge>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>
        </div>

        <!-- Sidebar - Action Panel -->
        <div class="lg:col-span-1 space-y-6">
          <rs-card class="shadow-sm border-0 bg-white sticky top-6">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon
                      name="ph:clipboard-text"
                      class="w-6 h-6 text-purple-600"
                    />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">Tindakan</h2>
                  <p class="text-sm text-gray-500">Pengesahan lawatan</p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="space-y-4">
                <!-- Status Info -->
                <div
                  class="p-4 rounded-lg border"
                  :class="{
                    'bg-yellow-50 border-yellow-200':
                      visitData.status === 'belum_disahkan',
                    'bg-green-50 border-green-200':
                      visitData.status === 'telah_disahkan',
                  }"
                >
                  <div class="flex items-center space-x-2">
                    <Icon
                      :name="
                        visitData.status === 'telah_disahkan'
                          ? 'ph:check-circle'
                          : 'ph:clock'
                      "
                      class="w-5 h-5"
                      :class="{
                        'text-yellow-600':
                          visitData.status === 'belum_disahkan',
                        'text-green-600': visitData.status === 'telah_disahkan',
                      }"
                    />
                    <span
                      class="font-medium"
                      :class="{
                        'text-yellow-800':
                          visitData.status === 'belum_disahkan',
                        'text-green-800': visitData.status === 'telah_disahkan',
                      }"
                    >
                      {{
                        visitData.status === "telah_disahkan"
                          ? "Telah Disahkan"
                          : "Menunggu Pengesahan"
                      }}
                    </span>
                  </div>
                  <p
                    class="text-sm mt-1"
                    :class="{
                      'text-yellow-700': visitData.status === 'belum_disahkan',
                      'text-green-700': visitData.status === 'telah_disahkan',
                    }"
                  >
                    {{
                      visitData.status === "telah_disahkan"
                        ? "Pengesahan lawatan telah selesai"
                        : "Sila sahkan lawatan dengan menurunkan tandatangan"
                    }}
                  </p>
                </div>

                <!-- Action Buttons -->
                <div class="space-y-3 pt-4 border-t">
                  <rs-button
                    v-if="visitData.status === 'belum_disahkan'"
                    variant="primary"
                    @click="handleConfirmVisit"
                    :disabled="processing || !hasSignature"
                    :loading="processing"
                    class="w-full !py-3 text-sm font-medium"
                  >
                    <Icon name="ph:check" class="w-5 h-5 mr-2" />
                    Sahkan Lawatan
                  </rs-button>

                  <rs-button
                    variant="primary-outline"
                    @click="handleBack"
                    class="w-full !py-3 text-sm font-medium"
                  >
                    <Icon name="ph:arrow-left" class="w-5 h-5 mr-2" />
                    Kembali
                  </rs-button>
                </div>

                <!-- Validation Message -->
                <div
                  v-if="
                    visitData.status === 'belum_disahkan' &&
                    !hasSignature &&
                    showValidation
                  "
                  class="p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div class="flex items-start space-x-2">
                    <Icon
                      name="ph:warning"
                      class="w-4 h-4 text-red-600 mt-0.5"
                    />
                    <p class="text-sm text-red-700">
                      Sila turunkan tandatangan anda sebelum mengesahkan
                      lawatan.
                    </p>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const route = useRoute();
const router = useRouter();
const toast = useToast();

const processing = ref(false);
const hasSignature = ref(false);
const showValidation = ref(false);
const signatureCanvas = ref(null);

let isDrawing = false;
let ctx = null;

definePageMeta({
  title: "Pengesahan Lawatan ETD",
});

const breadcrumb = ref([
  {
    name: "Notifikasi Tamat Lawatan ETD",
    type: "link",
    path: "/BF-BTN/permohonan/tamat-lawatan-etd",
  },
  {
    name: "Pengesahan Lawatan",
    type: "current",
    path: `/BF-BTN/permohonan/tamat-lawatan-etd/${route.params.id}`,
  },
]);

// Visit data - would be fetched from API based on route.params.id
const visitData = ref({
  id: "",
  noRujukan: "",
  namaPemohon: "",
  tarikhLawatan: "",
  masaLawatan: "",
  namaPegawaiETD: "",
  jawatanPegawai: "",
  lokasiLawatan: "",
  status: "belum_disahkan", // belum_disahkan | telah_disahkan
  tarikhNotifikasi: "",
  maklumatTambahan: "",
  // For confirmed visits
  tarikhPengesahan: "",
  masaPengesahan: "",
});

// Methods
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

// Signature Canvas Methods
const setupCanvas = () => {
  if (signatureCanvas.value) {
    ctx = signatureCanvas.value.getContext("2d");
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }
};

const getEventPos = (e) => {
  const rect = signatureCanvas.value.getBoundingClientRect();
  const scaleX = signatureCanvas.value.width / rect.width;
  const scaleY = signatureCanvas.value.height / rect.height;

  if (e.touches && e.touches[0]) {
    return {
      x: (e.touches[0].clientX - rect.left) * scaleX,
      y: (e.touches[0].clientY - rect.top) * scaleY,
    };
  }
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
  };
};

const startDrawing = (e) => {
  e.preventDefault();
  isDrawing = true;
  const pos = getEventPos(e);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
  hasSignature.value = false; // Reset signature state
};

const draw = (e) => {
  if (!isDrawing) return;
  e.preventDefault();

  const pos = getEventPos(e);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  hasSignature.value = true;
  showValidation.value = false;
};

const stopDrawing = (e) => {
  e.preventDefault();
  isDrawing = false;
  ctx.closePath();
};

const clearSignature = () => {
  if (ctx && signatureCanvas.value) {
    ctx.clearRect(
      0,
      0,
      signatureCanvas.value.width,
      signatureCanvas.value.height
    );
    hasSignature.value = false;
    showValidation.value = false;
  }
};

const handleConfirmVisit = async () => {
  if (!hasSignature.value) {
    showValidation.value = true;
    toast.error("Sila turunkan tandatangan anda sebelum mengesahkan lawatan");
    return;
  }

  try {
    processing.value = true;

    // Get signature data
    const signatureData = signatureCanvas.value.toDataURL();

    // Prepare confirmation data
    const confirmationData = {
      visitId: visitData.value.id,
      noRujukan: visitData.value.noRujukan,
      namaPemohon: visitData.value.namaPemohon,
      signature: signatureData,
      tarikhPengesahan: new Date().toLocaleDateString("ms-MY"),
      masaPengesahan: new Date().toLocaleTimeString("ms-MY", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };

    // Simulate API call to save confirmation
    console.log("Saving confirmation:", confirmationData);

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Update visit data to confirmed status
    visitData.value.status = "telah_disahkan";
    visitData.value.tarikhPengesahan = confirmationData.tarikhPengesahan;
    visitData.value.masaPengesahan = confirmationData.masaPengesahan;

    toast.success("Lawatan telah berjaya disahkan!");

    // Here the system would:
    // - Insert audit trail
    // - Update status to "Lawatan Lapangan Selesai"
    // - Log for audit and SLA monitoring
  } catch (error) {
    toast.error("Ralat semasa mengesahkan lawatan");
    console.error(error);
  } finally {
    processing.value = false;
  }
};

const handleBack = () => {
  router.push("/BF-BTN/permohonan/tamat-lawatan-etd");
};

// Fetch visit data on mount
onMounted(async () => {
  try {
    // Mock data based on route params - would be API call in real implementation
    const visitId = route.params.id;

    // Simulate different visit states based on ID
    if (visitId === "ETD-2024-002") {
      // Already confirmed visit
      visitData.value = {
        id: "ETD-2024-002",
        noRujukan: "NAS-2025-0002",
        namaPemohon: "Siti Aminah binti Ismail",
        tarikhLawatan: "19 Nov 2024",
        masaLawatan: "2:00 PM",
        namaPegawaiETD: "Farah binti Ahmad",
        jawatanPegawai: "Pegawai Siasatan ETD",
        lokasiLawatan:
          "No. 456, Jalan Damai, Kampung Bahagia, 53000 Kuala Lumpur",
        status: "telah_disahkan",
        tarikhNotifikasi: "2024-11-19",
        maklumatTambahan: "Lawatan berjaya dan dokumen lengkap",
        tarikhPengesahan: "19 Nov 2024",
        masaPengesahan: "3:45 PM",
      };
    } else {
      // Pending confirmation visit
      visitData.value = {
        id: visitId,
        noRujukan: "NAS-2025-0001",
        namaPemohon: "Ahmad bin Abdullah",
        tarikhLawatan: "20 Nov 2024",
        masaLawatan: "10:30 AM",
        namaPegawaiETD: "Mohd Razak bin Hassan",
        jawatanPegawai: "Pegawai Siasatan ETD",
        lokasiLawatan:
          "No. 123, Jalan Merdeka, Taman Sejahtera, 50000 Kuala Lumpur",
        status: "belum_disahkan",
        tarikhNotifikasi: "2024-11-20",
        maklumatTambahan:
          "Lawatan untuk semakan keadaan tempat tinggal dan pendapatan keluarga",
      };
    }

    // Setup signature canvas if visit is not confirmed yet
    if (visitData.value.status === "belum_disahkan") {
      await nextTick();
      setupCanvas();
    }
  } catch (error) {
    toast.error("Ralat semasa memuatkan data lawatan");
    console.error(error);
  }
});
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

// Signature canvas styling
canvas {
  touch-action: none;
}

// Custom background colors for status
.bg-blue-50 {
  background-color: #eff6ff;
}

.bg-green-50 {
  background-color: #f0fdf4;
}

.bg-yellow-50 {
  background-color: #fefce8;
}

.border-blue-200 {
  border-color: #bfdbfe;
}

.border-green-200 {
  border-color: #bbf7d0;
}

.border-yellow-200 {
  border-color: #fef3c7;
}

// Text colors
.text-blue-600 {
  color: #2563eb;
}

.text-blue-700 {
  color: #1d4ed8;
}

.text-blue-800 {
  color: #1e40af;
}

.text-blue-900 {
  color: #1e3a8a;
}

.text-green-600 {
  color: #16a34a;
}

.text-green-700 {
  color: #15803d;
}

.text-green-800 {
  color: #166534;
}

.text-yellow-600 {
  color: #ca8a04;
}

.text-yellow-700 {
  color: #a16207;
}

.text-yellow-800 {
  color: #854d0e;
}

.text-red-600 {
  color: #dc2626;
}

.text-red-700 {
  color: #b91c1c;
}
</style>
