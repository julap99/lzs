<!-- 
  RTMF SCREEN: PA-PE-ET
  PURPOSE: Borang Isi Maklumat Penerima — Elaun Tahunan
  DESCRIPTION: Batch management for annual allowance recipients
  ROUTE: /BF-PA/PE/ET
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Header Card -->
    <rs-card class="mt-4">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <Icon name="ic:outline-people" class="mr-3 text-blue-600" size="24" />
            <h2 class="text-lg font-semibold">Borang Isi Maklumat Penerima — Elaun Tahunan</h2>
          </div>
          <div class="text-xs text-gray-500">Kod Skrin: BF-PA/PE/ET/01</div>
        </div>
      </template>

      <template #body>
        <!-- Filters (Required) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tahun Elaun <span class="text-red-500">*</span>
            </label>
            <FormKit
              v-model="filters.year"
              type="select"
              :options="yearOptions"
              placeholder="Pilih tahun…"
              :classes="{
                input: '!py-2',
              }"
              @change="onFilterChanged"
            />
            <p class="text-xs text-gray-500 mt-1">Wajib dipilih; memandu skop data penerima.</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Jenis Elaun <span class="text-red-500">*</span>
            </label>
            <FormKit
              v-model="filters.type"
              type="select"
              :options="typeOptions"
              placeholder="Pilih jenis elaun…"
              :classes="{
                input: '!py-2',
              }"
              @change="onFilterChanged"
            />
            <p class="text-xs text-gray-500 mt-1">Wajib dipilih; memandu senarai calon & kawalan konflik tahun.</p>
          </div>
        </div>

        <!-- Summary / Status Bar -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div class="text-xs text-blue-600">Tahun Elaun</div>
            <div class="text-base font-medium text-blue-900">{{ filters.year || '—' }}</div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg border border-green-200">
            <div class="text-xs text-green-600">Jenis Elaun</div>
            <div class="text-base font-medium text-green-900">{{ typeLabel || '—' }}</div>
          </div>
          <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div class="text-xs text-orange-600">Status Senarai</div>
            <div class="text-base">
              <rs-badge :variant="getStatusVariant(batchStatus)">
                {{ batchStatusLabel(batchStatus) }}
              </rs-badge>
            </div>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div class="text-xs text-purple-600">Bilangan Dalam Senarai</div>
            <div class="text-base font-medium text-purple-900">{{ totalCountDisplay }}</div>
          </div>
        </div>

        <!-- Toolbar: Actions -->
        <div class="flex flex-col md:flex-row md:items-center gap-3 mb-6">
          <div class="flex-1"></div>
          <div class="flex items-center gap-2">
            <rs-button
              variant="secondary-outline"
              size="sm"
              @click="reloadBatchStatus"
              :disabled="!canQuery || loading"
            >
              <Icon name="ic:outline-refresh" class="mr-2" />
              Set Semula
            </rs-button>
            <rs-button
              variant="primary"
              size="sm"
              :disabled="!canSave"
              @click="onSave"
            >
              <Icon name="ic:outline-save" class="mr-2" />
              Simpan
            </rs-button>
          </div>
        </div>

        <!-- Status Table (Read-only) -->
        <div class="overflow-x-auto rounded-lg border">
          <rs-table
            :data="rows"
            :columns="columns"
            :options="{
              variant: 'default',
              hover: true,
              striped: true,
              responsive: true,
            }"
            :loading="loading"
            empty-message="Tiada rekod. Pilih Tahun & Jenis Elaun, kemudian klik 'Simpan' untuk cipta batch."
          >
            <template v-slot:status="{ text }">
              <rs-badge :variant="getStatusVariant(text)">
                {{ batchStatusLabel(text) }}
              </rs-badge>
            </template>

            <template v-slot:tindakan="{ text }">
              <rs-button
                variant="primary"
                size="sm"
                @click="viewRecipients(text)"
                class="!px-3 !py-1.5"
              >
                <Icon name="ic:outline-remove-red-eye" class="w-4 h-4 mr-1" />
                Lihat Senarai Nama
              </rs-button>
            </template>
          </rs-table>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '#components';
import { FormKit } from '@formkit/vue';
import LayoutsBreadcrumb from '~/components/layouts/Breadcrumb.vue';

definePageMeta({
  title: "Borang Isi Maklumat Penerima — Elaun Tahunan",
  description: "Batch management for annual allowance recipients",
});

const toast = useToast();
const router = useRouter();
const route = useRoute();

const breadcrumb = ref([
  {
    name: "Pengurusan Elaun",
    type: "link",
    path: "/BF-PA/PE",
  },
  {
    name: "Elaun Tahunan",
    type: "current",
    path: "/BF-PA/PE/ET",
  },
]);

const currentYear = new Date().getFullYear();
const yearOptions = [
  { label: 'Pilih tahun…', value: '' },
  { label: String(currentYear - 1), value: currentYear - 1 },
  { label: String(currentYear), value: currentYear }
];

const typeOptions = [
  { label: 'Pilih jenis elaun…', value: '' },
  { label: 'Elaun Tahunan KPAK', value: 'ET-KPAK' },
  { label: 'Elaun Tahunan KPAF', value: 'ET-KPAF' },
  { label: 'Anugerah Penolong Amil', value: 'ET-ANUG' },
  { label: 'Ketua Penolong Amil Kariah (KPAK) terbaik', value: 'ANUG-KPAK' },
  { label: 'Penolong Amil Kariah (PAK) terbaik', value: 'ANUG-PAK' },
  { label: 'Ketua Penolong Amil Fitrah (KPAF) terbaik', value: 'ANUG-KPAF' },
  { label: 'Penolong Amil Fitrah (PAF) terbaik', value: 'ANUG-PAF' },
  { label: 'Penolong Amil Padi (PAP) terbaik', value: 'ANUG-PAP' },
  { label: 'Penolong Amil Komuniti (PAK+) terbaik', value: 'ANUG-PAKPLUS' }
];

