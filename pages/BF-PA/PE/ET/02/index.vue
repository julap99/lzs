<!-- 
  RTMF SCREEN: PA-PE-ET-02
  PURPOSE: Maklumat Penerima — Senarai Nama Penolong Amil
  DESCRIPTION: Pemilihan dan pengurusan penerima untuk batch elaun tahunan
  ROUTE: /BF-PA/PE/ET/02
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Header -->
    <rs-card class="mt-4">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <Icon name="ic:baseline-group" class="mr-3 text-blue-600" size="24" />
            <h2 class="text-lg font-semibold">Maklumat Penerima — Senarai Nama Penolong Amil</h2>
          </div>
          <div class="text-xs text-gray-500">
            Tahun: <b>{{ query.year || '—' }}</b> · Jenis Elaun: <b>{{ typeLabel || '—' }}</b>
          </div>
        </div>
      </template>

      <template #body>
        <!-- 3.1.1 Maklumat Penerima (Jadual Baca Sahaja + Checkbox Pilih untuk calon baharu sahaja) -->
        <div class="space-y-3 mb-6">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold">Senarai Nama — {{ typeLabel || 'Jenis Elaun' }}</h3>
            <p class="text-xs text-gray-500">
              Ditapis kepada: 
              <b>{{ getCategoryFilterText() }}</b>
            </p>
          </div>





          <!-- Simple Selection Info -->
          <div class="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div class="text-sm text-gray-600">
              <span class="font-medium">{{ filteredRows.filter(r => r._checked && !isInRecipients(r.paId)).length }}</span> penerima dipilih untuk ditambah
            </div>
          </div>

          <div class="overflow-x-auto rounded-lg border">
            <table class="min-w-full text-sm divide-y">
              <thead class="bg-gray-50 text-left">
                <tr>
                  <th class="px-4 py-3 w-28">
                    <div class="flex items-center gap-2">
                      <FormKit
                        type="checkbox"
                        :checked="allVisibleChecked"
                        @change="toggleSelectVisible"
                        :classes="{
                          input: '!w-4 !h-4',
                        }"
                      />
                      <span class="text-xs text-gray-500">Pilih semua</span>
                    </div>
                    <div class="text-[11px] text-gray-500">(* Hanya calon baharu)</div>
                  </th>
                  <th class="px-4 py-3 font-medium text-gray-900">Nama</th>
                  <th class="px-4 py-3 font-medium text-gray-900">ID Pengenalan</th>
                  <th class="px-4 py-3 font-medium text-gray-900">Kategori/Jawatan</th>
                  <th class="px-4 py-3 font-medium text-gray-900">Kariah/Daerah</th>
                  <th class="px-4 py-3 font-medium text-gray-900">Senarai Aktiviti Dihadiri</th>
                  <th class="px-4 py-3 font-medium text-gray-900">Hadir Aktiviti (kali)</th>
                </tr>
              </thead>
              <tbody class="divide-y bg-white">
                <tr v-for="row in pagedRows" :key="row.paId" class="hover:bg-gray-50">
                  <td class="px-4 py-3">
                    <!-- Jika sudah dalam draf (recipients), jangan papar checkbox -->
                    <template v-if="isInRecipients(row.paId)">
                      <rs-badge variant="success" class="text-xs">
                        Dalam Senarai
                      </rs-badge>
                    </template>
                    <template v-else>
                      <FormKit
                        v-model="row._checked"
                        type="checkbox"
                        :classes="{
                          input: '!w-4 !h-4',
                        }"
                      />
                    </template>
                  </td>
                  <td class="px-4 py-3 font-medium text-gray-900">{{ row.name }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ row.ic }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ row.category }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ row.parish }}</td>
                  <td class="px-4 py-3">
                    <ul class="list-disc pl-5 space-y-0.5 text-xs leading-tight">
                      <li v-for="a in aggregateActivities(row.activities)" :key="a.name">
                        <span class="font-medium">{{ a.name }}</span>
                      </li>
                      <li v-if="!row.activities || !row.activities.length" class="list-none text-gray-500">
                        Tiada rekod aktiviti.
                      </li>
                    </ul>
                  </td>
                  <td class="px-4 py-3 text-gray-900">
                    {{ totalActivityCount(row.activities) }}
                  </td>
                </tr>
                <tr v-if="!filteredRows.length" class="hover:bg-gray-50">
                  <td class="px-4 py-6 text-center text-gray-500" colspan="7">
                    Tiada data {{ getCategoryFilterText() }} untuk kombinasi Tahun & Jenis Elaun ini.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Paginasi -->
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

        <!-- Butang 2.2: "Pilih" (kira calon baharu sahaja) -->
        <div class="flex items-center justify-end mb-6">
          <rs-button
            variant="primary"
            :disabled="newCheckedCount === 0"
            @click="commitSelected"
          >
            <Icon name="ic:baseline-check" class="mr-2" />
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
            <table class="min-w-full text-sm divide-y">
              <thead class="bg-gray-50 text-left">
                <tr>
                  <th class="px-4 py-3 font-medium text-gray-900">Nama</th>
                  <th class="px-4 py-3 font-medium text-gray-900">ID Pengenalan</th>
                  <th class="px-4 py-3 font-medium text-gray-900">Kategori</th>
                  <th class="px-4 py-3 font-medium text-gray-900">
                    <div class="flex items-center gap-2">
                      Elaun (RM)
                    </div>
                  </th>
                  <th class="px-4 py-3 font-medium text-gray-900">Tindakan</th>
                </tr>
              </thead>
              <tbody class="divide-y bg-white">
                <tr v-for="(r, index) in recipients" :key="r.paId" class="hover:bg-gray-50">
                  <td class="px-4 py-3 font-medium text-gray-900">
                    <FormKit
                      v-if="r._isEditing"
                      v-model="r.name"
                      type="text"
                      placeholder="Nama penerima"
                      :classes="{
                        input: '!py-1 !px-2',
                      }"
                    />
                    <span v-else>{{ r.name }}</span>
                  </td>
                  <td class="px-4 py-3 text-gray-900">
                    <FormKit
                      v-if="r._isEditing"
                      v-model="r.ic"
                      type="text"
                      placeholder="Nombor IC"
                      :classes="{
                        input: '!py-1 !px-2',
                      }"
                    />
                    <span v-else>{{ r.ic }}</span>
                  </td>
                  <td class="px-4 py-3 text-gray-900">
                    <FormKit
                      v-if="r._isEditing"
                      v-model="r.category"
                      type="select"
                      :options="categoryOptions"
                      :classes="{
                        input: '!py-1 !px-2',
                      }"
                    />
                    <span v-else>{{ r.category }}</span>
                  </td>
                  <td class="px-4 py-3 w-48">
                    <FormKit
                      v-if="r._isEditing && canEditAllowance()"
                      v-model.number="r.allowance"
                      type="number"
                      :min="editableAllowanceRange.min"
                      :max="editableAllowanceRange.max"
                      step="0.01"
                      placeholder="0.00"
                      :classes="{
                        input: '!py-1 !px-2',
                      }"
                    />
                    <template v-else>
                      <div class="flex items-center gap-2">
                        <span class="font-semibold">{{ r.allowance.toFixed(2) }}</span>
                      </div>
                    </template>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <div class="flex items-center justify-center gap-2">
                      <!-- Edit Button - Only visible when not editing and allowance is editable -->
                      <rs-button
                        variant="secondary-outline"
                        size="sm"
                        @click="() => handleEditAttempt(r) && startEdit(r)"
                        v-if="!r._isEditing && canEditAllowance()"
                      >
                        <Icon name="ic:outline-edit" size="16" />
                      </rs-button>
                      <!-- Save Button - Only visible when editing -->
                      <rs-button
                        variant="success"
                        size="sm"
                        @click="saveRecipient(r)"
                        v-if="r._isEditing"
                      >
                        <Icon name="ic:baseline-check" size="16" />
                      </rs-button>
                      <!-- Cancel Button - Only visible when editing -->
                      <rs-button
                        variant="secondary-outline"
                        size="sm"
                        @click="cancelEdit(r)"
                        v-if="r._isEditing"
                      >
                        <Icon name="ic:baseline-close" size="16" />
                      </rs-button>
                      <!-- Delete Button - Always visible (except for new recipients) -->
                      <rs-button
                        variant="danger"
                        size="sm"
                        @click="removeRecipient(recipients.indexOf(r))"
                        v-if="!r._isNew"
                      >
                        <Icon name="ic:outline-delete" size="16" />
                      </rs-button>
                    </div>
                  </td>
                </tr>
                <tr v-if="recipients.length === 0" class="hover:bg-gray-50">
                  <td class="px-4 py-6 text-center text-gray-500" colspan="5">
                    Tiada penerima dipilih lagi. Tandakan dan klik 'Pilih'.
                  </td>
                </tr>
              </tbody>
              <tfoot class="bg-gray-50">
                <tr>
                  <td class="px-4 py-3 text-right font-medium" colspan="3">Jumlah (RM)</td>
                  <td class="px-4 py-3 font-semibold">{{ totalAllowance.toFixed(2) }}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Footer dengan jumlah -->
          <div class="bg-gray-50 p-3 rounded-lg">
            <div class="flex justify-between items-center">
              <span class="font-medium">Jumlah (RM)</span>
              <span class="font-semibold text-lg">{{ totalAllowance.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Tindakan -->
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
              <Icon name="ic:baseline-save" class="mr-2" />
              Simpan draf
            </rs-button>
            <rs-button
              variant="success"
              size="sm"
              :disabled="!canSubmit || saving"
              @click="openSubmitModal"
            >
              <Icon name="ic:baseline-send" class="mr-2" />
              Hantar
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>



    <!-- Submit Confirmation Modal -->
    <div v-if="showSubmitModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-4">Hantar untuk Kelulusan</h3>
          <p class="text-sm text-gray-600 mb-4">Pastikan semua maklumat adalah betul sebelum menghantar untuk kelulusan.</p>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Ulasan Eksekutif</label>
            <FormKit
              v-model="submitNotes"
              type="textarea"
              rows="3"
              placeholder="Masukkan ulasan akhir sebelum menghantar..."
              :classes="{ input: '!py-2' }"
            />
            <p class="text-xs text-gray-600 mt-1">Ulasan ini akan dilihat oleh Ketua Jabatan dan Ketua Divisyen</p>
          </div>
          
          <div class="flex items-center justify-end gap-3 mt-6">
            <rs-button
              variant="secondary-outline"
              size="sm"
              @click="closeSubmitModal"
            >
              Batal
            </rs-button>
            <rs-button
              variant="success"
              size="sm"
              @click="confirmSubmit"
              :disabled="saving"
            >
              <Icon name="ic:baseline-send" class="mr-2" />
              {{ saving ? 'Menghantar...' : 'Hantar' }}
            </rs-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch, nextTick } from 'vue';
import { useToast } from 'vue-toastification';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '#components';
import { FormKit } from '@formkit/vue';
import LayoutsBreadcrumb from '~/components/layouts/Breadcrumb.vue';

/*
  CORRELATION WITH ET/01:
  - This page uses static mock data that EXACTLY matches the mock data from ET/01
  - Category filtering is dynamic based on allowance type (ET-KPAK shows KPAK only, etc.)
  - Candidate counts are EXACTLY the same as "Bilangan Penerima" shown in ET/01
  - This ensures PERFECT correlation between the two screens
  - Using static mock data approach (similar to KF module) for simplicity and consistency
  - Counts: ET-KPAK: 7, ET-KPAF: 4, ET-ANUG: 6, ANUG-KPAK: 8, ANUG-PAK: 7, ANUG-KPAF: 5, ANUG-PAF: 8, ANUG-PAP: 3, ANUG-PAKPLUS: 9
*/

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
    path: "/BF-PA/PE/ET/02",
  },
]);

