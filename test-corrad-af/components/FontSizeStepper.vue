<script setup>
const props = defineProps({
  modelValue: {
    type: Number,
    default: 16
  },
  min: {
    type: Number,
    default: 12
  },
  max: {
    type: Number,
    default: 32
  },
  step: {
    type: Number,
    default: 1
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const increment = () => {
  if (props.modelValue < props.max && !props.disabled) {
    emit('update:modelValue', props.modelValue + props.step)
  }
}

const decrement = () => {
  if (props.modelValue > props.min && !props.disabled) {
    emit('update:modelValue', props.modelValue - props.step)
  }
}

const handleInput = (event) => {
  const value = parseInt(event.target.value) || props.min
  const clampedValue = Math.max(props.min, Math.min(props.max, value))
  emit('update:modelValue', clampedValue)
}
</script>

<template>
  <div class="flex items-center space-x-2">
    <button
      @click="decrement"
      :disabled="modelValue <= min || disabled"
      class="w-8 h-8 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      type="button"
    >
      <Icon name="ic:round-remove" class="w-4 h-4" />
    </button>
    
    <input
      :value="modelValue"
      @input="handleInput"
      :disabled="disabled"
      type="number"
      :min="min"
      :max="max"
      class="w-16 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded focus:border-primary dark:bg-gray-700 dark:text-white"
    />
    
    <button
      @click="increment"
      :disabled="modelValue >= max || disabled"
      class="w-8 h-8 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      type="button"
    >
      <Icon name="ic:round-add" class="w-4 h-4" />
    </button>
    
    <span class="text-sm text-gray-500">px</span>
  </div>
</template> 