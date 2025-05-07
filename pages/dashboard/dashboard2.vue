<script setup>
definePageMeta({
  title: "Dashboard Zakat",
  middleware: ["auth"],
  requiresAuth: true,
  breadcrumb: [
    {
      name: "Dashboard",
      path: "/",
    },
    {
      name: "Dashboard Zakat",
      path: "/dashboard/dashboard2",
    },
  ],
});

// Data untuk metrik utama
const keyMetrics = ref([
  { 
    title: "Jumlah Kutipan Zakat", 
    value: "RM 156.7 Juta", 
    icon: "ic:baseline-payments",
    change: "positive",
    description: "+12.3% berbanding tahun lepas"
  },
  { 
    title: "Pembayar Zakat", 
    value: "368,452", 
    icon: "ic:baseline-people",
    change: "positive",
    description: "+8.7% berbanding suku tahunan"
  },
  { 
    title: "Agihan Zakat", 
    value: "RM 142.5 Juta", 
    icon: "ic:baseline-volunteer-activism",
    change: "positive",
    description: "+15.2% berbanding tahun lepas"
  },
  { 
    title: "Penerima Manfaat", 
    value: "214,865", 
    icon: "ic:baseline-groups",
    change: "neutral",
    description: "+2.1% berbanding bulan lepas"
  },
]);

// Data untuk kategori kutipan zakat
const zakatCollectionByType = ref([
  { category: "Pendapatan", percentage: 63 },
  { category: "Perniagaan", percentage: 15 },
  { category: "Simpanan", percentage: 12 },
  { category: "Emas/Perak", percentage: 5 },
  { category: "Lain-lain", percentage: 5 }
]);

// Data demografi pembayar zakat
const payerDemographics = ref([
  { age: "18-30", percentage: 22 },
  { age: "31-40", percentage: 35 },
  { age: "41-50", percentage: 25 },
  { age: "51-60", percentage: 12 },
  { age: "60+", percentage: 6 }
]);

// Data kutipan bulanan
const monthlyCollectionData = ref([
  {
    name: "Kutipan 2023",
    data: [11.2, 10.5, 12.8, 13.5, 11.9, 12.6, 14.2, 15.8, 16.3, 14.5, 12.9, 10.5]
  },
  {
    name: "Kutipan 2022",
    data: [9.8, 9.3, 11.2, 11.8, 10.5, 11.1, 12.4, 13.7, 14.1, 12.8, 11.4, 9.2]
  }
]);

// Data kategori asnaf (penerima)
const asnafCategories = ref([
  { category: "Fakir", recipients: 48250 },
  { category: "Miskin", recipients: 62340 },
  { category: "Amil", recipients: 12450 },
  { category: "Muallaf", recipients: 15680 },
  { category: "Gharimin", recipients: 22750 },
  { category: "Fisabilillah", recipients: 37890 },
  { category: "Ibnu Sabil", recipients: 8650 },
  { category: "Riqab", recipients: 6855 }
]);

// Data saluran kutipan
const collectionChannels = ref([
  { channel: "Online", percentage: 45 },
  { channel: "Potongan Gaji", percentage: 35 },
  { channel: "Kaunter Zakat", percentage: 12 },
  { channel: "App Mudah Alih", percentage: 5 },
  { channel: "Lain-lain", percentage: 3 }
]);

// Data program zakat
const zakatPrograms = ref([
  { program: "Bantuan Pendidikan", beneficiaries: 45680, amount: 38.5 },
  { program: "Bantuan Kesihatan", beneficiaries: 32450, amount: 24.2 },
  { program: "Bantuan Perumahan", beneficiaries: 12850, amount: 18.7 },
  { program: "Bantuan Kecemasan", beneficiaries: 28760, amount: 15.3 },
  { program: "Bantuan Perniagaan", beneficiaries: 8420, amount: 12.8 },
  { program: "Bantuan Makanan", beneficiaries: 56980, amount: 10.2 },
  { program: "Lain-lain Program", beneficiaries: 29725, amount: 22.8 }
]);

// Carta opsyen untuk demografi pembayar
const chartOptionsDemographics = computed(() => ({
  chart: { 
    type: "donut",
    height: 300
  },
  labels: payerDemographics.value.map(item => item.age),
  colors: ["#005aad", "#4185f2", "#f18d20", "#e55345", "#8dc73d"],
  plotOptions: {
    pie: {
      donut: {
        size: '65%'
      }
    }
  },
  legend: {
    position: "bottom"
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: { height: 250 },
      legend: { position: "bottom" }
    }
  }]
}));

