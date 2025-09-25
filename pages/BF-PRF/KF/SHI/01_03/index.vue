  <template>
    <div>
      <LayoutsBreadcrumb :items="breadcrumb" />

      <RsCard class="mt-4">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Status Household / Individu</h2>
          </div>
        </template>

        <template #body>
          <rs-table class="mt-4" :key="tableKey" :data="pagedRows" :fields="fields"
            :pageSize="Math.max(1, pagedRows.length)" :options="{ variant: 'default', hover: true, pagination: false }">

            <!-- Kod -->
            <template #kod="{ text }">
              {{ text }}
            </template>

            <!-- Nama -->
            <template #nama="{ text }">
              {{ text }}
            </template>

            <!-- Keterangan -->
            <template #keterangan="{ text }">
              {{ text }}
            </template>

            <!-- Jenis -->
            <template #jenis="{ text }">
              <rs-badge variant="info">{{ text }}</rs-badge>
            </template>

            <!-- Julat Min / Max -->
            <template #julatMin="{ text }">
              {{ text }}
            </template>
            <template #julatMax="{ text }">
              {{ text }}
            </template>

            <!-- Tarikh -->
            <template #tarikhMula="{ text }">
              <span class="font-medium">{{ formatDate(text) }}</span>
            </template>
            <template #tarikhTamat="{ text }">
              <span class="font-medium">{{ formatDate(text) }}</span>
            </template>

            <!-- Status Data -->
            <template #statusData="{ text }">
              <rs-badge :variant="getStatusVariant(text)">{{ text }}</rs-badge>
            </template>

            <!-- tindakan column -->
            <template #tindakan="{ text: id }">
              <div class="flex justify-end gap-2">
                <rs-button type="button" variant="info" size="sm" class="!px-3 !py-1" @click="openKemaskiniById(id)">
                  Kemaskini
                </rs-button>
                <rs-button type="button" variant="primary" size="sm" class="!px-3 !py-1" @click="onHantarById(id)">
                  Hantar
                </rs-button>
              </div>
            </template>
          </rs-table>
          <div class="flex items-center justify-between mt-3">
            <div class="text-sm text-gray-500">
              Menunjukkan {{ totalRecords ? startIndex + 1 : 0 }} hingga {{ endIndex }} daripada {{ totalRecords }}
              entri
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

          <!-- RsModal for Kemaskini -->
          <RsModal v-model="showFormModal" :title="`Kemaskini ${modalData?.nama ?? ''}`" class="max-w-4xl w-full">
            <template #default>

              <FormKit type="form" ref="kemaskiniForm" :actions="false"
                :incomplete-message="'Sila isi semua ruangan yang diperlukan'"
                :config="{ validationVisibility: 'submit' }" @submit="onKemaskini" @submit-invalid="scrollToFirstError">
                <div class="max-h-[70vh] overflow-y-auto px-6 py-5 space-y-6 [scrollbar-gutter:stable]">
                  <div class="grid grid-cols-12 gap-5">

                    <!-- Kod -->
                    <FormKit type="text" name="kod" label="Kod" validation="required|allowedKod"
                      :validation-rules="{ allowedKod }" :validation-messages="{
                        required: 'Kod tidak boleh kosong',
                        allowedKod: 'Kod mesti salah satu daripada: F, M, NFM, G, MM'
                      }" v-model="modalData.kod" :classes="{
                        outer: 'col-span-12 md:col-span-6',
                        wrapper: 'w-full',
                        inner: 'w-full',
                        input: 'formkit-input w-full data-[invalid]:ring-1 data-[invalid]:ring-red-500 data-[invalid]:border-red-500',
                        message: 'text-red-600 text-sm mt-1'
                      }" />

                    <!-- Nama -->
                    <FormKit type="text" name="nama" label="Nama" validation="required|allowedNama"
                      :validation-rules="{ allowedNama }" :validation-messages="{
                        required: 'Nama tidak boleh kosong',
                        allowedNama: 'Nama mesti salah satu daripada: Fakir, Miskin, NonFakir Miskin, Gharimin, Muallaf'
                      }" v-model="modalData.nama" :classes="{
                        outer: 'col-span-12 md:col-span-6',
                        wrapper: 'w-full',
                        inner: 'w-full',
                        input: 'formkit-input w-full data-[invalid]:ring-1 data-[invalid]:ring-red-500 data-[invalid]:border-red-500',
                        message: 'text-red-600 text-sm mt-1'
                      }" />

                    <!-- Keterangan + Jenis -->
                    <FormKit type="textarea" name="keterangan" label="Keterangan" rows="4"
                      v-model="modalData.keterangan" validation="required"
                      :validation-messages="{ required: 'Keterangan tidak boleh kosong' }" :classes="{
                        outer: 'col-span-12 md:col-span-6',
                        input:
                          'formkit-input w-full data-[invalid]:ring-1 data-[invalid]:ring-red-500 data-[invalid]:border-red-500',
                        message: 'text-red-600 text-sm mt-1'
                      }" />
                    <div class="col-span-12 md:col-span-4 h-full grid place-content-center">
                      <FormKit type="select" name="jenis" label="Jenis" placeholder="Pilih jenis"
                        :options="jenisOptions" validation="required"
                        :validation-messages="{ required: 'Sila pilih jenis' }" v-model="modalData.jenis" :classes="{
                          outer: 'm-0 w-full',
                          wrapper: 'w-full',
                          inner: 'w-full',
                          input:
                            'w-full data-[invalid]:ring-1 data-[invalid]:ring-red-500 data-[invalid]:border-red-500',
                          message: 'text-red-600 text-sm mt-1'
                        }" />
                    </div>

                    <!-- Julat Min -->
                    <FormKit type="number" name="julatMin" label="Julat Min (%)" v-model="modalData.julatMin"
                      validation="required|number|min:0|max:100.1" :validation-messages="{
                        required: 'Julat Min diperlukan',
                        number: 'Nilai mesti nombor',
                        min: 'Tidak boleh kurang dari 0',
                        max: 'Tidak boleh melebihi 100.1'
                      }" :attrs="{ step: '0.1', placeholder: '0' }" :classes="{
                        outer: 'col-span-12 md:col-span-6',
                        input:
                          'formkit-input w-full data-[invalid]:ring-1 data-[invalid]:ring-red-500 data-[invalid]:border-red-500',
                        message: 'text-red-600 text-sm mt-1'
                      }" />

                    <!-- Julat Max -->
                    <FormKit type="number" name="julatMax" label="Julat Max (%)" v-model="modalData.julatMax"
                      validation="required|number|min:0|max:9999.99|greaterThanMin"
                      :validation-rules="{ greaterThanMin }" :validation-messages="{
                        required: 'Julat Max diperlukan',
                        number: 'Nilai mesti nombor',
                        min: 'Tidak boleh kurang dari 0',
                        max: 'Tidak boleh melebihi 9999.99',
                        greaterThanMin: 'Julat Max mesti lebih besar daripada Julat Min'
                      }" :attrs="{ step: '0.1', placeholder: '100' }" :classes="{
                        outer: 'col-span-12 md:col-span-6',
                        input:
                          'formkit-input w-full data-[invalid]:ring-1 data-[invalid]:ring-red-500 data-[invalid]:border-red-500',
                        message: 'text-red-600 text-sm mt-1'
                      }" />

                    <!-- Status -->
                    <div class="col-span-12 md:col-span-6">
                      <label class="block font-semibold mb-2">Status</label>
                      <FormKit type="radio" name="statusAktif" :options="[
                        { label: 'Aktif', value: 'Aktif' },
                        { label: 'Tidak Aktif', value: 'Tidak Aktif' }
                      ]" v-model="modalData.statusAktif" validation="required"
                        :validation-messages="{ required: 'Sila pilih status' }"
                        :classes="{ options: 'flex flex-col gap-3', option: 'flex items-center gap-2', message: 'text-red-600 text-sm mt-1' }" />
                    </div>

                    <!-- Status Data -->
                    <div class="col-span-12 md:col-span-6">
                      <label class="block font-semibold mb-2">Status Data</label>
                      <FormKit type="radio" name="statusData" :options="[
                        { label: 'Draf', value: 'Draf' },
                        { label: 'Lulus', value: 'Lulus' },
                        { label: 'Tolak', value: 'Tolak' }
                      ]" v-model="modalData.statusData" validation="required"
                        :validation-messages="{ required: 'Sila pilih status data' }"
                        :classes="{ options: 'flex flex-col gap-3', option: 'flex items-center gap-2', message: 'text-red-600 text-sm mt-1' }" />
                    </div>

                    <!-- Tarikh -->
                    <FormKit type="date" name="tarikhMula" label="Tarikh Mula" v-model="modalData.tarikhMula"
                      validation="required|date" validation-visibility="dirty"
                      :validation-messages="{ required: 'Tarikh Mula diperlukan', date: 'Tarikh tidak sah' }" :classes="{
                        outer: 'col-span-12 md:col-span-6',
                        input:
                          'formkit-input w-full data-[invalid]:ring-1 data-[invalid]:ring-red-500 data-[invalid]:border-red-500',
                        message: 'text-red-600 text-sm mt-1'
                      }" />

                    <FormKit type="date" name="tarikhTamat" label="Tarikh Tamat" v-model="modalData.tarikhTamat"
                      validation="date|tamatSelepasMula" :validation-rules="{ tamatSelepasMula }"
                      validation-visibility="dirty" :validation-messages="{
                        required: 'Tarikh Tamat diperlukan',
                        date: 'Tarikh tidak sah',
                        tamatSelepasMula: 'Tarikh tamat mesti pada atau selepas tarikh mula'
                      }" :attrs="{ min: modalData.tarikhMula || undefined }" :classes="{
                        outer: 'col-span-12 md:col-span-6',
                        input:
                          'formkit-input w-full data-[invalid]:ring-1 data-[invalid]:ring-red-500 data-[invalid]:border-red-500',
                        message: 'text-red-600 text-sm mt-1'
                      }" />
                  </div>

                </div>
              </FormKit>
            </template>

            <template #footer>
              <RsButton variant="primary-outline" @click="closeModal">Batal</RsButton>
              <RsButton type="button" variant="primary" @click="kemaskiniForm?.node?.submit()">
                <Icon name="ic:outline-edit" class="mr-1" /> Kemaskini
              </RsButton>
            </template>
          </RsModal>

          <!-- Bottom actions -->
          <div class="flex justify-end mt-6">
            <rs-button variant="primary" class="!px-5" @click="goBack">
              <Icon name="iconamoon:arrow-left-1" class="mr-1" />
              Kembali
            </rs-button>
          </div>
        </template>

      </RsCard>
    </div>
  </template>
