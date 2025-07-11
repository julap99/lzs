<!-- <script setup>
import RSLayout from "@/components/layouts/index";
</script>

<template>
  <div>
    <RSLayout>
      <slot />
    </RSLayout>
  </div>
</template> -->
<script setup>
import RSLayout from "@/components/layouts/index";
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <RSLayout>
    <NuxtPage :key="route.fullPath" />
  </RSLayout>
</template>
