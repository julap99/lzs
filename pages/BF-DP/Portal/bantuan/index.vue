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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <rs-card variant="secondary">
            <div class="p-2">
              <div class="text-sm text-gray-500">Nombor Pengenalan</div>
              <div class="font-bold">{{ searchSummary.idNo }}</div>
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

    <!-- Section 2: Senarai Bantuan -->
    <rs-card>
      <template #header>Senarai Bantuan Dipohon</template>
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
          <template v-slot:tarikhStatus="data">
            <span class="font-medium">{{ formatDate(data.text) }}</span>
          </template>
          <template v-slot:aksi="data">
            <rs-button
              variant="primary" 
              size="sm"
              class="!px-2 !py-1"
              @click="viewBantuanDetail()"
            >
              Lihat Butiran
              <Icon name="mdi:chevron-right" class="ml-1" size="1rem" />
            </rs-button>
          </template>
        </rs-table>

        <!-- Empty State -->
        <div v-if="bantuanData.length === 0" class="text-center text-gray-600 mt-6">
          Tiada permohonan bantuan dijumpai.
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

definePageMeta({
  title: "Senarai Bantuan, Status Terkini",
});

// Breadcrumb
const breadcrumb = ref([
  {
    name: "Semak Status",
    type: "link",
    path: "/BF-DP/Portal/",
  },
  {
    name: "Senarai Bantuan",
    type: "current",
    path: "/BF-DP/Portal/bantuan",
  },
]);

// Summary Data
const searchSummary = ref({
  idNo: "900101145678",
  searchDate: new Date(),
});

// Dummy Data Bantuan
const bantuanData = ref([
  {
    idPermohonan: "NAS-BTN-2025-0001",
    namaPemohon: "Ali bin Abu",
    tarikhPermohonan: "2025-06-01",
    jenisBantuan: "Bantuan Sara Hidup",
    status: "Dalam Proses",
    tarikhStatus: "2025-06-10 09:00",
    aksi: "NAS-BTN-2025-0001",
  },
  {
    idPermohonan: "NAS-BTN-2025-0002",
    namaPemohon: "Ali bin Abu",
    tarikhPermohonan: "2025-05-25",
    jenisBantuan: "Bantuan Pendidikan",
    status: "Diluluskan",
    tarikhStatus: "2025-06-08 14:30",
    aksi: "NAS-BTN-2025-0002",
  },
]);

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Dalam Proses":
      return "primary";
    case "Diluluskan":
      return "success";
    case "Tidak Lulus":
      return "danger";
    case "Ditolak":
      return "danger";
    case "Selesai":
      return "success";
    default:
      return "default";
  }
};

const formatDate = (date: string | Date) => {
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
const viewBantuanDetail = () => {
  navigateTo(`/BF-DP/Portal/bantuan/01`);
};

const selectedRole = ref("asnaf"); // default role

const canViewDetail = computed(() => selectedRole.value === "internal");

const displayedData = computed(() => {
  return bantuanData.value.map(item => {
    if (!canViewDetail.value) {
      const { aksi, ...rest } = item; // remove aksi
      return rest;
    }
    return item;
  });
});
</script>

<style lang="scss" scoped>
// Optional styling
</style>
