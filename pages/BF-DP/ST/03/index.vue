<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Status Permohonan</h2>
          <rs-button
            variant="primary-outline"
            @click="navigateTo('/BF-DP/ST/02')"
          >
            <Icon name="heroicons:arrow-left" class="mr-2" size="15" />
            Kembali
          </rs-button>
        </div>
      </template>

      <template #body>
        <!-- Application Summary -->
        <div class="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 class="text-lg font-medium mb-4">Ringkasan Permohonan</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600">No. Rujukan</p>
              <p class="font-medium">{{ applicationDetails.noRujukan }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Tarikh Permohonan</p>
              <p class="font-medium">
                {{ formatDate(applicationDetails.tarikhPermohonan) }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Jenis Permohonan</p>
              <p class="font-medium">{{ applicationDetails.jenisBantuan }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Status Semasa</p>
              <rs-badge :variant="getStatusVariant(applicationDetails.status)">
                {{ applicationDetails.status }}
              </rs-badge>
            </div>
          </div>
        </div>

        <!-- Status Timeline -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium">Sejarah Status</h3>

            <!-- Timeline Scenario -->
            <div class="flex items-center gap-2">
              <FormKit
                v-model="selectedTimelineScenario"
                type="select"
                :options="timelineScenarios"
                :classes="{
                  wrapper: '!w-48 flex items-center',
                  input: '!h-9 !px-3 !text-sm !flex !items-center',
                  select: '!flex !items-center'
                }"
              />
              <rs-button
                variant="primary"
                @click="updateTimeline"
                size="sm"
                class="!h-9 !px-4 !text-sm"
              >
                <Icon name="mdi:refresh" class="mr-1" size="15" />
                Tukar Timeline Status
              </rs-button>
            </div>
          </div>
          <div class="relative">
            <!-- Timeline Line -->
            <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            <div class="space-y-8">
              <div
                v-for="(status, index) in statusTimeline"
                :key="index"
                class="relative flex items-start"
              >
                <!-- Timeline Dot -->
                <div
                  class="relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                  :class="[
                    status.completed
                      ? 'bg-green-500'
                      : status.inProgress
                      ? 'bg-blue-500'
                      : status.rejected
                      ? 'bg-red-500'
                      : 'bg-gray-300',
                  ]"
                >
                  <Icon
                    v-if="status.completed"
                    name="mdi:check"
                    class="text-white"
                  />
                  <Icon
                    v-else-if="status.rejected"
                    name="mdi:close"
                    class="text-white"
                  />
                  <Icon
                    v-else-if="status.inProgress"
                    name="mdi:clock-outline"
                    class="text-white"
                  />
                  <span v-else class="text-white">{{ index + 1 }}</span>
                </div>

                <!-- Timeline Content -->
                <div class="ml-4 flex-1">
                  <div class="flex items-center justify-between">
                    <div>
                      <h4
                        class="text-base font-medium"
                        :class="{
                          'text-green-600': status.completed,
                          'text-blue-600': status.inProgress,
                          'text-red-600': status.rejected,
                          'text-gray-600':
                            !status.completed &&
                            !status.inProgress &&
                            !status.rejected,
                        }"
                      >
                        {{ status.title }}
                      </h4>
                      <p class="text-sm text-gray-500 mt-1">
                        {{ formatDate(status.date) }}
                      </p>
                    </div>
                    <rs-badge
                      v-if="status.status"
                      :variant="getStatusVariant(status.status)"
                    >
                      {{ status.status }}
                    </rs-badge>
                  </div>

                  <!-- Officer Info -->
                  <div class="mt-2 flex items-center text-sm text-gray-600">
                    <Icon name="mdi:account" class="mr-1" />
                    <span>{{ status.officer || "Belum Ditugaskan" }}</span>
                  </div>

                  <!-- Notes -->
                  <div
                    v-if="status.notes"
                    class="mt-2 p-3 bg-gray-50 rounded-lg"
                  >
                    <p class="text-sm text-gray-700">{{ status.notes }}</p>
                  </div>

                  <!-- Additional Details -->
                  <div v-if="status.details" class="mt-2">
                    <div
                      v-for="(detail, key) in status.details"
                      :key="key"
                      class="text-sm text-gray-600"
                    >
                      <span class="font-medium">{{ key }}:</span> {{ detail }}
                    </div>
                  </div>

                  <!-- Duration -->
                  <div
                    v-if="status.duration"
                    class="mt-2 text-sm text-gray-500"
                  >
                    <Icon name="mdi:clock-outline" class="mr-1" />
                    Tempoh: {{ status.duration }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Documents Section -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-4">Dokumen Berkaitan</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="(doc, index) in documents"
              :key="index"
              class="p-4 border rounded-lg"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium">{{ doc.name }}</p>
                  <p class="text-sm text-gray-500">{{ doc.type }}</p>
                </div>
                <rs-button
                  variant="primary-outline"
                  size="sm"
                  @click="downloadDocument(doc)"
                >
                  <Icon name="mdi:download" class="mr-1" />
                  Muat Turun
                </rs-button>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Information -->
        <div v-if="applicationDetails.additionalInfo" class="mb-6">
          <h3 class="text-lg font-medium mb-4">Maklumat Tambahan</h3>
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-gray-700">{{ applicationDetails.additionalInfo }}</p>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

definePageMeta({
  title: "Status Permohonan",
});

const route = useRoute();
const breadcrumb = ref([
  {
    name: "Status Tracking",
    type: "link",
    path: "/BF-DP/ST/02",
  },
  {
    name: "Status Permohonan",
    type: "current",
    path: "/BF-DP/ST/03",
  },
]);

// Mock data - Replace with actual API calls
const applicationDetails = ref({
  noRujukan: "APP-001",
  tarikhPermohonan: "2024-03-15",
  jenisBantuan: "Bantuan Kewangan",
  status: "Menunggu Siasatan",
  additionalInfo:
    "Permohonan sedang dalam proses siasatan oleh pegawai yang berkenaan.",
});

const selectedTimelineScenario = ref("default");

const timelineScenarios = [
  { label: "Status Default", value: "default" },
  { label: "Status Lengkap", value: "complete" },
  { label: "Status Ditolak", value: "rejected" },
  { label: "Status Dalam Proses", value: "in_progress" },
  { label: "Status Menunggu", value: "pending" },
];

const timelineScenariosData = {
  default: [
    {
      title: "Permohonan Dihantar",
      date: "2024-03-15",
      officer: "Ahmad bin Abdullah",
      completed: true,
      status: "Selesai",
      notes: "Permohonan berjaya dihantar melalui sistem online",
      details: {
        Kaedah: "Online",
        Masa: "10:30 AM",
      },
      duration: "2 jam",
    },
    {
      title: "Semakan Awal",
      date: "2024-03-16",
      officer: "Siti binti Ali",
      completed: true,
      status: "Lulus",
      notes: "Dokumen lengkap dan sah",
      details: {
        "Jenis Semakan": "Dokumen",
        Keputusan: "Lengkap",
      },
      duration: "1 hari",
    },
    {
      title: "Siasatan",
      date: "2024-03-17",
      officer: "Mohd bin Ismail",
      inProgress: true,
      status: "Dalam Proses",
      notes: "Dalam proses siasatan dan pengesahan maklumat",
      details: {
        "Jenis Siasatan": "Tapak",
        Lokasi: "Kuala Lumpur",
      },
      duration: "Sedang Berjalan",
    },
    {
      title: "Kelulusan",
      date: null,
      officer: null,
      status: "Menunggu",
      notes: "Menunggu keputusan kelulusan",
      details: {
        "Jenis Kelulusan": "Kewangan",
        Jumlah: "RM 1,000.00",
      },
    },
  ],
  complete: [
    {
      title: "Permohonan Dihantar",
      date: "2024-03-15",
      officer: "Ahmad bin Abdullah",
      completed: true,
      status: "Selesai",
      notes: "Permohonan berjaya dihantar melalui sistem online",
      details: {
        Kaedah: "Online",
        Masa: "10:30 AM",
      },
      duration: "2 jam",
    },
    {
      title: "Semakan Awal",
      date: "2024-03-16",
      officer: "Siti binti Ali",
      completed: true,
      status: "Lulus",
      notes: "Dokumen lengkap dan sah",
      details: {
        "Jenis Semakan": "Dokumen",
        Keputusan: "Lengkap",
      },
      duration: "1 hari",
    },
    {
      title: "Siasatan",
      date: "2024-03-17",
      officer: "Mohd bin Ismail",
      completed: true,
      status: "Lulus",
      notes: "Siasatan selesai dan maklumat disahkan",
      details: {
        "Jenis Siasatan": "Tapak",
        Lokasi: "Kuala Lumpur",
      },
      duration: "2 hari",
    },
    {
      title: "Kelulusan",
      date: "2024-03-19",
      officer: "Dr. Zulkifli bin Ahmad",
      completed: true,
      status: "Lulus",
      notes: "Permohonan diluluskan",
      details: {
        "Jenis Kelulusan": "Kewangan",
        Jumlah: "RM 1,000.00",
      },
      duration: "1 hari",
    },
  ],
  rejected: [
    {
      title: "Permohonan Dihantar",
      date: "2024-03-15",
      officer: "Ahmad bin Abdullah",
      completed: true,
      status: "Selesai",
      notes: "Permohonan berjaya dihantar melalui sistem online",
      details: {
        Kaedah: "Online",
        Masa: "10:30 AM",
      },
      duration: "2 jam",
    },
    {
      title: "Semakan Awal",
      date: "2024-03-16",
      officer: "Siti binti Ali",
      completed: true,
      status: "Lulus",
      notes: "Dokumen lengkap dan sah",
      details: {
        "Jenis Semakan": "Dokumen",
        Keputusan: "Lengkap",
      },
      duration: "1 hari",
    },
    {
      title: "Siasatan",
      date: "2024-03-17",
      officer: "Mohd bin Ismail",
      completed: true,
      status: "Tidak Lulus",
      notes: "Maklumat tidak tepat dan tidak memenuhi syarat",
      details: {
        "Jenis Siasatan": "Tapak",
        Lokasi: "Kuala Lumpur",
        Alasan: "Dokumen tidak lengkap dan maklumat tidak tepat",
      },
      duration: "2 hari",
    },
  ],
  in_progress: [
    {
      title: "Permohonan Dihantar",
      date: "2024-03-15",
      officer: "Ahmad bin Abdullah",
      completed: true,
      status: "Selesai",
      notes: "Permohonan berjaya dihantar melalui sistem online",
      details: {
        Kaedah: "Online",
        Masa: "10:30 AM",
      },
      duration: "2 jam",
    },
    {
      title: "Semakan Awal",
      date: "2024-03-16",
      officer: "Siti binti Ali",
      completed: true,
      status: "Lulus",
      notes: "Dokumen lengkap dan sah",
      details: {
        "Jenis Semakan": "Dokumen",
        Keputusan: "Lengkap",
      },
      duration: "1 hari",
    },
    {
      title: "Siasatan",
      date: "2024-03-17",
      officer: "Mohd bin Ismail",
      inProgress: true,
      status: "Dalam Proses",
      notes: "Dalam proses siasatan dan pengesahan maklumat",
      details: {
        "Jenis Siasatan": "Tapak",
        Lokasi: "Kuala Lumpur",
      },
      duration: "Sedang Berjalan",
    },
  ],
  pending: [
    {
      title: "Permohonan Dihantar",
      date: "2024-03-15",
      officer: "Ahmad bin Abdullah",
      completed: true,
      status: "Selesai",
      notes: "Permohonan berjaya dihantar melalui sistem online",
      details: {
        Kaedah: "Online",
        Masa: "10:30 AM",
      },
      duration: "2 jam",
    },
    {
      title: "Semakan Awal",
      date: null,
      officer: null,
      status: "Menunggu",
      notes: "Menunggu untuk semakan awal",
      details: {
        "Jenis Semakan": "Dokumen",
      },
    },
  ],
};

const updateTimeline = () => {
  statusTimeline.value = timelineScenariosData[selectedTimelineScenario.value];
};

const statusTimeline = ref(timelineScenariosData.default);

const documents = ref([
  {
    name: "Borang Permohonan",
    type: "PDF",
    url: "#",
  },
  {
    name: "Salinan Kad Pengenalan",
    type: "JPG",
    url: "#",
  },
  {
    name: "Slip Gaji",
    type: "PDF",
    url: "#",
  },
]);

// Methods
const formatDate = (dateString) => {
  if (!dateString) return "-";
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("ms-MY", options);
};

const getStatusVariant = (status) => {
  const variants = {
    "Menunggu Siasatan": "warning",
    "Dalam Proses": "warning",
    Menunggu: "warning",
    Disemak: "info",
    Lulus: "success",
    Selesai: "success",
    "Tidak Lulus": "danger",
    Diterima: "success",
    Dibatalkan: "danger",
  };
  return variants[status] || "default";
};

const downloadDocument = (doc) => {
  // Implement document download logic
  console.log("Downloading document:", doc);
};

onMounted(() => {
  // Fetch application details using route.params.id
  // This is where you would make the actual API call
  console.log("Application ID:", route.params.id);
  statusTimeline.value = timelineScenariosData.default;
});
</script>
