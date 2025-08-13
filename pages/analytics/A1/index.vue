<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

// Breadcrumb
const breadcrumb = ref([
  { name: "Analytics", type: "link", path: "/analytics/A1" },
  { name: "Analytic 1", type: "current", path: "/analytics/A1" },
]);

// Dummy data based on the provided image
const aidTypes = [
  { name: "Bantuan Kewangan Bulanan", recipients: 55165, amount: 250196900 },
  { name: "Bantuan Makanan Bulanan", recipients: 21218, amount: 143539294 },
  { name: "Bantuan Sewa Rumah", recipients: 34116, amount: 30804393 },
  { name: "Bantuan Keperluan Pendidikan", recipients: 76924, amount: 32098679 },
  { name: "Bantuan Ramadhan & Hari Raya", recipients: 2740, amount: 68549307 },
  { name: "Bantuan Dialisis", recipients: 10415, amount: 63716110 },
  { name: "Bantuan Perubatan", recipients: 91, amount: 4524410 },
  { name: "Bantuan Bina/Beli Rumah", recipients: 444, amount: 19583025 },
  { name: "Bantuan Baikpulih Rumah", recipients: 29, amount: 2970634 },
  { name: "Bantuan Modal", recipients: 2465, amount: 27446539 },
  { name: "Bantuan Keperluan Hidup", recipients: 3382, amount: 2006250 },
  { name: "Bantuan Bencana", recipients: 551, amount: 1423713 },
  { name: "Program Penerapan Nilai Islam", recipients: 444, amount: 15554227 },
];

// Filtering state
const years = [2024, 2023];
const months = [
  { label: "Januari", value: 1 },
  { label: "Februari", value: 2 },
  { label: "Mac", value: 3 },
  { label: "April", value: 4 },
  { label: "Mei", value: 5 },
  { label: "Jun", value: 6 },
  { label: "Julai", value: 7 },
  { label: "Ogos", value: 8 },
  { label: "September", value: 9 },
  { label: "Oktober", value: 10 },
  { label: "November", value: 11 },
  { label: "Disember", value: 12 },
];
const aidTypeOptions = [
  { label: "Semua", value: "all" },
  ...aidTypes.map((a) => ({ label: a.name, value: a.name })),
];
const selectedYear = ref(2024);
const selectedMonth = ref(12);
const selectedAidType = ref("all");

// Filtered data with computed properties
const filteredAidTypes = computed(() => {
  let filtered = [...aidTypes];

  // Filter by year and month (in real implementation, this would filter from API)
  // For now, we'll just return all data since we're using dummy data
  // if (selectedYear.value && selectedMonth.value) {
  //   filtered = filtered.filter(item => item.year === selectedYear.value && item.month === selectedMonth.value);
  // }

  // Filter by aid type
  if (selectedAidType.value !== "all") {
    filtered = filtered.filter((item) => item.name === selectedAidType.value);
  }

  return filtered;
});

// Update computed properties to use filtered data
const totalRecipients = computed(() =>
  filteredAidTypes.value.reduce((sum, a) => sum + a.recipients, 0)
);

const totalAmount = computed(() =>
  filteredAidTypes.value.reduce((sum, a) => sum + a.amount, 0)
);

const highestAid = computed(() =>
  filteredAidTypes.value.reduce(
    (max, a) => (a.amount > max.amount ? a : max),
    filteredAidTypes.value[0] || { name: "-", recipients: 0, amount: 0 }
  )
);

// Update key metrics to be reactive
const keyMetrics = computed(() => [
  {
    title: "Jumlah Penerima",
    value: totalRecipients.value.toLocaleString(),
    icon: "ic:baseline-people",
    change: "positive",
    description: "+12.3% dari bulan lepas",
  },
  {
    title: "Jumlah Agihan",
    value: `RM ${totalAmount.value.toLocaleString()}`,
    icon: "ic:baseline-payments",
    change: "positive",
    description: "+8.7% dari bulan lepas",
  },
  {
    title: "Jenis Bantuan",
    value: filteredAidTypes.value.length.toString(),
    icon: "ic:baseline-category",
    change: "neutral",
    description: "Aktif",
  },
  {
    title: "Agihan Tertinggi",
    value: highestAid.value.name,
    icon: "ic:baseline-trending-up",
    change: "positive",
    description: "Bantuan Kewangan Bulanan",
  },
]);

// Update chart series to use filtered data
const stackedBarSeries = computed(() =>
  groupNames.map((group, idx) => ({
    name: group,
    data: filteredAidTypes.value.map(
      (row, rowIndex) => groupData[rowIndex][idx]
    ),
  }))
);