const query = reactive({
  year: route.query.year ? Number(route.query.year) : '',
  type: route.query.type ? String(route.query.type) : ''
});

const typeOptions = {
  'ET-KPAK': 'Elaun Tahunan KPAK',
  'ET-KPAF': 'Elaun Tahunan KPAF',
  'ET-ANUG': 'Elaun Khas - 48 aktiviti/tahun',
  'ET-BANCIAN': 'Elaun Bancian Baru : per borang permohonan',
  'ET-KEMASKINI': 'Elaun Kemaskini/permohonan bantuan : per borang permohonan',
  'ANUG-KPAK': 'Ketua Penolong Amil Kariah (KPAK) terbaik',
  'ANUG-PAK': 'Penolong Amil Kariah (PAK) terbaik',
  'ANUG-KPAF': 'Ketua Penolong Amil Fitrah (KPAF) terbaik',
  'ANUG-PAF': 'Penolong Amil Fitrah (PAF) terbaik',
  'ANUG-PAP': 'Penolong Amil Padi (PAP) terbaik',
  'ANUG-PAKPLUS': 'Penolong Amil Komuniti (PAK+) terbaik'
};

const typeLabel = computed(() => typeOptions[query.type] || '');

/* ====== Kadar elaun tetap ikut jenis elaun ====== */
// Fixed allowances that cannot be edited
const fixedAllowanceByType = { 
  'ET-KPAK': 500, 
  'ET-KPAF': 300, 
  'ET-ANUG': 400,
  'ET-BANCIAN': 30,
  'ET-KEMASKINI': 20
};

