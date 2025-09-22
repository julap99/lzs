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
          <rs-table class="mt-4" :key="tableKey" :data="displayRows" :fields="fields" :pageSize="10"
            :options="{ variant: 'default', hover: true }">

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

            <!-- Status -->
            <template #statusData="{ text }">
              <rs-badge :variant="getStatusVariant(text)">{{ text }}</rs-badge>
            </template>

            <!-- tindakan column -->
            <template #tindakan="{ text: id }">
              <div class="flex justify-end gap-2">
                <rs-button type="button" variant="info-outline" size="sm" class="!px-3 !py-1"
                  @click="openKemaskiniById(id)">
                  Kemaskini
                </rs-button>
                <rs-button type="button" variant="primary" size="sm" class="!px-3 !py-1" @click="onHantarById(id)">
                  Hantar
                </rs-button>
              </div>
            </template>
          </rs-table>

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
            <rs-button variant="primary-outline" class="!px-5" @click="goBack">
              <Icon name="iconamoon:arrow-left-1" class="mr-1" />
              Kembali
            </rs-button>
          </div>
        </template>

      </RsCard>
    </div>
  </template>
<script setup>
import { ref, nextTick, computed } from "vue";
import { useToast } from "vue-toastification";
import RsCard from "~/components/RsCard.vue";
import RsModal from "~/components/RsModal.vue";

const toast = useToast();
const kemaskiniForm = ref(null)
const STORAGE_KEY = "shi-rows-v1";
const tableKey = ref(0);
const showFormModal = ref(false);
const editingIndex = ref(-1);

definePageMeta({ title: "Status Household / Individu" });

const breadcrumb = ref([
  { name: "Profiling", type: "link", path: "/BF-PRF/KF/SHI/admin" },
  { name: "Konfigurasi Status Household / Individu", type: "link", path: "/BF-PRF/KF/SHI/01_01/" },
  { name: "Kemaskini", type: "current", path: "/BF-PRF/KF/SHI/01_03" },
]);

function genId() {
  return (globalThis.crypto?.randomUUID?.())
    || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}
function ensureIds(arr) {
  let changed = false
  const withIds = (arr ?? []).map(r => {
    if (!r.id) changed = true
    return { id: r.id ?? genId(), ...r }
  })
  return { rows: withIds, changed }
}

function saveRows(arr) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  } catch (e) {
    console.warn("Failed to save rows:", e);
  }
}

const allowedKod = ({ value }) => {
  if (!value) return false
  return ['F', 'M', 'NFM', 'G', 'MM'].includes(String(value).toUpperCase())
}

const allowedNama = ({ value }) => {
  if (!value) return false
  return ['Fakir', 'Miskin', 'NonFakir Miskin', 'Gharimin', 'Muallaf'].includes(String(value))
}

const fields = [
  { key: 'kod', label: 'Kod' },
  { key: 'nama', label: 'Nama' },
  { key: 'keterangan', label: 'Keterangan' },
  { key: 'jenis', label: 'Jenis' },
  { key: 'julatMin', label: 'Julat Min (%)' },
  { key: 'julatMax', label: 'Julat Max (%)' },
  { key: 'tarikhMula', label: 'Tarikh Mula' },
  { key: 'tarikhTamat', label: 'Tarikh Tamat' },
  { key: 'statusData', label: 'Status Data' },
  { key: 'tindakan', label: 'Tindakan' },
];

// Hardcoded rows
const demo_rows = [
  { kod: "F", nama: "Fakir", keterangan: "Kategori Fakir", jenis: "Household", julatMin: 0, julatMax: 49.9, tarikhMula: "2026-01-01", tarikhTamat: "", statusData: "Draf", statusAktif: "Aktif", tindakan: true },
  { kod: "M", nama: "Miskin", keterangan: "Kategori Miskin", jenis: "Household", julatMin: 50, julatMax: 100, tarikhMula: "2026-01-01", tarikhTamat: "", statusData: "Draf", statusAktif: "Tidak Aktif", tindakan: true },
  { kod: "NFM", nama: "NonFM", keterangan: "Kategori Non Fakir Miskin", jenis: "Household", julatMin: 100.1, julatMax: 9999.99, tarikhMula: "2026-01-01", tarikhTamat: "", statusData: "Tolak", statusAktif: "Tidak Aktif", tindakan: true },
  { kod: "G", nama: "Gharimin", keterangan: "Kategori Orang Yang Berhutang Untuk Keperluan", jenis: "Individu", julatMin: "", julatMax: "", tarikhMula: "1/1/2026", tarikhTamat: "", statusData: "Lulus", statusAktif: "Aktif", tindakan: true },
  { kod: "F", nama: "Fakir", keterangan: "Kategori Fakir", jenis: "Individu", julatMin: 0, julatMax: 49.9, tarikhMula: "2026-01-01", tarikhTamat: "", statusData: "Tolak", statusAktif: "Aktif", tindakan: true },
  { kod: "M", nama: "Miskin", keterangan: "Kategori Miskin", jenis: "Individu", julatMin: 50, julatMax: 100, tarikhMula: "2026-01-01", tarikhTamat: "", statusData: "Draf", statusAktif: "Tidak Aktif", tindakan: true },
];