<script setup>
import { ref, computed, nextTick, watch, onMounted } from "vue";
import { useToast } from "vue-toastification";
import RsCard from "~/components/RsCard.vue";
import RsModal from "~/components/RsModal.vue";

definePageMeta({ title: "Status Household / Individu" });

const toast = useToast();
const kemaskiniForm = ref(null);
const tableKey = ref(0);
const showFormModal = ref(false);
const editingIndex = ref(-1);

const STORAGE_KEY = "shi-rows-v1";
const APPROVALS_STORAGE_KEY = "shi-approvals-v1";

/* ----------------------- storage helpers ----------------------- */
function genId() {
  return (globalThis.crypto?.randomUUID?.())
    || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
function ensureIds(arr) {
  let changed = false;
  const withIds = (arr ?? []).map(r => {
    if (!r?.id) changed = true;
    return { id: r?.id ?? genId(), ...r };
  });
  return { rows: withIds, changed };
}
function loadRows() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
function saveRows(arr) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); }
  catch (e) { console.warn("Failed to save rows:", e); }
}

const rows = ref([]);

// client-only load; no seeding
onMounted(() => {
  const loaded = loadRows();
  const normalized = ensureIds(loaded);
  rows.value = normalized.rows;
  if (normalized.changed) saveRows(normalized.rows); // backfill ids only
});