// Editable allowances with range validation
const editableAllowanceByType = {
  'ANUG-KPAK': { min: 400, max: 750, default: 400 },
  'ANUG-PAK': { min: 400, max: 750, default: 400 },
  'ANUG-KPAF': { min: 400, max: 750, default: 400 },
  'ANUG-PAF': { min: 400, max: 750, default: 400 },
  'ANUG-PAP': { min: 400, max: 750, default: 400 },
  'ANUG-PAKPLUS': { min: 400, max: 750, default: 400 }
};

const isFixedAllowance = computed(() => fixedAllowanceByType[query.type] != null);
const isEditableAllowance = computed(() => editableAllowanceByType[query.type] != null);
const fixedAllowanceValue = computed(() => fixedAllowanceByType[query.type] ?? 0);
const editableAllowanceRange = computed(() => editableAllowanceByType[query.type] || { min: 0, max: 0, default: 0 });

// Check if allowance can be edited for a specific recipient
function canEditAllowance() {
  return isEditableAllowance.value;
}

// Function to handle edit attempts on fixed allowance recipients
function handleEditAttempt(recipient) {
  if (!canEditAllowance()) {
    toast.warning(`Elaun untuk jenis ${typeLabel.value} adalah tetap dan tidak boleh diubah`);
    return false;
  }
  return true;
}

// Function to start editing a recipient
function startEdit(recipient) {
  recipient._originalAllowance = Number(recipient.allowance);
  recipient._isEditing = true;
}

