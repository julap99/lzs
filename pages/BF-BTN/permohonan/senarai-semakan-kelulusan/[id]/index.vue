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
              Semakan Kelulusan Permohonan
            </h1>
            <p class="mt-1 text-sm text-gray-600">
              Semak dan buat keputusan kelulusan untuk permohonan bantuan
            </p>
          </div>
          <rs-badge
            v-if="formData.statusPermohonan"
            :variant="getStatusVariant(formData.statusPermohonan)"
            class="text-sm px-4 py-2"
          >
            {{ getStatusText(formData.statusPermohonan) }}
          </rs-badge>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Section 1: Maklumat Permohonan (Read-only) -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon name="ph:user-circle" class="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Maklumat Permohonan
                  </h2>
                  <p class="text-sm text-gray-500">Butiran asas permohonan</p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >ID Permohonan</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm font-mono text-gray-900">{{
                      formData.idPermohonan
                    }}</span>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Nama Pemohon / Institusi</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{
                      formData.namaPemohon
                    }}</span>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Jenis Bantuan</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{
                      formData.jenisBantuan
                    }}</span>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Status Permohonan</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <rs-badge
                      :variant="getStatusVariant(formData.statusPermohonan)"
                      class="text-sm"
                    >
                      {{ getStatusText(formData.statusPermohonan) }}
                    </rs-badge>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>

          <!-- Section 2: Dokumen & Catatan (Read-only) -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon
                      name="ph:folder-open"
                      class="w-6 h-6 text-indigo-600"
                    />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Dokumen & Catatan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Dokumen sokongan dan catatan berkaitan
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="grid grid-cols-1 gap-4">
                <!-- BQ -->
                <div
                  class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                >
                  <div class="flex items-center space-x-3">
                    <Icon name="ph:file-text" class="w-5 h-5 text-gray-600" />
                    <span class="text-sm font-medium text-gray-900"
                      >BQ (Bill of Quantities)</span
                    >
                  </div>
                  <rs-button
                    size="sm"
                    variant="primary-outline"
                    @click="viewBQ"
                  >
                    <Icon name="ph:eye" class="w-4 h-4 mr-1" />
                    Lihat BQ
                  </rs-button>
                </div>

                <!-- Laporan Gambar -->
                <div
                  class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                >
                  <div class="flex items-center space-x-3">
                    <Icon name="ph:image" class="w-5 h-5 text-gray-600" />
                    <span class="text-sm font-medium text-gray-900"
                      >Laporan Gambar</span
                    >
                  </div>
                  <rs-button
                    size="sm"
                    variant="primary-outline"
                    @click="viewLaporanGambar"
                  >
                    <Icon name="ph:eye" class="w-4 h-4 mr-1" />
                    Lihat Laporan
                  </rs-button>
                </div>

                <!-- Laporan Teknikal -->
                <div
                  class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                >
                  <div class="flex items-center space-x-3">
                    <Icon name="ph:gear" class="w-5 h-5 text-gray-600" />
                    <span class="text-sm font-medium text-gray-900"
                      >Laporan Teknikal</span
                    >
                  </div>
                  <rs-button
                    size="sm"
                    variant="primary-outline"
                    @click="viewLaporanTeknikal"
                  >
                    <Icon name="ph:eye" class="w-4 h-4 mr-1" />
                    Lihat Laporan
                  </rs-button>
                </div>

                <!-- Catatan Pengesyoran ETD -->
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">
                    Catatan Pengesyoran ETD
                  </label>
                  <div class="p-3 bg-gray-50 rounded-lg border">
                    <p class="text-sm text-gray-900">
                      {{ dokumenData.catatanPengesyoranETD || "Tiada catatan" }}
                    </p>
                  </div>
                </div>

                <!-- Catatan Sokongan Hartanah -->
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">
                    Catatan Sokongan Hartanah
                  </label>
                  <div class="p-3 bg-gray-50 rounded-lg border">
                    <p class="text-sm text-gray-900">
                      {{
                        dokumenData.catatanSokonganHartanah || "Tiada catatan"
                      }}
                    </p>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>

          <!-- Section 5: Status & Log -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon
                      name="ph:clock-clockwise"
                      class="w-6 h-6 text-gray-600"
                    />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Status & Log
                  </h2>
                  <p class="text-sm text-gray-500">
                    Rekod aktiviti dan audit trail
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="space-y-6">
                <!-- Status Information -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700">
                      Masa / Tarikh Kelulusan
                    </label>
                    <div class="p-3 bg-gray-50 rounded-lg border">
                      <span class="text-sm text-gray-900">
                        {{ logData.tarikhKelulusan || "-" }}
                      </span>
                    </div>
                  </div>

                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700">
                      Nama Penyemak / Pelulus
                    </label>
                    <div class="p-3 bg-gray-50 rounded-lg border">
                      <span class="text-sm text-gray-900">
                        {{ logData.namaPelulus || "-" }}
                      </span>
                    </div>
                  </div>

                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700">
                      Status Semasa
                    </label>
                    <div class="p-3 bg-gray-50 rounded-lg border">
                      <rs-badge
                        :variant="getStatusVariant(logData.statusSemasa)"
                        class="text-sm"
                      >
                        {{ getStatusText(logData.statusSemasa) }}
                      </rs-badge>
                    </div>
                  </div>
                </div>

                <!-- Audit Log -->
                <div class="space-y-3">
                  <h3 class="text-sm font-medium text-gray-700">Log Audit</h3>
                  <div class="space-y-2 max-h-64 overflow-y-auto">
                    <div
                      v-for="(log, index) in auditLogs"
                      :key="index"
                      class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border"
                    >
                      <div class="flex-shrink-0 mt-1">
                        <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between">
                          <p class="text-sm font-medium text-gray-900">
                            {{ log.aktiviti }}
                          </p>
                          <p class="text-xs text-gray-500">
                            {{ log.tarikh }}
                          </p>
                        </div>
                        <p class="text-sm text-gray-600 mt-1">
                          {{ log.keterangan }}
                        </p>
                        <p class="text-xs text-gray-500 mt-1">
                          Oleh: {{ log.pengguna }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>
        </div>

        <!-- Sidebar - Section 3: Keputusan Kelulusan / Tindakan -->
        <div class="lg:col-span-1 space-y-6">
          <rs-card class="shadow-sm border-0 bg-white sticky top-6">
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
                    Keputusan Kelulusan
                  </h2>
                  <p class="text-sm text-gray-500">Buat keputusan kelulusan</p>
                </div>
              </div>
            </template>

            <template #body>
              <FormKit
                type="form"
                :actions="false"
                @submit="handleSubmit"
                v-model="keputusanData"
              >
                <div class="space-y-6">
                  <!-- Keputusan Kelulusan -->
                  <FormKit
                    type="select"
                    name="keputusanKelulusan"
                    label="Keputusan Kelulusan"
                    :options="keputusanOptions"
                    placeholder="Pilih keputusan"
                    v-model="keputusanData.keputusanKelulusan"
                    validation="required"
                    @input="handleKeputusanChange"
                  />

                  <!-- Catatan Kelulusan / Alasan Tolak -->
                  <FormKit
                    type="textarea"
                    name="catatanKelulusan"
                    :label="getCatatanLabel"
                    :placeholder="getCatatanPlaceholder"
                    rows="4"
                    v-model="keputusanData.catatanKelulusan"
                    :validation="isCatatanRequired ? 'required' : ''"
                    :help="getCatatanHelp"
                  />

                  <!-- Section 4: Action Buttons -->
                  <div class="space-y-3 pt-4 border-t">
                    <rs-button
                      variant="primary"
                      @click="handleSimpan"
                      :disabled="processing"
                      :loading="processing"
                      class="w-full !py-3 text-sm font-medium"
                    >
                      <Icon name="ph:floppy-disk" class="w-5 h-5 mr-2" />
                      Simpan
                    </rs-button>

                    <rs-button
                      variant="secondary-outline"
                      @click="handleBatal"
                      class="w-full !py-3 text-sm font-medium"
                    >
                      <Icon name="ph:x" class="w-5 h-5 mr-2" />
                      Batal
                    </rs-button>
                  </div>
                </div>
              </FormKit>
            </template>
          </rs-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const processing = ref(false);

definePageMeta({
  title: "Semakan Kelulusan Permohonan",
});

const breadcrumb = ref([
  {
    name: "Permohonan Bantuan",
    type: "link",
    path: "/BF-BTN/permohonan/senarai",
  },
  {
    name: "Semakan Kelulusan",
    type: "link",
    path: "/BF-BTN/permohonan/senarai-semakan-kelulusan",
  },
  {
    name: "Keputusan Kelulusan",
    type: "current",
    path: `/BF-BTN/permohonan/senarai-semakan-kelulusan/${route.params.id}`,
  },
]);

// Section 1: Maklumat Permohonan data
const formData = ref({
  idPermohonan: "",
  namaPemohon: "",
  jenisBantuan: "",
  statusPermohonan: "",
});

// Section 2: Dokumen & Catatan data
const dokumenData = ref({
  catatanPengesyoranETD: "",
  catatanSokonganHartanah: "",
});

// Section 3: Keputusan data
const keputusanData = ref({
  keputusanKelulusan: "",
  catatanKelulusan: "",
});

// Section 5: Status & Log data
const logData = ref({
  tarikhKelulusan: "",
  namaPelulus: "",
  statusSemasa: "",
});

const auditLogs = ref([]);

// Dropdown options
const keputusanOptions = ref([
  { label: "Lulus", value: "lulus" },
  { label: "Tolak", value: "tolak" },
  { label: "Tindakan Lanjut", value: "tindakan_lanjut" },
]);

// Computed properties
const isCatatanRequired = computed(() => {
  return (
    keputusanData.value.keputusanKelulusan === "tolak" ||
    keputusanData.value.keputusanKelulusan === "tindakan_lanjut"
  );
});

const getCatatanLabel = computed(() => {
  switch (keputusanData.value.keputusanKelulusan) {
    case "tolak":
      return "Alasan Tolak *";
    case "tindakan_lanjut":
      return "Catatan Tindakan Lanjut *";
    default:
      return "Catatan Kelulusan";
  }
});

const getCatatanPlaceholder = computed(() => {
  switch (keputusanData.value.keputusanKelulusan) {
    case "tolak":
      return "Masukkan alasan penolakan...";
    case "tindakan_lanjut":
      return "Masukkan catatan tindakan lanjut yang diperlukan...";
    default:
      return "Masukkan catatan kelulusan (pilihan)...";
  }
});

const getCatatanHelp = computed(() => {
  switch (keputusanData.value.keputusanKelulusan) {
    case "tolak":
      return "Wajib diisi - Nyatakan sebab penolakan";
    case "tindakan_lanjut":
      return "Wajib diisi - Nyatakan tindakan lanjut yang diperlukan";
    case "lulus":
      return "Pilihan - Catatan tambahan untuk kelulusan";
    default:
      return "";
  }
});

// Methods
const getStatusVariant = (status) => {
  const variants = {
    menunggu_kelulusan: "warning",
    lulus: "success",
    ditolak: "danger",
    tangguh: "info",
  };
  return variants[status?.toLowerCase()] || "default";
};

const getStatusText = (status) => {
  const statusMap = {
    menunggu_kelulusan: "Menunggu Kelulusan",
    lulus: "Lulus",
    ditolak: "Ditolak",
    tangguh: "Tangguh",
  };
  return statusMap[status?.toLowerCase()] || status;
};

const handleKeputusanChange = () => {
  // Clear catatan when changing decision type
  if (keputusanData.value.keputusanKelulusan === "lulus") {
    // Keep existing catatan for 'lulus'
  } else {
    // Clear catatan for new requirement
    keputusanData.value.catatanKelulusan = "";
  }
};

const viewBQ = () => {
  // Navigate to BQ page
  router.push(
    `/BF-BTN/permohonan/senarai-semakan-kelulusan/${route.params.id}/bq`
  );
};

const viewLaporanGambar = () => {
  // Navigate to Laporan Gambar page
  router.push(
    `/BF-BTN/permohonan/senarai-semakan-kelulusan/${route.params.id}/laporan-gambar`
  );
};

const viewLaporanTeknikal = () => {
  // Navigate to Laporan Teknikal page
  router.push(
    `/BF-BTN/permohonan/senarai-semakan-kelulusan/${route.params.id}/laporan-teknikal`
  );
};

const handleSimpan = async () => {
  try {
    processing.value = true;

    // Validate catatan requirement
    if (
      isCatatanRequired.value &&
      !keputusanData.value.catatanKelulusan.trim()
    ) {
      toast.error("Catatan wajib diisi untuk keputusan yang dipilih");
      return;
    }

    // Prepare data for API
    const payload = {
      ...keputusanData.value,
      idPermohonan: route.params.id,
      tarikhKeputusan: new Date().toISOString(),
    };

    // Implement API call to save decision
    console.log("Saving decision:", payload);

    // Update status based on decision
    let newStatus = "";
    switch (keputusanData.value.keputusanKelulusan) {
      case "lulus":
        newStatus = "lulus";
        break;
      case "tolak":
        newStatus = "ditolak";
        break;
      case "tindakan_lanjut":
        newStatus = "tangguh";
        break;
    }

    // Insert audit trail
    const auditEntry = {
      aktiviti: `Keputusan Kelulusan: ${keputusanData.value.keputusanKelulusan}`,
      keterangan:
        keputusanData.value.catatanKelulusan || "Tiada catatan tambahan",
      pengguna: "Admin User", // Get from auth
      tarikh: new Date().toLocaleString("ms-MY"),
    };

    auditLogs.value.unshift(auditEntry);

    toast.success("Keputusan kelulusan telah disimpan");

    // Navigate back to list after successful save
    router.push("/BF-BTN/permohonan/senarai-semakan-kelulusan");
  } catch (error) {
    toast.error("Ralat semasa menyimpan keputusan");
    console.error(error);
  } finally {
    processing.value = false;
  }
};

const handleBatal = () => {
  router.push("/BF-BTN/permohonan/senarai-semakan-kelulusan");
};

// Fetch application data on mount
onMounted(async () => {
  try {
    // Implement API call to fetch application data
    // This is mock data for now
    formData.value = {
      idPermohonan: route.params.id,
      namaPemohon: "Ahmad bin Abdullah / Syarikat ABC Sdn Bhd",
      jenisBantuan: "Bantuan Infrastruktur",
      statusPermohonan: "menunggu_kelulusan",
    };

    dokumenData.value = {
      catatanPengesyoranETD:
        "Projek ini memenuhi kriteria teknikal dan disyorkan untuk kelulusan. Anggaran kos adalah munasabah berdasarkan harga pasaran semasa.",
      catatanSokonganHartanah:
        "Tapak projek sesuai untuk pembangunan infrastruktur. Tiada isu berkaitan hak milik tanah atau sekatan undang-undang.",
    };

    logData.value = {
      tarikhKelulusan: "",
      namaPelulus: "",
      statusSemasa: "menunggu_kelulusan",
    };

    // Mock audit logs
    auditLogs.value = [
      {
        aktiviti: "Permohonan Diserahkan untuk Kelulusan",
        keterangan:
          "Permohonan telah melalui semua peringkat semakan dan siap untuk keputusan kelulusan",
        pengguna: "Pegawai Teknikal",
        tarikh: "15 Nov 2024, 10:30 AM",
      },
      {
        aktiviti: "Siasatan Lapangan Selesai",
        keterangan:
          "Siasatan lapangan telah dilakukan dan laporan teknikal telah disediakan",
        pengguna: "Pegawai Lapangan",
        tarikh: "12 Nov 2024, 2:15 PM",
      },
      {
        aktiviti: "Dokumen Lengkap",
        keterangan:
          "Semua dokumen sokongan telah diterima dan disahkan lengkap",
        pengguna: "Pegawai Semakan",
        tarikh: "8 Nov 2024, 9:45 AM",
      },
    ];
  } catch (error) {
    toast.error("Ralat semasa memuatkan data permohonan");
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

// Audit log styling
.max-h-64 {
  max-height: 16rem;
}

// Document card styling
.border-gray-200 {
  border-color: #e5e7eb;
}

.bg-gray-50 {
  background-color: #f9fafb;
}
</style>