const barSeries = computed(() => [
  {
    name: "Jumlah (RM)",
    data: filteredAidTypes.value.map((a) => a.amount),
  },
]);

// Update bar options to use filtered categories
const barOptions = computed(() => ({
  chart: {
    type: "bar",
    height: 500,
    width: 900,
    fontFamily: "Inter, sans-serif",
  },
  plotOptions: {
    bar: {
      borderRadius: 8,
      horizontal: true,
      columnWidth: "60%",
    },
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: filteredAidTypes.value.map((a) => a.name),
    labels: {
      style: {
        fontSize: "12px",
      },
    },
  },
  colors: ["#005aad"],
  legend: { show: false },
  grid: {
    borderColor: "#f1f1f1",
    strokeDashArray: 4,
  },
}));

// Update top 5 aid types
const top5Aid = computed(() =>
  [...filteredAidTypes.value].sort((a, b) => b.amount - a.amount).slice(0, 5)
);

// Add apply filter function
const applyFilters = () => {
  // In a real implementation, this would trigger an API call
  // For now, the computed properties will handle the filtering
  console.log("Filters applied:", {
    year: selectedYear.value,
    month: selectedMonth.value,
    aidType: selectedAidType.value,
  });
};

// Dummy group distribution per aid type (for horizontal stacked bar)
const groupNames = ["Fakir", "Miskin", "Muallaf", "Gharim", "Fisabilillah"];
const groupData = [
  // Each array is [Fakir, Miskin, Muallaf, Gharim, Fisabilillah] for each aid type
  [12000, 15000, 2000, 500, 800], // Bantuan Kewangan Bulanan
  [4000, 6000, 1000, 200, 300], // Bantuan Makanan Bulanan
  [8000, 12000, 1500, 300, 500], // Bantuan Sewa Rumah
  [10000, 18000, 800, 100, 200], // Bantuan Keperluan Pendidikan
  [2000, 500, 200, 20, 20], // Bantuan Ramadhan & Hari Raya
  [1000, 2000, 300, 50, 60], // Bantuan Dialisis
  [20, 40, 10, 5, 16], // Bantuan Perubatan
  [100, 200, 50, 10, 84], // Bantuan Bina/Beli Rumah
  [5, 10, 2, 1, 11], // Bantuan Baikpulih Rumah
  [200, 400, 50, 10, 30], // Bantuan Modal
  [300, 500, 100, 20, 40], // Bantuan Keperluan Hidup
  [50, 100, 20, 5, 10], // Bantuan Bencana
  [80, 200, 40, 10, 114], // Program Penerapan Nilai Islam
];

// Updated chart options for better visualization
const stackedBarOptions = ref({
  chart: {
    type: "bar",
    height: 500,
    stacked: true,
    toolbar: { show: true },
    fontFamily: "Inter, sans-serif",
  },
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 8,
      dataLabels: { position: "top" },
      columnWidth: "60%",
    },
  },
  xaxis: {
    categories: aidTypes.map((a) => a.name),
    title: {
      text: "Jumlah Penerima",
      style: {
        fontSize: "14px",
        fontWeight: 600,
      },
    },
    labels: {
      style: {
        fontSize: "12px",
      },
    },
  },
  legend: {
    position: "bottom",
    fontSize: "14px",
    markers: {
      radius: 12,
    },
    itemMargin: {
      horizontal: 10,
    },
  },
  colors: ["#005aad", "#8dc73d", "#f18d20", "#e55345", "#7a7a7a"],
  dataLabels: { enabled: false },
  tooltip: {
    shared: true,
    intersect: false,
    theme: "light",
    style: {
      fontSize: "14px",
    },
  },
  grid: {
    borderColor: "#f1f1f1",
    strokeDashArray: 4,
  },
});

// Add these refs for custom select handling
const isYearOpen = ref(false);
const isMonthOpen = ref(false);
const isAidTypeOpen = ref(false);

// Add click outside handler
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".custom-select")) {
    isYearOpen.value = false;
    isMonthOpen.value = false;
    isAidTypeOpen.value = false;
  }
};

