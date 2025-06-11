<script setup>
import { ref, inject, onMounted } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
});

const selectedTitle = inject("selectedTitle", ref(''));

// Ensure the tab is visible if it's active by default
onMounted(() => {
  if (props.active && selectedTitle.value === '') {
    selectedTitle.value = props.title;
  }
});
</script>

<template>
  <div class="tab-pane" v-show="selectedTitle === title">
    <slot></slot>
  </div>
</template>