// Function to validate budget constraints for editable allowances
function validateBudgetConstraints() {
  if (!isEditableAllowance.value) return true;
  
  const { min, max } = editableAllowanceRange.value;
  const totalMin = recipients.value.length * min;
  const totalMax = recipients.value.length * max;
  
  if (totalAllowance.value < totalMin) {
    toast.error(`Jumlah elaun (RM${totalAllowance.value.toFixed(2)}) adalah di bawah minimum (RM${totalMin.toFixed(2)})`);
    return false;
  }
  
  if (totalAllowance.value > totalMax) {
    toast.error(`Jumlah elaun (RM${totalAllowance.value.toFixed(2)}) adalah melebihi maksimum (RM${totalMax.toFixed(2)})`);
    return false;
  }
  
  return true;
}

/* ====== State ====== */
const candidates = ref([]);
const recipients = ref([]); // penerima sedia ada (draf) + yang baru dipilih
const page = ref(1);
const pageSize = 12;
const saving = ref(false);

// Modal states
const showSubmitModal = ref(false);
const submitNotes = ref('');

// Missing category options for editing
const categoryOptions = [
  { label: 'KPAK', value: 'KPAK' },
  { label: 'KPAF', value: 'KPAF' },
  { label: 'PAK', value: 'PAK' },
  { label: 'PAF', value: 'PAF' },
  { label: 'PAP', value: 'PAP' },
  { label: 'PAK+', value: 'PAK+' }
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

/* === Simple static mock data (similar to KF module approach) === */
function seedData() {
  // Load candidates based on allowance type
  candidates.value = getMockCandidates(query.year, query.type);
  
  // Load draft recipients from localStorage
  loadDraftRecipients();
}

// Static mock data for candidates - simple and realistic
function getMockCandidates(year, type) {
  const mockData = {
    'ET-KPAK': [
      { paId: `PA${year}001`, name: 'Ahmad bin Abdullah', ic: '800101011234', category: 'KPAK', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}002`, name: 'Mohd Zain bin Ismail', ic: '750315085678', category: 'KPAK', parish: 'Kariah Masjid Al-Amin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}003`, name: 'Abdul Rahman bin Hassan', ic: '820520149012', category: 'KPAK', parish: 'Kariah Masjid Al-Hidayah', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}004`, name: 'Mohd Faiz bin Omar', ic: '780812063456', category: 'KPAK', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}005`, name: 'Zulkifli bin Ahmad', ic: '790325127890', category: 'KPAK', parish: 'Kariah Masjid Al-Amin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}006`, name: 'Ahmad Fadzil bin Ibrahim', ic: '810415032345', category: 'KPAK', parish: 'Kariah Masjid Al-Hidayah', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}007`, name: 'Mohd Hafiz bin Zainal', ic: '760628096789', category: 'KPAK', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false }
    ],
    'ET-KPAF': [
      { paId: `PA${year}001`, name: 'Siti Aminah binti Omar', ic: '820520149012', category: 'KPAF', parish: 'Kariah Masjid Al-Hidayah', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}002`, name: 'Nor Azizah binti Ahmad', ic: '830615083456', category: 'KPAF', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}003`, name: 'Fatimah binti Hassan', ic: '810723127890', category: 'KPAF', parish: 'Kariah Masjid Al-Amin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}004`, name: 'Aishah binti Ibrahim', ic: '840812062345', category: 'KPAF', parish: 'Kariah Masjid Al-Hidayah', activities: generateSimpleActivities(), _checked: false }
    ],
    'ET-ANUG': [
      { paId: `PA${year}001`, name: 'Ahmad bin Abdullah', ic: '800101011234', category: 'KPAK', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}002`, name: 'Mohd Zain bin Ismail', ic: '750315085678', category: 'KPAK', parish: 'Kariah Masjid Al-Amin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}003`, name: 'Siti Aminah binti Omar', ic: '820520149012', category: 'KPAF', parish: 'Kariah Masjid Al-Hidayah', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}004`, name: 'Abdul Rahman bin Hassan', ic: '780812063456', category: 'PAK', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}005`, name: 'Nor Azizah binti Ahmad', ic: '830615083456', category: 'PAF', parish: 'Kariah Masjid Al-Amin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}006`, name: 'Mohd Faiz bin Omar', ic: '790325127890', category: 'PAP', parish: 'Kariah Masjid Al-Hidayah', activities: generateSimpleActivities(), _checked: false }
    ],
    'ET-BANCIAN': [
      { paId: `PA${year}001`, name: 'Ahmad bin Abdullah', ic: '800101011234', category: 'KPAK', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}002`, name: 'Mohd Zain bin Ismail', ic: '750315085678', category: 'KPAK', parish: 'Kariah Masjid Al-Amin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}003`, name: 'Abdul Rahman bin Hassan', ic: '820520149012', category: 'KPAK', parish: 'Kariah Masjid Al-Hidayah', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}004`, name: 'Siti Aminah binti Omar', ic: '820520149012', category: 'KPAF', parish: 'Kariah Masjid Al-Hidayah', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}005`, name: 'Nor Azizah binti Ahmad', ic: '830615083456', category: 'PAF', parish: 'Kariah Masjid Al-Amin', activities: generateSimpleActivities(), _checked: false }
    ],
    'ET-KEMASKINI': [
      { paId: `PA${year}001`, name: 'Ahmad bin Abdullah', ic: '800101011234', category: 'KPAK', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}002`, name: 'Mohd Zain bin Ismail', ic: '750315085678', category: 'KPAK', parish: 'Kariah Masjid Al-Amin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}003`, name: 'Abdul Rahman bin Hassan', ic: '820520149012', category: 'KPAK', parish: 'Kariah Masjid Al-Hidayah', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}004`, name: 'Siti Aminah binti Omar', ic: '820520149012', category: 'KPAF', parish: 'Kariah Masjid Al-Hidayah', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}005`, name: 'Nor Azizah binti Ahmad', ic: '830615083456', category: 'PAF', parish: 'Kariah Masjid Al-Amin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}006`, name: 'Mohd Faiz bin Omar', ic: '790325127890', category: 'PAK', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false }
    ],
    'ANUG-KPAK': [
      { paId: `PA${year}001`, name: 'Ahmad bin Abdullah', ic: '800101011234', category: 'KPAK', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}002`, name: 'Mohd Zain bin Ismail', ic: '750315085678', category: 'KPAK', parish: 'Kariah Masjid Al-Amin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}003`, name: 'Abdul Rahman bin Hassan', ic: '820520149012', category: 'KPAK', parish: 'Kariah Masjid Al-Hidayah', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}004`, name: 'Mohd Faiz bin Omar', ic: '780812063456', category: 'KPAK', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}005`, name: 'Zulkifli bin Ahmad', ic: '790325127890', category: 'KPAK', parish: 'Kariah Masjid Al-Amin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}006`, name: 'Ahmad Fadzil bin Ibrahim', ic: '810415032345', category: 'KPAK', parish: 'Kariah Masjid Al-Hidayah', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}007`, name: 'Mohd Hafiz bin Zainal', ic: '760628096789', category: 'KPAK', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}008`, name: 'Abdul Aziz bin Mohd', ic: '830710150123', category: 'KPAK', parish: 'Kariah Masjid Al-Amin', activities: generateSimpleActivities(), _checked: false }
    ],
    'ANUG-PAK': [
      { paId: `PA${year}001`, name: 'Abdul Rahman bin Hassan', ic: '780812063456', category: 'PAK', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}002`, name: 'Ahmad Fadzil bin Ibrahim', ic: '810415032345', category: 'PAK', parish: 'Kariah Masjid Al-Hidayah', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}003`, name: 'Mohd Hafiz bin Zainal', ic: '830710150123', category: 'PAK', parish: 'Kariah Masjid Al-Amin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}004`, name: 'Mohd Rizal bin Kamal', ic: '840123168901', category: 'PAK', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}005`, name: 'Ahmad Zulkarnain bin Salleh', ic: '780215102345', category: 'PAK', parish: 'Kariah Masjid Al-Hidayah', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}006`, name: 'Abdul Aziz bin Mohd', ic: '770912074567', category: 'PAK', parish: 'Kariah Masjid Al-Amin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}007`, name: 'Mohd Faiz bin Omar', ic: '790325127890', category: 'PAK', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false }
    ],
    'ANUG-KPAF': [
      { paId: `PA${year}001`, name: 'Siti Aminah binti Omar', ic: '820520149012', category: 'KPAF', parish: 'Kariah Masjid Al-Hidayah', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}002`, name: 'Nor Azizah binti Ahmad', ic: '830615083456', category: 'KPAF', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}003`, name: 'Fatimah binti Hassan', ic: '810723127890', category: 'KPAF', parish: 'Kariah Masjid Al-Amin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}004`, name: 'Aishah binti Ibrahim', ic: '840812062345', category: 'KPAF', parish: 'Kariah Masjid Al-Hidayah', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}005`, name: 'Khadijah binti Zainal', ic: '800915036789', category: 'KPAF', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false }
    ],
    'ANUG-PAF': [
      { paId: `PA${year}001`, name: 'Nor Azizah binti Ahmad', ic: '830615083456', category: 'PAF', parish: 'Kariah Masjid Al-Amin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}002`, name: 'Khadijah binti Zainal', ic: '800915036789', category: 'PAF', parish: 'Kariah Masjid Al-Amin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}003`, name: 'Safiyyah binti Salleh', ic: '830330158901', category: 'PAF', parish: 'Kariah Masjid Al-Amin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}004`, name: 'Fatimah binti Ahmad', ic: '840920162345', category: 'PAF', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}005`, name: 'Aishah binti Hassan', ic: '820025146789', category: 'PAF', parish: 'Kariah Masjid Al-Amin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}006`, name: 'Zainab binti Ibrahim', ic: '830130150123', category: 'PAF', parish: 'Kariah Masjid Al-Hidayah', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}007`, name: 'Hafsah binti Zainal', ic: '810235124567', category: 'PAF', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}008`, name: 'Siti Aminah binti Omar', ic: '820520149012', category: 'PAF', parish: 'Kariah Masjid Al-Hidayah', activities: generateSimpleActivities(), _checked: false }
    ],
    'ANUG-PAP': [
      { paId: `PA${year}001`, name: 'Mohd Faiz bin Omar', ic: '790325127890', category: 'PAP', parish: 'Kariah Masjid Al-Hidayah', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}002`, name: 'Mohd Hafiz bin Zainal', ic: '830710150123', category: 'PAP', parish: 'Kariah Masjid Al-Hidayah', activities: generateSimpleActivities(), _checked: false }
    ],
    'ANUG-PAKPLUS': [
      { paId: `PA${year}001`, name: 'Fatimah binti Hassan', ic: '810723127890', category: 'PAK+', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}002`, name: 'Zainab binti Mohd', ic: '850110170123', category: 'PAK+', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}003`, name: 'Abdul Rahman bin Hassan', ic: '780812063456', category: 'PAK+', parish: 'Kariah Masjid Al-Amin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}004`, name: 'Ahmad Fadzil bin Ibrahim', ic: '810415032345', category: 'PAK+', parish: 'Kariah Masjid Al-Hidayah', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}005`, name: 'Mohd Rizal bin Kamal', ic: '840123168901', category: 'PAK+', parish: 'Kariah Masjid Al-Amin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}006`, name: 'Ahmad Zulkarnain bin Salleh', ic: '780215102345', category: 'PAK+', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}007`, name: 'Abdul Aziz bin Mohd', ic: '770912074567', category: 'PAK+', parish: 'Kariah Masjid Al-Hidayah', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}008`, name: 'Mohd Faiz bin Omar', ic: '790325127890', category: 'PAK+', parish: 'Kariah Masjid Al-Amin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}009`, name: 'Zulkifli bin Ahmad', ic: '760628096789', category: 'PAK+', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false }
    ]
  };
  
  // Return candidates for the specific type, or empty array if not found
  return mockData[type] || [];
}

