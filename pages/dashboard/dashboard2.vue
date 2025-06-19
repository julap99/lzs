<template>
  <RsCard>
    <template #header>
      <h1 class="text-xl font-bold">Dashboard Analitik</h1>
    </template>
    <template #body>
      <div class="flex flex-col space-y-4">
        <!-- Filter Section -->
        <div class="flex space-x-4">
          <FormKit
            type="select"
            label="Pilih Tarikh"
            v-model="filters.date"
            :options="dateOptions"
          />
          <FormKit
            type="select"
            label="Pilih Divisyen"
            v-model="filters.division"
            :options="divisionOptions"
          />
          <FormKit
            type="select"
            label="Pilih Kategori Bantuan"
            v-model="filters.assistanceCategory"
            :options="assistanceCategoryOptions"
          />
          <RsButton @click="applyFilters" class="self-center">Tapis</RsButton>
        </div>

        <!-- KPI Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RsCard v-for="kpi in kpiData" :key="kpi.title">
            <template #header>{{ kpi.title }}</template>
            <template #body>
              <p class="text-2xl font-bold">{{ kpi.value }}</p>
            </template>
          </RsCard>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 class="text-lg font-semibold">Graf Bantuan</h2>
            <!-- <BarChart :data="assistanceData" /> -->
          </div>
          <div>
            <h2 class="text-lg font-semibold">Peta GIS</h2>
            <!-- <GisMap :data="gisData" /> -->
          </div>
        </div>

        <!-- Detailed Table Section -->
        <h2 class="text-lg font-semibold">Jadual Butiran</h2>
        <RsTable
          :field="['Nama Asnaf', 'Status Pembayaran', 'Tarikh Permohonan']"
          :data="detailedData"
          :options="{ striped: true, hover: true }"
          :optionsAdvanced="{ sortable: true, filterable: true }"
          :pageSize="10"
        />
      </div>
    </template>
  </RsCard>
</template>

<script setup>
import { ref } from "vue";

const filters = ref({
  date: "",
  division: "",
  assistanceCategory: "",
});

const dateOptions = ref(["Hari Ini", "Seminggu", "Sebulan"]);
const divisionOptions = ref(["Divisyen A", "Divisyen B"]);
const assistanceCategoryOptions = ref(["Bantuan Kewangan", "Bantuan Makanan"]);

const kpiData = ref([
  { title: "Jumlah Bantuan", value: "1000" },
  { title: "Jumlah Asnaf", value: "250" },
  { title: "Pembayaran Tertunggak", value: "50" },
]);

const assistanceData = ref([
  // Data for the bar chart
]);

const gisData = ref([
  // Data for GIS map
]);

const detailedData = ref([
  // Data for detailed table
]);

const applyFilters = () => {
  // Logic to apply filters and refresh data
};
</script>

<style scoped>
/* Add any additional styles here */
</style>
