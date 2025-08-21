<script setup>
// Simple header without complex functionality for now
</script>

<template>
  <div class="header-only-layout">
    <!-- Simple Header -->
    <div class="w-header fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div class="flex items-center justify-between px-4 py-3">
        <!-- Left side - Logo/Brand -->
        <div class="flex items-center">
          <nuxt-link to="/" class="flex items-center gap-3">
            <img 
              src="/assets/img/logo/logo-nobg.svg" 
              alt="LZS Logo" 
              class="h-8 w-auto"
            />
            <span class="text-lg font-semibold text-gray-900 hidden sm:block">Lembaga Zakat Selangor</span>
          </nuxt-link>
        </div>

        <!-- Right side - Simple Actions -->
        <div class="flex items-center gap-3">
          <!-- User Profile -->
          <div class="flex items-center gap-2">
            <img 
              src="/assets/img/user/default.svg" 
              alt="User" 
              class="w-8 h-8 rounded-full"
            />
            <span class="text-sm font-medium text-gray-700 hidden sm:block">Johan</span>
            <nuxt-link 
              to="/logout" 
              class="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm"
            >
              Logout
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="content-page-no-sidebar">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.header-only-layout {
  @apply min-h-screen bg-gray-50;
}

.w-header {
  height: 4rem;
}

.content-page-no-sidebar {
  @apply pt-20 px-4 md:px-6 lg:px-8;
}
</style>
