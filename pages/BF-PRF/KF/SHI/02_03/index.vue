<template>
    <LayoutsBreadcrumb :items="breadcrumb" />
    <RsCard class="mt4">
        <template #header>
            <div class="flex justify-between items-center">
                <h2 class="text-xl font-semibold">Kelulusan</h2>
            </div>
        </template>

        <template #body>
            <!-- Approval form -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Status Kelulusan -->
                <div class="lg:col-span-2">
                    <label class="block font-semibold mb-2">Status Kelulusan</label>

                    <div class="flex items-center gap-8">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="radio" class="success" name="statusKelulusan" value="Lulus"
                                v-model="form.statusKelulusan"
                                :class="validateOnSubmit && !form.statusKelulusan ? 'ring-2 ring-red-500 rounded-full' : ''" />
                            <rs-badge variant="success">Lulus</rs-badge>
                        </label>

                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="radio" class="danger" name="statusKelulusan" value="Tolak"
                                v-model="form.statusKelulusan"
                                :class="validateOnSubmit && !form.statusKelulusan ? 'ring-2 ring-red-500 rounded-full' : ''" />
                            <rs-badge variant="danger">Tolak</rs-badge>
                        </label>
                    </div>
                    <p v-if="validateOnSubmit && !form.statusKelulusan" class="text-red-600 text-sm mt-2 mb-2">
                        Sila pilih status kelulusan.
                    </p>


                </div>


                <!-- Catatan -->
                <div class="lg:col-span-2">
                    <label class="block font-semibold mb-2">Catatan</label>
                    <textarea v-model="form.catatan" rows="4"
                        class="w-full rounded-md border px-3 py-2 outline-none focus:ring"
                        placeholder="Masukkan catatan (jika ada)"></textarea>
                </div>

                <!-- Tarikh Lulus -->
                <div>
                    <label class="block font-semibold mb-2">Tarikh Lulus</label>
                    <div class="py-2 px-3 rounded-md bg-gray-50">
                        {{ formatDate(form.tarikhLulus) }}
                    </div>
                </div>

                <!-- Nama Pelulus -->
                <div>
                    <label class="block font-semibold mb-2">Nama Pelulus</label>
                    <div class="py-2 px-3 rounded-md bg-gray-50">
                        {{ form.namaPelulus }}
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="mt-6 flex items-center justify-between">
                <rs-button variant="primary-outline" class="!px-5" @click="goBack">
                    <Icon name="iconamoon:arrow-left-1" class="mr-1" /> Kembali
                </rs-button>

                <div class="flex items-center gap-3">
                    <rs-button variant="primary-outline" class="!px-5" @click="onSimpanDraf">
                        <Icon name="material-symbols:save-outline" class="mr-1" /> Simpan Draf
                    </rs-button>
                    <rs-button variant="primary" class="!px-5" @click="onHantar">
                        <Icon name="iconamoon:location" />
                        Hantar
                    </rs-button>
                </div>
            </div>
        </template>
    </RsCard>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";

definePageMeta({ title: "Konfigurasi Status Household / Individu", middleware: ["auth", "approver"]
 });

/* ----------------- UI basics ----------------- */
const breadcrumb = ref([
  { name: "Profiling", type: "link", path: "/BF-PRF/KF/SHI/admin" },
  { name: "Konfigurasi Status Household / Individu", type: "link", path: "/BF-PRF/KF/SHI/02_01/" },
  { name: "Kelulusan Status Household / Individu", type: "current", path: "/BF-PRF/KF/SHI/02_03" },
]);

const toast = useToast();
const validateOnSubmit = ref(false);

/* ----------------- ids & utils ----------------- */
const genId = () =>
  (globalThis.crypto?.randomUUID?.()) || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const entryId = ref(null);
function getEntryIdFromQuery() {
  try {
    const qs = new URLSearchParams(window.location.search);
    return qs.get("entryId");
  } catch {
    return null;
  }
}

function todayISO() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
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

/* ----------------- form model ----------------- */
const form = ref({
  statusKelulusan: "",   // "Lulus" | "Tolak"
  catatan: "",
  tarikhLulus: todayISO(),
  namaPelulus: "pelulus01",
});

/* ----------------- storage helpers ----------------- */
const APPROVALS_STORAGE_KEY = "shi-approvals-v1";
function loadApprovals() {
  try {
    const raw = localStorage.getItem(APPROVALS_STORAGE_KEY);
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
function saveApprovals(list) {
  localStorage.setItem(APPROVALS_STORAGE_KEY, JSON.stringify(list));
}

/** Create or update the record for this entryId */
function upsertApproval(fields) {
  const list = loadApprovals();
  const idxByEntry = list.findIndex((a) => a.entryId === entryId.value);
  const idxById = list.findIndex((a) => a.id === entryId.value);
  const idx = idxByEntry >= 0 ? idxByEntry : idxById;

  if (idx >= 0) {
    list[idx] = { ...list[idx], ...fields };
  } else {
    list.push({
      id: genId(),
      entryId: entryId.value,
      status: "Menunggu",
      ...fields,
    });
  }
  saveApprovals(list);
}

/* ----------------- actions ----------------- */
function onSimpanDraf() {
  validateOnSubmit.value = false;

  upsertApproval({
    status: "Menunggu",
    statusKelulusan: form.value.statusKelulusan || "",
    catatan: form.value.catatan,
    tarikhLulus: form.value.tarikhLulus,
    namaPelulus: form.value.namaPelulus,
    draft: true,
  });

  toast.success("Draf berjaya disimpan.", { timeout: 2500 });
  setTimeout(() => navigateTo("/BF-PRF/KF/SHI/02_01"), 800);
}

function onHantar() {
  validateOnSubmit.value = true;
  if (!form.value.statusKelulusan) {
    toast.error("Sila pilih status kelulusan!", { timeout: 3000 });
    return;
  }

  upsertApproval({
    status: form.value.statusKelulusan,       // "Lulus" | "Tolak"
    statusKelulusan: form.value.statusKelulusan,
    catatan: form.value.catatan,
    tarikhLulus: form.value.tarikhLulus,
    namaPelulus: form.value.namaPelulus,
    draft: false,
  });

  toast.success("Kelulusan berjaya dihantar.", { timeout: 2500 });
  history.back();
}

function goBack() { history.back(); }

/* ----------------- prefill on load ----------------- */
onMounted(() => {
  entryId.value = getEntryIdFromQuery();
  if (!entryId.value) return;

  const list = loadApprovals();
  const rec =
    list.find((a) => a.entryId === entryId.value) ||
    list.find((a) => a.id === entryId.value);

  if (rec) {
    form.value.statusKelulusan =
      rec.status === "Lulus" || rec.status === "Tolak"
        ? rec.status
        : (rec.statusKelulusan || "");
    form.value.catatan = rec.catatan || "";
    form.value.tarikhLulus = rec.tarikhLulus || todayISO();
    form.value.namaPelulus = rec.namaPelulus || form.value.namaPelulus;
  }
});
</script>


