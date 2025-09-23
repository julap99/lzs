<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <RsCard class="mt4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Senarai Maklumat Status Household / Individu
          </h2>
          <div class="flex gap-10">
            <rs-button variant="primary" @click="navigateTo('/BF-PRF/KF/SHI/01_01/tambah')">
              <Icon name="material-symbols:add" class="mr-1" size="10" /> Tambah
            </rs-button>

            <rs-button variant="info-outline" @click="navigateTo('/BF-PRF/KF/SHI/01_03')">
              <Icon name="iconamoon:edit" class="mr-1" size="10" /> Kemaskini
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>
        <!-- Status Table -->
        <rs-table class="mt-4" :key="tableKey" :data="pagedRows" :fields="fields" :pageSize="10" :options="{
          variant: 'default',
          hover: true,
          pagination: true,
        }">

          <template v-slot:kod="data">
            {{ data.text }}
          </template>

          <template v-slot:nama="data">
            {{ data.text }}
          </template>

          <template v-slot:jenis="data">
            <rs-badge variant="info">{{ data.text }}</rs-badge>
          </template>

          <template v-slot:tarikhMula="data">
            <span class="font-medium">{{ formatDate(data.text) }}</span>
          </template>

          <template v-slot:statusData="data">
            <rs-badge :variant="getStatusVariant(data.text)">
              {{ data.text }}
            </rs-badge>
          </template>

          <template v-slot:tindakan="{ text }">
            <rs-button variant="primary" size="sm" class="!px-3 !py-1" @click="openModal(text)">
              Lihat
            </rs-button>
          </template>
        </rs-table>
        <div class="flex items-center justify-between mt-3">
          <div class="text-sm text-gray-500">
            Menunjukkan {{ totalRecords ? startIndex + 1 : 0 }} hingga {{ endIndex }} daripada {{ totalRecords }} entri
          </div>

          <div class="flex gap-2">
            <rs-button variant="primary-outline" :disabled="currentPage === 1" @click="prevPage">
              <Icon name="iconamoon:arrow-left-2-bold" />
            </rs-button>
            <rs-button variant="primary-outline" :disabled="currentPage === totalPages" @click="nextPage">
              <Icon name="iconamoon:arrow-right-2-bold" />
            </rs-button>
          </div>
        </div>

      </template>

      <!-- Lihat Modal -->
      <RsModal v-model="showModal" size="lg" class="flex items-center justify-center">
        <template #header>
          <h3 class="text-lg font-semibold">
            Maklumat Status: {{ selected?.nama || '-' }}
          </h3>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
          <!-- row 1: kod | nama -->
          <div>
            <div class="text-gray-500 text-sm">Kod</div>
            <div class="font-semibold">{{ selected?.kod || '-' }}</div>
          </div>
          <div>
            <div class="text-gray-500 text-sm">Nama</div>
            <div class="font-semibold">{{ selected?.nama || '-' }}</div>
          </div>

          <!-- row 2: jenis | keterangan -->
          <div class="self-stretch grid content-center justify-items-start gap-1">
            <div class="text-gray-500 text-sm">Jenis</div>
            <rs-badge variant="info">
              {{ selected?.jenis || '-' }}
            </rs-badge>
          </div>
          <div>
            <div class="text-gray-500 text-sm">Keterangan</div>
            <div class="font-semibold">{{ selected?.keterangan || '-' }}</div>
          </div>

          <!-- row 3: status data | status aktif -->
          <div>
            <div class="text-gray-500 text-sm">Status Data</div>
            <rs-badge :variant="getStatusVariant(selected?.statusData)">
              {{ selected?.statusData || '-' }}
            </rs-badge>
          </div>
          <div>
            <div class="text-gray-500 text-sm">Status</div>
            <rs-badge :variant="selected?.statusAktif === 'Aktif' ? 'success' : 'danger'">
              {{ selected?.statusAktif || '-' }}
            </rs-badge>
          </div>

          <!-- row 4: julat min (%) | tarikh mula -->
          <div>
            <div class="text-gray-500 text-sm">Julat Min (%)</div>
            <div class="font-semibold">{{ formatPct(selected?.julatMin) }}</div>
          </div>
          <div>
            <div class="text-gray-500 text-sm">Tarikh Mula</div>
            <div class="font-semibold">{{ formatDate(selected?.tarikhMula || '-') }}</div>
          </div>

          <!-- row 5: julat max (%) | tarikh tamat -->
          <div>
            <div class="text-gray-500 text-sm">Julat Max (%)</div>
            <div class="font-semibold">{{ formatPct(selected?.julatMax) }}</div>
          </div>
          <div>
            <div class="text-gray-500 text-sm">Tarikh Tamat</div>
            <div class="font-semibold">{{ formatDate(selected?.tarikhTamat || '-') }}</div>
          </div>
        </div>

        <template #footer>
          <div class="flex items-center justify-end gap-2">
            <rs-button variant="primary-outline" @click="showModal = false">
              <Icon name="iconamoon:arrow-left-1" />Kembali
            </rs-button>
          </div>
        </template>

      </RsModal>
    </RsCard>
  </div>
