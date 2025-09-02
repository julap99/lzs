<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Role Simulator - For Demo/Presentation Only -->
    <!-- This allows switching between different user roles to demonstrate role-based views -->
    <!-- In production, this would be replaced with actual user authentication and role management -->
    <div class="mb-4 flex items-center space-x-4">
      <label class="font-medium text-gray-700">Pilih Role:</label>
      <select v-model="selectedRole" class="border rounded p-1">
        <option value="pengguna-luar">Pengguna Luar</option>
        <option value="pengguna-dalam">Pengguna Dalam</option>
      </select>
    </div>

    <!-- Section 1: Maklumat Permohonan Aduan -->
    <rs-card class="mb-6">
      <template #header>Maklumat Permohonan Aduan</template>
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <rs-card variant="secondary">
            <div class="p-2">
              <div class="text-sm text-gray-500">ID Permohonan Aduan</div>
              <div class="font-bold">{{ AduanInfo.idPermohonan }}</div>
            </div>
          </rs-card>
          <rs-card variant="secondary">
            <div class="p-2">
              <div class="text-sm text-gray-500">Nama Aduan</div>
              <div class="font-bold">{{ AduanInfo.namaAduan }}</div>
            </div>
          </rs-card>
          <rs-card variant="secondary">
            <div class="p-2">
              <div class="text-sm text-gray-500">Tarikh Permohonan</div>
              <div class="font-bold">{{ formatDate(AduanInfo.tarikhMohon) }}</div>
            </div>
          </rs-card>
        </div>
      </template>
    </rs-card>
    <rs-card class="mb-6">
      <!-- Section 2: Maklumat Tindakan & Status -->
      <template #header>Maklumat Tindakan & Status</template>
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <rs-card variant="secondary">
            <div class="p-2 flex flex-col">
              <div class="text-sm text-gray-500">Status Semasa</div>
              <rs-badge variant="info" size="sm">
                Dalam Proses - Siasatan Ringkas
              </rs-badge>
            </div>
          </rs-card>
          <rs-card variant="secondary">
            <div class="p-2">
              <div class="text-sm text-gray-500">Tarikh Setiap Perubahan Status </div>
              <div class="font-bold">{{ formatDate(AduanInfo.tarikhPerubahanStatus) }}</div>
            </div>
          </rs-card>
          <rs-card variant="secondary">
            <div class="p-2">
              <div class="text-sm text-gray-500">Nama & Peranan Pegawai / Unit </div>
              <div class="font-bold">{{ AduanInfo.namaPegawai }}</div>
            </div>
          </rs-card>
        </div>
      </template>
    </rs-card>

    <!-- Review History - Only visible to Pengguna Dalam -->
    <rs-card v-if="canViewSejarahSemakan">
      <template #header>Sejarah Semakan</template>
      <template #body>
        <div class="relative">
          <!-- Timeline Line -->
          <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          <div class="space-y-8">
            <div
              v-for="(step, index) in statusTimeline"
              :key="index"
              class="relative flex items-start"
            >
              <!-- Timeline Dot -->
              <div
                class="relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                :class="[
                  step.completed
                    ? 'bg-green-500'
                    : step.inProgress
                    ? 'bg-blue-500'
                    : 'bg-gray-300',
                ]"
              >
                <Icon
                  v-if="step.completed"
                  name="mdi:check"
                  class="text-white"
                />
                <Icon
                  v-else-if="step.inProgress"
                  name="mdi:clock-outline"
                  class="text-white"
                />
                <span v-else class="text-white">{{ index + 1 }}</span>
              </div>

              <!-- Content -->
              <div class="ml-4 flex-1">
                <div class="text-sm text-gray-500">
                  {{ formatDate(step.tarikh) }}
                </div>
                <div :class="getTextClass(step.label)" class="font-bold">
                  {{ step.label }}
                </div>
                <div class="text-sm mt-1">
                  SLA: {{ slaRules[step.label] }} jam |
                  <span :class="calculateSlaStatus(step.label, step.tarikh) === 'Terlewat' ? 'text-red-600' : 'text-green-600'">
                    {{ calculateSlaStatus(step.label, step.tarikh) }}
                  </span>
                  <span v-if="step.masaBerbaki">| Berbaki: {{ step.masaBerbaki }}</span>
                </div>
                <div class="text-sm mt-1 italic text-gray-700" v-if="step.catatan">
                  "{{ step.catatan }}"
                </div>
                <div class="text-sm mt-1 text-gray-600">Pegawai: {{ step.namaPegawai }}</div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>



    <!-- Documents Section -->
    <rs-card class="mb-6">
        <template #header>Dokumen Berkaitan</template>
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  Lihat
                </rs-button>
              </div>
            </div>
          </div>
        </template>
    </rs-card>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const breadcrumb = ref([
  { name: 'Semak Status', type: 'link', path: '/BF-DP/Portal/' },
  { name: 'Senarai Aduan', type: 'link', path: '/BF-DP/Portal/Aduan' },
  { name: 'Status Tracking Aduan', type: 'current', path: '/BF-DP/Portal/Aduan/detail' },
]);

