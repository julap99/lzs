<template>
  <div>
    <!-- Breadcrumb -->
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Section 1: Maklumat Profil -->
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

    <!-- Section 2: Maklumat Kelayakan -->
    <rs-card>
      <template #header>Maklumat Kelayakan</template>
      <template #body>
        <div v-if="kelayakanInfo.telahDinilai">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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

            <rs-card variant="secondary" v-if="kelayakanInfo.namaPegawai">
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

    <!-- Section 2: Garis Masa SLA Standard (Horizontal) -->
    <rs-card class="mb-6">
      <template #header>Garis Masa SLA Standard</template>
      <template #body>
        <div class="relative flex items-center justify-between overflow-x-auto pb-4">
          <template v-for="(step, index) in slaTimeline" :key="index">
            <div v-if="index !== 0" class="w-8 h-0.5 bg-gray-300 mx-1"></div>
            <div class="flex flex-col items-center text-center min-w-[100px] relative z-10">
              <div
                class="w-10 h-10 flex items-center justify-center rounded-full text-white mb-2"
                :class="[
                  step.completed ? 'bg-gray-400' : step.active ? 'bg-blue-600' : 'bg-gray-300',
                ]"
              >
                <Icon :name="step.icon" size="20" />
              </div>
              <div class="text-sm font-medium text-gray-800">{{ step.label }}</div>
              <div class="text-xs text-gray-500">SLA: {{ step.sla }} hari</div>
              <div v-if="step.active" class="text-xs mt-1 text-gray-600">
                Jumlah SLA: {{ totalSla }} hari<br />
                Baki: {{ getRemainingSla(step.label) }} hari
              </div>
            </div>
          </template>
        </div>
      </template>
    </rs-card>

    <!-- Section 3: Garis Masa Penilaian (Vertical) -->
    <rs-card>
      <template #header>Garis Masa Penilaian Kelayakan</template>
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
              <div class="ml-4 flex-1">
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
            </div>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

definePageMeta({
  title: "Status Fakir, Miskin, NonFM",
});

// Breadcrumb
const breadcrumb = ref([
  {
    name: "Semak Status",
    type: "link",
    path: "/status-tracking",
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

const kelayakanInfo = ref({
  telahDinilai: true,
  kategori: 'Fakir',
  tarikhPenilaian: '2025-06-10',
  catatan: 'Memerlukan bantuan sara hidup.',
  namaPegawai: 'Ahmad bin Salleh',
});

const slaRules = {
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
    tarikh: '2025-06-01T09:00:00',
    completed: true,
    catatan: 'Profil diterima untuk semakan.',
    namaPegawai: 'Sistem NAS',
    masaBerbaki: '1 hari',
  },
  {
    label: 'Semakan Dokumen',
    tarikh: '2025-06-02T11:00:00',
    completed: true,
    catatan: 'Semakan dokumen selesai.',
    namaPegawai: 'Pn. Suraya',
    masaBerbaki: '1 hari',
  },
  {
    label: 'Penilaian Kelayakan',
    tarikh: '2025-06-04T10:00:00',
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

const getRemainingSla = (label: string) => {
  const currentIndex = Object.keys(slaRules).indexOf(label);
  const consumed = Object.values(slaRules).slice(0, currentIndex + 1).reduce((a, b) => a + b, 0);
  return totalSla - consumed;
};

const calculateSlaStatus = (label: string, tarikh: string) => {
  if (!tarikh) return 'Belum Bermula';
  return label === 'Penilaian Kelayakan' ? 'Masih Dalam Tempoh' : 'Selesai';
};

const formatDate = (date: string) => {
  if (!date) return 'Belum Bermula';
  return new Date(date).toLocaleDateString('ms-MY', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getKategoriVariant = (kategori: string) => {
  switch (kategori) {
    case 'Fakir': return 'danger';
    case 'Miskin': return 'warning';
    case 'NonFM': return 'success';
    default: return 'default';
  }
};

// Simulate user role
const canExport = ref(false); // true → utk Pengguna Dalaman

// Export Function
const exportPDF = () => {
  alert("Export PDF triggered!");
};
</script>

<style lang="scss" scoped>
// Optional styling
</style>
