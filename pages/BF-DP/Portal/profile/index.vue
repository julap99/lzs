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

    <!-- Section 1: Ringkasan Maklumat Carian -->
    <rs-card class="mb-6">
      <template #header>Ringkasan Maklumat Carian</template>
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <rs-card variant="secondary">
            <div class="p-2">
              <div class="text-sm text-gray-500">Nombor Pengenalan</div>
              <div class="font-bold">{{ searchSummary.idNo }}</div>
            </div>
          </rs-card>

          <!-- Temporarily hidden
          <rs-card variant="secondary">
            <div class="p-2">
              <div class="text-sm text-gray-500">ID Permohonan</div>
              <div class="font-bold">{{ searchSummary.appId }}</div>
            </div>
          </rs-card>
          -->

          <rs-card variant="secondary">
            <div class="p-2">
              <div class="text-sm text-gray-500">Tarikh & Masa Carian</div>
              <div class="font-bold">{{ formatDate(searchSummary.searchDate) }}</div>
            </div>
          </rs-card>
        </div>
      </template>
    </rs-card>

    <!-- Section 2: Senarai Status -->
    <rs-card>
      <template #header>Senarai Status Pendaftaran Profil</template>
      <template #body>
        <rs-table
        class="mt-4"
        :data="displayedData"
        :pageSize="10"
        :showNoColumn="true"
        :options="{
          variant: 'default',
          hover: true,
        }"
      >
  <template v-slot:status="data">
    <div class="flex justify-center">
      <rs-badge :variant="getStatusVariant(data.text)" size="sm">
        {{ data.text }}
      </rs-badge>
    </div>
  </template>

  <template v-slot:lastUpdate="data">
    <span class="font-medium">{{ formatDate(data.text) }}</span>
  </template>

  <!-- Only render tindakan column if canViewDetail is true -->
  <template v-if="canViewDetail" v-slot:tindakan>
    <button
      @click="viewProfileDetail()"
      title="Lihat"
      class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
    >
      <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
    </button>
  </template>
</rs-table>


        <!-- Action Buttons -->
        <div class="flex justify-end mt-4 space-x-2" v-if="canExport">
          <rs-button variant="secondary" @click="exportPDF">
            Eksport PDF
          </rs-button>
          <rs-button variant="secondary" @click="exportExcel">
            Eksport Excel
          </rs-button>
        </div>

        <!-- Empty state -->
        <div v-if="profileStatusData.length === 0" class="text-center text-gray-600 mt-6">
          Tiada pendaftaran dijumpai untuk nombor rujukan ini.
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

definePageMeta({
  title: "Senarai Status Pendaftaran Profil",
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
    type: "current",
    path: "/status/profil",
  },
]);

// Summary Data
const searchSummary = ref({
  idNo: "900101145678",
  appId: "NAS-APP-2025-00123",
  searchDate: new Date(),
});

// DataTable
const profileStatusData = ref([
  {
    tarikhPendaftaran: "2025-06-01",
    jenisProfil: "Individu",
    idPermohonan: "NAS-PRF-2025-0001",
    status: "Menunggu Siasatan",
    lastUpdate: "2025-06-05 10:00",
    tindakan: "NAS-PRF-2025-0001",
  },
  {
    tarikhPendaftaran: "2025-05-25",
    jenisProfil: "Organisasi",
    idPermohonan: "NAS-PRF-2025-0002",
    status: "Lulus",
    lastUpdate: "2025-06-03 14:30",
    tindakan: "NAS-PRF-2025-0002",
  },
]);

const getStatusVariant = (status: string) => {
  const variants: Record<string, string> = {
    "Menunggu Siasatan": "warning",
    "Disemak": "primary",
    "Lulus": "success",
    "Tidak Lulus": "danger",
    "Diterima": "info",
    "Dibatalkan": "default",
  };
  return variants[status] || "default";
};

const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString("ms-MY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const viewProfileDetail = (): void => {
  navigateTo(`/BF-DP/Portal/profile/01`);
};

const exportPDF = (): void => {
  // Implement PDF export
  alert("Export PDF triggered!");
};

const exportExcel = (): void => {
  // Implement Excel export
  alert("Export Excel triggered!");
};


const selectedRole = ref("pengguna-dalam"); // default role
const canViewDetail = computed(() => selectedRole.value === "pengguna-dalam");
const canExport = canViewDetail;

const displayedData = computed(() => {
  return profileStatusData.value.map(item => {
    if (!canViewDetail.value) {
      const { tindakan, ...rest } = item; // remove tindakan
      return rest;
    }
    return item;
  });
});
</script>

<style lang="scss" scoped>
// Optional styling
</style>
