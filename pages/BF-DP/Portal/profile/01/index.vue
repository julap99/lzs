<template>
  <div>
    <!-- Breadcrumb -->
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

    <!-- Section 1: Status Semasa -->
    <rs-card class="mb-6">
      <template #body>
        <div class="grid grid-cols-1 gap-4">
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

    <!-- Section 2: Maklumat Profil -->
    <rs-card class="mb-6">
      <template #header>Maklumat Profil</template>
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <rs-card variant="secondary">
            <div class="p-2">
              <div class="text-sm text-gray-500">ID Profil</div>
              <div class="font-bold">{{ profileInfo.idProfil }}</div>
            </div>
          </rs-card>

          <rs-card variant="secondary">
            <div class="p-2">
              <div class="text-sm text-gray-500">Nama Individu / Organisasi</div>
              <div class="font-bold">{{ profileInfo.nama }}</div>
            </div>
          </rs-card>
        </div>
      </template>
    </rs-card>

    <!-- Section 3: Maklumat Kelayakan -->
    <rs-card class="mb-6">
      <template #header>Maklumat Kelayakan</template>
      <template #body>
        <div v-if="kelayakanInfo.telahDinilai">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <rs-card variant="secondary">
              <div class="p-2">
                <div class="text-sm text-gray-500">Kategori Kelayakan</div>
                <rs-badge :variant="getKategoriVariant(kelayakanInfo.kategori)" size="sm">
                  {{ kelayakanInfo.kategori }}
                </rs-badge>
              </div>
            </rs-card>

            <rs-card variant="secondary">
              <div class="p-2">
                <div class="text-sm text-gray-500">Tarikh Penilaian</div>
                <div class="font-bold">{{ formatDate(kelayakanInfo.tarikhPenilaian) }}</div>
              </div>
            </rs-card>

            <rs-card variant="secondary" v-if="kelayakanInfo.catatan">
              <div class="p-2">
                <div class="text-sm text-gray-500">Catatan Penilaian</div>
                <div class="font-bold">{{ kelayakanInfo.catatan }}</div>
              </div>
            </rs-card>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4" v-if="kelayakanInfo.namaPegawai">
            <rs-card variant="secondary">
              <div class="p-2">
                <div class="text-sm text-gray-500">Nama Pegawai Penilai</div>
                <div class="font-bold">{{ kelayakanInfo.namaPegawai }}</div>
              </div>
            </rs-card>
          </div>

          <!-- Action Button -->
          <div class="flex justify-end space-x-2" v-if="canExport">
            <rs-button variant="secondary" @click="exportPDF">
              Cetak / Eksport PDF
            </rs-button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center text-gray-600 mt-6">
          Tiada penilaian kelayakan direkodkan setakat ini.
        </div>
      </template>
    </rs-card>

    <!-- Section 3: Review History - Visible to both roles, details hidden for Pengguna Luar -->
    <rs-card v-if="canViewSejarahSemakan">
      <template #header>Prosedur Agihan</template>
      <template #body>
        <div class="relative">
          <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          <div class="space-y-8">
            <div
              v-for="(step, index) in statusTimeline"
              :key="index"
              class="relative flex items-start"
            >
              <div
                class="relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                :class="[
                  step.completed ? 'bg-green-500' : step.inProgress ? 'bg-blue-500' : 'bg-gray-300',
                  'text-white'
                ]"
              >
                <Icon
                  v-if="step.completed"
                  name="mdi:check"
                />
                <Icon
                  v-else-if="step.inProgress"
                  name="mdi:clock-outline"
                />
                <span v-else>{{ index + 1 }}</span>
              </div>
              <div v-if="selectedRole === 'pengguna-dalam'" class="ml-4 flex-1">
                <div class="text-sm text-gray-500">{{ formatDate(step.tarikh) }}</div>
                <div class="font-bold text-blue-800">{{ step.label }}</div>
                <div class="text-sm mt-1">
                  SLA: {{ slaRules[step.label] }} hari |
                  <span :class="calculateSlaStatus(step.label, step.tarikh) === 'Terlewat' ? 'text-red-600' : 'text-green-600'">
                    {{ calculateSlaStatus(step.label, step.tarikh) }}
                  </span>
                  <span v-if="step.masaBerbaki">| Berbaki: {{ step.masaBerbaki }}</span>
                </div>
                <div v-if="step.catatan" class="text-sm mt-1 italic text-gray-700">
                  "{{ step.catatan }}"
                </div>
                <div class="text-sm mt-1 text-gray-600">Pegawai: {{ step.namaPegawai }}</div>
              </div>
              <!-- Minimal content for Pengguna Luar: date + label only -->
              <div v-else class="ml-4 flex-1">
                <div class="text-sm text-gray-500">{{ formatDate(step.tarikh) }}</div>
                <div class="font-bold text-blue-800">{{ step.label }}</div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>


  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

definePageMeta({
  title: "Status Fakir, Miskin, NonFM",
});