const AduanInfo = ref({
  idPermohonan: 'ADN-250823-000123',
  namaAduan: 'Terputus Bekalan Makanan / Tiada Tempat Tinggal',
  tarikhMohon: '01-06-2025',
  tarikhPerubahanStatus: '15-06-2025',
  namaPegawai: 'Pn. Zahrah',
});

// Mock data - Replace with actual API calls
const applicationDetails = ref({
  noRujukan: "APP-001",
  tarikhPermohonan: "2024-03-15",
  jenisAduan: "Aduan Kewangan",
  status: "Menunggu Siasatan",
  additionalInfo:
    "Permohonan sedang dalam proses siasatan oleh pegawai yang berkenaan.",
});

interface Document {
  name: string;
  type: string;
  url: string;
}

const documents = ref<Document[]>([
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

const getStatusVariant = (status: string) => {
  const variants: Record<string, string> = {
    'Dalam Penyaluran': 'primary',
    'Dalam Proses - Siasatan Ringkas': 'info',
    'Dalam Proses - Siasatan Lapangan': 'warning',
    Selesai: 'success',
    Dibatalkan: 'danger',
    Kelulusan: 'info',
    'Masih Dalam Tempoh': 'success',
    'Terlewat': 'destructive',
  };
  return variants[status] || 'default';
};

// Dummy SLA & statusTimeline example
const slaRules: Record<string, number> = {
  'Aduan Baru': 0,
  'Dalam Tindakan - Siasatan Ringkas': 1,
  'Dalam Tindakan - Siasatan Lapangan': 2,
  'Selesai' : 0
};

const slaTimeline = [
  { 
    label: 'Aduan Baru', 
    icon: 'mdi:email-outline',  // New complaint
    sla: 0, 
    completed: true,
  },
  { 
    label: 'Dalam Tindakan - Siasatan Ringkas', 
    icon: 'mdi:progress-clock', // Ongoing / in progress
    sla: 1, 
    active: true,
  },
  { 
    label: 'Dalam Tindakan - Siasatan Lapangan', 
    icon: 'mdi:account-search-outline', // Field investigation / active work
    sla: 2,  
    notStarted: true, 
  },
  { 
    label: 'Selesai', 
    icon: 'mdi:check-circle-outline', // Completed
    sla: 0,  
  },
];


const totalSla = Object.values(slaRules).reduce((a, b) => a + b, 0);

const getRemainingSla = (currentLabel: string): number => {
  const currentIndex = Object.keys(slaRules).indexOf(currentLabel);
  const consumed = Object.values(slaRules)
    .slice(0, currentIndex + 1)
    .reduce((a, b) => a + b, 0);
  return totalSla - consumed;
};

const statusTimeline = [
  {
    label: 'Aduan Baru',
    tarikh: '10-06-2025',
    completed: true,
    catatan: 'Aduan telah diterima dan direkod dalam sistem.',
    namaPegawai: 'Encik Ali',
    masaBerbaki: '24 jam',
  },
  {
    label: 'Dalam Tindakan - Siasatan Ringkas',
    tarikh: '10-06-2025',
    inProgress: true,
    catatan: 'Pegawai sedang menilai aduan dan menjalankan semakan awal.',
    namaPegawai: 'Pn. Zahrah',
    masaBerbaki: '21 jam',
  },
  {
    label: 'Dalam Tindakan - Siasatan Lapangan',
    tarikh: '13-06-2025',
    notStarted: true,
    catatan: 'Tindakan penyelesaian akan dilaksanakan selepas semakan selesai.',
    namaPegawai: 'Ustaz Hafiz',
    masaBerbaki: '19 jam',
  },
    {
    label: 'Selesai',
    tarikh: '13-06-2025',
    notStarted: true,
    catatan: 'Tindakan penyelesaian akan dilaksanakan selepas semakan selesai.',
    namaPegawai: 'Ustaz Hafiz',
    masaBerbaki: '19 jam',
  },
];


import { formatDate as formatDateUtil } from '~/utils/dateFormatter';

const formatDate = (dateStr: string | Date): string => {
  if (!dateStr) return 'Belum Bermula';
  return formatDateUtil(dateStr as string);
};

const getTextClass = (label: string): string => 'text-blue-800';

const calculateSlaStatus = (label: string, tarikh: string): string => {
  if (!tarikh) return 'Belum Bermula';
  return label === 'Siasatan' ? 'Masih Dalam Tempoh' : 'Selesai';
};

const downloadDocument = (doc: Document): void => {
  // This would be replaced with actual download functionality
  alert(`Fungsi muat turun untuk ${doc.name} akan dilaksanakan dalam sistem sebenar.`);
};

// Role-based access control
const selectedRole = ref("pengguna-dalam"); // default role
const canViewSejarahSemakan = computed(() => selectedRole.value === "pengguna-dalam");
</script>

<style lang="scss" scoped>
// Optional custom styles
</style>