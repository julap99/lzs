<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  context: {
    type: Object,
    required: true,
  },
  minDate: {
    type: [String, Date],
    default: undefined,
  },
  maxDate: {
    type: [String, Date],
    default: undefined,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: 'dd/mm/yyyy',
  },
})

const internalValue = ref('')

onMounted(() => {
  internalValue.value = String(props.context._value || '')
})

watch(
  () => internalValue.value,
  (val) => {
    props.context.node.input(val)
  }
)
</script>

<template>
  <VDatePicker
    v-model="internalValue"
    :min-date="minDate"
    :max-date="maxDate"
    :disabled="disabled"
    :model-config="{ type: 'string', mask: 'DD/MM/YYYY' }"
    :masks="{ input: 'DD/MM/YYYY' }"
    color="blue"
  >
    <template #default="{ inputValue, inputEvents }">
      <input
        class="formkit-input date-input"
        :value="inputValue"
        v-on="inputEvents"
        :placeholder="placeholder"
      />
    </template>
  </VDatePicker>
</template>