// Breadcrumb
const breadcrumb = ref([
  {
    name: "Semak Status",
    type: "link",
    path: "/BF-DP/Portal/",
  },
  {
    name: "Senarai Status Pendaftaran Profil",
    type: "link",
    path: "/BF-DP/Portal/profile",
  },
  {
    name: "Status Fakir, Miskin, NonFM",
    type: "current",
    path: "/BF-DP/Portal/profile/detail",
  },
]);

// Dummy Maklumat Profil
const profileInfo = ref({
  idProfil: "NAS-PRF-2025-0001",
  nama: "Ali bin Abu",
});

// Tindakan & Status (mock)
const tindakanStatus = ref({
  statusSemasa: 'Dalam Proses - Siasatan',
  tarikhKemaskini: '13-06-2025',
  namaPegawaiBertugas: 'Ustaz Hafiz',
  catatanPegawaiBertugas: 'Siasatan lapangan sedang dijalankan oleh pegawai daerah.',
});

const currentStatus = computed(() => tindakanStatus.value.statusSemasa);

const kelayakanInfo = ref({
  telahDinilai: true,
  kategori: 'Fakir',
  tarikhPenilaian: '10-06-2025',
  catatan: 'Memerlukan bantuan sara hidup.',
  namaPegawai: 'Ahmad bin Salleh',
});

const slaRules: Record<string, number> = {
  'Permohonan Dihantar': 0,
  'Semakan Dokumen': 1,
  'Penilaian Kelayakan': 3,
  'Sahkan Profil': 1,
};

const slaTimeline = [
  { label: 'Permohonan Dihantar', icon: 'mdi:send', sla: 0, completed: true },
  { label: 'Semakan Dokumen', icon: 'mdi:file-document-outline', sla: 1, completed: true },
  { label: 'Penilaian Kelayakan', icon: 'mdi:account-search', sla: 3, active: true },
  { label: 'Sahkan Profil', icon: 'mdi:check-decagram', sla: 1 },
];

const statusTimeline = [
  {
    label: 'Permohonan Dihantar',
    tarikh: '01-06-2025',
    completed: true,
    catatan: 'Profil diterima untuk semakan.',
    namaPegawai: 'Sistem NAS',
    masaBerbaki: '1 hari',
  },
  {
    label: 'Semakan Dokumen',
    tarikh: '02-06-2025',
    completed: true,
    catatan: 'Semakan dokumen selesai.',
    namaPegawai: 'Pn. Suraya',
    masaBerbaki: '1 hari',
  },
  {
    label: 'Penilaian Kelayakan',
    tarikh: '04-06-2025',
    inProgress: true,
    catatan: 'Dalam proses penilaian.',
    namaPegawai: 'Ustaz Hakim',
    masaBerbaki: '2 hari',
  },
  {
    label: 'Sahkan Profil',
    notStarted: true,
    tarikh: '',
    catatan: 'Tiada tindakan direkodkan setakat ini.',
    namaPegawai: 'Belum Ditugaskan',
  },
];

const totalSla = Object.values(slaRules).reduce((a, b) => a + b, 0);

const getRemainingSla = (label: string): number => {
  const currentIndex = Object.keys(slaRules).indexOf(label);
  const consumed = Object.values(slaRules).slice(0, currentIndex + 1).reduce((a, b) => a + b, 0);
  return totalSla - consumed;
};

const calculateSlaStatus = (label: string, tarikh: string): string => {
  if (!tarikh) return 'Belum Bermula';
  return label === 'Penilaian Kelayakan' ? 'Masih Dalam Tempoh' : 'Selesai';
};

import { formatDate as formatDateUtil } from '~/utils/dateFormatter';

const formatDate = (date: string): string => {
  if (!date) return 'Belum Bermula';
  return formatDateUtil(date);
};

const getKategoriVariant = (kategori: string): string => {
  switch (kategori) {
    case 'Fakir': return 'danger';
    case 'Miskin': return 'warning';
    case 'NonFM': return 'success';
    default: return 'default';
  }
};

const getStatusVariant = (status: string): string => {
  const variants: Record<string, string> = {
    'Dalam Proses - Siasatan': 'info',
    'Disemak': 'primary',
    'Lulus': 'success',
    'Tidak Lulus': 'danger',
    'Diterima': 'info',
    'Dibatalkan': 'default',
  };
  return variants[status] || 'default';
};

// Simulate user role
const canExport = ref(false); // true → utk Pengguna Dalaman

// Export Function
const exportPDF = (): void => {
  alert("Export PDF triggered!");
};

// Role-based access control
const selectedRole = ref("pengguna-dalam"); // default role
// Both roles can view the timeline; only internal users see details (handled in template)
const canViewSejarahSemakan = computed(() => ["pengguna-dalam", "pengguna-luar"].includes(selectedRole.value));
</script>

<style lang="scss" scoped>
// Optional styling
</style>