/* ----------------------------- UI helpers ---------------------------- */
const breadcrumb = ref([
  { name: "Profiling", type: "link", path: "/BF-PRF/KF/SHI/admin" },
  { name: "Konfigurasi Status Household / Individu", type: "link", path: "/BF-PRF/KF/SHI/01_01/" },
  { name: "Kemaskini", type: "current", path: "/BF-PRF/KF/SHI/01_03" },
]);

const fields = [
  { key: "kod", label: "Kod" },
  { key: "nama", label: "Nama" },
  { key: "keterangan", label: "Keterangan" },
  { key: "jenis", label: "Jenis" },
  { key: "julatMin", label: "Julat Min (%)" },
  { key: "julatMax", label: "Julat Max (%)" },
  { key: "tarikhMula", label: "Tarikh Mula" },
  { key: "tarikhTamat", label: "Tarikh Tamat" },
  { key: "statusData", label: "Status Data" },
  { key: "tindakan", label: "Tindakan" },
];

const allowedKod = ({ value }) => !!value && ['F', 'M', 'NFM', 'G', 'MM'].includes(String(value).toUpperCase());
const allowedNama = ({ value }) => !!value && ['Fakir', 'Miskin', 'NonFakir Miskin', 'Gharimin', 'Muallaf'].includes(String(value));

