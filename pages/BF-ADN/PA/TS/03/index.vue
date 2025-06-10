<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card>
      <template #header>
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold">Audit Trail</h1>
          <rs-badge :variant="getStatusVariant(aduanData.status)" size="lg">
            {{ aduanData.status }}
          </rs-badge>
        </div>
      </template>

      <template #body>
        <div class="space-y-8">
          <!-- Maklumat Aduan -->
          <div class="bg-white p-6 rounded-lg border border-gray-200">
            <h2 class="text-lg font-semibold mb-4">Maklumat Aduan</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p class="text-sm text-gray-500">No. Aduan</p>
                <p class="font-medium">{{ aduanData.noAduan }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Tarikh Aduan</p>
                <p class="font-medium">{{ formatDate(aduanData.tarikhAduan) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Nama Aduan</p>
                <p class="font-medium">{{ aduanData.namaAduan }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Pernyataan Masalah</p>
                <rs-badge
                  :variant="getPernyataanMasalahVariant(aduanData.pernyataanMasalah)"
                  size="sm"
                >
                  {{ aduanData.pernyataanMasalah }}
                </rs-badge>
              </div>
            </div>
          </div>

          <!-- Audit Trail -->
          <div class="bg-white p-6 rounded-lg border border-gray-200">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-lg font-semibold">Sejarah Audit</h2>
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-500">Status Semasa:</span>
                <rs-badge :variant="getStatusVariant(aduanData.status)" size="sm">
                  {{ aduanData.status }}
                </rs-badge>
              </div>
            </div>

            <!-- Process Steps -->
            <div class="mb-8">
              <h3 class="text-md font-medium text-gray-700 mb-4">Langkah-langkah Proses</h3>
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div
                  v-for="(step, index) in processSteps"
                  :key="index"
                  class="flex items-center gap-3 p-3 rounded-lg"
                  :class="getStepClass(step.status)"
                >
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center"
                    :class="getStepIconClass(step.status)"
                  >
                    <i :class="getStepIcon(step.status)"></i>
                  </div>
                  <div>
                    <p class="font-medium text-sm">{{ step.title }}</p>
                    <p class="text-xs text-gray-500">{{ step.description }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-6">
              <div
                v-for="(audit, index) in auditTrail"
                :key="index"
                class="relative pl-8 pb-6 last:pb-0"
              >
                <!-- Timeline connector -->
                <div
                  v-if="index !== auditTrail.length - 1"
                  class="absolute left-3 top-3 bottom-0 w-0.5 bg-gray-200"
                ></div>

                <!-- Timeline dot -->
                <div
                  class="absolute left-0 top-3 w-6 h-6 rounded-full border-2 flex items-center justify-center"
                  :class="getAuditDotClass(audit.type)"
                >
                  <i
                    class="text-sm"
                    :class="getAuditIcon(audit.type)"
                  ></i>
                </div>

                <!-- Content -->
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="flex justify-between items-start mb-2">
                    <h3 class="font-medium text-gray-900">
                      {{ audit.title }}
                    </h3>
                    <span class="text-sm text-gray-500">
                      {{ formatDateTime(audit.timestamp) }}
                    </span>
                  </div>
                  <p class="text-gray-600 text-sm mb-2">{{ audit.description }}</p>
                  <div v-if="audit.details" class="mt-2 text-sm">
                    <div
                      v-for="(detail, key) in audit.details"
                      :key="key"
                      class="flex gap-2"
                    >
                      <span class="text-gray-500">{{ key }}:</span>
                      <span class="text-gray-700">{{ detail }}</span>
                    </div>
                  </div>
                  <div class="mt-2 text-sm text-gray-500">
                    Oleh: {{ audit.user }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

definePageMeta({
  title: "Audit Trail",
});

const breadcrumb = ref([
  {
    name: "Pengurusan Aduan",
    type: "link",
    path: "/BF-ADN/PA/TS/01",
  },
  {
    name: "Audit Trail",
    type: "current",
    path: "/BF-ADN/PA/TS/03",
  },
]);

// Sample data - In real application, this would come from an API
const aduanData = ref({
  noAduan: "ADN-2024-001",
  namaAduan: "Aduan Keselamatan",
  pernyataanMasalah: "Terputus Bekalan Makanan/Tiada Tempat Tinggal (Kelas 1/Merah)",
  tarikhAduan: "2024-03-15",
  status: "Sedang Diproses",
});

const auditTrail = ref([
  {
    type: "create",
    title: "Aduan Dibuat",
    description: "Aduan baru telah dibuat",
    timestamp: "2024-03-15T09:00:00",
    user: "Sistem",
    details: {
      "No. Aduan": "ADN-2024-001",
      "Status": "Belum Selesai",
    },
  },
  {
    type: "assign",
    title: "Aduan Diambil",
    description: "Aduan telah diambil untuk diproses",
    timestamp: "2024-03-15T10:30:00",
    user: "Ahmad bin Abdullah",
    details: {
      "Status": "Sedang Diproses",
    },
  },
  {
    type: "verify",
    title: "Siasatan Ringkas",
    description: "Siasatan ringkas telah dilakukan",
    timestamp: "2024-03-15T11:45:00",
    user: "Ahmad bin Abdullah",
    details: {
      "Verifikasi": "Maklumat Sah",
      "Tahap Keperluan": "Kekal (Kelas 1/Merah)",
    },
  },
]);

const processSteps = ref([
  {
    title: "Aduan Dibuat",
    description: "Aduan baru telah dibuat",
    status: "completed",
  },
  {
    title: "Aduan Diambil",
    description: "Aduan telah diambil untuk diproses",
    status: "completed",
  },
  {
    title: "Siasatan Ringkas",
    description: "Siasatan ringkas telah dilakukan",
    status: "completed",
  },
  {
    title: "Selesai",
    description: "Aduan telah ditandakan sebagai selesai",
    status: "pending",
  },
]);

const getStatusVariant = (status) => {
  const variants = {
    "Belum Selesai": "warning",
    "Sedang Diproses": "info",
    "Selesai": "success",
  };
  return variants[status] || "default";
};

const getPernyataanMasalahVariant = (pernyataan) => {
  if (pernyataan.includes("Kelas 1/Merah")) return "danger";
  if (pernyataan.includes("Kelas 2/Kuning")) return "warning";
  if (pernyataan.includes("Kelas 3/Hijau")) return "success";
  return "default";
};

const getAuditDotClass = (type) => {
  const classes = {
    create: "border-blue-500 bg-blue-50",
    assign: "border-purple-500 bg-purple-50",
    verify: "border-green-500 bg-green-50",
    update: "border-yellow-500 bg-yellow-50",
    complete: "border-gray-500 bg-gray-50",
  };
  return classes[type] || "border-gray-500 bg-gray-50";
};

const getAuditIcon = (type) => {
  const icons = {
    create: "i-heroicons-document-plus",
    assign: "i-heroicons-user-plus",
    verify: "i-heroicons-clipboard-document-check",
    update: "i-heroicons-pencil-square",
    complete: "i-heroicons-check-circle",
  };
  return icons[type] || "i-heroicons-information-circle";
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("ms-MY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatDateTime = (dateTime) => {
  return new Date(dateTime).toLocaleString("ms-MY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStepClass = (status) => {
  const classes = {
    completed: "bg-green-50 border border-green-100",
    current: "bg-blue-50 border border-blue-100",
    pending: "bg-gray-50 border border-gray-100",
  };
  return classes[status] || classes.pending;
};

const getStepIconClass = (status) => {
  const classes = {
    completed: "bg-green-100 text-green-600",
    current: "bg-blue-100 text-blue-600",
    pending: "bg-gray-100 text-gray-400",
  };
  return classes[status] || classes.pending;
};

const getStepIcon = (status) => {
  const icons = {
    completed: "i-heroicons-check-circle",
    current: "i-heroicons-clock",
    pending: "i-heroicons-clock",
  };
  return icons[status] || icons.pending;
};
</script>

<style lang="scss" scoped></style>
