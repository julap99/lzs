<template>
  <div class="flex items-center justify-between px-5 mt-4">
    <div class="flex items-center gap-2">
      <span class="text-sm text-gray-700">Baris per halaman:</span>
      <select
        :value="pageSize"
        @change="$emit('update:pageSize', Number($event.target.value))"
        class="border border-gray-300 rounded-lg px-2 py-1 text-sm w-20"
      >
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
      </select>
    </div>
    <div class="flex items-center gap-2">
      <span class="text-sm text-gray-700">
        Menunjukkan {{ paginationStart }} hingga {{ paginationEnd }} daripada {{ total }} entri
      </span>
      <div class="flex gap-1">
        <rs-button
          variant="primary-outline"
          class="!p-1 !w-8 !h-8"
          :disabled="currentPage === 1"
          @click="$emit('update:currentPage', currentPage - 1)"
        >
          <Icon name="ic:round-keyboard-arrow-left" />
        </rs-button>
        <rs-button
          variant="primary-outline"
          class="!p-1 !w-8 !h-8"
          :disabled="currentPage === totalPages"
          @click="$emit('update:currentPage', currentPage + 1)"
        >
          <Icon name="ic:round-keyboard-arrow-right" />
        </rs-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  pageSize: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
})

defineEmits(['update:currentPage', 'update:pageSize'])

const totalPages = computed(() => {
  return Math.ceil(props.total / props.pageSize)
})

const paginationStart = computed(() => {
  return (props.currentPage - 1) * props.pageSize + 1
})

const paginationEnd = computed(() => {
  return Math.min(props.currentPage * props.pageSize, props.total)
})
</script>