function formatDate(value) {
  if (!value) return "";
  const d = value.includes("-")
    ? new Date(value)
    : new Date(value.replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/, "$3-$2-$1"));
  if (Number.isNaN(d.getTime())) return value;
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}
function getStatusVariant(status) {
  switch (status) {
    case "Lulus": return "success";
    case "Draf": return "warning";
    case "Tolak": return "danger";
    default: return "default";
  }
}

/* -------------------- data rendered in table -------------------- */
const displayRows = computed(() =>
  (rows.value ?? []).map(r => ({
    kod: r.kod,
    nama: r.nama,
    keterangan: r.keterangan ?? "",
    jenis: r.jenis,
    julatMin: r.julatMin ?? "",
    julatMax: r.julatMax ?? "",
    tarikhMula: r.tarikhMula,
    tarikhTamat: r.tarikhTamat,
    statusData: r.statusData,
    tindakan: r.id,
  }))
);

/* ----------------------------- Pagination ---------------------------- */
const pageSize = 10;
const currentPage = ref(1);
const totalRecords = computed(() => (displayRows.value ?? []).length);
const totalPages = computed(() => Math.max(1, Math.ceil(totalRecords.value / pageSize)));
const startIndex = computed(() => (currentPage.value - 1) * pageSize);
const endIndex = computed(() => Math.min(startIndex.value + pageSize, totalRecords.value));
const pagedRows = computed(() => (displayRows.value ?? []).slice(startIndex.value, endIndex.value));

function prevPage() { if (currentPage.value > 1) currentPage.value--; }
function nextPage() { if (currentPage.value < totalPages.value) currentPage.value++; }
watch(totalRecords, () => { currentPage.value = 1; tableKey.value++; });

/* ------------------------------ Modal / Form ------------------------- */
const modalData = ref({
  kod: "", nama: "", keterangan: "", jenis: "",
  julatMin: "", julatMax: "", tarikhMula: "", tarikhTamat: "",
  statusAktif: "", statusData: "",
});

const jenisOptions = [
  { label: "Household", value: "Household" },
  { label: "Individu", value: "Individu" },
];

const greaterThanMin = ({ value }) => Number(value) > Number(modalData.value.julatMin ?? 0);
const tamatSelepasMula = ({ value }) => {
  const start = modalData.value.tarikhMula;
  if (!start || !value) return false;
  return new Date(value) >= new Date(start);
};

function toInputDate(v) {
  if (!v) return "";
  const d = v.includes("-")
    ? new Date(v)
    : new Date(v.replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/, "$3-$2-$1"));
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function openKemaskiniById(id) {
  const idx = rows.value.findIndex(r => r.id === id);
  if (idx === -1) return;
  editingIndex.value = idx;
  const row = rows.value[idx];
  modalData.value = {
    ...row,
    statusAktif: (row.statusAktif ?? "").trim(),
    tarikhMula: toInputDate(row.tarikhMula),
    tarikhTamat: toInputDate(row.tarikhTamat),
  };
  showFormModal.value = true;
}
function closeModal() { showFormModal.value = false; }
function refreshTable() { tableKey.value++; }

