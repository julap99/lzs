<script setup>
definePageMeta({
  title: "Admin Dashboard",
  middleware: ["auth"],
  requiresAuth: true,
});

const breadcrumb = ref([
  {
    name: "Dashboard",
    type: "current",
    path: "/",
  },
]);

// Welcome Message
const currentTime = ref(new Date());
const greeting = computed(() => {
  const hour = currentTime.value.getHours();
  if (hour < 12) return "Selamat Pagi";
  if (hour < 18) return "Selamat Petang";
  return "Selamat Malam";
});

// Update time every minute
onMounted(() => {
  setInterval(() => {
    currentTime.value = new Date();
  }, 60000);
});

// Format date
const formattedDate = computed(() => {
  return currentTime.value.toLocaleDateString('ms-MY', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Pending Tasks Data
const pendingTasks = ref([
  {
    id: 1,
    title: "Review Zakat Applications",
    description: "15 new applications pending review",
    priority: "high",
    dueDate: "2024-03-20",
    category: "Applications",
    status: "pending",
  },
  {
    id: 2,
    title: "Monthly Report Submission",
    description: "Q1 2024 financial report due",
    priority: "medium",
    dueDate: "2024-03-25",
    category: "Reports",
    status: "pending",
  },
  {
    id: 3,
    title: "Staff Training Session",
    description: "New system training for team leads",
    priority: "low",
    dueDate: "2024-03-28",
    category: "Training",
    status: "pending",
  },
]);

// Key Metrics Data
const keyMetrics = ref([
  {
    title: "Total Applications",
    value: "1,234",
    icon: "ic:baseline-document-scanner",
    change: "positive",
    description: "+12.3% from last month",
  },
  {
    title: "Pending Reviews",
    value: "156",
    icon: "ic:baseline-pending-actions",
    change: "warning",
    description: "15 require immediate attention",
  },
  {
    title: "Completed Tasks",
    value: "892",
    icon: "ic:baseline-task-alt",
    change: "positive",
    description: "+8.7% from last month",
  },
  {
    title: "Team Performance",
    value: "94%",
    icon: "ic:baseline-trending-up",
    change: "positive",
    description: "Above target",
  },
]);

// Recent Activities
const recentActivities = ref([
  {
    id: 1,
    action: "New application submitted",
    user: "Ahmad bin Abdullah",
    time: "10 minutes ago",
    type: "application",
  },
  {
    id: 2,
    action: "Report approved",
    user: "Sarah binti Ismail",
    time: "1 hour ago",
    type: "approval",
  },
  {
    id: 3,
    action: "Training completed",
    user: "Team Alpha",
    time: "2 hours ago",
    type: "training",
  },
]);

// Chart Data for Task Distribution
const taskDistributionData = ref({
  series: [40, 25, 15, 12, 8],
  options: {
    chart: {
      type: 'donut',
      height: 350
    },
    labels: ['Applications', 'Reports', 'Training', 'Meetings', 'Other'],
    colors: ['#005aad', '#8dc73d', '#f18d20', '#e55345', '#7a7a7a'],
    legend: {
      position: 'bottom'
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Tasks',
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0)
              }
            }
          }
        }
      }
    }
  }
});

// Chart Options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
    },
  },
};
</script>