// Carta opsyen untuk kategori zakat
const chartOptionsZakatType = computed(() => ({
  chart: { 
    type: "pie",
    height: 300
  },
  labels: zakatCollectionByType.value.map(item => item.category),
  colors: ["#005aad", "#8dc73d", "#f18d20", "#e55345", "#7a7a7a"],
  legend: {
    position: "bottom"
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: { height: 250 },
      legend: { position: "bottom" }
    }
  }]
}));

// Carta opsyen untuk kutipan bulanan
const chartOptionsMonthlyCollection = computed(() => ({
  chart: { 
    height: 350, 
    type: "area",
    toolbar: {
      show: true
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: { 
    curve: "smooth", 
    width: 2 
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.3,
    }
  },
  xaxis: {
    categories: ["Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul", "Ogs", "Sep", "Okt", "Nov", "Dis"]
  },
  yaxis: {
    title: {
      text: "Jumlah (Juta RM)"
    }
  },
  tooltip: {
    y: {
      formatter: function(val) {
        return "RM " + val + " Juta";
      }
    }
  }
}));

// Carta opsyen untuk kategori asnaf
const chartOptionsAsnafCategories = computed(() => ({
  chart: { 
    type: "bar", 
    height: 350 
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: "65%",
      borderRadius: 4
    }
  },
  colors: ["#005aad"],
  dataLabels: {
    enabled: true,
    formatter: function(val) {
      return val.toLocaleString();
    },
    style: {
      fontSize: '12px',
      fontWeight: 'normal'
    }
  },
  xaxis: {
    categories: asnafCategories.value.map(item => item.category)
  },
  grid: {
    borderColor: "#f1f1f1"
  }
}));

// Carta opsyen untuk saluran kutipan
const chartOptionsCollectionChannels = computed(() => ({
  chart: { 
    type: "bar", 
    height: 320 
  },
  plotOptions: {
    bar: {
      columnWidth: "60%",
      borderRadius: 4,
      distributed: true
    }
  },
  colors: ["#005aad", "#8dc73d", "#f18d20", "#e55345", "#7a7a7a"],
  dataLabels: {
    enabled: false
  },
  legend: {
    show: false
  },
  xaxis: {
    categories: collectionChannels.value.map(item => item.channel)
  },
  yaxis: {
    title: {
      text: "Peratusan (%)"
    }
  }
}));