async function onKemaskini() {
  const idx = editingIndex.value;
  if (idx < 0 || idx >= rows.value.length) {
    toast.error("Ralat dalam mengemaskini rekod.", { timeout: 4000, closeOnClick: true });
    return;
  }
  rows.value[idx] = { ...rows.value[idx], ...modalData.value, id: rows.value[idx].id };
  saveRows(rows.value);
  refreshTable();
  toast.success("Rekod berjaya dikemaskini.", { timeout: 3000 });
  closeModal();
}

function onHantarById(id) {
  try {
    const item = rows.value.find(r => r.id === id);
    if (!item) throw new Error("Item tidak wujud");

    enqueueApproval({ entryId: id, nama: item.nama });

    toast.success(`Rekod ${item.nama} dihantar untuk kelulusan.`, { timeout: 3000 });
    setTimeout(() => navigateTo("/BF-PRF/KF/SHI/01_01/"), 800);
  } catch (err) {
    console.error("Hantar error:", err);
    toast.error("Ralat dalam menghantar rekod untuk kelulusan.", { timeout: 4000, closeOnClick: true });
  }
}

function goBack() { history.back(); }

function scrollToFirstError() {
  nextTick(() => {
    const formEl = kemaskiniForm.value?.node?.el;
    if (!formEl) return;
    const scroller = formEl.querySelector(".overflow-y-auto") || formEl;
    const invalidEl =
      formEl.querySelector('[data-invalid="true"]') ||
      formEl.querySelector('.formkit-message[data-message-type="validation"]');
    if (!invalidEl) return;
    const target = invalidEl.closest(".formkit-outer") || invalidEl;
    const sRect = scroller.getBoundingClientRect();
    const tRect = target.getBoundingClientRect();
    scroller.scrollTop += (tRect.top - sRect.top) - 24;
    const focusable = target.querySelector("input, textarea, select, [tabindex]:not([tabindex='-1'])");
    focusable?.focus({ preventScroll: true });
  });
}

function loadApprovals() {
  try {
    const raw = localStorage.getItem(APPROVALS_STORAGE_KEY);
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
function saveApprovals(arr) {
  try { localStorage.setItem(APPROVALS_STORAGE_KEY, JSON.stringify(arr)); }
  catch (e) { console.warn("Failed to save approvals:", e); }
}


function enqueueApproval({ entryId, nama }) {
  const approvals = loadApprovals();
  const now = new Date();
  const already = approvals.some(a => a.entryId === entryId && a.status === "Menunggu");
  if (already) return;

  approvals.push({
    id: genId(),
    entryId,
    header: "Kelulusan Status Household/Individu",
    message: "Status Household/Individu perlu kelulusan",
    status: "Menunggu",
    createdAt: now.toISOString(),
    // table display fields
    kod: rows.value.find(r => r.id === entryId)?.kod ?? "-",
    nama: nama ?? rows.value.find(r => r.id === entryId)?.nama ?? "-",
    jenis: rows.value.find(r => r.id === entryId)?.jenis ?? "-",
    tarikhMula: rows.value.find(r => r.id === entryId)?.tarikhMula ?? "",
    statusData: rows.value.find(r => r.id === entryId)?.statusData ?? "",
    keterangan: rows.value.find(r => r.id === entryId)?.keterangan ?? "",
    statusAktif: rows.value.find(r => r.id === entryId)?.statusAktif ?? "",
    julatMin: rows.value.find(r => r.id === entryId)?.julatMin ?? "",
    julatMax: rows.value.find(r => r.id === entryId)?.julatMax ?? "",
    tarikhTamat: rows.value.find(r => r.id === entryId)?.tarikhTamat ?? "",
  });
  saveApprovals(approvals);
}

</script>