const filters = reactive({
  year: route.query.year ? Number(route.query.year) : '',
  type: route.query.type ? String(route.query.type) : ''
});

const typeLabel = computed(() => {
  const option = typeOptions.find(opt => opt.value === filters.type);
  return option ? option.label : '';
});

const canQuery = computed(() => !!filters.year && !!filters.type);
const canSave = computed(() => canQuery.value && !loading.value);

const batchStatus = ref('DRAF');
const rows = ref([]);
const loading = ref(false);

// Table columns
const columns = [
  {
    key: "year",
    label: "Tahun Elaun",
    sortable: true,
    width: "120px",
  },
  {
    key: "typeCode",
    label: "Jenis Elaun",
    sortable: true,
    width: "200px",
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    width: "150px",
  },
  {
    key: "count",
    label: "Bilangan Penerima",
    sortable: true,
    width: "150px",
  },
  {
    key: "tindakan",
    label: "Tindakan",
    sortable: false,
    width: "180px",
  },
];

// Status helpers
function getStatusVariant(status) {
  switch (status) {
    case 'MENUNGGU KELULUSAN': return 'warning';
    case 'SEDANG PROSES': return 'info';
    case 'DILULUSKAN': return 'success';
    case 'DITOLAK': return 'danger';
    case 'DRAF': return 'secondary';
    default: return 'secondary';
  }
}

function batchStatusLabel(status) {
  return status ? status.toLowerCase() : '—';
}

// Total count display
const totalCountDisplay = computed(() => {
  if (!rows.value.length) return '—';
  const r = rows.value[0];
  return r.count ?? '—';
});

// Router & filter
function onFilterChanged() {
  const q = {};
  if (filters.year) q.year = String(filters.year);
  if (filters.type) q.type = String(filters.type);
  router.replace({ query: q });

  rows.value = [];
  batchStatus.value = 'DRAF';
  if (canQuery.value) reloadBatchStatus();
}

// Simulated "DB" & LocalStorage
const savedBatches = new Map();

// Get saved count from second screen
function getSavedCount(year, type) {
  const raw = localStorage.getItem(`et:count:${year}:${type}`);
  if (raw == null) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

// Get saved status from second screen
function getSavedStatus(year, type) {
  const s = localStorage.getItem(`et:status:${year}:${type}`);
  return s || undefined;
}

async function apiFetchBatchStatus({ year, type }) {
  await sleep(300);
  const key = `${year}-${type}`;
  const row = savedBatches.get(key);
  const count = getSavedCount(year, type);
  const statusFromLocal = getSavedStatus(year, type);

  if (!row) {
    if (count == null && !statusFromLocal) return [];
    return [{
      id: `BATCH-${year}-${type}`,
      year,
      typeCode: type,
      status: statusFromLocal || 'DRAF',
      count: count ?? 0
    }];
  }
  // Overlay count & status from localStorage if exists
  return [{
    ...row,
    count: count ?? row.count,
    status: statusFromLocal || row.status
  }];
}

async function apiSaveBatchLight({ year, typeCode }) {
  await sleep(500);
  const key = `${year}-${typeCode}`;
  const existing = savedBatches.get(key);
  const countFromLocal = getSavedCount(year, typeCode);
  // Save as "SEDANG PROSES" when Save is clicked on first screen
  const payload = {
    id: `BATCH-${year}-${typeCode}`,
    year,
    typeCode,
    status: 'SEDANG PROSES',
    count: countFromLocal ?? existing?.count ?? 0,
    updatedAt: Date.now()
  };
  savedBatches.set(key, payload);
  return { batchId: payload.id, status: 'SEDANG PROSES' };
}

function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }

// Load status
async function reloadBatchStatus() {
  if (!canQuery.value) return;
  loading.value = true;
  try {
    const list = await apiFetchBatchStatus({ year: filters.year, type: filters.type });
    rows.value = list;
    batchStatus.value = list[0]?.status || 'DRAF';
  } catch (e) {
    console.error(e);
    toast.error('Gagal memuatkan status senarai.');
  } finally {
    loading.value = false;
  }
}

// Save batch
async function onSave() {
  if (!canSave.value) return;
  loading.value = true;
  try {
    const res = await apiSaveBatchLight({ year: filters.year, typeCode: filters.type });
    batchStatus.value = res.status || 'SEDANG PROSES';
    await reloadBatchStatus();
    toast.success('Berjaya disimpan. Status batch kini: "sedang proses".');
  } catch (e) {
    console.error(e);
    toast.error('Gagal menyimpan batch. Sila cuba lagi.');
  } finally {
    loading.value = false;
  }
}

// Navigate to second screen
function viewRecipients(row) {
  router.push({ path: '/BF-PA/PE/ET/01', query: { year: row.year, type: row.typeCode } });
}

// Watch for filter changes
watch(() => [filters.year, filters.type], ([y, t]) => {
  if (y && t && !rows.value.length) reloadBatchStatus();
}, { immediate: true });
</script>

<style scoped>
/* Add any additional styles here */
</style> 