// Simple activity generation - much simpler than before
function generateSimpleActivities() {
  const activityPool = [
    { name: 'Taklimat', count: 3 },
    { name: 'Kutipan Fitrah', count: 2 },
    { name: 'Agihan Tunai', count: 1 },
    { name: 'Mesyuarat Kariah', count: 4 },
    { name: 'Audit Tunai', count: 2 },
    { name: 'Program Komuniti', count: 3 },
    { name: 'Edaran Bantuan', count: 1 },
    { name: 'Bimbingan Asnaf', count: 2 }
  ];
  
  // Randomly select 3-5 activities
  const selectedCount = Math.floor(Math.random() * 3) + 3; // 3-5 activities
  const shuffled = [...activityPool].sort(() => 0.5 - Math.random());
  
  return shuffled.slice(0, selectedCount).map((activity, index) => ({
    id: `A${index + 1}`,
    name: activity.name,
    count: activity.count
  }));
}

// Helper function to get readable category filter text
function getCategoryFilterText() {
  const categoryMapping = {
    'ET-KPAK': ['KPAK'],
    'ET-KPAF': ['KPAF'],
    'ET-ANUG': ['PAK', 'KPAK', 'PAF', 'KPAF', 'PAP', 'PAK+'],
    'ET-BANCIAN': ['KPAK', 'KPAF', 'PAK', 'PAF'],
    'ET-KEMASKINI': ['KPAK', 'KPAF', 'PAK', 'PAF'],
    'ANUG-KPAK': ['KPAK'],         // Anugerah KPAK - only KPAK
    'ANUG-PAK': ['PAK'],           // Anugerah PAK - only PAK
    'ANUG-KPAF': ['KPAF'],         // Anugerah KPAF - only KPAF
    'ANUG-PAF': ['PAF'],           // Anugerah PAF - only PAF
    'ANUG-PAP': ['PAP'],           // Anugerah PAP - only PAP
    'ANUG-PAKPLUS': ['PAK+']       // Anugerah PAK+ - only PAK+
  };
  
  const allowedCategories = categoryMapping[query.type] || ['KPAK'];
  
  if (allowedCategories.length === 1) {
    return `${allowedCategories[0]} sahaja`;
  } else if (allowedCategories.length <= 3) {
    return allowedCategories.join(', ');
  } else {
    return `${allowedCategories.length} kategori (semua)`;
  }
}