</template>
<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useToast } from "vue-toastification";
import RsCard from "~/components/RsCard.vue";
import RsModal from "~/components/RsModal.vue";

const STORAGE_KEY = "shi-rows-v1";

definePageMeta({ title: "Konfigurasi Status Household / Individu" });

const breadcrumb = ref([
  { name: "Profiling", type: "link", path: "/BF-PRF/KF/SHI/01_01" },
  { name: "Konfigurasi Status Household / Individu", type: "current", path: "/BF-PRF/KF/SHI/01_01/admin" },
]);

const toast = useToast();
const TABLE_KEYS = ["kod", "nama", "jenis", "tarikhMula", "statusData", "tindakan"];
const tableKey = ref(0);
const rows = ref([]);
const showModal = ref(false);
const selected = ref(null);

/* ---------- client-only load, no seeding ---------- */
function genId() {
  return (globalThis.crypto?.randomUUID?.())
    || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
function ensureIds(arr) {
  let changed = false;
  const withIds = (arr ?? []).map(r => {
    if (!r.id) changed = true;
    return { id: r.id ?? genId(), ...r };
  });
  return { rows: withIds, changed };
}
function persistRows() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(rows.value)); }
  catch (e) { console.warn("Failed to save rows:", e); }
}

onMounted(() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = Array.isArray(JSON.parse(raw || "[]")) ? JSON.parse(raw || "[]") : [];
    const { rows: normalized, changed } = ensureIds(parsed);
    rows.value = normalized;
    if (changed) persistRows(); // backfill ids only
  } catch (e) {
    console.warn("Failed to load rows:", e);
  }
});

/* ------------------- table data & pagination ------------------- */
const tableRows = computed(() =>
  (rows.value ?? []).map(r => {
    const obj = {};
    for (const key of TABLE_KEYS) obj[key] = r[key] ?? "";
    obj.tindakan = r.id;
    return obj;
  })
);

const pageSize = ref(10);
const currentPage = ref(1);
const totalRecords = computed(() => tableRows.value.length);
const totalPages = computed(() => Math.max(1, Math.ceil(totalRecords.value / pageSize.value)));
const startIndex = computed(() => (currentPage.value - 1) * pageSize.value);
const endIndex = computed(() => Math.min(startIndex.value + pageSize.value, totalRecords.value));
const pagedRows = computed(() => tableRows.value.slice(startIndex.value, endIndex.value));

// if rs-table paginates internally, disable or force page size
const fields = [
  { key: "kod", label: "Kod" },
  { key: "nama", label: "Nama" },
  { key: "jenis", label: "Jenis" },
  { key: "tarikhMula", label: "Tarikh Mula" },
  { key: "statusData", label: "Status Data" },
  { key: "tindakan", label: "Tindakan", class: "text-right" },
];

function formatDate(value) {
  const d = value?.includes("-")
    ? new Date(value)
    : new Date(String(value || "").replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/, "$3-$2-$1"));
  if (isNaN(d)) return value;
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}
const getStatusVariant = (status) => {
  switch (status) {
    case "Lulus": return "success";
    case "Draf": return "warning";
    case "Tolak": return "danger";
    default: return "default";
  }
};

function openModal(id) {
  const row = (rows.value || []).find(r => r.id === id);
  selected.value = row ? { ...row } : null;
  showModal.value = true;
}

function formatPct(val) {
  if (val === null || val === undefined || val === "") return "-";
  const n = Number(val);
  if (Number.isNaN(n)) return "-";
  const clamped = Math.min(Math.max(n, 0), 9999.99);
  return `${clamped}%`;
}

function prevPage() { if (currentPage.value > 1) currentPage.value--; }
function nextPage() { if (currentPage.value < totalPages.value) currentPage.value++; }
watch(totalRecords, () => { currentPage.value = 1; });
</script>