<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Welcome Section -->
    <div class="mb-6">
      <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">
              {{ greeting }}, Admin 123
            </h1>
            <p class="text-gray-600 mt-1">
              {{ formattedDate }}
            </p>
          </div>
          <div class="mt-4 md:mt-0">
            <div class="flex items-center gap-2 text-gray-600">
              <Icon name="ic:baseline-access-time" class="text-lg" />
              <span>{{ currentTime.toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' }) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
      <div
        v-for="(metric, index) in keyMetrics"
        :key="index"
        class="group"
      >
        <div class="relative bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md">
          <!-- Subtle Background Pattern -->
          <div
            class="absolute inset-0 opacity-[0.03]"
            :class="{
              'bg-success': metric.change === 'positive',
              'bg-warning': metric.change === 'warning',
              'bg-danger': metric.change === 'negative',
            }"
          >
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-current to-transparent"></div>
          </div>

          <div class="relative p-5">
            <!-- Header with Icon -->
            <div class="flex items-center justify-between mb-4">
              <div
                class="p-2.5 rounded-lg transition-all duration-300"
                :class="{
                  'bg-success/5 group-hover:bg-success/10': metric.change === 'positive',
                  'bg-warning/5 group-hover:bg-warning/10': metric.change === 'warning',
                  'bg-danger/5 group-hover:bg-danger/10': metric.change === 'negative',
                }"
              >
                <Icon
                  :name="metric.icon"
                  class="text-xl"
                  :class="{
                    'text-success': metric.change === 'positive',
                    'text-warning': metric.change === 'warning',
                    'text-danger': metric.change === 'negative',
                  }"
                />
              </div>
              <div
                class="text-xs font-medium px-2 py-1 rounded-full"
                :class="{
                  'bg-success/5 text-success': metric.change === 'positive',
                  'bg-warning/5 text-warning': metric.change === 'warning',
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
                    'text-warning': metric.change === 'warning',
                    'text-danger': metric.change === 'negative',
                  }"
                >
                  {{ metric.value }}
                </p>
                <div
                  class="flex items-center text-xs font-medium"
                  :class="{
                    'text-success': metric.change === 'positive',
                    'text-warning': metric.change === 'warning',
                    'text-danger': metric.change === 'negative',
                  }"
                >
                  <Icon
                    :name="metric.change === 'positive' ? 'ic:baseline-trending-up' : 'ic:baseline-trending-down'"
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
              'text-warning': metric.change === 'warning',
              'text-danger': metric.change === 'negative',
            }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Pending Tasks -->
      <div class="lg:col-span-2">
        <rs-card>
          <template #header>
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-bold text-primary">Pending Tasks</h2>
              <div class="flex gap-2">
                <button class="button texts-primary button-sm">View All</button>
                <button class="button outline-primary button-sm">
                  Add Task
                </button>
              </div>
            </div>
          </template>
          <template #body>
            <div class="space-y-4">
              <div
                v-for="task in pendingTasks"
                :key="task.id"
                class="p-4 rounded-lg border border-gray-200 hover:border-primary/50 transition-all duration-300"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="font-semibold text-gray-800">
                      {{ task.title }}
                    </h3>
                    <p class="text-sm text-gray-600 mt-1">
                      {{ task.description }}
                    </p>
                    <div class="flex items-center gap-4 mt-2">
                      <span
                        class="text-xs px-2 py-1 rounded-full"
                        :class="{
                          'bg-danger/10 text-danger': task.priority === 'high',
                          'bg-warning/10 text-warning':
                            task.priority === 'medium',
                          'bg-info/10 text-info': task.priority === 'low',
                        }"
                      >
                        {{ task.priority }}
                      </span>
                      <span class="text-xs text-gray-500">
                        Due: {{ task.dueDate }}
                      </span>
                      <span class="text-xs text-gray-500">
                        {{ task.category }}
                      </span>
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <button class="button texts-primary button-sm">View</button>
                    <button class="button outline-primary button-sm">
                      Complete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </rs-card>
      </div>

      <!-- Task Distribution & Recent Activities -->
      <div class="space-y-6">
        <!-- Task Distribution -->
        <rs-card>
          <template #header>
            <h2 class="text-lg font-semibold text-primary">
              Task Distribution
            </h2>
          </template>
          <template #body>
            <div class="h-64">
              <client-only>
                <VueApexCharts
                  type="donut"
                  :options="taskDistributionData.options"
                  :series="taskDistributionData.series"
                />
              </client-only>
            </div>
          </template>
        </rs-card>

        <!-- Recent Activities -->
        <rs-card>
          <template #header>
            <h2 class="text-lg font-semibold text-primary">
              Recent Activities
            </h2>
          </template>
          <template #body>
            <div class="space-y-4">
              <div
                v-for="activity in recentActivities"
                :key="activity.id"
                class="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-300"
              >
                <div
                  class="p-2 rounded-full"
                  :class="{
                    'bg-primary/10': activity.type === 'application',
                    'bg-success/10': activity.type === 'approval',
                    'bg-info/10': activity.type === 'training',
                  }"
                >
                  <Icon
                    :name="
                      {
                        application: 'ic:baseline-document-scanner',
                        approval: 'ic:baseline-check-circle',
                        training: 'ic:baseline-school',
                      }[activity.type]
                    "
                    class="text-lg"
                    :class="{
                      'text-primary': activity.type === 'application',
                      'text-success': activity.type === 'approval',
                      'text-info': activity.type === 'training',
                    }"
                  />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-800">
                    {{ activity.action }}
                  </p>
                  <p class="text-xs text-gray-500">{{ activity.user }}</p>
                  <p class="text-xs text-gray-400 mt-1">{{ activity.time }}</p>
                </div>
              </div>
            </div>
          </template>
        </rs-card>
      </div>
    </div>
  </div>
</template>
