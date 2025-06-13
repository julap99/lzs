<template>
  <div class="relative">
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
    </label>
    
    <!-- Select Input -->
    <div
      class="relative border rounded-md shadow-sm mt-2"
      :class="[
        isOpen ? 'ring-2 ring-primary-500 border-primary-500' : 'border-gray-300',
        disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white cursor-pointer'
      ]"
      @click="!disabled && toggleDropdown()"
    >
      <div class="flex items-center justify-between p-2">
        <span class="block truncate" :class="{ 'text-gray-500': !modelValue }">
          {{ selectedOption ? selectedOption.label : placeholder }}
        </span>
        <Icon
          name="heroicons:chevron-down"
          class="h-5 w-5 text-gray-400 transition-transform"
          :class="{ 'transform rotate-180': isOpen }"
        />
      </div>
    </div>

    <!-- Dropdown -->
    <div
      v-if="isOpen"
      class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
    >
      <!-- Search Input -->
      <div class="sticky top-0 p-2 bg-white border-b">
        <input
          type="text"
          v-model="searchQuery"
          class="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          :placeholder="searchPlaceholder"
          @click.stop
        />
      </div>

      <!-- Options List -->
      <div class="py-1">
        <div
          v-for="option in filteredOptions"
          :key="option.value"
          class="px-3 py-2 cursor-pointer hover:bg-gray-100"
          :class="{ 'bg-primary-50': isSelected(option) }"
          @click="selectOption(option)"
        >
          {{ option.label }}
        </div>
        <div
          v-if="filteredOptions.length === 0"
          class="px-3 py-2 text-sm text-gray-500 text-center"
        >
          Tiada hasil dijumpai
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, Object],
    default: ''
  },
  options: {
    type: Array,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '-- Pilih --'
  },
  searchPlaceholder: {
    type: String,
    default: 'Cari...'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const searchQuery = ref('')

// Find selected option
const selectedOption = computed(() => {
  return props.options.find(option => option.value === props.modelValue)
})

// Filter options based on search query
const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options
  
  const query = searchQuery.value.toLowerCase()
  return props.options.filter(option => 
    option.label.toLowerCase().includes(query)
  )
})

// Toggle dropdown
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (!isOpen.value) {
    searchQuery.value = ''
  }
}

// Select option
const selectOption = (option) => {
  emit('update:modelValue', option.value)
  isOpen.value = false
  searchQuery.value = ''
}

// Check if option is selected
const isSelected = (option) => {
  return option.value === props.modelValue
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  const select = event.target.closest('.relative')
  if (!select) {
    isOpen.value = false
  }
}

// Watch for changes in modelValue
watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    searchQuery.value = ''
  }
})

// Add and remove click outside listener
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.relative {
  position: relative;
}

.max-h-60 {
  max-height: 15rem;
}
</style> 