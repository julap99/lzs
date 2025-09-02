<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Section 1: Maklumat Permohonan Bantuan -->
    <rs-card class="mb-6">
      <template #header>Maklumat Permohonan Bantuan</template>
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <rs-card variant="secondary">
            <div class="p-2">
              <div class="text-sm text-gray-500">ID Permohonan</div>
              <div class="font-bold">{{ bantuanInfo.idPermohonan }}</div>
            </div>
          </rs-card>
          <rs-card variant="secondary">
            <div class="p-2">
              <div class="text-sm text-gray-500">Nama Bantuan</div>
              <div class="font-bold">{{ bantuanInfo.namaBantuan }}</div>
            </div>
          </rs-card>
          <rs-card variant="secondary">
            <div class="p-2">
              <div class="text-sm text-gray-500">Tarikh Permohonan</div>
              <div class="font-bold">{{ formatDate(bantuanInfo.tarikhMohon) }}</div>
            </div>
          </rs-card>
          <rs-card variant="secondary">
            <div class="p-2 flex flex-col">
              <div class="text-sm text-gray-500">Status Semasa</div>
              <rs-badge :variant="getStatusVariant(currentStatus)" size="sm">
                {{ currentStatus }}
              </rs-badge>
            </div>
          </rs-card>
        </div>
      </template>
    </rs-card>

    <!-- Section 2: Maklumat Tindakan & Status -->
    <rs-card class="mb-6">
      <template #header>Maklumat Tindakan & Status</template>
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <rs-card variant="secondary">
            <div class="p-2 flex flex-col">
              <div class="text-sm text-gray-500">Status Semasa</div>
              <rs-badge variant="info" size="sm">
                Dalam Proses - Siasatan
              </rs-badge>
            </div>
          </rs-card>
          <rs-card variant="secondary">
            <div class="p-2">
              <div class="text-sm text-gray-500">Tarikh Kemaskini</div>
              <div class="font-bold">{{ formatDate(tindakanStatus.tarikhKemaskini) }}</div>
            </div>
          </rs-card>
          <rs-card variant="secondary">
            <div class="p-2">
              <div class="text-sm text-gray-500">Nama Pegawai Bertugas</div>
              <div class="font-bold">{{ tindakanStatus.namaPegawaiBertugas }}</div>
            </div>
          </rs-card>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
          <rs-card variant="secondary">
            <div class="p-2">
              <div class="text-sm text-gray-500">Catatan Pegawai Bertugas</div>
              <div class="font-bold italic">{{ tindakanStatus.catatanPegawaiBertugas }}</div>
            </div>
          </rs-card>
        </div>
      </template>
    </rs-card>

    <!-- Review History -->
    <rs-card>
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
                    : step.rejected
                    ? 'bg-red-500'
                    : 'bg-gray-300',
                ]"
              >
                <Icon
                  v-if="step.completed"
                  name="mdi:check"
                  class="text-white"
                />
                <Icon
                  v-else-if="step.rejected"
                  name="mdi:close"
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
                  SLA: {{ slaRules[step.label] }} hari |
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
  { name: 'Senarai Bantuan', type: 'link', path: '/BF-DP/Portal/bantuan' },
  { name: 'Status Tracking Bantuan', type: 'current', path: '/BF-DP/Portal/bantuan/detail' },
]);

const bantuanInfo = ref({
  idPermohonan: 'NAS-BTN-2025-0001',
  namaBantuan: 'Bantuan Pendidikan',
  tarikhMohon: '01-06-2025',
});

// Mock data - Replace with actual API calls
const applicationDetails = ref({
  noRujukan: "APP-001",
  tarikhPermohonan: "2024-03-15",
  jenisBantuan: "Bantuan Kewangan",
  status: "Menunggu Siasatan",
  additionalInfo:
    "Permohonan sedang dalam proses siasatan oleh pegawai yang berkenaan.",
});

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

interface Document {
  name: string;
  type: string;
  url: string;
}

const getStatusVariant = (status: string) => {
  const variants: Record<string, string> = {
    'Dalam Penyaluran': 'primary',
    Selesai: 'success',
    Dibatalkan: 'danger',
    Kelulusan: 'info',
    'Masih Dalam Tempoh': 'success',
    'Terlewat': 'destructive',
  };
  return variants[status] || 'default';
};

const currentStatus = ref('Siasatan');

// Dummy SLA & statusTimeline example
const slaRules: Record<string, number> = {
  'Permohonan Dihantar': 0,
  'Semakan Awal': 1,
  'Siasatan': 3,
  'Kelulusan': 1,
  'Pembayaran': 2,
};

const slaTimeline = [
  { label: 'Permohonan Dihantar', icon: 'mdi:send', sla: 0, completed: true },
  { label: 'Semakan Awal', icon: 'mdi:magnify', sla: 1, completed: true },
  { label: 'Siasatan', icon: 'mdi:account-search', sla: 3, active: true },
  { label: 'Kelulusan', icon: 'mdi:check-decagram', sla: 1 },
  { label: 'Pembayaran', icon: 'mdi:cash-multiple', sla: 2 },
];

const totalSla = Object.values(slaRules).reduce((a, b) => a + b, 0);

const getRemainingSla = (currentLabel: string): number => {
  const currentIndex = Object.keys(slaRules).indexOf(currentLabel);
  const consumed = Object.values(slaRules).slice(0, currentIndex + 1).reduce((a, b) => a + b, 0);
  return totalSla - consumed;
};

const statusTimeline = [
  {
    label: 'Permohonan Dihantar',
    tarikh: '10-06-2025',
    completed: true,
    catatan: 'Permohonan diterima untuk semakan.',
    namaPegawai: 'Encik Ali',
    masaBerbaki: '1 hari',
    inProgress: false,
    notStarted: false,
    rejected: false,
  },
  {
    label: 'Semakan Awal',
    tarikh: '11-06-2025',
    completed: true,
    catatan: 'Semakan dokumen lengkap dan disahkan.',
    namaPegawai: 'Pn. Zahrah',
    masaBerbaki: '2 hari',
    inProgress: false,
    notStarted: false,
    rejected: false,
  },
  {
    label: 'Siasatan',
    tarikh: '13-06-2025',
    inProgress: true,
    catatan: 'Siasatan lapangan sedang dijalankan oleh pegawai daerah.',
    namaPegawai: 'Ustaz Hafiz',
    masaBerbaki: '1 hari',
    completed: false,
    notStarted: false,
    rejected: false,
  },
  {
    label: 'Kelulusan',
    notStarted: true,
    tarikh: '',
    catatan: 'Tiada tindakan direkodkan setakat ini.',
    namaPegawai: 'Belum Ditugaskan',
    masaBerbaki: '',
    completed: false,
    inProgress: false,
    rejected: false,
  },
  {
    label: 'Pembayaran',
    notStarted: true,
    tarikh: '',
    catatan: 'Tiada tindakan direkodkan setakat ini.',
    namaPegawai: 'Belum Ditugaskan',
    masaBerbaki: '',
    completed: false,
    inProgress: false,
    rejected: false,
  },
];

const tindakanStatus = ref({
  statusSemasa: 'Siasatan',
  tarikhKemaskini: '13-06-2025',
  namaPegawaiBertugas: 'Ustaz Hafiz',
  catatanPegawaiBertugas: 'Siasatan lapangan sedang dijalankan oleh pegawai daerah.',
});

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
  alert(`Downloading ${doc.name}`);
};
</script>

<style lang="scss" scoped>
// Optional custom styles
</style>