/* === Load draft recipients dari localStorage === */
function loadDraftRecipients() {
  try {
    const year = route.query.year;
    const type = route.query.type;
    
    if (year && type) {
      const recipientsKey = `et:recipients:${year}:${type}`;
      
      const savedRecipients = localStorage.getItem(recipientsKey);
      
      if (savedRecipients) {
        const parsed = JSON.parse(savedRecipients);
        // Ensure all loaded recipients have _checked: false
        recipients.value = parsed.map(r => ({ ...r, _checked: false }));
      }
    }
  } catch (error) {
    // Fallback to empty recipients if loading fails
    recipients.value = [];
  }
}

/* === Dynamic category filtering based on allowance type === */
const baseRows = computed(() => {
  // Define which categories are allowed for each allowance type
  const categoryMapping = {
    'ET-KPAK': ['KPAK'],           // Elaun Tahunan KPAK - only KPAK
    'ET-KPAF': ['KPAF'],           // Elaun Tahunan KPAF - only KPAF  
    'ET-ANUG': ['PAK', 'KPAK', 'PAF', 'KPAF', 'PAP', 'PAK+'], // Anugerah - all categories
    'ET-BANCIAN': ['KPAK', 'KPAF', 'PAK', 'PAF'],
    'ET-KEMASKINI': ['KPAK', 'KPAF', 'PAK', 'PAF'],
    'ANUG-KPAK': ['KPAK'],         // Anugerah KPAK - only KPAK
    'ANUG-PAK': ['PAK'],           // Anugerah PAK - only PAK
    'ANUG-KPAF': ['KPAF'],         // Anugerah KPAF - only KPAF
    'ANUG-PAF': ['PAF'],           // Anugerah PAF - only PAF
    'ANUG-PAP': ['PAP'],           // Anugerah PAP - only PAP
    'ANUG-PAKPLUS': ['PAK+']       // Anugerah PAK+ - only PAK+
  };
  
  const allowedCategories = categoryMapping[query.type] || ['KPAK'];
  return candidates.value.filter(r => allowedCategories.includes(r.category));
});

