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

// Framework information
const frameworkInfo = ref({
  name: "corradAF",
  version: "1.0.0",
  description: "Corrad Application Framework - A comprehensive Nuxt.js template for rapid application development",
  features: [
    "Authentication System",
    "User Management",
    "Role-based Access Control", 
    "Development Tools Suite",
    "API Management",
    "Menu Configuration",
    "Content Management",
    "Code Playground",
    "ORM Integration",
    "Responsive Design"
  ]
});

// Development tools available
const devTools = ref([
  {
    title: "User Management",
    description: "Manage users and roles with comprehensive CRUD operations",
    icon: "mdi:account-group",
    path: "/devtool/user-management/user",
    color: "blue"
  },
  {
    title: "Menu Editor",
    description: "Configure navigation menus and application structure",
    icon: "mdi:menu",
    path: "/devtool/menu-editor",
    color: "green"
  },
  {
    title: "API Editor",
    description: "Design and test API endpoints with interactive tools",
    icon: "mdi:api",
    path: "/devtool/api-editor",
    color: "purple"
  },
  {
    title: "Content Editor",
    description: "Manage dynamic content and templates",
    icon: "mdi:file-document-edit",
    path: "/devtool/content-editor",
    color: "orange"
  },
  {
    title: "Code Playground",
    description: "Test and prototype code snippets in real-time",
    icon: "mdi:code-braces",
    path: "/devtool/code-playground",
    color: "indigo"
  },
  {
    title: "ORM Tools",
    description: "Database schema management and query tools",
    icon: "mdi:database",
    path: "/devtool/orm",
    color: "red"
  },
  {
    title: "Configuration",
    description: "System settings and environment configuration",
    icon: "mdi:cog",
    path: "/devtool/config",
    color: "gray"
  }
]);

// Quick stats
const quickStats = ref([
  { title: "Dev Tools", value: "7", icon: "mdi:tools" },
  { title: "Components", value: "50+", icon: "mdi:view-grid" },
  { title: "Auth System", value: "Ready", icon: "mdi:shield-check" },
  { title: "Framework", value: "Nuxt 3", icon: "mdi:nuxt" }
]);

// Getting started steps
const gettingStarted = ref([
  {
    step: 1,
    title: "Clone Repository",
    description: "Clone this template to start your new project",
    command: "git clone <repository-url> your-project-name"
  },
  {
    step: 2,
    title: "Install Dependencies",
    description: "Install all required packages",
    command: "yarn install"
  },
  {
    step: 3,
    title: "Configure Environment",
    description: "Set up your environment variables and database",
    command: "cp .env.example .env"
  },
  {
    step: 4,
    title: "Start Development",
    description: "Run the development server",
    command: "yarn dev"
  }
]);

function navigateToTool(path) {
  navigateTo(path);
}

function getColorClasses(color) {
  const colorMap = {
    blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
    green: 'bg-green-100 text-green-600 hover:bg-green-200',
    purple: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
    orange: 'bg-orange-100 text-orange-600 hover:bg-orange-200',
    indigo: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200',
    red: 'bg-red-100 text-red-600 hover:bg-red-200',
    gray: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
  };
  return colorMap[color] || 'bg-gray-100 text-gray-600 hover:bg-gray-200';
}
</script>