function loadRows() {
  try {
    return JSON.parse(localStorage.getItem("shi-rows-v1") || "[]") ?? [];
  } catch {
    return [];
  }
}

const stored = loadRows();
let normalized = ensureIds(stored);

if (!normalized.rows.length) {
  normalized = ensureIds(demo_rows);
  saveRows(normalized.rows);
} else if (normalized.changed) {
  saveRows(normalized.rows);
}

const rows = ref(normalized.rows);

function scrollToFirstError() {
  nextTick(() => {
    const formEl = kemaskiniForm.value?.node?.el;
    if (!formEl) return;

    // your inner scrollable container
    const scroller = formEl.querySelector('.overflow-y-auto') || formEl;

    // find the first invalid field
    const invalidEl =
      formEl.querySelector('[data-invalid="true"]') ||
      formEl.querySelector('.formkit-message[data-message-type="validation"]');

    if (!invalidEl) return;

    // scroll the scroller so the invalid field is nicely centered
    const target = invalidEl.closest('.formkit-outer') || invalidEl;
    const sRect = scroller.getBoundingClientRect();
    const tRect = target.getBoundingClientRect();
    scroller.scrollTop += (tRect.top - sRect.top) - 24; 

    // try to focus an input for accessibility
    const focusable =
      target.querySelector('input, textarea, select, [tabindex]:not([tabindex="-1"])');
    focusable?.focus({ preventScroll: true });
  });
}

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
    case "Lulus":
      return "success";
    case "Draf":
      return "warning";
    case "Tolak":
      return "danger";
    default:
      return "default";
  }
}

const displayRows = computed(() =>
  rows.value.map((r, idx) => ({
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

function toInputDate(v) {
  if (!v) return "";
  const d = v.includes("-")
    ? new Date(v)
    : new Date(v.replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/, "$3-$2-$1"));
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const modalData = ref({
  kod: "",
  nama: "",
  keterangan: "",
  jenis: "",
  julatMin: "",
  julatMax: "",
  tarikhMula: "",
  tarikhTamat: "",
  statusAktif: "",
  statusData: "",
});

const jenisOptions = [
  { label: "Household", value: "Household" },
  { label: "Individu", value: "Individu" },
];

const greaterThanMin = ({ value }) => {
  const min = Number(modalData.value.julatMin ?? 0);
  return Number(value) > min;
};
const tamatSelepasMula = ({ value }) => {
  const start = modalData.value.tarikhMula;
  if (!start || !value) return false;
  return new Date(value) >= new Date(start);
};

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

function closeModal() {
  showFormModal.value = false;
}

function refreshTable() {
  tableKey.value++;
}

async function onKemaskini() {
  const idx = editingIndex.value;

  if (idx < 0 || idx >= rows.value.length) {
    toast.error("Ralat dalam mengemaskini rekod.", {
      timeout: 4000,
      closeOnClick: true,
    });
    return;
  }

  rows.value[idx] = { ...rows.value[idx], ...modalData.value, id: rows.value[idx].id };
  saveRows(rows.value);
  refreshTable();

  toast.success("Rekod berjaya dikemaskini.", {
    timeout: 3000,
  });
  closeModal();
}

function onHantarById(id) {
  try {
    const item = rows.value.find(r => r.id === id);
    if (!item) throw new Error("Item tidak wujud");
    toast.success(`Rekod ${item.nama} dihantar untuk kelulusan.`, { timeout: 3000 });
    setTimeout(() => navigateTo("/BF-PRF/KF/SHI/01_01"), 1200);
  } catch (err) {
    console.error("Hantar error:", err);
    toast.error("Ralat dalam menghantar rekod untuk kelulusan.", { timeout: 4000, closeOnClick: true });
  }
}

function goBack() {
  history.back();
}
</script>