/* baris yang boleh dipilih (tidak berada dalam recipients sedia ada) */
function isInRecipients(paId) {
  return recipients.value.some(r => r.paId === paId);
}

const filteredRows = computed(() => {
  const rows = baseRows.value;
  return rows;
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

function toggleSelectVisible(checked) {
  const v = checked;
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
    let allowance = 0;
    
    if (isFixedAllowance.value) {
      // Fixed allowance - cannot be edited
      allowance = fixedAllowanceValue.value;
    } else if (isEditableAllowance.value) {
      // Editable allowance - set to default value within range
      allowance = editableAllowanceRange.value.default;
    }
    
    if (!map.has(s.paId)) {
      map.set(s.paId, { ...s, allowance, _checked: false });
    }
  });
  recipients.value = Array.from(map.values());

  // bersihkan tick
  filteredRows.value.forEach(r => (r._checked = false));
}

/* Jenis elaun bertukar → set elaun tetap */
watch(() => query.type, () => {
  if (isFixedAllowance.value) {
    // Fixed allowance - set to fixed value
    recipients.value.forEach(r => (r.allowance = fixedAllowanceValue.value));
  } else if (isEditableAllowance.value) {
    // Editable allowance - set to default value within range
    recipients.value.forEach(r => (r.allowance = editableAllowanceRange.value.default));
  }
});

const totalAllowance = computed(() => recipients.value.reduce((sum, r) => sum + (Number(r.allowance) || 0), 0));
const canSubmit = computed(() => recipients.value.length > 0 && recipients.value.every(r => isFinite(r.allowance) && Number(r.allowance) >= 0));
const status = ref('DRAF');
const statusLabel = computed(() => status.value === 'MENUNGGU KELULUSAN' ? 'menunggu kelulusan' : status.value.toLowerCase());

// Computed property to show allowance type information
const allowanceTypeInfo = computed(() => {
  if (isFixedAllowance.value) {
    return `Elaun Tetap: RM${fixedAllowanceValue.value.toFixed(2)} (tidak boleh diubah)`;
  } else if (isEditableAllowance.value) {
    const { min, max, default: defaultValue } = editableAllowanceRange.value;
    return `Elaun Boleh Diubah: RM${min.toFixed(2)} - RM${max.toFixed(2)} (default: RM${defaultValue.toFixed(2)})`;
  }
  return 'Elaun: Boleh diubah';
});

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



/* Modal functions for submit confirmation */
function openSubmitModal() {
  if (!canSubmit.value) return;
  submitNotes.value = ''; // Start with empty notes
  showSubmitModal.value = true;
}

function closeSubmitModal() {
  showSubmitModal.value = false;
  submitNotes.value = '';
}

async function confirmSubmit() {
  // Validate budget constraints first
  if (!validateBudgetConstraints()) {
    return;
  }
  
  saving.value = true;
  try {
    await wait(600);
    status.value = 'MENUNGGU KELULUSAN';
    persistRecipients();
    persistCountAndStatusAndBack('MENUNGGU KELULUSAN');
    
    showSubmitModal.value = false;
    submitNotes.value = '';
    toast.success('Permohonan berjaya dihantar untuk kelulusan');
  } finally {
    saving.value = false;
  }
}

