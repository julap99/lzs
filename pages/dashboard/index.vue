<script setup>
definePageMeta({
  title: "Dashboard",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    {
      name: "Dashboard",
      path: "/",
    },
  ],
});

// Data baru untuk lapangan terbang teratas
const topAirports = ref([
  {
    rank: 1,
    name: "Lapangan Terbang Antarabangsa Kuala Lumpur (KLIA)",
    visitors: 62000000,
  },
  {
    rank: 2,
    name: "Lapangan Terbang Antarabangsa Kota Kinabalu",
    visitors: 9000000,
  },
  { rank: 3, name: "Lapangan Terbang Antarabangsa Penang", visitors: 8000000 },
  { rank: 4, name: "Lapangan Terbang Antarabangsa Kuching", visitors: 5500000 },
  {
    rank: 5,
    name: "Lapangan Terbang Antarabangsa Langkawi",
    visitors: 3000000,
  },
]);

// Data baru untuk kad ringkasan pantas
const quickSummary = ref([
  { title: "Jumlah Pelawat", value: "15.0 Juta", icon: "ic:outline-people" },
  {
    title: "Pendapatan Pelancongan",
    value: "RM 92.36 Bilion",
    icon: "ic:outline-attach-money",
  },
  {
    title: "Tempoh Penginapan Purata",
    value: "6.4 Hari",
    icon: "ic:outline-hotel",
  },
  {
    title: "Kepuasan Pelancong",
    value: "94%",
    icon: "ic:outline-sentiment-satisfied",
  },
]);

// Data Pelawat Malaysia
const visitorData = ref([
  {
    name: "Pelawat Tempatan",
    data: [5200000, 5800000, 4500000, 5200000, 7500000, 8200000],
  },
  {
    name: "Pelawat Asing",
    data: [3200000, 3800000, 2500000, 3100000, 5500000, 6800000],
  },
]);

// Data Pelawat Asing mengikut Negeri
const foreignVisitorsByState = ref([
  { state: "Selangor", visitors: 1500000 },
  { state: "Pulau Pinang", visitors: 1200000 },
  { state: "Johor", visitors: 1000000 },
  { state: "Sabah", visitors: 800000 },
  { state: "Sarawak", visitors: 600000 },
  { state: "Melaka", visitors: 500000 },
  { state: "Kedah", visitors: 400000 },
  { state: "Negeri Sembilan", visitors: 300000 },
  { state: "Perak", visitors: 250000 },
  { state: "Terengganu", visitors: 200000 },
  { state: "Kelantan", visitors: 150000 },
  { state: "Pahang", visitors: 100000 },
  { state: "Perlis", visitors: 50000 },
]);

// Lapangan Terbang Keberangkatan Teratas
const departureData = ref([
  { airport: "JFK", departures: 1500 },
  { airport: "LHR", departures: 1200 },
  { airport: "CDG", departures: 1000 },
  { airport: "DXB", departures: 800 },
  { airport: "SIN", departures: 600 },
]);

// Data Pelancong Berulang
const repeatVisitorsData = ref([
  { category: "1-2 kali", percentage: 45 },
  { category: "3-5 kali", percentage: 30 },
  { category: "6-10 kali", percentage: 15 },
  { category: ">10 kali", percentage: 10 },
]);

// Data Negara Asal Pelancong Asing Teratas
const topVisitorCountries = ref([
  { country: "Singapura", visitors: 1500000 },
  { country: "Indonesia", visitors: 1200000 },
  { country: "China", visitors: 1000000 },
  { country: "Thailand", visitors: 800000 },
  { country: "India", visitors: 600000 },
]);

// Data Pendapatan Pelancongan Mengikut Tahun (Baru)
const tourismRevenueData = ref([
  {
    name: "Pendapatan (RM Bilion)",
    data: [65.1, 72.8, 43.2, 58.9, 78.6, 92.36],
  },
]);

const chartOptionsVisitors = computed(() => ({
  chart: { height: 350, type: "line" },
  stroke: { curve: "smooth", width: 2 },
  xaxis: { categories: ["2018", "2019", "2020", "2021", "2022", "2023"] },
  yaxis: { title: { text: "Bilangan Pelawat" } },
}));

const chartOptionsForeignVisitors = computed(() => ({
  chart: { type: "bar" },
  plotOptions: { bar: { horizontal: true } },
  xaxis: { categories: foreignVisitorsByState.value.map((item) => item.state) },
}));

const chartOptionsDeparture = computed(() => ({
  chart: { type: "bar" },
  plotOptions: { bar: { horizontal: true } },
  xaxis: { categories: departureData.value.map((item) => item.airport) },
}));

const chartOptionsRepeatVisitors = computed(() => ({
  chart: { type: "pie" },
  labels: repeatVisitorsData.value.map((item) => item.category),
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: "bottom",
        },
      },
    },
  ],
}));

const chartOptionsTopCountries = computed(() => ({
  chart: { type: "bar" },
  plotOptions: {
    bar: { horizontal: false, columnWidth: "55%", endingShape: "rounded" },
  },
  dataLabels: { enabled: false },
  stroke: { show: true, width: 2, colors: ["transparent"] },
  xaxis: { categories: topVisitorCountries.value.map((item) => item.country) },
  yaxis: { title: { text: "Bilangan Pelawat" } },
  fill: { opacity: 1 },
  tooltip: {
    y: {
      formatter: function (val) {
        return val.toLocaleString() + " pelawat";
      },
    },
  },
}));

