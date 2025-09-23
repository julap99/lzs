<template>
    <LayoutsBreadcrumb :items="breadcrumb" />
    <RsCard class="mt4">
        <template #header>
            <div class="flex justify-between items-center">
                <h2 class="text-xl font-semibold">
                    Senarai Maklumat Status Household / Individu
                </h2>

                <rs-badge v-if="pendingApprovalCount > 0" variant="warning" class="text-sm">
                    <Icon name="mdi:clock-outline" class="mr-1" />
                    {{ pendingApprovalCount }} Permohonan Menunggu
                </rs-badge>
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

                <template #tindakan="{ text: entryId }">
                    <div class="inline-flex items-center gap-2 whitespace-nowrap">
                        <rs-button variant="primary" size="sm" class="!px-3 !py-1" @click="openLihat(entryId)">
                            Lihat
                        </rs-button>
                        <rs-button variant="primary" size="sm" class="!px-3 !py-1" @click="openKelulusan(entryId)">
                            Kelulusan
                        </rs-button>
                    </div>
                </template>

            </rs-table>
            <div class="flex items-center justify-between mt-3">
                <div class="text-sm text-gray-500">
                    Menunjukkan {{ totalRecords ? startIndex + 1 : 0 }} hingga {{ endIndex }} daripada {{ totalRecords
                    }} entri
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
        </template>
    </RsCard>
</template>
<script setup>
import { ref, computed, onMounted, watch } from "vue";
definePageMeta({ title: "Konfigurasi Status Household / Individu",middleware: ["auth", "approver"] });

const breadcrumb = ref([
    { name: "Profiling", type: "link", path: "/BF-PRF/KF/SHI/admin" },
    { name: "Konfigurasi Status Household / Individu", type: "current", path: "/BF-PRF/KF/SHI/02_01/admin" },
]);

const showModal = ref(false);
const selected = ref(null);

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

const tableKey = ref(0);
const approvals = ref([]);

const fields = [
    { key: "kod", label: "Kod" },
    { key: "nama", label: "Nama" },
    { key: "jenis", label: "Jenis" },
    { key: "tarikhMula", label: "Tarikh Mula" },
    { key: "statusData", label: "Status Data" },
    {
        key: "tindakan",
        label: "Tindakan",
        thClass: "text-right",
        tdClass: "text-right !pr-2",
    },
];

/* ---------- helpers ---------- */
function formatDate(value) {
    if (!value) return "";
    const d = value.includes("-")
        ? new Date(value)
        : new Date(value.replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/, "$3-$2-$1"));
    if (Number.isNaN(d.getTime())) return value;
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}
function formatPct(val) {
    if (val === null || val === undefined || val === "") return "-";
    const n = Number(val);
    if (Number.isNaN(n)) return "-";
    const clamped = Math.min(Math.max(n, 0), 9999.99);
    return `${clamped}%`;
}
function getStatusVariant(status) {
    switch (status) {
        case "Lulus": return "success";
        case "Draf": return "warning";
        case "Tolak": return "danger";
        default: return "default";
    }
}
function openLihat(entryId) {
    const row = approvals.value.find(a => a.entryId === entryId || a.id === entryId);
    if (row) {
        selected.value = row;
        showModal.value = true;
    }
}

function openKelulusan(entryId) {
    const row = approvals.value.find(a => a.entryId === entryId || a.id === entryId);

    navigateTo({
        path: "/BF-PRF/KF/SHI/02_03",
        query: { entryId } // will be ?entryId=...
    });

    if (row) {
        // later: open approval modal or mark approved/rejected
        selected.value = row;
        showModal.value = true;
    }
}

/* ---------- computed lists ---------- */
const pendingApprovals = computed(() => {
    return (approvals.value ?? []).filter(a => a.status === "Menunggu");
});
const pendingApprovalCount = computed(() => pendingApprovals.value.length);

const pageSize = 10;
const currentPage = ref(1);
const totalRecords = computed(() => tableRows.value.length);
const totalPages = computed(() => Math.max(1, Math.ceil(totalRecords.value / pageSize)));
const startIndex = computed(() => (currentPage.value - 1) * pageSize);
const endIndex = computed(() => Math.min(startIndex.value + pageSize, totalRecords.value));
const pagedRows = computed(() => tableRows.value.slice(startIndex.value, endIndex.value));

const tableRows = computed(() =>
    (pendingApprovals.value ?? []).map(a => ({
        kod: a.kod ?? "-",
        nama: a.nama ?? "-",
        jenis: a.jenis ?? "-",
        tarikhMula: a.tarikhMula ?? "",
        statusData: a.statusData ?? "",
        tindakan: a.entryId || a.id,
    }))
);

function prevPage() { if (currentPage.value > 1) currentPage.value--; }
function nextPage() { if (currentPage.value < totalPages.value) currentPage.value++; }
watch(totalRecords, () => { currentPage.value = 1; tableKey.value++; });

onMounted(() => {
    approvals.value = loadApprovals();
});
</script>