<template>
  <div class="space-y-8">
    <LayoutsBreadcrumb />
    
    <!-- Welcome Header -->
    <div class="text-center py-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl">
      <div class="max-w-4xl mx-auto px-6">
        <h1 class="text-4xl md:text-6xl font-bold text-primary mb-4">
          Welcome to {{ frameworkInfo.name }}
        </h1>
        <p class="text-xl text-gray-600 mb-6">
          {{ frameworkInfo.description }}
        </p>
        <div class="flex justify-center gap-4">
          <rs-badge variant="primary" class="text-sm px-4 py-2">
            v{{ frameworkInfo.version }}
          </rs-badge>
          <rs-badge variant="secondary" class="text-sm px-4 py-2">
            Nuxt 3 Ready
          </rs-badge>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <rs-card
        v-for="(stat, index) in quickStats"
        :key="index"
        class="transition-all duration-300 hover:shadow-lg"
      >
        <div class="p-6 flex items-center gap-4">
          <div class="p-4 bg-primary/20 rounded-2xl">
            <Icon :name="stat.icon" size="24" class="text-primary" />
          </div>
          <div>
            <span class="block text-2xl font-bold text-primary">{{ stat.value }}</span>
            <span class="text-sm text-gray-600">{{ stat.title }}</span>
          </div>
        </div>
      </rs-card>
    </div>

    <!-- Development Tools -->
    <div>
      <h2 class="text-2xl font-bold text-primary mb-6">Development Tools</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <rs-card
          v-for="(tool, index) in devTools"
          :key="index"
          class="transition-all duration-300 hover:shadow-lg cursor-pointer group"
          @click="navigateToTool(tool.path)"
        >
          <div class="p-6">
            <div class="flex items-start gap-4 mb-4">
              <div 
                :class="getColorClasses(tool.color)"
                class="p-3 rounded-xl transition-all duration-300"
              >
                <Icon :name="tool.icon" size="24" />
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-lg text-gray-800 group-hover:text-primary transition-colors">
                  {{ tool.title }}
                </h3>
              </div>
            </div>
            <p class="text-gray-600 text-sm leading-relaxed">
              {{ tool.description }}
            </p>
            <div class="mt-4 flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
              <span>Open Tool</span>
              <Icon name="mdi:arrow-right" size="16" class="ml-1 group-hover:ml-2 transition-all" />
            </div>
          </div>
      </rs-card>
      </div>
    </div>

    <!-- Framework Features -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Features List -->
      <rs-card>
        <div class="p-6">
          <h3 class="text-xl font-bold text-primary mb-4 flex items-center gap-2">
            <Icon name="mdi:star" size="20" />
            Framework Features
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              v-for="(feature, index) in frameworkInfo.features"
              :key="index"
              class="flex items-center gap-2 text-sm"
            >
              <Icon name="mdi:check-circle" size="16" class="text-green-500" />
              <span>{{ feature }}</span>
            </div>
          </div>
        </div>
      </rs-card>

      <!-- Getting Started -->
      <rs-card>
        <div class="p-6">
          <h3 class="text-xl font-bold text-primary mb-4 flex items-center gap-2">
            <Icon name="mdi:rocket-launch" size="20" />
            Getting Started
          </h3>
          <div class="space-y-4">
            <div
              v-for="(step, index) in gettingStarted"
              :key="index"
              class="border-l-2 border-primary/20 pl-4"
            >
              <div class="flex items-center gap-2 mb-1">
                <span class="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {{ step.step }}
                </span>
                <h4 class="font-semibold text-gray-800">{{ step.title }}</h4>
              </div>
              <p class="text-sm text-gray-600 mb-2">{{ step.description }}</p>
              <code class="text-xs bg-gray-100 px-2 py-1 rounded block font-mono">
                {{ step.command }}
              </code>
            </div>
          </div>
        </div>
      </rs-card>
    </div>

    <!-- Documentation Links -->
    <rs-card>
      <div class="p-6">
        <h3 class="text-xl font-bold text-primary mb-4 flex items-center gap-2">
          <Icon name="mdi:book-open" size="20" />
          Documentation & Resources
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a 
            href="https://nuxt.com/docs" 
            target="_blank"
            class="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Icon name="mdi:nuxt" size="24" class="text-green-500" />
            <div>
              <div class="font-semibold">Nuxt 3 Docs</div>
              <div class="text-sm text-gray-600">Official documentation</div>
            </div>
          </a>
          <a 
            href="https://tailwindcss.com/docs" 
            target="_blank"
            class="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Icon name="mdi:tailwind" size="24" class="text-blue-500" />
            <div>
              <div class="font-semibold">Tailwind CSS</div>
              <div class="text-sm text-gray-600">Utility-first CSS</div>
            </div>
          </a>
          <a 
            href="https://github.com" 
            target="_blank"
            class="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Icon name="mdi:github" size="24" class="text-gray-700" />
            <div>
              <div class="font-semibold">Source Code</div>
              <div class="text-sm text-gray-600">View on GitHub</div>
            </div>
          </a>
        </div>
      </div>
    </rs-card>
  </div>
</template>