// Konfigurasi carta untuk pendapatan pelancongan (Baru)
const chartOptionsRevenue = computed(() => ({
  chart: { height: 350, type: "area" },
  stroke: { curve: "smooth", width: 2 },
  xaxis: { categories: ["2018", "2019", "2020", "2021", "2022", "2023"] },
  yaxis: { title: { text: "Pendapatan (RM Bilion)" } },
  dataLabels: { enabled: false },
  fill: { 
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.3,
    }
  },
}));

onMounted(() => {
  // Sebarang logik yang diperlukan semasa pemasangan
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <!-- Kad Ringkasan Pantas -->
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
      <rs-card
        v-for="(item, index) in quickSummary"
        :key="index"
        class="transition-all duration-300 hover:shadow-lg"
      >
        <div class="pt-5 pb-3 px-5 flex items-center gap-4">
          <div
            class="p-5 flex justify-center items-center bg-primary/20 rounded-2xl transition-all duration-300 hover:bg-primary/30"
          >
            <Icon class="text-primary text-3xl" :name="item.icon"></Icon>
          </div>
          <div class="flex-1 truncate">
            <span class="block font-bold text-2xl leading-tight text-primary">
              {{ item.value }}
            </span>
            <span class="text-sm font-medium text-gray-600">
              {{ item.title }}
            </span>
          </div>
        </div>
      </rs-card>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Gambaran Keseluruhan Pelawat Malaysia -->
      <rs-card class="col-span-1 lg:col-span-2">
        <template #header>
          <h2 class="text-xl font-bold text-primary">
            Gambaran Keseluruhan Pelawat
          </h2>
        </template>
        <template #body>
          <client-only>
            <VueApexCharts
              width="100%"
              height="350"
              type="line"
              :options="chartOptionsVisitors"
              :series="visitorData"
            ></VueApexCharts>
          </client-only>
        </template>
      </rs-card>

      <!-- Pelawat Asing mengikut Negeri -->
      <rs-card>
        <template #header>
          <h2 class="text-lg font-semibold text-primary">
            Pelawat Asing mengikut Negeri
          </h2>
        </template>
        <template #body>
          <client-only>
            <VueApexCharts
              width="100%"
              height="300"
              type="bar"
              :options="chartOptionsForeignVisitors"
              :series="[
                { data: foreignVisitorsByState.map((item) => item.visitors) },
              ]"
            ></VueApexCharts>
          </client-only>
        </template>
      </rs-card>

      <!-- Pelancong Berulang -->
      <rs-card>
        <template #header>
          <h2 class="text-lg font-semibold text-primary">
            Kekerapan Lawatan Pelancong
          </h2>
        </template>
        <template #body>
          <client-only>
            <VueApexCharts
              width="100%"
              height="300"
              type="pie"
              :options="chartOptionsRepeatVisitors"
              :series="repeatVisitorsData.map((item) => item.percentage)"
            ></VueApexCharts>
          </client-only>
        </template>
      </rs-card>
    </div>

    <!-- Negara Asal Pelancong Asing Teratas -->
    <rs-card class="mb-6">
      <template #header>
        <h2 class="text-xl font-bold text-primary">
          Negara Asal Pelancong Asing Teratas
        </h2>
      </template>
      <template #body>
        <client-only>
          <VueApexCharts
            width="100%"
            height="350"
            type="bar"
            :options="chartOptionsTopCountries"
            :series="[
              {
                name: 'Pelawat',
                data: topVisitorCountries.map((item) => item.visitors),
              },
            ]"
          ></VueApexCharts>
        </client-only>
      </template>
    </rs-card>

    <!-- Pendapatan Pelancongan Mengikut Tahun (Baru) -->
    <rs-card class="mb-6">
      <template #header>
        <h2 class="text-xl font-bold text-primary">
          Trend Pendapatan Pelancongan (2018-2023)
        </h2>
      </template>
      <template #body>
        <client-only>
          <VueApexCharts
            width="100%"
            height="350"
            type="area"
            :options="chartOptionsRevenue"
            :series="tourismRevenueData"
          ></VueApexCharts>
        </client-only>
      </template>
    </rs-card>

    <rs-card class="mb-6">
      <template #header>
        <h2 class="text-xl font-bold text-primary">
          Lapangan Terbang Teratas dengan Pelawat Terbanyak
        </h2>
      </template>
      <template #body>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Kedudukan
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Nama Lapangan Terbang
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Jumlah Pelawat
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="airport in topAirports"
                :key="airport.rank"
                class="hover:bg-gray-50 transition-colors duration-200"
              >
                <td class="px-6 py-4 whitespace-nowrap font-medium">
                  {{ airport.rank }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">{{ airport.name }}</td>
                <td
                  class="px-6 py-4 whitespace-nowrap font-semibold text-primary"
                >
                  {{ airport.visitors.toLocaleString() }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </rs-card>
  </div>
</template>