/* Hantar → status MENUNGGU KELULUSAN, persist & balik ke skrin 1 */
async function submitForApproval() {
  if (!canSubmit.value) return;
  
  // Validate budget constraints first
  if (!validateBudgetConstraints()) {
    return;
  }
  
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
  // Notes are now handled only in the submit modal
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

/* Load data + draft on first mount or when query changes */
watch(() => [query.year, query.type], () => seedData(), { immediate: true });

// Enhanced validation functions
function validateDuplicateRecipient(newRecipient) {
  // Find existing recipient with same IC, but exclude the current one being edited
  const existingRecipient = recipients.value.find(r => r.ic === newRecipient.ic && r.paId !== newRecipient.paId);
  if (existingRecipient) {
    return {
      valid: false,
      message: `Penerima dengan IC ${newRecipient.ic} sudah wujud dalam senarai`,
      severity: 'error'
    };
  }
  return { valid: true };
}

function validateRecipientData(recipient) {
  const errors = [];
  
  if (!recipient.name || recipient.name.trim().length < 2) {
    errors.push('Nama penerima mestilah sekurang-kurangnya 2 aksara');
  }
  
  if (!recipient.ic || !/^\d{12}$/.test(recipient.ic)) {
    errors.push('Nombor IC mestilah 12 digit');
  }
  
  if (!recipient.category) {
    errors.push('Kategori penerima diperlukan');
  }
  
  if (!recipient.parish) {
    errors.push('Kariah/daerah diperlukan');
  }
  
  if (recipient.allowance < 0) {
    errors.push('Elaun tidak boleh negatif');
  }
  
  // Range validation for editable allowances
  if (isEditableAllowance.value) {
    const { min, max } = editableAllowanceRange.value;
    if (recipient.allowance < min || recipient.allowance > max) {
      errors.push(`Elaun mestilah antara RM${min.toFixed(2)} hingga RM${max.toFixed(2)}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    message: errors.join('; ')
  };
}



function bulkDeselectAll() {
  filteredRows.value.forEach(r => r._checked = false);
}

function bulkAdjustAllowance(adjustment) {
  const selectedRecipients = filteredRows.value.filter(r => r._checked && !isInRecipients(r.paId));
  
  if (selectedRecipients.length === 0) {
    toast.warning('Tiada penerima dipilih untuk pelarasan elaun');
    return;
  }
  
  selectedRecipients.forEach(r => {
    const newAllowance = Math.max(0, (r.allowance || 0) + adjustment);
    r.allowance = newAllowance;
  });
  
  toast.success(`${selectedRecipients.length} penerima telah diselaraskan elaun`);
}

// Enhanced add recipient function
function addNewRecipient() {
  if (recipients.value.length >= 50) {
    toast.error('Maksimum 50 penerima dibenarkan setiap batch');
    return;
  }
  
  let defaultAllowance = 0;
  if (isFixedAllowance.value) {
    defaultAllowance = fixedAllowanceValue.value;
  } else if (isEditableAllowance.value) {
    defaultAllowance = editableAllowanceRange.value.default;
  }
  
  const newRecipient = {
    paId: `PA-${Date.now()}`,
    name: '',
    ic: '',
    category: '',
    parish: '',
    allowance: defaultAllowance,
    _isNew: true,
    _isEditing: true,
    _checked: false
  };
  
  recipients.value.push(newRecipient);
  
  // Scroll to the new recipient
  nextTick(() => {
    const lastRow = document.querySelector('tbody tr:last-child');
    if (lastRow) {
      lastRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

// Enhanced save recipient function
function saveRecipient(recipient) {
  const validation = validateRecipientData(recipient);
  if (!validation.valid) {
    toast.error(validation.message);
    return;
  }
  
  const duplicateCheck = validateDuplicateRecipient(recipient);
  if (!duplicateCheck.valid) {
    toast.error(duplicateCheck.message);
    return;
  }
  
  // Clean up original allowance value
  if (recipient._originalAllowance !== undefined) {
    delete recipient._originalAllowance;
  }
  
  recipient._isEditing = false;
  recipient._isNew = false;
  
  toast.success('Maklumat penerima berjaya disimpan');
}

// Enhanced remove recipient function
function removeRecipient(index) {
  const recipient = recipients.value[index];
  
  if (recipient._isNew) {
    // Remove new recipient immediately
    recipients.value.splice(index, 1);
    toast.success('Penerima baharu telah dibuang');
  } else {
    // Confirm removal for existing recipients
    if (confirm(`Adakah anda pasti mahu membuang ${recipient.name} dari senarai?`)) {
      recipients.value.splice(index, 1);
      toast.success('Penerima telah dibuang dari senarai');
    }
  }
}

// Cancel edit function
function cancelEdit(recipient) {
  // Revert allowance to original value
  if (recipient._originalAllowance !== undefined) {
    recipient.allowance = recipient._originalAllowance;
    delete recipient._originalAllowance;
  }
  recipient._isEditing = false;
  toast.info('Penyuntingan dibatalkan');
}
</script>

<style scoped>
/* gaya ringkas, ikut Tailwind */
</style>  