// Reset function
const resetFilters = () => {
  selectedYear.value = 2024; // Default year
  selectedMonth.value = 12; // Default month
  selectedAidType.value = "all";
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Update chart options for donut
const donutOptions = computed(() => ({
  chart: {
    type: "donut",
    height: 500,
    fontFamily: "Inter, sans-serif",
  },
  labels: groupNames,
  colors: ["#005aad", "#8dc73d", "#f18d20", "#e55345", "#7a7a7a"],
  plotOptions: {
    pie: {
      donut: {
        size: "65%",
        labels: {
          show: true,
          name: {
            show: true,
            fontSize: "14px",
            fontWeight: 600,
            offsetY: -10,
          },
          value: {
            show: true,
            fontSize: "20px",
            fontWeight: 600,
            offsetY: 5,
            formatter: function (val: number) {
              return val.toLocaleString();
            },
          },
          total: {
            show: true,
            label: "Jumlah",
            fontSize: "16px",
            fontWeight: 600,
            formatter: function (w: { globals: { seriesTotals: number[] } }) {
              return w.globals.seriesTotals
                .reduce((a: number, b: number) => a + b, 0)
                .toLocaleString();
            },
          },
        },
      },
    },
  },
  legend: {
    position: "bottom",
    fontSize: "14px",
    markers: {
      radius: 12,
    },
    itemMargin: {
      horizontal: 10,
    },
  },
  dataLabels: {
    enabled: true,
    formatter: function (val: number) {
      return val.toFixed(1) + "%";
    },
  },
  tooltip: {
    shared: true,
    intersect: false,
    theme: "light",
    style: {
      fontSize: "14px",
    },
  },
}));

// Update series data for donut
const donutSeries = computed(() => {
  // Calculate total for each group across all aid types
  return groupNames.map((_, groupIndex) => {
    return filteredAidTypes.value.reduce((sum, _, aidIndex) => {
      return sum + groupData[aidIndex][groupIndex];
    }, 0);
  });
});
</script>

<template>
  <div class="space-y-5">
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Filter Controls -->
    <div class="bg-white rounded-md shadow-sm border border-gray-100">
      <div class="flex items-center gap-3 px-3 py-2">
        <div class="flex items-center gap-1.5">
          <Icon name="ic:baseline-filter-list" class="text-gray-400 text-sm" />
          <span class="text-xs font-medium text-gray-500">Filter</span>
        </div>
        <div class="flex-1 flex items-center gap-2">
          <!-- Year Select -->
          <div class="custom-select relative w-28">
            <button
              @click="isYearOpen = !isYearOpen"
              class="w-full h-8 px-2 text-xs text-left bg-white border border-gray-200 rounded hover:border-primary focus:outline-none focus:border-primary flex items-center justify-between"
            >
              <span>{{ selectedYear || "Tahun" }}</span>
              <Icon
                name="ic:baseline-keyboard-arrow-down"
                class="text-gray-400 transition-transform"
                :class="{ 'rotate-180': isYearOpen }"
              />
            </button>
            <div
              v-if="isYearOpen"
              class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-auto"
            >
              <div
                v-for="year in years"
                :key="year"
                @click="
                  selectedYear = year;
                  isYearOpen = false;
                "
                class="px-2 py-1.5 text-xs hover:bg-gray-50 cursor-pointer"
                :class="{ 'bg-primary/5 text-primary': selectedYear === year }"
              >
                {{ year }}
              </div>
            </div>
          </div>

          <!-- Month Select -->
          <div class="custom-select relative w-36">
            <button
              @click="isMonthOpen = !isMonthOpen"
              class="w-full h-8 px-2 text-xs text-left bg-white border border-gray-200 rounded hover:border-primary focus:outline-none focus:border-primary flex items-center justify-between"
            >
              <span>{{
                months.find((m) => m.value === selectedMonth)?.label || "Bulan"
              }}</span>
              <Icon
                name="ic:baseline-keyboard-arrow-down"
                class="text-gray-400 transition-transform"
                :class="{ 'rotate-180': isMonthOpen }"
              />
            </button>
            <div
              v-if="isMonthOpen"
              class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-auto"
            >
              <div
                v-for="month in months"
                :key="month.value"
                @click="
                  selectedMonth = month.value;
                  isMonthOpen = false;
                "
                class="px-2 py-1.5 text-xs hover:bg-gray-50 cursor-pointer"
                :class="{
                  'bg-primary/5 text-primary': selectedMonth === month.value,
                }"
              >
                {{ month.label }}
              </div>
            </div>
          </div>

          <!-- Aid Type Select -->
          <div class="custom-select relative w-56">
            <button
              @click="isAidTypeOpen = !isAidTypeOpen"
              class="w-full h-8 px-2 text-xs text-left bg-white border border-gray-200 rounded hover:border-primary focus:outline-none focus:border-primary flex items-center justify-between"
            >
              <span>{{
                aidTypeOptions.find((o) => o.value === selectedAidType)
                  ?.label || "Jenis Bantuan"
              }}</span>
              <Icon
                name="ic:baseline-keyboard-arrow-down"
                class="text-gray-400 transition-transform"
                :class="{ 'rotate-180': isAidTypeOpen }"
              />
            </button>
            <div
              v-if="isAidTypeOpen"
              class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-auto"
            >
              <div
                v-for="option in aidTypeOptions"
                :key="option.value"
                @click="
                  selectedAidType = option.value;
                  isAidTypeOpen = false;
                "
                class="px-2 py-1.5 text-xs hover:bg-gray-50 cursor-pointer"
                :class="{
                  'bg-primary/5 text-primary': selectedAidType === option.value,
                }"
              >
                {{ option.label }}
              </div>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-1.5">
          <rs-button @click="resetFilters" variant="primary-outline" size="sm">
            <Icon name="ic:baseline-refresh" class="text-xs" />
            Reset
          </rs-button>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
      <div v-for="(metric, index) in keyMetrics" :key="index" class="group">
        <div
          class="relative bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md"
        >
          <!-- Subtle Background Pattern -->
          <div
            class="absolute inset-0 opacity-[0.03]"
            :class="{
              'bg-success': metric.change === 'positive',
              'bg-warning': metric.change === 'neutral',
              'bg-danger': metric.change === 'negative',
            }"
          >
            <div
              class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-current to-transparent"
            ></div>
          </div>

          <div class="relative p-5">
            <!-- Header with Icon -->
            <div class="flex items-center justify-between mb-4">
              <div
                class="p-2.5 rounded-lg transition-all duration-300"
                :class="{
                  'bg-success/5 group-hover:bg-success/10':
                    metric.change === 'positive',
                  'bg-warning/5 group-hover:bg-warning/10':
                    metric.change === 'neutral',
                  'bg-danger/5 group-hover:bg-danger/10':
                    metric.change === 'negative',
                }"
              >
                <Icon
                  :name="metric.icon"
                  class="text-xl"
                  :class="{
                    'text-success': metric.change === 'positive',
                    'text-warning': metric.change === 'neutral',
                    'text-danger': metric.change === 'negative',
                  }"
                />
              </div>
              <div
                class="text-xs font-medium px-2 py-1 rounded-full"
                :class="{
                  'bg-success/5 text-success': metric.change === 'positive',
                  'bg-warning/5 text-warning': metric.change === 'neutral',
                  'bg-danger/5 text-danger': metric.change === 'negative',
                }"
              >
                {{ metric.description }}
              </div>
            </div>

            <!-- Metric Value -->
            <div class="space-y-1">
              <h3 class="text-sm font-medium text-gray-500">
                {{ metric.title }}
              </h3>
              <div class="flex items-baseline gap-2">
                <p
                  class="text-3xl font-semibold tracking-tight"
                  :class="{
                    'text-success': metric.change === 'positive',
                    'text-warning': metric.change === 'neutral',
                    'text-danger': metric.change === 'negative',
                  }"
                >
                  {{ metric.value }}
                </p>
                <div
                  v-if="metric.change !== 'neutral'"
                  class="flex items-center text-xs font-medium"
                  :class="{
                    'text-success': metric.change === 'positive',
                    'text-danger': metric.change === 'negative',
                  }"
                >
                  <Icon
                    :name="
                      metric.change === 'positive'
                        ? 'ic:baseline-trending-up'
                        : 'ic:baseline-trending-down'
                    "
                    class="w-3.5 h-3.5 mr-0.5"
                  />
                  <span>12.3%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Accent -->
          <div
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            :class="{
              'text-success': metric.change === 'positive',
              'text-warning': metric.change === 'neutral',
              'text-danger': metric.change === 'negative',
            }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-1 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-6">
          Agihan Mengikut Kategori Penerima
        </h2>
        <div class="flex items-center justify-center w-full">
          <client-only>
            <VueApexCharts
              type="donut"
              :options="donutOptions"
              :series="donutSeries"
            />
          </client-only>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-6">
          Jumlah Agihan Mengikut Jenis Bantuan
        </h2>
        <div class="flex items-center justify-center">
          <client-only>
            <VueApexCharts
              type="bar"
              :options="barOptions"
              :series="barSeries"
            />
          </client-only>
        </div>
      </div>
    </div>

    <!-- Top 5 Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-6">
        Top 5 Bantuan Mengikut Jumlah Agihan
      </h2>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th
                class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Jenis Bantuan
              </th>
              <th
                class="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Jumlah Penerima
              </th>
              <th
                class="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Jumlah Agihan (RM)
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(aid, index) in top5Aid"
              :key="aid.name"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    class="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-primary/10 text-primary font-semibold"
                  >
                    {{ index + 1 }}
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ aid.name }}
                    </div>
                  </div>
                </div>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500"
              >
                {{ aid.recipients.toLocaleString() }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-primary"
              >
                RM {{ aid.amount.toLocaleString() }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