onMounted(() => {
  // Logic on mount if needed
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />

    <!-- Metrik Utama -->
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
      <rs-card 
        v-for="(metric, index) in keyMetrics" 
        :key="index"
        class="transition-all duration-300 hover:shadow-lg border-t-4"
        :class="{ 
          'border-t-success': metric.change === 'positive', 
          'border-t-warning': metric.change === 'neutral', 
          'border-t-danger': metric.change === 'negative' 
        }"
      >
        <div class="pt-5 pb-3 px-5 flex items-center gap-4">
          <div
            class="p-5 flex justify-center items-center rounded-2xl transition-all duration-300"
            :class="{ 
              'bg-success/20 hover:bg-success/30': metric.change === 'positive', 
              'bg-warning/20 hover:bg-warning/30': metric.change === 'neutral', 
              'bg-danger/20 hover:bg-danger/30': metric.change === 'negative' 
            }"
          >
            <Icon 
              class="text-3xl" 
              :name="metric.icon"
              :class="{ 
                'text-success': metric.change === 'positive', 
                'text-warning': metric.change === 'neutral', 
                'text-danger': metric.change === 'negative' 
              }"
            ></Icon>
          </div>
          <div class="flex-1 truncate">
            <span 
              class="block font-bold text-2xl leading-tight"
              :class="{ 
                'text-success': metric.change === 'positive', 
                'text-warning': metric.change === 'neutral', 
                'text-danger': metric.change === 'negative' 
              }"
            >
              {{ metric.value }}
            </span>
            <span class="text-sm font-medium text-gray-600">
              {{ metric.title }}
            </span>
            <span class="text-xs block text-gray-500 mt-1">
              {{ metric.description }}
            </span>
          </div>
        </div>
      </rs-card>
    </div>

    <!-- Trend Kutipan Bulanan -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold text-primary">
            Trend Kutipan Zakat Bulanan
          </h2>
          <div class="flex gap-2">
            <button class="button texts-primary button-sm">Tapis</button>
            <button class="button outline-primary button-sm">Muat Turun</button>
          </div>
        </div>
      </template>
      <template #body>
        <client-only>
          <VueApexCharts
            width="100%"
            height="350"
            type="area"
            :options="chartOptionsMonthlyCollection"
            :series="monthlyCollectionData"
          ></VueApexCharts>
        </client-only>
      </template>
    </rs-card>

    <!-- Analisis Segmentasi -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <!-- Demografi Pembayar Zakat -->
      <rs-card>
        <template #header>
          <h2 class="text-lg font-semibold text-primary">
            Demografi Pembayar Zakat
          </h2>
        </template>
        <template #body>
          <client-only>
            <VueApexCharts
              width="100%"
              height="300"
              type="donut"
              :options="chartOptionsDemographics"
              :series="payerDemographics.map(item => item.percentage)"
            ></VueApexCharts>
          </client-only>
        </template>
      </rs-card>

      <!-- Kategori Kutipan Zakat -->
      <rs-card>
        <template #header>
          <h2 class="text-lg font-semibold text-primary">
            Kategori Kutipan Zakat
          </h2>
        </template>
        <template #body>
          <client-only>
            <VueApexCharts
              width="100%"
              height="300"
              type="pie"
              :options="chartOptionsZakatType"
              :series="zakatCollectionByType.map(item => item.percentage)"
            ></VueApexCharts>
          </client-only>
        </template>
      </rs-card>

      <!-- Saluran Kutipan -->
      <rs-card>
        <template #header>
          <h2 class="text-lg font-semibold text-primary">
            Saluran Kutipan Zakat
          </h2>
        </template>
        <template #body>
          <client-only>
            <VueApexCharts
              width="100%"
              height="300"
              type="bar"
              :options="chartOptionsCollectionChannels"
              :series="[{ data: collectionChannels.map(item => item.percentage) }]"
            ></VueApexCharts>
          </client-only>
        </template>
      </rs-card>
    </div>

    <!-- Kategori Asnaf -->
    <rs-card class="mb-6">
      <template #header>
        <h2 class="text-xl font-bold text-primary">
          Jumlah Penerima Mengikut Kategori Asnaf
        </h2>
      </template>
      <template #body>
        <client-only>
          <VueApexCharts
            width="100%"
            height="350"
            type="bar"
            :options="chartOptionsAsnafCategories"
            :series="[{ data: asnafCategories.map(item => item.recipients) }]"
          ></VueApexCharts>
        </client-only>
      </template>
    </rs-card>

    <!-- Program Zakat & KPI -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- Program Zakat -->
      <rs-card>
        <template #header>
          <h2 class="text-lg font-semibold text-primary">
            Program Zakat & Jumlah Agihan
          </h2>
        </template>
        <template #body>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Program
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Penerima
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jumlah (Juta RM)
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="program in zakatPrograms" :key="program.program" class="hover:bg-gray-50">
                  <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-700">
                    {{ program.program }}
                  </td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                    {{ program.beneficiaries.toLocaleString() }}
                  </td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-primary">
                    {{ program.amount.toLocaleString() }}
                  </td>
                </tr>
              </tbody>
              <tfoot class="bg-gray-50">
                <tr>
                  <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-700">
                    Jumlah
                  </td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm font-bold text-gray-700">
                    {{ zakatPrograms.reduce((sum, program) => sum + program.beneficiaries, 0).toLocaleString() }}
                  </td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm font-bold text-primary">
                    {{ zakatPrograms.reduce((sum, program) => sum + program.amount, 0).toLocaleString() }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </template>
      </rs-card>

      <!-- KPI & Petunjuk Prestasi -->
      <rs-card>
        <template #header>
          <h2 class="text-lg font-semibold text-primary">
            Petunjuk Prestasi Utama
          </h2>
        </template>
        <template #body>
          <div class="space-y-6 p-4">
            <!-- Nisbah Pengagihan -->
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium">Nisbah Pengagihan</span>
                <span class="text-sm font-bold">91%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div class="bg-success h-3 rounded-full" style="width: 91%"></div>
              </div>
              <div class="flex justify-between text-xs text-gray-500">
                <span>Sasaran: 85%</span>
                <span>Status: Cemerlang</span>
              </div>
            </div>

            <!-- Kos Pengurusan -->
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium">Kos Pengurusan</span>
                <span class="text-sm font-bold">7.8%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div class="bg-warning h-3 rounded-full" style="width: 40%"></div>
              </div>
              <div class="flex justify-between text-xs text-gray-500">
                <span>Sasaran: ≤10%</span>
                <span>Status: Baik</span>
              </div>
            </div>

            <!-- Masa Pemprosesan Permohonan -->
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium">Masa Pemprosesan</span>
                <span class="text-sm font-bold">14 Hari</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div class="bg-primary h-3 rounded-full" style="width: 75%"></div>
              </div>
              <div class="flex justify-between text-xs text-gray-500">
                <span>Sasaran: ≤21 Hari</span>
                <span>Status: Baik</span>
              </div>
            </div>

            <!-- Kepuasan Pelanggan -->
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium">Kepuasan Pelanggan</span>
                <span class="text-sm font-bold">92%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div class="bg-success h-3 rounded-full" style="width: 92%"></div>
              </div>
              <div class="flex justify-between text-xs text-gray-500">
                <span>Sasaran: 85%</span>
                <span>Status: Cemerlang</span>
              </div>
            </div>

            <!-- Liputan Geografi -->
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium">Liputan Geografi</span>
                <span class="text-sm font-bold">87%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div class="bg-info h-3 rounded-full" style="width: 87%"></div>
              </div>
              <div class="flex justify-between text-xs text-gray-500">
                <span>Sasaran: 80%</span>
                <span>Status: Cemerlang</span>
              </div>
            </div>
          </div>
        </template>
      </rs-card>
    </div>

    <!-- Status Tindakan & Peringatan -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold text-primary">
            Status Tindakan & Peringatan
          </h2>
          <div>
            <button class="button button-warning button-sm">Lihat Semua</button>
          </div>
        </div>
      </template>
      <template #body>
        <div class="space-y-3 p-2">
          <div class="flex items-center p-3 rounded-lg border-l-4 border-warning bg-warning/10">
            <div class="mr-3">
              <Icon name="ic:baseline-warning" class="text-2xl text-warning" />
            </div>
            <div class="flex-1">
              <h4 class="text-sm font-medium">Permohonan Menunggu Kelulusan</h4>
              <p class="text-xs text-gray-600">
                156 permohonan bantuan pendidikan menunggu kelulusan melebihi 7 hari.
              </p>
            </div>
            <div>
              <button class="button texts-warning button-sm">Tindakan</button>
            </div>
          </div>

          <div class="flex items-center p-3 rounded-lg border-l-4 border-danger bg-danger/10">
            <div class="mr-3">
              <Icon name="ic:baseline-error" class="text-2xl text-danger" />
            </div>
            <div class="flex-1">
              <h4 class="text-sm font-medium">Peruntukan Program Bantuan Kecemasan Hampir Habis</h4>
              <p class="text-xs text-gray-600">
                Baki peruntukan: RM 245,820 (8.2% daripada peruntukan asal)
              </p>
            </div>
            <div>
              <button class="button texts-danger button-sm">Semak</button>
            </div>
          </div>

          <div class="flex items-center p-3 rounded-lg border-l-4 border-info bg-info/10">
            <div class="mr-3">
              <Icon name="ic:baseline-info" class="text-2xl text-info" />
            </div>
            <div class="flex-1">
              <h4 class="text-sm font-medium">Laporan Bulanan</h4>
              <p class="text-xs text-gray-600">
                Laporan bulanan Mac 2023 sedia untuk semakan dan pengesahan.
              </p>
            </div>
            <div>
              <button class="button texts-info button-sm">Lihat</button>
            </div>
          </div>

          <div class="flex items-center p-3 rounded-lg border-l-4 border-success bg-success/10">
            <div class="mr-3">
              <Icon name="ic:baseline-check-circle" class="text-2xl text-success" />
            </div>
            <div class="flex-1">
              <h4 class="text-sm font-medium">Program Bantuan Perniagaan Mencapai Sasaran</h4>
              <p class="text-xs text-gray-600">
                100% sasaran penerima bantuan perniagaan telah dipenuhi.
              </p>
            </div>
            <div>
              <button class="button texts-success button-sm">Laporan</button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template> 