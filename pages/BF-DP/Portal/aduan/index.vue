<template>
  <div>
    <!-- Breadcrumb -->
    <LayoutsBreadcrumb :items="breadcrumb" />

    <div class="mb-4 flex items-center space-x-4">
      <label class="font-medium text-gray-700">Pilih Role:</label>
      <select v-model="selectedRole" class="border rounded p-1">
      <option value="asnaf">Asnaf</option>
      <option value="internal">Internal Staff</option>
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

          <rs-card variant="secondary">
            <div class="p-2">
              <div class="text-sm text-gray-500">ID Permohonan</div>
              <div class="font-bold">{{ searchSummary.idPermohonan }}</div>
            </div>
          </rs-card>

          <rs-card variant="secondary">
            <div class="p-2">
              <div class="text-sm text-gray-500">Tarikh & Masa Carian</div>
              <div class="font-bold">{{ formatDate(searchSummary.searchDate) }}</div>
            </div>
          </rs-card>
        </div>
      </template>
    </rs-card>

    <!-- Section 2: Senarai Status Aduan -->
    <rs-card>
      <template #header>Senarai Status Aduan</template>
      <template #body>
        <rs-table
        class="mt-4"
        :data="displayedData"
        :pageSize="10"
        :showNoColumn="true"
        :options="{ variant: 'default', hover: true }"
        >
      <!-- Column: ID Permohonan -->
      <template v-slot:idPermohonan="data">
        <span class="font-medium">{{ data.text }}</span>
      </template>

      <!-- Column: Nama Pengadu/Wakil -->
      <template v-slot:namaPengadu="data">
        <span>{{ data.text }}</span>
      </template>

      <!-- Column: Tarikh Aduan -->
      <template v-slot:tarikhAduan="data">
        <span class="font-medium">{{ formatDate(data.text) }}</span>
      </template>

      <!-- Column: Status Semasa -->
      <template v-slot:statusSemasa="data">
        <div class="flex justify-center">
          <rs-badge :variant="getStatusVariant(data.text)" size="sm">
            {{ data.text }}
          </rs-badge>
        </div>
      </template>

      <!-- Column: Tarikh Status Dikemaskini -->
      <template v-slot:tarikhKemaskini="data">
        <span class="font-medium">{{ formatDate(data.text) }}</span>
      </template>

      <!-- Column: Lihat Butiran -->
      <template v-slot:aksi>
            <rs-button
              variant="primary" 
              size="sm"
              class="!px-2 !py-1"
              @click="viewAduanDetail()"
            >
              Lihat Butiran
              <Icon name="mdi:chevron-right" class="ml-1" size="1rem" />
            </rs-button>
          </template>
    </rs-table>

        <!-- Empty State -->
        <div v-if="aduanData.length === 0" class="text-center text-gray-600 mt-6">
          Tiada pendaftaran profil dijumpai.
        </div>

        <!-- Export Buttons -->
        <div class="flex justify-end mt-4 space-x-2" v-if="canExport">
          <rs-button variant="secondary" @click="exportPDF">
            Eksport PDF
          </rs-button>
          <rs-button variant="secondary" @click="exportExcel">
            Eksport Excel
          </rs-button>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

definePageMeta({
  title: "Senarai Aduan, Status Pendaftaran Profil",
});

// Breadcrumb
const breadcrumb = ref([
  {
    name: "Semak Status",
    type: "link",
    path: "/BF-DP/Portal/",
  },
  {
    name: "Senarai Aduan",
    type: "current",
    path: "/BF-DP/Portal/aduan",
  },
]);

// Summary Data
const searchSummary = ref({
  idNo: "900101145678",
  idPermohonan: "NAS-PRF-2025-0001",
  searchDate: new Date(),
});

// Dummy Data Aduan
const aduanData = ref([
  {
    idPermohonan: "ADN-250823-000123",
    namaPengadu: "Ahmad bin Ali",
    tarikhAduan: "2025-08-20",
    statusSemasa: "Aduan Baru",
    tarikhKemaskini: "2025-08-21",
    aksi: "NAS-BTN-2025-0001",
  },
  {
    idPermohonan: "ADN-250823-000124",
    namaPengadu: "Siti Aminah",
    tarikhAduan: "2025-08-19",
    statusSemasa: "Dalam Tindakan - Siasatan Ringkas",
    tarikhKemaskini: "2025-08-22",
    aksi: "NAS-BTN-2025-0001",
  },
  {
    idPermohonan: "ADN-250823-000125",
    namaPengadu: "Rahman bin Ismail",
    tarikhAduan: "2025-08-18",
    statusSemasa: "Selesai",
    tarikhKemaskini: "2025-08-23",
    aksi: "NAS-BTN-2025-0001",
  },
]);

const getStatusVariant = (status: string) => {
  const variants: Record<string, string> = {
    "Aduan Baru": "warning",
    "Dalam Tindakan - Siasatan Ringkas": "primary",
    "Dalam Tindakan - Siasatan Lapangan": "primary",
    "Selesai": "success",
    "Ditutup": "danger",
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

// Tindakan "Lihat Butiran"
const viewAduanDetail = (): void => {
  navigateTo(`/BF-DP/Portal/aduan/01`);
};

const selectedRole = ref("internal"); // default role
const canViewDetail = computed(() => selectedRole.value === "internal");
const displayedData = computed(() => {
  return aduanData.value.map(item => {
    if (!canViewDetail.value) {
      const { aksi, ...rest } = item; // remove aksi
      return rest;
    }
    return item;
  });
});

// Eksport actions
const exportPDF = (): void => {
  // Implement PDF export
  alert("Export PDF triggered!");
};

const exportExcel = (): void => {
  // Implement Excel export
  alert("Export Excel triggered!");
};

// Permission to export (can be dynamic)
const canExport = canViewDetail;
</script>
