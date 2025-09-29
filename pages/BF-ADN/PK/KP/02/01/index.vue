<template>
  <div>
    <!-- Breadcrumb -->
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Title -->
    <h2 class="text-xl font-bold mb-6">
      Senarai Permohonan Kelulusan Konfigurasi Penutupan Aduan
    </h2>

    <rs-card>
      <template #body>
        <rs-table
          class="mt-4"
          :data="permohonanList"
          :pageSize="5"
          :showNoColumn="true"
          :options="{ variant: 'default', hover: true, bordered: true, striped: true }"
        >
          <!-- Dark header row -->
          <template #head="{ column }">
            <span class="bg-gray-900 text-white px-3 py-2 block uppercase font-bold text-sm">
              {{ column.label }}
            </span>
          </template>

          <!-- Status badge -->
          <template #status="cell">
            <div class="flex justify-center">
              <rs-badge :variant="cell.text === 'Aktif' ? 'success' : 'danger'" size="sm">
                {{ cell.text }}
              </rs-badge>
            </div>
          </template>

          <!-- Status Semasa badge -->
          <template #statusSemasa="cell">
            <div class="flex justify-center">
              <rs-badge variant="warning" size="sm">
                {{ cell.text }}
              </rs-badge>
            </div>
          </template>

          <!-- Tindakan buttons (always shown like your screenshot) -->
          <template #tindakan="slot">
            <div class="flex justify-center space-x-2">
              <NuxtLink to="/BF-ADN/PK/KP/02/02">
                <rs-button variant="success" size="sm" class="!px-3 !py-1">
                  Semakan & Kelulusan
                </rs-button>
              </NuxtLink>

              <NuxtLink to="/BF-ADN/PK/KP/02/03">
                <rs-button variant="primary" size="sm" class="!px-3 !py-1">
                  Lihat
                </rs-button>
              </NuxtLink>
            </div>
          </template>
        </rs-table>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Senarai Permohonan Kelulusan Konfigurasi Penutupan Aduan",
  path: "/BF-ADN/PK/KP/02/01",
});

const breadcrumb = ref([
  { name: "Pengurusan SLA", type: "link", path: "/BF-ADN/SLA" },
  {
    name: "Senarai Permohonan Kelulusan Konfigurasi Penutupan Aduan",
    type: "current",
    path: "/BF-ADN/PK/KP/02/01",
  },
]);

// Ensure each row has 'tindakan' so rs-table renders the column and the slot above runs
const permohonanList = ref([
  {
    sebab: "Siasatan Tamat",
    status: "Aktif",
    tarikh: "2025-09-18",
    dimohonOleh: "Eksekutif_A",
    statusSemasa: "Menunggu Kelulusan",
    tindakan: true,
  },
  {
    sebab: "Luar Skop Zakat",
    status: "Tidak Aktif",
    tarikh: "2025-09-17",
    dimohonOleh: "Eksekutif_B",
    statusSemasa: "Menunggu Kelulusan",
    tindakan: true,
  },
]);
</script>
