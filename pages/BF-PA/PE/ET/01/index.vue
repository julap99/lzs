<!-- 
  RTMF SCREEN: PA-PE-ET-01
  PURPOSE: Maklumat Penerima — Senarai Nama Penolong Amil
  DESCRIPTION: Recipient selection and management for annual allowance batches
  ROUTE: /BF-PA/PE/ET/01
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Header -->
    <rs-card class="mt-4">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <Icon name="ic:outline-people" class="mr-3 text-blue-600" size="24" />
            <h2 class="text-lg font-semibold">Maklumat Penerima — Senarai Nama Penolong Amil</h2>
          </div>
          <div class="text-xs text-gray-500">
            Tahun: <b>{{ query.year || '—' }}</b> · Jenis Elaun: <b>{{ typeLabel || '—' }}</b>
          </div>
        </div>
      </template>

      <template #body>
        <!-- 3.1.1 Maklumat Penerima (Table Read-only + Checkbox Pilih untuk calon baharu sahaja) -->
        <div class="space-y-3 mb-6">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold">Senarai Nama — {{ typeLabel || 'Jenis Elaun' }}</h3>
            <p class="text-xs text-gray-500">Ditapis kepada: <b>KPAK sahaja</b></p>
          </div>

          <div class="flex items-center gap-2">
            <FormKit
              v-model="search"
              type="text"
              placeholder="Cari nama / ID Pengenalan / Kariah…"
              :classes="{
                input: '!py-2',
              }"
            />
          </div>

          <div class="overflow-x-auto rounded-lg border">
            <rs-table
              :data="pagedRows"
              :columns="candidateColumns"
              :options="{
                variant: 'default',
                hover: true,
                striped: true,
                responsive: true,
              }"
              :loading="false"
              empty-message="Tiada data KPAK untuk kombinasi Tahun & Jenis Elaun ini."
            >
              <template v-slot:selection="{ text }">
                <template v-if="isInRecipients(text.paId)">
                  <rs-badge variant="success" class="text-xs">
                    Dalam Senarai
                  </rs-badge>
                </template>
                <template v-else>
                  <FormKit
                    v-model="text._checked"
                    type="checkbox"
                    :classes="{
                      input: '!w-4 !h-4',
                    }"
                  />
                </template>
              </template>

              <template v-slot:activities="{ text }">
                <ul class="list-disc pl-5 space-y-0.5 text-xs leading-tight">
                  <li v-for="a in aggregateActivities(text.activities)" :key="a.name">
                    <span class="font-medium">{{ a.name }}</span>
                  </li>
                  <li v-if="!text.activities || !text.activities.length" class="list-none text-gray-500">
                    Tiada rekod aktiviti.
                  </li>
                </ul>
              </template>

              <template v-slot:activityCount="{ text }">
                {{ totalActivityCount(text.activities) }}
              </template>
            </rs-table>
          </div>

          <!-- Pagination -->
          <div class="flex items-center justify-between" v-if="total > pageSize">
            <div class="text-sm text-gray-500">
              Menunjukkan {{ startIndex + 1 }}–{{ endIndex }} daripada {{ total }} rekod
            </div>
            <div class="flex items-center gap-2">
              <rs-button
                variant="secondary-outline"
                size="sm"
                :disabled="page === 1"
                @click="page--"
              >
                Sebelum
              </rs-button>
              <div class="text-sm">Halaman {{ page }}</div>
              <rs-button
                variant="secondary-outline"
                size="sm"
                :disabled="endIndex >= total"
                @click="page++"
              >
                Seterusnya
              </rs-button>
            </div>
          </div>
        </div>

        <!-- Button 2.2: "Pilih" (kira calon baharu sahaja) -->
        <div class="flex items-center justify-end mb-6">
          <rs-button
            variant="primary"
            :disabled="newCheckedCount === 0"
            @click="commitSelected"
          >
            <Icon name="ic:outline-check" class="mr-2" />
            Pilih ({{ newCheckedCount }})
          </rs-button>
        </div>

        <!-- Maklumat Penerima (Paparan) - Elaun tetap bila ET-KPAK/ET-KPAF -->
        <div class="rounded-lg border p-4 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold">Maklumat Penerima (Paparan)</h3>
            <div class="text-xs text-gray-500">Status: <b>{{ statusLabel }}</b></div>
          </div>

          <div class="overflow-x-auto rounded-lg border">
            <rs-table
              :data="recipients"
              :columns="recipientColumns"
              :options="{
                variant: 'default',
                hover: true,
                striped: true,
                responsive: true,
              }"
              :loading="false"
              empty-message="Tiada penerima dipilih lagi. Tandakan dan klik 'Pilih'."
            >
              <template v-slot:allowance="{ text }">
                <template v-if="isFixedAllowance">
                  <div class="flex items-center gap-2">
                    <span class="font-semibold">{{ fixedAllowanceValue.toFixed(2) }}</span>
                  </div>
                </template>
                <template v-else>
                  <FormKit
                    v-model.number="text.allowance"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    :classes="{
                      input: '!py-1 !px-2',
                    }"
                  />
                </template>
              </template>
            </rs-table>
          </div>

          <!-- Footer with total -->
          <div class="bg-gray-50 p-3 rounded-lg">
            <div class="flex justify-between items-center">
              <span class="font-medium">Jumlah (RM)</span>
              <span class="font-semibold text-lg">{{ totalAllowance.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-2">
            <rs-button
              variant="secondary-outline"
              size="sm"
              @click="goBack"
            >
              Kembali
            </rs-button>
            <rs-button
              variant="secondary-outline"
              size="sm"
              :disabled="saving"
              @click="saveDraft"
            >
              <Icon name="ic:outline-save" class="mr-2" />
              Simpan draf
            </rs-button>
            <rs-button
              variant="success"
              size="sm"
              :disabled="!canSubmit || saving"
              @click="submitForApproval"
            >
              <Icon name="ic:outline-send" class="mr-2" />
              Hantar
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '#components';
import { FormKit } from '@formkit/vue';
import LayoutsBreadcrumb from '~/components/layouts/Breadcrumb.vue';

definePageMeta({
  title: "Maklumat Penerima — Senarai Nama Penolong Amil",
  description: "Recipient selection and management for annual allowance batches",
});

const toast = useToast();
const router = useRouter();
const route = useRoute();
const goBack = () => router.back();

const breadcrumb = ref([
  {
    name: "Pengurusan Elaun",
    type: "link",
    path: "/BF-PA/PE",
  },
  {
    name: "Elaun Tahunan",
    type: "link",
    path: "/BF-PA/PE/ET",
  },
  {
    name: "Senarai Nama PA",
    type: "current",
    path: "/BF-PA/PE/ET/01",
  },
]);

const query = reactive({
  year: route.query.year ? Number(route.query.year) : '',
  type: route.query.type ? String(route.query.type) : ''
});

const typeOptions = {
  'ET-KPAK': 'Elaun Tahunan KPAK',
  'ET-KPAF': 'Elaun Tahunan KPAF',
  'ET-ANUG': 'Anugerah Penolong Amil',
  'ANUG-KPAK': 'Ketua Penolong Amil Kariah (KPAK) terbaik',
  'ANUG-PAK': 'Penolong Amil Kariah (PAK) terbaik',
  'ANUG-KPAF': 'Ketua Penolong Amil Fitrah (KPAF) terbaik',
  'ANUG-PAF': 'Penolong Amil Fitrah (PAF) terbaik',
  'ANUG-PAP': 'Penolong Amil Padi (PAP) terbaik',
  'ANUG-PAKPLUS': 'Penolong Amil Komuniti (PAK+) terbaik'
};

const typeLabel = computed(() => typeOptions[query.type] || '');

/* ====== Kadar elaun tetap ikut jenis elaun ====== */
const fixedAllowanceByType = { 'ET-KPAK': 500, 'ET-KPAF': 300 };
const isFixedAllowance = computed(() => fixedAllowanceByType[query.type] != null);
const fixedAllowanceValue = computed(() => fixedAllowanceByType[query.type] ?? 0);

/* ====== State ====== */
const candidates = ref([]);
const recipients = ref([]); // penerima sedia ada (draf) + yang baru dipilih
const search = ref('');
const page = ref(1);
const pageSize = 12;
const saving = ref(false);

// Table columns for candidates
const candidateColumns = [
  {
    key: "selection",
    label: "Pilih",
    sortable: false,
    width: "120px",
  },
  {
    key: "name",
    label: "Nama",
    sortable: true,
    width: "200px",
  },
  {
    key: "ic",
    label: "ID Pengenalan",
    sortable: true,
    width: "150px",
  },
  {
    key: "category",
    label: "Kategori/Jawatan",
    sortable: true,
    width: "150px",
  },
  {
    key: "parish",
    label: "Kariah/Daerah",
    sortable: true,
    width: "150px",
  },
  {
    key: "activities",
    label: "Senarai Aktiviti Dihadiri",
    sortable: false,
    width: "200px",
  },
  {
    key: "activityCount",
    label: "Hadir Aktiviti (kali)",
    sortable: true,
    width: "120px",
  },
];

// Table columns for recipients
const recipientColumns = [
  {
    key: "name",
    label: "Nama",
    sortable: true,
    width: "200px",
  },
  {
    key: "ic",
    label: "ID Pengenalan",
    sortable: true,
    width: "150px",
  },
  {
    key: "category",
    label: "Kategori",
    sortable: true,
    width: "150px",
  },
  {
    key: "allowance",
    label: "Elaun (RM)",
    sortable: true,
    width: "150px",
  },
];

/* === Helpers aktiviti (gabung + jumlah count) === */
function aggregateActivities(acts = []) {
  const map = new Map();
  for (const a of acts || []) {
    const name = a?.name?.trim();
    if (!name) continue;
    const c = Number.isFinite(a?.count) ? Number(a.count) : 1;
    map.set(name, (map.get(name) || 0) + c);
  }
  return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
}

function totalActivityCount(acts = []) {
  return aggregateActivities(acts).reduce((s, a) => s + (Number(a.count) || 0), 0);
}

/* === Seed sample data + load draft recipients === */
function seedData() {
  const seed = String(query.year) + String(query.type);
  const rng = mulberry32(hashCode(seed || 'seed'));
  const cats = ['PAK', 'KPAK', 'PAF', 'KPAF', 'PAP', 'PAK+'];
  const parish = ['Kariah A', 'Kariah B', 'Kariah C', 'Kariah D'];
  const actPool = ['Taklimat', 'Kutipan Fitrah', 'Agihan Tunai', 'Mesyuarat Kariah', 'Audit Tunai', 'Program Komuniti', 'Edaran Bantuan', 'Bimbingan Asnaf'];

  const ROWS = 20;
  candidates.value = Array.from({ length: ROWS }, (_, i) => {
    const n = i + 1;
    // 0..5 jenis aktiviti; setiap satu diberi "count" 1..4 kali (random)
    const rawKinds = Math.floor(rng() * 6);
    const names = new Set();
    while (names.size < rawKinds) {
      names.add(actPool[Math.floor(rng() * actPool.length)]);
    }
    const acts = Array.from(names).map((nm, idx) => ({
      id: `A${n}-${idx}`,
      name: nm,
      count: 1 + Math.floor(rng() * 4) // 1..4 kali
    }));
    return {
      paId: `PA${String(query.year || 'XX')}${String(n).padStart(3, '0')}`,
      name: `Nama PA ${n}`,
      ic: `80010114${(1000 + Math.floor(rng() * 9000)).toString()}`,
      category: cats[Math.floor(rng() * cats.length)],
      parish: parish[Math.floor(rng() * actPool.length)],
      activities: acts,
      _checked: false
    };
  });

  // Load draft recipients from localStorage
  loadDraftRecipients();
}

/* === Load draft recipients dari localStorage === */
function loadDraftRecipients() {
  const year = route.query.year ?? '';
  const type = route.query.type ?? '';
  const key = `et:recipients:${year}:${type}`;
  try {
    const raw = localStorage.getItem(key);
    const list = raw ? JSON.parse(raw) : [];
    if (Array.isArray(list)) {
      // Ensure allowance follows fixed rate if needed
      recipients.value = list.map(r => ({
        ...r,
        allowance: isFixedAllowance.value ? fixedAllowanceValue.value : (Number(r.allowance) || 0)
      }));
    } else {
      recipients.value = [];
    }
  } catch {
    recipients.value = [];
  }
}

/* === KPAK ONLY FILTER === */
const baseRows = computed(() => candidates.value.filter(r => r.category === 'KPAK'));

/* baris yang boleh dipilih (tidak berada dalam recipients sedia ada) */
function isInRecipients(paId) {
  return recipients.value.some(r => r.paId === paId);
}

const filteredRows = computed(() => {
  const rows = baseRows.value;
  if (!search.value) return rows;
  const q = search.value.toLowerCase();
  return rows.filter(r =>
    r.name.toLowerCase().includes(q) ||
    r.ic.toLowerCase().includes(q) ||
    r.parish.toLowerCase().includes(q)
  );
});

const total = computed(() => filteredRows.value.length);
const startIndex = computed(() => (page.value - 1) * pageSize);
const endIndex = computed(() => Math.min(startIndex.value + pageSize, total.value));
const pagedRows = computed(() => filteredRows.value.slice(startIndex.value, endIndex.value));

/* kira 'select all' hanya atas calon baharu dalam view */
const allVisibleChecked = computed(() => {
  const visibleNew = pagedRows.value.filter(r => !isInRecipients(r.paId));
  return visibleNew.length > 0 && visibleNew.every(r => r._checked);
});

/* bilangan calon baharu yang ditick */
const newCheckedCount = computed(() =>
  filteredRows.value.filter(r => !isInRecipients(r.paId) && r._checked).length
);

function toggleSelectVisible(e) {
  const v = e.target.checked;
  pagedRows.value.forEach(r => {
    if (!isInRecipients(r.paId)) r._checked = v;
  });
}

function commitSelected() {
  // ambil yang baru ditick sahaja
  const selectedNew = filteredRows.value.filter(r => !isInRecipients(r.paId) && r._checked);
  if (!selectedNew.length) return;

  const map = new Map(recipients.value.map(x => [x.paId, x]));
  selectedNew.forEach(s => {
    const allowance = isFixedAllowance.value ? fixedAllowanceValue.value : 0;
    if (!map.has(s.paId)) {
      map.set(s.paId, { ...s, allowance });
    }
  });
  recipients.value = Array.from(map.values());

  // bersihkan tick
  filteredRows.value.forEach(r => (r._checked = false));
}

/* Jenis elaun bertukar → set elaun tetap */
watch(() => query.type, () => {
  if (isFixedAllowance.value) {
    recipients.value.forEach(r => (r.allowance = fixedAllowanceValue.value));
  }
});

const totalAllowance = computed(() => recipients.value.reduce((sum, r) => sum + (Number(r.allowance) || 0), 0));
const canSubmit = computed(() => recipients.value.length > 0 && recipients.value.every(r => isFinite(r.allowance) && Number(r.allowance) >= 0));
const status = ref('DRAF');
const statusLabel = computed(() => status.value === 'MENUNGGU KELULUSAN' ? 'menunggu kelulusan' : status.value.toLowerCase());

/* Simpan draf → persist penerima & status, count, balik ke skrin 1 */
async function saveDraft() {
  saving.value = true;
  try {
    await wait(400);
    status.value = 'DRAF';
    persistRecipients();
    persistCountAndStatusAndBack('DRAF');
    toast.success('Draf berjaya disimpan');
  } finally {
    saving.value = false;
  }
}

/* Hantar → status MENUNGGU KELULUSAN, persist & balik ke skrin 1 */
async function submitForApproval() {
  if (!canSubmit.value) return;
  saving.value = true;
  try {
    await wait(600);
    status.value = 'MENUNGGU KELULUSAN';
    persistRecipients();
    persistCountAndStatusAndBack('MENUNGGU KELULUSAN');
    toast.success('Permohonan berjaya dihantar untuk kelulusan');
  } finally {
    saving.value = false;
  }
}

/* Persist helpers */
function persistRecipients() {
  const year = route.query.year ?? '';
  const type = route.query.type ?? '';
  const key = `et:recipients:${year}:${type}`;
  // hanya simpan field penting
  const compact = recipients.value.map(r => ({
    paId: r.paId,
    name: r.name,
    ic: r.ic,
    category: r.category,
    parish: r.parish,
    allowance: Number(r.allowance) || 0
  }));
  localStorage.setItem(key, JSON.stringify(compact));
}

function persistCountAndStatusAndBack(newStatus) {
  const year = route.query.year ?? '';
  const type = route.query.type ?? '';
  const count = Array.isArray(recipients.value) ? recipients.value.length : 0;
  localStorage.setItem(`et:count:${year}:${type}`, String(count));
  localStorage.setItem(`et:status:${year}:${type}`, newStatus);
  router.push({ path: '/BF-PA/PE/ET', query: { year, type } });
}

/* utils */
function wait(ms) { return new Promise(res => setTimeout(res, ms)); }
function hashCode(str) { let h = 0; for (let i = 0; i < str.length; i++) { h = ((h << 5) - h) + str.charCodeAt(i); h |= 0 } return h; }
function mulberry32(a) { return function () { let t = (a += 0x6D2B79F5); t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296 } }

/* Load data + draft on first mount or when query changes */
watch(() => [query.year, query.type], () => seedData(), { immediate: true });
</script>

<style scoped>
/* gaya ringkas, ikut Tailwind */
</style> 